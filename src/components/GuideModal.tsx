import React, { useEffect } from 'react';
import { CloseIcon, MagicWandIcon } from './Icons';
import { LOADING_TIPS } from '../constants';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Local Icons for the guide steps to match the requested visual style
const TapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" /><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" /><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" /></svg>
);

const PenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
);

const SparklesLargeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M9 3v4" /><path d="M3 7h4" /><path d="M3 5h4" /></svg>
);

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-6 bg-[#001738]/80 backdrop-blur-md animate-in fade-in duration-500" onClick={onClose}>
      <div
        className="bg-white rounded-t-[40px] md:rounded-[48px] shadow-[0_32px_128px_-32px_rgba(0,17,45,0.6)] w-full max-w-4xl max-h-[95vh] md:max-h-[85vh] overflow-hidden flex flex-col relative border border-white/20 animate-in zoom-in-95 duration-500 scale-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,23,56,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,23,56,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

        {/* Header - CastMe Style */}
        <div className="p-8 md:p-12 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10 transition-all">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#001738] flex items-center justify-center text-[#E5005A] shadow-2xl shadow-navy-900/20">
              <MagicWandIcon className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-[#001738] tracking-tighter leading-none">
                HOW TO USE
              </h2>
              <p className="text-[12px] font-black text-[#E5005A] uppercase tracking-[0.3em] mt-3">Professional 3-Step Flow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-4 hover:bg-[#E5005A]/5 rounded-[24px] text-slate-300 hover:text-[#E5005A] transition-all active:scale-90 border border-transparent hover:border-[#E5005A]/10"
          >
            <CloseIcon className="w-8 h-8" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto overscroll-contain flex-1 p-8 md:p-16 space-y-16 relative custom-scrollbar">

          {/* Step Cards - CastMe Style */}
          <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="group relative flex flex-col items-center p-10 rounded-[40px] bg-slate-50 border-2 border-transparent hover:border-[#E5005A]/20 hover:bg-white hover:shadow-2xl hover:shadow-navy-900/5 transition-all duration-500 animate-in slide-in-from-bottom-4 isolate">
                <span className="absolute top-6 left-8 text-[11px] font-black text-slate-200 tracking-[0.3em] group-hover:text-[#E5005A]/30 transition-colors">01</span>
                <div className="w-24 h-24 rounded-[32px] bg-white text-[#001738] flex items-center justify-center mb-8 shadow-inner border border-slate-100 group-hover:scale-110 group-hover:border-[#E5005A]/30 transition-all duration-500">
                  <TapIcon />
                </div>
                <h4 className="font-black text-[#001738] text-lg mb-3 tracking-tight">条件を選ぶ</h4>
                <p className="text-[13px] text-slate-500 font-bold text-center leading-relaxed">
                  SNSの種類や<br />投稿のスタイルを選択
                </p>
              </div>

              {/* Step 2 */}
              <div className="group relative flex flex-col items-center p-10 rounded-[40px] bg-slate-50 border-2 border-transparent hover:border-[#E5005A]/20 hover:bg-white hover:shadow-2xl hover:shadow-navy-900/5 transition-all duration-500 animate-in slide-in-from-bottom-4 delay-100 isolate">
                <span className="absolute top-6 left-8 text-[11px] font-black text-slate-200 tracking-[0.3em] group-hover:text-[#E5005A]/30 transition-colors">02</span>
                <div className="w-24 h-24 rounded-[32px] bg-white text-[#001738] flex items-center justify-center mb-8 shadow-inner border border-slate-100 group-hover:scale-110 group-hover:border-[#E5005A]/30 transition-all duration-500">
                  <PenIcon />
                </div>
                <h4 className="font-black text-[#001738] text-lg mb-3 tracking-tight">メモを入力</h4>
                <p className="text-[13px] text-slate-500 font-bold text-center leading-relaxed">
                  伝えたいことを<br />自由に箇条書き
                </p>
              </div>

              {/* Step 3 */}
              <div className="group relative flex flex-col items-center p-10 rounded-[40px] bg-[#001738] text-white shadow-2xl shadow-navy-900/20 transition-all duration-500 animate-in slide-in-from-bottom-4 delay-200 isolate">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none rounded-[40px]"></div>
                <span className="absolute top-6 left-8 text-[11px] font-black text-navy-800 tracking-[0.3em]">03</span>
                <div className="w-24 h-24 rounded-[32px] bg-[#E5005A] text-white flex items-center justify-center mb-8 shadow-2xl shadow-[#E5005A]/30 group-hover:scale-110 transition-all duration-500">
                  <SparklesLargeIcon />
                </div>
                <h4 className="font-black text-white text-lg mb-3 tracking-tight">AIが生成</h4>
                <p className="text-[13px] text-white/60 font-bold text-center leading-relaxed">
                  ワンタップで<br />プロ級の投稿が完成
                </p>
              </div>
            </div>
          </section>

          {/* Pro Tips Section - CastMe Style */}
          <section className="bg-slate-50 rounded-[40px] p-10 md:p-14 border border-slate-100 animate-in fade-in duration-1000 delay-300 isolate relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[#E5005A]/5 rounded-full blur-3xl"></div>
            <div className="flex items-center gap-4 mb-10 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-[#E5005A] flex items-center justify-center text-white shadow-lg shadow-[#E5005A]/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
              </div>
              <h3 className="font-black text-[#001738] tracking-[0.1em] uppercase text-sm">Pro Tips for Success</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
              {LOADING_TIPS.map((tip, idx) => (
                <div key={idx} className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-100 shadow-sm flex gap-5 items-start group hover:border-[#E5005A]/30 transition-all duration-300 hover:shadow-xl hover:shadow-navy-900/5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E5005A] mt-2 shrink-0 group-hover:scale-150 transition-transform shadow-md shadow-[#E5005A]/40"></div>
                  <p className="text-[13px] text-slate-600 font-bold leading-relaxed">
                    {tip.replace('💡 ', '')}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Final Action - CastMe Style */}
          <div className="text-center pt-4 isolate">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-5 bg-[#E5005A] hover:bg-[#C2004D] text-white font-black py-7 px-20 rounded-[32px] transition-all transform hover:-translate-y-2 active:translate-y-0 shadow-2xl shadow-[#E5005A]/40 group"
            >
              <span className="text-base uppercase tracking-[0.3em]">さっそくはじめる</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-3 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GuideModal;
