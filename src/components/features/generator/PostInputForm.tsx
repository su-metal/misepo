import React from 'react';
import { PostPurpose, GoogleMapPurpose, Tone, Length, Platform, Preset, UserPlan } from '../../../types';
import { AutoResizingTextarea } from './AutoResizingTextarea';
import {
    MegaphoneIcon, BookOpenIcon, LightbulbIcon, ChatHeartIcon,
    AutoSparklesIcon, HandHeartIcon, ApologyIcon, InfoIcon, SparklesIcon,
    StarIcon, ChevronDownIcon,
    TieIcon, SneakersIcon, LaptopIcon, CookingIcon, CoffeeIcon,
    BuildingIcon, LeafIcon, GemIcon,
    MicIcon, MicOffIcon, EraserIcon, MagicWandIcon,
} from '../../Icons';

const AVATAR_OPTIONS = [
    { id: '👔', icon: TieIcon },
    { id: '👟', icon: SneakersIcon },
    { id: '💻', icon: LaptopIcon },
    { id: '🍳', icon: CookingIcon },
    { id: '☕', icon: CoffeeIcon },
    { id: '🏢', icon: BuildingIcon },
    { id: '✨', icon: SparklesIcon },
    { id: '📣', icon: MegaphoneIcon },
    { id: '🌿', icon: LeafIcon },
    { id: '💎', icon: GemIcon }
];

const renderAvatar = (avatarId: string | null, className: string = "w-6 h-6") => {
    const option = AVATAR_OPTIONS.find(opt => opt.id === avatarId);
    if (option) {
        const Icon = option.icon;
        return <Icon className={className} />;
    }
    return <TieIcon className={className} />; // Default
};

interface PostInputFormProps {
    platforms: Platform[];
    activePlatform: Platform;
    isMultiGen: boolean;
    onPlatformToggle: (platform: Platform) => void;
    onToggleMultiGen: () => void;
    onSetActivePlatform: (platform: Platform) => void;
    platform: Platform;
    postPurpose: PostPurpose;
    gmapPurpose: GoogleMapPurpose;
    onPostPurposeChange: (p: PostPurpose) => void;
    onGmapPurposeChange: (p: GoogleMapPurpose) => void;
    tone: Tone;
    onToneChange: (t: Tone) => void;
    length: Length;
    onLengthChange: (l: Length) => void;
    inputText: string;
    onInputTextChange: (text: string) => void;
    starRating: number | null;
    onStarRatingChange: (r: number | null) => void;
    includeEmojis: boolean;
    onIncludeEmojisChange: (value: boolean) => void;
    includeSymbols: boolean;
    onIncludeSymbolsChange: (value: boolean) => void;
    xConstraint140: boolean;
    onXConstraint140Change: (value: boolean) => void;
    isGenerating: boolean;
    onGenerate: () => void;
    generateButtonRef?: React.RefObject<HTMLButtonElement>;
    plan: UserPlan;
    presets: Preset[];
    activePresetId: string | null;
    onApplyPreset: (preset: Preset) => void;
    onOpenPresetModal: () => void;
    customPrompt: string;
    onCustomPromptChange: (val: string) => void;
}

const PURPOSES = [
    { id: PostPurpose.Auto, label: '自動', icon: <AutoSparklesIcon /> },
    { id: PostPurpose.Promotion, label: '宣伝・告知', icon: <MegaphoneIcon /> },
    { id: PostPurpose.Story, label: 'ストーリー', icon: <BookOpenIcon /> },
    { id: PostPurpose.Educational, label: 'お役立ち', icon: <LightbulbIcon /> },
    { id: PostPurpose.Engagement, label: '交流', icon: <ChatHeartIcon /> },
];

const GMAP_PURPOSES = [
    { id: GoogleMapPurpose.Auto, label: '自動', icon: <AutoSparklesIcon /> },
    { id: GoogleMapPurpose.Thanks, label: 'お礼', icon: <HandHeartIcon /> },
    { id: GoogleMapPurpose.Apology, label: 'お詫び', icon: <ApologyIcon /> },
    { id: GoogleMapPurpose.Info, label: '情報', icon: <InfoIcon /> },
];

const TONES = [
    { id: Tone.Formal, label: 'きっちり' },
    { id: Tone.Standard, label: '標準' },
    { id: Tone.Friendly, label: '親しみ' },
];

const LENGTHS = [
    { id: Length.Short, label: '短め' },
    { id: Length.Medium, label: '標準' },
    { id: Length.Long, label: '長め' },
];

export const PostInputForm: React.FC<PostInputFormProps> = ({
    platforms,
    activePlatform,
    isMultiGen,
    onPlatformToggle,
    onToggleMultiGen,
    onSetActivePlatform,
    platform,
    postPurpose,
    gmapPurpose,
    onPostPurposeChange,
    onGmapPurposeChange,
    tone,
    onToneChange,
    length,
    onLengthChange,
    inputText,
    onInputTextChange,
    starRating,
    onStarRatingChange,
    includeEmojis,
    onIncludeEmojisChange,
    includeSymbols,
    onIncludeSymbolsChange,
    xConstraint140,
    onXConstraint140Change,
    isGenerating,
    onGenerate,
    generateButtonRef,
    plan,
    presets,
    activePresetId,
    onApplyPreset,
    onOpenPresetModal,
    customPrompt,
    onCustomPromptChange
}) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const [isPromptExpanded, setIsPromptExpanded] = React.useState(!!customPrompt);
    const [isListening, setIsListening] = React.useState(false);
    const recognitionRef = React.useRef<any>(null); // Use any for SpeechRecognition to avoid extensive typing setup

    const isGoogleMaps = platform === Platform.GoogleMaps;
    const isX = platform === Platform.X;

    // Handle Voice Input
    const toggleVoiceInput = React.useCallback(() => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('お使いのブラウザは音声入力に対応していません。Google Chromeなどのモダンブラウザをご利用ください。');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'ja-JP';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                onInputTextChange(inputText + (inputText ? ' ' : '') + finalTranscript);
            }
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();

    }, [isListening, inputText, onInputTextChange]);

    // Handle Clear
    const handleClear = React.useCallback(() => {
        if (window.confirm('入力内容をすべて消去しますか？')) {
            onInputTextChange('');
        }
    }, [onInputTextChange]);

    React.useEffect(() => {
        if (!isGoogleMaps && !Object.values(PostPurpose).includes(postPurpose)) {
            onPostPurposeChange(PostPurpose.Auto);
        }
    }, [isGoogleMaps, postPurpose, onPostPurposeChange]);


    return (
        <div className="flex flex-col">
            {/* Platform Tabs & Multi-gen Toggle - Solid Card Style */}
            <div className="flex flex-col gap-2 px-3 sm:px-0 pb-4">
                <div className="flex items-center gap-2 px-2">
                    <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[11px] font-black">1</span>
                    <h3 className="text-xs font-black text-black/60 uppercase tracking-widest">投稿先を選ぶ</h3>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex items-stretch flex-1 px-4 py-2 gap-1 section-card rounded-2xl border-black">
                        <button
                            onClick={() => onSetActivePlatform(Platform.X)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-black transition-all relative
                            ${platforms.includes(Platform.X)
                                    ? 'bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-[2px]'
                                    : 'text-black/40 hover:text-black hover:bg-black/5'
                                }`}
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                            </svg>
                            <span>X (Twitter)</span>
                        </button>
                        <button
                            onClick={() => onSetActivePlatform(Platform.Instagram)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-black transition-all relative
                            ${platforms.includes(Platform.Instagram)
                                    ? 'bg-[#E88BA3] text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-[2px]'
                                    : 'text-black/40 hover:text-black hover:bg-black/5'
                                }`}
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                            </svg>
                            <span>Instagram</span>
                        </button>
                        <button
                            onClick={() => onSetActivePlatform(Platform.GoogleMaps)}
                            className={`flex-1 flex items-center justify-center gap-1 py-3 rounded-xl text-xs sm:text-sm font-black transition-all relative
                            ${platforms.includes(Platform.GoogleMaps)
                                    ? 'bg-[#4DB39A] text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-[2px]'
                                    : 'text-black/40 hover:text-black hover:bg-black/5'
                                }`}
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                            <span>Google Maps</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3 px-5 py-2.5 section-card rounded-2xl border-black">
                        <span className="text-[10px] font-black text-black uppercase tracking-[0.2em] leading-none">同時生成</span>
                        <button
                            onClick={onToggleMultiGen}
                            className={`relative inline-flex h-6 w-11 items-center rounded-xl transition-all duration-300 ${isMultiGen ? 'bg-[#4DB39A]' : 'bg-black/10'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-xl bg-white transition-transform duration-300 ${isMultiGen ? 'translate-x-6' : 'translate-x-1'} shadow-sm`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 gap-4 sm:gap-6 lg:gap-8 px-3 sm:px-0 pb-0 pt-2 sm:py-6">

                {/* Content Rows Container (Order 1) */}
                <div className="w-full shrink-0 flex flex-col gap-6 order-1">

                    {/* ROW 1: Profiles & Style Settings */}
                    <div className="flex flex-col lg:flex-row gap-6 lg:items-stretch">

                        {/* LEFT COL: Profiles */}
                        <div className="section-card p-5 rounded-[32px] border-black flex flex-col gap-4 flex-1">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black">2</span>
                                    <h3 className="text-xs font-black text-black uppercase tracking-widest">投稿者プロフィール</h3>
                                </div>
                                <button
                                    onClick={onOpenPresetModal}
                                    className="px-3 py-1.5 rounded-xl bg-black/5 text-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all active:scale-95 flex items-center gap-1.5 border border-black/10 shadow-sm"
                                >
                                    <MagicWandIcon className="w-3.5 h-3.5" />
                                    <span>設定・管理</span>
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3 md:gap-4 w-full flex-1 h-full auto-rows-fr">
                                {/* Plain AI Option */}
                                <button
                                    onClick={() => onApplyPreset({ id: 'plain-ai' } as any)}
                                    className={`group relative py-3 px-3 rounded-[20px] transition-all duration-300 flex flex-col items-center justify-center gap-2 border-2
                                                ${!activePresetId
                                            ? 'bg-[#4DB39A] text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-[2px]'
                                            : 'bg-black/5 shadow-sm hover:bg-black/10 text-black/40 hover:text-black border-black/10 hover:border-black/20'}
                                            `}
                                >
                                    <span className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${!activePresetId ? 'opacity-100' : 'opacity-40 grayscale group-hover:grayscale-0'}`}>
                                        <AutoSparklesIcon className="w-6 h-6" />
                                    </span>
                                    <span className={`text-[12px] md:text-[14px] font-black truncate tracking-wide text-center w-full ${!activePresetId ? 'text-black' : 'text-black/40'}`}>おまかせ</span>
                                </button>

                                {presets.map((p, idx) => {
                                    const isSelected = activePresetId === p.id;
                                    // Cycle colors for profiles: Rose, Lavender, Gold
                                    const colors = ['bg-[#E88BA3]', 'bg-[#9B8FD4]', 'bg-[#F5CC6D]'];
                                    const bgColor = colors[idx % colors.length];

                                    return (
                                        <button
                                            key={p.id}
                                            onClick={() => onApplyPreset(p)}
                                            className={`group relative py-3 px-3 rounded-[20px] transition-all duration-300 flex flex-col items-center justify-center gap-2 border-2
                                                        ${isSelected
                                                    ? `${bgColor} text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-[2px]`
                                                    : 'bg-black/5 shadow-sm hover:bg-black/10 text-black/40 hover:text-black border-black/10 hover:border-black/20'}
                                                    `}
                                        >
                                            <span className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${isSelected ? 'opacity-100' : 'opacity-40 grayscale group-hover:grayscale-0'}`}>
                                                {renderAvatar(p.avatar, "w-6 h-6")}
                                            </span>
                                            <span className={`text-[12px] md:text-[14px] font-black truncate tracking-wide text-center w-full ${isSelected ? 'text-black' : 'text-black/40'}`}>
                                                {p.name}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* RIGHT COL: Style Settings */}
                        <div className="section-card p-5 rounded-[32px] border-black flex flex-col gap-5 flex-1">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black">3</span>
                                    <h3 className="text-xs font-black text-black uppercase tracking-widest">スタイル設定</h3>
                                </div>
                            </div>
                            {/* Tone Selection */}
                            <section>
                                <h3 className="text-[10px] font-black text-black/30 uppercase tracking-widest mb-1.5 px-1">トーン</h3>
                                <div className={`flex flex-row gap-1.5 bg-black/5 p-1 rounded-[16px] border border-black/10 ${activePresetId ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    {TONES.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => onToneChange(t.id)}
                                            disabled={!!activePresetId}
                                            className={`flex-1 py-1.5 px-1 rounded-[12px] text-[12px] font-black transition-all flex items-center justify-center gap-1.5 relative border-2 ${tone === t.id
                                                ? 'bg-[#F5CC6D] text-black border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-[1px]'
                                                : 'text-black/40 hover:text-black hover:bg-white border-transparent'
                                                }`}
                                        >
                                            <span>{t.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Length Selection */}
                            {!isX && (
                                <section>
                                    <h3 className="text-[10px] font-black text-black/30 uppercase tracking-widest mb-1.5 px-1">文章の長さ</h3>
                                    <div className="flex flex-row gap-1.5 bg-black/5 p-1 rounded-[16px] border border-black/10">
                                        {LENGTHS.map((l) => (
                                            <button
                                                key={l.id}
                                                onClick={() => onLengthChange(l.id)}
                                                className={`flex-1 py-1.5 px-1 rounded-[12px] text-[12px] font-black transition-all flex items-center justify-center gap-1.5 relative border-2 ${length === l.id
                                                    ? 'bg-[#9B8FD4] text-black border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-[1px]'
                                                    : 'text-black/40 hover:text-black hover:bg-white border-transparent'
                                                    }`}
                                            >
                                                <span>{l.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* X Constraint */}
                            {isX && (
                                <section className="animate-in fade-in duration-500">
                                    <h3 className="text-[10px] font-black text-black/30 uppercase tracking-widest mb-2 px-1">制限設定</h3>
                                    <button
                                        onClick={() => onXConstraint140Change(!xConstraint140)}
                                        className={`w-full p-2 rounded-[16px] border-[2px] transition-all flex items-center justify-between group shadow-sm
                                            ${xConstraint140 ? 'bg-black border-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white border-black/10 text-black/40 hover:border-black/30'}`}
                                    >
                                        <span className="text-[10px] font-black ml-2 uppercase tracking-widest">140文字制限（X）</span>
                                        <div className={`w-4 h-4 rounded-full transition-all flex items-center justify-center mr-1 ${xConstraint140 ? 'bg-[#E88BA3]' : 'bg-black/10'}`}>
                                            {xConstraint140 && <div className="w-2 h-2 rounded-full bg-black animate-pulse" />}
                                        </div>
                                    </button>
                                </section>
                            )}

                            {/* Style Options (Emoji/Symbol) */}
                            {!isGoogleMaps && (
                                <section className="animate-in fade-in duration-500 delay-150">
                                    <div className={`flex flex-row items-center gap-2 bg-white px-3 py-2 rounded-[20px] border-[2px] border-black/10 shadow-sm ${activePresetId ? 'opacity-50' : ''}`}>
                                        <div className="flex-1 flex items-center justify-between px-2">
                                            <span className="text-[10px] font-black text-black uppercase tracking-widest leading-none">絵文字</span>
                                            <button
                                                onClick={() => onIncludeEmojisChange(!includeEmojis)}
                                                disabled={!!activePresetId}
                                                className={`relative inline-flex h-4 w-7 items-center rounded-xl transition-all duration-300 ${activePresetId ? 'cursor-not-allowed' : ''} ${includeEmojis ? 'bg-[#4DB39A]' : 'bg-black/10'}`}
                                            >
                                                <span className={`inline-block h-3 w-3 transform rounded-xl bg-white transition-transform duration-300 ${includeEmojis ? 'translate-x-3.5' : 'translate-x-0.5'} shadow-sm`} />
                                            </button>
                                        </div>
                                        <div className="w-px h-5 bg-black/10" />
                                        <div className="flex-1 flex items-center justify-between px-2">
                                            <span className="text-[10px] font-black text-black uppercase tracking-widest leading-none">特殊文字</span>
                                            <button
                                                onClick={() => onIncludeSymbolsChange(!includeSymbols)}
                                                disabled={!!activePresetId}
                                                className={`relative inline-flex h-4 w-7 items-center rounded-xl transition-all duration-300 ${activePresetId ? 'cursor-not-allowed' : ''} ${includeSymbols ? 'bg-[#4DB39A]' : 'bg-black/10'}`}
                                            >
                                                <span className={`inline-block h-3 w-3 transform rounded-xl bg-white transition-transform duration-300 ${includeSymbols ? 'translate-x-3.5' : 'translate-x-0.5'} shadow-sm`} />
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>

                    {/* ROW 2: Google Maps Specific (Rating & Purpose) */}
                    {isGoogleMaps && (
                        <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                            {/* Rating (Left Column) */}
                            <div className="flex-1 w-full lg:w-1/2 flex flex-col gap-4">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-xs font-black text-black uppercase tracking-[0.25em]">星評価</h3>
                                    {starRating !== null && (
                                        <button
                                            onClick={() => onStarRatingChange(null)}
                                            className="text-[10px] font-black text-black/40 hover:text-black transition-colors underline uppercase tracking-widest"
                                        >
                                            リセット
                                        </button>
                                    )}
                                </div>
                                <div className="section-card rounded-[32px] p-8 border-black flex items-center justify-center">
                                    <div className="flex flex-row gap-4">
                                        {[1, 2, 3, 4, 5].map((r) => (
                                            <button
                                                key={r}
                                                onClick={() => onStarRatingChange(r)}
                                                className={`text-3xl transition-all hover:scale-110 active:scale-95 p-1 ${starRating && r <= starRating ? 'text-[#F5CC6D] drop-shadow-sm' : 'text-black/10 hover:text-black/20'}`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Purpose (Right Column) */}
                            <div className="flex-1 w-full lg:w-1/2 flex flex-col gap-4 relative">
                                <h3 className="text-xs font-black text-black uppercase tracking-[0.25em] px-2">返信の目的</h3>
                                <div className="section-card flex items-center justify-center h-full relative overflow-hidden group rounded-[32px] border-black p-3">
                                    <div className={`grid grid-cols-2 gap-3 w-full transition-all duration-500 ${starRating !== null ? 'blur-[2px] opacity-40' : ''}`}>
                                        {GMAP_PURPOSES.map((p) => {
                                            const isSelected = gmapPurpose === p.id;
                                            return (
                                                <button
                                                    key={p.id}
                                                    onClick={() => onGmapPurposeChange(p.id as GoogleMapPurpose)}
                                                    disabled={starRating !== null}
                                                    className={`px-3 py-2.5 rounded-[16px] text-[11px] font-black transition-all flex items-center justify-center gap-1.5 border
                                                            ${isSelected
                                                            ? 'active-pop'
                                                            : 'text-black/40 border-black/10 hover:text-black hover:bg-black/5'}`}
                                                >
                                                    <span className={`flex items-center justify-center ${isSelected ? 'opacity-100' : 'opacity-40'}`}>{p.icon}</span>
                                                    <span>{p.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Lock Overlay */}
                                    {starRating !== null && (
                                        <div className="absolute inset-0 flex items-center justify-center z-20 animate-in fade-in zoom-in-95 duration-300">
                                            <div className="bg-black text-white px-5 py-2.5 rounded-xl shadow-[4px_4px_0px_0px_#F5CC6D] flex items-center gap-2.5 transform scale-100 border-2 border-white">
                                                <AutoSparklesIcon className="w-4 h-4 text-[#F5CC6D]" />
                                                <span className="text-[11px] font-black tracking-widest whitespace-nowrap">自動判定モード固定</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Input Canvas */}
                <div className="flex-1 flex flex-col gap-4 order-2 min-w-0">
                    <div className="flex items-center gap-2 px-4 translate-y-2 relative z-20">
                        <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[11px] font-black">4</span>
                        <h3 className="text-xs font-black text-black/60 uppercase tracking-widest">本文を入力する</h3>
                    </div>
                    <div className="section-card rounded-[48px] lg:rounded-[64px] p-8 lg:p-14 border-black flex flex-col group transition-all relative isolate min-h-[200px] sm:min-h-[300px] lg:min-h-[400px]">

                        {/* Subtle background color for canvas */}
                        <div className="absolute inset-0 bg-white/50 rounded-[45px] lg:rounded-[61px] -z-10" />

                        {/* Main Text Area */}
                        <div className="relative z-10 min-h-[120px]">
                            <AutoResizingTextarea
                                ref={textareaRef}
                                value={inputText}
                                onChange={(e) => onInputTextChange(e.target.value)}
                                onFocus={(e) => {
                                    setTimeout(() => {
                                        e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }, 100);
                                }}
                                placeholder="投稿したい内容や伝えたいことを自由に入力してください..."
                                className="w-full h-full bg-transparent text-black text-lg font-bold leading-relaxed placeholder:text-black/10 focus:outline-none resize-none"
                            />
                        </div>

                        {/* Canvas Footer */}
                        <div className="mt-10 pt-8 border-t-2 border-black/5 relative z-10">
                            {/* Additional Instructions Indicator / Field */}
                            {!isPromptExpanded ? (
                                <button
                                    onClick={() => setIsPromptExpanded(true)}
                                    className="flex items-center gap-3 py-2 px-1 text-black/40 hover:text-black transition-colors group mb-4"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <AutoSparklesIcon className="w-4 h-4 text-black/40" />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-wider">AIへの追加指示（任意）</span>
                                </button>
                            ) : (
                                <div className="flex items-center gap-3 bg-[#4DB39A]/10 border-[3px] border-[#4DB39A] rounded-2xl pl-5 pr-2 py-2 mb-4 animate-in zoom-in-95 duration-200">
                                    <AutoSparklesIcon className="w-4 h-4 text-black shrink-0" />
                                    <input
                                        type="text"
                                        value={customPrompt}
                                        onChange={(e) => onCustomPromptChange(e.target.value)}
                                        placeholder="例：絵文字多めで、テンション高めに..."
                                        className="flex-1 bg-transparent border-none focus:outline-none text-[13px] font-bold text-black placeholder:text-black/20"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => {
                                            onCustomPromptChange("");
                                            setIsPromptExpanded(false);
                                        }}
                                        className="w-8 h-8 flex items-center justify-center text-black/40 hover:text-black hover:bg-black/5 rounded-xl transition-all"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <div className="text-[10px] font-black text-black/40 tracking-[0.3em] uppercase flex items-center gap-4">
                                    <span className="bg-black/5 text-black/60 px-3 py-1 rounded-xl">{inputText.length} 文字</span>
                                </div>

                                {/* Tools: Clear & Voice */}
                                <div className="flex items-center gap-2">
                                    {/* Clear Button */}
                                    <button
                                        onClick={handleClear}
                                        disabled={!inputText}
                                        className="p-2 rounded-xl text-black/40 hover:text-black hover:bg-black/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed group/clear"
                                        title="入力をクリア"
                                    >
                                        <EraserIcon className="w-5 h-5" />
                                    </button>

                                    {/* Voice Input Button */}
                                    <button
                                        onClick={toggleVoiceInput}
                                        className={`p-2 rounded-xl transition-all flex items-center gap-2 relative ${isListening
                                            ? 'bg-[#4DB39A] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-[2px] border-black pr-4'
                                            : 'text-black/40 hover:text-black hover:bg-black/5'
                                            }`}
                                        title={isListening ? '音声入力を停止' : '音声入力'}
                                    >
                                        {isListening ? (
                                            <>
                                                <div className="relative w-5 h-5 flex items-center justify-center">
                                                    <MicIcon className="w-5 h-5 relative z-10" />
                                                    <div className="absolute inset-0 bg-[#4DB39A] rounded-xl animate-ping opacity-75"></div>
                                                </div>
                                                <div className="flex items-center gap-0.5 h-3 ml-1">
                                                    <div className="w-0.5 bg-black rounded-xl h-full animate-[music-bar_0.5s_ease-in-out_infinite]"></div>
                                                    <div className="w-0.5 bg-black rounded-xl h-2/3 animate-[music-bar_0.5s_ease-in-out_0.1s_infinite]"></div>
                                                    <div className="w-0.5 bg-black rounded-xl h-full animate-[music-bar_0.5s_ease-in-out_0.2s_infinite]"></div>
                                                    <div className="w-0.5 bg-black rounded-xl h-1/2 animate-[music-bar_0.5s_ease-in-out_0.3s_infinite]"></div>
                                                </div>
                                            </>
                                        ) : (
                                            <MicIcon className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
