"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const PWASection = () => {
    return (
        <section id="pwa" className="py-20 md:py-32 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="lg:w-1/2">
                        <span className="inline-block px-4 py-1.5 bg-[#E88BA3]/10 text-[#E88BA3] border border-[#E88BA3]/20 rounded-full text-xs font-bold uppercase tracking-widest mb-6">Multi-Device Support</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-8 leading-tight">
                            スマホ、タブレット、PC。<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5CC6D] to-[#E88BA3]">お好きなデバイスで。</span>
                        </h2>
                        <p className="text-lg text-slate-500 font-medium mb-10 leading-relaxed">MisePoは、ブラウザがあればどこでも使えます。店外ではスマホ、バックヤードではタブレット、レジ横のPCなど、店舗のオペレーションに合わせて柔軟にご利用いただけます。</p>
                        <div className="space-y-6">
                            {[
                                { icon: <Icons.Clock size={20} />, bg: "bg-slate-900", text: "text-white", title: "圧倒的な起動スピード", desc: "無駄なロード時間ゼロ。お客様の対応の合間にサッと投稿が作れます。" },
                                { icon: <Icons.Smartphone size={20} />, bg: "bg-[#4DB39A]", text: "text-white", title: "スマホならアプリ感覚で", desc: "PWA技術を採用。「ホーム画面に追加」するだけで、ストアからのDL不要でアプリと同じようにサクサク起動します。" },
                                { icon: <Icons.Bot size={20} />, bg: "bg-[#9B8FD4]", text: "text-white", title: "PCでも快速動作", desc: "高価なPCスペックは不要。お手持ちのPCのブラウザからログインするだけで、すぐにAI生成を開始できます。" },
                                { icon: <Icons.ShieldCheck size={20} />, bg: "bg-[#F5CC6D]", text: "text-white", title: "常に最新版をシェア", desc: "アプリの更新作業は一切不要。どのデバイスからアクセスしても、常に最新のAIモデルを利用できます。" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-lg hover:shadow-slate-100 transition-all duration-300">
                                    <div className={`${item.bg} ${item.text} p-2.5 rounded-xl shadow-md mt-1 shrink-0`}>{item.icon}</div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
                                        <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:w-1/2 w-full">
                        <div className="relative mx-auto w-72 h-[500px] bg-slate-900 rounded-[48px] shadow-2xl border-[8px] border-slate-900 overflow-hidden ring-1 ring-white/20">
                            <div className="absolute inset-0 bg-white overflow-hidden">
                                <div className="absolute inset-0 animate-pwa-scene1">
                                    {/* Fake Browser UI */}
                                    <div className="h-14 bg-slate-50 flex items-center justify-between px-6 border-b border-slate-100 pt-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-slate-200 rounded-full" />
                                            <div className="w-24 h-2 bg-slate-100 rounded-full" />
                                        </div>
                                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                            <Icons.Share size={16} />
                                        </div>
                                    </div>
                                    {/* Content Placeholder */}
                                    <div className="p-6 space-y-4 opacity-50">
                                        <div className="w-full h-32 bg-slate-50 rounded-2xl" />
                                        <div className="space-y-3">
                                            <div className="w-3/4 h-3 bg-slate-50 rounded-full" />
                                            <div className="w-1/2 h-3 bg-slate-50 rounded-full" />
                                        </div>
                                    </div>
                                    {/* iOS Share Sheet */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-slide-up p-2 pb-8">
                                        <div className="flex justify-center py-3"><div className="w-10 h-1 bg-slate-200 rounded-full" /></div>
                                        <div className="px-4 space-y-1">
                                            <div className="flex items-center gap-4 px-4 py-3 text-slate-600 border-b border-slate-50">
                                                <Icons.Send size={20} /><span className="text-sm font-medium">メッセージ</span>
                                            </div>
                                            <div className="flex items-center gap-4 px-4 py-3 bg-slate-50 text-slate-800 rounded-xl relative overflow-hidden">
                                                <Icons.PlusSquare size={20} className="text-[#E88BA3]" />
                                                <span className="text-sm font-bold">ホーム画面に追加</span>
                                                <div className="absolute right-4 w-2 h-2 bg-[#E88BA3] rounded-full animate-ping" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 animate-pwa-scene2 opacity-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                                    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 w-[80%] shadow-xl animate-scale-in">
                                        <div className="flex flex-col items-center gap-4 text-center mb-6">
                                            <div className="w-16 h-16 bg-gradient-to-br from-[#E88BA3] to-[#F5CC6D] rounded-xl shadow-lg flex items-center justify-center text-white">
                                                <Icons.Sparkles size={32} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800">MisePo</h3>
                                                <p className="text-xs text-slate-400">misepo.app</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 justify-center">
                                            <button className="flex-1 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">キャンセル</button>
                                            <button className="flex-1 py-2.5 text-xs font-bold text-white bg-slate-900 rounded-lg shadow-md hover:bg-slate-800 transition-colors">追加</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 animate-pwa-scene3 opacity-0">
                                    <div className="h-full bg-slate-50 relative">
                                        {/* Home Screen */}
                                        <div className="pt-12 px-6 grid grid-cols-4 gap-4">
                                            {[...Array(7)].map((_, i) => (
                                                <div key={i} className="flex flex-col items-center gap-1">
                                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm" />
                                                    <div className="w-8 h-1 bg-slate-200 rounded-full" />
                                                </div>
                                            ))}
                                            <div className="flex flex-col items-center gap-1 animate-bounce-in">
                                                <div className="w-12 h-12 bg-gradient-to-br from-[#E88BA3] to-[#F5CC6D] rounded-xl shadow-md flex items-center justify-center text-white">
                                                    <Icons.Sparkles size={24} />
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-600">MisePo</span>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-12 left-6 right-6 bg-white rounded-full py-3 px-6 shadow-lg shadow-slate-200 flex items-center gap-3 animate-slide-up">
                                            <Icons.CheckCircle size={20} className="text-[#4DB39A]" />
                                            <span className="text-xs font-bold text-slate-700">ホームに追加しました！</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-xs text-slate-400 font-medium tracking-widest mt-8 uppercase">
                            No Installation Required
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
