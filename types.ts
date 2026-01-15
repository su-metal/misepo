
export enum Platform {
  X = 'X (Twitter)',
  Instagram = 'Instagram',
  GoogleMaps = 'Google Maps'
}

export enum PostPurpose {
  Promotion = 'promotion',
  Story = 'story',
  Educational = 'educational',
  Engagement = 'engagement'
}

export enum GoogleMapPurpose {
  Auto = 'auto',
  Thanks = 'thanks',
  Apology = 'apology',
  Clarify = 'clarify'
}

export enum Tone {
  Formal = 'formal',   // きっちり
  Standard = 'standard', // 標準
  Friendly = 'friendly'  // 親しみ
}

export enum Length {
  Short = 'short',
  Medium = 'medium',
  Long = 'long'
}

export type RiskTier = 'low' | 'medium' | 'high' | 'critical';

export interface StoreProfile {
  industry: string;
  name: string;
  region: string;
  description?: string;
  instagramFooter?: string; // New: Fixed footer text for Instagram
}

// Configuration for a single API generation call
export interface GenerationConfig {
  platform: Platform;
  purpose: PostPurpose | GoogleMapPurpose;
  tone: Tone;
  length: Length;
  inputText: string;
  
  // New: Google Maps Star Rating (1-5)
  starRating?: number | null;

  // Pro features
  language?: string;
  storeSupplement?: string; // Google Maps only
  customPrompt?: string;
  
  // Decoration Control (Pro features)
  includeSymbols?: boolean; // e.g., ✦, ▷
  includeEmojis?: boolean; // e.g., ✨, 😊
  
  // Platform specific
  xConstraint140?: boolean; // X (Twitter) only
  instagramFooter?: string; // New: Footer text to append
}

export interface GeneratedResult {
  platform: Platform;
  data: string[];
}

// Updated History Item Structure
export interface GeneratedPost {
  id: string;
  timestamp: number;
  config: {
    platforms: Platform[];
    postPurpose: PostPurpose;
    gmapPurpose: GoogleMapPurpose;
    tone: Tone;
    length: Length;
    inputText: string;
    starRating?: number | null; // Added
    language?: string;
    storeSupplement?: string;
    customPrompt?: string;
    includeSymbols?: boolean;
    includeEmojis?: boolean;
    xConstraint140?: boolean;
    instagramFooter?: string;
  };
  results: GeneratedResult[];
}

export interface Preset {
  id: string;
  name: string;
  custom_prompt: string | null;
  sort_order: number;
}

export interface AppState {
  isPro: boolean;
  storeProfile: StoreProfile | null;
  history: GeneratedPost[];
  presets: Preset[];
}
