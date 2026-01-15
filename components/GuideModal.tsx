
import React, { useEffect } from 'react';
import { CloseIcon } from './Icons';
import { LOADING_TIPS } from '../constants';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Local Icons for the guide steps to match the requested visual style
const TapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>
);

const PenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
);

const SparklesLargeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 3v4"/><path d="M3 7h4"/><path d="M3 5h4"/></svg>
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className="bg-[#F8FAFC] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              使い方ガイド
            </h2>
            <p className="text-xs text-slate-400 font-bold mt-1">3ステップでかんたん作成</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-10 bg-[#F8FAFC]">
          
          {/* Step Guide - Cards Design mimicking the reference */}
          <section>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Step 1 */}
                <div className="relative flex flex-col items-center justify-center p-6 rounded-3xl bg-white border border-indigo-100 shadow-lg shadow-indigo-100/50">
                   <div className="absolute top-3 left-3 bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-1 rounded-lg tracking-wider">STEP 1</div>
                   <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                      <TapIcon />
                   </div>
                   <h4 className="font-bold text-slate-700 text-sm mb-2">条件を選ぶ</h4>
                   <p className="text-[11px] text-slate-400 font-medium text-center leading-relaxed">
                      SNSの種類や<br/>投稿の目的を選択
                   </p>
                </div>

                {/* Step 2 */}
                <div className="relative flex flex-col items-center justify-center p-6 rounded-3xl bg-white border border-indigo-100 shadow-lg shadow-indigo-100/50">
                   <div className="absolute top-3 left-3 bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-1 rounded-lg tracking-wider">STEP 2</div>
                   <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                      <PenIcon />
                   </div>
                   <h4 className="font-bold text-slate-700 text-sm mb-2">メモを入力</h4>
                   <p className="text-[11px] text-slate-400 font-medium text-center leading-relaxed">
                      伝えたいことを<br/>箇条書きでメモ
                   </p>
                </div>

                {/* Step 3 */}
                <div className="relative flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-xl shadow-indigo-200">
                   <div className="absolute top-3 left-3 bg-white/20 text-white text-[10px] font-black px-2 py-1 rounded-lg tracking-wider">STEP 3</div>
                   <div className="w-16 h-16 rounded-full bg-white/20 text-white flex items-center justify-center mb-4 backdrop-blur-sm">
                      <SparklesLargeIcon />
                   </div>
                   <h4 className="font-bold text-white text-sm mb-2">生成ボタン</h4>
                   <p className="text-[11px] text-indigo-100 font-medium text-center leading-relaxed">
                      あとはAIにお任せ<br/>数秒で完成！
                   </p>
                </div>
             </div>
          </section>

          {/* Tips List */}
          <section>
             <div className="flex items-center gap-2 mb-4 px-1">
                <span className="text-xl">💡</span>
                <h3 className="font-bold text-slate-700">うまく使うコツ</h3>
             </div>
             <div className="grid grid-cols-1 gap-3">
                {LOADING_TIPS.map((tip, idx) => (
                   <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0"></div>
                      <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed">
                        {tip.replace('💡 ', '')}
                      </p>
                   </div>
                ))}
             </div>
          </section>

          <div className="text-center pt-2 pb-4">
             <button 
                onClick={onClose}
                className="bg-slate-900 text-white font-bold py-5 md:py-4 px-12 rounded-2xl hover:bg-slate-800 transition-all transform hover:-translate-y-0.5 shadow-xl text-xl md:text-base"
             >
                さっそく始める
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GuideModal;
