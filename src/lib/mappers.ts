import { Platform, StoreProfile, GeneratedPost, GeneratedResult, Length, Tone, PostPurpose, GoogleMapPurpose } from '../types';

const isPostPurpose = (value: unknown): value is PostPurpose => {
  return typeof value === 'string' && Object.values(PostPurpose).includes(value as PostPurpose);
};

const isGoogleMapPurpose = (value: unknown): value is GoogleMapPurpose => {
  return typeof value === 'string' && Object.values(GoogleMapPurpose).includes(value as GoogleMapPurpose);
};

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
  if (value === 'Official LINE' || value === 'LINE') return Platform.Line;
  if (value === 'Google Maps') return Platform.GoogleMaps;
  return Platform.Instagram;
}

export function normalizeResults(raw: any, fallbackPlatform: Platform): GeneratedResult[] {
  if (!raw) return [];
  
  const results: { platform: Platform; data: string[] }[] = [];
  const groups: Map<Platform, string[]> = new Map();

  const addResult = (platformValue: any, dataItems: any[]) => {
    const platform = normalizePlatform(platformValue);
    const strings = dataItems.map(String).filter(s => s.trim().length > 0);
    if (strings.length === 0) return;
    
    const existing = groups.get(platform) || [];
    groups.set(platform, [...existing, ...strings]);
  };

  // Handle string (single result stored as string)
  if (typeof raw === 'string') {
    addResult(fallbackPlatform, [raw]);
  }
  // Handle array
  else if (Array.isArray(raw)) {
    raw.forEach((r: any) => {
      if (typeof r === 'string') {
        addResult(fallbackPlatform, [r]);
      } else if (r && typeof r === 'object') {
        addResult(r.platform || fallbackPlatform, Array.isArray(r.data) ? r.data : (r.data ? [r.data] : []));
      }
    });
  }
  // Handle structured object (from Gemini service result: { analysis, posts })
  else if (raw && typeof raw === 'object') {
    if (Array.isArray(raw.posts)) {
      addResult(fallbackPlatform, raw.posts);
    }
  }

  groups.forEach((data, platform) => {
    results.push({ platform, data });
  });
  
  return results;
}

export function mapHistoryEntry(entry: any): GeneratedPost {
  // The API saves input as {profile, config}, so unwrap if necessary
  const rawConfig = entry.config?.config || entry.config || {};
  // Results might be in entry.result (array of GeneratedResult) or entry.results
  const rawResults = entry.result || entry.results || [];
  const rawPurpose = rawConfig.purpose ?? rawConfig.postPurpose;
  const purpose = isPostPurpose(rawPurpose) || isGoogleMapPurpose(rawPurpose)
    ? rawPurpose
    : PostPurpose.Promotion;
  const gmapPurpose = isGoogleMapPurpose(rawConfig.gmapPurpose)
    ? rawConfig.gmapPurpose
    : (isGoogleMapPurpose(rawPurpose) ? rawPurpose : GoogleMapPurpose.Auto);
  
  return {
    id: entry.id?.toString() || crypto.randomUUID(),
    timestamp: typeof entry.timestamp === 'number' ? entry.timestamp : (entry.created_at ? new Date(entry.created_at).getTime() : Date.now()),
    config: {
      platforms: Array.isArray(rawConfig.platforms) ? rawConfig.platforms.map(normalizePlatform) : [normalizePlatform(rawConfig.platform)],
      purpose,
      gmapPurpose,
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
    isPinned: typeof entry.isPinned === 'boolean' ? entry.isPinned : Boolean(entry.is_pinned || rawConfig.isPinned),
  };
}
