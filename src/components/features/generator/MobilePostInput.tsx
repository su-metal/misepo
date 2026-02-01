import React from 'react';
import { Platform, PostPurpose, GoogleMapPurpose } from '../../../types';
import { AutoResizingTextarea } from './AutoResizingTextarea';
import { getPlatformIcon } from './utils';
import {
    AutoSparklesIcon, MagicWandIcon, MicIcon, EraserIcon, InfoIcon,
    SparklesIcon, RotateCcwIcon, InstagramIcon, LineIcon, GoogleMapsIcon, ChevronRightIcon, CloseIcon, StarIcon,
    LockIcon
} from '../../Icons';
import { MobileCalendarOverlay } from './MobileCalendarOverlay';
import { TrendEvent } from './TrendData';
import { InspirationDeck } from './InspirationDeck';
import {
    PostInputFormProps, renderAvatar, PURPOSES, GMAP_PURPOSES, TONES, LENGTHS
} from './inputConstants';
import { TARGET_AUDIENCES } from '../../../constants';
import { PostResultTabs } from './PostResultTabs';

export const MobilePostInput: React.FC<PostInputFormProps> = ({
    platforms, activePlatform, isMultiGen, onPlatformToggle, onToggleMultiGen, onSetActivePlatform,
    platform, postPurpose, gmapPurpose, onPostPurposeChange, onGmapPurposeChange,
    tone, onToneChange, length, onLengthChange, inputText, onInputTextChange,
    starRating, onStarRatingChange, includeEmojis, onIncludeEmojisChange,
    includeSymbols, onIncludeSymbolsChange, xConstraint140, onXConstraint140Change,
    isGenerating, onGenerate, generateButtonRef, plan, presets, activePresetId,
    onApplyPreset, onOpenPresetModal, customPrompt, onCustomPromptChange,
    storeSupplement, onStoreSupplementChange, language, onLanguageChange,
    onOpenGuide, hasResults = false, isStyleLocked = false,
    onReset, storeProfile, resetTrigger,
    generatedResults = [], activeResultTab = 0, onResultTabChange,
    onManualEdit, onToggleFooter, onRefine, onRegenerateSingle,
    onShare, getShareButtonLabel, refiningKey, onRefineToggle,
    refineText, onRefineTextChange, onPerformRefine, isRefining,
    includeFooter, onIncludeFooterChange, onAutoFormat,
    isAutoFormatting, onCopy, onMobileResultOpen, restoreId,
    onStepChange, closeDrawerTrigger, openDrawerTrigger, onOpenOnboarding,
    targetAudiences, onTargetAudiencesChange
}) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const dateObj = new Date();
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const weekday = dateObj.toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
    const [mobileStep, setMobileStep] = React.useState<'platform' | 'input' | 'confirm' | 'result'>('platform');
    const [isStepDrawerOpen, setIsStepDrawerOpen] = React.useState(false);

    const [isPromptExpanded, setIsPromptExpanded] = React.useState(true);
    const [isAudienceExpanded, setIsAudienceExpanded] = React.useState(false);
    const [isOmakaseLoading, setIsOmakaseLoading] = React.useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
    const [isDefaultStyleEnabled, setIsDefaultStyleEnabled] = React.useState(() => {
        return localStorage.getItem('misepo_use_default_preset') === 'true';
    });
    const [isDefaultAudienceEnabled, setIsDefaultAudienceEnabled] = React.useState(() => {
        return localStorage.getItem('misepo_use_default_audience') === 'true';
    });



    // Handle Calendar Strategy Launch
    const handleTrendStrategy = (event: TrendEvent) => {
        setIsCalendarOpen(false);
        // Start Omakase-like flow but with context
        setIsOmakaseLoading(true);
        if (platforms.length === 0) {
            onPlatformToggle(Platform.Instagram);
            onPlatformToggle(Platform.X);
        }
        setTimeout(() => {
            setIsOmakaseLoading(false);
            setMobileStep('input');
            setIsStepDrawerOpen(true);
            // Pre-fill context
            const strategyPrompt = `✨ ${event.title} (${event.date}) の投稿戦略：\n${event.description}\n\nおすすめハッシュタグ: ${event.hashtags.join(' ')}\n\nこのイベントに合わせて、集客効果の高い投稿を作ってください。`;
            onInputTextChange(strategyPrompt);
        }, 800);
    };

    // Notify parent about step changes
    React.useEffect(() => {
        if (onStepChange) {
            onStepChange(mobileStep);
        }
    }, [mobileStep, onStepChange]);

    // Notify parent about result or calendar open state to hide footer
    React.useEffect(() => {
        if (onMobileResultOpen) {
            const shouldHideFooter = (mobileStep === 'result' && isStepDrawerOpen) || isCalendarOpen;
            onMobileResultOpen(shouldHideFooter);
        }
    }, [mobileStep, isStepDrawerOpen, isCalendarOpen, onMobileResultOpen]);

    // Handle Restore from History
    React.useEffect(() => {
        if (restoreId) {
            setMobileStep('result');
            setIsStepDrawerOpen(true);
        }
    }, [restoreId]);

    // Handle Reset from parent
    React.useEffect(() => {
        if (resetTrigger && resetTrigger > 0) {
            setMobileStep('platform');
            setIsStepDrawerOpen(false);
        }
    }, [resetTrigger]);

    // Handle Close Drawer (Home Tap) - Keep state
    React.useEffect(() => {
        if (closeDrawerTrigger && closeDrawerTrigger > 0) {
            setIsStepDrawerOpen(false);
            // Also reset step to 'platform' so that footer contrast updates correctly (Dark Mode)
            // Content is preserved in 'inputText' prop from parent, so state is safe.
            setMobileStep('platform');
        }
    }, [closeDrawerTrigger]);

    // Handle Open Drawer Explicitly (Footer Plus Tap when at Home)
    React.useEffect(() => {
        if (openDrawerTrigger && openDrawerTrigger > 0) {
            setMobileStep('input');
            setIsStepDrawerOpen(true);
        }
    }, [openDrawerTrigger]);

    // Auto-expand and switch to result step solely when generation completes
    const prevIsGenerating = React.useRef(isGenerating);
    React.useEffect(() => {
        if (prevIsGenerating.current === true && isGenerating === false && hasResults && generatedResults.length > 0) {
            setMobileStep('result');
            setIsStepDrawerOpen(true);
        }
        prevIsGenerating.current = isGenerating;
    }, [isGenerating, hasResults, generatedResults.length]);

    // Background Scroll Lock (Mobile Only)
    React.useEffect(() => {
        if (isStepDrawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isStepDrawerOpen]);

    const [isListening, setIsListening] = React.useState(false);
    const recognitionRef = React.useRef<any>(null);

    const isGoogleMaps = platform === Platform.GoogleMaps;
    const isX = platform === Platform.X;

    // Handle Default Style Persistence
    React.useEffect(() => {
        localStorage.setItem('misepo_use_default_preset', String(isDefaultStyleEnabled));
        if (isDefaultStyleEnabled) {
            localStorage.setItem('misepo_preferred_preset_id', activePresetId || 'plain-ai');
        }
    }, [isDefaultStyleEnabled, activePresetId]);

    // Handle Default Audience Persistence
    React.useEffect(() => {
        localStorage.setItem('misepo_use_default_audience', String(isDefaultAudienceEnabled));
        if (isDefaultAudienceEnabled && targetAudiences) {
            localStorage.setItem('misepo_preferred_audiences', JSON.stringify(targetAudiences));
        }
    }, [isDefaultAudienceEnabled, targetAudiences]);

    // Apply Default Style on Entry
    React.useEffect(() => {
        if (isStepDrawerOpen && mobileStep === 'confirm' && isDefaultStyleEnabled) {
            const preferredId = localStorage.getItem('misepo_preferred_preset_id');
            if (preferredId && preferredId !== activePresetId) {
                if (preferredId === 'plain-ai') {
                    onApplyPreset({ id: 'plain-ai' } as any);
                } else {
                    const found = presets.find(p => p.id === preferredId);
                    if (found) {
                        onApplyPreset(found);
                    }
                }
            }
        }
    }, [isStepDrawerOpen, mobileStep, isDefaultStyleEnabled, activePresetId, presets, onApplyPreset]);

    // Apply Default Audience on Entry
    React.useEffect(() => {
        if (isStepDrawerOpen && mobileStep === 'confirm' && isDefaultAudienceEnabled) {
            const preferredAudiencesStr = localStorage.getItem('misepo_preferred_audiences');
            if (preferredAudiencesStr) {
                try {
                    const preferredAudiences = JSON.parse(preferredAudiencesStr);
                    // Only update if different to avoid infinite loop
                    if (JSON.stringify(preferredAudiences) !== JSON.stringify(targetAudiences)) {
                        onTargetAudiencesChange(preferredAudiences);
                    }
                } catch (e) {
                    console.error('Failed to parse preferred audiences', e);
                }
            }
        }
    }, [isStepDrawerOpen, mobileStep, isDefaultAudienceEnabled, targetAudiences, onTargetAudiencesChange]);

    // Enforce at least one audience (default to '全般')
    React.useEffect(() => {
        if (mobileStep === 'confirm' && (!targetAudiences || targetAudiences.length === 0)) {
            if (onTargetAudiencesChange) {
                onTargetAudiencesChange(['全般']);
            }
        }
    }, [mobileStep, targetAudiences, onTargetAudiencesChange]);

    const toggleVoiceInput = React.useCallback(() => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('音声入力に対応していません');
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = 'ja-JP';
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
            }
            if (finalTranscript) {
                onInputTextChange(inputText + (inputText ? ' ' : '') + finalTranscript);
            }
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => {
            setIsListening(false);
            if (inputText.trim()) {
                setMobileStep('confirm');
            }
        };
        recognitionRef.current = recognition;
        recognition.start();
    }, [isListening, inputText, onInputTextChange]);

    const handlePlatformSelect = (p: Platform) => {
        onSetActivePlatform(p);
        setMobileStep('input');
        setIsStepDrawerOpen(true);
    };

    const handleTargetAudienceToggle = (target: string) => {
        if (!targetAudiences || !onTargetAudiencesChange) return;

        const current = targetAudiences;

        // "Omakase" Strategy:
        // 1. If '全般' is clicked
        if (target === '全般') {
            if (current.includes('全般')) {
                // Mandatory Rule: Cannot deselect if it's the only one. 
                // Actually, since '全般' clears others, if it's ON, it must be the only one.
                // So we just return/do nothing.
                return;
            } else {
                // If checking '全般', clear others
                onTargetAudiencesChange(['全般']);
            }
            return;
        }

        // 2. If any OTHER tag is clicked, '全般' must be removed (if present).
        let newSelection = [...current];
        if (newSelection.includes('全般')) {
            newSelection = newSelection.filter(t => t !== '全般');
        }

        if (newSelection.includes(target)) {
            // Deselecting logic with fallback
            const filtered = newSelection.filter(t => t !== target);
            if (filtered.length === 0) {
                // Fallback to '全般' if trying to empty the list
                onTargetAudiencesChange(['全般']);
            } else {
                onTargetAudiencesChange(filtered);
            }
        } else {
            onTargetAudiencesChange([...newSelection, target]);
        }
    };

    const handleOmakaseStart = () => {
        setIsOmakaseLoading(true);
        onApplyPreset({ id: 'plain-ai' } as any); // Force AI Standard preset

        // "Magic" selection: Auto-select Instagram and X as defaults for Omakase
        if (platforms.length === 0) {
            onPlatformToggle(Platform.Instagram);
            onPlatformToggle(Platform.X);
        }

        // Brief delay for "Thinking" feel
        setTimeout(() => {
            setIsOmakaseLoading(false);
            setMobileStep('input');
            setIsStepDrawerOpen(true);
            // Always reset and pre-fill with a magic prompt for Omakase Mode
            onInputTextChange("✨ AIおまかせ生成：今日のおすすめやお店の雰囲気に合わせて、魅力的な文章を考えて！");
        }, 800);
    };

    const handleBackStep = () => {
        if (mobileStep === 'result') {
            setMobileStep('confirm');
        } else if (mobileStep === 'confirm') {
            setMobileStep('input');
        } else if (mobileStep === 'input') {
            setIsStepDrawerOpen(false);
            setMobileStep('platform');
        }
    };

    // State for Inspiration Deck Caching
    const [cachedInspirationCards, setCachedInspirationCards] = React.useState<any[]>([]);

    // --- Audience Logic (Moved to Top Level) ---


    const profileTargets = React.useMemo(() => {
        return storeProfile?.targetAudience
            ? storeProfile.targetAudience.split(',').map(s => s.trim())
            : [];
    }, [storeProfile?.targetAudience]);

    // Primary: In Profile OR Selected OR '全般' (Always visible as default option)
    const primaryAudienceList = TARGET_AUDIENCES.filter(t =>
        t === '全般' || profileTargets.includes(t) || targetAudiences?.includes(t)
    );

    // Secondary: The rest
    const secondaryAudienceList = TARGET_AUDIENCES.filter(t => !primaryAudienceList.includes(t));

    return (
        <div className="flex flex-col h-full relative overflow-hidden font-inter bg-white">

            {/* Step 1: Home (Platform Grid) */}
            <div className={`flex flex-col h-full overflow-hidden relative transition-all duration-500 ${isStepDrawerOpen ? 'blur-md scale-[0.98] opacity-60' : 'opacity-100'}`}>
                <div className="flex-1 flex flex-col p-4 pt-6 pb-32 safe-area-bottom overflow-y-auto no-scrollbar">
                    {/* High-Design Header - Magazine Style Date & Minimal Avatar */}
                    <div className="flex items-start justify-between mb-4 px-1">
                        {/* Typography Date Display - Interactive Trigger */}
                        <div className="flex flex-col cursor-pointer active:scale-95 transition-transform" onClick={() => setIsCalendarOpen(true)}>
                            <span className="text-[9px] font-black text-[#0071b9] uppercase tracking-[0.4em] ml-1 mb-1 z-10 relative flex items-center gap-1">
                                misepo <span className="bg-slate-900/10 px-1 rounded text-[8px] tracking-normal text-slate-500">HUB</span>
                            </span>
                            <div className="flex items-center gap-3 select-none">
                                <span className="text-[3.5rem] font-black text-slate-900 tracking-tighter leading-[0.8]">{day}</span>
                                <div className="flex flex-col justify-center gap-0.5 pt-1">
                                    <span className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">{month}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">{weekday}</span>
                                </div>
                            </div>
                            <p className="text-[9px] font-medium text-slate-400 tracking-tighter mt-1.5 ml-1 opacity-80 select-none italic flex items-center gap-1">
                                Tap to view Trend Calendar <ChevronRightIcon className="w-3 h-3 opacity-50" />
                            </p>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                            {/* Decorative Avatar (No Name) */}
                            <div className="relative group cursor-pointer" onClick={onOpenOnboarding}>
                                <div className="absolute inset-0 bg-[#7F5AF0] rounded-full blur-[10px] opacity-20 group-hover:opacity-40 transition-opacity" />
                                <div className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md border-[2px] border-slate-100">
                                    <span className="text-[var(--plexo-black)] font-black text-lg" style={{ transform: 'rotate(-10deg)', marginTop: '2px' }}>ミ</span>
                                </div>
                            </div>

                            {/* High-Contrast Credit Design with Gauge */}
                            {plan && typeof plan.usage !== 'undefined' && typeof plan.limit !== 'undefined' && (
                                <div className="flex flex-col items-end gap-1 scale-90 origin-right">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0071b9] text-white backdrop-blur-xl border border-white/20 shadow-xl overflow-hidden relative">
                                        <span className="text-[8px] font-black text-white/60 uppercase tracking-widest mr-1">CREDITS</span>
                                        <span className="text-sm font-black text-[#f2e018] leading-none">
                                            {Math.max(0, plan.limit - plan.usage)}
                                        </span>
                                        <span className="text-[10px] font-bold text-white/60 leading-none">/ {plan.limit}</span>

                                        {/* Subtle Gauge Background */}
                                        <div className="absolute bottom-0 left-0 h-[2px] bg-white/10 w-full" />
                                        {/* Active Gauge Fill */}
                                        <div
                                            className="absolute bottom-0 left-0 h-[2px] bg-[#0071b9] shadow-[0_0_10px_rgba(127,90,240,0.5)] transition-all duration-1000"
                                            style={{ width: `${(Math.max(0, plan.limit - plan.usage) / plan.limit) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex gap-1 pr-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-[3px] w-6 rounded-full transition-colors duration-500 ${((plan.limit - plan.usage) / plan.limit) * 5 > i
                                                    ? 'bg-[#0071b9]'
                                                    : 'bg-slate-200'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-0.5 items-start px-2 mt-2 mb-0">
                        <h2 className="text-[12px] font-black text-[#0071b9] tracking-tight">投稿先を選択</h2>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em]">Select your canvas</p>
                    </div>

                    {/* Standard 2x2 Grid Platform Selection */}
                    <div className="grid grid-cols-2 gap-3 px-1 mt-2">
                        {(() => {
                            const getPlatformDetails = (platform: Platform) => {
                                switch (platform) {
                                    case Platform.Instagram: return {
                                        name: 'Instagram',
                                        tagline: 'Visual Story',
                                        sub: '世界観と統一感',
                                        icon: <InstagramIcon className="w-7 h-7" />,
                                        color: 'from-purple-500/10 to-pink-500/10'
                                    };
                                    case Platform.X: return {
                                        name: 'X',
                                        tagline: 'Real-time',
                                        sub: '拡散と交流',
                                        icon: <span className="font-black text-2xl">𝕏</span>,
                                        color: 'from-gray-500/5 to-black/5'
                                    };
                                    case Platform.Line: return {
                                        name: 'LINE',
                                        tagline: 'Messages',
                                        sub: 'リピーター獲得',
                                        icon: <LineIcon className="w-7 h-7" isActive={platforms.includes(Platform.Line)} activeTextFill="#0071b9" />,
                                        color: 'from-green-500/10 to-emerald-500/10'
                                    };
                                    case Platform.GoogleMaps: return {
                                        name: 'Google Maps',
                                        tagline: 'Local Search',
                                        sub: '店舗集客とMEO対策',
                                        icon: <GoogleMapsIcon className="w-7 h-7" />,
                                        color: 'from-blue-500/10 to-red-500/10'
                                    };
                                    default: return { name: '', tagline: '', sub: '', icon: null, color: '' };
                                }
                            };

                            return [Platform.Instagram, Platform.X, Platform.Line, Platform.GoogleMaps].map((p, idx) => {
                                const isActive = platforms.includes(p);
                                const details = getPlatformDetails(p);
                                const bentoClass = 'h-[124px]';

                                return (
                                    <div
                                        key={p}
                                        onClick={() => onPlatformToggle(p)}
                                        className={`
                                            relative rounded-[20px] overflow-hidden cursor-pointer border transition-all duration-500 group
                                            ${bentoClass}
                                             ${isActive
                                                ? 'bg-[#0071b9] border-[#0071b9] shadow-xl scale-[0.98] animate-tactile-pop'
                                                : `bg-[#f5f7fa] border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-slate-300 hover:shadow-md active:scale-[0.98]`
                                            }
                                        `}
                                    >
                                        {/* Bento Card Content */}
                                        <div className="absolute inset-0 p-5 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div className={`
                                                    transition-all duration-300
                                                     ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}
                                                `}>
                                                    {details.icon}
                                                </div>

                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePlatformSelect(p);
                                                    }}
                                                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 shadow-lg ${isActive ? 'bg-white' : 'bg-white shadow-[0_4px_10px_rgba(0,0,0,0.05)]'}`}
                                                >
                                                    <ChevronRightIcon className={`w-5 h-5 ${isActive ? 'text-[#0071b9]' : 'text-slate-300'}`} />
                                                </div>
                                            </div>

                                            <div className="flex flex-col">
                                                {/* 
                                                <span className={`text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-300 mb-1 ${isActive ? 'text-black/40' : 'text-white/40'}`}>
                                                    {details.tagline}
                                                </span>
                                                */}
                                                <div className="flex flex-col leading-tight">
                                                    <h3 className={`font-black tracking-tighter text-xl transition-colors duration-500 ${isActive ? 'text-white' : 'text-[#122646]'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                                                        {details.name}
                                                    </h3>
                                                    <p className={`text-[11px] font-medium transition-opacity ${isActive ? 'text-white/60' : 'text-slate-400'}`}>
                                                        {details.sub}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                    </div>

                    {/* Bottom Section - Promotional Card (AI Omakase Mode Redesign) */}
                    <div className="mt-4 md:mt-6">
                        <div
                            onClick={!isGoogleMaps ? handleOmakaseStart : undefined}
                            className={`
                                relative group transition-all duration-700 my-1
                                rounded-[32px] overflow-hidden
                                ${!isGoogleMaps ? 'cursor-pointer active:scale-95' : 'cursor-not-allowed opacity-60 grayscale'}
                                ${isOmakaseLoading ? 'scale-[0.98]' : (!isGoogleMaps ? 'hover:scale-[1.02] hover:-translate-y-1.5' : '')}
                                ${!isGoogleMaps ? 'shadow-[0_10px_30px_rgba(0,113,185,0.08)] hover:shadow-[0_25px_50px_rgba(0,113,185,0.18)]' : 'shadow-sm border border-stone-200'}
                            `}
                            style={{
                                backgroundColor: !isGoogleMaps ? '#d8e9f4' : '#f3f4f6',
                                clipPath: 'polygon(0% 0%, 100% 0%, 100% 35%, 98% 40%, 98% 60%, 100% 65%, 100% 100%, 0% 100%, 0% 65%, 2% 60%, 2% 40%, 0% 35%)'
                            }}
                        >
                            {/* Texture & Glass Layer */}
                            {!isGoogleMaps && <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] opacity-50 pointer-events-none" />}

                            {/* Shine Effect */}
                            {!isGoogleMaps && (
                                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/2 animate-ticket-shine" />
                                </div>
                            )}

                            {/* Decorative Background Glows */}
                            {!isGoogleMaps && (
                                <>
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/30 rounded-full blur-[40px] pointer-events-none group-hover:bg-white/50 transition-colors duration-700" />
                                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#0071b9]/5 rounded-full blur-[30px] pointer-events-none" />
                                </>
                            )}

                            <div className="relative p-5 pl-10 pr-6 flex items-center justify-between">
                                {/* Left Content */}
                                <div className="relative z-10 flex flex-col gap-6">
                                    <div className={`self-start inline-flex px-4 py-1.5 rounded-full ${!isGoogleMaps ? 'bg-[#0071b9]' : 'bg-stone-400'} text-[9px] font-black text-white uppercase tracking-[0.2em] shadow-sm`}>
                                        {isGoogleMaps ? '利用不可' : 'AIが自動提案'}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className={`text-[24px] font-black tracking-tighter leading-none whitespace-nowrap ${!isGoogleMaps ? 'text-[#0071b9]' : 'text-stone-400'}`}>
                                                AIおまかせ生成
                                            </h4>
                                            {!isGoogleMaps && <SparklesIcon className="w-5 h-5 text-[#0071b9] animate-pulse" />}
                                        </div>
                                        <p className="text-[11px] text-stone-500 font-bold leading-relaxed">
                                            {isGoogleMaps ? (
                                                'Googleマップ選択時は利用できません'
                                            ) : (
                                                <>
                                                    今日のおすすめやお店の様子を入力するだけで、<br />
                                                    AIが魅力的な投稿に仕上げます。
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Right Action "Ticket" Button */}
                                <div className="relative z-10 flex items-center justify-center">
                                    <div className={`
                                        w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-500
                                        ${isOmakaseLoading ? 'bg-white scale-90' : (!isGoogleMaps ? 'bg-white group-hover:bg-[#0071b9] group-hover:scale-110 group-active:scale-95 group-hover:rotate-6' : 'bg-stone-200 shadow-none')}
                                    `}>
                                        {isOmakaseLoading ? (
                                            <div className="w-5 h-5 border-2 border-[#0071b9]/20 border-t-[#0071b9] rounded-full animate-spin" />
                                        ) : (
                                            <ChevronRightIcon className={`w-6 h-6 ${!isGoogleMaps ? 'text-[#0071b9] group-hover:text-white' : 'text-stone-400'} transition-colors duration-500 ${!isGoogleMaps ? 'animate-arrow-flow' : ''}`} />
                                        )}
                                    </div>

                                </div>
                            </div>

                            {/* Ticket Perforation Line (Visual Only) */}
                            <div className={`absolute top-[8%] bottom-[8%] right-[25%] w-px border-r-2 border-dotted ${!isGoogleMaps ? 'border-[#0071b9]/20' : 'border-stone-300'} pointer-events-none`} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Trend Calendar Overlay */}
            <MobileCalendarOverlay
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
                onSelectEvent={handleTrendStrategy}
                industry={storeProfile?.industry}
                description={storeProfile?.description}
                isGoogleMaps={isGoogleMaps}
            />

            {/* Bottom Sheet Drawer - Monochrome Style */}
            {isStepDrawerOpen && (
                <div className="absolute inset-0 z-[130] flex items-end">
                    {/* Immersive Backdrop */}
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => {
                        setIsStepDrawerOpen(false);
                        // Reset step to platform when closing from input/confirm steps
                        if (mobileStep !== 'result') {
                            setMobileStep('platform');
                        }
                    }} />

                    {/* Sliding Panel (Monochrome) */}
                    <div className={`absolute bottom-0 left-0 right-0 bg-[#FAFAFA] border-t border-[#E5E5E5] rounded-t-[54px] shadow-[0_-20px_60px_rgba(0,0,0,0.1)] animate-nyoki flex flex-col ${mobileStep === 'platform' ? 'h-[88%]' : 'h-[96%]'} ${mobileStep === 'result' ? 'pb-8 safe-area-bottom' : 'pb-0'}`}>
                        {/* Drag Handle */}
                        <div className="w-full flex justify-center py-6">
                            <div className="w-16 h-1.5 bg-[#E5E5E5] rounded-full" />
                        </div>

                        {/* Drawer Header - Hidden during AI Refinement */}
                        {!refiningKey && (
                            <div className="px-8 pb-4 flex items-center justify-between animate-in fade-in duration-300">
                                <div className="flex items-center gap-4">
                                    <button onClick={handleBackStep} className="w-12 h-12 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center shadow-sm active:scale-90 transition-all">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                                    </button>
                                    <div className="flex flex-col">
                                        <h3 className="text-[17px] font-black text-[#0071b9] tracking-tight leading-none mb-1">
                                            {mobileStep === 'input' ? '投稿内容を入力' : mobileStep === 'confirm' ? '投稿内容の確認' : '生成完了'}
                                        </h3>
                                        <span className="text-[10px] font-black text-[#666666] uppercase tracking-[0.2em] leading-none">
                                            {mobileStep === 'input' ? 'STEP 2 / 3' : mobileStep === 'confirm' ? 'STEP 3 / 3' : 'SUCCESS!'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex -space-x-2">
                                    {platforms.map(p => (
                                        <div key={p} className="w-10 h-10 rounded-full bg-white border-2 border-[#FAFAFA] flex items-center justify-center shadow-sm z-10">
                                            {getPlatformIcon(p, "w-5 h-5")}
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => {
                                            setIsStepDrawerOpen(false);
                                            // ALWAYS reset to platform to ensure footer contrast resets (Dark Mode)
                                            setMobileStep('platform');
                                        }}
                                        className="w-10 h-10 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center shadow-sm active:scale-90 transition-all ml-2 z-20"
                                    >
                                        <CloseIcon className="w-5 h-5 text-[#111111]" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Drawer Content - Redesigned for Sticky Actions */}
                        <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
                            {mobileStep === 'input' && (
                                <div className="flex-1 flex flex-col min-h-0 animate-in fade-in zoom-in-95 duration-700">

                                    {/* 1. Top Fixed Header Section */}
                                    {!isGoogleMaps && (
                                        <div className="flex-shrink-0 flex justify-center py-4 bg-gradient-to-b from-[#FAFAFA] to-transparent z-10">
                                            <button
                                                onClick={toggleVoiceInput}
                                                className={`relative w-28 h-28 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-700 ${isListening ? 'scale-110' : 'hover:scale-105'}`}
                                            >
                                                {/* Animated Rings for Listening - Monochrome */}
                                                {isListening && (
                                                    <>
                                                        <div className="absolute inset-0 rounded-full bg-[#111111] opacity-10 animate-ping [animation-duration:2s]" />
                                                        <div className="absolute inset-4 rounded-full bg-[#111111] opacity-10 animate-pulse [animation-duration:1s]" />
                                                    </>
                                                )}
                                                <div className={`w-full h-full rounded-full flex flex-col items-center justify-center transition-all duration-500 shadow-xl border border-white/40 ${isListening ? 'bg-[#111111] text-white' : 'bg-white text-[#111111] border-[#E5E5E5]'}`}>
                                                    {isListening ? (
                                                        <div className="flex gap-1.5 h-6 items-center">
                                                            <div className="w-1 h-5 bg-white rounded-full animate-bounce [animation-delay:0s]" />
                                                            <div className="w-1 h-7 bg-white rounded-full animate-bounce [animation-delay:0.1s]" />
                                                            <div className="w-1 h-5 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                                                        </div>
                                                    ) : (
                                                        <MicIcon className="w-10 h-10 text-[#111111]" />
                                                    )}
                                                    <span className={`mt-1.5 text-[8px] font-black uppercase tracking-[0.2em] ${isListening ? 'text-white' : 'text-[#999999]'}`}>
                                                        {isListening ? '聞き取り中...' : '音声入力'}
                                                    </span>
                                                </div>
                                            </button>
                                        </div>
                                    )}

                                    {/* 2. Middle Scrollable Area (Main Text inputs) */}
                                    <div className="flex-1 overflow-y-auto px-8 py-2">
                                        <div className="w-full relative py-2 mb-4">
                                            {/* AI Inspiration Deck for "AI Standard" */}
                                            <InspirationDeck
                                                storeProfile={storeProfile}
                                                // Show if plain-ai AND (empty input OR default omakase prompt)
                                                isVisible={
                                                    activePresetId === 'plain-ai' &&
                                                    (!inputText || inputText.startsWith("✨ AIおまかせ生成")) &&
                                                    !isGoogleMaps
                                                }
                                                cachedCards={cachedInspirationCards}
                                                onCardsLoaded={setCachedInspirationCards}
                                                onSelect={(prompt) => {
                                                    onInputTextChange(prompt);
                                                    // Optional: auto-focus or scroll?
                                                }}
                                            />

                                            <div className="text-center space-y-2 mb-6">
                                                <h4 className="text-xl font-bold text-[#111111]">{isGoogleMaps ? 'Review Reply' : 'New Post'}</h4>
                                                <p className="text-sm text-[#666666]">
                                                    {isGoogleMaps ? 'Googleマップの口コミを貼り付けてください' : '今日はどんなことを伝えますか？'}
                                                </p>
                                            </div>
                                            <AutoResizingTextarea
                                                value={inputText}
                                                onChange={(e) => onInputTextChange(e.target.value)}
                                                placeholder={isGoogleMaps ? "こちらにお客様からの口コミを貼り付けてください。丁寧な返信案をいくつか作成します。" : "「旬の食材が入荷した」「雨の日限定の割引をする」など、短いメモ書きでも大丈夫ですよ。"}
                                                className="w-full min-h-[220px] p-8 bg-white border border-[#E5E5E5] rounded-[40px] text-lg font-bold leading-relaxed focus:outline-none focus:border-[#111111] transition-all placeholder:text-[#CCCCCC] text-[#111111] resize-none overflow-hidden"
                                            />
                                            {isGoogleMaps && (
                                                <button
                                                    onClick={toggleVoiceInput}
                                                    className={`absolute bottom-6 left-6 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${isListening ? 'bg-[#111111] text-white animate-pulse' : 'bg-[#F5F5F5] text-[#111111]'}`}
                                                >
                                                    <MicIcon className="w-6 h-6" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* 3. Sticky Action Footer */}
                                    <div className="p-6 pb-12 safe-area-bottom border-t border-[#E5E5E5]/50 flex-shrink-0 bg-[#FAFAFA] flex flex-col gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.02)] z-20">

                                        {!isListening && (
                                            <button
                                                onClick={() => {
                                                    setMobileStep('confirm');
                                                }}
                                                disabled={!inputText.trim()}
                                                className={`w-full py-5 rounded-[28px] font-black text-sm uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 ${inputText.trim()
                                                    ? 'bg-[#0071b9] text-white'
                                                    : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                                                    }`}
                                            >
                                                確認画面へ
                                                <ChevronRightIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {mobileStep === 'confirm' && (
                                <div className="flex-1 relative min-h-0 animate-in fade-in slide-in-from-bottom-10 duration-700">
                                    {/* Scrollable Preview and Settings */}
                                    <div className="absolute inset-0 overflow-y-auto px-8 py-4 pb-[240px] space-y-4 no-scrollbar scrollbar-hide">
                                        <div className="flex flex-col gap-4">
                                            {/* Preview Box - Brand Style */}
                                            <div className="bg-white/95 backdrop-blur-sm border border-stone-100 rounded-[40px] p-8 min-h-[180px] relative shadow-sm overflow-hidden group">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#d8e9f4]/30 rounded-full blur-3xl -mr-16 -mt-16" />
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex gap-1.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#0071b9]/30" />
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#0071b9]/30" />
                                                    </div>
                                                    <span className="text-[10px] font-black text-[#122646] uppercase tracking-[0.2em]">入力内容の確認</span>
                                                </div>
                                                <div className="text-[#122646] text-[15px] font-bold leading-relaxed">
                                                    {inputText.length > 200 ? inputText.substring(0, 200) + '...' : inputText || "ここに内容が表示されます..."}
                                                </div>

                                                {/* GMap Star Rating */}
                                                {isGoogleMaps && (
                                                    <div className="mt-4 pt-4 border-t border-[#122646]/5 flex flex-col items-center gap-2">
                                                        <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">口コミの評価</span>
                                                        <div className="flex gap-2">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <button
                                                                    key={star}
                                                                    onClick={() => onStarRatingChange(star)}
                                                                    className="transition-transform active:scale-95"
                                                                >
                                                                    <StarIcon
                                                                        className={`w-7 h-7 transition-all ${star <= (starRating || 0)
                                                                            ? 'text-[#f2e018] fill-[#f2e018] drop-shadow-sm'
                                                                            : 'text-[#E5E5E5]'
                                                                            }`}
                                                                    />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <button onClick={() => setMobileStep('input')} className="absolute bottom-6 right-8 w-11 h-11 bg-white border border-[#E5E5E5] rounded-2xl text-[#999999] hover:text-[#111111] transition-all flex items-center justify-center active:scale-95 shadow-sm">
                                                    <RotateCcwIcon className="w-5 h-5" />
                                                </button>
                                            </div>


                                            {/* Target Audience - Horizontal Scroll for Compactness */}
                                            {targetAudiences && (
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex items-center justify-between px-2">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[11px] font-black text-[#122646] uppercase tracking-[0.2em]">ターゲット設定</span>
                                                            <label className="flex items-center gap-1.5 cursor-pointer group/label">
                                                                <div className="relative flex items-center justify-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isDefaultAudienceEnabled}
                                                                        onChange={(e) => setIsDefaultAudienceEnabled(e.target.checked)}
                                                                        className="peer appearance-none w-3.5 h-3.5 rounded border border-stone-300 checked:bg-[#0071b9] checked:border-[#0071b9] transition-all"
                                                                    />
                                                                    <svg className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </div>
                                                                <span className="text-[9px] font-bold text-stone-400 group-hover/label:text-stone-600 transition-colors">デフォルトに設定</span>
                                                            </label>
                                                        </div>
                                                        <span className="text-[9px] font-bold text-stone-400">※複数選択可</span>
                                                    </div>
                                                    <div className="flex overflow-x-auto gap-2 pb-2 pt-2 -mx-2 px-3 no-scrollbar scrollbar-hide">
                                                        {primaryAudienceList.map(target => (
                                                            <button
                                                                key={target}
                                                                onClick={() => handleTargetAudienceToggle(target)}
                                                                className={`
                                                                    flex-shrink-0 px-4 py-2 rounded-xl font-bold text-[11px] transition-all active:scale-95 border whitespace-nowrap
                                                                    ${targetAudiences?.includes(target)
                                                                        ? 'bg-[#122646] text-white border-[#122646] shadow-md'
                                                                        : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'
                                                                    }
                                                                `}
                                                            >
                                                                {target}
                                                            </button>
                                                        ))}

                                                        {/* Show All Toggle or Secondary List */}
                                                        {secondaryAudienceList.length > 0 && (
                                                            <>
                                                                {!isAudienceExpanded ? (
                                                                    <button
                                                                        onClick={() => setIsAudienceExpanded(true)}
                                                                        className="flex-shrink-0 px-3 py-2 rounded-xl font-bold text-[10px] bg-stone-100 text-stone-400 border border-stone-100 hover:bg-stone-200 transition-colors flex items-center gap-1 whitespace-nowrap"
                                                                    >
                                                                        <span>＋ 他のターゲット</span>
                                                                    </button>
                                                                ) : (
                                                                    secondaryAudienceList.map(target => (
                                                                        <button
                                                                            key={target}
                                                                            onClick={() => handleTargetAudienceToggle(target)}
                                                                            className={`
                                                                                flex-shrink-0 px-4 py-2 rounded-xl font-bold text-[11px] transition-all active:scale-95 border bg-white text-stone-500 border-stone-200 hover:border-stone-300 opacity-80 whitespace-nowrap
                                                                            `}
                                                                        >
                                                                            {target}
                                                                        </button>
                                                                    ))
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Style Selection - Horizontal Pill Style (Monochrome) */}
                                            <div className="flex flex-col gap-4">
                                                <div className="flex items-center justify-between px-2">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[11px] font-black text-[#122646] uppercase tracking-[0.2em]">スタイルを選ぶ</span>
                                                        <label className="flex items-center gap-1.5 cursor-pointer group/label">
                                                            <div className="relative flex items-center justify-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isDefaultStyleEnabled}
                                                                    onChange={(e) => setIsDefaultStyleEnabled(e.target.checked)}
                                                                    className="peer appearance-none w-3.5 h-3.5 rounded border border-stone-300 checked:bg-[#0071b9] checked:border-[#0071b9] transition-all"
                                                                />
                                                                <svg className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                            <span className="text-[9px] font-bold text-stone-400 group-hover/label:text-stone-600 transition-colors">デフォルトに設定</span>
                                                        </label>
                                                    </div>
                                                    <button onClick={onOpenPresetModal} className="text-[10px] font-black text-[#0071b9] uppercase tracking-widest bg-[#d8e9f4]/30 px-3 py-1 rounded-full border border-[#0071b9]/20 hover:bg-[#d8e9f4]/50 transition-all">編集</button>
                                                </div>
                                                <div className="flex overflow-x-auto gap-3 pb-2 pt-2 -mx-2 px-3 no-scrollbar scrollbar-hide">
                                                    <button
                                                        onClick={() => onApplyPreset({ id: 'plain-ai' } as any)}
                                                        className={`flex-shrink-0 px-8 py-3 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 shadow-sm border ${activePresetId === 'plain-ai' ? 'bg-[#0071b9] text-white border-[#0071b9] scale-105 active:scale-95' : 'bg-white/95 backdrop-blur-sm border-stone-100 text-stone-400'}`}
                                                    >
                                                        AI標準
                                                    </button>
                                                    {presets.map((p) => {
                                                        const isSelected = activePresetId === p.id;
                                                        return (
                                                            <button
                                                                key={p.id}
                                                                onClick={() => onApplyPreset(p)}
                                                                className={`flex-shrink-0 px-8 py-3 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 shadow-sm border truncate max-w-[160px] ${isSelected ? 'bg-[#0071b9] text-white border-[#0071b9] scale-105 active:scale-95' : 'bg-white/95 backdrop-blur-sm border-stone-100 text-stone-400'}`}
                                                            >
                                                                {p.name}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Custom Prompt (Always Visible) */}
                                            <div className="my-2">
                                                <div className="bg-[#f5f7fa] px-6 py-4 rounded-[32px] border border-stone-200 flex flex-col gap-2 shadow-sm active:border-[#0071b9]/30 transition-colors">
                                                    <div className="flex items-center gap-1.5">
                                                        <AutoSparklesIcon className="w-3 h-3 text-[#0071b9]" />
                                                        <span className="text-[8px] font-black text-stone-500 uppercase tracking-[0.2em]">追加指示（任意）</span>
                                                    </div>
                                                    <AutoResizingTextarea
                                                        value={customPrompt}
                                                        onChange={(e) => onCustomPromptChange(e.target.value)}
                                                        placeholder="AIへの具体的なお願いはこちらに..."
                                                        className="bg-transparent text-sm font-bold text-[#122646] focus:outline-none resize-none min-h-[32px] placeholder:text-stone-300 w-full"
                                                    />
                                                </div>
                                            </div>

                                            {/* Fine-tuning Settings (Tone, Length, Supplement) */}
                                            {(!isStyleLocked || !isX) && (
                                                <div className="mt-8 px-2 space-y-8">
                                                    {/* Settings Grid - Monochrome */}
                                                    <div className="flex gap-8 mb-4">
                                                        {/* Tone Slider - Hide if Locked */}
                                                        {!isStyleLocked && (
                                                            <div className="flex-1 flex flex-col gap-3">
                                                                <div className="flex items-center justify-between px-1">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className="text-[8px] font-black text-stone-400 uppercase tracking-[0.2em]">トーン</span>
                                                                    </div>
                                                                </div>
                                                                <div className="relative px-1 pt-1 pb-2">
                                                                    <div className="absolute top-[6px] left-1 right-1 h-[1.5px] bg-stone-200" />
                                                                    <div className="relative flex justify-between items-center h-3">
                                                                        {TONES.map((t) => {
                                                                            const isActive = tone === t.id;
                                                                            return (
                                                                                <button
                                                                                    key={t.id}
                                                                                    onClick={() => onToneChange(t.id)}
                                                                                    className="relative z-10 flex flex-col items-center group w-full first:items-start last:items-end"
                                                                                >
                                                                                    <div className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${isActive ? 'bg-[#0071b9] border-[#0071b9] scale-110' : 'bg-white border-stone-300'}`} />
                                                                                    <span className={`absolute -bottom-4 text-[8px] font-black transition-colors duration-300 whitespace-nowrap ${isActive ? 'text-[#0071b9]' : 'text-stone-400'}`}>
                                                                                        {t.label}
                                                                                    </span>
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Length Slider */}
                                                        {!isX && (
                                                            <div className="flex-1 flex flex-col gap-3">
                                                                <div className="flex items-center justify-between px-1">
                                                                    <span className="text-[8px] font-black text-stone-400 uppercase tracking-[0.2em]">長さ</span>
                                                                </div>
                                                                <div className="relative px-1 pt-1 pb-2">
                                                                    <div className="absolute top-[6px] left-1 right-1 h-[1.5px] bg-stone-200" />
                                                                    <div className="relative flex justify-between items-center h-3">
                                                                        {LENGTHS.map((l) => {
                                                                            const isActive = length === l.id;
                                                                            return (
                                                                                <button
                                                                                    key={l.id}
                                                                                    onClick={() => onLengthChange(l.id)}
                                                                                    className="relative z-10 flex flex-col items-center group w-full first:items-start last:items-end"
                                                                                >
                                                                                    <div className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${isActive ? 'bg-[#0071b9] border-[#0071b9] scale-110' : 'bg-white border-stone-300'}`} />
                                                                                    <span className={`absolute -bottom-4 text-[8px] font-black transition-colors duration-300 whitespace-nowrap ${isActive ? 'text-[#0071b9]' : 'text-stone-400'}`}>
                                                                                        {l.label}
                                                                                    </span>
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Store Supplement (GMap) - Note: Only renders if isGoogleMaps, handled within this block but structure is safe */}
                                                    {isGoogleMaps && (
                                                        <div className="bg-[#f5f7fa] px-6 py-4 rounded-[28px] border border-stone-200 flex flex-col gap-2 shadow-sm">
                                                            <span className="text-[8px] font-black text-stone-500 uppercase tracking-[0.2em]">補足情報 / 当日の事情</span>
                                                            <AutoResizingTextarea
                                                                value={storeSupplement}
                                                                onChange={(e) => onStoreSupplementChange(e.target.value)}
                                                                placeholder="例：急な欠勤でお待たせした、感謝を伝えたい等"
                                                                className="bg-transparent text-sm font-bold text-[#122646] focus:outline-none resize-none min-h-[40px] placeholder:text-stone-300"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {mobileStep === 'result' && (
                                <div className="flex-1 overflow-y-auto pb-4 animate-in fade-in slide-in-from-bottom-10 duration-700 px-0">
                                    <PostResultTabs
                                        results={generatedResults}
                                        activeTab={activeResultTab}
                                        onTabChange={onResultTabChange!}
                                        onManualEdit={onManualEdit!}
                                        onToggleFooter={onToggleFooter!}
                                        onRefine={onRefine!}
                                        onRegenerateSingle={onRegenerateSingle!}
                                        onShare={onShare!}
                                        getShareButtonLabel={getShareButtonLabel!}
                                        storeProfile={storeProfile}
                                        refiningKey={refiningKey!}
                                        onRefineToggle={onRefineToggle!}
                                        refineText={refineText!}
                                        onRefineTextChange={onRefineTextChange!}
                                        onPerformRefine={onPerformRefine!}
                                        isRefining={isRefining!}
                                        includeFooter={includeFooter!}
                                        onIncludeFooterChange={onIncludeFooterChange!}
                                        onAutoFormat={onAutoFormat!}
                                        isAutoFormatting={isAutoFormatting!}
                                        onCopy={onCopy!}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Step 3 Sticky Action Area - Fixed for Hitbox and Layout accuracy */}
                        {mobileStep === 'confirm' && (
                            <div className="absolute bottom-0 left-0 right-0 z-[120] flex flex-col items-center">
                                {/* Gradient Fade Border */}
                                <div className="w-full h-16 bg-gradient-to-b from-transparent to-[#FAFAFA] pointer-events-none" />

                                {/* Opaque Background with Content */}
                                <div className="w-full bg-[#FAFAFA] px-8 pt-4 pb-[24px] flex flex-col items-center gap-4">
                                    <button
                                        onClick={onGenerate}
                                        disabled={isGenerating}
                                        className={`
                                            w-full group relative overflow-hidden rounded-[32px] py-6
                                            flex items-center justify-center
                                            transition-all duration-500 active:scale-95
                                            ${isGenerating ? 'bg-stone-300 cursor-not-allowed' : 'bg-[#f2e018] shadow-[0_10px_30px_rgba(0,113,185,0.2)]'}
                                        `}
                                    >
                                        <div className="relative flex items-center justify-center gap-3">
                                            {isGenerating ? (
                                                <div className="w-6 h-6 border-3 border-white/20 border-t-[#122646] rounded-full animate-spin" />
                                            ) : (
                                                <span className="text-[#122646] text-base font-black uppercase tracking-[0.3em]">
                                                    投稿案を作成する
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                    <p className="text-center text-[10px] font-bold text-[#999999] uppercase tracking-widest pointer-events-none">
                                        あなたの想いを、AIが最高の文章に仕上げます
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
