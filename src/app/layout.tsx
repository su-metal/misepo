
import React from 'react';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "MisePo (ミセポ) - 店舗向けAI投稿作成アシスタント",
  description: "飲食店や美容室などの実店舗に特化したAI投稿作成ツール。数行のメモから、お店の「らしさ」を活かしたSNS投稿やGoogleマップのクチコミ返信を10秒で生成します。",
  keywords: ["MisePo", "ミセポ", "店舗集客", "SNS運用", "AI投稿作成", "インスタ運用", "MEO対策", "クチコミ返信", "飲食店集客", "美容室集客"],
  authors: [{ name: "MisePo Team" }],
  robots: "index, follow",
  alternates: {
    canonical: "https://misepo.jp",
  },
  openGraph: {
    title: "MisePo (ミセポ) - 店舗向けAI投稿作成アシスタント",
    description: "飲食店や美容室などの実店舗に特化したAI投稿作成ツール。数行のメモから、お店の「らしさ」を活かしたSNS投稿を生成。",
    url: "https://misepo.jp",
    siteName: "MisePo",
    images: [
      {
        url: "/og-image.png", // Ensure this exists or the user can add it later
        width: 1200,
        height: 630,
        alt: "MisePo - 店舗向けAI投稿作成アシスタント",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MisePo (ミセポ) - 店舗向けAI投稿作成アシスタント",
    description: "数行のメモからお店のSNS投稿を10秒で生成。実店舗特化のAIアシスタント。",
    images: ["/og-image.png"],
  },
};

import { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#E8F1F2',
  viewportFit: 'cover',
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "MisePo (ミセポ)",
  "operatingSystem": "Web, Android, iOS",
  "applicationCategory": "BusinessApplication",
  "description": "飲食店や美容室などの実店舗に特化したAI投稿作成ツール。SNS投稿やGoogleマップのクチコミ返信を自動生成します。",
  "offers": {
    "@type": "Offer",
    "price": "980",
    "priceCurrency": "JPY"
  }
};

import { Feedback } from '../components/Feedback';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        {/* Tailwind via CDN for compatibility with existing styling approach without build setup */}
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Montserrat:wght@800;900&family=Noto+Sans+JP:wght@400;500;700;900&family=Noto+Serif+JP:wght@400;500;600;700&display=swap" rel="stylesheet" />
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


        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
