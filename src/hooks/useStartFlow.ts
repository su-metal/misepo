import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function useStartFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);

  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [canUseApp, setCanUseApp] = useState<boolean | null>(null);
  const [eligibleForTrial, setEligibleForTrial] = useState<boolean>(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // クライアントサイドで intent を取得 (SSR中は null、クライアントで確定)
  const [intent, setIntent] = useState<"trial" | "login" | null>(null);
  const [initialPlan, setInitialPlan] = useState<"entry" | "standard" | "professional">("standard");

  // intent の初期化 (クライアントサイドのみ)
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

  const startGoogleLogin = async (nextIntent: "trial" | "login", nextPlan: "entry" | "standard" | "professional" = "standard") => {
    // ログイン後のために intent と plan を保存
    if (typeof window !== "undefined") {
      window.localStorage.setItem("login_intent", nextIntent);
      window.localStorage.setItem("login_plan", nextPlan);
    }

    if (isLoggedIn) {
      await goCheckout(nextPlan);
      return;
    }

    // Force sign out first to ensure account selection works
    await supabase.auth.signOut();

    const origin = window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?intent=${encodeURIComponent(nextIntent)}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent', // Force consent screen to ensure account picker appears
        },
      },
    });
  };

  const goCheckout = useCallback(async (plan: "entry" | "standard" | "professional" = initialPlan) => {
    setIsRedirecting(true);
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json().catch(() => null);

    if (res.ok && data?.ok && data?.url) {
      // 決済へ進むので意図をクリア
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("login_intent");
        window.localStorage.removeItem("login_plan");
      }
      window.location.href = data.url;
    } else if (data?.error === "already_active") {
      // 既に有効ならストレージをクリアして遷移
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("login_intent");
      }
      router.replace("/generate");
    } else {
      setIsRedirecting(false);
      setLoading(false); // Ensure loading is off if checkout fails
      alert(data?.error ?? "Checkout failed");
    }
  }, [router]);

  // メインロジック: intent が確定してから実行
  useEffect(() => {
    // intent が null (未確定) の間は何もしない
    if (intent === null) return;

    let cancelled = false;
    (async () => {
      try {
        const { data, error: userError } = await supabase.auth.getUser();
        if (cancelled) return;

        if (userError || !data.user) {
          console.log('[useStartFlow] No user found or error:', userError);
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }

        setIsLoggedIn(true);
        console.log('[useStartFlow] User is logged in, fetching plan...');
        const res = await fetch("/api/me/plan", { cache: "no-store" });
        const payload = await res.json().catch(() => null);

        if (cancelled) return;

        const allowed = !!(res.ok && payload?.ok && payload?.canUseApp);
        const isOutOfCredits = payload?.usage !== undefined && payload?.limit !== undefined && payload.usage >= payload.limit && payload.limit > 0;

        setCanUseApp(allowed);
        setEligibleForTrial(payload?.eligibleForTrial ?? true);

        if (allowed) {
          console.log('[useStartFlow] User can use app, checking for upgrade intent or credit status...');
          
          // If the user explicitly came here to upgrade, OR if they are out of credits,
          // don't redirect them back to the app.
          const isUpgrade = searchParams.get("upgrade") === "true";
          if (isUpgrade || isOutOfCredits) {
            console.log('[useStartFlow] Upgrade intent or out of credits detected, staying on start page.');
            setLoading(false);
            setIsLoggedIn(true);
            return;
          }

          console.log('[useStartFlow] No upgrade intent, redirecting to /generate');
          if (typeof window !== "undefined") {
            window.localStorage.removeItem("login_intent");
          }
          router.replace("/generate");
          return;
        }

        console.log('[useStartFlow] User cannot use app. Intent:', intent);
        
        // Removed auto-checkout for trial intent. 
        // Backend now auto-assigns 7-day cardless trial to 'free' plan users on GET /api/me/plan.
        
        setLoading(false);
      } catch (err) {
        console.error('[useStartFlow] Fatal error in flow:', err);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [intent, router, supabase, goCheckout]);

  return {
    loading,
    isLoggedIn,
    canUseApp,
    eligibleForTrial,
    intent: intent ?? "login", // 外部には "login" をデフォルトとして返す
    isRedirecting,
    startGoogleLogin,
    goCheckout,
    initialPlan
  };
}
