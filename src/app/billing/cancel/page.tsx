"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/LandingPageIcons';

const NoiseOverlay = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.2] mix-blend-overlay z-0" style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
  }} />
);

export default function CancelPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [loading, setLoading] = useState(false); // Added loading state for buttons

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      router.push('/generate');
    }
  }, [countdown, router]);

  const startGoogleLogin = (plan: "entry" | "standard" | "professional") => {
    router.push(`/start?intent=trial&plan=${plan}`);
  };

  return (
    <main className="min-h-screen bg-[#f0eae4] text-[#282d32] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-mesh font-inter selection:bg-[#1823ff] selection:text-white">
      <NoiseOverlay />

      {/* Background Decor */}
      <div className="glow-orb w-[30rem] h-[30rem] bg-rose-500/10 -top-20 -right-20 animate-pulse-gentle" />
      <div className="glow-orb w-[20rem] h-[20rem] bg-[#1823ff]/10 bottom-0 -left-20 animate-spin-slow" />

      <div className="w-full max-w-4xl relative z-10 animate-in fade-in zoom-in-95 duration-1000">
        <div className="text-center mb-12">
          <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-4 inline-block bg-rose-50 px-4 py-2 rounded-full border border-rose-100">Canceled</span>
          <h1 className="text-4xl md:text-5xl font-black text-[#282d32] tracking-tighter mb-4 leading-none">申し込みを<br /><span className="text-rose-500">中断しました。</span></h1>
          <p className="text-sm font-bold text-slate-400 max-w-sm mx-auto leading-relaxed">
            決済処理は実行されていませんのでご安心ください。<br />
            アカウントの状態は安全に保たれています。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
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
              className="w-full py-4 bg-[#282d32] text-white rounded-2xl font-black text-[11px] tracking-[0.2em] uppercase hover:bg-black transition-all shadow-lg shadow-black/10"
              onClick={() => startGoogleLogin("entry")}
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
              className="w-full py-5 bg-gradient-primary text-white rounded-2xl font-black text-[12px] tracking-[0.2em] uppercase hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#1823ff]/20 animate-pulse-gentle"
              onClick={() => startGoogleLogin("standard")}
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
              className="w-full py-4 bg-[#282d32] text-white rounded-2xl font-black text-[11px] tracking-[0.2em] uppercase hover:bg-black transition-all shadow-lg shadow-black/10"
              onClick={() => startGoogleLogin("professional")}
              disabled={loading}
            >
              {loading ? "..." : "UPGRADE PRO"}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-12">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            Auto-return in {countdown}s
          </p>
        </div>

        <div className="mt-14 pt-8 border-t border-slate-100 text-center">
          <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.2em] leading-relaxed">
            何かお困りのことがあればサポートまでご連絡ください。<br />
            MisePo Security Shield Active.
          </p>
        </div>
      </div>
    </main>
  );
}
