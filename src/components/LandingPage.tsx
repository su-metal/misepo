"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Custom SVG Icons
const Icons: any = {
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
    Moon: ({ size = 24, className = "" }: { size?: number; className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
    ),
    Bot: ({ size = 24, className = "" }: { size?: number; className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
        </svg>
    ),
    Users: ({ size = 24, className = "" }: { size?: number; className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
    Check: ({ size = 24, className = "" }: { size?: number; className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <polyline points="20 6 9 17 4 12" />
        </svg>
    ),
    ChevronUp: ({ size = 24, className = "" }: { size?: number; className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <polyline points="18 15 12 9 6 15" />
        </svg>
    ),
    ChevronDown: ({ size = 24, className = "" }: { size?: number; className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <polyline points="6 9 12 15 18 9" />
        </svg>
    ),
    PlusCircle: ({ size = 24, className = "" }: { size?: number; className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
        </svg>
    ),
    Bell: ({ size = 24, className = "", fill = "none" }: { size?: number; className?: string; fill?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
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
    Home: ({ size = 24 }: { size?: number }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
    ),
    Search: ({ size = 24 }: { size?: number }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
    ),
    ShoppingBag: ({ size = 24 }: { size?: number }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
    ),
    User: ({ size = 24 }: { size?: number }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
    ),
    Film: ({ size = 24 }: { size?: number }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 3v18" /><path d="M3 7.5h4" /><path d="M3 12h18" /><path d="M3 16.5h4" /><path d="M17 3v18" /><path d="M17 7.5h4" /><path d="M17 16.5h4" /></svg>
    ),
    Compass: ({ size = 24 }: { size?: number }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>
    ),
    ShieldCheck: ({ size = 18 }: { size?: number }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" />
        </svg>
    ),
    Globe: ({ size = 24 }: { size?: number }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    ),
    History: ({ size = 24 }: { size?: number }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><polyline points="12 7 12 12 15 15" />
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

    // Demo Section State
    const [demoInput, setDemoInput] = useState("ドーナツ新作３種登場。ハニーディップ、トリプルチョコ、パイ生地ドーナツ。一律２８０円。売り切れ次第終了。");
    const [isDemoGenerating, setIsDemoGenerating] = useState(false);
    const [demoResult, setDemoResult] = useState("");

    const heroRef = useRef<HTMLDivElement>(null);

    const [isMobile, setIsMobile] = useState(false);
    const [isRepeatUser, setIsRepeatUser] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Check for repeat visit (Fast Forward Mode)
        const hasVisited = sessionStorage.getItem('hasVisited');
        if (hasVisited) {
            setIsRepeatUser(true);
        } else {
            sessionStorage.setItem('hasVisited', 'true');
        }

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // ... (omitted code) ...

    // Demo Generation Logic
    const handleDemoGenerate = async () => {
        setIsDemoGenerating(true);

        // Simulate AI Delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Fixed Mock Generation Logic (Real MisePo Output)
        const mockResponse = `˗ˏˋ ✨新作ドーナツ登場✨ ˎˊ˗

misepocafeに、とっておきのドーナツが3種類仲間入りしました🍩

今回仲間入りしたのは、
・ハニーディップ
・トリプルチョコ
・パイ生地ドーナツ

どれも一つ280円です！

自家焙煎のこだわりのコーヒーと一緒に、ぜひお楽しみくださいね☕️
数量限定ですので、売り切れ次第終了となります。お早めにどうぞ😊

MisePoCafe coffee&eat
☎︎03-1234-5678

open11:00-close 17:00
（sat）open11:00-close22:00
（sun）open11:00-close18:00

〒150-0000 東京都渋谷区神南1-0-0 ミセポビル1F

#misepocafe #渋谷カフェ #表参道カフェ #東京グルメ #新作ドーナツ #ドーナツ #カフェ巡り`;

        setDemoResult(mockResponse);
        setIsDemoGenerating(false);
    };

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
                    // Map 0-100% to 0-9000 range for ultra-smooth, extended timeline with grace period
                    setHeroAnimationProgress(progressPct * 9000);
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Animation States derived from progress
    // On mobile, small delay to allow phone to settle before animation starts
    const mobileAnimationOffset = isMobile ? 200 : 0;
    const effectiveProgress = Math.max(0, heroAnimationProgress - mobileAnimationOffset);

    // Mobile Scroll (Move content up before animation starts)
    const mobileScrollY = isMobile ? Math.min(heroAnimationProgress, mobileAnimationOffset) * 0.8 : 0;

    // Data
    const userMemo = "・春限定のいちごタルト開始\n・サクサク生地と完熟いちご\n・自家製カスタード\n・渋谷駅徒歩5分\n・#春スイーツ";
    const generatedResult = "【春限定】とろける幸せ、いちごタルト解禁🍓\n\nサクサクのクッキー生地と、\n溢れんばかりの完熟いちご。\n一口食べれば、そこはもう春。\n\n完熟いちごの甘さと、\n自家製カスタードのハーモニーを\nぜひお楽しみください。\n\n📍Access: 渋谷駅 徒歩5分\n🕒Open: 10:00 - 20:00\n📞Reserve: 03-1234-5678\n\n#MisePoカフェ #春スイーツ #期間限定";

    // Phase 1: Typing Input (0 - 2000) - Very slow and deliberate
    const typingProgress = Math.min(Math.max(effectiveProgress / 2000, 0), 1);

    // Determine text content based on phase
    let currentText = "";
    if (effectiveProgress < 2000) {
        currentText = userMemo.slice(0, Math.floor(userMemo.length * typingProgress));
    } else if (effectiveProgress < 2750) {
        currentText = ""; // Generating... (Reduced by 250)
    } else {
        currentText = generatedResult;
    }

    // Generation Phase
    const isTypingDone = effectiveProgress > 2000;
    const isGenerating = effectiveProgress > 2000 && effectiveProgress < 2750;
    const isResultShown = effectiveProgress > 2750; // Result visible

    // Post/Swap Phase (Trigger at 4050)
    const isPosted = effectiveProgress > 4050;

    // Inertia Scroll (Ease Out)
    // Start at 4150, duration 2850 -> Ends at 7000
    // (Duration increased by 450: 2400 + 250 + 200)
    // Total timeline is 9000, so 7000-9000 is "Grace Period" (Locked Wait)
    const rawScrollProgress = Math.min(Math.max((effectiveProgress - 4150) / 2850, 0), 1);
    const easeOutCubic = 1 - Math.pow(1 - rawScrollProgress, 3);
    const internalScrollProgress = easeOutCubic;

    const innerContentStyle = {
        transform: `translateY(-${internalScrollProgress * 320}px)`,
    };

    // Text Opacity Logic for Fade-In Effect
    let textOpacity = 1;
    if (effectiveProgress >= 2000 && effectiveProgress < 2750) {
        textOpacity = 0.5; // Generating pulse
    } else if (effectiveProgress >= 2750) {
        // Fade in result (2750-3050)
        textOpacity = Math.min(Math.max((effectiveProgress - 2750) / 300, 0), 1);
    }

    const problems = [
        {
            icon: <Icons.Moon size={28} className="text-white" />,
            title: "閉店後の\nSNS作業がツラい",
            desc: "疲れた体でスマホを見つめて、\n手が止まる。\nそんな夜はもう終わりにしませんか。",
            bg: "bg-slate-700",
            delay: 0
        },
        {
            icon: <Icons.Bot size={28} className="text-white" />,
            title: "AI文章に\n違和感がある",
            desc: "丁寧すぎて『自分らしくない』。\nMisePoなら、あなたの口癖や\n話し方を再現します。",
            bg: "bg-pink-500",
            delay: 0.1
        },
        {
            icon: <Icons.MessageCircle size={28} className="text-white" />,
            title: "クチコミ返信が\n放置気味…",
            desc: "言葉が見つからず、\n気づけば数週間。お客様との絆を\n30秒で紡ぎ直せます。",
            bg: "bg-blue-500",
            delay: 0.2
        },
        {
            icon: <Icons.Users size={28} className="text-white" />,
            title: "任せたいけど\n任せられない",
            desc: "スタッフに頼みたいけど、\n店の雰囲気が壊れないか心配…\n『店の人格』を設定すれば解決。",
            bg: "bg-green-500",
            delay: 0.3
        },
    ];
    const faqs = [
        {
            q: "AIだと不自然な文章になりませんか？",
            a: "MisePoは過去の投稿を学習し、あなたの口癖や語尾まで再現します。フォロワーからも「いつも通りですね」と言われるほど自然な文章が生成されるため、AI特有の堅苦しさはありません。"
        },
        {
            q: "操作が難しそうです...",
            a: "メモを1行打つだけです。LINEでメッセージを送るのと変わりません。PWA技術により0.5秒で起動するため、忙しい現場でもストレスなく使えます。"
        },
        {
            q: "他店と同じような文章になりませんか？",
            a: "大丈夫です。『熱い店長』『親しみやすいスタッフ』など、投稿の目的に合わせて人格を切り替えられるため、あなたのお店だけの個性が出ます。"
        },
        {
            q: "生成された文章はそのまま使えますか？",
            a: "はい、完成度が高いのでそのままコピーペーストして投稿できます。さらにこだわりたい方は、少しだけ手を加えることで、より『自分らしさ』を出せます。"
        },
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
                            <button onClick={() => window.location.href = '/start'} className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-300">無料で始める</button>
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
                                <button onClick={() => window.location.href = '/start'} className="w-full bg-indigo-600 text-white px-5 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200">無料で始める</button>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* New Sticky Hero Animation */}
            <div ref={heroRef} className={`relative z-10 ${isRepeatUser ? 'h-[400vh]' : 'h-[1800vh]'}`}>
                <div
                    className="sticky top-0 h-[150vh] md:h-screen w-full overflow-hidden flex flex-col transition-transform duration-100 ease-out will-change-transform"
                    style={{ transform: `translateY(-${mobileScrollY}px)` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50" />

                    {/* Mobile Text (Static at top) */}
                    <div className="md:hidden pt-24 px-4 text-center z-20 relative mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-sm mb-4">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-xs font-bold text-indigo-900">総生成数 10,000件突破</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-[1.1] mb-3">
                            AIなのに、<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">私の言葉。</span>
                        </h1>
                        <p className="text-base text-slate-600 leading-relaxed px-2">
                            もうSNSで無理をするのは、やめませんか？<br />
                            過去の投稿を読み込むだけで、あなたの口癖や想いまで再現します。
                        </p>
                    </div>

                    {/* Desktop Text (Absolute) */}
                    <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-12 lg:left-24 z-20 max-w-xl pointer-events-none">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-sm mb-8">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-sm font-bold text-indigo-900">総生成数 10,000件突破</span>
                        </div>
                        <h1 className="text-6xl lg:text-[5.5rem] font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
                            AIなのに、<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">私の言葉。</span>
                        </h1>
                        <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-lg">
                            もうSNSで無理をするのは、やめませんか？<br />
                            過去の投稿を読み込むだけで、あなたの口癖や想いまで再現。<br />
                            X・インスタ・Googleクチコミ返信まで、あなたの「分身」が代行します。
                        </p>
                        <div className="flex gap-4 pointer-events-auto">
                            <button onClick={() => window.location.href = '/start'} className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all hover:scale-105 shadow-xl shadow-slate-900/20 flex items-center gap-2">
                                <Icons.Sparkles size={20} className="text-yellow-400" />
                                無料で試してみる
                            </button>
                            <button className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all">
                                料金プラン
                            </button>
                        </div>
                    </div>

                    {/* Phone Animation Container */}
                    <div className="absolute inset-0 md:left-1/3 flex items-start md:items-center justify-center pointer-events-none pt-[22rem] md:pt-0">
                        <div className="relative w-[300px] h-[600px] scale-90 md:scale-100 origin-center">

                            {/* CENTER PHONE (MisePo) */}
                            <div
                                className={`absolute inset-0 transition-all duration-700 ease-in-out origin-center
                                    ${isPosted
                                        ? 'scale-75 -translate-x-[40vw] md:-translate-x-[200px] -rotate-12 opacity-60 z-10 blur-[1px]'
                                        : 'scale-100 translate-x-0 rotate-0 opacity-100 z-30 blur-none'
                                    }`}
                            >
                                {/* Narrative Floating Label */}
                                <div className={`absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 transition-all duration-300 ${effectiveProgress > 100 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                    <div className="bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-full font-bold text-sm shadow-xl border border-slate-700/50 flex items-center gap-2">
                                        {effectiveProgress < 2000 && (
                                            <>
                                                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                                1. メモを入力中...
                                            </>
                                        )}
                                        {effectiveProgress >= 2000 && effectiveProgress < 2750 && (
                                            <>
                                                <Icons.Sparkles size={14} className="text-yellow-400 animate-spin" />
                                                2. AIが文章を生成中...
                                            </>
                                        )}
                                        {effectiveProgress >= 2750 && (
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
                                                <div className={`space-y-2 ${isGenerating ? 'animate-pulse' : ''}`} style={{ opacity: textOpacity }}>
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
                                className={`absolute inset-0 w-[260px] h-[520px] top-20 left-[-100px] transition-all duration-700 ease-in-out origin-center
                                    ${isPosted
                                        ? 'scale-[1.15] translate-x-[120px] -translate-y-4 rotate-0 z-40'
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

                    {/* Mobile CTA Buttons (Below Phone) */}
                    <div className="md:hidden absolute top-[62rem] left-0 right-0 px-4 z-20">
                        <div className="flex flex-col gap-3 max-w-sm mx-auto">
                            <button onClick={() => window.location.href = '/start'} className="w-full px-6 py-3.5 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2">
                                <Icons.Sparkles size={18} className="text-yellow-400" />
                                無料で試してみる
                            </button>
                            <button className="w-full px-6 py-3.5 bg-white text-slate-900 rounded-full font-bold border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all">
                                料金プラン
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Problem */}
            <section id="problem" className="py-32 bg-slate-50 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-200/20 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl mx-auto text-center mb-20">
                        <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold tracking-wider text-xs uppercase mb-6">
                            Social Media Challenges
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-8">
                            こんな毎日を、<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-400">一人で抱えていませんか？</span>
                        </h2>
                        <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto">
                            閉店後の疲れた体でスマホを見つめる夜。<br className="hidden md:block" />
                            AIを使ってみたけれど、どこか自分らしくない文章への違和感。<br className="hidden md:block" />
                            MisePoは、あなたのそんな「心の重荷」に寄り添うために生まれました。
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {problems.map((prob, index) => (
                            <div key={index} className="group relative bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
                                <div className={`w-16 h-16 rounded-2xl ${prob.bg} flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                    {prob.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 whitespace-pre-line leading-tight">{prob.title}</h3>
                                <div className="h-px w-12 bg-slate-100 mb-4 group-hover:w-full group-hover:bg-indigo-100 transition-all duration-500" />
                                <p className="text-sm text-slate-500 leading-relaxed">{prob.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Market Data (Rational Bridge) */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-indigo-600 font-bold tracking-wider text-sm uppercase mb-3 block">Why Now?</span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                            でも、お店探しをする人の<span className="text-indigo-600">7割以上</span>が、<br className="hidden md:block" />SNSを見ています。
                        </h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
                            データが語る『今、やるべき理由』。<br />
                            避けては通れない、集客の新常識です。
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
                        {/* Instagram Data */}
                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 relative group hover:border-pink-200 transition-colors duration-500">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-pink-100 text-pink-500 rounded-xl flex items-center justify-center shrink-0">
                                    <Icons.Instagram size={24} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Discovery</div>
                                    <h3 className="text-xl font-bold text-slate-900">認知・発見</h3>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-6xl font-black text-slate-900"><CountUp end={70} /></span>
                                <span className="text-2xl font-bold text-slate-400">%</span>
                            </div>
                            <p className="text-slate-600 font-bold leading-relaxed">
                                グルメ検索でInstagramを利用。<br />
                                <span className="bg-pink-100 text-pink-800 px-1">「保存」された投稿</span>が行き先候補に。
                            </p>
                        </div>

                        {/* Google Maps Data */}
                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 relative group hover:border-indigo-200 transition-colors duration-500">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                                    <Icons.MapPin size={24} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Decision</div>
                                    <h3 className="text-xl font-bold text-slate-900">決定・来店</h3>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-6xl font-black text-slate-900"><CountUp end={73} /></span>
                                <span className="text-2xl font-bold text-slate-400">%</span>
                            </div>
                            <p className="text-slate-600 font-bold leading-relaxed">
                                マップ検索後の来店率。<br />
                                決め手は<span className="bg-green-100 text-green-800 px-1">信頼できる口コミ返信</span>です。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solution (Benefits) */}
            <section className="py-24 bg-slate-900 text-white overflow-hidden relative" >
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px]" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <span className="text-indigo-400 font-bold tracking-wider text-sm uppercase mb-3 block">Solution</span>
                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                            『みせぽ』は、<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">あなたを学習するAI。</span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                            もう、ゼロから悩む必要はありません。<br />
                            過去の投稿を読み込むだけで、あなたの口癖、温かさ、お店の雰囲気を再現します。
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
                        {/* Benefit 1: Natural Voice */}
                        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700 relative group hover:border-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-300">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-bl-full opacity-50" />
                            <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-900/20 mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Icons.MessageCircle size={28} />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">あなたの「文体」を<br />コピー</h3>
                            <p className="text-slate-400 leading-relaxed">
                                過去の投稿を学習し、あなたの口癖や温かさを再現。<br />
                                フォロワーに「これAI？」と思わせない<span className="text-white font-bold">自然な発信</span>が可能に。
                            </p>
                        </div>

                        {/* Benefit 2: Persona Switching */}
                        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700 relative group hover:border-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all duration-300">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-transparent rounded-bl-full opacity-50" />
                            <div className="w-14 h-14 bg-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-900/20 mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Icons.Users size={28} />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">「中の人」を<br />自由自在に</h3>
                            <p className="text-slate-400 leading-relaxed">
                                「熱い店長」「親しみやすい看板娘」「クールな公式」など、投稿の目的に合わせて<span className="text-white font-bold">人格を切り替え</span>。
                            </p>
                        </div>

                        {/* Benefit 3: Review Replies */}
                        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700 relative group hover:border-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-bl-full opacity-50" />
                            <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-900/20 mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Icons.Heart size={28} />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">クチコミ返信の<br />「心の壁」を撤去</h3>
                            <p className="text-slate-400 leading-relaxed">
                                コピペするだけで、誠実であなたらしい返信案を<span className="text-white font-bold">30秒で作成</span>。<br />
                                お客様との絆を深める時間を短縮。
                            </p>
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <div className="inline-flex items-center gap-2 bg-indigo-600/20 text-indigo-300 px-6 py-3 rounded-full border border-indigo-500/30">
                            <Icons.CheckCircle size={20} />
                            <span className="font-bold">「これなら自分の言葉として発信できる」という安心感を提供します</span>
                        </div>
                    </div>
                </div>

            </section>

            {/* Features */}
            <section id="features" className="py-24 bg-slate-50 overflow-hidden" >
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
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full blur-[80px] -mr-16 -mt-16 transition-opacity group-hover:opacity-70" />
                            <div className="relative z-10 flex flex-col h-full items-start">
                                <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-200"><Icons.Maximize2 size={24} /></div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">3大プラットフォーム一括管理</h3>
                                <p className="text-slate-600 mb-6 max-w-md">
                                    Instagram、X (Twitter)、Googleビジネスプロフィールの投稿・返信を1つのアプリで完結。
                                    <br />
                                    媒体ごとのアプリを行き来する手間をゼロにします。
                                </p>
                                <div className="mt-auto w-full flex gap-4 items-center justify-start">
                                    {[
                                        { icon: <Icons.Instagram size={18} />, bg: "bg-pink-100", text: "text-pink-600" },
                                        { icon: <Icons.Twitter size={18} />, bg: "bg-sky-100", text: "text-sky-600" },
                                        { icon: <Icons.MapPin size={18} />, bg: "bg-green-100", text: "text-green-600" },
                                    ].map((item, i) => (
                                        <div key={i} className={`w-12 h-12 ${item.bg} ${item.text} rounded-xl flex items-center justify-center`}>
                                            {item.icon}
                                        </div>
                                    ))}
                                    <div className="h-0.5 w-12 bg-slate-200" />
                                    <div className="text-xs font-bold text-slate-500">Sync All</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500" />
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6"><Icons.Globe size={24} /></div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">多言語翻訳 &<br />インバウンド対応</h3>
                            <p className="text-slate-600 text-sm mb-4">
                                日本語の投稿から、英語・中国語・韓国語をワンタップで生成。外国人観光客へのアピールも自動化できます。
                            </p>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="flex gap-2 mb-2 text-[10px] font-bold text-slate-400">
                                    <span className="bg-white px-1 rounded border border-slate-200">EN</span>
                                    <span className="bg-white px-1 rounded border border-slate-200">CN</span>
                                    <span className="bg-white px-1 rounded border border-slate-200">KR</span>
                                </div>
                                <div className="text-[10px] text-slate-500">Welcome to our cafe...</div>
                            </div>
                        </div>
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-sky-500" />
                            <div className="w-12 h-12 bg-sky-100 text-sky-500 rounded-xl flex items-center justify-center mb-6"><Icons.History size={24} /></div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">過去投稿の<br />スタイル同期</h3>
                            <p className="text-slate-600 text-sm mb-4">
                                過去数年分の投稿データを解析し、あなただけの「書き癖」データベースを構築。使えば使うほど精度が向上します。
                            </p>
                            <div className="flex items-center gap-2 mt-auto">
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full w-[85%] bg-sky-500" />
                                </div>
                                <span className="text-[10px] font-bold text-sky-500">85% Match</span>
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
            </section>

            {/* Demo */}
            <section id="demo" className="py-24 bg-[#0f172a] text-white relative overflow-hidden" >
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
                                <textarea
                                    className="relative w-full h-40 p-4 bg-slate-800/80 border border-slate-700 text-slate-100 rounded-xl focus:outline-none focus:bg-slate-800 resize-none text-base transition-colors placeholder:text-slate-500 leading-relaxed cursor-not-allowed opacity-80"
                                    readOnly
                                    value={demoInput}
                                />
                            </div>
                            <button
                                onClick={handleDemoGenerate}
                                disabled={isDemoGenerating}
                                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden group bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:scale-[1.02]`}
                            >
                                {isDemoGenerating ? (
                                    <><Icons.Sparkles size={20} className="animate-spin" /> 生成中...</>
                                ) : (
                                    <><Icons.Sparkles size={20} className="group-hover:animate-pulse" /> AIで文章を生成する</>
                                )}
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
                                <div className="bg-white border border-gray-200 rounded-2xl max-w-xs mx-auto shadow-2xl overflow-hidden text-sm flex flex-col h-[480px] transform transition-all hover:scale-[1.01] relative group">
                                    {/* Success Badge */}
                                    {demoResult && (
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce-in">
                                            <div className="bg-white/90 backdrop-blur-md text-indigo-600 px-6 py-3 rounded-full font-black shadow-2xl border-2 border-indigo-100 flex items-center gap-2 whitespace-nowrap">
                                                <Icons.CheckCircle size={24} className="text-green-500" />
                                                <span>投稿完了！</span>
                                            </div>
                                        </div>
                                    )}
                                    {/* Confetti Elements */}
                                    {demoResult && (
                                        <>
                                            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
                                            <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-pink-500 rounded-full animate-ping delay-100" />
                                            <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-indigo-500 rounded-full animate-ping delay-200" />
                                        </>
                                    )}

                                    <div className="flex items-center justify-between p-3 border-b border-gray-50 shrink-0 bg-white z-10">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px] ${demoResult ? 'animate-pulse' : ''}`}>
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
                                            {demoResult && (
                                                <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <div className="flex justify-between mb-2">
                                                <div className="flex gap-4 text-slate-800"><Icons.Heart size={22} className={`hover:text-red-500 transition-colors cursor-pointer ${demoResult ? 'text-red-500 fill-red-500 animate-pulse' : ''}`} /><Icons.MessageCircle size={22} /><Icons.Send size={22} /></div>
                                                <Icons.Bookmark size={22} className="text-slate-800" />
                                            </div>
                                            <p className="font-bold text-xs mb-2 text-slate-900">「いいね！」128件</p>
                                            <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap select-none" onContextMenu={(e) => e.preventDefault()}>
                                                <span className="font-bold mr-2">misepo_cafe</span>
                                                <span className={`${demoResult ? 'text-slate-800' : 'text-slate-400'}`}>
                                                    {isDemoGenerating ? (
                                                        <span className="animate-pulse">AIが最適な投稿文を考えています...</span>
                                                    ) : demoResult ? (
                                                        demoResult
                                                    ) : (
                                                        "ここにAIが生成した投稿文が表示されます。ハッシュタグも含めて提案します。"
                                                    )}
                                                </span>
                                            </div>
                                            {demoResult && (
                                                <p className="text-[10px] text-slate-400 mt-4 text-right italic border-t border-slate-100 pt-2">
                                                    ※実際にMisePoのAIが出力した文章です
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 uppercase">2時間前</p>
                        </div>
                    </div>
                    {/* End Right Column & Flex Container */}
                </div>
                {/* End Max-Width Container */}

                <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                <p className="text-center text-[9px] text-gray-400 mt-4 absolute bottom-4 left-0 right-0 z-10">※画面はイメージです</p>
            </section>

            {/* PWA Section */}
            <section id="pwa" className="py-12 bg-white" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                        <div className="lg:w-1/2">
                            <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold mb-3">ダウンロード不要</div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                                アイコンタップから<br />
                                <span className="text-indigo-600">5秒で投稿完了。</span>
                            </h2>
                            <p className="text-base text-gray-600 mb-6 leading-relaxed">MisePoは、アプリストアからのダウンロードは不要。Webサイトを「ホーム画面に追加」するだけで、普通のスマホアプリと同じようにサクサク動きます。</p>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600 mt-1"><Icons.Clock size={18} /></div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">圧倒的な起動スピード</h3>
                                        <p className="text-xs text-gray-600">無駄なロード時間ゼロ。お客様の対応の合間にサッと投稿が作れます。</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-green-50 p-2 rounded-lg text-green-600 mt-1"><Icons.Smartphone size={18} /></div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">スマホ容量を圧迫しない</h3>
                                        <p className="text-xs text-gray-600">数MBの軽量設計。写真や動画の保存容量を気にせず使えます。</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600 mt-1"><Icons.ShieldCheck size={18} /></div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">常に最新バージョン</h3>
                                        <p className="text-xs text-gray-600">アプリの更新作業は不要。アクセスするだけで常に最新のAIモデルを利用できます。</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 w-full">
                            {/* Animated Phone Mockup */}
                            <div className="relative mx-auto w-56 border-gray-900 bg-gray-900 border-[8px] rounded-[2rem] h-[400px] shadow-2xl flex flex-col overflow-hidden ring-4 ring-gray-800/50">
                                {/* Notch */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-b-xl z-20" />

                                {/* Screen Content - Animated Scenes */}
                                <div className="flex-1 bg-white relative w-full h-full overflow-hidden">

                                    {/* Scene 1: Browser with Share Menu (0-4s) */}
                                    <div className="absolute inset-0 animate-pwa-scene1">
                                        {/* Browser Header */}
                                        <div className="h-10 bg-gray-100 flex items-center justify-between px-3 border-b border-gray-200 pt-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 bg-gray-300 rounded-full" />
                                                <div className="w-20 h-3 bg-gray-200 rounded-full" />
                                            </div>
                                            <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center animate-pulse">
                                                <Icons.Share size={12} className="text-white" />
                                            </div>
                                        </div>
                                        {/* Page Content */}
                                        <div className="p-3 space-y-2 opacity-50">
                                            <div className="w-full h-16 bg-indigo-100 rounded-lg" />
                                            <div className="space-y-1">
                                                <div className="w-3/4 h-2 bg-gray-200 rounded" />
                                                <div className="w-1/2 h-2 bg-gray-200 rounded" />
                                            </div>
                                        </div>
                                        {/* Share Menu Popup */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)] animate-slide-up">
                                            <div className="flex justify-center py-2"><div className="w-8 h-1 bg-gray-300 rounded-full" /></div>
                                            <p className="px-4 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">共有</p>
                                            <div className="px-3 pb-4 space-y-1">
                                                <div className="flex items-center gap-3 px-3 py-2 text-gray-500">
                                                    <Icons.Send size={14} /><span className="text-xs">メッセージ</span>
                                                </div>
                                                <div className="flex items-center gap-3 px-3 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl font-bold border-2 border-indigo-200 relative overflow-hidden animate-pulse">
                                                    <Icons.PlusSquare size={16} />
                                                    <span className="text-xs">ホーム画面に追加</span>
                                                    <div className="absolute right-3 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                                                </div>
                                                <div className="flex items-center gap-3 px-3 py-2 text-gray-500">
                                                    <Icons.MoreHorizontal size={14} /><span className="text-xs">その他</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Scene 2: Confirmation Dialog (4-8s) */}
                                    <div className="absolute inset-0 animate-pwa-scene2 opacity-0">
                                        <div className="h-full bg-gray-100/80 flex items-center justify-center p-4">
                                            <div className="bg-white rounded-2xl shadow-2xl p-4 w-full max-w-[180px] animate-scale-in">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                                        <Icons.Sparkles size={20} className="text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm">MisePo</p>
                                                        <p className="text-[10px] text-gray-500">misepo.app</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="flex-1 py-2 text-xs text-gray-500 bg-gray-100 rounded-lg">キャンセル</button>
                                                    <button className="flex-1 py-2 text-xs text-white bg-indigo-600 rounded-lg font-bold animate-pulse">追加</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Scene 3: Home Screen with App Icon (8-12s) */}
                                    <div className="absolute inset-0 animate-pwa-scene3 opacity-0">
                                        <div className="h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 pt-8">
                                            {/* Status Bar */}
                                            <div className="flex justify-between text-white text-[8px] mb-4 px-1">
                                                <span>9:41</span>
                                                <div className="flex gap-1">
                                                    <div className="w-3 h-2 border border-white rounded-sm" />
                                                </div>
                                            </div>
                                            {/* App Grid */}
                                            <div className="grid grid-cols-4 gap-3">
                                                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                                    <div key={i} className="flex flex-col items-center gap-1">
                                                        <div className="w-10 h-10 bg-white/20 rounded-xl" />
                                                        <div className="w-8 h-1 bg-white/30 rounded" />
                                                    </div>
                                                ))}
                                                {/* MisePo Icon - Appears with animation */}
                                                <div className="flex flex-col items-center gap-1 animate-bounce-in">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/50 animate-pulse">
                                                        <Icons.Sparkles size={18} className="text-white" />
                                                    </div>
                                                    <span className="text-[8px] text-white font-medium">MisePo</span>
                                                </div>
                                            </div>
                                            {/* Success Toast */}
                                            <div className="absolute bottom-16 left-4 right-4 bg-white/90 backdrop-blur-md rounded-xl p-3 flex items-center gap-2 shadow-xl animate-slide-up">
                                                <Icons.CheckCircle size={18} className="text-green-500" />
                                                <span className="text-xs font-bold text-gray-800">ホーム画面に追加しました！</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                {/* Home Indicator */}
                                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-600 rounded-full" />
                            </div>

                            {/* Caption */}
                            <p className="text-center text-xs text-gray-500 mt-4">
                                <span className="inline-flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    アニメーション再生中
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* User Voices */}
            <section className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                    <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-indigo-100 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-pink-100 rounded-full blur-[100px]" />
                </div>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-indigo-600 font-bold tracking-wider text-sm uppercase mb-3 block">User Voices</span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                            ユーザーの声
                        </h2>
                        <p className="text-slate-600 text-lg max-w-xl mx-auto">
                            実際にMisePoをご利用いただいている店主様の声をご紹介します。
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Testimonial 1 */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-indigo-100/50 border border-slate-100 relative group hover:-translate-y-1 transition-transform duration-300">
                            <div className="absolute top-6 right-6 text-indigo-200">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.474-.197L9.758 4.03c-.258.092-.47.166-.721.27-.257.085-.516.2-.765.325-.247.126-.479.282-.724.428-.2.162-.462.277-.638.48-.199.178-.379.393-.579.563a7 7 0 0 0-.653.888c-.169.259-.343.54-.482.829-.145.293-.236.63-.364.939-.116.33-.208.66-.275 1.002-.087.332-.128.67-.171.997S4 10.79 4 11.13v.75A4.38 4.38 0 0 0 8.38 16.25c.57 0 1.13-.1 1.66-.3a4.37 4.37 0 0 0 2.66-4.01c0-1.17-.44-2.26-1.24-3.05A4.37 4.37 0 0 0 8.38 7.65c-.68 0-1.34.14-1.93.4a.5.5 0 0 0 .05.95z" /><path d="M17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.474-.197-1.514-1.97c-.258.092-.47.166-.721.27-.257.085-.516.2-.765.325-.247.126-.479.282-.724.428-.2.162-.462.277-.638.48-.199.178-.379.393-.579.563a7 7 0 0 0-.653.888c-.169.259-.343.54-.482.829-.145.293-.236.63-.364.939-.116.33-.208.66-.275 1.002-.087.332-.128.67-.171.997s-.063.667-.063 1.007v.75a4.38 4.38 0 0 0 4.38 4.87c.57 0 1.13-.1 1.66-.3a4.37 4.37 0 0 0 2.66-4.01c0-1.17-.44-2.26-1.24-3.05a4.37 4.37 0 0 0-3.08-1.24c-.68 0-1.34.14-1.93.4a.5.5 0 0 0 .05.95z" /></svg>
                            </div>
                            <p className="text-slate-700 text-lg font-medium leading-relaxed mb-6 italic">
                                「AI特有の堅苦しさがなくて、<span className="text-indigo-600 font-bold not-italic">常連さんからも『最近の投稿、楽しそうですね』と声をかけられました</span>。」
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">☕</div>
                                <div>
                                    <p className="font-bold text-slate-900">カフェオーナーさま</p>
                                    <p className="text-sm text-slate-500">東京都渋谷区</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-indigo-100/50 border border-slate-100 relative group hover:-translate-y-1 transition-transform duration-300">
                            <div className="absolute top-6 right-6 text-pink-200">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.474-.197L9.758 4.03c-.258.092-.47.166-.721.27-.257.085-.516.2-.765.325-.247.126-.479.282-.724.428-.2.162-.462.277-.638.48-.199.178-.379.393-.579.563a7 7 0 0 0-.653.888c-.169.259-.343.54-.482.829-.145.293-.236.63-.364.939-.116.33-.208.66-.275 1.002-.087.332-.128.67-.171.997S4 10.79 4 11.13v.75A4.38 4.38 0 0 0 8.38 16.25c.57 0 1.13-.1 1.66-.3a4.37 4.37 0 0 0 2.66-4.01c0-1.17-.44-2.26-1.24-3.05A4.37 4.37 0 0 0 8.38 7.65c-.68 0-1.34.14-1.93.4a.5.5 0 0 0 .05.95z" /><path d="M17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.474-.197-1.514-1.97c-.258.092-.47.166-.721.27-.257.085-.516.2-.765.325-.247.126-.479.282-.724.428-.2.162-.462.277-.638.48-.199.178-.379.393-.579.563a7 7 0 0 0-.653.888c-.169.259-.343.54-.482.829-.145.293-.236.63-.364.939-.116.33-.208.66-.275 1.002-.087.332-.128.67-.171.997s-.063.667-.063 1.007v.75a4.38 4.38 0 0 0 4.38 4.87c.57 0 1.13-.1 1.66-.3a4.37 4.37 0 0 0 2.66-4.01c0-1.17-.44-2.26-1.24-3.05a4.37 4.37 0 0 0-3.08-1.24c-.68 0-1.34.14-1.93.4a.5.5 0 0 0 .05.95z" /></svg>
                            </div>
                            <p className="text-slate-700 text-lg font-medium leading-relaxed mb-6 italic">
                                「スタッフ数人で運用していますが、<span className="text-pink-600 font-bold not-italic">誰が書いても『お店のトーン』が揃うのが安心</span>。任せられるようになりました。」
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">✂️</div>
                                <div>
                                    <p className="font-bold text-slate-900">美容室オーナーさま</p>
                                    <p className="text-sm text-slate-500">大阪府大阪市</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-24 bg-white border-t border-slate-100">
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

                            <button onClick={() => window.location.href = '/start'} className="w-full py-5 rounded-2xl font-bold text-xl bg-white text-slate-900 hover:bg-indigo-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:translate-y-[-2px] relative z-10 flex items-center justify-center gap-2 group-hover:shadow-indigo-500/20">
                                今すぐ「分身」を作る <Icons.ChevronUp className="rotate-90" size={20} />
                            </button>
                            <p className="text-center text-xs text-slate-500 mt-6">
                                ✓ クレジットカード登録不要で体験可能<br />
                                ※8日目以降は月額1,480円で自動更新。違約金なしでいつでも解約OK。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="py-20 bg-white">
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
            </section>

            {/* Final Message (Pre-footer) */}
            <section className="py-32 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500 rounded-full blur-[120px]" />
                </div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="mb-8">
                        <div className="inline-block px-4 py-2 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-sm font-bold mb-6">
                            最後に、店主様へ。
                        </div>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                        365日のSNSの悩み、<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-pink-300">これでおしまい。</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-slate-300 leading-relaxed mb-12 max-w-2xl mx-auto">
                        あなたの情熱は、本来のお客様のために。<br />
                        文章作成は、あなたの『分身』に任せてください。
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={() => window.location.href = '/start'}
                            className="group px-8 py-5 bg-white text-slate-900 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                        >
                            今すぐ無料で始める
                            <Icons.ChevronUp className="rotate-90 group-hover:translate-x-1 transition-transform" size={20} />
                        </button>
                        <p className="text-sm text-slate-400">
                            クレジットカード登録不要・7日間無料
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
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
            </footer>

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
