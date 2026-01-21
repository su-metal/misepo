"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';
import { CountUp } from './CountUp';

export const BenefitSection = () => {
    return (
        <>
            {/* Why MisePo Now */}
            <section className="py-16 md:py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-indigo-600 font-bold tracking-wider text-sm uppercase mb-3 block">Why MisePo?</span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                            なぜ今、<br className="md:hidden" /><span className="text-indigo-600">MisePo（分身）</span>が<br className="md:hidden" />必要なのか？
                        </h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
                            SNSはただの宣伝ツールではありません。<br />
                            採用、信頼、集客...お店の未来を左右するインフラです。
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 lg:gap-8 max-w-6xl mx-auto">
                        <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-200 relative group hover:border-pink-200 transition-colors duration-500">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-pink-100 text-pink-500 rounded-xl flex items-center justify-center shrink-0">
                                    <Icons.Users size={24} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Recruiting</div>
                                    <h3 className="text-xl font-bold text-slate-900">採用への影響</h3>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-6xl font-black text-slate-900"><CountUp end={85} /></span>
                                <span className="text-2xl font-bold text-slate-400">%</span>
                            </div>
                            <p className="text-slate-600 font-bold leading-relaxed">
                                若者の85%は、バイト応募前に店主の<span className="bg-pink-100 text-pink-800 px-1">SNSで職場の雰囲気</span>をチェックしています。
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-200 relative group hover:border-green-200 transition-colors duration-500">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                                    <Icons.ShieldCheck size={24} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Trust</div>
                                    <h3 className="text-xl font-bold text-slate-900">信頼度の向上</h3>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-5xl font-black text-slate-900">1.7</span>
                                <span className="text-2xl font-bold text-slate-400">倍</span>
                            </div>
                            <p className="text-slate-600 font-bold leading-relaxed">
                                クチコミに丁寧に返信している店は、そうでない店より<span className="bg-green-100 text-green-800 px-1">顧客の信頼度</span>が圧倒的に高まります。
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-200 relative group hover:border-blue-200 transition-colors duration-500">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                    <Icons.TrendingDown size={24} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Opportunity Loss</div>
                                    <h3 className="text-xl font-bold text-slate-900">機会損失</h3>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black text-slate-900">2人に1人</span>
                            </div>
                            <p className="text-slate-600 font-bold leading-relaxed">
                                <span className="bg-blue-100 text-blue-800 px-1">最新情報が不明な店</span>への来店を断念した経験があります。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solution */}
            <section id="solution" className="py-16 md:py-24 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px]" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <span className="text-indigo-400 font-bold tracking-wider text-sm uppercase mb-3 block">Solution</span>
                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                            AIが、<br className="md:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">あなたの<br className="md:hidden" />『分身』になる。</span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                            MisePoは単なる自動生成ツール<br className="md:hidden" />ではありません。<br />
                            あなたの過去の投稿を学習し、まるで<br className="md:hidden" />あなたが書いたかのような文章を<br className="md:hidden" />生み出します。
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto mb-24">
                        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-slate-700 relative group hover:border-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-300">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-bl-full opacity-50" />
                            <div className="flex flex-row md:flex-col items-center gap-4 md:gap-0">
                                <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-900/20 md:mb-6 group-hover:scale-110 transition-transform duration-300 shrink-0">
                                    <Icons.Bot size={28} />
                                </div>
                                <div className="flex flex-col md:items-start">
                                    <div className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold mb-1 md:mb-3 border border-indigo-500/30 w-fit">Step 1</div>
                                    <h3 className="text-xl md:text-2xl font-bold">あなたの『書き癖』を学習</h3>
                                </div>
                            </div>
                            <p className="text-slate-400 leading-relaxed mt-4 md:mt-0">
                                過去の投稿の<span className="text-white font-bold">スクショをアップロードするだけ</span>。<br />
                                面倒な連携やコピペは不要。画像からあなたの「口癖」や「絵文字の使い所」まで瞬時に学習します。
                            </p>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-slate-700 relative group hover:border-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all duration-300">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-transparent rounded-bl-full opacity-50" />
                            <div className="flex flex-row md:flex-col items-center gap-4 md:gap-0">
                                <div className="w-14 h-14 bg-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-900/20 md:mb-6 group-hover:scale-110 transition-transform duration-300 shrink-0">
                                    <Icons.Users size={28} />
                                </div>
                                <div className="flex flex-col md:items-start">
                                    <div className="inline-block px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-xs font-bold mb-1 md:mb-3 border border-pink-500/30 w-fit">Step 2</div>
                                    <h3 className="text-xl md:text-2xl font-bold">「中の人」を自由自在に</h3>
                                </div>
                            </div>
                            <p className="text-slate-400 leading-relaxed mt-4 md:mt-0">
                                「熱い店長」「親しみやすい看板娘」など、投稿の目的に合わせて<span className="text-white font-bold">人格を切り替え</span>。<br />
                                複数のスタッフで運営しているような多様性を。
                            </p>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-slate-700 relative group hover:border-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-bl-full opacity-50" />
                            <div className="flex flex-row md:flex-col items-center gap-4 md:gap-0">
                                <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-900/20 md:mb-6 group-hover:scale-110 transition-transform duration-300 shrink-0">
                                    <Icons.Heart size={28} />
                                </div>
                                <div className="flex flex-col md:items-start">
                                    <div className="inline-block px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-bold mb-1 md:mb-3 border border-green-500/30 w-fit">Result</div>
                                    <h3 className="text-xl md:text-2xl font-bold">クチコミ返信の「壁」を撤去</h3>
                                </div>
                            </div>
                            <p className="text-slate-400 leading-relaxed mt-4 md:mt-0">
                                生成された文章はアイコンをタップするだけで<span className="text-white font-bold">自動コピー</span>。各SNSの投稿画面へ直接ジャンプできるので、投稿作業が驚くほどスムーズになります。
                            </p>
                        </div>
                    </div>

                    {/* Comparison Box */}
                    <div className="max-w-5xl mx-auto bg-slate-800/30 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 border border-slate-700 backdrop-blur-sm">
                        <div className="text-center mb-10">
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">MisePoなら、<br className="md:hidden" />ここまで変わる。</h3>
                            <p className="text-slate-400">「標準的なAI」と「あなたの分身（MisePo）」の違いをご覧ください。</p>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700 flex flex-col md:flex-row items-center gap-4 text-center md:text-left mx-auto max-w-2xl w-full">
                                <div className="p-3 bg-slate-800 rounded-xl text-slate-400 shrink-0">
                                    <Icons.Bot size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Input Memo</div>
                                    <p className="text-lg text-white font-medium">「明日からいちごパフェ。1580円。地元産。」</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 relative">
                                <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-slate-700 rounded-full items-center justify-center border-4 border-slate-800 text-slate-400">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                </div>
                                <div className="md:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center border-4 border-slate-800 text-slate-400">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14" /><path d="m5 12 7 7 7-7" /></svg>
                                </div>

                                <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700/50 opacity-80">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center text-slate-300">
                                            <Icons.Bot size={20} />
                                        </div>
                                        <div className="font-bold text-slate-400">標準的なAI</div>
                                    </div>
                                    <div className="bg-slate-900/50 rounded-2xl p-6 relative">
                                        <div className="absolute top-0 left-6 -translate-y-1/2 w-4 h-4 bg-slate-900/50 rotate-45 border-l border-t border-slate-700/50" />
                                        <p className="text-slate-300 leading-relaxed font-medium">
                                            新作のいちごパフェが明日から発売です。<br />
                                            価格は1,580円です。<br />
                                            地元産のいちごを使用しています。<br />
                                            ぜひご賞味ください。
                                        </p>
                                    </div>
                                    <p className="text-center text-xs text-slate-500 mt-4 font-bold">事務的で、どこか冷たい...</p>
                                </div>

                                <div className="bg-indigo-900/20 rounded-3xl p-8 border border-indigo-500/30 relative overflow-hidden shadow-2xl shadow-indigo-900/20">
                                    <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none" />
                                    <div className="flex items-center gap-3 mb-4 relative z-10">
                                        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg">
                                            <Icons.Sparkles size={20} />
                                        </div>
                                        <div className="font-bold text-white">MisePo (あなたの分身)</div>
                                    </div>
                                    <div className="bg-white text-slate-900 rounded-2xl p-6 relative shadow-lg">
                                        <div className="absolute top-0 left-6 -translate-y-1/2 w-4 h-4 bg-white rotate-45" />
                                        <p className="leading-relaxed font-medium">
                                            お待たせしました🍓<br />
                                            明日から<span className="bg-pink-100 text-pink-800 px-1 rounded">地元の完熟いちご</span>をたっぷり使ったパフェが始まります！<br />
                                            自分へのご褒美にぜひ♪ 11時にお待ちしてます🌿
                                        </p>
                                    </div>
                                    <p className="text-center text-xs text-indigo-300 mt-4 font-bold flex items-center justify-center gap-2">
                                        <Icons.CheckCircle size={14} />
                                        いつものあなたの口調！
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <div className="inline-flex items-center gap-2 bg-indigo-600/20 text-indigo-300 px-6 py-3 rounded-full border border-indigo-500/30">
                            <Icons.CheckCircle size={20} />
                            <span className="font-bold">「これなら自分の言葉として発信できる」という安心感を提供します</span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
