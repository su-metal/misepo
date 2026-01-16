"use client";

import { Suspense } from "react";
import { useStartFlow } from "@/hooks/useStartFlow";

function StartPageContent() {
  const {
    loading,
    eligibleForTrial,
    startGoogleLogin
  } = useStartFlow();

  return (
    <main className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center px-4 py-12 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Cosmic Grain & Radiant Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.4] mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse opacity-50"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full opacity-30"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-1000">
        {/* Glass Portal Card */}
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl p-8 lg:p-10 relative overflow-hidden group">

          {/* Top Decorative Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-white/5 border border-white/5 rounded-full backdrop-blur-md">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Online</span>
            </div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter mb-2">
              MisePo <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Studio</span>
            </h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Next-Gen AI Marketing Engine</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 text-center backdrop-blur-sm">
              <p className="text-sm font-medium text-slate-300 leading-relaxed">
                {eligibleForTrial === false
                  ? "プロプラン（初月割引あり）に登録して、\n全機能へのアクセス権を取得してください。"
                  : "7日間の無料体験トライアルで、\nMisePoの全機能を解禁できます。"}
              </p>
            </div>

            <button
              className="group relative w-full py-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-indigo-900/30 hover:scale-[1.02] active:scale-95 transition-all overflow-hidden"
              onClick={() => startGoogleLogin("trial")}
              disabled={loading}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <div className="relative flex flex-col items-center justify-center gap-1">
                <span className="tracking-widest uppercase text-base">
                  {eligibleForTrial === false ? "AUTHENTICATE PRO" : "START FREE TRIAL"}
                </span>
                <span className="text-[9px] text-white/60 font-medium tracking-wide">
                  {eligibleForTrial === false ? "月額プランへ登録 / ログイン" : "Googleアカウントで認証"}
                </span>
              </div>
            </button>

            {loading && (
              <div className="flex items-center justify-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest animate-pulse">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                Establishing Secure Connection...
              </div>
            )}
          </div>

          <p className="text-[10px] text-slate-600 text-center mt-8 font-medium">
            初回は認証後に自動でアカウントが生成されます。<br />
            Design for 2026.
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
