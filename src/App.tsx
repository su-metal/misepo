"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { StoreProfile, GeneratedPost, Preset } from './types';
import { useAuth } from './hooks/useAuth';
import { usePlan } from './hooks/usePlan';
import { readFromStorage, writeToStorage } from './lib/storage';
import { normalizeStoreProfile, mapHistoryEntry } from './lib/mappers';
import { GUEST_PROFILE } from './constants';

import PostGenerator from './components/PostGenerator';
import OnboardingFlow from './components/Onboarding'; // Corrected
import HistorySidebar from './components/HistorySidebar'; // Corrected
import SettingsSidebar from './components/SettingsSidebar';
import AccountSettingsModal from './components/AccountSettingsModal';
import GuestDemoModal from './components/GuestDemoModal';
import GuideModal from './components/GuideModal';
import TrainingReplacementModal from './components/features/generator/TrainingReplacementModal';
import { Platform, TrainingItem } from './types';
import { TrialEndedBarrier } from './components/features/billing/TrialEndedBarrier';


const UpgradeBanner = ({ plan, onUpgrade }: { plan: string, onUpgrade: () => void }) => (
  <div className="bg-primary p-4 flex items-center justify-between text-white text-sm border-b border-accent/20 shadow-2xl shadow-navy-900/40 relative overflow-hidden group">
    <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent pointer-events-none"></div>
    <div className="flex items-center gap-3 relative z-10">
      <span className="bg-accent px-3 py-1 rounded-full text-[10px] font-black uppercase text-white shadow-lg shadow-accent/30 tracking-widest">Trial (トライアル)</span>
      <span className="font-black tracking-tight hidden sm:inline">現在はトライアル期間です。終了するとプランのご契約が必要になります。</span>
      <span className="font-black tracking-tight sm:hidden text-xs">トライアル期間中。</span>
    </div>
    <button onClick={onUpgrade} className="bg-white text-primary px-5 py-2 rounded-xl font-black text-xs hover:bg-accent hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95 relative z-10 uppercase tracking-widest">
      Go Pro
    </button>
  </div>
);

function App() {
  const router = useRouter();
  const { user, loading: authLoading, loginWithGoogle, logout } = useAuth();
  const { plan, refreshPlan } = usePlan(user);

  const [storeProfile, setStoreProfile] = useState<StoreProfile | null>(null);
  const [history, setHistory] = useState<GeneratedPost[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeHistoryItem, setActiveHistoryItem] = useState<GeneratedPost | null>(null);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [initDone, setInitDone] = useState(false);

  // Training Replacement State
  const [replacementModal, setReplacementModal] = useState<{
    isOpen: boolean;
    newContent: string;
    platform: Platform;
    presetId: string | null;
    currentItems: TrainingItem[];
  }>({
    isOpen: false,
    newContent: '',
    platform: Platform.Instagram,
    presetId: null,
    currentItems: []
  });

  const [trainingItems, setTrainingItems] = useState<TrainingItem[]>([]);

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showGuestDemo, setShowGuestDemo] = useState(false);

  const isLoggedIn = !!user;

  // --- Fetching Logic ---
  const fetchPresets = useCallback(async () => {
    try {
      const res = await fetch(`/api/me/presets?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      const data = await res.json();
      if (data.ok) {
        // Map snake_case from DB to camelCase for frontend
        const mappedPresets = (data.presets || []).map((p: any) => ({
          ...p,
          postSamples: p.post_samples || {},
        }));
        setPresets(mappedPresets);
        return mappedPresets as Preset[];
      }
    } catch (err) {
      console.error('Failed to fetch presets:', err);
    }
    return [];
  }, []);

  const fetchHistory = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const res = await fetch(`/api/me/history?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.ok) {
        const mappedHistory = (data.history || []).map(mapHistoryEntry);
        setHistory(mappedHistory);
        return mappedHistory;
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
    return [];
  }, [isLoggedIn]);

  const fetchTrainingItems = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const res = await fetch(`/api/me/learning?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.ok && Array.isArray(data.items)) {
        // Unique-ify by ID just in case backend or race conditions returned duplicates
        const uniqueItems = data.items.reduce((acc: TrainingItem[], current: TrainingItem) => {
          if (!acc.find(item => item.id === current.id)) {
            acc.push(current);
          }
          return acc;
        }, []);
        setTrainingItems(uniqueItems);
        return uniqueItems;
      }
    } catch (err) {
      console.error('Failed to fetch training items:', err);
    }
    return [];
  }, [isLoggedIn]);

  const favorites = React.useMemo(() => {
    return new Set(trainingItems.map(item => item.content.trim()));
  }, [trainingItems]);

  const fetchProfile = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const res = await fetch(`/api/me/store-profile?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }

      const data = await res.json();
      if (data.ok && data.profile) {
        setStoreProfile(normalizeStoreProfile(data.profile));
      } else {
        setShowOnboarding(true);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      // Fallback to guest profile if error occurs while logged in? 
      // Usually we want them to re-onboard if profile is really missing
      setShowOnboarding(true);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (authLoading) return;

    // Reset state when user ID changes (or when logging out/in)
    // This prevents User B from seeing User A's data for a split second 
    // or indefinitely if re-fetching fails.
    console.log('[App] Auth initialized. User:', user?.id || 'None');
    setInitDone(false); // Reset init flag during re-fetch
    setStoreProfile(null);
    setHistory([]);
    setPresets([]);
    setTrainingItems([]);

    const init = async () => {
      console.log('[App] Fetching data for user:', user?.id || 'Guest');
      const [_, __, presetsData, trainingData] = await Promise.all([
        fetchProfile(),
        fetchHistory(),
        fetchPresets(),
        fetchTrainingItems()
      ]);
      setInitDone(true);
      console.log('[App] Initialization complete.');

      // Automated Migration of legacy post_samples to learning_sources
      if (isLoggedIn && Array.isArray(presetsData) && Array.isArray(trainingData)) {
        let hasMigrated = false;
        for (const preset of presetsData) {
          const legacySamples = preset.post_samples || {};
          for (const [platform, content] of Object.entries(legacySamples)) {
            if (!content) continue;

            // Strict Check: ONLY migrate if NO data exists for this platform/preset combination.
            // This prevents re-migrating old legacy data if the user has edited the learning data 
            // but not synced it back to the preset's legacy 'post_samples' field.
            const alreadyExists = trainingData.some(item =>
              item.presetId === preset.id &&
              item.platform === platform
            );

            if (!alreadyExists) {
              console.log(`[MIGRATION] Migrating legacy sample for ${preset.name} (${platform})`);
              try {
                const res = await fetch('/api/me/learning', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    content,
                    platform,
                    presetId: preset.id
                  })
                });
                if (res.ok) hasMigrated = true;
              } catch (migrateErr) {
                console.warn('[MIGRATION] Failed to migrate sample:', migrateErr);
              }
            }
          }
        }
        if (hasMigrated) {
          await fetchTrainingItems(); // Refresh items to show in UI
        }
      }
    };
    init();
  }, [authLoading, user?.id, fetchProfile, fetchHistory, fetchPresets, fetchTrainingItems]);

  // REMOVED: legacy redirect to /start when plan expires. 
  // We now handle this by showing the TrialEndedBarrier on the dashboard.

  // --- Handlers ---
  const handleUpgrade = () => {
    router.push('/start?upgrade=true');
  };

  const handleOnboardingSave = async (profile: StoreProfile) => {
    setStoreProfile(profile);
    setShowOnboarding(false);
    if (isLoggedIn) {
      await fetch('/api/me/store-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });
    }
  };

  const handleGenerateSuccess = (post: GeneratedPost) => {
    setHistory(prev => {
      const next = [post, ...prev];
      // Local pruning: keep latest 20 unpinned + all pinned
      const unpinned = next.filter(item => !item.isPinned);
      if (unpinned.length > 20) {
        // Re-construct history: keep all pinned + latest 20 unpinned
        const pinned = next.filter(item => item.isPinned);
        const keptUnpinned = unpinned.slice(0, 20);
        return [...pinned, ...keptUnpinned].sort((a, b) => b.timestamp - a.timestamp);
      }
      return next;
    });
    setActiveHistoryItem(null);
  };

  const handleDeleteHistory = async (id: string) => {
    setHistory(prev => prev.filter(h => h.id !== id));
    if (isLoggedIn) {
      await fetch(`/api/me/history/${id}`, { method: 'DELETE' });
    }
  };

  const handleTogglePin = async (id: string, isPinned: boolean) => {
    // Optimistic Update
    setHistory(prev => prev.map(item =>
      item.id === id ? { ...item, isPinned } : item
    ));

    if (isLoggedIn) {
      try {
        const res = await fetch(`/api/me/history/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isPinned })
        });
        if (!res.ok) throw new Error('Failed to toggle pin');
      } catch (err) {
        console.error('Failed to toggle pin:', err);
        // Revert on error
        setHistory(prev => prev.map(item =>
          item.id === id ? { ...item, isPinned: !isPinned } : item
        ));
        alert('ピン留めの更新に失敗しました。');
      }
    }
  };

  const handleToggleTraining = async (text: string, platform: Platform, presetId: string | null, replaceId?: string, source: 'generated' | 'manual' = 'manual') => {
    if (!isLoggedIn) return;

    const normalizedText = text.trim();
    // Use trainingItems directly for precise checking
    const existing = trainingItems.find(item => item.content.trim() === normalizedText);
    const isTrained = !!existing;

    if (isTrained && !replaceId) {
      // Smart Delete Logic
      const currentPlatforms = existing.platform.split(',').map(p => p.trim());

      // If the item is associated with multiple platforms, and we are deleting just one of them
      if (currentPlatforms.length > 1 && currentPlatforms.includes(platform)) {
        const newPlatforms = currentPlatforms.filter(p => p !== platform).join(', ');

        // Treat this as an UPDATE (Replace) with the removed platform
        // We call the API with the SAME ID as replaceId to update it in place
        try {
          const res = await fetch('/api/me/learning', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content: normalizedText,
              platform: newPlatforms, // Updated platform list
              presetId: existing.presetId,
              replaceId: existing.id, // Update existing
              source: existing.source || source
            })
          });

          if (!res.ok) throw new Error('Failed to update training data (smart delete)');

          const data = await res.json();

          setTrainingItems(prev => prev.map(item =>
            item.id === existing.id
              ? { ...item, id: data.id, platform: newPlatforms as any } // Update with NEW ID and new platforms
              : item
          ));
          return;

        } catch (err) {
          console.error('Smart delete failed:', err);
          alert('更新に失敗しました');
          return;
        }
      }

      // Default: Delete the item entirely (Single platform or full match)
      setTrainingItems(prev => prev.filter(item => item.id !== existing.id));
      try {
        await fetch('/api/me/learning', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: existing.id })
        });
      } catch (err) {
        console.error('Delete training failed:', err);
        setTrainingItems(prev => [...prev, existing]);
      }
      return;
    }

    // Add / Replace Logic
    const effectivePresetId = presetId || presets[0]?.id || 'omakase';

    try {
      const res = await fetch('/api/me/learning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: normalizedText,
          platform,
          presetId: effectivePresetId,
          replaceId,
          source // Pass source to backend
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'LIMIT_REACHED') {
          setReplacementModal({
            isOpen: true,
            newContent: normalizedText,
            platform,
            presetId: effectivePresetId,
            currentItems: data.currentItems
          });
          return;
        }
        throw new Error(data.error || data.message || 'Failed to save training data');
      }

      // Success
      const newItem = {
        id: data.id,
        content: normalizedText,
        platform,
        presetId: effectivePresetId,
        createdAt: new Date().toISOString(),
        source
      };

      if (replaceId) {
        setTrainingItems(prev => {
          // Remove both the old replaceId AND any accidental duplicate of the new data.id
          const filtered = prev.filter(item => item.id !== replaceId && item.id !== data.id);
          return [...filtered, newItem];
        });
        setReplacementModal(prev => ({ ...prev, isOpen: false }));
      } else {
        setTrainingItems(prev => {
          // Prevent adding the same ID twice (can happen if backend returns "Already exists")
          if (prev.some(item => item.id === data.id)) return prev;
          return [...prev, newItem];
        });
      }
    } catch (err) {
      console.error('Training toggle failed:', err);
      alert(`更新に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (authLoading || !initDone) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-accent rounded-full animate-spin shadow-2xl shadow-accent/10"></div>
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingFlow onSave={handleOnboardingSave} initialProfile={storeProfile!} onCancel={storeProfile ? () => setShowOnboarding(false) : undefined} />;
  }

  return (
    <div className="min-h-screen text-[#111111]">
      <HistorySidebar
        isOpen={isSidebarOpen}
        toggleOpen={() => setIsSidebarOpen(false)}
        history={history}
        onSelect={(post) => {
          setActiveHistoryItem(post);
          setIsSidebarOpen(false);
        }}
        onDelete={handleDeleteHistory}
        isLoggedIn={isLoggedIn}
        onOpenLogin={() => router.push('/start')}
        presets={presets}
        onTogglePin={handleTogglePin}
      />

      <SettingsSidebar
        isOpen={isSettingsOpen}
        toggleOpen={() => setIsSettingsOpen(false)}
        isLoggedIn={isLoggedIn}
        onOpenLogin={() => router.push('/start')}
        onOpenStoreProfile={() => {
          setIsSettingsOpen(false);
          setShowOnboarding(true);
        }}
        onOpenAccount={() => {
          setIsSettingsOpen(false);
          setShowAccountSettings(true);
        }}
        onOpenGuide={() => {
          setIsSettingsOpen(false);
          setShowGuide(true);
        }}
        onLogout={logout}
        storeProfile={storeProfile}
        plan={plan}
      />

      <div className="min-w-0">
        {!plan.isPro && isLoggedIn && <UpgradeBanner plan={plan.plan} onUpgrade={handleUpgrade} />}

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {isLoggedIn && !plan.canUseApp ? (
            <div className="relative h-full">
              <TrialEndedBarrier
                usageCount={plan.usage || 0}
                onUpgrade={handleUpgrade}
              />
              <div className="opacity-10 pointer-events-none blur-sm h-full">
                <PostGenerator
                  storeProfile={storeProfile!}
                  onSaveProfile={handleOnboardingSave}
                  isLoggedIn={isLoggedIn}
                  onOpenLogin={() => router.push('/start')}
                  presets={presets}
                  refreshPresets={fetchPresets}
                  onGenerateSuccess={handleGenerateSuccess}
                  onTaskComplete={() => { /* no-op */ }}
                  trainingItems={trainingItems}
                  onToggleFavorite={handleToggleTraining}
                  restorePost={activeHistoryItem}
                  onOpenGuide={() => setShowGuide(true)}
                  onOpenSettings={() => {
                    setActiveHistoryItem(null);
                    setIsSettingsOpen(true);
                  }}
                  onOpenHistory={() => setIsSidebarOpen(true)}
                  onLogout={logout}
                  plan={plan}
                  refreshPlan={refreshPlan}
                />
              </div>
            </div>
          ) : (
            <PostGenerator
              storeProfile={storeProfile!}
              onSaveProfile={handleOnboardingSave}
              isLoggedIn={isLoggedIn}
              onOpenLogin={() => router.push('/start')}
              presets={presets}
              refreshPresets={fetchPresets}
              onGenerateSuccess={handleGenerateSuccess}
              onTaskComplete={() => { /* no-op */ }}
              trainingItems={trainingItems}
              onToggleFavorite={handleToggleTraining}
              restorePost={activeHistoryItem}
              onOpenGuide={() => setShowGuide(true)}
              onOpenSettings={() => {
                setActiveHistoryItem(null);
                setIsSettingsOpen(true);
              }}
              onOpenHistory={() => setIsSidebarOpen(true)}
              onLogout={logout}
              plan={plan}
              refreshPlan={refreshPlan}
            />
          )}
        </main>
      </div>

      {showGuide && <GuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />}

      {showAccountSettings && (
        <AccountSettingsModal
          user={user}
          plan={plan}
          onClose={() => setShowAccountSettings(false)}
          onLogout={logout}
        />
      )}

      <TrainingReplacementModal
        isOpen={replacementModal.isOpen}
        onClose={() => setReplacementModal(prev => ({ ...prev, isOpen: false }))}
        onReplace={(id) => handleToggleTraining(replacementModal.newContent, replacementModal.platform, replacementModal.presetId, id)}
        currentItems={replacementModal.currentItems}
        newContent={replacementModal.newContent}
        platform={replacementModal.platform}
        presetName={presets.find(p => p.id === replacementModal.presetId)?.name || 'おまかせ'}
      />
    </div>
  );
}

export default App;
