"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const PWASection = ({ isMobile = false }: { isMobile?: boolean }) => {
    return (
        <section id="pwa" className={`${isMobile ? 'py-12' : 'py-20 md:py-32'} bg-white overflow-hidden`}>
            <div className={`${isMobile ? 'w-full px-4' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
                <div className={`flex flex-col gap-12 ${isMobile ? '' : 'lg:flex-row lg:gap-20 items-center'}`}>
                    <div className={isMobile ? 'w-full' : 'lg:w-1/2'}>
                        <span className="inline-block px-4 py-1.5 bg-[var(--ichizen-blue)]/10 text-[var(--ichizen-blue)] border border-[var(--ichizen-blue)]/20 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">Multi-Device Support</span>
                        <h2 className={`font-bold text-slate-800 mb-8 leading-tight ${isMobile ? 'text-2xl' : 'text-4xl md:text-6xl'}`}>
                            スマホ、タブレット、PC。<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5CC6D] to-[var(--ichizen-blue)]">お好きなデバイスで。</span>
                        </h2>
                        <p className={`text-slate-500 font-medium mb-10 leading-relaxed ${isMobile ? 'text-xs' : 'text-lg'}`}>MisePoは、ブラウザがあればどこでも使えます。店外ではスマホ、バックヤードではタブレット、レジ横のPCなど、店舗のオペレーションに合わせて柔軟にご利用いただけます。</p>
                        <div className={`space-y-4 ${isMobile ? '' : 'space-y-6'}`}>
                            {[
                                { icon: <Icons.Clock size={isMobile ? 18 : 20} />, bg: "bg-slate-900", text: "text-white", title: "圧倒的な起動スピード", desc: "無駄なロード時間ゼロ。お客様の対応の合間にサッと投稿が作れます。" },
                                { icon: <Icons.Smartphone size={isMobile ? 18 : 20} />, bg: "bg-[var(--ichizen-green)]", text: "text-white", title: "スマホならアプリ感覚で", desc: "PWA技術を採用。「ホーム画面に追加」するだけで、アプリ感覚でサクサク起動します。" },
                                { icon: <Icons.Bot size={isMobile ? 18 : 20} />, bg: "bg-[#9B8FD4]", text: "text-white", title: "PCでも快速動作", desc: "高価なPCスペックは不要。お手持ちのPCのブラウザからすぐにAI生成を開始できます。" },
                                { icon: <Icons.ShieldCheck size={isMobile ? 18 : 20} />, bg: "bg-[#F5CC6D]", text: "text-white", title: "常に最新版をシェア", desc: "更新作業は一切不要。どのデバイスからアクセスしても、常に最新のAIモデルを利用できます。" }
                            ].map((item, i) => (
                                <div key={i} className={`flex items-start gap-4 bg-slate-50 border border-slate-100/50 rounded-2xl transition-all duration-300 ${isMobile ? 'p-4' : 'p-4 hover:bg-white hover:shadow-lg'}`}>
                                    <div className={`${item.bg} ${item.text} rounded-xl shadow-md mt-1 shrink-0 ${isMobile ? 'p-2' : 'p-2.5'}`}>{item.icon}</div>
                                    <div>
                                        <h3 className={`font-bold text-slate-800 ${isMobile ? 'text-xs' : 'text-sm'}`}>{item.title}</h3>
                                        <p className={`text-slate-500 font-medium mt-1 leading-relaxed ${isMobile ? 'text-[10px]' : 'text-xs'}`}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {!isMobile && (
                        <div className="lg:w-1/2 w-full">
                            <div className="relative mx-auto w-72 h-[500px] bg-slate-900 rounded-[48px] shadow-2xl border-[8px] border-slate-900 overflow-hidden ring-1 ring-white/20">
                                {/* ... existing phone mock mock-up content ... */}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
