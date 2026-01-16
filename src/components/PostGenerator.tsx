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
            onOpenHistory={onOpenHistory || (() => { })}
            storeProfile={storeProfile}
          />
        </div>

        {/* Next-Gen Bento Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Area: Setup & Context Modules (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Plan & Status Card - Distributed from Header */}
            <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-6 shadow-xl shadow-stone-200/50 animate-in fade-in slide-in-from-left-4 duration-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-[10px] font-black tracking-[0.3em] text-stone-400 mb-1 uppercase">Account Status</h4>
                  <p className="text-xl font-black text-stone-800 tracking-tight">
                    {(() => {
                      const now = Date.now();
                      const trialEndsMs = plan?.trial_ends_at ? new Date(plan.trial_ends_at).getTime() : 0;
                      if (trialEndsMs > now) return 'Free Trial';
                      if (plan?.status === 'active') return 'Pro Plan';
                      return 'Free Plan';
                    })()}
                  </p>
                </div>
                {(() => {
                  const now = Date.now();
                  const trialEndsMs = plan?.trial_ends_at ? new Date(plan.trial_ends_at).getTime() : 0;
                  if (trialEndsMs > now) {
                    return (
                      <div className="relative group">
                        <div className="absolute inset-0 bg-orange-500 blur-lg opacity-20 group-hover:opacity-40 animate-pulse"></div>
                        <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-900/20 rotate-3 transition-transform group-hover:rotate-0">
                          <StarIcon className="w-6 h-6 fill-current" />
                        </div>
                      </div>
                    );
                  }
                  if (plan?.status === 'active') {
                    return (
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-900/10">
                        <span className="font-black text-xs uppercase">Pro</span>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              {(() => {
                const now = Date.now();
                const trialEndsMs = plan?.trial_ends_at ? new Date(plan.trial_ends_at).getTime() : 0;
                if (trialEndsMs > now) {
                  const days = Math.max(0, Math.ceil((trialEndsMs - now) / (1000 * 60 * 60 * 24)));
                  return (
                    <div className="space-y-3">
                      <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-1000"
                          style={{ width: `${(days / 7) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-[11px] font-bold text-stone-500 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></span>
                        あと <span className="text-orange-600 font-black">{days}日間</span> 無料でお試しいただけます
                      </p>
                    </div>
                  );
                }
                return (
                  <p className="text-[11px] font-bold text-stone-500 leading-relaxed uppercase tracking-wider">
                    2026テクノロジー搭載。あなたのブランドをAIで加速させます。
                  </p>
                );
              })()}
            </div>

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
                  onOpenLibrary={() => setIsPresetModalOpen(true)}
                />
              </div>
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
                onGenerate={handleGenerate}
                generateButtonRef={buttonRef}
              />
            </div>
          </div>

          {/* Bottom Area: Results Module (Full 12 Cols) */}
          <div ref={resultsRef} className="lg:col-span-12 mt-8 pb-32 md:pb-20">
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

      {/* Mobile Fixed Generation Footer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-stone-200 z-[90] safe-area-bottom">
        <button
          onClick={handleGenerate}
          disabled={flow.loading || !flow.inputText.trim()}
          className="w-full bg-stone-900 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          {flow.loading ? (
            <>
              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              GENERATING...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5 text-orange-400" />
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
