import React, { useRef } from 'react';
import {
  StoreProfile, GeneratedPost, Preset, Platform, UserPlan
} from '../types';
import { StarIcon, SparklesIcon } from './Icons';
import { useGeneratorFlow } from './features/generator/useGeneratorFlow';
import { GeneratorHeader } from './features/generator/GeneratorHeader';
import { PlatformSelector } from './features/generator/PlatformSelector';
import { PostInputForm } from './features/generator/PostInputForm';
import { PostResultTabs } from './features/generator/PostResultTabs';
import GuestTour from './GuestTour';
import PresetModal from './PresetModal';
import LoadingModal from './LoadingModal';

interface PostGeneratorProps {
  storeProfile: StoreProfile;
  isLoggedIn: boolean;
  onOpenLogin: () => void;
  presets: Preset[];
  refreshPresets: () => Promise<void>;
  onGenerateSuccess: (post: GeneratedPost) => void;
  onTaskComplete: () => void;
  restorePost?: GeneratedPost | null;
  onOpenGuide?: () => void;
  onOpenSettings: () => void;
  onOpenHistory?: () => void; // Added onOpenHistory
  onLogout: () => void;
  plan: UserPlan;
  resetResultsTrigger?: number;
  shouldShowTour?: boolean;
}

const PostGenerator: React.FC<PostGeneratorProps> = (props) => {
  const {
    storeProfile, isLoggedIn, onOpenLogin, presets,
    onGenerateSuccess, onTaskComplete, restorePost,
    onOpenGuide, onOpenSettings, onOpenHistory, onLogout,
    plan, resetResultsTrigger, shouldShowTour // Destructured onOpenHistory, onLogout, plan
  } = props;

  const flow = useGeneratorFlow({
    storeProfile, isLoggedIn, onOpenLogin,
    onGenerateSuccess, onTaskComplete, restorePost,
    resetResultsTrigger
  });

  const [isPresetModalOpen, setIsPresetModalOpen] = React.useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Refs for GuestTour
  const instagramRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const getShareButtonLabel = (p: Platform) => {
    switch (p) {
      case Platform.X: return 'Xで投稿';
      case Platform.Instagram: return 'Instagramを開く';
      case Platform.GoogleMaps: return 'Googleマップを開く';
      default: return 'シェアする';
    }
  };

  const handleGenerate = () => {
    flow.performGeneration(flow.platforms).then(() => {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    });
  };

  return (
    <div className="min-h-screen text-slate-100 overflow-x-hidden">

      <div className="max-w-[1400px] mx-auto py-4 sm:py-8 relative z-10">
        {/* Header Module - Floating Glass */}
        <div className="mb-6 px-3 sm:px-8 animate-in fade-in slide-in-from-top-4 duration-1000">
          <GeneratorHeader
            onOpenHistory={onOpenHistory || (() => { })}
            storeProfile={storeProfile}
            plan={plan}
          />
        </div>

        {/* Usage Guide Link - Between Header and Input */}
        {onOpenGuide && (
          <div className="flex justify-end mb-4 px-3 sm:px-8">
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-2 text-slate-400 hover:text-[#001738] transition-colors text-xs font-bold"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
              <span>使い方ガイド</span>
            </button>
          </div>
        )}

        {/* 2-Column Layout */}
        <div className="px-1 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Left Column: Input Form (8 Cols) */}
          <div className="lg:col-span-8">
            <div ref={inputRef} className="">
              <PostInputForm
                platforms={flow.platforms}
                activePlatform={flow.platforms[0] || Platform.Instagram}
                isMultiGen={flow.isMultiGenMode}
                onPlatformToggle={flow.handlePlatformToggle}
                onToggleMultiGen={flow.handleToggleMultiGen}
                onSetActivePlatform={flow.handleSetActivePlatform}
                platform={flow.platforms[0] || Platform.Instagram}
                postPurpose={flow.postPurpose}
                gmapPurpose={flow.gmapPurpose}
                onPostPurposeChange={flow.setPostPurpose}
                onGmapPurposeChange={flow.setGmapPurpose}
                tone={flow.tone}
                onToneChange={flow.setTone}
                length={flow.length}
                onLengthChange={flow.setLength}
                inputText={flow.inputText}
                onInputTextChange={flow.setInputText}
                starRating={flow.starRating}
                onStarRatingChange={flow.onStarRatingChange}
                includeEmojis={flow.includeEmojis}
                onIncludeEmojisChange={flow.setIncludeEmojis}
                includeSymbols={flow.includeSymbols}
                onIncludeSymbolsChange={flow.setIncludeSymbols}
                xConstraint140={flow.xConstraint140}
                onXConstraint140Change={flow.setXConstraint140}
                isGenerating={flow.loading}
                onGenerate={handleGenerate}
                generateButtonRef={buttonRef}
                plan={plan}
                presets={presets}
                activePresetId={flow.activePresetId}
                onApplyPreset={flow.handleApplyPreset}
                onOpenPresetModal={() => setIsPresetModalOpen(true)}
                customPrompt={flow.customPrompt}
                onCustomPromptChange={flow.setCustomPrompt}
              />
            </div>
          </div>

          {/* Right Column: Results (4 Cols) */}
          <div className="lg:col-span-4">
            <div ref={resultsRef} className="pb-32 md:pb-20">
              <PostResultTabs
                results={flow.resultGroups}
                activeTab={flow.activeTab}
                onTabChange={flow.setActiveTab}
                onManualEdit={flow.handleManualEdit}
                onToggleFooter={flow.handleToggleFooter}
                onRefine={() => { }}
                onRegenerateSingle={(p) => flow.performGeneration([p], true)}
                onShare={flow.handleShare}
                getShareButtonLabel={getShareButtonLabel}
                storeProfile={storeProfile}
                refiningKey={flow.refiningKey}
                onRefineToggle={flow.handleRefineToggle}
                refineText={flow.refineText}
                onRefineTextChange={flow.setRefineText}
                onPerformRefine={flow.performRefine}
                isRefining={flow.isRefining}
                includeFooter={flow.includeFooter}
                onIncludeFooterChange={flow.setIncludeFooter}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Generation Footer - Glass Style */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 px-6 py-5 pb-8 glass-panel-dark border-t border-white/10 z-[90] safe-area-bottom">
        <button
          onClick={handleGenerate}
          disabled={flow.loading || !flow.inputText.trim()}
          className={`w-full py-6 rounded-[32px] font-black text-lg uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 active:scale-95 shadow-2xl
              ${flow.loading || !flow.inputText.trim()
              ? 'bg-white/10 text-slate-500 shadow-none'
              : 'bg-accent text-slate-900 shadow-lg shadow-[#B8E600]/30'
            }`}
        >
          {flow.loading ? (
            <>
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>PROCESSING...</span>
            </>
          ) : (
            <>
              <SparklesIcon className="w-6 h-6 text-white" />
              <span>GENERATE POST</span>
            </>
          )}
        </button>
      </div>

      {isPresetModalOpen && (
        <PresetModal
          isOpen={isPresetModalOpen}
          onClose={() => setIsPresetModalOpen(false)}
          presets={presets}
          refreshPresets={props.refreshPresets}
          onApply={flow.handleApplyPreset}
          currentConfig={{ customPrompt: flow.customPrompt }}
        />
      )}

      {shouldShowTour && (
        <GuestTour
          isOpen={shouldShowTour}
          onClose={() => { }}
          inputRef={inputRef}
          buttonRef={buttonRef}
          instagramRef={instagramRef as any}
        />
      )}

      {flow.toastMessage && (
        <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[110] animate-in slide-in-from-bottom-4 duration-300 pointer-events-none">
          <div className="bg-stone-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-stone-700">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm font-bold">{flow.toastMessage}</span>
          </div>
        </div>
      )}

      <LoadingModal isOpen={flow.loading} />
    </div>
  );
};

export default PostGenerator;
