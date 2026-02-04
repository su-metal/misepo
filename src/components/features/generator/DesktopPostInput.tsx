import React from 'react';
import { Platform, PostPurpose, GoogleMapPurpose } from '../../../types';
import { AutoResizingTextarea } from './AutoResizingTextarea';
import { getPlatformIcon } from './utils';
import {
    AutoSparklesIcon, MagicWandIcon, MicIcon, EraserIcon, InfoIcon,
    InstagramIcon, LineIcon, GoogleMapsIcon, ChevronRightIcon, SparklesIcon, StarIcon, LockIcon
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
    onOpenGuide, hasResults = false, isStyleLocked = false, storeProfile, onOpenOnboarding
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
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shadow-sm border bg-[#111111] text-white border-[#111111] shadow-[4px_4px_0_0_rgba(170,170,170,0.25)]">1</div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-[#666666]">投稿先を選ぶ</h3>
                    </div>
                </div>
                <div className="flex flex-row items-center gap-4">
                    <div className="grid grid-cols-2 flex-1 gap-3 rounded-2xl bg-transparent">
                        {(() => {
                            const getPlatformDetails = (platform: Platform) => {
                                switch (platform) {
                                    case Platform.Instagram: return {
                                        name: 'Instagram', tagline: 'Visual Story', sub: '世界観と統一感',
                                        icon: <InstagramIcon className="w-7 h-7" />,
                                    };
                                    case Platform.X: return {
                                        name: 'X', tagline: 'Real-time', sub: '拡散と交流',
                                        icon: <span className="font-black text-2xl">𝕏</span>,
                                    };
                                    case Platform.Line: return {
                                        name: 'LINE', tagline: 'Messages', sub: 'リピーター獲得',
                                        icon: <LineIcon className="w-7 h-7" isActive={platforms.includes(Platform.Line)} activeTextFill="#2b2b2f" />,
                                    };
                                    case Platform.GoogleMaps: return {
                                        name: 'Google Maps', tagline: 'Local Search', sub: '店舗集客とMEO対策',
                                        icon: <GoogleMapsIcon className="w-7 h-7" />,
                                    };
                                    default: return { name: '', tagline: '', sub: '', icon: null };
                                }
                            };

                            return [Platform.Instagram, Platform.X, Platform.Line, Platform.GoogleMaps].map((p) => {
                                const isSelected = platforms.includes(p);
                                const details = getPlatformDetails(p);
                                return (
                                    <button
                                        key={p}
                                        onClick={() => onSetActivePlatform(p)}
                                        className={`
                                            relative h-[140px] rounded-[32px] overflow-hidden cursor-pointer border transition-all duration-500 group text-left
                                            ${isSelected
                                                ? 'bg-[var(--plexo-yellow)] border-[var(--plexo-yellow)] shadow-lg scale-[0.98] animate-tactile-pop'
                                                : `bg-white border-[#EBEBEB] shadow-sm hover:border-[#D0D0D0] hover:shadow-md active:scale-[0.98]`
                                            }
                                        `}
                                    >
                                        <div className="absolute inset-0 p-5 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div className={`transition-all duration-300 ${isSelected ? 'text-black' : 'text-[#BBBBBB]'}`}>
                                                    {details.icon}
                                                </div>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${isSelected ? 'bg-black text-[var(--plexo-yellow)]' : 'bg-[#F5F5F5] text-[#CCCCCC]'}`}>
                                                    <ChevronRightIcon className="w-4 h-4" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-300 mb-1 ${isSelected ? 'text-black/40' : 'text-[#BBBBBB]'}`}>
                                                    {details.tagline}
                                                </span>
                                                <div className="flex flex-col leading-tight">
                                                    <h3 className={`font-black tracking-tighter text-lg transition-colors duration-500 ${isSelected ? 'text-black' : 'text-[#111111]'}`}>
                                                        {details.name}
                                                    </h3>
                                                    <p className={`text-[10px] font-medium transition-opacity ${isSelected ? 'text-black/50' : 'text-[#999999]'}`}>
                                                        {details.sub}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            });
                        })()}
                    </div>
                    <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white border border-[#E5E5E5] shadow-sm">
                        <span className="text-[10px] font-black text-[#111111] uppercase tracking-[0.2em] leading-none">同時生成</span>
                        <button onClick={onToggleMultiGen} className={`relative inline-flex h-6 w-11 items-center rounded-xl transition-all duration-300 ${isMultiGen ? 'bg-[#111111]' : 'bg-[#E5E5E5]'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-xl bg-white transition-transform duration-300 ${isMultiGen ? 'translate-x-6' : 'translate-x-1'} shadow-sm`} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 py-6">
                <div className="flex flex-col flex-1 gap-6">
                    {/* 2. Styles */}
                    <div className="p-5 rounded-[20px] flex flex-col gap-4 bg-white border border-[#E5E5E5] shadow-sm">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shadow-sm border bg-[#111111] text-white border-[#111111] shadow-[4px_4px_0_0_rgba(170,170,170,0.25)]">2</div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-[#666666]">文章のスタイル</h3>
                            </div>
                            <button onClick={onOpenPresetModal} className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm bg-[#FAFAFA] text-[#111111] hover:bg-[#111111] hover:text-white border-[#E5E5E5]">
                                <MagicWandIcon className="w-3.5 h-3.5" /><span>設定・管理</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => onApplyPreset({ id: 'plain-ai' } as any)} className={`group h-[80px] px-3 rounded-[20px] transition-all flex flex-col items-center justify-center gap-1 border ${activePresetId === 'plain-ai' ? 'bg-[#111111] text-white border-[#111111] shadow-md -translate-y-[1px]' : 'bg-[#FAFAFA] text-[#999999] border-[#E5E5E5] hover:bg-[#F0F0F0]'}`}>
                                <AutoSparklesIcon className="w-5 h-5" /><span className="text-[12px] font-black tracking-wide">おまかせ</span>
                            </button>
                            {presets.slice(0, 3).map((p, idx) => {
                                const isSelected = activePresetId === p.id;
                                return (
                                    <button key={p.id} onClick={() => onApplyPreset(p)} className={`group h-[80px] px-3 rounded-[20px] transition-all flex flex-col items-center justify-center gap-1 border ${isSelected ? 'bg-[#111111] text-white border-[#111111] shadow-md -translate-y-[1px]' : 'bg-[#FAFAFA] text-[#999999] border-[#E5E5E5] hover:bg-[#F0F0F0]'}`}>
                                        {renderAvatar(p.avatar, "w-5 h-5")}<span className="text-[12px] font-black truncate w-full text-center">{p.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 3. Detailed Settings */}
                    <div className="p-5 rounded-[20px] flex flex-col gap-5 bg-white border border-[#E5E5E5] shadow-sm">
                        <div className="flex items-center gap-2 px-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shadow-sm border bg-[#111111] text-white border-[#111111] shadow-[4px_4px_0_0_rgba(170,170,170,0.25)]">3</div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-[#666666]">詳細設定</h3>
                        </div>
                        <section>
                            <div className="flex items-center gap-2 mb-1.5 px-1">
                                <h3 className="text-[10px] font-black text-[#999999]">トーン</h3>
                                {isStyleLocked && (
                                    <div className="flex items-center gap-1 bg-[#d8e9f4] px-1.5 py-0.5 rounded text-[8px] font-black text-[#2b2b2f] uppercase tracking-wider">
                                        <LockIcon className="w-2.5 h-2.5" />
                                        <span>AI学習適用中</span>
                                    </div>
                                )}
                            </div>
                            <div className={`flex flex-row gap-1.5 bg-[#FAFAFA] p-1 rounded-[16px] border border-[#E5E5E5] transition-opacity ${isStyleLocked ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                {TONES.map(t => (
                                    <button
                                        key={t.id}
                                        disabled={isStyleLocked}
                                        onClick={() => onToneChange(t.id)}
                                        className={`flex-1 py-1.5 rounded-[12px] text-[12px] font-black border transition-all ${tone === t.id ? 'bg-white border-[#E5E5E5] text-[#111111] shadow-sm' : 'text-[#999999] border-transparent'} ${isStyleLocked ? 'pointer-events-none' : ''}`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </section>
                        {!isX && (
                            <section>
                                <h3 className="text-[10px] font-black text-[#999999] mb-1.5 px-1">長さ</h3>
                                <div className="flex flex-row gap-1.5 bg-[#FAFAFA] p-1 rounded-[16px] border border-[#E5E5E5]">
                                    {LENGTHS.map(l => (
                                        <button key={l.id} onClick={() => onLengthChange(l.id)} className={`flex-1 py-1.5 rounded-[12px] text-[12px] font-black border transition-all ${length === l.id ? 'bg-white border-[#E5E5E5] text-[#111111] shadow-sm' : 'text-[#999999] border-transparent'}`}>{l.label}</button>
                                    ))}
                                </div>
                            </section>
                        )}
                        {isX && (
                            <section>
                                <h3 className="text-[10px] font-black text-[#999999] mb-2 px-1">制限設定</h3>
                                <button onClick={() => onXConstraint140Change(!xConstraint140)} className={`w-full p-2 rounded-[16px] border flex items-center justify-between shadow-sm transition-all ${xConstraint140 ? 'bg-[#111111] text-white border-[#111111]' : 'bg-white border-[#E5E5E5] text-[#999999]'}`}>
                                    <span className="text-[10px] font-black ml-2 uppercase tracking-widest">140文字制限（X）</span>
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center mr-1 ${xConstraint140 ? 'bg-white/20' : 'bg-[#E5E5E5]'}`}>{xConstraint140 && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}</div>
                                </button>
                            </section>
                        )}
                        {!isGoogleMaps && (
                            <section className="relative">
                                <div className={`flex flex-row items-center gap-2 bg-white px-3 py-2 rounded-[20px] border border-[#E5E5E5] shadow-sm ${isStyleLocked ? 'opacity-50' : ''}`}>
                                    <div className="flex-1 flex items-center justify-between px-2">
                                        <span className="text-[10px] font-black text-[#111111] uppercase tracking-widest leading-none">絵文字</span>
                                        <button onClick={() => onIncludeEmojisChange(!includeEmojis)} className={`relative inline-flex h-4 w-7 items-center rounded-xl transition-all ${includeEmojis ? 'bg-[#111111]' : 'bg-[#E5E5E5]'}`}><span className={`inline-block h-3 w-3 transform rounded-xl bg-white transition-transform ${includeEmojis ? 'translate-x-3.5' : 'translate-x-0.5'}`} /></button>
                                    </div>
                                    <div className="w-px h-5 bg-[#E5E5E5]" />
                                    <div className="flex-1 flex items-center justify-between px-2">
                                        <span className="text-[10px] font-black text-[#111111] uppercase tracking-widest leading-none">特殊文字</span>
                                        <button onClick={() => onIncludeSymbolsChange(!includeSymbols)} className={`relative inline-flex h-4 w-7 items-center rounded-xl transition-all ${includeSymbols ? 'bg-[#111111]' : 'bg-[#E5E5E5]'}`}><span className={`inline-block h-3 w-3 transform rounded-xl bg-white transition-transform ${includeSymbols ? 'translate-x-3.5' : 'translate-x-0.5'}`} /></button>
                                    </div>
                                </div>
                                {isStyleLocked && (
                                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none backdrop-blur-[1px]">
                                        <div className="bg-white/90 border border-[#E5E5E5] shadow-lg text-[#666666] px-4 py-2 rounded-xl flex items-center gap-2">
                                            <MagicWandIcon className="w-3.5 h-3.5 text-[#111111]" /><span className="text-[10px] font-black uppercase tracking-widest">AI学習適用中</span>
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex items-center gap-2 px-4 translate-y-2 relative z-20">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shadow-sm border bg-[#111111] text-white border-[#111111] shadow-[4px_4px_0_0_rgba(170,170,170,0.25)]">4</div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-[#666666]">伝えたい内容</h3>
                    </div>
                    {isGoogleMaps && (
                        <div className="flex items-center gap-4 px-4 mb-2">
                            <span className="text-[10px] font-bold text-[#666666] uppercase tracking-[0.2em]">Target Rating</span>
                            <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => onStarRatingChange(star)}
                                        className="transition-transform active:scale-95 focus:outline-none"
                                    >
                                        <StarIcon
                                            className={`w-6 h-6 transition-all ${star <= (starRating || 0)
                                                ? 'text-[#f2e018] fill-[#f2e018] drop-shadow-sm'
                                                : 'text-[#E5E5E5]'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="rounded-[40px] p-14 flex flex-col bg-white border border-[#E5E5E5] shadow-sm min-h-[400px]">
                        <AutoResizingTextarea
                            ref={textareaRef}
                            value={inputText}
                            onChange={(e) => onInputTextChange(e.target.value)}
                            placeholder={isGoogleMaps ? "口コミ内容を貼り付けてください..." : "伝えたいことを入力してください..."}
                            className="w-full h-full bg-transparent text-[#111111] text-lg font-bold leading-relaxed focus:outline-none resize-none placeholder:text-[#CCCCCC]"
                        />
                        {isGoogleMaps && (
                            <div className="mt-6 p-6 bg-[#FAFAFA] border-[#E5E5E5] border rounded-[32px]">
                                <h4 className="text-[11px] font-black text-[#666666] uppercase mb-3">補足情報 / 当日の事情</h4>
                                <AutoResizingTextarea
                                    value={storeSupplement}
                                    onChange={(e) => onStoreSupplementChange(e.target.value)}
                                    placeholder="例：急な欠勤で人手が足りなかった、など"
                                    className="w-full bg-transparent text-[#111111] text-sm font-bold leading-relaxed placeholder-[#CCCCCC] focus:outline-none resize-none min-h-[60px]"
                                />
                            </div>
                        )}
                        <div className="mt-10 pt-8 border-t border-[#E5E5E5] flex items-center justify-between">
                            <button onClick={() => setIsPromptExpanded(!isPromptExpanded)} className="flex items-center gap-3 text-[#999999] hover:text-[#111111] transition-colors">
                                <AutoSparklesIcon className={`w-4 h-4 ${customPrompt ? 'text-[#111111]' : ''}`} /><span className="text-[11px] font-black">追加指示（任意）</span>
                            </button>
                            <div className="flex items-center gap-4">
                                <span className="text-[9px] font-black text-[#CCCCCC] uppercase">{inputText.length} chars</span>
                                <button onClick={handleClear} disabled={!inputText} className="p-2 rounded-xl text-[#999999] hover:text-[#111111] disabled:opacity-30"><EraserIcon className="w-5 h-5" /></button>
                                <button onClick={toggleVoiceInput} className={`p-2 rounded-xl transition-all ${isListening ? 'bg-[#111111] text-white' : 'text-[#999999] hover:text-[#111111]'}`}><MicIcon className="w-5 h-5" /></button>
                            </div>
                        </div>
                        {isPromptExpanded && (
                            <div className="mt-4 flex items-center gap-3 bg-[#FAFAFA] border-[#E5E5E5] border rounded-2xl px-5 py-2 animate-in zoom-in-95">
                                <input type="text" value={customPrompt} onChange={(e) => onCustomPromptChange(e.target.value)} placeholder="例：テンション高めに..." className="flex-1 bg-transparent border-none focus:outline-none text-[13px] font-bold text-[#111111]" autoFocus />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
