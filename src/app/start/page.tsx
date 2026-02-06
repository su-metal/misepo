"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useStartFlow } from "@/hooks/useStartFlow";
import { Icons } from "@/components/LandingPageIcons";

const NoiseOverlay = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.2] mix-blend-overlay z-0" style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
  }} />
);

function StartPageContent() {
  const {
    loading,
    isLoggedIn,
    eligibleForTrial,
    isRedirecting,
    intent,
    startGoogleLogin,
    initialPlan,
    currentPlan,
    error,
    errorCode,
    errorDescription
  } = useStartFlow();

  const [plan, setPlan] = useState<"entry" | "standard" | "professional">("standard");

  useEffect(() => {
    setPlan(initialPlan);
  }, [initialPlan]);

  if (isRedirecting || (intent === "trial" && isLoggedIn)) {
    return (
      <main className="min-h-screen bg-[#f0eae4] flex items-center justify-center relative overflow-hidden font-inter selection:bg-[#1823ff] selection:text-white">
        <NoiseOverlay />
        <div className="relative z-10 animate-in fade-in zoom-in-95 duration-1000">
          <div className="bg-white/80 backdrop-blur-2xl border border-white shadow-premium rounded-[3rem] p-16 flex flex-col items-center gap-10">
            <div className="relative">
              <div className="w-24 h-24 border-[3px] border-slate-200 border-t-[#1823ff] rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-[#1823ff] rounded-full animate-pulse shadow-[0_0_20px_rgba(24,35,255,0.3)]"></div>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-black text-[#282d32] tracking-tighter mb-3">接続中...</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">セキュアな通信を確立しています</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f0eae4] text-[#282d32] flex flex-col items-center px-4 py-12 relative overflow-hidden bg-gradient-mesh font-inter selection:bg-[#1823ff] selection:text-white pb-32">
      <NoiseOverlay />

      {/* Background Decor from cancel/page.tsx */}
      <div className="glow-orb absolute w-[30rem] h-[30rem] bg-rose-500/10 -top-20 -right-20 animate-pulse-gentle rounded-full blur-[120px] pointer-events-none" />
      <div className="glow-orb absolute w-[20rem] h-[20rem] bg-[#1823ff]/10 bottom-0 -left-20 animate-spin-slow rounded-full blur-[100px] pointer-events-none" />

      {/* Header matching cancel/page.tsx vibe but for Start */}
      <div className="w-full max-w-4xl relative z-10 flex flex-col items-center animate-in fade-in zoom-in-95 duration-1000">

        <Link
          href="/"
          className="group mb-8 inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] bg-white/50 hover:bg-white px-5 py-2 rounded-full border border-white transition-all shadow-sm"
        >
          <Icons.ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
          ホームへ戻る
        </Link>

        {/* Free Trial Banner - MOVED TO TOP AND STYLED AS REQUESTED */}
        {eligibleForTrial !== false && (
          <div className="w-full max-w-4xl mb-16 animate-in fade-in slide-in-from-top-8 duration-1000">
            <div className="bg-gradient-to-br from-[#6366f1] via-[#a855f7] to-[#ec4899] rounded-[3rem] p-10 md:p-14 flex flex-col items-center text-center relative overflow-hidden shadow-2xl shadow-[#a855f7]/20 group">
              <NoiseOverlay />
              {/* Background Decor for Banner */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10 mb-8">
                <span className="inline-block bg-white/20 border border-white/30 text-white text-[9px] font-black px-5 py-2 rounded-full uppercase tracking-[0.3em] backdrop-blur-md">
                  RISK_FREE DISCOVERY
                </span>
              </div>

              <h2 className="relative z-10 text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-6">
                まずは7日間、無料で体験
              </h2>

              <p className="relative z-10 text-sm md:text-base font-bold text-white/90 leading-relaxed max-w-xl mb-10">
                クレジットカード登録は不要。1日5回まで生成可能。<br className="hidden md:block" />
                10秒であなたの「分身」が投稿を作成し始めます。
              </p>

              <button
                onClick={() => startGoogleLogin("free_trial" as any, "standard")}
                disabled={loading}
                className="relative z-10 px-14 py-6 bg-white text-[#1823ff] rounded-[2rem] font-black text-xl tracking-[0.05em] shadow-2xl shadow-black/10 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-4 mb-8 group/btn"
              >
                無料で試してみる
                <Icons.ArrowRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>

              <div className="relative z-10 flex flex-wrap justify-center items-center gap-x-8 gap-y-4 mb-6">
                <div className="flex items-center gap-2 text-[10px] font-black text-white/70 uppercase tracking-widest">
                  <Icons.Check size={14} strokeWidth={4} />
                  NO CARD REQUIRED
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-white/70 uppercase tracking-widest">
                  <Icons.Check size={14} strokeWidth={4} />
                  1 DAY 5 GENERATIONS
                </div>
              </div>

              {!isLoggedIn && (
                <button
                  onClick={() => startGoogleLogin("login", initialPlan)}
                  className="relative z-10 text-[11px] font-black text-white/60 hover:text-white transition-colors underline underline-offset-4 decoration-white/20"
                >
                  すでにアカウントをお持ちの方
                </button>
              )}
            </div>
          </div>
        )}

        <div className="text-center mb-12">
          {isLoggedIn && (
            <Link
              href="/generate"
              className="group mb-4 inline-flex items-center gap-2 text-[10px] font-black text-[#1823ff] uppercase tracking-[0.3em] bg-white/80 px-5 py-2 rounded-full border border-[#1823ff]/10 transition-all shadow-sm"
            >
              Dashboardへ
            </Link>
          )}

          <h1 className="text-4xl md:text-5xl font-black text-[#282d32] tracking-tighter mb-4 leading-none animate-in slide-in-from-top-4 duration-700">
            プランを選択して<br /><span className="text-[#1823ff]">創造力を解放。</span>
          </h1>
          <p className="text-sm font-bold text-slate-400 max-w-sm mx-auto leading-relaxed">
            お店の「らしさ」を、AIの力でもっと身近に。<br />
            最適なプランを選んで、今すぐ体験を始めましょう。
          </p>
        </div>

        {/* Pricing Grid - MATCHING cancel/page.tsx EXACTLY */}
        <div className="grid md:grid-cols-3 gap-6 w-full">

          {/* Entry Plan Card */}
          <div className="group bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 flex flex-col relative transition-all border border-white hover:border-[#1823ff]/30 shadow-premium hover:-translate-y-2 duration-500">
            <div className="mb-6">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">ENTRY</span>
              <h3 className="text-2xl font-black text-[#282d32] tracking-tighter">エントリー</h3>
            </div>
            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-4xl font-black text-[#282d32]">¥980</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ month</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              {['月間50回生成', 'SNS / Google 全対応', '口コミ返信 AI自動生成', 'お手本学習 (分身機能)'].map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] font-bold text-slate-600 leading-tight">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-[-2px]">
                    <Icons.Check size={12} strokeWidth={4} className="text-[#1823ff]" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className="w-full py-4 bg-[#282d32] text-white rounded-2xl font-black text-[11px] tracking-[0.2em] uppercase hover:bg-black transition-all shadow-lg shadow-black/10 disabled:opacity-50"
              onClick={() => startGoogleLogin("trial", "entry")}
              disabled={loading}
            >
              {loading ? "..." : "START PROJECT"}
            </button>
          </div>

          {/* Standard Plan Card - HIGHLIGHTED - MATCHING cancel/page.tsx EXACTLY */}
          <div className="group bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 flex flex-col relative transition-all border-2 border-[#1823ff]/30 shadow-premium hover:-translate-y-3 duration-500 scale-[1.05] z-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1823ff] text-white text-[9px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl shadow-[#1823ff]/30 whitespace-nowrap">
              MOST POPULAR
            </div>
            <div className="mb-6 mt-2">
              <span className="text-[10px] font-black text-[#1823ff] uppercase tracking-widest mb-2 block">STANDARD</span>
              <h3 className="text-2xl font-black text-[#282d32] tracking-tighter">スタンダード</h3>
            </div>
            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-5xl font-black text-[#1823ff] tracking-tight">¥1,980</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ month</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              {['月間150回生成', 'SNS / Google 全対応', '口コミ返信 AI自動生成', 'お手本学習 (分身機能)'].map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] font-bold text-[#282d32] leading-tight">
                  <div className="w-5 h-5 rounded-full bg-[#1823ff]/10 flex items-center justify-center shrink-0 mt-[-2px]">
                    <Icons.Check size={12} strokeWidth={4} className="text-[#1823ff]" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className="w-full py-5 bg-gradient-primary text-white rounded-2xl font-black text-[12px] tracking-[0.2em] uppercase hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#1823ff]/20 disabled:opacity-50"
              onClick={() => startGoogleLogin("trial", "standard")}
              disabled={loading}
            >
              {loading ? "..." : "START NOW"}
            </button>
          </div>

          {/* Pro Plan Card - MATCHING cancel/page.tsx EXACTLY */}
          <div className="group bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 flex flex-col relative transition-all border border-white hover:border-[#7c3aed]/30 shadow-premium hover:-translate-y-2 duration-500">
            <div className="mb-6">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">PROFESSIONAL</span>
              <h3 className="text-2xl font-black text-[#282d32] tracking-tighter">プロ</h3>
            </div>
            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-4xl font-black text-[#282d32]">¥2,980</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ month</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              {['月間300回生成', 'SNS / Google 全対応', '口コミ返信 AI自動生成', 'お手本学習 (分身機能)'].map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] font-bold text-slate-600 leading-tight">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-[-2px]">
                    <Icons.Check size={12} strokeWidth={4} className="text-[#7c3aed]" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className="w-full py-4 bg-[#282d32] text-white rounded-2xl font-black text-[11px] tracking-[0.2em] uppercase hover:bg-black transition-all shadow-lg shadow-black/10 disabled:opacity-50"
              onClick={() => startGoogleLogin("trial", "professional")}
              disabled={loading}
            >
              {loading ? "..." : "UPGRADE PRO"}
            </button>
          </div>
        </div>

        {/* Footer info matching cancel/page.tsx vibe */}
        <div className="mt-20 pt-10 border-t border-slate-100 w-full text-center">
          <div className="flex flex-col items-center gap-8 opacity-40">
            <div className="flex items-center gap-10 text-slate-400">
              <Icons.Lock size={28} />
              <Icons.Shield size={28} />
            </div>
            <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-sm">
              何かお困りのことがあればサポートまでご連絡ください。<br />
              MisePo Security Shield Active.
            </p>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .shadow-premium {
          box-shadow: 0 30px 60px -12px rgba(0,0,0,0.06), 0 18px 36px -18px rgba(0,0,0,0.02);
        }
        .animate-pulse-gentle {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.05); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </main>
  );
}

export default function StartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f0eae4] flex items-center justify-center font-black uppercase tracking-[0.6em] text-[#1823ff] animate-pulse text-xs">Loading...</div>}>
      <StartPageContent />
    </Suspense>
  );
}
