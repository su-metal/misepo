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
    <main className="min-h-screen bg-[#f9f5f2] text-black flex items-center justify-center px-4 py-12 relative overflow-hidden selection:bg-rose-100">
      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[15%] right-[15%] w-40 h-40 border-[4px] border-black/5 rounded-full -rotate-12"></div>
        <div className="absolute bottom-[10%] left-[10%] w-32 h-32 border-[4px] border-black/5 rounded-[32px] rotate-45"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-1000">
        <div className="bg-white border-[6px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] rounded-[40px] p-8 md:p-12 relative overflow-hidden text-center">

          <div className="w-24 h-24 bg-white border-[4px] border-black rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.15)] group hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-rose-500 stroke-[4px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-black text-black tracking-tighter mb-2 uppercase italic italic">Process Aborted</h1>
            <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.3em]">
              申し込みを中断しました
            </p>
          </div>

          <p className="text-black/80 mb-12 text-base leading-relaxed font-bold bg-black/[0.03] p-6 border-[3px] border-dashed border-black/10 rounded-2xl">
            決済処理は実行されていません。<br />
            アカウントの状態は安全に保たれています。
          </p>

          <div className="space-y-6">
            <div className="w-full bg-[#f9f5f2] border-[3px] border-black rounded-2xl p-5 flex items-center justify-center gap-4">
              <div className="w-2.5 h-2.5 rounded-full bg-black animate-pulse"></div>
              <p className="text-xs text-black font-black tracking-[0.25em] uppercase">
                Auto-return in 0:0{countdown}
              </p>
            </div>

            <button
              onClick={() => router.push('/start')}
              className="w-full py-6 bg-black text-white font-black text-xl italic rounded-[24px] shadow-[10px_10px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] active:scale-95 transition-all uppercase tracking-wider"
            >
              Return to Portal
            </button>
          </div>

          <p className="text-[10px] text-black/30 mt-12 font-black uppercase tracking-[0.2em] leading-relaxed">
            何かお困りのことがあればサポートまでご連絡ください。<br />
            MisePo Security Shield Active.
          </p>
        </div>
      </div>
    </main>
  );
}
