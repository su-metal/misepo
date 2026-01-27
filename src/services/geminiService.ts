import "server-only";
import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from "@google/genai";
import fs from 'fs';
import path from 'path';
import {
  GenerationConfig,
  Platform,
  StoreProfile,
  GoogleMapPurpose,
  RiskTier,
  Length,
  Tone,
} from "../types";
import crypto from 'crypto';

// Define the schema for structured output (Array of strings)
// Define the schema for structured output (Object with analysis and posts)
const contentSchema = {
  type: Type.OBJECT,
  properties: {
    analysis: { type: Type.STRING },
    posts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ["analysis", "posts"],
};

const getModelName = (isPro: boolean) => {
  return "models/gemini-2.5-flash";
};

const TONE_RULES = {
  [Tone.Formal]: "きっちりとした「です・ます」調。信頼感のある丁寧で誠実な口調。専門性を感じさせつつも、他者への敬意を込めた表現を用いる。",
  [Tone.Standard]: "標準的な「です・ます」調。適度に丁寧で、誰にでも伝わりやすくバランスの取れた口調。",
  [Tone.Friendly]: "「です・ます」調をベースにしつつ、親しみやすさを重視。感嘆符（！）や明るい言葉選びを積極的に行い、活気のある口筋にする。",
  [Tone.Casual]: "非常にフランクな口調。絵文字や流行の表現、あるいは「だ・である」を交えたSNSらしい親近感のある表現を用いる。"
};

const INDUSTRY_PROMPTS: Record<string, string> = {
  '飲食店': '役割：飲食店のオーナー。重視点：料理のシズル感（味、香り、温度）、季節の食材へのこだわり、来店への感謝。温かみのある表現を心がける。',
  'カフェ': '役割：カフェのオーナー/スタッフ。重視点：癒やしの空間、コーヒーやスイーツの香り、ゆったりとした時間の流れ。おしゃれで落ち着いたトーン。',
  '居酒屋': '役割：居酒屋の大将/スタッフ。重視点：活気ある雰囲気、お酒と料理の相性、宴会の楽しさ。元気で親しみやすいトーン。',
  '美容室': '役割：美容師/スタイリスト。重視点：お客様の変身（Before/After）、髪の悩みへの共感、トレンド感、リラックス。専門性を出しつつ親身な姿勢。',
  'ネイル・まつげ': '役割：ネイリスト/アイリスト。重視点：細部の美しさ、デザインの可愛さ、施術中の会話、モチベーションアップ。キラキラした表現やトレンド用語。',
  'エステ・サロン': '役割：エステティシャン/セラピスト。重視点：心身の癒やし、自分へのご褒美、美への追求。包容力のある優しいトーン。',
  '旅館・ホテル': '役割：宿泊施設の支配人/女将。重視点：非日常的な体験、旅の思い出、季節の移ろい、心温まるおもてなし。格式と親しみのバランス。',
  '整体・接骨院': '役割：整体師/柔道整復師。重視点：健康へのアドバイス、痛みの改善、身体のメンテナンス。信頼感と安心感を与える落ち着いたトーン。',
  'ジム': '役割：トレーナー/インストラクター。重視点：フィットネスの楽しさ、目標達成の喜び、健康的なライフスタイル。ポジティブでモチベーションを上げる表現。',
  '小売': '役割：ショップスタッフ。重視点：商品の魅力（使い方、メリット）、入荷のワクワク感、ギフト提案。購買意欲をそそる具体的な描写。',
  'その他': '役割：店舗/サービスのオーナー。重視点：お客様との繋がり、サービスの独自性、誠実な対応。'
};

const KEYWORDS = {
  legal: /(訴える|弁護士|消費者センター|警察|労基|監督署|違法|法的)/,
  safetyHygiene: /(食中毒|異物|虫|カビ|腹痛|下痢|吐き気|アレルギー|火傷|怪我|危険|衛生|不衛生|汚い)/,
  strongComplaint: /(詐欺|ぼったくり|最悪|二度と行かない|金返せ|返金|許せない|拡散|通報|口コミ消せ)/,
  abuse: /(バカ|馬鹿|クソ|死ね|潰れろ|ゴミ|カス)/,
  commonNeg: /(態度(が|も)?悪|不快|失礼|待たされた|高い|冷めて|まずい|美味しくない|遅い)/,
};

interface RiskAnalysisResult {
  score: number;
  tier: RiskTier;
  signals: string[];
}

const scoreRisk = (starRating: number, text: string): RiskAnalysisResult => {
  let score = 0;
  const signals: string[] = [];

  switch (starRating) {
    case 1: score += 40; break;
    case 2: score += 20; break;
    case 3: score += 10; break;
  }

  if (KEYWORDS.legal.test(text)) { score += 50; signals.push("法的リスク/公的機関への言及"); }
  if (KEYWORDS.safetyHygiene.test(text)) { score += 40; signals.push("衛生・安全に関する指摘"); }
  if (KEYWORDS.strongComplaint.test(text)) { score += 30; signals.push("強い苦情・返金要求"); }
  if (KEYWORDS.abuse.test(text)) { score += 20; signals.push("攻撃的・暴言"); }
  if (KEYWORDS.commonNeg.test(text)) { score += 10; signals.push("一般的な不満"); }

  let tier: RiskTier = "low";
  if (score >= 80) tier = "critical";
  else if (score >= 50) tier = "high";
  else if (score >= 30) tier = "medium";

  return { score, tier, signals };
};

function getServerAI() {
  const apiKey = process.env.GEMINI_API_KEY; // ← サーバ専用。NEXT_PUBLICは使わない
  if (!apiKey) throw new Error("Missing API_KEY in server env (.env.local)");
  return new GoogleGenAI({ apiKey, apiVersion: 'v1beta' });
}

export interface GeneratedContentResult {
  analysis: string;
  posts: string[];
}

export const generateContent = async (
  profile: StoreProfile,
  config: GenerationConfig,
  isPro: boolean,
  learningSamples?: string[] 
): Promise<GeneratedContentResult> => {
  const modelName = getModelName(isPro);
  const charLimit = 140;
  const isXWith140Limit = config.platform === Platform.X && config.xConstraint140;
  
  // No longer using legacy config.post_samples (reset to ensure consistency with UI list)
  const hasLearningSamples = learningSamples && learningSamples.length > 0;
  // If we have persona_yaml, the primary persona is active even without raw samples
  const hasPersona = !!(config.customPrompt && config.customPrompt.trim()) || hasLearningSamples || !!config.persona_yaml;
  console.debug("[LEARNING] hasPersona:", hasPersona, "hasLearningSamples:", !!hasLearningSamples, "hasYaml:", !!config.persona_yaml);

  const buildSystemInstruction = () => {
    const isInstagram = config.platform === Platform.Instagram;
    const isX = config.platform === Platform.X;
    const isGMap = config.platform === Platform.GoogleMaps;
    const isLine = config.platform === Platform.Line;

    const isInstructionHeavy = !!(config.customPrompt && config.customPrompt.trim());
    const shouldBoost = (hasPersona || isInstructionHeavy) && !isX;
    
    // Define targets: [Base Target], [Boosted (+30%)]
    const targets = {
      short: shouldBoost ? { target: '260-300', min: 250, max: 350 } : (isX ? { target: '150-200', min: 140, max: 200 } : { target: '200-250', min: 180, max: 300 }),
      medium: shouldBoost ? { target: '400-500', min: 380, max: 600 } : (isX ? { target: '250-300', min: 200, max: 350 } : { target: '300-400', min: 280, max: 450 }),
      long: shouldBoost ? { target: '650-850', min: 600, max: 1100 } : (isX ? { target: '500-600', min: 450, max: 700 } : { target: '500-650', min: 450, max: 750 })
    };
    const t = targets[config.length as keyof typeof targets] || targets.medium;

    // Platform-Specific Persona Logic: Parse the JSON container if present
    let activePersonaYaml = "";
    if (config.persona_yaml) {
        try {
        // Try parsing as JSON (New Format)
        const personaMap = JSON.parse(config.persona_yaml);
        if (typeof personaMap === 'object' && personaMap !== null) {
            // Pick specific platform OR General OR fallback to first available
            activePersonaYaml = personaMap[config.platform] || personaMap['General'] || Object.values(personaMap)[0] || "";
            console.log(`[LEARNING] Selected YAML for platform: ${config.platform}`);
        } else {
            // Fallback for unexpected JSON structure
            activePersonaYaml = config.persona_yaml;
        }
        } catch (e) {
        // Legacy Format (Plain String)
        activePersonaYaml = config.persona_yaml;
        console.log("[LEARNING] Using legacy monolithic YAML (String format)");
        }
    }
    
    // Many-shot learning samples formatting
    // Many-shot learning samples formatting
    // Limit to latest 5 or 3000 chars to avoid token explosion
    // Aggressive filtering for learning samples to prevent prompt injection loops
    const validSamples = learningSamples
        ? learningSamples.filter(s => {
            const content = s.trim();
            if (!content) return false;
            if (content.includes('【文体指示書】') || content.includes('System Instruction')) return false;
            if (content.includes('"analysis":') && content.includes('"posts":')) return false;
            if (content.length < 5) return false;
            return true;
        })
        : [];

    // Emoji detection logic
    // If samples exist but contain NO emojis, force disable emojis
    if (validSamples.length > 0) {
        const emojiRegex = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/u;
        const hasEmoji = validSamples.some(s => emojiRegex.test(s));
        if (!hasEmoji && config.includeEmojis) {
            console.log("[LEARNING] No emojis found in samples. Force disabling emojis.");
            config.includeEmojis = false;
        }
    }

    const formattedLearningSamples = validSamples
        .slice(0, 5) // Hard cap at 5 recent posts per generation
        .map((s, i) => `<sample id="${i + 1}">\n${s.length > 500 ? s.slice(0, 500) + '...' : s}\n</sample>`)
        .join("\n");


    if (hasPersona) {
        const languageRule = config.language && config.language !== 'Japanese'
            ? `\n<language_rule>\nGenerate the content in **${config.language}**. Even if the language is different, reproduce the store owner's character (friendliness, passion, expertise, etc.) from the samples within the context of ${config.language}.\n</language_rule>`
            : `\n<language_rule>\nPrimary Language: Japanese. \n*Exception*: If <learning_samples> contain phrases in other languages (e.g., English greetings), you MUST include them to maintain the persona's flavor.\n</language_rule>`;

        const industryRole = INDUSTRY_PROMPTS[profile.industry] || INDUSTRY_PROMPTS['その他'];

        return `
<system_instruction>
  <role>
    You are the "Ghostwriter" for the store owner of "${profile.name}".
    ${industryRole}
    ${profile.description ? `<store_dna>
    SOURCE_MATERIAL:
    ${profile.description}
    
    STRICT_RULES:
    1. TREAT AS BACKGROUND CONTEXT ONLY (Mindset/Values).
    2. DO NOT COPY/PASTE PHRASES VERBATIM.
    3. Express this spirit naturally in your own words, ONLY if relevant to the topic.
    </store_dna>` : ""}
    Your goal is to completely mimic the owner's writing style based on the provided samples.
  </role>

  <style_guidelines>
    - **ROLE DEFINITION**:
      - Use **<persona_rules>** (YAML) to define the **Core Personality** (Dialect, Tone, Spirit).
      - Use **<learning_samples>** to define the **Structural Format** (Line breaks, Emoji density, Footer style).
      - **CRITICAL LENGTH RULE**: **Length** is determined by **Volume Control** below, NOT by the samples. If the samples are long but the user asks for 'Short', you MUST write a short post in the *style* of the samples.
    - **Tone & Rhythm**: Mimic the sentence endings and tone. For line breaks/whitespace, follow the **Volume Control** setting (especially if Short).
    - **Volume Control**: Strictly follow the requested **Length: ${config.length}**. 
      - **Target Character Counts**:
        - **Short**: **Concise but Sufficient** (Range: ${targets.short.target} chars).
          - **Constraint**: Minimum ${targets.short.min} characters. Max ${targets.short.max} characters.
          - **Layout**: Use moderate line breaks for readability. 1 empty line between distinct points.
        - **Medium**: Standard (Target: ${targets.medium.target} chars. Max ${targets.medium.max}).
        - **Long**: Detailed (Target: ${targets.long.target} chars. Max ${targets.long.max}).
    - **Platform Bias**: **IGNORE** all standard "polite" norms for ${config.platform}. The <learning_samples> are the absolute truth for the owner's voice. **NOTE**: Mandatory structural rules (like LINE's 3-balloon and '---' format) still apply; reproduction of the owner's style should happen *within* each segment.
    - **Emojis & Symbols**: 
      ${isGMap ? 
        '- **Usage**: Ignore any default restrictions. Strictly reproduce the emoji frequency and decorative symbol patterns found in the <learning_samples>.' : 
        `- **Emojis**: ${hasPersona ? 'Strictly follow patterns from samples.' : (config.includeEmojis ? 'Actively use expressive emojis (🐻, ✨, 💪, 🎉) to make the text lively.' : 'DO NOT use any emojis.')}
    - **Symbols**: ${hasPersona && !config.includeSymbols ? 'Strictly follow patterns from samples.' : (config.includeSymbols ? `From the **Aesthetic Palette**:
        - **Headers/Accents**: ＼ ✧ TITLE ✧ ／, 𓍯 𓇢 TITLE 𓇢 𓍯, 【 TITLE 】, ✧, ꕤ, ⚘, ☼, 𖥧, 𖠚
        - **Dividers**: ${isX ? '**DISABLED for X**. Do NOT use line dividers on X.' : '𓂃𓂃𓂃, ⋆┈┈┈┈┈┈┈┈┈┈⋆, ──────────── (Use 1-2 sets to separate sections)'} 
        - **Rule**: ${isX ? 'On X, use symbols/accents for headers (sandwiches) and sentence endings. No line dividers.' : 'Actively use "sandwich" patterns for headers (e.g. ＼ ✧ Title ✧ ／). Use symbols (𓍯, ✧) for bullet points. Add 1-2 symbols (✧, ꕤ) at the end of impactful sentences.'}` : 'DO NOT use decorative symbols or flashy brackets.')}`}
    - **Line Breaks**: **NEVER** insert line breaks in the middle of a grammatical phrase or word (e.g., don't split "ご来店いただき" across lines). Maintain natural reading flow. Avoid "auto-formatting for mobile" unless the <learning_samples> explicitly use that specific rhythm.
    - **Platform Rules**:
      - Platform: ${config.platform}
      ${isLine ? `- Style: **Friendly but Professional "LINE" Marketing**.
        - **Layout**: Generate content as a single cohesive message with a logical flow: 1. Hook (immediate impact), 2. Details (value/offer), and 3. Action (CTA). Use natural line breaks to keep it clean.` : ''}
    - **Readability & Vertical Flow**: Avoid long, dense blocks of text. Use line breaks (newlines) frequently—ideally after every sentence, emoji, or when shifting topics. Ensure a rhythmic, vertical flow that is easy to scan on a vertical mobile screen.
      - Length: ${config.length}
      - Language: ${config.language || 'Japanese'}
  </style_guidelines>

  ${config.customPrompt ? `<custom_instructions>
  ${config.customPrompt}
  
  <style_reminder>
    IMPORTANT: You must strict adherence to the **Emojis** and **Special Characters** rules defined in <style_guidelines>.
    - Emojis: **${config.includeEmojis ? 'active ON' : 'OFF'}** (Priority: High)
    - Special Characters: **${config.includeSymbols ? 'active ON' : 'OFF'}**
    ${config.includeEmojis ? 'You MUST use emojis if they are enabled, even if the custom instructions are serious.' : ''}
  </style_reminder>
  </custom_instructions>` : ""}

  <constraints>
    - **No Fabrication**: Do NOT invent ingredients (e.g., "mochi", "matcha") or prices unless explicitly stated in the <user_input>.
    - **Expansion (Show, Don't Tell)**: You MAY expand on sensory details (smell, texture, atmosphere) implied by the input, but do not add new factual elements.
    - **Episode Separation**: Do NOT use specific episodes or proper nouns from the examples. Only steal the "Style".
  </constraints>

  ${languageRule}

  <process_step>
    1. **Analyze**: Read the <user_input> (Review). Identify the customer's sentiment, specific liked items, and any concerns/observations (e.g., price, payment).
    2. **Respond (Don't Echo)**: Do NOT simply repeat factual statements from the review (e.g., "The price is 240 yen"). Instead, **Acknowledge** them.
       - *Bad*: "The price is 240 yen. We are cash only." (Robotic)
       - *Good*: "We appreciate your feedback on the price. We aim for quality..." or "Thank you for noting our cash-only policy; we appreciate your understanding." (Empathetic)
    3. **Expand**: Add sensory details or store background to make the reply warm.
    4. **Draft**: Write the reply using the <learning_samples> style.
  </process_step>
</system_instruction>

<context_data>
  ${(hasLearningSamples) ? (() => { 
    if (activePersonaYaml) {
        // Hybrid Mode: Inject top 3 samples for better stability (Layout/Rhythm)
        // Limits: Max 3 items, Max 500 chars each. Total ~1500 chars (~500-800 tokens).
        console.log("[LEARNING] Hybrid Mode: Injecting 3 samples for stability");
        const visualSamples = learningSamples
            .slice(0, 3)
            .map((s, i) => `<sample id="${i+1}">\n${s.length > 500 ? s.slice(0, 500) + '...' : s}\n</sample>`)
            .join("\n");
        return `<learning_samples>\n<!-- Visual Reference for Layout/Structure -->\n${visualSamples}\n</learning_samples>`;
    } else {
        // Fallback Mode: Full samples (max 5)
        console.log("[LEARNING] Injected raw learning samples (No YAML available)");
        return `<learning_samples>\n${formattedLearningSamples}\n</learning_samples>`;
    }
  })() : ""}
</context_data>

  <user_input>
    "${config.inputText}"
  </user_input>

  ${config.storeSupplement ? `<store_context>\n${config.storeSupplement}\n</store_context>` : ""}

  <task>
    ${(() => {
        const lengthStr = t.target;
        const minVal = t.min;
        const lengthWarning = `**CRITICAL**: The body text MUST be **${lengthStr} chars**. DO NOT be too short ${shouldBoost ? 'even if the samples are concise' : ''}. Minimum length: ${minVal} characters.`;

        if (isGMap) return `The <user_input> is a customer review. Generate a polite and empathetic REPLY from the owner. ${lengthWarning} Use the facts in <store_context> if provided.`;
        
        if (config.platform === Platform.Line) return `Generate a LINE message with a clear flow: 1. Hook, 2. Details, 3. Action. ${lengthWarning} Use friendly but professional tone. DO NOT use '---' or numbering. **VISUAL**: Use emoji-sandwiched headers. **LAYOUT**: Prioritize a clean vertical flow with frequent line breaks.`;

        return `Generate an attractive post based on the <user_input>. ${lengthWarning}`;
    })()}
    Output a JSON object with:
    - "analysis": Brief context analysis.
    - "posts": An array of generated post strings. 
    **CRITICAL RULES FOR "posts" ARRAY:**
    1. **ONE MESSAGE = ONE STRING**. Do not split a single post (e.g. Title + Body + Footer) into multiple strings.
    2. Even if the post has line breaks or multiple paragraphs, it must be contained within a SINGLE string element.
    3. If multiple variations are requested, return [ "Variation 1 full text", "Variation 2 full text" ].
    4. **NEVER** return [ "Title", "Body", "Footer" ]. This is wrong.
    5. **NEVER** split the post based on empty lines.
  </task>

  ${activePersonaYaml ? `
  <persona_rules>
    The following rules represent the owner's "Style DNA" specifically for ${config.platform}.
    Strictly follow the **core_voice** defined here:
    ${activePersonaYaml}
  </persona_rules>
  ` : ""}
`;
    }

    // Standard Omakase Mode (XML-ified for consistency)
    const languageRule = config.language && config.language !== 'Japanese' 
      ? `\n<language_rule>\nGenerate the content in **${config.language}**.\n</language_rule>`
      : "";

    return `
<system_instruction>
  <role>
    ${isGMap ? `You are the owner of "${profile.name}". Reply politely to customer reviews on Google Maps.` : `You are the SNS manager for "${profile.name}". Create an attractive post for ${config.platform}.`}
  </role>

  <rules>
    - Language: ${config.language || 'Japanese'}
    - Length: ${config.length} (Target: ${t.target} chars. Min: ${t.min} chars)
    - Tone: ${config.tone} (${TONE_RULES[config.tone] || TONE_RULES[Tone.Standard]})
    - Features: ${isInstagram ? 'Visual focus.' : ''}${isX ? 'Under 140 chars.' : ''}${isGMap ? 'Polite reply, NO emojis, NO hashtags.' : ''}${isLine ? 'Direct marketing style. NO hashtags. Focus on clear messaging.' : ''}
    - Emojis: ${isGMap ? 'Do NOT use emojis at all.' : (config.includeEmojis ? "Actively use expressive emojis (🐻, ✨, 💪, 🎉) to make the text lively." : "DO NOT use any emojis (emoticons, icons, pictograms) under any circumstances. Keep it plain text only regarding emojis.")}
    - Special Characters: ${config.includeSymbols ? `From the **Aesthetic Palette**:
        - **Headers/Accents**: ＼ ✧ TITLE ✧ ／, 𓍯 𓇢 TITLE 𓇢 𓍯, 【 TITLE 】, ✧, ꕤ, ⚘, ☼, 𖥧, 𖠚
        - **Dividers**: ${isX ? '**DISABLED for X**. Do NOT use line dividers on X.' : '𓂃𓂃𓂃, ⋆┈┈┈┈┈┈┈┈┈┈⋆, ──────────── (Use to separate Body and CTA)'}
        - **Rule**: ${isX ? 'On X, use symbols/accents for headers (sandwiches), bullet points, and sentence endings. No line dividers.' : 'Actively use "sandwich" patterns (e.g. ＼ ✧ Title ✧ ／). Use symbols (𓍯, ✧) as bullet points for lists. Append symbols (✧, ꕤ) to the end of key sentences.'}
        - **Note**: Use these symbols frequently for visual appeal ${!config.includeEmojis ? 'INSTEAD of emojis' : 'in addition to emojis'}.` : "Do NOT use decorative symbols or flashy brackets. Use standard punctuation only."}
    - **Layout**: ${config.length === 'short' ? "Concise. Group related sentences." : "Natural Reading Flow. Group semantically related sentences into small blocks (2-3 lines). Insert empty lines ONLY between distinct topics or after a strong hook. Avoid robotic 'one sentence per line' formatting."}
  </rules>

  ${config.customPrompt ? `<custom_instructions>\n${config.customPrompt}\n</custom_instructions>` : ""}

  ${languageRule}

  <user_input>
    "${config.inputText}"
  </user_input>

  ${config.storeSupplement ? `<store_context>\n${config.storeSupplement}\n</store_context>` : ""}

  <task>
    ${(() => {
        const lengthStr = t.target;
        const minVal = t.min;
        const lengthWarning = `**CRITICAL**: The body text MUST be **${lengthStr} chars**. DO NOT be too short. Minimum length: ${minVal} characters.`;

        if (isGMap) return `The <user_input> is a customer review. Generate a polite and empathetic REPLY from the owner. ${lengthWarning} Use the facts in <store_context> if provided.`;
        
        if (isLine) return `Generate a LINE message with a clear flow: 1. Hook, 2. Details, 3. Action. ${lengthWarning} **VISUAL**: Use a header for the hook. **STRICT EMOJI RULE**: ${config.includeEmojis ? 'Use emojis naturally.' : 'DO NOT use any emojis.'} **LAYOUT**: Clean vertical flow.`;

        return `Generate an attractive post based on the <user_input>. ${lengthWarning}`;
    })()}
    Output a JSON object with:
    - "analysis": Brief context analysis.
    - "posts": An array of generated post strings. 
    **CRITICAL RULES FOR "posts" ARRAY:**
    1. **ONE MESSAGE = ONE STRING**. Do not split a single post (e.g. Title + Body + Footer) into multiple strings.
    2. Even if the post has line breaks or multiple paragraphs, it must be contained within a SINGLE string element.
    3. If multiple variations are requested, return [ "Variation 1 full text", "Variation 2 full text" ].
    4. **NEVER** return [ "Title", "Body", "Footer" ]. This is wrong.
    5. **NEVER** split the post based on empty lines.
  </task>
</system_instruction>
`;
  };

  const ai = getServerAI();
  const systemInstruction = buildSystemInstruction();
  
  // Calculate prompt size estimation (rough)
  const promptSize = {
    systemChars: systemInstruction.length,
    userChars: (config.inputText || "").length,
    promptTotalChars: systemInstruction.length + (config.inputText || "").length,
  };
  console.debug("[PROMPT] sizes:", promptSize);

  // In-memory cache store (resets on server restart)
  const cacheStore = new Map<string, { name: string; expiresAt: number }>();

  const attemptGeneration = async (userPrompt: string, attempt: number): Promise<GeneratedContentResult> => {
    let cachedContentName: string | undefined;
    
    // Check if we should try caching (Google Gen AI requires >32k tokens for caching)
    // We estimate roughly. If system instruction implies high usage, we verify with countTokens.
    const estimatedChars = systemInstruction.length + (learningSamples || []).join("").length;
    
    // Threshold: a bit below 32k usually to be safe, but chars != tokens. 
    // Japanese text can be 1 char ~ 1+ tokens. 
    // Let's explicitly check token count if it seems heavy (> 20,000 chars)
    // Context Caching temporarily disabled for v1beta stability

    const requestConfig: any = {
        responseMimeType: "application/json",
        responseSchema: contentSchema,
        temperature: hasPersona ? 0.3 : 0.6,
        topP: 0.9,
    };

    // If cache exists, we DON'T pass systemInstruction again (it's in the cache)
    if (cachedContentName) {
        requestConfig.cachedContent = cachedContentName;
    } else {
        requestConfig.systemInstruction = systemInstruction;
    }

    // Dynamic Thinking Budget: 256
    const budget = 256;
    console.debug(`[GEMINI] Attempt: ${attempt}, Platform: ${config.platform}, ThinkingBudget: ${budget}`);

    // @ts-ignore - Enable internal reasoning
    requestConfig.thinkingConfig = { includeThoughts: true, thinkingBudget: budget }; 

    // Safety Settings to prevent accidental blocking of creative marketing content
    requestConfig.safetySettings = [
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ];

    let response;
    try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          config: requestConfig,
        });
    } catch (e: any) {
        console.error("[GEMINI SDK ERROR]", e.message, e.stack);
        // Throw a clean error that is caught by route.ts
        throw new Error(`Gemini SDK Error: ${e.message} (Model: ${modelName})`);
    }

    const result = await response;
    const usage = result.usageMetadata;
    
    if (usage) {
        // Raw usage data requested by user
        console.log('[API_USAGE_RAW]', JSON.stringify(usage, null, 2));

        const pt = usage.promptTokenCount || 0;
        const ct = usage.candidatesTokenCount || 0;
        const total = usage.totalTokenCount || 0;
        const cached = (usage as any).cachedContentTokenCount || 0; // Check for cache

        // Gemini 2.5 Flash Official Pricing (per 1,000,000 tokens)
        const RATE_INPUT = 0.30;    // USD per 1M tokens
        const RATE_OUTPUT = 2.50;   // USD per 1M tokens
        const RATE_CACHED = 0.15;   // USD per 1M tokens
        const EX_RATE_JPY = 150;    // JPY/USD

        const thinking = (usage as any).thoughtsTokenCount || 0; 
        
        // Input: Total - Candidates - Thinking (if included in total)
        // Gemini API `totalTokenCount` = `promptTokenCount` + `candidatesTokenCount` (Thinking is usually separate or part of candidates depending on API version)
        // But in raw JSON: Total (1458) = Prompt (489) + Candidates (216) + Thinking (753).
        // Use promptTokenCount directly for safety.
        const standardInput = (usage.promptTokenCount || 0) - cached;
        
        // Output: Candidates + Thinking
        const outputTotal = (usage.candidatesTokenCount || 0) + thinking;

        const costUSD = (standardInput * RATE_INPUT / 1000000) + 
                        (cached * RATE_CACHED / 1000000) + 
                        (outputTotal * RATE_OUTPUT / 1000000);
        const costJPY = costUSD * EX_RATE_JPY;

        console.log(`[API_COST] Model: ${modelName} | In: ${standardInput} (Cached: ${cached}) | Out: ${outputTotal} | Est: ¥${costJPY.toFixed(4)}`);

    }

    let jsonText = "";
    try {
        // Validation check before accessing .text
        if (result.candidates && result.candidates[0] && result.candidates[0].content) {
            jsonText = result.text || "";
        } else {
            throw new Error("No candidates or content found in response");
        }
    } catch (e: any) {
        const errorDetail = {
            message: e.message,
            candidates: result.candidates,
            promptFeedback: result.promptFeedback,
            usage: usage
        };
        // Log to console for dev visibility
        console.error("[GEMINI CONTENT ERROR]", errorDetail);
        throw new Error(`AI response error: ${e.message} (Check server logs for raw details)`);
    }

    if (!jsonText) throw new Error("No response from AI");

    try {
        const parsed = JSON.parse(jsonText);
        // Validate schema roughly
        if (typeof parsed !== 'object' || !Array.isArray(parsed.posts)) {
            throw new Error("Invalid schema received");
        }
        return {
            analysis: parsed.analysis || "",
            posts: parsed.posts.map((s: any) => String(s).replace(/\n{3,}/g, '\n\n').trim())
        };
    } catch (e) {
        throw new Error("Failed to parse AI response");
    }
  };

  let userPrompt = `Generate the post in ${config.language || 'Japanese'}.`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = await attemptGeneration(userPrompt, attempt);

      if (!isXWith140Limit) {
        return result;
      }

      const firstPost = result.posts[0];
      const currentLength = firstPost.length;

      // Allow slight buffer
      if (currentLength <= charLimit) {
        console.debug(`X post validated: ${currentLength}/${charLimit} chars`);
        return result;
      }

      console.warn(
        `X post too long (${currentLength}/${charLimit}), retrying... (attempt ${attempt + 1}/3)`
      );

      // Recursive prompt for retry
      userPrompt = `The following post was ${currentLength} chars (Too Long):
"${firstPost}"

Refine the text to be strictly under ${charLimit} chars.
Current Length: ${currentLength}
Target: **Under ${charLimit} chars**

Action: 
1. Remove 1-2 adjectives or filler words.
2. Remove 1 hashtag if necessary.
3. Keep the core message and tone.`;

    } catch (parseError) {
      console.error("Generation attempt failed:", parseError);
      if (attempt === 2) {
        throw new Error("AI response was not valid after 3 attempts");
      }
    }
  }

  throw new Error(`Failed to generate X post under ${charLimit} chars after 3 attempts`);
};

export const refineContent = async (
  profile: StoreProfile,
  config: GenerationConfig,
  currentContent: string,
  instruction: string
): Promise<string> => {
  const modelName = getModelName(true);
  const ai = getServerAI();

  // Check if there's a persona active (custom prompt or samples)
  const hasPersona = !!(config.customPrompt || (config.post_samples && Object.keys(config.post_samples).length > 0));
  const sampleText = config.post_samples?.[config.platform] || Object.values(config.post_samples || {})[0] || "";

  const systemInstruction = `
You are an AI editor refining a social media post for "${profile.name}".
Original Platform: ${config.platform}

${hasPersona ? `
**CRITICAL: PERSONA PRESERVATION MODE**
Maintain the original "Voice" (slang, sentence endings, rhythm) 100%. 
ONLY apply the user's specific instruction.
Reference Style: "${sampleText}"
` : `
**Role**: Minimal interference editor. 
Maintain the original voice exactly. Only modify what is requested.
`}

**Formatting Rules for ${config.platform}:**
${config.platform === Platform.X && config.xConstraint140 ? "- MUST be under 140 characters." : ""}
${config.platform === Platform.Instagram ? "- Keep hashtags intact." : ""}


**Style Constraint:**
- Do NOT combine exclamation marks (! or ！) with emojis at the end of a sentence.
- Choose ONLY ONE: either an exclamation mark OR an emoji.
`;

  const userPrompt = `
Original Post:
"${currentContent}"

Refinement Instruction (Apply this change ONLY, keep everything else the same):
"${instruction}"

Output ONLY the refined text.
`;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const requestConfig: any = {
        systemInstruction,
        responseMimeType: "text/plain",
        temperature: hasPersona ? 0.3 : 0.7,
        safetySettings: [
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ],
      };

    // Thinking Budget: 256
    const budget = 256;

    // @ts-ignore - Enable internal reasoning for higher quality drafting (Gemini 2.5 Flash feature)
    requestConfig.thinkingConfig = { includeThoughts: true, thinkingBudget: budget }; 

      const response = await ai.models.generateContent({
        model: modelName,
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        config: requestConfig,
      });

      const result = await response;
      const refinedText = result.text;

      if (refinedText && refinedText.trim()) {
        const usage = result.usageMetadata;
        if (usage) {
           console.log('[API_USAGE_RAW_REFINE]', JSON.stringify(usage, null, 2));
           const pt = usage.promptTokenCount || 0;
           const ct = usage.candidatesTokenCount || 0;
           console.log(`[API_COST_REFINE] Model: ${modelName} | In: ${pt} | Out: ${ct}`);
        }
        return refinedText.replace(/\n{3,}/g, '\n\n').trim();
      }
      
      console.warn(`[REFINE] Empty response on attempt ${attempt + 1}`);
    } catch (e: any) {
      console.error(`[REFINE] Attempt ${attempt + 1} failed:`, e);
      if (attempt === 1) throw e;
    }
  }

  return currentContent;
};


export const analyzeRisk = async (
  starRating: number,
  reviewText: string
): Promise<RiskAnalysisResult> => {
  return scoreRisk(starRating, reviewText);
};

export const extractPostFromImage = async (
  base64Image: string,
  mimeType: string,
  platform: Platform,
  isPro: boolean
): Promise<string> => {
  const modelName = getModelName(isPro);
  const ai = getServerAI();

  const systemInstruction = `
You are a highly accurate OCR and content extraction assistant specialized in social media.
Extract the "main post body" or "owner reply text" from the provided screenshot of a ${platform} interface.

**Rules:**
1. Extract ONLY the actual text written by the user.
2. Ignore UI elements like "Like", "Comment", "Share", platform logos, timestamps, usernames (unless part of the text), and system buttons.
3. Preserve original line breaks and spacing within the post.
4. If there are multiple posts in the screenshot, extract all of them separated by "---".
5. Output ONLY the extracted text. No explanations or extra commentary.
6. If no post text is found, return an empty string.
`;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              data: base64Image.split(",")[1] || base64Image,
              mimeType: mimeType,
            },
          },
          { text: `Extract the post text from this ${platform} screenshot.` },
        ],
      },
    ],
    config: {
      systemInstruction,
      temperature: 0.1,
    },
  });

  return (response.text || "").replace(/\n{3,}/g, '\n\n').trim();
};

export const sanitizePostSamples = async (
  text: string,
  isPro: boolean
): Promise<string> => {
  const modelName = getModelName(isPro);
  const ai = getServerAI();

  const systemInstruction = `
You are a privacy-focused editor. Your task is to "sanitize" social media posts by replacing specific personal identifiable information (PII) with generic placeholders.

**Rules:**
1. Replace staff names (e.g., "鈴木", "佐藤") with "[担当者名]" or "[スタッフ]".
2. Replace customer names (e.g., "ずん様", "田中様") with "[お客様名]".
3. Replace specific dates/times (e.g., "1月20日", "昨日の14時") with "[日付]" or "[時間]".
4. Replace specific phone numbers or email addresses with "[連絡先]".
5. **CRITICAL**: Maintain the EXACT original tone, dialect, and emoji usage. Do NOT change the personality of the text.
6. The user will provide multiple samples separated by "---". Keep the separators intact.

Example Input:
鈴木のカウンセリング最高やったわ。ずん様も喜んでたで。
---
1月15日に来てくれてサンガツ！佐藤より。

Example Output:
[担当者名]のカウンセリング最高やったわ。[お客様名]も喜んでたで。
---
[日付]に来てくれてサンガツ！[担当者名]より。
`;

  const userPrompt = `Sanitize this text while preserving its unique style and tone:\n\n${text}`;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    config: {
      systemInstruction,
      responseMimeType: "text/plain",
      temperature: 0.1, // Low temperature for high fidelity
    },
  });

  return response.text || text;
};

export const generateStyleInstruction = async (
  samples: { content: string; platform: string }[],
  isPro: boolean = false
): Promise<Record<string, string>> => {
  const modelName = getModelName(isPro);
  const ai = getServerAI();

  // If no samples provided, return empty object immediately
  if (!samples || samples.length === 0) {
    console.log("[Gemini] No samples provided for style analysis. Returning empty.");
    return {};
  }

  // Group samples by platform for the prompt
  const normalizedSamples: { content: string, platform: string }[] = [];
  
  samples.forEach(s => {
    const platforms = s.platform.split(',').map(p => p.trim());
    platforms.forEach(p => {
        let cleanPlatform = p;
        if (p === 'X' || p === 'Twitter') cleanPlatform = 'X (Twitter)';
        else if (p === 'Line') cleanPlatform = 'LINE';
        if (s.content.includes('【文体指示書】')) {
            console.warn(`[Gemini] Skipped learning sample for ${p} because it appears to be a Style Guide.`);
            return;
        }
        // Force trim and TRUNCATE inputs to avoid massive garbage data or repetition triggers
        const truncatedContent = s.content.trim().substring(0, 1000);
        normalizedSamples.push({ content: truncatedContent, platform: cleanPlatform });
    });
  });

  const samplesByPlatform = normalizedSamples.reduce((acc, s) => {
    acc[s.platform] = (acc[s.platform] || '') + `<sample>\n${s.content}\n</sample>\n`;
    return acc;
  }, {} as Record<string, string>);

const styleGuideSchema = {
    type: Type.OBJECT,
    properties: {
        [Platform.X]: { type: Type.STRING },
        [Platform.Instagram]: { type: Type.STRING },
        [Platform.Line]: { type: Type.STRING },
        [Platform.GoogleMaps]: { type: Type.STRING },
    },
    // No "required" fields because some records might be missing certain platforms
};

  const systemInstruction = `
You are an expert linguistic analyst specialized in Japanese social media nuances.
Your task is to analyze social media posts and write a "Style Instruction Guide" (文体指示書) for each platform.

**Goal:**
Create a **detailed, high-resolution** analysis of the writer's voice.
Do NOT just be generic. You must capture the specific "quirks", "vocabulary", "sentence rhythm", and "emotional tone" of the user.

**Output Structure:**
Return a JSON object where the keys are strictly: "${Platform.X}", "${Platform.Instagram}", "${Platform.Line}", "${Platform.GoogleMaps}".
Values must be the style guide string (plain text with bullet points).

**Content Guidelines for each value:**
- **Tone & Voice**: Analyze the specific emotion (e.g., "Manic energy", "Calm professional", "Cynical humor").
- **Keywords & Slang**: List specific words or phrases the user tends to use.
- **Micro-Habits**: (e.g., "Uses half-width spaces between sentences", "Ends with '...' often", "Uses specific emojis like 🥺").
- **Structure**: (e.g., "Short bursts of text", "Long storytelling format").

**Rules:**
- Content MUST be **Natural Japanese**.
- Start each value with 【文体指示書】.
- Use bullet points for readability.
- **CRITICAL:** If samples are provided for a platform, you **MUST** generate a guide for it. Do not skip it.
- **CRITICAL:** The value for "X (Twitter)" must ONLY reflect the X samples. Do NOT mix styles.
- **CRITICAL:** Do NOT use headers like "【Google Maps】" inside the value strings.
`;

  const userPrompt = `Deeply analyze these samples and return the platform-specific Style Instruction Guides in JSON format.\nIf a platform has samples, you must provide a detailed analysis for it.\n\n${
    Object.entries(samplesByPlatform).map(([plat, content]) => 
      `--- PLATFORM: ${plat} ---\n${content}`
    ).join("\n")
  }`;

  // Safety Settings: Disable all filters to prevent truncation of "slang" or "rough" tones
  const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  ];

  const response = await ai.models.generateContent({
    model: modelName,
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: styleGuideSchema,
      temperature: 0.4,
      maxOutputTokens: 8192,
      safetySettings, // Correct placement inside config
    },
  });

  /* 
     DEBUGGING: Check why it stops
  */
  const candidate = response.candidates?.[0];
  console.log('[Gemini] Generation Finish Reason:', candidate?.finishReason);
  console.log('[Gemini] Output Token Count:', response.usageMetadata?.candidatesTokenCount);

  /* 
     Robustness Fix: 
     If the AI is cut off (maxTokens) or hallucinates massive whitespace, 
     JSON.parse will fail. We try to recover what we can.
  */
  let rawText = ""; 
  try {
    // Use .text property, not function (differs by SDK version, usually property in simpler wrappers)
    // If response.text is undefined, fallback to candidate
    rawText = response.text || candidate?.content?.parts?.[0]?.text || "{}";
    
    console.log('[Gemini] Raw Text Length:', rawText.length);
    if (rawText.length < 500) {
        console.log('[Gemini] Short Output Detect (First 200 chars):', rawText.substring(0, 200));
    }
    let parsed: any;
    
    try {
        parsed = JSON.parse(rawText);
    } catch (parseError) {
        console.warn("[Gemini] JSON parsing failed. Attempting robust regex recovery...", parseError);
        // Robust Fallback: Extract keys using Regex
        // This allows us to save X and GoogleMaps even if LINE is truncated at the end.
        parsed = {};
        const platforms = ['X (Twitter)', 'Instagram', 'LINE', 'Google Maps'];
        
        platforms.forEach(p => {
            // Regex to find: "PlatformName": "Content"
            // We use [\s\S]*? lazy match to capture content until the next quote-comma or end
            // This is tricky for nested quotes, but usually sufficient for simple text blocks.
            // A safer bet is looking for the specific key and capturing until the next key or end of string.
            
            // Matches: "Key": "Value..." (handling escaped quotes is hard in simple regex, but we try)
            // We look for the key, then the colon, then opening quote.
            const keyPattern = `"${p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\s*:\\s*"`;
            const startIndex = rawText.search(new RegExp(keyPattern));
            
            if (startIndex !== -1) {
                const contentStart = startIndex + rawText.match(new RegExp(keyPattern))![0].length;
                // Find the end of this value. It usually ends with `",` or `"\n}` or just `"` if truncated.
                // We'll walk forward counting backslashes to ensure we don't stop at escaped quotes.
                let contentEnd = -1;
                let i = contentStart;
                while (i < rawText.length) {
                    if (rawText[i] === '"' && rawText[i-1] !== '\\') {
                        // Potential end. Check if it's followed by comma or close brace or newline (heuristic)
                        // Or just extract it.
                        contentEnd = i;
                        // Determine if this is really the end key. 
                        // If the next char is non-whitespace and not comma/brace/newline, maybe we stopped early?
                        // But standard JSON strings end at unescaped quote.
                        // We check if the next significant char is a comma or other key?
                        // For recovery, taking the first unescaped quote is usually correct unless the AI put unescaped quotes inside.
                        break;
                    }
                    i++;
                }

                if (contentEnd !== -1) {
                    let extracted = rawText.substring(contentStart, contentEnd);
                    // Unescape standard JSON escapes
                    try {
                        extracted = JSON.parse(`"${extracted}"`);
                    } catch (e) {
                         // Fallback unescape if simple parse fails (e.g. newlines)
                         extracted = extracted.replace(/\\n/g, '\n').replace(/\\"/g, '"');
                    }
                    parsed[p] = extracted;
                } else {
                     // If no end quote found (truncated), take everything until max length
                     console.warn(`[Gemini] Value for ${p} appears truncated. Taking simplified substring.`);
                     let extracted = rawText.substring(contentStart);
                     // Limit length
                     if (extracted.length > 2000) extracted = extracted.substring(0, 2000);
                     parsed[p] = extracted; // Raw text, might include garbage at end
                }
            }
        });
        
        if (Object.keys(parsed).length === 0) {
             console.error("[Gemini] Regex recovery failed. Returning empty object.");
             return {};
        } else {
             console.log("[Gemini] Successfully recovered partial data keys:", Object.keys(parsed));
        }
    }
    // Output Sanitation
    const sanitized: Record<string, string> = {};
    const keys = Object.keys(parsed);

    keys.forEach(originalKey => {
        let val = parsed[originalKey];
        
        // 0. Key Normalization
        let key = originalKey;
        const lowerKey = originalKey.toLowerCase();
        
        // Map common variations to strict Platform ENUM values
        if (lowerKey.includes('twitter') || lowerKey === 'x') key = Platform.X; // 'X (Twitter)'
        else if (lowerKey.includes('instagram') || lowerKey.includes('insta')) key = Platform.Instagram; // 'Instagram'
        else if (lowerKey.includes('line')) key = Platform.Line; // 'LINE'
        else if (lowerKey.includes('google') || lowerKey.includes('map')) key = Platform.GoogleMaps; // 'Google Maps'

        // Anti-Hallucination: Check if value is a nested JSON string
        if (typeof val === 'string' && val.trim().startsWith('{')) {
            try {
                const nested = JSON.parse(val);
                // Try to find the content using either original key or normalized key
                if (nested[originalKey]) {
                    val = nested[originalKey];
                } else if (nested[key]) {
                    val = nested[key];
                } else {
                    console.warn(`[Gemini] Detected nested JSON hallucination for ${originalKey}. Discarding wrapper.`);
                    // If neither key matches, it might be a wrapper with a different key or just the content itself if it was a false positive check?
                    // But usually if it parses as JSON, it IS a wrapper. 
                    // Let's fallback to "values" if it's a single key object? 
                    // For safety, let's just keep 'val' as is (the JSON string) if we can't extract, 
                    // OR assume the Hallucination check was wrong and treat the string as the content?
                    // Current logic was: val = "";
                    
                    // Improved fallback: check if there's only one key in nested?
                    const nestedKeys = Object.keys(nested);
                    if (nestedKeys.length === 1) {
                         val = nested[nestedKeys[0]];
                    } else {
                         val = ""; 
                    }
                }
            } catch (e) {
                // Not JSON, ignore
            }
        }

        // Strong String Sanitization
        if (typeof val === 'string') {
          // 1. Trim whitespace
          val = val.trim();
          
          // 2. Collapse excessive newlines (max 2)
          val = val.replace(/\n{3,}/g, '\n\n');

          // 3. Remove cross-platform hallucinations
          // We use the NORMALIZED key for checking against other platforms
          // But we need to check against ALL platform headers
          
          const otherPlatforms = keys.filter(k => k !== originalKey); 
          // Re-calculate strict platforms list for cleaning
          const allPlatforms = [Platform.X, Platform.Instagram, Platform.Line, Platform.GoogleMaps];
          
          allPlatforms.forEach(op => {
             // Don't clean the header of the CURRENT platform
             if (op === key) return;
             
             // Remove lines that explicitly look like platform headers e.g., "【X (Twitter)】"
             const badHeader = `【${op}】`;
             if (val.includes(badHeader)) {
                val = val.replace(badHeader, '').trim(); 
             }
             
             // Also check for "Key" variations if AI output "【Twitter】" inside LINE
             if (op === Platform.X) {
                 if (val.includes('【Twitter】')) val = val.replace('【Twitter】', '').trim();
                 if (val.includes('【X】')) val = val.replace('【X】', '').trim();
             }
          });
        }

        sanitized[key] = val;
    });

    return sanitized; // Return OBJECT, not string
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    // Fallback: return empty object if parsing fails completely
    return {};
  }
};

// Deprecated alias for backward compatibility updates
export const analyzePersona = generateStyleInstruction;

