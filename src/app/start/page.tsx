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
    isSwitch,
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
      <main className="min-h-screen bg-[#f0eae4] flex items-center justify-center relative overflow-hidden bg-gradient-mesh font-inter">
        <NoiseOverlay />
        <div className="glow-orb w-[30rem] h-[30rem] bg-[#1823ff]/20 animate-pulse-gentle" />
        <div className="relative z-10 animate-in fade-in zoom-in duration-700">
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-premium rounded-[3rem] p-12 flex flex-col items-center gap-8">
            <div className="relative">
              <div className="w-20 h-20 border-[4px] border-slate-200 border-t-[#1823ff] rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-[#1823ff] rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-black text-[#282d32] tracking-tight mb-2 uppercase">Redirecting...</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Secure Checkout Connection</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f0eae4] text-[#282d32] flex flex-col items-center justify-start sm:justify-center px-4 py-12 relative overflow-hidden bg-gradient-mesh font-inter selection:bg-[#1823ff] selection:text-white">
      <NoiseOverlay />

      {/* Background Decor */}
      <div className="glow-orb w-[40rem] h-[40rem] bg-[#1823ff]/10 -top-20 -right-20 animate-pulse-gentle" />
      <div className="glow-orb w-[30rem] h-[30rem] bg-[#7c3aed]/10 bottom-0 -left-20 animate-spin-slow" />

      {/* Back Button */}
      <Link
        href={isLoggedIn ? "/generate" : "/"}
        className="fixed top-8 left-8 z-30 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#282d32] transition-colors group px-6 py-3 bg-white/50 backdrop-blur-md rounded-full border border-white/50 shadow-sm"
      >
        <Icons.ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        {isLoggedIn ? "Back to Dashboard" : "Back to Home"}
      </Link>

      <div className="w-full max-w-4xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 flex flex-col items-center">

        <div className="text-center mb-16 pt-2">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-[#1823ff] w-12 h-12 flex items-center justify-center rounded-2xl shadow-lg shadow-[#1823ff]/30">
              <Icons.Smartphone size={24} className="text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-[#282d32] tracking-tighter leading-none mb-0 flex flex-col items-start translate-y-[-2px]">
              misepo
              <span className="text-[12px] font-black text-[#1823ff] uppercase tracking-[0.4em] ml-1">Studio</span>
            </h1>
          </div>
          <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em] max-w-sm">Ignite your social presence in seconds</p>
        </div>

        {(error || errorCode || errorDescription) && (
          <div className="mb-8 w-full max-w-2xl text-center bg-red-50/80 backdrop-blur-md border border-red-200/60 shadow-sm rounded-2xl px-6 py-4">
            <p className="text-[11px] font-black text-red-700 uppercase tracking-[0.2em]">
              他のアカウントでサインインしているため、いったんサインインを解除しました。
            </p>
            {(errorCode || errorDescription) && (
              <p className="mt-2 text-[10px] font-bold text-red-600 tracking-widest">
                {errorCode ?? error}: {errorDescription ?? "認証状態が見つかりませんでした。"}
              </p>
            )}
            <p className="mt-2 text-[10px] font-bold text-red-600 tracking-widest">
              ご希望のアカウントで再度サインインしてください。
            </p>
            <button
              className="mt-4 inline-flex items-center justify-center w-full max-w-[220px] mx-auto px-4 py-3 bg-white text-[#1823ff] font-black text-[11px] tracking-[0.2em] uppercase rounded-[30px] border border-[#1823ff] shadow-xl shadow-[#1823ff]/20 hover:bg-[#1823ff]/10 transition-all"
              onClick={() => startGoogleLogin("login", initialPlan)}
              disabled={loading}
            >
              {loading ? "..." : "再度サインインする"}
            </button>
          </div>
        )}

        {(isSwitch || isLoggedIn) && (
          <div className="mb-10 w-full max-w-2xl text-center bg-white/70 backdrop-blur-md border border-white/60 shadow-sm rounded-2xl px-6 py-4">
            <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.2em]">
              別アカウントでログインする場合は、下のボタンからログインしてください。
            </p>
            <p className="mt-2 text-[10px] font-bold text-slate-500 tracking-widest">
              Google で既に別アカウントが選択されている場合は、アカウント選択画面で切り替えてください。
            </p>
          </div>
        )}

        <div className="w-full max-w-3xl space-y-12">
          {/* Direct Trial Entry for Eligible Users */}
          {eligibleForTrial !== false && (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-primary rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="bg-gradient-primary text-white rounded-[3rem] p-10 md:p-12 text-center relative shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-shine opacity-20 animate-ticket-shine" />
                <div className="inline-block bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-6 py-2 rounded-full mb-6 uppercase tracking-[0.3em] border border-white/20">
                  Risk-Free Discovery
                </div>
                <h3 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-none">まずは7日間、無料で体験</h3>
                <p className="text-lg font-bold text-white/80 mb-10 leading-relaxed max-w-md mx-auto">
                  クレジットカード登録は不要。1日5回まで生成可能。10秒であなたの「分身」が投稿を作成し始めます。
                </p>
                <button
                  className="w-full max-w-sm mx-auto py-6 bg-white text-[#1823ff] rounded-[2rem] font-black text-xl md:text-2xl shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group"
                  onClick={() => startGoogleLogin("trial", "standard")}
                  disabled={loading}
                >
                  {loading ? <div className="w-6 h-6 border-[4px] border-[#1823ff]/20 border-t-[#1823ff] rounded-full animate-spin" /> : (
                    <>
                      無料で試してみる
                      <Icons.ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <div className="mt-8 flex items-center justify-center gap-8 text-[11px] font-black uppercase tracking-widest opacity-70">
                  <span className="flex items-center gap-2"><Icons.Check size={16} strokeWidth={4} /> No Card Required</span>
                  <span className="flex items-center gap-2"><Icons.Check size={16} strokeWidth={4} /> 1 Day 5 Generations</span>
                </div>
              </div>
            </div>
          )}

          <div className="pt-8">
            <div className="text-center mb-12">
              <h2 className="text-gradient-primary text-2xl font-black uppercase tracking-[0.2em] mb-3">
                {eligibleForTrial !== false ? 'Upgrade Plan' : 'Choose Subscription'}
              </h2>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-loose">
                決済後の即時利用・アップグレードが可能です。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  {['月間50回生成', '全SNS対応', 'AI分身学習'].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] font-bold text-slate-600 leading-tight">
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-[-2px]">
                        <Icons.Check size={12} strokeWidth={4} className="text-[#1823ff]" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-4 bg-[#282d32] text-white rounded-2xl font-black text-[11px] tracking-[0.2em] uppercase hover:bg-black transition-all shadow-lg shadow-black/10"
                  onClick={() => startGoogleLogin("trial", "entry")}
                  disabled={loading}
                >
                  {loading ? "..." : "START PROJECT"}
                </button>
              </div>

              {/* Standard Plan Card */}
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
                  {['月間150回生成', '優先AI解析', '最新機能先行利用', '全SNS対応'].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] font-bold text-[#282d32] leading-tight">
                      <div className="w-5 h-5 rounded-full bg-[#1823ff]/10 flex items-center justify-center shrink-0 mt-[-2px]">
                        <Icons.Check size={12} strokeWidth={4} className="text-[#1823ff]" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-5 bg-gradient-primary text-white rounded-2xl font-black text-[12px] tracking-[0.2em] uppercase hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#1823ff]/20 animate-pulse-gentle"
                  onClick={() => startGoogleLogin("trial", "standard")}
                  disabled={loading}
                >
                  {loading ? "..." : "START NOW"}
                </button>
              </div>

              {/* Pro Plan Card */}
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
                  {['月間300回生成', '無制限AI学習', '個別サポートチャット', '全SNS対応'].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] font-bold text-slate-600 leading-tight">
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-[-2px]">
                        <Icons.Check size={12} strokeWidth={4} className="text-[#7c3aed]" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-4 bg-[#282d32] text-white rounded-2xl font-black text-[11px] tracking-[0.2em] uppercase hover:bg-black transition-all shadow-lg shadow-black/10"
                  onClick={() => startGoogleLogin("trial", "professional")}
                  disabled={loading}
                >
                  {loading ? "..." : "UPGRADE PRO"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-12 border-t border-slate-200 flex flex-col items-center gap-10">
          <p className="text-[10px] text-slate-400 text-center font-black leading-relaxed uppercase tracking-[0.3em] max-w-sm">
            初回はGoogle認証後に自動でアカウントが生成されます。<br />
            安全で透明な決済システム（Stripe）を採用しています。
          </p>
          <div className="flex items-center gap-12 opacity-30">
            <Icons.Shield size={32} />
            <Icons.Lock size={32} />
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-widest">Secure & encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function StartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f0eae4] flex items-center justify-center font-black uppercase tracking-widest text-[#1823ff] animate-pulse">Loading Studio...</div>}>
      <StartPageContent />
    </Suspense>
  );
}
