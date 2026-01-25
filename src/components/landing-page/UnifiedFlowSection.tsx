"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const UnifiedFlowSection = () => {
    const creationSteps = [
        {
            number: "01",
            title: "伝えたいことをメモ",
            desc: "箇条書きや断片的なメモでOK。AIが文脈を読み取ります。",
            accent: "bg-[#F5CC6D]",
            mockup: (
                <div className="bg-white border-[2px] border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] w-full relative overflow-hidden group-hover:bg-[#fcf8f0] transition-colors">
                    <div className="flex flex-col gap-2 font-black text-[10px] text-black/60">
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
                        <div className="w-[1.5px] h-3 bg-black animate-pulse mt-1 ml-0.5" />
                    </div>
                </div>
            )
        },
        {
            number: "02",
            title: "ポチッと生成",
            desc: "ボタン一つで、プロ顔負けの文章が数秒で完成。",
            accent: "bg-[#4DB39A]",
            mockup: (
                <div className="w-full flex justify-center">
                    <div className="bg-[#4DB39A] border-[3px] border-black rounded-2xl px-6 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3 active:translate-y-[2px] active:shadow-none transition-all cursor-pointer group-hover:scale-105">
                        <Icons.Zap size={24} className="text-black" />
                        <span className="font-black text-black text-sm uppercase italic">生成する</span>
                        <div className="flex items-center gap-0.5">
                            <Icons.Sparkles size={12} className="text-black animate-pulse" />
                            <Icons.Sparkles size={12} className="text-black animate-pulse delay-150" />
                        </div>
                    </div>
                </div>
            )
        },
        {
            number: "03",
            title: "こだわり設定",
            desc: "トーンや「人格」を選んで、独自の色を付け足せます。",
            accent: "bg-[#E88BA3]",
            mockup: (
                <div className="w-full grid grid-cols-2 gap-2">
                    <div className="bg-white border-[2px] border-black rounded-xl p-2 flex items-center gap-2 shadow-sm">
                        <div className="w-4 h-4 rounded-full bg-[#F5CC6D] border border-black" />
                        <span className="text-[9px] font-black uppercase">Casual</span>
                    </div>
                    <div className="bg-black border-[2px] border-black rounded-xl p-2 flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(232,139,163,1)]">
                        <div className="w-4 h-4 rounded-full bg-[#E88BA3] border border-white" />
                        <span className="text-[9px] font-black uppercase text-white">Persona Agent</span>
                    </div>
                    <div className="col-span-2 bg-[#f9f5f2] border-[2px] border-black border-dashed rounded-xl p-2 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-black/30">More Settings...</span>
                    </div>
                </div>
            )
        }
    ];

    const platformWorkflow = [
        {
            id: "x",
            icon: <Icons.Twitter size={24} />,
            color: "bg-black",
            text: "white",
            label: "X (Twitter)",
            desc: "自動コピー＆投稿画面",
        },
        {
            id: "insta",
            icon: <Icons.Instagram size={24} />,
            color: "bg-[#E88BA3]",
            text: "black",
            label: "Instagram",
            desc: "ハッシュタグ連携起動",
        },
        {
            id: "line",
            icon: <Icons.MessageCircle size={24} />,
            color: "bg-[#06C755]",
            text: "white",
            label: "公式LINE",
            desc: "リッチ配信形式で作成",
        },
        {
            id: "gmap",
            icon: <Icons.MapPin size={24} />,
            color: "bg-[#4DB39A]",
            text: "black",
            label: "Google Maps",
            desc: "クチコミ管理へ直行",
        }
    ];

    return (
        <section id="flow" className="py-24 md:py-32 bg-[#f9f5f2] border-b-[6px] border-black overflow-hidden scroll-mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20 md:mb-32">
                    <span className="bg-[#9B8FD4] text-black font-black tracking-widest text-[10px] uppercase mb-6 px-4 py-2 border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block animate-in fade-in slide-in-from-bottom-2 duration-500">3 Easy Steps</span>
                    <h2 className="text-4xl md:text-7xl font-black text-black mb-8 tracking-tight leading-tight italic animate-in fade-in slide-in-from-bottom-4 duration-700">
                        「作成」から「投稿」まで、<br />
                        <span className="underline decoration-[8px] md:decoration-[12px] decoration-[#4DB39A]">流れるように。</span>
                    </h2>
                    <p className="text-black text-lg md:text-xl font-bold opacity-80 leading-relaxed max-w-2xl mx-auto">
                        <span className="bg-[#F5CC6D] px-1 border-b-[2px] border-black">使い方はこれだけ。</span><br className="hidden md:block" />
                        アイデアがフォロワーに届くまでの全ての工程を、圧倒的に短縮します。
                    </p>
                </div>

                {/* Part 1: Creation Steps */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative mb-12 md:mb-16">
                    {/* Visual Flow Line (Desktop) */}
                    <div className="hidden lg:block absolute top-[100px] left-[10%] right-[10%] h-[3px] bg-black/5 -z-10" />

                    {creationSteps.map((step, index) => (
                        <div key={index} className="flex flex-col group animate-in fade-in slide-in-from-bottom-8 duration-500" style={{ animationDelay: `${index * 150}ms` }}>
                            <div className="bg-white border-[4px] border-black rounded-[32px] p-6 h-full shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col min-h-[320px] md:min-h-[340px]">
                                <div className="flex items-center justify-between mb-6">
                                    <div className={`${step.accent} px-4 py-1.5 border-[3px] border-black font-black italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2 group-hover:rotate-0 transition-transform`}>
                                        STEP {step.number}
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-black/20" />
                                </div>

                                <h3 className="text-xl md:text-2xl font-black text-black mb-3 tracking-tighter">{step.title}</h3>
                                <p className="text-black/60 text-xs md:text-sm font-bold leading-relaxed mb-6">
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
                        <div className="w-[3px] h-12 bg-black/10 border-r-[3px] border-dashed border-black/10" />
                        <div className="bg-black text-white p-2.5 rounded-full mt-[-10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <Icons.ChevronDown size={20} />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-6 justify-center w-full">
                        {platformWorkflow.map((plat, idx) => (
                            <div key={idx} className="w-full md:w-auto flex-1 max-w-sm group animate-in zoom-in-95 duration-500" style={{ animationDelay: `${(idx + 3) * 150}ms` }}>
                                <div className="bg-white border-[4px] border-black rounded-3xl p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-[#fcf8f0] transition-colors flex items-center gap-5">
                                    <div className={`${plat.color} ${plat.text === 'white' ? 'text-white' : 'text-black'} w-12 h-12 border-[3px] border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform`}>
                                        {plat.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-black text-black text-base md:text-lg tracking-tight mb-0.5">{plat.label}</p>
                                        <p className="text-[10px] md:text-xs font-bold text-black/50 leading-tight">{plat.desc}</p>
                                    </div>
                                    <div className="bg-black/5 p-2 rounded-xl group-hover:bg-black group-hover:text-white transition-all">
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
