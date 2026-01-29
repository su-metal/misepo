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
    onReset
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
        <div className="flex flex-col h-full min-h-[500px] relative overflow-hidden">
            {/* Step 1: Home (Platform Grid) */}
            <div className={`flex flex-col gap-10 p-4 transition-all duration-500 ${isStepDrawerOpen ? 'blur-sm scale-95 opacity-50' : 'opacity-100'}`}>
                <div className="text-center py-4">
                    <h2 className="text-sm font-black text-black/40 uppercase tracking-[0.3em]">1. Home</h2>
                </div>

                <div className="grid grid-cols-2 gap-6 px-4">
                    {[Platform.X, Platform.Instagram, Platform.Line, Platform.GoogleMaps].map((p) => {
                        const getColor = (plt: Platform) => {
                            switch (plt) {
                                case Platform.X: return 'bg-black text-white';
                                case Platform.Instagram: return 'bg-[#E88BA3] text-white';
                                case Platform.Line: return 'bg-[#06C755] text-white';
                                case Platform.GoogleMaps: return 'bg-[#4A90E2] text-white';
                                default: return 'bg-white text-black';
                            }
                        };
                        return (
                            <button
                                key={p}
                                onClick={() => handlePlatformSelect(p)}
                                className={`aspect-square rounded-[32px] flex items-center justify-center border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all ${getColor(p)}`}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <div className="scale-150 mb-2">{getPlatformIcon(p, "w-10 h-10")}</div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        {p === Platform.GoogleMaps ? 'Maps' : p === Platform.Instagram ? 'Insta' : p}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Sheet Drawer */}
            {isStepDrawerOpen && (
                <div className="fixed inset-0 z-[100] transition-all">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/5" onClick={() => setIsStepDrawerOpen(false)} />

                    {/* Sliding Panel */}
                    <div className={`absolute bottom-16 left-0 right-0 bg-white border-t-[4px] border-black rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out flex flex-col ${mobileStep === 'confirm' ? 'min-h-[85vh]' : 'min-h-[60vh]'} pb-24`}>
                        {/* Drag Handle */}
                        <div className="w-full flex justify-center py-4">
                            <div className="w-12 h-1.5 bg-black/10 rounded-full" />
                        </div>

                        {/* Drawer Header */}
                        <div className="px-8 pb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button onClick={handleBackStep} className="w-10 h-10 rounded-full bg-slate-50 border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:scale-95">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
                                </button>
                                <h3 className="text-[12px] font-black text-black uppercase tracking-[0.2em]">
                                    {mobileStep === 'input' ? '2. Input (Bottom Sheet)' : '3. Confirm & Gen'}
                                </h3>
                            </div>
                            <div className="flex gap-1">
                                {platforms.map(p => (
                                    <div key={p} className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border-2 border-black/5">
                                        {getPlatformIcon(p, "w-5 h-5 opacity-40")}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto px-8 py-4">
                            {mobileStep === 'input' && (
                                <div className="flex flex-col items-center justify-center h-full gap-8 animate-in fade-in zoom-in-95 duration-500">
                                    <div className="flex items-center justify-center gap-4 mb-4">
                                        <div className="w-24 h-24 rounded-2xl bg-slate-100 border-[3px] border-black/5" />
                                        <div className="w-24 h-24 rounded-2xl bg-slate-100 border-[3px] border-black/5" />
                                    </div>

                                    <button
                                        onClick={toggleVoiceInput}
                                        className={`w-48 h-48 rounded-full border-[6px] border-black flex flex-col items-center justify-center transition-all shadow-[10px_10px_0_0_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none ${isListening ? 'bg-[#FF5A5F] animate-pulse' : 'bg-[#70F3DE]'}`}
                                    >
                                        <div className="mb-2">
                                            {isListening ? (
                                                <div className="flex gap-1.5 h-10 items-center">
                                                    <div className="w-2 h-8 bg-black rounded-full animate-bounce [animation-delay:0s]" />
                                                    <div className="w-2 h-10 bg-black rounded-full animate-bounce [animation-delay:0.1s]" />
                                                    <div className="w-2 h-8 bg-black rounded-full animate-bounce [animation-delay:0.2s]" />
                                                </div>
                                            ) : (
                                                <MicIcon className="w-16 h-16 text-black" />
                                            )}
                                        </div>
                                        <span className="text-sm font-black uppercase text-black">Tap to Speak</span>
                                    </button>

                                    <div className="w-full flex flex-col gap-4">
                                        <p className="text-[11px] font-black text-black/30 text-center uppercase tracking-widest">(or paste text here)</p>
                                        <div className="relative">
                                            <AutoResizingTextarea
                                                value={inputText}
                                                onChange={(e) => onInputTextChange(e.target.value)}
                                                placeholder="..."
                                                className="w-full min-h-[120px] p-6 bg-slate-50 border-2 border-black rounded-[32px] text-lg font-bold leading-relaxed focus:outline-none placeholder:text-black/10"
                                            />
                                            {inputText.trim() && !isListening && (
                                                <button onClick={() => setMobileStep('confirm')} className="absolute bottom-4 right-4 bg-black text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[4px_4px_0_0_#70F3DE]">
                                                    Next
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {mobileStep === 'confirm' && (
                                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
                                    {/* Preview Box */}
                                    <div className="bg-slate-50 border-2 border-black/5 rounded-[32px] p-8 min-h-[160px] relative">
                                        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-black/10" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-black/10" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-black/10" />
                                        </div>
                                        <div className="mt-8 text-black/40 text-center italic font-medium leading-relaxed">
                                            {inputText.length > 100 ? inputText.substring(0, 100) + '...' : inputText || "Preview: \"Today\'s special...\""}
                                        </div>
                                        <button onClick={() => setMobileStep('input')} className="absolute bottom-4 right-4 p-2 text-black/20 hover:text-black"><RotateCcwIcon className="w-5 h-5" /></button>
                                    </div>

                                    {/* Style Selection */}
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between px-2">
                                            <span className="text-[11px] font-black text-black/40 uppercase tracking-widest">Select Style:</span>
                                            <button onClick={onOpenPresetModal} className="text-[10px] font-black text-[#0071b9] underline decoration-2 underline-offset-4">学習データ管理</button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <button onClick={() => onApplyPreset({ id: 'plain-ai' } as any)} className={`py-4 rounded-xl font-black text-[11px] uppercase transition-all border-2 ${!activePresetId ? 'bg-[#70F3DE] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] -translate-y-1' : 'bg-slate-50 border-black/5 text-black/40'}`}>
                                                AI Standard
                                            </button>
                                            {presets.slice(0, 5).map((p, idx) => {
                                                const isSelected = activePresetId === p.id;
                                                return (
                                                    <button key={p.id} onClick={() => onApplyPreset(p)} className={`py-4 rounded-xl font-black text-[11px] uppercase truncate px-2 transition-all border-2 ${isSelected ? 'bg-[#FFD54F] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] -translate-y-1' : 'bg-slate-50 border-black/5 text-black/40'}`}>
                                                        {p.name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Additional Settings Mini */}
                                    <div className="flex flex-col gap-4 bg-slate-50/50 p-6 rounded-[32px] border-2 border-black/5">
                                        <div className="flex items-center justify-between border-b border-black/5 pb-3">
                                            <span className="text-[10px] font-black text-black/30 uppercase">Tone</span>
                                            <div className="flex gap-2">
                                                {TONES.map(t => (
                                                    <button key={t.id} onClick={() => onToneChange(t.id)} className={`px-3 py-1.5 rounded-lg text-[10px] font-black border ${tone === t.id ? 'bg-black text-white border-black' : 'bg-white text-black/40 border-black/5'}`}>{t.label}</button>
                                                ))}
                                            </div>
                                        </div>
                                        {!isX && (
                                            <div className="flex items-center justify-between border-b border-black/5 pb-3">
                                                <span className="text-[10px] font-black text-black/30 uppercase">Length</span>
                                                <div className="flex gap-2">
                                                    {LENGTHS.map(l => (
                                                        <button key={l.id} onClick={() => onLengthChange(l.id)} className={`px-3 py-1.5 rounded-lg text-[10px] font-black border ${length === l.id ? 'bg-black text-white border-black' : 'bg-white text-black/40 border-black/5'}`}>{l.label}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-black/30 uppercase">Output</span>
                                            <div className="flex gap-2">
                                                {['Japanese', 'English'].map(lang => (
                                                    <button key={lang} onClick={() => onLanguageChange(lang)} className={`px-3 py-1.5 rounded-lg text-[10px] font-black border ${language === lang ? 'bg-black text-white border-black' : 'bg-white text-black/40 border-black/5'}`}>{lang.substring(0, 2)}</button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Generate Button */}
                                    <div className="pt-4">
                                        <button
                                            onClick={() => {
                                                setIsStepDrawerOpen(false);
                                                onGenerate();
                                            }}
                                            className="w-full py-7 bg-[#FFD54F] text-black border-[3px] border-black rounded-[32px] font-black text-xl uppercase tracking-[0.2em] shadow-[8px_8px_0_0_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-4 group"
                                        >
                                            <SparklesIcon className="w-8 h-8 group-active:rotate-12 transition-transform" />
                                            <span>Generate Post</span>
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
