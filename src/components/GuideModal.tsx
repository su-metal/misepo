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
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-6 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-500" onClick={onClose}>
      <div
        className="bg-white rounded-t-[32px] md:rounded-[32px] shadow-[0_32px_128px_-32px_rgba(0,0,0,0.5)] w-full max-w-3xl max-h-[95vh] md:max-h-[85vh] overflow-hidden flex flex-col relative border border-white/20 animate-in zoom-in-95 duration-500 scale-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

        {/* Header */}
        <div className="p-8 md:p-10 border-b border-stone-100 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-200">
              <MagicWandIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight leading-none">
                使い方ガイド
              </h2>
              <p className="text-[11px] font-black text-orange-500 uppercase tracking-[0.2em] mt-2">Professional 3-Step Flow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-rose-50 rounded-2xl text-stone-300 hover:text-rose-500 transition-all active:scale-90"
          >
            <CloseIcon className="w-7 h-7" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto overscroll-contain flex-1 p-8 md:p-12 space-y-12 relative">

          {/* Step Cards */}
          <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="group relative flex flex-col items-center p-8 rounded-[32px] bg-stone-50 border-2 border-transparent hover:border-orange-500/20 hover:bg-white hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500 animate-in slide-in-from-bottom-4">
                <span className="absolute top-4 left-6 text-[10px] font-black text-stone-300 tracking-[0.2em]">01</span>
                <div className="w-20 h-20 rounded-[24px] bg-white text-orange-600 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <TapIcon />
                </div>
                <h4 className="font-black text-stone-900 text-base mb-2">条件を選ぶ</h4>
                <p className="text-xs text-stone-500 font-bold text-center leading-relaxed">
                  SNSの種類や<br />投稿のスタイルを選択
                </p>
              </div>

              {/* Step 2 */}
              <div className="group relative flex flex-col items-center p-8 rounded-[32px] bg-stone-50 border-2 border-transparent hover:border-orange-500/20 hover:bg-white hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500 animate-in slide-in-from-bottom-4 delay-100">
                <span className="absolute top-4 left-6 text-[10px] font-black text-stone-300 tracking-[0.2em]">02</span>
                <div className="w-20 h-20 rounded-[24px] bg-white text-orange-600 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <PenIcon />
                </div>
                <h4 className="font-black text-stone-900 text-base mb-2">メモを入力</h4>
                <p className="text-xs text-stone-500 font-bold text-center leading-relaxed">
                  伝えたいことを<br />自由に箇条書き
                </p>
              </div>

              {/* Step 3 */}
              <div className="group relative flex flex-col items-center p-8 rounded-[32px] bg-[#0F172A] text-white shadow-2xl shadow-orange-900/20 transition-all duration-500 animate-in slide-in-from-bottom-4 delay-200">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none rounded-[32px]"></div>
                <span className="absolute top-4 left-6 text-[10px] font-black text-stone-600 tracking-[0.2em]">03</span>
                <div className="w-20 h-20 rounded-[24px] bg-orange-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-500">
                  <SparklesLargeIcon />
                </div>
                <h4 className="font-black text-white text-base mb-2">AIが生成</h4>
                <p className="text-xs text-stone-400 font-bold text-center leading-relaxed">
                  ワンタップで<br />プロ級の投稿が完成
                </p>
              </div>
            </div>
          </section>

          {/* Pro Tips Section */}
          <section className="bg-stone-50 rounded-[32px] p-8 md:p-10 border border-stone-100 animate-in fade-in duration-1000 delay-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
              </div>
              <h3 className="font-black text-stone-900 tracking-tight uppercase text-sm">Pro Tips for Success</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LOADING_TIPS.map((tip, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm flex gap-4 items-start group hover:border-orange-200 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 shrink-0 group-hover:scale-150 transition-transform"></div>
                  <p className="text-xs text-stone-600 font-bold leading-relaxed">
                    {tip.replace('💡 ', '')}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Final Action */}
          <div className="text-center pt-4">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-3 bg-[#0F172A] hover:bg-stone-800 text-white font-black py-6 px-16 rounded-[24px] transition-all transform hover:-transtone-y-1 active:transtone-y-0 shadow-2xl shadow-stone-200 group"
            >
              <span className="text-sm uppercase tracking-widest">さっそくはじめる</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:transtone-x-1 transition-transform"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GuideModal;
