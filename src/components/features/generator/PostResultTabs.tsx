import React from 'react';
import { Platform, GeneratedResult, GenerationConfig, StoreProfile } from '../../../types';
import { getPlatformIcon, insertInstagramFooter, removeInstagramFooter } from './utils';
import { CharCounter } from './CharCounter';
import { AutoResizingTextarea } from './AutoResizingTextarea';
import { RefinePanel } from './RefinePanel';
import { PostPreviewModal } from './PostPreviewModal';
import { CopyIcon, CrownIcon, MagicWandIcon, RotateCcwIcon, ExternalLinkIcon, EyeIcon } from '../../Icons';

interface PostResultTabsProps {
    results: GeneratedResult[];
    activeTab: number;
    onTabChange: (index: number) => void;
    onManualEdit: (groupIndex: number, itemIndex: number, text: string) => void;
    onToggleFooter: (groupIndex: number, itemIndex: number) => void;
    onRefine: (groupIndex: number, itemIndex: number) => void;
    onRegenerateSingle: (platform: Platform) => void;
    onShare: (platform: Platform, text: string) => void;
    getShareButtonLabel: (p: Platform) => string;
    storeProfile: StoreProfile;
    refiningKey: string | null;
    onRefineToggle: (gIdx: number, iIdx: number) => void;
    refineText: string;
    onRefineTextChange: (text: string) => void;
    onPerformRefine: (gIdx: number, iIdx: number) => void;
    isRefining: boolean;
}

export const PostResultTabs: React.FC<PostResultTabsProps> = ({
    results,
    activeTab,
    onTabChange,
    onManualEdit,
    onToggleFooter,
    onRefine,
    onRegenerateSingle,
    onShare,
    getShareButtonLabel,
    storeProfile,
    refiningKey,
    onRefineToggle,
    refineText,
    onRefineTextChange,
    onPerformRefine,
    isRefining
}) => {
    if (results.length === 0) return null;

    const [previewState, setPreviewState] = React.useState<{ isOpen: boolean, platform: Platform, text: string } | null>(null);

    return (
        <div className="space-y-12 animate-in fade-in duration-1000">
            {/* Tab Navigation: The Switcher */}
            <div className="flex items-center gap-1.5 p-1.5 bg-white/5 border border-white/5 rounded-2xl w-fit mx-auto lg:mx-0">
                {results.map((res, idx) => (
                    <button
                        key={res.platform}
                        onClick={() => onTabChange(idx)}
                        className={`
                            flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all duration-500 shrink-0
                            ${activeTab === idx
                                ? 'bg-orange-600 text-white shadow-xl shadow-orange-500/20'
                                : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'}
                        `}
                    >
                        <div className={`${activeTab === idx ? 'text-orange-600' : 'text-stone-600'}`}>
                            {getPlatformIcon(res.platform)}
                        </div>
                        {res.platform.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Results Content: The Blueprint Gallery */}
            <div className="space-y-16">
                {results.map((res, gIdx) => (
                    <div key={res.platform} className={activeTab === gIdx ? 'block animate-in fade-in slide-in-from-bottom-4 duration-700' : 'hidden'}>
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em]">Output Protocol Alpha</span>
                                </div>
                                <h3 className="text-4xl font-black text-stone-800 tracking-tighter italic">{res.platform} <span className="text-stone-400">SOLUTIONS</span></h3>
                            </div>
                            <button
                                onClick={() => onRegenerateSingle(res.platform)}
                                className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black text-stone-400 hover:border-orange-500/30 hover:text-white transition-all shadow-xl"
                            >
                                <RotateCcwIcon className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
                                REGENERATE ENGINE
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {res.data.map((text, iIdx) => (
                                <div key={iIdx} className="group relative bg-white/60 backdrop-blur-3xl border border-stone-200 rounded-[3rem] shadow-xl shadow-stone-200/50 transition-all duration-700 hover:shadow-2xl hover:shadow-stone-200/60 flex flex-col min-h-[500px] overflow-hidden">
                                    {/* Grid-line Background Overlay */}
                                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                                    {/* Card Header: Metadata */}
                                    <div className="p-8 pb-4 flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-600 font-black text-sm italic shadow-inner">
                                                {String(iIdx + 1).padStart(2, '0')}
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest leading-none mb-1">Variant Identity</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
                                                    <span className="text-[11px] font-black text-stone-500 font-mono">MDL-2026-X{iIdx}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-stone-50 px-4 py-2 rounded-xl border border-stone-200 backdrop-blur-md">
                                            <CharCounter
                                                platform={res.platform}
                                                text={text}
                                                config={{ platform: res.platform } as any}
                                            />
                                        </div>
                                    </div>

                                    {/* Content Area: The Blueprint */}
                                    <div className="p-10 pt-6 flex-1 relative z-10">
                                        <div className="absolute -left-1 top-0 w-0.5 h-full bg-gradient-to-b from-orange-500/50 to-transparent"></div>
                                        <AutoResizingTextarea
                                            value={text}
                                            onChange={(e) => onManualEdit(gIdx, iIdx, e.target.value)}
                                            className="w-full bg-transparent text-stone-800 text-lg md:text-xl leading-relaxed focus:outline-none resize-none placeholder:text-stone-400 font-medium"
                                        />
                                    </div>

                                    {/* Action Module: Floating Performance Bar */}
                                    <div className="p-8 pt-0 mt-auto relative z-10">
                                        <div className="bg-white/5 rounded-[2rem] p-2 border border-white/5 backdrop-blur-3xl flex items-center gap-2 shadow-2xl">
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(text);
                                                }}
                                                className="flex-1 flex items-center justify-center gap-2 sm:gap-3 py-4 rounded-2xl bg-stone-100 text-[10px] font-black text-stone-500 hover:bg-stone-200 hover:text-stone-900 transition-all uppercase tracking-widest"
                                            >
                                                <CopyIcon className="w-4 h-4 shrink-0" />
                                                <span className="truncate">COPY</span>
                                            </button>
                                            <button
                                                onClick={() => setPreviewState({ isOpen: true, platform: res.platform, text })}
                                                className="flex flex-1 items-center justify-center gap-2 sm:gap-3 py-4 rounded-2xl bg-stone-100 text-[10px] font-black text-stone-500 hover:bg-stone-200 hover:text-stone-900 transition-all uppercase tracking-widest"
                                            >
                                                <EyeIcon className="w-4 h-4 shrink-0" />
                                                <span className="truncate">PREVIEW</span>
                                            </button>
                                            <button
                                                onClick={() => onRefineToggle(gIdx, iIdx)}
                                                className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 py-4 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest ${refiningKey === `${gIdx}-${iIdx}` ? 'bg-orange-600 text-white' : 'bg-stone-900 text-white shadow-xl hover:scale-[1.02]'}`}
                                            >
                                                <MagicWandIcon className="w-4 h-4 shrink-0" />
                                                <span className="truncate">REFINE</span>
                                            </button>
                                            <button
                                                onClick={() => onShare(res.platform, text)}
                                                className="w-14 h-14 flex items-center justify-center rounded-2xl bg-stone-800 text-white hover:bg-orange-600 transition-all group/share"
                                            >
                                                <ExternalLinkIcon className="w-5 h-5 group-hover/share:transtone-x-0.5 group-hover/share:-transtone-y-0.5 transition-transform" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* AI Refinement Overlay */}
                                    {refiningKey === `${gIdx}-${iIdx}` && (
                                        <div className="absolute inset-0 bg-stone-950/95 backdrop-blur-xl z-20 flex flex-col p-10 animate-in fade-in zoom-in duration-500">
                                            <div className="flex-1 overflow-y-auto">
                                                <div className="mb-8">
                                                    <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-2">Refinement Protocol</h4>
                                                    <p className="text-xl font-black text-white italic">どのように調整しますか？</p>
                                                </div>
                                                <RefinePanel
                                                    refineText={refineText}
                                                    onRefineTextChange={onRefineTextChange}
                                                    onRefine={() => onPerformRefine(gIdx, iIdx)}
                                                    onCancel={() => onRefineToggle(gIdx, iIdx)}
                                                    isRefining={isRefining}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {previewState && (
                <PostPreviewModal
                    isOpen={previewState.isOpen}
                    onClose={() => setPreviewState(null)}
                    platform={previewState.platform}
                    text={previewState.text}
                    storeProfile={storeProfile}
                />
            )}
        </div>
    );
};
