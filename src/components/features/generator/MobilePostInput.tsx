import React from 'react';
import { Platform } from '../../../types';
import { usePostInput } from './PostInputContext';
import { getPlatformIcon } from './utils';
import { ChevronRightIcon, CloseIcon } from '../../Icons';
import { TARGET_AUDIENCES } from '../../../constants';
import { MobilePlatformStep } from './MobilePlatformStep';
import { MobileInputStep } from './MobileInputStep';
import { MobileConfirmStep } from './MobileConfirmStep';
import { MobileResultStep } from './MobileResultStep';

export const MobilePostInput: React.FC = () => {
    const {
        platforms, platform, inputText, onInputTextChange,
        onSetActivePlatform, onPlatformToggle,
        onApplyPreset, presets, activePresetId,
        isGenerating, hasResults = false, generatedResults = [],
        onMobileResultOpen, onStepChange, resetTrigger,
        restoreTrigger, initialStepOnRestore, closeDrawerTrigger, openDrawerTrigger, targetStep,
        onAIStart, isCalendarOpen = false, onCalendarToggle,
        question, onQuestionChange, topicPrompt, onTopicPromptChange,
        refiningKey, storeProfile,
        targetAudiences, onTargetAudiencesChange
    } = usePostInput();

    // --- Internal State ---
    const questionContainerRef = React.useRef<HTMLDivElement>(null);
    const dateObj = new Date();
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const weekday = dateObj.toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
    const [mobileStep, setMobileStep] = React.useState<'platform' | 'input' | 'confirm' | 'result'>('platform');
    const [isStepDrawerOpen, setIsStepDrawerOpen] = React.useState(false);
    const [isPromptExpanded, setIsPromptExpanded] = React.useState(true);
    const [isAudienceExpanded, setIsAudienceExpanded] = React.useState(false);
    const [isOmakaseLoading, setIsOmakaseLoading] = React.useState(false);
    const [isDefaultStyleEnabled, setIsDefaultStyleEnabled] = React.useState(() => {
        return localStorage.getItem('misepo_use_default_preset') === 'true';
    });
    const [isDefaultAudienceEnabled, setIsDefaultAudienceEnabled] = React.useState(() => {
        return localStorage.getItem('misepo_use_default_audience') === 'true';
    });
    const [isOmakaseMode, setIsOmakaseMode] = React.useState(false);
    const isGoogleMaps = platform === Platform.GoogleMaps;
    const isX = platform === Platform.X;

    // --- Effects ---

    // Notify parent about step changes
    React.useEffect(() => {
        if (onStepChange) {
            onStepChange(mobileStep);
        }
    }, [mobileStep, onStepChange]);

    // Auto-scroll to question when it appears
    React.useEffect(() => {
        if (question && questionContainerRef.current) {
            setTimeout(() => {
                questionContainerRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
        }
    }, [question]);

    // Notify parent about result or calendar open state to hide footer
    React.useEffect(() => {
        if (onMobileResultOpen) {
            const shouldHideFooter = (mobileStep === 'result' && isStepDrawerOpen) || isCalendarOpen;
            onMobileResultOpen(shouldHideFooter);
        }
    }, [mobileStep, isStepDrawerOpen, isCalendarOpen, onMobileResultOpen]);

    const [isTallViewport, setIsTallViewport] = React.useState(false);
    React.useEffect(() => {
        if (typeof window === 'undefined') return;
        const mediaQuery = window.matchMedia('(min-height: 700px)');
        const handleChange = (event: MediaQueryListEvent) => setIsTallViewport(event.matches);
        setIsTallViewport(mediaQuery.matches);

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }

        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
    }, []);

    // Handle Restore from History
    React.useEffect(() => {
        if (restoreTrigger && restoreTrigger > 0) {
            setMobileStep(initialStepOnRestore || 'result');
            setIsStepDrawerOpen(true);
        }
    }, [restoreTrigger, initialStepOnRestore]);

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

    // Voice Input
    const [isListening, setIsListening] = React.useState(false);
    const recognitionRef = React.useRef<any>(null);

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
                    if (JSON.stringify(preferredAudiences) !== JSON.stringify(targetAudiences)) {
                        onTargetAudiencesChange?.(preferredAudiences);
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

    // Ensure '全般' stays exclusive
    React.useEffect(() => {
        if (targetAudiences && targetAudiences.length > 1 && targetAudiences.includes('全般')) {
            const filtered = targetAudiences.filter(t => t !== '全般');
            onTargetAudiencesChange?.(filtered);
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

    // --- Handlers ---

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

        if (target === '全般') {
            if (current.includes('全般')) {
                return;
            } else {
                onTargetAudiencesChange(['全般']);
            }
            return;
        }

        let newSelection = [...current];
        if (newSelection.includes('全般')) {
            newSelection = newSelection.filter(t => t !== '全般');
        }

        if (newSelection.includes(target)) {
            const filtered = newSelection.filter(t => t !== target);
            if (filtered.length === 0) {
                onTargetAudiencesChange(['全般']);
            } else {
                onTargetAudiencesChange(filtered);
            }
        } else {
            onTargetAudiencesChange([...newSelection, target]);
        }
    };

    const handleOmakaseStart = React.useCallback(() => {
        setIsOmakaseMode(true);
        setIsOmakaseLoading(true);
        onApplyPreset({ id: 'plain-ai' } as any);

        if (platforms.length === 0) {
            onPlatformToggle(Platform.Instagram);
            onPlatformToggle(Platform.X);
        }
        if (onQuestionChange) onQuestionChange('');
        if (onTopicPromptChange) onTopicPromptChange('');

        setTimeout(() => {
            setIsOmakaseLoading(false);
            setMobileStep('input');
            setIsStepDrawerOpen(true);
            onInputTextChange("");
        }, 800);
    }, [platforms.length, onPlatformToggle, onQuestionChange, onTopicPromptChange, onApplyPreset, onInputTextChange]);

    // Register AI trigger for parent access (MobileFooter)
    React.useEffect(() => {
        if (onAIStart) {
            onAIStart(handleOmakaseStart);
        }
    }, [onAIStart, handleOmakaseStart]);

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

    // --- Audience Logic ---
    const profileTargets = React.useMemo(() => {
        return storeProfile?.targetAudience
            ? storeProfile.targetAudience.split(',').map(s => s.trim())
            : [];
    }, [storeProfile?.targetAudience]);

    const primaryAudienceList = TARGET_AUDIENCES.filter(t =>
        t === '全般' || profileTargets.includes(t) || targetAudiences?.includes(t)
    );

    const secondaryAudienceList = TARGET_AUDIENCES.filter(t => !primaryAudienceList.includes(t));

    return (
        <div className="flex flex-col h-full min-h-0 justify-between relative overflow-hidden font-inter bg-gradient-to-br from-[#fdfcff] via-[#f5f0ff] to-[#e8e4ff]">

            {/* Step 1: Home (Platform Grid) */}
            <MobilePlatformStep
                isStepDrawerOpen={isStepDrawerOpen}
                isTallViewport={isTallViewport}
                isOmakaseLoading={isOmakaseLoading}
                onPlatformSelect={handlePlatformSelect}
                onCalendarOpen={() => onCalendarToggle && onCalendarToggle(true)}
                day={day}
                month={month}
                weekday={weekday}
            />

            {/* Bottom Sheet Drawer - Monochrome Style */}
            {isStepDrawerOpen && (
                <div className="absolute inset-0 z-[130] flex items-end">
                    {/* Immersive Backdrop */}
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => {
                        setIsStepDrawerOpen(false);
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
                                            {mobileStep === 'input' ? 'STEP 1 / 3' : mobileStep === 'confirm' ? 'STEP 2 / 3' : 'SUCCESS!'}
                                        </span>
                                    </div>
                                    {/* Forward Step (To Results) */}
                                    {generatedResults.length > 0 && mobileStep !== 'result' && inputText.trim() && (
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

                        {/* Drawer Content */}
                        <div className="flex-1 flex flex-col min-h-0 overflow-visible relative">
                            {mobileStep === 'input' && (
                                <MobileInputStep
                                    isOmakaseMode={isOmakaseMode}
                                    setIsOmakaseMode={setIsOmakaseMode}
                                    isListening={isListening}
                                    toggleVoiceInput={toggleVoiceInput}
                                    handleOmakaseStart={handleOmakaseStart}
                                    cachedInspirationCards={cachedInspirationCards}
                                    setCachedInspirationCards={setCachedInspirationCards}
                                    questionContainerRef={questionContainerRef}
                                    isPromptExpanded={isPromptExpanded}
                                    setIsPromptExpanded={setIsPromptExpanded}
                                    onGoToConfirm={() => setMobileStep('confirm')}
                                />
                            )}

                            {mobileStep === 'confirm' && (
                                <MobileConfirmStep
                                    isDefaultStyleEnabled={isDefaultStyleEnabled}
                                    setIsDefaultStyleEnabled={setIsDefaultStyleEnabled}
                                    isDefaultAudienceEnabled={isDefaultAudienceEnabled}
                                    setIsDefaultAudienceEnabled={setIsDefaultAudienceEnabled}
                                    isAudienceExpanded={isAudienceExpanded}
                                    setIsAudienceExpanded={setIsAudienceExpanded}
                                    handleTargetAudienceToggle={handleTargetAudienceToggle}
                                    primaryAudienceList={primaryAudienceList}
                                    secondaryAudienceList={secondaryAudienceList}
                                    onGoToInput={() => setMobileStep('input')}
                                />
                            )}

                            {mobileStep === 'result' && (
                                <MobileResultStep />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
