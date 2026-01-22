"use client";
import React from 'react';

export const TestimonialsSection = () => {
    return (
        <section className="py-24 bg-[#f9f5f2] relative overflow-hidden border-b-[6px] border-black">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <span className="inline-block px-4 py-2 bg-[#9B8FD4] text-white border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl text-xs font-black uppercase tracking-widest mb-6 block w-fit mx-auto -rotate-1">User Voices</span>
                    <h2 className="text-4xl md:text-6xl font-black text-black mb-8 tracking-tight italic uppercase">
                        ユーザーの声
                    </h2>
                    <p className="text-black font-bold text-xl max-w-xl mx-auto opacity-70">
                        実際にMisePoを<br className="md:hidden" />ご利用いただいている店主様の声<br className="md:hidden" />をご紹介します。
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                    <div className="bg-white border-[4px] border-black rounded-2xl p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative group hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
                        <div className="absolute -top-5 -right-5 bg-[#F5CC6D] border-[3px] border-black rounded-2xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-6">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-black"><path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.474-.197L9.758 4.03c-.258.092-.47.166-.721.27-.257.085-.516.2-.765.325-.247.126-.479.282-.724.428-.2.162-.462.277-.638.48-.199.178-.379.393-.579.563a7 7 0 0 0-.653.888c-.169.259-.343.54-.482.829-.145.293-.236.63-.364.939-.116.33-.208.66-.275 1.002-.087.332-.128.67-.171.997S4 10.79 4 11.13v.75A4.38 4.38 0 0 0 8.38 16.25c.57 0 1.13-.1 1.66-.3a4.37 4.37 0 0 0 2.66-4.01c0-1.17-.44-2.26-1.24-3.05A4.37 4.37 0 0 0 8.38 7.65c-.68 0-1.34.14-1.93.4a.5.5 0 0 0 .05.95z" /><path d="M17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.474-.197-1.514-1.97c-.258.092-.47.166-.721.27-.257.085-.516.2-.765.325-.247.126-.479.282-.724.428-.2.162-.462.277-.638.48-.199.178-.379.393-.579.563a7 7 0 0 0-.653.888c-.169.259-.343.54-.482.829-.145.293-.236.63-.364.939-.116.33-.208.66-.275 1.002-.087.332-.128.67-.171.997s-.063.667-.063 1.007v.75a4.38 4.38 0 0 0 4.38 4.87c.57 0 1.13-.1 1.66-.3a4.37 4.37 0 0 0 2.66-4.01c0-1.17-.44-2.26-1.24-3.05a4.37 4.37 0 0 0-3.08-1.24c-.68 0-1.34.14-1.93.4a.5.5 0 0 0 .05.95z" /></svg>
                        </div>
                        <p className="text-black text-xl font-black leading-relaxed mb-10 italic">
                            「AI特有の堅苦しさがなくて、<span className="bg-[#E88BA3] text-white px-2 py-0.5 not-italic">常連さんからも『最近の投稿、楽しそうですね』と声をかけられました</span>。」
                        </p>
                        <div className="flex items-center gap-5 border-t-[3px] border-black pt-8">
                            <div className="w-16 h-16 bg-white border-[3px] border-black rounded-2xl flex items-center justify-center text-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">☕</div>
                            <div>
                                <p className="font-black text-black text-lg uppercase tracking-tight">カフェオーナーさま</p>
                                <p className="text-sm text-black font-bold opacity-60 uppercase tracking-widest">東京都渋谷区</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border-[4px] border-black rounded-2xl p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative group hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
                        <div className="absolute -top-5 -right-5 bg-[#4DB39A] border-[3px] border-black rounded-2xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-6">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.474-.197L9.758 4.03c-.258.092-.47.166-.721.27-.257.085-.516.2-.765.325-.247.126-.479.282-.724.428-.2.162-.462.277-.638.48-.199.178-.379.393-.579.563a7 7 0 0 0-.653.888c-.169.259-.343.54-.482.829-.145.293-.236.63-.364.939-.116.33-.208.66-.275 1.002-.087.332-.128.67-.171.997S4 10.79 4 11.13v.75A4.38 4.38 0 0 0 8.38 16.25c.57 0 1.13-.1 1.66-.3a4.37 4.37 0 0 0 2.66-4.01c0-1.17-.44-2.26-1.24-3.05A4.37 4.37 0 0 0 8.38 7.65c-.68 0-1.34.14-1.93.4a.5.5 0 0 0 .05.95z" /><path d="M17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.474-.197-1.514-1.97c-.258.092-.47.166-.721.27-.257.085-.516.2-.765.325-.247.126-.479.282-.724.428-.2.162-.462.277-.638.48-.199.178-.379.393-.579.563a7 7 0 0 0-.653.888c-.169.259-.343.54-.482.829-.145.293-.236.63-.364.939-.116.33-.208.66-.275 1.002-.087.332-.128.67-.171.997s-.063.667-.063 1.007v.75a4.38 4.38 0 0 0 4.38 4.87c.57 0 1.13-.1 1.66-.3a4.37 4.37 0 0 0 2.66-4.01c0-1.17-.44-2.26-1.24-3.05a4.37 4.37 0 0 0-3.08-1.24c-.68 0-1.34.14-1.93.4a.5.5 0 0 0 .05.95z" /></svg>
                        </div>
                        <p className="text-black text-xl font-black leading-relaxed mb-10 italic">
                            「スタッフ数人で運用していますが、<span className="bg-[#4DB39A] text-white px-2 py-0.5 not-italic">誰が書いても『お店のトーン』が揃うのが安心</span>。任せられるようになりました。」
                        </p>
                        <div className="flex items-center gap-5 border-t-[3px] border-black pt-8">
                            <div className="w-16 h-16 bg-white border-[3px] border-black rounded-2xl flex items-center justify-center text-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">✂️</div>
                            <div>
                                <p className="font-black text-black text-lg uppercase tracking-tight">美容室オーナーさま</p>
                                <p className="text-sm text-black font-bold opacity-60 uppercase tracking-widest">大阪府大阪市</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
