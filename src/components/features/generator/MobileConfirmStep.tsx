import React from 'react';
import { Platform } from '../../../types';
import { usePostInput } from './PostInputContext';
import { AutoResizingTextarea } from './AutoResizingTextarea';
import {
    AutoSparklesIcon, RotateCcwIcon, StarIcon
} from '../../Icons';
import {
    TONES, LENGTHS
} from './inputConstants';
import { TARGET_AUDIENCES } from '../../../constants';

interface MobileConfirmStepProps {
    isDefaultStyleEnabled: boolean;
    setIsDefaultStyleEnabled: (v: boolean) => void;
    isDefaultAudienceEnabled: boolean;
    setIsDefaultAudienceEnabled: (v: boolean) => void;
    isAudienceExpanded: boolean;
    setIsAudienceExpanded: (v: boolean) => void;
    handleTargetAudienceToggle: (target: string) => void;
    primaryAudienceList: string[];
    secondaryAudienceList: string[];
    onGoToInput: () => void;
}

export const MobileConfirmStep: React.FC<MobileConfirmStepProps> = ({
    isDefaultStyleEnabled,
    setIsDefaultStyleEnabled,
    isDefaultAudienceEnabled,
    setIsDefaultAudienceEnabled,
    isAudienceExpanded,
    setIsAudienceExpanded,
    handleTargetAudienceToggle,
    primaryAudienceList,
    secondaryAudienceList,
    onGoToInput
}) => {
    const {
        platform, inputText, tone, onToneChange, length, onLengthChange,
        starRating, onStarRatingChange,
        isGenerating, onGenerate, isMultiGen, isStyleLocked,
        presets, activePresetId, onApplyPreset, onOpenPresetModal,
        customPrompt, onCustomPromptChange,
        storeSupplement, onStoreSupplementChange,
        targetAudiences
    } = usePostInput();

    const isGoogleMaps = platform === Platform.GoogleMaps;
    const isX = platform === Platform.X;

    return (
        <div className="flex-1 relative min-h-0 flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-700">
            {/* Scrollable Preview and Settings */}
            <div className="flex-1 overflow-y-auto px-8 py-4 pb-[190px] sm:pb-[160px] space-y-4 no-scrollbar scrollbar-hide">
                <div className="flex flex-col gap-4">
                    {/* Preview Box - Brand Style */}
                    <div className="bg-[#edeff1] border border-slate-100 rounded-[40px] p-8 min-h-[180px] relative shadow-sm overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#80CAFF]/10 rounded-full blur-3xl -mr-16 -mt-16" />
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#80CAFF]/50" />
                                <div className="w-1.5 h-1.5 rounded-full bg-[#C084FC]/50" />
                            </div>
                            <span className="text-[10px] font-black text-[#2b2b2f] uppercase tracking-[0.2em]">入力内容の確認</span>
                        </div>
                        <div className="text-[#2b2b2f] text-[16px] font-bold leading-relaxed">
                            {inputText.length > 200 ? inputText.substring(0, 200) + '...' : inputText || "ここに内容が表示されます..."}
                        </div>

                        {/* GMap Star Rating */}
                        {isGoogleMaps && (
                            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col items-center gap-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">口コミの評価</span>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => onStarRatingChange(star)}
                                            className="transition-transform active:scale-95"
                                        >
                                            <StarIcon
                                                className={`w-7 h-7 transition-all ${star <= (starRating || 0)
                                                    ? 'text-[#FFD166] fill-[#FFD166] drop-shadow-sm'
                                                    : 'text-slate-200'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button onClick={onGoToInput} className="absolute bottom-6 right-8 w-11 h-11 bg-[#e2e4e6] border border-slate-200 rounded-2xl text-slate-400 hover:text-[#2b2b2f] transition-all flex items-center justify-center active:scale-95 shadow-sm">
                            <RotateCcwIcon className="w-5 h-5" />
                        </button>
                    </div>


                    {/* Target Audience - Hidden for Google Maps */}
                    {!isGoogleMaps && targetAudiences && (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-[11px] font-black text-[#2b2b2f] uppercase tracking-[0.2em]">ターゲット設定</span>
                                    <label className="flex items-center gap-1.5 cursor-pointer group/label">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={isDefaultAudienceEnabled}
                                                onChange={(e) => setIsDefaultAudienceEnabled(e.target.checked)}
                                                className="peer appearance-none w-3.5 h-3.5 rounded border border-stone-300 checked:bg-[#2b2b2f] checked:border-[#2b2b2f] transition-all"
                                            />
                                            <svg className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-[9px] font-bold text-stone-400 group-hover/label:text-stone-600 transition-colors">デフォルトに設定</span>
                                    </label>
                                </div>
                                <span className="text-[9px] font-bold text-stone-400">※複数選択可</span>
                            </div>
                            <div className="flex overflow-x-auto gap-2 pb-2 pt-2 -mx-2 px-3 no-scrollbar scrollbar-hide">
                                {primaryAudienceList.map(target => (
                                    <button
                                        key={target}
                                        onClick={() => handleTargetAudienceToggle(target)}
                                        className={`
                                            flex-shrink-0 px-4 py-2 rounded-xl font-bold text-[11px] transition-all active:scale-95 border whitespace-nowrap
                                            ${targetAudiences?.includes(target)
                                                ? 'bg-[#2b2b2f] text-white border-[#2b2b2f] shadow-md'
                                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                                            }
                                        `}
                                    >
                                        {target}
                                    </button>
                                ))}

                                {/* Show All Toggle or Secondary List */}
                                {secondaryAudienceList.length > 0 && (
                                    <>
                                        {!isAudienceExpanded ? (
                                            <button
                                                onClick={() => setIsAudienceExpanded(true)}
                                                className="flex-shrink-0 px-3 py-2 rounded-xl font-bold text-[10px] bg-stone-100 text-stone-400 border border-stone-100 hover:bg-stone-200 transition-colors flex items-center gap-1 whitespace-nowrap"
                                            >
                                                <span>＋ 他のターゲット</span>
                                            </button>
                                        ) : (
                                            secondaryAudienceList.map(target => (
                                                <button
                                                    key={target}
                                                    onClick={() => handleTargetAudienceToggle(target)}
                                                    className="
                                                        flex-shrink-0 px-4 py-2 rounded-xl font-bold text-[11px] transition-all active:scale-95 border bg-white text-stone-500 border-stone-200 hover:border-stone-300 opacity-80 whitespace-nowrap
                                                    "
                                                >
                                                    {target}
                                                </button>
                                            ))
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Style Selection - Horizontal Pill Style (Monochrome) */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <span className="text-[11px] font-black text-[#2b2b2f] uppercase tracking-[0.2em]">スタイルを選ぶ</span>
                                <label className="flex items-center gap-1.5 cursor-pointer group/label">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={isDefaultStyleEnabled}
                                            onChange={(e) => setIsDefaultStyleEnabled(e.target.checked)}
                                            className="peer appearance-none w-3.5 h-3.5 rounded border border-[#666666] checked:bg-[#2b2b2f] checked:border-[#2b2b2f] transition-all"
                                        />
                                        <svg className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-[9px] font-bold text-[#A0A0A0] group-hover/label:text-stone-600 transition-colors">デフォルトに設定</span>
                                </label>
                            </div>
                            <button onClick={onOpenPresetModal} className="text-[10px] font-black text-[#2b2b2f] uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-100 hover:bg-slate-50 transition-all">編集</button>
                        </div>
                        <div className="flex overflow-x-auto gap-3 pb-2 pt-2 -mx-2 px-3 no-scrollbar scrollbar-hide">
                            <button
                                onClick={() => onApplyPreset({ id: 'plain-ai' } as any)}
                                className={`flex-shrink-0 px-8 py-3 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 shadow-sm border ${activePresetId === 'plain-ai' ? 'bg-[#2b2b2f] text-white border-[#2b2b2f] scale-105 active:scale-95 shadow-lg' : 'bg-[#edeff1] border-slate-100 text-slate-400 hover:text-[#2b2b2f]'}`}
                            >
                                AI標準
                            </button>
                            {presets.map((p) => {
                                const isSelected = activePresetId === p.id;
                                return (
                                    <button
                                        key={p.id}
                                        onClick={() => onApplyPreset(p)}
                                        className={`flex-shrink-0 px-8 py-3 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 shadow-sm border truncate max-w-[160px] ${isSelected ? 'bg-[#2b2b2f] text-white border-[#2b2b2f] scale-105 active:scale-95 shadow-lg' : 'bg-[#edeff1] border-slate-100 text-slate-400 hover:text-[#2b2b2f]'}`}
                                    >
                                        {p.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Custom Prompt (Always Visible) */}
                    <div className="my-2">
                        <div className="bg-[#edeff1] px-6 py-4 rounded-[32px] border border-slate-100 flex flex-col gap-2 shadow-sm active:border-slate-200 transition-colors">
                            <div className="flex items-center gap-1.5">
                                <AutoSparklesIcon className="w-3 h-3 text-[var(--pop-violet-main)]" />
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">追加指示（任意）</span>
                            </div>
                            <AutoResizingTextarea
                                value={customPrompt}
                                onChange={(e) => onCustomPromptChange(e.target.value)}
                                placeholder="AIへの具体的なお願いはこちらに..."
                                className="bg-transparent text-sm font-bold text-[#2b2b2f] focus:outline-none resize-none min-h-[32px] placeholder:text-slate-300 w-full"
                            />
                        </div>
                    </div>

                    {/* Store Supplement (Google Maps Only) */}
                    {isGoogleMaps && (
                        <div className="my-2">
                            <div className="bg-[#edeff1] px-6 py-4 rounded-[32px] border border-slate-100 flex flex-col gap-2 shadow-sm">
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">補足情報 / 当日の事情</span>
                                <AutoResizingTextarea
                                    value={storeSupplement}
                                    onChange={(e) => onStoreSupplementChange(e.target.value)}
                                    placeholder="例：急な欠勤でお待たせした、感謝を伝えたい等"
                                    className="bg-transparent text-sm font-bold text-[#2b2b2f] focus:outline-none resize-none min-h-[40px] placeholder:text-slate-300"
                                />
                            </div>
                        </div>
                    )}

                    {/* Fine-tuning Settings (Tone, Length) */}
                    {(!isStyleLocked || !isX) && (
                        <div className="mt-8 px-2 space-y-8">
                            {/* Settings Grid - Monochrome */}
                            <div className="flex gap-8 mb-4">
                                {/* Tone Slider - Hide if Locked */}
                                {!isStyleLocked && (
                                    <div className="flex-1 flex flex-col gap-3">
                                        <div className="flex items-center justify-between px-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[8px] font-black text-[#666666] uppercase tracking-[0.2em]">トーン</span>
                                            </div>
                                        </div>
                                        <div className="relative px-1 pt-1 pb-2">
                                            <div className="absolute top-[6px] left-1 right-1 h-[1.5px] bg-slate-100" />
                                            <div className="relative flex justify-between items-center h-3">
                                                {TONES.map((t) => {
                                                    const isActive = tone === t.id;
                                                    return (
                                                        <button
                                                            key={t.id}
                                                            onClick={() => onToneChange(t.id)}
                                                            className="relative z-10 flex flex-col items-center group w-full first:items-start last:items-end"
                                                        >
                                                            <div className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${isActive ? 'bg-[#2b2b2f] border-[#2b2b2f] scale-110 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-white border-slate-200'}`} />
                                                            <span className={`absolute -bottom-4 text-[8px] font-black transition-colors duration-300 whitespace-nowrap ${isActive ? 'text-[#2b2b2f]' : 'text-slate-400'}`}>
                                                                {t.label}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Length Slider */}
                                {!isX && (
                                    <div className="flex-1 flex flex-col gap-3">
                                        <div className="flex items-center justify-between px-1">
                                            <span className="text-[8px] font-black text-[#666666] uppercase tracking-[0.2em]">長さ</span>
                                        </div>
                                        <div className="relative px-1 pt-1 pb-2">
                                            <div className="absolute top-[6px] left-1 right-1 h-[1.5px] bg-slate-100" />
                                            <div className="relative flex justify-between items-center h-3">
                                                {LENGTHS.map((l) => {
                                                    const isActive = length === l.id;
                                                    return (
                                                        <button
                                                            key={l.id}
                                                            onClick={() => onLengthChange(l.id)}
                                                            className="relative z-10 flex flex-col items-center group w-full first:items-start last:items-end"
                                                        >
                                                            <div className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${isActive ? 'bg-[#2b2b2f] border-[#2b2b2f] scale-110 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-white border-slate-200'}`} />
                                                            <span className={`absolute -bottom-4 text-[8px] font-black transition-colors duration-300 whitespace-nowrap ${isActive ? 'text-[#2b2b2f]' : 'text-slate-400'}`}>
                                                                {l.label}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Step 3 Sticky Action Area */}
            <div className="absolute bottom-0 left-0 right-0 z-[250] flex flex-col items-center pointer-events-auto">
                <div
                    className="w-full px-8 pt-6 pb-[calc(env(safe-area-inset-bottom)+44px)] sm:pb-[calc(env(safe-area-inset-bottom)+24px)] flex flex-col items-center gap-4 relative bg-white border-t border-slate-100"
                >
                    <button
                        onClick={onGenerate}
                        disabled={isGenerating || !inputText.trim()}
                        className={`
                            w-full group relative overflow-hidden rounded-[32px] py-6
                            flex items-center justify-center
                            transition-all duration-500 active:scale-95 cursor-pointer
                            ${isGenerating || !inputText.trim()
                                ? 'bg-slate-100 cursor-not-allowed text-slate-300'
                                : 'bg-[#2b2b2f] shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:scale-[1.02] text-white'
                            }
                        `}
                    >
                        <div className="relative flex items-center justify-center gap-3">
                            {isGenerating ? (
                                <div className="w-6 h-6 border-3 border-orange-200 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span className="text-white text-base font-black uppercase tracking-[0.3em]">
                                        投稿文を生成 <span className="text-[10px] opacity-70 align-middle ml-1">{isMultiGen ? '2回分' : '1回分'}</span>
                                    </span>
                                </>
                            )}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};
