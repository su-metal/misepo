import React from 'react';
import { CloseIcon, MagicWandIcon, AutoSparklesIcon, MicIcon, ClockIcon, BookOpenIcon, InstagramIcon, XIcon, LineIcon, GoogleMapsIcon, ChevronRightIcon, SparklesIcon } from './Icons';
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
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-5xl h-full md:h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 bg-[#F8F9FA] rounded-none md:rounded-[48px] shadow-2xl border border-white/20"
        onClick={e => e.stopPropagation()}
      >
        {/* Header - Magazine Style */}
        <div className="px-8 md:px-12 py-8 flex items-end justify-between sticky top-0 z-20 bg-[#F8F9FA]/80 backdrop-blur-md">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-[#2b2b2f]/40 uppercase tracking-[0.4em] mb-1">misepo guide</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#2b2b2f] tracking-tighter leading-[0.85]">
              MASTERING<br />
              <span className="text-2xl md:text-3xl">使いこなしガイド</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-[#2b2b2f] shadow-sm hover:scale-110 transition-all active:scale-95 border border-slate-100"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content - Bento Grid Layout */}
        <div className="overflow-y-auto overscroll-contain flex-1 p-6 md:p-12 no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-12">

            {/* Step 1: Canvas Selection (Large Card) */}
            <div className="md:col-span-8 bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-md transition-all">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-[#2b2b2f] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Step 01</span>
                  <h3 className="text-xl font-black text-[#2b2b2f]">キャンバスを選ぶ</h3>
                </div>
                <p className="text-sm text-slate-500 font-bold leading-relaxed max-w-md">
                  Instagram, X, LINE, Googleマップ。届けたい相手に合わせて投稿先を選択。
                  <span className="text-[#4338CA]">「同時生成」</span>を使えば、一度の指示で全プラットフォームに最適化された文章が手に入ります。
                </p>
              </div>
              <div className="flex gap-4 mt-8">
                {[<InstagramIcon key="1" className="w-8 h-8 text-[#E1306C]" />, <span key="2" className="text-2xl font-black">𝕏</span>, <LineIcon key="3" className="w-8 h-8" />, <GoogleMapsIcon key="4" className="w-8 h-8" />].map((icon, i) => (
                  <div key={i} className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-all duration-500" style={{ transitionDelay: `${i * 100}ms` }}>
                    {icon}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Omakase (Accent Card) */}
            <div className="md:col-span-4 bg-gradient-to-br from-[#60A5FA] via-[#C084FC] to-[#F87171] rounded-[32px] p-8 text-white shadow-lg shadow-purple-500/20 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:rotate-12 transition-transform duration-700">
                <MagicWandIcon className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black tracking-tighter leading-none mb-2 italic">AI OMAKASE</h3>
                <p className="text-[11px] font-black uppercase tracking-widest opacity-80 mb-4">AIおまかせ生成</p>
                <p className="text-xs font-bold leading-relaxed">
                  具体的な指示が思いつかなくても大丈夫。高性能AIが今のお店に最適な投稿をまるごと提案します。
                </p>
              </div>
              <div className="relative z-10 mt-6 flex items-center gap-2">
                <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30">
                  Try Now
                </div>
              </div>
            </div>

            {/* Step 2: Input & Voice (Bento Box 1) */}
            <div className="md:col-span-5 bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col group hover:border-slate-300 transition-all h-[320px]">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-[#2b2b2f] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Step 02</span>
                <h3 className="text-xl font-black text-[#2b2b2f]">伝える内容を入力</h3>
              </div>
              <p className="text-sm text-slate-500 font-bold leading-relaxed mb-6">
                「新メニュー追加」「今日のスタッフの様子」など、箇条書きで十分伝わります。
              </p>
              <div className="mt-auto flex items-end justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                      <MicIcon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Voice transcription</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400">
                    声で話すだけで、AIが自動で投稿プランに変換します。
                  </p>
                </div>
              </div>
            </div>

            {/* Advanced: Few-shot Learning (Bento Box 2) */}
            <div className="md:col-span-7 bg-[#2b2b2f] rounded-[32px] p-8 text-white shadow-sm flex flex-col justify-between group h-[320px]">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <BookOpenIcon className="w-6 h-6 text-[#C084FC]" />
                  <h3 className="text-xl font-black text-white">独自の「らしさ」を育てる</h3>
                </div>
                <p className="text-xs text-slate-400 font-bold mt-2 leading-relaxed">
                  スタイルの学習（Few-shot learning）機能を使えば、AIはあなたのお店らしい言葉遣い、絵文字の使い方、改行のクセを完璧にマスターします。
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 opacity-60 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1 mb-2">
                    <SparklesIcon className="w-3 h-3 text-blue-400" />
                    <div className="h-2 w-16 bg-white/20 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-1.5 w-full bg-white/10 rounded-full" />
                    <div className="h-1.5 w-3/4 bg-white/10 rounded-full" />
                  </div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 border border-white/20 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-[#C084FC]" />
                    <span className="text-[8px] font-black uppercase text-[#C084FC]">Style Applied</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-1.5 w-full bg-white/30 rounded-full" />
                    <div className="h-1.5 w-full bg-white/30 rounded-full" />
                    <div className="h-1.5 w-1/2 bg-white/30 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Strategy: Calendar (Wide Bento) */}
            <div className="md:col-span-12 bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 justify-between group overflow-hidden">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <ClockIcon className="w-6 h-6 text-orange-400" />
                  <h3 className="text-xl font-black text-[#2b2b2f]">カレンダー、トレンド戦略</h3>
                </div>
                <p className="text-sm text-slate-500 font-bold leading-relaxed max-w-xl">
                  ネタに困ったら、HUB画面の大きな日付をタップ。
                  季節の行事や全国のトレンドから、AIがあなたのお店にぴったりの「今日使える」投稿アイデアを無限に提案します。
                </p>
              </div>
              <div className="w-full md:w-64 h-32 bg-slate-50 rounded-2xl border border-slate-100 p-4 flex flex-col justify-center gap-3 group-hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div className="w-20 h-4 bg-slate-200 rounded-full" />
                  <div className="w-4 h-4 rounded-full bg-orange-400" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 w-full bg-slate-100 rounded-full" />
                  <div className="h-2 w-full bg-slate-100 rounded-full" />
                  <div className="h-2 w-2/3 bg-slate-100 rounded-full" />
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Action */}
          <div className="pt-4 pb-12 text-center">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-16 py-5 font-black text-[12px] uppercase tracking-[0.3em] transition-all active:scale-95 rounded-full bg-[#2b2b2f] text-white shadow-2xl hover:bg-black hover:-translate-y-1 active:translate-y-0"
            >
              Start Creating
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;
