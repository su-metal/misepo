
import { Platform, PostPurpose, GoogleMapPurpose, Tone, Length, StoreProfile, AppMode } from './types';

// Vertical SaaS Mode Switch
export const IS_HOSPITALITY_MODE = true; // Set to true for Hospitality Mode

// Color Palette Definitions
export const COLORS = {
  // 指定配色：スカイ・フレッシュ・ブルー
  primary: "#0071b9",        // メインブルー (Brand Blue)
  accent: "#C6DCE8",         // 薄い水色 (Lighter Blue)
  navy: "#122646",           // テキストカラー (Deep Indigo Text)
  navyDeep: "#0D1B32",       // さらに深い紺
  
  // 既存マッピングの互換性維持
  gold: "#0071b9",           // 以前のゴールド箇所をメインブルーへ
  goldDark: "#005a94",       
  
  slate: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    900: "#0F172A",
  },
  indigo_palette: {
    50: "#EEF2FF",
    100: "#E0E7FF",
    500: "#6366F1",
    600: "#4F46E5",
    700: "#4338CA",
    900: "#312E81",
    950: "#1E1B4B",
  }
};

export const MODE_CONFIG = {
  [AppMode.Standard]: {
    customerLabel: "お客様",
    visitLabel: "来店",
    ownerLabel: "店主",
    primaryColor: COLORS.primary,
    accentColor: COLORS.accent,
    bgHighlight: `bg-[${COLORS.primary}]/10`,
    textHighlight: `text-[${COLORS.primary}]`,
    name: "MisePo",
  },
  [AppMode.Hospitality]: {
    customerLabel: "ゲスト様",
    visitLabel: "ご宿泊・ご来館",
    ownerLabel: "支配人/スタッフ",
    primaryColor: COLORS.navy,
    accentColor: COLORS.gold,
    bgHighlight: `bg-[${COLORS.gold}]/10`,
    textHighlight: `text-[${COLORS.gold}]`,
    name: "MisePo Hospitality",
  }
};

export const CURRENT_MODE = IS_HOSPITALITY_MODE ? AppMode.Hospitality : AppMode.Standard;
export const UI = MODE_CONFIG[CURRENT_MODE];

// Design System Tokens
export const TOKENS = {
  container: IS_HOSPITALITY_MODE 
    ? `bg-white rounded-[32px] border border-blue-50 shadow-[0_12px_24px_rgba(0,0,0,0.04)]` 
    : `bg-white rounded-[48px] border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`,
  
  card: IS_HOSPITALITY_MODE
    ? `bg-white rounded-[20px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-500`
    : `bg-white rounded-[32px] border-[2px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all`,

  cardActionable: IS_HOSPITALITY_MODE
    ? `bg-white rounded-[16px] border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`
    : `bg-white rounded-2xl border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all`,

  input: IS_HOSPITALITY_MODE
    ? `bg-slate-50/50 border border-slate-200 focus:border-[${COLORS.primary}] focus:bg-white focus:ring-4 focus:ring-[${COLORS.primary}]/10 rounded-xl transition-all`
    : `bg-white border-[3px] border-black rounded-2xl focus:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all`,

  buttonPrimary: IS_HOSPITALITY_MODE
    ? `bg-[${COLORS.primary}] text-white border border-[${COLORS.primary}]/10 shadow-md hover:-translate-y-0.5 active:scale-95 transition-all rounded-xl`
    : `bg-[${COLORS.primary}] text-black border-[3px] border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:scale-95 transition-all rounded-2xl`,

  buttonSecondary: IS_HOSPITALITY_MODE
    ? `bg-[${COLORS.accent}]/40 text-[${COLORS.navy}] hover:bg-[${COLORS.accent}]/60 active:scale-95 transition-all rounded-xl`
    : `bg-[${COLORS.accent}] text-black border-[3px] border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:scale-95 transition-all rounded-2xl`,

  buttonGhost: IS_HOSPITALITY_MODE
    ? `bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all`
    : `bg-black/5 text-black/40 hover:text-black hover:bg-black/10 rounded-xl transition-all`,
  
  badge: IS_HOSPITALITY_MODE
    ? `bg-[${COLORS.accent}]/40 text-[${COLORS.navy}] border border-[${COLORS.accent}]/60 rounded-lg font-bold`
    : `bg-[#9B8FD4] text-black border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-black`,
};

export const INDUSTRIES = IS_HOSPITALITY_MODE 
  ? ['旅館・ホテル', '飲食店', 'カフェ', '居酒屋', '美容室', 'ネイル・まつげ', 'エステ・サロン', '整体・接骨院', 'ジム', '小売', 'その他']
  : ['飲食店', 'カフェ', '居酒屋', '美容室', 'ネイル・まつげ', 'エステ・サロン', '旅館・ホテル', '整体・接骨院', 'ジム', '小売', 'その他'];

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
