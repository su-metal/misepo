
import { Platform, PostPurpose, GoogleMapPurpose, Tone, Length, StoreProfile } from './types';

export const INDUSTRIES = [
  '飲食店', 'カフェ', '居酒屋', '美容室', 'ネイル・まつげ', 'エステ・サロン', '旅館・ホテル', '整体・接骨院', 'ジム', '小売', 'その他'
];

export const TARGET_AUDIENCES = [
  'お一人様', '働く人', 'ファミリー', '学生', 'カップル・夫婦', '女子会・ママ友', 'シニア', '地元の方・ご近所', '観光客・インバウンド'
];

export const POST_PURPOSES = [
  { value: PostPurpose.Promotion, label: '宣伝・告知', icon: '📢' },
  { value: PostPurpose.Story, label: 'ストーリー・感想', icon: '📖' },
  { value: PostPurpose.Educational, label: 'お役立ち情報', icon: '💡' },
  { value: PostPurpose.Engagement, label: '問いかけ・交流', icon: '💬' },
];

export const GMAP_PURPOSES = [
  { value: GoogleMapPurpose.Auto, label: '自動判定', icon: '🤖' },
  { value: GoogleMapPurpose.Thanks, label: 'お礼', icon: '🙏' },
  { value: GoogleMapPurpose.Apology, label: '謝罪', icon: '🙇' },
  { value: GoogleMapPurpose.Clarify, label: '補足説明', icon: 'ℹ️' },
];

export const TONES = [
  { value: Tone.Formal, label: 'きっちり' },
  { value: Tone.Standard, label: '標準' },
  { value: Tone.Friendly, label: '親しみ' },
];

export const LENGTHS = [
  { value: Length.Short, label: '短め' },
  { value: Length.Medium, label: '普通' },
  { value: Length.Long, label: '長め' },
];

export const LANGUAGES = [
  { value: 'Japanese', label: '日本語' },
  { value: 'English', label: 'English' },
  { value: 'Chinese (Simplified)', label: '简体中文' },
  { value: 'Chinese (Traditional)', label: '繁體中文' },
  { value: 'Korean', label: '한국어' },
  { value: 'Spanish', label: 'Español' },
];

export const GUEST_PROFILE: StoreProfile = {
  industry: 'その他',
  name: 'サンプル店舗',
  region: '日本',
  description: 'これはサンプルです。',
};

export const DEMO_SAMPLE_TEXT = "明日から秋限定の栗パフェを販売します。\n価格は1200円、1日20食限定です。";

export const LOADING_TIPS = [
  "💡 「AIプロファイル」を設定すると、あなたらしい文体をAIが学習して再現します。",
  "💡 「おまかせ」プリセットは、汎用的な丁寧な投稿を作成するのに適しています。",
  "💡 過去の投稿を「文体学習」に登録すると、絵文字の使い方や改行のクセまで再現されます。",
  "💡 投稿作成画面の「AIへの追加指示」で、「〜だワン！」「関西弁で」などの細かい指定も可能です。",
  "💡 Google Mapsの口コミ返信では、星評価に合わせて「お礼」や「謝罪」を自動で書き分けます。",
  "💡 生成された文章は、そのままSNSに貼り付ける前に微調整が可能です。",
  "💡 プロフィールの「活動地域」を入力すると、地元ネタや季節の話題を盛り込みやすくなります。",
  "💡 複数のSNS向けに同時生成も可能。それぞれのプラットフォームに最適な長さに調整されます。",
  "💡 AIが学習したスタイルは「プリセット」として保存し、いつでも切り替えられます。"
];

export const UI = {
  name: "MisePo",
};

export const TOKENS = {
  container: 'bg-white border-[3px] border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] rounded-3xl',
};
