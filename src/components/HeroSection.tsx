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
        <div className="relative z-10 h-auto overflow-hidden">
            <div className="absolute inset-0 bg-[#F9F7F2] -z-20" />

            {/* Soft Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#E88BA3]/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#4DB39A]/10 rounded-full blur-[120px] -z-10" />

            <div
                className="relative min-h-screen h-auto md:h-screen w-full flex flex-col md:block pb-32 md:pb-0"
            >
                <div className="max-w-7xl mx-auto w-full h-full relative px-4 flex flex-col md:relative md:block">
                    {/* Mobile Text (Static at top) */}
                    <div className="md:hidden pt-24 px-4 text-center z-20 relative mb-12 shrink-0">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-[#F5CC6D]/30 rounded-full shadow-sm mb-6">
                            <span className="w-2 h-2 rounded-full bg-[#F5CC6D] animate-pulse" />
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">7日間の無料体験実施中</span>
                        </div>
                        <h1 className="text-4xl font-bold text-slate-800 tracking-tight leading-tight mb-6">
                            AIなのに、<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E88BA3] to-[#F5CC6D]">あなたの言葉。</span>
                        </h1>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed px-2 mb-8">
                            丁寧だけどキレイなだけのAIは卒業。<br />
                            MisePoはあなたのお手本から「書き癖」を学習し、<br />
                            店主の『分身』としてSNS運用を代行します。
                        </p>
                        <div className="flex flex-col gap-4 max-w-sm mx-auto mt-2 px-4">
                            <button onClick={() => window.location.href = '/start'} className="w-full px-6 py-4 bg-gradient-to-r from-[#4DB39A] to-[#45a089] text-white font-bold rounded-2xl shadow-lg shadow-[#4DB39A]/30 flex items-center justify-center gap-2 active:scale-95 transition-all">
                                <Icons.Sparkles size={20} className="text-[#F5CC6D]" />
                                <span className="text-lg tracking-widest">無料で試してみる</span>
                            </button>
                        </div>
                    </div>

                    {/* Desktop Text (Absolute) */}
                    <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-4 lg:left-8 z-20 max-w-xl">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-full shadow-sm mb-8">
                            <span className="flex h-2.5 w-2.5 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4DB39A] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4DB39A]"></span>
                            </span>
                            <span className="text-xs font-bold text-slate-500 tracking-wide">SNS運用をAIが丸ごと代行！ 7日間の無料体験実施中</span>
                        </div>
                        <h1 className="text-6xl lg:text-[5.5rem] font-bold text-slate-800 tracking-tighter leading-[1.1] mb-8">
                            AIなのに、<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E88BA3] to-[#F5CC6D]">あなたの言葉。</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10 max-w-lg">
                            丁寧だけどキレイなだけのAIは卒業。MisePoはあなたのお手本から「書き癖」を学習し、想いのこもった文章を30秒で作成。店主の『分身』が、運用を代行します。
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => window.location.href = '/start'} className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-3 active:scale-95">
                                <Icons.Sparkles size={20} className="text-[#F5CC6D]" />
                                無料で試してみる
                            </button>
                            <button onClick={() => window.location.href = '#pricing'} className="px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                                料金プラン
                            </button>
                        </div>
                    </div>

                    {/* Animation Container (Abstract Cards) */}
                    <div className="relative mt-0 md:mt-0 h-[500px] md:h-auto md:absolute md:inset-0 md:left-[50%] lg:left-[50%] flex items-center justify-center pointer-events-none w-full md:w-auto">
                        <div className="relative w-[320px] h-[640px] scale-[0.8] md:scale-[0.8] lg:scale-[0.9] xl:scale-100 origin-center mx-auto">

                            {/* CENTER CARD (MisePo AI) */}
                            <div
                                className={`absolute inset-0 transition-all duration-1000 cubic-bezier(0.25, 1, 0.5, 1) origin-center
                                ${isPosted
                                        ? 'scale-90 -translate-x-[150px] rotate-[-8deg] opacity-40 z-10 blur-[2px]'
                                        : 'scale-100 translate-x-0 rotate-0 opacity-100 z-30 blur-none'
                                    }`}
                            >
                                <div className="w-full h-full bg-white rounded-[48px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] relative overflow-hidden ring-1 ring-black/5">
                                    <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none" />

                                    <div className="w-full h-full relative flex flex-col pt-12">
                                        {/* Abstract Header */}
                                        <div className="px-8 pb-6 flex justify-between items-center">
                                            <div className="p-2 bg-slate-50 rounded-full"><Icons.Menu className="text-slate-400" size={20} /></div>
                                            <div className="w-8 h-8 bg-[#F5CC6D]/20 rounded-full flex items-center justify-center text-[#F5CC6D]"><Icons.Sparkles size={16} fill="currentColor" /></div>
                                        </div>

                                        <div className="px-6 flex-1 flex flex-col justify-center pb-24">
                                            {/* Status Badge */}
                                            <div className={`transition-all duration-500 w-full flex justify-center mb-6 ${effectiveProgress > 100 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                                <div className="bg-slate-800 text-white px-4 py-2 rounded-full shadow-lg font-bold text-xs flex items-center gap-2">
                                                    {effectiveProgress < 3000 && (
                                                        <>
                                                            <span className="w-1.5 h-1.5 bg-[#4DB39A] rounded-full animate-pulse" />
                                                            Thinking...
                                                        </>
                                                    )}
                                                    {effectiveProgress >= 3000 && effectiveProgress < 5000 && (
                                                        <>
                                                            <Icons.Sparkles size={12} className="text-[#F5CC6D] animate-spin" />
                                                            Writing...
                                                        </>
                                                    )}
                                                    {effectiveProgress >= 5000 && (
                                                        <>
                                                            <div className="bg-[#4DB39A] rounded-full p-0.5"><Icons.Check size={8} className="text-white" strokeWidth={3} /></div>
                                                            Done!
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* AI Input/Output Card */}
                                            <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 mb-6 relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 p-12 bg-gradient-to-br from-[#E88BA3]/10 to-transparent rounded-bl-[100px] -z-10 opacity-50 transition-opacity group-hover:opacity-100" />

                                                <div className="flex gap-2 mb-4">
                                                    <span className="px-3 py-1 bg-[#E88BA3]/10 text-[#E88BA3] text-[10px] font-bold rounded-full">Instagram</span>
                                                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full">Casual</span>
                                                </div>

                                                <div className={`space-y-2 transition-all duration-500 ease-in-out min-h-[140px]`} style={{ opacity: textOpacity }}>
                                                    <div className="text-sm text-slate-600 whitespace-pre-wrap font-medium leading-loose">
                                                        {currentText}
                                                        <span className={`${isTypingDone ? 'hidden' : 'inline'} animate-pulse text-[#E88BA3]`}>|</span>
                                                    </div>
                                                </div>

                                                <div className="relative pt-6 mt-2">
                                                    <div className={`w-full py-4 rounded-2xl font-bold text-center text-sm transition-all duration-500 ${isGenerating ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'}`}>
                                                        {isGenerating ? "Generating..." : isResultShown ? "Post to Instagram" : "Generate"}
                                                    </div>

                                                    {effectiveProgress >= 1900 && effectiveProgress <= 2300 && (
                                                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[10%] w-full h-full bg-[#E88BA3]/20 rounded-2xl animate-ping opacity-30 pointer-events-none" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* LEFT CARD (Instagram Result) */}
                            <div
                                className={`absolute inset-0 transition-all duration-1000 cubic-bezier(0.25, 1, 0.5, 1) origin-center
                                ${isPosted
                                        ? 'scale-100 translate-x-0 translate-y-0 rotate-0 z-40'
                                        : 'scale-95 -translate-x-[40px] translate-y-8 rotate-[-4deg] z-20 opacity-0'
                                    }`}
                            >
                                <div className="w-full h-full bg-white rounded-[48px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] relative overflow-hidden ring-1 ring-black/5 flex flex-col">

                                    {/* Success Overlay (Subtle) */}
                                    {isPosted && (
                                        <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
                                            {/* Toast */}
                                            <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/90 backdrop-blur-md text-slate-800 px-6 py-4 rounded-2xl shadow-2xl w-[85%] justify-center border border-white/50 transition-all duration-700 transform ${effectiveProgress > 6800 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                                                <div className="w-6 h-6 bg-[#4DB39A] rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-[#4DB39A]/30">
                                                    <Icons.Check size={12} className="text-white" strokeWidth={3} />
                                                </div>
                                                <p className="font-bold text-sm">Successfully Posted!</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Header */}
                                    <div className="px-6 py-5 flex items-center justify-between z-10 bg-white/80 backdrop-blur-md sticky top-0 shrink-0">
                                        <div className="font-bold text-lg text-slate-800">Instagram</div>
                                        <div className="flex gap-4 text-slate-400">
                                            <Icons.Heart size={24} />
                                            <Icons.MessageCircle size={24} />
                                        </div>
                                    </div>

                                    {/* Content Scroll Area */}
                                    <div className="flex-1 overflow-hidden relative bg-white">
                                        {/* Skeleton Overlay */}
                                        <div className={`absolute inset-0 bg-white z-20 transition-opacity duration-500 flex flex-col ${isPosted ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                            <div className="p-6 space-y-6 flex-1">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-full animate-pulse" />
                                                    <div className="w-32 h-4 bg-slate-100 rounded-full animate-pulse" />
                                                </div>
                                                <div className="w-full aspect-square bg-slate-50 rounded-[32px] animate-pulse" />
                                            </div>
                                        </div>

                                        {/* Real Content */}
                                        <div className="flex flex-col bg-white transition-transform duration-[2850ms] ease-out pt-2" style={isPosted ? innerContentStyle : {}}>
                                            {/* Post Header */}
                                            <div className="px-6 py-2 flex items-center gap-3 mb-2">
                                                <div className="p-[2px] bg-gradient-to-tr from-[#E88BA3] to-[#F5CC6D] rounded-full">
                                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-0.5">
                                                        <Icons.Smartphone size={14} className="text-slate-300" />
                                                    </div>
                                                </div>
                                                <span className="font-bold text-xs text-slate-700">MisePo Cafe</span>
                                                <Icons.MoreHorizontal size={16} className="ml-auto text-slate-300" />
                                            </div>

                                            {/* Image Card */}
                                            <div className="mx-4 aspect-square bg-slate-50 rounded-[32px] relative flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
                                                <div className="text-[80px] drop-shadow-2xl grayscale-[0.2]">🍓</div>
                                                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-md text-white/90 text-[10px] font-bold rounded-full">1/3</div>
                                            </div>

                                            {/* Actions & Caption */}
                                            <div className="p-6 space-y-4 pb-24">
                                                <div className="flex justify-between items-center text-slate-700">
                                                    <div className="flex gap-5">
                                                        <Icons.Heart className="text-[#E88BA3] fill-[#E88BA3]" size={26} />
                                                        <Icons.MessageCircle size={26} />
                                                        <Icons.Send size={26} />
                                                    </div>
                                                    <Icons.Bookmark size={26} />
                                                </div>
                                                <p className="font-bold text-xs text-slate-800">1,203 likes</p>
                                                <div className="text-xs space-y-2">
                                                    <div className="text-slate-600 font-medium leading-relaxed">
                                                        <span className="font-bold mr-2 text-slate-900">MisePo Cafe</span>
                                                        <span className="whitespace-pre-wrap block mt-2 text-slate-500">
                                                            {generatedResult}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Nav */}
                                    <div className="h-16 bg-white/90 backdrop-blur-xl border-t border-slate-100 flex justify-around items-center px-4 shrink-0 z-20 rounded-b-[48px]">
                                        <Icons.Home size={24} className="text-slate-800" />
                                        <Icons.Search size={24} className="text-slate-300" />
                                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/20"><Icons.PlusSquare size={18} className="text-white" /></div>
                                        <Icons.Film size={24} className="text-slate-300" />
                                        <div className="w-6 h-6 rounded-full bg-slate-200" />
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT CARD (Google Maps - Background) */}
                            <div
                                className={`absolute right-[-80px] top-32 w-[280px] h-[540px] transition-all duration-1000 ease-in-out
                                ${isPosted ? 'translate-x-[40px] opacity-60 scale-95 blur-[1px]' : 'translate-x-[120px] opacity-100 rotate-[6deg]'}
                            `}
                            >
                                <div className="w-full h-full bg-white rounded-[40px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] relative flex flex-col overflow-hidden ring-1 ring-black/5 opacity-80 backdrop-blur-sm">
                                    {/* Maps Header */}
                                    <div className="p-5 bg-white border-b border-slate-50 z-20">
                                        <div className="bg-slate-50 rounded-full px-4 py-2 flex items-center gap-2 mb-4">
                                            <Icons.Search size={14} className="text-slate-400" />
                                            <span className="text-[10px] text-slate-400 font-bold">Restaurants near me</span>
                                        </div>
                                    </div>

                                    {/* Maps Content (Cards) */}
                                    <div className="flex-1 bg-slate-50/50 p-4 space-y-4">
                                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 bg-[#F5CC6D]/20 rounded-full flex items-center justify-center text-[#F5CC6D]"><Icons.MapPin size={14} fill="currentColor" /></div>
                                                <div>
                                                    <div className="text-xs font-bold text-slate-700">MisePo Cafe</div>
                                                    <div className="text-[9px] text-slate-400 font-medium">4.8 ★★★★★ (120)</div>
                                                </div>
                                            </div>
                                            <div className="w-full h-20 bg-slate-100 rounded-xl mb-3 overflow-hidden relative">
                                                <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-50">🍓</div>
                                            </div>
                                        </div>
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
