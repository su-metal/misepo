import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Platform, PostPurpose, GoogleMapPurpose, Tone, Length, 
  StoreProfile, GenerationConfig, GeneratedPost, Preset, GeneratedResult 
} from '../../../types';
import { DEMO_SAMPLE_TEXT, LOADING_TIPS } from '../../../constants';
import { insertInstagramFooter, removeInstagramFooter } from './utils';

export interface ResultGroup {
  platform: Platform;
  data: string[];
  config: GenerationConfig;
}

export function useGeneratorFlow(props: {
  storeProfile: StoreProfile;
  isLoggedIn: boolean;
  onOpenLogin: () => void;
  onGenerateSuccess: (post: GeneratedPost) => void;
  onTaskComplete: () => void;
  restorePost?: GeneratedPost | null;
  resetResultsTrigger?: number;
}) {
  const { 
    storeProfile, isLoggedIn, onOpenLogin, onGenerateSuccess, 
    onTaskComplete, restorePost, resetResultsTrigger 
  } = props;

  // --- State ---
  const [platforms, setPlatforms] = useState<Platform[]>([Platform.Instagram]);
  const [isMultiGenMode, setIsMultiGenMode] = useState<boolean>(false);
  const [postPurpose, setPostPurpose] = useState<PostPurpose>(PostPurpose.Promotion);
  const [gmapPurpose, setGmapPurpose] = useState<GoogleMapPurpose>(GoogleMapPurpose.Auto);
  const [starRating, setStarRating] = useState<number | null>(null);
  const [tone, setTone] = useState<Tone>(Tone.Standard);
  const [length, setLength] = useState<Length>(Length.Medium);
  const [inputText, setInputText] = useState('');
  const [xConstraint140, setXConstraint140] = useState<boolean>(true);
  const [includeFooter, setIncludeFooter] = useState<boolean>(true);
  const [language, setLanguage] = useState('Japanese');
  const [storeSupplement, setStoreSupplement] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
  const [includeEmojis, setIncludeEmojis] = useState<boolean>(true);
  
  const [loading, setLoading] = useState(false);
  const [resultGroups, setResultGroups] = useState<ResultGroup[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Refinement state
  const [refiningKey, setRefiningKey] = useState<string | null>(null);
  const [refineText, setRefineText] = useState("");
  const [isRefining, setIsRefining] = useState(false);

  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  // --- Logic ---

  const handleApplyPreset = (preset: Preset) => {
    if (activePresetId === preset.id) {
      setCustomPrompt('');
      setActivePresetId(null);
    } else {
      setCustomPrompt(preset.custom_prompt ?? '');
      setActivePresetId(preset.id);
    }
  };

  const handleStarRatingChange = (rating: number) => {
    setStarRating(rating);
    // Auto-judgment logic:
    // 4-5 stars -> Thanks
    // 1-2 stars -> Apology
    // 3 stars -> Thanks (usually neutral/minor issues)
    if (gmapPurpose === GoogleMapPurpose.Auto || gmapPurpose === GoogleMapPurpose.Thanks || gmapPurpose === GoogleMapPurpose.Apology) {
      if (rating >= 4) setGmapPurpose(GoogleMapPurpose.Thanks);
      else if (rating <= 2) setGmapPurpose(GoogleMapPurpose.Apology);
      else setGmapPurpose(GoogleMapPurpose.Thanks);
    }
  };

  const handlePlatformToggle = (p: Platform) => {
    if (!isLoggedIn && p !== Platform.Instagram) return;
    
    if (p === Platform.GoogleMaps) {
      setPlatforms([Platform.GoogleMaps]);
      setIsMultiGenMode(false);
      return;
    }

    if (platforms.includes(Platform.GoogleMaps)) {
      setPlatforms([p]);
      setIsMultiGenMode(false);
      return;
    }

    if (isMultiGenMode) {
      if (platforms.includes(p)) {
        if (platforms.length > 1) {
          const nextPlatforms = platforms.filter(x => x !== p);
          setPlatforms(nextPlatforms);
          if (nextPlatforms.length === 1) setIsMultiGenMode(false);
        }
      } else {
        setPlatforms(prev => [...prev, p]);
      }
    } else {
      setPlatforms([p]);
    }
  };

  const handleToggleMultiGen = () => {
    const nextMode = !isMultiGenMode;
    setIsMultiGenMode(nextMode);
    if (nextMode) {
      setPlatforms([Platform.Instagram, Platform.X]);
    } else {
      if (platforms.length > 1) setPlatforms([platforms[0]]);
    }
  };

  const saveAggregatedHistory = async (payload: {
    profile: StoreProfile;
    config: GeneratedPost["config"];
    result: GeneratedResult[];
    runType: string;
  }) => {
    try {
      const res = await fetch("/api/me/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: payload.profile,
          config: payload.config,
          result: payload.result,
          run_type: payload.runType,
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        return data.run_id?.toString();
      }
    } catch (err) {
      console.error("save aggregated history failed:", err);
    }
    return null;
  };

  const performGeneration = async (
    targetPlatforms: Platform[],
    isRegeneration: boolean = false
  ) => {
    if (!inputText.trim()) {
      alert('テキストを入力してください');
      return;
    }

    setLoading(true);
    if (!isRegeneration) setResultGroups([]);
    
    const generatedResults: GeneratedResult[] = [];
    const newGroups: ResultGroup[] = [];
    let latestRunId: string | null = null;

    for (const p of targetPlatforms) {
      const purpose = p === Platform.GoogleMaps ? gmapPurpose : postPurpose;
      const config: GenerationConfig = {
        platform: p,
        purpose,
        tone,
        length,
        inputText,
        starRating: p === Platform.GoogleMaps ? starRating : undefined,
        language,
        storeSupplement,
        customPrompt,
        xConstraint140,
        includeSymbols,
        includeEmojis,
        instagramFooter: (p === Platform.Instagram && includeFooter) ? storeProfile.instagramFooter : undefined
      };

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile: storeProfile,
            config,
            allowGuest: !isLoggedIn,
            save_history: targetPlatforms.length === 1,
            run_type: "generation",
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error ?? "Generate failed");

        const content = data.result as string[];
        latestRunId = data.run_id?.toString() || null;

        let finalContent = content;
        if (p === Platform.Instagram && includeFooter && storeProfile.instagramFooter) {
          finalContent = content.map(text => insertInstagramFooter(text, storeProfile.instagramFooter!));
        }

        const group = { platform: p, data: finalContent, config };
        newGroups.push(group);
        generatedResults.push({ platform: p, data: finalContent });
      } catch (e) {
        console.error(`Error generating for ${p}`, e);
      }
    }

    setResultGroups(newGroups);
    setLoading(false);

    if (isLoggedIn && !isRegeneration) {
      const historyConfig = {
        platforms: targetPlatforms,
        postPurpose, gmapPurpose, tone, length, inputText,
        starRating: starRating ?? undefined,
        language, storeSupplement, customPrompt,
        xConstraint140, includeSymbols, includeEmojis,
        instagramFooter: (targetPlatforms.includes(Platform.Instagram) && includeFooter) ? storeProfile.instagramFooter : undefined,
      };

      if (targetPlatforms.length > 1) {
        const aggregatedId = await saveAggregatedHistory({
          profile: storeProfile,
          config: historyConfig,
          result: generatedResults,
          runType: "generation",
        });
        latestRunId = aggregatedId ?? latestRunId;
      }

      onGenerateSuccess({
        id: latestRunId ?? `gen-${Date.now()}`,
        timestamp: Date.now(),
        config: historyConfig,
        results: generatedResults,
      });
    }
    onTaskComplete();
    return true; // Indicate success for scrolling
  };

  const handleManualEdit = (gIdx: number, iIdx: number, text: string) => {
    setResultGroups(prev => {
      const next = [...prev];
      const nextData = [...next[gIdx].data];
      nextData[iIdx] = text;
      next[gIdx] = { ...next[gIdx], data: nextData };
      return next;
    });
  };

  const handleToggleFooter = (gIdx: number, iIdx: number) => {
    const footer = storeProfile.instagramFooter;
    if (!footer) return;
    setResultGroups(prev => {
      const next = [...prev];
      const text = next[gIdx].data[iIdx];
      const newText = text.includes(footer) ? removeInstagramFooter(text, footer) : insertInstagramFooter(text, footer);
      const nextData = [...next[gIdx].data];
      nextData[iIdx] = newText;
      next[gIdx] = { ...next[gIdx], data: nextData };
      return next;
    });
  };

  const handleRefineToggle = (gIdx: number, iIdx: number) => {
    const key = `${gIdx}-${iIdx}`;
    if (refiningKey === key) {
      setRefiningKey(null);
      setRefineText("");
    } else {
      setRefiningKey(key);
      setRefineText("");
    }
  };

  const performRefine = async (gIdx: number, iIdx: number) => {
    if (!refineText.trim()) return;
    setIsRefining(true);
    const group = resultGroups[gIdx];
    try {
      const res = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: storeProfile,
          config: group.config,
          currentContent: group.data[iIdx],
          instruction: refineText,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Refine failed");

      setResultGroups(prev => {
        const next = [...prev];
        const nextData = [...next[gIdx].data];
        nextData[iIdx] = data.result;
        next[gIdx] = { ...next[gIdx], data: nextData };
        return next;
      });
      setRefiningKey(null);
      setRefineText("");
    } catch (e) {
      alert("再生成に失敗しました");
    } finally {
      setIsRefining(false);
    }
  };

  const handleShare = async (platform: Platform, text: string) => {
    let message = "コピーしました！アプリを開きます";
    if (platform === Platform.Instagram) message = "コピー完了！貼り付けて投稿してください";
    else if (platform === Platform.GoogleMaps) message = "コピー完了！貼り付けて返信してください";

    try {
      await navigator.clipboard.writeText(text);
      setToastMessage(message);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      alert("コピーに失敗しました");
    }

    setTimeout(() => {
      switch (platform) {
        case Platform.X:
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
          break;
        case Platform.Instagram:
          window.open("https://www.instagram.com/", "_blank");
          break;
        case Platform.GoogleMaps:
          window.open("https://business.google.com/", "_blank");
          break;
      }
    }, 1200);
  };

  // Restoration logic
  useEffect(() => {
    if (restorePost) {
      setPlatforms(restorePost.config.platforms);
      setIsMultiGenMode(restorePost.config.platforms.length > 1);
      setPostPurpose(restorePost.config.postPurpose);
      setGmapPurpose(restorePost.config.gmapPurpose);
      setTone(restorePost.config.tone);
      setLength(restorePost.config.length);
      setInputText(restorePost.config.inputText);
      setStarRating(restorePost.config.starRating ?? null);
      // Set includeFooter to false since restored results already have footer embedded
      setIncludeFooter(false);
      
      const reconstructed = restorePost.results.map(r => ({
        platform: r.platform,
        data: r.data,
        config: { ...restorePost.config, platform: r.platform } as any
      }));
      setResultGroups(reconstructed);
    }
  }, [restorePost]);

  useEffect(() => {
    if (!isLoggedIn) setInputText(DEMO_SAMPLE_TEXT);
  }, [isLoggedIn]);

  useEffect(() => {
    if (resetResultsTrigger) setResultGroups([]);
  }, [resetResultsTrigger]);

  // Real-time footer toggle effect
  useEffect(() => {
    const footer = storeProfile.instagramFooter;
    if (!footer) return;

    setResultGroups(prev => {
      let changed = false;
      const next = prev.map(group => {
        if (group.platform === Platform.Instagram) {
          const nextData = group.data.map(text => {
            if (includeFooter) {
              return insertInstagramFooter(text, footer);
            } else {
              return removeInstagramFooter(text, footer);
            }
          });
          if (JSON.stringify(nextData) !== JSON.stringify(group.data)) {
            changed = true;
            return { ...group, data: nextData };
          }
        }
        return group;
      });
      return changed ? next : prev;
    });
  }, [includeFooter, storeProfile.instagramFooter]);

  return {
    platforms, setPlatforms,
    isMultiGenMode, setIsMultiGenMode,
    postPurpose, setPostPurpose,
    gmapPurpose, setGmapPurpose,
    starRating, onStarRatingChange: handleStarRatingChange,
    tone, setTone,
    length, setLength,
    inputText, setInputText,
    loading, resultGroups,
    activeTab, setActiveTab,
    toastMessage,
    refiningKey,
    refineText, setRefineText,
    isRefining,
    customPrompt, setCustomPrompt,
    includeFooter, setIncludeFooter,
    xConstraint140, setXConstraint140,
    includeSymbols, setIncludeSymbols,
    includeEmojis, setIncludeEmojis,
    language, setLanguage,
    storeSupplement, setStoreSupplement,
    handlePlatformToggle,
    handleToggleMultiGen,
    handleApplyPreset,
    performGeneration,
    handleManualEdit,
    handleToggleFooter,
    handleRefineToggle,
    performRefine,
    handleShare,
    activePresetId
  };
}
