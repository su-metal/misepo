import React from 'react';
import { Platform, PostPurpose, GoogleMapPurpose } from '../../../types';
import { AutoResizingTextarea } from './AutoResizingTextarea';
import { getPlatformIcon } from './utils';
import {
    AutoSparklesIcon, MagicWandIcon, MicIcon, EraserIcon, InfoIcon,
    SparklesIcon, RotateCcwIcon, InstagramIcon, LineIcon, GoogleMapsIcon, ChevronRightIcon,
    MicIcon as MicIconLucide
} from '../../Icons';
import {
    PostInputFormProps, renderAvatar, PURPOSES, GMAP_PURPOSES, TONES, LENGTHS
} from './inputConstants';
import { PostResultTabs } from './PostResultTabs';

export const MobilePostInput: React.FC<PostInputFormProps> = ({
    platforms, activePlatform, isMultiGen, onPlatformToggle, onToggleMultiGen, onSetActivePlatform,
    platform, postPurpose, gmapPurpose, onPostPurposeChange, onGmapPurposeChange,
    tone, onToneChange, length, onLengthChange, inputText, onInputTextChange,
    starRating, onStarRatingChange, includeEmojis, onIncludeEmojisChange,
    includeSymbols, onIncludeSymbolsChange, xConstraint140, onXConstraint140Change,
    isGenerating, onGenerate, generateButtonRef, plan, presets, activePresetId,
    onApplyPreset, onOpenPresetModal, customPrompt, onCustomPromptChange,
    storeSupplement, onStoreSupplementChange, language, onLanguageChange,
    onOpenGuide, hasResults = false, isStyleLocked = false,
    onReset, storeProfile, resetTrigger,
    generatedResults = [], activeResultTab = 0, onResultTabChange,
    onManualEdit, onToggleFooter, onRefine, onRegenerateSingle,
    onShare, getShareButtonLabel, refiningKey, onRefineToggle,
    refineText, onRefineTextChange, onPerformRefine, isRefining,
    includeFooter, onIncludeFooterChange, onAutoFormat,
    isAutoFormatting, onCopy, onMobileResultOpen, restoreId,
    onStepChange, closeDrawerTrigger
}) => {
    const [mobileStep, setMobileStep] = React.useState<'platform' | 'input' | 'confirm' | 'result'>('platform');
    const [isStepDrawerOpen, setIsStepDrawerOpen] = React.useState(false);
    const [isPromptExpanded, setIsPromptExpanded] = React.useState(false);
    const [isOmakaseLoading, setIsOmakaseLoading] = React.useState(false);
    const [isListening, setIsListening] = React.useState(false);

    // Notify parent about step changes
    React.useEffect(() => {
        if (onStepChange) onStepChange(mobileStep);
    }, [mobileStep, onStepChange]);

    // Notify parent about result open state to hide footer
    React.useEffect(() => {
        if (onMobileResultOpen) onMobileResultOpen(mobileStep === 'result' && isStepDrawerOpen);
    }, [mobileStep, isStepDrawerOpen, onMobileResultOpen]);

    // Handle Restore/Reset/Close
    React.useEffect(() => { if (restoreId) { setMobileStep('result'); setIsStepDrawerOpen(true); } }, [restoreId]);
    React.useEffect(() => { if (resetTrigger && resetTrigger > 0) { setMobileStep('platform'); setIsStepDrawerOpen(false); } }, [resetTrigger]);
    React.useEffect(() => { if (closeDrawerTrigger && closeDrawerTrigger > 0) setIsStepDrawerOpen(false); }, [closeDrawerTrigger]);

    // Auto-expand on generation complete
    const prevIsGenerating = React.useRef(isGenerating);
    React.useEffect(() => {
        if (prevIsGenerating.current === true && isGenerating === false && hasResults && generatedResults.length > 0) {
            setMobileStep('result');
            setIsStepDrawerOpen(true);
        }
        prevIsGenerating.current = isGenerating;
    }, [isGenerating, hasResults, generatedResults.length]);

    // Background Scroll Lock
    React.useEffect(() => {
        document.body.style.overflow = isStepDrawerOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isStepDrawerOpen]);

    const handleBackStep = () => {
        if (mobileStep === 'confirm') setMobileStep('input');
        else { setIsStepDrawerOpen(false); setMobileStep('platform'); }
    };

    const toggleVoiceInput = () => { setIsListening(!isListening); };
    const handleOmakaseStart = () => { setIsOmakaseLoading(true); setTimeout(() => { setIsOmakaseLoading(false); onGenerate(); }, 1500); };

    return (
        <div className="flex flex-col h-[100dvh] w-full relative overflow-hidden font-inter bg-[#F8F9FA] p-5 pt-4 pb-[120px] safe-area-bottom">
            {/* Background Decoration */}
            <div className="fixed inset-0 pointer-events-none z-[-1] bg-[#F8F9FA]">
                <div className="absolute top-[-5%] right-[-5%] w-[60%] h-[60%] bg-[#E0E0E0] rounded-full blur-[120px] opacity-20" />
                <div className="absolute inset-0 opacity-[0.02] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />
            </div>

            {/* Step 1: Platform Grid (Bento) */}
            <div className={`flex-1 flex flex-col min-h-0 transition-all duration-500 gap-4 ${isStepDrawerOpen ? 'blur-md scale-[0.98] opacity-60' : 'opacity-100'}`}>
                {/* Header Section (Auto Height) */}
                <div className="flex flex-col gap-1 shrink-0">
                    <div className="px-2">
                        <span className="text-lg font-black tracking-tighter text-[var(--plexo-black)] lowercase" style={{ fontFamily: 'Inter, sans-serif' }}>misepo</span>
                    </div>

                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-1.5">
                            <span className="text-2xl font-black text-[var(--plexo-black)] opacity-10 tracking-tighter leading-none italic">01</span>
                            <div className="h-[2px] w-4 bg-[var(--plexo-yellow)] rounded-full mr-1" />
                            <h2 className="text-lg font-black text-[var(--plexo-black)] tracking-tight leading-none">
                                Select <span className="text-[#666666]">Canvas</span>
                                <span className="ml-1.5 inline-flex items-center py-0.5 px-1.5 rounded bg-[var(--plexo-yellow)] text-[8px] font-black text-black">投稿先を選択</span>
                            </h2>
                        </div>
                        {plan && (
                            <div className="flex items-center gap-1.5 bg-white pl-2 pr-2 py-1 rounded-lg border border-[#E5E5E5] shadow-sm shrink-0">
                                <span className="text-[9px] font-black text-[#999999] uppercase">Credits</span>
                                <span className="text-xs font-black">{Math.max(0, plan.limit - (plan.usage || 0))}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bento Grid Section (Flexible Height) */}
                <div className="flex-1 overflow-y-auto min-h-0 container-scrollbar pt-10 pb-6">
                    <div className="grid grid-cols-2 grid-rows-[105px_105px_auto] gap-2 px-1">
                        {[Platform.Instagram, Platform.X, Platform.Line, Platform.GoogleMaps].map((p) => {
                            const isActive = platforms.includes(p);
                            const isInsta = p === Platform.Instagram;
                            const isGoogle = p === Platform.GoogleMaps;
                            const details = (() => {
                                switch (p) {
                                    case Platform.Instagram: return { name: 'Instagram', tag: 'Visual Story', sub: '世界観と統一感', icon: <InstagramIcon className="w-7 h-7" />, color: 'from-purple-500/10 to-pink-500/10' };
                                    case Platform.X: return { name: 'X', tag: 'Real-time', sub: '拡散と交流', icon: <span className="font-black text-2xl">𝕏</span>, color: 'from-gray-500/5 to-black/5' };
                                    case Platform.Line: return { name: 'LINE', tag: 'Messages', sub: 'リピーター獲得', icon: <LineIcon className="w-7 h-7" />, color: 'from-green-500/10 to-emerald-500/10' };
                                    case Platform.GoogleMaps: return { name: 'Google Maps', tag: 'Local Search', sub: '店舗集客とMEO対策', icon: <GoogleMapsIcon className="w-7 h-7" />, color: 'from-blue-500/10 to-red-500/10' };
                                    default: return { name: '', tag: '', sub: '', icon: null, color: '' };
                                }
                            })();

                            const bentoClass = isInsta ? 'row-span-2 h-full' : isGoogle ? 'col-span-2 h-[135px]' : 'h-[105px]';

                            return (
                                <div key={p} onClick={() => onPlatformToggle(p)} className={`relative rounded-[24px] overflow-hidden cursor-pointer border transition-all duration-300 group ${bentoClass} ${isActive ? 'bg-[var(--plexo-yellow)] border-[var(--plexo-yellow)]' : 'bg-white border-[#EBEBEB]'}`}>
                                    {isActive && <div className={`absolute inset-0 bg-gradient-to-br ${details.color} opacity-40`} />}
                                    <div className="absolute inset-0 p-4 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isActive ? 'text-black' : 'text-[#BBBBBB]'}`}>{details.icon}</div>
                                            <ChevronRightIcon className={`w-3 h-3 transition-colors ${isActive ? 'text-black/20' : 'text-black/5'}`} />
                                        </div>
                                        <div className="flex flex-col pr-4">
                                            <span className={`text-[7px] font-black uppercase tracking-widest ${isActive ? 'text-black/40' : 'text-[#BBBBBB]'}`}>{details.tag}</span>
                                            <h3 className={`text-[16px] font-black tracking-tight leading-none mb-0.5 ${isActive ? 'text-black' : 'text-[#111111]'}`}>{details.name}</h3>
                                            {(isInsta || isGoogle) && <p className={`text-[8.5px] font-medium leading-tight ${isActive ? 'text-black/50' : 'text-[#888888]'}`}>{details.sub}</p>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* AI Omakase Section (Fixed/Auto Height) */}
                    <div className="pt-2 pb-5 px-1 shrink-0">
                        <div onClick={handleOmakaseStart} className={`p-5 px-6 rounded-[28px] bg-white border relative overflow-hidden group transition-all active:scale-95 ${isOmakaseLoading ? 'border-[var(--plexo-yellow)]' : 'border-[#EEEEEE]'}`}>
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <div className="inline-flex px-2 py-0.5 rounded-full bg-[var(--plexo-dark-gray)] text-[8px] font-black text-[var(--plexo-yellow)] uppercase mb-0.5">Premium</div>
                                    <h4 className="text-base font-black text-[#111111]">AI Omakase Mode</h4>
                                    <p className="text-[10px] font-bold text-[#999999] uppercase mb-1.5">Automated Content Strategy</p>
                                    <p className="text-[11px] font-medium text-[#666666] leading-relaxed max-w-[220px]">
                                        AIが業種やトレンドに合わせて、最適な投稿内容とハッシュタグを自動生成します
                                    </p>
                                </div>
                                <div className={`w-12 h-12 rounded-full border flex items-center justify-center ${isOmakaseLoading ? 'bg-[var(--plexo-yellow)] text-black' : 'bg-[#FAFAFA]'}`}>
                                    <AutoSparklesIcon className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Sheet Drawer */}
            {isStepDrawerOpen && (
                <div className="fixed inset-0 z-[130] flex items-end">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => { setIsStepDrawerOpen(false); if (mobileStep !== 'result') setMobileStep('platform'); }} />
                    <div className={`absolute bottom-0 left-0 right-0 bg-[#FAFAFA] border-t border-[#E5E5E5] rounded-t-[54px] shadow-2xl transition-all animate-nyoki flex flex-col ${mobileStep === 'confirm' || mobileStep === 'result' ? 'h-[94vh]' : 'h-[88vh]'} ${mobileStep === 'result' ? 'pb-8' : 'pb-24'}`}>
                        <div className="w-full flex justify-center py-5 shrink-0"><div className="w-12 h-1 bg-[#E5E5E5] rounded-full" /></div>
                        <div className="flex-1 overflow-y-auto px-8 py-2">
                            {mobileStep === 'input' && (
                                <div className="flex flex-col gap-6">
                                    <h3 className="text-xl font-black">{activePlatform} Post</h3>
                                    <AutoResizingTextarea value={inputText} onChange={(e) => onInputTextChange(e.target.value)} placeholder="Describe what to generate..." className="w-full min-h-[160px] p-6 bg-white border rounded-[32px] text-lg font-bold" />
                                    <button onClick={() => setMobileStep('confirm')} className="w-full bg-[#111111] text-white py-4 rounded-[24px] font-black shadow-lg">Next Step</button>
                                </div>
                            )}
                            {mobileStep === 'confirm' && (
                                <div className="flex flex-col gap-6">
                                    <div className="p-6 bg-white border rounded-[32px] font-bold text-[#111111]">{inputText}</div>
                                    <button onClick={onGenerate} className="w-full bg-[var(--plexo-yellow)] text-black py-4 rounded-[24px] font-black shadow-lg">GENERATE NOW</button>
                                </div>
                            )}
                            {mobileStep === 'result' && (
                                <div className="h-full pb-10">
                                    <PostResultTabs
                                        results={generatedResults} activeTab={activeResultTab} onTabChange={onResultTabChange!}
                                        onManualEdit={onManualEdit!} onToggleFooter={onToggleFooter!} onRefine={onRefine!}
                                        onRegenerateSingle={onRegenerateSingle!} onShare={onShare!} getShareButtonLabel={getShareButtonLabel!}
                                        storeProfile={storeProfile} refiningKey={refiningKey!} onRefineToggle={onRefineToggle!}
                                        refineText={refineText!} onRefineTextChange={onRefineTextChange!} onPerformRefine={onPerformRefine!}
                                        isRefining={isRefining!} includeFooter={includeFooter!} onIncludeFooterChange={onIncludeFooterChange!}
                                        onAutoFormat={onAutoFormat!} isAutoFormatting={isAutoFormatting!} onCopy={onCopy!}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
