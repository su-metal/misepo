"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const CTASection = ({ isMobile = false }: { isMobile?: boolean }) => {
    return (
        <section className={`${isMobile ? 'py-16' : 'py-32'} bg-slate-900 text-white relative overflow-hidden`}>
            {/* Background Gradients */}
            <div className={`absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40 ${isMobile ? 'scale-150' : ''}`}>
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[var(--ichizen-blue)] rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-[var(--ichizen-green)] rounded-full blur-[120px]" />
            </div>

            <div className={`${isMobile ? 'w-full px-6' : 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'} text-center relative z-10`}>
                <div className={`${isMobile ? 'mb-8' : 'mb-12'}`}>
                    <div className="inline-block px-4 py-1.5 bg-[#F5CC6D]/20 border border-[#F5CC6D]/30 rounded-full text-[#F5CC6D] text-[10px] font-bold uppercase tracking-widest mb-8 backdrop-blur-sm">
                        For Business Owners
                    </div>
                </div>
                <h2 className={`font-bold mb-8 leading-[1.1] tracking-tight ${isMobile ? 'text-3xl' : 'text-5xl md:text-7xl'}`}>
                    365日のSNSの悩み、<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--ichizen-blue)] to-[#F5CC6D]">これでおしまい。</span>
                </h2>
                <p className={`text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto ${isMobile ? 'text-sm mb-12' : 'text-lg md:text-xl mb-16'}`}>
                    あなたの情熱は、<br className={isMobile ? '' : 'md:hidden'} />本来のお客様のために。<br />
                    文章作成は、あなたの『分身』に任せてください。
                </p>
                <div className="flex flex-col gap-6 justify-center items-center">
                    <button
                        onClick={() => window.location.href = '/start'}
                        className={`group relative bg-white text-slate-900 rounded-full font-bold shadow-2xl transition-all flex items-center gap-3 overflow-hidden ${isMobile ? 'px-8 py-4 text-lg' : 'px-10 py-5 text-xl hover:-translate-y-1'}`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/50 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
                        <span className="relative z-10">今すぐ無料で始める</span>
                        <Icons.ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" size={isMobile ? 20 : 24} />
                    </button>
                    <div className="flex items-center gap-2 text-[var(--ichizen-green)]">
                        <Icons.CheckCircle size={14} />
                        <p className="text-xs font-bold tracking-wide">
                            まずは7日間、無料で体験
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
