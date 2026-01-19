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
    <main className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/50 text-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden selection:bg-red-50">
      {/* Decorative Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-100/30 blur-[120px] rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-100/20 blur-[100px] rounded-full opacity-30"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-1000">
        {/* Modern Glass Card */}
        <div className="bg-white/70 backdrop-blur-3xl border border-white shadow-2xl shadow-red-100/50 rounded-[2.5rem] p-8 lg:p-10 relative overflow-hidden text-center">

          <div className="w-20 h-20 bg-red-50 border border-red-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-red-50/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2 uppercase italic">Process Aborted</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              申し込みを中断しました
            </p>
          </div>

          <p className="text-slate-600 mb-10 text-sm leading-relaxed font-bold">
            決済処理は実行されていません。<br />
            アカウントの状態は安全に保たれています。
          </p>

          <div className="space-y-4">
            <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
              <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">
                Auto-return in 0:0{countdown}
              </p>
            </div>

            <button
              onClick={() => router.push('/start')}
              className="w-full py-5 bg-slate-900 text-white font-bold text-sm rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest"
            >
              Return to Portal
            </button>
          </div>

          <p className="text-[9px] text-slate-400 mt-10 font-medium">
            何かお困りのことがあればサポートまでご連絡ください。<br />
            MisePo Security Shield Active.
          </p>
        </div>
      </div>
    </main>
  );
}
