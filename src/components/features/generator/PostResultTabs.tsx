import React from 'react';
import { Platform, GeneratedResult, GenerationConfig, StoreProfile } from '../../../types';
import { getPlatformIcon, insertInstagramFooter, removeInstagramFooter } from './utils';
import { CharCounter } from './CharCounter';
import { AutoResizingTextarea } from './AutoResizingTextarea';
import { RefinePanel } from './RefinePanel';
import { PostPreviewModal } from './PostPreviewModal';
import { CopyIcon, CrownIcon, MagicWandIcon, RotateCcwIcon, ExternalLinkIcon, EyeIcon, SparklesIcon, StarIcon } from '../../Icons';
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
    favorites: Set<string>;
    onToggleFavorite: (text: string, platform: Platform, presetId: string | null) => Promise<void>;
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
    favorites,
    onToggleFavorite,
}) => {
    const [previewState, setPreviewState] = React.useState<{ isOpen: boolean, platform: Platform, text: string } | null>(null);

    const getPlatformTheme = (platform: Platform) => {
        switch (platform) {
            case Platform.X:
                return {
                    icon: <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white text-xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-white">𝕏</div>,
                    label: 'X (Twitter)',
                    actionColor: "bg-black hover:bg-black/80 active:scale-[0.98]",
                    actionLabel: "Xで投稿する",
                    contentClasses: "text-[16px] text-black font-bold leading-relaxed tracking-tight",
                    wrapperClass: "max-w-[375px]",
                    brandTextColor: "text-black",
                    brandBgColor: "bg-black/5",
                    brandBorderColor: "border-black/10",
                };
            case Platform.Instagram:
                return {
                    icon: (
                        <div className="w-10 h-10 bg-[#E88BA3] rounded-2xl flex items-center justify-center text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
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
                            className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-[11px] font-black border-2 ${includeFooter
                                ? 'bg-[#9B8FD4] text-black border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                                : 'bg-black/5 text-black/40 border-black/10'
                                }`}
                        >
                            <span className={`w-2 h-2 rounded-full transition-colors ${includeFooter ? 'bg-black' : 'bg-black/20'}`} />
                            <span className="tracking-widest uppercase">店舗情報を表示</span>
                        </button>
                    ),
                    actionColor: "bg-[#E88BA3] hover:bg-[#E88BA3]/90 active:scale-[0.98] text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                    actionLabel: "Instagramを起動",
                    contentClasses: "text-[15px] text-black font-bold leading-relaxed tracking-tight",
                    wrapperClass: "max-w-[340px]",
                    brandTextColor: "text-[#E88BA3]",
                    brandBgColor: "bg-[#E88BA3]/5",
                    brandBorderColor: "border-[#E88BA3]/10",
                };
            case Platform.GoogleMaps:
                return {
                    icon: (
                        <div className="w-10 h-10 bg-[#4DB39A] rounded-2xl flex items-center justify-center text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                        </div>
                    ),
                    label: 'Google Maps',
                    actionColor: "bg-[#4DB39A] hover:bg-[#4DB39A]/90 active:scale-[0.98] text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                    actionLabel: "Googleマップで返信する",
                    contentClasses: "text-[15px] text-black font-bold leading-relaxed tracking-tight",
                    wrapperClass: "max-w-[325px]",
                    brandTextColor: "text-[#4DB39A]",
                    brandBgColor: "bg-[#4DB39A]/5",
                    brandBorderColor: "border-[#4DB39A]/10",
                };
            default:
                return {
                    icon: null,
                    label: platform,
                    actionColor: 'bg-black text-white hover:bg-black/80',
                    actionLabel: '投稿する',
                    contentClasses: "text-base text-black font-black",
                    brandTextColor: "text-black",
                    brandBgColor: "bg-black/5",
                    brandBorderColor: "border-black/10",
                };
        }
    };

    const getTabIcon = (p: Platform, isSelected: boolean) => {
        const iconClass = `w-4 h-4 transition-transform duration-300 ${isSelected ? "scale-110" : "opacity-30"}`;

        switch (p) {
            case Platform.Instagram:
                return (
                    <svg className={`${iconClass} text-brand-instagram`} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                    </svg>
                );
            case Platform.X:
                return (
                    <svg className={`${iconClass} text-slate-950`} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                );
            case Platform.GoogleMaps:
                return (
                    <svg className={`${iconClass} text-brand-green`} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className={`space-y-8 animate-in fade-in duration-700 ${results.length === 0 ? 'hidden md:block' : ''}`}>

                {/* Main Results Container - Tabs Integrated Inside */}
                <div className="section-card text-primary rounded-[48px] flex flex-col min-h-[600px] overflow-hidden group/main transition-all duration-500">

                    {/* Integrated Tab Navigation Header */}
                    {results.length > 0 && (
                        <div className="flex items-center w-full border-b-[2px] border-black">
                            {results.map((res, idx) => {
                                const isSelected = activeTab === idx;
                                const theme = getPlatformTheme(res.platform); // Get theme for the current platform
                                return (
                                    <div
                                        key={res.platform}
                                        onClick={() => onTabChange(idx)}
                                        className={`flex-1 py-4 flex items-center justify-center gap-3 cursor-pointer transition-all duration-300 border-r-[2px] last:border-r-0 border-black
                                            ${isSelected
                                                ? `bg-black/5`
                                                : 'bg-white hover:bg-black/5'
                                            }`}
                                    >
                                        {getTabIcon(res.platform, isSelected)}
                                        <span className={`text-[11px] font-black tracking-[0.2em] uppercase transition-colors ${isSelected ? 'text-black' : 'text-black/30'}`}>
                                            {res.platform === Platform.X ? 'X (Twitter)' : res.platform}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Results Content Area */}
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        {results.length === 0 ? (
                            // Placeholder when no results
                            <div className="p-12 h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-1000">
                                <h2 className="text-3xl font-black text-black uppercase tracking-[0.25em] text-center">プレビュー (ライブプレビュー)</h2>

                                <div className="space-y-6 max-w-sm">
                                    <div className="w-24 h-24 rounded-[32px] bg-black/5 border-[3px] border-black flex items-center justify-center text-black/20 mx-auto">
                                        <SparklesIcon className="w-12 h-12" />
                                    </div>
                                    <h3 className="text-xl font-black text-black uppercase tracking-widest">入力待ち</h3>
                                    <p className="text-black/40 text-sm font-bold leading-relaxed">
                                        左側のフォームに内容やアイデアを入力して、<br />プロフェッショナルな投稿を瞬時に生成しましょう。
                                    </p>
                                </div>
                            </div>
                        ) : (
                            results.map((res, gIdx) => {
                                const theme = getPlatformTheme(res.platform);
                                return (
                                    <div key={res.platform} className={activeTab === gIdx ? 'block animate-in fade-in duration-500' : 'hidden'}>
                                        <div className={`divide-y-[2px] ${theme.brandBorderColor?.replace('border', 'divide') || 'divide-black/10'}`}>
                                            {res.data.map((text, iIdx) => (
                                                <div key={iIdx} className="py-10 px-8 lg:px-12 flex flex-col relative text-left bg-white transition-colors duration-500">

                                                    {/* Text Area Content Wrapper */}
                                                    <div className={`mb-8 ${theme.wrapperClass || ''}`}>
                                                        <AutoResizingTextarea
                                                            value={text}
                                                            onChange={(e) => onManualEdit(gIdx, iIdx, e.target.value)}
                                                            className={`w-full bg-transparent focus:outline-none resize-none placeholder:text-black/10 whitespace-pre-wrap ${theme.contentClasses || 'text-base text-black font-bold'}`}
                                                            trigger={activeTab}
                                                        />
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 pt-8 border-t-[2px] border-black/5">
                                                        <div className="flex-1 flex items-center gap-3">
                                                            {theme.extra && theme.extra(gIdx, iIdx)}
                                                            <FavoriteButton
                                                                platform={res.platform}
                                                                text={text}
                                                                presetId={presetId || null}
                                                                isFavorited={favorites.has(text.trim())}
                                                                onToggle={onToggleFavorite}
                                                            />
                                                        </div>
                                                        <div className="bg-black/5 px-4 py-1.5 rounded-xl border border-black/10">
                                                            <CharCounter
                                                                platform={res.platform}
                                                                text={text}
                                                                config={{ platform: res.platform } as any}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Actions Grid */}
                                                    <div className="flex flex-col gap-6">
                                                        <button
                                                            onClick={() => setPreviewState({ isOpen: true, platform: res.platform, text })}
                                                            className="flex items-center justify-center gap-3 py-5 rounded-[24px] bg-black/5 text-[11px] font-black text-black/60 border-2 border-black/10 hover:border-black hover:text-black hover:bg-white transition-all uppercase tracking-[0.2em]"
                                                        >
                                                            <EyeIcon className="w-5 h-5" />
                                                            <span>ライブプレビュー</span>
                                                        </button>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <button
                                                                onClick={() => onRegenerateSingle(res.platform)}
                                                                className="flex items-center justify-center gap-3 py-5 rounded-[24px] bg-white border-2 border-black/10 text-[11px] font-black text-black/40 hover:text-black hover:border-black transition-all uppercase tracking-[0.2em]"
                                                            >
                                                                <RotateCcwIcon className="w-5 h-5" />
                                                                <span>再生成</span>
                                                            </button>
                                                            <button
                                                                onClick={() => onRefineToggle(gIdx, iIdx)}
                                                                className={`flex items-center justify-center gap-3 py-5 rounded-[24px] text-[11px] font-black transition-all uppercase tracking-[0.2em] border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${refiningKey === `${gIdx}-${iIdx}` ? 'bg-[#9B8FD4] border-black text-black' : 'bg-white text-black/40 border-black/10 hover:border-black hover:text-black'}`}
                                                            >
                                                                <MagicWandIcon className="w-5 h-5" />
                                                                <span>AI微調整</span>
                                                            </button>
                                                        </div>

                                                        <button
                                                            onClick={() => onShare(res.platform, text)}
                                                            className={`flex items-center justify-center gap-4 py-8 rounded-[32px] font-black text-lg transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase tracking-[0.3em] group border-[3px] border-black ${theme.actionColor}`}
                                                        >
                                                            <span>{theme.actionLabel}</span>
                                                            <ExternalLinkIcon className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                        </button>
                                                    </div>

                                                    {/* Refinement Overlay (per variant) */}
                                                    {refiningKey === `${gIdx}-${iIdx}` && (
                                                        <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 flex flex-col p-12 animate-in fade-in zoom-in duration-300 rounded-[45px] border-2 border-black/5">
                                                            <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
                                                                <div className="mb-10 text-center space-y-4">
                                                                    <div className="w-20 h-20 bg-white rounded-[24px] flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black mx-auto">
                                                                        <MagicWandIcon className="w-10 h-10 text-black" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="text-[11px] font-black text-black/40 uppercase tracking-[0.3em] mb-2">AI個別微調整</h4>
                                                                        <p className="text-2xl font-black text-black leading-tight">修正内容を教えてください</p>
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
                />
            )}
        </>
    );
};

const FavoriteButton = ({
    platform, text, presetId, isFavorited, onToggle
}: {
    platform: Platform, text: string, presetId: string | null, isFavorited: boolean, onToggle: (text: string, platform: Platform, presetId: string | null) => Promise<void>
}) => {
    const [isLoading, setIsLoading] = React.useState(false);

    const handleToggle = async () => {
        if (isLoading) return;

        if (presetId === undefined) {
            alert("プリセットが取得できていないため保存できません");
            return;
        }

        setIsLoading(true);
        try {
            await onToggle(text, platform, presetId);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            className={`group flex items-center gap-2 px-3 py-2 rounded-xl transition-all border-2 shadow-sm ${isFavorited
                ? 'bg-[#F5CC6D] text-black border-black/10'
                : 'bg-black/5 text-black/40 border-black/5 hover:border-black/20 hover:text-black'
                }`}
            title={isFavorited ? "お気に入り解除" : "お気に入り（学習データに追加）"}
            disabled={isLoading}
        >
            <StarIcon
                className={`w-4 h-4 transition-all duration-300 ${isFavorited ? 'fill-black text-black scale-110' : 'text-black/20 group-hover:text-black'}`}
            />
            {isFavorited && <span className="text-[10px] font-black animate-in fade-in slide-in-from-left-2 tracking-widest uppercase">保存済み</span>}
        </button>
    );
};

export default PostResultTabs;
