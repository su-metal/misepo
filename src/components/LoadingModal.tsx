import React, { useState, useEffect } from 'react';
import { LOADING_TIPS } from '../constants';
import { AutoSparklesIcon } from './Icons';

interface LoadingModalProps {
    isOpen: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen }) => {
    const [tipIndex, setTipIndex] = useState(0);

    useEffect(() => {
        if (!isOpen) return;
        const interval = setInterval(() => {
            setTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="bg-white rounded-[32px] shadow-[8px_8px_0_0_rgba(0,0,0,1)] border-[3px] border-black w-full max-w-xl overflow-hidden relative group animate-in zoom-in duration-500">

                <div className="relative z-10 p-12 text-center space-y-10">

                    {/* Progress Indicator - Neo Brutalism */}
                    <div className="relative inline-flex items-center justify-center">
                        <div className="w-24 h-24 rounded-2xl bg-[#001738] border-[3px] border-black flex items-center justify-center text-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] animate-spin-slow">
                            <AutoSparklesIcon className="w-10 h-10" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-3xl font-black text-black tracking-tighter">
                            AIが投稿文を作成中...
                        </h3>
                        <p className="text-slate-600 font-bold max-w-xs mx-auto leading-relaxed text-sm">
                            お店のこだわりをAIに伝えています。<br />少しだけお待ちください。
                        </p>
                    </div>

                    {/* Tips Module: Neo Style */}
                    <div className="bg-[var(--bg-beige)] border-2 border-black rounded-[24px] p-8 text-left shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-3 h-3 border-2 border-black bg-[var(--rose)] rounded-full"></span>
                            <span className="text-[10px] font-black text-black uppercase tracking-[0.3em]">Smart Tip</span>
                        </div>
                        <div key={tipIndex} className="animate-in fade-in slide-in-from-right-4 duration-500 min-h-[60px] flex items-center">
                            <p className="text-sm text-black font-bold leading-relaxed">
                                {LOADING_TIPS[tipIndex]}
                            </p>
                        </div>

                        {/* Tip Indicators */}
                        <div className="flex gap-1.5 mt-6">
                            {LOADING_TIPS.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-500 border border-black ${i === tipIndex ? 'w-8 bg-black' : 'w-2 bg-white'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* System Status Pill */}
                    <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 border border-black animate-pulse"></span>
                        <span className="text-[10px] font-black text-black uppercase tracking-widest leading-none">AI Assistant Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingModal;
