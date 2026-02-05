import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const hexToRgba = (hex: string, alpha: number) => {
    const sanitized = hex.replace('#', '');
    const bigint = parseInt(sanitized, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

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
    isAutoFormatting, onCopy, onMobileResultOpen, restoreTrigger,
    onStepChange, closeDrawerTrigger, openDrawerTrigger, onOpenOnboarding,
    onOpenSettings, targetStep,
    targetAudiences, onTargetAudiencesChange,
    question, onQuestionChange,
    topicPrompt, onTopicPromptChange
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
    const [isOmakaseMode, setIsOmakaseMode] = React.useState(false);



    // Handle Calendar Strategy Launch
    const handleTrendStrategy = (event: TrendEvent) => {
        setIsCalendarOpen(false);
        setIsOmakaseMode(false);
        // Start Omakase-like flow but with context
        setIsOmakaseLoading(true);
        if (platforms.length === 0) {
            onPlatformToggle(Platform.Instagram);
            onPlatformToggle(Platform.X);
        }
        if (onQuestionChange) onQuestionChange('');
        if (onTopicPromptChange) onTopicPromptChange('');
        setTimeout(() => {
            setIsOmakaseLoading(false);
            setMobileStep('confirm');
            setIsStepDrawerOpen(true);
            // Pre-fill context
            const strategyPrompt = `✨ ${event.title} (${event.date}) の生成指示：\n${event.prompt}\n\nおすすめハッシュタグ: ${event.hashtags.join(' ')}`;
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
        if (restoreTrigger && restoreTrigger > 0) {
            setMobileStep('result');
            setIsStepDrawerOpen(true);
        }
    }, [restoreTrigger]);

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
            setIsOmakaseMode(false);
            if (onQuestionChange) onQuestionChange('');
            if (onTopicPromptChange) onTopicPromptChange('');
            setMobileStep(targetStep === 'confirm' ? 'confirm' : 'input');
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

    // Ensure '全般' stays exclusive; remove it when other audiences are already selected
    React.useEffect(() => {
        if (targetAudiences && targetAudiences.length > 1 && targetAudiences.includes('全般')) {
            const filtered = targetAudiences.filter(t => t !== '全般');
            onTargetAudiencesChange(filtered);
        }
    }, [targetAudiences, onTargetAudiencesChange]);

    // Reset target audiences to plain state for Google Maps
    React.useEffect(() => {
        if (mobileStep === 'confirm' && isGoogleMaps && targetAudiences && targetAudiences.length > 0) {
            if (JSON.stringify(targetAudiences) !== JSON.stringify(['全般'])) {
                if (onTargetAudiencesChange) {
                    onTargetAudiencesChange(['全般']);
                }
            }
        }
    }, [mobileStep, isGoogleMaps, targetAudiences, onTargetAudiencesChange]);

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
        setIsOmakaseMode(false);
        if (onQuestionChange) onQuestionChange('');
        if (onTopicPromptChange) onTopicPromptChange('');
        onSetActivePlatform(p);
        setMobileStep('confirm');
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
        setIsOmakaseMode(true);
        setIsOmakaseLoading(true);
        onApplyPreset({ id: 'plain-ai' } as any); // Force AI Standard preset

        // "Magic" selection: Auto-select Instagram and X as defaults for Omakase
        if (platforms.length === 0) {
            onPlatformToggle(Platform.Instagram);
            onPlatformToggle(Platform.X);
        }
        if (onQuestionChange) onQuestionChange('');
        if (onTopicPromptChange) onTopicPromptChange('');

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

    // Clear inspiration cache if industry changes
    React.useEffect(() => {
        setCachedInspirationCards([]);
    }, [storeProfile?.industry]);

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
        <div className="flex flex-col h-full relative overflow-hidden font-inter bg-white" style={{ backgroundColor: 'white' }}>

            {/* Step 1: Home (Platform Grid) */}
            <div className={`flex flex-col h-full overflow-hidden relative transition-all duration-500 ${isStepDrawerOpen ? 'blur-md scale-[0.98] opacity-60' : 'opacity-100'}`}>
                <div className="flex-1 flex flex-col p-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-32 safe-area-bottom overflow-y-auto no-scrollbar">
                    {/* High-Design Header - Magazine Style Date & Minimal Avatar */}
                    <div className="flex items-start justify-between mb-10 px-1">
                        {/* Typography Date Display - Interactive Trigger */}
                        <div className="flex flex-col cursor-pointer active:scale-95 transition-transform" onClick={() => setIsCalendarOpen(true)}>
                            <span className="text-[10px] font-black text-[#2b2b2f]/60 uppercase tracking-[0.4em] ml-1 mb-1 z-10 relative flex items-center gap-1">
                                misepo <span className="bg-[#2b2b2f]/5 px-1 rounded text-[8px] tracking-normal text-[#2b2b2f]/80">HUB</span>
                            </span>
                            <div className="flex items-center gap-3 select-none">
                                <span className="text-[3.5rem] font-black text-[#2b2b2f] tracking-tighter leading-[0.8]">{day}</span>
                                <div className="flex flex-col justify-center gap-0.5 pt-1">
                                    <span className="text-sm font-black text-[#2b2b2f] uppercase tracking-widest leading-none">{month}</span>
                                    <span className="text-[10px] font-bold text-[#b0b0b0] uppercase tracking-[0.2em] leading-none">{weekday}</span>
                                </div>
                            </div>
                            <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#2b2b2f]/5 rounded-full mt-2 ml-1 self-start">
                                <p className="text-[10px] font-black text-[#2b2b2f] tracking-tight select-none flex items-center gap-1">
                                    カレンダー見る <ChevronRightIcon className="w-3 h-3 text-[#2b2b2f]" />
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                            <div className="flex items-center gap-3">
                                {plan?.plan !== 'professional' && plan?.plan !== 'monthly' && plan?.plan !== 'yearly' && plan?.plan !== 'pro' && (
                                    <a
                                        href="/start?upgrade=true"
                                        className="xl:hidden h-8 px-4 rounded-full bg-sunset text-white text-[9px] font-black uppercase tracking-[0.1em] shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-1.5 border border-white/20"
                                    >
                                        <SparklesIcon className="w-2.5 h-2.5" />
                                        {plan?.plan === 'free' || plan?.plan === 'trial' ? 'Go Pro' : 'Upgrade'}
                                    </a>
                                )}

                                {/* Decorative Avatar (Dynamic Store Initial) */}
                                <div className="relative group cursor-pointer" onClick={onOpenOnboarding}>
                                    <div className="absolute inset-0 bg-[#7F5AF0] rounded-full blur-[10px] opacity-20 group-hover:opacity-40 transition-opacity" />
                                    <div className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md border-[2px] border-slate-100">
                                        <span className="text-[#2b2b2f] font-black text-lg" style={{ transform: 'rotate(-10deg)', marginTop: '2px' }}>
                                            {storeProfile?.name?.charAt(0) || 'M'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* High-Contrast Credit Design with Gauge */}
                            {plan && typeof plan.usage !== 'undefined' && typeof plan.limit !== 'undefined' && (
                                <div className="flex flex-col items-end gap-1 scale-90 origin-right">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#edeff1] text-[#2b2b2f] border border-slate-100 shadow-sm overflow-hidden relative">
                                        <span className="text-[8px] font-black text-[#2b2b2f]/40 uppercase tracking-widest mr-1">CREDITS</span>
                                        <span className="text-sm font-black text-[#2b2b2f] leading-none">
                                            {Math.max(0, plan.limit - plan.usage)}
                                        </span>
                                        <span className="text-[10px] font-bold text-[#b0b0b0] leading-none">/ {plan.limit}</span>

                                        {/* Subtle Gauge Background */}
                                        <div className="absolute bottom-0 left-0 h-[2px] bg-slate-100 w-full" />
                                        {/* Active Gauge Fill */}
                                        <div
                                            className="absolute bottom-0 left-0 h-[2px] bg-[#4338CA] transition-all duration-1000"
                                            style={{ width: `${(Math.max(0, plan.limit - plan.usage) / plan.limit) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex gap-1 pr-1 items-center justify-between w-full">
                                        <div className="flex gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-[3px] w-5 rounded-full transition-colors duration-500 ${((plan.limit - plan.usage) / plan.limit) * 5 > i
                                                        ? 'bg-[#2b2b2f]'
                                                        : 'bg-slate-200'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-2 mt-6 mb-0">
                        <div className="flex flex-col gap-0.5 items-start">
                            <h2 className="text-[13px] font-black text-[#2b2b2f] tracking-tight">投稿先を選択</h2>
                            <p className="text-[10px] text-[#b0b0b0] font-bold uppercase tracking-[0.2em]">Select your canvas</p>
                        </div>

                        {/* Simultaneous Generation Toggle */}
                        <div className="flex items-center gap-3 bg-[#edeff1] px-4 py-2 rounded-2xl border border-slate-100 shadow-sm active:scale-95 transition-all cursor-pointer select-none"
                            onClick={onToggleMultiGen}>
                            <div className="flex flex-col items-end">
                                <span className={`text-[9px] font-black tracking-widest uppercase leading-none mb-0.5 ${isMultiGen ? 'text-[#2b2b2f]' : 'text-[#A0A0A0]'}`}>
                                    {isMultiGen ? 'ON' : 'OFF'}
                                </span>
                                <span className="text-[8px] font-bold text-[#A0A0A0] leading-none whitespace-nowrap">同時生成</span>
                            </div>
                            <div className={`
                                relative w-10 h-5 rounded-full transition-all duration-300
                                ${isMultiGen ? 'bg-[#2b2b2f]' : 'bg-[#edeff1]'}
                            `}>
                                <div className={`
                                    absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm
                                    ${isMultiGen ? 'translate-x-5' : 'translate-x-0'}
                                `} />
                            </div>
                        </div>
                    </div>


                    {/* Standard 2x2 Grid Platform Selection */}
                    <div className="grid grid-cols-2 gap-3 px-1 mt-6">
                        {(() => {
                            const getPlatformDetails = (platform: Platform, isActive: boolean) => {
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
                                        icon: <LineIcon className="w-7 h-7" isActive={isActive} activeTextFill="#1FA14D" textFill={isActive ? '#1FA14D' : '#ffffff'} />,
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
                                const details = getPlatformDetails(p, isActive);
                                const bentoClass = 'h-[110px]';

                                // Map brand colors
                                const brandColor = p === Platform.Instagram ? '#D23877' :
                                    p === Platform.X ? '#111827' :
                                        p === Platform.Line ? '#1FA14D' :
                                            p === Platform.GoogleMaps ? '#3F76DF' : '#2b2b2f';

                                const cardClasses = `
                                                relative rounded-[24px] overflow-hidden cursor-pointer border transition-all duration-200 ease-out group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-offset-white
                                                ${bentoClass}
                                                ${isActive
                                        ? 'scale-[1.02] border-[2.5px] shadow-none'
                                        : 'bg-[#f6f6f8] border-slate-200 shadow-[0_10px_30px_rgba(15,23,42,0.1)] hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(15,23,42,0.15)] active:translate-y-[1px] active:shadow-none'
                                    }
                                        `;

                                const cardStyle = isActive ? {
                                    borderColor: brandColor,
                                    backgroundColor: brandColor,
                                    boxShadow: `0 0 0 3px ${hexToRgba(brandColor, 0.35)}, 0 20px 45px rgba(15,23,42,0.25)`
                                } : {};

                                const ctaTextColor = isActive ? 'text-white/80' : 'text-[#2b2b2f]/70';

                                return (
                                    <div
                                        key={p}
                                        onClick={() => onPlatformToggle(p)}
                                        className={cardClasses}
                                        style={cardStyle}
                                    >
                                        {/* Bento Card Content */}
                                        <div className="absolute inset-0 px-5 py-4 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div
                                                    className={`
                                                        transition-all duration-500 transform
                                                         ${isActive ? 'scale-110' : 'scale-100'}
                                                    `}
                                                    style={{ color: isActive ? '#ffffff' : brandColor }}
                                                >
                                                    {details.icon}
                                                </div>

                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onPlatformToggle(p);
                                                    }}
                                                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 active:scale-90 shadow-sm"
                                                    style={isActive ? { backgroundColor: '#ffffff', color: brandColor } : { backgroundColor: '#e2e4e6', color: '#2b2b2f' }}
                                                >
                                                    {isActive ? (
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-in zoom-in-50 duration-300">
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                    ) : (
                                                        <ChevronRightIcon className={`w-5 h-5`} />
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col">
                                                <div className="flex flex-col leading-tight gap-1">
                                                    <h3 className={`font-black tracking-tighter text-xl transition-colors duration-500 whitespace-nowrap ${isActive ? 'text-white' : 'text-[#2b2b2f]'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                                                        {details.name}
                                                    </h3>
                                                    <p className={`text-[11px] font-medium ${isActive ? 'text-white/80' : 'text-[#b0b0b0]'}`}>
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

                    {/* Compact Horizontal Premium AI Omakase Card - Moved below grid */}
                    <div className="mt-12 mb-4">
                        <motion.div
                            onClick={!isGoogleMaps && platforms.length > 0 ? handleOmakaseStart : undefined}
                            whileTap={{ scale: 0.98 }}
                            className={`
                                relative group overflow-hidden rounded-[28px] bg-white border border-slate-100 p-4 flex items-center gap-4 transition-all duration-500
                                ${!isGoogleMaps && platforms.length > 0 ? 'cursor-pointer hover:shadow-lg hover:border-slate-200 shadow-sm' : 'cursor-not-allowed grayscale opacity-80'}
                            `}
                        >
                            {/* Left: Icon Box */}
                            <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md shadow-purple-100">
                                <SparklesIcon className="w-7 h-7 text-white" />
                            </div>

                            {/* Center: Texts & Badge */}
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h4 className="text-[17px] font-black tracking-tight text-[#1a1a1a]">
                                        AIおまかせ生成
                                    </h4>
                                    <div className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100">
                                        <span className="text-[8px] font-black text-blue-500 uppercase tracking-wider">
                                            SPECIAL
                                        </span>
                                    </div>
                                </div>
                                <p className="text-[11px] font-bold text-slate-400 truncate">
                                    最新のAIが最適な構成を自動で提案
                                </p>
                            </div>

                            {/* Right: Action Button */}
                            <div className="shrink-0">
                                <div className={`
                                    w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm group-hover:bg-white group-hover:scale-105 group-hover:border-slate-200 transition-all duration-300
                                    ${isOmakaseLoading ? 'animate-pulse' : ''}
                                `}>
                                    {isOmakaseLoading ? (
                                        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <StarIcon className="w-6 h-6 text-indigo-500" />
                                    )}
                                </div>
                            </div>

                            {/* Loading Progress Overlays */}
                            {isOmakaseLoading && (
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
                                />
                            )}
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Trend Calendar Overlay */}
            < MobileCalendarOverlay
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
                onSelectEvent={handleTrendStrategy}
                industry={storeProfile?.industry}
                description={storeProfile?.description}
                isGoogleMaps={isGoogleMaps}
            />

            {/* Bottom Sheet Drawer - Monochrome Style */}
            {
                isStepDrawerOpen && (
                    <div className="absolute inset-0 z-[130] flex items-end">
                        {/* Immersive Backdrop */}
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => {
                            setIsStepDrawerOpen(false);
                            // Reset step to platform when closing from input/confirm steps
                            if (mobileStep !== 'result') {
                                setMobileStep('platform');
                            }
                        }} />

                        {/* Sliding Panel (Light Theme) */}
                        <div className={`absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 rounded-t-[54px] shadow-[0_-20px_60px_rgba(0,0,0,0.08)] animate-nyoki flex flex-col ${mobileStep === 'platform' ? 'h-[88%]' : 'h-[96%]'} ${mobileStep === 'result' ? 'pb-8 safe-area-bottom' : 'pb-0'} z-[200]`}>
                            {/* Drag Handle */}
                            <div className="w-full flex justify-center py-6">
                                <div className="w-16 h-1.5 bg-[#2b2b2f]/10 rounded-full" />
                            </div>

                            {/* Drawer Header */}
                            {!refiningKey && (
                                <div className="px-8 pb-4 flex items-center justify-between animate-in fade-in duration-300">
                                    <div className="flex items-center gap-4">
                                        <button onClick={handleBackStep} className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm active:scale-90 transition-all">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2b2b2f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                                        </button>
                                        <div className="flex flex-col">
                                            <h3 className="text-[17px] font-black text-[#2b2b2f] tracking-tight leading-none mb-1">
                                                {mobileStep === 'input' ? '投稿内容を入力' : mobileStep === 'confirm' ? '投稿内容の確認' : '生成完了'}
                                            </h3>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
                                                {mobileStep === 'input' ? 'STEP 2 / 3' : mobileStep === 'confirm' ? 'STEP 3 / 3' : 'SUCCESS!'}
                                            </span>
                                        </div>
                                        {/* Forward Step (To Results) - Matches Back Button Style */}
                                        {generatedResults.length > 0 && mobileStep !== 'result' && (
                                            <button
                                                onClick={() => setMobileStep(mobileStep === 'input' ? 'confirm' : 'result')}
                                                className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm active:scale-90 transition-all"
                                            >
                                                <ChevronRightIcon className="w-6 h-6 text-[#2b2b2f]" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex -space-x-2">
                                        {platforms.map(p => (
                                            <div key={p} className="w-10 h-10 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center shadow-sm z-10">
                                                {getPlatformIcon(p, "w-5 h-5")}
                                            </div>
                                        ))}



                                        <button
                                            onClick={() => {
                                                setIsStepDrawerOpen(false);
                                                setMobileStep('platform');
                                            }}
                                            className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm active:scale-90 transition-all ml-2 z-20"
                                        >
                                            <CloseIcon className="w-5 h-5 text-[#2b2b2f]" />
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
                                            <div className="flex-shrink-0 flex justify-center py-4 bg-white z-10 border-b border-slate-50">
                                                <button
                                                    onClick={toggleVoiceInput}
                                                    className={`relative w-28 h-28 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-700 ${isListening ? 'scale-110' : 'hover:scale-105'}`}
                                                >
                                                    {/* Animated Rings for Listening */}
                                                    {isListening && (
                                                        <>
                                                            <div className="absolute inset-0 rounded-full bg-[#80CAFF]/20 animate-ping [animation-duration:2s]" />
                                                            <div className="absolute inset-4 rounded-full bg-[#80CAFF]/20 animate-pulse [animation-duration:1s]" />
                                                        </>
                                                    )}
                                                    <div className={`w-full h-full rounded-full flex flex-col items-center justify-center transition-all duration-500 shadow-xl border border-slate-100 ${isListening ? 'bg-[#2b2b2f] text-white' : 'bg-slate-50 text-[#2b2b2f]'}`}>
                                                        {isListening ? (
                                                            <div className="flex gap-1.5 h-6 items-center">
                                                                <div className="w-1 h-5 bg-white rounded-full animate-bounce [animation-delay:0s]" />
                                                                <div className="w-1 h-7 bg-white rounded-full animate-bounce [animation-delay:0.1s]" />
                                                                <div className="w-1 h-5 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                                                            </div>
                                                        ) : (
                                                            <MicIcon className="w-10 h-10 text-[#2b2b2f]" />
                                                        )}
                                                        <span className={`mt-1.5 text-[8px] font-black uppercase tracking-[0.2em] ${isListening ? 'text-white' : 'text-slate-400'}`}>
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
                                                    // Show if OmakaseMode AND plain-ai AND (empty input OR default omakase prompt)
                                                    isVisible={
                                                        isOmakaseMode &&
                                                        activePresetId === 'plain-ai' &&
                                                        (!inputText || inputText.startsWith("✨ AIおまかせ生成")) &&
                                                        !isGoogleMaps
                                                    }
                                                    cachedCards={cachedInspirationCards}
                                                    onCardsLoaded={setCachedInspirationCards}
                                                    onSelect={(prompt, q) => {
                                                        onInputTextChange(""); // Clear for user answer
                                                        if (onQuestionChange) onQuestionChange(q);
                                                        if (onTopicPromptChange) onTopicPromptChange(prompt);
                                                        setIsPromptExpanded(false);
                                                    }}
                                                />

                                                <div className="text-center space-y-2 mb-6">
                                                    <h4 className="text-xl font-bold text-[#2b2b2f]">{isGoogleMaps ? 'Review Reply' : 'New Post'}</h4>
                                                    <p className="text-sm text-slate-400">
                                                        {isGoogleMaps ? 'Googleマップの口コミを貼り付けてください' : '今日はどんなことを伝えますか？'}
                                                    </p>
                                                </div>
                                                {question && (
                                                    <div className="mb-6 p-6 bg-[#edeff1] border border-slate-100 rounded-[32px] animate-in slide-in-from-top-4 duration-500">
                                                        <div className="flex gap-3 items-start">
                                                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#80CAFF] via-[#C084FC] to-[#F87171] flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                <SparklesIcon className="w-4 h-4 text-white" />
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[10px] font-black text-[#C084FC] uppercase tracking-wider opacity-60">Sommelier Question</span>
                                                                <p className="text-[15px] font-bold text-[#2b2b2f] leading-relaxed italic">
                                                                    「{question}」
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <AutoResizingTextarea
                                                    value={inputText}
                                                    onChange={(e) => onInputTextChange(e.target.value)}
                                                    placeholder={question ? "こちらの質問への答えを短く入力してください..." : (isGoogleMaps ? "こちらにお客様からの口コミを貼り付けてください。丁寧な返信案をいくつか作成します。" : "「旬の食材が入荷した」「雨の日限定の割引をする」など、短いメモ書きでも大丈夫ですよ。")}
                                                    className="w-full min-h-[220px] p-8 bg-[#edeff1] border border-slate-100 rounded-[40px] text-lg font-bold leading-relaxed focus:outline-none focus:border-slate-200 transition-all placeholder:text-slate-300 text-[#2b2b2f] resize-none overflow-hidden"
                                                />

                                                {isGoogleMaps && (
                                                    <button
                                                        onClick={toggleVoiceInput}
                                                        className={`absolute bottom-6 left-6 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${isListening ? 'bg-[#4338CA] text-white animate-pulse' : 'bg-[#edeff1] text-[#2b2b2f]'}`}
                                                    >
                                                        <MicIcon className="w-6 h-6" />
                                                    </button>
                                                )}

                                                {inputText && (
                                                    <button
                                                        onClick={() => onInputTextChange("")}
                                                        className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-[#edeff1] border border-slate-100 flex items-center justify-center shadow-md active:scale-95 transition-all text-slate-400 hover:text-[#2b2b2f]"
                                                        title="入力をクリア"
                                                    >
                                                        <EraserIcon className="w-6 h-6" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* 3. Sticky Action Footer */}
                                        <div
                                            className="px-6 py-8 safe-area-bottom border-t border-slate-50 flex-shrink-0 flex flex-col gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.02)] z-[210] relative"
                                            style={{
                                                backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 5%, rgba(255,255,255,0.8) 30%, rgba(255,255,255,1) 70%)'
                                            }}
                                        >

                                            {!isListening && (
                                                <button
                                                    onClick={() => {
                                                        setMobileStep('confirm');
                                                    }}
                                                    disabled={!inputText.trim()}
                                                    className={`w-full py-5 rounded-[28px] font-black text-sm uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer ${inputText.trim()
                                                        ? 'bg-[#2b2b2f] text-white'
                                                        : 'bg-[#edeff1] text-slate-300 cursor-not-allowed shadow-none'
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
                                                <div className="bg-[#edeff1] border border-slate-100 rounded-[40px] p-8 min-h-[180px] relative shadow-sm overflow-hidden group">
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#80CAFF]/10 rounded-full blur-3xl -mr-16 -mt-16" />
                                                    <div className="flex items-center justify-between mb-6">
                                                        <div className="flex gap-1.5">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#80CAFF]/50" />
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#C084FC]/50" />
                                                        </div>
                                                        <span className="text-[10px] font-black text-[#2b2b2f] uppercase tracking-[0.2em]">入力内容の確認</span>
                                                    </div>
                                                    <div className="text-[#2b2b2f] text-[16px] font-bold leading-relaxed">
                                                        {inputText.length > 200 ? inputText.substring(0, 200) + '...' : inputText || "ここに内容が表示されます..."}
                                                    </div>

                                                    {/* GMap Star Rating */}
                                                    {isGoogleMaps && (
                                                        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col items-center gap-2">
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">口コミの評価</span>
                                                            <div className="flex gap-2">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <button
                                                                        key={star}
                                                                        onClick={() => onStarRatingChange(star)}
                                                                        className="transition-transform active:scale-95"
                                                                    >
                                                                        <StarIcon
                                                                            className={`w-7 h-7 transition-all ${star <= (starRating || 0)
                                                                                ? 'text-[#FFD166] fill-[#FFD166] drop-shadow-sm'
                                                                                : 'text-slate-200'
                                                                                }`}
                                                                        />
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <button onClick={() => setMobileStep('input')} className="absolute bottom-6 right-8 w-11 h-11 bg-[#e2e4e6] border border-slate-200 rounded-2xl text-slate-400 hover:text-[#2b2b2f] transition-all flex items-center justify-center active:scale-95 shadow-sm">
                                                        <RotateCcwIcon className="w-5 h-5" />
                                                    </button>
                                                </div>


                                                {/* Target Audience - Horizontal Scroll for Compactness - Hidden for Google Maps */}
                                                {!isGoogleMaps && targetAudiences && (
                                                    <div className="flex flex-col gap-3">
                                                        <div className="flex items-center justify-between px-2">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[11px] font-black text-[#2b2b2f] uppercase tracking-[0.2em]">ターゲット設定</span>
                                                                <label className="flex items-center gap-1.5 cursor-pointer group/label">
                                                                    <div className="relative flex items-center justify-center">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={isDefaultAudienceEnabled}
                                                                            onChange={(e) => setIsDefaultAudienceEnabled(e.target.checked)}
                                                                            className="peer appearance-none w-3.5 h-3.5 rounded border border-stone-300 checked:bg-[#2b2b2f] checked:border-[#2b2b2f] transition-all"
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
                                                                            ? 'bg-[#2b2b2f] text-white border-[#2b2b2f] shadow-md'
                                                                            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
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
                                                                                className="
                                                                            flex-shrink-0 px-4 py-2 rounded-xl font-bold text-[11px] transition-all active:scale-95 border bg-white text-stone-500 border-stone-200 hover:border-stone-300 opacity-80 whitespace-nowrap
                                                                        "
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
                                                            <span className="text-[11px] font-black text-[#2b2b2f] uppercase tracking-[0.2em]">スタイルを選ぶ</span>
                                                            <label className="flex items-center gap-1.5 cursor-pointer group/label">
                                                                <div className="relative flex items-center justify-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isDefaultStyleEnabled}
                                                                        onChange={(e) => setIsDefaultStyleEnabled(e.target.checked)}
                                                                        className="peer appearance-none w-3.5 h-3.5 rounded border border-[#666666] checked:bg-[var(--pop-violet-main)] checked:border-[var(--pop-violet-main)] transition-all"
                                                                    />
                                                                    <svg className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </div>
                                                                <span className="text-[9px] font-bold text-[#A0A0A0] group-hover/label:text-white transition-colors">デフォルトに設定</span>
                                                            </label>
                                                        </div>
                                                        <button onClick={onOpenPresetModal} className="text-[10px] font-black text-[var(--pop-violet-main)] uppercase tracking-widest bg-[var(--pop-violet-card)] px-3 py-1 rounded-full border border-white/10 hover:bg-white/10 transition-all">編集</button>
                                                    </div>
                                                    <div className="flex overflow-x-auto gap-3 pb-2 pt-2 -mx-2 px-3 no-scrollbar scrollbar-hide">
                                                        <button
                                                            onClick={() => onApplyPreset({ id: 'plain-ai' } as any)}
                                                            className={`flex-shrink-0 px-8 py-3 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 shadow-sm border ${activePresetId === 'plain-ai' ? 'bg-[#2b2b2f] text-white border-[#2b2b2f] scale-105 active:scale-95 shadow-black/10' : 'bg-[#edeff1] border-slate-100 text-slate-400 hover:text-[#2b2b2f]'}`}
                                                        >
                                                            AI標準
                                                        </button>
                                                        {presets.map((p) => {
                                                            const isSelected = activePresetId === p.id;
                                                            return (
                                                                <button
                                                                    key={p.id}
                                                                    onClick={() => onApplyPreset(p)}
                                                                    className={`flex-shrink-0 px-8 py-3 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 shadow-sm border truncate max-w-[160px] ${isSelected ? 'bg-[#2b2b2f] text-white border-[#2b2b2f] scale-105 active:scale-95 shadow-black/10' : 'bg-[#edeff1] border-slate-100 text-slate-400 hover:text-[#2b2b2f]'}`}
                                                                >
                                                                    {p.name}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Custom Prompt (Always Visible) */}
                                                <div className="my-2">
                                                    <div className="bg-[#edeff1] px-6 py-4 rounded-[32px] border border-slate-100 flex flex-col gap-2 shadow-sm active:border-slate-200 transition-colors">
                                                        <div className="flex items-center gap-1.5">
                                                            <AutoSparklesIcon className="w-3 h-3 text-[var(--pop-violet-main)]" />
                                                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">追加指示（任意）</span>
                                                        </div>
                                                        <AutoResizingTextarea
                                                            value={customPrompt}
                                                            onChange={(e) => onCustomPromptChange(e.target.value)}
                                                            placeholder="AIへの具体的なお願いはこちらに..."
                                                            className="bg-transparent text-sm font-bold text-[#2b2b2f] focus:outline-none resize-none min-h-[32px] placeholder:text-slate-300 w-full"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Store Supplement (Google Maps Only) - Moved here after Custom Prompt */}
                                                {isGoogleMaps && (
                                                    <div className="my-2">
                                                        <div className="bg-[#edeff1] px-6 py-4 rounded-[32px] border border-slate-100 flex flex-col gap-2 shadow-sm">
                                                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">補足情報 / 当日の事情</span>
                                                            <AutoResizingTextarea
                                                                value={storeSupplement}
                                                                onChange={(e) => onStoreSupplementChange(e.target.value)}
                                                                placeholder="例：急な欠勤でお待たせした、感謝を伝えたい等"
                                                                className="bg-transparent text-sm font-bold text-[#2b2b2f] focus:outline-none resize-none min-h-[40px] placeholder:text-slate-300"
                                                            />
                                                        </div>
                                                    </div>
                                                )}

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
                                                                            <span className="text-[8px] font-black text-[#666666] uppercase tracking-[0.2em]">トーン</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="relative px-1 pt-1 pb-2">
                                                                        <div className="absolute top-[6px] left-1 right-1 h-[1.5px] bg-slate-100" />
                                                                        <div className="relative flex justify-between items-center h-3">
                                                                            {TONES.map((t) => {
                                                                                const isActive = tone === t.id;
                                                                                return (
                                                                                    <button
                                                                                        key={t.id}
                                                                                        onClick={() => onToneChange(t.id)}
                                                                                        className="relative z-10 flex flex-col items-center group w-full first:items-start last:items-end"
                                                                                    >
                                                                                        <div className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${isActive ? 'bg-[#2b2b2f] border-[#2b2b2f] scale-110' : 'bg-white border-slate-200'}`} />
                                                                                        <span className={`absolute -bottom-4 text-[8px] font-black transition-colors duration-300 whitespace-nowrap ${isActive ? 'text-[#2b2b2f]' : 'text-slate-400'}`}>
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
                                                                        <span className="text-[8px] font-black text-[#666666] uppercase tracking-[0.2em]">長さ</span>
                                                                    </div>
                                                                    <div className="relative px-1 pt-1 pb-2">
                                                                        <div className="absolute top-[6px] left-1 right-1 h-[1.5px] bg-slate-100" />
                                                                        <div className="relative flex justify-between items-center h-3">
                                                                            {LENGTHS.map((l) => {
                                                                                const isActive = length === l.id;
                                                                                return (
                                                                                    <button
                                                                                        key={l.id}
                                                                                        onClick={() => onLengthChange(l.id)}
                                                                                        className="relative z-10 flex flex-col items-center group w-full first:items-start last:items-end"
                                                                                    >
                                                                                        <div className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${isActive ? 'bg-[#2b2b2f] border-[#2b2b2f] scale-110' : 'bg-white border-slate-200'}`} />
                                                                                        <span className={`absolute -bottom-4 text-[8px] font-black transition-colors duration-300 whitespace-nowrap ${isActive ? 'text-[#2b2b2f]' : 'text-slate-400'}`}>
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

                                                        {/* Store Supplement removed from here - now appears after Custom Prompt */}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {mobileStep === 'result' && (
                                    <div className="flex-1 overflow-x-hidden overflow-y-auto pb-4 animate-in fade-in slide-in-from-bottom-10 duration-700 px-0">
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
                                <div className="absolute bottom-0 left-0 right-0 z-[150] flex flex-col items-center">
                                    {/* Gradient Fade Border */}
                                    {/* Gradient fade removed */}

                                    {/* Opaque Background with Content */}
                                    <div
                                        className="w-full px-8 pt-24 pb-[24px] flex flex-col items-center gap-4 relative"
                                        style={{
                                            backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 30%, rgba(255,255,255,1) 60%)',
                                            backgroundRepeat: 'no-repeat'
                                        }}
                                    >
                                        <button
                                            onClick={onGenerate}
                                            disabled={isGenerating}
                                            className={`
                                            w-full group relative overflow-hidden rounded-[32px] py-6
                                            flex items-center justify-center
                                            transition-all duration-500 active:scale-95 cursor-pointer
                                            ${isGenerating ? 'bg-slate-100 cursor-not-allowed' : 'bg-[#2b2b2f] shadow-[0_15px_45px_rgba(0,0,0,0.15)]'}
                                        `}
                                        >
                                            <div className="relative flex items-center justify-center gap-3">
                                                {isGenerating ? (
                                                    <div className="w-6 h-6 border-3 border-[#2b2b2f]/20 border-t-[#2b2b2f] rounded-full animate-spin" />
                                                ) : (
                                                    <span className="text-white text-base font-black uppercase tracking-[0.3em] drop-shadow-sm">
                                                        投稿案を作成する
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
        </div>
    );
};
