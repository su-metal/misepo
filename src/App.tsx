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
import AccountSettingsModal from './components/AccountSettingsModal';
import GuestDemoModal from './components/GuestDemoModal';
import GuideModal from './components/GuideModal';
import { LockIcon, LogOutIcon } from './components/Icons';


const UpgradeBanner = ({ plan, onUpgrade }: { plan: string, onUpgrade: () => void }) => (
  <div className="bg-primary p-4 flex items-center justify-between text-white text-sm border-b border-accent/20 shadow-2xl shadow-navy-900/40 relative overflow-hidden group">
    <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent pointer-events-none"></div>
    <div className="flex items-center gap-3 relative z-10">
      <span className="bg-accent px-3 py-1 rounded-full text-[10px] font-black uppercase text-white shadow-lg shadow-accent/30 tracking-widest">Free Plan</span>
      <span className="font-black tracking-tight hidden sm:inline">無料枠をご利用中です。Proプランで作成回数が無制限になります。</span>
      <span className="font-black tracking-tight sm:hidden text-xs">無料枠をご利用中です。</span>
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
  const [activeHistoryItem, setActiveHistoryItem] = useState<GeneratedPost | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showGuestDemo, setShowGuestDemo] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [initDone, setInitDone] = useState(false);

  const isLoggedIn = !!user;

  // --- Fetching Logic ---
  const fetchPresets = useCallback(async () => {
    try {
      const res = await fetch('/api/me/presets', { cache: 'no-store' });
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
      }
    } catch (err) {
      console.error('Failed to fetch presets:', err);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const res = await fetch('/api/me/history', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.ok) {
        setHistory((data.history || []).map(mapHistoryEntry));
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  }, [isLoggedIn]);

  const fetchFavorites = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const res = await fetch('/api/me/learning', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.ok && Array.isArray(data.favorites)) {
        // Normalize: trim all loaded favorites
        setFavorites(new Set(data.favorites.map((s: string) => s.trim())));
      }
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    }
  }, [isLoggedIn]);

  const fetchProfile = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const res = await fetch('/api/me/store-profile', { cache: 'no-store' });
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
    const init = async () => {
      await Promise.all([fetchProfile(), fetchHistory(), fetchPresets(), fetchFavorites()]);
      setInitDone(true);
    };
    init();
  }, [authLoading, fetchProfile, fetchHistory, fetchPresets, fetchFavorites]);

  // Strict Redirect for Paid-Only Model
  useEffect(() => {
    if (!authLoading && initDone && isLoggedIn) {
      // If initialized, logged in, but cannot use app (expired/free) -> Redirect to Payment
      if (!plan.canUseApp) {
        router.push('/start');
      }
    }
  }, [authLoading, initDone, isLoggedIn, plan.canUseApp, router]);

  // --- Handlers ---
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
    setHistory(prev => [post, ...prev]);
    setActiveHistoryItem(null);
  };

  const handleDeleteHistory = async (id: string) => {
    setHistory(prev => prev.filter(h => h.id !== id));
    if (isLoggedIn) {
      await fetch(`/api/me/history/${id}`, { method: 'DELETE' });
    }
  };

  const handleToggleFavorite = async (text: string, platform: any, presetId: string | null) => {
    if (!isLoggedIn) return;

    const normalizedText = text.trim();
    const isFavorited = favorites.has(normalizedText);

    // Optimistic Update
    setFavorites(prev => {
      const next = new Set(prev);
      if (isFavorited) next.delete(normalizedText);
      else next.add(normalizedText);
      return next;
    });

    try {
      const method = !isFavorited ? 'POST' : 'DELETE';
      let url = '/api/me/learning';
      if (isFavorited) {
        const params = new URLSearchParams({ content: normalizedText });
        url += `?${params.toString()}`;
      }

      // Handle legacy history items without presetId
      // Default to the first preset if available, or a fallback string (though DB likely won't block it, API might require valid preset logic in future)
      const effectivePresetId = presetId || presets[0]?.id || 'legacy_history_default';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: !isFavorited ? JSON.stringify({ content: normalizedText, platform, presetId: effectivePresetId }) : undefined
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || errorData.message || 'Failed to toggle favorite');
      }

      // Re-fetch to sync (optional, but safer)
      // fetchFavorites(); 
    } catch (err) {
      console.error('Toggle favorite failed:', err);
      // Revert
      setFavorites(prev => {
        const next = new Set(prev);
        if (isFavorited) next.add(normalizedText); // was true, failed to delete -> add back
        else next.delete(normalizedText); // was false, failed to add -> delete
        return next;
      });
      alert(`お気に入りの更新に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
    <div className="min-h-screen flex text-slate-700">
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
        onOpenGuide={() => setShowGuide(true)}
        onOpenSettings={() => setShowOnboarding(true)}
        onOpenAccount={() => setShowAccountSettings(true)}
        onLogout={logout}
        storeProfile={storeProfile}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {!plan.isPro && isLoggedIn && <UpgradeBanner plan={plan.plan} onUpgrade={() => router.push('/start')} />}

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <PostGenerator
            storeProfile={storeProfile!}
            isLoggedIn={isLoggedIn}
            onOpenLogin={() => router.push('/start')}
            presets={presets}
            refreshPresets={fetchPresets}
            onGenerateSuccess={handleGenerateSuccess}
            onTaskComplete={() => { /* no-op */ }}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            restorePost={activeHistoryItem}
            onOpenGuide={() => setShowGuide(true)}
            onOpenSettings={() => setShowOnboarding(true)}
            onOpenHistory={() => setIsSidebarOpen(true)}
            onLogout={logout}
            plan={plan}
          />
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
    </div>
  );
}

export default App;
