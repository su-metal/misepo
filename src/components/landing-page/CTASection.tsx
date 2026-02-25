"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const CTASection = ({ isMobile = false }: { isMobile?: boolean }) => {
    const NoiseOverlay = () => (
        <div className="absolute inset-0 pointer-events-none opacity-[0.2] mix-blend-overlay hidden md:block" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Map%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />
    );

    return (
        <section className="relative bg-[#1823ff] py-32 md:py-64 overflow-hidden">
            <NoiseOverlay />
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

            {/* Circles */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[200%] bg-white/5 rounded-[50%] -translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                <div className="flex flex-col items-center">
                    <h2 className={`font-black tracking-tighter leading-[0.85] text-white mb-16 ${isMobile ? 'text-5xl' : 'text-7xl md:text-8xl lg:text-[5rem]'}`}>
                        <span className="block text-[10px] font-black text-white/70 uppercase tracking-[0.2em] mb-8 px-4 py-2 bg-white/10 rounded-full border border-white/20 w-fit mx-auto normal-case" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
                            美容院・飲食店のSNS運用を今すぐAIに任せる
                        </span>
                        SNSは、<br />
                        <span className="opacity-60">分身に任せる。</span>
                    </h2>
                    <p className="text-xl md:text-2xl font-bold text-white/70 max-w-2xl mb-20 leading-tight">
                        あなたの大切な時間は、お店とお客様のために。<br />
                        SNS運用は、あなたを一番よく知る「分身」に任せませんか。
                    </p>

                    <button
                        onClick={() => window.location.href = '/start'}
                        className="px-16 py-10 bg-white text-[#1823ff] font-black rounded-full shadow-2xl shadow-black/20 hover:scale-[1.05] transition-all text-2xl flex items-center gap-6 group"
                    >
                        7日間無料で始める
                        <Icons.ArrowRight className="group-hover:translate-x-2 transition-transform" size={32} />
                    </button>

                    <div className="mt-16 flex flex-col items-center gap-6">
                        <div className="flex items-center gap-3 text-white/50 text-[10px] font-black tracking-[0.3em] uppercase">
                            <Icons.CheckCircle size={14} className="text-white/30" />
                            Start your story in 30 seconds
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
