"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Icons } from './LandingPageIcons';
import HeroSection from './HeroSection';
import { Header } from './landing-page/Header';
import { ProblemSection } from './landing-page/ProblemSection';
import { BenefitSection } from './landing-page/BenefitSection';
import { FeaturesSection } from './landing-page/FeaturesSection';
import { WorkflowSection } from './landing-page/WorkflowSection';
import { DemoSection } from './landing-page/DemoSection';
import { PWASection } from './landing-page/PWASection';
import { TestimonialsSection } from './landing-page/TestimonialsSection';
import { PricingSection } from './landing-page/PricingSection';
import { FAQSection } from './landing-page/FAQSection';
import { CTASection } from './landing-page/CTASection';
import { Footer } from './landing-page/Footer';

export default function LandingPage() {
    const { loginWithGoogle } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [demoInput] = useState("ドーナツ新作３種登場。ハニーディップ、トリプルチョコ、パイ生地ドーナツ。一律２８０円。売り切れ次第終了。");
    const [isDemoGenerating, setIsDemoGenerating] = useState(false);
    const [demoResult, setDemoResult] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleDemoGenerate = async () => {
        setIsDemoGenerating(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
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

〒150-0000 東京都渋谷区神南1-0-0 ミセポビル2F

#misepocafe #渋谷カフェ #表参道カフェ #東京グルメ #新作ドーナツ #ドーナツ #カフェ巡り`;
        setDemoResult(mockResponse);
        setIsDemoGenerating(false);
    };

    const problems = [
        { icon: <Icons.Moon />, title: "閉店後の\nSNS作業がツラい", desc: "疲れた体でスマホを見つめて、\n手が止まる。\nそんな夜はもう終わりにしませんか。", bg: "bg-slate-700", delay: 0 },
        { icon: <Icons.Bot />, title: "AI文章に\n違和感がある", desc: "丁寧すぎて『自分らしくない』。\nMisePoなら、あなたの口癖や\n話し方を再現します。", bg: "bg-pink-500", delay: 0.1 },
        { icon: <Icons.MessageCircle />, title: "クチコミ返信が\n放置気味…", desc: "言葉が見つからず、\n気づけば数週間。お客様との絆を\n30秒で紡ぎ直せます。", bg: "bg-blue-500", delay: 0.2 },
        { icon: <Icons.Users />, title: "任せたいけど\n任せられない", desc: "スタッフに頼みたいけど、\n店の雰囲気が壊れないか心配…\n『店の人格』を設定すれば解決。", bg: "bg-green-500", delay: 0.3 },
    ];

    const faqs = [
        { q: "AIだと不自然な文章になりませんか？", a: "MisePoは過去の投稿を学習し、あなたの口癖や語尾まで再現します。フォロワーからも「いつも通りですね」と言われるほど自然な文章が生成されるため、AI特有の堅苦しさはありません。" },
        { q: "操作が難しそうです...", a: "メモを1行打つだけです。LINEでメッセージを送るのと変わりません。PWA技術により0.5秒で起動するため、忙しい現場でもストレスなく使えます。" },
        { q: "他店と同じような文章になりませんか？", a: "大丈夫です。『熱い店長』『親しみやすいスタッフ』など、投稿の目的に合わせて人格を切り替えられるため、あなたのお店だけの個性が出ます。" },
        { q: "生成された文章はそのまま使えますか？", a: "はい、完成度が高いのでそのままコピーペーストして投稿できます。さらにこだわりたい方は、少しだけ手を加えることで、より『自分らしさ』を出せます。" },
    ];

    return (
        <div className="min-h-screen bg-white">
            <Header scrolled={scrolled} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} loginWithGoogle={loginWithGoogle} />
            <HeroSection />
            <ProblemSection problems={problems} isMobile={isMobile} />
            <BenefitSection />
            <FeaturesSection isMobile={isMobile} />
            <WorkflowSection />
            <DemoSection demoInput={demoInput} isDemoGenerating={isDemoGenerating} demoResult={demoResult} handleDemoGenerate={handleDemoGenerate} />
            <PWASection />
            <TestimonialsSection />
            <PricingSection />
            <FAQSection faqs={faqs} openFaq={openFaq} setOpenFaq={setOpenFaq} />
            <CTASection />
            <Footer />

            <style jsx global>{`
                html { scroll-behavior: smooth; scroll-padding-top: 80px; }
                .gradient-text { background: linear-gradient(135deg, #4f46e5 0%, #ec4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
                .animate-float { animation: float 3s ease-in-out infinite; }
                .animate-float-delayed { animation: float 3s ease-in-out infinite; animation-delay: 1.5s; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
