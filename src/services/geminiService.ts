import "server-only";
import { GoogleGenAI, Type } from "@google/genai";
import {
  GenerationConfig,
  Platform,
  StoreProfile,
  GoogleMapPurpose,
  RiskTier,
  Length,
} from "../types";

// Define the schema for structured output (Array of strings)
const contentSchema = {
  type: Type.ARRAY,
  items: { type: Type.STRING },
};

const getModelName = (isPro: boolean) => {
  return "gemini-2.5-flash";
};

// Concise & High-Quality Symbol Templates
const DECORATION_PALETTE = `
【Special Symbol Patterns (Use for premium feel)】
- Title Hooks: ˗ˏˋ [Text] ˎˊ˗ , 〖 [Text] 〗, 𓊆 [Text] 𓊇
- Dividers: ✼••┈┈┈┈••✼ , 𓂃 𓈒 𓏸 , ✄—————✄
- Accents: ⸜❤︎⸝ , ✩ , ✦ , ꕤ , ☘︎ , ◡̈
- List Bullets: ☕︎ , ☀︎ , ⚆ , ӫ
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
  isPro: boolean,
  learningSamples?: string[] 
): Promise<string[]> => {
  const modelName = getModelName(isPro);
  const charLimit = 140;
  const isXWith140Limit = config.platform === Platform.X && config.xConstraint140;
  
  // Helper to safely get platform samples even if key names vary (e.g., 'X' vs 'X (Twitter)')
  const getPlatformSample = (samples: Record<string, string | undefined> | undefined, targetPlatform: Platform): string | undefined => {
    if (!samples) return undefined;
    
    // 1. Direct match
    if (samples[targetPlatform]) return samples[targetPlatform];
    
    // 2. Fuzzy match for target platform
    const target = targetPlatform.toLowerCase();
    const keys = Object.keys(samples);
    const targetKey = keys.find(k => {
      const lowerK = k.toLowerCase();
      if (target.includes('x') || target.includes('twitter')) return lowerK.includes('x') || lowerK.includes('twitter');
      if (target.includes('insta')) return lowerK.includes('insta');
      if (target.includes('goog') || target.includes('map')) return lowerK.includes('goog') || lowerK.includes('map');
      return lowerK === target;
    });
    
    return targetKey ? samples[targetKey] : undefined;
  };

  const currentSample = getPlatformSample(config.post_samples as any, config.platform);
  const hasPersonaSamples = !!(currentSample && currentSample.trim());
  const hasLearningSamples = learningSamples && learningSamples.length > 0;
  const hasPersona = hasPersonaSamples || !!(config.customPrompt && config.customPrompt.trim()) || hasLearningSamples;
  console.debug("[LEARNING] hasPersona:", hasPersona, "hasLearningSamples:", !!hasLearningSamples, "hasPersonaSamples:", hasPersonaSamples);

  const buildSystemInstruction = () => {
    const isInstagram = config.platform === Platform.Instagram;
    const isX = config.platform === Platform.X;
    const isGMap = config.platform === Platform.GoogleMaps;

    if (hasPersona) {
    const languageRule = config.language && config.language !== 'Japanese' 
      ? `\n【出力言語追加ルール】\n- 本文は必ず **${config.language}** で作成してください。\n- 言語が異なっても、サンプルの「店主のキャラクター（親しみやすさ、情熱、専門性など）」を ${config.language} の文脈で最大限に再現してください。`
      : "";
      const learningContext = hasLearningSamples ? `
【文体見本（コピペ禁止・リズムのみ学習）】
${learningSamples.join("\n---\n")}
` : "";
      const personaSampleContext = hasPersonaSamples ? `
【文体見本（最優先で模倣）】
${currentSample}
` : "";

      return `あなたは「店主の代筆職人」です。

【執筆ルール（最優先）】
- **統計的継承**: サンプルの「文末分布（句点/記号/絵文字の比率）」を忠実に再現。句点が多いなら句点で終わる文を増やす。
- **癖の制限**: 目立つ特徴（例：「〜ですょ」）は連続使用不可。1投稿につき1〜2回までの「アクセント」に留める。
- **完全継承**: 語順・改行リズム・絵文字密度を模倣。AIらしい丁寧語への浄化は厳禁。
- **指示遵守**: 言語[**${config.language || '日本語'}**]、長さ[**${config.length}**]、プラットフォーム[${config.platform}]ルールを厳守。
${languageRule}
${config.includeSymbols ? `【記号の活用】\n${DECORATION_PALETTE}` : ""}

【情報の優先順位】
1. **店名**: 必ず「${profile.name}」を使用。サンプル内の店名は無視。
2. **内容**: 投稿の中身は「今回のメモ」のみをソースとする。サンプルのエピソードや過去メニューは絶対に使用禁止。

【今回のメモ】: "${config.inputText}"
${personaSampleContext}
${learningContext}

JSON配列（["本文"]）で完成文のみを出力。自己解説・思考プロセスは一切不要。
`;
    }

    // Standard Omakase Mode
    return `あなたは「${profile.name}」のSNS担当。メモから魅力的な${config.platform}投稿を作成。

【ルール】
- 言語[**${config.language || '日本語'}**]、長さ[**${config.length}**]を厳守。
- インプットに含まれない情報は勝手に追加しない。
- 特徴: ${isInstagram ? '視覚重視、ハッシュタグ4-6個。' : ''}${isX ? '140字以内、ハッシュタグ1-2個。' : ''}${isGMap ? '店舗返信。丁寧な言葉。絵文字不可。' : ''}
${config.includeSymbols ? `【活用可能記号】\n${DECORATION_PALETTE}` : ""}

【今回のメモ】: "${config.inputText}"

JSON配列（["本文"]）で完成文のみを出力。
`;
  };

  const ai = getServerAI();
  const systemInstruction = buildSystemInstruction();
  const promptSize = {
    systemChars: systemInstruction.length,
    userChars: (config.inputText || "").length,
    learningSamplesChars: (learningSamples || []).join("\n---\n").length,
    postSamplesChars: currentSample ? currentSample.length : 0,
  };
  console.debug("[PROMPT] sizes:", promptSize);

  const attemptGeneration = async (userPrompt: string): Promise<string[]> => {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: contentSchema,
        temperature: hasPersona ? 0.3 : 0.6,
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

  let userPrompt = `Generate the post in ${config.language || 'Japanese'} based on input. Return ONLY a JSON array of strings.`;

  for (let attempt = 0; attempt < 2; attempt++) {
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
        `X post too long (${currentLength}/${charLimit}), retrying... (attempt ${attempt + 1}/2)`
      );

      userPrompt = `Previous post was ${currentLength} chars. MUST be under ${charLimit}. Shorten it but keep the Persona: "${firstPost}"`;

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
${config.platform === Platform.GoogleMaps ? "- Do NOT use emojis or hashtags." : ""}

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

  const ai = getServerAI();

  const response = await ai.models.generateContent({
    model: modelName,
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    config: {
      systemInstruction,
      responseMimeType: "text/plain",
      temperature: hasPersona ? 0.3 : 0.7, // Low temp for persona to prevent drift, moderate for others
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
