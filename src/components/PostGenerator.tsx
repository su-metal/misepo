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
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      {/* Subtle Ambient Glow - Removed as per user request */}
      {/* <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-gray-100/30 blur-[120px] rounded-full opacity-40"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] blur-[120px] rounded-full opacity-15" style={{ backgroundColor: 'var(--lime)' }}></div>
      </div> */}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 relative z-10">
        {/* Header Module - Floating Glass */}
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
          <GeneratorHeader
            onOpenHistory={onOpenHistory || (() => { })}
            storeProfile={storeProfile}
          />
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Column: Input Form (8 Cols) */}
          <div className="lg:col-span-8">
            <div ref={inputRef} className="bg-white border border-gray-200 rounded-[3rem] shadow-xl shadow-black/5 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-black/10">
              <PostInputForm
                platforms={flow.platforms}
                activePlatform={flow.platforms[0] || Platform.Instagram}
                isMultiGen={flow.isMultiGenMode}
                onPlatformToggle={flow.handlePlatformToggle}
                onToggleMultiGen={flow.handleToggleMultiGen}
                onSetActivePlatform={(p) => flow.setPlatforms([p])}
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
                isGenerating={flow.loading}
                onGenerate={handleGenerate}
                generateButtonRef={buttonRef}
                plan={plan}
                presets={presets}
                activePresetId={flow.activePresetId}
                onApplyPreset={flow.handleApplyPreset}
                onOpenPresetModal={() => setIsPresetModalOpen(true)}
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

      {/* Mobile Fixed Generation Footer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-gray-200 z-[90] safe-area-bottom">
        <button
          onClick={handleGenerate}
          disabled={flow.loading || !flow.inputText.trim()}
          className="w-full bg-black text-lime py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          {flow.loading ? (
            <>
              <div className="w-4 h-4 border-2 border-lime border-t-transparent rounded-full animate-spin"></div>
              GENERATING...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5 text-lime" />
              投稿を作成
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
