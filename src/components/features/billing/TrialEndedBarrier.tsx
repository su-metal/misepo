"use client";

import React from 'react';
import { Icons } from '../../LandingPageIcons';

interface TrialEndedBarrierProps {
    onUpgrade: () => void;
    usageCount: number;
}

export const TrialEndedBarrier = ({ onUpgrade, usageCount }: TrialEndedBarrierProps) => {
    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white border-[6px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] rounded-[40px] max-w-lg w-full p-8 md:p-12 animate-in zoom-in duration-300 relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5CC6D]/10 rounded-full -translate-y-1/2 translate-x-1/2" />

                <div className="text-center relative z-10">
                    <div className="w-20 h-20 bg-[#E88BA3] border-[4px] border-black rounded-[24px] flex items-center justify-center text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] mx-auto mb-8 -rotate-3">
                        <Icons.ShieldCheck size={40} />
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black text-black mb-6 leading-tight italic uppercase">
                        無料体験期間が<br />
                        <span className="text-[#E88BA3] underline decoration-[6px] decoration-black underline-offset-8">終了しました</span>
                    </h2>

                    <div className="bg-black/5 border-[3px] border-dashed border-black/10 rounded-2xl p-6 mb-10">
                        <p className="text-sm font-black text-black/60 uppercase tracking-widest mb-2">これまでの成果</p>
                        <p className="text-2xl font-black text-black">
                            計 <span className="text-3xl text-[#4DB39A] italic">{usageCount}回</span> の投稿作成を時短
                        </p>
                    </div>

                    <p className="text-lg font-bold text-black mb-10 leading-relaxed opacity-70">
                        MisePoをご利用いただきありがとうございます。<br />
                        引き続き、あなたの「分身」としてSNS運用をお手伝いさせていただいてもよろしいでしょうか？
                    </p>

                    <button
                        onClick={onUpgrade}
                        className="w-full py-6 bg-[#4DB39A] text-white font-black text-2xl uppercase italic border-[4px] border-black rounded-[24px] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                        Proプランに登録する <Icons.ChevronUp size={28} className="rotate-90" />
                    </button>

                    <p className="mt-8 text-[11px] font-black text-black/40 uppercase tracking-widest leading-relaxed">
                        月額 ¥980〜（選べる3つのプラン）<br />
                        いつでもマイページから解約可能です。
                    </p>
                </div>
            </div>
        </div>
    );
};
