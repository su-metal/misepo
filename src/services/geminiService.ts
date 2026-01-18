import "server-only";
import { GoogleGenAI, Type } from "@google/genai";
import {
  GenerationConfig,
  Platform,
  StoreProfile,
  GoogleMapPurpose,
  RiskTier,
} from "../types";

// Define the schema for structured output (Array of strings)
const contentSchema = {
  type: Type.ARRAY,
  items: { type: Type.STRING },
};

const getModelName = (isPro: boolean) => {
  return "gemini-2.5-flash";
};

// Comprehensive Symbol Palette
const DECORATION_PALETTE = `
【Special Symbol Palette (Monochrome Text Symbols)】
- Hearts/Stars: ❤︎ ❣︎ ❦ ❧ ღ ʚ♥ɞ ⸜❤︎⸝ ෆ ̖́- ಇ ✩ ✪ ✬ ✭ ✮ ✯ ✰ 𖤐˒˒ ꙳ ᛭ * ⸝⋆ ✦ ✧ ✡
- Flowers/Plants: 𖤣 𖥧 𖥣 𖡡 ❀ ✿ ❉ ❊ ❋ ✻ ✼ ✽ ✾ ⁂ 𓍯 𖦊 ✲ 𖣔 𖡼 ꕤ ꕥ ❁ ✤ ꔛꕤ*｡ﾟ 𖠰 𖥍 𖣰 𖥸 𖦥 𖦞 𖢇 𖧡 ☘︎
- Expressions/Faces: ☻︎ ☺︎ ☹︎ ◡̈ ⍤ ⍥ Ü ᵕ̈* ⍩ ᐖ ӫ ・ᴗ・ ⍨ ʘʘ ˙꒳​˙ °-° °ㅁ° ⚆ ˃́ꇴ˂ 𖦹‎
- Animals: 𓃰 𓃱 𓃲 𓃟 𓃠 𓄅 𓃒 𓃗 𓃘 𓃙 𓃜 𓃥 𓃦 𓃵 𓅛 𓅸 𐂂 𓇼 𓆡 𓆛 ᗦ↞◃ 𓅓 𓄿 𓆑 𓅱 𓅿 𓅺 𓎤𓅮
- Humans/Action: 𓀫 𓀠 𓀡 𓀤 𓁉 ꐕ 𐀪𐁑 𖠋𐀪 𖦔𖠋
- Arrows: ⇝ ☜╮ ⥿ ⥱ ⇸ ⟲ ⥄ ⥳ ⇍ ↯︎ ⇰ ↬ ➴⡱ ↖︎ ↗︎ ↘︎ ↙︎
- Frame Pairs (MUST USE AS PAIR): 𓊆 𓊇 ˚.꒰ ꒱.˚ 〖 〗 ☾ ☽ ˹ ˼ ⌜ ⌟ ❮ ❯ ˗ˏˋ ˎˊ˗ ❝ ❞ (e.g. ˗ˏˋ Title ˎˊ˗)
- Lines/Dividers: ✄————— ｷ ﾘ ﾄ ﾘ —————✄ ✁┈┈┈┈┈┈┈┈┈┈ ✼••┈┈┈┈••✼••┈┈┈┈••✼ ｡.｡:+* ﾟ ゜ﾟ +:｡.｡:+ ﾟ ゜ﾟ +:｡.｡ ♔∴∵∴♔∴∵∴♔∴∵∴♔ ♩.•¨•.¸¸♩.•*¨*•.¸¸ 𓈒 𓏸 𓐍 𓂃 𓈒𓏸 𓂃◌𓈒𓐍 𓈒 ꔛ ০ ﻌﻌﻌ ꕀ 〰️ ꔚ ꕁ ╍ ⌇ ﹏ ￤ 　 𓂃
- Life/Daily: ☀︎ ☼ ☁︎ ☂︎ ☃
`;

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

export const generateContent = async (
  profile: StoreProfile,
  config: GenerationConfig,
  isPro: boolean
): Promise<string[]> => {
  const modelName = getModelName(isPro);
  const maxRetries = 3;
  const charLimit = 140;
  const isXWith140Limit = config.platform === Platform.X && config.xConstraint140;

  const buildSystemInstruction = () => {
    const effectivePurpose = config.purpose === 'auto' 
      ? "Auto-Detect (Analyze the input text and infer the most appropriate purpose, e.g., Promotion, Story, or Engagement)" 
      : config.purpose;

    let systemInstruction = `
You are a skilled and friendly social media manager for a physical business.
Your goal is to write engaging, natural, and effective posts for a ${profile.industry} named "${profile.name}" located in ${profile.region}.
Store Description: ${profile.description || "N/A"}
Target Audience: Local customers and potential visitors.

**Current Task Configuration:**
- Platform: ${config.platform}
- Purpose: ${effectivePurpose}
- Tone: ${config.tone} (Formal/Standard/Friendly)
- Length: ${config.length} (Short/Medium/Long)
- Language: ${config.language || "Japanese"}
`;

    if (config.platform === Platform.GoogleMaps) {
      if (config.starRating) {
        systemInstruction += `\n- Context: Replying to a customer review with a ${config.starRating}-star rating. Adjust the gratitude/apology level accordingly.`;
      }
      if (config.purpose === GoogleMapPurpose.Apology) {
        systemInstruction += `\n- Focus: Sincere apology, explanation of improvement, and inviting them back.`;
      }
      systemInstruction += `\n
**Humble Language Enforcement (CRITICAL):**
When the customer mentions family members (e.g., "奥様", "旦那様", "娘さん") or staff (e.g., "店員さん", "スタッフの方") in their review:
- You MUST convert these to humble forms suitable for the store owner (e.g., "妻" or "家内", "主人" or "夫", "娘", "スタッフ").
- NEVER repeat the customer's honorifics when referring to your own side.

**Location-Based Greeting Rule (CRITICAL):**
- Do NOT assume the customer is from out of town (e.g., "豊橋にお越しの際は" / "when you come to [Region]") UNLESS they explicitly mention traveling, visiting from afar, or being a tourist.
- If the customer does NOT mention being from far away, assume they are potentially local.
- Instead of "If you visit [Region] again," use generic welcoming phrases like "We look forward to your next visit" (またのご来店を心よりお待ちしております) or "We hope to see you again soon."`;
    }

    if (config.storeSupplement) {
      systemInstruction += `\n- Additional Store Info (Use this context): ${config.storeSupplement}`;
    }
    if (config.customPrompt) {
      systemInstruction += `\n- Special User Instruction: ${config.customPrompt}`;
    }
    if (config.instagramFooter) {
      systemInstruction += `\n- Context (Store Info): "${config.instagramFooter}"\nNOTE: Do NOT include this store info footer in your generated output. It will be appended programmatically later. Only use this for context to avoid repeating information.`;
    }


    // Inject Post Samples for Few-Shot Learning
    if (config.postSamples?.[config.platform]) {
      const sample = config.postSamples[config.platform];
      if (sample && sample.trim()) {
        systemInstruction += `\n
**Persona Adoption (Few-Shot Style Learning):**
The user has provided the following past posts (or replies) from this specific persona.
You MUST adopt this persona's voice, tone, sentence structure, and emoji usage habits.
---
${sample}
---
IMPORTANT: Acting as the persona who wrote the above examples, write a new post about the topic below.`;
      }
    }

    const hasPersona = (config.postSamples?.[config.platform] && config.postSamples[config.platform]!.trim()) || (config.customPrompt && config.customPrompt.trim());
    const useEmojis = config.platform === Platform.GoogleMaps ? false : config.includeEmojis !== false;
    const useSymbols = config.platform === Platform.GoogleMaps ? false : config.includeSymbols;

    systemInstruction += `\n
**Formatting Rules:**
1. Generate exactly 1 distinct variation.
2. Output strictly as a JSON array of strings.
`;

    if (hasPersona) {
      systemInstruction += `
3. **Persona Habit Override**: Ignore manual emoji/symbol settings. Instead, strictly adopt the learned persona's habits regarding emojis and decorative symbols from the provided samples and instructions. ${config.platform === Platform.GoogleMaps ? '(CRITICAL: Despite persona habits, do NOT use emojis or symbols for Google Maps.)' : ''}
4. ${isXWith140Limit ? `CRITICAL: The post MUST be BETWEEN 120 AND ${charLimit} characters. This is a hard limit. Count every character carefully (including spaces and emojis). Aim to be as close to ${charLimit} characters as possible while staying STRICTLY UNDER the limit. (日本語指示: 140文字ギリギリまで情報を詰め込み、絶対に140文字を超えないでください)` : ""}
`;
    } else {
      systemInstruction += `
3. ${useEmojis ? 'Use emojis naturally. Even in "Standard" tone, use emojis moderately (e.g., ✨, 😊, ☕️) to ensure the post isn\'t too dry.' : "Do NOT use emojis."}
4. ${useSymbols ? `Use text decorations from this palette if appropriate: ${DECORATION_PALETTE}` : "Do NOT use complex text decorations/symbols (like ✧ or ✄), but simple emojis are allowed if enabled."}
5. ${isXWith140Limit ? `CRITICAL: The post MUST be BETWEEN 120 AND ${charLimit} characters. This is a hard limit. Count every character carefully (including spaces and emojis). Aim to be as close to ${charLimit} characters as possible while staying STRICTLY UNDER the limit. (日本語指示: 140文字ギリギリまで情報を詰め込み、絶対に140文字を超えないでください)` : ""}
`;
    }

    systemInstruction += `
6. If Instagram: Use line breaks for readability and add 4-6 relevant hashtags at the bottom.
7. If Google Maps: Be professional, concise, and do NOT use hashtags. Do NOT use emojis.

**Style Constraint (CRITICAL):**
- **Do NOT combine exclamation marks (! or ！) with emojis at the end of a sentence.**
- Choose ONLY ONE: either an exclamation mark OR an emoji.
- BAD: "お待ちしています！✨", "美味しいですよ！😋"
- GOOD: "お待ちしています！", "お待ちしています✨", "美味しいですよ😋"
`;

    return systemInstruction;
  };

  const ai = getServerAI();
  const systemInstruction = buildSystemInstruction();

  const attemptGeneration = async (userPrompt: string): Promise<string[]> => {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: contentSchema,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");

    const parsed = JSON.parse(jsonText);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("AI returned empty or invalid result");
    }
    return parsed.map((s) => String(s));
  };

  let userPrompt = `Draft a post based on this input: "${config.inputText}"`;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await attemptGeneration(userPrompt);

      if (!isXWith140Limit) {
        return result;
      }

      const firstPost = result[0];
      const currentLength = firstPost.length;

      if (currentLength <= charLimit) {
        console.debug(`X post validated: ${currentLength}/${charLimit} chars`);
        return result;
      }

      console.warn(
        `X post too long (${currentLength}/${charLimit}), retrying... (attempt ${attempt + 1}/${maxRetries})`
      );

      userPrompt = `Your previous post was ${currentLength} characters, but it MUST be under ${charLimit} characters.
Please shorten this post while keeping the core message:
"${firstPost}"

IMPORTANT: The result must be UNDER ${charLimit} characters. Remove unnecessary words, use shorter expressions, or simplify the message.`;

    } catch (parseError) {
      console.error("Generation attempt failed:", parseError);
      if (attempt === maxRetries - 1) {
        throw new Error("AI response was not valid after multiple attempts");
      }
    }
  }

  throw new Error(`Failed to generate X post under ${charLimit} characters after ${maxRetries} attempts`);
};

export const refineContent = async (
  profile: StoreProfile,
  config: GenerationConfig,
  currentContent: string,
  instruction: string
): Promise<string> => {
  const modelName = getModelName(true);

  const systemInstruction = `
You are an AI editor refining a social media post for "${profile.name}".
Original Platform: ${config.platform}
Tone: ${config.tone}

**Formatting Rules:**
1. ${config.platform === Platform.X && config.xConstraint140 ? "MUST be under 140 characters." : ""}
2. If Instagram: Keep hashtags.
3. ${config.platform === Platform.GoogleMaps ? "If Google Maps: Do NOT use emojis." : ""}

**Style Constraint (CRITICAL):**
- **Do NOT combine exclamation marks (! or ！) with emojis at the end of a sentence.**
- Choose ONLY ONE: either an exclamation mark OR an emoji.
`;

  const userPrompt = `
Original Post: "${currentContent}"
Refinement Instruction: "${instruction}"

Output ONLY the refined text (raw string, not JSON).
`;

  const ai = getServerAI();

  const response = await ai.models.generateContent({
    model: modelName,
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    config: {
      systemInstruction,
      responseMimeType: "text/plain",
      temperature: 0.7,
    },
  });

  return response.text || currentContent;
};

export const analyzeRisk = async (
  starRating: number,
  reviewText: string
): Promise<RiskAnalysisResult> => {
  return scoreRisk(starRating, reviewText);
};
