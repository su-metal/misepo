"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Icons } from './LandingPageIcons';
import HeroSection from './HeroSection';
import { Header } from './landing-page/Header';
import { ProblemSection } from './landing-page/ProblemSection';
import { BenefitSection } from './landing-page/BenefitSection';
import { FeaturesSection } from './landing-page/FeaturesSection';
import { UnifiedFlowSection } from './landing-page/UnifiedFlowSection';
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
  const demoScenarios = [
    {
      id: "instagram",
      label: "Instagram投稿",
      modeBadge: "Instagram Mode",
      input: "ドーナツ新作３種登場。ハニーディップ、トリプルチョコ、パイ生地ドーナツ。一律２８０円。売り切れ次第終了。",
      result: `✨ミセポドーナツから、待望の新作ドーナツが3種類登場しました！✨

まずご紹介するのは、優しい甘さが広がる「ハニーディップ」。ふんわりとした生地とハニーの組み合わせは、まさに至福の味わいです。🐻

チョコ好きにはたまらない「トリプルチョコ」もご用意しました。濃厚なチョコのハーモニーを存分にお楽しみいただけます。

そして、サクサク食感が魅力の「パイ生地ドーナツ」！香ばしいパイとドーナツの融合をぜひご体験ください。

どの新作も、一律280円でご提供いたします。🎉

大変申し訳ございませんが、数量限定のため売り切れ次第終了となります。どうぞお早めにお店にお越しくださいね！皆様のご来店を心よりお待ちしております。😊

MisePoCafe coffee&eat
☎︎03-1234-5678

open11:00-close 17:00
（sat）open11:00-close21:00
（sun）open11:00-close18:00

〒150-0000 東京都渋谷区神南1-0-0 ミセポビル2F

#misepocafe #渋谷カフェ #表参道カフェ #東京グルメ #新作ドーナツ #ドーナツ #カフェ巡り`
    },
    {
      id: "google_maps",
      label: "クチコミ返信",
      modeBadge: "Google Maps Mode",
      input: "「初めて来ましたが、ドーナツがふわふわで最高でした！コーヒーも深みがあって好みです。また来ます！」",
      result: `初めてのご来店、そして温かいお言葉をいただき、誠にありがとうございます。

当店のドーナツの「ふわふわ」とした食感と、丁寧に淹れたコーヒーの「深み」をお気に召していただけたとのこと、大変嬉しく存じます。お客様にゆったりとした時間をお過ごしいただけるよう、一つ一つ心を込めてご用意しております。

「また来ます！」とのお言葉、何よりの励みになります。季節の移ろいとともに、また違った味わいや雰囲気をお楽しみいただけるかと存じます。ぜひ、またミセポドーナツで穏やかなひとときをお過ごしください。心よりお待ちしております。
`
    },
    {
      id: "line",
      label: "公式LINE配信",
      modeBadge: "LINE Mode",
      input: "「冬の期間限定ホットチョコドーナツが明日からスタート！LINE友だち限定で50円引きクーポンも。」を魅力的に。",
      result: `冬の訪れを告げる✨
＼＼☃️期間限定ホットチョコドーナツ☃️／／
明日からついにスタートしますよ～👀🎉

とろけるような濃厚ホットチョコレートを贅沢に使った、心温まる特別なドーナツが新登場😌🍫
寒い冬にぴったりの、ほっと一息つける癒やしの味わいです🍩☕

そして、今だけのスペシャルチャンス💸
LINE友だち限定で、このホットチョコドーナツが
＼＼✨50円引き✨！！／／
になるクーポンをプレゼント🎁

この機会を絶対見逃さないでくださいね👐
明日からGETできるチャンス🎉

ぜひ、温かいドーナツで素敵な冬のひとときを過ごしてください🛒
　↓　↓　↓　↓　↓ 🛍️`
    },
    {
      id: "casual",
      label: "お知らせ (ラフ)",
      modeBadge: "Announcement Mode",
      input: "「明日は機材メンテナンスのため15時閉店です。ごめんね！」を親しみやすい感じで。",
      result: `【お知らせとお詫び】
いつもありがとうございます🌿

明日なのですが、お店の機材メンテナンスのため【15時】で少し早めに閉めさせていただきます...！🙏

夕方に来ようと思ってくださっていた方、ごめんなさい！😭
明後日からは通常通り元気にオープンしますので、またゆっくり遊びに来てくださいね✨

よろしくお願いします！🍩`
    }
  ];

  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [isDemoGenerating, setIsDemoGenerating] = useState(false);
  const [demoResult, setDemoResult] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    setDemoResult(""); // Reset result when scenario changes
  }, [activeScenarioIdx]);

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
（sat）open11:00-close21:00
（sun）open11:00-close18:00

〒150-0000 東京都渋谷区神南1-0-0 ミセポビル2F

#misepocafe #渋谷カフェ #表参道カフェ #東京グルメ #新作ドーナツ #ドーナツ #カフェ巡り`;
    setDemoResult("");
    await new Promise(resolve => setTimeout(resolve, 1500));
    setDemoResult(demoScenarios[activeScenarioIdx].result);
    setIsDemoGenerating(false);
  };

  const problems = [
    { icon: <Icons.Moon />, title: "閉店後の\nSNS作業がツラい", desc: "疲れた体でスマホを見つめて、\n手が止まる。\nそんな夜はもう終わりにしませんか。", bg: "bg-[#9B8FD4]", delay: 0 },
    { icon: <Icons.Bot />, title: "AI文章に\n違和感がある", desc: "丁寧すぎて『自分らしくない』。\nMisePoなら、あなたの口癖や\n話し方を再現します。", bg: "bg-[#E88BA3]", delay: 0.1 },
    { icon: <Icons.MessageCircle />, title: "クチコミ返信が\n放置気味…", desc: "言葉が見つからず、\n気づけば数週間。お客様との絆を\n30秒で紡ぎ直せます。", bg: "bg-[#F5CC6D]", delay: 0.2 },
    { icon: <Icons.Users />, title: "任せたいけど\n任せられない", desc: "スタッフに頼みたいけど、\n店の雰囲気が壊れないか心配…\n『店の人格』を設定すれば解決。", bg: "bg-[#4DB39A]", delay: 0.3 },
  ];

  const faqs = [
    { q: "AIだと不自然な文章になりませんか？", a: "MisePoは過去の投稿を学習し、あなたの口癖や語尾まで再現します。フォロワーからも「いつも通りですね」と言われるほど自然な文章が生成されるため、AI特有の堅苦しさはありません。" },
    { q: "操作が難しそうです...", a: "メモを1行打つだけです。LINEでメッセージを送るのと変わりません。PWA技術により0.5秒で起動するため、忙しい現場でもストレスなく使えます。" },
    { q: "他店と同じような文章になりませんか？", a: "大丈夫です。『熱い店長』『親しみやすいスタッフ』など、投稿の目的に合わせて人格を切り替えられるため、あなたのお店だけの個性が出ます。" },
    { q: "生成された文章はそのまま使えますか？", a: "はい、完成度が高いのでそのままコピーペーストして投稿できます。さらにこだわりたい方は、少しだけ手を加えることで、より『自分らしさ』を出せます。" },
  ];

  return (
    <div className="min-h-screen bg-[#f9f5f2] text-slate-900 font-sans selection:bg-[#F5CC6D]">
      <Header scrolled={scrolled} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} loginWithGoogle={loginWithGoogle} />
      <HeroSection />
      <ProblemSection problems={problems} isMobile={isMobile} />
      <UnifiedFlowSection />
      <DemoSection
        demoScenarios={demoScenarios}
        activeScenarioIdx={activeScenarioIdx}
        setActiveScenarioIdx={setActiveScenarioIdx}
        isDemoGenerating={isDemoGenerating}
        demoResult={demoResult}
        handleDemoGenerate={handleDemoGenerate}
      />
      <BenefitSection />
      <FeaturesSection isMobile={isMobile} />
      <PWASection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection faqs={faqs} openFaq={openFaq} setOpenFaq={setOpenFaq} />
      <CTASection />
      <Footer />

      <style jsx global>{`
                :root {
                  --border-bold: 3px solid #000;
                  --shadow-neo: 5px 5px 0px 0px #000;
                  --shadow-neo-lg: 8px 8px 0px 0px #000;
                  --shadow-neo-sm: 3px 3px 0px 0px #000;
                }
                html { scroll-behavior: smooth; scroll-padding-top: 80px; }
                .neo-brutalism-card {
                  background: #fff;
                  border: var(--border-bold);
                  box-shadow: var(--shadow-neo);
                  border-radius: 1rem;
                  transition: all 0.2s ease;
                }
                .neo-brutalism-card:hover {
                  transform: translate(-2px, -2px);
                  box-shadow: 7px 7px 0px 0px #000;
                }
                .neo-brutalism-button {
                  border: var(--border-bold);
                  box-shadow: var(--shadow-neo-sm);
                  border-radius: 0.75rem;
                  transition: all 0.1s ease;
                }
                .neo-brutalism-button:active {
                  transform: translate(2px, 2px);
                  box-shadow: 0px 0px 0px 0px #000;
                }
                .gradient-text { 
                  -webkit-text-stroke: 1px #000;
                  color: #8fa9e9;
                  text-shadow: 3px 3px 0px #000;
                }
                @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(1deg); } }
                .animate-float { animation: float 4s ease-in-out infinite; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
    </div>
  );
}
