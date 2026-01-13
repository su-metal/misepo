
import React, { useState, useEffect } from 'react';
import { CloseIcon } from './Icons';

type PlanOption = "monthly" | "yearly";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmUpgrade: (plan: PlanOption) => void;
  initialStep?: 'intro' | 'payment';
}

const CheckCircleIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onConfirmUpgrade, initialStep = 'intro' }) => {
  const [step, setStep] = useState<'intro' | 'payment'>(initialStep);
  const [selectedPlan, setSelectedPlan] = useState<PlanOption>("monthly");

  useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
      document.body.style.overflow = 'hidden';
      setSelectedPlan("monthly");
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialStep]);

  const handlePlanSelect = (plan: PlanOption) => {
    setSelectedPlan(plan);
  };

  const handleConfirm = () => {
    onConfirmUpgrade(selectedPlan);
  };

  const yearlyCardClasses = `border-2 p-4 rounded-xl relative group cursor-pointer transition-all ${
    selectedPlan === "yearly"
      ? "border-indigo-500 bg-white shadow-lg shadow-indigo-100"
      : "border-transparent hover:border-indigo-100 bg-slate-50"
  }`;

  const monthlyCardClasses = `border-2 p-4 rounded-xl relative cursor-pointer transition-all ${
    selectedPlan === "monthly"
      ? "border-indigo-500 bg-white shadow-lg shadow-indigo-100 ring-4 ring-indigo-500/10"
      : "border-transparent bg-white hover:border-indigo-100"
  }`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className={`bg-white rounded-3xl shadow-2xl w-full overflow-hidden relative max-h-[90vh] overflow-y-auto transition-all duration-300 ${
          step === 'payment' ? 'max-w-lg md:max-w-5xl' : 'max-w-lg'
        }`}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 z-20 bg-white/50 backdrop-blur-sm rounded-full md:bg-transparent"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        {/* STEP 4: INTRO (Intent Confirmation) */}
        {step === 'intro' && (
          <div className="p-8 md:p-10 text-center animate-in slide-in-from-right duration-300">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
               <CheckCircleIcon className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">本番利用についてご案内します</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              初期設定が完了しているため、<br/>
              今すぐ本番利用を始められます。<br/>
              <br/>
              <span className="font-bold text-indigo-600">今なら、スターター特典をご利用いただけます。</span>
            </p>
            <button
              onClick={() => setStep('payment')}
              className="w-full bg-slate-900 text-white font-bold py-5 md:py-4 rounded-xl hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-200 text-xl md:text-base"
            >
              プランを確認する
            </button>
          </div>
        )}

        {/* STEP 5: PAYMENT (Pricing) */}
        {step === 'payment' && (
          <div className="flex flex-col md:flex-row h-full animate-in slide-in-from-right duration-300">
            
            {/* Left Column: Benefits (Desktop: Indigo Bg, Mobile: Top section) */}
            <div className="p-6 md:p-10 md:w-7/12 bg-indigo-50/30 md:bg-indigo-50 border-b md:border-b-0 md:border-r border-indigo-100">
                <div className="md:sticky md:top-0">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Proプランにアップグレード</h2>
                    <p className="text-xs md:text-sm text-gray-500 mb-6 md:mb-8 leading-relaxed">
                      制限を解除して、<br className="md:hidden"/>店舗の魅力を最大限に伝えましょう。
                    </p>

                    <div className="space-y-5">
                       <h3 className="text-xs md:text-sm font-bold text-indigo-900 mb-4 flex items-center gap-2">
                         <span className="text-lg md:text-xl">✨</span> 
                         <span>あなたの右腕として、以下を実現します</span>
                       </h3>
                       <ul className="space-y-4">
                         <li className="flex items-start gap-3 text-xs md:text-sm text-slate-700 leading-relaxed">
                            <div className="bg-white p-1 rounded-full shadow-sm text-indigo-600 mt-0.5 shrink-0">
                                <CheckCircleIcon className="w-3 h-3 md:w-4 md:h-4" />
                            </div>
                            <span>
                              <span className="font-bold block text-slate-800 text-sm md:text-base mb-0.5">生成回数が無制限</span>
                              もう回数を気にする必要はありません。納得いくまで何度でも作成できます。
                            </span>
                         </li>
                         <li className="flex items-start gap-3 text-xs md:text-sm text-slate-700 leading-relaxed">
                            <div className="bg-white p-1 rounded-full shadow-sm text-indigo-600 mt-0.5 shrink-0">
                                <CheckCircleIcon className="w-3 h-3 md:w-4 md:h-4" />
                            </div>
                            <span>
                              <span className="font-bold block text-slate-800 text-sm md:text-base mb-0.5">高度なカスタマイズ・修正機能</span>
                              お店の雰囲気に合わせた詳細設定や、3案同時提案、対話的な修正が可能です。
                            </span>
                         </li>
                         <li className="flex items-start gap-3 text-xs md:text-sm text-slate-700 leading-relaxed">
                            <div className="bg-white p-1 rounded-full shadow-sm text-indigo-600 mt-0.5 shrink-0">
                                <CheckCircleIcon className="w-3 h-3 md:w-4 md:h-4" />
                            </div>
                            <span>
                              <span className="font-bold block text-slate-800 text-sm md:text-base mb-0.5">「いつもの設定」をプリセット保存</span>
                              よく使う設定を保存してワンクリックで呼び出し。毎回の入力の手間を省き、時短できます。
                            </span>
                         </li>
                         <li className="flex items-start gap-3 text-xs md:text-sm text-slate-700 leading-relaxed">
                            <div className="bg-white p-1 rounded-full shadow-sm text-indigo-600 mt-0.5 shrink-0">
                                <CheckCircleIcon className="w-3 h-3 md:w-4 md:h-4" />
                            </div>
                            <span>
                              <span className="font-bold block text-slate-800 text-sm md:text-base mb-0.5">多言語対応（インバウンド対策）</span>
                              英語・中国語・韓国語などに対応。海外のお客様向けのアナウンスも、AIが自然なネイティブ表現で作成します。
                            </span>
                         </li>
                         <li className="flex items-start gap-3 text-xs md:text-sm text-slate-700 leading-relaxed">
                            <div className="bg-white p-1 rounded-full shadow-sm text-indigo-600 mt-0.5 shrink-0">
                                <CheckCircleIcon className="w-3 h-3 md:w-4 md:h-4" />
                            </div>
                            <span>
                              <span className="font-bold block text-slate-800 text-sm md:text-base mb-0.5">Googleマップ返信の「補足」入力</span>
                              「実は機器トラブルがあって…」など、AIに裏事情をメモとして渡せます。定型文ではない、状況に即した温かい返信が可能に。
                            </span>
                         </li>
                       </ul>
                    </div>
                </div>
            </div>

            {/* Right Column: Pricing & Action */}
            <div className="p-6 md:p-10 md:w-5/12 bg-white flex flex-col justify-center relative">
                <div className="md:sticky md:top-10">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6 text-center md:text-left">プラン選択</h3>
                    
                    <div className="space-y-4 mb-8">
                      {/* Yearly Plan */}
                      <div
                        className={yearlyCardClasses}
                        onClick={() => handlePlanSelect("yearly")}
                      >
                        <div className="flex justify-between items-center mb-1">
                           <span className="font-bold text-gray-700">年額プラン</span>
                           <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded">2ヶ月分お得</span>
                        </div>
                        <div className="flex items-end gap-1">
                           <span className="text-2xl font-bold text-gray-900">19,800円</span>
                           <span className="text-xs text-gray-500 mb-1">/年 (税込)</span>
                        </div>
                        <div className="text-xs text-indigo-600 font-bold mt-1">実質 1,650円/月</div>
                      </div>

                      {/* Monthly Plan (Recommended) */}
                      <div
                        className={monthlyCardClasses}
                        onClick={() => handlePlanSelect("monthly")}
                      >
                         <div className="absolute -top-3 left-1/2 md:left-auto md:right-4 -translate-x-1/2 md:translate-x-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                           スターター特典
                         </div>
                         <div className="flex justify-between items-center mb-1 mt-1">
                           <span className="font-bold text-indigo-900">月額プラン</span>
                         </div>
                         <div className="flex items-end gap-2 flex-wrap">
                           <span className="text-sm text-gray-400 line-through">通常 1,980円</span>
                           <div className="flex items-end gap-1">
                             <span className="text-3xl font-black text-indigo-600">980円</span>
                             <span className="text-xs text-gray-500 mb-1">/月 (税込)</span>
                           </div>
                         </div>
                         <div className="text-xs text-amber-600 font-bold mt-2 bg-amber-50 inline-block px-2 py-1 rounded">
                           初月のみ特別価格
                         </div>
                      </div>
                    </div>

                    <button
                      onClick={handleConfirm}
                      className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold py-5 md:py-4 rounded-xl hover:from-indigo-500 hover:to-blue-500 transition-all shadow-lg shadow-indigo-200 transform hover:-translate-y-0.5 active:translate-y-0 text-xl md:text-base"
                    >
                      スターター特典で始める
                    </button>
                    <p className="text-[10px] text-gray-400 text-center mt-4">
                      いつでもキャンセル可能です。
                    </p>
                </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default UpgradeModal;
