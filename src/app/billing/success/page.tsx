"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BillingSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

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

  const NoiseOverlay = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.2] mix-blend-overlay" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }} />
  );

  return (
    <div className="min-h-screen bg-[#f0eae4] text-[#282d32] flex items-center justify-center p-6 relative overflow-hidden selection:bg-[#1823ff] selection:text-white bg-gradient-mesh">
      <NoiseOverlay />

      {/* LP Style Background Orbs */}
      <div className="glow-orb w-[40rem] h-[40rem] bg-[#1823ff]/20 -top-20 -right-20 animate-pulse-gentle" />
      <div className="glow-orb w-[30rem] h-[30rem] bg-[#7c3aed]/10 bottom-0 -left-20 animate-spin-slow" />

      <div className="max-w-xl w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[40px] md:rounded-[48px] p-8 md:p-16 text-center shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] relative overflow-hidden group">
          {/* Subtle Shine Effect */}
          <div className="absolute inset-0 bg-gradient-shine opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-ticket-shine pointer-events-none" />

          {/* Success Icon */}
          <div className="w-20 h-20 md:w-24 md:h-24 bg-[#1823ff] rounded-[28px] md:rounded-[32px] flex items-center justify-center mx-auto mb-6 md:mb-10 shadow-[0_20px_40px_rgba(24,35,255,0.2)] animate-bounce-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 md:h-12 md:w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div className="space-y-2 md:space-y-4 mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight text-[#282d32]">
              決済が、<br />
              <span className="text-gradient-primary">成功しました。</span>
            </h1>
            <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">
              Welcome to the Premium Experience
            </p>
          </div>

          <div className="bg-[#f0eae4]/50 rounded-[24px] md:rounded-[32px] p-6 md:p-8 mb-8 md:mb-12 border border-white/50">
            <p className="text-base md:text-lg font-bold text-[#282d32] leading-relaxed">
              ご契約ありがとうございます。<br />
              反映まで数秒かかることがありますので、<br className="hidden md:block" />
              そのままお待ちください。
            </p>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="inline-flex items-center gap-2 md:gap-3 px-5 py-2 md:px-6 md:py-3 bg-white/50 backdrop-blur-md border border-[#1823ff]/10 rounded-full shadow-sm">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#1823ff] animate-pulse" />
              <p className="text-[10px] md:text-xs font-bold text-[#1823ff] uppercase tracking-widest">
                Auto-redirect in {countdown}s
              </p>
            </div>

            <button
              onClick={() => router.push('/generate')}
              className="w-full py-4 md:py-6 bg-gradient-primary text-white font-black text-lg md:text-xl rounded-full shadow-[0_20px_50px_rgba(99,102,241,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 md:gap-3 overflow-hidden group"
            >
              <span className="relative z-10">アプリを使い始める</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 relative z-10 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <div className="absolute inset-0 bg-gradient-shine opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ticket-shine" />
            </button>
          </div>

          <div className="mt-8 md:mt-16 pt-6 md:pt-8 border-t border-slate-100">
            <p className="text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] leading-loose">
              MisePo AI Studio<br />
              Your creative journey begins here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
