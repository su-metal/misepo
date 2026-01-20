import React from 'react';
import { PostPurpose, GoogleMapPurpose, Tone, Length, Platform, Preset, UserPlan } from '../../../types';
import { AutoResizingTextarea } from './AutoResizingTextarea';
import {
    MegaphoneIcon, BookOpenIcon, LightbulbIcon, ChatHeartIcon,
    AutoSparklesIcon, HandHeartIcon, ApologyIcon, InfoIcon, SparklesIcon,
    StarIcon, ChevronDownIcon,
    TieIcon, SneakersIcon, LaptopIcon, CookingIcon, CoffeeIcon,
    BuildingIcon, LeafIcon, GemIcon,
    MicIcon, MicOffIcon, EraserIcon,
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

    // Force Auto Purpose when Rating is selected
    React.useEffect(() => {
        if (isGoogleMaps && starRating !== null && gmapPurpose !== GoogleMapPurpose.Auto) {
            onGmapPurposeChange(GoogleMapPurpose.Auto);
        }
    }, [isGoogleMaps, starRating, gmapPurpose, onGmapPurposeChange]);

    return (
        <div className="flex flex-col">
            {/* Platform Tabs & Multi-gen Toggle - Glass Style */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 px-3 sm:px-6 pb-4">
                <div className="flex items-stretch flex-1 px-4 py-2 gap-1 glass-panel rounded-full border border-white/40 shadow-sm">
                    <button
                        onClick={() => onSetActivePlatform(Platform.X)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-xs sm:text-sm font-black transition-all relative
                            ${platforms.includes(Platform.X)
                                ? 'bg-primary text-white shadow-lg shadow-indigo-500/30'
                                : 'text-slate-400 hover:text-primary hover:bg-white/30'
                            }`}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                        </svg>
                        <span>X (Twitter)</span>
                    </button>
                    <button
                        onClick={() => onSetActivePlatform(Platform.Instagram)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-xs sm:text-sm font-black transition-all relative
                            ${platforms.includes(Platform.Instagram)
                                ? 'bg-primary text-white shadow-lg shadow-indigo-500/30'
                                : 'text-slate-400 hover:text-primary hover:bg-white/30'
                            }`}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                        </svg>
                        <span>Instagram</span>
                    </button>
                    <button
                        onClick={() => onSetActivePlatform(Platform.GoogleMaps)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-xs sm:text-sm font-black transition-all relative
                            ${platforms.includes(Platform.GoogleMaps)
                                ? 'bg-primary text-white shadow-lg shadow-indigo-500/30'
                                : 'text-slate-400 hover:text-primary hover:bg-white/30'
                            }`}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        <span>Google Maps</span>
                    </button>
                </div>

                <div className="flex items-center gap-3 px-5 py-2.5 glass-panel rounded-full border border-white/40 shadow-sm">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] leading-none">同時生成</span>
                    <button
                        onClick={onToggleMultiGen}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${isMultiGen ? 'bg-accent' : 'bg-slate-200'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${isMultiGen ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 gap-8 px-3 sm:px-6 sm:py-6 py-2">

                {/* Content Rows Container (Order 1) */}
                <div className="w-full shrink-0 flex flex-col gap-6 order-1">

                    {/* ROW 1: Profiles & Style Settings */}
                    <div className="flex flex-col lg:flex-row gap-6 lg:items-stretch">

                        {/* LEFT COL: Profiles */}
                        <div className="glass-panel p-5 rounded-[32px] border border-white/40 shadow-sm flex flex-col gap-4 h-full flex-1">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-xs font-black text-primary uppercase tracking-[0.25em]">Profiles</h3>
                                <button onClick={onOpenPresetModal} className="text-[10px] font-black text-accent hover:underline uppercase tracking-widest">Manage</button>
                            </div>
                            <div className="grid grid-cols-2 gap-3 md:gap-4 w-full flex-1 h-full auto-rows-fr">
                                {/* Plain AI Option */}
                                <button
                                    onClick={() => onApplyPreset({ id: 'plain-ai' } as any)}
                                    className={`group relative py-5 px-3 rounded-[24px] transition-all duration-300 flex flex-col items-center justify-center gap-2
                                                ${!activePresetId
                                            ? 'bg-primary text-white shadow-lg shadow-[#001738]/20 ring-2 ring-[#001738]/5 ring-offset-2'
                                            : 'bg-slate-50 shadow-sm hover:bg-slate-100 text-slate-400 hover:text-slate-600 border border-slate-200 hover:border-slate-300'}
                                            `}
                                >
                                    <span className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${!activePresetId ? 'opacity-100' : 'opacity-60 grayscale group-hover:grayscale-0'}`}>
                                        <AutoSparklesIcon className="w-6 h-6" />
                                    </span>
                                    <span className={`text-[11px] font-bold truncate tracking-wide text-center w-full ${!activePresetId ? 'opacity-100' : 'text-slate-500'}`}>おまかせ</span>
                                </button>

                                {/* Profiles Grid */}
                                {presets.map((p) => {
                                    const isSelected = activePresetId === p.id;
                                    return (
                                        <button
                                            key={p.id}
                                            onClick={() => onApplyPreset(p)}
                                            className={`group relative py-5 px-3 rounded-[24px] transition-all duration-300 flex flex-col items-center justify-center gap-2
                                                        ${isSelected
                                                    ? 'bg-primary text-white shadow-lg shadow-[#001738]/20 ring-2 ring-[#001738]/5 ring-offset-2'
                                                    : 'bg-slate-50 shadow-sm hover:bg-slate-100 text-slate-400 hover:text-slate-600 border border-slate-200 hover:border-slate-300'}
                                                    `}
                                        >
                                            <span className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${isSelected ? 'opacity-100' : 'opacity-60 grayscale group-hover:grayscale-0'}`}>
                                                {renderAvatar(p.avatar, "w-6 h-6")}
                                            </span>
                                            <span className={`text-[11px] font-bold truncate tracking-wide text-center w-full ${isSelected ? 'opacity-100' : 'opacity-60'}`}>
                                                {p.name}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* RIGHT COL: Style Settings (Tone, Length, X Limit, Emojis) */}
                        <div className="glass-panel p-5 rounded-[32px] border border-white/40 shadow-sm flex flex-col gap-5 h-full flex-1">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-xs font-black text-primary uppercase tracking-[0.25em]">Style</h3>
                            </div>
                            {/* Tone Selection */}
                            <section>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Tone</h3>
                                <div className={`flex flex-row gap-1.5 bg-slate-100 p-1 rounded-[16px] border border-slate-200 ${activePresetId ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    {TONES.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => onToneChange(t.id)}
                                            disabled={!!activePresetId}
                                            className={`flex-1 py-2 px-1 rounded-[12px] text-[10px] font-black transition-all flex items-center justify-center gap-1.5 relative ${tone === t.id
                                                ? 'bg-primary text-white shadow-lg shadow-navy-900/20'
                                                : 'text-slate-400 hover:text-slate-600 hover:bg-white'
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
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Length</h3>
                                    <div className="flex flex-row gap-1.5 bg-slate-100 p-1 rounded-[16px] border border-slate-200">
                                        {LENGTHS.map((l) => (
                                            <button
                                                key={l.id}
                                                onClick={() => onLengthChange(l.id)}
                                                className={`flex-1 py-2 px-1 rounded-[12px] text-[10px] font-black transition-all flex items-center justify-center gap-1.5 relative ${length === l.id
                                                    ? 'bg-primary text-white shadow-lg shadow-navy-900/20'
                                                    : 'text-slate-400 hover:text-slate-600 hover:bg-white'
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
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Limit</h3>
                                    <button
                                        onClick={() => onXConstraint140Change(!xConstraint140)}
                                        className={`w-full p-2 rounded-[16px] border transition-all flex items-center justify-between group shadow-sm
                                            ${xConstraint140 ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200/50' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}`}
                                    >
                                        <span className="text-[10px] font-black ml-2">140文字</span>
                                        <div className={`w-4 h-4 rounded-full transition-all flex items-center justify-center mr-1 ${xConstraint140 ? 'bg-indigo-500' : 'bg-slate-100'}`}>
                                            {xConstraint140 && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                                        </div>
                                    </button>
                                </section>
                            )}

                            {/* Style Options (Emoji/Symbol) */}
                            {!isGoogleMaps && (
                                <section className="animate-in fade-in duration-500 delay-150">
                                    <div className={`flex flex-row items-center gap-2 bg-white px-3 py-2 rounded-[20px] border border-slate-100 shadow-sm ${activePresetId ? 'opacity-50' : ''}`}>
                                        <div className="flex-1 flex items-center justify-between px-2">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">絵文字</span>
                                            <button
                                                onClick={() => onIncludeEmojisChange(!includeEmojis)}
                                                disabled={!!activePresetId}
                                                className={`relative inline-flex h-4 w-7 items-center rounded-full transition-all duration-300 ${activePresetId ? 'cursor-not-allowed' : ''} ${includeEmojis ? 'bg-accent' : 'bg-slate-200'}`}
                                            >
                                                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${includeEmojis ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                                            </button>
                                        </div>
                                        <div className="w-px h-5 bg-slate-100" />
                                        <div className="flex-1 flex items-center justify-between px-2">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">特殊文字</span>
                                            <button
                                                onClick={() => onIncludeSymbolsChange(!includeSymbols)}
                                                disabled={!!activePresetId}
                                                className={`relative inline-flex h-4 w-7 items-center rounded-full transition-all duration-300 ${activePresetId ? 'cursor-not-allowed' : ''} ${includeSymbols ? 'bg-accent' : 'bg-slate-200'}`}
                                            >
                                                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${includeSymbols ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
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
                                    <h3 className="text-xs font-black text-primary uppercase tracking-[0.25em]">星評価</h3>
                                    {starRating !== null && (
                                        <button
                                            onClick={() => onStarRatingChange(null)}
                                            className="text-[10px] font-black text-slate-400 hover:text-accent transition-colors underline uppercase tracking-widest"
                                        >
                                            リセット
                                        </button>
                                    )}
                                </div>
                                <div className="glass-panel rounded-[24px] p-8 flex items-center justify-center">
                                    <div className="flex flex-row gap-4">
                                        {[1, 2, 3, 4, 5].map((r) => (
                                            <button
                                                key={r}
                                                onClick={() => onStarRatingChange(r)}
                                                className={`text-3xl transition-all hover:scale-110 active:scale-95 p-1 ${starRating && r <= starRating ? 'text-[#FCD34D] drop-shadow-sm' : 'text-slate-200 hover:text-slate-300'}`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Purpose (Right Column) */}
                            <div className="flex-1 w-full lg:w-1/2 flex flex-col gap-4 relative">
                                <h3 className="text-xs font-black text-primary uppercase tracking-[0.25em] px-2">返信の目的</h3>
                                <div className="glass-panel flex items-center justify-center h-full relative overflow-hidden group rounded-[24px] p-3">
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
                                                            ? 'bg-primary text-white border-primary shadow-lg shadow-indigo-500/20'
                                                            : 'text-slate-500 border-slate-200 hover:text-slate-700 hover:bg-slate-50'}`}
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
                                            <div className="bg-[#130c0a] text-white px-5 py-2.5 rounded-full shadow-xl shadow-indigo-200 flex items-center gap-2.5 transform scale-100 border border-white/20">
                                                <AutoSparklesIcon className="w-4 h-4" />
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
                <div className="flex-1 flex flex-col gap-8 order-2 min-w-0">
                    <div className="glass-panel bg-white/40 rounded-[40px] lg:rounded-[48px] p-8 lg:p-14 border-2 border-white/60 flex flex-col group transition-all hover:border-primary/30 shadow-2xl shadow-indigo-900/10 relative isolate min-h-[400px]">

                        {/* Shimmer effect for focus */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />


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
                                className="w-full h-full bg-transparent text-primary text-lg font-bold leading-relaxed placeholder:text-primary/20 focus:outline-none resize-none"
                            />
                        </div>

                        {/* Canvas Footer */}
                        <div className="mt-10 pt-8 border-t-2 border-primary/5 relative z-10">
                            {/* Additional Instructions Indicator / Field */}
                            {!isPromptExpanded ? (
                                <button
                                    onClick={() => setIsPromptExpanded(true)}
                                    className="flex items-center gap-3 py-2 px-1 text-slate-500 hover:text-primary transition-colors group mb-4"
                                >
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <AutoSparklesIcon className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-wider">AIへの指示を追加（任意）</span>
                                </button>
                            ) : (
                                <div className="flex items-center gap-3 bg-slate-100 border-2 border-slate-200 rounded-full pl-5 pr-2 py-2 mb-4 animate-in zoom-in-95 duration-200">
                                    <AutoSparklesIcon className="w-4 h-4 text-primary shrink-0" />
                                    <input
                                        type="text"
                                        value={customPrompt}
                                        onChange={(e) => onCustomPromptChange(e.target.value)}
                                        placeholder="例：絵文字多めで、テンション高めに..."
                                        className="flex-1 bg-transparent border-none focus:outline-none text-[13px] font-bold text-primary placeholder:text-slate-400"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => {
                                            onCustomPromptChange("");
                                            setIsPromptExpanded(false);
                                        }}
                                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-slate-200 rounded-full transition-all"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <div className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase flex items-center gap-4">
                                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{inputText.length} CHARS</span>
                                </div>

                                {/* Tools: Clear & Voice */}
                                <div className="flex items-center gap-2">
                                    {/* Clear Button */}
                                    <button
                                        onClick={handleClear}
                                        disabled={!inputText}
                                        className="p-2 rounded-full text-slate-400 hover:text-primary hover:bg-slate-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed group/clear"
                                        title="入力をクリア"
                                    >
                                        <EraserIcon className="w-5 h-5" />
                                    </button>

                                    {/* Voice Input Button */}
                                    <button
                                        onClick={toggleVoiceInput}
                                        className={`p-2 rounded-full transition-all flex items-center gap-2 ${isListening
                                            ? 'bg-accent text-primary shadow-lg animate-pulse border border-accent/50'
                                            : 'text-slate-400 hover:text-primary hover:bg-slate-100'
                                            }`}
                                        title={isListening ? '音声入力を停止' : '音声入力'}
                                    >
                                        {isListening ? <MicOffIcon className="w-5 h-5" /> : <MicIcon className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA: Generate Button - CastMe Style High Performance - Hidden on Mobile */}
                    <button
                        ref={generateButtonRef}
                        onClick={onGenerate}
                        disabled={isGenerating || !inputText.trim()}
                        className={`hidden lg:flex w-full py-8 rounded-[32px] font-black text-2xl tracking-[0.3em] transition-all relative overflow-hidden shadow-2xl group flex-row items-center justify-center
                            ${isGenerating || !inputText.trim()
                                ? 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200'
                                : 'bg-gradient-to-r from-[#4F46E5] to-[#9333EA] text-white shadow-[0_8px_32px_rgba(79,70,229,0.35)] hover:shadow-[0_8px_40px_rgba(79,70,229,0.5)] active:scale-[0.98] border border-white/20'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-5 relative z-10">
                            {isGenerating ? (
                                <>
                                    <div className="w-8 h-8 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
                                    <span className="opacity-80">PROCESSING...</span>
                                </>
                            ) : (
                                <>
                                    <div className="relative">
                                        <SparklesIcon className="w-8 h-8 group-hover:rotate-12 transition-transform drop-shadow-sm" />
                                        <div className="absolute inset-0 bg-white/50 blur-lg animate-ping-slow opacity-50" />
                                    </div>
                                    <span className="drop-shadow-sm">GENERATE POST</span>
                                </>
                            )}
                        </div>
                    </button>

                    {/* Footnote */}
                    <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mt-8">
                        AI-Powered High Performance Content Generation
                    </p>
                </div>
            </div >
        </div >
    );
};
