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
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-500" onClick={onClose}>
      <div
        className="bg-white rounded-none md:rounded-[32px] border-[3px] border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] w-full max-w-4xl h-full md:h-auto md:max-h-[85vh] overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-500 scale-100 mobile-scroll-container"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 md:p-8 border-b-[3px] border-black flex items-center justify-between bg-[var(--bg-beige)] sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--lavender)] flex items-center justify-center text-black border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <MagicWandIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-black tracking-tight leading-none">
                使いこなしガイド
              </h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Master Class</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-white border-2 border-transparent hover:border-black rounded-xl text-slate-400 hover:text-black hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto overscroll-contain flex-1 p-6 md:p-10 space-y-12 bg-white">

          {/* SECTION 1: 3-STEP FLOW (Compact) */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-black text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,0.3)]">Basic</span>
              <h3 className="text-lg font-black text-black">基本の3ステップ</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="flex flex-row md:flex-col items-center md:items-start gap-4 p-5 rounded-2xl bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black border-2 border-black shrink-0 font-black text-lg">
                  1
                </div>
                <div>
                  <h4 className="font-black text-black text-sm mb-1">条件を選ぶ</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-bold">投稿するSNSや、お店の状況に合わせたスタイルを選択します。</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-row md:flex-col items-center md:items-start gap-4 p-5 rounded-2xl bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black border-2 border-black shrink-0 font-black text-lg">
                  2
                </div>
                <div>
                  <h4 className="font-black text-black text-sm mb-1">メモを入力</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-bold">「新商品入荷！」「雨の日セール」など、伝えたいことを箇条書きでOK。</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-row md:flex-col items-center md:items-start gap-4 p-5 rounded-2xl bg-[var(--gold)] border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] relative overflow-hidden group hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all">
                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-30 transition-opacity">
                  <AutoSparklesIcon className="w-16 h-16 text-black" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white border-2 border-black shrink-0 font-black text-lg relative z-10">
                  3
                </div>
                <div className="relative z-10">
                  <h4 className="font-black text-black text-sm mb-1">AI生成・調整</h4>
                  <p className="text-xs text-black leading-relaxed font-bold">ワンクリックで投稿文が完成。必要に応じて微調整してコピーするだけ。</p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: ADVANCED FEATURES (Grid) */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#E88BA3] text-black text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">Pro Tips</span>
              <h3 className="text-lg font-black text-black">便利な機能・設定</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Feature: Profile Settings */}
              <div className="group border-2 border-black rounded-2xl p-5 hover:bg-[var(--bg-beige)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all bg-white">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--lavender)] border-2 border-black flex items-center justify-center text-black shrink-0 group-hover:scale-110 transition-transform">
                    <MagicWandIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-black text-sm mb-2">店舗設定の最適化</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-bold">
                      お店の名前、業種、コンセプトを登録すると、AIが「お店らしい」トーンを学習し、より精度の高い文章を提案します。
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature: Presets */}
              <div className="group border-2 border-black rounded-2xl p-5 hover:bg-[var(--bg-beige)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all bg-white">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--teal)] border-2 border-black flex items-center justify-center text-black shrink-0 group-hover:scale-110 transition-transform">
                    <BookOpenIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-black text-sm mb-2">スタイル（プリセット）保存</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-bold">
                      「店長風」「スタッフAちゃん風」など、よく使う文体を保存して切り替えることができます。
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature: History */}
              <div className="group border-2 border-black rounded-2xl p-5 hover:bg-[var(--bg-beige)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all bg-white">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--gold)] border-2 border-black flex items-center justify-center text-black shrink-0 group-hover:scale-110 transition-transform">
                    <ClockIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-black text-sm mb-2">履歴から復元</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-bold">
                      過去に生成した投稿は自動保存されています。サイドバーからいつでも確認・再利用が可能です。
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature: Tone & Length */}
              <div className="group border-2 border-black rounded-2xl p-5 hover:bg-[var(--bg-beige)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all bg-white">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#E88BA3] border-2 border-black flex items-center justify-center text-black shrink-0 group-hover:scale-110 transition-transform">
                    <AutoSparklesIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-black text-sm mb-2">トーン・長さ調整</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-bold">
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
              className="w-full sm:w-auto px-12 py-4 bg-black text-white rounded-xl border-2 border-black font-black text-sm hover:bg-slate-800 transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
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
