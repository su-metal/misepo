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
    onStarRatingChange: (r: number) => void;
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
    { id: PostPurpose.Promotion, label: '宣伝・告知', icon: <MegaphoneIcon /> },
    { id: PostPurpose.Story, label: 'ストーリー・感想', icon: <BookOpenIcon /> },
    { id: PostPurpose.Educational, label: 'お役立ち情報', icon: <LightbulbIcon /> },
    { id: PostPurpose.Engagement, label: '問いかけ・交流', icon: <ChatHeartIcon /> },
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
    isGenerating,
    onGenerate,
    generateButtonRef,
    plan,
    presets,
    activePresetId,
    onApplyPreset,
    onOpenPresetModal
}) => {
    const [showEmojiToggle, setShowEmojiToggle] = React.useState(true);
    const [showPhoneticToggle, setShowPhoneticToggle] = React.useState(false);
    const [show140LimitToggle, setShow140LimitToggle] = React.useState(true);
    const [showAdvancedSettings, setShowAdvancedSettings] = React.useState(false);

    const isGoogleMaps = platform === Platform.GoogleMaps;
    const isX = platform === Platform.X;

    return (
        <div className="flex flex-col h-auto lg:h-[800px] bg-[#FBFCFE]">
            {/* Platform Tabs & Multi-gen Toggle */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-1 px-4 pt-4 pb-2 bg-gray-50/50">
                <div className="flex items-center gap-1 flex-1">
                    <button
                        onClick={() => onSetActivePlatform(Platform.X)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-t-xl text-sm font-bold transition-all relative ${platform === Platform.X
                            ? 'bg-white text-indigo-600 shadow-[0_-2px_10px_rgba(0,0,0,0.02)] z-10'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <span className="text-lg">𝕏</span>
                        <span>X (Twitter)</span>
                        {platform === Platform.X && <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#4f46e5] rounded-t-xl" />}
                    </button>
                    <button
                        onClick={() => onSetActivePlatform(Platform.Instagram)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-t-xl text-sm font-bold transition-all relative ${platform === Platform.Instagram
                            ? 'bg-white text-pink-600 shadow-[0_-2px_10px_rgba(0,0,0,0.02)] z-10'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                        </svg>
                        <span>Instagram</span>
                        {platform === Platform.Instagram && <div className="absolute top-0 left-0 right-0 h-0.5 bg-pink-500 rounded-t-xl" />}
                    </button>
                    <button
                        onClick={() => onSetActivePlatform(Platform.GoogleMaps)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-t-xl text-sm font-bold transition-all relative ${platform === Platform.GoogleMaps
                            ? 'bg-white text-green-600 shadow-[0_-2px_10px_rgba(0,0,0,0.02)] z-10'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        <span>Google Maps</span>
                        {platform === Platform.GoogleMaps && <div className="absolute top-0 left-0 right-0 h-0.5 bg-green-500 rounded-t-xl" />}
                    </button>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-2 py-2 lg:py-0 lg:ml-4 lg:pl-4 lg:border-l lg:border-gray-200">
                    <button
                        onClick={onToggleMultiGen}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isMultiGen ? 'bg-[#4f46e5]' : 'bg-gray-200'
                            }`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${isMultiGen ? 'translate-x-5' : 'translate-x-1'
                            }`} />
                    </button>
                    <div className="flex flex-col leading-none">
                        <span className="text-[9px] font-bold text-gray-400">同時生成</span>
                        <span className={`text-[10px] font-black ${isMultiGen ? 'text-[#4f46e5]' : 'text-gray-300'}`}>ON</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row flex-1 gap-8 p-6 lg:p-8 lg:overflow-hidden bg-gray-50/30">
                {/* Left Sidebar */}
                <div className="w-full lg:w-[400px] flex flex-col gap-6 shrink-0 lg:overflow-y-auto lg:pr-2 scrollbar-hide">

                    {/* Quick Sets (Common for X & Instagram) */}
                    {(platform === Platform.X || platform === Platform.Instagram) && (
                        <div>
                            <div className="flex items-center justify-between mb-3 px-1">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <SparklesIcon className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Quick Sets</span>
                                </div>
                                <button
                                    onClick={onOpenPresetModal}
                                    className="flex items-center gap-1.5 px-3 py-1 bg-[#FFF8E1] text-[#B78822] rounded-lg text-[10px] font-bold hover:bg-[#FFECQB] transition-colors"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                    Presets
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {presets.slice(0, 3).map((preset) => (
                                    <button
                                        key={preset.id}
                                        onClick={() => onApplyPreset(preset)}
                                        className={`
                                            bg-white rounded-[16px] px-3 py-4 flex items-center justify-center border transition-all relative group
                                            ${activePresetId === preset.id ? 'border-[#4f46e5] bg-[#4f46e5]/10' : 'border-gray-100 hover:border-[#4f46e5]/20 hover:shadow-sm'}
                                        `}
                                    >
                                        <span className={`text-[10px] font-bold whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-[#4f46e5] transition-colors ${activePresetId === preset.id ? 'text-[#4f46e5]' : 'text-gray-600'}`}>{preset.name}</span>
                                        {activePresetId === preset.id && (
                                            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#4f46e5]" />
                                        )}
                                    </button>
                                ))}
                                {presets.length === 0 && (
                                    <div className="col-span-3 text-center py-4 text-xs text-gray-400 bg-gray-50 rounded-[20px] border border-dashed border-gray-200">
                                        プリセットがありません
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Star Rating Selection - Google Maps Only */}
                    {isGoogleMaps && (
                        <div>
                            <div className="flex items-center justify-between mb-3 px-1">
                                <h3 className="text-xs font-bold text-gray-400">星評価 (1〜5選択で自動判定)</h3>
                                {starRating && (
                                    <button
                                        onClick={() => onStarRatingChange(null)}
                                        className="text-[10px] text-gray-500 hover:text-gray-700 font-medium transition-colors"
                                    >
                                        リセット
                                    </button>
                                )}
                            </div>
                            <div className="flex justify-center gap-2 mb-6">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <button
                                        key={rating}
                                        onClick={() => onStarRatingChange(rating)}
                                        className={`text-4xl transition-all hover:scale-110 ${starRating && rating <= starRating
                                            ? 'text-[#FCD34D] drop-shadow-sm'
                                            : 'text-gray-300 hover:text-gray-400'
                                            }`}
                                    >
                                        {starRating && rating <= starRating ? '★' : '☆'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Purpose Selection with Auto-Judgment Badge */}
                    <div className="relative">
                        {/* Auto-Judgment Mode Badge - Shows when star is selected */}
                        {isGoogleMaps && starRating && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                                <div className="bg-[#4f46e5] text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                                    <span className="text-xs">✦</span>
                                    <span>自動判定モード固定</span>
                                </div>
                            </div>
                        )}
                        <h3 className="text-xs font-bold text-gray-400 mb-3 px-1">投稿の目的</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {(isGoogleMaps ? GMAP_PURPOSES : PURPOSES).map((p) => {
                                const isLocked = isGoogleMaps && starRating && gmapPurpose !== p.id;
                                return (
                                    <button
                                        key={p.id}
                                        onClick={() => !isLocked && (isGoogleMaps ? onGmapPurposeChange(p.id as GoogleMapPurpose) : onPostPurposeChange(p.id as PostPurpose))}
                                        disabled={isLocked}
                                        className={`
                                            relative rounded-[24px] p-4 flex flex-col items-center justify-center gap-2 border transition-all aspect-[5/3]
                                            ${isLocked ? 'opacity-40 cursor-not-allowed' : ''}
                                            ${(isGoogleMaps ? gmapPurpose : postPurpose) === p.id
                                                ? 'bg-[#4f46e5] border-[#4f46e5] text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] ring-4 ring-[#4f46e5]/10'
                                                : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50 hover:border-gray-200'}
                                        `}
                                    >
                                        <div className={`p-2 rounded-full ${(isGoogleMaps ? gmapPurpose : postPurpose) === p.id ? 'bg-[#4f46e5]/30' : 'bg-gray-50'}`}>
                                            <div className={`w-5 h-5 ${(isGoogleMaps ? gmapPurpose : postPurpose) === p.id ? 'text-white' : 'text-gray-400'}`}>
                                                {p.icon}
                                            </div>
                                        </div>
                                        <span className="text-[11px] font-bold">{p.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tone Selection */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 mb-3 px-1">スタイル設定</h3>
                        <div className="space-y-4">
                            <div className="flex bg-white rounded-2xl p-1 border border-gray-100 shadow-sm">
                                {TONES.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => onToneChange(t.id)}
                                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${tone === t.id
                                            ? 'bg-[#4f46e5]/10 text-[#4f46e5]'
                                            : 'text-gray-400 hover:text-gray-600'
                                            }`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>

                            {/* Length Selection - Hidden for X */}
                            {!isX && (
                                <div className="flex bg-white rounded-2xl p-1 border border-gray-100 shadow-sm">
                                    {LENGTHS.map((l) => (
                                        <button
                                            key={l.id}
                                            onClick={() => onLengthChange(l.id)}
                                            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${length === l.id
                                                ? 'bg-yellow-50 text-yellow-700'
                                                : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                        >
                                            {l.id === length && <span className="mr-1.5 inline-block w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />}
                                            {l.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="space-y-3">
                        {/* Emoji & Decoration Toggles */}
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            {/* Emoji Card */}
                            <div className={`rounded-2xl p-4 border transition-colors flex flex-col justify-between h-[84px] ${showEmojiToggle ? 'bg-[#FFFBEB] border-[#FCD34D]' : 'bg-white border-gray-100'}`}>
                                <div className="flex items-center justify-between">
                                    <span className={`text-[13px] font-bold ${showEmojiToggle ? 'text-[#B45309]' : 'text-gray-400'}`}>絵文字</span>
                                    <button
                                        onClick={() => setShowEmojiToggle(!showEmojiToggle)}
                                        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${showEmojiToggle ? 'bg-[#F59E0B]' : 'bg-gray-200'}`}
                                    >
                                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${showEmojiToggle ? 'translate-x-5.5' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                                <div className="flex gap-1.5 opacity-80">
                                    <span>✨</span>
                                    <span>😋</span>
                                    <span>👍</span>
                                </div>
                            </div>

                            {/* Decoration Card */}
                            <div className={`rounded-2xl p-4 border transition-colors flex flex-col justify-between h-[84px] ${showPhoneticToggle ? 'bg-[#F8FAFC] border-indigo-200' : 'bg-white border-gray-100 shadow-sm shadow-gray-100/50'}`}>
                                <div className="flex items-center justify-between">
                                    <span className={`text-[13px] font-bold ${showPhoneticToggle ? 'text-[#4f46e5]' : 'text-gray-400'}`}>装飾記号</span>
                                    <button
                                        onClick={() => setShowPhoneticToggle(!showPhoneticToggle)}
                                        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${showPhoneticToggle ? 'bg-[#4f46e5]' : 'bg-gray-200'}`}
                                    >
                                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${showPhoneticToggle ? 'translate-x-5.5' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                                <div className="flex gap-1.5 opacity-60">
                                    <span>✦</span>
                                    <span>▷</span>
                                    <span>■</span>
                                </div>
                            </div>
                        </div>
                        {/* 140 Limit Card (Flat) */}
                        {platform === Platform.X && (
                            <div className="bg-[#F3F4F6] rounded-xl px-4 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-600 font-bold text-xs">
                                    <span>✕</span>
                                    <span>140文字制限</span>
                                </div>
                                <button
                                    onClick={() => setShow140LimitToggle(!show140LimitToggle)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${show140LimitToggle ? 'bg-black' : 'bg-gray-300'
                                        }`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${show140LimitToggle ? 'translate-x-6' : 'translate-x-1'
                                        }`} />
                                </button>
                            </div>
                        )}
                    </div>

                </div>

                {/* Right Main Area */}
                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex-1 min-h-[400px] bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
                        <h3 className="text-sm font-bold text-gray-700 mb-4">投稿したいトピック・内容</h3>
                        <AutoResizingTextarea
                            value={inputText}
                            onChange={(e) => onInputTextChange(e.target.value)}
                            placeholder="明日から秋 of 限定メニューを販売します。旬の食材を使った特別なコースをご用意しました。"
                            className="flex-1 w-full bg-transparent text-gray-800 text-base leading-relaxed placeholder:text-gray-400 focus:outline-none resize-none"
                        />
                    </div>

                    {/* Advanced Settings Accordion */}
                    <div className="rounded-3xl border border-[#FEF3C7] bg-[#FFFBEB]/30 overflow-hidden shrink-0">
                        <button
                            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                            className="w-full flex items-center justify-between p-5 cursor-pointer hover:bg-[#FFFBEB] transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#FCD34D] flex items-center justify-center text-white shadow-sm">
                                    <StarIcon fill="white" />
                                </div>
                                <span className="text-[13px] font-bold text-[#B45309]">詳細設定</span>
                            </div>
                            <ChevronDownIcon className={`w-5 h-5 text-[#B45309] transition-transform duration-300 ${showAdvancedSettings ? 'rotate-180' : ''}`} />
                        </button>

                        {showAdvancedSettings && (
                            <div className="p-5 pt-0 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[13px] font-bold text-[#D97706]/70 px-1">出力言語</label>
                                        <div className="relative">
                                            <select className="w-full bg-white border border-gray-100 rounded-2xl p-4 py-3.5 pr-10 text-sm font-bold text-gray-700 appearance-none focus:outline-none focus:border-[#FCD34D] transition-colors shadow-sm">
                                                <option>日本語</option>
                                                <option>English</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#FCD34D]">
                                                <ChevronDownIcon className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[13px] font-bold text-[#D97706]/70 px-1">AIへのカスタムプロンプト（任意）</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="例：絵文字多めで、テンション高く..."
                                                className="w-full bg-white border border-gray-100 rounded-2xl p-5 py-4 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[#FCD34D] transition-colors shadow-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Generate Button */}
                    <button
                        ref={generateButtonRef}
                        onClick={onGenerate}
                        disabled={isGenerating}
                        className={`hidden lg:block w-full py-4 rounded-2xl font-bold text-base transition-all duration-200 ${isGenerating
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
                            }`}
                    >
                        {isGenerating ? '生成中...' : '投稿を作成'}
                    </button>
                </div>
            </div>
        </div>
    );
};
