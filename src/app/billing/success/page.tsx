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

  return (
    <div className="min-h-screen bg-[#f9f5f2] text-black flex items-center justify-center p-4 relative overflow-hidden selection:bg-emerald-100">
      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[15%] w-48 h-48 border-[4px] border-black/5 rounded-[48px] rotate-12"></div>
        <div className="absolute bottom-[15%] right-[10%] w-40 h-40 border-[4px] border-black/5 rounded-full -rotate-45"></div>
      </div>

      <div className="max-w-md w-full relative z-10 animate-in fade-in zoom-in duration-1000">
        <div className="bg-white border-[6px] border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] rounded-[40px] p-8 md:p-12 text-center overflow-hidden">

          <div className="w-24 h-24 bg-[#4DB39A] border-[4px] border-black rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-black stroke-[4px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-4xl font-black text-black italic tracking-tighter mb-2 uppercase">Payment Success</h1>
          <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.3em] mb-10">
            決済が完了しました
          </p>

          <p className="text-black/80 mb-12 text-base leading-relaxed font-bold bg-black/[0.03] p-6 border-[3px] border-dashed border-black/10 rounded-2xl">
            ご契約ありがとうございます。<br />
            反映まで数秒かかることがあります。
          </p>

          <div className="space-y-6">
            <div className="w-full bg-[#f9f5f2] border-[3px] border-black rounded-2xl p-5 flex items-center justify-center gap-4">
              <div className="w-2.5 h-2.5 rounded-full bg-[#4DB39A] animate-pulse"></div>
              <p className="text-xs text-black font-black tracking-[0.25em] uppercase font-mono">
                Auto-redirect in 00:0{countdown}
              </p>
            </div>

            <button
              onClick={() => router.push('/generate')}
              className="w-full py-6 bg-[#4DB39A] border-[4px] border-black text-black font-black text-xl italic rounded-[24px] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] active:scale-95 transition-all uppercase tracking-wider"
            >
              Go to App
            </button>
          </div>

          <p className="text-[10px] text-black/30 mt-12 font-black uppercase tracking-[0.2em] leading-relaxed">
            MisePo Studio Experience Starts Now.<br />
            Enjoy your AI journey.
          </p>
        </div>
      </div>
    </div>
  );
}
