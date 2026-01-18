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
  
  // Handle string (single result stored as string)
  if (typeof raw === 'string') {
    return [{
      platform: fallbackPlatform,
      data: [raw],
    }];
  }
  
  // Handle array
  if (Array.isArray(raw)) {
    return raw.map((r: any) => {
      // If item is a string, wrap it
      if (typeof r === 'string') {
        return {
          platform: fallbackPlatform,
          data: [r],
        };
      }
      // If item is an object with platform/data structure
      return {
        platform: normalizePlatform(r.platform || fallbackPlatform),
        data: Array.isArray(r.data) ? r.data : (r.data ? [String(r.data)] : []),
      };
    });
  }
  
  return [];
}

export function mapHistoryEntry(entry: any): GeneratedPost {
  // The API saves input as {profile, config}, so unwrap if necessary
  const rawConfig = entry.config?.config || entry.config || {};
  // Results might be in entry.result (array of GeneratedResult) or entry.results
  const rawResults = entry.result || entry.results || [];
  
  return {
    id: entry.id?.toString() || crypto.randomUUID(),
    timestamp: entry.created_at ? new Date(entry.created_at).getTime() : Date.now(),
    config: {
      platforms: Array.isArray(rawConfig.platforms) ? rawConfig.platforms.map(normalizePlatform) : [normalizePlatform(rawConfig.platform)],
      postPurpose: rawConfig.postPurpose || rawConfig.purpose || PostPurpose.Promotion,
      gmapPurpose: rawConfig.gmapPurpose || rawConfig.purpose || GoogleMapPurpose.Auto,
      tone: rawConfig.tone || Tone.Standard,
      length: rawConfig.length || Length.Medium,
      inputText: rawConfig.inputText || rawConfig.input_text || '',
      starRating: rawConfig.starRating || rawConfig.star_rating,
      language: rawConfig.language || 'Japanese',
      storeSupplement: rawConfig.storeSupplement || rawConfig.store_supplement,
      customPrompt: rawConfig.customPrompt || rawConfig.custom_prompt,
      includeSymbols: rawConfig.includeSymbols,
      includeEmojis: rawConfig.includeEmojis,
      xConstraint140: rawConfig.xConstraint140,
      instagramFooter: rawConfig.instagramFooter,
    },
    results: normalizeResults(rawResults, normalizePlatform(rawConfig.platform)),
  };
}
