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
    <div className="fixed inset-0 bg-stone-950/80 flex items-center justify-center p-0 sm:p-4 z-[100] backdrop-blur-md animate-in fade-in duration-500">
      <div className="bg-white/95 sm:rounded-[32px] shadow-[0_32px_128px_-32px_rgba(0,0,0,0.5)] w-full max-w-lg md:max-w-6xl md:h-[90vh] h-full sm:max-h-[800px] flex flex-col md:flex-row overflow-hidden relative border border-white/20 backdrop-filter transition-all">

        {/* LEFT PANEL: Premium Sidebar */}
        <div className="md:w-5/12 bg-[#0F172A] relative p-8 md:p-14 flex flex-col justify-between shrink-0 text-white overflow-hidden group">
          {/* Industrial Tech Background Effects */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 bg-orange-500/30 rounded-full blur-[100px] opacity-40 animate-pulse transition-all"></div>
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] opacity-30 animate-pulse delay-700"></div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

          <div className="relative z-10 flex flex-col h-full">
            <div className="mb-10 animate-in slide-in-from-top-4 duration-700">
              <h1 className="text-4xl font-black tracking-tight leading-none">
                Mise<span className="text-transparent bg-clip-text bg-gradient-to-br from-orange-400 via-blue-400 to-orange-500">Po</span>
                <span className="text-orange-500">.</span>
              </h1>
            </div>

            <div className="space-y-6 mb-12 flex-1">
              <h2 className="text-3xl md:text-4xl font-bold leading-[1.1] animate-in slide-in-from-left-4 duration-700 delay-100">
                {isEditMode ? '店舗設定の最適化' : 'AIが提案する、\n次世代の店舗広報。'}
              </h2>
              <p className="text-stone-400 text-base leading-relaxed animate-in slide-in-from-left-4 duration-700 delay-200">
                {isEditMode
                  ? '設定を変更することで、AIの文章トーンや提案内容がリアルタイムに進化します。'
                  : 'お店のこだわりや特徴を入力してください。AIがあなたの専任のSNS担当者となります。'}
              </p>

              {/* Status Pill */}
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 animate-in zoom-in-95 duration-700 delay-300">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping"></span>
                <span className="text-[11px] font-black uppercase tracking-widest text-orange-300">Intelligent Analysis Ready</span>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="space-y-6 hidden md:block animate-in slide-in-from-bottom-8 duration-1000 delay-500">
              {[
                { title: '個性学習エンジン', desc: '業種やコンセプトを深く理解し、常に「らしい」表現を維持。', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
                { title: 'マルチプラットフォーム', desc: '投稿先ごとの特性を考慮し、一貫性のある発信を自動化。', icon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' }
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all cursor-default group/feat">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0 shadow-inner group-hover/feat:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={feat.icon} /></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-stone-100">{feat.title}</h3>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Modern Form */}
        <div className="flex-1 bg-white overflow-y-auto overscroll-contain animate-in slide-in-from-right-8 duration-700">
          <form onSubmit={handleSubmit} className="p-8 md:p-14 space-y-10">

            {/* Industry Selection */}
            <div className="space-y-4">
              <label className="flex items-center justify-between text-[11px] font-black text-stone-400 uppercase tracking-[0.2em]">
                <span>ビジネス・カテゴリー</span>
                <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[9px]">Required</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => setIndustry(ind)}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${industry === ind
                        ? 'bg-stone-900 border-stone-900 text-white shadow-xl shadow-stone-200 -transtone-y-0.5'
                        : 'bg-stone-50 border-stone-100 text-stone-500 hover:border-orange-200 hover:text-orange-600'
                      }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Info Inputs */}
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-3">
                <label className="flex items-center justify-between text-[11px] font-black text-stone-400 uppercase tracking-[0.2em]">
                  <span>店舗・ブランド名</span>
                  {name.length < 2 && <span className="text-rose-500 text-[10px] lowercase italic">2 chars min</span>}
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例: ROASTER CAFE & BAR"
                    className="w-full px-6 py-4.5 rounded-2xl bg-stone-50 border-2 border-transparent focus:bg-white focus:border-orange-500 focus:ring-[8px] focus:ring-orange-500/5 outline-none transition-all text-base text-stone-800 font-bold placeholder-stone-300"
                    required
                  />
                  <div className="absolute right-4 top-1/2 -transtone-y-1/2 text-stone-200 group-focus-within:text-orange-300 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[11px] font-black text-stone-400 uppercase tracking-[0.2em]">
                  活動地域（例：横浜市、目黒区）
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="地名を入れると生成内容がより具体的になります"
                    className="w-full px-6 py-4.5 rounded-2xl bg-stone-50 border-2 border-transparent focus:bg-white focus:border-orange-500 focus:ring-[8px] focus:ring-orange-500/5 outline-none transition-all text-base text-stone-800 font-bold placeholder-stone-300"
                  />
                  <div className="absolute right-4 top-1/2 -transtone-y-1/2 text-stone-200 group-focus-within:text-orange-300 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Input */}
            <div className="space-y-3">
              <label className="block text-[11px] font-black text-stone-400 uppercase tracking-[0.2em]">
                店舗のこだわり・コンセプト
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="例：自家焙煎のコーヒー、夜はオーガニックワインを提供、落ち着いたモダンな内装..."
                rows={4}
                className="w-full px-6 py-5 rounded-2xl bg-stone-50 border-2 border-transparent focus:bg-white focus:border-orange-500 focus:ring-[8px] focus:ring-orange-500/5 outline-none transition-all resize-none text-base text-stone-800 font-medium leading-relaxed placeholder-stone-300"
              />
            </div>

            {/* Instagram Footer: Premium Card */}
            <div className="relative p-[2px] rounded-3xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-lg shadow-rose-100/50">
              <div className="bg-white rounded-[22px] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-rose-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-stone-800 uppercase tracking-tighter">Instagram Template</h4>
                      <p className="text-[10px] text-stone-400 font-bold">投稿末尾に自動挿入されます</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100 uppercase tracking-widest">Optional</span>
                </div>
                <textarea
                  value={instagramFooter}
                  onChange={(e) => setInstagramFooter(e.target.value)}
                  placeholder="📍 アクセス情報や営業時間をセット..."
                  rows={3}
                  className="w-full px-5 py-4 rounded-xl bg-stone-50 border-2 border-transparent focus:bg-white focus:border-rose-400 outline-none transition-all resize-none text-sm text-stone-800 leading-relaxed placeholder-stone-300 font-medium"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-4 pt-10 sticky bottom-0 bg-white/95 backdrop-blur-md md:static">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 py-5 rounded-2xl border-2 border-stone-100 font-black text-sm text-stone-400 hover:text-stone-600 hover:border-stone-200 transition-all uppercase tracking-widest"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={name.trim().length < 2}
                className="flex-[2] bg-[#0F172A] hover:bg-orange-600 text-white font-black py-5 rounded-2xl shadow-2xl shadow-stone-200 hover:shadow-orange-200 transition-all transform hover:-transtone-y-1 active:transtone-y-0 text-base flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none"
              >
                <span>{isEditMode ? 'SAVE CONFIGURATION' : 'COMPLETE SETTINGS'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </button>
            </div>
          </form>
        </div>

        {/* Close Button Overlay (Desktop Only) */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="absolute top-6 right-6 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-stone-100 text-stone-400 hover:bg-rose-50 hover:text-rose-500 transition-all group/close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
