"use client";
import React, { ReactNode, useState } from 'react';
import { Icons } from '../LandingPageIcons';

interface CenteredLandingLayoutProps {
    leftContent: ReactNode;
    rightContent: ReactNode;
    children: ReactNode; // Helper for Center content (Phone)
}

export default function CenteredLandingLayout({ leftContent, rightContent, children }: CenteredLandingLayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[var(--ichizen-beige)] font-sans antialiased text-[var(--ichizen-blue)] overflow-hidden relative">

            {/* MOBILE HEADER (Visible only on mobile/tablet) */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
                <div className="font-bold text-xl tracking-tight italic" style={{ fontFamily: 'cursive' }}>
                    misepo
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center backdrop-blur-sm active:scale-95 transition-transform shadow-sm"
                >
                    {isMobileMenuOpen ? <Icons.X size={20} /> : <Icons.Menu size={20} />}
                </button>
            </header>

            {/* MOBILE MENU OVERLAY */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-[var(--ichizen-blue)] pt-24 px-6 md:hidden animate-fade-in text-white">
                    <nav className="flex flex-col gap-6 text-lg font-bold items-center">
                        <a href="/start" className="bg-white text-[var(--ichizen-blue)] px-8 py-3 rounded-full shadow-lg">
                            アプリをダウンロード
                        </a>
                        <a href="/login" onClick={() => setIsMobileMenuOpen(false)}>ログイン</a>
                    </nav>
                </div>
            )}

            {/* MAIN CONTAINER */}
            <div className="flex h-screen w-full relative items-end justify-center pb-0">

                {/* LEFT PANEL (Desktop) */}
                <div className="hidden xl:flex absolute left-0 top-0 bottom-0 w-[calc(50%-240px)] flex-col justify-center items-end pr-12 z-10 pointer-events-none">
                    <div className="pointer-events-auto">
                        {leftContent}
                    </div>
                </div>

                {/* RIGHT PANEL (Desktop) */}
                <div className="hidden xl:flex absolute right-0 top-0 bottom-0 w-[calc(50%-240px)] flex-col justify-center items-start pl-12 z-10 pointer-events-none">
                    <div className="pointer-events-auto">
                        {rightContent}
                    </div>
                </div>

                {/* CENTER PANEL (The Smartphone / Bottom Sheet Shape) */}
                <div className="relative z-20 w-full md:w-[480px] h-full md:h-[92vh] transition-all duration-500">
                    <div className="w-full h-full bg-white md:rounded-t-[64px] shadow-2xl overflow-hidden relative ring-1 ring-black/5 md:border-x md:border-t md:border-white/50">

                        {/* Status Bar Mock (Keep or Remove based on preference, keeping for now but refined) */}
                        <div className="absolute top-0 left-0 right-0 h-14 z-50 flex justify-between items-center px-8 pointer-events-none opacity-40 mix-blend-multiply">
                            <span className="text-[12px] font-bold">9:41</span>
                            <div className="flex gap-1.5">
                                <span className="w-4 h-2.5 bg-current rounded-[2px] border border-current"></span>
                            </div>
                        </div>

                        {/* Scroll Container */}
                        <div className="w-full h-full overflow-y-auto scrollbar-hide pb-safe">
                            {children}
                        </div>

                        {/* Home Indicator - Hidden as it reaches bottom */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-black/10 rounded-full z-50 pointer-events-none hidden"></div>
                    </div>
                </div>

                {/* Background Decor (Subtle Blur) */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/20 rounded-full blur-[120px]"></div>
                </div>

            </div>
        </div>
    );
}
