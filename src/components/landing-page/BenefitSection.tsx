"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';
import { CountUp } from './CountUp';

export const BenefitSection = () => {
    return (
        <>
            {/* Why MisePo Now */}
            <section className="py-20 md:py-32 bg-[#f9f5f2] relative overflow-hidden border-b-[6px] border-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <span className="bg-[#E88BA3] text-white font-black tracking-tight text-sm uppercase mb-6 px-4 py-2 border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl inline-block">Why MisePo?</span>
                        <h2 className="text-4xl md:text-7xl font-black text-black mb-8 tracking-tight leading-tight">
                            なぜ今、<br className="md:hidden" /><span className="underline decoration-[6px] decoration-[#E88BA3]">MisePo（分身）</span>が<br className="md:hidden" />必要なのか？
                        </h2>
                        <p className="text-black text-xl max-w-2xl mx-auto leading-relaxed font-bold opacity-80">
                            SNSはただの宣伝ツールではありません。<br />
                            採用、信頼、集客...お店の未来を左右するインフラです。
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                        {/* Card 1 */}
                        <div className="bg-white border-[4px] border-black rounded-2xl p-8 relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 bg-[#F5CC6D] border-[3px] border-black rounded-2xl flex items-center justify-center shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-6 transition-transform">
                                    <Icons.Users size={28} className="text-black" />
                                </div>
                                <div>
                                    <div className="text-xs font-black text-black/40 uppercase tracking-widest">Recruiting</div>
                                    <h3 className="text-2xl font-black text-black uppercase">採用への影響</h3>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-7xl font-black text-black tabular-nums"><CountUp end={85} /></span>
                                <span className="text-3xl font-black text-black">%</span>
                            </div>
                            <p className="text-black font-bold text-lg leading-relaxed">
                                若者の85%は、バイト応募前に店主の<span className="bg-[#F5CC6D] px-1 border-b-[2px] border-black">SNSで職場の雰囲気</span>をチェックしています。
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white border-[4px] border-black rounded-2xl p-8 relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 bg-[#4DB39A] border-[3px] border-black rounded-2xl flex items-center justify-center shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-rotate-6 transition-transform">
                                    <Icons.ShieldCheck size={28} className="text-white" />
                                </div>
                                <div>
                                    <div className="text-xs font-black text-black/40 uppercase tracking-widest">Trust</div>
                                    <h3 className="text-2xl font-black text-black uppercase">信頼度の向上</h3>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-7xl font-black text-black tabular-nums">1.7</span>
                                <span className="text-3xl font-black text-black">倍</span>
                            </div>
                            <p className="text-black font-bold text-lg leading-relaxed">
                                クチコミに丁寧に返信している店は、そうでない店より<span className="bg-[#4DB39A] text-white px-1 border-b-[2px] border-black">顧客の信頼度</span>が圧倒的に高まります。
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white border-[4px] border-black rounded-2xl p-8 relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 bg-[#9B8FD4] border-[3px] border-black rounded-2xl flex items-center justify-center shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform">
                                    <Icons.TrendingDown size={28} className="text-white" />
                                </div>
                                <div>
                                    <div className="text-xs font-black text-black/40 uppercase tracking-widest">Loss</div>
                                    <h3 className="text-2xl font-black text-black uppercase">機会損失</h3>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2 mb-6 text-[#E88BA3]">
                                <span className="text-5xl font-black tabular-nums">2人に1人</span>
                            </div>
                            <p className="text-black font-bold text-lg leading-relaxed">
                                <span className="bg-[#9B8FD4] text-white px-1 border-b-[2px] border-black">最新情報が不明な店</span>への来店を断念した経験があります。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solution */}
            <section id="solution" className="py-20 md:py-32 bg-black text-white overflow-hidden relative border-b-[6px] border-white">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#E88BA3] rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#4DB39A] rounded-full blur-[120px]" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-24">
                        <span className="bg-[#4DB39A] text-white font-black tracking-tight text-sm uppercase mb-6 px-4 py-2 border-[3px] border-white rounded-2xl shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] inline-block">Solution</span>
                        <h2 className="text-4xl md:text-7xl font-black mb-10 tracking-tight leading-tight">
                            AIが、<br className="md:hidden" /><span className="bg-[#E88BA3] px-4 py-1 inline-block -rotate-1 border-[3px] border-white rounded-2xl shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">あなたの『分身』</span><br className="md:hidden" />になる。
                        </h2>
                        <p className="text-white/70 text-xl max-w-2xl mx-auto leading-relaxed font-bold">
                            MisePoは単なる自動生成ツールではありません。<br />
                            あなたの過去の投稿を学習し、まるで<br className="md:hidden" />あなたが書いたかのような文章を生み出します。
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto mb-32">
                        {/* Step 1 */}
                        <div className="bg-black border-[3px] border-white rounded-2xl p-8 relative shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] group hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.3)] transition-all">
                            <div className="flex flex-col items-start gap-6">
                                <div className="w-14 h-14 bg-[#4DB39A] border-[3px] border-white rounded-2xl flex items-center justify-center text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] group-hover:scale-110 transition-transform">
                                    <Icons.Bot size={28} />
                                </div>
                                <div className="space-y-3">
                                    <div className="inline-block px-4 py-1 bg-[#4DB39A] text-white text-xs font-black uppercase border-[2px] border-white rounded-2xl">Step 1</div>
                                    <h3 className="text-2xl font-black text-white">あなたの『書き癖』を学習</h3>
                                </div>
                            </div>
                            <p className="text-white/70 leading-relaxed mt-6 font-bold">
                                過去の投稿の<span className="text-[#4DB39A] underline decoration-2">スクショをアップロードするだけ</span>。<br />
                                画像からあなたの「口癖」や「絵文字の使い所」まで瞬時に学習します。
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-black border-[3px] border-white rounded-2xl p-8 relative shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] group hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.3)] transition-all">
                            <div className="flex flex-col items-start gap-6">
                                <div className="w-14 h-14 bg-[#E88BA3] border-[3px] border-white rounded-2xl flex items-center justify-center text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] group-hover:-rotate-6 transition-transform">
                                    <Icons.Users size={28} />
                                </div>
                                <div className="space-y-3">
                                    <div className="inline-block px-4 py-1 bg-[#E88BA3] text-white text-xs font-black uppercase border-[2px] border-white rounded-2xl">Step 2</div>
                                    <h3 className="text-2xl font-black text-white">「中の人」を自由自在に</h3>
                                </div>
                            </div>
                            <p className="text-white/70 leading-relaxed mt-6 font-bold">
                                「熱い店長」「親しみやすい看板娘」など、投稿の目的に合わせて<span className="text-[#E88BA3] underline decoration-2">人格を切り替え</span>。
                                複数のスタッフで運営しているような多様性を。
                            </p>
                        </div>

                        {/* Result */}
                        <div className="bg-black border-[3px] border-white rounded-2xl p-8 relative shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] group hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.3)] transition-all">
                            <div className="flex flex-col items-start gap-6">
                                <div className="w-14 h-14 bg-[#F5CC6D] border-[3px] border-white rounded-2xl flex items-center justify-center text-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] group-hover:rotate-6 transition-transform">
                                    <Icons.Heart size={28} />
                                </div>
                                <div className="space-y-3">
                                    <div className="inline-block px-4 py-1 bg-[#F5CC6D] text-black text-xs font-black uppercase border-[2px] border-white rounded-2xl">Result</div>
                                    <h3 className="text-2xl font-black text-white">投稿作業を5秒で完結</h3>
                                </div>
                            </div>
                            <p className="text-white/70 leading-relaxed mt-6 font-bold">
                                生成された文章はタップ一つで<span className="text-[#F5CC6D] underline decoration-2">自動コピー</span>。
                                各SNSの投稿画面へ直接ジャンプできるので、投稿作業が驚くほどスムーズになります。
                            </p>
                        </div>
                    </div>

                    {/* Comparison Box */}
                    <div className="max-w-5xl mx-auto bg-white border-[4px] border-white rounded-2xl p-6 md:p-12 relative shadow-[10px_10px_0px_0px_rgba(255,255,255,0.1)]">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl md:text-5xl font-black mb-6 italic uppercase tracking-tighter text-black">MisePoなら、<br className="md:hidden" />ここまで変わる。</h3>
                            <p className="text-black/60 font-bold">「標準的なAI」と「あなたの分身（MisePo）」の違いをご覧ください。</p>
                        </div>

                        <div className="flex flex-col gap-8">
                            <div className="bg-gray-50 border-[3px] border-gray-300 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left mx-auto max-w-2xl w-full shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]">
                                <div className="p-4 bg-white text-black border-[2px] border-black rounded-2xl shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                                    <Icons.Bot size={28} />
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Input Memo</div>
                                    <p className="text-xl text-black font-black italic">「明日からいちごパフェ。1580円。地元産。」</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-10 relative">
                                <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 bg-white border-[4px] border-black rounded-full items-center justify-center text-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                </div>
                                <div className="md:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-white border-[3px] border-black rounded-full flex items-center justify-center text-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M12 5v14" /><path d="m5 12 7 7 7-7" /></svg>
                                </div>

                                {/* Standard AI */}
                                <div className="bg-gray-100 border-[3px] border-gray-300 rounded-2xl p-8 relative opacity-80">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-gray-200 border-[2px] border-gray-400 rounded-2xl flex items-center justify-center text-gray-600">
                                            <Icons.Bot size={24} />
                                        </div>
                                        <div className="font-black text-gray-500 uppercase tracking-widest text-sm">標準的なAI</div>
                                    </div>
                                    <div className="bg-white border-[2px] border-gray-300 rounded-2xl p-6 relative">
                                        <div className="absolute top-0 left-6 -translate-y-1/2 w-4 h-4 bg-gray-100 rotate-45 border-l-[2px] border-t-[2px] border-gray-300" />
                                        <p className="text-gray-600 leading-relaxed font-bold">
                                            新作のいちごパフェが明日から発売です。<br />
                                            価格は1,580円です。<br />
                                            地元産のいちごを使用しています。<br />
                                            ぜひご賞味ください。
                                        </p>
                                    </div>
                                    <p className="text-center text-xs text-gray-500 mt-6 font-black uppercase tracking-tighter">事務的で、どこか冷たい...</p>
                                </div>

                                {/* MisePo */}
                                <div className="bg-[#E88BA3] border-[4px] border-white rounded-2xl p-8 relative shadow-[10px_10px_0px_0px_rgba(255,255,255,0.2)]">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-white border-[2px] border-black rounded-2xl flex items-center justify-center text-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]">
                                            <Icons.Sparkles size={24} />
                                        </div>
                                        <div className="font-black text-white uppercase tracking-wider text-sm">MisePo (分身)</div>
                                    </div>
                                    <div className="bg-white text-black border-[3px] border-black rounded-2xl p-6 relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                                        <div className="absolute top-0 left-6 -translate-y-1/2 w-4 h-4 bg-white rotate-45 border-l-[3px] border-t-[3px] border-black" />
                                        <p className="leading-relaxed font-black text-lg italic">
                                            お待たせしました🍓<br />
                                            明日から<span className="bg-[#F5CC6D] px-1 border-b-[3px] border-black">地元の完熟いちご</span>をたっぷり使ったパフェが始まります！<br />
                                            自分へのご褒美にぜひ♪ 11時にお待ちしてます🌿
                                        </p>
                                    </div>
                                    <p className="text-center text-xs text-white mt-6 font-black flex items-center justify-center gap-2 uppercase">
                                        <Icons.CheckCircle size={16} />
                                        いつものあなたの口調！
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-24 text-center">
                        <div className="inline-flex items-center gap-4 bg-[#4DB39A] text-white px-8 py-4 border-[4px] border-white rounded-2xl shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] rotate-1 group hover:rotate-0 transition-transform cursor-default">
                            <Icons.CheckCircle size={24} />
                            <span className="font-black text-xl uppercase tracking-tight">「これなら自分の言葉として発信できる」という安心感を。</span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
