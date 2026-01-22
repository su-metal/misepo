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
                className="relative h-[110vh] md:h-screen w-full overflow-hidden flex flex-col bg-[#fceee3]"
            >

                {/* Mobile Text (Static at top) */}
                <div className="md:hidden pt-24 px-4 text-center z-20 relative mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F2C94C] border-[3px] border-black rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
                        <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                        <span className="text-xs font-black text-black uppercase">限定モニター価格</span>
                    </div>
                    <h1 className="text-4xl font-black text-black tracking-tighter leading-[1.0] mb-4">
                        AIなのに、<br />
                        <span className="gradient-text">私の言葉。</span>
                    </h1>
                    <p className="text-base text-black font-bold leading-relaxed px-2 mb-6">
                        丁寧すぎて恥ずかしいAIは卒業。MisePoはあなたの「書き癖」を学習し、店主の『分身』としてSNS運用を代行します。
                    </p>
                    <div className="flex flex-col gap-4 max-w-sm mx-auto mt-4 px-4">
                        <button onClick={() => window.location.href = '/start'} className="neo-brutalism-button w-full px-6 py-4 bg-[#4DB39A] text-white font-black hover:bg-black transition-all flex items-center justify-center gap-2">
                            <Icons.Sparkles size={18} className="text-[#F5CC6D]" />
                            無料で試してみる
                        </button>
                        <button onClick={() => window.location.href = '#pricing'} className="neo-brutalism-button w-full px-6 py-4 bg-white text-black font-black hover:bg-[#F5CC6D] transition-all">
                            料金プラン
                        </button>
                    </div>
                </div>

                {/* Desktop Text (Absolute) */}
                <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-8 lg:left-16 xl:left-24 z-20 max-w-xl">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#F2C94C] border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full bg-black opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-black"></span>
                        </span>
                        <span className="text-sm font-black text-black">【限定100店舗】 先行モニター価格 月額1,480円</span>
                    </div>
                    <h1 className="text-6xl lg:text-[5.5rem] font-black text-black tracking-tighter leading-[1.0] mb-8">
                        AIなのに、<br />
                        <span className="gradient-text">私の言葉。</span>
                    </h1>
                    <p className="text-xl text-black font-bold leading-relaxed mb-10 max-w-lg">
                        丁寧すぎて恥ずかしいAIは卒業。MisePoはあなたの「書き癖」を学習し、常連さんが読んでも違和感のない文章を30秒で作成。店主の『分身』が、運用を代行します。
                    </p>
                    <div className="flex gap-4">
                        <button onClick={() => window.location.href = '/start'} className="neo-brutalism-button px-8 py-5 bg-[#4DB39A] text-white font-black hover:bg-black transition-all flex items-center gap-2">
                            <Icons.Sparkles size={20} className="text-[#F5CC6D]" />
                            無料で試してみる
                        </button>
                        <button onClick={() => window.location.href = '#pricing'} className="neo-brutalism-button px-8 py-5 bg-white text-black font-black hover:bg-[#F5CC6D] transition-all">
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
                                <div className="bg-black text-white px-4 py-2 border-[3px] border-white rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-sm flex items-center gap-2">
                                    {effectiveProgress < 3000 && (
                                        <>
                                            <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
                                            1. メモを入力中...
                                        </>
                                    )}
                                    {effectiveProgress >= 3000 && effectiveProgress < 5000 && (
                                        <>
                                            <Icons.Sparkles size={14} className="text-[#F2C94C] animate-spin" />
                                            2. AIが文章を生成中...
                                        </>
                                    )}
                                    {effectiveProgress >= 5000 && (
                                        <>
                                            <div className="bg-[#27AE60] border-[1px] border-white rounded-2xl p-0.5"><Icons.Check size={10} className="text-white" strokeWidth={4} /></div>
                                            3. 文章が完成！
                                        </>
                                    )}
                                </div>
                                {/* Arrow */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 text-slate-900/90 -mt-1">
                                    <svg width="12" height="6" viewBox="0 0 12 6" fill="currentColor"><path d="M6 6L0 0H12L6 6Z" /></svg>
                                </div>
                            </div>

                            <div className="w-full h-full bg-white border-[6px] border-black rounded-2xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black z-40" />
                                <div className="w-full h-full bg-[#f8f8f8] relative flex flex-col pt-10">
                                    <div className="px-4 pb-4 border-b-[3px] border-black flex justify-between items-center bg-white">
                                        <div className="p-2"><Icons.Menu className="text-black" size={20} /></div>
                                        <span className="font-black text-black uppercase tracking-tight">MisePo</span>
                                        <div className="w-8 h-8 bg-[#F2C94C] border-[3px] border-black rounded-2xl flex items-center justify-center"><Icons.Sparkles size={16} fill="currentColor" /></div>
                                    </div>
                                    <div className="p-4 flex-1">
                                        <div className="bg-white border-[3px] border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4 space-y-3">
                                            <div className="flex gap-2">
                                                <span className="px-2 py-1 bg-[#E93E7E] text-white text-[10px] font-black border-[2px] border-black rounded-2xl">Instagram</span>
                                                <span className="px-2 py-1 bg-white text-black text-[10px] font-black border-[2px] border-black rounded-2xl">Casual</span>
                                            </div>
                                            <div className={`space-y-2 transition-all duration-500 ease-in-out ${isGenerating ? 'animate-pulse' : ''}`} style={{ opacity: textOpacity }}>
                                                <div className="text-sm text-black min-h-[60px] whitespace-pre-wrap font-bold leading-relaxed">
                                                    {currentText}
                                                    <span className={`${isTypingDone ? 'hidden' : 'inline'} animate-pulse text-[#E93E7E]`}>_</span>
                                                </div>
                                            </div>

                                            <div className="relative pt-2">
                                                <div className={`border-[3px] border-black rounded-2xl py-4 font-black text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ${isGenerating ? 'bg-[#F2C94C] translate-x-[2px] translate-y-[2px] shadow-none' : 'bg-[#E93E7E] text-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'}`}>
                                                    {isGenerating ? "生成中..." : isResultShown ? "投稿する" : "生成する"}
                                                </div>
                                                {effectiveProgress >= 1900 && effectiveProgress <= 2300 && (
                                                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-black/10 border-[2px] border-black rounded-2xl animate-ping pointer-events-none" />
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
                                        {/* Large Confetti stickers (Brutalism Style) */}
                                        <div className="absolute inset-0">
                                            <div className="absolute top-[10%] left-[10%] w-8 h-8 bg-[#F2C94C] border-[2px] border-black rounded-2xl rotate-12 animate-fall" />
                                            <div className="absolute top-[20%] right-[10%] w-6 h-6 bg-[#E93E7E] border-[2px] border-black rounded-2xl -rotate-12 animate-fall" />
                                            <div className="absolute bottom-[20%] left-[15%] w-10 h-10 bg-[#08A092] border-[2px] border-black rounded-2xl rotate-45 animate-fall" />
                                        </div>

                                        {/* Success Toast (Bottom) - Only show after scroll finishes (>6800) */}
                                        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black text-white px-5 py-4 border-[3px] border-white rounded-2xl shadow-xl w-[90%] justify-center transition-all duration-500 transform ${effectiveProgress > 6800 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                            <div className="w-6 h-6 bg-[#27AE60] border-[1px] border-white rounded-2xl flex items-center justify-center shrink-0">
                                                <Icons.Check size={14} strokeWidth={4} />
                                            </div>
                                            <p className="font-black text-sm uppercase">Success!</p>
                                        </div>
                                    </div>
                                )}

                                {/* Header */}
                                <div className="px-4 py-3 flex items-center justify-between border-b-[3px] border-black z-10 bg-white sticky top-0 shrink-0">
                                    <div className="font-black text-lg uppercase italic underline decoration-[3px] decoration-[#E93E7E]">Instagram</div>
                                    <div className="flex gap-4">
                                        <Icons.Heart size={22} className="text-black" />
                                        <Icons.MessageCircle size={22} className="text-black" />
                                    </div>
                                </div>

                                {/* Content Scroll Area */}
                                <div className="flex-1 overflow-hidden relative bg-white">
                                    {/* Skeleton Overlay for Waiting State */}
                                    <div className={`absolute inset-0 bg-[#f8f8f8] z-20 transition-opacity duration-500 flex flex-col ${isPosted ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                        <div className="p-4 space-y-4 flex-1">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-white border-[2px] border-black rounded-2xl animate-pulse" />
                                                <div className="w-24 h-3 bg-black/10 animate-pulse" />
                                            </div>
                                            <div className="w-full aspect-square bg-black/5 border-[3px] border-black rounded-2xl animate-pulse" />
                                        </div>
                                    </div>

                                    {/* Real Content */}
                                    <div className="flex flex-col bg-white transition-transform duration-[2850ms] ease-out" style={isPosted ? innerContentStyle : {}}>
                                        {/* Story/User Header */}
                                        <div className="px-3 py-2 flex items-center gap-2">
                                            <div className="border-[2px] border-black rounded-2xl p-[2px] bg-[#F2C94C]">
                                                <div className="w-8 h-8 bg-white border-[1px] border-black rounded-2xl flex items-center justify-center">
                                                    <Icons.Smartphone size={14} className="text-black" />
                                                </div>
                                            </div>
                                            <span className="font-black text-xs text-black uppercase">MisePo Cafe</span>
                                            <Icons.MoreHorizontal size={16} className="ml-auto text-black" />
                                        </div>

                                        {/* Image */}
                                        <div className="aspect-square bg-[#f8f8f8] border-y-[3px] border-black relative flex items-center justify-center overflow-hidden flex-shrink-0">
                                            <div className="text-8xl filter grayscale invert">🍓</div>
                                            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black text-white text-[10px] font-black">1/3</div>
                                        </div>

                                        {/* Actions & Caption */}
                                        <div className="p-3 space-y-3 pb-20">
                                            <div className="flex justify-between items-center text-black">
                                                <div className="flex gap-4">
                                                    <Icons.Heart className="text-[#E93E7E] fill-[#E93E7E]" size={24} />
                                                    <Icons.MessageCircle size={24} />
                                                    <Icons.Send size={24} />
                                                </div>
                                                <Icons.Bookmark size={24} />
                                            </div>
                                            <p className="font-black text-xs underline">1,203 likes</p>
                                            <div className="text-xs space-y-2">
                                                <div className="text-black font-bold leading-relaxed">
                                                    <span className="font-black mr-2 bg-[#F2C94C] px-1 uppercase">MisePo Cafe</span>
                                                    <span className="whitespace-pre-wrap block mt-2 px-1 border-l-[3px] border-[#E93E7E]">
                                                        {generatedResult}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Nav */}
                                <div className="h-12 border-t-[3px] border-black bg-white flex justify-around items-center px-2 shrink-0 z-20">
                                    <Icons.Home size={24} className="text-black" />
                                    <Icons.Search size={24} className="text-black" />
                                    <div className="w-8 h-8 bg-black flex items-center justify-center"><Icons.PlusSquare size={16} className="text-white" /></div>
                                    <Icons.Film size={24} className="text-black" />
                                    <div className="w-7 h-7 bg-[#F2C94C] border-[2px] border-black rounded-2xl" />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT PHONE (Google Maps - Background) */}
                        <div
                            className={`absolute right-[-100px] top-20 w-[260px] h-[520px] transition-all duration-700 ease-in-out
                                ${isPosted ? 'translate-x-[30px] opacity-40 scale-90' : 'translate-x-[100px] opacity-90 rotate-12 delay-100'}
                            `}
                        >
                            <div className="w-full h-full bg-white border-[6px] border-black rounded-2xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative flex flex-col font-black overflow-hidden">
                                {/* Maps Header */}
                                <div className="p-3 bg-white border-b-[3px] border-black shadow-sm z-20">
                                    <div className="bg-white border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-3 py-2 flex items-center gap-2 mb-3">
                                        <Icons.ChevronDown size={14} className="text-black rotate-90" />
                                        <span className="text-[10px] text-black font-black uppercase">Restaurants near me</span>
                                        <div className="ml-auto w-6 h-6 bg-[#845EF7] border-[2px] border-black rounded-2xl text-white flex items-center justify-center text-[10px] font-black">M</div>
                                    </div>
                                    <div className="flex gap-4 overflow-x-hidden text-[10px] font-black text-black pb-2">
                                        <span className="opacity-40">OVERVIEW</span>
                                        <span className="text-[#08A092] border-b-[3px] border-[#08A092] pb-1 -mb-3">UPDATES</span>
                                        <span className="opacity-40">REVIEWS</span>
                                    </div>
                                </div>

                                {/* Maps Content (Updates) */}
                                <div className="flex-1 bg-[#f8f8f8] p-3 overflow-hidden">
                                    <div className="bg-white border-[3px] border-black rounded-2xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 bg-[#F2C94C] border-[2px] border-black rounded-2xl flex items-center justify-center text-black"><Icons.Smartphone size={14} /></div>
                                            <div>
                                                <div className="text-[10px] font-black text-black">MisePo Cafe</div>
                                                <div className="text-[8px] text-black/60 font-black uppercase">2 days ago</div>
                                            </div>
                                            <Icons.MoreHorizontal size={14} className="ml-auto text-black" />
                                        </div>
                                        <p className="text-[10px] text-black font-black leading-relaxed mb-3 line-clamp-2">
                                            【春限定】とろける幸せ、いちごタルト解禁🍓 サクサクのクッキ... <span className="text-[#E93E7E] underline decoration-2">More</span>
                                        </p>
                                        <div className="w-full h-24 bg-white border-[2px] border-black rounded-2xl mb-3 overflow-hidden relative">
                                            <div className="absolute inset-0 flex items-center justify-center text-4xl grayscale grayscale-100 invert">🍓</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="flex-1 py-1.5 border-[2px] border-black rounded-2xl bg-white font-black text-[9px] uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none">
                                                Call
                                            </button>
                                            <button className="flex-1 py-1.5 border-[2px] border-black rounded-2xl bg-[#F2C94C] font-black text-[9px] uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none">
                                                Share
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Maps Bottom Nav */}
                                <div className="h-12 bg-white border-t-[3px] border-black flex justify-between items-center px-4 shrink-0 z-20">
                                    {['Explore', 'Go', 'Saved', 'Updates'].map((item, idx) => (
                                        <div key={item} className={`flex flex-col items-center gap-1 ${idx === 3 ? 'text-[#08A092]' : 'text-black opacity-30'}`}>
                                            <div className="w-5 h-5 flex items-center justify-center">
                                                {idx === 0 && <Icons.MapPin size={18} />}
                                                {idx === 1 && <Icons.Compass size={18} />}
                                                {idx === 2 && <Icons.Bookmark size={18} />}
                                                {idx === 3 && <Icons.Bell size={18} fill="currentColor" />}
                                            </div>
                                            <span className="text-[7px] font-black uppercase tracking-tighter">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
