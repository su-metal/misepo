"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const MobileSiteFooter = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section className="bg-white pt-12 pb-24 px-6 text-slate-600">

            {/* Support Menu */}
            <div className="mb-12">
                <h3 className="text-xs font-bold mb-4 text-[#122646]">サポートメニュー</h3>
                <div className="border-t border-slate-200">
                    {[
                        { label: "初めての方へ", href: "#" },
                        { label: "ご利用ガイド", href: "#" },
                        { label: "よくあるご質問", href: "#" },
                        { label: "お問い合わせ", href: "#" }
                    ].map((item, index) => (
                        <a key={index} href={item.href} className="flex justify-between items-center py-4 border-b border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors">
                            <span>{item.label}</span>
                            <Icons.ChevronDown size={16} className="text-slate-400 -rotate-90" />
                        </a>
                    ))}
                </div>
            </div>

            {/* Page Top */}
            <div className="flex justify-end mb-8 border-b border-slate-200 pb-2">
                <button onClick={scrollToTop} className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#1f29fc] transition-colors">
                    <span>ページのトップに戻る</span>
                    <div className="bg-slate-200 rounded-full p-0.5">
                        <Icons.ChevronUp size={12} className="text-slate-500" />
                    </div>
                </button>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap gap-y-2 gap-x-4 justify-center mb-8 text-[10px] text-slate-500">
                <a href="#" className="hover:underline">ご利用規約</a>
                <span className="text-slate-300">|</span>
                <a href="#" className="hover:underline">プライバシーポリシー</a>
                <span className="text-slate-300">|</span>
                <a href="#" className="hover:underline">セキュリティ</a>
                <span className="text-slate-300">|</span>
                <a href="#" className="hover:underline">特定商取引法に基づく表示</a>
                <span className="text-slate-300">|</span>
                <a href="#" className="hover:underline">会社概要</a>
            </div>

            {/* Logo & Copyright */}
            <div className="text-center">
                <div className="mb-4 inline-block">
                    <span className="font-bold text-2xl tracking-tight italic text-[#122646]" style={{ fontFamily: 'cursive' }}>
                        misepo
                    </span>
                </div>
                <p className="text-[10px] text-slate-400">
                    Copyright © Misepo All Rights Reserved.
                </p>
            </div>

        </section>
    );
};
