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
        <section id="problem" className="py-20 md:py-32 relative overflow-hidden">
            {/* Background Decor (Soft Blobs) */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E88BA3]/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#4DB39A]/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <span className="inline-block py-1.5 px-4 bg-white border border-[#E88BA3]/20 rounded-full text-[#E88BA3] font-bold tracking-widest text-xs uppercase mb-8 shadow-sm">
                        Social Media Challenges
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-800 leading-tight mb-8">
                        こんな毎日を、<br />
                        一人で抱えていませんか？
                    </h2>
                    <p className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto font-medium">
                        閉店後の疲れた体でスマホを見つめる夜。<br className="hidden md:block" />
                        AIを使ってみたけれど、どこか自分らしくない文章への違和感。<br className="hidden md:block" />
                        MisePoは、あなたのそんな「心の重荷」に寄り添います。
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {problems.map((prob, index) => (
                        <div key={index} className="group relative bg-white border border-slate-100 rounded-[32px] p-8 shadow-lg shadow-slate-200/50 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                            <div className="flex flex-col items-center text-center gap-6">
                                <div className={`w-16 h-16 rounded-2xl ${prob.bg} flex items-center justify-center text-slate-700 shadow-inner group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                                    {React.cloneElement(prob.icon as any, { size: 32, className: "opacity-80" })}
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-slate-800 whitespace-pre-line leading-tight">{prob.title}</h3>
                            </div>
                            <div className="h-px w-full bg-slate-100 my-6" />
                            <p className="text-sm text-slate-500 font-medium leading-relaxed text-center">{prob.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
