"use client";

import React from 'react';
import { Icons } from './LandingPageIcons';
import CenteredLandingLayout from './layouts/CenteredLandingLayout';
import { MobileAppHero } from './landing-page-mobile/MobileAppHero';
import { MobileJourney } from './landing-page-mobile/MobileJourney';
import { MobileAbout } from './landing-page-mobile/MobileAbout';
import { MobileFeaturesAccordion } from './landing-page-mobile/MobileFeaturesAccordion';
import { MobileHowToUse } from './landing-page-mobile/MobileHowToUse';
import { MobileDetailedFeatures } from './landing-page-mobile/MobileDetailedFeatures';
import { MobilePricing } from './landing-page-mobile/MobilePricing';
import { MobileFooterCTA } from './landing-page-mobile/MobileFooterCTA';
import { MobileSiteFooter } from './landing-page-mobile/MobileSiteFooter';

export default function LandingPage() {

  // -- LEFT PANEL CONTENT (Logo & Brand) --
  const LeftPanelContent = (
    <div className="flex flex-col items-end text-right space-y-8 animate-fade-in-right text-white">
      {/* Brand Logo */}
      <div className="mb-4">
        <span className="font-bold text-6xl tracking-tight italic" style={{ fontFamily: 'cursive' }}>
          misepo
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-bold tracking-widest uppercase text-[#00de7a]">New Standard</p>
        <h1 className="text-4xl font-black leading-tight">
          AIなのに、<br />
          あなたの言葉。
        </h1>
      </div>
    </div>
  );

  // -- RIGHT PANEL CONTENT (CTA & Social) --
  const RightPanelContent = (
    <div className="flex flex-col items-start space-y-8 animate-fade-in-left">

      <div className="space-y-4">
        <p className="text-sm font-bold text-white/90">アプリをダウンロード</p>
        <a href="/start" className="group flex items-center gap-4 bg-[var(--ichizen-blue)] text-white px-6 py-4 rounded-2xl shadow-lg hover:bg-[var(--ichizen-blue)]/90 transition-all hover:-translate-y-1">
          <div className="bg-white/20 p-2 rounded-lg">
            <Icons.Sparkles size={24} />
          </div>
          <div className="text-left">
            <div className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Free Start</div>
            <div className="text-lg font-bold leading-none">MisePo</div>
          </div>
          <Icons.ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      <div className="pt-8 border-t border-white/20 w-full">
        <div className="flex gap-4">
          <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[var(--ichizen-blue)] transition-colors">
            <Icons.Instagram size={18} />
          </a>
          <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[var(--ichizen-blue)] transition-colors">
            <Icons.Twitter size={18} />
          </a>
        </div>
      </div>

    </div>
  );

  return (
    <CenteredLandingLayout
      leftContent={LeftPanelContent}
      rightContent={RightPanelContent}
    >
      {/* CENTER CONTENT (Smartphone View) */}
      <MobileAppHero />
      <MobileJourney />
      <MobileAbout />
      <MobileFeaturesAccordion />
      <MobileHowToUse />
      <MobileDetailedFeatures />
      <MobilePricing />
      <MobilePricing />
      <MobileFooterCTA />
      <MobileSiteFooter />
    </CenteredLandingLayout>
  );
}
