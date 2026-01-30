import React from 'react';
import { Platform, PostPurpose, GoogleMapPurpose } from '../../../types';
import { AutoResizingTextarea } from './AutoResizingTextarea';
import { getPlatformIcon } from './utils';
import {
    AutoSparklesIcon, MagicWandIcon, MicIcon, EraserIcon, InfoIcon,
    SparklesIcon, RotateCcwIcon, InstagramIcon, LineIcon, GoogleMapsIcon, ChevronRightIcon, CloseIcon
} from '../../Icons';
import { MobileCalendarOverlay } from './MobileCalendarOverlay';
import { TrendEvent } from './TrendData';
import {
    PostInputFormProps, renderAvatar, PURPOSES, GMAP_PURPOSES, TONES, LENGTHS
} from './inputConstants';
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
    onStepChange, closeDrawerTrigger, openDrawerTrigger
}) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const dateObj = new Date();
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const weekday = dateObj.toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
    const [mobileStep, setMobileStep] = React.useState<'platform' | 'input' | 'confirm' | 'result'>('platform');
    const [isStepDrawerOpen, setIsStepDrawerOpen] = React.useState(false);

    const [isPromptExpanded, setIsPromptExpanded] = React.useState(true);
    const [isOmakaseLoading, setIsOmakaseLoading] = React.useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

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

    const handleOmakaseStart = () => {
        setIsOmakaseLoading(true);
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
            // Pre-fill with a magic prompt if empty
            if (!inputText) {
                onInputTextChange("✨ AIおまかせ：今日のおすすめや雰囲気に合わせて、最高の内容を提案して！");
            }
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

    return (
        // <div className="flex flex-col h-full min-h-[100dvh] relative overflow-hidden font-inter bg-[#6339f9]">
        <div className="flex flex-col h-full min-h-[100dvh] relative overflow-hidden font-inter bg-slate-50">

            {/* Vibrant Background Blurs (OLD - Solid Deep Violet) */}
            {/* 
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#6339f9]">
                <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-[#F472B6] rounded-full blur-[140px] opacity-20" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[70%] bg-[#22D3EE] rounded-full blur-[120px] opacity-15" />
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />
            </div>
            */}

            {/* Light airy Gradient Background (NEW) */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                {/* Base airy gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />

                {/* Random floating blobs - High Visibility */}
                <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-300 rounded-full blur-[100px] opacity-60 animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute top-[40%] left-[-20%] w-[60%] h-[60%] bg-cyan-300 rounded-full blur-[100px] opacity-50 animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
                <div className="absolute bottom-[-20%] right-[10%] w-[50%] h-[50%] bg-pink-300 rounded-full blur-[100px] opacity-50 animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />

                {/* Texture */}
                <div className="absolute inset-0 opacity-[0.4] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />
            </div>

            {/* Step 1: Home (Platform Grid) */}
            <div className={`flex flex-col h-full overflow-hidden relative transition-all duration-500 ${isStepDrawerOpen ? 'blur-md scale-[0.98] opacity-60' : 'opacity-100'}`}>
                <div className="flex-1 flex flex-col p-5 pt-6 pb-8 safe-area-bottom">
                    {/* High-Design Header - Magazine Style Date & Minimal Avatar */}
                    <div className="flex items-start justify-between mb-4 px-1">
                        {/* Typography Date Display - Interactive Trigger */}
                        <div className="flex flex-col cursor-pointer active:scale-95 transition-transform" onClick={() => setIsCalendarOpen(true)}>
                            <span className="text-[9px] font-black text-[#7F5AF0] uppercase tracking-[0.4em] ml-1 mb-1 z-10 relative flex items-center gap-1">
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
                            <div className="relative group">
                                <div className="absolute inset-0 bg-[#7F5AF0] rounded-full blur-[10px] opacity-20 group-hover:opacity-40 transition-opacity" />
                                <div className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md border-[2px] border-slate-100">
                                    <span className="text-[var(--plexo-black)] font-black text-lg" style={{ transform: 'rotate(-10deg)', marginTop: '2px' }}>ミ</span>
                                </div>
                            </div>

                            {/* High-Contrast Credit Design with Gauge */}
                            {plan && typeof plan.usage !== 'undefined' && typeof plan.limit !== 'undefined' && (
                                <div className="flex flex-col items-end gap-1 scale-90 origin-right">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-white backdrop-blur-xl border border-white/20 shadow-xl overflow-hidden relative">
                                        <span className="text-[8px] font-black text-white/40 uppercase tracking-widest mr-1">CREDITS</span>
                                        <span className="text-sm font-black text-[#7F5AF0] leading-none">
                                            {Math.max(0, plan.limit - plan.usage)}
                                        </span>
                                        <span className="text-[10px] font-bold text-white/30 leading-none">/ {plan.limit}</span>

                                        {/* Subtle Gauge Background */}
                                        <div className="absolute bottom-0 left-0 h-[2px] bg-white/10 w-full" />
                                        {/* Active Gauge Fill */}
                                        <div
                                            className="absolute bottom-0 left-0 h-[2px] bg-[#7F5AF0] shadow-[0_0_10px_rgba(127,90,240,0.5)] transition-all duration-1000"
                                            style={{ width: `${(Math.max(0, plan.limit - plan.usage) / plan.limit) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex gap-1 pr-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-[3px] w-6 rounded-full transition-colors duration-500 ${((plan.limit - plan.usage) / plan.limit) * 5 > i
                                                    ? 'bg-[#7F5AF0]'
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
                        <h2 className="text-[12px] font-black text-slate-800 tracking-tight">投稿先を選択</h2>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em]">Select your canvas</p>
                    </div>

                    {/* Standard 2x2 Grid Platform Selection */}
                    <div className="grid grid-cols-2 gap-3 px-1 mb-6 mt-4">
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
                                        icon: <LineIcon className="w-7 h-7" isActive={platforms.includes(Platform.Line)} />,
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
                                const bentoClass = 'h-[140px]';

                                return (
                                    <div
                                        key={p}
                                        onClick={() => onPlatformToggle(p)}
                                        className={`
                                            relative rounded-[40px] overflow-hidden cursor-pointer border transition-all duration-500 group
                                            ${bentoClass}
                                            ${isActive
                                                ? 'bg-[#7F5AF0] border-[#7F5AF0] shadow-xl scale-[0.98] animate-tactile-pop'
                                                : `bg-white border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-slate-300 hover:shadow-md active:scale-[0.98]`
                                            }
                                        `}
                                    >
                                        {/* Bento Card Content */}
                                        <div className="absolute inset-0 p-6 flex flex-col justify-between">
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
                                                    <ChevronRightIcon className={`w-5 h-5 ${isActive ? 'text-[#7F5AF0]' : 'text-slate-300'}`} />
                                                </div>
                                            </div>

                                            <div className="flex flex-col">
                                                {/* 
                                                <span className={`text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-300 mb-1 ${isActive ? 'text-black/40' : 'text-white/40'}`}>
                                                    {details.tagline}
                                                </span>
                                                */}
                                                <div className="flex flex-col leading-tight">
                                                    <h3 className={`font-black tracking-tighter text-xl transition-colors duration-500 ${isActive ? 'text-white' : 'text-slate-800'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                                                        {details.name}
                                                    </h3>
                                                    <p className={`text-[11px] font-medium transition-opacity ${isActive ? 'text-white/70' : 'text-slate-400'}`}>
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

                    {/* Bottom Section - Promotional Card (Prism Artifact Style) */}
                    <div className="mt-auto pt-2">
                        <div
                            onClick={handleOmakaseStart}
                            className={`
                                relative group transition-all duration-500 cursor-pointer active:scale-95 pb-1
                                ${isOmakaseLoading ? 'scale-[0.98]' : 'hover:scale-[1.02] hover:-translate-y-1'}
                            `}
                        >
                            {/* 1. Radiant Aura Container (Clipped Background) */}
                            <div className="absolute inset-0 rounded-[36px] overflow-hidden pointer-events-none">
                                {/* Radiant Aura Border - Magical Spinning Beam */}
                                <div
                                    className="absolute inset-[-150%] animate-spin-slow opacity-100 blur-md transition-all duration-700"
                                    style={{
                                        background: 'conic-gradient(from 0deg, transparent 0deg, #22D3EE 60deg, #FACC15 120deg, #F472B6 180deg, transparent 240deg)'
                                    }}
                                />
                            </div>

                            {/* 2. Pearlescent Content Layer (Front) - White/Bright */}
                            <div className={`
                                relative m-[2px] rounded-[34px] p-7 px-8
                                bg-white/95 backdrop-blur-xl transition-colors duration-500
                                flex items-center justify-between
                            `}>
                                {/* Inner Subtle Iridescence */}
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-white to-pink-500/10 rounded-[34px] opacity-100 pointer-events-none" />

                                {/* Text Content - High Contrast Dark */}
                                <div className="relative z-10">
                                    <div className="inline-flex px-3 py-1 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[10px] font-black text-white uppercase tracking-[0.2em] mb-2 shadow-md animate-bounce-slow">
                                        Premium
                                    </div>
                                    <h4 className="text-xl font-black text-gray-900 tracking-tight drop-shadow-sm">
                                        AI Omakase Mode
                                    </h4>
                                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-0.5 group-hover:text-gray-800 transition-colors">
                                        Automated Content Strategy
                                    </p>
                                </div>

                                {/* Icon Container (Bright Orb) */}
                                <div className={`
                                    w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 relative z-10 shadow-md
                                    ${isOmakaseLoading
                                        ? 'bg-[var(--plexo-yellow)] text-black shadow-[0_0_20px_var(--plexo-yellow)]'
                                        : 'bg-gradient-to-tr from-gray-100 to-white text-gray-900 border border-gray-200 group-hover:from-cyan-400 group-hover:to-blue-500 group-hover:text-white group-hover:shadow-[0_4px_15px_rgba(6,182,212,0.4)]'
                                    }
                                `}>
                                    {isOmakaseLoading ? (
                                        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <AutoSparklesIcon className="w-6 h-6" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trend Calendar Overlay */}
            <MobileCalendarOverlay
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
                onSelectEvent={handleTrendStrategy}
            />

            {/* Bottom Sheet Drawer - Monochrome Style */}
            {isStepDrawerOpen && (
                <div className="fixed inset-0 z-[130] flex items-end">
                    {/* Immersive Backdrop */}
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => {
                        setIsStepDrawerOpen(false);
                        // Reset step to platform when closing from input/confirm steps
                        if (mobileStep !== 'result') {
                            setMobileStep('platform');
                        }
                    }} />

                    {/* Sliding Panel (Monochrome) */}
                    <div className={`absolute bottom-0 left-0 right-0 bg-[#FAFAFA] border-t border-[#E5E5E5] rounded-t-[54px] shadow-[0_-20px_60px_rgba(0,0,0,0.1)] animate-nyoki flex flex-col ${mobileStep === 'platform' ? 'h-[88vh]' : 'h-[96vh]'} ${mobileStep === 'result' ? 'pb-8 safe-area-bottom' : 'pb-0'}`}>
                        {/* Drag Handle */}
                        <div className="w-full flex justify-center py-6">
                            <div className="w-16 h-1.5 bg-[#E5E5E5] rounded-full" />
                        </div>

                        {/* Drawer Header */}
                        <div className="px-8 pb-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button onClick={handleBackStep} className="w-12 h-12 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center shadow-sm active:scale-90 transition-all">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                                </button>
                                <div className="flex flex-col">
                                    <h3 className="text-[17px] font-black text-[#111111] tracking-tight leading-none mb-1">
                                        {mobileStep === 'input' ? 'Describe Content' : mobileStep === 'confirm' ? 'Final Review' : 'Generated Posts'}
                                    </h3>
                                    <span className="text-[10px] font-black text-[#666666] uppercase tracking-[0.2em] leading-none">
                                        {mobileStep === 'input' ? 'Step 2 of 3' : mobileStep === 'confirm' ? 'Step 3 of 3' : 'Success!'}
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
                                        setIsStepDrawerOpen(false);
                                        // ALWAYS reset to platform to ensure footer contrast resets (Dark Mode)
                                        // If we want to preserve 'result' state, we'd need another way to signal "Drawer Hidden but Result Active" 
                                        // but for now, closing the drawer should visually return to platform mode completely.
                                        setMobileStep('platform');
                                    }}
                                    className="w-10 h-10 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center shadow-sm active:scale-90 transition-all ml-2 z-20"
                                >
                                    <CloseIcon className="w-5 h-5 text-[#111111]" />
                                </button>
                            </div>
                        </div>

                        {/* Drawer Content - Redesigned for Sticky Actions */}
                        <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
                            {mobileStep === 'input' && (
                                <div className="flex-1 flex flex-col min-h-0 animate-in fade-in zoom-in-95 duration-700">

                                    {/* 1. Top Fixed Header Section (Standard context labels or Microphone) */}
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
                                                        {isListening ? 'Listening' : 'Voice Input'}
                                                    </span>
                                                </div>
                                            </button>
                                        </div>
                                    )}

                                    {/* 2. Middle Scrollable Area (Main Text inputs) */}
                                    <div className="flex-1 overflow-y-auto px-8 py-2">
                                        {isGoogleMaps ? (
                                            <div className="w-full flex flex-col gap-6 py-2">
                                                <div className="text-center space-y-2">
                                                    <h4 className="text-xl font-bold text-[#111111]">Review Reply</h4>
                                                    <p className="text-sm text-[#666666]">Googleマップの口コミを貼り付けてください</p>
                                                </div>

                                                <div className="relative">
                                                    <AutoResizingTextarea
                                                        value={inputText}
                                                        onChange={(e) => onInputTextChange(e.target.value)}
                                                        placeholder="ここに口コミをペースト..."
                                                        className="w-full min-h-[160px] max-h-[400px] overflow-y-auto p-8 bg-white border border-[#E5E5E5] rounded-[40px] text-lg font-bold leading-relaxed focus:outline-none focus:border-[#111111] transition-all placeholder:text-[#CCCCCC] text-[#111111]"
                                                    />
                                                    {/* Floating Mic for GMap remains relatively positioned or absolute within scroll */}
                                                    <button
                                                        onClick={toggleVoiceInput}
                                                        className={`absolute bottom-6 left-6 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${isListening ? 'bg-[#111111] text-white animate-pulse' : 'bg-[#F5F5F5] text-[#111111]'}`}
                                                    >
                                                        <MicIcon className="w-6 h-6" />
                                                    </button>
                                                </div>

                                                <div className="p-6 bg-[#C4A052]/10 border-[#C4A052]/20 border rounded-[32px] backdrop-blur-md relative overflow-hidden group">
                                                    <h4 className="relative z-10 text-[10px] font-black text-[#8B7340] uppercase tracking-[0.2em] mb-3">補足情報 / 当日の事情</h4>
                                                    <AutoResizingTextarea
                                                        value={storeSupplement}
                                                        onChange={(e) => onStoreSupplementChange(e.target.value)}
                                                        placeholder="例：急な欠勤で人手が足りなかった、など"
                                                        className="relative z-10 w-full bg-transparent text-[#2F3E46] text-sm font-bold leading-relaxed placeholder-[#8B7340]/30 focus:outline-none resize-none min-h-[60px]"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full relative py-2">
                                                <AutoResizingTextarea
                                                    value={inputText}
                                                    onChange={(e) => onInputTextChange(e.target.value)}
                                                    placeholder="Tell AI what to write about..."
                                                    className="w-full min-h-[160px] max-h-[500px] overflow-y-auto p-8 bg-white border border-[#E5E5E5] rounded-[40px] text-lg font-bold leading-relaxed focus:outline-none focus:border-[#111111] transition-all placeholder:text-[#CCCCCC] text-[#111111]"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* 3. Sticky Action Footer */}
                                    <div className="p-6 pb-12 safe-area-bottom border-t border-[#E5E5E5]/50 flex-shrink-0 bg-[#FAFAFA] flex flex-col gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.02)] z-20">
                                        {/* Additional Instructions */}
                                        <div className="flex flex-col gap-3">
                                            <button
                                                onClick={() => setIsPromptExpanded(!isPromptExpanded)}
                                                className="flex items-center gap-2 text-[#666666] active:text-[#111111] transition-colors px-4 py-2"
                                            >
                                                <AutoSparklesIcon className={`w-4 h-4 ${customPrompt ? 'text-[#111111]' : ''}`} />
                                                <span className="text-[11px] font-bold uppercase tracking-widest">追加指示（任意）</span>
                                            </button>
                                            {isPromptExpanded && (
                                                <div className="p-4 bg-white border border-[#E5E5E5] rounded-2xl animate-in zoom-in-95 shadow-sm">
                                                    <input
                                                        type="text"
                                                        value={customPrompt}
                                                        onChange={(e) => onCustomPromptChange(e.target.value)}
                                                        placeholder="例：テンション高めに..."
                                                        className="w-full bg-transparent border-none focus:outline-none text-[13px] font-bold text-[#111111]"
                                                        autoFocus
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {!isListening && (
                                            <button
                                                onClick={() => setMobileStep('confirm')}
                                                disabled={!inputText.trim()}
                                                className={`w-full py-5 rounded-[28px] font-black text-sm uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 ${inputText.trim()
                                                    ? 'bg-[#111111] text-white'
                                                    : 'bg-[#999999] text-white/50 cursor-not-allowed opacity-50 shadow-none'
                                                    }`}
                                            >
                                                Next
                                                <ChevronRightIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {mobileStep === 'confirm' && (
                                <div className="flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-bottom-10 duration-700">
                                    {/* Scrollable Preview and Settings */}
                                    <div className="flex-1 overflow-y-auto px-8 py-4 space-y-8">
                                        <div className="flex flex-col gap-8">
                                            {/* Preview Box - Monochrome */}
                                            <div className="bg-white border border-[#E5E5E5] rounded-[40px] p-8 min-h-[180px] relative shadow-sm overflow-hidden group">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5F5F5] rounded-full blur-3xl -mr-16 -mt-16" />
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex gap-1.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#111111]/20" />
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#111111]/20" />
                                                    </div>
                                                    <span className="text-[10px] font-black text-[#999999] uppercase tracking-[0.2em]">Source Content</span>
                                                </div>
                                                <div className="text-[#111111] text-[15px] font-bold leading-relaxed">
                                                    {inputText.length > 200 ? inputText.substring(0, 200) + '...' : inputText || "Your content will appear here..."}
                                                </div>

                                                {/* Additional Instructions Review */}
                                                {customPrompt && (
                                                    <div className="mt-4 pt-4 border-t border-[#E5E5E5]">
                                                        <div className="flex items-center gap-1.5 mb-1">
                                                            <AutoSparklesIcon className="w-3 h-3 text-[#111111]" />
                                                            <span className="text-[9px] font-black text-[#666666] uppercase tracking-widest block">Extra Instructions</span>
                                                        </div>
                                                        <div className="text-[#666666] text-xs italic font-medium">
                                                            {customPrompt}
                                                        </div>
                                                    </div>
                                                )}

                                                <button onClick={() => setMobileStep('input')} className="absolute bottom-6 right-8 w-11 h-11 bg-white border border-[#E5E5E5] rounded-2xl text-[#999999] hover:text-[#111111] transition-all flex items-center justify-center active:scale-95 shadow-sm">
                                                    <RotateCcwIcon className="w-5 h-5" />
                                                </button>
                                            </div>

                                            {/* Style Selection - Horizontal Pill Style (Monochrome) */}
                                            <div className="flex flex-col gap-4">
                                                <div className="flex items-center justify-between px-2">
                                                    <span className="text-[11px] font-black text-[#666666] uppercase tracking-[0.2em]">Select Style</span>
                                                    <button onClick={onOpenPresetModal} className="text-[10px] font-black text-[#111111] uppercase tracking-widest bg-[#F5F5F5] px-3 py-1 rounded-full border border-[#E5E5E5] hover:bg-[#EAEAEA]">Manage</button>
                                                </div>
                                                <div className="flex overflow-x-auto gap-3 pb-4 pt-2 -mx-2 px-3 no-scrollbar scrollbar-hide">
                                                    <button
                                                        onClick={() => onApplyPreset({ id: 'plain-ai' } as any)}
                                                        className={`flex-shrink-0 px-8 py-5 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 ${!activePresetId ? 'bg-[var(--plexo-black)] text-[var(--plexo-yellow)] scale-105 active:scale-95' : 'bg-white border border-[#E5E5E5] text-[#999999]'}`}
                                                    >
                                                        AI Standard
                                                    </button>
                                                    {presets.map((p) => {
                                                        const isSelected = activePresetId === p.id;
                                                        return (
                                                            <button
                                                                key={p.id}
                                                                onClick={() => onApplyPreset(p)}
                                                                className={`flex-shrink-0 px-8 py-5 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 truncate max-w-[160px] ${isSelected ? 'bg-[var(--plexo-dark-gray)] text-[var(--plexo-yellow)] scale-105 active:scale-95' : 'bg-white border border-[#E5E5E5] text-[#999999]'}`}
                                                            >
                                                                {p.name}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Settings Grid - Monochrome */}
                                            <div className="grid grid-cols-2 gap-4 pb-8">
                                                <div className={`bg-white p-6 rounded-[32px] border border-[#E5E5E5] flex flex-col gap-2.5 transition-opacity ${isStyleLocked ? 'opacity-50 relative' : ''}`}>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[9px] font-black text-[#666666] uppercase tracking-[0.2em]">Tone</span>
                                                        {isStyleLocked && <div className="text-[8px] bg-[#F5F5F5] px-1.5 py-0.5 rounded text-[#111111] font-bold">LOCKED</div>}
                                                    </div>
                                                    <select
                                                        value={tone}
                                                        disabled={isStyleLocked}
                                                        onChange={(e) => onToneChange(e.target.value as any)}
                                                        className="bg-transparent text-[15px] font-black text-[#111111] focus:outline-none disabled:cursor-not-allowed appearance-none"
                                                    >
                                                        {TONES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                                    </select>
                                                </div>
                                                {!isX && (
                                                    <div className="bg-white p-6 rounded-[32px] border border-[#E5E5E5] flex flex-col gap-2.5">
                                                        <span className="text-[9px] font-black text-[#666666] uppercase tracking-[0.2em]">Length</span>
                                                        <select
                                                            value={length}
                                                            onChange={(e) => onLengthChange(e.target.value as any)}
                                                            className="bg-transparent text-[15px] font-black text-[#111111] focus:outline-none appearance-none"
                                                        >
                                                            {LENGTHS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sticky Generate Footer - Magical Animation */}
                                    <div className="p-8 pb-12 safe-area-bottom border-t border-[#E5E5E5]/50 flex-shrink-0 bg-white/50 backdrop-blur-md flex flex-col items-center gap-4 shadow-[0_-20px_40px_rgba(0,0,0,0.03)] z-50">
                                        <button
                                            onClick={onGenerate}
                                            disabled={isGenerating}
                                            className={`
                                                group relative w-full overflow-hidden rounded-[32px] py-6
                                                transition-all duration-500 active:scale-95
                                                ${isGenerating ? 'bg-[#949594] cursor-not-allowed' : 'bg-gradient-to-r from-[#111111] via-[#333333] to-[#111111] shadow-[0_10px_30px_rgba(0,0,0,0.2)]'}
                                            `}
                                        >
                                            {/* Animated Glow Overlay */}
                                            {!isGenerating && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#7F5AF0]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                            )}

                                            <div className="relative flex items-center justify-center gap-3">
                                                {isGenerating ? (
                                                    <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <div className="flex items-center gap-3">
                                                        <SparklesIcon className="w-6 h-6 text-[#7F5AF0] animate-pulse" />
                                                        <span className="text-white text-base font-black uppercase tracking-[0.3em]">
                                                            Generate Magic
                                                        </span>
                                                        <SparklesIcon className="w-6 h-6 text-[#7F5AF0] animate-pulse [animation-delay:0.5s]" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Decorative Sparkle dots */}
                                            {!isGenerating && (
                                                <>
                                                    <div className="absolute top-2 left-1/4 w-1 h-1 bg-[#7F5AF0] rounded-full animate-ping [animation-duration:3s]" />
                                                    <div className="absolute bottom-3 right-1/3 w-1.5 h-1.5 bg-[#f8ea5d] rounded-full animate-ping [animation-duration:2.5s]" />
                                                </>
                                            )}
                                        </button>
                                        <p className="text-[10px] font-bold text-[#999999] uppercase tracking-widest">AI will transform your ideas into quality posts</p>
                                    </div>
                                </div>
                            )}

                            {mobileStep === 'result' && (
                                <div className="flex-1 overflow-y-auto pb-20 animate-in fade-in slide-in-from-bottom-10 duration-700 px-8">
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
                    </div>
                </div>
            )}
        </div>
    );
};
