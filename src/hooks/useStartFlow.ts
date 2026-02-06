import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { UserPlan } from '@/types';

export function useStartFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);

  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [canUseApp, setCanUseApp] = useState<boolean | null>(null);
  const [eligibleForTrial, setEligibleForTrial] = useState<boolean>(true);
  const [currentPlan, setCurrentPlan] = useState<UserPlan | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const isSwitch = searchParams.get("switch") === "1";
  const error = searchParams.get("error");
  const errorCode = searchParams.get("error_code");
  const errorDescription = searchParams.get("error_description");

  const [intent, setIntent] = useState<"trial" | "login" | "free_trial" | null>(null);
  const [initialPlan, setInitialPlan] = useState<"entry" | "standard" | "professional">("standard");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromUrl = searchParams.get("intent") as "trial" | "login" | null;
    const fromStorage = window.localStorage.getItem("login_intent") as "trial" | "login" | null;
    const resolved = fromUrl ?? fromStorage ?? "login";
    setIntent(resolved);

    const planFromUrl = searchParams.get("plan") as "entry" | "standard" | "professional" | null;
    const planFromStorage = window.localStorage.getItem("login_plan") as "entry" | "standard" | "professional" | null;
    if (planFromUrl) setInitialPlan(planFromUrl);
    else if (planFromStorage) setInitialPlan(planFromStorage);
  }, [searchParams]);

  const goCheckout = useCallback(async (plan: "entry" | "standard" | "professional" = initialPlan) => {
    setIsRedirecting(true);
    setIntent("login"); // Reset intent to prevent automatic re-triggering loop
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json().catch(() => null);

    if (res.ok && data?.ok && data?.url) {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("login_intent");
        window.localStorage.removeItem("login_plan");
      }
      window.location.href = data.url;
    } else if (data?.error === "already_active") {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("login_intent");
      }
      router.replace("/generate");
    } else {
      setIsRedirecting(false);
      setLoading(false);
      alert(data?.error ?? "Checkout failed");
    }
  }, [router, initialPlan]);

  const startGoogleLogin = async (nextIntent: "trial" | "login" | "free_trial", nextPlan: "entry" | "standard" | "professional" = "standard") => {
    if (isLoggedIn) {
      if (nextIntent === "free_trial") {
        router.replace("/generate");
        return;
      }
      if (nextIntent === "trial") {
        goCheckout(nextPlan);
        return;
      }
    }

    if (typeof window !== "undefined") {
      window.localStorage.removeItem("login_intent");
      window.localStorage.removeItem("login_plan");
      window.localStorage.setItem("login_intent", nextIntent);
      window.localStorage.setItem("login_plan", nextPlan);
    }

    await supabase.auth.signOut();

    const origin = window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?intent=${encodeURIComponent(nextIntent)}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleFocus = () => {
      setIsRedirecting(false);
      setLoading(false);
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    if (intent === null) return;

    setIsRedirecting(false); // Reset on every update to catch return from redirect
    let cancelled = false;
    (async () => {
      try {
        if (error || errorCode) {
          await supabase.auth.signOut();
          if (!cancelled) {
            setIsLoggedIn(false);
            setLoading(false);
          }
          return;
        }

        const { data, error: userError } = await supabase.auth.getUser();
        if (cancelled) return;

        if (userError || !data.user) {
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }

        setIsLoggedIn(true);
        const res = await fetch("/api/me/plan", { cache: "no-store" });
        const payload = await res.json().catch(() => null);

        if (cancelled) return;

        const allowed = !!(res.ok && payload?.ok && payload?.canUseApp);
        const isOutOfCredits = payload?.usage !== undefined && payload?.limit !== undefined && payload.usage >= payload.limit && payload.limit > 0;

        setCanUseApp(allowed);
        setEligibleForTrial(payload?.eligibleForTrial ?? true);
        setCurrentPlan(payload);

        if (allowed) {
          const isUpgrade = searchParams.get("upgrade") === "true";

          if (intent === "trial" && (isUpgrade || isOutOfCredits)) {
            goCheckout(initialPlan);
            return;
          }

          if (isUpgrade || isOutOfCredits || isSwitch) {
            setLoading(false);
            setIsLoggedIn(true);
            return;
          }

          if (typeof window !== "undefined") {
            window.localStorage.removeItem("login_intent");
            window.localStorage.removeItem("login_plan");
          }
          router.replace("/generate");
          return;
        }

        if (intent === "trial") {
          goCheckout(initialPlan);
          return;
        }

        if (intent === "free_trial" && !allowed) {
          // もし無料トライアルインテントなのに権限がない場合（＝体験済み）
          // 無理にStripeには送らず、スタート画面でエラー（または現状提示）とする
          setLoading(false);
          return;
        }
        
        setLoading(false);
      } catch (err) {
        console.error('[useStartFlow] Fatal error in flow:', err);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [intent, router, supabase, goCheckout, isSwitch, searchParams, initialPlan, error, errorCode]);

  return {
    loading,
    isLoggedIn,
    canUseApp,
    eligibleForTrial,
    intent: intent ?? "login",
    isRedirecting,
    isSwitch,
    error,
    errorCode,
    errorDescription,
    startGoogleLogin,
    goCheckout,
    initialPlan,
    currentPlan
  };
}
