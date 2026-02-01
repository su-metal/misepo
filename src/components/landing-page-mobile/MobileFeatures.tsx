"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const MobileFeatures = () => {
    return (
        <section className="space-y-6 mb-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-[#122646] text-lg mb-6 text-center">
                    <span className="block text-xs text-[#00b900] tracking-widest uppercase mb-2">Why MisePo?</span>
                    選ばれる3つの理由
                </h3>

                <div className="space-y-6">
                    {/* Feature 1 */}
                    <div className="text-center">
                        <div className="w-12 h-12 mx-auto bg-[#1f29fc]/10 rounded-2xl flex items-center justify-center text-[#1f29fc] mb-3">
                            <Icons.Users size={24} />
                        </div>
                        <h4 className="font-bold text-[#122646] mb-2">採用率 1.8倍</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            若者の85%は応募前にSNSをチェック。<br />
                            「雰囲気の良さ」を伝えて採用力UP。
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="text-center">
                        <div className="w-12 h-12 mx-auto bg-[#00b900]/10 rounded-2xl flex items-center justify-center text-[#00b900] mb-3">
                            <Icons.ShieldCheck size={24} />
                        </div>
                        <h4 className="font-bold text-[#122646] mb-2">信頼の獲得</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            丁寧なクチコミ返信で、<br />
                            お客様からの信頼度が劇的に向上。
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="text-center">
                        <div className="w-12 h-12 mx-auto bg-[#f2e018]/10 rounded-2xl flex items-center justify-center text-[#f2e018] mb-3">
                            <Icons.Zap size={24} />
                        </div>
                        <h4 className="font-bold text-[#122646] mb-2">圧倒的時短</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            投稿作成にかかる時間は約30秒。<br />
                            もう、閉店後に残る必要はありません。
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-[#122646] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="font-bold text-lg mb-4">4大SNSを<br />一括管理</h3>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                        Instagram, X, LINE, Google Maps。<br />
                        バラバラのアプリを開くのはもう終わり。<br />
                        MisePoひとつで完結します。
                    </p>
                    <div className="flex justify-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20"><Icons.Instagram size={18} /></div>
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20"><Icons.Twitter size={18} /></div>
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20"><Icons.MessageCircle size={18} /></div>
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20"><Icons.MapPin size={18} /></div>
                    </div>
                </div>
            </div>
        </section>
    );
};
