"use client";
import React from 'react';

export const Footer = () => {
    return (
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
                            <li><a href="#" className="hover:text-white">機能一覧</a></li>
                            <li><a href="#" className="hover:text-white">料金プラン</a></li>
                            <li><a href="#" className="hover:text-white">導入事例</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">サポート</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white">ヘルプセンター</a></li>
                            <li><a href="#" className="hover:text-white">お問い合わせ</a></li>
                            <li><a href="/terms" className="hover:text-white">利用規約</a></li>
                            <li><a href="/privacy" className="hover:text-white">プライバシーポリシー</a></li>
                            <li><a href="/commercial-law" className="hover:text-white">特定商取引法に基づく表記</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} MisePo. All rights reserved.
                </div>
            </div>
        </footer>
    );
};
