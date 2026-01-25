import "server-only";
import { GoogleGenAI, Type } from "@google/genai";
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
  return "gemini-2.5-flash";
};

const TONE_RULES = {
  [Tone.Formal]: "きっちりとした「です・ます」調。信頼感のある丁寧で誠実な口調。専門性を感じさせつつも、他者への敬意を込めた表現を用いる。",
  [Tone.Standard]: "標準的な「です・ます」調。適度に丁寧で、誰にでも伝わりやすくバランスの取れた口調。",
  [Tone.Friendly]: "「です・ます」調をベースにしつつ、親しみやすさを重視。感嘆符（！）や明るい言葉選びを積極的に行い、活気のある口筋にする。",
  [Tone.Casual]: "非常にフランクな口調。絵文字や流行の表現、あるいは「だ・である」を交えたSNSらしい親近感のある表現を用いる。"
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
  return new GoogleGenAI({ apiKey });
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
  const hasPersona = !!(config.customPrompt && config.customPrompt.trim()) || hasLearningSamples;
  console.debug("[LEARNING] hasPersona:", hasPersona, "hasLearningSamples:", !!hasLearningSamples);

  const buildSystemInstruction = () => {
    const isInstagram = config.platform === Platform.Instagram;
    const isX = config.platform === Platform.X;
    const isGMap = config.platform === Platform.GoogleMaps;
    
    // Many-shot learning samples formatting
    const formattedLearningSamples = learningSamples 
        ? learningSamples.map((s, i) => `<sample id="${i+1}">\n${s}\n</sample>`).join("\n") 
        : "";

    if (hasPersona) {
        const languageRule = config.language && config.language !== 'Japanese' 
          ? `\n<language_rule>\nGenerate the content in **${config.language}**. Even if the language is different, reproduce the store owner's character (friendliness, passion, expertise, etc.) from the samples within the context of ${config.language}.\n</language_rule>`
          : `\n<language_rule>\nPrimary Language: Japanese. \n*Exception*: If <learning_samples> contain phrases in other languages (e.g., English greetings), you MUST include them to maintain the persona's flavor.\n</language_rule>`;

      return `
<system_instruction>
  <role>
    You are the "Ghostwriter" for the store owner of "${profile.name}".
    Your goal is to completely mimic the owner's writing style based on the provided samples.
  </role>

  <style_guidelines>
    - **Tone & Rhythm**: Completely mimic the sentence endings, line break rhythm, and use of whitespace from the <learning_samples>.
    - **Volume Control**: Strictly follow the requested **Length: ${config.length}**. 
      - If 'Long', expand upon the context (atmosphere, store owner's feelings, expert tips) whilst maintaining the style of the samples.
      - If 'Short', condense to the core message but keep the signature style (emojis, endings).
    - **Platform Bias**: **IGNORE** all standard "polite" norms and "platform-specific" formatting rules for ${config.platform}. The <learning_samples> are the absolute truth for the owner's voice.
    - **Emojis & Symbols**: 
      ${config.platform === Platform.GoogleMaps ? 
        '- **Usage**: Ignore any default restrictions. Strictly reproduce the emoji frequency and decorative symbol patterns found in the <learning_samples>.' : 
        `- **Emojis**: ${config.includeEmojis ? 'Strictly follow patterns from samples.' : 'Avoid unless core to sample style.'}
    - **Symbols**: ${config.includeSymbols ? 'Use decorative symbols from palette if they match sample style.' : 'Minimize symbols.'}`}
    - **Line Breaks**: **NEVER** insert line breaks in the middle of a grammatical phrase or word (e.g., don't split "ご来店いただき" across lines). Maintain natural reading flow. Avoid "auto-formatting for mobile" unless the <learning_samples> explicitly use that specific rhythm.
    - **Platform Rules**:
      - Platform: ${config.platform}
      ${config.platform === Platform.Line ? `- Style: **Friendly but Professional "Official LINE" Marketing**.
        - **3-Balloon Structure**: Generate content in 3 distinct parts (balloons):
          1. **Hook (Balloon 1)**: Max 100 chars. Focus on the first 20 chars for push notification impact. Include immediate benefit or urgency.
          2. **Details (Balloon 2)**: 200-300 chars. Focus on specific item/event value. Use short sentences, line breaks, and clear bullet points.
          3. **Action (Balloon 3)**: Strong Call to Action (CTA) like "▼今すぐ予約する" or "▼クーポンはこちら".
        - **Tone**: Friendly like a "knowledgeable friend" but maintaining professional trust. Avoid stiff email-style greetings (Sincerely, Dear, etc.).
        - **Positive Reframing**: NEVER use terms like "cancellation" (キャンセル/欠員) that imply a negative event. Instead, frame it as a positive opportunity: "A special slot has opened up" (空き枠が出ました), "Ready to welcome you" (ご案内可能になりました), or "Lucky opening" (ラッキーな空き).
        - **Visual Hooks**:
          - **Headers**: Use high-impact headers. Choose between '＼ 🎨 [Title] 🎨 ／' or '＼ [Title] ／' depending on the content. **CRITICAL**: The [Title] must be extremely concise (max 10-12 full-width chars) to ensure the header stays on **A SINGLE LINE** on a mobile screen. Never let the header wrap.
          - **CTA Guidance (LINE ONLY)**: Use directional arrows like '↓ ↓ ↓' or pointing emojis **strictly on the very last line** of the message. You can use an 'Arrow-Sandwich' pattern (e.g., '↓ ↓ ↓ [Text] ↓ ↓ ↓'). **CRITICAL**: The entire line (including arrows) MUST be within 15 full-width characters. If the text is long, symmetrically reduce arrows (e.g., '↓ ↓ [Text] ↓ ↓') or shorten the text to prevent wrapping.
        - **Layout**: Use clear visual separators like '---' between the three balloons.` : ''}
      - Language: ${config.language || 'Japanese'}
  </style_guidelines>

  ${config.customPrompt ? `<custom_instructions>\n${config.customPrompt}\n</custom_instructions>` : ""}

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
  ${hasLearningSamples ? `<learning_samples>\n${formattedLearningSamples}\n</learning_samples>` : ""}
</context_data>

  <user_input>
    "${config.inputText}"
  </user_input>

  ${config.storeSupplement ? `<store_context>\n${config.storeSupplement}\n</store_context>` : ""}

  <task>
    ${config.platform === Platform.GoogleMaps ? 
      `The <user_input> is a customer review. Generate a REPLY from the owner adhering to the <style_guidelines> and <learning_samples>.` :
      config.platform === Platform.Line ?
      `Based on the <user_input>, generate a personal MESSAGE for Official LINE. Focus on directly addressing the customer and encouraging action.` :
      `Based on the <user_input>, generate a new post following the <style_guidelines> and <learning_samples>.`
    }
    Output a JSON object with:
    - "analysis": A brief analysis of emotion and context.
    - "posts": An array of one or more post variations (strings).
  </task>
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
    - Length: ${config.length}
    - Tone: ${config.tone} (${TONE_RULES[config.tone] || TONE_RULES[Tone.Standard]})
    - Features: ${isInstagram ? 'Visual focus, 4-6 hashtags.' : ''}${isX ? 'Under 140 chars, 1-2 hashtags.' : ''}${isGMap ? 'Polite reply, NO emojis, NO hashtags.' : ''}${config.platform === Platform.Line ? 'Direct marketing style. NO hashtags. Focus on clear messaging.' : ''}
    - Emojis: ${isGMap ? 'Do NOT use emojis at all.' : (config.includeEmojis ? "Use expressive, large, or character-like emojis (🐻, ✨, 💪) for high impact." : "Minimize emojis.")}
  </rules>

  ${config.customPrompt ? `<custom_instructions>\n${config.customPrompt}\n</custom_instructions>` : ""}

  ${languageRule}

  <user_input>
    "${config.inputText}"
  </user_input>

  ${config.storeSupplement ? `<store_context>\n${config.storeSupplement}\n</store_context>` : ""}

  <task>
    ${isGMap ? 
      "The <user_input> is a customer review. Generate a polite and empathetic REPLY from the owner. Use the facts in <store_context> if provided to explain circumstances or provide background. Do not just summarize the facts; acknowledge them graciously." : 
      config.platform === Platform.Line ?
      "Generate an Official LINE message with a 3-balloon structure: 1. Hook (for push notifications), 2. Details (friendly marketing body), 3. Action (CTA). Use friendly but professional tone. Mark each balloon clearly with '---'. **CRITICAL**: Use positive framing (e.g., 'ご案内可能なお時間ができました') instead of negative terms like 'cancellation' (キャンセル). **VISUAL**: Use emoji-sandwiched headers (e.g., ＼ 🧴 [Title] 🧴 ／). For LINE only, place directional arrows (↓ ↓ ↓) **strictly on the very last line**, optionally as an arrow-sandwich pattern (e.g., ↓ ↓ ↓ Text ↓ ↓ ↓). Encourage action." :
      "Generate an attractive post for based on the <user_input>."
    }
    Output a JSON object with:
    - "analysis": Brief context analysis.
    - "posts": An array of generated post strings.
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
    learningSamplesChars: (learningSamples || []).join("\n").length,
  };
  console.debug("[PROMPT] sizes:", promptSize);

  // In-memory cache store (resets on server restart)
  const cacheStore = new Map<string, { name: string; expiresAt: number }>();

  const attemptGeneration = async (userPrompt: string): Promise<GeneratedContentResult> => {
    let cachedContentName: string | undefined;
    
    // Check if we should try caching (Google Gen AI requires >32k tokens for caching)
    // We estimate roughly. If system instruction implies high usage, we verify with countTokens.
    const estimatedChars = systemInstruction.length + (learningSamples || []).join("").length;
    
    // Threshold: a bit below 32k usually to be safe, but chars != tokens. 
    // Japanese text can be 1 char ~ 1+ tokens. 
    // Let's explicitly check token count if it seems heavy (> 20,000 chars)
    if (estimatedChars > 20000) {
      try {
        const { totalTokens } = await ai.models.countTokens({
          model: modelName,
          contents: [{ role: "user", parts: [{ text: userPrompt }] }], // Rough usage
          config: { systemInstruction }, 
        });

        if (totalTokens && totalTokens > 32768) {
          // Compute hash for the static part (System Instruction)
          const cacheKey = crypto.createHash('md5').update(systemInstruction).digest('hex');
          
          const cached = cacheStore.get(cacheKey);
          const now = Date.now();

          if (cached && cached.expiresAt > now) {
            cachedContentName = cached.name;
            console.log(`[CACHE] Hit! Using cached content: ${cachedContentName}`);
          } else {
            console.log(`[CACHE] Miss or Expired. Creating new cache context... (${totalTokens} tokens)`);
            // Create new cache
            // Note: Availability of caching checks depends on SDK version. Assuming standard interface.
            const cacheManager = (ai as any).caches; 
            if (cacheManager) {
               const ttlSeconds = 60 * 5; // 5 minutes TTL for now to be safe/thrifty
               const cache = await cacheManager.create({
                 model: modelName,
                 contents: [], // System instruction is often handled separately in cache config
                 config: { 
                   systemInstruction: { parts: [{ text: systemInstruction }] }
                 },
                 ttlSeconds,
               });
               
               if (cache && cache.name) {
                 cachedContentName = cache.name;
                 cacheStore.set(cacheKey, { name: cache.name, expiresAt: now + (ttlSeconds * 1000) });
                 console.log(`[CACHE] Created: ${cache.name}`);
               }
            }
          }
        }
      } catch (e) {
        console.warn("[CACHE] Failed to handle caching logic:", e);
      }
    }

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

    // Dynamic Thinking Budget based on requested length to optimize output cost
    const budgetMap = { [Length.Short]: 768, [Length.Medium]: 1280, [Length.Long]: 1792 };
    const budget = budgetMap[config.length] || 1024;

    // @ts-ignore - Quality restore: Dynamic thinking budget based on length
    requestConfig.thinking_config = { include_thoughts: true, thinking_budget: budget }; 
    // @ts-ignore - Also try the camelCase version
    requestConfig.thinkingConfig = { includeThoughts: true, thinkingBudget: budget };

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: requestConfig,
    });

    const result = await response;
    const usage = result.usageMetadata;
    
    if (usage) {
        const pt = usage.promptTokenCount || 0;
        const ct = usage.candidatesTokenCount || 0;
        const total = usage.totalTokenCount || 0;
        const cached = (usage as any).cachedContentTokenCount || 0; // Check for cache

        // Gemini 2.5 Flash Official Pricing (per 1,000,000 tokens)
        const RATE_INPUT = 0.30;    // USD per 1M tokens
        const RATE_OUTPUT = 2.50;   // USD per 1M tokens
        const RATE_CACHED = 0.15;   // USD per 1M tokens
        const EX_RATE_JPY = 150;    // JPY/USD

        const thinking = (usage as any).thinkingTokenCount || 0; // Explicitly get thinking tokens if available
        
        // Input: Total Prompt (including gaps/system) minus cached
        const promptTotal = total - ct; // ct includes thinking in some SDKs, but here we treat it carefully
        const standardInput = promptTotal - cached;
        
        // Output: Generated content + Thinking tokens
        // Note: In newer API, candidatesTokenCount might already include thinking, 
        // but if total - prompt > candidates, the difference is often the 'thought' gap.
        const outputTotal = ct > thinking ? ct : (ct + thinking); 

        const costUSD = (standardInput * RATE_INPUT / 1000000) + 
                        (cached * RATE_CACHED / 1000000) + 
                        (outputTotal * RATE_OUTPUT / 1000000);
        const costJPY = costUSD * EX_RATE_JPY;

        console.log(`[API_COST] Model: ${modelName} | In: ${promptTotal} (Cached: ${cached}) | Out: ${outputTotal} (Thinking: ${thinking}) | Est: ¥${costJPY.toFixed(4)}`);

    }

    const jsonText = result.text;
    if (!jsonText) throw new Error("No response from AI");

    try {
        const parsed = JSON.parse(jsonText);
        // Validate schema roughly
        if (typeof parsed !== 'object' || !Array.isArray(parsed.posts)) {
            throw new Error("Invalid schema received");
        }
        return {
            analysis: parsed.analysis || "",
            posts: parsed.posts.map((s: any) => String(s))
        };
    } catch (e) {
        throw new Error("Failed to parse AI response");
    }
  };

  let userPrompt = `Generate the post in ${config.language || 'Japanese'}.`;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const result = await attemptGeneration(userPrompt);

      if (!isXWith140Limit) {
        return result;
      }

      const firstPost = result.posts[0];
      const currentLength = firstPost.length;

      if (currentLength <= charLimit) {
        console.debug(`X post validated: ${currentLength}/${charLimit} chars`);
        return result;
      }

      console.warn(
        `X post too long (${currentLength}/${charLimit}), retrying... (attempt ${attempt + 1}/2)`
      );

      // Recursive prompt for retry
      userPrompt = `Previous post was ${currentLength} chars. MUST be under ${charLimit}. Shorten it but keep the Persona.`;

    } catch (parseError) {
      console.error("Generation attempt failed:", parseError);
      if (attempt === 1) {
        throw new Error("AI response was not valid after 2 attempts");
      }
    }
  }

  throw new Error(`Failed to generate X post under ${charLimit} chars after 2 attempts`);
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
      };

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
           const pt = usage.promptTokenCount || 0;
           const ct = usage.candidatesTokenCount || 0;
           console.log(`[API_COST_REFINE] Model: ${modelName} | In: ${pt} | Out: ${ct}`);
        }
        return refinedText;
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

  return response.text || "";
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
