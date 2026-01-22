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
        <section id="demo" className="py-24 bg-black text-white relative overflow-hidden border-b-[6px] border-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black opacity-50" />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight italic uppercase">
                        <span className="bg-[#E88BA3] px-4 py-2 border-[4px] border-white rounded-2xl shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] inline-block -rotate-2 text-black">AIの実力</span>を<br className="md:hidden" />今すぐ体験
                    </h2>
                    <p className="text-white/60 text-xl font-bold uppercase tracking-widest">1行のメモから、プロ並みの投稿文が数秒で完成します。</p>
                </div>
                <div className="bg-black border-[4px] border-white rounded-2xl shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] overflow-hidden max-w-5xl mx-auto flex flex-col md:flex-row min-h-[600px] relative">
                    <div className="p-8 md:w-1/2 border-b md:border-b-0 md:border-r-[4px] border-white flex flex-col bg-[#f9f5f2] text-black">
                        <div className="flex items-center justify-between mb-8">
                            <label className="text-xl font-black uppercase italic tracking-tight">投稿メモを入力</label>
                            <span className="text-[10px] font-black text-white bg-black border-[2px] border-white rounded-2xl px-3 py-1 uppercase tracking-widest italic">Instagram Mode</span>
                        </div>
                        <div className="relative mb-8 group">
                            <textarea
                                className="relative w-full h-48 p-6 bg-white border-[4px] border-black rounded-2xl text-black font-bold rounded-none focus:outline-none resize-none text-lg transition-all placeholder:text-black/30 leading-relaxed cursor-not-allowed shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                                readOnly
                                value={demoInput}
                            />
                        </div>
                        <button
                            onClick={handleDemoGenerate}
                            disabled={isDemoGenerating}
                            className={`w-full py-5 border-[4px] border-black rounded-2xl font-black text-xl uppercase italic flex items-center justify-center gap-3 transition-all relative overflow-hidden group ${isDemoGenerating
                                ? 'bg-white text-black cursor-wait shadow-none translate-x-[4px] translate-y-[4px]'
                                : 'bg-[#E88BA3] text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none'
                                }`}
                        >
                            {isDemoGenerating ? (
                                <><Icons.Sparkles size={24} className="animate-spin" /> 生成中...</>
                            ) : (
                                <><Icons.Sparkles size={24} className="group-hover:animate-pulse" /> AIで文章を生成する</>
                            )}
                        </button>
                        <div className="mt-auto pt-10 border-t-[3px] border-black/10">
                            <div className="flex items-center gap-3 mb-6">
                                <Icons.Zap size={20} className="text-[#F5CC6D]" fill="currentColor" />
                                <h3 className="font-black text-black text-sm uppercase tracking-wider">MisePo Features</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                                {["Instagram / X 同時作成", "Googleマップ クチコミ返信", "あなた独自の『書き癖』学習", "多言語翻訳 (英/中/韓)"].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs font-black uppercase tracking-tighter">
                                        <Icons.CheckCircle size={14} className="text-[#4DB39A] shrink-0" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="md:w-1/2 p-8 flex flex-col items-center justify-center relative overflow-hidden bg-black/40">
                        <div className="w-full max-w-sm relative z-10">
                            <div className="bg-white border-[4px] border-black rounded-none max-w-xs mx-auto shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] overflow-hidden text-sm flex flex-col h-[500px] relative group">
                                {demoResult && (
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce-in">
                                        <div className="bg-[#E88BA3] text-black px-8 py-4 border-[3px] border-black rounded-2xl font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 whitespace-nowrap -rotate-3">
                                            <Icons.CheckCircle size={28} className="text-black" />
                                            <span className="text-xl uppercase italic">Success!</span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between p-3 border-b-[2px] border-black shrink-0 bg-white z-10">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 border-[2px] border-black rounded-2xl ${demoResult ? 'animate-pulse' : ''}`}>
                                            <div className="w-full h-full bg-slate-200 overflow-hidden">
                                                <img src="https://picsum.photos/id/64/100/100" alt="avatar" className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        <span className="font-black text-black text-xs uppercase tracking-tighter">misepo_cafe</span>
                                    </div>
                                    <Icons.MoreHorizontal size={16} className="text-black" />
                                </div>
                                <div className="overflow-y-auto no-scrollbar flex-1 bg-white">
                                    <div className="bg-gray-100 aspect-square w-full relative group shrink-0 border-b-[2px] border-black">
                                        <img src="https://picsum.photos/id/425/600/600" alt="post" className="w-full h-full object-cover" />
                                        {demoResult && (
                                            <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
                                        )}
                                    </div>
                                    <div className="p-4 bg-white text-black">
                                        <div className="flex justify-between mb-3">
                                            <div className="flex gap-4 text-black"><Icons.Heart size={24} className={`transition-colors cursor-pointer ${demoResult ? 'text-[#E88BA3] fill-[#E88BA3] animate-pulse' : 'stroke-[2px]'}`} /><Icons.MessageCircle size={24} className="stroke-[2px]" /><Icons.Send size={24} className="stroke-[2px]" /></div>
                                            <Icons.Bookmark size={24} className="text-black stroke-[2px]" />
                                        </div>
                                        <p className="font-black text-[10px] uppercase tracking-widest mb-2">128 likes</p>
                                        <div className="text-xs text-black leading-relaxed whitespace-pre-wrap select-none font-bold" onContextMenu={(e) => e.preventDefault()}>
                                            <span className="font-black mr-2 uppercase">misepo_cafe</span>
                                            <span className={`${demoResult ? 'opacity-100' : 'opacity-30 italic'}`}>
                                                {isDemoGenerating ? (
                                                    <span className="animate-pulse">AI is generating your post...</span>
                                                ) : demoResult ? (
                                                    demoResult
                                                ) : (
                                                    "Your AI-generated content will appear here..."
                                                )}
                                            </span>
                                        </div>
                                        {demoResult && (
                                            <p className="text-[10px] text-black/40 mt-6 text-right font-black uppercase tracking-tighter border-t border-black/10 pt-3 italic">
                                                * Real MisePo Output
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-[10px] text-white/30 mt-6 font-black uppercase tracking-[0.4em]">2 hours ago</p>
                    </div>
                </div>
            </div>
            <p className="text-center text-[10px] text-white/20 mt-12 font-black uppercase tracking-widest">※ UI mockup for demonstration purposes</p>
        </section>
    );
};
