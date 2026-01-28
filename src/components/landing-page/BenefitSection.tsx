"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';
import { CountUp } from './CountUp';

export const BenefitSection = () => {
    return (
        <>
            {/* Why MisePo Now */}
            <section className="py-20 md:py-32 bg-[#F9F7F2] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <span className="bg-white text-[#E88BA3] font-bold tracking-widest text-xs uppercase mb-6 px-4 py-1.5 border border-[#E88BA3]/20 rounded-full shadow-sm inline-block">Why MisePo?</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-8 tracking-tight leading-tight">
                            なぜ今、<br className="md:hidden" /><span className="text-[#E88BA3]">MisePo（分身）</span>が<br className="md:hidden" />必要なのか？
                        </h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
                            SNSは、今やお店の<span className="text-slate-800 font-bold bg-[#E88BA3]/20 px-1 rounded mx-1">「看板」そのもの</span>。<br />
                            投稿の一つひとつが、採用・信頼・集客を左右する大切な資産です。
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Card 1 */}
                        <div className="bg-white border border-slate-100 rounded-[40px] p-8 relative shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] group hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-300">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 bg-[#F5CC6D]/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <Icons.Users size={28} className="text-[#F5CC6D]" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recruiting</div>
                                    <h3 className="text-xl font-bold text-slate-800">採用への影響</h3>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2 mb-6 text-[#F5CC6D]">
                                <span className="text-6xl font-black tabular-nums tracking-tighter"><CountUp end={85} /></span>
                                <span className="text-3xl font-bold">%</span>
                            </div>
                            <p className="text-slate-500 font-medium text-base leading-relaxed">
                                若者の85%は、バイト応募前に店主の<span className="text-slate-700 font-bold border-b-2 border-[#F5CC6D]/30">SNSで職場の雰囲気</span>をチェックしています。
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white border border-slate-100 rounded-[40px] p-8 relative shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] group hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-300">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 bg-[#4DB39A]/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <Icons.ShieldCheck size={28} className="text-[#4DB39A]" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trust</div>
                                    <h3 className="text-xl font-bold text-slate-800">信頼度の向上</h3>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2 mb-6 text-[#4DB39A]">
                                <span className="text-6xl font-black tabular-nums tracking-tighter">1.7</span>
                                <span className="text-3xl font-bold">倍</span>
                            </div>
                            <p className="text-slate-500 font-medium text-base leading-relaxed">
                                クチコミに丁寧に返信している店は、そうでない店より<span className="text-slate-700 font-bold border-b-2 border-[#4DB39A]/30">顧客の信頼度</span>が圧倒的に高まります。
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white border border-slate-100 rounded-[40px] p-8 relative shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] group hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-300">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 bg-[#9B8FD4]/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <Icons.TrendingDown size={28} className="text-[#9B8FD4]" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loss</div>
                                    <h3 className="text-xl font-bold text-slate-800">機会損失</h3>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2 mb-6 text-[#9B8FD4]">
                                <span className="text-5xl font-black tabular-nums tracking-tighter">2人に1人</span>
                            </div>
                            <p className="text-slate-500 font-medium text-base leading-relaxed">
                                <span className="text-slate-700 font-bold border-b-2 border-[#9B8FD4]/30">最新情報が不明な店</span>への来店を断念した経験があります。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solution */}
            <section id="solution" className="py-20 md:py-32 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
                    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#E88BA3] rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#4DB39A] rounded-full blur-[100px]" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-24">
                        <span className="bg-[#4DB39A]/10 text-[#4DB39A] font-bold tracking-widest text-xs uppercase mb-6 px-4 py-1.5 border border-[#4DB39A]/20 rounded-full inline-block">Solution</span>
                        <h2 className="text-3xl md:text-5xl font-bold mb-10 tracking-tight leading-tight">
                            AIが、<br className="md:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E88BA3] to-[#F5CC6D]">あなたの『分身』</span><br className="md:hidden" />になる。
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
                            MisePoが作るのは、事務的な文章ではありません。<br />
                            あなた独自の<span className="text-[#F5CC6D]">「温度感」</span>が宿る、<br className="md:hidden" />分身の言葉をお届けします。
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-32">
                        {/* Step 1 */}
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-[40px] p-8 relative shadow-lg group hover:-translate-y-2 hover:bg-slate-800 transition-all duration-300">
                            <div className="flex flex-col items-start gap-6">
                                <div className="w-14 h-14 bg-[#4DB39A]/20 rounded-2xl flex items-center justify-center text-[#4DB39A] shadow-inner group-hover:scale-110 transition-transform duration-300">
                                    <Icons.Bot size={28} />
                                </div>
                                <div className="space-y-3">
                                    <div className="inline-block px-3 py-1 bg-[#4DB39A]/10 text-[#4DB39A] text-[10px] font-bold uppercase rounded-full border border-[#4DB39A]/20">Step 1</div>
                                    <h3 className="text-xl font-bold text-white">お手本を学習</h3>
                                </div>
                            </div>
                            <p className="text-slate-400 leading-relaxed mt-6 font-medium text-sm">
                                過去の投稿の<span className="text-[#4DB39A] font-bold">スクショや文章を登録するだけ</span>。<br />
                                AIがあなた独自の「口癖」や「絵文字の使い所」を忠実に再現します。
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-[40px] p-8 relative shadow-lg group hover:-translate-y-2 hover:bg-slate-800 transition-all duration-300">
                            <div className="flex flex-col items-start gap-6">
                                <div className="w-14 h-14 bg-[#E88BA3]/20 rounded-2xl flex items-center justify-center text-[#E88BA3] shadow-inner group-hover:scale-110 transition-transform duration-300">
                                    <Icons.Users size={28} />
                                </div>
                                <div className="space-y-3">
                                    <div className="inline-block px-3 py-1 bg-[#E88BA3]/10 text-[#E88BA3] text-[10px] font-bold uppercase rounded-full border border-[#E88BA3]/20">Step 2</div>
                                    <h3 className="text-xl font-bold text-white">「中の人」を自由自在に</h3>
                                </div>
                            </div>
                            <p className="text-slate-400 leading-relaxed mt-6 font-medium text-sm">
                                「熱い店長」「親しみやすい看板娘」など、投稿の目的に合わせて<span className="text-[#E88BA3] font-bold">人格を切り替え</span>。
                                複数のスタッフで運営しているような多様性を。
                            </p>
                        </div>

                        {/* Result */}
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-[40px] p-8 relative shadow-lg group hover:-translate-y-2 hover:bg-slate-800 transition-all duration-300">
                            <div className="flex flex-col items-start gap-6">
                                <div className="w-14 h-14 bg-[#F5CC6D]/20 rounded-2xl flex items-center justify-center text-[#F5CC6D] shadow-inner group-hover:scale-110 transition-transform duration-300">
                                    <Icons.Heart size={28} />
                                </div>
                                <div className="space-y-3">
                                    <div className="inline-block px-3 py-1 bg-[#F5CC6D]/10 text-[#F5CC6D] text-[10px] font-bold uppercase rounded-full border border-[#F5CC6D]/20">Result</div>
                                    <h3 className="text-xl font-bold text-white">投稿作業を5秒で完結</h3>
                                </div>
                            </div>
                            <p className="text-slate-400 leading-relaxed mt-6 font-medium text-sm">
                                生成された文章はタップ一つで<span className="text-[#F5CC6D] font-bold">自動コピー</span>。
                                各SNSの投稿画面へ直接ジャンプできるので、投稿作業が驚くほどスムーズになります。
                            </p>
                        </div>
                    </div>

                    <div className="mt-24 text-center">
                        <div className="inline-flex items-center gap-4 bg-gradient-to-r from-[#4DB39A] to-[#45a089] text-white px-8 py-5 rounded-[24px] shadow-lg shadow-[#4DB39A]/20 transition-transform cursor-default">
                            <Icons.CheckCircle size={24} className="text-[#F5CC6D]" />
                            <span className="font-bold text-lg tracking-tight">「これなら自分の言葉として発信できる」という安心感を。</span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
