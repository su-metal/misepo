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
      <main className="min-h-screen bg-[#f9f5f2] flex items-center justify-center relative overflow-hidden">
        <div className="relative z-10 animate-in fade-in zoom-in duration-700">
          <div className="bg-white border-[6px] border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,0.1)] rounded-[32px] p-12 flex flex-col items-center gap-8">
            <div className="relative">
              <div className="w-20 h-20 border-[6px] border-black/10 border-t-black rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-black rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-black text-black tracking-tight mb-2 uppercase italic italic">Redirecting...</h2>
              <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em]">Secure Checkout Connection</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen sm:max-h-screen bg-[#f9f5f2] text-black flex items-center justify-center px-4 py-4 relative overflow-hidden selection:bg-[#F5CC6D]">
      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[10%] w-32 h-32 border-[4px] border-black/5 rounded-full rotate-12"></div>
        <div className="absolute bottom-[20%] right-[10%] w-48 h-48 border-[4px] border-black/5 rounded-[40px] -rotate-12"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-800">
        <div className="bg-white border-[6px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] rounded-[40px] p-6 md:p-10 relative overflow-hidden group">

          {/* Back Button */}
          <Link
            href="/"
            className="absolute top-8 left-8 w-12 h-12 flex items-center justify-center bg-white border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all z-20 group/back hover:bg-[#F5CC6D]"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>

          <div className="text-center mb-6 pt-6">
            <div className="inline-block px-4 py-2 bg-[#F5CC6D] text-black border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-[10px] font-black uppercase tracking-[0.25em] mb-4 -rotate-1">
              READY TO START
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-black tracking-tighter leading-none mb-3 uppercase italic">
              MisePo <span className="text-[#E88BA3]">Studio</span>
            </h1>
            <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.3em]">Next-Gen AI Marketing Engine</p>
          </div>

          <div className="space-y-6">
            <div className="bg-black/[0.03] border-[3px] border-dashed border-black/10 rounded-[28px] p-4 text-center">
              <p className="text-sm font-black text-black/80 leading-relaxed whitespace-pre-line">
                {eligibleForTrial === false
                  ? "プロプランに登録して、\n全機能へのアクセス権を取得してください。"
                  : "Googleログインですぐに開始！\n7日間の無料体験（クレカ登録不要）"}
              </p>
            </div>

            <button
              className="group relative w-full py-4 bg-[#E88BA3] text-black border-[4px] border-black rounded-[24px] font-black text-lg italic shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] active:scale-95 transition-all overflow-hidden"
              onClick={() => startGoogleLogin("trial")}
              disabled={loading}
            >
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="relative z-10 flex items-center gap-3">
                  {loading ? (
                    <div className="w-6 h-6 border-[3px] border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      {eligibleForTrial === false ? "プロプランに登録する" : "無料で試してみる"}
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="group-hover:translate-x-1 transition-transform">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </span>
                {!loading && (
                  <span className="text-[9px] text-black/40 font-black uppercase tracking-widest mt-1">
                    Google ACCOUNT LOGIN
                  </span>
                )}
              </div>
            </button>
          </div>

          <div className="mt-6 pt-4 border-t-[3px] border-dashed border-black/5 flex flex-col items-center gap-4">
            <p className="text-[9px] text-black/30 text-center font-black leading-relaxed uppercase tracking-widest">
              初回は認証後に自動でアカウントが生成されます。<br />
              クレカ登録不要・10秒で開始できます。
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white border-[3px] border-black flex items-center justify-center text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-[#4DB39A] border-[3px] border-black flex items-center justify-center text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
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
    <Suspense fallback={<div className="min-h-screen bg-[#f9f5f2] flex items-center justify-center font-black italic">Loading...</div>}>
      <StartPageContent />
    </Suspense>
  );
}
