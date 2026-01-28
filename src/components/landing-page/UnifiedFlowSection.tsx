"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const UnifiedFlowSection = () => {
    const creationSteps = [
        {
            number: "01",
            title: "伝えたいことをメモ",
            desc: "箇条書きや断片的なメモでOK。AIが文脈を読み取ります。",
            accent: "text-[#F5CC6D]",
            bgAccent: "bg-[#F5CC6D]/10",
            mockup: (
                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm w-full relative overflow-hidden group-hover:bg-[#fcf8f0] transition-colors">
                    <div className="flex flex-col gap-2 font-medium text-[10px] text-slate-500">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#4DB39A] rounded-full" />
                            <span>新作ドーナツ登場</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#4DB39A] rounded-full" />
                            <span>15日から期間限定販売</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#4DB39A] rounded-full" />
                            <span>コーヒーにめちゃ合う</span>
                        </div>
                        <div className="w-[1.5px] h-3 bg-slate-300 animate-pulse mt-1 ml-0.5" />
                    </div>
                </div>
            )
        },
        {
            number: "02",
            title: "ポチッと生成",
            desc: "ボタン一つで、プロ顔負けの文章が数秒で完成。",
            accent: "text-[#4DB39A]",
            bgAccent: "bg-[#4DB39A]/10",
            mockup: (
                <div className="w-full flex justify-center">
                    <div className="bg-[#4DB39A] rounded-full px-6 py-3 shadow-[0_10px_20px_-5px_rgba(77,179,154,0.4)] flex items-center gap-3 active:translate-y-[2px] transition-all cursor-pointer group-hover:scale-105 hover:shadow-[0_15px_30px_-5px_rgba(77,179,154,0.5)]">
                        <Icons.Zap size={20} className="text-white" />
                        <span className="font-bold text-white text-sm uppercase tracking-wider">生成する</span>
                        <div className="flex items-center gap-0.5">
                            <Icons.Sparkles size={12} className="text-white/70 animate-pulse" />
                            <Icons.Sparkles size={12} className="text-white/70 animate-pulse delay-150" />
                        </div>
                    </div>
                </div>
            )
        },
        {
            number: "03",
            title: "こだわり設定",
            desc: "トーンや「人格」を選んで、独自の色を付け足せます。",
            accent: "text-[#E88BA3]",
            bgAccent: "bg-[#E88BA3]/10",
            mockup: (
                <div className="w-full grid grid-cols-2 gap-2">
                    <div className="bg-white border border-slate-100 rounded-xl p-2.5 flex items-center gap-2 shadow-sm">
                        <div className="w-4 h-4 rounded-full bg-[#F5CC6D]/20 border border-[#F5CC6D]" />
                        <span className="text-[9px] font-bold text-slate-600 uppercase">Casual</span>
                    </div>
                    <div className="bg-slate-800 rounded-xl p-2.5 flex items-center gap-2 shadow-md">
                        <div className="w-4 h-4 rounded-full bg-[#E88BA3] border border-white/20" />
                        <span className="text-[9px] font-bold uppercase text-white">Persona Agent</span>
                    </div>
                    <div className="col-span-2 bg-slate-50 border border-slate-100 border-dashed rounded-xl p-2 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-slate-400">More Settings...</span>
                    </div>
                </div>
            )
        }
    ];

    const platformWorkflow = [
        {
            id: "x",
            icon: <Icons.Twitter size={20} />,
            color: "bg-slate-900",
            text: "text-white",
            label: "X (Twitter)",
            desc: "自動コピー＆投稿画面",
        },
        {
            id: "insta",
            icon: <Icons.Instagram size={20} />,
            color: "bg-[#E88BA3]",
            text: "text-white",
            label: "Instagram",
            desc: "ハッシュタグ連携起動",
        },
        {
            id: "line",
            icon: <Icons.MessageCircle size={20} />,
            color: "bg-[#06C755]",
            text: "text-white",
            label: "公式LINE",
            desc: "リッチ配信形式で作成",
        },
        {
            id: "gmap",
            icon: <Icons.MapPin size={20} />,
            color: "bg-[#4DB39A]",
            text: "text-white",
            label: "Google Maps",
            desc: "クチコミ管理へ直行",
        }
    ];

    return (
        <section id="flow" className="py-24 md:py-32 bg-[#F9F7F2] overflow-hidden scroll-mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20 md:mb-32">
                    <span className="inline-block px-4 py-1.5 bg-white text-[#9B8FD4] border border-[#9B8FD4]/20 rounded-full text-xs font-bold uppercase tracking-widest mb-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">3 Easy Steps</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-8 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
                        「作成」から「投稿」まで、<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4DB39A] to-[#2D8A74]">流れるように。</span>
                    </h2>
                    <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                        <span className="font-bold text-slate-700 border-b-2 border-[#F5CC6D]/50">使い方はこれだけ。</span><br className="hidden md:block" />
                        アイデアがフォロワーに届くまでの全ての工程を、圧倒的に短縮します。
                    </p>
                </div>

                {/* Part 1: Creation Steps */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative mb-12 md:mb-16">
                    {/* Visual Flow Line (Desktop) */}
                    <div className="hidden lg:block absolute top-[80px] left-[10%] right-[10%] h-[2px] bg-slate-200 -z-10" />

                    {creationSteps.map((step, index) => (
                        <div key={index} className="flex flex-col group animate-in fade-in slide-in-from-bottom-8 duration-500 h-full" style={{ animationDelay: `${index * 150}ms` }}>
                            <div className="bg-white border border-slate-100 rounded-[40px] p-8 h-full shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-2 hover:shadow-[0_40px_60px_-15px_rgba(0,0,0,0.1)] transition-all flex flex-col min-h-[300px]">
                                <div className="flex items-center justify-between mb-6">
                                    <div className={`${step.bgAccent} ${step.accent} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider`}>
                                        STEP {step.number}
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                </div>

                                <h3 className="text-xl font-bold text-slate-800 mb-3 tracking-tight">{step.title}</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 flex-1">
                                    {step.desc}
                                </p>

                                <div className="mt-auto flex items-center justify-center min-h-[100px]">
                                    {step.mockup}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Part 2: Posting Destinations */}
                <div className="flex flex-col items-center">
                    {/* Standardized Connecting Arrow */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-[2px] h-12 bg-slate-200 border-r-[2px] border-dashed border-slate-200" />
                        <div className="bg-white text-slate-300 border border-slate-100 p-2 rounded-full mt-[-10px] shadow-sm">
                            <Icons.ChevronDown size={16} />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-6 justify-center w-full">
                        {platformWorkflow.map((plat, idx) => (
                            <div key={idx} className="w-full md:w-auto flex-1 max-w-sm group animate-in zoom-in-95 duration-500" style={{ animationDelay: `${(idx + 3) * 150}ms` }}>
                                <div className="bg-white border border-slate-100 rounded-[32px] p-5 shadow-sm hover:shadow-xl hover:shadow-slate-100/50 hover:bg-white transition-all flex items-center gap-5 cursor-default">
                                    <div className={`${plat.color} ${plat.text} w-12 h-12 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                                        {plat.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-800 text-base md:text-lg tracking-tight mb-0.5">{plat.label}</p>
                                        <p className="text-[10px] md:text-xs font-medium text-slate-400 leading-tight">{plat.desc}</p>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded-xl text-slate-300 group-hover:bg-slate-100 group-hover:text-slate-500 transition-all">
                                        <Icons.ChevronDown size={14} className="-rotate-90" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
