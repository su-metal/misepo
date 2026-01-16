"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CancelPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      router.push('/start');
    }
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center p-4 relative overflow-hidden selection:bg-red-500/30">
      {/* Cosmic Grain & Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.4] mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 blur-[120px] rounded-full animate-pulse opacity-50"></div>
      </div>

      <div className="max-w-md w-full relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-red-500/20 rounded-[2.5rem] shadow-2xl p-8 text-center overflow-hidden">

          <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h1 className="text-2xl font-black text-white italic tracking-tight mb-2">PROCESS ABORTED</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-8">
            申し込みを中断しました
          </p>

          <p className="text-slate-400 mb-8 text-sm leading-relaxed font-medium">
            決済処理は実行されていません。<br />
            アカウントの状態は変更されていません。
          </p>

          <div className="w-full bg-slate-950/50 border border-white/5 rounded-xl p-4 mb-8 flex items-center justify-center gap-3">
            <div className="w-2 h-2 rounded-full bg-slate-600 animate-pulse"></div>
            <p className="text-xs text-slate-400 font-mono tracking-widest">
              AUTO-REDIRECT IN 00:0{countdown}
            </p>
          </div>

          <button
            onClick={() => router.push('/start')}
            className="w-full py-4 bg-white/5 border border-white/10 text-slate-300 font-black text-xs rounded-2xl hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest"
          >
            RETURN TO PORTAL
          </button>
        </div>
      </div>
    </div>
  );
}
