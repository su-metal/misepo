
import React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { Inter, Montserrat, Noto_Sans_JP, Noto_Serif_JP } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  display: 'swap',
  variable: '--font-inter',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['800', '900'],
  display: 'swap',
  variable: '--font-montserrat',
});

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  display: 'swap',
  variable: '--font-noto-sans-jp',
});

const notoSerifJP = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-serif-jp',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.misepo.jp"),
  title: "美容院・飲食店のSNS投稿＆口コミ返信をAI自動作成 | MisePo（ミセポ）",
  description: "美容院・飲食店・カフェなど実店舗向けSNS運用AIツール。Googleマップの口コミ返信・インスタ投稿文をメモ一行から10秒で自動生成。7日間無料体験。",
  keywords: [
    "美容院 インスタ 投稿 例文",
    "Google口コミ 返信 テンプレート",
    "飲食店 SNS 集客",
    "悪い口コミ 返信",
    "MEO対策",
    "口コミ返信 自動生成",
    "インスタ投稿 自動生成",
    "MisePo",
    "ミセポ",
    "店舗集客",
    "SNS運用 AI",
    "美容室集客",
    "飲食店集客",
    "クチコミ返信 AI",
    "SNS投稿 自動化",
  ],
  authors: [{ name: "MisePo Team" }],
  robots: "index, follow",
  alternates: {
    canonical: "https://www.misepo.jp",
  },
  openGraph: {
    title: "美容院・飲食店のSNS投稿＆口コミ返信をAI自動作成 | MisePo（ミセポ）",
    description: "美容院・飲食店・カフェなど実店舗向けSNS運用AIツール。Googleマップの口コミ返信・インスタ投稿文をメモ一行から10秒で自動生成。",
    siteName: "MisePo（ミセポ）",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "美容院・飲食店のSNS投稿＆口コミ返信をAI自動作成 | MisePo（ミセポ）",
    description: "美容院・飲食店向けSNS運用AIツール。Google口コミ返信・インスタ投稿をメモ一行から10秒で自動生成。",
  },
};

import { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#E8F1F2',
  viewportFit: 'cover',
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "MisePo (ミセポ)",
    "operatingSystem": "Web, Android, iOS",
    "applicationCategory": "BusinessApplication",
    "url": "https://www.misepo.jp",
    "description": "飲食店や美容室などの実店舗に特化したAI投稿作成ツール。SNS投稿やGoogleマップのクチコミ返信を自動生成します。",
    "offers": [
      { "@type": "Offer", "name": "Entry", "price": "980", "priceCurrency": "JPY" },
      { "@type": "Offer", "name": "Standard", "price": "1980", "priceCurrency": "JPY" },
      { "@type": "Offer", "name": "Professional", "price": "2980", "priceCurrency": "JPY" }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "AIだと不自然な文章になりませんか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "お手本となる投稿を登録するだけで、あなたの口癖や語尾まで再現します。フォロワーからも「いつも通りですね」と言われるほど自然な文章が生成されるため、AI特有の堅苦しさはありません。"
        }
      },
      {
        "@type": "Question",
        "name": "操作が難しそうです...",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "メモを1行打つだけです。LINEでメッセージを送るのと変わりません。PWA技術により0.5秒で起動するため、忙しい現場でもストレスなく使えます。"
        }
      },
      {
        "@type": "Question",
        "name": "他店と同じような文章になりませんか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ご安心ください。あらかじめ「熱い店長」「親しみやすいスタッフ」など、あなた自身で設定した独自のペルソナに基づいて文章を生成します。お店のカラーに合わせた専用の文体を登録できるため、他店とは被らない唯一無二の個性がしっかり出せます。"
        }
      },
      {
        "@type": "Question",
        "name": "生成された文章はそのまま使えますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "はい、完成度が高いのでそのままコピーペーストして投稿できます。さらにこだわりたい方は、少しだけ手を加えることで、より『自分らしさ』を出せます。"
        }
      },
      {
        "@type": "Question",
        "name": "美容院のGoogle口コミ返信はどうやって書けばいいですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Google口コミへの返信は、感謝の言葉・具体的な言及・再来店の促しの3点を含めるのが基本です。MisePoなら口コミ内容を貼り付けるだけで、誠実で温かみのある返信文を10秒で自動生成します。★1〜2の低評価口コミへの対応文も、炎上リスクを回避した言葉選びで生成できます。"
        }
      },
      {
        "@type": "Question",
        "name": "飲食店のインスタグラム投稿ネタが思いつかないときはどうすればいいですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "「今日のランチ」「新メニュー入荷」「雨の日サービス」など一言メモするだけで、MisePoがお店の雰囲気に合ったインスタグラム投稿文を自動生成します。ハッシュタグも自動で提案するため、ネタ切れや投稿内容に悩む時間をゼロにできます。"
        }
      }
    ]
  }
];

import { Feedback } from '../components/Feedback';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${inter.variable} ${montserrat.variable} ${notoSansJP.variable} ${notoSerifJP.variable}`}>
      <head>
        {/* Theme color managed via viewport export */}

        {/* Google Analytics (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XN6G9DC24K"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XN6G9DC24K');
          `
        }} />

        <script src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`} async defer></script>


        {jsonLd.map((ld, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
          />
        ))}
      </head>
      <body className="relative">
        {/* Global Atmosphere Background */}
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none select-none bg-studio-stage">
          {/* Subtle Studio Grid */}
          <div className="absolute inset-0 bg-pattern-grid-magazine opacity-[0.05]" />
          <div className="absolute inset-0 bg-pattern-dots opacity-[0.2]" />

          {/* Dynamic Glow Orbs - Optimized with .glow-orb class and will-change */}
          <div className="glow-orb absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-gradient-to-br from-[#80CAFF]/20 to-transparent rounded-full blur-[120px] animate-pulse-slow" style={{ willChange: 'transform, opacity' }} />
          <div className="glow-orb absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-gradient-to-br from-[#F87171]/10 to-transparent rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s', willChange: 'transform, opacity' }} />
          <div className="glow-orb absolute top-[20%] right-[10%] w-[30vw] h-[30vw] bg-gradient-to-br from-[#C084FC]/15 to-transparent rounded-full blur-[80px] animate-pulse-slow" style={{ animationDelay: '2s', willChange: 'transform, opacity' }} />

          {/* Minimal Status Edge Labels */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 vertical-text-edge hidden xl:flex items-center gap-4 opacity-20 transition-opacity hover:opacity-100 duration-700">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#2b2b2f]">MisePo AI Studio v2.4.0</span>
            <div className="h-24 w-[1px] bg-[#2b2b2f]" />
          </div>

          <div className="absolute right-8 top-1/2 -translate-y-1/2 vertical-text-edge hidden xl:flex items-center gap-4 opacity-20 transition-opacity hover:opacity-100 duration-700">
            <div className="h-24 w-[1px] bg-[#2b2b2f]" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#2b2b2f]">Creative Flow State</span>
          </div>

          {/* Subtle Vignette Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(0,0,0,0.03)_100%)]" />
        </div>

        <div id="root" className="relative z-10">{children}</div>
        <Feedback />
      </body>
    </html>
  );
}
