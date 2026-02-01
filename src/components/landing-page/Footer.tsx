"use client";
import React from 'react';

export const Footer = () => {
    return (
        <footer className="bg-[#282d32] text-white py-24 md:py-48 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-24 mb-24 items-end">
                    <div className="flex flex-col items-start">
                        <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-12">MISEPO</h2>
                        <p className="text-xl md:text-2xl font-bold text-slate-400 max-w-sm leading-tight">
                            店舗の魅力を、AIの力で世界へ。
                            忙しい店主のための広報パートナー。
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-12 text-left">
                        <div className="space-y-6">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Navigation</span>
                            <ul className="space-y-4 text-lg font-bold">
                                <li><a href="/#features" className="hover:text-[#1823ff] transition-colors">FEATURES</a></li>
                                <li><a href="/#pricing" className="hover:text-[#1823ff] transition-colors">PRICING</a></li>
                                <li><a href="/#demo" className="hover:text-[#1823ff] transition-colors">DEMO</a></li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Legal</span>
                            <ul className="space-y-4 text-lg font-bold">
                                <li><a href="/terms" className="hover:text-[#1823ff] transition-colors">TERMS</a></li>
                                <li><a href="/privacy" className="hover:text-[#1823ff] transition-colors">PRIVACY</a></li>
                                <li><a href="/commercial-law" className="hover:text-[#1823ff] transition-colors">SPECIFIED</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="pt-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-sm font-bold text-slate-500 tracking-widest">© {new Date().getFullYear()} MISEPO INC.</p>
                    <div className="flex gap-8 text-[10px] font-black tracking-[0.4em] text-slate-500 uppercase">
                        <span>TOKYO</span>
                        <span>SASEBO</span>
                        <span>AI NATIVE</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
