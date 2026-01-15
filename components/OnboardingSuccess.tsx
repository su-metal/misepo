
import React, { useEffect } from 'react';
import { SparklesIcon } from './Icons';

interface OnboardingSuccessProps {
  onDismiss: () => void;
}

const OnboardingSuccess: React.FC<OnboardingSuccessProps> = ({ onDismiss }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative text-center transform transition-all scale-100 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 delay-150 p-8">
        
        {/* Confetti / Decoration Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-amber-100 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          
          {/* Animated Icon */}
          <div className="w-24 h-24 mb-6 relative">
            <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-20 duration-1000"></div>
            <div className="relative w-full h-full bg-white rounded-full border-4 border-indigo-50 shadow-xl flex items-center justify-center text-4xl">
              🎉
            </div>
            <div className="absolute -top-2 -right-2 bg-amber-400 text-white rounded-full p-2 shadow-lg animate-bounce">
              <SparklesIcon />
            </div>
          </div>

          <h2 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">
            設定が完了しました
          </h2>
          
          <p className="text-sm text-slate-500 mb-8 leading-relaxed">
            お店の情報がAIに登録されました。<br/>
            さっそく投稿を作ってみましょう！
          </p>

          {/* Next Step Card */}
          <div className="w-full bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-5 mb-8 flex items-center gap-4 relative overflow-hidden group">
             <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-white/50 to-transparent"></div>
             
             <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
             </div>
             
             <div className="text-left">
                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5">Start Guide</div>
                <div className="text-sm font-bold text-slate-700">
                  最初の投稿を作ってみましょう
                </div>
                <div className="text-[10px] text-slate-500">すぐに作成できます</div>
             </div>
          </div>

          <button
            onClick={onDismiss}
            className="w-full py-5 md:py-4 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-xl shadow-slate-200 hover:shadow-indigo-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-xl md:text-lg flex items-center justify-center gap-2"
          >
            作成を始める
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>

        </div>
      </div>
    </div>
  );
};

export default OnboardingSuccess;
