import React, { useEffect, useState } from 'react';
import { CloseIcon, MagicWandIcon, ChevronDownIcon, AutoSparklesIcon, ClockIcon, BookOpenIcon } from './Icons';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'basics' | 'advanced'>('basics');

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
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-500" onClick={onClose}>
      <div
        className="bg-white rounded-none md:rounded-[32px] shadow-2xl w-full max-w-4xl h-full md:h-auto md:max-h-[85vh] overflow-hidden flex flex-col relative border border-white/50 ring-1 ring-white/50 animate-in zoom-in-95 duration-500 scale-100 mobile-scroll-container"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
              <MagicWandIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-none">
                使いこなしガイド
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Master Class</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto overscroll-contain flex-1 p-6 md:p-10 space-y-12 bg-white">

          {/* SECTION 1: 3-STEP FLOW (Compact) */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-slate-800 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">Basic</span>
              <h3 className="text-lg font-black text-slate-800">基本の3ステップ</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1 */}
              <div className="flex flex-row md:flex-col items-center md:items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-50 shrink-0 font-black text-lg">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">条件を選ぶ</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">投稿するSNSや、お店の状況に合わせたスタイルを選択します。</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-row md:flex-col items-center md:items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-50 shrink-0 font-black text-lg">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">メモを入力</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">「新商品入荷！」「雨の日セール」など、伝えたいことを箇条書きでOK。</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-row md:flex-col items-center md:items-start gap-4 p-5 rounded-2xl bg-indigo-50 border border-indigo-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <AutoSparklesIcon className="w-16 h-16 text-indigo-600" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 shrink-0 font-black text-lg relative z-10">
                  3
                </div>
                <div className="relative z-10">
                  <h4 className="font-bold text-indigo-900 text-sm mb-1">AI生成・調整</h4>
                  <p className="text-xs text-indigo-700 leading-relaxed font-medium">ワンクリックで投稿文が完成。必要に応じて微調整してコピーするだけ。</p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: ADVANCED FEATURES (Grid) */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-pink-500 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">Pro Tips</span>
              <h3 className="text-lg font-black text-slate-800">便利な機能・設定</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Feature: Profile Settings */}
              <div className="group border border-slate-100 rounded-2xl p-5 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50/50 transition-all bg-white">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-indigo-50 flex items-center justify-center text-slate-500 group-hover:text-indigo-600 transition-colors shrink-0">
                    <MagicWandIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-2">店舗設定の最適化</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      お店の名前、業種、コンセプトを登録すると、AIが「お店らしい」トーンを学習し、より精度の高い文章を提案します。
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature: Presets */}
              <div className="group border border-slate-100 rounded-2xl p-5 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50/50 transition-all bg-white">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-indigo-50 flex items-center justify-center text-slate-500 group-hover:text-indigo-600 transition-colors shrink-0">
                    <BookOpenIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-2">スタイル（プリセット）保存</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      「店長風」「スタッフAちゃん風」など、よく使う文体を保存して切り替えることができます。
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature: History */}
              <div className="group border border-slate-100 rounded-2xl p-5 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50/50 transition-all bg-white">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-indigo-50 flex items-center justify-center text-slate-500 group-hover:text-indigo-600 transition-colors shrink-0">
                    <ClockIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-2">履歴から復元</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      過去に生成した投稿は自動保存されています。サイドバーからいつでも確認・再利用が可能です。
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature: Tone & Length */}
              <div className="group border border-slate-100 rounded-2xl p-5 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50/50 transition-all bg-white">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-indigo-50 flex items-center justify-center text-slate-500 group-hover:text-indigo-600 transition-colors shrink-0">
                    <AutoSparklesIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-2">トーン・長さ調整</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      「親しみやすく」「きっちり」、「短め」「長め」など、投稿の雰囲気をボタン一つで微調整できます。
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* CTA */}
          <div className="pt-8 pb-4 text-center">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-12 py-4 bg-slate-900 text-white rounded-full font-black text-sm hover:bg-slate-800 transition-colors shadow-xl shadow-slate-900/20 active:scale-95"
            >
              理解した
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GuideModal;
