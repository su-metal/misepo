// Mock Enums to avoid import issues - Using const objects for better compatibility
const Platform = {
  Instagram: 'Instagram',
  Twitter: 'Twitter', 
  GoogleMaps: 'GoogleMaps'
};
const Tone = {
  Standard: 'Standard',
  Friendly: 'Friendly',
  Formal: 'Formal'
};
const Length = {
  short: 'short',
  medium: 'medium', 
  long: 'long'
};
const GoogleMapPurpose = {
  Reply: 'reply',
  Post: 'post',
  Apology: 'apology'
};

// Mock the dependencies
const mockProfile = {
  id: 'test-profile',
  name: '居酒屋 頑固親父',
  industry: 'Izakaya',
  region: 'Tokyo',
  description: 'A traditional Izakaya with a stubborn but warm-hearted owner.',
  posts: [
    { content: '今日はいい魚が入ったぞ！飲みに来いよな！🍺' },
    { content: 'うるせぇ！文句あるなら他行け！嘘だよ、待ってるぜw' }
  ]
};

// We need to import the function but it's not exported directly.
// For verification purposes, we'll manually reconstruct the prompt logic here 
// to match exactly what we implemented in geminiService.ts
// This serves as a "Golden Master" test.

const buildSystemInstruction = (config: any, profile: any, sample: string) => {
    const hasPersonaSamples = !!sample;
    
    let systemInstruction = `
【役割】
あなたは、以下の【過去の投稿ログ】の執筆者（店主）本人です。
AIとしてではなく、この人物になりきって、この人物の過去の言動・癖を完全にトレースして続きを書いてください。

【過去の投稿ログ（学習データ）】
--------------------------------------------------
${hasPersonaSamples ? sample : "（サンプルなし - 一般的な丁寧で親しみやすい店主として振る舞ってください）"}
--------------------------------------------------

【今回のメモ（ネタ）】
"${config.inputText}"

【執筆指示】
1. **文体と内容の役割分担**:
   - **【過去の投稿ログ】**は、あなたの**「代筆職人」**としての教科書です。文体、リズム、語尾、記号の使い癖を完璧にコピーしてください。
   - **【今回のメモ】**が内容の核ですが、メモが簡潔な場合は、サンプルの雰囲気を壊さない範囲で**店主らしい想いや詳細を豊かに膨らませて**書いてください。
   - ただし、サンプルにある特定の日付や固有名詞をそのまま使う「丸コピー」は避けてください。

2. **優先事項: 語尾の再現**:
   - サンプルの語尾（丁寧語/タメ口/方言など）の比率をそのまま真似てください。
   - 勝手に丁寧にしたり、勝手に崩したりせず、**サンプルの語尾をコピペする感覚**で書くこと。

${(() => {
    const currentSample = sample; // Renamed for clarity within this block
    const lines = currentSample.split('\n').filter(l => l.trim().length > 0);
    const totalLines = lines.length;
    if (totalLines === 0) return "";

    const densityRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}\u{2600}-\u{27BF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2B50}\u{2728}\u{2764}\u{2665}\u{263A}\u{3030}\u{303D}\u{00A9}\u{00AE}\u{2122}\u{203C}\u{2049}\u{20E3}\u{2139}\u{2194}-\u{2199}\u{21A9}-\u{21AA}\u{231A}-\u{231B}\u{2328}\u{23CF}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{24C2}\u{25AA}-\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}♡♪☆★◆◇△▽▶◀]/gu;
    const exclamationRegex = /[!！]/g;

    const linesWithEmoji = lines.filter(l => densityRegex.test(l)).length;
    const linesWithExclamation = lines.filter(l => exclamationRegex.test(l)).length;

    const emojiDensity = Math.round((linesWithEmoji / totalLines) * 100);
    const exclamationDensity = Math.round((linesWithExclamation / totalLines) * 100);

    const extractedEndings = new Set(lines.map(l => {
      const match = l.trim().match(/([^a-zA-Z0-9\sぁ-んァ-ヶー]{0,3}[ぁ-んァ-ヶー]{1,3}[^a-zA-Z0-9\sぁ-んァ-ヶー]{0,3})$/);
      return match ? match[1] : l.slice(-3);
    }));

    return `
3. **[CRITICAL] Style Profile**:
   - **絵文字・記号密度**: ${emojiDensity}%
   - **「！」密度**: ${exclamationDensity}%
   - **命令**: この比率を±10%で厳守し、記号や絵文字（♡♪☆等）の使い癖を再現してください。

4. **長さの指定**:
   - ユーザー希望: **"${config.length}"**
   - **Short**: 要点のみ。サンプルの最短部分に合わせる。
   - **Standard**: 1つのストーリー。背景や想いも交え、読み応えのある分量にする。
   - **Long**: 詳細な情景描写。情熱的に、たっぷりと深掘りして綴る。

5. **厳格な制限**:
   - **特定語尾の「リピート禁止」**: 「〜ですよ」等の説明的な語尾は1投稿内で最大2回まで。同じ語尾の連続使用は厳禁。
   - **語尾リスト（これらをローテーション）**: ${Array.from(extractedEndings).join(', ')}
   - **純粋な代筆**: 余計な挨拶（「こんにちは」等）はサンプルになければ書かない。
`;
})()}

5. 出力は必ず「要素1つのJSON配列（["本文"]）」の形式にしてください。
`;

    if (config.platform === 'GoogleMaps') {
       systemInstruction += `\n
【Googleマップ特記事項】
- 口コミへの返信です。
- サンプルのトーン（距離感）を維持しつつ、お客様への感謝や（必要な場合は）謝罪の意を示してください。
- 以前のAIのような「へりくだりすぎた敬語」は禁止です。店主らしい等身大の言葉で返信してください。
`;
    }

    return systemInstruction;
};

// Test Case 1: Loud Persona (short length)
const sampleLoud = `
・今日も最高！✨
・見てくださいこのツヤ！！💖
・明日は休みだー！楽しみ！！💪
`;
const configLoud = {
    platform: Platform.Instagram,
    inputText: '新作できた',
    length: Length.short,
    tone: Tone.Standard,
    includeEmojis: true
};

console.log("=== TEST 1: Loud Persona (short) ===");
console.log(buildSystemInstruction(configLoud as any, mockProfile, sampleLoud));

// Test Case 2: Quiet Persona (medium length)
const sampleQuiet = `
・本日は定休日です。
・来週の予約を開始しました。
・雨が降っていますね。
`;
const configQuiet = {
    platform: Platform.Twitter,
    inputText: '臨時休業のお知らせ',
    length: Length.medium
};

console.log("\n=== TEST 2: Quiet Persona (medium) ===");
console.log(buildSystemInstruction(configQuiet as any, mockProfile, sampleQuiet));

// Test Case 3: Long Persona (long length)
const sampleLong = `
当店自慢のハンバーグについて。
愛知姫豚を100%使用しており、非常にジューシーです。
ソースは自家製のシャリアピンソースをかけています。
`;
const configLong = {
    platform: Platform.Instagram,
    inputText: 'ハンバーグのこだわり',
    length: Length.long
};

console.log("\n=== TEST 3: Long Persona (long) ===");
console.log(buildSystemInstruction(configLong as any, mockProfile, sampleLong));
