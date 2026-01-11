
import React, { useEffect } from 'react';
import { SparklesIcon } from './Icons';

interface GuestDemoModalProps {
  onClose: () => void;
}

const GuestDemoModal: React.FC<GuestDemoModalProps> = ({ onClose }) => {
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative text-center p-8 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 delay-100">
        
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200 rotate-3">
           <SparklesIcon className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-black text-slate-800 mb-3 tracking-tight">
          AI投稿作成デモへようこそ
        </h2>
        
        <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">
          お店の投稿文を、AIが数秒で作成します。<br/>
          まずはサンプルで体験してみてください。
        </p>

        <button
          onClick={onClose}
          className="w-full py-4.5 md:py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-lg md:text-base"
        >
          デモを試す
        </button>

      </div>
    </div>
  );
};

export default GuestDemoModal;
