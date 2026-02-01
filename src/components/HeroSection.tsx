"use client";
import React, { useState, useEffect } from 'react';
import { Icons } from './LandingPageIcons';

export default function HeroSection() {
    const [heroAnimationProgress, setHeroAnimationProgress] = useState(0);

    const ANIMATION_DURATION = 12000;
    useEffect(() => {
        let startTime: number | null = null;
        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = elapsed % ANIMATION_DURATION;
            setHeroAnimationProgress(progress);
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    const typingProgress = Math.min(Math.max(heroAnimationProgress / 3000, 0), 1);
    const userMemo = "・春限定のいちごタルト開始\n・サクサク生地と完熟いちご\n・自家製カスタード";
    const generatedResult = "【春限定】とろける幸せ、いちごタルト解禁🍓\n\nサクサクのクッキー生地と、\n溢れんばかりの完熟いちご。\n一口食べれば、そこはもう春。";

    let currentText = "";
    if (heroAnimationProgress < 3000) {
        currentText = userMemo.slice(0, Math.floor(userMemo.length * typingProgress));
    } else if (heroAnimationProgress < 5000) {
        currentText = "Generating...";
    } else {
        currentText = generatedResult;
    }

    const isResultShown = heroAnimationProgress > 5000;
    const isPosted = heroAnimationProgress > 8000;

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white pt-24 md:pt-32">
            {/* Background Texture Placeholder */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1823ff 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

            <div className="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

                {/* Left: Huge Typography */}
                <div className="flex flex-col items-start text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1823ff]/5 border border-[#1823ff]/10 rounded-full mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1823ff] animate-pulse" />
                        <span className="text-[10px] font-bold text-[#1823ff] uppercase tracking-[0.2em]">Next-Gen AI for Business</span>
                    </div>

                    <h1 className="text-6xl md:text-7xl lg:text-[7rem] font-black tracking-tight leading-[0.9] text-[#282d32] mb-8 font-inter">
                        AI BUT<br />
                        <span className="text-[#1823ff]">YOURS.</span>
                    </h1>

                    <div className="max-w-md">
                        <p className="text-xl md:text-2xl font-medium text-slate-500 leading-tight mb-12">
                            丁寧だけど、どこか他人事。<br />
                            そんなAIを卒業しませんか。
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={() => window.location.href = '/start'} className="px-10 py-5 bg-[#1823ff] text-white font-black rounded-full shadow-2xl shadow-[#1823ff]/30 hover:scale-[1.02] active:scale-95 transition-all text-lg flex items-center gap-3">
                                <Icons.Sparkles size={20} className="text-yellow-300" />
                                7日間無料で試す
                            </button>
                            <button onClick={() => window.location.href = '#flow'} className="px-10 py-5 bg-white text-[#282d32] font-black rounded-full border border-slate-200 hover:bg-slate-50 transition-all text-lg">
                                使い方を見る
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Sleek Animation UI */}
                <div className="relative flex justify-center items-center h-[600px] lg:h-[800px]">
                    <div className="relative w-full max-w-[400px]">

                        {/* Main UI Card */}
                        <div className={`w-full bg-white rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 p-8 transition-all duration-1000 ${isPosted ? 'scale-95 opacity-50 -translate-x-12 rotate-[-5deg] blur-[1px]' : 'scale-100 opacity-100 translate-x-0 rotate-0'}`}>
                            <div className="flex justify-between items-center mb-10">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-slate-100" />
                                    <div className="w-3 h-3 rounded-full bg-slate-100" />
                                </div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MisePo AI</div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                        <Icons.PlusSquare size={18} className="text-slate-300" />
                                    </div>
                                    <div className="h-4 w-32 bg-slate-50 rounded-full" />
                                </div>

                                <div className="bg-slate-50 rounded-[32px] p-8 min-h-[220px]">
                                    <p className="text-lg font-bold text-slate-700 leading-relaxed whitespace-pre-wrap">
                                        {currentText}
                                        <span className="inline-block w-2 h-5 bg-[#1823ff] ml-1 animate-pulse" />
                                    </p>
                                </div>

                                <div className="pt-4">
                                    <div className={`w-full py-5 rounded-[24px] font-black text-center text-sm transition-all duration-700 ${isResultShown ? 'bg-[#1823ff] text-white shadow-xl shadow-[#1823ff]/20' : 'bg-slate-100 text-slate-400'}`}>
                                        {isResultShown ? "Post to Instagram" : "Generating..."}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Result Confirmation card (Floats in) */}
                        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isPosted ? 'translate-y-0 opacity-100 scale-105' : 'translate-y-20 opacity-0 scale-90 pointer-events-none'}`}>
                            <div className="bg-white rounded-[40px] shadow-[0_60px_120px_-30px_rgba(24,35,255,0.25)] border-2 border-[#1823ff]/10 p-10 text-center w-full max-w-[320px]">
                                <div className="w-20 h-20 bg-[#1823ff] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-[#1823ff]/30">
                                    <Icons.Check size={40} className="text-white" strokeWidth={3} />
                                </div>
                                <h4 className="text-2xl font-black text-[#282d32] mb-3">Posted!</h4>
                                <p className="text-sm text-slate-500 font-bold mb-8">AIによって、あなたらしい文章が発信されました。</p>
                                <div className="flex gap-2 justify-center">
                                    <div className="w-2 h-2 rounded-full bg-[#1823ff]" />
                                    <div className="w-2 h-2 rounded-full bg-[#1823ff]/30" />
                                    <div className="w-2 h-2 rounded-full bg-[#1823ff]/30" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}
