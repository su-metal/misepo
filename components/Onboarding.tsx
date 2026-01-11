
import React, { useState, useEffect } from 'react';
import { StoreProfile } from '../types';
import { INDUSTRIES } from '../constants';

interface OnboardingProps {
  onSave: (profile: StoreProfile) => void;
  initialProfile?: StoreProfile | null;
  onCancel?: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onSave, initialProfile, onCancel }) => {
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
      alert('店名は2文字以上で入力してください。');
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
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-[60] backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg md:max-w-5xl md:h-[85vh] max-h-[90vh] flex flex-col md:flex-row overflow-hidden relative font-sans">
        
        {/* LEFT PANEL (Sidebar/Header) */}
        <div className="md:w-5/12 bg-slate-900 relative p-8 md:p-12 flex flex-col justify-between shrink-0 text-white overflow-hidden">
             {/* Background Effects */}
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
             
             <div className="relative z-10">
                <div className="mb-6 flex items-center gap-2">
                   <h1 className="text-3xl font-black tracking-tighter leading-none">Mise<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Po</span><span className="text-amber-500">.</span></h1>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-4">
                  {isEditMode ? '店舗設定の変更' : 'あなた専用の\nAI広報スタッフ'}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {isEditMode 
                    ? 'お店の情報を更新すると、AIの生成傾向も変化します。' 
                    : 'お店の特徴やこだわりを教えてください。\nAIがあなたの右腕となって、魅力的な投稿を作成します。'}
                </p>
                
                {!isEditMode && (
                   <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      <span className="text-[11px] font-bold text-slate-300">入力内容はいつでも変更・修正可能です</span>
                   </div>
                )}

                {/* Benefits List (Desktop Only) */}
                <div className="space-y-5 hidden md:block mt-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 shrink-0 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">お店の個性を学習</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">業種や雰囲気に合わせた最適なトーンを提案します。</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 shrink-0 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">SNS運用を自動化</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">Instagram, X, Googleマップの投稿作成を大幅に時短します。</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 shrink-0 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
                     </div>
                     <div>
                        <h3 className="font-bold text-sm text-slate-200">生成精度が向上</h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">詳細情報を入力するほど、より「らしい」文章が作れます。</p>
                     </div>
                  </div>
                </div>
             </div>

             <div className="relative z-10 hidden md:block mt-auto pt-6 border-t border-slate-800/50">
                <p className="text-[10px] text-slate-600">
                  ※ 入力情報はAIのコンテキストとしてのみ使用され、外部公開はされません。
                </p>
             </div>
        </div>

        {/* RIGHT PANEL (Form) */}
        <div className="flex-1 bg-white overflow-y-auto overscroll-contain">
          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
             {/* Industry Selection */}
             <div className="space-y-3">
                <label className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                   <span>業種</span>
                   <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full text-[10px]">必須</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRIES.map((ind) => (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => setIndustry(ind)}
                      className={`px-5 py-3.5 md:px-4 md:py-2.5 rounded-xl text-base md:text-sm font-bold transition-all duration-200 border ${
                        industry === ind
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 scale-[1.02]'
                          : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50'
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Input */}
                <div className="md:col-span-2 space-y-2">
                  <label className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                     <span>店名</span>
                     <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full text-[10px]">必須</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例: 熟成肉とんかつロース堂"
                    className="w-full px-5 py-4 md:px-4 md:py-3.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-base md:text-sm text-slate-800 font-medium placeholder-slate-400"
                    required
                  />
                </div>

                {/* Region Input */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    地域 <span className="text-indigo-500/70 ml-1 font-normal lowercase">(推奨)</span>
                  </label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="例: 豊橋市、渋谷区（地名を入れると自然になります）"
                    className="w-full px-5 py-4 md:px-4 md:py-3.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-base md:text-sm text-slate-800 font-medium placeholder-slate-400"
                  />
                </div>
             </div>
          
             {/* Description Input */}
             <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                よく言われること・こだわり <span className="text-gray-400 font-normal lowercase">(任意)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={'例：\n・量が多い\n・一人でも入りやすい\n・駅から近い（箇条書きでOK！）'}
                rows={4}
                className="w-full px-5 py-4 md:px-4 md:py-3.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none placeholder-slate-400 text-base md:text-sm text-slate-800 leading-relaxed"
              />
            </div>

            {/* Instagram Footer Input */}
            <div className="space-y-3 bg-gradient-to-r from-pink-50 to-purple-50 p-5 rounded-2xl border border-pink-100/50">
              <label className="block text-xs font-bold text-pink-600 uppercase tracking-wider flex items-center gap-1.5">
                <div className="p-1 bg-white rounded-md shadow-sm text-pink-500">
                   <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </div>
                Instagram用 定型文 <span className="text-pink-400 font-normal lowercase ml-auto text-[10px]">任意</span>
              </label>
              <p className="text-[11px] text-pink-800/60 leading-tight">
                投稿の最後に自動挿入されます。営業時間やアクセス情報を入れておくと便利です。
              </p>
              <textarea
                value={instagramFooter}
                onChange={(e) => setInstagramFooter(e.target.value)}
                placeholder={'例：\n📍 東京都渋谷区...\n🕒 11:00-22:00\n定休日: 水曜日\nご予約はプロフィールから！'}
                rows={3}
                className="w-full px-5 py-4 md:px-4 md:py-3 rounded-xl bg-white border border-transparent focus:border-pink-300 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all resize-none placeholder-slate-400 text-base md:text-sm text-slate-800 leading-relaxed"
              />
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-slate-100 flex gap-4 sticky bottom-0 bg-white/95 backdrop-blur-sm md:static">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 py-5 md:py-4 rounded-xl border border-slate-200 font-bold text-lg md:text-base text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                >
                  キャンセル
                </button>
              )}
              <button
                type="submit"
                className="flex-1 bg-slate-900 hover:bg-indigo-600 text-white font-bold py-5 md:py-4 rounded-xl shadow-xl shadow-slate-200 hover:shadow-indigo-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-xl md:text-lg flex items-center justify-center gap-2"
              >
                {isEditMode ? (
                    <>
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                       <span>更新する</span>
                    </>
                ) : (
                    <>
                       <span>設定完了</span>
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
