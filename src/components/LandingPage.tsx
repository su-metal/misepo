"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import HeroSection from './HeroSection';
import { Header } from './landing-page/Header';
import { BenefitSection } from './landing-page/BenefitSection';
import { UnifiedFlowSection } from './landing-page/UnifiedFlowSection';
import { DemoSection } from './landing-page/DemoSection';
import { PricingSection } from './landing-page/PricingSection';
import { FAQSection } from './landing-page/FAQSection';
import { CTASection } from './landing-page/CTASection';
import { AppScreensSection } from './landing-page/AppScreensSection';
import { ReviewResponseSection } from './landing-page/ReviewResponseSection';
import { ProblemSection } from './landing-page/ProblemSection';
import { TestimonialsSection } from './landing-page/TestimonialsSection';
import { Footer } from './landing-page/Footer';
import { Icons } from './LandingPageIcons';

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
    result: `【お知らせ】
いつもミセポドーナツをご利用いただき、誠にありがとうございます！

明日、〇月〇日(〇)は、より美味しいドーナツと快適な空間をご提供するため、機材メンテナンスを実施いたします。

つきましては、誠に勝手ながら明日の営業時間を15時閉店とさせていただきます。ご迷惑をおかけしますが、何卒ご理解とご協力をお願い申し上げます。

翌日からは通常通り営業いたしますので、皆様のご来店を心よりお待ちしております😊☕`
  }
];

export default function LandingPage() {
  const { user, loginWithGoogle } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleDemoGenerate = async () => {
    setIsDemoGenerating(true);
    // Simulate generation process
    await new Promise(resolve => setTimeout(resolve, 1500));
    setDemoResult("");
    await new Promise(resolve => setTimeout(resolve, 1000));
    setDemoResult(demoScenarios[activeScenarioIdx].result);
    setIsDemoGenerating(false);
  };



  const faqs = [
    { q: "AIだと不自然な文章になりませんか？", a: "お手本となる投稿を登録するだけで、あなたの口癖や語尾まで再現します。フォロワーからも「いつも通りですね」と言われるほど自然な文章が生成されるため、AI特有の堅苦しさはありません。" },
    { q: "操作が難しそうです...", a: "メモを1行打つだけです。LINEでメッセージを送るのと変わりません。PWA技術により0.5秒で起動するため、忙しい現場でもストレスなく使えます。" },
    { q: "他店と同じような文章になりませんか？", a: "ご安心ください。あらかじめ「熱い店長」「親しみやすいスタッフ」など、あなた自身で設定した独自のペルソナに基づいて文章を生成します。お店のカラーに合わせた専用の文体を登録できるため、他店とは被らない唯一無二の個性がしっかり出せます。" },
    { q: "生成された文章はそのまま使えますか？", a: "はい、完成度が高いのでそのままコピーペーストして投稿できます。さらにこだわりたい方は、少しだけ手を加えることで、より『自分らしさ』を出せます。" },
  ];

  const problems = [
    {
      icon: <Icons.MessageCircle size={24} />,
      title: '毎日投稿のネタが\n思い浮かばない',
      desc: '営業後に「今日は何を投稿しよう...」と悩んで、結局何もしないまま終わっている。',
      bg: 'bg-white',
      delay: 0,
    },
    {
      icon: <Icons.Star size={24} />,
      title: '悪い口コミへの\n返信が怖い',
      desc: '★1のレビューをもらったとき、何と返せばいいか分からず放置してしまっている。',
      bg: 'bg-white',
      delay: 0.1,
    },
    {
      icon: <Icons.TrendingUp size={24} />,
      title: '投稿しても\n集客につながらない',
      desc: 'インスタをやっているのにフォロワーが増えず、来店数にも変化がない。',
      bg: 'bg-white',
      delay: 0.2,
    },
    {
      icon: <Icons.Users size={24} />,
      title: 'スタッフに任せると\nトーンが揃わない',
      desc: '投稿者によって文体がバラバラで、お店のブランドイメージが統一できていない。',
      bg: 'bg-white',
      delay: 0.3,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f0eae4] text-[#282d32] font-inter selection:bg-[#1823ff] selection:text-white">
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} loginWithGoogle={loginWithGoogle} user={user} />
      <HeroSection />
      <ProblemSection problems={problems} isMobile={isMobile} />
      <AppScreensSection isMobile={isMobile} />
      <UnifiedFlowSection isMobile={isMobile} />
      <ReviewResponseSection />
      <DemoSection
        demoScenarios={demoScenarios}
        activeScenarioIdx={activeScenarioIdx}
        setActiveScenarioIdx={setActiveScenarioIdx}
        isDemoGenerating={isDemoGenerating}
        demoResult={demoResult}
        handleDemoGenerate={handleDemoGenerate}
        isMobile={isMobile}
      />
      <BenefitSection isMobile={isMobile} />
      <PricingSection isMobile={isMobile} />
      <TestimonialsSection isMobile={isMobile} />
      <FAQSection faqs={faqs} openFaq={openFaq} setOpenFaq={setOpenFaq} isMobile={isMobile} />
      <CTASection isMobile={isMobile} />
      <Footer />

    </div>
  );
}
