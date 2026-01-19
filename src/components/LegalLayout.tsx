"use client";

import React, { useState } from 'react';

// Reusing Icons from LandingPage to ensure consistency
const SmartphoneIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
);

const MenuIcon = ({ className = "" }: { className?: string }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

interface LegalLayoutProps {
    children: React.ReactNode;
    title: string;
    lastUpdated?: string;
}

export default function LegalLayout({ children, title, lastUpdated }: LegalLayoutProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* Header - Matching LandingPage Style */}
            <header className="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14">
                        <a href="/" className="flex items-center gap-2 cursor-pointer group">
                            <div className="bg-gradient-to-br from-indigo-600 to-pink-500 p-1.5 rounded-lg text-white shadow-md group-hover:scale-105 transition-transform duration-300">
                                <SmartphoneIcon size={20} />
                            </div>
                            <span className="font-black text-xl tracking-tight text-slate-800">MisePo</span>
                        </a>

                        <nav className="hidden md:flex items-center space-x-6">
                            <a href="/" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                                トップページ
                            </a>
                            <a href="/start" className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-300">
                                アプリを始める
                            </a>
                        </nav>

                        <div className="md:hidden flex items-center">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 hover:text-slate-900 focus:outline-none p-2">
                                <MenuIcon />
                            </button>
                        </div>
                    </div>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xl animate-fade-in">
                        <div className="px-4 py-6 space-y-3">
                            <a href="/" className="block px-4 py-3 text-base font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">トップページ</a>
                            <a href="/start" className="block px-4 py-3 text-base font-bold text-indigo-600 bg-indigo-50 rounded-xl transition-colors mt-2">アプリを始める</a>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-[2rem] shadow-xl shadow-indigo-100/50 border border-slate-100 p-8 md:p-12 lg:p-16">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">{title}</h1>
                        {lastUpdated && (
                            <div className="inline-block px-4 py-1.5 bg-slate-100 rounded-full text-xs font-bold text-slate-500">
                                最終更新日: {lastUpdated}
                            </div>
                        )}
                    </div>

                    {/* Custom Typography for Legal Text (Since Tailwind Typography plugin is not available via CDN default) */}
                    <div className="
                        [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mt-12 [&>h2]:mb-4 [&>h2]:pb-2 [&>h2]:border-b [&>h2]:border-gray-100 [&>h2]:flex [&>h2]:items-center [&>h2]:gap-3 
                        [&>h2]:before:content-[''] [&>h2]:before:block [&>h2]:before:w-1.5 [&>h2]:before:h-6 [&>h2]:before:bg-indigo-500 [&>h2]:before:rounded-full
                        [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mt-8 [&>h3]:mb-3
                        [&>p]:text-[15px] [&>p]:leading-8 [&>p]:mb-6 [&>p]:text-slate-600
                        [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul]:space-y-2 [&>ul]:text-slate-600
                        [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol]:space-y-2 [&>ol]:text-slate-600
                        [&_li]:leading-8 [&_li]:pl-1
                        font-medium
                    ">
                        {children}
                    </div>
                </div>
            </main>

            {/* Footer - Matching LandingPage Style */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-2">
                            <h3 className="text-2xl font-bold mb-4">MisePo</h3>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                                店舗の魅力を、AIの力で世界へ。<br />
                                忙しい店主のための広報パートナー。
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">サービス</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="/#features" className="hover:text-white transition-colors">機能一覧</a></li>
                                <li><a href="/#pricing" className="hover:text-white transition-colors">料金プラン</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">サポート</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="/#contact" className="hover:text-white transition-colors">お問い合わせ</a></li>
                                <li><a href="/terms" className="hover:text-white transition-colors">利用規約</a></li>
                                <li><a href="/privacy" className="hover:text-white transition-colors">プライバシーポリシー</a></li>
                                <li><a href="/commercial-law" className="hover:text-white transition-colors">特定商取引法に基づく表記</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                        © {new Date().getFullYear()} MisePo. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
