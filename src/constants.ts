
import { Platform, PostPurpose, GoogleMapPurpose, Tone, Length, StoreProfile } from './types';

export const INDUSTRIES = [
  '飲食店', 'カフェ', '居酒屋', '美容室', 'ネイル・まつげ', 'エステ・サロン', '整体・接骨院', 'ジム', '小売', 'その他'
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
  name: 'サンプル店',
  region: '日本',
  description: 'これはサンプルです。',
};

export const DEMO_SAMPLE_TEXT = "明日から秋限定の栗パフェを販売します。\n価格は1200円、1日20食限定です。";

export const LOADING_TIPS = [
  "💡 店舗設定の「よく言われること」に『駅から徒歩5分』などの強みを入れると、来店促進につながります。",
  "💡 Instagram用にハッシュタグも自動生成されます。投稿前に確認して追加・削除が可能です。",
  "💡 美容系サロンなら、施術後の『お客様の笑顔』や『具体的な変化』を一言添えると予約率アップ！",
  "💡 ネイルやエステの場合、店内の香りや照明、リラックスできる空間作りについても触れてみましょう。",
  "💡 悪い口コミへの返信に困ったら、目的を「謝罪」や「補足」にして生成してみましょう。",
  "💡 「ストーリー」モードは、創業の想いやスタッフの日常など、ファンを増やす投稿に最適です。",
  "💡 生成された文章が長すぎる場合は、トーン設定の「長さ」を調整してみてください。",
  "💡 Proプランなら、英語や中国語でのインバウンド向け投稿もワンクリックで作成できます。",
  "💡 「親しみ」トーンを選ぶと、絵文字を使った柔らかい表現になります。"
];
