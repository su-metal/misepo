"use client";
import React, { useState, useEffect } from 'react';
import { Icons } from './LandingPageIcons';

export default function HeroSection() {
    const [heroAnimationProgress, setHeroAnimationProgress] = useState(0);

    // Time-Based Animation Loop
    const ANIMATION_DURATION = 11950; // Total duration in ms for one full loop
    useEffect(() => {
        let startTime: number | null = null;
        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = elapsed % ANIMATION_DURATION; // Loop
            setHeroAnimationProgress(progress);
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    // Animation States derived from progress
    // Since it's now time-based, we use progress directly
    const effectiveProgress = heroAnimationProgress;

    // Data
    const userMemo = "・春限定のいちごタルト開始\n・サクサク生地と完熟いちご\n・自家製カスタード\n・渋谷駅徒歩5分\n・#春スイーツ";
    const generatedResult = "【春限定】とろける幸せ、いちごタルト解禁🍓\n\nサクサクのクッキー生地と、\n溢れんばかりの完熟いちご。\n一口食べれば、そこはもう春。\n\n完熟いちごの甘さと、\n自家製カスタードのハーモニーを\nぜひお楽しみください。\n\n📍Access: 渋谷駅 徒歩5分\n🕒Open: 10:00 - 20:00\n📞Reserve: 03-1234-5678\n\n#MisePoカフェ #春スイーツ #期間限定";

    // Phase 1: Typing Input (0 - 3000) - Extended for full memo typing
    const typingProgress = Math.min(Math.max(effectiveProgress / 3000, 0), 1);

    // Determine text content based on phase
    let currentText = "";
    if (effectiveProgress < 3000) {
        currentText = userMemo.slice(0, Math.floor(userMemo.length * typingProgress));
    } else if (effectiveProgress < 5000) {
        currentText = ""; // Generating... (Extended from 1250 to 2000)
    } else {
        currentText = generatedResult;
    }

    // Generation Phase
    const isTypingDone = effectiveProgress > 3000;
    const isGenerating = effectiveProgress > 3000 && effectiveProgress < 5000;
    const isResultShown = effectiveProgress > 5000; // Result visible

    // Post/Swap Phase (Trigger at 7000 - adjusted for extended generating phase)
    const isPosted = effectiveProgress > 7000;

    // Inertia Scroll (Ease Out)
    // Start at 7100, duration 2850 -> Ends at 9950
    // Total timeline is 11950, so 9950-11950 is "Grace Period" (Locked Wait)
    const rawScrollProgress = Math.min(Math.max((effectiveProgress - 7100) / 2850, 0), 1);
    const easeOutCubic = 1 - Math.pow(1 - rawScrollProgress, 3);
    const internalScrollProgress = easeOutCubic;

    const innerContentStyle = {
        transform: `translateY(-${internalScrollProgress * 320}px)`,
    };

    // Text Opacity Logic for Fade-In Effect
    // Smoother transitions between phases
    let textOpacity = 1;
    if (effectiveProgress >= 3000 && effectiveProgress < 5000) {
        textOpacity = 0.5; // Generating pulse
    } else if (effectiveProgress >= 5000) {
        // Fade in result (5000-5500) - Slower fade (500ms equivalent)
        textOpacity = Math.min(Math.max((effectiveProgress - 5000) / 500, 0), 1);
    }

    return (
        <div className="relative z-10 h-auto">
            <div
                className="relative h-[110vh] md:h-screen w-full overflow-hidden flex flex-col"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50" />

                {/* Mobile Text (Static at top) */}
                <div className="md:hidden pt-24 px-4 text-center z-20 relative mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/80 backdrop-blur-sm border border-indigo-100 shadow-sm mb-4">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-xs font-bold text-indigo-900">先着100店舗様限定 モニター価格</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-[1.1] mb-3">
                        AIなのに、<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">私の言葉。</span>
                    </h1>
                    <p className="text-base text-slate-600 leading-relaxed px-2">
                        丁寧すぎて恥ずかしいAIは卒業。<br />
                        MisePoはあなたの「書き癖」を学習し、<br />
                        店主の『分身』としてSNS運用を代行します。
                    </p>
                    <div className="flex flex-col gap-3 max-w-sm mx-auto mt-8 px-4">
                        <button onClick={() => window.location.href = '/start'} className="w-full px-6 py-3.5 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2">
                            <Icons.Sparkles size={18} className="text-yellow-400" />
                            無料で試してみる
                        </button>
                        <button onClick={() => window.location.href = '#pricing'} className="w-full px-6 py-3.5 bg-white text-slate-900 rounded-full font-bold border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all">
                            料金プラン
                        </button>
                    </div>
                </div>

                {/* Desktop Text (Absolute) */}
                <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-8 lg:left-16 xl:left-24 z-20 max-w-lg lg:max-w-xl">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-lg shadow-indigo-100/20 mb-8">
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                        </span>
                        <span className="text-sm font-bold text-indigo-900">【先着100店舗様限定】先行モニター価格 月額1,480円</span>
                    </div>
                    <h1 className="text-6xl lg:text-[5.5rem] font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
                        AIなのに、<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">私の言葉。</span>
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-lg">
                        丁寧すぎて恥ずかしいAIは卒業。<br />
                        MisePoはあなたの「書き癖」を学習し、<br />
                        常連さんが読んでも違和感のない文章を30秒で作成。<br />
                        店主の『分身』が、SNS投稿もクチコミ返信も代行します。
                    </p>
                    <div className="flex gap-4 pointer-events-auto">
                        <button onClick={() => window.location.href = '/start'} className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all hover:scale-105 shadow-xl shadow-slate-900/20 flex items-center gap-2">
                            <Icons.Sparkles size={20} className="text-yellow-400" />
                            無料で試してみる
                        </button>
                        <button onClick={() => window.location.href = '#pricing'} className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all">
                            料金プラン
                        </button>
                    </div>
                </div>

                {/* Phone Animation Container */}
                <div className="absolute inset-0 md:left-[55%] lg:left-[55%] xl:left-[50%] flex items-start md:items-center justify-center pointer-events-none pt-[32rem] md:pt-0">
                    <div className="relative w-[300px] h-[600px] scale-[0.55] md:scale-[0.75] lg:scale-[0.85] xl:scale-100 origin-top md:origin-center">

                        {/* CENTER PHONE (MisePo) */}
                        <div
                            className={`absolute inset-0 transition-all duration-1000 ease-in-out origin-center
                                ${isPosted
                                    ? 'scale-75 -translate-x-[40vw] md:-translate-x-[200px] -rotate-12 opacity-60 z-10 blur-[1px]'
                                    : 'scale-100 translate-x-0 rotate-0 opacity-100 z-30 blur-none'
                                }`}
                        >
                            {/* Narrative Floating Label */}
                            <div className={`absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 transition-all duration-300 ${effectiveProgress > 100 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                <div className="bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-full font-bold text-sm shadow-xl border border-slate-700/50 flex items-center gap-2">
                                    {effectiveProgress < 3000 && (
                                        <>
                                            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                            1. メモを入力中...
                                        </>
                                    )}
                                    {effectiveProgress >= 3000 && effectiveProgress < 5000 && (
                                        <>
                                            <Icons.Sparkles size={14} className="text-yellow-400 animate-spin" />
                                            2. AIが文章を生成中...
                                        </>
                                    )}
                                    {effectiveProgress >= 5000 && (
                                        <>
                                            <Icons.CheckCircle size={14} className="text-green-400" />
                                            3. 文章が完成！
                                        </>
                                    )}
                                </div>
                                {/* Arrow */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 text-slate-900/90 -mt-1">
                                    <svg width="12" height="6" viewBox="0 0 12 6" fill="currentColor"><path d="M6 6L0 0H12L6 6Z" /></svg>
                                </div>
                            </div>

                            <div className="w-full h-full bg-slate-900 rounded-[3rem] border-8 border-slate-900 shadow-2xl overflow-hidden ring-4 ring-slate-900/10 relative">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-40 bg-slate-900 rounded-b-2xl z-40" />
                                <div className="w-full h-full bg-slate-50 relative flex flex-col pt-10">
                                    <div className="px-4 pb-4 border-b border-slate-100 flex justify-between items-center bg-white">
                                        <div className="p-2"><Icons.Menu className="text-slate-400" size={20} /></div>
                                        <span className="font-bold text-slate-800">New Post</span>
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center"><Icons.Sparkles size={16} fill="currentColor" /></div>
                                    </div>
                                    <div className="p-4 flex-1">
                                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4 space-y-3">
                                            <div className="flex gap-2">
                                                <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded">Instagram</span>
                                                <span className="px-2 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold rounded">Tone: Casual</span>
                                            </div>
                                            <div className={`space-y-2 transition-all duration-500 ease-in-out ${isGenerating ? 'animate-pulse' : ''}`} style={{ opacity: textOpacity }}>
                                                <div className="text-sm text-slate-700 min-h-[60px] whitespace-pre-wrap font-medium">
                                                    {currentText}
                                                    <span className={`${isTypingDone ? 'hidden' : 'inline'} animate-pulse text-indigo-500`}>|</span>
                                                </div>
                                            </div>

                                            {/* Button Container with Tap Effect */}
                                            <div className="relative">
                                                <div className={`bg-indigo-600 text-white rounded-xl py-3 font-bold text-center shadow-lg shadow-indigo-200 transition-all duration-300 ${isGenerating ? 'scale-95 bg-indigo-500' : ''}`}>
                                                    {isGenerating ? (
                                                        <span className="flex items-center justify-center gap-2">
                                                            <Icons.Sparkles size={16} className="animate-spin" /> 生成中...
                                                        </span>
                                                    ) : isResultShown ? (
                                                        "投稿する"
                                                    ) : (
                                                        "生成する"
                                                    )}
                                                </div>

                                                {/* Tap Visual Cue at 2000 (Start of Generation) */}
                                                {effectiveProgress >= 1900 && effectiveProgress <= 2300 && (
                                                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/50 rounded-full animate-ping pointer-events-none" />
                                                )}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* LEFT PHONE (Instagram) */}
                        <div
                            className={`absolute inset-0 w-[260px] h-[520px] top-20 left-[-100px] transition-all duration-1000 ease-in-out origin-center
                                ${isPosted
                                    ? 'scale-[1.15] translate-x-[120px] -translate-y-16 rotate-0 z-40'
                                    : '-translate-x-[100px] translate-y-0 -rotate-12 z-20 opacity-80'
                                }`}
                        >
                            <div className="w-full h-full bg-white rounded-[2.5rem] border-4 border-slate-900 shadow-xl overflow-hidden relative flex flex-col">

                                {/* Success Overlay when posted (Non-blocking) */}
                                {isPosted && (
                                    <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
                                        {/* Large Confetti (Background) - Always show when posted */}
                                        <div className="absolute inset-0">
                                            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-yellow-400 rotate-12 animate-fall" style={{ animationDuration: '3s' }} />
                                            <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-pink-500 -rotate-12 animate-fall" style={{ animationDuration: '2.5s', animationDelay: '0.2s' }} />
                                            <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-indigo-500 rotate-45 animate-fall" style={{ animationDuration: '4s', animationDelay: '0.1s' }} />
                                            <div className="absolute top-10 left-10 w-2 h-2 bg-green-400 rotate-45 animate-fall" style={{ animationDuration: '2.8s', animationDelay: '0.5s' }} />
                                            <div className="absolute top-20 right-10 w-2 h-2 bg-purple-400 -rotate-12 animate-fall" style={{ animationDuration: '3.2s', animationDelay: '0.3s' }} />
                                        </div>

                                        {/* Success Toast (Bottom) - Only show after scroll finishes (>6800) */}
                                        <div className={`absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-full shadow-2xl border border-slate-700/50 w-[90%] justify-center transition-all duration-500 transform ${effectiveProgress > 6800 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shrink-0 animate-pulse">
                                                <Icons.Check size={14} strokeWidth={4} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm leading-none">Posted Successfully!</p>
                                                <p className="text-[10px] text-slate-400 font-medium mt-0.5">to Instagram</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Header */}
                                <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100 z-10 bg-white sticky top-0 shrink-0">
                                    <div className="font-bold text-lg font-script tracking-tighter">Instagram</div>
                                    <div className="flex gap-4">
                                        <Icons.Heart size={22} className="text-slate-900" />
                                        <Icons.MessageCircle size={22} className="text-slate-900" />
                                    </div>
                                </div>

                                {/* Content Scroll Area */}
                                <div className="flex-1 overflow-hidden relative bg-white">
                                    {/* Skeleton Overlay for Waiting State */}
                                    <div className={`absolute inset-0 bg-white z-20 transition-opacity duration-500 flex flex-col ${isPosted ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                        <div className="p-4 space-y-4 flex-1">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse ring-2 ring-white" />
                                                <div className="w-24 h-3 bg-slate-100 rounded animate-pulse" />
                                            </div>
                                            <div className="w-full aspect-square bg-slate-100 rounded animate-pulse" />
                                            <div className="space-y-3 pt-2">
                                                <div className="w-3/4 h-3 bg-slate-100 rounded animate-pulse" />
                                                <div className="w-1/2 h-3 bg-slate-100 rounded animate-pulse" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Real Content */}
                                    <div className="flex flex-col bg-white transition-transform duration-[2850ms] ease-out" style={isPosted ? innerContentStyle : {}}>
                                        {/* Story/User Header */}
                                        <div className="px-3 py-2 flex items-center gap-2">
                                            <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
                                                <div className="w-8 h-8 rounded-full bg-white border border-white flex items-center justify-center p-0.5">
                                                    <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-indigo-600"><Icons.Smartphone size={14} /></div>
                                                </div>
                                            </div>
                                            <span className="font-bold text-xs text-slate-900">MisePo Cafe</span>
                                            <Icons.MoreHorizontal size={16} className="ml-auto text-slate-400" />
                                        </div>

                                        {/* Image */}
                                        <div className="aspect-square bg-slate-50 relative flex items-center justify-center overflow-hidden flex-shrink-0">
                                            <div className="text-8xl animate-bounce-slow">🍓</div>
                                            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 text-white text-[10px] rounded-full backdrop-blur-sm font-medium">1/3</div>
                                            <div className="absolute bottom-3 left-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm"><Icons.User size={12} className="text-slate-900" /></div>
                                        </div>

                                        {/* Actions & Caption */}
                                        <div className="p-3 space-y-2 pb-20">
                                            <div className="flex justify-between items-center text-slate-800">
                                                <div className="flex gap-4">
                                                    <Icons.Heart className="text-red-500 fill-red-500 hover:scale-110 transition-transform" size={24} />
                                                    <Icons.MessageCircle size={24} className="-rotate-90" />
                                                    <Icons.Send size={24} />
                                                </div>
                                                <Icons.Bookmark size={24} />
                                            </div>
                                            <p className="font-bold text-xs">1,203 likes</p>
                                            <div className="text-xs space-y-1">
                                                <div className="text-slate-800">
                                                    <span className="font-bold mr-2">MisePo Cafe</span>
                                                    <span className="whitespace-pre-wrap leading-relaxed block mt-1">
                                                        {generatedResult}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 uppercase pt-1">2 hours ago</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Nav */}
                                <div className="h-12 border-t border-gray-100 bg-white flex justify-around items-center px-2 shrink-0 z-20">
                                    <Icons.Home size={24} className="text-slate-900" />
                                    <Icons.Search size={24} className="text-slate-400" />
                                    <div className="w-6 h-6 border-2 border-slate-900 rounded-md flex items-center justify-center"><Icons.PlusSquare size={14} className="text-slate-900" /></div>
                                    <Icons.Film size={24} className="text-slate-400" />
                                    <div className="w-6 h-6 rounded-full bg-slate-200 border border-slate-300" />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT PHONE (Google Maps - Background) */}
                        <div
                            className={`absolute right-[-100px] top-20 w-[260px] h-[520px] transition-all duration-700 ease-in-out
                                ${isPosted ? 'translate-x-[30px] opacity-40 scale-90' : 'translate-x-[100px] opacity-90 rotate-12 delay-100'}
                            `}
                        >
                            <div className="w-full h-full bg-white rounded-[2.5rem] border-4 border-slate-800 shadow-xl overflow-hidden relative flex flex-col font-sans">
                                {/* Maps Header */}
                                <div className="p-3 bg-white shadow-sm z-20">
                                    <div className="bg-white border shadow-sm rounded-full px-3 py-2 flex items-center gap-2 mb-2">
                                        <Icons.ChevronDown size={14} className="text-slate-400 rotate-90" />
                                        <span className="text-xs text-slate-800 font-medium">Restaurants...</span>
                                        <div className="ml-auto w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-bold">M</div>
                                    </div>
                                    <div className="flex gap-4 overflow-x-hidden text-[10px] font-bold text-slate-500 border-b border-gray-100 pb-2">
                                        <span>Overview</span>
                                        <span className="text-green-600 border-b-2 border-green-600 pb-2 -mb-2.5">Updates</span>
                                        <span>Reviews</span>
                                        <span>About</span>
                                    </div>
                                </div>

                                {/* Maps Content (Updates) */}
                                <div className="flex-1 bg-gray-50 p-2 overflow-hidden">
                                    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 mb-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600"><Icons.Smartphone size={14} /></div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-900">MisePo Cafe</div>
                                                <div className="text-[9px] text-slate-500">2 days ago</div>
                                            </div>
                                            <Icons.MoreHorizontal size={14} className="ml-auto text-slate-300" />
                                        </div>
                                        <p className="text-[10px] text-slate-600 leading-relaxed mb-2">
                                            【春限定】とろける幸せ、いちごタルト解禁🍓 サクサクのクッキ... <span className="text-blue-600">More</span>
                                        </p>
                                        <div className="w-full h-24 bg-slate-100 rounded-lg mb-3 overflow-hidden relative">
                                            <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-50">🍓</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="flex-1 py-1.5 border border-slate-200 rounded-full text-[10px] font-bold text-blue-600 flex items-center justify-center gap-1 hover:bg-blue-50">
                                                Call
                                            </button>
                                            <button className="flex-1 py-1.5 border border-slate-200 rounded-full text-[10px] font-bold text-blue-600 flex items-center justify-center gap-1 hover:bg-blue-50">
                                                Share
                                            </button>
                                        </div>
                                    </div>
                                    {/* Partial next card */}
                                    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 opacity-50">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 bg-gray-100 rounded-full" />
                                            <div className="h-3 w-20 bg-gray-100 rounded" />
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 rounded mb-1" />
                                        <div className="h-2 w-2/3 bg-gray-100 rounded" />
                                    </div>
                                </div>

                                {/* Maps Bottom Nav */}
                                <div className="h-12 bg-white border-t border-gray-200 flex justify-between items-center px-4 shrink-0 z-20">
                                    <div className="flex flex-col items-center gap-0.5 text-slate-400">
                                        <Icons.MapPin size={18} />
                                        <span className="text-[8px]">Explore</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-0.5 text-slate-400">
                                        <Icons.Compass size={18} />
                                        <span className="text-[8px]">Go</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-0.5 text-slate-400">
                                        <Icons.Bookmark size={18} />
                                        <span className="text-[8px]">Saved</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-0.5 text-slate-400">
                                        <Icons.PlusCircle size={18} />
                                        <span className="text-[8px]">Contribute</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-0.5 text-green-600 relative">
                                        <Icons.Bell size={18} fill="currentColor" className="text-green-600" />
                                        <span className="text-[8px] font-bold">Updates</span>
                                        <div className="absolute top-0 right-1 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
