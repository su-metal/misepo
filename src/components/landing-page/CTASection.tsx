"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const CTASection = () => {
    return (
        <section className="py-32 bg-black text-white relative overflow-hidden border-b-[6px] border-black">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <div className="mb-12">
                    <div className="inline-block px-6 py-2 bg-[#F5CC6D] border-[3px] border-white rounded-2xl shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] text-black text-sm font-black uppercase tracking-[0.2em] mb-8 -rotate-1">
                        最後に、店主様へ。
                    </div>
                </div>
                <h2 className="text-5xl md:text-8xl font-black mb-10 leading-[1.1] italic uppercase">
                    365日の<br className="md:hidden" />SNSの悩み、<br />
                    <span className="underline decoration-[10px] decoration-[#E88BA3] underline-offset-[12px]">これでおしまい。</span>
                </h2>
                <p className="text-xl md:text-3xl text-white font-bold leading-relaxed mb-16 max-w-2xl mx-auto opacity-70 italic">
                    あなたの情熱は、<br className="md:hidden" />本来のお客様のために。<br />
                    文章作成は、あなたの『分身』に任せてください。
                </p>
                <div className="flex flex-col gap-8 justify-center items-center">
                    <button
                        onClick={() => window.location.href = '/start'}
                        className="group px-12 py-7 bg-[#4DB39A] text-white border-[4px] border-white rounded-2xl font-black text-3xl uppercase italic shadow-[12px_12px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex items-center gap-4"
                    >
                        今すぐ無料で始める
                        <Icons.ChevronUp className="rotate-90 stroke-[5px] group-hover:translate-x-2 transition-transform" size={32} />
                    </button>
                    <div className="bg-[#4DB39A] px-6 py-2 border-[2px] border-white rounded-2xl shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] rotate-1">
                        <p className="text-sm text-white font-black uppercase tracking-[0.2em]">
                            まずは7日間、無料で体験
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
