"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function StartPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [canUseApp, setCanUseApp] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!isMounted) return;

      if (!data.user) {
        setIsLoggedIn(false);
        setCanUseApp(null);
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);
      try {
        const res = await fetch("/api/me/plan", { cache: "no-store" });
        const payload = await res.json().catch(() => null);
        if (res.ok && payload?.ok) {
          const allowed = !!payload?.canUseApp;
          setCanUseApp(allowed);
          if (allowed) {
            router.replace("/");
            return;
          }
        } else {
          setCanUseApp(false);
        }
      } catch (err) {
        console.warn("plan fetch failed:", err);
        setCanUseApp(false);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [router, supabase]);

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

  const handleStartTrial = async () => {
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "monthly" }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok || !data?.url) {
        alert(data?.error ?? `checkout failed (${res.status})`);
        return;
      }
      window.location.href = data.url;
    } catch (err) {
      console.error("checkout error:", err);
      alert("checkout failed");
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl shadow-xl p-8 text-center">
        <h1 className="text-3xl font-black text-slate-800 mb-3">MisePo 入口</h1>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          7日無料体験（カード登録必須）で全機能をお試しいただけます。
        </p>

        <div className="space-y-4">
          {!isLoggedIn && (
            <button
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-600 transition-all"
              onClick={handleLoginGoogle}
            >
              Googleでログイン
            </button>
          )}

          {isLoggedIn && !loading && canUseApp === false && (
            <button
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-600 transition-all"
              onClick={handleStartTrial}
            >
              7日無料体験を開始
            </button>
          )}

          {isLoggedIn && loading && (
            <div className="text-sm text-slate-400">確認中...</div>
          )}
        </div>

        <p className="text-[11px] text-slate-400 mt-6">
          初回は自動でアカウントが作成されます。
        </p>
      </div>
    </main>
  );
}
