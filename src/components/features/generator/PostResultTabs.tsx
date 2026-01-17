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
    includeFooter: boolean;
    onIncludeFooterChange: (val: boolean) => void;
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
    isRefining,
    includeFooter,
    onIncludeFooterChange
}) => {
    if (results.length === 0) return null;

    const [previewState, setPreviewState] = React.useState<{ isOpen: boolean, platform: Platform, text: string } | null>(null);

    return (
        <>
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
                                    ? 'bg-black text-lime shadow-xl shadow-black/20'
                                    : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'}
                        `}
                        >
                            <div className={`${activeTab === idx ? 'text-lime' : 'text-stone-600'}`}>
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
                            <div className="mb-12">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-lime"></div>
                                        <span className="text-[10px] font-black tracking-[0.4em] text-lime uppercase">作成された投稿案</span>
                                    </div>
                                    <h2 className="text-3xl font-black text-stone-800 tracking-tighter italic">投稿案のリスト</h2>
                                </div>
                            </div>

                            <div className="space-y-10">
                                {res.data.map((text, iIdx) => (
                                    <div key={iIdx} className="group relative bg-white/60 backdrop-blur-3xl border border-stone-200 rounded-[3rem] shadow-xl shadow-stone-200/50 transition-all duration-700 hover:shadow-2xl hover:shadow-stone-200/60 flex flex-col min-h-[500px] overflow-hidden">
                                        {/* Grid-line Background Overlay - Removed as per user request */}

                                        {/* Card Header: Metadata */}
                                        <div className="p-8 pb-4 flex items-center justify-between relative z-10">
                                            {text.length === 0 ? (
                                                <div className="text-center space-y-4 max-w-sm px-10">
                                                    <div className="w-20 h-20 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-300 mx-auto">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                                                    </div>
                                                    <h3 className="text-lg font-black text-stone-800 tracking-tighter">ここに作成した文章が表示されます</h3>
                                                    <p className="text-stone-500 text-sm leading-relaxed font-bold italic">左側のフォームに入力して「投稿文を作成する」ボタンを押してください。</p>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-600 font-black text-sm italic shadow-inner">
                                                        {String(iIdx + 1).padStart(2, '0')}
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest leading-none mb-1">提案リスト No.</p>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-lime/50"></div>
                                                            <span className="text-[11px] font-black text-stone-500 font-mono">VARIANT-{iIdx + 1}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
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
                                            <div className="absolute -left-1 top-0 w-0.5 h-full bg-gradient-to-b from-lime/50 to-transparent"></div>
                                            <AutoResizingTextarea
                                                value={text}
                                                onChange={(e) => onManualEdit(gIdx, iIdx, e.target.value)}
                                                className="w-full bg-transparent text-stone-800 text-lg md:text-xl leading-relaxed focus:outline-none resize-none placeholder:text-stone-400 font-medium"
                                                trigger={activeTab}
                                            />
                                        </div>

                                        {/* Instagram Template Toggle - Full Width */}
                                        {res.platform === Platform.Instagram && (
                                            <div className="px-8 pb-4 relative z-10">
                                                <div
                                                    onClick={() => onIncludeFooterChange(!includeFooter)}
                                                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer group transition-all ${includeFooter ? 'bg-black border-black shadow-xl shadow-black/20' : 'bg-stone-50 border-stone-100 hover:bg-stone-100'}`}
                                                >
                                                    <div className="space-y-0.5">
                                                        <p className={`text-[9px] font-black uppercase tracking-widest leading-none mb-1 ${includeFooter ? 'text-lime' : 'text-stone-400'}`}>Instagram Template</p>
                                                        <p className={`text-[10px] font-black italic ${includeFooter ? 'text-white/60' : 'text-stone-500'}`}>署名テンプレートを挿入</p>
                                                    </div>
                                                    <div
                                                        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${includeFooter ? 'bg-black border border-lime/50' : 'bg-gray-200'}`}
                                                    >
                                                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full transition-transform duration-300 ${includeFooter ? 'translate-x-5.5 bg-lime' : 'translate-x-1 bg-white'}`} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Module: Floating Performance Bar */}
                                        <div className="p-8 pt-0 mt-auto relative z-10 grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(text);
                                                }}
                                                className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-stone-100/80 text-[10px] font-black text-stone-500 hover:bg-stone-200 hover:text-stone-900 transition-all uppercase tracking-widest"
                                            >
                                                <CopyIcon className="w-4 h-4 shrink-0" />
                                                <span className="truncate">コピー</span>
                                            </button>
                                            <button
                                                onClick={() => setPreviewState({ isOpen: true, platform: res.platform, text })}
                                                className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-stone-100/80 text-[10px] font-black text-stone-500 hover:bg-stone-200 hover:text-stone-900 transition-all uppercase tracking-widest"
                                            >
                                                <EyeIcon className="w-4 h-4 shrink-0" />
                                                <span className="truncate">プレビュー</span>
                                            </button>
                                            <button
                                                onClick={() => onRefineToggle(gIdx, iIdx)}
                                                className={`flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest ${refiningKey === `${gIdx}-${iIdx}` ? 'bg-lime text-black' : 'bg-black text-white shadow-xl hover:scale-[1.02]'}`}
                                            >
                                                <MagicWandIcon className="w-4 h-4 shrink-0" />
                                                <span className="truncate">AIに修正してもらう</span>
                                            </button>
                                            <button
                                                onClick={() => onShare(res.platform, text)}
                                                className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-gray-800 text-white hover:bg-lime hover:text-black transition-all group/share"
                                            >
                                                <span className="text-[10px] font-black uppercase tracking-widest truncate">SNSで開く</span>
                                                <ExternalLinkIcon className="w-4 h-4 group-hover/share:transtone-x-0.5 group-hover/share:-transtone-y-0.5 transition-transform" />
                                            </button>
                                        </div>

                                        {/* AI Refinement Overlay */}
                                        {refiningKey === `${gIdx}-${iIdx}` && (
                                            <div className="absolute inset-0 bg-stone-950/95 backdrop-blur-xl z-20 flex flex-col p-10 animate-in fade-in zoom-in duration-500">
                                                <div className="flex-1 overflow-y-auto">
                                                    <div className="mb-8">
                                                        <h4 className="text-[10px] font-black text-lime uppercase tracking-[0.4em] mb-2">Refine Post</h4>
                                                        <p className="text-xl font-black text-white italic">AIへの追加指示（日本語でOK）</p>
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
            </div>

            {/* Preview Modal - Outside animated container to prevent clipping */}
            {previewState && (
                <PostPreviewModal
                    isOpen={previewState.isOpen}
                    onClose={() => setPreviewState(null)}
                    platform={previewState.platform}
                    text={previewState.text}
                    storeProfile={storeProfile}
                />
            )}
        </>
    );
};
