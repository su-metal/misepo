"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const CTASection = ({ isMobile = false }: { isMobile?: boolean }) => {
    return (
        <section className="py-24 md:py-48 bg-[#1823ff] text-white relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />

            <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em] mb-12">Final Step</span>
                    <h2 className={`font-black tracking-tighter leading-[0.9] text-white mb-16 ${isMobile ? 'text-5xl' : 'text-7xl md:text-8xl lg:text-[8rem]'}`}>
                        GET YOUR<br />
                        <span className="opacity-40">FREE TRIAL.</span>
                    </h2>
                    <p className="text-xl md:text-2xl font-bold text-white/70 max-w-2xl mb-16 leading-tight">
                        あなたの情熱は、本来のお客様のために。<br />
                        SNS運用は、あなただけの『分身』に任せてみませんか。
                    </p>

                    <button
                        onClick={() => window.location.href = '/start'}
                        className="px-16 py-8 bg-white text-[#1823ff] font-black rounded-full shadow-2xl shadow-black/20 hover:scale-[1.05] transition-all text-2xl flex items-center gap-4 group"
                    >
                        7日間無料で試す
                        <Icons.ArrowRight className="group-hover:translate-x-2 transition-transform" size={28} />
                    </button>

                    <div className="mt-12 flex items-center gap-3 text-white/50 text-xs font-black tracking-widest uppercase">
                        <Icons.CheckCircle size={14} className="text-[#00b900]" />
                        START YOUR STORY IN 30 SECONDS
                    </div>
                </div>
            </div>
        </section>
    );
};
