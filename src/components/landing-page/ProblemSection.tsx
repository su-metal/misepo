"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

interface Problem {
    icon: React.ReactElement;
    title: string;
    desc: string;
    bg: string;
    delay: number;
}

export const ProblemSection = ({ problems, isMobile }: { problems: Problem[]; isMobile: boolean }) => {
    return (
        <section id="problem" className="py-20 md:py-32 bg-[#f9f5f2] relative overflow-hidden border-y-[6px] border-black">
            {/* Background Decor (Brutalist style) */}
            <div className="absolute top-10 right-10 w-32 h-32 border-[3px] border-black rounded-2xl rotate-12 opacity-10 pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-24 h-24 border-[3px] border-black rounded-2xl -rotate-12 opacity-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <span className="inline-block py-2 px-4 bg-[#E5C58C] border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl text-black font-black tracking-tight text-sm uppercase mb-8">
                        Social Media Challenges
                    </span>
                    <h2 className="text-4xl md:text-7xl font-black text-black leading-[1.1] mb-8">
                        こんな毎日を、<br />
                        一人で抱えていませんか？
                    </h2>
                    <p className="text-black text-xl leading-relaxed max-w-2xl mx-auto font-bold opacity-80">
                        閉店後の疲れた体でスマホを見つめる夜。<br className="hidden md:block" />
                        AIを使ってみたけれど、どこか自分らしくない文章への違和感。<br className="hidden md:block" />
                        MisePoは、あなたのそんな「心の重荷」に寄り添うために生まれました。
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {problems.map((prob, index) => (
                        <div key={index} className="group relative bg-white border-[4px] border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
                            <div className="flex flex-col items-center text-center gap-6">
                                <div className={`w-16 h-16 border-[3px] border-black rounded-2xl ${prob.bg} flex items-center justify-center text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-6 transition-transform duration-200 shrink-0`}>
                                    {React.cloneElement(prob.icon as any, { size: 32 })}
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-black whitespace-pre-line leading-tight">{prob.title}</h3>
                            </div>
                            <div className="h-[3px] w-full bg-black my-6" />
                            <p className="text-base text-black font-bold opacity-70 leading-relaxed text-center">{prob.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
