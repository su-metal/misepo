import React from 'react';
import { PostPurpose, GoogleMapPurpose, Tone, Length, Platform, Preset, UserPlan } from '../../../types';
import { AutoResizingTextarea } from './AutoResizingTextarea';
import {
    MegaphoneIcon, BookOpenIcon, LightbulbIcon, ChatHeartIcon,
    AutoSparklesIcon, HandHeartIcon, ApologyIcon, InfoIcon, SparklesIcon,
    StarIcon, ChevronDownIcon
} from '../../Icons';

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
    isGenerating: boolean;
    onGenerate: () => void;
    generateButtonRef?: React.RefObject<HTMLButtonElement>;
    plan: UserPlan;
    presets: Preset[];
    activePresetId: string | null;
    onApplyPreset: (preset: Preset) => void;
    onOpenPresetModal: () => void;
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
    isGenerating,
    onGenerate,
    generateButtonRef,
    plan,
    presets,
    activePresetId,
    onApplyPreset,
    onOpenPresetModal
}) => {
    const [show140LimitToggle, setShow140LimitToggle] = React.useState(true);
    const [showCustomPrompt, setShowCustomPrompt] = React.useState(false);

    const isGoogleMaps = platform === Platform.GoogleMaps;
    const isX = platform === Platform.X;

    // Default to Auto if previously selected something that doesn't exist or just initialization
    React.useEffect(() => {
        if (!isGoogleMaps && !Object.values(PostPurpose).includes(postPurpose)) {
            onPostPurposeChange(PostPurpose.Auto);
        }
    }, [isGoogleMaps, postPurpose, onPostPurposeChange]);


    return (
        <div className="flex flex-col h-auto lg:h-[800px] bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF]">
            {/* Platform Tabs & Multi-gen Toggle - Glassmorphism Header */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-2 px-6 pt-6 pb-2">
                <div className="flex items-stretch flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <button
                        onClick={() => onSetActivePlatform(Platform.X)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-all relative group
                            ${platforms.includes(Platform.X)
                                ? 'bg-white text-gray-900 border-t-2 border-gray-900'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50 bg-gray-50/50'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                            </svg>
                            <span>X (Twitter)</span>
                        </div>
                    </button>
                    <div className="w-[1px] bg-gray-100 my-2" />
                    <button
                        onClick={() => onSetActivePlatform(Platform.Instagram)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-all relative group
                            ${platforms.includes(Platform.Instagram)
                                ? 'bg-white text-pink-600 border-t-2 border-pink-500'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50 bg-gray-50/50'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                            </svg>
                            <span>Instagram</span>
                        </div>
                    </button>
                    <div className="w-[1px] bg-gray-100 my-2" />
                    <button
                        onClick={() => onSetActivePlatform(Platform.GoogleMaps)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-all relative group
                            ${platforms.includes(Platform.GoogleMaps)
                                ? 'bg-white text-emerald-600 border-t-2 border-emerald-500'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50 bg-gray-50/50'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                            <span>Google Maps</span>
                        </div>
                    </button>
                    <div className="w-[1px] bg-gray-100 my-2" />
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-3 py-2 px-4 lg:py-0 bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm min-h-[56px]">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Simultaneous</span>
                    <button
                        onClick={onToggleMultiGen}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${isMultiGen
                            ? 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)]'
                            : 'bg-gray-200 shadow-inner'
                            }`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm duration-300 ${isMultiGen ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                    </button>
                    <span className={`text-xs font-black transition-colors ${isMultiGen ? 'text-indigo-600' : 'text-gray-300'}`}>
                        {isMultiGen ? 'ON' : 'OFF'}
                    </span>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row flex-1 gap-6 p-6 lg:overflow-hidden">

                {/* Left Control Panel */}
                <div className="w-full lg:w-[320px] order-2 lg:order-1 flex flex-col gap-6 shrink-0 lg:overflow-y-auto px-1 lg:pr-2 scrollbar-hide py-2">



                    {/* Persona / Preset Selection (Card Grid) */}
                    <div>
                        <div className="flex items-center justify-between mb-3 px-1">
                            <div className="flex items-center gap-1.5 group/hint relative">
                                <h3 className="text-sm font-bold text-gray-500">投稿者プロフィール</h3>
                                <div className="text-gray-300 hover:text-indigo-400 cursor-help transition-colors">
                                    <InfoIcon />
                                </div>

                                {/* Discovery Tooltip */}
                                <div className="absolute left-0 bottom-full mb-2 w-64 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-indigo-50 opacity-0 invisible group-hover/hint:opacity-100 group-hover/hint:visible transition-all duration-300 z-50 pointer-events-none translate-y-1 group-hover/hint:translate-y-0">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="p-1 bg-indigo-50 rounded-lg">
                                            <SparklesIcon className="w-3.5 h-3.5 text-indigo-500" />
                                        </div>
                                        <span className="text-[11px] font-black text-indigo-600 uppercase tracking-tighter">パーソナライズ機能</span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                                        プロフィールを設定し、過去の投稿を学習させることで、あなたの店に最適な文体をAIが自動的に再現します。
                                    </p>

                                    {/* Tooltip Arrow */}
                                    <div className="absolute left-6 top-full -mt-1 border-[6px] border-transparent border-t-white/95" />
                                </div>
                            </div>
                            <button onClick={onOpenPresetModal} className="text-[10px] text-indigo-500 font-bold hover:text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-md transition-colors">
                                管理
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {presets.slice(0, 4).map((preset) => (
                                <button
                                    key={preset.id}
                                    onClick={() => onApplyPreset(preset)}
                                    className={`
                                            relative py-3.5 px-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1.5 group shadow-sm
                                            ${activePresetId === preset.id
                                            ? 'bg-gradient-to-br from-indigo-50 to-white border-indigo-200 text-indigo-700 shadow-md scale-[1.02] ring-1 ring-indigo-200'
                                            : 'bg-white border-transparent text-gray-400 hover:border-gray-200 hover:text-gray-600 hover:shadow-md'}
                                        `}
                                >
                                    <span className={`text-2xl transition-transform duration-300 ${activePresetId === preset.id ? 'scale-110 drop-shadow-sm' : 'group-hover:scale-110'}`}>
                                        {preset.avatar || "👤"}
                                    </span>
                                    <span className={`text-[11px] font-bold text-center leading-tight line-clamp-2 px-1 ${activePresetId === preset.id ? 'text-indigo-700' : ''}`}>
                                        {preset.name}
                                    </span>

                                    {/* Selection Indicator */}
                                    {activePresetId === preset.id && (
                                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500 shadow-sm" />
                                    )}
                                </button>
                            ))}

                            {/* Add Button Card: Visible up to 4 total items (Presets + Add) */}
                            {presets.length < 4 && (
                                <button
                                    onClick={onOpenPresetModal}
                                    className="relative py-3.5 px-3 rounded-2xl border-2 border-dashed border-gray-100 bg-white/50 text-gray-300 hover:bg-white hover:border-indigo-300 hover:text-indigo-400 transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm active:scale-95"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest px-1">追加</span>
                                </button>
                            )}
                        </div>
                    </div>



                    {/* Star Rating - GMAP Only */}
                    {isGoogleMaps && (
                        <div>
                            <div className="flex justify-between items-center mb-3 px-2">
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">星評価</h3>
                                {starRating && <button onClick={() => onStarRatingChange(null)} className="text-[10px] text-gray-400 hover:text-gray-600">クリア</button>}
                            </div>
                            <div className="flex gap-1 justify-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100/50">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <button
                                        key={rating}
                                        onClick={() => onStarRatingChange(rating)}
                                        className={`text-2xl transition-all hover:scale-110 active:scale-95 ${starRating && rating <= starRating ? 'text-[#FCD34D] drop-shadow-sm' : 'text-gray-100'}`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- BASIC SETTINGS (Manual Control Zone - Upper) --- */}

                    {/* Length Selection (Segmented Control) - Always Visible */}
                    {!isX && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-500 mb-3 px-1">文章の長さ</h3>
                            <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
                                {LENGTHS.map((l) => (
                                    <button
                                        key={l.id}
                                        onClick={() => onLengthChange(l.id)}
                                        className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${length === l.id
                                            ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100'
                                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {l.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}



                    {/* --- STYLE SETTINGS (AI-Managed / Persona Zone - Lower) --- */}

                    {/* Tone Selection (Segmented Control) - Always Visible (Locked by Profile) */}
                    <div className={`${activePresetId ? 'opacity-60' : ''} transition-opacity duration-300`}>
                        <div className="flex items-center justify-between mb-3 px-1">
                            <h3 className="text-sm font-bold text-gray-500">スタイル設定</h3>
                            {activePresetId && (
                                <div className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 rounded-full border border-indigo-100/50">
                                    <SparklesIcon className="w-2.5 h-2.5 text-indigo-500" />
                                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-tighter">Profile Active</span>
                                </div>
                            )}
                        </div>
                        <div className={`flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm relative isolate ${activePresetId ? 'cursor-not-allowed select-none' : ''}`}>
                            {activePresetId && (
                                <div
                                    className="absolute inset-0 z-20"
                                    title="プロフィールの文体学習を使用中のため、トーン設定は固定されています"
                                />
                            )}
                            {TONES.map((t) => (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => !activePresetId && onToneChange(t.id)}
                                    disabled={!!activePresetId}
                                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all relative z-10 ${tone === t.id
                                        ? (activePresetId
                                            ? 'bg-stone-100 text-stone-500 border border-stone-200 shadow-none'
                                            : 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100') // Active
                                        : (activePresetId ? 'text-stone-300' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50') // Inactive
                                        }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Decoration Options (Advanced Mode Only, Locked by Profile) */}

                    <div className={`${activePresetId ? 'opacity-60' : ''} transition-opacity duration-300`}>
                        <div className="flex items-center justify-between px-2 mb-3">
                            <h3 className="text-sm font-bold text-gray-500">装飾オプション</h3>
                            {activePresetId && (
                                <div className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 rounded-full border border-indigo-100/50">
                                    <SparklesIcon className="w-2.5 h-2.5 text-indigo-500" />
                                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-tighter">Profile Active</span>
                                </div>
                            )}
                        </div>
                        <div className={`grid grid-cols-2 gap-3 relative isolate ${activePresetId ? 'cursor-not-allowed select-none' : ''}`}>
                            {activePresetId && (
                                <div
                                    className="absolute inset-0 z-20"
                                    title="プロフィールの文体学習を使用中のため、装飾設定は固定されています"
                                />
                            )}
                            <button
                                type="button"
                                onClick={() => !activePresetId && onIncludeEmojisChange(!includeEmojis)}
                                disabled={!!activePresetId}
                                className={`relative p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 aspect-[16/9] ${includeEmojis
                                    ? (activePresetId ? 'bg-stone-50 border-stone-100 text-stone-400' : 'bg-orange-50 border-orange-200 text-orange-600 shadow-sm')
                                    : 'bg-white border-transparent text-gray-400 hover:shadow-md'}`}
                            >
                                <span className={`text-xl ${activePresetId ? 'grayscale' : ''}`}>😊</span>
                                <span className="text-[10px] font-bold">絵文字</span>

                                {/* Toggle Switch Visual */}
                                <div className={`absolute top-2 right-2 w-6 h-3.5 rounded-full transition-colors ${includeEmojis ? (activePresetId ? 'bg-stone-200' : 'bg-orange-400') : 'bg-gray-200'}`}>
                                    <div className={`absolute top-0.5 left-0.5 w-2.5 h-2.5 bg-white rounded-full transition-transform ${includeEmojis ? 'translate-x-2.5' : ''}`} />
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => !activePresetId && onIncludeSymbolsChange(!includeSymbols)}
                                disabled={!!activePresetId}
                                className={`relative p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 aspect-[16/9] ${includeSymbols
                                    ? (activePresetId ? 'bg-stone-50 border-stone-100 text-stone-400' : 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm')
                                    : 'bg-white border-transparent text-gray-400 hover:shadow-md'}`}
                            >
                                <span className={`text-xl ${activePresetId ? 'grayscale' : ''}`}>✨</span>
                                <span className="text-[10px] font-bold">装飾・特殊文字</span>
                                {/* Toggle Switch Visual */}
                                <div className={`absolute top-2 right-2 w-6 h-3.5 rounded-full transition-colors ${includeSymbols ? (activePresetId ? 'bg-stone-200' : 'bg-indigo-400') : 'bg-gray-200'}`}>
                                    <div className={`absolute top-0.5 left-0.5 w-2.5 h-2.5 bg-white rounded-full transition-transform ${includeSymbols ? 'translate-x-2.5' : ''}`} />
                                </div>
                            </button>
                        </div>
                        {activePresetId && (
                            <p className="mt-2 px-1 text-[10px] text-stone-400 font-medium leading-relaxed">
                                ※ 絵文字や記号の使い方も学習データを優先します。
                            </p>
                        )}

                    </div>




                </div>

                {/* Right Main Canvas - Input Only */}
                <div className="flex-1 order-1 lg:order-2 flex flex-col h-full gap-4">
                    <div className="flex-1 bg-white rounded-3xl p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-white/50 relative overflow-hidden flex flex-col group transition-all hover:shadow-[0_25px_50px_-12px_rgba(79,70,229,0.1)]">

                        {/* Purpose Selection - Horizontal Pills */}
                        <div className="mb-6 pb-4 border-b border-gray-50/50">
                            <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-[10px] font-black text-indigo-400/80 uppercase tracking-widest pl-1">投稿の目的</h3>
                                <div className="h-[1px] flex-1 bg-gradient-to-r from-gray-100 to-transparent"></div>
                            </div>
                            <div className="flex flex-wrap gap-2 pb-2 -mx-1 px-1">
                                {(isGoogleMaps ? GMAP_PURPOSES : PURPOSES).map((p) => {
                                    const isSelected = (isGoogleMaps ? gmapPurpose : postPurpose) === p.id;
                                    const isLocked = isGoogleMaps && starRating && gmapPurpose !== p.id;

                                    return (
                                        <button
                                            key={p.id}
                                            onClick={() => !isLocked && (isGoogleMaps ? onGmapPurposeChange(p.id as GoogleMapPurpose) : onPostPurposeChange(p.id as PostPurpose))}
                                            disabled={isLocked}
                                            className={`
                                                flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border
                                                ${isSelected
                                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-100'
                                                    : 'bg-white border-gray-100 text-gray-400 hover:border-gray-300 hover:text-gray-600'
                                                }
                                                ${isLocked ? 'opacity-30 cursor-not-allowed' : ''}
                                            `}
                                        >
                                            <span className={`w-3.5 h-3.5 block [&>svg]:w-full [&>svg]:h-full ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                                                {p.icon}
                                            </span>
                                            {p.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Main Text Area - The "Canvas" */}
                        <div className="flex-1 relative">
                            <AutoResizingTextarea
                                value={inputText}
                                onChange={(e) => onInputTextChange(e.target.value)}
                                placeholder="今どうしてる？ 写真の説明や伝えたいことなどを自由に入力..."
                                className="w-full h-full bg-transparent text-gray-600 text-base lg:text-lg font-normal leading-relaxed placeholder:text-gray-300 focus:outline-none resize-none"
                            />
                        </div>

                        {/* Custom Prompt Toggle - Bottom Floating Pill */}
                        <div className="mt-4 pt-4 border-t border-gray-50 relative">
                            {!showCustomPrompt ? (
                                <button
                                    onClick={() => setShowCustomPrompt(true)}
                                    className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors py-2 px-1 group/prompt"
                                >
                                    <div className="p-1.5 rounded-full bg-gray-50 text-gray-400 group-hover/prompt:bg-indigo-50 group-hover/prompt:text-indigo-500 transition-colors">
                                        <SparklesIcon className="w-3.5 h-3.5" />
                                    </div>
                                    <span>AIへの指示を追加（任意）</span>
                                </button>
                            ) : (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 bg-indigo-50/30 p-1.5 pl-4 pr-1.5 rounded-2xl flex items-center gap-2 border border-indigo-100/50 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all">
                                    <SparklesIcon className="w-4 h-4 text-indigo-500 shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="例：絵文字多めで、テンション高く..."
                                        className="flex-1 bg-transparent border-none text-sm text-gray-800 placeholder:text-indigo-300 focus:ring-0 px-0 py-2"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => setShowCustomPrompt(false)}
                                        className="p-2 rounded-xl hover:bg-white/50 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Generate Button (Desktop) - Enhanced */}
                    <div className="hidden lg:block relative group">
                        <button
                            ref={generateButtonRef}
                            onClick={onGenerate}
                            disabled={isGenerating}
                            className={`relative w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${isGenerating
                                ? 'bg-white text-gray-400 cursor-not-allowed border border-gray-100'
                                : 'bg-black text-white hover:bg-gray-900 shadow-xl'
                                }`}
                        >
                            {isGenerating ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    生成中...
                                </>
                            ) : (
                                <>
                                    <SparklesIcon className="w-5 h-5 text-indigo-400" />
                                    <span>投稿を作成</span>
                                    <svg className="w-5 h-5 text-gray-500 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
};
