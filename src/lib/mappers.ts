import { Platform, StoreProfile, GeneratedPost, GeneratedResult, Length, Tone, PostPurpose, GoogleMapPurpose } from '../types';

export function normalizeStoreProfile(profile: any): StoreProfile | null {
  if (!profile || typeof profile !== 'object') return null;
  return {
    industry: profile.industry || 'その他',
    name: profile.name || '',
    region: profile.region || '',
    description: profile.description || '',
    instagramFooter: profile.instagramFooter || profile.instagram_footer || '',
  };
}

export function normalizePlatform(value: unknown): Platform {
  if (value === 'Instagram') return Platform.Instagram;
  if (value === 'X (Twitter)') return Platform.X;
  if (value === 'Google Maps') return Platform.GoogleMaps;
  return Platform.Instagram;
}

export function normalizeResults(raw: any, fallbackPlatform: Platform): GeneratedResult[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((r: any) => ({
      platform: normalizePlatform(r.platform || fallbackPlatform),
      data: Array.isArray(r.data) ? r.data : [String(r.data || '')],
    }));
  }
  return [];
}

export function mapHistoryEntry(entry: any): GeneratedPost {
  const config = entry.config || {};
  return {
    id: entry.id?.toString() || crypto.randomUUID(),
    timestamp: entry.created_at ? new Date(entry.created_at).getTime() : Date.now(),
    config: {
      platforms: Array.isArray(config.platforms) ? config.platforms.map(normalizePlatform) : [normalizePlatform(config.platform)],
      postPurpose: config.postPurpose || config.purpose || PostPurpose.Promotion,
      gmapPurpose: config.gmapPurpose || config.purpose || GoogleMapPurpose.Auto,
      tone: config.tone || Tone.Standard,
      length: config.length || Length.Medium,
      inputText: config.inputText || config.input_text || '',
      starRating: config.starRating || config.star_rating,
      language: config.language || 'Japanese',
      storeSupplement: config.storeSupplement || config.store_supplement,
      customPrompt: config.customPrompt || config.custom_prompt,
      includeSymbols: config.includeSymbols,
      includeEmojis: config.includeEmojis,
      xConstraint140: config.xConstraint140,
      instagramFooter: config.instagramFooter,
    },
    results: normalizeResults(entry.result || entry.results, normalizePlatform(config.platform)),
  };
}
