
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
        {/* Tailwind via CDN for compatibility with existing styling approach without build setup */}
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Noto+Sans+JP:wght@400;500;700;900&family=Noto+Serif+JP:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#7f5af0" />

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
      <body>
        <div id="root">{children}</div>
        <Feedback />
      </body>
    </html>
  );
}
