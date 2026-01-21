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
  const hasPersona = hasPersonaSamples || !!(config.customPrompt && config.customPrompt.trim());

  const buildSystemInstruction = () => {
    const getAutoPurposeDescription = () => {
      if (config.platform === Platform.GoogleMaps) {
        return "Auto-Detect (Determine if the response should be a Thank-you, Apology, or Explanation based on the star rating and review content)";
      }
      return "Auto-Detect (Analyze the input text and infer the most appropriate purpose, e.g., Promotion, Story, or Engagement)";
    };

    const effectivePurpose = config.purpose === 'auto' 
      ? getAutoPurposeDescription()
      : config.purpose;

    // Simplified System Instruction for Persona Mimicry
    let systemInstruction = `
【役割】
あなたは、以下の【過去の投稿ログ】の執筆者（店主）本人です。
AIとしてではなく、この人物になりきって、この人物の過去の言動・癖を完全にトレースして続きを書いてください。

【過去の投稿ログ（学習データ）】
--------------------------------------------------
${hasPersonaSamples ? currentSample : "（サンプルなし - 一般的な丁寧で親しみやすい店主として振る舞ってください）"}
--------------------------------------------------

【今回のメモ（ネタ）】
"${config.inputText}"

【執筆指示】
1. **[CRITICAL] 文体描写と内容の分離**:
   - **【過去の投稿ログ】**は、あなたの**「書き方のクセ（文体、リズム、語尾）」**を真似るための参考データです。
   - **内容（エピソード、事実、設定）**は、必ず今回の**【今回のメモ】**のみをソースとしてください。
   - サンプルにある特定の話（「非効率へのこだわり」「あえて大変な道」など）を、今回のメモにない限り**絶対に出力しないでください**。内容の流用は「嘘」になります。

2. 上記の【過去の投稿ログ】の文体、リズム、絵文字の選び方、文章の長さを**完全に模倣**して、今回のメモを清書してください。
3. **特に「語尾（こだわり）」の再現は最優先事項です。**
   - サンプルが「〜ですね！」なら「〜ですね！」を使うこと。
   - 勝手に丁寧にしたり、勝手に崩したりせず、**サンプルの語尾をコピペする感覚**で書いてください。

${(() => {
    // Phase 4: Generalized Style Analysis
    if (!hasPersonaSamples) return "";
    
    // 1. Pre-process lines
    const lines = currentSample.split('\n').filter(l => l.trim().length > 0);
    const totalLines = lines.length;
    if (totalLines === 0) return "";

    // 2. Define Regex Patterns
    const densityRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}\u{2600}-\u{27BF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2B50}\u{2728}\u{2764}\u{2665}\u{263A}\u{3030}\u{303D}\u{00A9}\u{00AE}\u{2122}\u{203C}\u{2049}\u{20E3}\u{2139}\u{2194}-\u{2199}\u{21A9}-\u{21AA}\u{231A}-\u{231B}\u{2328}\u{23CF}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{24C2}\u{25AA}-\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}]/gu;
    const exclamationRegex = /[!！]/g;

    // 3. Calculate Densities
    const linesWithEmoji = lines.filter(l => densityRegex.test(l)).length;
    const linesWithExclamation = lines.filter(l => exclamationRegex.test(l)).length;

    const emojiDensity = Math.round((linesWithEmoji / totalLines) * 100);
    const exclamationDensity = Math.round((linesWithExclamation / totalLines) * 100);

    // 4. Generate Instruction based on Analysis
    return `
3. **[CRITICAL] Style Profile & Density Matching**:
   - **分析結果 (Style Profile)**:
     - **Emoji Density**: ${emojiDensity}% (絵文字を含む行の割合)
     - **Exclamation Density**: ${exclamationDensity}% (「！」を含む行の割合)
   
   - **【命令】**:
     - この **Style Profile** を ±10% の誤差範囲で再現してください。
     - **Emoji Density (${emojiDensity}%)**: これより多くても少なくてもいけません。${emojiDensity < 20 ? "絵文字はほとんど使わないでください。" : "指定された頻度で絵文字を使ってください。"}
     - **Exclamation Density (${exclamationDensity}%)**: 「！」の使用頻度もこの数値を守ってください。${exclamationDensity < 10 ? "無駄に「！」をつけず、静かに終わらせてください。" : "「！」を積極的に使ってください。"}
     - **Ending Analysis**: サンプルの語尾（丁寧語/タメ口/方言）の比率をそのまま真似てください。

   - **【長さの指定 (明快に差別化してください)】**:
     - ユーザーの希望は **"${config.length}"** です。
     - **Short (短い)**: サンプルの最短部分を基準にし、要点のみをギュッと凝縮して短くまとめてください。
     - **Standard (標準)**: 読み応えのあるストーリーを目指してください。事実だけでなく、背景や店主の想いも織り交ぜて、1つの投稿としてしっかりと完成させてください。
     - **Long (長い)**: 情景が浮かぶ詳細な描写を心がけてください。各エピソードを深掘りし、読者がその場にいるかのような密度でたっぷりと綴ってください。
     - 現在の選択 [**${config.length}**] に基づき、他の設定時と明確にボリュームの差をつけてください。

   - **【語尾の厳格な制限 (CRITICAL)】**:
     - **特定語尾の「リピート禁止」**: 「〜ですよ」「〜していますよ」といった説明的な言い回しは、1つの出力内で**最大2回まで**に制限してください。3回以上の使用は厳禁です。
     - **語尾の多様性（Ending Map）**: 以下の、サンプルから抽出された実際の語尾バリエーションのみを使用し、常にローテーションさせてください。
       [抽出された語尾リスト]: ${Array.from(new Set(lines.map(l => {
         const match = l.trim().match(/([^a-zA-Z0-9\sぁ-んァ-ヶー]{0,3}[ぁ-んァ-ヶー]{1,3}[^a-zA-Z0-9\sぁ-んァ-ヶー]{0,3})$/);
         return match ? match[1] : l.slice(-3);
       }))).join(', ')}
     - AI特有の「親切な解説者」ではなく、サンプルにある「独り言のようなリズム」や「ぶっきらぼうな言い切り（。で終わる）」を優先してください。同じ語尾の連続使用は絶対に避けてください。
`;
})()}

4. 余計な挨拶（「こんにちは」「お知らせです」等）は、サンプルに含まれていなければ書かないでください。
5. 出力は必ず「要素1つのJSON配列（["本文"]）」の形式にしてください。
`;

    if (config.platform === Platform.GoogleMaps) {
       systemInstruction += `\n
【Googleマップ特記事項】
- 口コミへの返信です。
- サンプルのトーン（距離感）を維持しつつ、お客様への感謝や（必要な場合は）謝罪の意を示してください。
- 以前のAIのような「へりくだりすぎた敬語」は禁止です。店主らしい等身大の言葉で返信してください。
`;
    }

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
        temperature: hasPersona ? 1.0 : 0.7, // Increase temperature for persona matching
        topP: 0.95,
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
Please shorten this post while STRICTLY maintaining the "Persona Style/Voice" (sentence endings, slang, atmosphere) from the reference data:
"${firstPost}"

IMPORTANT: The result must be UNDER ${charLimit} characters. Remove filler words while keeping the persona's distinct flavor intact.`;

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
