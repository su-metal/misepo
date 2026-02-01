"use client";
import React, { ReactNode, useState, useEffect } from 'react';
import { Icons } from '../LandingPageIcons'; // Assuming generic icons live here or can be imported

interface SplitLandingLayoutProps {
    leftContent: ReactNode;
    children: ReactNode; // Right panel content (The "App" part)
}

export default function SplitLandingLayout({ leftContent, children }: SplitLandingLayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Monitor scroll of the RIGHT panel (desktop) or Window (mobile) for effects
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop;
        setScrolled(scrollTop > 20);
    };

    return (
        <div className="min-h-screen bg-[var(--ichizen-blue)] font-sans antialiased selection:bg-[var(--ichizen-green)] selection:text-[var(--ichizen-blue)]">

            {/* MOBILE HEADER (Visible only on mobile) */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[var(--ichizen-blue)] text-white">
                <div className="font-bold text-xl tracking-tight flex items-center gap-2">
                    {/* Mobile Logo Placeholder - passed via leftContent usually, but specific header here */}
                    <span>MisePo</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm active:scale-95 transition-transform"
                >
                    {isMobileMenuOpen ? <Icons.X size={20} /> : <Icons.Menu size={20} />}
                </button>
            </header>

            {/* MOBILE MENU OVERLAY */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-[var(--ichizen-blue)] pt-24 px-6 md:hidden animate-fade-in">
                    <nav className="flex flex-col gap-6 text-white text-lg font-bold">
                        <a href="#features" onClick={() => setIsMobileMenuOpen(false)}>機能</a>
                        <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)}>料金</a>
                        <a href="/login" onClick={() => setIsMobileMenuOpen(false)}>ログイン</a>
                        <a href="/start" className="bg-[var(--ichizen-green)] text-[var(--ichizen-blue)] px-6 py-4 rounded-xl text-center shadow-lg">
                            無料で始める
                        </a>
                    </nav>
                </div>
            )}

            {/* DESKTOP SPLIT LAYOUT */}
            <div className="flex h-screen overflow-hidden flex-col md:flex-row">

                {/* LEFT PANEL (Fixed Billboard) */}
                {/* Hidden on mobile default, content usually merged or reimagined for mobile */}
                <div className="hidden md:flex md:w-1/2 lg:w-5/12 xl:w-1/2 flex-col justify-center p-12 lg:p-16 xl:p-24 relative z-10">
                    <div className="relative z-20 h-full flex flex-col justify-center">
                        {leftContent}
                    </div>

                    {/* Background Decorative Elements for Left Panel */}
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                        {/* Subtle pattern or gradient overlay if needed */}
                        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px]" />
                        <div className="absolute bottom-[-10%] right-[20%] w-[300px] h-[300px] bg-[var(--ichizen-green)]/10 rounded-full blur-[80px]" />
                    </div>
                </div>

                {/* RIGHT PANEL (Scrollable App Container) */}
                <div className="flex-1 w-full md:w-1/2 lg:w-7/12 xl:w-1/2 h-full relative z-0 md:p-6 lg:p-12 flex items-center justify-center transition-all duration-700 overflow-hidden">

                    {/* THE SMARTPHONE FRAME / CONTAINER */}
                    <div
                        className="w-full h-full md:h-[90vh] md:max-w-[420px] bg-[var(--ichizen-beige)] md:rounded-[54px] shadow-2xl overflow-y-auto overflow-x-hidden scrollbar-hide relative flex flex-col pt-20 md:pt-0 ring-1 ring-white/10 md:ring-[12px] md:ring-slate-900/5"
                        onScroll={handleScroll}
                    >
                        {/* MOCK STATUS BAR (Desktop Only for that App feel) */}
                        <div className="hidden md:flex sticky top-0 left-0 right-0 h-10 bg-[var(--ichizen-beige)]/90 backdrop-blur-md z-[60] px-8 items-center justify-between text-[var(--ichizen-blue)]/40 font-bold text-[10px] tracking-tight pointer-events-none">
                            <span>9:41</span>
                            <div className="flex gap-1.5 items-center">
                                <div className="w-3.5 h-3.5 border border-current rounded-sm opacity-50" />
                                <div className="w-4 h-2 bg-current rounded-full" />
                            </div>
                        </div>

                        {/* Desktop Menu Float (Top Right inside the beige container) */}
                        <div className={`hidden md:flex absolute top-12 right-6 z-50 transition-all duration-300 ${scrolled ? 'translate-y-[-10px]' : ''}`}>
                            <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[var(--ichizen-blue)] hover:scale-110 transition-transform cursor-pointer group">
                                <Icons.Menu size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* Main Content Area */}
                        <main className="flex-1">
                            {children}
                        </main>

                        {/* Mobile Footer Spacing if needed */}
                        <div className="h-12 md:hidden" />
                    </div>
                </div>
            </div>

        </div>
    );
}
