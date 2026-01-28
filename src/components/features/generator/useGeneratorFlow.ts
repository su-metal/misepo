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
  favorites: Set<string>;
  onToggleFavorite: (text: string, platform: Platform, presetId: string | null, replaceId?: string, source?: 'generated' | 'manual') => Promise<void>;
  restorePost?: GeneratedPost | null;
  resetResultsTrigger?: number;
}) {
  const { 
    storeProfile, isLoggedIn, onOpenLogin, onGenerateSuccess, 
    onTaskComplete, favorites, onToggleFavorite, restorePost, resetResultsTrigger 
  } = props;

  // --- State ---
  const [platforms, setPlatforms] = useState<Platform[]>([Platform.Instagram]);
  const [isMultiGenMode, setIsMultiGenMode] = useState<boolean>(false);
  const [postPurpose, setPostPurpose] = useState<PostPurpose>(PostPurpose.Auto);
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
  const [loadedPresetPrompts, setLoadedPresetPrompts] = useState<{ [key: string]: string }>({});
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
  const [includeEmojis, setIncludeEmojis] = useState<boolean>(true);
  
  const [currentPostSamples, setCurrentPostSamples] = useState<{ [key in Platform]?: string }>({});
  
  const [loading, setLoading] = useState(false);
  const [resultGroups, setResultGroups] = useState<ResultGroup[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Refinement state
  const [refiningKey, setRefiningKey] = useState<string | null>(null);
  const [refineText, setRefineText] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [isAutoFormatting, setIsAutoFormatting] = useState<{ [key: string]: boolean }>({});

  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  // Track if user manually changed toggles (to preserve their choice)
  const [userChangedEmoji, setUserChangedEmoji] = useState(false);
  const [userChangedSymbols, setUserChangedSymbols] = useState(false);

  // Initialize emoji/symbols based on default tone (only on first render)
  useEffect(() => {
    // Set default values based on initial tone
    if (tone === Tone.Formal) {
      setIncludeEmojis(false);
      setIncludeSymbols(false);
    } else {
      setIncludeEmojis(true);
      setIncludeSymbols(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps = run only once on mount

  // Wrapped setters that track manual changes
  const handleEmojiToggle = (value: boolean) => {
    setIncludeEmojis(value);
    setUserChangedEmoji(true);
  };

  const handleSymbolsToggle = (value: boolean) => {
    setIncludeSymbols(value);
    setUserChangedSymbols(true);
  };

  const handleToneChange = (newTone: Tone) => {
    setTone(newTone);
    
    // Only apply default values if user hasn't manually changed them
    if (!userChangedEmoji) {
      setIncludeEmojis(newTone !== Tone.Formal);
    }
    if (!userChangedSymbols) {
      setIncludeSymbols(false); // Always default to false for symbols
    }
  };

  // --- Logic ---

  const handleApplyPreset = (preset: Preset) => {
    if (preset.id === 'plain-ai') {
      // Full reset to default state
      setCustomPrompt('');
      setLoadedPresetPrompts({});
      setCurrentPostSamples({});
      setPostPurpose(PostPurpose.Auto);
      setGmapPurpose(GoogleMapPurpose.Auto);
      setTone(Tone.Standard);
      setIncludeEmojis(true);
      setIncludeSymbols(false);
      setXConstraint140(true);
      setActivePresetId(null);
    } else {
      // Apply preset (even if it's the same one - keep it applied)
      let initialPrompts: { [key: string]: string } = {};
      try {
          if (preset.custom_prompt?.trim().startsWith('{')) {
              const parsed = JSON.parse(preset.custom_prompt);
              
              // Migration: If 'General' exists, copy to all platforms
              if (parsed['General']) {
                [Platform.X, Platform.Instagram, Platform.Line, Platform.GoogleMaps].forEach(p => {
                  if (!parsed[p]) parsed[p] = parsed['General'];
                });
                delete parsed['General'];
              }
              initialPrompts = parsed;
          } else {
              // Legacy string: Apply to all
              const legacyVal = preset.custom_prompt || '';
              [Platform.X, Platform.Instagram, Platform.Line, Platform.GoogleMaps].forEach(p => {
                initialPrompts[p] = legacyVal;
              });
          }
      } catch (e) {
          const legacyVal = preset.custom_prompt || '';
          [Platform.X, Platform.Instagram, Platform.Line, Platform.GoogleMaps].forEach(p => {
            initialPrompts[p] = legacyVal;
          });
      }
      setLoadedPresetPrompts(initialPrompts);

      // We intentionaly DO NOT set customPrompt here anymore.
      // This keeps the UI textarea empty for the user to add "one-off" instructions.
      // The preset prompts are merged internally during performGeneration.
      setCustomPrompt('');

      // Legacy post_samples are ignored to ensure only the 'Learning Data List' is used.
      setCurrentPostSamples({}); 
      setActivePresetId(preset.id);

      // Reset stylistic settings to "neutral/plain" state when a preset is applied.
      // This prevents "locked" state from leaking previous styles (e.g. Emoji OFF from Formal tone).
      setTone(Tone.Standard);
      setIncludeEmojis(true);
      setIncludeSymbols(false);
    }
  };

  const handleStarRatingChange = (rating: number) => {
    setStarRating(rating);
    setGmapPurpose(GoogleMapPurpose.Auto);
  };

  const handleSetActivePlatform = (p: Platform) => {
    if (isMultiGenMode) {
      if (p === Platform.GoogleMaps) {
        setPlatforms([Platform.GoogleMaps]);
        setIsMultiGenMode(false);
        setIncludeEmojis(false);
        setIncludeSymbols(false);
        // Switch prompt to GMap specific
        // setCustomPrompt(loadedPresetPrompts[Platform.GoogleMaps] || '');
      } else {
        // If it's X, Instagram, or LINE and we're in multi-gen, keep current multi platforms
        setPlatforms(platforms);
      }
    } else {
      setPlatforms([p]);
      if (p === Platform.GoogleMaps) {
        setIncludeEmojis(false);
        setIncludeSymbols(false);
      }
      
      // Update customPrompt for single platform selection mode
      // setCustomPrompt(loadedPresetPrompts[p] || '');
    }
  };

  const handlePlatformToggle = (p: Platform) => {
    if (p === Platform.GoogleMaps) {
      setPlatforms([Platform.GoogleMaps]);
      setIsMultiGenMode(false);
      setIncludeEmojis(false);
      setIncludeSymbols(false);
      // setCustomPrompt(loadedPresetPrompts[Platform.GoogleMaps] || '');
      return;
    }

    if (platforms.includes(Platform.GoogleMaps)) {
      setPlatforms([p]);
      setIsMultiGenMode(false);
      // setCustomPrompt(loadedPresetPrompts[p] || '');
      return;
    }

    if (isMultiGenMode) {
      if (platforms.includes(p)) {
        if (platforms.length > 1) {
          const nextPlatforms = platforms.filter(x => x !== p);
          setPlatforms(nextPlatforms);
          if (nextPlatforms.length === 1) {
             setIsMultiGenMode(false);
             // Switched to single mode, update prompt
             // setCustomPrompt(loadedPresetPrompts[nextPlatforms[0]] || '');
          }
        }
      } else {
        setPlatforms(prev => [...prev, p]);
      }
    } else {
      setPlatforms([p]);
      // setCustomPrompt(loadedPresetPrompts[p] || '');
    }
  };

  const handleToggleMultiGen = () => {
    const nextMode = !isMultiGenMode;
    setIsMultiGenMode(nextMode);
    if (nextMode) {
      setPlatforms([Platform.X, Platform.Instagram, Platform.Line]);
      // Multi-gen ON: Switch to first of the three
      // setCustomPrompt(loadedPresetPrompts[Platform.X] || '');
    } else {
      if (platforms.length > 1) {
          const first = platforms[0];
          setPlatforms([first]);
          // Multi-gen OFF: Switch to First Platform prompt
          // setCustomPrompt(loadedPresetPrompts[first] || '');
      }
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

    const resultsPromises = targetPlatforms.map(async (p) => {
      const purpose = p === Platform.GoogleMaps ? gmapPurpose : postPurpose;
      
      // Resolve Platform-Specific Prompt
      // Merge System Prompt (from preset) and User Prompt (from UI textarea)
      let systemPrompt = loadedPresetPrompts[p] || '';
      let userPrompt = customPrompt.trim();
      
      let effectivePrompt = '';
      if (systemPrompt && userPrompt) {
          effectivePrompt = `${systemPrompt}\n\n---\n\n【今回の追加指示】\n${userPrompt}`;
      } else if (systemPrompt) {
          effectivePrompt = systemPrompt;
      } else {
          effectivePrompt = userPrompt;
      }

      const config: GenerationConfig = {
        platform: p,
        purpose,
        tone,
        length,
        inputText,
        starRating: p === Platform.GoogleMaps ? starRating : undefined,
        language,
        storeSupplement,
        customPrompt: effectivePrompt,
        xConstraint140,
        includeSymbols,
        includeEmojis,
        instagramFooter: (p === Platform.Instagram && includeFooter) ? storeProfile.instagramFooter : undefined,
        post_samples: currentPostSamples,
        presetId: activePresetId || undefined,
        gmapPurpose: (p === Platform.GoogleMaps) ? gmapPurpose : undefined
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            profile: storeProfile,
            config,
            save_history: targetPlatforms.length === 1,
            run_type: "generation",
            presetId: activePresetId
          }),
        });

        clearTimeout(timeoutId);
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error ?? "Generate failed");

        const content = (data.result as string[]).map(t => t.replace(/\\n/g, '\n').replace(/\\n/g, '\n').trim());
        
        let finalContent = content;
        if (p === Platform.Instagram && includeFooter && storeProfile.instagramFooter) {
          finalContent = content.map(text => insertInstagramFooter(text, storeProfile.instagramFooter!));
        }

        return { platform: p, data: finalContent, config, run_id: data.run_id?.toString() || null };
      } catch (e) {
        console.error(`Error generating for ${p}`, e);
        return null;
      }
    });

    const settledResults = await Promise.all(resultsPromises);
    
    settledResults.forEach(res => {
      if (res) {
        newGroups.push({ platform: res.platform, data: res.data, config: res.config });
        generatedResults.push({ platform: res.platform, data: res.data });
        if (res.run_id) latestRunId = res.run_id;
      }
    });

    setResultGroups(newGroups);
    if (!isRegeneration) setActiveTab(0);
    setLoading(false);

    if (isLoggedIn && !isRegeneration) {
      const historyConfig = {
        platforms: targetPlatforms,
        purpose: postPurpose,
        postPurpose, tone, length, inputText,
        starRating: starRating ?? undefined,
        language, storeSupplement, customPrompt,
        xConstraint140, includeSymbols, includeEmojis,
        instagramFooter: (targetPlatforms.includes(Platform.Instagram) && includeFooter) ? storeProfile.instagramFooter : undefined,
        presetId: activePresetId || undefined,
        gmapPurpose: targetPlatforms.includes(Platform.GoogleMaps) ? gmapPurpose : undefined
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
        isPinned: false,
      });
    }
    onTaskComplete();
    return true; // Indicate success for scrolling
  };

  const handleManualEdit = (gIdx: number, iIdx: number, text: string) => {
    setResultGroups(prev => {
      const next = [...prev];
      const nextData = [...next[gIdx].data];
      nextData[iIdx] = text.replace(/\\n/g, '\n').trim();
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

  const performRefine = async (gIdx: number, iIdx: number, overrideInstruction?: string) => {
    const instruction = overrideInstruction || refineText;
    if (!instruction.trim()) return;
    
    setLoading(true);
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
          instruction: instruction,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Refine failed");

      setResultGroups(prev => {
        const next = [...prev];
        const nextData = [...next[gIdx].data];
        nextData[iIdx] = data.result.replace(/\\n/g, '\n').replace(/\\n/g, '\n').trim();
        next[gIdx] = { ...next[gIdx], data: nextData };
        return next;
      });
      setRefiningKey(null);
      setRefineText("");
    } catch (e) {
      alert("再生成に失敗しました");
    } finally {
      setLoading(false);
      setIsRefining(false);
    }
  };

  const handleAutoFormat = async (gIdx: number, iIdx: number) => {
    const key = `${gIdx}-${iIdx}`;
    setIsAutoFormatting(prev => ({ ...prev, [key]: true }));
    try {
      await performRefine(gIdx, iIdx, "文体や内容は一切変えずに、スマホ画面で読みやすくなるように適宜記号や「改行」や「空白行（1行あけ）」をバランスよく使って整形してください。");
    } finally {
      setIsAutoFormatting(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleShare = async (platform: Platform, text: string) => {
    let message = "コピーしました！アプリを開きます";
    if (platform === Platform.Instagram) message = "コピー完了！貼り付けて投稿してください";
    else if (platform === Platform.GoogleMaps) message = "コピー完了！貼り付けて返信してください";
    else if (platform === Platform.Line) message = "コピー完了！LINEを開いて貼り付けましょう";

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
          if (storeProfile.googlePlaceId) {
            const query = encodeURIComponent(storeProfile.name || 'Store');
            window.open(`https://www.google.com/maps/search/?api=1&query=${query}&query_place_id=${storeProfile.googlePlaceId}`, "_blank");
          } else {
            // Fallback: Search by name if Place ID is missing
            const query = encodeURIComponent(storeProfile.name || '');
            if (query) {
              window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
            } else {
              window.open("https://business.google.com/", "_blank");
            }
          }
          break;
      }
    }, 1200);
  };

  // Restoration logic
  useEffect(() => {
    if (restorePost) {
      setPlatforms(restorePost.config.platforms);
      setIsMultiGenMode(restorePost.config.platforms.length > 1);
      // 'purpose' holds the active purpose value (Union type). Cast generic purpose to PostPurpose for state.
      setPostPurpose(restorePost.config.purpose as PostPurpose);
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
      setActiveTab(0);
    }
  }, [restorePost]);

  // Demo text logic removed as /generate is now auth-only

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
    tone, setTone: handleToneChange,
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
    includeSymbols, setIncludeSymbols: handleSymbolsToggle,
    includeEmojis, setIncludeEmojis: handleEmojiToggle,
    language, setLanguage,
    storeSupplement, setStoreSupplement,
    handlePlatformToggle,
    handleSetActivePlatform,
    handleToggleMultiGen,
    handleApplyPreset,
    performGeneration,
    handleManualEdit,
    handleToggleFooter,
    handleRefineToggle,
    performRefine,
    handleAutoFormat,
    isAutoFormatting,
    handleShare,
    activePresetId,
    favorites,
    onToggleFavorite
  };
}
