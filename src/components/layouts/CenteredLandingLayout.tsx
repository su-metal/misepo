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
        <div className="min-h-screen bg-[var(--ichizen-blue)] font-sans antialiased text-white relative selection:bg-white selection:text-[var(--ichizen-blue)]">

            {/* MOBILE HEADER (Visible only on mobile/tablet) */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[var(--ichizen-blue)]/80 backdrop-blur-md">
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
                <div className="fixed inset-0 z-50 bg-[var(--ichizen-blue)] pt-24 px-6 md:hidden animate-fade-in text-white">
                    <nav className="flex flex-col gap-6 text-lg font-bold items-center">
                        <a href="/start" className="bg-white text-[var(--ichizen-blue)] px-8 py-3 rounded-full shadow-lg">
                            アプリをダウンロード
                        </a>
                        <a href="/login" onClick={() => setIsMobileMenuOpen(false)}>ログイン</a>
                    </nav>
                </div>
            )}

            {/* FIXED SIDE PANELS (Background) */}
            <div className="hidden xl:block fixed inset-0 z-0 pointer-events-none">
                <div className="max-w-[1600px] mx-auto h-full relative">
                    {/* LEFT PANEL */}
                    <div className="absolute left-0 top-0 bottom-0 w-[300px] flex flex-col justify-center items-end pr-8 pointer-events-auto">
                        {leftContent}
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="absolute right-0 top-0 bottom-0 w-[300px] flex flex-col justify-center items-start pl-8 pointer-events-auto">
                        {rightContent}
                    </div>
                </div>
            </div>

            {/* SCROLLABLE CONTENT (Center Panel) */}
            <div className="relative z-10 w-full min-h-screen flex justify-center items-start pt-[8vh] md:pt-[10vh] pb-0">
                <div className="w-full md:w-[430px] bg-white md:rounded-t-[64px] shadow-2xl relative ring-1 ring-black/5 md:border-x md:border-t md:border-white/50 overflow-hidden">

                    {/* Status Bar Mock */}
                    <div className="sticky top-0 left-0 right-0 h-14 z-50 flex justify-between items-center px-8 bg-white/90 backdrop-blur-sm mix-blend-multiply text-slate-900/40">
                        <span className="text-[12px] font-bold">9:41</span>
                        <div className="flex gap-1.5">
                            <span className="w-4 h-2.5 bg-current rounded-[2px] border border-current"></span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="pb-safe min-h-[90vh]">
                        {children}
                    </div>

                    {/* Home Indicator (Pseudo) */}
                    <div className="h-1 bg-transparent w-full"></div>
                </div>
            </div>

            {/* Background Glow */}
            <div className="fixed inset-0 pointer-events-none z-[-1]">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/20 rounded-full blur-[120px]"></div>
            </div>

        </div>
    );
}
