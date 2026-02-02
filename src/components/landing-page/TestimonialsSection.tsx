"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const TestimonialsSection = ({ isMobile = false }: { isMobile?: boolean }) => {
    return (
        <section className="py-24 md:py-48 bg-[#f0eae4] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col items-start mb-24">
                    <span className="text-[10px] font-black text-[#1823ff] uppercase tracking-[0.2em] mb-8 px-4 py-2 bg-[#1823ff]/5 rounded-full border border-[#1823ff]/10">User Testimonials</span>
                    <h2 className={`font-black text-[#282d32] tracking-tighter leading-[0.9] ${isMobile ? 'text-5xl' : 'text-7xl md:text-8xl lg:text-[8rem]'}`}>
                        オーナーに、<br />
                        <span className="text-[#1823ff]">選ばれる理由。</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        {
                            quote: "AI特有の堅苦しさがなくて、常連さんからも『最近の投稿、楽しそうですね』と声をかけられました。",
                            author: "CAFE OWNER",
                            location: "SHIBUYA, TOKYO"
                        },
                        {
                            quote: "誰が書いても『お店のトーン』が揃うのが安心。スタッフにも安心して運用を任せられるようになりました。",
                            author: "SALON OWNER",
                            location: "UMEDA, OSAKA"
                        }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white rounded-[48px] p-12 md:p-16 border border-slate-100 flex flex-col items-start text-left">
                            <div className="text-[10px] font-black text-slate-300 mb-12 uppercase tracking-widest">Feedback 0{idx + 1}</div>
                            <p className="text-2xl md:text-3xl font-black text-[#282d32] mb-12 leading-tight">
                                “{item.quote}”
                            </p>
                            <div className="mt-auto">
                                <p className="text-sm font-black text-[#1823ff] tracking-widest">{item.author}</p>
                                <p className="text-[10px] font-black text-slate-300 tracking-widest mt-1 opacity-50">{item.location}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
