"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

interface DemoSectionProps {
    demoInput: string;
    isDemoGenerating: boolean;
    demoResult: string;
    handleDemoGenerate: () => void;
}

export const DemoSection = ({ demoInput, isDemoGenerating, demoResult, handleDemoGenerate }: DemoSectionProps) => {
    return (
        <section id="demo" className="py-24 bg-[#0f172a] text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 to-slate-950" />
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />
            </div>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">AIの実力</span>を<br className="md:hidden" />今すぐ体験
                    </h2>
                    <p className="text-slate-300 text-lg">1行のメモから、<br className="md:hidden" />プロ並みの投稿文が数秒で完成します。</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl overflow-hidden max-w-5xl mx-auto flex flex-col md:flex-row min-h-[550px]">
                    <div className="p-8 md:w-1/2 border-b md:border-b-0 md:border-r border-white/10 flex flex-col bg-slate-900/50">
                        <div className="flex items-center justify-between mb-6">
                            <label className="flex items-center gap-2 text-sm font-bold text-white">投稿メモを入力</label>
                            <span className="text-[10px] font-bold text-indigo-300 bg-indigo-900/50 border border-indigo-700/50 px-2 py-1 rounded-full">Instagramモード</span>
                        </div>
                        <div className="relative mb-6 group">
                            <textarea
                                className="relative w-full h-40 p-4 bg-slate-800/80 border border-slate-700 text-slate-100 rounded-xl focus:outline-none focus:bg-slate-800 resize-none text-base transition-colors placeholder:text-slate-500 leading-relaxed cursor-not-allowed opacity-80"
                                readOnly
                                value={demoInput}
                            />
                        </div>
                        <button
                            onClick={handleDemoGenerate}
                            disabled={isDemoGenerating}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden group bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:scale-[1.02]`}
                        >
                            {isDemoGenerating ? (
                                <><Icons.Sparkles size={20} className="animate-spin" /> 生成中...</>
                            ) : (
                                <><Icons.Sparkles size={20} className="group-hover:animate-pulse" /> AIで文章を生成する</>
                            )}
                        </button>
                        <div className="mt-auto pt-6">
                            <div className="flex items-center gap-2 mb-4"><Icons.Zap size={16} className="text-yellow-400" fill="currentColor" /><h3 className="font-bold text-slate-200 text-sm">MisePoならすべて可能</h3></div>
                            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                {["Instagram / X 同時作成", "Googleマップ クチコミ返信", "あなた独自の『書き癖』学習", "多言語翻訳 (英/中/韓)"].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs text-slate-400"><Icons.CheckCircle size={12} className="text-indigo-400 shrink-0" /><span>{item}</span></div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="md:w-1/2 p-8 flex flex-col items-center justify-center relative overflow-hidden bg-slate-950/30">
                        <div className="w-full max-w-sm relative z-10">
                            <div className="bg-white border border-gray-200 rounded-2xl max-w-xs mx-auto shadow-2xl overflow-hidden text-sm flex flex-col h-[480px] transform transition-all hover:scale-[1.01] relative group">
                                {demoResult && (
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce-in">
                                        <div className="bg-white/90 backdrop-blur-md text-indigo-600 px-6 py-3 rounded-full font-black shadow-2xl border-2 border-indigo-100 flex items-center gap-2 whitespace-nowrap">
                                            <Icons.CheckCircle size={24} className="text-green-500" />
                                            <span>投稿完了！</span>
                                        </div>
                                    </div>
                                )}
                                {demoResult && (
                                    <>
                                        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
                                        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-pink-500 rounded-full animate-ping delay-100" />
                                        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-indigo-500 rounded-full animate-ping delay-200" />
                                    </>
                                )}

                                <div className="flex items-center justify-between p-3 border-b border-gray-50 shrink-0 bg-white z-10">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px] ${demoResult ? 'animate-pulse' : ''}`}>
                                            <div className="w-full h-full rounded-full bg-white border border-white overflow-hidden">
                                                <img src="https://picsum.photos/id/64/100/100" alt="avatar" className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        <span className="font-bold text-slate-900 text-xs">misepo_cafe</span>
                                    </div>
                                    <Icons.MoreHorizontal size={16} className="text-slate-400" />
                                </div>
                                <div className="overflow-y-auto no-scrollbar flex-1 bg-white">
                                    <div className="bg-gray-100 aspect-square w-full relative group shrink-0">
                                        <img src="https://picsum.photos/id/425/600/600" alt="post" className="w-full h-full object-cover" />
                                        {demoResult && (
                                            <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <div className="flex justify-between mb-2">
                                            <div className="flex gap-4 text-slate-800"><Icons.Heart size={22} className={`hover:text-red-500 transition-colors cursor-pointer ${demoResult ? 'text-red-500 fill-red-500 animate-pulse' : ''}`} /><Icons.MessageCircle size={22} /><Icons.Send size={22} /></div>
                                            <Icons.Bookmark size={22} className="text-slate-800" />
                                        </div>
                                        <p className="font-bold text-xs mb-2 text-slate-900">「いいね！」128件</p>
                                        <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap select-none" onContextMenu={(e) => e.preventDefault()}>
                                            <span className="font-bold mr-2">misepo_cafe</span>
                                            <span className={`${demoResult ? 'text-slate-800' : 'text-slate-400'}`}>
                                                {isDemoGenerating ? (
                                                    <span className="animate-pulse">AIが最適な投稿文を考えています...</span>
                                                ) : demoResult ? (
                                                    demoResult
                                                ) : (
                                                    "ここにAIが生成した投稿文が表示されます。ハッシュタグも含めて提案します。"
                                                )}
                                            </span>
                                        </div>
                                        {demoResult && (
                                            <p className="text-[10px] text-slate-400 mt-4 text-right italic border-t border-slate-100 pt-2">
                                                ※実際にMisePoのAIが出力した文章です
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 uppercase">2時間前</p>
                    </div>
                </div>
            </div>
            <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            <p className="text-center text-[9px] text-gray-400 mt-4 absolute bottom-4 left-0 right-0 z-10">※画面はイメージです</p>
        </section>
    );
};
