"use client";
import React from 'react';
import Image from 'next/image';
import { Icons } from '../LandingPageIcons';

export const UnifiedFlowSection = ({ isMobile = false }: { isMobile?: boolean }) => {
    return (
        <section id="flow" className="py-24 md:py-48 bg-[#f0eae4] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col items-start text-left md:items-center md:text-center mb-32">
                    <h2 className={`font-black tracking-tighter leading-[0.9] text-[#282d32] ${isMobile ? 'text-5xl' : 'text-7xl md:text-8xl lg:text-[5rem]'}`}>
                        <span className="block text-[10px] font-black text-[#1823ff] uppercase tracking-[0.2em] mb-8 px-4 py-2 bg-[#1823ff]/5 rounded-full border border-[#1823ff]/10 w-fit mx-auto normal-case text-left" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
                            美容院・飲食店のSNS投稿を3ステップで自動作成
                        </span>
                        {isMobile ? (
                            <>
                                メモから<br />
                                <span className="text-gradient-primary">あっという間に。</span>
                            </>
                        ) : (
                            <>
                                メモから投稿まで、<br />
                                <span className="text-gradient-primary">あっという間に。</span>
                            </>
                        )}
                    </h2>
                </div>

                <div className="flex flex-col gap-32 md:gap-48 relative">
                    {/* Dotted Connection Line (Desktop) */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px border-l-2 border-dashed border-slate-200 hidden md:block -z-0 translate-x-1/2" />

                    {[
                        {
                            step: "01",
                            problem: "忙しくて、文章を考える時間がない...",
                            title: "思いついた時に、一言メモするだけ。",
                            badge: "想いをカタチにする第一歩",
                            desc: "「新作のタルトが焼けた」「常連さんに喜んでもらえた」\nそんな一言で大丈夫。AIがあなたの意図をしっかり汲み取ります。",
                            img: "/misepo_step01_memo_cafe_vibe_1769994472883.png",
                            align: "left"
                        },
                        {
                            step: "02",
                            problem: "何を書けばいいか分からない、言葉が出てこない...",
                            title: "AIが、数秒であなたらしい言葉に。",
                            badge: "お店の個性を反映した文章作成",
                            desc: "ボタンを押して数秒。SNSごとの文化や文字数に合わせて、\nあなたの温度感を大切にした文章をAIが書き上げます。",
                            img: "/misepo_step02_generation_natural_screen_1769994809838.png",
                            align: "right"
                        },
                        {
                            step: "03",
                            problem: "各SNSへの投稿作業がとにかく面倒...",
                            title: "あとは確認して、ワンタップで完了。",
                            badge: "確認してワンタップで投稿",
                            desc: "完成した文章を確認して、ワンタップでコピー＆投稿。\nSNS運用が「義務」から、楽しい「ルーチン」に変わります。",
                            img: "/misepo_step03_happy_shop_owner_sns_1769994514693.png",
                            align: "left"
                        }
                    ].map((item, idx) => (
                        <div key={idx} className={`flex flex-col ${item.align === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-16 md:gap-32 relative z-10`}>
                            {/* Image Section */}
                            <div className="w-full md:w-1/2 flex justify-center">
                                <div className="relative group w-full max-w-[500px]">
                                    {/* Organic Image Shape */}
                                    <div className="relative overflow-hidden aspect-[4/3] transition-transform duration-700 group-hover:scale-[1.02]" style={{
                                        borderRadius: item.align === 'left' ? '120px 40px 120px 40px' : '40px 120px 40px 120px'
                                    }}>
                                        <Image
                                            src={item.img}
                                            alt={item.title}
                                            fill
                                            sizes="(max-width: 768px) 90vw, 500px"
                                            quality={70}
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                                    </div>

                                    {/* Title Badge (Overlay) */}
                                    <div className={`absolute bottom-6 ${item.align === 'left' ? '-left-4' : '-right-4'} bg-[#282d32] px-8 py-5 rounded-[2rem] shadow-2xl transform transition-transform group-hover:-translate-y-2`}>
                                        <div className="text-2xl font-black text-white tracking-tight">{item.badge}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Text Section */}
                            <div className="w-full md:w-1/2 flex flex-col items-start gap-8">
                                <div className="flex flex-col items-start gap-4">
                                    <span className="text-sm font-black text-[#1823ff] px-4 py-1.5 bg-[#1823ff]/5 rounded-full border border-[#1823ff]/10">STEP 0{idx + 1}</span>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Icons.X size={16} className="shrink-0" />
                                            <span className="text-sm md:text-lg font-bold line-through opacity-60 italic">{item.problem}</span>
                                        </div>
                                        <h3 className="text-4xl md:text-5xl font-black text-[#282d32] tracking-tighter">{item.title}</h3>
                                    </div>
                                </div>
                                <p className="text-xl md:text-2xl font-bold text-slate-500 leading-snug whitespace-pre-line">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
