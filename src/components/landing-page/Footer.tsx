"use client";
import React from 'react';

export const Footer = () => {
    return (
        <footer className="bg-slate-900 text-white py-20 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-3xl font-bold mb-6 tracking-tight text-white">MisePo</h3>
                        <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-sm">
                            店舗の魅力を、AIの力で世界へ。<br />
                            忙しい店主のための広報パートナー。
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-slate-500">Service</h4>
                        <ul className="space-y-4 text-base font-medium text-slate-300">
                            <li><a href="/#features" className="hover:text-white transition-colors">機能一覧</a></li>
                            <li><a href="/#pricing" className="hover:text-white transition-colors">料金プラン</a></li>
                            <li><a href="/#demo" className="hover:text-white transition-colors">導入事例</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-slate-500">Support</h4>
                        <ul className="space-y-4 text-base font-medium text-slate-300">
                            <li><a href="/#solution" className="hover:text-white transition-colors">MisePoについて</a></li>
                            <li><a href="mailto:support@misepo.jp" className="hover:text-white transition-colors">お問い合わせ</a></li>
                            <li><a href="/terms" className="hover:text-white transition-colors">利用規約</a></li>
                            <li><a href="/privacy" className="hover:text-white transition-colors">プライバシーポリシー</a></li>
                            <li><a href="/commercial-law" className="hover:text-white transition-colors">特定商取引法に基づく表記</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-800 pt-10 text-center">
                    <p className="text-slate-600 font-medium text-sm">
                        © {new Date().getFullYear()} MisePo Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};
