"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const WorkflowSection = () => {
    return (
        <section className="py-20 md:py-32 bg-[#f9f5f2] overflow-hidden border-b-[6px] border-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="bg-[#9B8FD4] text-black font-black tracking-tight text-sm uppercase mb-6 px-4 py-2 border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl inline-block">Seamless Workflow</span>
                    <h2 className="text-4xl md:text-7xl font-black text-black mb-8 tracking-tight leading-tight">
                        「作成」から「投稿」まで、<br />
                        <span className="underline decoration-[8px] decoration-[#4DB39A]">流れるように。</span>
                    </h2>
                    <p className="text-black text-xl font-bold opacity-80 leading-relaxed">
                        文章をコピーする手間すら、MisePoが引き受けます。<br className="hidden md:block" />
                        ボタン一押しで、各SNSの最適なページへあなたを案内します。
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* X (Twitter) */}
                    <div className="bg-white border-[4px] border-black rounded-2xl p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] transition-all group">
                        <div className="w-16 h-16 bg-black border-[3px] border-white rounded-2xl text-white flex items-center justify-center mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-12 transition-transform"><Icons.Twitter size={28} /></div>
                        <h3 className="text-2xl font-black text-black mb-4 uppercase italic">X (Twitter)</h3>
                        <p className="text-black font-bold opacity-80 leading-relaxed mb-8">
                            生成された文章が自動コピーされ、そのまま<span className="bg-black text-white px-1">投稿画面</span>が立ち上がります。あとは貼り付けて投稿ボタンを押すだけ。
                        </p>
                        <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 border-[2px] border-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
                            <span>投稿画面へ</span>
                            <Icons.ChevronDown size={14} className="-rotate-90" />
                        </div>
                    </div>

                    {/* Instagram */}
                    <div className="bg-white border-[4px] border-black rounded-2xl p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] transition-all group">
                        <div className="w-16 h-16 bg-[#E88BA3] border-[3px] border-black rounded-2xl text-black flex items-center justify-center mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-rotate-12 transition-transform"><Icons.Instagram size={28} /></div>
                        <h3 className="text-2xl font-black text-black mb-4 uppercase italic">Instagram</h3>
                        <p className="text-black font-bold opacity-80 leading-relaxed mb-8">
                            文章を保持した状態で<span className="bg-[#E88BA3] text-black px-1">Instagramアプリ</span>へジャンプ。ハッシュタグも含めて一気にコピーされるので手間いらずです。
                        </p>
                        <div className="inline-flex items-center gap-2 bg-[#E88BA3] text-black px-4 py-2 border-[2px] border-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(233,62,126,0.3)]">
                            <span>アプリを起動</span>
                            <Icons.ChevronDown size={14} className="-rotate-90" />
                        </div>
                    </div>

                    {/* Google Maps */}
                    <div className="bg-white border-[4px] border-black rounded-2xl p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] transition-all group">
                        <div className="w-16 h-16 bg-[#4DB39A] border-[3px] border-black rounded-2xl text-black flex items-center justify-center mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform"><Icons.MapPin size={28} /></div>
                        <h3 className="text-2xl font-black text-black mb-4 uppercase italic">Googleマップ</h3>
                        <p className="text-black font-bold opacity-80 leading-relaxed mb-8">
                            あなたのお店の<span className="bg-[#4DB39A] text-black px-1">クチコミ管理ページ</span>へ直行。どのクチコミに返信するか迷う時間をゼロにします。
                        </p>
                        <div className="inline-flex items-center gap-2 bg-[#4DB39A] text-black px-4 py-2 border-[2px] border-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(8,160,146,0.3)]">
                            <span>管理ページへ</span>
                            <Icons.ChevronDown size={14} className="-rotate-90" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
