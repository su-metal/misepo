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
import Onboarding from './Onboarding';
import { MobileFooter } from './features/generator/MobileFooter';
import { PostInputFormProps } from './features/generator/inputConstants';
import { StoreProfileSidebar } from './features/generator/StoreProfileSidebar';
import { TrendSidebar } from './features/generator/TrendSidebar';
import { MobileCalendarOverlay } from './features/generator/MobileCalendarOverlay';

interface PostGeneratorProps {
  storeProfile: StoreProfile;
  onSaveProfile: (profile: StoreProfile) => Promise<void>;
  onRefreshTraining?: () => Promise<any>;
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
  refreshPlan?: (loggedInOverride?: boolean) => Promise<any>;
  resetResultsTrigger?: number;
  shouldShowTour?: boolean;
  restoreTrigger?: number;
}

const PostGenerator: React.FC<PostGeneratorProps> = (props) => {
  const {
    storeProfile, onSaveProfile, onRefreshTraining, isLoggedIn, onOpenLogin, presets,
    onGenerateSuccess, onTaskComplete, trainingItems, onToggleFavorite, restorePost,
    onOpenGuide, onOpenSettings, onOpenHistory, onLogout,
    plan, refreshPlan, resetResultsTrigger, shouldShowTour, restoreTrigger
  } = props;

  const favorites = React.useMemo(() => new Set(trainingItems.map(t => t.content.trim())), [trainingItems]);

  const flow = useGeneratorFlow({
    storeProfile, isLoggedIn, onOpenLogin,
    onGenerateSuccess, onTaskComplete, favorites, onToggleFavorite, restorePost,
    resetResultsTrigger, refreshPlan, trainingItems, plan
  });

  const [isPresetModalOpen, setIsPresetModalOpen] = React.useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [isSavingPreset, setIsSavingPreset] = React.useState(false);
  const [mobileActiveTab, setMobileActiveTab] = React.useState<'home' | 'history' | 'learning' | 'settings'>('home');
  const [mobileStep, setMobileStep] = React.useState<'platform' | 'input' | 'confirm' | 'result'>('platform');
  const [closeDrawerTrigger, setCloseDrawerTrigger] = React.useState(0);
  const [openDrawerTrigger, setOpenDrawerTrigger] = React.useState(0);
  const [selectionTrigger, setSelectionTrigger] = React.useState(0);
  const [resetTrigger, setResetTrigger] = React.useState(0);
  const [isMobileResultOpen, setIsMobileResultOpen] = React.useState(false);
  const [showOnboarding, setShowOnboarding] = React.useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Track platform selection changes to trigger footer reaction
  React.useEffect(() => {
    if (flow.platforms.length > 0) {
      setSelectionTrigger(prev => prev + 1);
    }
  }, [flow.platforms]);

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
    if (plan && plan.canUseApp === false) {
      if (confirm('トライアル期間が終了しました。引き続きご利用いただくにはプランのアップグレードが必要です。アップグレード画面に移動しますか？')) {
        onOpenLogin();
      }
      return;
    }
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
      if (preset.id) await props.refreshPresets();
      if (preset.id && preset.id === flow.activePresetId) {
        const currentActiveInfo = presets.find(p => p.id === preset.id);
        if (currentActiveInfo) {
          flow.handleApplyPreset({ ...currentActiveInfo, ...preset } as Preset);
        }
      } else if (!preset.id && savedPreset && savedPreset.ok && savedPreset.preset) {
        flow.handleApplyPreset(savedPreset.preset);
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
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center overflow-hidden">
      <div className="flex flex-row items-center justify-center gap-6 xl:gap-12 w-full max-w-[1600px] px-0 sm:px-4 relative z-10">

        {/* Left Sidebar (PC Only) */}
        <div className={`hidden xl:block h-[85vh] max-h-[850px] shrink-0 transition-opacity duration-300 ${isCalendarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <StoreProfileSidebar storeProfile={storeProfile} plan={plan} />
        </div>

        {/* App Shell Container */}
        <div className="relative w-full h-[100dvh] sm:h-[90vh] sm:max-h-[900px] sm:w-[414px] shrink-0 bg-white sm:rounded-[54px] shadow-premium overflow-hidden border-0 sm:border-[12px] sm:border-white sm:ring-4 sm:ring-[#2b2b2f]/5 flex flex-col isolate z-10 transition-all duration-500">
          <div className="flex-1 w-full relative overflow-hidden bg-white">
            <PostInputForm
              storeProfile={storeProfile}
              platforms={flow.platforms}
              activePlatform={flow.platforms[0] || Platform.Instagram}
              isMultiGen={flow.isMultiGenMode}
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
              replyDepth={flow.replyDepth}
              onReplyDepthChange={flow.setReplyDepth}
              inputText={flow.inputText}
              onInputTextChange={flow.setInputText}
              question={flow.question}
              onQuestionChange={flow.setQuestion}
              topicPrompt={flow.topicPrompt}
              onTopicPromptChange={flow.setTopicPrompt}
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
              onOpenSettings={onOpenSettings}
              hasResults={flow.resultGroups.length > 0}
              onReset={React.useCallback(() => {
                flow.setInputText('');
                setResetTrigger(prev => prev + 1);
              }, [flow.setInputText])}
              resetTrigger={resetTrigger}
              generatedResults={flow.resultGroups}
              activeResultTab={flow.activeTab}
              onResultTabChange={flow.setActiveTab}
              onManualEdit={flow.handleManualEdit}
              onToggleFooter={flow.handleToggleFooter}
              onRefine={flow.performRefine}
              onRegenerateSingle={(platform) => flow.performGeneration([platform], true)}
              onShare={flow.handleShare}
              getShareButtonLabel={getShareButtonLabel}
              refiningKey={flow.refiningKey}
              onRefineToggle={flow.handleRefineToggle}
              refineText={flow.refineText}
              onRefineTextChange={flow.setRefineText}
              onPerformRefine={flow.performRefine}
              isRefining={flow.isRefining}
              includeFooter={flow.includeFooter}
              onIncludeFooterChange={flow.setIncludeFooter}
              onAutoFormat={flow.handleAutoFormat}
              isAutoFormatting={flow.isAutoFormatting}
              onCopy={flow.handleCopy}
              onMobileResultOpen={setIsMobileResultOpen}
              onStepChange={setMobileStep}
              restoreTrigger={restoreTrigger}
              initialStepOnRestore={restorePost ? (restorePost.results.length > 0 ? 'result' : 'input') : undefined}
              closeDrawerTrigger={closeDrawerTrigger}
              openDrawerTrigger={openDrawerTrigger}
              onOpenOnboarding={() => setShowOnboarding(true)}
              onAIStart={(fn) => {
                (window as any)._triggerAI = fn;
              }}
              targetAudiences={flow.targetAudiences}
              onTargetAudiencesChange={flow.setTargetAudiences}
              targetStep={mobileStep}
              isCalendarOpen={isCalendarOpen}
              onCalendarToggle={setIsCalendarOpen}
              selectedImage={flow.selectedImage}
              selectedImageMimeType={flow.selectedImageMimeType}
              onImageChange={flow.handleImageChange}
            />
          </div>

          {!isMobileResultOpen && mobileStep === 'platform' && (
            <MobileFooter
              activeTab={mobileActiveTab}
              currentStep={mobileStep}
              isGenerating={flow.loading}
              onTabChange={(tab) => {
                setMobileActiveTab(tab);
                if (tab === 'home') setCloseDrawerTrigger(prev => prev + 1);
                else if (tab === 'history') onOpenHistory && onOpenHistory();
                else if (tab === 'settings') onOpenSettings();
                else if (tab === 'learning') setIsPresetModalOpen(true);
              }}
              onPlusClick={() => {
                setMobileActiveTab('home');
                if (flow.platforms.length === 0) flow.handleSetActivePlatform(Platform.Instagram);

                // Always reset input when clicking 'New Post' (Plus button) to ensure a fresh start.
                // Pass true to keep the currently selected platform.
                flow.handleResetAll(true);

                setOpenDrawerTrigger(prev => prev + 1);
              }}
              onGenerate={handleGenerate}
              isPlatformSelected={flow.platforms.length > 0}
              selectionTrigger={selectionTrigger}
            />
          )}
          <div id="app-shell-modal-root" className="absolute inset-0 pointer-events-none" style={{ zIndex: 9999 }} />
        </div>

        {/* Right Sidebar (PC Only) */}
        <div className={`hidden xl:block h-[85vh] max-h-[850px] shrink-0 transition-opacity duration-300 ${isCalendarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <TrendSidebar
            onSelectEvent={(event) => {
              flow.setInputText(`【話題のネタ】\n${event.title}\n${event.prompt}`);
              setMobileStep('confirm');
              setOpenDrawerTrigger(prev => prev + 1);
            }}
            industry={storeProfile.industry}
            description={storeProfile.description}
            isGoogleMaps={(flow.platforms[0] || Platform.Instagram) === Platform.GoogleMaps}
          />
        </div>
      </div>

      {isPresetModalOpen && (
        <PresetModal
          onClose={() => setIsPresetModalOpen(false)}
          presets={presets}
          onSave={handleSavePreset}
          onDelete={handleDeletePreset}
          initialPresetId={flow.activePresetId || undefined}
          isSaving={isSavingPreset}
          onReorder={props.refreshPresets}
          trainingItems={trainingItems}
          onToggleTraining={(text, platform, presetId, replaceId, source) => onToggleFavorite(text, platform, presetId, replaceId, source || 'manual')}
          onRefreshTraining={onRefreshTraining}
          onLogout={onLogout}
        />
      )}

      {flow.toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] animate-in slide-in-from-bottom-4 duration-300 pointer-events-none">
          <div className="bg-stone-900/90 backdrop-blur text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-stone-700/50">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-xs font-bold truncate">{flow.toastMessage}</span>
          </div>
        </div>
      )}

      <LoadingModal isOpen={flow.loading} />

      {showOnboarding && (
        <Onboarding
          initialProfile={storeProfile}
          onSave={async (profile) => {
            await onSaveProfile(profile);
            setShowOnboarding(false);
            if (onTaskComplete) onTaskComplete();
          }}
          onCancel={() => setShowOnboarding(false)}
        />
      )}

      {/* Mobile Calendar Overlay (Moved to root for correct stack context) */}
      <div className="fixed inset-0 pointer-events-none z-[99999]">
        <div className="pointer-events-auto">
          <MobileCalendarOverlay
            isOpen={isCalendarOpen}
            onClose={() => setIsCalendarOpen(false)}
            onSelectEvent={(event) => {
              // Handle Trend Strategy Launch from Overlay
              setIsCalendarOpen(false);
              if (flow.platforms.length === 0) {
                flow.handlePlatformToggle(Platform.Instagram);
                flow.handlePlatformToggle(Platform.X);
              }
              if (flow.setQuestion) flow.setQuestion('');
              if (flow.setTopicPrompt) flow.setTopicPrompt('');

              setTimeout(() => {
                setMobileStep('confirm');
                setOpenDrawerTrigger(prev => prev + 1);
                const strategyPrompt = `✨ ${event.title} (${event.date}) の生成指示：\n${event.prompt}\n\nおすすめハッシュタグ: ${event.hashtags.join(' ')}`;
                flow.setInputText(strategyPrompt);
              }, 800);
            }}
            industry={storeProfile.industry}
            description={storeProfile.description}
            isGoogleMaps={(flow.platforms[0] || Platform.Instagram) === Platform.GoogleMaps}
          />
        </div>
      </div>
    </div>
  );
};

export default PostGenerator;
