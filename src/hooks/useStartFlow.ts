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

  // URLパラメータまたはストレージから intent を取得
  // (Googleログインから戻ってきた時に URL パラメータが消えることがあるため、ストレージも確認する)
  const intent = useMemo(() => {
    if (typeof window === "undefined") return "login";
    const fromUrl = searchParams.get("intent") as "trial" | "login" | null;
    const fromStorage = window.sessionStorage.getItem("login_intent") as "trial" | "login" | null;
    return fromUrl ?? fromStorage ?? "login";
  }, [searchParams]);

  const startGoogleLogin = async (nextIntent: "trial" | "login") => {
    // ログイン後のために intent を保存
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("login_intent", nextIntent);
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
        window.sessionStorage.removeItem("login_intent");
      }
      window.location.href = data.url;
    } else if (data?.error === "already_active") {
      router.replace("/");
    } else {
      setIsRedirecting(false);
      alert(data?.error ?? "Checkout failed");
    }
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (cancelled) return;

      if (!data.user) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);
      const res = await fetch("/api/me/plan", { cache: "no-store" });
      const payload = await res.json().catch(() => null);

      if (cancelled) return;

      const allowed = !!(res.ok && payload?.ok && payload?.canUseApp);
      setCanUseApp(allowed);
      setEligibleForTrial(payload?.eligibleForTrial ?? true);

      if (allowed) {
        // 利用可能なら意図をクリアして遷移
        if (typeof window !== "undefined") {
          window.sessionStorage.removeItem("login_intent");
        }
        router.replace("/generate");
        return;
      }

      if (intent === "trial") {
        await goCheckout();
        return;
      }

      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [intent, router, supabase, goCheckout]);

  return {
    loading,
    isLoggedIn,
    canUseApp,
    eligibleForTrial,
    intent,
    isRedirecting,
    startGoogleLogin,
    goCheckout
  };
}
