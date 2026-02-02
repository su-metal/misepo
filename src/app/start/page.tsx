"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useStartFlow } from "@/hooks/useStartFlow";
import { Icons } from "@/components/LandingPageIcons";

function StartPageContent() {
  const {
    loading,
    isLoggedIn,
    eligibleForTrial,
    isRedirecting,
    intent,
    startGoogleLogin,
    initialPlan
  } = useStartFlow();

  const [plan, setPlan] = useState<"entry" | "standard" | "professional">("standard");

  // Sync with initial plan from URL/Storage
  useEffect(() => {
    setPlan(initialPlan);
  }, [initialPlan]);

  // Show full-screen loader when:
  // 1. Redirecting to checkout, OR
  // 2. Intent is trial and user is logged in (about to redirect)
  if (isRedirecting || (intent === "trial" && isLoggedIn)) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
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
    <main className="min-h-screen sm:max-h-screen bg-white text-black flex items-center justify-center px-4 py-4 relative overflow-hidden selection:bg-[#F5CC6D]">
      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[10%] w-32 h-32 border-[4px] border-black/5 rounded-full rotate-12"></div>
        <div className="absolute bottom-[20%] right-[10%] w-48 h-48 border-[4px] border-black/5 rounded-[40px] -rotate-12"></div>
      </div>

      {/* Back Button - Fixed Position */}
      <Link
        href={isLoggedIn ? "/generate" : "/"}
        className="fixed top-6 left-6 z-20 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors group"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        {isLoggedIn ? "Back to Dashboard" : "Back to Home"}
      </Link>

      <div className="w-full max-w-2xl relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">

        <div className="text-center mb-10 pt-2">
          <h1 className="text-4xl sm:text-5xl font-black text-black tracking-tighter leading-none mb-3 uppercase italic">
            MisePo <span className="text-[#E88BA3]">Studio</span>
          </h1>
          <p className="text-[11px] font-black text-black/40 uppercase tracking-[0.3em]">Ignite your social presence in seconds</p>
        </div>

        <div className="space-y-8">
          {/* Direct Trial Entry for Eligible Users */}
          {eligibleForTrial !== false && (
            <div className="bg-[#4DB39A] text-white rounded-[32px] p-8 text-center relative shadow-2xl transform transition-all hover:scale-[1.01]">
              <div className="inline-block bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-4 py-1 rounded-full mb-4 uppercase tracking-[0.2em]">
                Risk-Free Discovery
              </div>
              <h3 className="text-3xl font-black mb-3 italic">まずは7日間、無料で体験</h3>
              <p className="text-sm font-bold text-white/90 mb-8 leading-relaxed max-w-sm mx-auto">
                クレジットカード登録は不要。10秒であなたの「分身」が投稿を作成し始めます。
              </p>
              <button
                className="w-full py-5 bg-white text-[#4DB39A] rounded-[20px] font-black text-2xl italic shadow-xl active:scale-95 transition-all flex items-center justify-center gap-4"
                onClick={() => startGoogleLogin("trial", "standard")}
                disabled={loading}
              >
                {loading ? <div className="w-6 h-6 border-[4px] border-[#4DB39A]/20 border-t-[#4DB39A] rounded-full animate-spin" /> : (
                  <>
                    無料で試してみる
                    <Icons.ChevronUp size={24} className="rotate-90 stroke-[4px]" />
                  </>
                )}
              </button>
              <div className="mt-6 flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-wider opacity-90">
                <span className="flex items-center gap-1.5"><Icons.Check size={14} strokeWidth={4} /> No Card</span>
                <span className="flex items-center gap-1.5"><Icons.Check size={14} strokeWidth={4} /> 7 Days Free</span>
              </div>
            </div>
          )}

          <div className="pt-4">
            <div className="text-center mb-10">
              <span className="text-[11px] font-black text-black/20 uppercase tracking-[0.4em] font-sans">
                {eligibleForTrial !== false ? 'Upgrade your experience' : 'Choose your subscription'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Entry Plan Card */}
              <div className="bg-white rounded-[24px] p-6 flex flex-col relative transition-all border-2 border-transparent hover:border-black/5 shadow-sm hover:shadow-md">
                <div className="mb-4">
                  <span className="text-[9px] font-black text-black/30 uppercase tracking-widest mb-1 block">ENTRY</span>
                  <h3 className="text-xl font-black text-black uppercase italic">エントリー</h3>
                </div>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-2xl font-black">¥980</span>
                  <span className="text-[10px] font-bold text-black/40 uppercase">/ month</span>
                </div>
                <ul className="space-y-2 mb-8 flex-grow">
                  {['月間50回生成', '全プラットフォーム対応', 'AI分身学習機能'].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px] font-bold text-black/60 leading-tight">
                      <Icons.Check size={14} strokeWidth={4} className="text-[#4DB39A] shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-3 bg-zinc-900 text-white rounded-[12px] font-black text-sm italic hover:bg-black transition-all shadow-lg"
                  onClick={() => startGoogleLogin("trial", "entry")}
                  disabled={loading}
                >
                  {loading ? "..." : "月額で開始"}
                </button>
              </div>

              {/* Standard Plan Card */}
              <div className="bg-white rounded-[24px] (ring-2 ring-[#1823ff]/20) p-6 flex flex-col relative transition-all border-2 border-[#1823ff]/10 hover:border-[#1823ff]/30 shadow-md transform hover:scale-[1.02]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1823ff] text-white text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg whitespace-nowrap">
                  MOST POPULAR
                </div>
                <div className="mb-4 mt-2">
                  <span className="text-[9px] font-black text-[#1823ff] uppercase tracking-widest mb-1 block">STANDARD</span>
                  <h3 className="text-xl font-black text-black uppercase italic">スタンダード</h3>
                </div>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#1823ff]">¥1,980</span>
                  <span className="text-[10px] font-bold text-black/40 uppercase">/ month</span>
                </div>
                <ul className="space-y-2 mb-8 flex-grow">
                  {['月間150回生成', '全プラットフォーム対応', '優先AI解析', '最新機能へのアクセス'].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px] font-bold text-black/60 leading-tight">
                      <Icons.Check size={14} strokeWidth={4} className="text-[#1823ff] shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-4 bg-[#1823ff] text-white rounded-[12px] font-black text-base italic hover:bg-[#1219cc] transition-all shadow-xl"
                  onClick={() => startGoogleLogin("trial", "standard")}
                  disabled={loading}
                >
                  {loading ? "..." : "月額で開始"}
                </button>
              </div>

              {/* Pro Plan Card */}
              <div className="bg-white rounded-[24px] p-6 flex flex-col relative transition-all border-2 border-transparent hover:border-black/5 shadow-sm hover:shadow-md">
                <div className="mb-4">
                  <span className="text-[9px] font-black text-black/30 uppercase tracking-widest mb-1 block">PROFESSIONAL</span>
                  <h3 className="text-xl font-black text-black uppercase italic">プロ</h3>
                </div>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-2xl font-black">¥2,980</span>
                  <span className="text-[10px] font-bold text-black/40 uppercase">/ month</span>
                </div>
                <ul className="space-y-2 mb-8 flex-grow">
                  {['月間300回生成', '全プラットフォーム対応', '無制限AI学習', '個別サポートチャット'].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px] font-bold text-black/60 leading-tight">
                      <Icons.Check size={14} strokeWidth={4} className="text-zinc-400 shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-3 bg-[#282d32] text-white rounded-[12px] font-black text-sm italic hover:bg-black transition-all shadow-lg"
                  onClick={() => startGoogleLogin("trial", "professional")}
                  disabled={loading}
                >
                  {loading ? "..." : "月額で開始"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-black/5 flex flex-col items-center gap-6">
          <p className="text-[10px] text-black/30 text-center font-black leading-relaxed uppercase tracking-[0.2em] max-w-xs">
            初回は認証後に自動でアカウントが生成されます。
            安全で透明な決済システムを採用しています。
          </p>
          <div className="flex items-center gap-6 opacity-40 grayscale group-hover:grayscale-0 transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            <span className="text-[10px] font-black uppercase tracking-widest">Secure & encrypted</span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function StartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center font-black italic">Loading...</div>}>
      <StartPageContent />
    </Suspense>
  );
}
