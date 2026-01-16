// app/start/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Intent = "trial" | "login";

export default function StartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);

  const intent: Intent = (searchParams.get("intent") as Intent) ?? "login";

  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [canUseApp, setCanUseApp] = useState<boolean | null>(null);

  const startGoogleLogin = async (nextIntent: Intent) => {
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?intent=${encodeURIComponent(
          nextIntent
        )}`,
        queryParams: { prompt: "select_account" },
      },
    });

    if (error) {
      console.error("Google login error:", error.message);
      alert("Googleログインに失敗しました。もう一度お試しください。");
    }
  };

  const goCheckout = async () => {
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: "monthly" }),
    });
    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.ok || !data?.url) {
      // すでに有効なら、そのままアプリへ
      if (data?.error === "already_active") {
        router.replace("/");
        return;
      }
      alert(data?.error ?? `checkout failed (${res.status})`);
      return;
    }

    window.location.href = data.url;
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (cancelled) return;

        if (!data.user) {
          setIsLoggedIn(false);
          setCanUseApp(null);
          setLoading(false);
          return;
        }

        setIsLoggedIn(true);

        const res = await fetch("/api/me/plan", { cache: "no-store" });
        const payload = await res.json().catch(() => null);

        const allowed = !!(res.ok && payload?.ok && payload?.canUseApp);
        setCanUseApp(allowed);

        // ✅ 使えるなら即アプリへ
        if (allowed) {
          router.replace("/");
          return;
        }

        // ✅ intent=trial なら「ログイン後に自動でCheckoutへ」(ボタン増やさない)
        if (intent === "trial") {
          await goCheckout();
          return;
        }

        // intent=login ならここに残す（体験開始ボタンを押させる）
        setLoading(false);
      } catch (e) {
        console.warn("StartPage bootstrap failed:", e);
        setIsLoggedIn(false);
        setCanUseApp(null);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [intent, router, supabase]);

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl shadow-xl p-8 text-center">
        <h1 className="text-3xl font-black text-slate-800 mb-3">MisePo 入口</h1>

        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          7日無料体験（カード登録必須）で全機能をお試しいただけます。
        </p>

        <div className="space-y-4">
          {/* ✅ 常に2ボタン。どちらもGoogleログインへ */}
          <button
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-600 transition-all"
            onClick={() => startGoogleLogin("trial")}
            disabled={loading}
          >
            7日無料体験を開始（Google）
          </button>

          <button
            className="w-full py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:border-slate-300 transition-all"
            onClick={() => startGoogleLogin("login")}
            disabled={loading}
          >
            ログイン（Google）
          </button>

          {loading && (
            <div className="text-sm text-slate-400">確認中...</div>
          )}

          {/* デバッグ用（本番は消してOK） */}
          {/* <div className="text-[10px] text-slate-300">
            loggedIn:{String(isLoggedIn)} canUseApp:{String(canUseApp)} intent:{intent}
          </div> */}
        </div>

        <p className="text-[11px] text-slate-400 mt-6">
          初回はログイン後に自動でアカウントが作成されます。
        </p>
      </div>
    </main>
  );
}
