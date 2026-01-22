"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const PWASection = () => {
    return (
        <section id="pwa" className="py-20 md:py-32 bg-white border-b-[6px] border-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="lg:w-1/2">
                        <div className="inline-block px-4 py-2 bg-[#E88BA3] text-white border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl text-xs font-black uppercase tracking-widest mb-6">マルチデバイス対応</div>
                        <h2 className="text-3xl md:text-5xl font-black text-black mb-8 leading-tight italic uppercase">
                            スマホ、タブレット、PC。<br />
                            <span className="underline decoration-[6px] decoration-[#F5CC6D]">お好きなデバイスで。</span>
                        </h2>
                        <p className="text-lg text-black font-bold opacity-80 mb-10 leading-relaxed">MisePoは、ブラウザがあればどこでも使えます。店外ではスマホ、バックヤードではタブレット、レジ横のPCなど、店舗のオペレーションに合わせて柔軟にご利用いただけます。</p>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-4 border-[3px] border-black rounded-2xl bg-[#f9f5f2] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                                <div className="bg-black p-2 text-white border-[2px] border-white rounded-2xl mt-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]"><Icons.Clock size={20} /></div>
                                <div>
                                    <h3 className="font-black text-black text-sm uppercase tracking-tight">圧倒的な起動スピード</h3>
                                    <p className="text-xs text-black font-bold opacity-70 mt-1">無駄なロード時間ゼロ。お客様の対応の合間にサッと投稿が作れます。</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 border-[3px] border-black rounded-2xl bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                                <div className="bg-[#4DB39A] p-2 text-white border-[2px] border-black rounded-2xl mt-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]"><Icons.Smartphone size={20} /></div>
                                <div>
                                    <h3 className="font-black text-black text-sm uppercase tracking-tight">スマホならアプリ感覚で</h3>
                                    <p className="text-xs text-black font-bold opacity-70 mt-1">PWA技術を採用。「ホーム画面に追加」するだけで、ストアからのDL不要でアプリと同じようにサクサク起動します。</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 border-[3px] border-black rounded-2xl bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                                <div className="bg-[#9B8FD4] p-2 text-white border-[2px] border-black rounded-2xl mt-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]"><Icons.Bot size={20} /></div>
                                <div>
                                    <h3 className="font-black text-black text-sm uppercase tracking-tight">PCでも快速動作</h3>
                                    <p className="text-xs text-black font-bold opacity-70 mt-1">高価なPCスペックは不要。お手持ちのPCのブラウザからログインするだけで、すぐにAI生成を開始できます。</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 border-[3px] border-black rounded-2xl bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                                <div className="bg-[#F5CC6D] p-2 text-black border-[2px] border-black rounded-2xl mt-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]"><Icons.ShieldCheck size={20} /></div>
                                <div>
                                    <h3 className="font-black text-black text-sm uppercase tracking-tight">常に最新版をシェア</h3>
                                    <p className="text-xs text-black font-bold opacity-70 mt-1">アプリの更新作業は一切不要。どのデバイスからアクセスしても、常に最新のAIモデルを利用できます。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-1/2 w-full">
                        <div className="relative mx-auto w-64 border-black bg-black border-[6px] h-[450px] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden group">
                            <div className="flex-1 bg-white relative w-full h-full overflow-hidden">
                                <div className="absolute inset-0 animate-pwa-scene1">
                                    <div className="h-12 bg-[#f9f5f2] flex items-center justify-between px-4 border-b-[2px] border-black pt-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 bg-black border-[2px] border-white rounded-2xl" />
                                            <div className="w-24 h-4 bg-black/10" />
                                        </div>
                                        <div className="w-8 h-8 bg-[#E88BA3] border-[2px] border-black rounded-2xl flex items-center justify-center animate-pulse">
                                            <Icons.Share size={14} className="text-white" />
                                        </div>
                                    </div>
                                    <div className="p-4 space-y-4 opacity-30">
                                        <div className="w-full h-20 bg-black/10 border-[2px] border-black rounded-2xl" />
                                        <div className="space-y-2">
                                            <div className="w-3/4 h-3 bg-black/10" />
                                            <div className="w-1/2 h-3 bg-black/10" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t-[4px] border-black shadow-[0_-8px_0_rgba(0,0,0,0.1)] animate-slide-up">
                                        <div className="flex justify-center py-3"><div className="w-10 h-1.5 bg-black rounded-full" /></div>
                                        <p className="px-6 pb-2 text-[10px] font-black text-black uppercase tracking-[0.2em]">Share Options</p>
                                        <div className="px-4 pb-6 space-y-2">
                                            <div className="flex items-center gap-4 px-4 py-3 text-black font-bold border-b border-black/5">
                                                <Icons.Send size={18} /><span className="text-sm uppercase tracking-tight">Message</span>
                                            </div>
                                            <div className="flex items-center gap-4 px-4 py-4 bg-[#F5CC6D] text-black font-black border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl relative overflow-hidden animate-pulse">
                                                <Icons.PlusSquare size={20} />
                                                <span className="text-sm uppercase italic">Add to Home Screen</span>
                                                <div className="absolute right-4 w-3 h-3 bg-[#E88BA3] border-[2px] border-black rounded-2xl animate-ping" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 animate-pwa-scene2 opacity-0">
                                    <div className="h-full bg-black/5 flex items-center justify-center p-6">
                                        <div className="bg-white border-[4px] border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl p-6 w-full max-w-[200px] animate-scale-in">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-14 h-14 bg-[#E88BA3] border-[2px] border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
                                                    <Icons.Sparkles size={28} className="text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-black text-sm uppercase italic">MisePo</p>
                                                    <p className="text-[10px] text-black font-bold opacity-40">misepo.app</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button className="flex-1 py-2 text-[10px] font-black uppercase text-black/40 border-[2px] border-black rounded-2xl/10">Back</button>
                                                <button className="flex-1 py-2 text-[10px] font-black uppercase text-white bg-black border-[2px] border-black rounded-2xl animate-pulse">Add</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 animate-pwa-scene3 opacity-0">
                                    <div className="h-full bg-[#4DB39A] p-6 pt-10 border-[4px] border-black rounded-2xl">
                                        <div className="flex justify-between text-white font-black text-[10px] mb-8 px-2 uppercase italic">
                                            <span>9:41</span>
                                            <div className="flex gap-2">
                                                <div className="w-5 h-3 border-[2px] border-white rounded-2xl" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4">
                                            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                                <div key={i} className="flex flex-col items-center gap-2">
                                                    <div className="w-12 h-12 bg-black/20 border-[2px] border-black rounded-2xl/10" />
                                                </div>
                                            ))}
                                            <div className="flex flex-col items-center gap-2 animate-bounce-in">
                                                <div className="w-12 h-12 bg-[#E88BA3] border-[3px] border-white rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] animate-pulse">
                                                    <Icons.Sparkles size={24} className="text-white" />
                                                </div>
                                                <span className="text-[8px] text-white font-black uppercase italic">MisePo</span>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-12 left-4 right-4 bg-white border-[3px] border-black rounded-2xl p-4 flex items-center gap-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-slide-up">
                                            <Icons.CheckCircle size={20} className="text-[#4DB39A]" />
                                            <span className="text-[10px] font-black uppercase text-black">Added to Home!</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-[10px] text-black font-black uppercase tracking-[0.3em] mt-8 bg-white border-[2px] border-black rounded-2xl py-2 inline-block px-4 mx-auto w-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ml-[50%] -translate-x-1/2">
                            <span className="inline-flex items-center gap-2">
                                <span className="w-2.5 h-2.5 bg-[#4DB39A] border border-black animate-pulse" />
                                System Animating
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
