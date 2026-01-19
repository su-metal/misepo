import React, { useState, useEffect } from 'react';
import { StoreProfile } from '../types';
import { INDUSTRIES } from '../constants';

interface OnboardingProps {
  onSave: (profile: StoreProfile) => void;
  initialProfile?: StoreProfile | null;
  onCancel?: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({
  onSave,
  initialProfile,
  onCancel,
}) => {
  const [industry, setIndustry] = useState<string>(INDUSTRIES[0]);
  const [name, setName] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [instagramFooter, setInstagramFooter] = useState<string>('');

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Initialize with initialProfile if provided
  useEffect(() => {
    if (initialProfile) {
      setIndustry(initialProfile.industry);
      setName(initialProfile.name);
      setRegion(initialProfile.region);
      setDescription(initialProfile.description || '');
      setInstagramFooter(initialProfile.instagramFooter || '');
    }
  }, [initialProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      return;
    }
    onSave({
      industry,
      name: name.trim(),
      region: region.trim(),
      description: description.trim(),
      instagramFooter: instagramFooter.trim()
    });
  };

  const isEditMode = !!initialProfile;

  return (
    <div className="fixed inset-0 bg-[#001738]/60 flex items-center justify-center p-0 sm:p-4 z-[100] backdrop-blur-xl animate-in fade-in duration-500">
      <div className="bg-white/95 sm:rounded-[32px] shadow-[0_32px_128px_-32px_rgba(0,17,45,0.5)] w-full max-w-lg md:max-w-6xl md:h-[90vh] h-full sm:max-h-[800px] flex flex-col md:flex-row overflow-hidden relative border border-white/40 backdrop-filter transition-all">

        {/* LEFT PANEL: Premium Sidebar - CastMe Style */}
        <div className="md:w-5/12 bg-slate-50 relative p-8 md:p-14 flex flex-col justify-between shrink-0 text-[#001738] overflow-hidden group border-r border-slate-100">
          {/* Tech Background Effects */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-multiply"></div>
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-[#E5005A]/5 rounded-full blur-[100px] opacity-60 transition-all"></div>
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 bg-navy-100/50 rounded-full blur-[100px] opacity-40"></div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,23,56,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,23,56,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

          <div className="relative z-10 flex flex-col h-full">
            <div className="mb-10 animate-in slide-in-from-top-4 duration-700">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E5005A] shadow-sm animate-pulse"></div>
                <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">店舗専用アシスタント</span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter leading-none italic text-[#001738]">
                Mise<span className="text-[#E5005A] text-shadow-sm">Po</span>
              </h1>
            </div>

            <div className="space-y-6 mb-12 flex-1">
              <h2 className="text-3xl md:text-4xl font-black leading-[1.1] text-[#001738] animate-in slide-in-from-left-4 duration-700 delay-100">
                {isEditMode ? '店舗設定の最適化' : 'AIが提案する、\n次世代の店舗広報。'}
              </h2>
              <p className="text-slate-500 text-base font-bold leading-relaxed animate-in slide-in-from-left-4 duration-700 delay-200">
                {isEditMode
                  ? '設定を変更することで、AIの文章トーンや提案内容がリアルタイムに進化します。'
                  : 'お店のこだわりや特徴を入力してください。AIがあなたの専任のSNS担当者となります。'}
              </p>

              {/* Status Pill - CastMe Style */}
              <div className="inline-flex items-center gap-2 bg-[#001738] border border-[#001738] rounded-full px-5 py-2 animate-in zoom-in-95 duration-700 delay-300 shadow-lg shadow-navy-900/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5005A] animate-ping"></span>
                <span className="text-[11px] font-black uppercase tracking-widest text-white">AI解析エンジンの準備完了</span>
              </div>
            </div>

            {/* Feature Cards - CastMe Style */}
            <div className="space-y-4 hidden md:block animate-in slide-in-from-bottom-8 duration-1000 delay-500">
              {[
                { title: '個性学習エンジン', desc: '業種やコンセプトを深く理解し、常に「らしい」表現を維持。', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
                { title: 'マルチプラットフォーム', desc: '投稿先ごとの特性を考慮し、一貫性のある発信を自動化。', icon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' }
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-4 p-5 rounded-[24px] bg-white border border-slate-100 shadow-sm hover:border-[#E5005A]/40 hover:shadow-lg transition-all cursor-default group/feat">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 group-hover/feat:scale-110 group-hover/feat:text-[#E5005A] transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d={feat.icon} /></svg>
                  </div>
                  <div>
                    <h3 className="font-black text-xs text-[#001738] uppercase tracking-widest">{feat.title}</h3>
                    <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed font-bold">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Modern Form - CastMe Style */}
        <div className="flex-1 bg-white overflow-y-auto overscroll-contain animate-in slide-in-from-right-8 duration-700">
          <form onSubmit={handleSubmit} className="p-8 md:p-14 space-y-12">

            {/* Industry Selection */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-[#E5005A] rounded-full"></div>
                <label className="text-xs font-black text-[#001738] uppercase tracking-widest">
                  お店のカテゴリー
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => setIndustry(ind)}
                    className={`px-6 py-3 rounded-2xl text-[11px] font-black transition-all duration-300 border-2
                      ${industry === ind
                        ? 'bg-[#001738] border-[#001738] text-white shadow-xl shadow-navy-900/20'
                        : 'bg-white border-slate-100 text-slate-400 hover:border-[#001738] hover:text-[#001738]'
                      }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Info Inputs */}
            <div className="grid grid-cols-1 gap-12">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-[#001738] rounded-full"></div>
                  <label className="text-xs font-black text-[#001738] uppercase tracking-widest">
                    店舗名・ブランド名
                  </label>
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例：焼きたてパンの店 アン"
                    className="w-full px-7 py-6 rounded-[24px] bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#001738] focus:ring-8 focus:ring-navy-900/5 outline-none transition-all text-2xl text-[#001738] font-black tracking-tight placeholder:text-slate-200"
                    required
                  />
                  <div className="absolute right-7 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-[#001738] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-[#001738] rounded-full"></div>
                  <label className="text-xs font-black text-[#001738] uppercase tracking-widest">
                    活動地域（例：横浜市、目黒区）
                  </label>
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="地名を入れるとより親しみやすい文章になります"
                    className="w-full px-7 py-6 rounded-[24px] bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#001738] focus:ring-8 focus:ring-navy-900/5 outline-none transition-all text-2xl text-[#001738] font-black tracking-tight placeholder:text-slate-200"
                  />
                  <div className="absolute right-7 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-[#001738] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Input */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-[#E5005A] rounded-full"></div>
                <label className="text-xs font-black text-[#001738] uppercase tracking-widest">
                  お店のこだわり・コンセプト
                </label>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="例：自家焙煎のコーヒー、夜はオーガニックワインを提供、落ち着いたモダンな内装..."
                rows={5}
                className="w-full px-7 py-6 rounded-[24px] bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#001738] focus:ring-8 focus:ring-navy-900/5 outline-none transition-all resize-none text-base text-[#001738] font-black leading-relaxed placeholder:text-slate-200 shadow-inner"
              />
            </div>

            {/* Instagram Footer: Premium Card - CastMe Style */}
            <div className="relative p-[1px] rounded-[32px] bg-slate-100 group transition-all hover:bg-[#E5005A]/20">
              <div className="bg-white rounded-[31px] p-8 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#001738] flex items-center justify-center text-white shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black text-[#001738] uppercase tracking-widest">Instagram 定型文</h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">投稿末尾に自動挿入されます</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-[#E5005A] bg-[#E5005A]/5 px-3 py-1.5 rounded-full border border-[#E5005A]/10 uppercase tracking-widest">Option</span>
                </div>
                <textarea
                  value={instagramFooter}
                  onChange={(e) => setInstagramFooter(e.target.value)}
                  placeholder="📍 アクセス情報や営業時間をセット..."
                  rows={3}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#E5005A] outline-none transition-all resize-none text-sm text-[#001738] leading-relaxed placeholder-slate-200 font-black shadow-inner"
                />
              </div>
            </div>

            {/* Actions - CastMe Style */}
            <div className="flex flex-col sm:flex-row gap-4 pt-10 sticky bottom-0 bg-white/95 backdrop-blur-md md:static z-20 pb-4">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 py-6 rounded-2xl border-2 border-slate-100 font-black text-[11px] text-slate-400 hover:text-[#001738] hover:border-[#001738] transition-all uppercase tracking-widest"
                >
                  キャンセル
                </button>
              )}
              <button
                type="submit"
                disabled={name.trim().length < 2}
                className="flex-[2] relative group overflow-hidden bg-[#001738] text-white font-black py-6 rounded-2xl shadow-2xl shadow-navy-900/30 hover:bg-navy-900 hover:scale-[1.02] active:scale-95 transition-all duration-500 flex items-center justify-center gap-4 disabled:opacity-50 disabled:pointer-events-none"
              >
                <span className="relative z-10 text-sm tracking-[0.2em]">{isEditMode ? '設定を保存する' : '設定を完了してはじめる'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 group-hover:translate-x-2 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </button>
            </div>
          </form>
        </div>

        {/* Close Button Overlay (Desktop Only) - CastMe Style */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="absolute top-8 right-8 hidden md:flex items-center justify-center w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-md text-slate-300 hover:bg-[#E5005A]/10 hover:text-[#E5005A] border border-slate-100 shadow-xl transition-all group/close active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
