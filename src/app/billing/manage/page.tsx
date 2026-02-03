"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function BillingManagePage() {
  const supabase = createClient();
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setLoggedIn(!!data.session?.user);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [supabase]);

  const handleManage = async () => {
    setPortalLoading(true);
    setError(null);
    try {
      const returnUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      const res = await fetch("/api/billing/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnUrl }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok || !data?.url) {
        setError(data?.error ?? `エラー: ${res.status}`);
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("portal fallback:", err);
      setError("ポータルの作成に失敗しました。");
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="p-6">
        <p>読み込み中…</p>
      </main>
    );
  }

  if (!loggedIn) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-2">サブスク管理</h1>
        <p>ログイン後、サブスクの管理・解約をご利用いただけます。</p>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">サブスク管理</h1>
      <p className="text-gray-600 mb-6 leading-relaxed">
        Stripe のカスタマーポータルで、サブスクリプションの解約・カード情報の変更などを行えます。
      </p>
      <button
        onClick={handleManage}
        disabled={portalLoading}
        className="w-full bg-gradient-to-r from-orange-600 to-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-300 transition hover:opacity-90 disabled:opacity-60"
      >
        {portalLoading ? "ポータルを準備中…" : "サブスクを管理（解約）する"}
      </button>
      {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
      <Link
        href="/"
        className="mt-4 inline-flex w-full justify-center rounded-xl border border-gray-200 bg-white py-3 text-sm font-bold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
      >
        トップに戻る
      </Link>
      <p className="text-xs text-gray-400 mt-4">
        解約後は webhook で権利が更新され、利用期間の終了後にアクセスが停止します。
      </p>
    </main>
  );
}
