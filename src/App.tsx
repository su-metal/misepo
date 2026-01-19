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


const UpgradeBanner = ({ plan, onUpgrade }: { plan: string, onUpgrade: () => void }) => (
  <div className="bg-[#001738] p-4 flex items-center justify-between text-white text-sm border-b border-[#E5005A]/20 shadow-2xl shadow-navy-900/40 relative overflow-hidden group">
    <div className="absolute inset-0 bg-gradient-to-r from-[#E5005A]/10 to-transparent pointer-events-none"></div>
    <div className="flex items-center gap-3 relative z-10">
      <span className="bg-[#E5005A] px-3 py-1 rounded-full text-[10px] font-black uppercase text-white shadow-lg shadow-[#E5005A]/30 tracking-widest">Free Plan</span>
      <span className="font-black tracking-tight hidden sm:inline">無料枠をご利用中です。Proプランで作成回数が無制限になります。</span>
      <span className="font-black tracking-tight sm:hidden text-xs">無料枠をご利用中です。</span>
    </div>
    <button onClick={onUpgrade} className="bg-white text-[#001738] px-5 py-2 rounded-xl font-black text-xs hover:bg-[#E5005A] hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95 relative z-10 uppercase tracking-widest">
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
      await fetch(`/api/me/history/${id}`, { method: 'DELETE' });
    }
  };

  if (authLoading || !initDone) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-[#E5005A] rounded-full animate-spin shadow-2xl shadow-[#E5005A]/10"></div>
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingFlow onSave={handleOnboardingSave} initialProfile={storeProfile!} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
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
        onLogout={logout}
        storeProfile={storeProfile}
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
    </div>
  );
}

export default App;
