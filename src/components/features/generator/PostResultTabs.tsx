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
    const [previewState, setPreviewState] = React.useState<{ isOpen: boolean, platform: Platform, text: string } | null>(null);

    const getPlatformTheme = (platform: Platform) => {
        switch (platform) {
            case Platform.X:
                return {
                    icon: <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white text-xl">𝕏</div>,
                    label: 'X (Twitter)',
                    actionColor: 'bg-black hover:bg-gray-900',
                    actionLabel: 'Xで投稿する',
                    contentClasses: "text-[15px] text-[#0f1419] font-normal leading-[1.5] tracking-normal",
                    wrapperClass: "max-w-[375px]",
                };
            case Platform.Instagram:
                return {
                    icon: (
                        <div className="w-10 h-10 bg-gradient-to-tr from-[#FFDC80] via-[#FD1D1D] to-[#C13584] rounded-xl flex items-center justify-center text-white">
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
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-[11px] font-bold border ${includeFooter
                                ? 'bg-pink-50 text-pink-600 border-pink-100 shadow-sm'
                                : 'bg-gray-50 text-gray-400 border-gray-100'
                                }`}
                        >
                            <span className={`w-2 h-2 rounded-full transition-colors ${includeFooter ? 'bg-pink-500 animate-pulse' : 'bg-gray-300'}`} />
                            <span>店舗情報を表示</span>
                        </button>
                    ),
                    actionColor: 'bg-gradient-to-r from-[#FF8C37] via-[#DC2743] to-[#BC1888] hover:opacity-90',
                    actionLabel: 'Instagramを起動',
                    contentClasses: "text-[14px] text-[#262626] font-normal leading-relaxed tracking-normal",
                    wrapperClass: "max-w-[340px]",
                };
            case Platform.GoogleMaps:
                return {
                    icon: (
                        <div className="w-10 h-10 bg-[#34A853] rounded-xl flex items-center justify-center text-white">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                        </div>
                    ),
                    label: 'Google Maps',
                    actionColor: 'bg-[#0F9D58] hover:bg-[#0B8043]',
                    actionLabel: 'Googleマップで返信する',
                    contentClasses: "text-[14px] text-[#3c4043] font-normal leading-relaxed tracking-normal",
                    wrapperClass: "max-w-[325px]",
                };
            default:
                return {
                    icon: null,
                    label: platform,
                    actionColor: 'bg-indigo-600',
                    actionLabel: '投稿する',
                    contentClasses: "text-base text-gray-800 font-medium",
                };
        }
    };

    return (
        <>
            <div className="space-y-8 animate-in fade-in duration-700">
                {/* Tab Navigation */}
                <div className="flex items-center gap-2 p-1.5 bg-gray-100/80 backdrop-blur-sm rounded-2xl w-fit mx-auto lg:mx-0 border border-gray-200 shadow-inner">
                    {results.map((res, idx) => {
                        const isSelected = activeTab === idx;
                        const iconClass = "w-4 h-4 transition-transform duration-300 " + (isSelected ? "scale-110" : "opacity-60");

                        let icon = null;
                        if (res.platform === Platform.Instagram) {
                            icon = (
                                <svg className={`${iconClass} text-pink-500`} viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                                </svg>
                            );
                        } else if (res.platform === Platform.X) {
                            icon = (
                                <svg className={`${iconClass} text-black`} viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            );
                        } else if (res.platform === Platform.GoogleMaps) {
                            icon = (
                                <svg className={`${iconClass} text-green-600`} viewBox="0 0 24 24" fill="currentColor">
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
                <div className="">
                    {results.length === 0 ? (
                        // Placeholder when no results
                        <div className="block animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="flex items-center gap-3 mb-6 px-1">
                                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-[#111827]">生成結果</h2>
                            </div>

                            <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm flex flex-col min-h-[400px] overflow-hidden p-8">
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center space-y-4 max-w-md">
                                        <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 mx-auto">
                                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-700">ここに作成した文章が表示されます</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">左側のフォームに入力して「投稿文を作成する」ボタンを押してください。</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        results.map((res, gIdx) => {
                            const theme = getPlatformTheme(res.platform);
                            return (
                                <div key={res.platform} className={activeTab === gIdx ? 'block animate-in fade-in slide-in-from-bottom-2 duration-500' : 'hidden'}>
                                    <div className="space-y-8">
                                        {res.data.map((text, iIdx) => (
                                            <div key={iIdx} className="group relative bg-white border border-gray-100 rounded-[32px] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col min-h-[400px] overflow-hidden p-8">
                                                {/* Text Area */}
                                                <div className={`flex-1 overflow-y-auto mb-6 custom-scrollbar ${theme.wrapperClass || ''}`}>
                                                    <AutoResizingTextarea
                                                        value={text}
                                                        onChange={(e) => onManualEdit(gIdx, iIdx, e.target.value)}
                                                        className={`w-full bg-transparent focus:outline-none resize-none placeholder:text-gray-300 whitespace-pre-wrap ${theme.contentClasses || 'text-base text-gray-800'}`}
                                                        trigger={activeTab}
                                                    />
                                                </div>

                                                {/* Meta Row: Toggle & Char Count */}
                                                <div className="flex items-center justify-between mb-6 min-h-[32px]">
                                                    <div className="flex-1">
                                                        {theme.extra && theme.extra(gIdx, iIdx)}
                                                    </div>
                                                    <CharCounter
                                                        platform={res.platform}
                                                        text={text}
                                                        config={{ platform: res.platform } as any}
                                                    />
                                                </div>

                                                {/* Actions */}
                                                <div className="space-y-3">
                                                    <button
                                                        onClick={() => setPreviewState({ isOpen: true, platform: res.platform, text })}
                                                        className="w-full flex items-center justify-center gap-2 py-4 rounded-[20px] bg-[#F3F6F9] text-sm font-bold text-gray-700 hover:bg-[#EAEFF4] transition-all"
                                                    >
                                                        <EyeIcon className="w-5 h-5" />
                                                        <span>プレビューを確認</span>
                                                    </button>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <button
                                                            onClick={() => onRegenerateSingle(res.platform)}
                                                            className="flex items-center justify-center gap-2 py-4 rounded-[20px] border border-gray-100 bg-white text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                                                        >
                                                            <RotateCcwIcon className="w-5 h-5 text-gray-400" />
                                                            <span>Retry</span>
                                                        </button>
                                                        <button
                                                            onClick={() => onRefineToggle(gIdx, iIdx)}
                                                            className={`flex items-center justify-center gap-2 py-4 rounded-[20px] border text-sm font-bold transition-all ${refiningKey === `${gIdx}-${iIdx}` ? 'bg-[#5B5FEF] border-[#5B5FEF] text-white shadow-lg' : 'bg-[#FFFBEB] border-[#FEF3C7] text-[#B78822] hover:bg-[#FFF8E1]'}`}
                                                        >
                                                            <MagicWandIcon className={`w-5 h-5 ${refiningKey === `${gIdx}-${iIdx}` ? 'text-white' : 'text-[#D9AC42]'}`} />
                                                            <span>Refine</span>
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => onShare(res.platform, text)}
                                                        className={`w-full flex items-center justify-center gap-2 py-5 rounded-[20px] text-white font-bold text-base transition-all shadow-lg ${theme.actionColor}`}
                                                    >
                                                        <span>{theme.actionLabel}</span>
                                                        <ExternalLinkIcon className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                {/* AI Refinement Overlay */}
                                                {refiningKey === `${gIdx}-${iIdx}` && (
                                                    <div className="absolute inset-0 bg-[#0F172A]/90 backdrop-blur-md z-20 flex flex-col p-8 animate-in fade-in duration-300 rounded-[32px]">
                                                        <div className="flex-1 overflow-y-auto">
                                                            <div className="mb-6">
                                                                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Refine Post</h4>
                                                                <p className="text-xl font-bold text-white">AIへの追加指示（日本語でOK）</p>
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
        </>
    );
};

