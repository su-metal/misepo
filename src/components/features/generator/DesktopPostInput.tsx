import React from 'react';
import { Platform, PostPurpose, GoogleMapPurpose } from '../../../types';
import { AutoResizingTextarea } from './AutoResizingTextarea';
import { getPlatformIcon } from './utils';
import {
    AutoSparklesIcon, MagicWandIcon, MicIcon, EraserIcon, InfoIcon
} from '../../Icons';
import {
    PostInputFormProps, renderAvatar, PURPOSES, GMAP_PURPOSES, TONES, LENGTHS
} from './inputConstants';

export const DesktopPostInput: React.FC<PostInputFormProps> = ({
    platforms, activePlatform, isMultiGen, onPlatformToggle, onToggleMultiGen, onSetActivePlatform,
    platform, postPurpose, gmapPurpose, onPostPurposeChange, onGmapPurposeChange,
    tone, onToneChange, length, onLengthChange, inputText, onInputTextChange,
    starRating, onStarRatingChange, includeEmojis, onIncludeEmojisChange,
    includeSymbols, onIncludeSymbolsChange, xConstraint140, onXConstraint140Change,
    isGenerating, onGenerate, generateButtonRef, plan, presets, activePresetId,
    onApplyPreset, onOpenPresetModal, customPrompt, onCustomPromptChange,
    storeSupplement, onStoreSupplementChange, language, onLanguageChange,
    onOpenGuide, hasResults = false, isStyleLocked = false
}) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const [isPromptExpanded, setIsPromptExpanded] = React.useState(!!customPrompt);
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
            alert('お使いのブラウザは音声入力に対応していません。');
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
            if (finalTranscript) onInputTextChange(inputText + (inputText ? ' ' : '') + finalTranscript);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
        recognition.start();
    }, [isListening, inputText, onInputTextChange]);

    const handleClear = React.useCallback(() => {
        if (window.confirm('入力内容をすべて消去しますか？')) onInputTextChange('');
    }, [onInputTextChange]);

    return (
        <div className="flex flex-col">
            {/* 1. Platform & Multi-gen */}
            <div className="flex flex-col gap-2 pb-4">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shadow-sm border bg-black text-white border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">1</div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-black/60">投稿先を選ぶ</h3>
                    </div>
                </div>
                <div className="flex flex-row items-center gap-4">
                    <div className="grid grid-cols-4 flex-1 p-2 gap-2 rounded-2xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                        {[Platform.X, Platform.Instagram, Platform.Line, Platform.GoogleMaps].map((p) => {
                            const isSelected = platforms.includes(p);
                            const getStyle = (plt: Platform) => {
                                if (!isSelected) return 'text-black/40 hover:text-black border-transparent bg-transparent';
                                switch (plt) {
                                    case Platform.X: return 'bg-black text-white border-black shadow-[4px_4px_0px_0px_#9B8FD4]';
                                    case Platform.Instagram: return 'bg-[#E88BA3] text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]';
                                    case Platform.Line: return 'bg-[#06C755] text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]';
                                    case Platform.GoogleMaps: return 'bg-[#4DB39A] text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]';
                                    default: return 'bg-white text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]';
                                }
                            };
                            return (
                                <button key={p} onClick={() => onSetActivePlatform(p)} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all border-2 ${isSelected ? '-translate-y-[2px]' : ''} ${getStyle(p)}`}>
                                    <div className={!isSelected ? 'grayscale opacity-60' : ''}>{getPlatformIcon(p)}</div>
                                    <span>{p === Platform.Line ? 'LINE' : (p === Platform.GoogleMaps ? 'Google Maps' : (p === Platform.X ? 'X' : p))}</span>
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                        <span className="text-[10px] font-black text-black uppercase tracking-[0.2em] leading-none">同時生成</span>
                        <button onClick={onToggleMultiGen} className={`relative inline-flex h-6 w-11 items-center rounded-xl transition-all duration-300 ${isMultiGen ? 'bg-[#4DB39A]' : 'bg-black/10'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-xl bg-white transition-transform duration-300 ${isMultiGen ? 'translate-x-6' : 'translate-x-1'} shadow-sm`} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 py-6">
                <div className="flex flex-col flex-1 gap-6">
                    {/* 2. Styles */}
                    <div className="p-5 rounded-[20px] flex flex-col gap-4 bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shadow-sm border bg-black text-white border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">2</div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-black/60">文章のスタイル</h3>
                            </div>
                            <button onClick={onOpenPresetModal} className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm bg-black/5 text-black hover:bg-black hover:text-white border-black/10">
                                <MagicWandIcon className="w-3.5 h-3.5" /><span>設定・管理</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => onApplyPreset({ id: 'plain-ai' } as any)} className={`group h-[80px] px-3 rounded-[20px] transition-all flex flex-col items-center justify-center gap-1 border-2 ${!activePresetId ? 'bg-[#4DB39A] text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-[2px]' : 'bg-black/5 text-black/40 border-black/10'}`}>
                                <AutoSparklesIcon className="w-5 h-5" /><span className="text-[12px] font-black tracking-wide">おまかせ</span>
                            </button>
                            {presets.slice(0, 3).map((p, idx) => {
                                const isSelected = activePresetId === p.id;
                                const colors = ['bg-[#E88BA3]', 'bg-[#9B8FD4]', 'bg-[#F5CC6D]'];
                                return (
                                    <button key={p.id} onClick={() => onApplyPreset(p)} className={`group h-[80px] px-3 rounded-[20px] transition-all flex flex-col items-center justify-center gap-1 border-2 ${isSelected ? `${colors[idx % 3]} text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-[2px]` : 'bg-black/5 text-black/40 border-black/10'}`}>
                                        {renderAvatar(p.avatar, "w-5 h-5")}<span className="text-[12px] font-black truncate w-full text-center">{p.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 3. Detailed Settings */}
                    <div className="p-5 rounded-[20px] flex flex-col gap-5 bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                        <div className="flex items-center gap-2 px-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shadow-sm border bg-black text-white border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">3</div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-black/60">詳細設定</h3>
                        </div>
                        <section>
                            <h3 className="text-[10px] font-black text-black/30 mb-1.5 px-1">トーン</h3>
                            <div className={`flex flex-row gap-1.5 bg-black/5 p-1 rounded-[16px] border border-black/10 ${isStyleLocked ? 'opacity-50' : ''}`}>
                                {TONES.map(t => (
                                    <button key={t.id} onClick={() => onToneChange(t.id)} className={`flex-1 py-1.5 rounded-[12px] text-[12px] font-black border-2 transition-all ${tone === t.id ? 'bg-[#F5CC6D] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-[1px]' : 'text-black/40 border-transparent'}`}>{t.label}</button>
                                ))}
                            </div>
                        </section>
                        {!isX && (
                            <section>
                                <h3 className="text-[10px] font-black text-black/30 mb-1.5 px-1">長さ</h3>
                                <div className="flex flex-row gap-1.5 bg-black/5 p-1 rounded-[16px] border border-black/10">
                                    {LENGTHS.map(l => (
                                        <button key={l.id} onClick={() => onLengthChange(l.id)} className={`flex-1 py-1.5 rounded-[12px] text-[12px] font-black border-2 transition-all ${length === l.id ? 'bg-[#9B8FD4] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-[1px]' : 'text-black/40 border-transparent'}`}>{l.label}</button>
                                    ))}
                                </div>
                            </section>
                        )}
                        {isX && (
                            <section>
                                <h3 className="text-[10px] font-black text-black/30 mb-2 px-1">制限設定</h3>
                                <button onClick={() => onXConstraint140Change(!xConstraint140)} className={`w-full p-2 rounded-[16px] border-2 flex items-center justify-between shadow-sm ${xConstraint140 ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white border-black/10 text-black/40'}`}>
                                    <span className="text-[10px] font-black ml-2 uppercase tracking-widest">140文字制限（X）</span>
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center mr-1 ${xConstraint140 ? 'bg-[#E88BA3]' : 'bg-black/10'}`}>{xConstraint140 && <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>}</div>
                                </button>
                            </section>
                        )}
                        {!isGoogleMaps && (
                            <section className="relative">
                                <div className={`flex flex-row items-center gap-2 bg-white px-3 py-2 rounded-[20px] border-2 border-black/10 shadow-sm ${isStyleLocked ? 'opacity-50' : ''}`}>
                                    <div className="flex-1 flex items-center justify-between px-2">
                                        <span className="text-[10px] font-black text-black uppercase tracking-widest leading-none">絵文字</span>
                                        <button onClick={() => onIncludeEmojisChange(!includeEmojis)} className={`relative inline-flex h-4 w-7 items-center rounded-xl transition-all ${includeEmojis ? 'bg-[#4DB39A]' : 'bg-black/10'}`}><span className={`inline-block h-3 w-3 transform rounded-xl bg-white transition-transform ${includeEmojis ? 'translate-x-3.5' : 'translate-x-0.5'}`} /></button>
                                    </div>
                                    <div className="w-px h-5 bg-black/10" />
                                    <div className="flex-1 flex items-center justify-between px-2">
                                        <span className="text-[10px] font-black text-black uppercase tracking-widest leading-none">特殊文字</span>
                                        <button onClick={() => onIncludeSymbolsChange(!includeSymbols)} className={`relative inline-flex h-4 w-7 items-center rounded-xl transition-all ${includeSymbols ? 'bg-[#4DB39A]' : 'bg-black/10'}`}><span className={`inline-block h-3 w-3 transform rounded-xl bg-white transition-transform ${includeSymbols ? 'translate-x-3.5' : 'translate-x-0.5'}`} /></button>
                                    </div>
                                </div>
                                {isStyleLocked && (
                                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none backdrop-blur-[1px]">
                                        <div className="bg-white/80 border border-black/5 shadow-lg text-black/60 px-4 py-2 rounded-xl flex items-center gap-2">
                                            <MagicWandIcon className="w-3.5 h-3.5 text-[#F5CC6D]" /><span className="text-[10px] font-black uppercase tracking-widest">AI学習適用中</span>
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex items-center gap-2 px-4 translate-y-2 relative z-20">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shadow-sm border bg-black text-white border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">4</div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-black/60">伝えたい内容</h3>
                    </div>
                    <div className="rounded-[40px] p-14 flex flex-col bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] min-h-[400px]">
                        <AutoResizingTextarea
                            ref={textareaRef}
                            value={inputText}
                            onChange={(e) => onInputTextChange(e.target.value)}
                            placeholder={isGoogleMaps ? "口コミ内容を貼り付けてください..." : "伝えたいことを入力してください..."}
                            className="w-full h-full bg-transparent text-black text-lg font-bold leading-relaxed focus:outline-none resize-none placeholder:text-black/10"
                        />
                        {isGoogleMaps && (
                            <div className="mt-6 p-6 bg-[#F5CC6D]/10 border-[#F5CC6D] border-2 rounded-[32px]">
                                <h4 className="text-[11px] font-black text-[#C4A052] uppercase mb-3">補足情報 / 当日の事情</h4>
                                <AutoResizingTextarea
                                    value={storeSupplement}
                                    onChange={(e) => onStoreSupplementChange(e.target.value)}
                                    placeholder="例：急な欠勤で人手が足りなかった、など"
                                    className="w-full bg-transparent text-black text-sm font-bold leading-relaxed placeholder-[#C4A052]/30 focus:outline-none resize-none min-h-[60px]"
                                />
                            </div>
                        )}
                        <div className="mt-10 pt-8 border-t-2 border-black/5 flex items-center justify-between">
                            <button onClick={() => setIsPromptExpanded(!isPromptExpanded)} className="flex items-center gap-3 text-black/40 hover:text-black transition-colors">
                                <AutoSparklesIcon className={`w-4 h-4 ${customPrompt ? 'text-[#0071b9]' : ''}`} /><span className="text-[11px] font-black">追加指示（任意）</span>
                            </button>
                            <div className="flex items-center gap-4">
                                <span className="text-[9px] font-black text-black/20 uppercase">{inputText.length} chars</span>
                                <button onClick={handleClear} disabled={!inputText} className="p-2 rounded-xl text-black/40 hover:text-black disabled:opacity-30"><EraserIcon className="w-5 h-5" /></button>
                                <button onClick={toggleVoiceInput} className={`p-2 rounded-xl transition-all ${isListening ? 'bg-[#4DB39A] text-black border-2 border-black' : 'text-black/40 hover:text-black'}`}><MicIcon className="w-5 h-5" /></button>
                            </div>
                        </div>
                        {isPromptExpanded && (
                            <div className="mt-4 flex items-center gap-3 bg-[#4DB39A]/10 border-black border-[3px] rounded-2xl px-5 py-2 animate-in zoom-in-95">
                                <input type="text" value={customPrompt} onChange={(e) => onCustomPromptChange(e.target.value)} placeholder="例：テンション高めに..." className="flex-1 bg-transparent border-none focus:outline-none text-[13px] font-bold text-black" autoFocus />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
