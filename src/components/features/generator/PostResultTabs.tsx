import React from 'react';
import { Platform, GeneratedResult, GenerationConfig, StoreProfile } from '../../../types';
import { getPlatformIcon, insertInstagramFooter, removeInstagramFooter } from './utils';
import { CharCounter } from './CharCounter';
import { AutoResizingTextarea } from './AutoResizingTextarea';
import { RefinePanel } from './RefinePanel';
import { PostPreviewModal } from './PostPreviewModal';
import { CopyIcon, CrownIcon, MagicWandIcon, RotateCcwIcon, ExternalLinkIcon, EyeIcon, SparklesIcon, LineIcon } from '../../Icons';
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
    presetId?: string;
    onAutoFormat: (gIdx: number, iIdx: number) => void;
    isAutoFormatting: { [key: string]: boolean };
    onCopy: (text: string) => void;
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
    onIncludeFooterChange,
    presetId,
    onAutoFormat,
    isAutoFormatting,
    onCopy,
}) => {
    const [previewState, setPreviewState] = React.useState<{ isOpen: boolean, platform: Platform, text: string, gIdx: number, iIdx: number } | null>(null);

    const getPlatformTheme = (platform: Platform) => {
        switch (platform) {
            case Platform.X:
                return {
                    icon: <div className="w-10 h-10 bg-[var(--plexo-dark-gray)] rounded-xl flex items-center justify-center text-[var(--plexo-yellow)] text-xl font-black shadow-sm border border-[var(--plexo-dark-gray)]">𝕏</div>,
                    label: 'X',
                    actionColor: "bg-[var(--plexo-dark-gray)] text-[var(--plexo-yellow)] shadow-[0_10px_30px_rgba(102,102,102,0.3)]",
                    actionLabel: "Xで投稿する",
                    contentClasses: "text-[16px] text-[var(--plexo-black)] font-bold leading-relaxed tracking-tight",
                    wrapperClass: "max-w-[375px]",
                    brandTextColor: "text-[var(--plexo-black)]",
                    brandBgColor: "bg-[var(--plexo-white)]",
                    brandBorderColor: "border-[var(--plexo-med-gray)]",
                };
            case Platform.Instagram:
                return {
                    icon: (
                        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-[var(--plexo-black)] shadow-sm border border-[var(--plexo-med-gray)]">
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
                            className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-[11px] font-black border ${includeFooter
                                ? 'bg-[var(--plexo-black)] text-[var(--plexo-yellow)] border-transparent shadow-md'
                                : 'bg-[var(--bg-secondary)] text-[var(--plexo-med-gray)] border-[var(--plexo-med-gray)]'
                                }`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full transition-colors ${includeFooter ? 'bg-[var(--plexo-yellow)] shadow-[0_0_8px_var(--plexo-yellow)]' : 'bg-[var(--plexo-med-gray)]'}`} />
                            <span className="tracking-[0.2em] uppercase">Footer</span>
                        </button>
                    ),
                    actionColor: "bg-[var(--plexo-dark-gray)] text-[var(--plexo-yellow)] shadow-[0_10px_30px_rgba(102,102,102,0.3)]",
                    actionLabel: "Instagramを起動",
                    contentClasses: "text-[15px] text-[var(--plexo-black)] font-bold leading-relaxed tracking-tight",
                    wrapperClass: "max-w-[340px]",
                    brandTextColor: "text-[var(--plexo-black)]",
                    brandBgColor: "bg-[var(--plexo-white)]",
                    brandBorderColor: "border-[var(--plexo-med-gray)]",
                };
            case Platform.GoogleMaps:
                return {
                    icon: (
                        <div className="w-10 h-10 bg-white shadow-sm rounded-2xl flex items-center justify-center border border-[var(--plexo-med-gray)]">
                            <svg className="w-6 h-6 text-[var(--plexo-black)]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                        </div>
                    ),
                    label: 'Google Maps',
                    actionColor: 'bg-[var(--plexo-dark-gray)] text-[var(--plexo-yellow)] hover:opacity-90 shadow-lg border border-[var(--plexo-dark-gray)]',
                    actionLabel: "Googleマップで返信する",
                    contentClasses: "text-[15px] text-[var(--plexo-black)] font-bold leading-relaxed tracking-tight",
                    wrapperClass: "max-w-[325px]",
                    brandTextColor: "text-[var(--plexo-black)]",
                    brandBgColor: "bg-[var(--plexo-white)]",
                    brandBorderColor: "border-[var(--plexo-med-gray)]",
                };
            case Platform.Line:
                return {
                    icon: (
                        <div className="w-10 h-10 bg-[var(--plexo-dark-gray)] rounded-2xl flex items-center justify-center text-[var(--plexo-yellow)] shadow-sm border border-[var(--plexo-dark-gray)]">
                            <LineIcon className="w-6 h-6" />
                        </div>
                    ),
                    label: 'LINE',
                    actionColor: "bg-[var(--plexo-dark-gray)] text-[var(--plexo-yellow)] shadow-[0\_10px_30px_rgba(102,102,102,0.3)]",
                    actionLabel: "LINEで送る",
                    contentClasses: "text-[15px] text-[var(--plexo-black)] font-bold leading-relaxed tracking-tight",
                    wrapperClass: "max-w-[400px]",
                    brandTextColor: "text-[var(--plexo-black)]",
                    brandBgColor: "bg-[var(--plexo-white)]",
                    brandBorderColor: "border-[var(--plexo-med-gray)]",
                    shine: true,
                };
            default:
                return {
                    icon: null,
                    label: platform,
                    actionColor: "bg-gradient-to-r from-[#111111] to-[#2D2D2D] text-white shadow-[0_10px_30px_rgba(0,0,0,0.15)]",
                    actionLabel: "投稿する",
                    contentClasses: "text-base text-[#111111] font-black",
                    brandTextColor: "text-[#111111]",
                    brandBgColor: "bg-[#FAFAFA]",
                    brandBorderColor: "border-[#E5E5E5]",
                    shine: true,
                };
        }
    };

    const getTabIcon = (p: Platform, isSelected: boolean) => {
        const iconClass = `w-4 h-4 transition-transform duration-300 ${isSelected ? "scale-110" : "opacity-30"}`;

        switch (p) {
            case Platform.Instagram:
                return (
                    <svg className={`${iconClass} ${isSelected ? 'text-[var(--plexo-yellow)]' : 'text-[var(--plexo-med-gray)]'}`} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                    </svg>
                );
            case Platform.X:
                return (
                    <svg className={`${iconClass} ${isSelected ? 'text-[var(--plexo-yellow)]' : 'text-[var(--plexo-med-gray)]'}`} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                );
            case Platform.GoogleMaps:
                return (
                    <svg className={`${iconClass} ${isSelected ? 'text-[var(--plexo-yellow)]' : 'text-[var(--plexo-med-gray)]'}`} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                );
            case Platform.Line:
                return <LineIcon className={`${iconClass} ${isSelected ? 'text-[var(--plexo-yellow)]' : 'text-[var(--plexo-med-gray)]'}`} />;
            default:
                return null;
        }
    };

    return (
        <>
            <div className={`space-y-8 animate-in fade-in duration-700 ${results.length === 0 ? 'hidden md:block' : ''}`}>

                {/* Main Results Container - Monochrome */}
                <div className="text-primary flex flex-col min-h-[600px] overflow-hidden group/main transition-all duration-700 w-full max-w-6xl mx-auto bg-white rounded-[48px] border border-[#E5E5E5] shadow-sm">

                    {/* Integrated Tab Navigation Header (Monochrome) */}
                    {results.length > 0 && (
                        <div className="flex items-center w-full border-b border-[#E5E5E5] bg-white">
                            {results.map((res, idx) => {
                                const isSelected = activeTab === idx;
                                const theme = getPlatformTheme(res.platform);
                                return (
                                    <div
                                        key={res.platform}
                                        onClick={() => onTabChange(idx)}
                                        className={`flex-1 py-5 flex items-center justify-center gap-1.5 md:gap-3 cursor-pointer transition-all duration-500 border-r border-[#E5E5E5] px-2 group
                                            ${isSelected
                                                ? 'bg-[var(--plexo-dark-gray)]'
                                                : 'hover:bg-[var(--bg-secondary)]'
                                            }`}
                                    >
                                        <div className={`transition-transform duration-500 ${isSelected ? 'scale-110' : 'scale-100 opacity-40 group-hover:opacity-70'}`}>
                                            {getTabIcon(res.platform, isSelected)}
                                        </div>
                                        <span className={`text-[10px] md:text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-500 truncate ${isSelected ? 'text-[var(--plexo-yellow)] translate-y-0' : 'text-[var(--plexo-med-gray)] translate-y-0.5'}`}>
                                            {theme.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Results Content Area */}
                    <div className="flex-1">
                        {results.length === 0 ? (
                            // Placeholder when no results (Monochrome)
                            <div className="p-12 h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-1000">
                                <h2 className="text-3xl tracking-[0.25em] text-center font-black text-[#111111] uppercase">プレビュー</h2>

                                <div className="space-y-6 max-w-sm">
                                    <div className="w-24 h-24 rounded-[32px] bg-[#FAFAFA] border-[3px] border-[#111111] shadow-[4px_4px_0px_0px_#111111] flex items-center justify-center text-[#111111]/20 mx-auto">
                                        <SparklesIcon className="w-12 h-12" />
                                    </div>
                                    <h3 className="text-xl tracking-widest font-black text-[#111111] uppercase">入力待ち</h3>
                                    <p className="text-[#999999] text-sm font-bold leading-relaxed">
                                        左側のフォームに内容やアイデアを入力して、<br />プロフェッショナルな投稿を瞬時に生成しましょう。
                                    </p>
                                </div>
                            </div>
                        ) : (
                            results.map((res, gIdx) => {
                                const theme = getPlatformTheme(res.platform);
                                return (
                                    <div key={res.platform} className={activeTab === gIdx ? 'block animate-in fade-in duration-700' : 'hidden'}>
                                        <div className={`divide-y border-[#E5E5E5]`}>
                                            {res.data.map((text, iIdx) => (
                                                <div key={iIdx} className={`py-12 px-8 lg:px-16 flex flex-col relative text-left transition-colors duration-700`}>

                                                    {/* Text Area Content Wrapper */}
                                                    <div className={`mb-2 relative group/textarea ${theme.wrapperClass || ''}`}>
                                                        {text ? (
                                                            <AutoResizingTextarea
                                                                value={text}
                                                                onChange={(e) => onManualEdit(gIdx, iIdx, e.target.value)}
                                                                className={`w-full bg-transparent focus:outline-none resize-none placeholder:text-[#CCCCCC] whitespace-pre-wrap overflow-hidden ${theme.contentClasses || 'text-base text-[#111111] font-bold'}`}
                                                                trigger={activeTab}
                                                            />
                                                        ) : (
                                                            <div className="py-4 text-[#CCCCCC] italic">コンテンツがありません</div>
                                                        )}
                                                    </div>

                                                    {/* Character Count (One level down, Right Aligned) */}
                                                    <div className="flex justify-end mb-6 opacity-40">
                                                        <CharCounter
                                                            platform={res.platform}
                                                            text={text}
                                                            config={{ platform: res.platform } as any}
                                                            minimal={true}
                                                            footerText={storeProfile.instagramFooter}
                                                        />
                                                    </div>

                                                    {/* Unified Action Layout */}
                                                    <div className="mt-auto pt-10 border-t border-[#E5E5E5]">
                                                        {/* Utility Row: Settings & Tools */}
                                                        <div className="flex items-center justify-between mb-8 gap-3">
                                                            {/* Left: Platform Specifics */}
                                                            <div className="flex items-center gap-2">
                                                                {theme.extra && theme.extra(gIdx, iIdx)}
                                                            </div>

                                                            {/* Right: Inspection */}
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => onCopy(text)}
                                                                    className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FAFAFA] text-[#999999] border border-[#E5E5E5] hover:bg-[#F5F5F5] hover:text-[#111111] transition-all active:scale-95"
                                                                    title="コピー"
                                                                >
                                                                    <CopyIcon className="w-5 h-5" />
                                                                </button>

                                                                {/* Refined Secondary Preview Button */}
                                                                <button
                                                                    onClick={() => setPreviewState({ isOpen: true, platform: res.platform, text, gIdx, iIdx })}
                                                                    className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FAFAFA] text-[#999999] border border-[#E5E5E5] hover:bg-[#F5F5F5] hover:text-[#111111] transition-all active:scale-95"
                                                                    title="プレビュー"
                                                                >
                                                                    <EyeIcon className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Primary Tier Actions */}
                                                        <div className="flex flex-col gap-5">
                                                            {/* Prominent Refine Button */}
                                                            <button
                                                                onClick={() => onRefineToggle(gIdx, iIdx)}
                                                                className={`flex items-center justify-center gap-4 py-6 rounded-[28px] text-[12px] font-black transition-all duration-500 uppercase tracking-[0.3em] overflow-hidden relative group
                                                                    ${refiningKey === `${gIdx}-${iIdx}`
                                                                        ? 'bg-gradient-to-r from-[#6366F1] to-[#A855F7] text-white shadow-[0_10px_25px_rgba(168,85,247,0.4)]'
                                                                        : 'bg-[#FAFAFA] text-[#999999] border border-[#E5E5E5] hover:bg-[#F5F5F5] hover:text-[#111111]'
                                                                    }`}
                                                            >
                                                                <MagicWandIcon className="w-5 h-5" />
                                                                <span>AIで内容を微調整する</span>
                                                            </button>

                                                            <button
                                                                onClick={() => {
                                                                    if (res.platform === Platform.Line) {
                                                                        const encodedText = encodeURIComponent(text);
                                                                        navigator.clipboard.writeText(text);
                                                                        window.location.href = `https://line.me/R/share?text=${encodedText}`;
                                                                    } else {
                                                                        onShare(res.platform, text);
                                                                    }
                                                                }}
                                                                className={`flex items-center justify-center gap-4 py-7 rounded-[40px] font-black text-[13px] md:text-sm transition-all duration-700 uppercase tracking-[0.3em] group mt-2 relative overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.15)] active:scale-[0.98] ${theme.actionColor}`}
                                                            >
                                                                {/* Dynamic Shine Overlay */}
                                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                                                <span className="relative z-10">{theme.actionLabel}</span>
                                                                <ExternalLinkIcon className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform relative z-10" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Refinement Overlay (per variant) - Monochrome */}
                                                    {refiningKey === `${gIdx}-${iIdx}` && (
                                                        <div className="absolute inset-0 bg-white/90 backdrop-blur-xl z-20 flex flex-col p-12 animate-in fade-in zoom-in duration-500 rounded-[54px] border border-[#E5E5E5] shadow-2xl">
                                                            <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
                                                                <div className="mb-10 text-center space-y-5">
                                                                    <div className="w-20 h-20 bg-[#111111] text-white rounded-[28px] flex items-center justify-center shadow-xl border border-white/10 mx-auto">
                                                                        <MagicWandIcon className="w-10 h-10" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="text-[10px] font-black text-[#999999] uppercase tracking-[0.4em] mb-2">AI Refinement</h4>
                                                                        <p className="text-2xl font-black text-[#111111] leading-tight tracking-tight">How can I improve it?</p>
                                                                    </div>
                                                                </div>

                                                                <div className="w-full">
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
            </div>

            {/* Preview Modal */}
            {previewState && (
                <PostPreviewModal
                    isOpen={previewState.isOpen}
                    onClose={() => setPreviewState(null)}
                    platform={previewState.platform}
                    text={previewState.text}
                    storeProfile={storeProfile}
                    onChange={(newText) => {
                        // Update the local preview state so the modal stays in sync
                        setPreviewState(prev => prev ? { ...prev, text: newText } : null);

                        // Use the stored indices for reliable updates
                        onManualEdit(previewState.gIdx, previewState.iIdx, newText);
                    }}
                />
            )}
        </>
    );
};

export default PostResultTabs;
