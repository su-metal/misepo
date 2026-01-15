
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Platform, PostPurpose, GoogleMapPurpose, Tone, Length,
  StoreProfile, GenerationConfig, GeneratedPost, Preset, GeneratedResult
} from '../types';
import {
  POST_PURPOSES, GMAP_PURPOSES, TONES, LENGTHS, LANGUAGES, LOADING_TIPS, DEMO_SAMPLE_TEXT
} from '../constants';
import InputControlButtons from './InputControlButtons';
import {
  XIcon, InstagramIcon, GoogleMapsIcon, CloseIcon, HelpIcon,
  MegaphoneIcon, BookOpenIcon, LightbulbIcon, ChatHeartIcon,
  AutoSparklesIcon, HandHeartIcon, ApologyIcon, InfoIcon, SparklesIcon,
  LockIcon, StarIcon, ChevronDownIcon, BookmarkIcon
} from './Icons';
import SocialPreview from './SocialPreview';
import PresetModal from './PresetModal';
import GuestTour from './GuestTour';
import FreeLimitReached from './FreeLimitReached';

interface PostGeneratorProps {
  storeProfile: StoreProfile;
  isLoggedIn: boolean;
  onOpenLogin: () => void;
  dailyUsageCount: number;
  isPro: boolean;
  presets: Preset[];
  refreshPresets: () => Promise<void>;
  onGenerateSuccess: (post: GeneratedPost) => void;
  retryCount: number;
  onTaskComplete: () => void;
  onRetryComplete: () => void;
  restorePost?: GeneratedPost | null;
  onTryUpgrade?: () => void;
  onOpenGuide?: () => void;
  resetResultsTrigger?: number;
  shouldShowTour?: boolean;
  onConsumeCredit: () => void;
}

interface ResultGroup {
  platform: Platform;
  data: string[];
  config: GenerationConfig;
}

// --- Icons (UI Specific) ---
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
);
const CrownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
);
const MagicWandIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" /><path d="m14 7 3 3" /><path d="M5 6v4" /><path d="M19 14v4" /><path d="M10 2v2" /><path d="M7 8H3" /><path d="M21 16h-4" /><path d="M11 3H9" /></svg>
);
const RotateCcwIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" /><path d="M3 3v9h9" /></svg>
);
const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" x2="21" y1="14" y2="3" /></svg>
);
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
);
const getPlatformIcon = (p: Platform) => {
  switch (p) {
    case Platform.X: return <XIcon className="w-4 h-4" />;
    case Platform.Instagram: return <InstagramIcon className="w-4 h-4" />;
    case Platform.GoogleMaps: return <GoogleMapsIcon className="w-4 h-4" />;
    default: return null;
  }
};

// --- Footer Helper Functions ---
const insertInstagramFooter = (text: string, footer: string): string => {
  const hashtagBlockRegex = /(\n\s*(?:#[^\s#]+\s*)+)$/;
  const match = text.match(hashtagBlockRegex);

  if (match && match.index !== undefined) {
    const body = text.substring(0, match.index).trimEnd();
    const tags = match[0].trim();
    return `${body}\n\n${footer}\n\n${tags}`;
  }
  return `${text.trimEnd()}\n\n${footer}`;
};

const removeInstagramFooter = (text: string, footer: string): string => {
  if (!text.includes(footer)) return text;
  let newText = text.replace(footer, '');
  newText = newText.replace(/\n{3,}/g, '\n\n');
  return newText.trim();
};

const AutoResizingTextarea = ({
  value,
  onChange,
  className,
  placeholder
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  placeholder?: string;
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = ref.current.scrollHeight + 'px';
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      className={className}
      placeholder={placeholder}
      rows={1}
      spellCheck={false}
      style={{ overflow: 'hidden' }}
    />
  );
};

const CharCounter: React.FC<{ platform: Platform; text: string; config?: GenerationConfig }> = ({ platform, text, config }) => {
  const length = text.length;
  let limit: number | null = null;
  let isError = false;
  let isWarning = false;

  if (platform === Platform.X) {
    const isLimited = config?.xConstraint140 !== false;
    if (isLimited) {
      limit = 140;
      isError = length > limit;
    }
  } else if (platform === Platform.Instagram) {
    limit = 2200;
    isWarning = length > limit;
  }

  return (
    <div className={`text-xs font-mono mt-2 text-right transition-colors ${isError ? 'text-red-500 font-bold' :
      isWarning ? 'text-amber-500 font-bold' : 'text-gray-400'
      }`}>
      {length.toLocaleString()} {limit ? `/ ${limit.toLocaleString()}` : 'chars'}
    </div>
  );
};

// --- Quick Presets are the top-ranked presets by user order ---

const PostGenerator: React.FC<PostGeneratorProps> = ({
  storeProfile,
  isLoggedIn,
  onOpenLogin,
  dailyUsageCount,
  isPro,
  presets,
  refreshPresets,
  onGenerateSuccess,
  retryCount,
  onTaskComplete,
  onRetryComplete,
  restorePost,
  onTryUpgrade,
  onOpenGuide,
  resetResultsTrigger,
  shouldShowTour,
  onConsumeCredit
}) => {
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
  const [toneDecorations, setToneDecorations] = useState<Partial<Record<Tone, { includeEmojis: boolean; includeSymbols: boolean }>>>({});
  const [serverRemainingCredits, setServerRemainingCredits] = useState<number | null>(null);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [refiningKey, setRefiningKey] = useState<string | null>(null);
  const [refineText, setRefineText] = useState('');
  const [refiningLoading, setRefiningLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultGroups, setResultGroups] = useState<ResultGroup[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const generateButtonRef = useRef<HTMLButtonElement>(null);
  const instagramButtonRef = useRef<HTMLButtonElement>(null);
  const purposeRef = useRef<HTMLDivElement>(null);
  const styleRef = useRef<HTMLDivElement>(null);
  const [showGuestTour, setShowGuestTour] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewModal, setPreviewModal] = useState<{ platform: Platform, text: string } | null>(null);

  // Track active preset context for editing/saving
  const isMap = platforms.includes(Platform.GoogleMaps);
  const isXOnly = platforms.length === 1 && platforms.includes(Platform.X);
  const MAX_FREE_LIMIT = 5;
  const fallbackRemaining = Math.max(0, MAX_FREE_LIMIT - dailyUsageCount);
  const remainingCredits = isPro ? 9999 : (serverRemainingCredits ?? fallbackRemaining);
  const canGenerateNew = (isPro || remainingCredits > 0) && !loading;
  const canRegenerate = isLoggedIn && (isPro || retryCount < 2);
  const shouldShowFreeLimit = isLoggedIn && !isPro && remainingCredits <= 0;
  const shouldShowProHint = !isPro && !shouldShowFreeLimit && remainingCredits > 0;
  const hasResults = resultGroups.length > 0;
  const generateButtonLabel = '投稿を生成する';
  const quickPresets = presets.slice(0, 3);

  useEffect(() => {
    if (isMap && starRating !== null) {
      setGmapPurpose(GoogleMapPurpose.Auto);
    }
  }, [starRating, isMap]);

  useEffect(() => {
    const defaultDecorations = {
      includeEmojis: tone !== Tone.Formal,
      includeSymbols: false
    };
    const override = toneDecorations[tone];
    const next = override ?? defaultDecorations;
    setIncludeEmojis(next.includeEmojis);
    setIncludeSymbols(next.includeSymbols);
  }, [tone, toneDecorations]);

  useEffect(() => {
    if (!isLoggedIn) {
      setPlatforms([Platform.Instagram]);
      setPostPurpose(PostPurpose.Promotion);
      setInputText(DEMO_SAMPLE_TEXT);
      setServerRemainingCredits(null);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn || isPro) return;

    fetch("/api/usage/credits")
      .then(async (res) => {
        if (!res.ok) throw new Error("usage fetch failed");
        return res.json();
      })
      .then((data) => {
        if (data?.ok && typeof data.remaining === "number") {
          setServerRemainingCredits(data.remaining);
        }
      })
      .catch((err) => {
        console.warn("Unable to refresh remaining credits:", err);
      });
  }, [isLoggedIn, isPro]);

  useEffect(() => {
    if (shouldShowTour) {
      const timer = setTimeout(() => {
        setShowGuestTour(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [shouldShowTour]);

  useEffect(() => {
    if (storeProfile.instagramFooter) {
      setIncludeFooter(true);
    } else {
      setIncludeFooter(false);
    }
  }, [storeProfile.instagramFooter]);

  useEffect(() => {
    if (resetResultsTrigger && resetResultsTrigger > 0) {
      setResultGroups([]);
      setRefiningKey(null);
    }
  }, [resetResultsTrigger]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (loading) {
      setCurrentTipIndex(Math.floor(Math.random() * LOADING_TIPS.length));
      interval = setInterval(() => {
        setCurrentTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (loading || previewModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [loading, previewModal]);

  useEffect(() => {
    if (restorePost) {
      setPlatforms(restorePost.config.platforms);
      if (restorePost.config.platforms.length > 1) {
        setIsMultiGenMode(true);
      } else {
        setIsMultiGenMode(false);
      }

      setPostPurpose(restorePost.config.postPurpose);
      setGmapPurpose(restorePost.config.gmapPurpose);
      setStarRating(restorePost.config.starRating || null);
      setTone(restorePost.config.tone);
      setLength(restorePost.config.length);
      setInputText(restorePost.config.inputText);
      setLanguage(restorePost.config.language || 'Japanese');
      setStoreSupplement(restorePost.config.storeSupplement || '');
      setCustomPrompt(restorePost.config.customPrompt || '');
      const defaultDecorations = {
        includeEmojis: restorePost.config.tone !== Tone.Formal,
        includeSymbols: false
      };
      const restoredIncludeSymbols = restorePost.config.includeSymbols ?? defaultDecorations.includeSymbols;
      const restoredIncludeEmojis = restorePost.config.includeEmojis ?? defaultDecorations.includeEmojis;
      setXConstraint140(restorePost.config.xConstraint140 !== undefined ? restorePost.config.xConstraint140 : true);
      setIncludeSymbols(restoredIncludeSymbols);
      setIncludeEmojis(restoredIncludeEmojis);
      setIncludeFooter(!!restorePost.config.instagramFooter);
      setToneDecorations(prev => ({
        ...prev,
        [restorePost.config.tone]: {
          includeEmojis: restoredIncludeEmojis,
          includeSymbols: restoredIncludeSymbols
        }
      }));

      const reconstructedGroups: ResultGroup[] = restorePost.results.map(r => {
        const pConfig: GenerationConfig = {
          platform: r.platform,
          purpose: r.platform === Platform.GoogleMaps ? restorePost.config.gmapPurpose : restorePost.config.postPurpose,
          tone: restorePost.config.tone,
          length: restorePost.config.length,
          inputText: restorePost.config.inputText,
          starRating: restorePost.config.starRating,
          language: restorePost.config.language,
          storeSupplement: restorePost.config.storeSupplement,
          customPrompt: restorePost.config.customPrompt,
          xConstraint140: restorePost.config.xConstraint140,
          includeSymbols: restorePost.config.includeSymbols,
          includeEmojis: restorePost.config.includeEmojis,
          instagramFooter: restorePost.config.instagramFooter
        };

        return {
          platform: r.platform,
          data: r.data,
          config: pConfig
        };
      });
      setResultGroups(reconstructedGroups);

      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [restorePost]);

  const handleApplyPreset = (preset: Preset) => {
    setCustomPrompt(preset.custom_prompt ?? '');
  };

  const handleToneChange = (newTone: Tone) => {
    setTone(newTone);
  };

  const handleToggleMultiGen = () => {
    const nextMode = !isMultiGenMode;
    setIsMultiGenMode(nextMode);

    if (nextMode) {
      setPlatforms([Platform.Instagram, Platform.X]);
    } else {
      if (platforms.length > 1) {
        setPlatforms([platforms[0]]);
      }
    }
  };

  const handlePlatformToggle = (p: Platform) => {
    if (!isLoggedIn && p !== Platform.Instagram) return;

    if (p === Platform.GoogleMaps) {
      setPlatforms([Platform.GoogleMaps]);
      setRefiningKey(null);
      setIsMultiGenMode(false);
      return;
    }

    if (platforms.includes(Platform.GoogleMaps)) {
      setPlatforms([p]);
      setRefiningKey(null);
      setIsMultiGenMode(false);
      return;
    }

    if (isMultiGenMode) {
      if (platforms.includes(p)) {
        if (platforms.length > 1) {
          const nextPlatforms = platforms.filter(x => x !== p);
          setPlatforms(nextPlatforms);
          if (nextPlatforms.length === 1) {
            setIsMultiGenMode(false);
          }
        }
      } else {
        setPlatforms(prev => [...prev, p]);
      }
    } else {
      setPlatforms([p]);
    }
  };

  const handleManualEdit = (groupIndex: number, itemIndex: number, newText: string) => {
    setResultGroups(prev => {
      const newGroups = [...prev];
      const newData = [...newGroups[groupIndex].data];
      newData[itemIndex] = newText;
      newGroups[groupIndex] = { ...newGroups[groupIndex], data: newData };
      return newGroups;
    });
  };

  const handleToggleFooter = (groupIndex: number, itemIndex: number) => {
    const footer = storeProfile.instagramFooter;
    if (!footer) return;

    setResultGroups(prev => {
      const newGroups = [...prev];
      const group = newGroups[groupIndex];
      const currentText = group.data[itemIndex];

      let newText = currentText;
      if (currentText.includes(footer)) {
        newText = removeInstagramFooter(currentText, footer);
      } else {
        newText = insertInstagramFooter(currentText, footer);
      }

      const newData = [...group.data];
      newData[itemIndex] = newText;
      newGroups[groupIndex] = { ...group, data: newData };
      return newGroups;
    });
  };

  const saveAggregatedHistory = async (payload: {
    profile: StoreProfile;
    config: GeneratedPost["config"];
    result: GeneratedResult[];
    isPro: boolean;
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
          is_pro: payload.isPro,
          run_type: payload.runType,
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        if (typeof data.run_id === "string") return data.run_id;
        if (typeof data.run_id === "number") return data.run_id.toString();
      }
    } catch (err) {
      console.error("save aggregated history failed:", err);
    }

    return null;
  };

  const performGeneration = async (
    targetPlatforms: Platform[],
    baseConfig: Partial<GenerationConfig>,
    isRegeneration: boolean = false
  ) => {
    const skipHistoryForCombined = targetPlatforms.length > 1;
    const runType = "generation";
    setLoading(true);
    if (!isRegeneration) {
      setResultGroups([]);
    }
    setRefiningKey(null);

    const newGroups: ResultGroup[] = [];
    const generatedResults: GeneratedResult[] = [];
    let errorCount = 0;
    let latestRunId: string | null = null;
    let aggregatedHistoryId: string | null = null;

    for (const p of targetPlatforms) {
      const isMapAndStarred = p === Platform.GoogleMaps && (starRating !== null);
      const purpose = isMapAndStarred ? GoogleMapPurpose.Auto : (p === Platform.GoogleMaps ? gmapPurpose : postPurpose);

      const config: GenerationConfig = {
        ...baseConfig as any,
        platform: p,
        purpose,
        starRating: p === Platform.GoogleMaps ? starRating : undefined,
        storeSupplement: baseConfig.storeSupplement,
        instagramFooter: (p === Platform.Instagram && includeFooter && storeProfile.instagramFooter)
          ? storeProfile.instagramFooter
          : undefined
      };

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile: storeProfile,
            config,
            isPro,
            allowGuest: !isLoggedIn,
            save_history: !skipHistoryForCombined,
            run_type: runType,
          }),
        });

        const data = await res.json();
        const remaining = typeof data.remaining === "number" ? data.remaining : null;
        if (remaining !== null) {
          setServerRemainingCredits(remaining);
        }

        if (!res.ok || !data.ok) {
          if (data?.error === "quota_exceeded") {
            alert("今週の無料枠を使い切りました。Proにアップグレードすると無制限で使えます。");
            setServerRemainingCredits(0);
            return;
          }
          throw new Error(data.error ?? "Generate failed");
        }

        const content = data.result as string[];
        let runIdFromApi: string | null = null;
        if (typeof data.run_id === "string") {
          runIdFromApi = data.run_id;
        } else if (typeof data.run_id === "number") {
          runIdFromApi = data.run_id.toString();
        }
        if (runIdFromApi) {
          latestRunId = runIdFromApi;
        }

        let finalContent = content;
        if (p === Platform.Instagram && includeFooter && storeProfile.instagramFooter) {
          finalContent = content.map((text) =>
            insertInstagramFooter(text, storeProfile.instagramFooter!)
          );
        }

        const group: ResultGroup = {
          platform: p,
          data: finalContent,
          config,
        };
        newGroups.push(group);
        generatedResults.push({ platform: p, data: finalContent });
      } catch (e) {
        console.error(`Error generating for ${p}`, e);
        errorCount++;
      }
    }

    if (isRegeneration) {
      if (targetPlatforms.length === platforms.length) {
        setResultGroups(newGroups);
      } else {
        setResultGroups(prev => {
          const updated = [...prev];
          newGroups.forEach(ng => {
            const idx = updated.findIndex(g => g.platform === ng.platform);
            if (idx >= 0) updated[idx] = ng;
            else updated.push(ng);
          });
          return updated;
        });
      }
      onRetryComplete();
    } else {
      setResultGroups(newGroups);

      if (!showGuestTour || isLoggedIn) {
        const historyConfig = {
          platforms: targetPlatforms,
          postPurpose,
          gmapPurpose,
          tone,
          length,
          inputText: inputText,
          starRating: isMap ? starRating : undefined,
          language: language,
          storeSupplement: storeSupplement,
          customPrompt: customPrompt,
          xConstraint140: xConstraint140,
          includeSymbols: includeSymbols,
          includeEmojis: includeEmojis,
          instagramFooter: (targetPlatforms.includes(Platform.Instagram) && includeFooter) ? storeProfile.instagramFooter : undefined,
        };

        if (skipHistoryForCombined && isLoggedIn) {
          aggregatedHistoryId = await saveAggregatedHistory({
            profile: storeProfile,
            config: historyConfig,
            result: generatedResults,
            isPro,
            runType,
          });
        }

        const finalId = aggregatedHistoryId ?? latestRunId ?? (Date.now().toString() + Math.random().toString().slice(2, 5));

        onGenerateSuccess({
          id: finalId,
          timestamp: Date.now(),
          config: historyConfig,
          results: generatedResults,
        });
      }

      onTaskComplete();
    }

    setLoading(false);

    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);

    if (errorCount > 0 && errorCount === targetPlatforms.length) {
      alert('生成に失敗しました。');
    }
  };

  const handleGenerate = async () => {
    if (!isLoggedIn && !showGuestTour) {
      if (onOpenLogin) onOpenLogin();
      return;
    }

    if (!canGenerateNew && !isPro && !(showGuestTour && !isLoggedIn)) {
      if (remainingCredits === 0) {
        if (onOpenLogin && !isLoggedIn) {
          onOpenLogin();
          return;
        }
        if (isLoggedIn && onTryUpgrade) {
          onTryUpgrade();
          return;
        }
      }
      return;
    }

    if (!inputText.trim()) {
      alert('テキストを入力してください');
      return;
    }

    const baseConfig = {
      tone,
      length,
      inputText,
      language: language,
      storeSupplement: storeSupplement,
      customPrompt: customPrompt,
      xConstraint140,
      includeSymbols: includeSymbols,
      includeEmojis: includeEmojis,
    };

    await performGeneration(platforms, baseConfig, false);
  };

  const handleRegenerateAll = async (force: boolean = false) => {
    if (!force && (!canRegenerate || resultGroups.length === 0)) return;

    const baseConfig = {
      tone,
      length,
      inputText,
      language: language,
      storeSupplement: storeSupplement,
      customPrompt: customPrompt,
      xConstraint140,
      includeSymbols: includeSymbols,
      includeEmojis: includeEmojis,
    };

    await performGeneration(platforms, baseConfig, true);
  };

  const handleRegenerateSingle = async (group: ResultGroup) => {
    if (!canRegenerate) return;
    const baseConfig = {
      tone,
      length,
      inputText,
      language: language,
      storeSupplement: storeSupplement,
      customPrompt: customPrompt,
      xConstraint140,
      includeSymbols: includeSymbols,
      includeEmojis: includeEmojis,
    };
    await performGeneration([group.platform], baseConfig, true);
  };

  const handleRefine = async (groupIndex: number, itemIndex: number) => {
    if (!refineText.trim()) return;

    // Check credit limit for Refine in Free plan
    if (!isPro && remainingCredits <= 0) {
      if (onTryUpgrade) onTryUpgrade();
      return;
    }

    setRefiningLoading(true);
    const group = resultGroups[groupIndex];

    try {
      const currentContent = group.data[itemIndex];

      const res = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: storeProfile,
          config: group.config,
          currentContent,
          instruction: refineText,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Refine failed");

      const newContent = data.result as string;

      setResultGroups((prev) => {
        const newGroups = [...prev];
        const newData = [...newGroups[groupIndex].data];
        newData[itemIndex] = newContent;
        newGroups[groupIndex] = { ...newGroups[groupIndex], data: newData };
        return newGroups;
      });

      // Consume credit for Free users
      if (!isPro) {
        onConsumeCredit();
      }

      setRefiningKey(null);
      setRefineText("");
    } catch (error) {
      alert("再生成に失敗しました");
      console.error(error);
    } finally {
      setRefiningLoading(false);
    }
  };

  const toggleRefinePanel = (gIdx: number, iIdx: number) => {
    const key = `${gIdx}-${iIdx}`;
    if (refiningKey === key) {
      setRefiningKey(null);
      setRefineText('');
    } else {
      setRefiningKey(key);
      setRefineText('');
    }
  };

  const handleShare = async (platform: Platform, text: string) => {
    let message = "コピーしました！アプリを開きます";
    if (platform === Platform.Instagram) {
      message = "コピー完了！貼り付けて投稿してください";
    } else if (platform === Platform.GoogleMaps) {
      message = "コピー完了！貼り付けて返信してください";
    }

    try {
      await navigator.clipboard.writeText(text);
      setToastMessage(message);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert("クリップボードへのコピーに失敗しました。");
    }

    setTimeout(() => {
      switch (platform) {
        case Platform.X:
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
          break;
        case Platform.Instagram:
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          if (isMobile) {
            window.location.href = "instagram://library";
            setTimeout(() => {
              if (document.visibilityState !== 'hidden') {
                window.location.href = "https://www.instagram.com/";
              }
            }, 1000);
          } else {
            window.open("https://www.instagram.com/", '_blank');
          }
          break;
        case Platform.GoogleMaps:
          window.open("https://business.google.com/reviews", '_blank');
          break;
      }
    }, 500);
  };

  const getShareButtonLabel = (p: Platform) => {
    switch (p) {
      case Platform.X: return 'Xで投稿する';
      case Platform.Instagram: return 'Instagramを起動';
      case Platform.GoogleMaps: return 'Googleマップで返信する';
      default: return 'コピーして開く';
    }
  };

  const getPurposeIcon = (value: string) => {
    switch (value) {
      case PostPurpose.Promotion: return <MegaphoneIcon />;
      case PostPurpose.Story: return <BookOpenIcon />;
      case PostPurpose.Educational: return <LightbulbIcon />;
      case PostPurpose.Engagement: return <ChatHeartIcon />;
      case GoogleMapPurpose.Auto: return <AutoSparklesIcon />;
      case GoogleMapPurpose.Thanks: return <HandHeartIcon />;
      case GoogleMapPurpose.Apology: return <ApologyIcon />;
      case GoogleMapPurpose.Clarify: return <InfoIcon />;
      default: return <SparklesIcon />;
    }
  };

  const presetsButton = (
    <button
      onClick={() => setIsPresetModalOpen(true)}
      disabled={!isLoggedIn}
      className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md transition-colors ${!isLoggedIn ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
    >
      <BookmarkIcon className="w-3 h-3" />
      Presets
    </button>
  );

  return (
    <>
      <div className="w-full mx-auto md:min-h-full flex flex-col pb-32 md:pb-20 relative">

        {/* Guest Tour Overlay */}
        <GuestTour
          isOpen={showGuestTour}
          onClose={() => setShowGuestTour(false)}
          inputRef={inputContainerRef}
          buttonRef={generateButtonRef}
          instagramRef={instagramButtonRef}
          purposeRef={purposeRef}
          styleRef={styleRef}
          onRunGenerator={handleGenerate}
        />

        {/* Preset Modal */}
        <PresetModal
          isOpen={isPresetModalOpen}
          onClose={() => setIsPresetModalOpen(false)}
          presets={presets}
          refreshPresets={refreshPresets}
          onApply={handleApplyPreset}
          currentConfig={{
            customPrompt,
          }}
        />

        {/* Preview Modal */}
        {previewModal && createPortal(
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setPreviewModal(null)}>
            <div
              className="bg-[#F8FAFC] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                  <EyeIcon /> 投稿プレビュー
                </h3>
                <button onClick={() => setPreviewModal(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                <SocialPreview
                  platform={previewModal.platform}
                  text={previewModal.text}
                  storeName={storeProfile.name}
                />
              </div>
              <div className="p-4 border-t border-gray-100 bg-white text-center shrink-0">
                <button
                  onClick={() => setPreviewModal(null)}
                  className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-white px-6 py-3 rounded-full shadow-2xl z-[60] flex items-center gap-3 animate-in slide-in-from-top-4 fade-in duration-300 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><polyline points="20 6 9 17 4 12" /></svg>
            <span className="font-bold text-sm">{toastMessage}</span>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && createPortal(
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4 transition-all duration-300">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden text-center">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-pulse"></div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-2xl opacity-50"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-50 rounded-full blur-2xl opacity-50"></div>

              <div className="mb-6 flex justify-center relative z-10">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-[6px] border-indigo-50 rounded-full"></div>
                  <div className="absolute inset-0 border-[6px] border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-indigo-500">
                    <SparklesIcon />
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-2 relative z-10">AIが投稿を作成中...</h3>
              <p className="text-slate-500 text-xs font-bold mb-8 relative z-10">最適な表現を考えています</p>

              <div className="bg-indigo-50/50 rounded-2xl p-6 min-h-[110px] flex items-center justify-center relative overflow-hidden transition-all duration-300 z-10">
                <div className="absolute top-1 left-2 text-indigo-200 text-4xl leading-none">❝</div>
                <div className="absolute bottom-1 right-2 text-indigo-200 text-4xl leading-none">❞</div>

                <p key={currentTipIndex} className="text-indigo-900 text-sm font-bold leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {LOADING_TIPS[currentTipIndex]}
                </p>
              </div>

              <div className="mt-4 flex justify-center gap-1.5 z-10 relative">
                {LOADING_TIPS.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentTipIndex ? 'w-6 bg-indigo-500' : 'w-1.5 bg-indigo-100'}`}
                  />
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Header Area */}
        <div className="flex justify-between items-center px-2 mb-3 shrink-0">
          <div className="flex items-center gap-2">
            {!isLoggedIn ? (
              <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                Guest Demo
              </span>
            ) : (
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 border border-indigo-200">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                {storeProfile.name} Mode {(!isPro) && `(${remainingCredits}/${MAX_FREE_LIMIT})`}
              </span>
            )}
          </div>

          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors group"
          >
            <HelpIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
            使い方ガイド
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 overflow-hidden relative flex-1 flex flex-col min-h-[calc(100vh-140px)] md:min-h-0">

          {/* Platform Selection */}
          <div className="bg-gray-50/50 border-b border-gray-100 p-2 shrink-0">
            <div className="flex flex-col md:flex-row gap-2 items-center">
              <div className="flex bg-gray-200/50 p-1 rounded-2xl w-full">
                {(Object.values(Platform) as Platform[]).map((p) => {
                  const isSelected = platforms.includes(p);
                  const isDisabled = !isLoggedIn && p !== Platform.Instagram;

                  return (
                    <button
                      key={p}
                      ref={p === Platform.Instagram ? instagramButtonRef : null}
                      onClick={() => handlePlatformToggle(p)}
                      disabled={isDisabled}
                      className={`flex-1 py-3.5 md:py-3 text-base md:text-sm font-bold rounded-xl transition-all duration-300 relative ${isSelected
                        ? 'bg-white text-indigo-600 shadow-md ring-1 ring-black/5 transform scale-[1.02] z-10'
                        : isDisabled
                          ? 'text-gray-300 cursor-not-allowed bg-gray-100/50'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                        }`}
                    >
                      <div className="flex items-center justify-center gap-2 relative">
                        {getPlatformIcon(p)}
                        <span>{p}</span>
                        {isSelected && isMultiGenMode && platforms.length > 1 && (
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {!isMap && (
                <div
                  onClick={handleToggleMultiGen}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all select-none border ${isMultiGenMode ? 'bg-indigo-50 border-indigo-200' : 'bg-transparent border-transparent hover:bg-gray-100'}`}
                >
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${isMultiGenMode ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform shadow-sm ${isMultiGenMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                  <span className={`text-xs font-bold ${isMultiGenMode ? 'text-indigo-700' : 'text-gray-400'}`}>同時生成 ON</span>
                </div>
              )}
            </div>
            {!isLoggedIn && (
              <p className="text-[10px] text-gray-400 text-center mt-2 mb-1">※デモではInstagram投稿を体験できます</p>
            )}
          </div>

          <div className="flex-1 p-6 md:p-5 grid grid-cols-1 lg:[grid-template-columns:400px_minmax(0,_1fr)] xl:[grid-template-columns:420px_minmax(0,_1fr)_360px] gap-6 overflow-visible lg:overflow-hidden">

            {/* LEFT COLUMN: Settings */}
            <div className="space-y-4 lg:overflow-y-auto pr-1 scrollbar-hide lg:w-[400px] lg:flex-shrink-0 transition-all duration-500">

              {/* QUICK PRESETS (Added Feature) */}
              {!isMap && isLoggedIn && !isMultiGenMode && (
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-1.5">
                      <SparklesIcon className="w-3 h-3 text-amber-400" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quick Presets</span>
                    </div>
                    {presetsButton}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {quickPresets.map((preset) => (
                      <button
                        key={`qp-${preset.id}`}
                        onClick={() => handleApplyPreset(preset)}
                        className="bg-white border border-gray-100 hover:border-amber-200 hover:bg-amber-50/30 rounded-xl p-2 flex flex-col items-center justify-center gap-1 transition-all shadow-sm"
                      >
                        <div className="p-1.5 bg-amber-50 rounded-full text-amber-500">
                          <BookmarkIcon className="w-3 h-3" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-600">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isMap && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
                      星評価 <span className="text-[10px] normal-case font-medium text-indigo-500">(1〜5を選択で自動判定)</span>
                    </label>
                    {starRating !== null && (
                      <button onClick={() => setStarRating(null)} className="text-[10px] text-gray-400 hover:text-red-500 underline">リセット</button>
                    )}
                  </div>
                  <div className="flex bg-white p-2 rounded-2xl border border-gray-100 shadow-sm justify-between px-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setStarRating(starRating === star ? null : star)}
                        className="p-2 transition-transform hover:scale-110 focus:outline-none"
                      >
                        <StarIcon
                          className={`w-8 h-8 transition-colors ${(starRating !== null && star <= starRating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-200 fill-gray-100'
                            }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3" ref={purposeRef}>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
                  {isMap ? '返信の目的' : '投稿の目的'}
                </label>
                <div className="grid grid-cols-2 gap-3 md:gap-3 relative">
                  {isMap && starRating !== null && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 rounded-2xl flex items-center justify-center border-2 border-dashed border-indigo-200/50">
                      <div className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-in zoom-in duration-300">
                        <AutoSparklesIcon />
                        自動判定モード固定
                      </div>
                    </div>
                  )}

                  {isMap
                    ? GMAP_PURPOSES.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setGmapPurpose(opt.value)}
                        disabled={starRating !== null}
                        className={`group relative flex flex-col items-center justify-center gap-2 md:gap-3 py-4 md:py-3 px-3 md:px-3 rounded-2xl border transition-all duration-200 overflow-hidden ${gmapPurpose === opt.value
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 ring-2 ring-indigo-200 ring-offset-2'
                          : 'bg-white border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 text-slate-500 shadow-sm'
                          }`}
                      >
                        <div className={`p-3 md:p-3 rounded-full transition-all duration-300 ${gmapPurpose === opt.value
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-indigo-500 group-hover:scale-110'
                          }`}>
                          {getPurposeIcon(opt.value)}
                        </div>
                        <span className="text-xs md:text-xs font-bold tracking-wide">{opt.label}</span>
                      </button>
                    ))
                    : POST_PURPOSES.map((opt) => {
                      const isGuest = !isLoggedIn;
                      const isDisabled = isGuest && opt.value !== PostPurpose.Promotion;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => setPostPurpose(opt.value)}
                          disabled={isDisabled}
                          className={`group relative flex flex-col items-center justify-center gap-2 md:gap-3 py-4 md:py-3 px-3 md:px-3 rounded-2xl border transition-all duration-200 overflow-hidden ${postPurpose === opt.value
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 ring-2 ring-indigo-200 ring-offset-2'
                            : isDisabled
                              ? 'bg-gray-50 border-gray-100 opacity-40 grayscale cursor-not-allowed'
                              : 'bg-white border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 text-slate-500 shadow-sm'
                            }`}
                        >
                          <div className={`p-3 md:p-3 rounded-full transition-all duration-300 ${postPurpose === opt.value
                            ? 'bg-white/20 text-white'
                            : isDisabled
                              ? 'bg-gray-200 text-gray-400'
                              : 'bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-indigo-500 group-hover:scale-110'
                            }`}>
                            {getPurposeIcon(opt.value)}
                          </div>
                          <span className="text-xs md:text-xs font-bold tracking-wide">{opt.label}</span>
                        </button>
                      )
                    })
                  }
                </div>
              </div>

              <div className="space-y-3 relative" ref={styleRef}>
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
                    スタイル設定
                  </label>
                  {/* Only show here if Quick Sets aren't active (Map or Guest or MultiGen) */}
                  {(isMap || !isLoggedIn || isMultiGenMode) && presetsButton}
                </div>

                <div className={`bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex ${!isLoggedIn ? 'opacity-50 pointer-events-none' : ''}`}>
                  {TONES.map(t => (
                    <button
                      key={t.value}
                      onClick={() => handleToneChange(t.value as Tone)}
                      disabled={!isLoggedIn}
                      className={`flex-1 py-3.5 md:py-2 text-sm md:text-xs font-bold rounded-lg transition-all ${tone === t.value
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {!isXOnly && (
                  <div className={`bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex ${!isLoggedIn ? 'opacity-50 pointer-events-none' : ''}`}>
                    {LENGTHS.map(l => (
                      <button
                        key={l.value}
                        onClick={() => setLength(l.value as Length)}
                        disabled={!isLoggedIn}
                        className={`flex-1 py-3.5 md:py-2 text-sm md:text-xs font-bold rounded-lg transition-all ${length === l.value
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-400 hover:text-gray-600'
                          }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                )}

                {!isMap && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        const next = !includeEmojis;
                        setIncludeEmojis(next);
                        const nextSymbols = next ? false : includeSymbols;
                        setIncludeSymbols(nextSymbols);
                        setToneDecorations(prev => ({
                          ...prev,
                          [tone]: {
                            includeEmojis: next,
                            includeSymbols: nextSymbols
                          }
                        }));
                      }}
                      disabled={!isLoggedIn}
                      className={`p-2.5 rounded-xl border flex flex-col items-start gap-2 relative transition-all ${includeEmojis
                        ? 'bg-amber-50 border-amber-200 shadow-sm'
                        : 'bg-white border-gray-100 hover:bg-gray-50'
                        } ${!isLoggedIn ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-xs font-bold ${includeEmojis ? 'text-amber-700' : 'text-gray-500'}`}>絵文字</span>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${includeEmojis ? 'bg-amber-500' : 'bg-gray-200'}`}>
                          <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${includeEmojis ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                      </div>
                      <div className="text-[10px] text-gray-400">✨ 😊 👍</div>
                    </button>

                    <button
                      onClick={() => {
                        const next = !includeSymbols;
                        setIncludeSymbols(next);
                        const nextEmojis = next ? false : includeEmojis;
                        setIncludeEmojis(nextEmojis);
                        setToneDecorations(prev => ({
                          ...prev,
                          [tone]: {
                            includeEmojis: nextEmojis,
                            includeSymbols: next
                          }
                        }));
                      }}
                      disabled={!isLoggedIn}
                      className={`p-2.5 rounded-xl border flex flex-col items-start gap-2 relative transition-all ${includeSymbols
                        ? 'bg-amber-50 border-amber-200 shadow-sm'
                        : 'bg-white border-gray-100 hover:bg-gray-50'
                        } ${!isLoggedIn ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-xs font-bold ${includeSymbols ? 'text-amber-700' : 'text-gray-500'}`}>装飾記号</span>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${includeSymbols ? 'bg-amber-500' : 'bg-gray-200'}`}>
                          <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${includeSymbols ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                      </div>
                      <div className="text-[10px] text-gray-400">✦ ▷ ■</div>
                    </button>
                  </div>
                )}

                {platforms.includes(Platform.X) && isLoggedIn && (
                  <div className="bg-black/5 p-3 rounded-xl flex items-center justify-between border border-black/5">
                    <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                      <XIcon className="w-3 h-3" /> 140文字制限
                    </span>
                    <button
                      onClick={() => setXConstraint140(!xConstraint140)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${xConstraint140 ? 'bg-black' : 'bg-gray-300'}`}
                    >
                      <span
                        className={`${xConstraint140 ? 'translate-x-5' : 'translate-x-1'
                          } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* MIDDLE COLUMN: Input & Advanced */}
            <div className="flex flex-col gap-4 flex-1 lg:h-full transition-all duration-500">
              {shouldShowFreeLimit ? (
                <div className="w-full py-10">
                  <FreeLimitReached
                    onUpgrade={onTryUpgrade ?? (() => {})}
                    remaining={remainingCredits}
                  />
                </div>
              ) : (
                <>
                  <div
                    ref={inputContainerRef}
                    className="flex-1 bg-white p-1 rounded-3xl border border-gray-200 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-400 transition-all shadow-sm relative min-h-[200px]"
                  >
                    <div className="h-full flex flex-col p-4 md:p-6">
                      <label className="block text-base md:text-sm font-bold text-gray-700 mb-3 flex items-center justify-between shrink-0">
                        <span>{isMap ? 'お客様の口コミ内容' : '投稿したいトピック・内容'}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-1 rounded-full">必須</span>
                        </div>
                      </label>
                      <div className="relative flex-1 flex flex-col">
                        <textarea
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          disabled={(!canGenerateNew && isLoggedIn)}
                          placeholder={isMap
                            ? "例: ランチセットが美味しかったです。ただ、提供に少し時間がかかったのが残念でした。"
                            : "例: 明日から秋限定の栗パフェを始めます。値段は1200円。1日限定20食です。"
                          }
                          className="w-full flex-1 bg-transparent border-0 text-base leading-relaxed placeholder-gray-300 focus:ring-0 resize-none pr-8 pb-8 text-gray-700 disabled:opacity-100 disabled:text-gray-700 disabled:cursor-not-allowed"
                        />
                        {isLoggedIn && (
                          <InputControlButtons
                            value={inputText}
                            onUpdate={setInputText}
                            onClear={() => setInputText('')}
                            className="absolute bottom-0 right-0"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border border-amber-100/50 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden shadow-sm transition-all shrink-0">
                    <button
                      onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                      disabled={!isLoggedIn}
                      className={`w-full flex items-center justify-between p-4 transition-colors ${!isLoggedIn ? 'opacity-60 cursor-not-allowed bg-gray-50' : 'hover:bg-amber-100/30'}`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-md shadow-sm ${!isLoggedIn ? 'bg-gray-400 text-white' : 'bg-amber-400 text-white'}`}>
                          {!isLoggedIn ? <LockIcon /> : <CrownIcon />}
                        </div>
                        <span className={`text-xs font-extrabold tracking-wider ${!isLoggedIn ? 'text-gray-500' : 'text-amber-800'}`}>
                          詳細設定 {!isLoggedIn && '(Login Required)'}
                        </span>
                      </div>
                      {isLoggedIn && <ChevronDownIcon className={`w-4 h-4 text-amber-700 transition-transform duration-300 ${isAdvancedOpen ? 'rotate-180' : ''}`} />}
                    </button>

                    {isAdvancedOpen && isLoggedIn && (
                      <div className="relative">
                        <div className="p-4 pt-0 space-y-5 animate-in slide-in-from-top-1 duration-300">
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-bold text-amber-800/70 mb-1.5">出力言語</label>
                              <div className="relative">
                                <select
                                  value={language}
                                  onChange={(e) => setLanguage(e.target.value)}
                                  className="w-full p-2.5 bg-white/80 border-0 rounded-xl text-sm font-medium text-amber-900 shadow-sm focus:ring-2 focus:ring-amber-400 appearance-none pl-3 pr-8"
                                >
                                  {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                              </div>
                            </div>

                            {isMap && (
                              <div className="pt-2">
                                <label className="block text-xs font-bold text-amber-800/70 mb-1.5">店舗側の補足・事情 (任意)</label>
                                <div className="relative">
                                  <textarea
                                    value={storeSupplement}
                                    onChange={(e) => setStoreSupplement(e.target.value)}
                                    placeholder="例: 機器トラブルで提供が遅れました... (AIがこの事情を汲んで文章を作成します)"
                                    rows={2}
                                    className="w-full bg-white/80 border-0 p-3 rounded-xl text-sm text-gray-700 focus:ring-2 focus:ring-amber-400 placeholder-amber-700/30 pr-16 resize-none"
                                  />
                                  <InputControlButtons
                                    value={storeSupplement}
                                    onUpdate={setStoreSupplement}
                                    onClear={() => setStoreSupplement('')}
                                    className="absolute bottom-2 right-2"
                                  />
                                </div>
                              </div>
                            )}

                            <div className="pt-2">
                              <label className="block text-xs font-bold text-amber-800/70 mb-1.5">AIへのカスタムプロンプト (任意)</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={customPrompt}
                                  onChange={(e) => setCustomPrompt(e.target.value)}
                                  placeholder="例: 絵文字多めで、テンション高く..."
                                  className="w-full bg-white/80 border-0 p-3 rounded-xl text-sm text-gray-700 focus:ring-2 focus:ring-amber-400 placeholder-amber-700/30 pr-16"
                                />
                                <InputControlButtons
                                  value={customPrompt}
                                  onUpdate={setCustomPrompt}
                                  onClear={() => setCustomPrompt('')}
                                  className="absolute top-1/2 -translate-y-1/2 right-2"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* RIGHT COLUMN: Results */}
            {hasResults && (
              <div className="lg:col-start-2 xl:col-start-3 h-full flex flex-col animate-in slide-in-from-right fade-in duration-700 lg:flex-shrink-0 xl:w-[360px]">
                <div ref={resultsRef} className="space-y-6 lg:overflow-y-auto pr-1 scrollbar-hide lg:max-h-full pb-4 md:pb-0">
                  <div className="flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10 py-2 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <span className="text-2xl">🎉</span> Generated
                    </h2>
                  </div>

                  <div className={`grid gap-6 ${resultGroups.length > 1 ? 'lg:grid-cols-2 xl:grid-cols-1' : 'grid-cols-1'}`}>
                    {resultGroups.map((group, gIdx) => (
                      <div key={gIdx} className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                        <span className={`p-1.5 rounded-lg text-white ${group.platform === Platform.X ? 'bg-black' :
                          group.platform === Platform.Instagram ? 'bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500' :
                            'bg-green-600'
                          }`}>
                          {getPlatformIcon(group.platform)}
                        </span>
                        <h3 className="font-bold text-lg text-gray-700">{group.platform}</h3>
                      </div>

                      <div className="flex flex-col gap-6 w-full">
                        {(Array.isArray(group?.data) ? group.data : []).map((res, iIdx) => (
                          <div key={`${gIdx}-${iIdx}`} className={`group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 transition-all duration-300 flex flex-col relative overflow-hidden ${refiningKey === `${gIdx}-${iIdx}` ? 'ring-2 ring-amber-400 shadow-amber-100' : 'hover:shadow-xl hover:border-indigo-100'}`}>
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                            <div className="flex-1 mb-2 relative group/edit">
                              <AutoResizingTextarea
                                value={res}
                                onChange={(e) => handleManualEdit(gIdx, iIdx, e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-0 p-0 text-base md:text-sm text-gray-700 leading-relaxed font-sans resize-none focus:outline-none placeholder-gray-300 min-h-[100px]"
                                placeholder="Type here to edit..."
                              />
                              <div className="absolute top-0 right-0 opacity-0 group-hover/edit:opacity-100 transition-opacity pointer-events-none">
                                <span className="text-[10px] text-gray-300 bg-white/80 px-1 rounded">Edit</span>
                              </div>
                            </div>

                            <CharCounter platform={group.platform} text={res} config={group.config} />

                            {group.platform === Platform.Instagram && storeProfile.instagramFooter && (
                              <div className="mt-4 bg-gradient-to-r from-pink-50 to-purple-50 p-3 rounded-xl flex items-center justify-between border border-pink-100">
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-pink-700 flex items-center gap-1">
                                    <InstagramIcon className="w-3 h-3" /> 定型文（店舗情報）を含める
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleToggleFooter(gIdx, iIdx)}
                                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${res.includes(storeProfile.instagramFooter) ? 'bg-pink-500' : 'bg-gray-300'}`}
                                >
                                  <span
                                    className={`${res.includes(storeProfile.instagramFooter) ? 'translate-x-5' : 'translate-x-1'
                                      } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
                                  />
                                </button>
                              </div>
                            )}

                            <button
                              onClick={() => setPreviewModal({ platform: group.platform, text: res })}
                              className="w-full py-2 mt-2 mb-4 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                            >
                              <EyeIcon />
                              プレビューを確認
                            </button>

                            {refiningKey === `${gIdx}-${iIdx}` && (
                              <div className="mb-4 bg-amber-50 p-3 rounded-xl border border-amber-100 animate-in slide-in-from-top-2">
                                <label className="text-xs font-bold text-amber-700 mb-1 block">Refinement Instruction</label>
                                <textarea
                                  value={refineText}
                                  onChange={(e) => setRefineText(e.target.value)}
                                  placeholder="例: もっと短くして。絵文字を増やして。"
                                  className="w-full text-sm bg-white border border-amber-200 rounded-lg p-2 mb-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                                  rows={2}
                                />
                                <div className="flex justify-between items-center mt-2">
                                  {!isPro && (
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border flex items-center gap-1 ${remainingCredits > 0 ? 'text-amber-600 bg-amber-50 border-amber-100' : 'text-red-500 bg-red-50 border-red-100'}`}>
                                      {remainingCredits > 0 ? (
                                        <>✨ 1クレジット消費 (残: {remainingCredits})</>
                                      ) : (
                                        <>⚠️ クレジット不足</>
                                      )}
                                    </span>
                                  )}
                                  <div className="flex justify-end gap-2 ml-auto">
                                    <button
                                      onClick={() => toggleRefinePanel(gIdx, iIdx)}
                                      className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => handleRefine(gIdx, iIdx)}
                                      disabled={refiningLoading || !refineText.trim() || (!isPro && remainingCredits <= 0)}
                                      className="px-3 py-1.5 text-xs font-bold bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                    >
                                      {refiningLoading ? (
                                        <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
                                      ) : (
                                        <MagicWandIcon />
                                      )}
                                      Update
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="flex flex-col mt-auto gap-2">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleRegenerateSingle(group)}
                                  disabled={loading || !isLoggedIn}
                                  className={`flex-1 py-4 md:py-3 border rounded-xl text-base md:text-sm font-bold transition-colors flex items-center justify-center gap-2 ${!isLoggedIn
                                    ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed'
                                    }`}
                                >
                                  {loading ? (
                                    <span className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></span>
                                  ) : !isLoggedIn ? (
                                    <LockIcon />
                                  ) : (
                                    <RotateCcwIcon />
                                  )}
                                  {(!isLoggedIn || (!isPro && retryCount >= 0)) ? `Retry${!isPro && isLoggedIn ? ` (${Math.max(0, 2 - retryCount)})` : ''}` : 'Retry'}
                                </button>

                                <button
                                  onClick={() => toggleRefinePanel(gIdx, iIdx)}
                                  disabled={!isLoggedIn}
                                  className={`flex-1 py-4 md:py-3 border rounded-xl text-base md:text-sm font-bold transition-colors flex items-center justify-center gap-2 ${refiningKey === `${gIdx}-${iIdx}` ? 'bg-amber-100 border-amber-100 text-amber-700' : ''} ${!isLoggedIn ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200' : 'border-amber-100 bg-amber-50/50 text-amber-700 hover:bg-amber-100'}`}
                                >
                                  {!isLoggedIn ? <LockIcon /> : <MagicWandIcon />}
                                  Refine
                                </button>
                              </div>

                              {!isPro && isLoggedIn && (
                                <div className="flex items-center justify-end gap-3 px-1 mt-0.5 mb-1">
                                  <span className={`text-[10px] font-medium flex items-center gap-1 ${retryCount >= 2 ? 'text-red-400' : 'text-gray-400'}`}>
                                    <RotateCcwIcon className="w-3 h-3" />
                                    Retry: 残り{Math.max(0, 2 - retryCount)}回
                                  </span>
                                  <span className={`text-[10px] font-medium flex items-center gap-1 ${remainingCredits === 0 ? 'text-red-400' : 'text-gray-400'}`}>
                                    <MagicWandIcon className="w-3 h-3" />
                                    Refine: 1クレジット消費
                                  </span>
                                </div>
                              )}

                              <button
                                onClick={() => !isLoggedIn ? null : handleShare(group.platform, res)}
                                disabled={!isLoggedIn}
                                className={`w-full py-4 md:py-3 rounded-xl text-base md:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${!isLoggedIn
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                  : group.platform === Platform.X ? 'bg-black text-white hover:bg-gray-800' :
                                    group.platform === Platform.Instagram ? 'bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500 text-white hover:opacity-90' :
                                      group.platform === Platform.GoogleMaps ? 'bg-green-600 text-white hover:bg-green-700' :
                                        'bg-gray-900 text-white'
                                  }`}
                              >
                                <span className="truncate">{getShareButtonLabel(group.platform)}</span>
                                {!isLoggedIn ? <LockIcon className="w-3 h-3" /> : <ExternalLinkIcon />}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {createPortal(
        <div className="fixed bottom-0 left-0 right-0 p-4 md:p-3 bg-white/90 backdrop-blur-md border-t border-gray-200 z-[40]">
          <div className="w-full max-w-[1100px] mx-auto px-2 md:px-0">
            {shouldShowProHint && onTryUpgrade && (
              <div className="text-xs text-slate-500 text-center mb-2 flex flex-wrap items-center justify-center gap-2">
                <span>Proなら生成回数が無制限になります</span>
                <button
                  onClick={onTryUpgrade}
                  className="text-indigo-600 font-bold hover:underline focus:outline-none"
                >
                  Proプランを見る
                </button>
              </div>
            )}
            <button
            ref={generateButtonRef}
            onClick={() => {
              if (loading || shouldShowFreeLimit) return;
              handleGenerate();
            }}
            className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 md:py-3 rounded-xl shadow-xl shadow-slate-200 hover:shadow-indigo-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-xl md:text-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            disabled={loading || shouldShowFreeLimit}
          >
                {loading ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                    <span>作成中...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    <span>{generateButtonLabel}</span>
                  </>
                )}
            </button>
            {!isPro && !shouldShowFreeLimit && (
              <div className="text-center mt-2 text-[10px] text-gray-400 font-medium">
                {isLoggedIn ? (
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <span>
                      残りクレジット: <span className="text-indigo-600 font-bold">{remainingCredits}回</span> / 5
                    </span>
                  </div>
                ) : (
                  <>
                    <span>アカウント作成（無料）で利用可能</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>,
          document.body
        )}

      </div>
    </>
  );
};

export default PostGenerator;
