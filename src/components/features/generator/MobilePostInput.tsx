import React from 'react';
import { Platform, PostPurpose, GoogleMapPurpose } from '../../../types';
import { AutoResizingTextarea } from './AutoResizingTextarea';
import { getPlatformIcon } from './utils';
import {
    AutoSparklesIcon, MagicWandIcon, MicIcon, EraserIcon, InfoIcon,
    SparklesIcon, RotateCcwIcon, InstagramIcon, LineIcon, GoogleMapsIcon, ChevronRightIcon, CloseIcon
} from '../../Icons';
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
    onStepChange, closeDrawerTrigger
}) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const dateObj = new Date();
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const weekday = dateObj.toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
    const [mobileStep, setMobileStep] = React.useState<'platform' | 'input' | 'confirm' | 'result'>('platform');
    const [isStepDrawerOpen, setIsStepDrawerOpen] = React.useState(false);
    const [isPromptExpanded, setIsPromptExpanded] = React.useState(false);
    const [isOmakaseLoading, setIsOmakaseLoading] = React.useState(false);

    // Notify parent about step changes
    React.useEffect(() => {
        if (onStepChange) {
            onStepChange(mobileStep);
        }
    }, [mobileStep, onStepChange]);

    // Notify parent about result open state to hide footer
    React.useEffect(() => {
        if (onMobileResultOpen) {
            onMobileResultOpen(mobileStep === 'result' && isStepDrawerOpen);
        }
    }, [mobileStep, isStepDrawerOpen, onMobileResultOpen]);

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
            // We just close the drawer, leaving 'mobileStep' as is (or reset it to 'platform' if desired, 
            // but user asked to keep content. 'mobileStep' defines which drawer STEP is open.
            // If we close the drawer, effectively we are back to 'platform' VIEW, but the STATE is preserved.
            // Actually, if we close the drawer, we just close the overlay.
        }
    }, [closeDrawerTrigger]);

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
        <div className="flex flex-col h-full min-h-[100dvh] relative overflow-hidden font-inter bg-[var(--bg-primary)]">

            {/* Minimal Monochrome Background */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[var(--bg-primary)]">
                {/* Subtle Monochrome Gradients */}
                {/* Subtle Monochrome Gradients - Removed top gradient as it looked like a shadow */}


                {/* Monochrome Blurs for Detail */}
                <div className="absolute top-[-5%] right-[-5%] w-[60%] h-[60%] bg-[#E0E0E0] rounded-full blur-[120px] opacity-30" />
                <div className="absolute top-[5%] left-[-10%] w-[50%] h-[50%] bg-[#D4D4D4] rounded-full blur-[100px] opacity-20" />

                {/* Paper Texture */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />
            </div>

            {/* Step 1: Home (Platform Grid) */}
            <div className={`flex flex-col h-full overflow-hidden relative transition-all duration-500 ${isStepDrawerOpen ? 'blur-md scale-[0.98] opacity-60' : 'opacity-100'}`}>
                <div className="flex-1 flex flex-col p-5 pt-10 pb-8 safe-area-bottom">
                    {/* High-Design Header - Magazine Style Date & Minimal Avatar */}
                    <div className="flex items-start justify-between mb-10 px-1">
                        {/* Typography Date Display */}
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-[var(--plexo-yellow)] uppercase tracking-[0.4em] ml-1 mb-1 z-10 relative">misepo</span>
                            <div className="flex items-center gap-3 select-none">
                                <span className="text-[3.5rem] font-black text-[var(--plexo-black)] tracking-tighter leading-[0.8]">{day}</span>
                                <div className="flex flex-col justify-center gap-0.5 pt-1">
                                    <span className="text-sm font-black text-[var(--plexo-black)] uppercase tracking-widest leading-none">{month}</span>
                                    <span className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-[0.2em] leading-none">{weekday}</span>
                                </div>
                            </div>
                            <p className="text-[9px] font-medium text-[#AAAAAA] tracking-tighter mt-1.5 ml-1 opacity-80 select-none italic">
                                あなたの言葉が、最高のおもてなしに。
                            </p>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                            {/* Decorative Avatar (No Name) */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-[var(--plexo-yellow)] rounded-full blur-[10px] opacity-20 group-hover:opacity-40 transition-opacity" />
                                <div className="relative w-10 h-10 rounded-full bg-[var(--plexo-black)] flex items-center justify-center overflow-hidden shadow-md border-[2px] border-white/20">
                                    <span className="text-[var(--plexo-yellow)] font-black text-lg" style={{ transform: 'rotate(-10deg)', marginTop: '2px' }}>ミ</span>
                                </div>
                            </div>

                            {/* Glass Credit Pill */}
                            {plan && typeof plan.usage !== 'undefined' && typeof plan.limit !== 'undefined' && (
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/60 shadow-[0_4px_10px_rgba(0,0,0,0.03)] scale-90 origin-right">
                                    <span className="text-[8px] font-black text-[#999999] uppercase tracking-widest mr-1">CREDITS</span>
                                    <span className="text-sm font-black text-[var(--plexo-black)] leading-none">
                                        {Math.max(0, plan.limit - plan.usage)}
                                    </span>
                                    <span className="text-[10px] font-bold text-[#CCCCCC] leading-none">/ {plan.limit}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-0.5 items-start px-2 mt-6 mb-0">
                        <h2 className="text-[12px] font-black text-[#111111] tracking-tight">投稿先を選択</h2>
                        <p className="text-[11px] text-[#666666] font-bold uppercase tracking-[0.2em]">Select your canvas</p>
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
                                        icon: <LineIcon className="w-7 h-7" />,
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
                                const bentoClass = 'h-[160px]';

                                return (
                                    <div
                                        key={p}
                                        onClick={() => onPlatformToggle(p)}
                                        className={`
                                            relative rounded-[40px] overflow-hidden cursor-pointer border transition-all duration-500 group
                                            ${bentoClass}
                                            ${isActive
                                                ? 'bg-[var(--plexo-yellow)] border-[var(--plexo-yellow)] shadow-lg scale-[0.98] animate-tactile-pop'
                                                : `bg-white border-[#EBEBEB] shadow-sm hover:border-[#D0D0D0] active:scale-[0.95]`
                                            }
                                        `}
                                    >
                                        {/* Bento Card Content */}
                                        <div className="absolute inset-0 p-6 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div className={`
                                                    transition-all duration-300
                                                    ${isActive ? 'text-black' : 'text-[#BBBBBB]'}
                                                `}>
                                                    {details.icon}
                                                </div>

                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePlatformSelect(p);
                                                    }}
                                                    className="w-9 h-9 rounded-full bg-black flex items-center justify-center transition-all duration-300 active:scale-90 shadow-lg"
                                                >
                                                    <ChevronRightIcon className="w-5 h-5 text-[var(--plexo-yellow)]" />
                                                </div>
                                            </div>

                                            <div className="flex flex-col">
                                                <span className={`text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-300 mb-1 ${isActive ? 'text-black/40' : 'text-[#BBBBBB]'}`}>
                                                    {details.tagline}
                                                </span>
                                                <div className="flex flex-col leading-tight">
                                                    <h3 className={`font-black tracking-tighter text-xl transition-colors duration-500 ${isActive ? 'text-black' : 'text-[#111111]'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                                                        {details.name}
                                                    </h3>
                                                    <p className={`text-[11px] font-medium transition-opacity ${isActive ? 'text-black/50' : 'text-[#999999]'}`}>
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

                    {/* Bottom Section - Promotional Card */}
                    <div className="mt-auto pt-0">
                        <div
                            onClick={handleOmakaseStart}
                            className={`
                                p-7 px-8 rounded-[36px] bg-white border relative overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer active:scale-95
                                ${isOmakaseLoading ? 'border-[var(--plexo-yellow)]' : 'border-[#EEEEEE]'}
                            `}
                        >
                            {/* Animated Background for Loading */}
                            {isOmakaseLoading && (
                                <div className="absolute inset-0 bg-gradient-to-r from-[var(--plexo-yellow)]/5 via-[var(--plexo-yellow)]/20 to-[var(--plexo-yellow)]/5 animate-shimmer" />
                            )}

                            <div className="absolute -right-6 -top-6 w-32 h-32 bg-[var(--plexo-yellow)]/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <div className="inline-flex px-3 py-1 rounded-full bg-[var(--plexo-dark-gray)] text-[10px] font-black text-[var(--plexo-yellow)] uppercase tracking-[0.2em] mb-2 shadow-sm">Premium</div>
                                    <h4 className="text-lg font-black text-[#111111] tracking-tight">AI Omakase Mode</h4>
                                    <p className="text-[11px] font-bold text-[#999999] uppercase tracking-wider mt-0.5">Automated Content Strategy</p>
                                </div>
                                <div className={`
                                    w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 shadow-inner
                                    ${isOmakaseLoading
                                        ? 'bg-[var(--plexo-yellow)] text-black border-[var(--plexo-yellow)] animate-pulse'
                                        : 'bg-[#FAFAFA] border-[#EEEEEE] text-[var(--plexo-med-gray)] group-hover:bg-[var(--plexo-yellow)] group-hover:text-[var(--plexo-black)] group-hover:border-[var(--plexo-yellow)]'
                                    }
                                `}>
                                    <AutoSparklesIcon className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                    <div className={`absolute bottom-0 left-0 right-0 bg-[#FAFAFA] border-t border-[#E5E5E5] rounded-t-[54px] shadow-[0_-20px_60px_rgba(0,0,0,0.1)] animate-nyoki flex flex-col ${mobileStep === 'confirm' || mobileStep === 'result' ? 'h-[94vh]' : 'h-[88vh]'} ${mobileStep === 'result' ? 'pb-8 safe-area-bottom' : 'pb-24'}`}>
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
                                        if (mobileStep !== 'result') {
                                            setMobileStep('platform');
                                        }
                                    }}
                                    className="w-10 h-10 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center shadow-sm active:scale-90 transition-all ml-2 z-20"
                                >
                                    <CloseIcon className="w-5 h-5 text-[#111111]" />
                                </button>
                            </div>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto px-8 py-4">
                            {mobileStep === 'input' && (
                                <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in-95 duration-700">

                                    {/* Google Maps Specific Layout (Text-First) */}
                                    {isGoogleMaps ? (
                                        <div className="w-full flex flex-col gap-6">
                                            <div className="text-center space-y-2">
                                                <h4 className="text-xl font-bold text-[#111111]">Review Reply</h4>
                                                <p className="text-sm text-[#666666]">Googleマップの口コミを貼り付けてください</p>
                                            </div>

                                            <div className="relative flex-1 max-h-[35vh]">
                                                <AutoResizingTextarea
                                                    value={inputText}
                                                    onChange={(e) => onInputTextChange(e.target.value)}
                                                    placeholder="ここに口コミをペースト..."
                                                    className="w-full h-full min-h-[160px] p-8 bg-white border border-[#E5E5E5] rounded-[40px] text-lg font-bold leading-relaxed focus:outline-none focus:border-[#111111] transition-all placeholder:text-[#CCCCCC] text-[#111111]"
                                                />
                                                {/* Floating Mic Button for GMap (Secondary) */}
                                                <button
                                                    onClick={toggleVoiceInput}
                                                    className={`absolute bottom-6 left-6 w-12 h-12 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-[#111111] text-white animate-pulse' : 'bg-[#F5F5F5] text-[#111111]'}`}
                                                >
                                                    <MicIcon className="w-6 h-6" />
                                                </button>

                                                {inputText.trim() && (
                                                    <button
                                                        onClick={() => setMobileStep('confirm')}
                                                        className="absolute bottom-6 right-6 bg-[#111111] text-white px-8 py-4 rounded-[24px] font-bold text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all"
                                                    >
                                                        Next
                                                    </button>
                                                )}
                                            </div>

                                            {/* Additional Instructions (Optional) - GMap Layout */}
                                            <div className="flex flex-col gap-3">
                                                <button
                                                    onClick={() => setIsPromptExpanded(!isPromptExpanded)}
                                                    className="flex items-center gap-2 text-[#666666] active:text-[#111111] transition-colors px-4 py-2"
                                                >
                                                    <AutoSparklesIcon className={`w-4 h-4 ${customPrompt ? 'text-[#111111]' : ''}`} />
                                                    <span className="text-[11px] font-bold uppercase tracking-widest">追加指示（任意）</span>
                                                </button>
                                                {isPromptExpanded && (
                                                    <div className="mx-2 p-4 bg-white/60 border border-[#F0F0F5] rounded-2xl animate-in zoom-in-95 shadow-sm">
                                                        <input
                                                            type="text"
                                                            value={customPrompt}
                                                            onChange={(e) => onCustomPromptChange(e.target.value)}
                                                            placeholder="例：テンション高めに..."
                                                            className="w-full bg-transparent border-none focus:outline-none text-xs font-bold text-[#1F1F2F]"
                                                            autoFocus
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Google Maps Supplement Field */}
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
                                        /* Standard Layout (Voice-First) */
                                        <>
                                            <button
                                                onClick={toggleVoiceInput}
                                                className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-700 ${isListening ? 'scale-110' : 'hover:scale-105'}`}
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
                                                        <div className="flex gap-2 h-10 items-center">
                                                            <div className="w-1.5 h-8 bg-white rounded-full animate-bounce [animation-delay:0s]" />
                                                            <div className="w-1.5 h-10 bg-white rounded-full animate-bounce [animation-delay:0.1s]" />
                                                            <div className="w-1.5 h-8 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                                                        </div>
                                                    ) : (
                                                        <MicIcon className="w-14 h-14 text-[#111111]" />
                                                    )}
                                                    <span className={`mt-2 text-[10px] font-black uppercase tracking-[0.2em] ${isListening ? 'text-white' : 'text-[#999999]'}`}>
                                                        {isListening ? 'Listening' : 'Tap to Speak'}
                                                    </span>
                                                </div>
                                            </button>

                                            <div className="w-full flex flex-col gap-4">
                                                <div className="relative">
                                                    <AutoResizingTextarea
                                                        value={inputText}
                                                        onChange={(e) => onInputTextChange(e.target.value)}
                                                        placeholder={isGoogleMaps ? "口コミ内容を貼り付けてください..." : "Tell AI what to write about..."}
                                                        className="w-full min-h-[160px] p-8 bg-white border border-[#E5E5E5] rounded-[40px] text-lg font-bold leading-relaxed focus:outline-none focus:border-[#111111] transition-all  placeholder:text-[#CCCCCC] text-[#111111]"
                                                    />
                                                    {inputText.trim() && !isListening && (
                                                        <button
                                                            onClick={() => setMobileStep('confirm')}
                                                            className="absolute bottom-6 right-6 bg-[#111111] text-white px-8 py-4 rounded-[24px] font-bold text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all"
                                                        >
                                                            Next
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Additional Instructions (Optional) - Standard Layout */}
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
                                                                className="w-full bg-transparent border-none focus:outline-none text-xs font-bold text-[#111111]"
                                                                autoFocus
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {mobileStep === 'confirm' && (
                                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
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
                                        <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar px-1">
                                            <button
                                                onClick={() => onApplyPreset({ id: 'plain-ai' } as any)}
                                                className={`flex-shrink-0 px-8 py-5 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-sm ${!activePresetId ? 'bg-[var(--plexo-black)] text-[var(--plexo-yellow)] shadow-xl scale-105 active:scale-95' : 'bg-white border border-[#E5E5E5] text-[#999999]'}`}
                                            >
                                                AI Standard
                                            </button>
                                            {presets.map((p) => {
                                                const isSelected = activePresetId === p.id;
                                                return (
                                                    <button
                                                        key={p.id}
                                                        onClick={() => onApplyPreset(p)}
                                                        className={`flex-shrink-0 px-8 py-5 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-sm truncate max-w-[160px] ${isSelected ? 'bg-[var(--plexo-dark-gray)] text-[var(--plexo-yellow)] shadow-xl scale-105 active:scale-95' : 'bg-white border border-[#E5E5E5] text-[#999999]'}`}
                                                    >
                                                        {p.name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Settings Grid - Monochrome */}
                                    <div className="grid grid-cols-2 gap-4">
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
                            )}

                            {mobileStep === 'result' && (
                                <div className="h-full animate-in fade-in slide-in-from-bottom-10 duration-700 pb-20">
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
