import React from 'react';
import { CloseIcon, MagicWandIcon, AutoSparklesIcon, ClockIcon, BookOpenIcon } from './Icons';
import { useScrollLock } from '../hooks/useScrollLock';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  useScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-500">
      {/* VisionOS Style Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-4xl h-full md:h-auto md:max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 bg-white rounded-none md:rounded-[40px] shadow-2xl ring-1 ring-black/5"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 md:py-8 flex items-center justify-between sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-indigo-50 text-[#7F5AF0] shadow-sm">
              <MagicWandIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-none">
                使いこなしガイド
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Master Class</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all active:scale-90"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto overscroll-contain flex-1 p-8 md:p-12 space-y-12 no-scrollbar">

          {/* SECTION 1: 3-STEP FLOW */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">Basic</span>
              <h3 className="text-lg font-black text-slate-800">基本の3ステップ</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="flex flex-row md:flex-col items-center md:items-start gap-5 p-6 rounded-[28px] bg-white border border-slate-50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 font-black text-lg">
                  1
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-sm mb-1.5">条件を選ぶ</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">投稿するSNSや、お店の状況に合わせたスタイルを選択します。</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-row md:flex-col items-center md:items-start gap-5 p-6 rounded-[28px] bg-white border border-slate-50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 font-black text-lg">
                  2
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-sm mb-1.5">メモを入力</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">「新商品入荷！」「雨の日セール」など、伝えたいことを箇条書きでOK。</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative group p-[2px] rounded-[30px] shadow-lg shadow-indigo-100 hover:-translate-y-1 transition-all">
                {/* Prism Radiant Aura */}
                <div className="absolute inset-0 rounded-[30px] overflow-hidden pointer-events-none">
                  <div
                    className="absolute inset-0 opacity-100 blur-sm"
                    style={{
                      background: 'linear-gradient(45deg, #22D3EE, #FACC15, #F472B6)'
                    }}
                  />
                </div>

                <div className="relative flex flex-row md:flex-col items-center md:items-start gap-5 p-6 rounded-[28px] bg-gradient-to-br from-[#7F5AF0] to-[#22D3EE] overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <AutoSparklesIcon className="w-20 h-20 text-white" />
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 font-black text-lg relative z-10">
                    3
                  </div>
                  <div className="relative z-10 text-white">
                    <h4 className="font-black text-sm mb-1.5 uppercase">AI生成・調整</h4>
                    <p className="text-xs text-white/90 leading-relaxed font-medium">ワンクリックで投稿文が完成。必要に応じて微調整してコピーするだけ。</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: ADVANCED FEATURES */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <span className="bg-indigo-50 text-[#7F5AF0] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">Pro Tips</span>
              <h3 className="text-lg font-black text-slate-800">便利な機能・設定</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Feature: Profile Settings */}
              <div className="group rounded-[28px] p-6 bg-slate-50/50 border border-transparent hover:bg-white hover:border-indigo-100 hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="flex items-start gap-5">
                  <div className="w-11 h-11 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-500 shrink-0 group-hover:scale-110 transition-transform">
                    <MagicWandIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm mb-2">店舗設定の最適化</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      お店の名前、業種、コンセプトを登録すると、AIが「お店らしい」トーンを学習し、より精度の高い文章を提案します。
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature: Presets */}
              <div className="group rounded-[28px] p-6 bg-slate-50/50 border border-transparent hover:bg-white hover:border-emerald-100 hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="flex items-start gap-5">
                  <div className="w-11 h-11 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-500 shrink-0 group-hover:scale-110 transition-transform">
                    <BookOpenIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm mb-2">スタイル（プリセット）保存</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      「店長風」「スタッフAちゃん風」など、よく使う文体を保存して切り替えることができます。
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature: History */}
              <div className="group rounded-[28px] p-6 bg-slate-50/50 border border-transparent hover:bg-white hover:border-amber-100 hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="flex items-start gap-5">
                  <div className="w-11 h-11 rounded-2xl bg-white shadow-sm flex items-center justify-center text-amber-500 shrink-0 group-hover:scale-110 transition-transform">
                    <ClockIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm mb-2">履歴から復元</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      過去に生成した投稿は自動保存されています。サイドバーからいつでも確認・再利用が可能です。
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature: Tone & Length */}
              <div className="group rounded-[28px] p-6 bg-slate-50/50 border border-transparent hover:bg-white hover:border-rose-100 hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="flex items-start gap-5">
                  <div className="w-11 h-11 rounded-2xl bg-white shadow-sm flex items-center justify-center text-rose-500 shrink-0 group-hover:scale-110 transition-transform">
                    <AutoSparklesIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm mb-2">トーン・長さ調整</h4>
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
              className="w-full sm:w-auto px-12 py-4 font-black text-sm transition-all active:scale-95 rounded-[20px] bg-[#111111] text-white shadow-xl shadow-slate-200 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0"
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
