"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// --- Icons & Components ---

const Icons = {
    Check: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5 text-indigo-500">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    ),
    ArrowRight: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
        </svg>
    ),
    Coffee: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
            <line x1="6" y1="2" x2="6" y2="4" />
            <line x1="10" y1="2" x2="10" y2="4" />
            <line x1="14" y1="2" x2="14" y2="4" />
        </svg>
    ),
    Scissors: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="6" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <line x1="20" y1="4" x2="8.12" y2="15.88" />
            <line x1="14.47" y1="14.48" x2="20" y2="20" />
            <line x1="8.12" y1="8.12" x2="12" y2="12" />
        </svg>
    ),
    Bag: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
    ),
    Plus: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    ),
    Sparkle: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z" />
        </svg>
    ),
    Twitter: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    ),
    Mail: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    )
};

export default function LandingPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('cafe');
    const [scrollProgress, setScrollProgress] = useState(0);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            const totalDistance = rect.height - viewportHeight;
            const scrolled = -rect.top;

            const prog = Math.min(Math.max(scrolled / totalDistance, 0), 1);
            setScrollProgress(prog);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // ========== 6-STEP DETAILED WORKFLOW TIMELINE ==========
    // STEP 1 (0.00-0.10): Input Introduction - "伝えたい文章を入力します"
    // STEP 2 (0.10-0.30): Typewriter Effect - Actual text typing
    // STEP 3 (0.30-0.40): AI Conversion Notice - "AIが文章をプロクオリティに書き換えます"
    // STEP 4 (0.40-0.65): Processing Animation - AI working
    // STEP 5 (0.65-0.80): Result Introduction - "完成した投稿"
    // STEP 6 (0.80-1.00): Result Details - Title, body, tags reveal

    // ===== STEP 1: INPUT INTRODUCTION (0.00-0.10) =====
    const step1Progress = Math.min(Math.max(scrollProgress / 0.10, 0), 1);

    // Step 1 Label: "伝えたい文章を入力します"
    const step1LabelOpacity = Math.min(Math.max((scrollProgress - 0.01) / 0.06, 0), 1) * (scrollProgress < 0.30 ? 1 : Math.max(0, 1 - (scrollProgress - 0.30) * 10));
    const step1LabelY = -20 * (1 - Math.min(Math.max((scrollProgress - 0.01) / 0.06, 0), 1));

    // Input Card appears
    const inputCardIntro = step1Progress;
    const inputCardScale = 0.90 + (inputCardIntro * 0.10);
    const inputCardY = 30 * (1 - inputCardIntro);

    // ===== STEP 2: TYPEWRITER EFFECT (0.10-0.30) =====
    const step2Active = scrollProgress >= 0.10 && scrollProgress <= 0.30;
    const step2Progress = Math.min(Math.max((scrollProgress - 0.10) / 0.20, 0), 1);

    // Typewriter
    const fullInputText = "「春限定の桜餅。塩漬けの葉がアクセント。お茶セットで800円。」";
    const currentTextLength = Math.floor(fullInputText.length * step2Progress);
    const displayedInputText = fullInputText.slice(0, currentTextLength);

    // ===== STEP 3: AI CONVERSION NOTICE (0.30-0.40) =====
    const step3Progress = Math.min(Math.max((scrollProgress - 0.30) / 0.10, 0), 1);

    // Step 3 Label: "AIが文章をプロクオリティに書き換えます"
    const step3LabelOpacity = Math.min(Math.max((scrollProgress - 0.31) / 0.06, 0), 1) * (scrollProgress < 0.40 ? 1 : Math.max(0, 1 - (scrollProgress - 0.40) * 10));
    const step3LabelScale = 0.95 + (Math.min(Math.max((scrollProgress - 0.31) / 0.06, 0), 1) * 0.05);

    // Input Card fades out
    const inputCardExit = step3Progress;
    const inputOpacity = inputCardIntro * (1 - inputCardExit);
    const inputX = -400 * inputCardExit;

    // ===== STEP 4: PROCESSING ANIMATION (0.40-0.65) =====
    const step4Progress = Math.min(Math.max((scrollProgress - 0.40) / 0.25, 0), 1);

    // Processing Node
    const processIntro = Math.min(Math.max((scrollProgress - 0.40) / 0.08, 0), 1);
    const processStay = scrollProgress >= 0.48 && scrollProgress <= 0.60 ? 1 : 0;
    const processExit = Math.min(Math.max((scrollProgress - 0.60) / 0.05, 0), 1);

    const processOpacity = processIntro * (1 - processExit) + processStay * (1 - processExit);
    const processScale = 0.6 + (processOpacity * 0.4);
    const processRotate = (1 - processIntro) * 180;

    // Processing Labels
    const processLabel1Opacity = Math.min(Math.max((scrollProgress - 0.42) / 0.06, 0), 1) * processOpacity;
    const processLabel2Opacity = Math.min(Math.max((scrollProgress - 0.45) / 0.06, 0), 1) * processOpacity;
    const processLabelScale = 0.8 + (processOpacity * 0.2);

    // ===== STEP 5: RESULT INTRODUCTION (0.65-0.80) =====
    const step5Progress = Math.min(Math.max((scrollProgress - 0.65) / 0.15, 0), 1);

    // Step 5 Label: "完成した投稿"
    const step5LabelOpacity = Math.min(Math.max((scrollProgress - 0.66) / 0.08, 0), 1);
    const step5LabelX = 50 * (1 - Math.min(Math.max((scrollProgress - 0.66) / 0.08, 0), 1));

    // Result Card appears
    const resultIntro = step5Progress;
    const resultOpacity = resultIntro;
    const resultScale = 0.92 + (resultIntro * 0.08);
    const resultX = 500 * (1 - resultIntro);
    const resultY = -20 * (1 - resultIntro);

    // ===== STEP 6: RESULT DETAILS (0.80-1.00) =====
    const step6Progress = Math.min(Math.max((scrollProgress - 0.80) / 0.20, 0), 1);

    // Content cascade
    const resultTitleOpacity = Math.min(Math.max((scrollProgress - 0.82) / 0.08, 0), 1);
    const resultBodyOpacity = Math.min(Math.max((scrollProgress - 0.86) / 0.08, 0), 1);
    const resultTagsOpacity = Math.min(Math.max((scrollProgress - 0.90) / 0.08, 0), 1);

    return (
        <div className="bg-[#5c72ff] min-h-screen text-white font-sans selection:bg-lime-400 selection:text-black">

            {/* BACKGROUND LAYER: Cleaner & Softer for Clay Aesthetic */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#f8faff]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#5c72ff] to-[#8c52ff] opacity-[0.03]" />
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-500/10 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-lime-400/10 blur-[150px] rounded-full" />
            </div>

            {/* HEADER */}
            <header className="fixed top-0 left-0 w-full z-50">
                <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
                        <div className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                            <span className="font-black text-indigo-600 text-xl tracking-tighter">M</span>
                        </div>
                        <span className="text-2xl font-black tracking-tight font-en bg-clip-text">MisePo</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-bold opacity-80 hover:opacity-100 transition-opacity">Features</a>
                        <a href="#pricing" className="text-sm font-bold opacity-80 hover:opacity-100 transition-opacity">Pricing</a>
                        <a href="#faq" className="text-sm font-bold opacity-80 hover:opacity-100 transition-opacity">FAQ</a>
                    </nav>

                    <button
                        onClick={() => router.push('/generate')}
                        className="bg-white text-indigo-600 text-sm font-black px-8 py-3 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all font-en uppercase tracking-wider"
                    >
                        Start Free Trial
                    </button>
                </div>
            </header>

            {/* HERO SECTION */}
            {/* Added overflow-x-hidden here to safely clip the floating mockups without breaking sticky elsewhere */}
            <section className="pt-32 pb-20 md:pt-48 md:pb-40 relative overflow-x-hidden">
                <div className="container mx-auto px-6 text-center max-w-5xl relative z-20">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white/50 mb-12">
                        <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-[.2em] font-en text-indigo-900/40">v1.0 Public Beta</span>
                    </div>

                    <h1 className="text-6xl md:text-[9rem] font-black leading-[0.95] tracking-[-0.05em] mb-12 text-indigo-950 font-en">
                        Next-Gen<br />
                        AI Post Studio<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">
                            MisePo
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl font-bold font-serif text-indigo-900/60 leading-relaxed max-w-2xl mx-auto mb-16">
                        お店の「空気」を言葉にするAI。<br className="hidden md:block" />
                        プロのクオリティを、誰でも、1分で。
                    </p>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-10">
                        <button
                            onClick={() => router.push('/generate')}
                            className="group relative text-2xl font-black bg-indigo-600 text-white px-14 py-8 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(79,70,229,0.5)] hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.6)] hover:-translate-y-2 active:translate-y-0 transition-all flex items-center gap-6"
                        >
                            無料体験を始める
                            <span className="bg-white/20 text-white rounded-full p-2 group-hover:translate-x-1 transition-transform">
                                <Icons.ArrowRight />
                            </span>
                        </button>

                        <div className="flex items-center gap-4 p-2 bg-white rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-indigo-50 overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 20}`} alt="user" />
                                    </div>
                                ))}
                            </div>
                            <div className="pr-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-900/40 leading-none mb-1">Trusted by</p>
                                <p className="text-sm font-black text-indigo-950 leading-none">500+ managers</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FLOATING MOCKUPS - CLAY STYLE */}
                <div className="absolute top-[20%] left-[-5%] w-[30%] opacity-20 transform -rotate-12 hidden lg:block z-0 pointer-events-none">
                    <div className="aspect-[9/19] bg-white rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border-[12px] border-white" />
                </div>
                <div className="absolute top-[15%] right-[-5%] w-[35%] opacity-30 transform rotate-12 hidden lg:block z-0 pointer-events-none">
                    <div className="aspect-[9/19] bg-white rounded-[4.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border-[12px] border-white" />
                </div>
            </section>

            {/* BENTO GRID SECTION: Impact & Pain Points combined */}
            <section className="py-32 relative z-20">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                        {/* 1. Large Statistical Impact Card */}
                        <div className="md:col-span-8 bg-white rounded-[4rem] p-12 md:p-20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] border-4 border-white flex flex-col justify-between group overflow-hidden relative">
                            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-lime-400/5 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[.4em] text-indigo-900/30 mb-8 block">Market Reality</span>
                                <h2 className="text-6xl md:text-[9rem] font-black text-indigo-950 leading-none mb-8 tracking-tighter">70<span className="text-4xl md:text-5xl">%</span></h2>
                                <h3 className="text-3xl md:text-4xl font-black text-indigo-900 tracking-tight leading-tight">
                                    新規来店客の7割以上が、<br />来店前にSNSを確認。
                                </h3>
                            </div>
                            <p className="mt-12 text-lg font-bold font-serif text-indigo-900/50 leading-relaxed max-w-xl">
                                顧客はGoogleマップで検索し、SNSで「今の雰囲気」を確認します。SNSが更新されていないことは、ビジネスにおいて機会損失そのものです。
                            </p>
                        </div>

                        {/* 2. Top-Right Pain Point: Education */}
                        <div className="md:col-span-4 bg-lime-400 rounded-[4rem] p-12 shadow-[0_50px_100px_-20px_rgba(163,230,53,0.3)] border-4 border-lime-300 flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute bottom-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform">
                                <Icons.Coffee />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[.4em] text-indigo-900/40 mb-8 block">Barrier Zero</span>
                                <h3 className="text-3xl font-black text-indigo-950 tracking-tighter leading-tight">
                                    教育コストを<br />極限まで削減。
                                </h3>
                            </div>
                            <p className="mt-8 text-sm font-bold font-serif text-indigo-900/60 leading-loose">
                                スタッフの交代に伴う教育の手間をAIが代行。常にブランドの「書き方」を維持します。
                            </p>
                        </div>

                        {/* 3. Bottom-Left Pain Point: Quality */}
                        <div className="md:col-span-6 bg-white rounded-[4rem] p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] border-4 border-white flex items-center gap-10 group">
                            <div className="w-24 h-24 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:rotate-12 transition-transform shadow-inner">
                                <Icons.Sparkle />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-black text-indigo-950 mb-4 tracking-tighter">
                                    クオリティの平準化
                                </h3>
                                <p className="text-sm font-bold font-serif text-indigo-900/50 leading-loose">
                                    「誰が書いてもプロ級」を実現。担当者による品質の差をなくし、最高水準を維持。
                                </p>
                            </div>
                        </div>

                        {/* 4. Bottom-Right Pain Point: UX */}
                        <div className="md:col-span-6 bg-indigo-600 rounded-[4rem] p-12 shadow-[0_50px_100px_-20px_rgba(79,70,229,0.3)] border-4 border-indigo-500 text-white group">
                            <div className="flex flex-col h-full justify-between">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-3xl font-black tracking-tighter leading-tight">
                                        直感的な<br />操作体験。
                                    </h3>
                                    <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md">
                                        <Icons.Scissors />
                                    </div>
                                </div>
                                <p className="mt-6 text-sm font-bold font-serif text-white/70 leading-loose">
                                    ITツールに不慣れなスタッフでも、迷わず1分で作成完了。チーム全員を即戦力へと変えます。
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* PARALLAX PINNED PREVIEW SECTION */}
            <section id="features" ref={sectionRef} className="relative h-[1000vh]" >
                {/* Input Content Container - Types as you scroll */}
                <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden" >
                    <div className="container mx-auto px-6 max-w-5xl relative h-[600px] flex items-center justify-center perspective-1000">

                        {/* 1. INPUT CARD + STEP 1 & 2 LABELS */}
                        <div
                            className="absolute w-full max-w-md z-20 pointer-events-none"
                            style={{
                                opacity: inputOpacity,
                                transform: `translateX(${inputX}px) translateY(${inputCardY}px) scale(${inputCardScale}) rotate(-3deg)`,
                                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease-out',
                            }}
                        >
                            {/* STEP 1 Label: "伝えたい文章を入力します" */}
                            <div
                                className="absolute -top-20 left-0 right-0 text-center"
                                style={{
                                    opacity: step1LabelOpacity,
                                    transform: `translateY(${step1LabelY}px)`,
                                    transition: 'all 0.6s ease-out'
                                }}
                            >
                                <div className="inline-block px-8 py-3 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white">
                                    <p className="text-lg font-black text-indigo-950">伝えたい文章を入力します</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-[3.5rem] p-10 shadow-[0_40px_100px_rgba(0,0,0,0.1)] border-[10px] border-white ring-1 ring-indigo-50">
                                <div className="bg-indigo-50/50 p-8 rounded-[2.5rem] border border-indigo-100 shadow-inner min-h-[14rem] flex items-start">
                                    <p className="text-2xl font-black font-serif leading-relaxed text-indigo-950 w-full break-words">
                                        {displayedInputText}
                                        <span className="animate-pulse inline-block w-1.5 h-8 bg-indigo-400 ml-1 align-text-bottom" />
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* STEP 3 Label: "AIが文章をプロクオリティに書き換えます" */}
                        <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-15 pointer-events-none"
                            style={{
                                opacity: step3LabelOpacity,
                                transform: `translate(-50%, -50%) scale(${step3LabelScale})`,
                                transition: 'all 0.6s ease-out'
                            }}
                        >
                            <div className="relative px-10 py-5 bg-white rounded-[2rem] shadow-[0_50px_100px_rgba(79,70,229,0.2)] border-4 border-indigo-50">
                                <h3 className="text-3xl font-black text-indigo-950 whitespace-nowrap tracking-tighter">
                                    AIが文章を<span className="text-indigo-600">プロクオリティ</span>に書き換えます
                                </h3>
                                <div className="absolute inset-0 rounded-[2rem] bg-indigo-600/5 blur-3xl -z-10"></div>
                            </div>
                        </div>

                        {/* 2. PROCESSING NODE + STEP 4 LABELS */}
                        <div
                            className="absolute z-10"
                            style={{
                                opacity: processOpacity,
                                transform: `scale(${processScale}) rotate(${processRotate}deg)`,
                                transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            }}
                        >
                            <div className="relative">
                                <div className="w-40 h-40 rounded-[3rem] bg-gradient-to-br from-lime-400 to-emerald-400 text-indigo-950 flex items-center justify-center shadow-[0_0_80px_rgba(163,230,53,0.7)] animate-spin-slow">
                                    <Icons.Sparkle />
                                </div>

                                {/* STEP 4 Labels: Processing */}
                                <div className="absolute -top-20 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                                    <div style={{ opacity: processLabel1Opacity, transform: `scale(${processLabelScale})`, transition: 'all 0.5s ease-out' }}>
                                        <span className="block text-xs font-black uppercase tracking-widest text-lime-400/90">AI Processing</span>
                                    </div>
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center whitespace-nowrap pointer-events-none">
                                    <div style={{ opacity: processLabel2Opacity, transform: `scale(${processLabelScale})`, transition: 'all 0.5s ease-out' }}>
                                        <h3 className="text-4xl font-black bg-gradient-to-r from-lime-300 via-white to-lime-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(163,230,53,1)] animate-pulse">生成中...</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. RESULT CARD + STEP 5 LABEL */}
                        <div
                            className="absolute w-full max-w-xl z-30 pointer-events-none"
                            style={{
                                opacity: resultOpacity,
                                transform: `translateX(${resultX}px) translateY(${resultY}px) scale(${resultScale}) rotate(2deg)`,
                                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                            }}
                        >
                            {/* STEP 5 Label: "完成した投稿" */}
                            <div
                                className="absolute -top-16 left-0 right-0 flex justify-end"
                                style={{
                                    opacity: step5LabelOpacity,
                                    transform: `translateX(${step5LabelX}px)`,
                                    transition: 'all 0.6s ease-out'
                                }}
                            >
                                <div className="inline-block px-8 py-3 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white">
                                    <h3 className="text-lg font-black text-indigo-950">完成した投稿</h3>
                                </div>
                            </div>

                            <div className="bg-white rounded-[4rem] p-12 shadow-[0_100px_200px_-40px_rgba(79,70,229,0.3)] relative overflow-hidden border-[12px] border-white ring-1 ring-indigo-50">
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50/50 to-transparent pointer-events-none" />
                                <div className="relative z-10">
                                    <div className="flex justify-end items-center mb-10">
                                        <div className="px-4 py-1.5 bg-lime-100 text-lime-700 rounded-full text-[10px] font-black tracking-widest border border-lime-200">完成</div>
                                    </div>
                                    <div className="space-y-8">
                                        <p className="text-4xl font-black font-serif leading-tight text-indigo-950" style={{ opacity: resultTitleOpacity, transition: 'opacity 0.6s ease-out' }}>
                                            春の訪れを、和菓子とともに。<br />今年も「春限定の桜餅」が始まりました。
                                        </p>
                                        <p className="text-xl font-bold font-serif leading-relaxed text-indigo-900/70" style={{ opacity: resultBodyOpacity, transition: 'opacity 0.6s ease-out' }}>
                                            塩漬けの桜葉が良いアクセントに。<br />温かいお茶と一緒に、ほっと一息つきませんか？
                                        </p>
                                        <div className="pt-10 flex flex-wrap gap-4" style={{ opacity: resultTagsOpacity, transition: 'opacity 0.6s ease-out' }}>
                                            {["#桜餅", "#春スイーツ", "#和カフェ"].map(tag => (
                                                <span key={tag} className="px-6 py-2.5 bg-indigo-50 rounded-full text-xs font-black text-indigo-600 tracking-wider shadow-sm border border-indigo-100">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* SPEED COMPARISON SECTION: 手動 vs MisePo */}
            <section className="py-32 relative z-20">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-20">
                        <span className="text-[10px] font-black uppercase tracking-[.5em] text-indigo-400/50 mb-4 block leading-none">Efficiency Comparison</span>
                        <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter text-indigo-950">
                            あなたの「30分」を、<br className="md:hidden" />「1分」に。
                        </h2>
                        <p className="text-lg font-bold font-serif text-indigo-900/40">
                            執筆・推敲・タグ選び。すべての工程をAIがショートカットします。
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Manual Process */}
                        <div className="bg-white rounded-[3.5rem] p-12 border-4 border-indigo-50 shadow-[0_30px_60px_-10px_rgba(0,0,0,0.05)] opacity-60">
                            <h3 className="text-xl font-black mb-10 flex items-center gap-4 text-indigo-950/40 uppercase tracking-widest">
                                <span className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-sm">A</span>
                                MANUAL Process
                            </h3>
                            <div className="space-y-8">
                                {[
                                    { task: "内容の構成案を考える", time: "10 min" },
                                    { task: "適切な言葉選びと執筆", time: "10 min" },
                                    { task: "ハッシュタグの選定", time: "5 min" },
                                    { task: "誤字脱字の最終確認", time: "5 min" },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center border-b border-indigo-50 pb-6">
                                        <span className="text-indigo-900/60 font-bold font-serif tracking-tight">{item.task}</span>
                                        <span className="font-black text-indigo-900/30 font-en uppercase text-xs">{item.time}</span>
                                    </div>
                                ))}
                                <div className="pt-8 flex justify-between items-center text-2xl font-black text-indigo-950/40">
                                    <span>Total</span>
                                    <span>30 MIN</span>
                                </div>
                            </div>
                        </div>

                        {/* MisePo Process */}
                        <div className="bg-indigo-600 rounded-[3.5rem] p-12 border-4 border-indigo-500 shadow-[0_50px_100px_-20px_rgba(79,70,229,0.4)] scale-105 relative z-10 group hover:-translate-y-2 transition-transform">
                            <h3 className="text-xl font-black mb-10 flex items-center gap-4 text-white uppercase tracking-widest">
                                <span className="w-10 h-10 rounded-2xl bg-white text-indigo-600 flex items-center justify-center text-sm">B</span>
                                MISEPO AI
                            </h3>
                            <div className="space-y-8">
                                <div className="flex justify-between items-center border-b border-white/10 pb-6">
                                    <span className="text-white font-bold font-serif tracking-tight">情報を入力 & CLICK</span>
                                    <span className="font-black text-lime-400 font-en uppercase text-xs">10 SEC</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/10 pb-6">
                                    <span className="text-white font-bold font-serif tracking-tight">AIによる自動執筆</span>
                                    <span className="font-black text-lime-400 font-en uppercase text-xs">30 SEC</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/10 pb-6">
                                    <span className="text-white font-bold font-serif tracking-tight">タグ生成 & 最終チェック</span>
                                    <span className="font-black text-lime-400 font-en uppercase text-xs">20 SEC</span>
                                </div>
                                <div className="pt-8 flex justify-between items-center text-4xl font-black text-white">
                                    <span>Total</span>
                                    <span className="text-lime-400 drop-shadow-[0_0_20px_rgba(163,230,53,0.5)]">1 MIN</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* INDUSTRY TABS */}
            <section className="py-32 relative z-20 bg-indigo-50/50">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-5xl md:text-[6.5rem] font-black mb-16 uppercase font-en tracking-tighter leading-none text-indigo-950">
                        Fits for<br />
                        Any Industry
                    </h2>

                    <div className="inline-flex flex-wrap justify-center p-3 bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-4 border-white gap-2 mb-20">
                        {['cafe', 'salon', 'retail'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-12 py-5 rounded-[2.5rem] font-black text-sm tracking-widest uppercase transition-all flex items-center gap-4 ${activeTab === tab ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-indigo-900/40 hover:bg-indigo-50'}`}
                            >
                                {tab === 'cafe' && <><Icons.Coffee /> Cafe</>}
                                {tab === 'salon' && <><Icons.Scissors /> Salon</>}
                                {tab === 'retail' && <><Icons.Bag /> Retail</>}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-4xl mx-auto bg-white rounded-[4rem] p-16 md:p-24 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.1)] border-4 border-white relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                            {activeTab === 'cafe' && <Icons.Coffee />}
                            {activeTab === 'salon' && <Icons.Scissors />}
                            {activeTab === 'retail' && <Icons.Bag />}
                        </div>
                        <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {activeTab === 'cafe' && (
                                <p className="font-serif text-3xl md:text-5xl leading-[1.3] text-indigo-950 font-black italic tracking-tight">
                                    「雨の日は、静かな店内で読書はいかがですか？<br className="hidden md:block" />
                                    深煎りのブレンドと、焼きたてのスコーンでお待ちしております。」
                                </p>
                            )}
                            {activeTab === 'salon' && (
                                <p className="font-serif text-3xl md:text-5xl leading-[1.3] text-indigo-950 font-black italic tracking-tight">
                                    「春の風に揺れる、繊細なレイヤーカット。<br className="hidden md:block" />
                                    軽やかな動きとツヤ感で、新しい自分に出会いませんか？」
                                </p>
                            )}
                            {activeTab === 'retail' && (
                                <p className="font-serif text-3xl md:text-5xl leading-[1.3] text-indigo-950 font-black italic tracking-tight">
                                    「職人が一つひとつ手作りした、こだわりの一生モノ。<br className="hidden md:block" />
                                    使うほどに馴染む質感を、ぜひ店頭でお確かめください。」
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ ACCORDION */}
            <section id="faq" className="py-32 relative z-20">
                <div className="container mx-auto px-6 max-w-3xl">
                    <div className="text-center mb-20">
                        <span className="text-[10px] font-black uppercase tracking-[.4em] text-indigo-400/50 mb-4 block">Questions & Answers</span>
                        <h2 className="text-5xl font-black text-indigo-950 tracking-tighter">よくあるご質問</h2>
                    </div>

                    <div className="space-y-6">
                        {[
                            { q: "無料体験で何ができますか？", a: "7日間の体験期間中は、Proプランの全ての機能を無制限にお試しいただけます。品質に満足いただけない場合は、1クリックで解約可能です。" },
                            { q: "AIの文章は不自然になりませんか？", a: "ご安心ください。MisePoは最新の言語モデルを店舗SNSに特化させて調整しています。人間が書いたような温かみと、プロのコピーライターのような訴求力を両立させています。" },
                            { q: "対応しているSNSを教えてください。", a: "Instagram、X（旧Twitter）、Googleビジネスプロフィール、Threadsに対応しています。1つの入力から、それぞれの媒体に最適な形式で一括生成が可能です。" },
                            { q: "スマートフォンでも使えますか？", a: "もちろんです。ブラウザベースのサービスですので、端末を問わずどこからでもアクセス・投稿作成が可能です。" },
                            { q: "商用利用は可能ですか？", a: "はい、生成された全コンテンツは商用利用可能です。店舗ブランドに合わせて自由にお使いください。" }
                        ].map((item, i) => (
                            <details key={i} className="group bg-white rounded-[2rem] border-4 border-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] overflow-hidden transition-all hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)]">
                                <summary className="list-none px-10 py-8 font-black text-xl cursor-pointer transition-all text-indigo-900/60 group-hover:text-indigo-950 flex justify-between items-center">
                                    {item.q}
                                    <span className="text-indigo-300 group-open:rotate-180 transition-transform">
                                        <Icons.Plus />
                                    </span>
                                </summary>
                                <div className="px-10 pb-8 text-indigo-900/50 font-bold font-serif leading-loose border-t border-indigo-50 mt-2 pt-6">
                                    {item.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* PRICING TABLE */}
            <section id="pricing" className="py-32 pb-40 relative z-20 bg-indigo-50/30">
                <div className="container mx-auto px-6 max-w-5xl text-center">
                    <div className="mb-20">
                        <span className="text-[10px] font-black uppercase tracking-[.4em] text-indigo-400/50 mb-4 block">Pricing Plans</span>
                        <h2 className="text-5xl md:text-6xl font-black text-indigo-950 tracking-tighter">
                            シンプルで、<br className="md:hidden" />明快なプラン。
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Free Plan */}
                        <div className="bg-white rounded-[4rem] p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] border-4 border-white flex flex-col justify-between hover:shadow-[0_50px_100px_-25px_rgba(0,0,0,0.08)] transition-all">
                            <div>
                                <h3 className="text-2xl font-black text-indigo-950 mb-4 uppercase tracking-widest">Free</h3>
                                <div className="text-5xl font-black text-indigo-600 mb-8 font-en">¥0<span className="text-sm text-indigo-300 font-bold ml-2">/ month</span></div>
                                <ul className="space-y-6 text-left mb-12">
                                    {["月間 5回まで生成", "全タブ・インダストリー対応", "スマートフォン対応"].map((f, i) => (
                                        <li key={i} className="flex items-center gap-4 text-indigo-900/40 font-bold font-serif">
                                            <span className="text-indigo-200"><Icons.Check /></span> {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button
                                onClick={() => router.push('/generate')}
                                className="w-full py-6 rounded-[2rem] bg-indigo-50 text-indigo-400 font-black text-lg hover:bg-indigo-100 transition-colors uppercase tracking-widest"
                            >
                                Start Free
                            </button>
                        </div>

                        {/* Pro Plan */}
                        <div className="bg-indigo-600 rounded-[4rem] p-12 shadow-[0_50px_100px_-20px_rgba(79,70,229,0.4)] border-4 border-indigo-500 flex flex-col justify-between scale-105 relative z-10 group hover:-translate-y-2 transition-transform">
                            <div className="absolute top-8 right-8 px-4 py-1.5 bg-lime-400 text-indigo-950 rounded-full text-[10px] font-black tracking-widest uppercase">Popular</div>
                            <div>
                                <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-widest">Pro</h3>
                                <div className="text-5xl font-black text-white mb-8 font-en">¥2,980<span className="text-sm text-indigo-300 font-bold ml-2">/ month</span></div>
                                <ul className="space-y-6 text-left mb-12">
                                    {["生成回数 無制限", "高品質AIモデルを優先適用", "プレミアム機能の解放", "先行ベータ機能の利用"].map((f, i) => (
                                        <li key={i} className="flex items-center gap-4 text-white/80 font-bold font-serif">
                                            <span className="text-lime-400"><Icons.Check /></span> {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button
                                onClick={() => router.push('/generate')}
                                className="w-full py-6 rounded-[2rem] bg-lime-400 text-indigo-950 font-black text-lg shadow-[0_20px_40px_-5px_rgba(163,230,53,0.4)] hover:shadow-[0_25px_50px_-5px_rgba(163,230,53,0.5)] transition-all uppercase tracking-widest"
                            >
                                Get Pro Now
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-24 relative z-20">
                <div className="container mx-auto px-6 max-w-5xl text-center">
                    <div className="bg-white rounded-[4rem] p-16 shadow-[0_40px_80px_rgba(0,0,0,0.05)] border-4 border-white">
                        <div className="flex flex-col items-center gap-10">
                            <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-xl transform hover:rotate-6 transition-transform">
                                <span className="font-black text-white text-3xl tracking-tighter">M</span>
                            </div>
                            <h2 className="text-4xl font-black text-indigo-950 tracking-tighter uppercase font-en">
                                MisePo
                            </h2>
                            <p className="text-xl font-bold font-serif text-indigo-900/30 max-w-md mx-auto leading-relaxed">
                                次世代の店舗SNS運用体験を、<br />すべてのお店へ。
                            </p>
                            <div className="flex gap-8">
                                <a href="#" className="p-4 bg-indigo-50 rounded-2xl text-indigo-400 hover:text-indigo-600 hover:scale-110 transition-all">
                                    <Icons.Twitter />
                                </a>
                                <a href="#" className="p-4 bg-indigo-50 rounded-2xl text-indigo-400 hover:text-indigo-600 hover:scale-110 transition-all">
                                    <Icons.Mail />
                                </a>
                            </div>
                        </div>
                        <div className="mt-20 pt-10 border-t border-indigo-50 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="text-[10px] font-black text-indigo-900/20 uppercase tracking-[.4em]">
                                © 2024 MisePo AI Studio
                            </div>
                            <div className="flex gap-10">
                                <a href="#" className="text-[10px] font-black text-indigo-900/40 uppercase tracking-widest hover:text-indigo-600 transition-colors">Privacy</a>
                                <a href="#" className="text-[10px] font-black text-indigo-900/40 uppercase tracking-widest hover:text-indigo-600 transition-colors">Terms</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <style jsx global>{`
        .perspective-1000 { perspective: 2000px; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .font-en { font-family: 'Inter', 'Outfit', sans-serif; }
      `}</style>
        </div >
    );
}
