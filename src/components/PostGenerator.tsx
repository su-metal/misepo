import React, { useRef } from 'react';
import {
  StoreProfile, GeneratedPost, Preset, Platform
} from '../types';
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
  resetResultsTrigger?: number;
  shouldShowTour?: boolean;
}

const PostGenerator: React.FC<PostGeneratorProps> = (props) => {
  const {
    storeProfile, isLoggedIn, onOpenLogin, presets,
    onGenerateSuccess, onTaskComplete, restorePost,
    onOpenGuide, onOpenSettings, onOpenHistory, onLogout, resetResultsTrigger, shouldShowTour // Destructured onOpenHistory, onLogout
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

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 selection:bg-orange-200 overflow-x-hidden">
      {/* Radiant Glows (Light Mode) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-orange-200/40 blur-[120px] rounded-full animate-pulse opacity-50"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-purple-200/30 blur-[120px] rounded-full opacity-30"></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 relative z-10">
        {/* Header Module - Floating Glass */}
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
          <GeneratorHeader
            onOpenGuide={onOpenGuide}
            onOpenPresets={() => setIsPresetModalOpen(true)}
            onOpenSettings={onOpenSettings}
            onOpenHistory={onOpenHistory || (() => { })}
            storeProfile={storeProfile}
            presets={presets}
            onApplyPreset={flow.handleApplyPreset}
            activePresetId={flow.activePresetId}
            onLogout={onLogout}
            isLoggedIn={isLoggedIn}
          />
        </div>

        {/* Next-Gen Bento Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Area: Setup & Context Modules (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-1 overflow-hidden shadow-xl shadow-stone-200/50">
              <div ref={instagramRef as any}>
                <PlatformSelector
                  platforms={flow.platforms}
                  activePlatform={flow.platforms[0] || Platform.Instagram}
                  isMultiGen={flow.isMultiGenMode}
                  onPlatformToggle={flow.handlePlatformToggle}
                  onToggleMultiGen={flow.handleToggleMultiGen}
                  onSetActivePlatform={(p) => flow.setPlatforms([p])}
                  presets={presets}
                  onApplyPreset={flow.handleApplyPreset}
                  activePresetId={flow.activePresetId}
                />
              </div>
            </div>

            {/* Quick Context Card (Future Feature Slot) */}
            <div className="hidden lg:block bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-lg shadow-orange-100/50">
              <h4 className="text-[10px] font-black tracking-[0.3em] text-orange-500 mb-2 uppercase">Creative Mindset</h4>
              <p className="text-sm text-stone-500 leading-relaxed font-bold">
                2026テクノロジーを搭載したAIエディター。SNSプラットフォームに最適化された独自アルゴリズムで、あなたのブランドを加速させます。
              </p>
            </div>
          </div>

          {/* Right Area: Main Workstation Module (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div ref={inputRef} className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[3rem] shadow-xl shadow-stone-200/50 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-stone-200/60">
              <PostInputForm
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
                onGenerate={() => {
                  flow.performGeneration(flow.platforms).then(() => {
                    setTimeout(() => {
                      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                  });
                }}
                generateButtonRef={buttonRef}
              />
            </div>
          </div>

          {/* Bottom Area: Results Module (Full 12 Cols) */}
          <div ref={resultsRef} className="lg:col-span-12 mt-8 pb-20">
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
        <div className="fixed bottom-8 left-1/2 -transtone-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-300">
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
