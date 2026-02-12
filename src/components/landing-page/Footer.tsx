"use client";
import React from 'react';

export const Footer = () => {
    return (
        <footer className="relative bg-[#1a1c20] text-white py-24 md:py-32 overflow-hidden border-t border-white/5">
            {/* Background Accents */}
            <div className="glow-orb w-[30rem] h-[30rem] bg-[#1823ff]/10 -top-20 -left-20" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-32 mb-20 md:mb-32">
                    <div className="flex flex-col items-start">
                        <div className="mb-10">
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gradient-primary mb-2">MisePo</h2>
                            <span className="text-[10px] font-black text-[#1823ff] uppercase tracking-[0.4em] ml-1">ホスピタリティAIパートナー</span>
                        </div>
                        <p className="text-lg md:text-xl font-bold text-slate-400 max-w-sm leading-relaxed mb-12">
                            「何を書こう？」と悩む時間は、もうおしまい。<br />
                            あなたの「らしさ」を、1分で言葉にする<br className="hidden md:block" />
                            AIパートナー。
                        </p>

                        {/* Social / Contact Links (Optional placeholders for design) */}
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#1823ff]/20 hover:border-[#1823ff]/30 transition-all cursor-pointer">
                                <span className="text-[10px] font-black">IG</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#1823ff]/20 hover:border-[#1823ff]/30 transition-all cursor-pointer">
                                <span className="text-[10px] font-black">X</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12 md:gap-24 relative p-8 md:p-12 bg-white/[0.02] border border-white/5 rounded-[3rem] backdrop-blur-sm">
                        <div className="space-y-8">
                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">クイックリンク</span>
                            <ul className="space-y-4 text-sm md:text-base font-bold">
                                <li><a href="/#flow" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-px bg-[#1823ff] group-hover:w-3 transition-all" />使い方</a></li>
                                <li><a href="/#demo" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-px bg-[#1823ff] group-hover:w-3 transition-all" />デモ</a></li>
                                <li><a href="/#pricing" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-px bg-[#1823ff] group-hover:w-3 transition-all" />料金</a></li>
                                <li><a href="/blog" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-px bg-[#1823ff] group-hover:w-3 transition-all" />ブログ</a></li>
                            </ul>
                        </div>
                        <div className="space-y-8">
                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">法的情報</span>
                            <ul className="space-y-4 text-sm md:text-base font-bold">
                                <li><a href="/terms" className="text-slate-300 hover:text-white transition-colors">利用規約</a></li>
                                <li><a href="/privacy" className="text-slate-300 hover:text-white transition-colors">プライバシー</a></li>
                                <li><a href="/commercial-law" className="text-slate-300 hover:text-white transition-colors whitespace-nowrap">特定商取引法</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        <p className="text-[10px] font-black text-slate-500 tracking-[0.2em]">© {new Date().getFullYear()} MISEPO INC.</p>
                    </div>
                    <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10">
                        <p className="text-[9px] font-black text-white/40 tracking-[0.4em] uppercase">Built with Hospitality AI</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
