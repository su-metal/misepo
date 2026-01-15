"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from "@/lib/supabase/client";
import {
  AppState,
  StoreProfile,
  GeneratedPost,
  GeneratedResult,
  Preset,
  Platform,
  Length,
  Tone,
  PostPurpose,
  GoogleMapPurpose,
} from "./types";
import { GUEST_PROFILE } from './constants';
import Onboarding from './components/Onboarding';
import PostGenerator from './components/PostGenerator';
import HistorySidebar from './components/HistorySidebar';
import DevTools from './components/DevTools';
import UpgradeModal from './components/UpgradeModal';
import LoginModal from './components/LoginModal';
import OnboardingSuccess from './components/OnboardingSuccess';
import GuestDemoModal from './components/GuestDemoModal';
import GuideModal from './components/GuideModal';
import { LockIcon, LogOutIcon } from './components/Icons';
import { useRouter } from 'next/navigation';

const storageKey = (base: string, uid: string | null) =>
  `misepo:${base}:${uid ?? "guest"}`;

const readFromStorage = <T,>(base: string, uid: string | null): T | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(storageKey(base, uid));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Failed to parse storage key ${base}`, err);
    return null;
  }
};

const writeToStorage = (base: string, uid: string | null, value: any) => {
  if (typeof window === "undefined") return;
  const key = storageKey(base, uid);
  if (value === null || value === undefined) {
    localStorage.removeItem(key);
    return;
  }
  localStorage.setItem(key, JSON.stringify(value));
};

const hasShownStartBonus = (uid: string | null) => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(storageKey("start_bonus", uid));
};

const markStartBonusShown = (uid: string | null) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey("start_bonus", uid), "true");
};

const normalizeStoreProfile = (profile: any): StoreProfile | null => {
  if (!profile || typeof profile !== "object") return null;

  const industry =
    typeof profile.industry === "string" ? profile.industry : "";
  const name =
    typeof profile.store_name === "string"
      ? profile.store_name
      : typeof profile.name === "string"
        ? profile.name
        : "";
  const region =
    typeof profile.area === "string"
      ? profile.area
      : typeof profile.region === "string"
        ? profile.region
        : "";
  const description =
    typeof profile.highlights === "string"
      ? profile.highlights
      : typeof profile.description === "string"
        ? profile.description
        : "";
  const instagramFooter =
    typeof profile.instagram_signature === "string"
      ? profile.instagram_signature
      : typeof profile.instagramFooter === "string"
        ? profile.instagramFooter
        : "";

  if (!industry || !name) return null;

  return {
    industry,
    name,
    region,
    description,
    instagramFooter,
  };
};

const App: React.FC = () => {
  const supabase = createClient();
  const router = useRouter();
  // --- State Management ---
  const [storeProfile, setStoreProfile] = useState<StoreProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [history, setHistory] = useState<GeneratedPost[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOnboardingSuccess, setShowOnboardingSuccess] = useState(false);
  const [showGuestDemoModal, setShowGuestDemoModal] = useState(false);
  const shouldShowTour = false;

  // Triggers
  const [resetResultsTrigger, setResetResultsTrigger] = useState(0);

  // Restoration State
  const [restorePost, setRestorePost] = useState<GeneratedPost | null>(null);

  // --- Limits Management ---
  const [retryCount, setRetryCount] = useState(0);
  // Replaced guestLimitReached boolean with dailyUsageCount number
  const [dailyUsageCount, setDailyUsageCount] = useState(0);

  // --- Upgrade Flow State ---
  const [isTryingToUpgrade, setIsTryingToUpgrade] = useState(false);
  const [upgradeModalStep, setUpgradeModalStep] = useState<'intro' | 'payment'>('intro');

  // --- Auth & Persistence (Supabase is source of truth for login state) ---
  const [authReady, setAuthReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!alive) return;

      const loggedIn = !!session?.user;
      const currentUserId = session?.user?.id ?? null;
      setIsLoggedIn(loggedIn);
      setUserId(currentUserId);
      await refreshPlan(loggedIn);

      // No automatic guest demo modal anymore

      const savedHistory = localStorage.getItem('misepo_history');
      if (savedHistory && loggedIn) {
        setHistory(JSON.parse(savedHistory));
      }

      checkDailyLimit();

      setAuthReady(true);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const loggedIn = !!session?.user;
      const nextUserId = session?.user?.id ?? null;
      setUserId(nextUserId);
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        refreshPlan(true);
      } else {
        setIsPro(false);
      }

      if (loggedIn) {
        setShowLoginModal(false);

        localStorage.removeItem('misepo_daily_usage');
        setDailyUsageCount(0);

        setResetResultsTrigger(prev => prev + 1);

        const savedProfile = readFromStorage<StoreProfile>("store_profile", nextUserId);
        // Do not auto-open onboarding even if profile missing
        if (event === "SIGNED_IN") {
          const metadata = session?.user?.user_metadata ?? {};
          const hasSeenStartBonus = Boolean(metadata.start_bonus_shown);
          if (!hasSeenStartBonus && !hasShownStartBonus(nextUserId)) {
            setShowOnboardingSuccess(true);
            markStartBonusShown(nextUserId);
            void (async () => {
              const { error } = await supabase.auth.updateUser({
                data: {
                  ...metadata,
                  start_bonus_shown: true,
                },
              });
              if (error) {
                console.error("[onboarding] failed to mark start bonus:", error.message);
              }
            })();
          }
        }

      } else {
        setHistory([]);
        setPresets([]);
        setResetResultsTrigger(prev => prev + 1);
      }
    });

    return () => {
      alive = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchHistoryFromServer = async (): Promise<GeneratedPost[] | null> => {
    try {
      const res = await fetch("/api/me/history", { cache: "no-store" });
      const data = await res.json();
      if (!data?.ok || !Array.isArray(data.history)) {
        return null;
      }
      return data.history.map(mapHistoryEntry);
    } catch (err) {
      console.warn("history fetch failed:", err);
      return null;
    }
  };

  const fetchStoreProfileFromServer = async () => {
    if (!userId) return;
    try {
      const res = await fetch("/api/me/store-profile", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (!data?.ok) return;
      if (data.profile == null) {
        setStoreProfile(null);
        return;
      }

      const normalized = normalizeStoreProfile(data.profile);
      if (!normalized) {
        setStoreProfile(null);
        return;
      }

      setStoreProfile(normalized);
      writeToStorage("store_profile", userId, normalized);
    } catch (err) {
      console.warn("store profile fetch failed:", err);
    }
  };

  const refreshPresets = useCallback(async () => {
    if (!authReady || !isLoggedIn || !userId) return;

    try {
      const res = await fetch("/api/me/presets", { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok && Array.isArray(data.presets)) {
        setPresets(data.presets);
      } else if (data?.ok === false) {
        console.warn("Unable to load presets:", data.error ?? res.status);
        setPresets([]);
      }
    } catch (err) {
      console.warn("presets fetch failed:", err);
    }
  }, [authReady, isLoggedIn, userId]);

  useEffect(() => {
    if (!authReady) return;
    if (!isLoggedIn) {
      setHistory([]);
      return;
    }

    let cancelled = false;
    (async () => {
      const mapped = await fetchHistoryFromServer();
      if (!cancelled && mapped) {
        if (process.env.NODE_ENV !== "production") {
          console.log("history ids:", mapped.map((x) => x.id));
        }
        setHistory(mapped);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authReady, isLoggedIn]);

  const checkDailyLimit = () => {
    if (typeof window === 'undefined') return;

    const today = new Date().toDateString(); // e.g. "Mon Jan 01 2024"
    const stored = localStorage.getItem('misepo_daily_usage');

    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.date === today) {
          setDailyUsageCount(typeof data.count === 'number' ? data.count : 0);
        } else {
          // New day, reset count
          localStorage.setItem('misepo_daily_usage', JSON.stringify({ date: today, count: 0 }));
          setDailyUsageCount(0);
        }
      } catch (e) {
        // Error parsing, reset
        setDailyUsageCount(0);
        localStorage.setItem('misepo_daily_usage', JSON.stringify({ date: today, count: 0 }));
      }
    } else {
      // No data
      setDailyUsageCount(0);
    }
  };

  const refreshPlan = async (loggedInOverride?: boolean) => {
    const canFetch = loggedInOverride ?? isLoggedIn;
    if (!canFetch) {
      setIsPro(false);
      return;
    }

    try {
      const res = await fetch("/api/me/plan");
      if (!res.ok) {
        setIsPro(false);
        return;
      }
      const data = await res.json();
      setIsPro(!!data?.isPro);
    } catch (err) {
      console.warn("plan refresh failed:", err);
    }
  };

  // Re-check limit if Pro status changes
  useEffect(() => {
    if (isPro) {
      setDailyUsageCount(0); // Pro has no limit constraints
    } else {
      checkDailyLimit();
    }
  }, [isPro]);

  useEffect(() => {
    if (!authReady) return;

    if (!userId) {
      const guestProfile = readFromStorage<StoreProfile>("store_profile", null);
      setStoreProfile(guestProfile);
      return;
    }

    setStoreProfile(null);
    const cachedProfile = readFromStorage<StoreProfile>("store_profile", userId);
    if (cachedProfile) {
      setStoreProfile(cachedProfile);
    }
    fetchStoreProfileFromServer();
  }, [authReady, userId]);

  useEffect(() => {
    if (!authReady || !storeProfile) return;
    writeToStorage("store_profile", userId, storeProfile);
  }, [authReady, storeProfile, userId]);

  useEffect(() => {
    if (!authReady) return;
    if (isLoggedIn) {
      refreshPresets();
      return;
    }

    setPresets([]);
  }, [authReady, isLoggedIn, refreshPresets]);

  useEffect(() => {
    if (!authReady || !isLoggedIn) return;
    localStorage.setItem('misepo_history', JSON.stringify(history));
  }, [authReady, history, isLoggedIn]);

  // --- Handlers ---

  const handleLoginGoogle = async () => {
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${origin}/auth/callback` },
    });
    if (error) {
      console.error("Google login error:", error.message);
      alert("Googleログインに失敗しました。もう一度お試しください。");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setIsPro(false);
    setUserId(null);
    router.push('/start');
  };

  const saveStoreProfileToServer = async (profile: StoreProfile) => {
    const payload = {
      industry: profile.industry,
      store_name: profile.name,
      area: profile.region || undefined,
      highlights: profile.description || undefined,
      instagram_signature: profile.instagramFooter || undefined,
    };

    const res = await fetch("/api/me/store-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile: payload }),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok) {
      throw new Error(data?.error ?? `store profile save failed (${res.status})`);
    }
  };


  const handleOnboardingSave = async (profile: StoreProfile) => {
    if (!isLoggedIn) {
      alert("ログイン後に保存できます。");
      return;
    }

    try {
      await saveStoreProfileToServer(profile);
    } catch (err) {
      console.error("store profile save failed:", err);
      alert("保存に失敗しました。時間をおいて再度お試しください。");
      return;
    }

    setStoreProfile(profile);
    setShowSettings(false);

    setResetResultsTrigger(prev => prev + 1);
  };

  const handleGenerateSuccess = (newPost: GeneratedPost) => {
    if (isLoggedIn) {
      (async () => {
        const mapped = await fetchHistoryFromServer();
        if (mapped) {
          setHistory(mapped);
        }
      })();
    }

    // Apply limit tracking to anyone who is NOT Pro
    if (!isPro) {
      const today = new Date().toDateString();
      const newCount = dailyUsageCount + 1;
      setDailyUsageCount(newCount);
      localStorage.setItem('misepo_daily_usage', JSON.stringify({ date: today, count: newCount }));
    }
  };

  const handleConsumeCredit = () => {
    if (!isPro) {
      const today = new Date().toDateString();
      const newCount = dailyUsageCount + 1;
      setDailyUsageCount(newCount);
      localStorage.setItem('misepo_daily_usage', JSON.stringify({ date: today, count: newCount }));
    }
  };

  const normalizePlatform = (value: unknown): Platform => {
    if (typeof value === "string") {
      const match = Object.values(Platform).find((v) => v === value);
      if (match) return match;
    }
    return Platform.Instagram;
  };

  const normalizeResults = (
    raw: any,
    fallbackPlatform: Platform
  ): GeneratedResult[] => {
    if (!raw) return [];

    const asArray = Array.isArray(raw)
      ? raw
      : Array.isArray(raw.results)
        ? raw.results
        : [];

    const extracted = asArray
      .map((item) => {
        if (item && Array.isArray(item.data)) {
          return {
            platform: normalizePlatform(item.platform ?? fallbackPlatform),
            data: item.data.map((text: any) => (typeof text === "string" ? text : String(text))),
          };
        }
        return null;
      })
      .filter((item) => item !== null) as GeneratedResult[];

    if (extracted.length > 0) return extracted;

    if (Array.isArray(raw) && raw.every((item) => typeof item === "string")) {
      return [
        {
          platform: fallbackPlatform,
          data: raw.map((text) => String(text)),
        },
      ];
    }

    if (Array.isArray(raw.results) && raw.results.every((item) => typeof item === "string")) {
      return [
        {
          platform: fallbackPlatform,
          data: raw.results.map((text: any) => String(text)),
        },
      ];
    }

    return [];
  };

  const mapHistoryEntry = (entry: any): GeneratedPost => {
    const createdAt = entry.created_at
      ? new Date(entry.created_at).getTime()
      : Date.now();

    const inputPayload = entry.input ?? {};
    const configSource = inputPayload.config ?? {};
    const platforms: Platform[] = Array.isArray(configSource.platforms)
      ? configSource.platforms
      : configSource.platform
        ? [configSource.platform]
        : [Platform.Instagram];

    const purposeValue = configSource.purpose;
    const postPurpose = Object.values(PostPurpose).includes(purposeValue)
      ? (purposeValue as PostPurpose)
      : PostPurpose.Promotion;
    const gmapPurpose = Object.values(GoogleMapPurpose).includes(purposeValue)
      ? (purposeValue as GoogleMapPurpose)
      : GoogleMapPurpose.Auto;

    const toneValue = configSource.tone ?? Tone.Standard;
    const lengthValue = configSource.length ?? Length.Medium;

    const platformForGroup: Platform = platforms[0] ?? Platform.Instagram;

    const historyResults = normalizeResults(
      entry.output ?? entry.output?.results ?? entry,
      platformForGroup
    );
    const results = historyResults.length > 0 ? historyResults : [
      {
        platform: platformForGroup,
        data: [],
      },
    ];


    const runId = entry.run_id ?? entry.id;
    if (!runId) {
      console.warn("History entry missing run_id/id:", entry);
    }

    return {
      id: runId ?? `invalid-${createdAt}`,
      timestamp: createdAt,
      config: {
        platforms,
        postPurpose,
        gmapPurpose,
        tone: toneValue,
        length: lengthValue,
        inputText: configSource.inputText ?? "",
        starRating: configSource.starRating ?? null,
        language: configSource.language,
        storeSupplement: configSource.storeSupplement,
        customPrompt: configSource.customPrompt,
        includeSymbols: configSource.includeSymbols,
        includeEmojis: configSource.includeEmojis,
        xConstraint140: configSource.xConstraint140,
        instagramFooter: configSource.instagramFooter,
      },
      results,
    };
  };

  const handleTaskComplete = () => {
    setRetryCount(0); // Reset retry count for new task
  };

  const handleRetryComplete = () => {
    if (!isPro) {
      setRetryCount(prev => prev + 1);
    }
  };

  const resetUsage = () => {
    // Dev tool reset
    localStorage.removeItem('misepo_daily_usage');
    setDailyUsageCount(0);
    setRetryCount(0);
  };

  const resetProfile = () => {
    // Dev tool profile reset (Reset to Guest)
    writeToStorage("store_profile", userId, null);
    // Also reset the "seen demo" flag so developer can test the flow again
    localStorage.removeItem('misepo_guest_demo_seen');

    setStoreProfile(null);
    setIsLoggedIn(false);
    setIsPro(false);
    setHistory([]); // Clear history state on reset
    setShowSettings(false);
    // Also reset usage for convenience
    resetUsage();

    // Trigger the demo modal again after a short delay since we are back to guest mode
    setTimeout(() => setShowGuestDemoModal(true), 500);
  };

  const handleSimulateRegisteredUser = () => {
    // Dev tool: Simulate registered user with specific data
    const demoProfile: StoreProfile = {
      industry: 'カフェ',
      name: 'cielcafe',
      region: '豊橋市',
      description: '身体に優しい素材を使ったランチや、ケーキを提供しています',
      instagramFooter: `Ciel Cafe coffee&eat
☎︎0532-26-3522

open11:00-close 17:00
（sat）open11:00-close22:00
（sun）open11:00-close18:00

📍441-8104愛知県豊橋市山田二番町33-1`
    };
    setStoreProfile(demoProfile);
    setIsLoggedIn(true);
    setDailyUsageCount(0); // Reset for demo
    localStorage.removeItem('misepo_daily_usage');
    setShowSettings(false);
    setShowLoginModal(false);
    setShowGuestDemoModal(false); // Ensure demo modal is closed
  };

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const handleHistorySelect = (post: GeneratedPost) => {
    setRestorePost(post);
  };

  const handleDeleteHistory = async (id: string) => {
    try {
      const res = await fetch(`/api/me/history/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "delete failed");
      }
      setHistory((prev) => prev.filter((item) => item.id !== id));
      if (restorePost?.id === id) {
        setRestorePost(null);
      }
    } catch (err) {
      console.warn("history delete failed:", err);
      alert("履歴の削除に失敗しました。時間をおいて再度お試しください。");
    }
  };

  // Upgrade Flow Handlers
  const handleTryUpgrade = (step: 'intro' | 'payment' = 'intro') => {
    setUpgradeModalStep(step);
    setIsTryingToUpgrade(true);
  };

  const handleManageSubscription = () => {
    setShowSettings(false);
    router.push("/billing/manage");
  };

  const handleConfirmUpgrade = async (plan: "monthly" | "yearly" = "monthly") => {
    if (!isLoggedIn) {
      setIsTryingToUpgrade(false);
      setShowLoginModal(true);
      return;
    }

    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok || !data?.url) {
        alert(data?.error ?? `checkout failed (${res.status})`);
        return;
      }

      setIsTryingToUpgrade(false);
      window.location.href = data.url;
    } catch (err) {
      console.error("checkout error:", err);
      alert("checkout failed");
    }
  };

  // Guest Demo Modal Handler
  const handleCloseGuestDemoModal = () => {
    setShowGuestDemoModal(false);
    localStorage.setItem('misepo_guest_demo_seen', 'true');
  };

  // Hydration safety check
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#F8FAFC]"></div>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC] relative overflow-hidden font-sans">

      {/* 1. Onboarding / Settings Overlay */}
      {showSettings && (
        <Onboarding
          onSave={handleOnboardingSave}
          initialProfile={storeProfile}
          onCancel={() => setShowSettings(false)}
          showSubscriptionLink={isLoggedIn && isPro}
          onManageSubscription={handleManageSubscription}
        />
      )}

      {/* 2. Onboarding Success Screen (NEW) */}
      {showOnboardingSuccess && (
        <OnboardingSuccess
          onDismiss={() => setShowOnboardingSuccess(false)}
        />
      )}

      {/* 3. Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginGoogle={handleLoginGoogle}
      />

      {/* 4. Upgrade Flow Modal */}
      <UpgradeModal
        isOpen={isTryingToUpgrade}
        onClose={() => setIsTryingToUpgrade(false)}
        onConfirmUpgrade={handleConfirmUpgrade}
        initialStep={upgradeModalStep}
      />

      {/* 6. Guest Demo Modal (NEW - First time only) */}
      {showGuestDemoModal && (
        <GuestDemoModal onClose={handleCloseGuestDemoModal} />
      )}

      {/* 7. Dev Tools (Floating) */}
      <DevTools
        isPro={isPro}
        resetUsage={resetUsage}
        resetProfile={resetProfile}
        simulateRegisteredUser={handleSimulateRegisteredUser}
      />

      {/* 8. Sidebar (History) */}
        <HistorySidebar
          history={history}
          isPro={isPro}
          isLoggedIn={isLoggedIn}
          onSelect={handleHistorySelect}
          isOpen={isSidebarOpen}
          toggleOpen={toggleSidebar}
          onOpenLogin={() => setShowLoginModal(true)}
          onOpenUpgrade={() => handleTryUpgrade('payment')}
          onDelete={handleDeleteHistory}
        />

      {/* 9. Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">

        {/* Decorative Background Blob */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none animate-blob"></div>
        <div className="absolute top-0 left-0 -mt-20 -ml-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none animate-blob animation-delay-2000"></div>

        {!isLoggedIn && (
          <div className="relative z-20 w-full max-w-[1600px] mx-auto px-4 py-2">
            <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-amber-50 to-white border border-amber-200 px-4 py-2 text-xs text-slate-700 shadow-sm">
              <span>入口ページは <strong className="text-amber-600">/start</strong> です</span>
              <button
                onClick={() => router.push('/start')}
                className="text-amber-600 font-bold hover:underline"
              >
                /startへ
              </button>
            </div>
          </div>
        )}

        {/* Mobile Header */}
        <div className="md:hidden bg-white/80 backdrop-blur-md p-4 flex items-center justify-between z-10 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="text-gray-600 p-2 hover:bg-gray-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl md:text-lg font-black tracking-tighter text-slate-800 leading-none">Mise<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Po</span><span className="text-amber-500">.</span></h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full border bg-white text-gray-400 border-gray-200 hover:text-indigo-600 transition-all"
                >
                  <span className="text-sm font-medium truncate max-w-[80px]">{storeProfile?.name || '店舗設定'}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-red-500 transition-colors"
                  title="ログアウト"
                >
                  <LogOutIcon className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-sm md:text-xs font-bold text-white bg-slate-900 px-4 py-2.5 md:px-3 md:py-1.5 rounded-full flex items-center gap-2 md:gap-1 hover:bg-slate-800 transition-colors shadow-sm"
              >
                <LockIcon className="w-4 h-4 md:w-3 md:h-3" />
                ログイン
              </button>
            )}
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block px-6 py-3 z-10">
          <div className="max-w-[1600px] mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-100 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                <span>履歴</span>
              </button>
              <div>
                <h1 className="text-xl font-black tracking-tighter text-slate-800 leading-none">Mise<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Po</span><span className="text-amber-500">.</span></h1>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5 whitespace-nowrap">お店のポストを丸っとおまかせ</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-2xl border border-white/60 shadow-sm">
                  <div className="flex flex-col items-end min-w-[100px]">
                    <span className="text-sm font-bold text-gray-700">{storeProfile ? storeProfile.name : '設定未完了'}</span>
                    <span className="text-[10px] text-gray-400">{storeProfile ? storeProfile.industry : '-'}</span>
                  </div>
                  <div className="h-6 w-px bg-gray-200"></div>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="p-1.5 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-white hover:shadow-md transition-all duration-300"
                    title="設定"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-white hover:shadow-md transition-all duration-300"
                    title="ログアウト"
                  >
                    <LogOutIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="font-bold text-xs bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  <LockIcon className="w-3 h-3" />
                  ログイン・登録
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Content Area - Reduced Padding & Full Width Control */}
        <main className="flex-1 overflow-y-auto p-4 relative z-0">
          <PostGenerator
            storeProfile={storeProfile || GUEST_PROFILE}
            isLoggedIn={isLoggedIn}
            onOpenLogin={() => setShowLoginModal(true)}
            dailyUsageCount={dailyUsageCount}
            isPro={isPro}
          presets={presets}
          refreshPresets={refreshPresets}
          onGenerateSuccess={handleGenerateSuccess}
            retryCount={retryCount}
            onTaskComplete={handleTaskComplete}
            onRetryComplete={handleRetryComplete}
            restorePost={restorePost}
            onTryUpgrade={() => handleTryUpgrade('payment')}
            onOpenGuide={() => setShowGuide(true)}
            resetResultsTrigger={resetResultsTrigger}
            shouldShowTour={shouldShowTour}
            onConsumeCredit={handleConsumeCredit}
          />
        </main>
      </div>
      <GuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </div>
  );
};

export default App;
