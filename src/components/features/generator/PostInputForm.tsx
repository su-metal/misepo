import React from 'react';
import { PostPurpose, GoogleMapPurpose, Tone, Length, Platform, Preset, UserPlan } from '../../../types';
import { AutoResizingTextarea } from './AutoResizingTextarea';
import { CompactPlatformSelector } from './CompactPlatformSelector';
import {
    MegaphoneIcon, BookOpenIcon, LightbulbIcon, ChatHeartIcon,
    AutoSparklesIcon, HandHeartIcon, ApologyIcon, InfoIcon, MagicWandIcon, SparklesIcon, EraserIcon, StarIcon
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
    { id: PostPurpose.Promotion, label: '宣伝', icon: <MegaphoneIcon /> },
    { id: PostPurpose.Story, label: '日記', icon: <BookOpenIcon /> },
    { id: PostPurpose.Educational, label: '豆知識', icon: <LightbulbIcon /> },
    { id: PostPurpose.Engagement, label: '募集', icon: <ChatHeartIcon /> },
];

const GMAP_PURPOSES = [
    { id: GoogleMapPurpose.Auto, label: '自動', icon: <AutoSparklesIcon /> },
    { id: GoogleMapPurpose.Thanks, label: 'お礼', icon: <HandHeartIcon /> },
    { id: GoogleMapPurpose.Apology, label: 'お詫び', icon: <ApologyIcon /> },
    { id: GoogleMapPurpose.Clarify, label: 'お知らせ', icon: <InfoIcon /> },
];

const TONES = [
    { id: Tone.Standard, label: '標準' },
    { id: Tone.Formal, label: '丁寧' },
    { id: Tone.Friendly, label: '親しみ' },
];

const LENGTHS = [
    { id: Length.Short, label: '短文' },
    { id: Length.Medium, label: '普通' },
    { id: Length.Long, label: '長文' },
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
    const isGoogleMaps = platform === Platform.GoogleMaps;

    return (
        <div className="flex flex-col min-h-[600px]">


            {/* Compact Platform Selector */}
            <CompactPlatformSelector
                platforms={platforms}
                activePlatform={activePlatform}
                isMultiGen={isMultiGen}
                onPlatformToggle={onPlatformToggle}
                onToggleMultiGen={onToggleMultiGen}
                onSetActivePlatform={onSetActivePlatform}
            />

            {/* Presets Library */}
            <div className="px-6 py-4 border-b border-stone-100">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-stone-400 uppercase tracking-[0.3em] mb-0.5">プリセットライブラリ</span>
                        <span className="text-[10px] font-bold text-stone-600 uppercase">クイック選択</span>
                    </div>
                    <button
                        onClick={onOpenPresetModal}
                        className="flex items-center gap-2 py-1.5 px-3 rounded-xl text-black transition-all shadow-sm group"
                        style={{ backgroundColor: 'rgba(202,253,0,0.1)' }}
                    >
                        <svg className="w-3 h-3 group-hover:rotate-12 transition-transform" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <span className="text-[9px] font-black tracking-[0.1em]">プリセット編集</span>
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-2 w-full">
                    {presets.slice(0, 3).map((ps) => {
                        const isActive = activePresetId === ps.id;
                        return (
                            <button
                                key={ps.id}
                                onClick={() => onApplyPreset(ps)}
                                className={`
                                    group relative overflow-hidden w-full px-2 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all duration-300
                                    ${isActive
                                        ? 'bg-black text-white border-black shadow-lg shadow-black/20'
                                        : 'bg-stone-50 text-stone-500 border border-stone-100 hover:border-stone-200 hover:text-stone-800'}`}
                            >
                                <span className="relative z-10 block truncate w-full text-center">{ps.name.toUpperCase()}</span>
                                {isActive && (
                                    <div className="absolute inset-0 bg-black"></div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content - Vertical Single Column Layout */}
            <div className="flex flex-col space-y-8 p-8">

                {/* Scene Module */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-3 bg-lime rounded-full"></div>
                        <span className="text-[10px] font-black tracking-[0.3em] text-stone-500 uppercase">作成する内容</span>
                    </div>

                    {/* Star Rating for Google Maps */}
                    {isGoogleMaps && (
                        <div className="mb-6 p-4 rounded-2xl border" style={{ backgroundColor: 'rgba(239,255,0,0.1)', borderColor: 'rgba(239,255,0,0.3)' }}>
                            <p className="text-[10px] font-black text-lime uppercase tracking-widest mb-3 flex items-center gap-2">
                                <SparklesIcon className="w-3 h-3" />
                                Review Rating
                            </p>
                            <div className="flex justify-between items-center bg-black p-3 rounded-xl border border-white/10 shadow-lg shadow-black/20">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => onStarRatingChange(s)}
                                        className={`text-2xl transition-all hover:scale-110 active:scale-95 ${s <= (starRating || 0) ? 'text-lime drop-shadow-sm' : 'text-gray-200'}`}
                                    >
                                        {s <= (starRating || 0) ? '★' : '☆'}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[9px] text-lime mt-2 font-bold px-1">
                                {starRating ? `${starRating} stars selected. Purpose will be adjusted.` : 'Select the star rating of the review.'}
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(isGoogleMaps ? GMAP_PURPOSES : PURPOSES).map((p) => (
                            <button
                                key={p.id}
                                onClick={() => isGoogleMaps ? onGmapPurposeChange(p.id as GoogleMapPurpose) : onPostPurposeChange(p.id as PostPurpose)}
                                className={`
                                flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all duration-300 group
                                ${(isGoogleMaps ? gmapPurpose : postPurpose) === p.id
                                        ? 'bg-black text-white border-black shadow-xl translate-x-1'
                                        : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50 hover:text-stone-800'}
                            `}
                            >
                                <span className={`text-lg transition-transform group-hover:scale-110 ${(isGoogleMaps ? gmapPurpose : postPurpose) === p.id ? 'text-white' : ''}`}>{p.icon}</span>
                                <span className="text-xs font-black tracking-widest uppercase">{p.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tone Module */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-3 bg-lime rounded-full"></div>
                        <span className="text-[10px] font-black tracking-[0.3em] text-stone-500 uppercase">文章の雰囲気</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {TONES.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => onToneChange(t.id)}
                                className={`
                                px-4 py-2.5 rounded-xl border text-[10px] font-black tracking-widest transition-all
                                ${tone === t.id
                                        ? 'bg-black border-black text-white shadow-lg'
                                        : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300 hover:text-stone-800'}
                            `}
                            >
                                {t.label.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Length Module */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-3 bg-lime rounded-full"></div>
                        <span className="text-[10px] font-black tracking-[0.3em] text-stone-500 uppercase">文章の長さ</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {LENGTHS.map((l) => (
                            <button
                                key={l.id}
                                onClick={() => onLengthChange(l.id)}
                                className={`
                                flex flex-col items-center justify-center py-3 rounded-2xl border transition-all
                                ${length === l.id
                                        ? 'bg-black text-white border-black shadow-lg'
                                        : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'}
                            `}
                            >
                                <span className="text-[10px] font-black tracking-tighter mb-0.5">{l.label.toUpperCase()}</span>
                                <span className="text-[8px] font-black opacity-40">{l.id === 'short' ? 'MIN' : l.id === 'medium' ? 'MID' : 'MAX'}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Text Input Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-3 bg-lime rounded-full"></div>
                            <span className="text-[10px] font-black tracking-[0.3em] text-stone-500 uppercase">今回はどんな内容にしますか？</span>
                        </div>
                        {inputText.length > 0 && (
                            <button
                                onClick={() => onInputTextChange('')}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-800 transition-all group/clear"
                                title="入力をすべて消去"
                            >
                                <EraserIcon className="w-3 h-3 group-hover/clear:rotate-12 transition-transform" />
                                <span className="text-[9px] font-black tracking-widest uppercase">Clear</span>
                            </button>
                        )}
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 blur-[100px] rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000" style={{ backgroundColor: 'rgba(239,255,0,0.05)' }}></div>
                        <AutoResizingTextarea
                            value={inputText}
                            onChange={(e) => onInputTextChange(e.target.value)}
                            placeholder="例：週末限定の特製クロワッサンが焼き上がりました。サクサクの食感と芳醇なバターの香りを楽しんでください。"
                            className="w-full bg-transparent text-stone-800 text-xl md:text-2xl leading-relaxed placeholder:text-stone-400 focus:outline-none min-h-[200px] resize-none relative z-10 p-6 border-2 border-stone-100 rounded-2xl focus:border-lime/30 transition-colors"
                        />
                    </div>
                </div>

                {/* Generate Button - Desktop */}
                <div className="hidden md:block">
                    <button
                        ref={generateButtonRef}
                        onClick={onGenerate}
                        disabled={isGenerating || !inputText.trim()}
                        className={`
                        relative group overflow-hidden w-full px-10 py-5 rounded-2xl font-black text-sm tracking-[0.2em] uppercase transition-all duration-500
                        ${isGenerating || !inputText.trim()
                                ? 'bg-stone-100 text-stone-400 cursor-not-allowed opacity-50'
                                : 'bg-black text-lime shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95'}
                    `}
                    >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(90deg, rgba(239,255,0,0.2), rgba(239,255,0,0.1))' }}></div>
                        <span className="relative flex items-center justify-center gap-3">
                            {isGenerating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-lime border-t-transparent rounded-full animate-spin"></div>
                                    GENERATING...
                                </>
                            ) : (
                                <>
                                    <SparklesIcon className="w-5 h-5" />
                                    投稿文を作成する
                                </>
                            )}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};
