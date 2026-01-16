import React from 'react';
import { PostPurpose, GoogleMapPurpose, Tone, Length, Platform } from '../../../types';
import { AutoResizingTextarea } from './AutoResizingTextarea';
import {
    MegaphoneIcon, BookOpenIcon, LightbulbIcon, ChatHeartIcon,
    AutoSparklesIcon, HandHeartIcon, ApologyIcon, InfoIcon, MagicWandIcon, SparklesIcon, EraserIcon
} from '../../Icons';

interface PostInputFormProps {
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
    generateButtonRef
}) => {
    const isGoogleMaps = platform === Platform.GoogleMaps;

    return (
        <div className="flex flex-col lg:grid lg:grid-cols-12 min-h-[600px] divide-y lg:divide-y-0 lg:divide-x divide-stone-200">
            {/* Sidebar: Engine Configuration (4 Cols) */}
            <div className="lg:col-span-4 p-8 space-y-10 bg-white/[0.02]">
                <div className="space-y-8">
                    {/* Scene Module */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-3 bg-orange-500 rounded-full"></div>
                            <span className="text-[10px] font-black tracking-[0.3em] text-stone-500 uppercase">作成する内容</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {/* Star Rating for Google Maps */}
                            {isGoogleMaps && (
                                <div className="mb-6 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <SparklesIcon className="w-3 h-3" />
                                        Review Rating
                                    </p>
                                    <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-orange-200">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => onStarRatingChange(s)}
                                                className={`text-2xl transition-all hover:scale-110 active:scale-95 ${s <= (starRating || 0) ? 'text-orange-500 drop-shadow-sm' : 'text-stone-200'}`}
                                            >
                                                {s <= (starRating || 0) ? '★' : '☆'}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-[9px] text-orange-400 mt-2 font-bold px-1">
                                        {starRating ? `${starRating} stars selected. Purpose will be adjusted.` : 'Select the star rating of the review.'}
                                    </p>
                                </div>
                            )}

                            {(isGoogleMaps ? GMAP_PURPOSES : PURPOSES).map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => isGoogleMaps ? onGmapPurposeChange(p.id as GoogleMapPurpose) : onPostPurposeChange(p.id as PostPurpose)}
                                    className={`
                                        flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all duration-300 group
                                        ${(isGoogleMaps ? gmapPurpose : postPurpose) === p.id
                                            ? 'bg-orange-500 text-white border-orange-500 shadow-xl translate-x-1'
                                            : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50 hover:text-stone-800'}
                                    `}
                                >
                                    <span className="text-lg group-hover:scale-110 transition-transform">{p.icon}</span>
                                    <span className="text-xs font-black tracking-widest uppercase">{p.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tone Module */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-3 bg-orange-500 rounded-full"></div>
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
                                            ? 'bg-orange-600 border-orange-500 text-white shadow-lg'
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
                            <div className="w-1 h-3 bg-orange-500 rounded-full"></div>
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
                                            ? 'bg-orange-500 text-white border-orange-500 shadow-lg'
                                            : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'}
                                    `}
                                >
                                    <span className="text-[10px] font-black tracking-tighter mb-0.5">{l.label.toUpperCase()}</span>
                                    <span className="text-[8px] font-black opacity-40">{l.id === 'short' ? 'MIN' : l.id === 'medium' ? 'MID' : 'MAX'}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Editor: The Workstation (8 Cols) */}
            <div className="lg:col-span-8 p-10 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 flex gap-2 opacity-20">
                    <div className="w-12 h-[1px] bg-white"></div>
                    <div className="w-1 h-1 bg-white"></div>
                </div>

                <div className="mb-6 flex items-end justify-between">
                    <div>
                        <h2 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-2">Editor Protocol</h2>
                        <h3 className="text-3xl font-black text-stone-800 tracking-tighter leading-tight italic">
                            今回はどんな内容にしますか？
                        </h3>
                    </div>

                    {inputText.length > 0 && (
                        <button
                            onClick={() => onInputTextChange('')}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 text-stone-500 hover:bg-orange-50 hover:text-orange-600 transition-all group/clear mb-1"
                            title="入力をすべて消去"
                        >
                            <EraserIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                            <span className="text-[10px] font-black tracking-widest uppercase">Clear</span>
                        </button>
                    )}
                </div>

                <div className="flex-1 relative group">
                    <div className="absolute inset-0 bg-orange-500/5 blur-[100px] rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000"></div>
                    <AutoResizingTextarea
                        value={inputText}
                        onChange={(e) => onInputTextChange(e.target.value)}
                        placeholder="例：週末限定の特製クロワッサンが焼き上がりました。サクサクの食感と芳醇なバターの香りを楽しんでください。"
                        className="w-full bg-transparent text-stone-800 text-xl md:text-2xl leading-relaxed placeholder:text-stone-400 focus:outline-none min-h-[300px] resize-none relative z-10"
                    />
                </div>

                <div className="mt-10 hidden md:flex items-center justify-between">
                    <div className="hidden sm:flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-orange-500">
                                <MagicWandIcon className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">AI Status</p>
                                <p className="text-[11px] font-black text-stone-800 uppercase tracking-tighter">AIがお手伝いします</p>
                            </div>
                        </div>
                    </div>

                    <button
                        ref={generateButtonRef}
                        onClick={onGenerate}
                        disabled={isGenerating || !inputText.trim()}
                        className={`
                            relative group overflow-hidden px-10 py-5 rounded-2xl font-black text-sm tracking-[0.2em] uppercase transition-all duration-500
                            ${isGenerating || !inputText.trim()
                                ? 'bg-stone-100 text-stone-400 cursor-not-allowed opacity-50'
                                : 'bg-stone-900 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95'}
                        `}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="relative flex items-center gap-3">
                            {isGenerating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
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
