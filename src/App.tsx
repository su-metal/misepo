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
import GuestDemoModal from './components/GuestDemoModal';
import GuideModal from './components/GuideModal';
import { LockIcon, LogOutIcon } from './components/Icons';

// Inline simple components for now
const MobileHeader = ({ onOpenSidebar }: { onOpenSidebar: () => void }) => (
  <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-stone-100 sticky top-0 z-30">
    <h1 className="text-xl font-black text-stone-800">MisePo</h1>
    <button onClick={onOpenSidebar} className="p-2 bg-stone-50 rounded-lg text-stone-600">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
    </button>
  </header>
);

const UpgradeBanner = ({ plan, onUpgrade }: { plan: string, onUpgrade: () => void }) => (
  <div className="bg-orange-600 p-4 flex items-center justify-between text-white text-sm">
    <div className="flex items-center gap-2">
      <span className="bg-orange-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Free Plan</span>
      <span>無料枠をご利用中です。Proプランで作成回数が無制限になります。</span>
    </div>
    <button onClick={onUpgrade} className="bg-white text-orange-600 px-4 py-1 rounded-full font-bold text-xs hover:bg-stone-50 transition">
      Proへアップグレード
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

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showGuestDemo, setShowGuestDemo] = useState(false);
  const [initDone, setInitDone] = useState(false);

  const isLoggedIn = !!user;

  // --- Fetching Logic ---
  const fetchPresets = useCallback(async () => {
    try {
      const res = await fetch('/api/me/presets');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      const data = await res.json();
      if (data.ok) {
        setPresets(data.presets || []);
      }
    } catch (err) {
      console.error('Failed to fetch presets:', err);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const res = await fetch('/api/me/history');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      const data = await res.json();
      if (data.ok) {
        setHistory((data.history || []).map(mapHistoryEntry));
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  }, [isLoggedIn]);

  const fetchProfile = useCallback(async () => {
    if (!isLoggedIn) {
      const guest = readFromStorage<StoreProfile>('guest_profile', null) || GUEST_PROFILE;
      setStoreProfile(guest);
      return;
    }
    try {
      const res = await fetch('/api/me/store-profile');
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
      await Promise.all([fetchProfile(), fetchHistory(), fetchPresets()]);
      setInitDone(true);
    };
    init();
    init();
  }, [authLoading, fetchProfile, fetchHistory, fetchPresets]);

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
    } else {
      writeToStorage('guest_profile', null, profile);
    }
  };

  const handleGenerateSuccess = (post: GeneratedPost) => {
    setHistory(prev => [post, ...prev]);
    setActiveHistoryItem(null);
  };

  const handleDeleteHistory = async (id: string) => {
    setHistory(prev => prev.filter(h => h.id !== id));
    if (isLoggedIn) {
      await fetch(`/api/me/history?id=${id}`, { method: 'DELETE' });
    }
  };

  if (authLoading || !initDone) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-50">
        <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingFlow onSave={handleOnboardingSave} initialProfile={storeProfile!} />;
  }

  return (
    <div className="min-h-screen bg-stone-50 flex">
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
      />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden">

          <PostGenerator
            storeProfile={storeProfile!}
            isLoggedIn={isLoggedIn}
            onOpenLogin={() => router.push('/start')}
            presets={presets}
            refreshPresets={fetchPresets}
            onGenerateSuccess={handleGenerateSuccess}
            onTaskComplete={() => { /* no-op to prevent duplicate fetch race condition */ }}
            restorePost={activeHistoryItem}
            onOpenGuide={() => setShowGuide(true)}
            onOpenSettings={() => setShowOnboarding(true)}
            onOpenHistory={() => setIsSidebarOpen(true)}
            onLogout={logout}
          />
        </main>
      </div>

      {showGuide && <GuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />}
      {showGuestDemo && <GuestDemoModal onClose={() => setShowGuestDemo(false)} />}
    </div>
  );
}

export default App;
