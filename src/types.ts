declare global {
  interface Window {
    google: any;
  }
}

export enum Platform {
  X = 'X (Twitter)',
  Instagram = 'Instagram',
  Line = 'LINE',
  GoogleMaps = 'Google Maps',
  General = 'General'
}

export enum AppMode {
  Standard = 'Standard',
  Hospitality = 'Hospitality'
}

export enum PostPurpose {
  Auto = 'auto',
  Promotion = 'promotion',
  Story = 'story',
  Educational = 'educational',
  Engagement = 'engagement'
}

export enum GoogleMapPurpose {
  Auto = 'auto',
  Thanks = 'thanks',
  Apology = 'apology',
  Clarify = 'clarify',
  Info = 'info'
}

export enum Tone {
  Formal = 'formal',   // きっちり
  Standard = 'standard', // 標準
  Friendly = 'friendly',  // 親しみ
  Casual = 'casual' // もっと親しみ
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
  targetAudience?: string;
  instagramFooter?: string;
  googlePlaceId?: string;
  aiAnalysis?: string; // AI generated context for the store
  tailoredTopics?: TopicTemplate[]; // AI-optimized variety topics
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

  // Optional output controls
  language?: string;
  storeSupplement?: string; // Google Maps only
  customPrompt?: string; // User's manual instructions
  presetPrompt?: string; // System instructions from the active preset

  // Decoration Control
  includeSymbols?: boolean; // Whether to include decorative symbols
  includeEmojis?: boolean; // Whether to include emojis
  gmapPurpose?: GoogleMapPurpose; // Explicit purpose for Google Maps (Reply vs Promotion)
  
  // Platform specific
  xConstraint140?: boolean; // X (Twitter) only
  instagramFooter?: string; // New: Footer text to append
  post_samples?: { [key in Platform]?: string }; // Passed from active preset
  persona_yaml?: string | null; // Can be a monolithic YAML string (Legacy) OR a serialized JSON string `{ [key in Platform]: string }`
  presetId?: string; // ID of the preset used for this generation
  targetAudience?: string; // Target audience override for this specific post
  question?: string; // Sommelier Question (Q&A mode)
  topicPrompt?: string; // The selected topic instruction (Q&A mode)
}

export interface GeneratedResult {
  platform: Platform;
  data: string[];
}

// Updated History Item Structure
export interface GeneratedPost {
  id: string;
  timestamp: number;
  config: Omit<GenerationConfig, 'platform'> & { platforms: Platform[] };
  results: GeneratedResult[];
  isPinned: boolean;
  profile?: StoreProfile; // Snapshot of the profile used at generation time
}

export interface TrainingItem {
  id: string;
  content: string;
  platform: Platform;
  presetId: string;
  createdAt: string;
  source?: 'generated' | 'manual'; // New: Distinguish origin
}

export interface Preset {
  id: string;
  name: string;
  avatar: string | null;
  custom_prompt: string | null;
  post_samples?: { [key in Platform]?: string }; // New: Few-shot learning samples per platform
  persona_yaml?: string | null; // New: Analyzed persona rules in YAML format
  sort_order: number;
  googlePlaceId?: string;
}

export interface UserPlan {
  isPro: boolean;
  canUseApp: boolean;
  eligibleForTrial: boolean;
  plan: string;
  status: string;
  trial_ends_at: string | null;
  // Usage Stats
  limit?: number;
  usage?: number;
  usage_period?: 'daily' | 'monthly';
}

export interface AppState {
  storeProfile: StoreProfile | null;
  history: GeneratedPost[];
  presets: Preset[];
  plan: UserPlan | null;
}

export interface TrendEvent {
    date: string; // "YYYY-MM-DD"
    title: string;
    icon: string; // Emoji
    description: string;
    prompt: string;
    hashtags: string[];
    isRecommended: boolean;
}
export interface TopicTemplate {
  title: string;
  description: string;
  prompt: string;
  question: string; // The specific question the AI Sommelier asks the owner
  icon: string;
  originalTitle?: string; // New: Track source to prevent duplicates
}
