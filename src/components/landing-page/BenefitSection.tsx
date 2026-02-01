"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';
import { CountUp } from './CountUp';

export const BenefitSection = ({ isMobile = false }: { isMobile?: boolean }) => {
    return (
        <>
            {/* Why MisePo Now */}
            <section className="py-24 md:py-48 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col items-start mb-24">
                        <span className="text-[10px] font-black text-[#1823ff] uppercase tracking-[0.2em] mb-8 px-4 py-2 bg-[#1823ff]/5 rounded-full border border-[#1823ff]/10">The Market Gap</span>
                        <h2 className={`font-black text-[#282d32] tracking-tight leading-[0.9] ${isMobile ? 'text-5xl' : 'text-7xl md:text-8xl lg:text-[7.5rem]'}`}>
                            WHY<br />
                            <span className="text-[#1823ff]">MISEPO?</span>
                        </h2>
                    </div>

                    <div className={`grid gap-12 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
                        {/* Card 1 */}
                        <div className="flex flex-col items-start gap-8">
                            <div className="flex items-baseline gap-4 text-[#282d32]">
                                <span className="text-7xl md:text-8xl font-black tracking-tighter tabular-nums"><CountUp end={85} /></span>
                                <span className="text-2xl font-black">%</span>
                            </div>
                            <h3 className="text-2xl font-black text-[#282d32]">Recruiting Power</h3>
                            <p className="text-lg font-bold text-slate-400 leading-tight">
                                若者の85%は、応募前に店主のSNSで「職場の温度」を確かめています。
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="flex flex-col items-start gap-8">
                            <div className="flex items-baseline gap-4 text-[#1823ff]">
                                <span className="text-7xl md:text-8xl font-black tracking-tighter tabular-nums">1.7</span>
                                <span className="text-2xl font-black">x</span>
                            </div>
                            <h3 className="text-2xl font-black text-[#282d32]">Trust Index</h3>
                            <p className="text-lg font-bold text-slate-400 leading-tight">
                                丁寧なレスポンスがある店は、そうでない店に比べ、信頼度が1.7倍に跳ね上がります。
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="flex flex-col items-start gap-8 text-[#282d32]">
                            <div className="flex items-baseline gap-4">
                                <span className="text-4xl md:text-5xl font-black tracking-tighter leading-none">EVERY<br />OTHER</span>
                            </div>
                            <h3 className="text-2xl font-black text-[#282d32]">Opportunity Loss</h3>
                            <p className="text-lg font-bold text-slate-400 leading-tight">
                                2人に1人が「最新情報が不明な店」への来店をあきらめた経験があります。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solution */}
            <section id="solution" className="py-24 md:py-48 bg-[#282d32] text-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-32">
                        <span className="text-[10px] font-black text-[#1823ff] uppercase tracking-[0.2em] mb-10 px-4 py-2 bg-[#1823ff]/10 rounded-full border border-[#1823ff]/20 inline-block">The Solution</span>
                        <h2 className={`font-black tracking-tighter leading-[0.9] text-white mb-12 ${isMobile ? 'text-5xl' : 'text-7xl md:text-8xl lg:text-[8rem]'}`}>
                            AI BUT<br />
                            <span className="text-[#1823ff]">HUMAN.</span>
                        </h2>
                        <p className="text-xl md:text-3xl font-bold text-slate-400 max-w-3xl mx-auto leading-tight">
                            MisePoが作るのは、事務的な文章ではありません。あなたのお店独自の「温度感」が宿る、分身の言葉をお届けします。
                        </p>
                    </div>

                    <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
                        {/* Step 1 */}
                        <div className="bg-[#white]/5 border border-white/10 rounded-[40px] p-10 hover:bg-white/10 transition-all cursor-default">
                            <div className="text-[10px] font-black text-[#1823ff] mb-6">STEP 01</div>
                            <h3 className="text-2xl font-black text-white mb-6">お手本を学習</h3>
                            <p className="text-slate-400 font-bold leading-tight">
                                過去の投稿を登録するだけ。AIがあなた独自の「口癖」や「リズム」を忠実に再現します。
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-[#white]/5 border border-white/10 rounded-[40px] p-10 hover:bg-white/10 transition-all cursor-default">
                            <div className="text-[10px] font-black text-[#1823ff] mb-6">STEP 02</div>
                            <h3 className="text-2xl font-black text-white mb-6">人格を自在に</h3>
                            <p className="text-slate-400 font-bold leading-tight">
                                「熱い店長」「親しみやすい看板娘」など、目的に合わせて中の人を切り替え。
                            </p>
                        </div>

                        {/* Result */}
                        <div className="bg-[#1823ff] rounded-[40px] p-10 shadow-2xl shadow-[#1823ff]/20">
                            <div className="text-[10px] font-black text-white/50 mb-6">RESULT</div>
                            <h3 className="text-2xl font-black text-white mb-6">5秒で完結</h3>
                            <p className="text-white/80 font-bold leading-tight">
                                媒体ごとに最適な振る舞いで、あなたに代わって「想い」を発信し続けます。
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
