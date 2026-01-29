import React, { useRef } from 'react';
import {
  StoreProfile, GeneratedPost, Preset, Platform, UserPlan, TrainingItem
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
import { MobileFooter } from './features/generator/MobileFooter';
import { PostInputFormProps } from './features/generator/inputConstants';

interface PostGeneratorProps {
  storeProfile: StoreProfile;
  isLoggedIn: boolean;
  onOpenLogin: () => void;
  presets: Preset[];
  refreshPresets: () => Promise<Preset[] | void>;
  onGenerateSuccess: (post: GeneratedPost) => void;
  onTaskComplete: () => void;
  trainingItems: TrainingItem[];
  onToggleFavorite: (text: string, platform: Platform, presetId: string | null, replaceId?: string, source?: 'generated' | 'manual') => Promise<void>;
  restorePost?: GeneratedPost | null;
  onOpenGuide?: () => void;
  onOpenSettings: () => void;
  onOpenHistory?: () => void;
  onLogout: () => void;
  plan: UserPlan;
  refreshPlan?: () => Promise<void>;
  resetResultsTrigger?: number;
  shouldShowTour?: boolean;
}

const PostGenerator: React.FC<PostGeneratorProps> = (props) => {
  const {
    storeProfile, isLoggedIn, onOpenLogin, presets,
    onGenerateSuccess, onTaskComplete, trainingItems, onToggleFavorite, restorePost,
    onOpenGuide, onOpenSettings, onOpenHistory, onLogout,
    plan, refreshPlan, resetResultsTrigger, shouldShowTour
  } = props;

  const favorites = React.useMemo(() => new Set(trainingItems.map(t => t.content.trim())), [trainingItems]);

  const flow = useGeneratorFlow({
    storeProfile, isLoggedIn, onOpenLogin,
    onGenerateSuccess, onTaskComplete, favorites, onToggleFavorite, restorePost,
    resetResultsTrigger, refreshPlan, trainingItems
  });

  const [isPresetModalOpen, setIsPresetModalOpen] = React.useState(false);
  const [isSavingPreset, setIsSavingPreset] = React.useState(false); // Add saving state
  const [mobileActiveTab, setMobileActiveTab] = React.useState<'home' | 'history' | 'learning' | 'settings'>('home');
  const [resetTrigger, setResetTrigger] = React.useState(0);
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
      case Platform.Line: return 'LINEで送る';
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

  const handleSavePreset = async (preset: Partial<Preset>): Promise<Preset | null> => {
    setIsSavingPreset(true);
    try {
      const url = preset.id ? `/api/me/presets/${preset.id}` : '/api/me/presets';
      const method = preset.id ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preset),
      });

      if (!res.ok) throw new Error('Failed to save preset');

      const savedPreset = await res.json();
      await props.refreshPresets();

      // If the saved preset is the currently active one, update the flow state immediately
      if (preset.id && preset.id === flow.activePresetId) {
        const currentActiveInfo = presets.find(p => p.id === preset.id);
        if (currentActiveInfo) {
          const updated = { ...currentActiveInfo, ...preset } as Preset;
          flow.handleApplyPreset(updated);
        }
      } else if (!preset.id) {
        // If it was a new preset, switch to it? 
        // Usually we stay on the modal or let the modal handle it.
        // But for flow state, we might want to know.
      }

      return savedPreset;
    } catch (error) {
      console.error('Failed to save preset:', error);
      alert('プロファイルの保存に失敗しました。');
      return null;
    } finally {
      setIsSavingPreset(false);
    }
  };

  const handleDeletePreset = async (id: string) => {
    if (!window.confirm('本当にこのプロファイルを削除しますか？')) return;
    try {
      const res = await fetch(`/api/me/presets/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete preset');
      await props.refreshPresets();
    } catch (error) {
      console.error('Failed to delete preset:', error);
      alert('プロファイルの削除に失敗しました。');
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--bg-beige)]">

      <div className="max-w-[1400px] mx-auto py-4 sm:py-8 relative z-10">
        {/* Header Module */}
        <div className="mx-3 sm:mx-8 mb-10 transition-all duration-1000 animate-in fade-in slide-in-from-top-4">
          <GeneratorHeader
            onOpenHistory={onOpenHistory || (() => { })}
            storeProfile={storeProfile}
            plan={plan}
          />
        </div>


        {/* 2-Column Layout */}
        <div className="px-1 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Left Column: Input Form (8 Cols) */}
          <div className="lg:col-span-8">
            <PostInputForm
              storeProfile={storeProfile}
              platforms={flow.platforms}
              activePlatform={flow.platforms[0] || Platform.Instagram}
              isMultiGen={flow.isMultiGenMode}
              // ...
              isStyleLocked={flow.isStyleLocked}
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
              storeSupplement={flow.storeSupplement}
              onStoreSupplementChange={flow.setStoreSupplement}
              language={flow.language}
              onLanguageChange={flow.setLanguage}
              onOpenGuide={onOpenGuide}
              hasResults={flow.resultGroups.length > 0}
              onReset={() => {
                flow.setInputText('');
                setResetTrigger(prev => prev + 1);
              }}
            />
          </div>

          {/* Right Column: Results (4 Cols) */}
          <div className="lg:col-span-4">
            <div ref={resultsRef} className="pb-8 md:pb-20 px-4">
              <PostResultTabs
                results={flow.resultGroups}
                activeTab={flow.activeTab}
                onTabChange={flow.setActiveTab}
                onManualEdit={flow.handleManualEdit}
                onToggleFooter={flow.handleToggleFooter}
                onRefine={flow.performRefine}
                onRegenerateSingle={(platform) => flow.performGeneration([platform], true)}
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
                presetId={flow.activePresetId || undefined}
                onAutoFormat={flow.handleAutoFormat}
                isAutoFormatting={flow.isAutoFormatting}
                onCopy={flow.handleCopy}
              />
            </div>
          </div>
        </div>

        {/* Footnote */}
        <p className="text-center text-[10px] font-black text-black opacity-30 uppercase tracking-widest mt-12 pb-8 sm:pb-0 animate-in fade-in duration-1000">
          AI-Powered High Performance Content Generation
        </p>
      </div>

      {/* Sticky Generation Footer */}
      <div className="hidden sm:block fixed bottom-0 left-0 right-0 z-[90]">
        <div className="absolute inset-x-0 bottom-0 h-24 md:h-32 bg-gradient-to-t from-[var(--bg-beige)] via-[var(--bg-beige)]/90 to-transparent pointer-events-none" />
        <div className="relative px-4 py-3 pb-8 md:pb-12 safe-area-bottom flex items-center justify-center">
          <button
            onClick={handleGenerate}
            disabled={flow.loading || !flow.inputText.trim()}
            className={`w-full max-w-xl py-6 md:py-8 rounded-[32px] font-black text-lg md:text-2xl tracking-[0.2em] flex items-center justify-center gap-3 md:gap-5 group transition-all duration-500
                ${flow.loading || !flow.inputText.trim()
                ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                : 'bg-[#F5CC6D] text-black border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:scale-95'
              }`}
          >
            <div className="flex items-center justify-center gap-3 md:gap-5 relative z-10">
              {flow.loading ? (
                <>
                  <div className="w-6 h-6 md:w-8 md:h-8 border-4 border-slate-400 border-t-slate-600 rounded-full animate-spin"></div>
                  <span className="opacity-80 animate-pulse">PROCESSING...</span>
                </>
              ) : (
                <>
                  <div className="relative">
                    <SparklesIcon className={`w-6 h-6 md:w-8 md:h-8 group-hover:rotate-12 transition-transform ${flow.resultGroups.length > 0 ? 'text-black' : 'text-primary'}`} />
                  </div>
                  <span className={`drop-shadow-none uppercase ${flow.resultGroups.length > 0 ? 'text-black' : 'text-primary'}`}>
                    {flow.resultGroups.length === 0
                      ? '投稿を生成'
                      : (flow.resultGroups[0].config.inputText !== flow.inputText
                        ? '内容を更新して生成'
                        : '再生成する')}
                  </span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      {
        isPresetModalOpen && (
          <PresetModal
            onClose={() => setIsPresetModalOpen(false)}
            presets={presets}
            onSave={handleSavePreset}
            onDelete={handleDeletePreset}
            onApply={(p) => {
              flow.handleApplyPreset(p);
              setIsPresetModalOpen(false);
            }}
            initialPresetId={flow.activePresetId || undefined}
            isSaving={isSavingPreset}
            onReorder={props.refreshPresets}
            trainingItems={trainingItems}
            onToggleTraining={(text, platform, presetId, replaceId, source) => onToggleFavorite(text, platform, presetId, replaceId, source || 'manual')}
          />
        )
      }

      {
        shouldShowTour && (
          <GuestTour
            isOpen={shouldShowTour}
            onClose={() => { }}
            inputRef={inputRef}
            buttonRef={buttonRef}
            instagramRef={instagramRef as any}
          />
        )
      }

      {
        flow.toastMessage && (
          <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[110] animate-in slide-in-from-bottom-4 duration-300 pointer-events-none">
            <div className="bg-stone-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-stone-700">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-sm font-bold">{flow.toastMessage}</span>
            </div>
          </div>
        )
      }

      <LoadingModal isOpen={flow.loading} />

      {/* Mobile Footer Navigation */}
      <MobileFooter
        activeTab={mobileActiveTab}
        onTabChange={(tab) => {
          setMobileActiveTab(tab);
          if (tab === 'history' && onOpenHistory) onOpenHistory();
          if (tab === 'settings' && onOpenSettings) onOpenSettings();
          if (tab === 'learning') setIsPresetModalOpen(true);
        }}
        onPlusClick={() => {
          setMobileActiveTab('home');
          flow.setInputText('');
          setResetTrigger(prev => prev + 1);
        }}
      />
    </div>
  );
};

export default PostGenerator;
