"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

interface DemoScenario {
    id: string;
    label: string;
    modeBadge: string;
    input: string;
    result: string;
}

interface DemoSectionProps {
    demoScenarios: DemoScenario[];
    activeScenarioIdx: number;
    setActiveScenarioIdx: (idx: number) => void;
    isDemoGenerating: boolean;
    demoResult: string;
    handleDemoGenerate: () => void;
}

export const DemoSection = ({
    demoScenarios,
    activeScenarioIdx,
    setActiveScenarioIdx,
    isDemoGenerating,
    demoResult,
    handleDemoGenerate
}: DemoSectionProps) => {
    const activeScenario = demoScenarios[activeScenarioIdx];

    return (
        <section id="demo" className="py-24 bg-black text-white relative overflow-hidden border-b-[6px] border-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black opacity-50" />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight italic uppercase text-white">
                        <span className="bg-[#E88BA3] px-4 py-2 border-[4px] border-white rounded-2xl shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] inline-block -rotate-2 text-black">AIの実力</span>を<br className="md:hidden" />今すぐ体験
                    </h2>
                    <p className="text-white/60 text-xl font-bold uppercase tracking-widest">利用シーンに合わせて、MisePoの生成クオリティをチェックしてください。</p>
                </div>

                {/* Scenario Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {demoScenarios.map((scenario, idx) => (
                        <button
                            key={scenario.id}
                            onClick={() => setActiveScenarioIdx(idx)}
                            className={`px-6 py-3 border-[3px] rounded-2xl font-black text-sm uppercase transition-all ${activeScenarioIdx === idx
                                    ? 'bg-[#F5CC6D] text-black border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,0.5)] -translate-y-1'
                                    : 'bg-black text-white border-white/20 hover:border-white/50'
                                }`}
                        >
                            {scenario.label}
                        </button>
                    ))}
                </div>

                <div className="bg-black border-[4px] border-white rounded-2xl shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] overflow-hidden max-w-5xl mx-auto flex flex-col md:flex-row min-h-[600px] relative">
                    <div className="p-8 md:w-1/2 border-b md:border-b-0 md:border-r-[4px] border-white flex flex-col bg-[#f9f5f2] text-black">
                        <div className="flex items-center justify-between mb-8">
                            <label className="text-xl font-black uppercase italic tracking-tight">投稿メモを入力</label>
                            <span className="text-[10px] font-black text-white bg-black border-[2px] border-white rounded-2xl px-3 py-1 uppercase tracking-widest italic">{activeScenario.modeBadge}</span>
                        </div>
                        <div className="relative mb-8 group">
                            <div className="absolute inset-0 bg-black/5 blur-xl -z-10 rounded-2xl" />
                            <textarea
                                className="relative w-full h-48 p-6 bg-white border-[4px] border-black rounded-2xl text-black font-bold focus:outline-none resize-none text-lg leading-relaxed shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                                readOnly
                                value={activeScenario.input}
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
                                {["Instagram / X 同時作成", "Googleマップ クチコミ返信", "AIお手本学習 (分身機能)", "多言語翻訳 (英/中/韓)"].map((item, i) => (
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
                                    <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                                        <div className="bg-[#4DB39A] text-white px-8 py-4 border-[3px] border-black rounded-2xl font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 whitespace-nowrap -rotate-3 animate-bounce-in">
                                            <Icons.CheckCircle size={28} />
                                            <span className="text-xl uppercase italic">Success!</span>
                                        </div>
                                    </div>
                                )}

                                {activeScenario.id === "google_maps" ? (
                                    /* Google Maps Mockup */
                                    <div className="flex flex-col h-full bg-slate-50">
                                        <div className="p-4 border-b-[2px] border-black bg-white">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xs">Y</div>
                                                <span className="font-black text-xs">Yuki Sato</span>
                                            </div>
                                            <div className="flex gap-1 text-[#F5CC6D] mb-1"><Icons.Star size={12} fill="currentColor" /><Icons.Star size={12} fill="currentColor" /><Icons.Star size={12} fill="currentColor" /><Icons.Star size={12} fill="currentColor" /><Icons.Star size={12} fill="currentColor" /></div>
                                            <p className="text-[10px] text-black leading-snug font-bold">「初めて来ましたが、ドーナツがふわふわで最高でした！コーヒーも深みがあって好みです。また来ます！」</p>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
                                            <div className="bg-white border-[2px] border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] relative">
                                                <div className="text-[10px] font-black text-black/40 uppercase mb-2">オーナーからの返信</div>
                                                <div className={`text-xs text-black leading-relaxed whitespace-pre-wrap font-bold ${demoResult ? 'opacity-100' : 'opacity-30 italic'}`}>
                                                    {isDemoGenerating ? "AIによる返信を生成中..." : demoResult || "ここにAIの返信が表示されます..."}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Instagram Mockup */
                                    <>
                                        <div className="flex items-center justify-between p-3 border-b-[2px] border-black shrink-0 bg-white z-10">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 border-[2px] border-black rounded-2xl overflow-hidden">
                                                    <img src="https://picsum.photos/id/64/100/100" alt="avatar" className="w-full h-full object-cover" />
                                                </div>
                                                <span className="font-black text-black text-xs uppercase tracking-tighter">misepo_cafe</span>
                                            </div>
                                            <Icons.MoreHorizontal size={16} className="text-black" />
                                        </div>
                                        <div className="overflow-y-auto no-scrollbar flex-1 bg-white">
                                            <div className="bg-gray-100 aspect-square w-full relative group shrink-0 border-b-[2px] border-black">
                                                <img src={activeScenario.id === "casual" ? "https://picsum.photos/id/225/600/600" : "https://picsum.photos/id/425/600/600"} alt="post" className="w-full h-full object-cover" />
                                                {demoResult && (
                                                    <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
                                                )}
                                            </div>
                                            <div className="p-4 bg-white text-black">
                                                <div className="flex justify-between mb-3">
                                                    <div className="flex gap-4 text-black"><Icons.Heart size={24} className={`transition-colors cursor-pointer ${demoResult ? 'text-[#E88BA3] fill-[#E88BA3]' : 'stroke-[2px]'}`} /><Icons.MessageCircle size={24} className="stroke-[2px]" /><Icons.Send size={24} className="stroke-[2px]" /></div>
                                                    <Icons.Bookmark size={24} className="text-black stroke-[2px]" />
                                                </div>
                                                <p className="font-black text-[10px] uppercase tracking-widest mb-2">128 likes</p>
                                                <div className="text-xs text-black leading-relaxed whitespace-pre-wrap select-none font-bold">
                                                    <span className="font-black mr-2 uppercase">misepo_cafe</span>
                                                    <span className={`${demoResult ? 'opacity-100' : 'opacity-30 italic'}`}>
                                                        {isDemoGenerating ? "AI is generating your post..." : demoResult || "Your AI-generated content will appear here..."}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <p className="text-[10px] text-white/30 mt-6 font-black uppercase tracking-[0.4em]">Powered by MisePo AI Engine</p>
                    </div>
                </div>
            </div>
            <p className="text-center text-[10px] text-white/20 mt-12 font-black uppercase tracking-widest">※ 利用シーンに合わせた実際の生成結果のデモンストレーションです</p>
        </section>
    );
};
