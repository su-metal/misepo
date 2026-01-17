"use client";

import { Suspense } from "react";
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
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12 relative overflow-hidden selection:bg-lime/30">
      {/* Tech Background (Industrial Theme) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime/10 blur-[120px] rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-stone-900/30 blur-[100px] rounded-full opacity-30"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-1000">
        {/* Glass Portal Card */}
        <div className="bg-stone-900/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl shadow-black/50 p-8 lg:p-10 relative overflow-hidden group">

          {/* Top Decorative Line */}
          <div className="absolute top-0 left-1/2 -transtone-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-lime to-transparent opacity-50"></div>

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-black/40 border border-lime/20 rounded-full backdrop-blur-md">
              <div className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse"></div>
              <span className="text-[10px] font-black text-lime uppercase tracking-widest">System Online</span>
            </div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter mb-2">
              MisePo <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime to-white">Studio</span>
            </h1>
            <p className="text-xs font-bold text-stone-500 uppercase tracking-[0.2em]">Next-Gen AI Marketing Engine</p>
          </div>

          <div className="space-y-6">
            <div className="bg-black/40 border border-lime/20 rounded-2xl p-6 text-center backdrop-blur-sm shadow-sm">
              <p className="text-sm font-medium text-stone-300 leading-relaxed">
                {eligibleForTrial === false
                  ? "プロプラン（初月割引あり）に登録して、\n全機能へのアクセス権を取得してください。"
                  : "7日間の無料体験トライアルで、\nMisePoの全機能を解禁できます。"}
              </p>
            </div>

            <button
              className="group relative w-full py-5 bg-black text-lime font-black text-sm rounded-2xl shadow-xl shadow-black/50 hover:scale-[1.02] active:scale-95 transition-all overflow-hidden border border-lime/50"
              onClick={() => startGoogleLogin("trial")}
              disabled={loading}
            >
              <div className="absolute inset-0 bg-lime/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <div className="relative flex flex-col items-center justify-center gap-1">
                <span className="tracking-widest uppercase text-base">
                  {eligibleForTrial === false ? "AUTHENTICATE PRO" : "START FREE TRIAL"}
                </span>
                <span className="text-[9px] text-lime/80 font-medium tracking-wide">
                  {eligibleForTrial === false ? "月額プランへ登録 / ログイン" : "Googleアカウントで認証"}
                </span>
              </div>
            </button>

            {loading && (
              <div className="flex items-center justify-center gap-2 text-[10px] font-black text-lime uppercase tracking-widest animate-pulse">
                <div className="w-1.5 h-1.5 bg-lime rounded-full animate-bounce"></div>
                Establishing Secure Connection...
              </div>
            )}
          </div>

          <p className="text-[10px] text-stone-500 text-center mt-8 font-medium">
            初回は認証後に自動でアカウントが生成されます。<br />
            Industrial Sports Tech Design.
          </p>
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
