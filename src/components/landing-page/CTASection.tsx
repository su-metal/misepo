"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const CTASection = () => {
    return (
        <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#E88BA3] rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#4DB39A] rounded-full blur-[120px]" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <div className="mb-12">
                    <div className="inline-block px-4 py-1.5 bg-[#F5CC6D]/20 border border-[#F5CC6D]/30 rounded-full text-[#F5CC6D] text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-sm">
                        For Business Owners
                    </div>
                </div>
                <h2 className="text-4xl md:text-6xl font-bold mb-10 leading-tight">
                    365日の<br className="md:hidden" />SNSの悩み、<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E88BA3] to-[#F5CC6D]">これでおしまい。</span>
                </h2>
                <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed mb-16 max-w-2xl mx-auto">
                    あなたの情熱は、<br className="md:hidden" />本来のお客様のために。<br />
                    文章作成は、あなたの『分身』に任せてください。
                </p>
                <div className="flex flex-col gap-6 justify-center items-center">
                    <button
                        onClick={() => window.location.href = '/start'}
                        className="group relative px-10 py-5 bg-white text-slate-900 rounded-full font-bold text-xl shadow-2xl shadow-white/10 hover:shadow-white/20 hover:-translate-y-1 transition-all flex items-center gap-3 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/50 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
                        <span className="relative z-10">今すぐ無料で始める</span>
                        <Icons.ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" size={24} />
                    </button>
                    <div className="flex items-center gap-2 text-[#4DB39A]">
                        <Icons.CheckCircle size={16} />
                        <p className="text-sm font-bold tracking-wide">
                            まずは7日間、無料で体験
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
