"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useStartFlow } from "@/hooks/useStartFlow";

function StartPageContent() {
  const {
    loading,
    isLoggedIn,
    eligibleForTrial,
    isRedirecting,
    intent,
    startGoogleLogin
  } = useStartFlow();

  // Show full-screen loader when:
  // 1. Redirecting to checkout, OR
  // 2. Intent is trial and user is logged in (about to redirect)
  if (isRedirecting || (intent === "trial" && isLoggedIn)) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-black backdrop-blur-3xl border border-lime/20 rounded-2xl shadow-xl">
            <div className="w-3 h-3 bg-lime rounded-full animate-bounce"></div>
            <span className="text-sm font-black text-lime uppercase tracking-widest">
              Redirecting to checkout...
            </span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/50 text-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden selection:bg-indigo-100">
      {/* Decorative Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-200/30 blur-[120px] rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-200/30 blur-[100px] rounded-full opacity-30"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-1000">
        {/* Modern Glass Card */}
        <div className="bg-white/70 backdrop-blur-3xl border border-white shadow-2xl shadow-indigo-100/50 rounded-[2.5rem] p-8 lg:p-10 relative overflow-hidden group">

          {/* Back to Top */}
          <Link
            href="/"
            className="absolute top-6 left-8 flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all duration-300 group/back z-20"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover/back:-translate-x-1 transition-transform"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover/back:opacity-100 -translate-x-2 group-hover/back:translate-x-0 transition-all">Top</span>
          </Link>

          <div className="text-center mb-10 pt-4">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-white border border-indigo-100 rounded-full shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-widest">Ready to Start</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">
              MisePo <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Studio</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Next-Gen AI Marketing Engine</p>
          </div>

          <div className="space-y-6">
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 text-center backdrop-blur-sm">
              <p className="text-sm font-bold text-slate-700 leading-relaxed whitespace-pre-line">
                {eligibleForTrial === false
                  ? "プロプラン（初月割引あり）に登録して、\n全機能へのアクセス権を取得してください。"
                  : "7日間の無料体験トライアルで、\nMisePoの全機能を解禁できます。"}
              </p>
            </div>

            <button
              className="group relative w-full py-5 bg-slate-900 text-white font-bold text-lg rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all overflow-hidden"
              onClick={() => startGoogleLogin("trial")}
              disabled={loading}
            >
              <div className="flex flex-col items-center justify-center">
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      {eligibleForTrial === false ? "プロプランに登録する" : "無料で試してみる"}
                    </>
                  )}
                </span>
                {!loading && (
                  <span className="text-[9px] text-slate-400 font-medium tracking-wide mt-1 uppercase">
                    Googleアカウントで認証
                  </span>
                )}
              </div>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-4">
            <p className="text-[10px] text-slate-400 text-center font-medium leading-relaxed">
              初回は認証後に自動でアカウントが生成されます。<br />
              安心してご利用ください。
            </p>
            <div className="flex items-center gap-4 text-slate-300">
              <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function StartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">Loading...</div>}>
      <StartPageContent />
    </Suspense>
  );
}
