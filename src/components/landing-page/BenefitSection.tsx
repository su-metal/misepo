"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';
import { CountUp } from './CountUp';

export const BenefitSection = ({ isMobile = false }: { isMobile?: boolean }) => {
    return (
        <>
            {/* Why MisePo Now */}
            <section className={`py-12 md:py-32 bg-white relative overflow-hidden ${isMobile ? 'px-4' : ''}`}>
                <div className={`${isMobile ? 'w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'} relative z-10`}>
                    <div className="text-center mb-12">
                        <span className="bg-white text-[var(--ichizen-blue)] font-bold tracking-widest text-xs uppercase mb-6 px-4 py-1.5 border border-[var(--ichizen-blue)]/20 rounded-full shadow-sm inline-block">Why MisePo?</span>
                        <h2 className={`font-bold text-[var(--ichizen-text)] mb-8 tracking-tight leading-tight ${isMobile ? 'text-2xl' : 'text-4xl md:text-6xl'}`}>
                            なぜ今、<br className={isMobile ? '' : 'md:hidden'} /><span className="text-[var(--ichizen-blue)]">MisePo（分身）</span>が<br className={isMobile ? '' : 'md:hidden'} />必要なのか？
                        </h2>
                        <p className={`text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium ${isMobile ? 'text-xs px-2' : 'text-lg'}`}>
                            SNSは、今やお店の<span className="text-[var(--ichizen-text)] font-bold bg-[var(--ichizen-blue)]/20 px-1 rounded mx-1">「看板」そのもの</span>。<br />
                            投稿の一つひとつが、採用・信頼・集客を左右する大切な資産です。
                        </p>
                    </div>

                    <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3 max-w-6xl mx-auto'}`}>
                        {/* Card 1 */}
                        <div className={`bg-white border border-slate-100 rounded-[32px] relative shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] group transition-all duration-300 ${isMobile ? 'p-6' : 'p-8 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]'}`}>
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`bg-[var(--ichizen-green)]/20 rounded-2xl flex items-center justify-center shrink-0 ${isMobile ? 'w-10 h-10' : 'w-14 h-14 group-hover:scale-110'}`}>
                                    <Icons.Users size={isMobile ? 20 : 28} className="text-[var(--ichizen-green)]" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recruiting</div>
                                    <h3 className={`${isMobile ? 'text-base' : 'text-xl'} font-bold text-[var(--ichizen-text)]`}>採用への影響</h3>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2 mb-4 text-[var(--ichizen-green)]">
                                <span className={`${isMobile ? 'text-4xl' : 'text-6xl'} font-black tabular-nums tracking-tighter`}><CountUp end={85} /></span>
                                <span className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold`}>%</span>
                            </div>
                            <p className={`text-slate-500 font-medium leading-relaxed ${isMobile ? 'text-[10px]' : 'text-base'}`}>
                                若者の85%は、バイト応募前に店主の<span className="text-slate-700 font-bold border-b-2 border-[var(--ichizen-green)]/30">SNSで職場の雰囲気</span>をチェックしています。
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className={`bg-white border border-slate-100 rounded-[32px] relative shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] group transition-all duration-300 ${isMobile ? 'p-6' : 'p-8 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]'}`}>
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`bg-[var(--ichizen-blue)]/20 rounded-2xl flex items-center justify-center shrink-0 ${isMobile ? 'w-10 h-10' : 'w-14 h-14 group-hover:scale-110'}`}>
                                    <Icons.ShieldCheck size={isMobile ? 20 : 28} className="text-[var(--ichizen-blue)]" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trust</div>
                                    <h3 className={`${isMobile ? 'text-base' : 'text-xl'} font-bold text-[var(--ichizen-text)]`}>信頼度の向上</h3>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2 mb-4 text-[var(--ichizen-blue)]">
                                <span className={`${isMobile ? 'text-4xl' : 'text-6xl'} font-black tabular-nums tracking-tighter`}>1.7</span>
                                <span className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold`}>倍</span>
                            </div>
                            <p className={`text-slate-500 font-medium leading-relaxed ${isMobile ? 'text-[10px]' : 'text-base'}`}>
                                クチコミに丁寧に返信している店は、そうでない店より<span className="text-slate-700 font-bold border-b-2 border-[var(--ichizen-blue)]/30">顧客の信頼度</span>が圧倒的に高まります。
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className={`bg-white border border-slate-100 rounded-[32px] relative shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] group transition-all duration-300 ${isMobile ? 'p-6' : 'p-8 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]'}`}>
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`bg-[var(--ichizen-text)]/20 rounded-2xl flex items-center justify-center shrink-0 ${isMobile ? 'w-10 h-10' : 'w-14 h-14 group-hover:scale-110'}`}>
                                    <Icons.TrendingDown size={isMobile ? 20 : 28} className="text-[var(--ichizen-text)]" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loss</div>
                                    <h3 className={`${isMobile ? 'text-base' : 'text-xl'} font-bold text-[var(--ichizen-text)]`}>機会損失</h3>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2 mb-4 text-[var(--ichizen-text)]">
                                <span className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-black tabular-nums tracking-tighter`}>2人に1人</span>
                            </div>
                            <p className={`text-slate-500 font-medium leading-relaxed ${isMobile ? 'text-[10px]' : 'text-base'}`}>
                                <span className="text-slate-700 font-bold border-b-2 border-[var(--ichizen-text)]/30">最新情報が不明な店</span>への来店を断念した経験があります。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solution */}
            <section id="solution" className={`py-12 md:py-32 bg-[var(--ichizen-text)] text-white overflow-hidden relative ${isMobile ? 'px-4' : ''}`}>
                <div className={`${isMobile ? 'w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'} relative z-10`}>
                    <div className="text-center mb-16">
                        <span className="bg-[var(--ichizen-blue)]/10 text-[var(--ichizen-blue)] font-bold tracking-widest text-xs uppercase mb-6 px-4 py-1.5 border border-[var(--ichizen-blue)]/20 rounded-full inline-block">Solution</span>
                        <h2 className={`font-bold mb-10 tracking-tight leading-tight ${isMobile ? 'text-2xl' : 'text-4xl md:text-6xl'}`}>
                            AIが、<br className={isMobile ? '' : 'md:hidden'} /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--ichizen-blue)] to-[var(--ichizen-green)]">あなたの『分身』</span><br className={isMobile ? '' : 'md:hidden'} />になる。
                        </h2>
                        <p className={`text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium ${isMobile ? 'text-xs px-2' : 'text-lg'}`}>
                            MisePoが作るのは、事務的な文章ではありません。<br />
                            あなた独自の<span className="text-[var(--ichizen-green)]">「温度感」</span>が宿る、<br className={isMobile ? '' : 'md:hidden'} />分身の言葉をお届けします。
                        </p>
                    </div>

                    <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3 max-w-6xl mx-auto mb-32'}`}>
                        {/* Step 1 */}
                        <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-[32px] relative shadow-lg group transition-all duration-300 ${isMobile ? 'p-6' : 'p-8 hover:-translate-y-2 hover:bg-slate-800'}`}>
                            <div className="flex flex-col items-start gap-6">
                                <div className={`bg-[var(--ichizen-blue)]/20 rounded-2xl flex items-center justify-center text-[var(--ichizen-blue)] shadow-inner transition-transform duration-300 ${isMobile ? 'w-10 h-10' : 'w-14 h-14 group-hover:scale-110'}`}>
                                    <Icons.Bot size={isMobile ? 20 : 28} />
                                </div>
                                <div className="space-y-3">
                                    <div className="inline-block px-3 py-1 bg-[var(--ichizen-blue)]/10 text-[var(--ichizen-blue)] text-[10px] font-bold uppercase rounded-full border border-[var(--ichizen-blue)]/20">Step 1</div>
                                    <h3 className={`${isMobile ? 'text-base' : 'text-xl'} font-bold text-white`}>お手本を学習</h3>
                                </div>
                            </div>
                            <p className={`text-slate-400 leading-relaxed mt-6 font-medium ${isMobile ? 'text-[10px]' : 'text-sm'}`}>
                                過去の投稿の<span className="text-[var(--ichizen-blue)] font-bold">スクショや文章を登録するだけ</span>。<br />
                                AIがあなた独自の「口癖」や「絵文字の使い所」を忠実に再現します。
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-[32px] relative shadow-lg group transition-all duration-300 ${isMobile ? 'p-6' : 'p-8 hover:-translate-y-2 hover:bg-slate-800'}`}>
                            <div className="flex flex-col items-start gap-6">
                                <div className={`bg-[var(--ichizen-blue)]/20 rounded-2xl flex items-center justify-center text-[var(--ichizen-blue)] shadow-inner transition-transform duration-300 ${isMobile ? 'w-10 h-10' : 'w-14 h-14 group-hover:scale-110'}`}>
                                    <Icons.Users size={isMobile ? 20 : 28} />
                                </div>
                                <div className="space-y-3">
                                    <div className="inline-block px-3 py-1 bg-[var(--ichizen-blue)]/10 text-[var(--ichizen-blue)] text-[10px] font-bold uppercase rounded-full border border-[var(--ichizen-blue)]/20">Step 2</div>
                                    <h3 className={`${isMobile ? 'text-base' : 'text-xl'} font-bold text-white`}>「中の人」を自在に</h3>
                                </div>
                            </div>
                            <p className={`text-slate-400 leading-relaxed mt-6 font-medium ${isMobile ? 'text-[10px]' : 'text-sm'}`}>
                                「熱い店長」「親しみやすい看板娘」など、投稿の目的に合わせて<span className="text-[var(--ichizen-blue)] font-bold">人格を切り替え</span>。
                            </p>
                        </div>

                        {/* Result */}
                        <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-[32px] relative shadow-lg group transition-all duration-300 ${isMobile ? 'p-6' : 'p-8 hover:-translate-y-2 hover:bg-slate-800'}`}>
                            <div className="flex flex-col items-start gap-6">
                                <div className={`bg-[var(--ichizen-green)]/20 rounded-2xl flex items-center justify-center text-[var(--ichizen-green)] shadow-inner transition-transform duration-300 ${isMobile ? 'w-10 h-10' : 'w-14 h-14 group-hover:scale-110'}`}>
                                    <Icons.Heart size={isMobile ? 20 : 28} />
                                </div>
                                <div className="space-y-3">
                                    <div className="inline-block px-3 py-1 bg-[var(--ichizen-green)]/10 text-[var(--ichizen-green)] text-[10px] font-bold uppercase rounded-full border border-[var(--ichizen-green)]/20">Result</div>
                                    <h3 className={`${isMobile ? 'text-base' : 'text-xl'} font-bold text-white`}>投稿作業を5秒で完結</h3>
                                </div>
                            </div>
                            <p className={`text-slate-400 leading-relaxed mt-6 font-medium ${isMobile ? 'text-[10px]' : 'text-sm'}`}>
                                各SNSの投稿画面へ直接ジャンプできるので、投稿作業が驚くほどスムーズになります。
                            </p>
                        </div>
                    </div>

                    <div className={`text-center ${isMobile ? 'mt-12' : 'mt-24'}`}>
                        <div className={`inline-flex items-center gap-4 bg-gradient-to-r from-[var(--ichizen-blue)] to-[var(--ichizen-blue-light)] text-white rounded-[24px] shadow-lg shadow-[var(--ichizen-blue)]/20 transition-transform cursor-default ${isMobile ? 'px-6 py-4' : 'px-8 py-5'}`}>
                            <Icons.CheckCircle size={isMobile ? 20 : 24} className="text-[var(--ichizen-green)]" />
                            <span className={`font-bold tracking-tight ${isMobile ? 'text-xs' : 'text-lg'}`}>「これなら自分の言葉として発信できる」</span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
