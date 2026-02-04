import React from 'react';
import { Platform, GeneratedResult, GenerationConfig, StoreProfile } from '../../../types';
import { getPlatformIcon, insertInstagramFooter, removeInstagramFooter } from './utils';
import { CharCounter } from './CharCounter';
import { AutoResizingTextarea } from './AutoResizingTextarea';
import { RefinePanel } from './RefinePanel';
import { PostPreviewModal } from './PostPreviewModal';
import { CopyIcon, CrownIcon, MagicWandIcon, RotateCcwIcon, ExternalLinkIcon, EyeIcon, SparklesIcon, LineIcon, CloseIcon } from '../../Icons';

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

    // Debug: Log results structure when component receives data
    React.useEffect(() => {
        if (results && results.length > 0 && process.env.NODE_ENV === 'development') {
            console.group('📊 PostResultTabs - Results Data');
            console.log('Total results:', results.length);
            console.log('Results structure:', results.map((r, idx) => ({
                index: idx,
                platform: r.platform,
                dataCount: r.data?.length || 0,
                dataSample: r.data?.[0]?.substring(0, 50) + '...'
            })));
            console.log('Active tab:', activeTab);
            console.groupEnd();
        }
    }, [results, activeTab]);

    const getPlatformTheme = (platform: Platform) => {
        switch (platform) {
            case Platform.X:
                return {
                    icon: <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white text-xl font-black shadow-sm border border-white/10">𝕏</div>,
                    label: 'X',
                    actionColor: "bg-[var(--brand-primary)] text-white shadow-[0_8px_20px_rgba(0,0,0,0.1)]",
                    actionLabel: "Xで投稿する",
                    contentClasses: "text-[16px] text-white font-bold leading-relaxed tracking-tight",
                    wrapperClass: "max-w-[375px]",
                    brandTextColor: "text-white",
                    brandBgColor: "bg-white/5",
                    brandBorderColor: "border-white/10",
                    activeColor: "#FFFFFF"
                };
            case Platform.Instagram:
                return {
                    icon: (
                        <div className="w-10 h-10 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-2xl flex items-center justify-center text-white shadow-sm border border-white/10">
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
                                ? 'bg-[#E1306C] text-white border-transparent shadow-md'
                                : 'bg-[#2B2B2F] text-[#A0A0A0] border-white/10'
                                }`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full transition-colors ${includeFooter ? 'bg-white shadow-[0_0_8px_white]' : 'bg-[#A0A0A0]'}`} />
                            <span className="font-bold">店舗情報を含める</span>
                        </button>
                    ),
                    actionColor: "bg-[var(--brand-primary)] text-white shadow-[0_8px_25px_rgba(0,0,0,0.1)]",
                    actionLabel: "Instagramを起動",
                    contentClasses: "text-[16px] text-white font-medium leading-relaxed",
                    wrapperClass: "max-w-[340px]",
                    brandTextColor: "text-[#E1306C]",
                    brandBgColor: "bg-[#E1306C]/10",
                    brandBorderColor: "border-[#E1306C]/20",
                    activeColor: "#E1306C"
                };
            case Platform.GoogleMaps:
                return {
                    icon: (
                        <div className="w-10 h-10 bg-[#2B2B2F] shadow-sm rounded-2xl flex items-center justify-center border border-white/10">
                            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                        </div>
                    ),
                    label: 'Google Maps',
                    actionColor: 'bg-[var(--brand-primary)] text-white hover:opacity-90 shadow-[0_8px_20px_rgba(0,0,0,0.1)] border-none',
                    actionLabel: "Googleマップで返信する",
                    contentClasses: "text-[16px] text-white font-medium leading-relaxed",
                    wrapperClass: "max-w-[325px]",
                    brandTextColor: "text-[#4285F4]",
                    brandBgColor: "bg-[#4285F4]/10",
                    brandBorderColor: "border-[#4285F4]/20",
                    activeColor: "#4285F4"
                };
            case Platform.Line:
                return {
                    icon: (
                        <div className="w-10 h-10 bg-[#06C755] rounded-2xl flex items-center justify-center text-white shadow-sm border border-[#06C755]/10">
                            <LineIcon className="w-6 h-6" />
                        </div>
                    ),
                    label: 'LINE',
                    actionColor: "bg-[var(--brand-primary)] text-white shadow-[0_8px_20px_rgba(0,0,0,0.1)]",
                    actionLabel: "LINEで送る",
                    contentClasses: "text-[16px] text-white font-medium leading-relaxed",
                    wrapperClass: "max-w-full sm:max-w-[400px]",
                    brandTextColor: "text-[#06C755]",
                    brandBgColor: "bg-[#06C755]/10",
                    brandBorderColor: "border-[#06C755]/20",
                    activeColor: "#06C755",
                    shine: true,
                };
            default:
                return {
                    icon: null,
                    label: platform,
                    actionColor: "bg-[var(--brand-primary)] text-white shadow-[0_8px_20px_rgba(0,0,0,0.1)]",
                    actionLabel: "投稿する",
                    contentClasses: "text-base text-white font-black",
                    brandTextColor: "text-white",
                    brandBgColor: "bg-[#2B2B2F]",
                    brandBorderColor: "border-white/10",
                    activeColor: "#ffffff",
                    shine: true,
                };
        }
    };

    const getTabIcon = (p: Platform, isSelected: boolean) => {
        const iconClass = `w-5 h-5 transition-transform duration-300 ${isSelected ? "scale-110" : "opacity-30"}`;
        const theme = getPlatformTheme(p);
        const activeColor = (theme as any).activeColor || "currentColor";

        switch (p) {
            case Platform.Instagram:
                return (
                    <svg className={iconClass} viewBox="0 0 24 24" fill={isSelected ? activeColor : "currentColor"}>
                        <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                    </svg>
                );
            case Platform.X:
                return (
                    <svg className={iconClass} viewBox="0 0 24 24" fill={isSelected ? "white" : "currentColor"}>
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                );
            case Platform.GoogleMaps:
                return (
                    <svg className={iconClass} viewBox="0 0 24 24" fill={isSelected ? "#4285F4" : "currentColor"}>
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                );
            case Platform.Line:
                return <LineIcon className={iconClass} isActive={isSelected} color={isSelected ? "#06C755" : "currentColor"} activeTextFill="white" />;
            default:
                return null;
        }
    };

    return (
        <>
            {refiningKey ? (
                /* 
                 * EXCLUSIVE REFINE MODE
                 * Hide everything else and focus purely on AI Refinement
                 */
                <div className="flex-1 p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {(() => {
                        const [gIdx, iIdx] = refiningKey.split('-').map(Number);
                        return (
                            <RefinePanel
                                refineText={refineText}
                                onRefineTextChange={onRefineTextChange}
                                onRefine={() => onPerformRefine(gIdx, iIdx)}
                                onCancel={() => onRefineToggle(gIdx, iIdx)}
                                isRefining={isRefining}
                            />
                        );
                    })()}
                </div>
            ) : (
                <div className={`space-y-8 animate-in fade-in duration-700 ${results.length === 0 ? 'hidden md:block' : ''}`}>
                    {/* Main Results Container - Premium Layout */}
                    <div className="text-white flex flex-col min-h-[600px] overflow-visible group/main transition-all duration-700 w-full max-w-6xl mx-auto bg-[#1E1E24] rounded-[54px] border border-white/5 shadow-premium relative overflow-hidden">

                        {/* Background Decor in Container */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--pop-violet-main)]/5 rounded-full blur-[60px] pointer-events-none" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[var(--pop-violet-accent-a)]/5 rounded-full blur-[60px] pointer-events-none" />

                        {/* Integrated Tab Navigation Header (Premium Light) */}
                        {results.length > 0 && (
                            <div className="flex items-center w-full border-b border-white/5 bg-[#1E1E24] py-2 px-2 overflow-x-auto no-scrollbar">
                                {results.map((res, idx) => {
                                    const isSelected = activeTab === idx;
                                    const theme = getPlatformTheme(res.platform);
                                    const activeColor = (theme as any).activeColor || "#ffffff";

                                    return (
                                        <div
                                            key={res.platform}
                                            onClick={() => onTabChange(idx)}
                                            className={`flex-1 min-w-[100px] py-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 relative mx-1
                                                ${isSelected ? 'opacity-100' : 'opacity-40 hover:opacity-60'}`}
                                        >
                                            <div className={`transition-transform duration-300 ${isSelected ? 'scale-110' : 'scale-100'}`}>
                                                {getTabIcon(res.platform, isSelected)}
                                            </div>

                                            {/* Premium Indicator Bar */}
                                            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-1 rounded-full bg-current transition-all duration-500
                                                ${isSelected ? 'w-8 opacity-100' : 'w-0 opacity-0'}
                                            `} style={{ color: activeColor }} />
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Results Content Area */}
                        <div className="flex-1">
                            {results.length === 0 ? (
                                <div className="p-12 h-full flex flex-col items-center justify-center text-center space-y-10 animate-in fade-in zoom-in-95 duration-1000">
                                    <div className="relative">
                                        <div className="w-32 h-32 rounded-[42px] bg-[var(--pop-violet-card)] flex items-center justify-center text-[var(--pop-violet-main)] mx-auto relative z-10 border border-white/10">
                                            <SparklesIcon className="w-16 h-16 animate-pulse-gentle text-[#FFD166]" />
                                        </div>
                                        <div className="absolute inset-0 bg-[var(--pop-violet-main)]/10 blur-[40px] rounded-full animate-pulse-slow scale-150 -z-10" />
                                    </div>
                                    <div className="space-y-4 max-w-sm">
                                        <h2 className="text-xs tracking-[0.4em] font-black text-[var(--pop-violet-main)] uppercase">Ready to Shine</h2>
                                        <h3 className="text-3xl font-black text-white tracking-tighter">AIが最高の投稿を<br />準備しています</h3>
                                        <p className="text-[#A0A0A0] text-sm font-medium leading-relaxed">
                                            左側のフォームを入力して、<br />魔法のようなコンテンツを生成しましょう。
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                results.map((res, gIdx) => {
                                    const theme = getPlatformTheme(res.platform);
                                    const isActive = Number(activeTab) === Number(gIdx);
                                    return (
                                        <div
                                            key={`${res.platform}-${gIdx}`}
                                            style={{ display: isActive ? 'block' : 'none' }}
                                            className={isActive ? 'animate-in fade-in duration-700' : ''}
                                        >
                                            <div className="divide-y border-white/5">
                                                {res.data.map((text, iIdx) => (
                                                    <div key={iIdx} className="py-12 px-8 lg:px-12 flex flex-col relative text-left transition-colors duration-700">
                                                        <div className={`mb-2 relative group/textarea ${theme.wrapperClass || ''}`}>
                                                            {text ? (
                                                                <AutoResizingTextarea
                                                                    value={text}
                                                                    onChange={(e) => onManualEdit(gIdx, iIdx, e.target.value)}
                                                                    className={`w-full bg-transparent focus:outline-none resize-none placeholder:text-[#666666] whitespace-pre-wrap overflow-visible ${theme.contentClasses || 'text-base text-white font-bold'}`}
                                                                    trigger={activeTab}
                                                                />
                                                            ) : (
                                                                <div className="py-4 text-[#666666] italic">コンテンツがありません</div>
                                                            )}
                                                        </div>

                                                        <div className="flex justify-end mb-6 opacity-40">
                                                            <CharCounter
                                                                platform={res.platform}
                                                                text={text}
                                                                config={{ platform: res.platform } as any}
                                                                minimal={true}
                                                                footerText={storeProfile.instagramFooter}
                                                            />
                                                        </div>

                                                        <div className="mt-auto pt-10 border-t border-white/5">
                                                            <div className="flex items-center justify-between mb-8 gap-3">
                                                                <div className="flex items-center gap-2">
                                                                    {theme.extra && theme.extra(gIdx, iIdx)}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        onClick={() => onCopy(text)}
                                                                        className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#2B2B2F] text-[#A0A0A0] border border-white/10 hover:bg-[#2B2B2F] hover:text-[var(--pop-violet-main)] hover:border-[var(--pop-violet-main)]/50 hover:shadow-lg hover:shadow-[var(--pop-violet-main)]/5 transition-all active:scale-[0.92] shadow-sm"
                                                                        title="コピー"
                                                                    >
                                                                        <CopyIcon className="w-5 h-5" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setPreviewState({ isOpen: true, platform: res.platform, text, gIdx, iIdx })}
                                                                        className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#2B2B2F] text-[#A0A0A0] border border-white/10 hover:bg-[#2B2B2F] hover:text-[var(--pop-violet-main)] hover:border-[var(--pop-violet-main)]/50 hover:shadow-lg hover:shadow-[var(--pop-violet-main)]/5 transition-all active:scale-[0.92] shadow-sm"
                                                                        title="プレビュー"
                                                                    >
                                                                        <EyeIcon className="w-5 h-5" />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col gap-4">
                                                                <button
                                                                    onClick={() => onRefineToggle(gIdx, iIdx)}
                                                                    className="flex items-center justify-center gap-3 py-5 rounded-full text-[13px] font-black tracking-widest transition-all duration-300 relative group bg-[#2B2B2F] text-[#A0A0A0] border border-white/10 active:scale-[0.98] shadow-sm hover:border-[var(--pop-violet-main)]/40 hover:text-[var(--pop-violet-main)] overflow-hidden"
                                                                >
                                                                    <div className="absolute inset-0 bg-gradient-shine opacity-0 group-hover:opacity-10 group-hover:animate-shine pointer-events-none" />
                                                                    <MagicWandIcon className="w-5 h-5 transition-transform group-hover:rotate-12" />
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
                                                                    className={`flex items-center justify-center gap-3 py-5 rounded-full font-black text-[14px] uppercase tracking-[0.2em] transition-all duration-500 group mt-1 relative overflow-hidden active:scale-[0.98] shadow-xl ${theme.actionColor} shadow-[var(--pop-violet-main)]/20`}
                                                                >
                                                                    <div className="absolute inset-0 bg-gradient-shine opacity-20 group-hover:animate-shine pointer-events-none" />
                                                                    <span className="relative z-10 drop-shadow-sm">{theme.actionLabel}</span>
                                                                    <ExternalLinkIcon className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform relative z-10" />
                                                                </button>
                                                            </div>
                                                        </div>
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
            )}

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
