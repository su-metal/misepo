"use client";
import React, { useState, useEffect } from 'react';
import { Icons } from './LandingPageIcons';
import Image from 'next/image';

export default function HeroSection() {
    const [activeImage, setActiveImage] = useState(0);

    const images = [
        '/misepo_hero_hand_phone_1769997838406.png',
        '/misepo_hero_emo_strawberry_parfait_1770000553590.png',
        '/misepo_hero_hand_phone_side_1769998079370.png'
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveImage((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    const NoiseOverlay = () => (
        <div className="absolute inset-0 pointer-events-none opacity-[0.2] mix-blend-overlay" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />
    );

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#f0eae4] pt-24 pb-12">
            <NoiseOverlay />

            {/* Background Decor */}
            <div className="absolute top-20 right-20 w-96 h-96 bg-[#1823ff]/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-20 left-20 w-[30rem] h-[30rem] bg-slate-50 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto w-full px-6 flex flex-col items-center lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-center relative z-10">

                {/* 1. Headline - Top on Mobile, Top Left on PC */}
                {/* 1. Headline - Top on Mobile, Top Left on PC */}
                <div className="relative flex flex-col items-start text-left mb-[-20px] lg:mb-0 z-20 lg:col-start-1 lg:row-start-1 w-full">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1823ff]/5 border border-[#1823ff]/10 rounded-full mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1823ff] animate-pulse" />
                        <span className="text-[10px] font-bold text-[#1823ff] uppercase tracking-[0.2em]">Your Alter Ego for SNS</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-[7.5rem] font-black tracking-tighter leading-[0.95] text-[#282d32]">
                        想いを、<br />
                        <span className="text-[#1823ff]">一瞬で言葉に。</span>
                    </h1>
                </div>

                {/* 2. Slider - Middle on Mobile, Right Column on PC */}
                <div className="relative w-full max-w-md mb-12 lg:mb-0 lg:col-start-2 lg:row-start-1 lg:row-span-2">
                    <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-900/20">
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
                                />
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
                                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                                    }`}
                                aria-label={`画像 ${index + 1}を表示`}
                            />
                        ))}
                    </div>
                </div>

                {/* 3. Description & CTA - Bottom on Mobile, Bottom Left on PC */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:col-start-1 lg:row-start-2 max-w-xl">
                    <p className="text-xl md:text-2xl font-bold text-slate-400 leading-tight mb-12 mt-4 lg:mt-8">
                        「何を書けばいいか分からない」を、AIが解決。<br />
                        メモを入れるだけで、SNS投稿が完成します。
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full">
                        <button onClick={() => window.location.href = '/start'} className="px-10 py-5 bg-[#1823ff] text-white font-black rounded-full shadow-2xl shadow-[#1823ff]/30 hover:scale-[1.02] active:scale-95 transition-all text-lg flex items-center justify-center gap-3">
                            <Icons.Sparkles size={20} className="text-yellow-300" />
                            7日間無料で試す
                        </button>
                        <button onClick={() => window.location.href = '#flow'} className="px-10 py-5 bg-white text-[#282d32] font-black rounded-full border border-slate-200 hover:bg-slate-50 transition-all text-lg">
                            使い方を見る
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
}
