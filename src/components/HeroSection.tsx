"use client";
import React, { useState, useEffect } from 'react';
import { Icons } from './LandingPageIcons';
import Image from 'next/image';

export default function HeroSection() {
    const [activeImage, setActiveImage] = useState(0);

    const images = [
        '/hero_composite_v3.jpg',
        '/hero_v4.jpg',
        '/hero_v5.png'
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveImage((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    const NoiseOverlay = () => (
        <div className="absolute inset-0 pointer-events-none opacity-[0.2] mix-blend-overlay hidden md:block" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />
    );

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#f0eae4] pt-24 pb-12 bg-gradient-mesh">
            <NoiseOverlay />

            {/* Background Decor - More Vibrant Orbs */}
            <div className="glow-orb hidden md:block w-[50rem] h-[50rem] bg-[#1823ff]/40 -top-20 -right-20 animate-pulse-gentle" />
            <div className="glow-orb hidden md:block w-[40rem] h-[40rem] bg-[#7c3aed]/20 bottom-0 -left-20 animate-spin-slow" />
            <div className="glow-orb hidden md:block w-[30rem] h-[30rem] bg-[#00d2ff]/20 top-1/2 left-1/4" />

            <div className="max-w-6xl mx-auto w-full px-6 flex flex-col items-center lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-center relative z-10">
                {/* 1. Headline - Top on Mobile, Top Left on PC */}
                <div className="relative flex flex-col items-start text-left mb-[-20px] lg:mb-0 z-20 lg:col-start-1 lg:row-start-1 w-full">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/50 backdrop-blur-md border border-[#1823ff]/10 rounded-full mb-8 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1823ff] md:animate-pulse" />
                        <span className="text-[10px] font-bold text-[#1823ff] uppercase tracking-[0.2em]">Your Alter Ego for SNS</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-[7.5rem] font-black tracking-tighter leading-[0.95] text-[#282d32]">
                        想いを、<br />
                        <span className="text-gradient-primary">一瞬で言葉に。</span>
                    </h1>
                </div>

                {/* 2. Slider - Middle on Mobile, Right Column on PC */}
                <div className="relative w-full max-w-md mb-12 lg:mb-0 lg:col-start-2 lg:row-start-1 lg:row-span-2 floating-element">
                    <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] ring-1 ring-black/5">
                        {images.map((src, index) => (
                            <div
                                key={src}
                                className={`absolute inset-0 transition-opacity duration-1000 ${index === activeImage ? 'opacity-100' : 'opacity-0'
                                    }`}
                            >
                                <Image
                                    src={src}
                                    alt={`MisePo App ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                    sizes="(max-width: 768px) 80vw, 420px"
                                    quality={70}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                        ))}
                    </div>

                    {/* Carousel Indicators */}
                    <div className="flex justify-center gap-2 mt-6">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveImage(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${index === activeImage
                                    ? 'w-8 bg-[#1823ff]'
                                    : 'w-2 bg-slate-200 hover:bg-slate-300'
                                    }`}
                                aria-label={`画像 ${index + 1}を表示`}
                            />
                        ))}
                    </div>
                </div>

                {/* 3. Description & CTA - Bottom on Mobile, Bottom Left on PC */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:col-start-1 lg:row-start-2 max-w-xl relative">
                    <p className="text-xl md:text-2xl font-bold text-slate-500/80 leading-tight mb-12 mt-4 lg:mt-8">
                        お店のSNS発信、「何を書けばいいか分からない」を、AIが解決。<br />
                        メモを入力するだけで、SNS投稿が完成します。
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full relative z-10">
                        <button
                            onClick={() => window.location.href = '/start'}
                            className="group relative px-10 py-5 bg-gradient-primary text-white font-black rounded-full shadow-[0_20px_50px_rgba(99,102,241,0.2)] hover:scale-[1.02] active:scale-95 transition-all text-lg flex items-center justify-center gap-3 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-shine opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ticket-shine" />
                            <Icons.Sparkles size={20} className="text-yellow-300 relative z-10" />
                            <span className="relative z-10">7日間無料で試す</span>
                        </button>
                        <button onClick={() => window.location.href = '#flow'} className="px-10 py-5 bg-white/80 backdrop-blur-md text-[#282d32] font-black rounded-full border border-white shadow-sm hover:bg-white transition-all text-lg">
                            使い方を見る
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
}
