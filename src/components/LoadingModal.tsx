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
        <div className="fixed inset-0 bg-[#001738]/10 backdrop-blur-xl z-[200] flex items-center justify-center p-6 animate-in fade-in duration-500">
            {/* Background Orbs - Navy themed */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden blur-[100px]">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-200/40 rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#E5005A]/10 rounded-full"></div>
            </div>

            <div className="bg-white/90 backdrop-blur-3xl rounded-[48px] shadow-2xl shadow-slate-200/50 border-2 border-slate-100 w-full max-w-xl overflow-hidden relative group animate-in zoom-in duration-700">

                <div className="relative z-10 p-12 text-center space-y-10">

                    {/* Progress Indicator - Navy themed */}
                    <div className="relative inline-flex items-center justify-center">
                        <div className="w-24 h-24 rounded-[2rem] bg-[#001738] flex items-center justify-center text-white shadow-xl shadow-slate-900/20 animate-spin-slow">
                            <AutoSparklesIcon className="w-10 h-10" />
                        </div>
                        <div className="absolute inset-0 bg-[#001738]/20 blur-[30px] rounded-full animate-pulse"></div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-3xl font-black text-[#001738] tracking-tighter">
                            AIが投稿文を作成中...
                        </h3>
                        <p className="text-slate-500 font-bold max-w-xs mx-auto leading-relaxed">
                            お店のこだわりをAIに伝えています。<br />少しだけお待ちください。
                        </p>
                    </div>

                    {/* Tips Module: Bento Style */}
                    <div className="bg-slate-50/80 border border-slate-100 rounded-[32px] p-8 text-left shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#E5005A]"></div>
                            <span className="text-[10px] font-black text-[#E5005A] uppercase tracking-[0.3em]">Smart Tip</span>
                        </div>
                        <div key={tipIndex} className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <p className="text-sm text-slate-700 font-bold leading-relaxed">
                                {LOADING_TIPS[tipIndex]}
                            </p>
                        </div>

                        {/* Tip Indicators */}
                        <div className="flex gap-1.5 mt-6">
                            {LOADING_TIPS.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1 rounded-full transition-all duration-500 ${i === tipIndex ? 'w-6 bg-[#001738]' : 'w-2 bg-slate-200'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* System Status Pill */}
                    <div className="inline-flex items-center gap-2 bg-slate-100/70 px-5 py-2.5 rounded-full border border-slate-200/50 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-black text-[#001738] uppercase tracking-widest leading-none">AI Assistant Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingModal;
