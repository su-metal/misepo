
import React from 'react';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "MisePo - 店舗向けAI投稿作成",
  description: "An AI-powered social media post generator specialized for physical businesses like restaurants and salons.",


  robots: "noindex, nofollow",
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" />
        {/* Tailwind via CDN for compatibility with existing styling approach without build setup */}
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Montserrat:wght@800;900&family=Noto+Sans+JP:wght@400;500;700;900&family=Noto+Serif+JP:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {/* Theme color managed via viewport export */}

        {/* Import Map for external dependencies if not using package.json dependencies */}
        <script type="importmap" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "imports": {
              "@google/genai": "https://esm.sh/@google/genai@^1.34.0",
              "react-dom/client": "https://esm.sh/react-dom@^19.2.3/client",
              "react/": "https://esm.sh/react@^19.2.3/",
              "react": "https://esm.sh/react@^19.2.3",
              "react-dom": "https://esm.sh/react-dom@^19.2.3",
              "react-dom/": "https://esm.sh/react-dom@^19.2.3/"
            }
          })
        }} />

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
      </head>
      <body className="relative">
        {/* Global Atmosphere Background */}
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none select-none">
          {/* Base Dot Pattern */}
          <div className="absolute inset-0 bg-pattern-dots opacity-[0.4]" />

          {/* Giant Decorative Typography */}
          <div className="absolute top-[5%] -left-[5%] bg-typo-giant text-slate-400/10 text-[25vw] rotate-[-5deg]">
            MISE
          </div>
          <div className="absolute bottom-[10%] -right-[5%] bg-typo-giant text-slate-400/10 text-[20vw] rotate-[3deg]">
            PO
          </div>
          <div className="absolute top-[40%] right-[10%] bg-typo-giant text-slate-300/20 text-[10vw] uppercase">
            AI Creative
          </div>

          {/* Premium Floating Orbs */}
          <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#80CAFF]/10 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#C084FC]/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-[30%] left-[20%] w-[30vw] h-[30vw] bg-[#F87171]/5 rounded-full blur-[80px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
        </div>

        <div id="root" className="relative z-10">{children}</div>
        <Feedback />
      </body>
    </html>
  );
}
