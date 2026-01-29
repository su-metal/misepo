import React from 'react';
import { Platform, PostPurpose, GoogleMapPurpose } from '../../../types';
import { AutoResizingTextarea } from './AutoResizingTextarea';
import { getPlatformIcon } from './utils';
import {
    AutoSparklesIcon, MagicWandIcon, MicIcon, EraserIcon, InfoIcon,
    SparklesIcon, RotateCcwIcon
} from '../../Icons';
import {
    PostInputFormProps, renderAvatar, PURPOSES, GMAP_PURPOSES, TONES, LENGTHS
} from './inputConstants';

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
    onReset, storeProfile
}) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const [mobileStep, setMobileStep] = React.useState<'platform' | 'input' | 'confirm'>('platform');
    const [isStepDrawerOpen, setIsStepDrawerOpen] = React.useState(false);

    // Handle Reset from parent
    React.useEffect(() => {
        if (onReset) {
            setMobileStep('platform');
            setIsStepDrawerOpen(false);
        }
    }, [onReset]);

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

    const handleBackStep = () => {
        if (mobileStep === 'confirm') {
            setMobileStep('input');
        } else if (mobileStep === 'input') {
            setIsStepDrawerOpen(false);
            setMobileStep('platform');
        }
    };

    return (
        <div className="flex flex-col h-full min-h-[100dvh] relative overflow-hidden font-inter">
            {/* Premium Soft Background Gradient */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[#E8E9FF]" />
                <div className="absolute top-[10%] right-[-10%] w-[80%] h-[80%] bg-[#F0E5FF] rounded-full blur-[120px] opacity-60 animate-pulse [animation-duration:10s]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[80%] h-[80%] bg-[#FFECF5] rounded-full blur-[120px] opacity-60 animate-pulse [animation-duration:8s]" />
            </div>

            {/* Step 1: Home (Platform Grid) */}
            <div className={`flex flex-col gap-8 p-6 transition-all duration-500 ${isStepDrawerOpen ? 'blur-md scale-[0.98] opacity-60' : 'opacity-100'}`}>
                {/* Header Profile Style */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#9747FF] to-[#E88BA3] flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white/50">
                            {storeProfile.name?.substring(0, 1) || 'M'}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-medium text-[#7C7C8C] uppercase tracking-[0.1em]">Welcome back</span>
                            <span className="text-sm font-bold text-[#1F1F2F]">Hello, {storeProfile.name || 'User'}</span>
                        </div>
                    </div>
                </div>

                <div className="text-center py-2 flex flex-col gap-1 items-start">
                    <h2 className="text-[28px] font-bold text-[#1F1F2F] tracking-tight">Select Target</h2>
                    <p className="text-sm text-[#7C7C8C] font-medium">Choose a platform to start generation</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {[Platform.Instagram, Platform.Line, Platform.X, Platform.GoogleMaps].map((p) => {
                        const getStyle = (plt: Platform) => {
                            switch (plt) {
                                case Platform.Instagram: return 'bg-gradient-to-br from-[#9747FF] to-[#E88BA3] text-white shadow-[#E88BA3]/20';
                                case Platform.Line: return 'bg-white text-[#1F1F2F] shadow-[#06C755]/10';
                                case Platform.X: return 'bg-[#1F1F2F] text-white shadow-black/20';
                                case Platform.GoogleMaps: return 'bg-white text-[#1F1F2F] shadow-[#4A90E2]/10';
                                default: return 'bg-white text-[#1F1F2F]';
                            }
                        };
                        const isActive = platforms.includes(p);

                        return (
                            <button
                                key={p}
                                onClick={() => handlePlatformSelect(p)}
                                className={`group relative aspect-square rounded-[32px] flex flex-col items-center justify-center transition-all duration-300 active:scale-95 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] border border-white/40 backdrop-blur-sm ${getStyle(p)} w-full`}
                            >
                                <div className="absolute top-4 right-6 opacity-40 group-hover:opacity-100 transition-opacity">
                                    <div className="w-1 h-1 rounded-full bg-current mb-0.5" />
                                    <div className="w-1 h-1 rounded-full bg-current mb-0.5" />
                                    <div className="w-1 h-1 rounded-full bg-current" />
                                </div>

                                <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-md mb-4 shadow-sm group-active:scale-90 transition-transform">
                                    {getPlatformIcon(p, "w-10 h-10")}
                                </div>
                                <span className="text-xs font-bold uppercase tracking-[0.2em] mr-[-0.2em]">
                                    {p === Platform.GoogleMaps ? 'Maps' : p === Platform.Instagram ? 'Instagram' : p}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Promotional Style Card (Reference Image Bottom) */}
                <div className="mt-4 p-6 rounded-[32px] bg-gradient-to-r from-[#9747FF]/10 to-[#E88BA3]/10 border border-white/60 backdrop-blur-md relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-[#9747FF] to-[#E88BA3] rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="relative z-10">
                        <div className="inline-flex px-3 py-1 rounded-full bg-white text-[10px] font-bold text-[#9747FF] uppercase tracking-wider mb-2 shadow-sm">Premium</div>
                        <h4 className="text-lg font-bold text-[#1F1F2F] mb-1">AI Omakase Mode</h4>
                        <p className="text-xs text-[#7C7C8C] leading-relaxed">Let our advanced AI handle the entire strategy and posting for you.</p>
                    </div>
                </div>
            </div>

            {/* Bottom Sheet Drawer - Glassmorphism Style */}
            {isStepDrawerOpen && (
                <div className="fixed inset-0 z-[100] transition-all">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-md" onClick={() => setIsStepDrawerOpen(false)} />

                    {/* Sliding Panel */}
                    <div className={`absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-white/60 rounded-t-[48px] shadow-[0_-20px_80px_rgba(0,0,0,0.1)] transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex flex-col ${mobileStep === 'confirm' ? 'h-[92vh]' : 'h-[70vh]'} pb-32`}>
                        {/* Drag Handle */}
                        <div className="w-full flex justify-center py-6">
                            <div className="w-16 h-1.5 bg-[#E2E2E8] rounded-full" />
                        </div>

                        {/* Drawer Header */}
                        <div className="px-8 pb-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button onClick={handleBackStep} className="w-12 h-12 rounded-2xl bg-white border border-[#F0F0F5] flex items-center justify-center shadow-lg active:scale-90 transition-all">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1F1F2F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                                </button>
                                <div className="flex flex-col">
                                    <h3 className="text-sm font-bold text-[#1F1F2F] tracking-tight">
                                        {mobileStep === 'input' ? 'Describe Content' : 'Final Review'}
                                    </h3>
                                    <span className="text-[10px] font-medium text-[#7C7C8C] uppercase tracking-widest">{mobileStep === 'input' ? 'Step 2 of 3' : 'Step 3 of 3'}</span>
                                </div>
                            </div>
                            <div className="flex -space-x-2">
                                {platforms.map(p => (
                                    <div key={p} className="w-10 h-10 rounded-full bg-white border-2 border-[#F0F0F5] flex items-center justify-center shadow-sm z-10 transition-transform active:translate-y-[-4px]">
                                        {getPlatformIcon(p, "w-5 h-5")}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto px-8 py-4">
                            {mobileStep === 'input' && (
                                <div className="flex flex-col items-center justify-center h-full gap-10 animate-in fade-in zoom-in-95 duration-700">
                                    <button
                                        onClick={toggleVoiceInput}
                                        className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-500 ${isListening ? 'scale-110' : 'hover:scale-105'}`}
                                    >
                                        {/* Animated Rings for Listening */}
                                        {isListening && (
                                            <>
                                                <div className="absolute inset-0 rounded-full bg-[#FF5A5F]/20 animate-ping [animation-duration:2s]" />
                                                <div className="absolute inset-2 rounded-full bg-[#FF5A5F]/30 animate-ping [animation-duration:1.5s]" />
                                            </>
                                        )}
                                        <div className={`w-full h-full rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-xl ${isListening ? 'bg-[#FF5A5F] text-white shadow-[#FF5A5F]/40' : 'bg-white text-[#1F1F2F] shadow-black/5 border border-[#F0F0F5]'}`}>
                                            {isListening ? (
                                                <div className="flex gap-2 h-10 items-center">
                                                    <div className="w-2 h-8 bg-white rounded-full animate-bounce [animation-delay:0s]" />
                                                    <div className="w-2 h-10 bg-white rounded-full animate-bounce [animation-delay:0.1s]" />
                                                    <div className="w-2 h-8 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                                                </div>
                                            ) : (
                                                <MicIcon className="w-14 h-14" />
                                            )}
                                            <span className={`mt-2 text-[10px] font-bold uppercase tracking-widest ${isListening ? 'text-white' : 'text-[#7C7C8C]'}`}>
                                                {isListening ? 'Listening' : 'Tap to Speak'}
                                            </span>
                                        </div>
                                    </button>

                                    <div className="w-full flex flex-col gap-6">
                                        <div className="relative">
                                            <AutoResizingTextarea
                                                value={inputText}
                                                onChange={(e) => onInputTextChange(e.target.value)}
                                                placeholder="Tell AI what to write about..."
                                                className="w-full min-h-[160px] p-8 bg-white border border-[#F0F0F5] rounded-[40px] text-lg font-medium leading-relaxed focus:outline-none focus:ring-4 focus:ring-[#9747FF]/5 transition-all shadow-sm placeholder:text-[#AFAFB8]"
                                            />
                                            {inputText.trim() && !isListening && (
                                                <button
                                                    onClick={() => setMobileStep('confirm')}
                                                    className="absolute bottom-6 right-6 bg-[#1F1F2F] text-white px-8 py-4 rounded-[24px] font-bold text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all"
                                                >
                                                    Next
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {mobileStep === 'confirm' && (
                                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
                                    {/* Preview Box - Reference Image Card Style */}
                                    <div className="bg-gradient-to-br from-[#1F1F2F] to-[#2F2F4F] rounded-[40px] p-8 min-h-[180px] relative shadow-2xl overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-white/20" />
                                                <div className="w-2 h-2 rounded-full bg-white/20" />
                                                <div className="w-2 h-2 rounded-full bg-white/20" />
                                            </div>
                                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Captured Content</span>
                                        </div>
                                        <div className="text-white/90 text-sm font-medium leading-relaxed">
                                            {inputText.length > 200 ? inputText.substring(0, 200) + '...' : inputText || "Your content will appear here..."}
                                        </div>
                                        <button onClick={() => setMobileStep('input')} className="absolute bottom-6 right-8 p-3 bg-white/10 rounded-2xl text-white/60 hover:text-white transition-colors backdrop-blur-md">
                                            <RotateCcwIcon className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Style Selection - Horizontal Pill Style */}
                                    <div className="flex flex-col gap-5">
                                        <div className="flex items-center justify-between px-2">
                                            <span className="text-xs font-bold text-[#1F1F2F] tracking-tight">Select Style</span>
                                            <button onClick={onOpenPresetModal} className="text-[10px] font-bold text-[#9747FF] uppercase tracking-wider">Manage</button>
                                        </div>
                                        <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
                                            <button
                                                onClick={() => onApplyPreset({ id: 'plain-ai' } as any)}
                                                className={`flex-shrink-0 px-8 py-4 rounded-[24px] font-bold text-xs uppercase tracking-widest transition-all ${!activePresetId ? 'bg-gradient-to-tr from-[#9747FF] to-[#E88BA3] text-white shadow-lg active:scale-95' : 'bg-white border border-[#F0F0F5] text-[#7C7C8C]'}`}
                                            >
                                                AI Standard
                                            </button>
                                            {presets.map((p) => {
                                                const isSelected = activePresetId === p.id;
                                                return (
                                                    <button
                                                        key={p.id}
                                                        onClick={() => onApplyPreset(p)}
                                                        className={`flex-shrink-0 px-8 py-4 rounded-[24px] font-bold text-xs uppercase tracking-widest transition-all truncate max-w-[140px] ${isSelected ? 'bg-[#1F1F2F] text-white shadow-lg active:scale-95' : 'bg-white border border-[#F0F0F5] text-[#7C7C8C]'}`}
                                                    >
                                                        {p.name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Settings Grid - Modern Minimal */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white p-6 rounded-[32px] border border-[#F0F0F5] flex flex-col gap-3">
                                            <span className="text-[10px] font-bold text-[#7C7C8C] uppercase tracking-[0.1em]">Tone</span>
                                            <select
                                                value={tone}
                                                onChange={(e) => onToneChange(e.target.value as any)}
                                                className="bg-transparent text-sm font-bold text-[#1F1F2F] focus:outline-none"
                                            >
                                                {TONES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                            </select>
                                        </div>
                                        {!isX && (
                                            <div className="bg-white p-6 rounded-[32px] border border-[#F0F0F5] flex flex-col gap-3">
                                                <span className="text-[10px] font-bold text-[#7C7C8C] uppercase tracking-[0.1em]">Length</span>
                                                <select
                                                    value={length}
                                                    onChange={(e) => onLengthChange(e.target.value as any)}
                                                    className="bg-transparent text-sm font-bold text-[#1F1F2F] focus:outline-none"
                                                >
                                                    {LENGTHS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    {/* Generate Button - High Contrast Glass */}
                                    <div className="pt-4">
                                        <button
                                            onClick={() => {
                                                setIsStepDrawerOpen(false);
                                                onGenerate();
                                            }}
                                            className="w-full py-8 bg-[#1F1F2F] text-white rounded-[40px] font-bold text-xl uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] active:scale-95 transition-all flex items-center justify-center gap-6 group hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)]"
                                        >
                                            <SparklesIcon className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                                            <span>Generate</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
