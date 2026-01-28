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

  // intent の初期化 (クライアントサイドのみ)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromUrl = searchParams.get("intent") as "trial" | "login" | null;
    const fromStorage = window.localStorage.getItem("login_intent") as "trial" | "login" | null;
    const resolved = fromUrl ?? fromStorage ?? "login";
    setIntent(resolved);
  }, [searchParams]);

  const startGoogleLogin = async (nextIntent: "trial" | "login") => {
    // ログイン後のために intent を保存
    if (typeof window !== "undefined") {
      window.localStorage.setItem("login_intent", nextIntent);
    }

    if (isLoggedIn) {
      await goCheckout();
      return;
    }

    const origin = window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?intent=${encodeURIComponent(nextIntent)}`,
        queryParams: { prompt: "select_account" },
      },
    });
  };

  const goCheckout = useCallback(async () => {
    setIsRedirecting(true);
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: "monthly" }),
    });
    const data = await res.json().catch(() => null);

    if (res.ok && data?.ok && data?.url) {
      // 決済へ進むので意図をクリア
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("login_intent");
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
        setCanUseApp(allowed);
        setEligibleForTrial(payload?.eligibleForTrial ?? true);

        if (allowed) {
          console.log('[useStartFlow] User can use app, redirecting to /generate');
          if (typeof window !== "undefined") {
            window.localStorage.removeItem("login_intent");
          }
          router.replace("/generate");
          return;
        }

        console.log('[useStartFlow] User cannot use app. Intent:', intent);
        // intent が "trial" or "login" に関わらず、利用可能なら /generate へ送っている
        // ここに来るのは「利用不可（期限切れ、未登録）」の場合
        
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
    goCheckout
  };
}
