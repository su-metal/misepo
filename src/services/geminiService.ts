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
  isPro: boolean,
  learningSamples?: string[] 
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
  const hasLearningSamples = learningSamples && learningSamples.length > 0;
  const hasPersona = hasPersonaSamples || !!(config.customPrompt && config.customPrompt.trim()) || hasLearningSamples;

  const buildSystemInstruction = () => {
    let personaInstructions = "";

    if (hasPersona) {
      // --- Persona Mode (High Precision Mimicry) ---
      let learningContext = "";
      if (hasLearningSamples) {
          learningContext = `
【重要：スタイル学習用データ（厳守）】
以下は「ユーザーが好む文体見本」です。ここからコピーしてよいのは「文体・口調・リズム・絵文字の頻度」**のみ**です。
- **禁止**: この見本の中に書かれている「具体的な内容（メニュー名、日付、エピソードなど）」を、今回の生成に混入させることは**絶対禁止**です。
- **指示**: あくまで「書き方」だけを真似て、内容は「今回のメモ」だけで構成してください。
${learningSamples.join("\n---\n")}
`;
      }

      personaInstructions = `
あなたは、以下の【過去の投稿ログ】の主になりきる「AI代筆職人」です。

以下の3点を、サンプルの「見た目」から正確に盗んでください：
1. **記号の【密度】**: ログには複数の投稿（---区切り）が含まれています。全ての合計ではなく、**「平均的な1投稿分の量」**を再現してください。
2. **記号の【種類】**: サンプルにない汎用的な絵文字（🙌✨🥰等）は使用禁止です。サンプルにある特定の文字・記号（♡、♪、🍓等）のみを優先してください。
3. **行の長さの完全同期（ポエム化の防止）**:
   - サンプルの**「1行あたりの文字数」**を分析し、それに合わせてください。
   - **ケースA（長い行）**: サンプルが「20文字前後で改行」している場合、あなたも同様に長く続けてください。
     - **禁止**: 「読点（、）」の直後で毎回改行することは**厳禁**です。
     - **禁止**: 「ひとつめは（改行）」「優しい甘さの（改行）」のように、短いフレーズで細かく切る（ポエム風にする）ことは**厳禁**です。
   - **ケースB（短い行）**: サンプルが「5〜10文字で細かく改行」している場合のみ、あなたも短く切ってください。

【文体と素材の完全分離（最重要）】:
- **ソースの使い分け**:
  - **文体（ガワ）**: 「過去の投稿ログ」から、語尾（〜だね、〜です）、絵文字のクセ、改行リズム、雰囲気だけを抽出してください。
  - **素材（中身）**: 「今回のメモ」の内容**のみ**を使用してください。

【執筆ルール】:
- 解説や挨拶は一切抜き。投稿文のみを出力。
- メモが短い場合は、店主の価値観（こだわり、想い）に沿って自然に膨らませる。
- ユーザー希望の長さ [**${config.length}**] に合わせてボリュームを調整。
- X (Twitter)の場合は、ハッシュタグは最小限（1〜2個程度、最大3個まで）に留めてください。

【過去の投稿ログ】:
【過去の投稿ログ】:
${currentSample || "（カスタムプロンプトまたは学習データに基づき、職人として振る舞ってください）"}

${learningContext}

【今回のメモ】:
"${config.inputText}"

【出力形式】:
要素1つのJSON配列（["本文"]）で出力。

【禁止事項】:
- **「過去の投稿ログ」にある具体的なエピソード（「大変な道を突き進みます」等の固有フレーズ）のコピペ・流用は厳禁です。**
- **「短いフレーズでの連続改行（ポエム化）」は、サンプルがそうでない限り厳禁です。**
- **サンプルに反して「長文の塊」を出力することは禁止です。頻繁に改行してください。**
- **感嘆符（！や！）と絵文字の併用禁止**: 文末で「！✨」のように重ねず、どちらか一方のみを使用してください。
`;
      
      const combinedPersona = config.customPrompt 
        ? personaInstructions + `\n【追加のカスタム指示】:\n${config.customPrompt}`
        : personaInstructions;

      if (config.platform === Platform.GoogleMaps) {
        return combinedPersona + `\n【Googleマップ特記事項】: 口コミへの返信。丁寧すぎない言葉で。※絵文字・記号禁止。`;
      }
      return combinedPersona;
    }

    // --- Google Maps Reply Mode ---
    // Detect if this is a reply: starRating exists OR explicit reply purpose
    const isGMapReply = config.platform === Platform.GoogleMaps && (
      config.starRating != null || 
      (config.gmapPurpose && config.gmapPurpose !== GoogleMapPurpose.Auto)
    );

    if (isGMapReply) {
      // If persona exists, we want to use its "Tone/Style" but override the "Objective" to be a reply.
      const basePersona = hasPersona ? personaInstructions : `
あなたは、${profile.region}にある${profile.industry}「${profile.name}」のオーナーまたは店長です。
丁寧かつ温かみのある返信文を作成してください。
【基本情報】: 店名:${profile.name}, 業種:${profile.industry}, 地域:${profile.region}
`;

      let replyInstructions = `
${basePersona}

【Googleマップ返信作成（最優先指示）】:
これは「お客様の口コミ」への返信です。上記の設定（ペルソナ・文体）を維持しつつ、以下のルールで返信を作成してください。
1. **文脈の言い換え（脱オウム返し）**: 口コミのキーワードを機械的に繰り返すのではなく、**文脈に合わせてプロらしく言い換えて**ください。
   - 例: 「14時頃」「ランチ終わってた」→「ランチタイムを過ぎたお時間でも」「遅めのランチに」
   - 例: 「探した」→「数あるお店の中から当店を見つけていただき」
   - **注意**: 「お店が忙しい（行列）」を「（お客様の）お忙しい時間」と取り違えないこと。「お待ちいただいたことへの感謝」に変換してください。
2. **客観性の保持（自画自賛の禁止）**: お客様の主観的な褒め言葉（「奥深い味」「分厚い」等）を、そのまま自分の言葉として「当店の奥深い味は…」と返すと傲慢に聞こえます。「〜とのお言葉、光栄です」「〜を楽しんでいただけて」と受け止める形式にしてください。
3. **感謝と共感**: お客様の感情（「美味しかった」「嬉しかった」「残念だった」）に寄り添う言葉を選んでください。
4. **謙譲語の徹底**: お客様が「店員さん」と書いていても、自身のことは「スタッフ」「私共」と謙譲語で表現してください。
5. **宣伝色を消す**: 「キャンペーン中！」などの強い宣伝は避け、あくまで会話（コミュニケーション）に徹してください。
6. **学習データの適用**: 文体（口調・リズム）は学習データに従いますが、内容は**この口コミへの個別返信**に徹してください。

【今回の口コミ内容（メモ）】:
"${config.inputText}"
${config.starRating ? `(評価: ★${config.starRating})` : ''}

【出力ルール・禁止事項（上書き）】:
- 解説や挨拶は不要。返信文のみを出力。
- **絵文字は一切使用禁止**（Googleマップの規約・マナー重視）。
- ハッシュタグは一切使用禁止。
- 3〜5行程度の簡潔な文章。
- 文体はペルソナ（または学習データ）に従うが、内容は「返信」に限定する。

【出力形式】:
要素1つのJSON配列（["返信本文"]）で出力。
`;
      return replyInstructions;
    }

    // --- Standard Mode (Omakase / Plain AI / Promotion) ---
    let standardInstructions = `
あなたは、${profile.region}にある${profile.industry}「${profile.name}」のSNS運用を担う「プロのライター」です。
ユーザーの「メモ」を元に、フォロワーや来店客を惹きつける魅力的で自然な文章を作成してください。

【基本設定】:
- 店名: ${profile.name}
- 業種: ${profile.industry}
- 地域: ${profile.region}
- 店舗概要: ${profile.description || "なし"}

【執筆ルール】:
- 解説や挨拶は一切抜き。投稿文のみを出力。
- 希望の長さ [**${config.length}**] に合わせて構成。
- **視覚的な読みやすさ（重要）**: 2〜3文ごとに改行を入れ、内容の区切りには空行（1行あき）を設けてください。
- Instagramの場合は、文末に4-6個の関連ハッシュタグを追加。
- X (Twitter)の場合は、ハッシュタグは最小限（1〜2個程度、最大3個まで）に留めてください。

【ビジュアル・構成イメージ】:
リード文（キャッチーに）
（空行）
詳細やこだわり
（空行）
予約やアクセスの案内

【スタイル・記号のルール】:
- **感嘆符（！や！）と絵文字の併用禁止**: 文末は「！✨」とせず、「！」または「✨」のどちらか一方のみを使用してください。
- ${config.includeEmojis !== false ? '絵文字を適度に使用し、明るい雰囲気に。' : '絵文字は使用しないでください。'}
- ${config.includeSymbols ? `以下のパレットの記号を効果的に使用して、プレミアムな雰囲気を演出してください：\n${DECORATION_PALETTE}` : '特殊な記号（✧や✄等）は使用しないでください。'}

【今回のメモ】:
"${config.inputText}"

【出力形式】:
要素1つのJSON配列（["本文"]）で出力。
`;

    if (config.platform === Platform.GoogleMaps) {
      standardInstructions += `
\n【Googleマップ特記事項（重要）】:
- 口コミへの返信です。丁寧で真摯な言葉遣いで。
- **謙譲語の徹底**: お客様が「店員さん」「奥様」と書かれていても、返信では「スタッフ」「妻」と謙譲語に変換してください。
- **地域への配慮**: お客様が旅行者であると明記していない限り、「〇〇にお越しの際は」等の遠方者向け挨拶は避け、「またのご来店をお待ちしております」等の汎用メッセージを使用してください。
- ※絵文字・ハッシュタグは一切使用禁止。
`;
    }

    return standardInstructions;
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

  // Check if there's a persona active (custom prompt or samples)
  const hasPersona = !!(config.customPrompt || (config.post_samples && Object.keys(config.post_samples).length > 0));
  const sampleText = config.post_samples?.[config.platform] || Object.values(config.post_samples || {})[0] || "";

  const systemInstruction = `
You are an AI editor refining a social media post for "${profile.name}".
Original Platform: ${config.platform}
Tone: ${config.tone}

${hasPersona ? `
**CRITICAL: PERSONA PRESERVATION MODE (Must Follow)**
The original text is written in a specific STRONG PERSONA (e.g., dialect, specific slang like "ンゴ/クレメンス", unique sentence endings).
You must **PRESERVE THE ORIGINAL VOICE 100%**.
- **DO NOT** normalize the text to standard/polite Japanese.
- **DO NOT** remove slang, informal endings, or specific character quirks.
- **DO NOT** change the rhythm or density of symbols unless explicitly asked.
- **ONLY** make changes required by the user's specific instruction.

**Reference Style (Sample)**:
"${sampleText}"
` : `
**Role**: You are a minimal interference editor. 
- Maintain the original "Voice" and "Vibe" of the text exactly. 
- If the original uses slang or casual language, KEEP IT.
- If the original is formal, KEEP IT.
- Do NOT rewrite the entire post; only modify the parts necessary to fulfill the instruction.
`}

**Formatting Rules:**
1. ${config.platform === Platform.X && config.xConstraint140 ? "MUST be under 140 characters." : ""}
2. If Instagram: Keep hashtags.
3. ${config.platform === Platform.GoogleMaps ? "If Google Maps: Do NOT use emojis." : ""}

**Style Constraint (CRITICAL):**
- **Do NOT combine exclamation marks (! or ！) with emojis at the end of a sentence.**
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
