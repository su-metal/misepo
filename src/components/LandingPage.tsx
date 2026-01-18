"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Custom SVG Icons
const Icons = {
    Menu: ({ className = "" }: { className?: string }) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
    ),
    X: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    ),
    Smartphone: ({ size = 20, className = "" }: { size?: number; className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
    ),
    CheckCircle: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    ),
    Star: ({ size = 20, fill = "none", className = "" }: { size?: number; fill?: string; className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" className={className}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    ),
    Heart: ({ size = 24, className = "", fill = "none" }: { size?: number; className?: string; fill?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
    ),
    MessageCircle: ({ size = 24, className = "" }: { size?: number; className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
        </svg>
    ),
    Send: ({ size = 24, className = "" }: { size?: number; className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
    ),
    Sparkles: ({ size = 20, fill = "none", className = "" }: { size?: number; fill?: string; className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" className={className}>
            <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
        </svg>
    ),
    Clock: ({ size = 18, className = "" }: { size?: number; className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
    ),
    HelpCircle: ({ size = 24, className = "" }: { size?: number; className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    ),
    BatteryWarning: ({ className = "" }: { className?: string }) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <rect x="2" y="7" width="16" height="10" rx="2" /><line x1="22" y1="11" x2="22" y2="13" /><line x1="10" y1="10" x2="10" y2="14" /><line x1="10" y1="17" x2="10.01" y2="17" />
        </svg>
    ),
    TrendingDown: ({ className = "" }: { className?: string }) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" />
        </svg>
    ),
    Instagram: ({ size = 24 }: { size?: number }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
    ),
    MapPin: ({ size = 24 }: { size?: number }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
        </svg>
    ),
    Twitter: ({ size = 24 }: { size?: number }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    ),
    Zap: ({ size = 12, fill = "none", className = "" }: { size?: number; fill?: string; className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" className={className}>
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    ),

    Bookmark: ({ size = 22, className = "" }: { size?: number; className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
        </svg>
    ),
    MoreHorizontal: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
        </svg>
    ),
    Check: ({ size = 14, strokeWidth = 3 }: { size?: number; strokeWidth?: number }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
            <polyline points="20 6 9 17 4 12" />
        </svg>
    ),
    ChevronDown: ({ size = 20, className = "" }: { size?: number; className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <polyline points="6 9 12 15 18 9" />
        </svg>
    ),
    ChevronUp: ({ size = 20, className = "" }: { size?: number; className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <polyline points="18 15 12 9 6 15" />
        </svg>
    ),
    ShieldCheck: ({ size = 18 }: { size?: number }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" />
        </svg>
    ),
    PlusSquare: ({ size = 20, className = "" }: { size?: number; className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
        </svg>
    ),
    Share: ({ size = 8 }: { size?: number }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
        </svg>
    ),
    Maximize2: ({ size = 24, className = "" }: { size?: number; className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
        </svg>
    ),
};

const CountUp = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
    const [count, setCount] = useState(0);
    const nodeRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    let startTime: number;
                    let animationFrame: number;

                    const animate = (timestamp: number) => {
                        if (!startTime) startTime = timestamp;
                        const progress = timestamp - startTime;
                        const percentage = Math.min(progress / duration, 1);

                        // Ease out quart
                        const easeOut = 1 - Math.pow(1 - percentage, 4);

                        setCount(Math.floor(end * easeOut));

                        if (progress < duration) {
                            animationFrame = requestAnimationFrame(animate);
                        } else {
                            setCount(end);
                        }
                    };

                    animationFrame = requestAnimationFrame(animate);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (nodeRef.current) {
            observer.observe(nodeRef.current);
        }

        return () => observer.disconnect();
    }, [end, duration]);

    return <span ref={nodeRef}>{count}</span>;
}

export default function LandingPage() {
    const { loginWithGoogle } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [heroAnimationProgress, setHeroAnimationProgress] = useState(0);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            setScrolled(currentScroll > 20);

            // Sticky Hero Animation Logic
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                const scrolled = -rect.top;
                const totalScrollable = rect.height - window.innerHeight;

                if (totalScrollable > 0) {
                    const progressPct = Math.min(Math.max(scrolled / totalScrollable, 0), 1);
                    // Map 0-100% to 0-1600 range for super extended timeline (Scroll within phone)
                    setHeroAnimationProgress(progressPct * 1600);
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Animation States derived from progress
    // Animation States
    const typingTextFull = "【春限定】とろける幸せ、いちごタルト解禁🍓\n\nサクサクのクッキー生地と、\n溢れんばかりの完熟いちご。\n一口食べれば、そこはもう春。\n\n完熟いちごの甘さと、\n自家製カスタードのハーモニーを\nぜひお楽しみください。\n\n📍Access: 渋谷駅 徒歩5分\n🕒Open: 10:00 - 20:00\n📞Reserve: 03-1234-5678\n\n#MisePoカフェ #春スイーツ #いちごタルト #渋谷カフェ #期間限定";

    // Typing Phase (0 - 350)
    const typingProgress = Math.min(Math.max(heroAnimationProgress / 350, 0), 1);
    const currentTypingText = typingTextFull.slice(0, Math.floor(typingTextFull.length * typingProgress));

    // Generation Phase (350 - 500)
    const isTypingDone = heroAnimationProgress > 350;
    const isGenerating = heroAnimationProgress > 400 && heroAnimationProgress < 550;

    // Post/Swap Phase (Trigger at 550)
    // Simple boolean state for the swap. No complex progress calculation.
    const isPosted = heroAnimationProgress > 550;
    // Internal Scroll (After post, scroll the instagram content)
    const internalScrollProgress = Math.min(Math.max((heroAnimationProgress - 600) / 400, 0), 1);

    const innerContentStyle = {
        transform: `translateY(-${internalScrollProgress * 180}px)`,
    };

    const problems = [
        { icon: <Icons.HelpCircle className="text-orange-500" />, bg: "bg-orange-50", title: "何を書けばいいかわからない", desc: "「今日のランチ」以外に書くことがない。魅力的な文章表現や、流行りのハッシュタグがわからない。" },
        { icon: <Icons.Clock size={24} className="text-rose-500" />, bg: "bg-rose-50", title: "時間が足りない", desc: "営業終了後は疲れ果てて、SNS投稿を作る気力がない。結局「明日やろう」と先延ばしにしてしまう。" },
        { icon: <Icons.BatteryWarning className="text-amber-500" />, bg: "bg-amber-50", title: "アプリの切り替えが面倒", desc: "インスタを開いて、Xを開いて、Googleマップを開いて...。それぞれのアプリを行き来するだけで一苦労。" },
        { icon: <Icons.TrendingDown className="text-slate-500" />, bg: "bg-slate-100", title: "外注コストが高い", desc: "MEO対策やSNS運用代行に見積もりをとったら月額3万円〜。個人店には負担が大きすぎる。" },
    ];

    const faqs = [
        { q: "どのような業種で利用されていますか？", a: "カフェ、美容室、居酒屋、整体院、歯科医院など、地域密着型の店舗ビジネス全般でご利用いただいております。" },
        { q: "パソコンが苦手ですが使えますか？", a: "はい、スマートフォンだけで完結します。LINEでメッセージを送るような感覚で操作できます。" },
        { q: "MEO対策の効果はすぐに出ますか？", a: "継続的な投稿と口コミへの返信が重要です。MisePoを使えば作業頻度を高められるため、通常より早く効果が期待できます。" },
        { q: "生成された文章はそのまま使っても大丈夫ですか？", a: "はい、そのまま投稿可能です。ただし、店主様ご自身の言葉を少し加えると、より温かみのある投稿になります。" },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm py-2' : 'bg-transparent py-4'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                            <div className="bg-gradient-to-br from-indigo-600 to-pink-500 p-1.5 rounded-lg text-white shadow-md">
                                <Icons.Smartphone size={20} />
                            </div>
                            <span className="font-black text-xl tracking-tight text-slate-800">MisePo</span>
                        </div>
                        <nav className="hidden md:flex items-center space-x-8">
                            {['お悩み', '機能', 'デモ', '料金', 'FAQ'].map((item, i) => (
                                <a key={item} href={['#problem', '#features', '#demo', '#pricing', '#faq'][i]} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors relative group">
                                    {item}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full opacity-50" />
                                </a>
                            ))}
                        </nav>
                        <div className="hidden md:flex items-center space-x-3">
                            <button onClick={() => loginWithGoogle('login')} className="text-slate-600 font-bold hover:text-indigo-600 px-4 py-2 text-sm transition-colors">ログイン</button>
                            <button onClick={() => loginWithGoogle('trial')} className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-300">無料で始める</button>
                        </div>
                        <div className="md:hidden flex items-center">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 hover:text-slate-900 focus:outline-none p-2" aria-label="メニューを開く">
                                {isMenuOpen ? <Icons.X /> : <Icons.Menu />}
                            </button>
                        </div>
                    </div>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xl animate-fade-in">
                        <div className="px-4 py-6 space-y-3">
                            {['お悩み', '機能', 'デモ', '料金'].map((item, i) => (
                                <a key={item} href={['#problem', '#features', '#demo', '#pricing'][i]} className="block px-4 py-3 text-base font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors" onClick={() => setIsMenuOpen(false)}>{item}</a>
                            ))}
                            <div className="pt-4 flex flex-col gap-3 px-4">
                                <button className="w-full bg-indigo-50 text-indigo-700 px-5 py-3.5 rounded-xl font-bold hover:bg-indigo-100 transition-colors">ログイン</button>
                                <button onClick={() => loginWithGoogle('trial')} className="w-full bg-indigo-600 text-white px-5 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200">無料で始める</button>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* New Sticky Hero Animation */}
            <div ref={heroRef} className="relative z-10 h-[500vh]">
                <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50" />

                    {/* Mobile Text (Static at top) */}
                    <div className="md:hidden pt-24 px-4 text-center z-20 relative">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-sm mb-4">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-xs font-bold text-indigo-900">総生成数 10,000件突破</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-[1.1] mb-3">
                            店舗の広報は、<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">AIに丸投げする時</span>代。
                        </h1>
                    </div>

                    {/* Desktop Text (Absolute) */}
                    <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-12 lg:left-24 z-20 max-w-xl pointer-events-none">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-sm mb-8">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-sm font-bold text-indigo-900">総生成数 10,000件突破</span>
                        </div>
                        <h1 className="text-6xl lg:text-[5.5rem] font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
                            店舗の広報は、<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">AIに丸投げする時</span>代。
                        </h1>
                        <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-lg">
                            Googleマップの口コミ返信も、Instagramの投稿文も。<br />
                            MisePo（ミセポ）なら、たった5秒で「来店したくなる」文章が完成します。
                        </p>
                        <div className="flex gap-4 pointer-events-auto">
                            <button className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all hover:scale-105 shadow-xl shadow-slate-900/20 flex items-center gap-2">
                                <Icons.Sparkles size={20} className="text-yellow-400" />
                                無料で試してみる
                            </button>
                            <button className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all">
                                料金プラン
                            </button>
                        </div>
                    </div>

                    {/* Phone Animation Container */}
                    <div className="absolute inset-0 md:left-1/3 flex items-center justify-center pointer-events-none">
                        <div className="relative w-[300px] h-[600px] scale-90 md:scale-100 origin-center">

                            {/* CENTER PHONE (MisePo) */}
                            <div
                                className={`absolute inset-0 transition-all duration-700 ease-in-out origin-center
                                    ${isPosted
                                        ? 'scale-90 -translate-x-[40vw] md:-translate-x-[200px] -rotate-12 opacity-60 z-10 blur-[1px]'
                                        : 'scale-100 translate-x-0 rotate-0 opacity-100 z-30 blur-none'
                                    }`}
                            >
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
                                                <div className={`space-y-2 transition-opacity duration-500 ${isGenerating ? 'opacity-50 pulse' : 'opacity-100'}`}>
                                                    <div className="text-sm text-slate-700 min-h-[60px] whitespace-pre-wrap font-medium">
                                                        {currentTypingText}
                                                        <span className={`${isTypingDone ? 'hidden' : 'inline'} animate-pulse text-indigo-500`}>|</span>
                                                    </div>
                                                </div>
                                                <div className={`bg-indigo-600 text-white rounded-xl py-3 font-bold text-center shadow-lg shadow-indigo-200 transition-all duration-300 ${isGenerating ? 'scale-95 bg-indigo-500' : ''}`}>
                                                    {isGenerating ? (
                                                        <span className="flex items-center justify-center gap-2">
                                                            <Icons.Sparkles size={16} className="animate-spin" /> 生成中...
                                                        </span>
                                                    ) : isPosted ? (
                                                        "投稿完了！"
                                                    ) : (
                                                        "生成する"
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* LEFT PHONE (Instagram) */}
                            <div
                                className={`absolute inset-0 w-[280px] h-[560px] top-4 left-2 transition-all duration-700 ease-in-out origin-center
                                    ${isPosted
                                        ? 'scale-105 translate-x-2 -translate-y-4 rotate-0 z-40'
                                        : 'scale-90 -translate-x-[42vw] md:-translate-x-[240px] translate-y-8 -rotate-12 z-20'
                                    }`}
                            >
                                <div className="w-full h-full bg-slate-800 rounded-[2.5rem] border-4 border-slate-800 shadow-xl overflow-hidden relative">
                                    <div className="w-full h-full bg-white relative">
                                        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 h-1.5 w-full absolute top-0 z-10" />
                                        <div className="flex flex-col h-full bg-white transition-transform duration-[2000ms] ease-out" style={isPosted ? innerContentStyle : {}}>
                                            <div className="px-4 py-4 flex items-center gap-2 border-b border-slate-100 flex-shrink-0 bg-white z-10 sticky top-0">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><Icons.Smartphone size={16} /></div>
                                                <span className="font-bold text-xs text-slate-900">MisePo Cafe</span>
                                                <span className="text-[10px] text-slate-400 ml-auto">Just now</span>
                                            </div>
                                            <div className="aspect-square bg-slate-50 relative flex items-center justify-center overflow-hidden flex-shrink-0">
                                                <div className="text-8xl animate-bounce-slow">🍓</div>
                                                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 text-white text-[10px] rounded backdrop-blur-sm">1/3</div>
                                            </div>
                                            <div className="p-4 space-y-3 pb-20">
                                                <div className="flex justify-between items-center text-slate-800">
                                                    <div className="flex gap-4">
                                                        <Icons.Heart className="text-red-500 fill-red-500" size={20} />
                                                        <Icons.MessageCircle size={20} />
                                                        <Icons.Send size={20} />
                                                    </div>
                                                    <Icons.Maximize2 size={20} />
                                                </div>
                                                <p className="font-bold text-xs">1,203 likes</p>
                                                <div className="text-xs space-y-1">
                                                    <p><span className="font-bold">MisePo Cafe</span> 【春限定】とろける幸せ、いちごタルト解禁🍓</p>
                                                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                                        サクサクのクッキー生地と、溢れんばかりの完熟いちご。一口食べれば、そこはもう春。
                                                        {'\n\n'}
                                                        完熟いちごの甘さと、自家製カスタードのハーモニーをぜひお楽しみください。
                                                        {'\n\n'}
                                                        📍Access: 渋谷駅 徒歩5分
                                                    </p>
                                                    <p className="text-indigo-600">#MisePoカフェ #春スイーツ #いちごタルト</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT PHONE (Maps - Background) */}
                            <div
                                className={`absolute right-[-100px] top-20 w-[260px] h-[520px] transition-all duration-700 ease-in-out
                                    ${isPosted ? 'translate-x-[30px] opacity-40 scale-90' : 'translate-x-[100px] opacity-80 rotate-12 delay-100'}
                                `}
                            >
                                <div className="w-full h-full bg-slate-800 rounded-[2.5rem] border-4 border-slate-800 shadow-xl opacity-60 overflow-hidden relative">
                                    <div className="w-full h-full bg-white opacity-80">
                                        <div className="h-32 bg-slate-100 relative mb-8" />
                                        <div className="px-4 space-y-2">
                                            <div className="h-4 w-20 bg-slate-200 rounded" />
                                            <div className="h-2 w-full bg-slate-100 rounded" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Problem */}
            < section id="problem" className="py-24 bg-white" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
                        <div>
                            <span className="text-indigo-600 font-bold tracking-wider text-sm uppercase mb-2 block">Problem</span>
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-6">
                                「何を投稿すればいい？」<br />
                                <span className="text-slate-400">毎日のその悩み、もう終わり。</span>
                            </h2>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                映える写真、刺さる文章、流行りのハッシュタグ。<br />
                                変化の激しいトレンドを追いかけ、正解のない投稿を作り続けるのは大変です。<br />
                                そんなオーナー様の悩みを、MisePoは技術で解決します。
                            </p>
                        </div>
                        <div className="hidden lg:block">
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {problems.map((prob, index) => (
                            <div key={index} className="group relative bg-white rounded-2xl p-8 border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1">
                                <div className={`w-12 h-12 rounded-xl ${prob.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>{prob.icon}</div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3">{prob.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed mb-6">{prob.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Market Data (Why Now?) */}
            < section className="py-24 bg-slate-900 text-white overflow-hidden relative" >
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px]" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <span className="text-indigo-400 font-bold tracking-wider text-sm uppercase mb-3 block">Why MisePo?</span>
                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                            集客の<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">『黄金ルート』</span>を<br className="md:hidden" />逃していませんか？
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                            現代の消費者は、Instagramで「発見」し、Googleマップで「決定」します。<br />
                            この2つのプラットフォームを同時に攻略することが、繁盛店への最短ルートです。
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
                        {/* Instagram Data */}
                        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700 relative group hover:border-pink-500/50 transition-colors duration-500">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-transparent rounded-bl-full opacity-50" />
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-900/20">
                                    <Icons.Instagram size={28} />
                                </div>
                                <div>
                                    <span className="text-pink-400 font-bold text-sm tracking-wider uppercase">Discovery</span>
                                    <h3 className="text-2xl font-bold">認知・発見</h3>
                                </div>
                            </div>
                            <div className="mb-6 flex items-baseline gap-2">
                                <span className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                                    <CountUp end={70} />
                                </span>
                                <span className="text-2xl font-bold text-slate-500">%</span>
                            </div>
                            <p className="text-xl font-bold mb-3">お店選びの起点</p>
                            <p className="text-slate-400 leading-relaxed">
                                グルメ情報の検索において、約7割のユーザーがInstagramを利用。<br />
                                <span className="text-white font-bold underline decoration-pink-500/50 decoration-2 underline-offset-4">「保存」された投稿</span>が、週末の行き先候補になります。
                            </p>
                        </div>

                        {/* Google Maps Data */}
                        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700 relative group hover:border-indigo-500/50 transition-colors duration-500">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-bl-full opacity-50" />
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-900/20">
                                    <Icons.MapPin size={28} />
                                </div>
                                <div>
                                    <span className="text-green-400 font-bold text-sm tracking-wider uppercase">Decision</span>
                                    <h3 className="text-2xl font-bold">決定・来店</h3>
                                </div>
                            </div>
                            <div className="mb-6 flex items-baseline gap-2">
                                <span className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                                    <CountUp end={73} />
                                </span>
                                <span className="text-2xl font-bold text-slate-500">%</span>
                            </div>
                            <p className="text-xl font-bold mb-3">来店の決め手</p>
                            <p className="text-slate-400 leading-relaxed">
                                マップ検索後の来店率は驚異の高水準。<br />
                                最後のひと押しは、<span className="text-white font-bold underline decoration-green-500/50 decoration-2 underline-offset-4">丁寧な口コミ返信</span>による「信頼感」です。
                            </p>
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <div className="inline-flex items-center gap-2 bg-indigo-600/20 text-indigo-300 px-6 py-3 rounded-full border border-indigo-500/30">
                            <Icons.CheckCircle size={20} />
                            <span className="font-bold">MisePoなら、この2つを同時に攻略できます</span>
                        </div>
                    </div>
                </div>

            </section >

            {/* Features */}
            < section id="features" className="py-24 bg-slate-50 overflow-hidden" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-indigo-600 font-bold tracking-wider text-sm uppercase mb-2 block">All-in-One Platform</span>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                            必要なのは、<br />
                            <span className="gradient-text">このアプリひとつだけ。</span>
                        </h2>
                        <p className="text-slate-600 text-lg">
                            店舗集客に必要な3大プラットフォームを完全網羅。<br />
                            それぞれの媒体特性に合わせて、AIが最適な「振る舞い」をします。
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]">
                        <div className="md:col-span-2 bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100 rounded-full blur-[80px] -mr-16 -mt-16 transition-opacity group-hover:opacity-70" />
                            <div className="relative z-10 flex flex-col h-full items-start">
                                <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg shadow-pink-200"><Icons.Instagram size={24} /></div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Instagram 投稿作成</h3>
                                <p className="text-slate-600 mb-6 max-w-md">「映える」文章構成と、集客に効果的なハッシュタグ選定を自動化。絵文字のバランスも完璧に調整します。</p>
                                <div className="mt-auto w-full bg-slate-50 rounded-xl p-4 border border-slate-100 flex gap-4 items-center">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
                                        <img src="https://picsum.photos/id/30/200/200" alt="img" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="space-y-2 w-full">
                                        <div className="h-2 bg-slate-200 rounded w-3/4" />
                                        <div className="h-2 bg-slate-200 rounded w-1/2" />
                                        <div className="text-[10px] text-blue-500 font-medium">#カフェ #ランチ #MisePo</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500" />
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6"><Icons.MapPin size={24} /></div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">MEO対策・返信</h3>
                            <p className="text-slate-600 text-sm mb-4">口コミへの丁寧な返信文を数秒で。Googleからの評価を高めます。</p>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="flex text-yellow-400 gap-1 mb-2">
                                    <Icons.Zap size={12} fill="currentColor" /><Icons.Zap size={12} fill="currentColor" /><Icons.Zap size={12} fill="currentColor" /><Icons.Zap size={12} fill="currentColor" /><Icons.Zap size={12} fill="currentColor" />
                                </div>
                                <div className="text-[10px] text-slate-500">ご来店ありがとうございます！...</div>
                            </div>
                        </div>
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-sky-500" />
                            <div className="w-12 h-12 bg-sky-100 text-sky-500 rounded-xl flex items-center justify-center mb-6"><Icons.Twitter size={24} /></div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">X (Twitter)</h3>
                            <p className="text-slate-600 text-sm mb-4">140文字の制限内で最大限の魅力を。拡散されやすい文章を作成。</p>
                            <div className="flex justify-between items-center text-xs font-bold text-slate-400 mt-auto">
                                <span>残り 3文字</span>
                                <div className="w-6 h-6 rounded-full border-2 border-sky-500 flex items-center justify-center text-[8px] text-sky-500">OK</div>
                            </div>
                        </div>
                        <div className="md:col-span-2 bg-slate-900 rounded-[2rem] p-8 md:p-10 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-full h-full opacity-10">
                                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <path d="M0 100 C 20 0 50 0 100 100" stroke="white" fill="none" strokeWidth="2" />
                                    <path d="M0 100 C 30 20 70 20 100 100" stroke="white" fill="none" strokeWidth="2" />
                                </svg>
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-1">
                                    <div className="inline-flex items-center gap-2 bg-indigo-500/30 px-3 py-1 rounded-full text-indigo-300 text-xs font-bold mb-4 border border-indigo-500/50"><Icons.Zap size={14} /> Performance</div>
                                    <h3 className="text-2xl font-bold mb-2">圧倒的なスピード</h3>
                                    <p className="text-slate-400">PWA（プログレッシブウェブアプリ）技術により、ネイティブアプリ同等の起動速度を実現。お客様対応の合間にもストレスなく利用できます。</p>
                                </div>
                                <div className="flex-1 flex justify-center">
                                    <div className="text-center">
                                        <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 mb-1">0.5s</div>
                                        <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Startup Time</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* Demo */}
            < section id="demo" className="py-24 bg-[#0f172a] text-white relative overflow-hidden" >
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 to-slate-950" />
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />
                </div>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">AIの実力</span>を今すぐ体験
                        </h2>
                        <p className="text-slate-300 text-lg">1行のメモから、プロ並みの投稿文が数秒で完成します。</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl overflow-hidden max-w-5xl mx-auto flex flex-col md:flex-row min-h-[550px]">
                        <div className="p-8 md:w-1/2 border-b md:border-b-0 md:border-r border-white/10 flex flex-col bg-slate-900/50">
                            <div className="flex items-center justify-between mb-6">
                                <label className="flex items-center gap-2 text-sm font-bold text-white">投稿メモを入力</label>
                                <span className="text-[10px] font-bold text-indigo-300 bg-indigo-900/50 border border-indigo-700/50 px-2 py-1 rounded-full">Instagramモード</span>
                            </div>
                            <div className="relative mb-6 group">
                                <textarea className="relative w-full h-40 p-4 bg-slate-800/80 border border-slate-700 text-slate-100 rounded-xl focus:outline-none focus:bg-slate-800 resize-none text-base transition-colors placeholder:text-slate-500 leading-relaxed" placeholder={"例：\n・今日は雨だけど元気に営業中\n・新作のいちごタルト始めました\n・数量限定なのでお早めに"} readOnly />
                            </div>
                            <button onClick={() => loginWithGoogle('trial')} className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden group bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:scale-[1.02]">
                                <Icons.Sparkles size={20} className="group-hover:animate-pulse" />AIで文章を生成する
                            </button>
                            <div className="mt-auto pt-6">
                                <div className="flex items-center gap-2 mb-4"><Icons.Zap size={16} className="text-yellow-400" fill="currentColor" /><h3 className="font-bold text-slate-200 text-sm">Proプランなら...</h3></div>
                                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                    {["3パターン同時提案", "Instagram / X 同時作成", "Googleマップ返信", "多言語翻訳 (英/中/韓)"].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs text-slate-400"><Icons.CheckCircle size={12} className="text-indigo-400 shrink-0" /><span>{item}</span></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2 p-8 flex flex-col items-center justify-center relative overflow-hidden bg-slate-950/30">
                            <div className="w-full max-w-sm relative z-10">
                                <div className="bg-white border border-gray-200 rounded-2xl max-w-xs mx-auto shadow-2xl overflow-hidden text-sm flex flex-col h-[480px] transform transition-all hover:scale-[1.01]">
                                    <div className="flex items-center justify-between p-3 border-b border-gray-50 shrink-0 bg-white z-10">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px]">
                                                <div className="w-full h-full rounded-full bg-white border border-white overflow-hidden">
                                                    <img src="https://picsum.photos/id/64/100/100" alt="avatar" className="w-full h-full object-cover" />
                                                </div>
                                            </div>
                                            <span className="font-bold text-slate-900 text-xs">misepo_cafe</span>
                                        </div>
                                        <Icons.MoreHorizontal size={16} className="text-slate-400" />
                                    </div>
                                    <div className="overflow-y-auto no-scrollbar flex-1 bg-white">
                                        <div className="bg-gray-100 aspect-square w-full relative group shrink-0">
                                            <img src="https://picsum.photos/id/425/600/600" alt="post" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="p-3">
                                            <div className="flex justify-between mb-2">
                                                <div className="flex gap-4 text-slate-800"><Icons.Heart size={22} className="hover:text-red-500 transition-colors cursor-pointer" /><Icons.MessageCircle size={22} /><Icons.Send size={22} /></div>
                                                <Icons.Bookmark size={22} className="text-slate-800" />
                                            </div>
                                            <p className="font-bold text-xs mb-2 text-slate-900">「いいね！」128件</p>
                                            <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                                                <span className="font-bold mr-2">misepo_cafe</span>
                                                <span className="text-slate-400">ここにAIが生成した投稿文が表示されます。ハッシュタグも含めて提案します。</span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 mt-2 uppercase">2時間前</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                        </div>
                    </div>
                </div>
            </section >

            {/* PWA Section */}
            < section id="pwa" className="py-12 bg-white" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                        <div className="lg:w-1/2">
                            <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold mb-3">アプリストア不要</div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                                アイコンタップから<br />
                                <span className="text-indigo-600">5秒で投稿完了。</span>
                            </h2>
                            <p className="text-base text-gray-600 mb-6 leading-relaxed">MisePoは最新技術「PWA」を採用。ブラウザで開いて「ホーム画面に追加」するだけで、ネイティブアプリを超えるスピードで起動します。</p>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600 mt-1"><Icons.Clock size={18} /></div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">圧倒的な起動スピード</h3>
                                        <p className="text-xs text-gray-600">無駄なロード時間ゼロ。お客様の対応の合間にサッと投稿が作れます。</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600 mt-1"><Icons.ShieldCheck size={18} /></div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">常に最新バージョン</h3>
                                        <p className="text-xs text-gray-600">ストアでの更新作業は不要。アクセスするだけで常に最新のAIモデルを利用できます。</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 w-full bg-gray-50 rounded-2xl p-5 border border-gray-100 shadow-inner">
                            <h3 className="text-center font-bold text-gray-800 mb-4 text-sm">導入はたったの2ステップ</h3>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-white p-3 rounded-lg shadow-sm flex flex-col items-center text-center">
                                    <div className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs mb-2">1</div>
                                    <Icons.Smartphone size={20} className="text-gray-400 mb-1" />
                                    <p className="font-bold text-gray-700 text-xs">メニューを開く</p>
                                    <p className="text-[10px] text-gray-500">Safari / Chrome</p>
                                </div>
                                <div className="bg-white p-3 rounded-lg shadow-sm flex flex-col items-center text-center">
                                    <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xs mb-2">2</div>
                                    <Icons.PlusSquare size={20} className="text-indigo-600 mb-1" />
                                    <p className="font-bold text-gray-700 text-xs">ホーム画面に追加</p>
                                    <p className="text-[10px] text-gray-500">これだけで完了</p>
                                </div>
                            </div>
                            <div className="relative mx-auto w-40 border-gray-800 bg-gray-800 border-[6px] rounded-[1.2rem] h-[240px] shadow-md flex flex-col overflow-hidden ring-2 ring-gray-100/50">
                                <div className="flex-1 bg-white relative w-full h-full overflow-hidden flex flex-col">
                                    <div className="h-6 bg-gray-100 flex items-center justify-center border-b border-gray-200 px-2">
                                        <div className="w-full h-3 bg-gray-200 rounded-md flex items-center px-1">
                                            <div className="w-1 h-1 bg-gray-400 rounded-full" />
                                            <div className="ml-1 w-6 h-1 bg-gray-300 rounded-full opacity-50" />
                                        </div>
                                    </div>
                                    <div className="flex-1 p-2 space-y-2 opacity-40">
                                        <div className="w-full h-12 bg-indigo-200 rounded-md animate-pulse" />
                                        <div className="space-y-1">
                                            <div className="w-3/4 h-1 bg-gray-200 rounded" />
                                            <div className="w-1/2 h-1 bg-gray-200 rounded" />
                                            <div className="w-full h-1 bg-gray-200 rounded" />
                                        </div>
                                        <div className="w-full h-8 bg-gray-100 rounded-md" />
                                    </div>
                                    <div className="absolute bottom-0 w-full bg-white rounded-t-lg shadow-[0_-3px_10px_rgba(0,0,0,0.1)] pb-2 transform transition-transform duration-500">
                                        <div className="flex justify-center py-1"><div className="w-5 h-0.5 bg-gray-300 rounded-full" /></div>
                                        <div className="px-2 pb-0.5"><p className="text-[8px] font-bold text-gray-400 mb-0.5 uppercase tracking-wider">共有</p></div>
                                        <div className="px-1 space-y-0.5">
                                            <div className="flex items-center gap-2 px-2 py-1 text-gray-500"><Icons.Share size={8} /><span className="text-[9px]">送信</span></div>
                                            <div className="flex items-center gap-2 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md font-bold border border-indigo-100 mx-0.5 shadow-sm relative overflow-hidden"><Icons.PlusSquare size={10} /><span className="text-[9px]">ホーム画面に追加</span><div className="absolute right-1 w-1 h-1 bg-red-500 rounded-full animate-ping" /></div>
                                            <div className="flex items-center gap-2 px-2 py-1 text-gray-500"><Icons.MoreHorizontal size={8} /><span className="text-[9px]">その他</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-center text-[9px] text-gray-400 mt-2">※画面はイメージです</p>
                        </div>
                    </div>
                </div>
            </section >

            {/* Pricing */}
            < section id="pricing" className="py-24 bg-white border-t border-slate-100" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                        {/* Left Column: Value Proposition */}
                        <div className="text-left">
                            <span className="text-indigo-600 font-bold tracking-wider text-sm uppercase mb-4 block">Simple Pricing</span>
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
                                お店の成長に<br />
                                <span className="text-indigo-600">必要なすべてを。</span>
                            </h2>
                            <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                                追加料金なしで、プロフェッショナルな機能を好きなだけ。<br />
                                複雑なオプション料金はありません。
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                                        <Icons.Sparkles size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg mb-1">AI投稿生成 無制限</h3>
                                        <p className="text-slate-500">納得いくまで何度でも作り直せます。</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 shrink-0">
                                        <Icons.Instagram size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg mb-1">全プラットフォーム対応</h3>
                                        <p className="text-slate-500">Instagram, X, Googleマップすべてに対応。</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shrink-0">
                                        <Icons.MessageCircle size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg mb-1">多言語 & 口コミ返信</h3>
                                        <p className="text-slate-500">インバウンド対応も、丁寧な返信もお任せください。</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Pricing Card */}
                        <div className="relative rounded-[2.5rem] p-8 md:p-10 flex flex-col bg-slate-900 text-white shadow-2xl ring-1 ring-white/20 overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/30 rounded-full blur-[100px] -mr-20 -mt-20 group-hover:bg-indigo-600/40 transition-colors" />
                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/30 rounded-full blur-[100px] -ml-20 -mb-20 group-hover:bg-purple-600/40 transition-colors" />

                            <div className="relative z-10 text-center mb-10">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold shadow-lg mb-6 animate-pulse">
                                    <Icons.Sparkles size={16} fill="currentColor" />
                                    まずは7日間 無料体験
                                </div>
                                <h3 className="text-3xl font-bold mb-4">Proプラン</h3>
                                <div className="flex items-baseline justify-center gap-2 mb-2">
                                    <span className="text-6xl font-black tracking-tight">¥1,480</span>
                                    <span className="text-slate-400 font-bold text-lg">/月</span>
                                </div>
                                <p className="text-sm text-slate-400">無料期間中はいつでもキャンセル可能</p>
                            </div>

                            <div className="h-px w-full bg-slate-800 mb-8" />

                            <ul className="space-y-4 mb-10 text-left relative z-10 pl-4">
                                {[
                                    "AI投稿生成 (無制限)",
                                    "Instagram / X / Google 全対応",
                                    "3パターン同時提案",
                                    "口コミ返信アシスト",
                                    "多言語翻訳 (英・中・韓)",
                                    "チャットサポート"
                                ].map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <div className="rounded-full p-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                                            <Icons.Check size={16} strokeWidth={3} />
                                        </div>
                                        <span className="font-medium text-slate-200 text-lg">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button onClick={() => loginWithGoogle('trial')} className="w-full py-5 rounded-2xl font-bold text-xl bg-white text-slate-900 hover:bg-indigo-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:translate-y-[-2px] relative z-10 flex items-center justify-center gap-2 group-hover:shadow-indigo-500/20">
                                7日間無料で試す <Icons.ChevronUp className="rotate-90" size={20} />
                            </button>
                            <p className="text-center text-xs text-slate-500 mt-6">
                                ※8日目以降は月額1,480円で自動更新されます。<br />
                                違約金や期間の縛りはありません。
                            </p>
                        </div>
                    </div>
                </div>
            </section >

            {/* FAQ */}
            < section id="faq" className="py-20 bg-white" >
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">よくある質問</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                <button className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 flex justify-between items-center transition-colors" onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}>
                                    <span className="font-bold text-gray-800">{faq.q}</span>
                                    {openFaq === index ? <Icons.ChevronUp className="text-gray-400" /> : <Icons.ChevronDown className="text-gray-400" />}
                                </button>
                                <div className={`bg-gray-50 px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-48 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'}`}>
                                    <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Footer */}
            < footer className="bg-gray-900 text-white py-12" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-2">
                            <h3 className="text-2xl font-bold mb-4">MisePo</h3>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                                店舗の魅力を、AIの力で世界へ。<br />
                                忙しい店主のための広報パートナー。
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">サービス</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white">機能一覧</a></li>
                                <li><a href="#" className="hover:text-white">料金プラン</a></li>
                                <li><a href="#" className="hover:text-white">導入事例</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">サポート</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white">ヘルプセンター</a></li>
                                <li><a href="#" className="hover:text-white">お問い合わせ</a></li>
                                <li><a href="#" className="hover:text-white">利用規約</a></li>
                                <li><a href="#" className="hover:text-white">プライバシーポリシー</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                        © {new Date().getFullYear()} MisePo. All rights reserved.
                    </div>
                </div>
            </footer >

            <style jsx global>{`
                html { scroll-behavior: smooth; scroll-padding-top: 80px; }
                .gradient-text { background: linear-gradient(135deg, #4f46e5 0%, #ec4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
                .animate-float { animation: float 3s ease-in-out infinite; }
                .animate-float-delayed { animation: float 3s ease-in-out infinite; animation-delay: 1.5s; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div >
    );
}
