"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const PWASection = () => {
    return (
        <section id="pwa" className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                    <div className="lg:w-1/2">
                        <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold mb-3">マルチデバイス対応</div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                            スマホ、タブレット、PC。<br />
                            <span className="text-indigo-600">お好きなデバイスで。</span>
                        </h2>
                        <p className="text-base text-gray-600 mb-6 leading-relaxed">MisePoは、ブラウザがあればどこでも使えます。店外ではスマホ、バックヤードではタブレット、レジ横のPCなど、店舗のオペレーションに合わせて柔軟にご利用いただけます。</p>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600 mt-1"><Icons.Clock size={18} /></div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm">圧倒的な起動スピード</h3>
                                    <p className="text-xs text-gray-600">無駄なロード時間ゼロ。お客様の対応の合間にサッと投稿が作れます。</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-green-50 p-2 rounded-lg text-green-600 mt-1"><Icons.Smartphone size={18} /></div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm">スマホならアプリ感覚で</h3>
                                    <p className="text-xs text-gray-600">PWA技術を採用。「ホーム画面に追加」するだけで、ストアからのDL不要でアプリと同じようにサクサク起動します。</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600 mt-1"><Icons.Bot size={18} /></div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm">PCでも快速動作</h3>
                                    <p className="text-xs text-gray-600">高価なPCスペックは不要。お手持ちのPCのブラウザからログインするだけで、すぐにAI生成を開始できます。</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600 mt-1"><Icons.ShieldCheck size={18} /></div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm">常に最新版をシェア</h3>
                                    <p className="text-xs text-gray-600">アプリの更新作業は一切不要。どのデバイスからアクセスしても、常に最新のAIモデルを利用できます。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-1/2 w-full">
                        <div className="relative mx-auto w-56 border-gray-900 bg-gray-900 border-[8px] rounded-[2rem] h-[400px] shadow-2xl flex flex-col overflow-hidden ring-4 ring-gray-800/50">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-b-xl z-20" />
                            <div className="flex-1 bg-white relative w-full h-full overflow-hidden">
                                <div className="absolute inset-0 animate-pwa-scene1">
                                    <div className="h-10 bg-gray-100 flex items-center justify-between px-3 border-b border-gray-200 pt-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-gray-300 rounded-full" />
                                            <div className="w-20 h-3 bg-gray-200 rounded-full" />
                                        </div>
                                        <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center animate-pulse">
                                            <Icons.Share size={12} className="text-white" />
                                        </div>
                                    </div>
                                    <div className="p-3 space-y-2 opacity-50">
                                        <div className="w-full h-16 bg-indigo-100 rounded-lg" />
                                        <div className="space-y-1">
                                            <div className="w-3/4 h-2 bg-gray-200 rounded" />
                                            <div className="w-1/2 h-2 bg-gray-200 rounded" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)] animate-slide-up">
                                        <div className="flex justify-center py-2"><div className="w-8 h-1 bg-gray-300 rounded-full" /></div>
                                        <p className="px-4 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">共有</p>
                                        <div className="px-3 pb-4 space-y-1">
                                            <div className="flex items-center gap-3 px-3 py-2 text-gray-500">
                                                <Icons.Send size={14} /><span className="text-xs">メッセージ</span>
                                            </div>
                                            <div className="flex items-center gap-3 px-3 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl font-bold border-2 border-indigo-200 relative overflow-hidden animate-pulse">
                                                <Icons.PlusSquare size={16} />
                                                <span className="text-xs">ホーム画面に追加</span>
                                                <div className="absolute right-3 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                                            </div>
                                            <div className="flex items-center gap-3 px-3 py-2 text-gray-500">
                                                <Icons.MoreHorizontal size={14} /><span className="text-xs">その他</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 animate-pwa-scene2 opacity-0">
                                    <div className="h-full bg-gray-100/80 flex items-center justify-center p-4">
                                        <div className="bg-white rounded-2xl shadow-2xl p-4 w-full max-w-[180px] animate-scale-in">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                                    <Icons.Sparkles size={20} className="text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">MisePo</p>
                                                    <p className="text-[10px] text-gray-500">misepo.app</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="flex-1 py-2 text-xs text-gray-500 bg-gray-100 rounded-lg">キャンセル</button>
                                                <button className="flex-1 py-2 text-xs text-white bg-indigo-600 rounded-lg font-bold animate-pulse">追加</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 animate-pwa-scene3 opacity-0">
                                    <div className="h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 pt-8">
                                        <div className="flex justify-between text-white text-[8px] mb-4 px-1">
                                            <span>9:41</span>
                                            <div className="flex gap-1">
                                                <div className="w-3 h-2 border border-white rounded-sm" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-3">
                                            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                                <div key={i} className="flex flex-col items-center gap-1">
                                                    <div className="w-10 h-10 bg-white/20 rounded-xl" />
                                                    <div className="w-8 h-1 bg-white/30 rounded" />
                                                </div>
                                            ))}
                                            <div className="flex flex-col items-center gap-1 animate-bounce-in">
                                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/50 animate-pulse">
                                                    <Icons.Sparkles size={18} className="text-white" />
                                                </div>
                                                <span className="text-[8px] text-white font-medium">MisePo</span>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-16 left-4 right-4 bg-white/90 backdrop-blur-md rounded-xl p-3 flex items-center gap-2 shadow-xl animate-slide-up">
                                            <Icons.CheckCircle size={18} className="text-green-500" />
                                            <span className="text-xs font-bold text-gray-800">ホーム画面に追加しました！</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-600 rounded-full" />
                        </div>
                        <p className="text-center text-xs text-gray-500 mt-4">
                            <span className="inline-flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                アニメーション再生中
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
