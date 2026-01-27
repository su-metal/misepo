"use client";
import React from 'react';

export const Footer = () => {
    return (
        <footer className="bg-black text-white py-20 border-t-[6px] border-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-4xl font-black mb-6 uppercase italic tracking-tighter">MisePo</h3>
                        <p className="text-white/60 font-bold text-lg leading-relaxed max-w-sm italic">
                            店舗の魅力を、AIの力で世界へ。<br />
                            忙しい店主のための広報パートナー。
                        </p>
                    </div>
                    <div>
                        <h4 className="font-black text-xl mb-6 uppercase tracking-widest text-[#F5CC6D]">Service</h4>
                        <ul className="space-y-4 text-lg font-bold">
                            <li><a href="/#features" className="hover:text-[#E88BA3] transition-colors underline decoration-2 underline-offset-4">機能一覧</a></li>
                            <li><a href="/#pricing" className="hover:text-[#E88BA3] transition-colors underline decoration-2 underline-offset-4">料金プラン</a></li>
                            <li><a href="/#demo" className="hover:text-[#E88BA3] transition-colors underline decoration-2 underline-offset-4">導入事例</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-black text-xl mb-6 uppercase tracking-widest text-[#4DB39A]">Support</h4>
                        <ul className="space-y-4 text-lg font-bold">
                            <li><a href="/#solution" className="hover:text-[#E88BA3] transition-colors underline decoration-2 underline-offset-4">MisePoについて</a></li>
                            <li><a href="mailto:support@misepo.jp" className="hover:text-[#E88BA3] transition-colors underline decoration-2 underline-offset-4">お問い合わせ</a></li>
                            <li><a href="/terms" className="hover:text-[#E88BA3] transition-colors underline decoration-2 underline-offset-4">利用規約</a></li>
                            <li><a href="/privacy" className="hover:text-[#E88BA3] transition-colors underline decoration-2 underline-offset-4">プライバシーポリシー</a></li>
                            <li><a href="/commercial-law" className="hover:text-[#E88BA3] transition-colors underline decoration-2 underline-offset-4">特定商取引法に基づく表記</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t-[2px] border-white/10 pt-10 text-center">
                    <p className="text-white/30 font-black text-sm uppercase tracking-[0.3em]">
                        © {new Date().getFullYear()} MisePo. Engineered for Excellence.
                    </p>
                </div>
            </div>
        </footer>
    );
};
