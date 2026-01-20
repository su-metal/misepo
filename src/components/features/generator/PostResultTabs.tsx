import React from 'react';
import { Platform, GeneratedResult, GenerationConfig, StoreProfile } from '../../../types';
import { getPlatformIcon, insertInstagramFooter, removeInstagramFooter } from './utils';
import { CharCounter } from './CharCounter';
import { AutoResizingTextarea } from './AutoResizingTextarea';
import { RefinePanel } from './RefinePanel';
import { PostPreviewModal } from './PostPreviewModal';
import { CopyIcon, CrownIcon, MagicWandIcon, RotateCcwIcon, ExternalLinkIcon, EyeIcon, SparklesIcon } from '../../Icons';

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
    const [previewState, setPreviewState] = React.useState<{ isOpen: boolean, platform: Platform, text: string } | null>(null);

    const getPlatformTheme = (platform: Platform) => {
        switch (platform) {
            case Platform.X:
                return {
                    icon: <div className="w-10 h-10 bg-[#001738] rounded-full flex items-center justify-center text-white text-xl font-black shadow-lg">𝕏</div>,
                    label: 'X (Twitter)',
                    actionColor: 'bg-[#001738] hover:bg-[#000c1d]',
                    actionLabel: 'Xで投稿する',
                    contentClasses: "text-[16px] text-[#001738] font-bold leading-relaxed tracking-tight",
                    wrapperClass: "max-w-[375px]",
                };
            case Platform.Instagram:
                return {
                    icon: (
                        <div className="w-10 h-10 bg-gradient-to-tr from-[#FFDC80] via-[#E5005A] to-[#BC1888] rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                            </svg>
                        </div>
                    ),
                    label: 'Instagram',
                    extra: (gIdx: number, iIdx: number) => (
                        <button
                            key="inst-toggle"
                            onClick={() => onIncludeFooterChange(!includeFooter)}
                            className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all text-[11px] font-black border-2 ${includeFooter
                                ? 'bg-pink-50 text-[#E5005A] border-pink-100 shadow-sm'
                                : 'bg-slate-50 text-slate-400 border-slate-100'
                                }`}
                        >
                            <span className={`w-2.5 h-2.5 rounded-full transition-colors ${includeFooter ? 'bg-[#E5005A] animate-pulse' : 'bg-slate-300'}`} />
                            <span className="tracking-widest uppercase">Show Shop Info</span>
                        </button>
                    ),
                    actionColor: 'bg-gradient-to-r from-[#FF8C37] via-[#E5005A] to-[#BC1888] hover:scale-[1.02] active:scale-[0.98]',
                    actionLabel: 'Instagramを起動',
                    contentClasses: "text-[15px] text-[#001738] font-bold leading-relaxed tracking-tight",
                    wrapperClass: "max-w-[340px]",
                };
            case Platform.GoogleMaps:
                return {
                    icon: (
                        <div className="w-10 h-10 bg-[#34A853] rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                        </div>
                    ),
                    label: 'Google Maps',
                    actionColor: 'bg-[#34A853] hover:bg-[#2d9147] hover:scale-[1.02] active:scale-[0.98]',
                    actionLabel: 'Googleマップで返信する',
                    contentClasses: "text-[15px] text-[#001738] font-bold leading-relaxed tracking-tight",
                    wrapperClass: "max-w-[325px]",
                };
            default:
                return {
                    icon: null,
                    label: platform,
                    actionColor: 'bg-[#001738]',
                    actionLabel: '投稿する',
                    contentClasses: "text-base text-[#001738] font-black",
                };
        }
    };

    return (
        <>
            <div className={`space-y-8 animate-in fade-in duration-700 ${results.length === 0 ? 'hidden md:block' : ''}`}>
                {/* Tab Navigation */}
                <div className={`space-y-12 animate-in fade-in duration-1000 ${results.length === 0 ? 'hidden md:block' : ''}`}>
                    {/* Tab Navigation - CastMe Style */}
                    <div className={`flex items-center gap-3 bg-slate-50/50 w-fit mx-auto lg:mx-0  ${results.length === 0 ? 'hidden md:flex' : ''}`}>
                        {results.map((res, idx) => {
                            const isSelected = activeTab === idx;
                            const iconClass = "w-5 h-5 transition-transform duration-300 " + (isSelected ? "scale-110" : "opacity-30");

                            let icon = null;
                            if (res.platform === Platform.Instagram) {
                                icon = (
                                    <svg className={`${iconClass} text-[#E5005A]`} viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                                    </svg>
                                );
                            } else if (res.platform === Platform.X) {
                                icon = (
                                    <svg className={`${iconClass} text-[#001738]`} viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                );
                            } else if (res.platform === Platform.GoogleMaps) {
                                icon = (
                                    <svg className={`${iconClass} text-[#34A853]`} viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                );
                            }

                            return (
                                <button
                                    key={res.platform}
                                    onClick={() => onTabChange(idx)}
                                    className={`
                                flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs font-black tracking-widest transition-all shrink-0
                                ${isSelected
                                            ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/50'
                                            : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'}
                            `}
                                >
                                    {icon}
                                    <span>{res.platform.toUpperCase()}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Results Content */}
                    <div className="flex-1 min-h-0">
                        {results.length === 0 ? (
                            // Placeholder when no results - CastMe Style
                            <div className="hidden md:block animate-in fade-in slide-in-from-bottom-2 duration-700">
                                <div className="flex items-center gap-4 mb-8 px-1">
                                    <div className="w-12 h-12 bg-[#001738] rounded-[18px] flex items-center justify-center shadow-lg">
                                        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-black text-[#001738] uppercase tracking-[0.2em]">Live Preview</h2>
                                </div>

                                <div className="bg-white border-2 border-slate-100 rounded-[48px] shadow-2xl shadow-slate-200/50 flex flex-col min-h-[500px] overflow-hidden p-12 transition-all hover:border-[#001738]">
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="text-center space-y-6 max-w-sm">
                                            <div className="w-20 h-20 rounded-[24px] bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-slate-200 mx-auto">
                                                <SparklesIcon className="w-10 h-10" />
                                            </div>
                                            <h3 className="text-xl font-black text-[#001738] uppercase tracking-widest">Awaiting Input</h3>
                                            <p className="text-slate-400 text-sm font-bold leading-relaxed">
                                                Enter your content idea on the left to generate professional posts instantly.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            results.map((res, gIdx) => {
                                const theme = getPlatformTheme(res.platform);
                                return (
                                    <div key={res.platform} className={activeTab === gIdx ? 'block animate-in fade-in slide-in-from-bottom-4 duration-700' : 'hidden'}>
                                        <div className="space-y-10">
                                            {res.data.map((text, iIdx) => (
                                                <div key={iIdx} className="group relative bg-white border-2 border-slate-100 rounded-[48px] shadow-2xl shadow-slate-200/50 hover:border-[#001738] transition-all duration-500 flex flex-col min-h-[500px] overflow-hidden p-12">

                                                    {/* Platform Icon Header */}
                                                    <div className="flex items-center justify-center mb-10">
                                                        <div className="transform transition-transform group-hover:scale-110 duration-500">
                                                            {theme.icon}
                                                        </div>
                                                    </div>

                                                    {/* Text Area */}
                                                    <div className={`flex-1 overflow-y-auto mb-10 custom-scrollbar ${theme.wrapperClass || ''}`}>
                                                        <AutoResizingTextarea
                                                            value={text}
                                                            onChange={(e) => onManualEdit(gIdx, iIdx, e.target.value)}
                                                            className={`w-full bg-transparent focus:outline-none resize-none placeholder:text-slate-100 whitespace-pre-wrap ${theme.contentClasses || 'text-base text-[#001738] font-bold'}`}
                                                            trigger={activeTab}
                                                        />
                                                    </div>

                                                    {/* Meta Row: Toggle & Char Count */}
                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10 pt-8 border-t-2 border-slate-50">
                                                        <div className="flex-1">
                                                            {theme.extra && theme.extra(gIdx, iIdx)}
                                                        </div>
                                                        <div className="bg-slate-50 px-5 py-2 rounded-full">
                                                            <CharCounter
                                                                platform={res.platform}
                                                                text={text}
                                                                config={{ platform: res.platform } as any}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Actions Grid - Stacked Layout (Mobile Style for All) */}
                                                    <div className="flex flex-col gap-4">
                                                        {/* Preview - Full Width */}
                                                        <button
                                                            onClick={() => setPreviewState({ isOpen: true, platform: res.platform, text })}
                                                            className="flex items-center justify-center gap-3 py-5 rounded-[24px] bg-white text-xs font-black text-[#001738] border-2 border-slate-100 hover:border-[#001738] hover:bg-slate-50 transition-all uppercase tracking-widest shadow-sm"
                                                        >
                                                            <EyeIcon className="w-5 h-5" />
                                                            <span>Preview</span>
                                                        </button>

                                                        {/* Retry + Refine - Side by Side */}
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <button
                                                                onClick={() => onRegenerateSingle(res.platform)}
                                                                className="flex items-center justify-center gap-3 py-5 rounded-[24px] border-2 border-slate-100 bg-white text-xs font-black text-slate-400 hover:text-[#001738] hover:border-[#001738] transition-all uppercase tracking-widest"
                                                            >
                                                                <RotateCcwIcon className="w-5 h-5" />
                                                                <span>Retry</span>
                                                            </button>
                                                            <button
                                                                onClick={() => onRefineToggle(gIdx, iIdx)}
                                                                className={`flex items-center justify-center gap-3 py-5 rounded-[24px] border-2 text-xs font-black transition-all uppercase tracking-widest ${refiningKey === `${gIdx}-${iIdx}` ? 'bg-[#001738] border-[#001738] text-white shadow-xl' : 'bg-[#FFFBEB] border-[#FEF3C7] text-[#B78822] hover:bg-white hover:border-[#FCD34D]'}`}
                                                            >
                                                                <MagicWandIcon className="w-5 h-5" />
                                                                <span>Refine</span>
                                                            </button>
                                                        </div>

                                                        {/* SNS Launch Button - Full Width */}
                                                        <button
                                                            onClick={() => onShare(res.platform, text)}
                                                            className={`flex items-center justify-center gap-4 py-6 rounded-[28px] text-white font-black text-lg transition-all shadow-2xl shadow-slate-200 uppercase tracking-[0.2em] group ${theme.actionColor}`}
                                                        >
                                                            <span>{theme.actionLabel}</span>
                                                            <ExternalLinkIcon className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                        </button>
                                                    </div>

                                                    {/* AI Refinement Overlay - CastMe Style */}
                                                    {refiningKey === `${gIdx}-${iIdx}` && (
                                                        <div className="absolute inset-0 bg-[#001738]/95 backdrop-blur-xl z-20 flex flex-col p-12 animate-in fade-in zoom-in duration-300 rounded-[48px]">
                                                            <div className="flex-1 flex flex-col">
                                                                <div className="mb-10 text-center">
                                                                    <div className="w-16 h-16 bg-[#E5005A] rounded-[18px] flex items-center justify-center shadow-lg mx-auto mb-6">
                                                                        <MagicWandIcon className="w-8 h-8 text-white" />
                                                                    </div>
                                                                    <h4 className="text-[10px] font-black text-pink-400 uppercase tracking-[0.4em] mb-2">Advanced Refinement</h4>
                                                                    <p className="text-3xl font-black text-white leading-tight">What would you like <br />to change?</p>
                                                                </div>
                                                                <div className="flex-1 bg-white/5 rounded-[32px] p-2 border border-white/10">
                                                                    <RefinePanel
                                                                        refineText={refineText}
                                                                        onRefineTextChange={onRefineTextChange}
                                                                        onRefine={() => onPerformRefine(gIdx, iIdx)}
                                                                        onCancel={() => onRefineToggle(gIdx, iIdx)}
                                                                        isRefining={isRefining}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Preview Modal */}
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
        </>
    );
};

export default PostResultTabs;
