
import React, { useState, useEffect, useRef } from 'react';
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
  const [googlePlaceId, setGooglePlaceId] = useState<string>('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const autocompleteService = useRef<any>(null);

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
      setGooglePlaceId(initialProfile.googlePlaceId || '');
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
      instagramFooter: instagramFooter.trim(),
      googlePlaceId: googlePlaceId
    });
  };

  const handleNameChange = (val: string) => {
    setName(val);
    setGooglePlaceId(''); // Clear place ID when manual edit starts

    if (!val.trim()) {
      setSuggestions([]);
      return;
    }

    if (!autocompleteService.current && typeof window !== 'undefined' && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }

    if (autocompleteService.current) {
      autocompleteService.current.getPlacePredictions(
        { input: val, types: ['establishment'] },
        (predictions: any[] | null, status: any) => {
          if (status === 'OK' && predictions) {
            setSuggestions(predictions);
          } else {
            setSuggestions([]);
          }
        }
      );
    }
  };

  const isEditMode = !!initialProfile;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-500">
      {/* VisionOS Style Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />

      <div className="bg-white rounded-none sm:rounded-[40px] shadow-2xl overflow-hidden w-full max-w-lg md:max-w-6xl md:h-[90vh] h-full sm:max-h-[800px] flex flex-col md:flex-row md:overflow-hidden relative animate-in zoom-in-95 duration-500 ring-1 ring-black/5">

        {/* LEFT PANEL */}
        <div className="md:w-5/12 bg-slate-50/50 relative p-6 sm:p-8 md:p-12 flex flex-col justify-between shrink-0 min-h-min md:h-full border-b md:border-b-0 md:border-r border-slate-100">

          {/* Decorative gradients */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-purple-200/40 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-200/40 rounded-full blur-[80px]" />
          </div>

          <div className="relative z-10 flex flex-col h-auto md:h-full">
            <div className="mb-6 md:mb-10 animate-in slide-in-from-top-4 duration-700">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <div className="w-2 h-2 rounded-full bg-[#7F5AF0] shadow-[0_0_10px_rgba(127,90,240,0.5)] animate-pulse"></div>
                <span className="text-[9px] md:text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">Hospitality Assistant</span>
              </div>
              <h1 className="text-2xl md:text-5xl tracking-tighter leading-none font-black text-slate-800">
                MisePo
              </h1>
            </div>

            <div className="space-y-4 md:space-y-6 mb-6 md:mb-12 flex-1">
              <h2 className="text-lg md:text-3xl leading-tight animate-in slide-in-from-left-4 duration-700 delay-100 font-extrabold text-slate-800">
                {isEditMode ? 'Settings & Profile' : 'AIが提案する、\n次世代の集客。'}
              </h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed animate-in slide-in-from-left-4 duration-700 delay-200">
                {isEditMode
                  ? '設定を変更することで、AIの文章トーンや提案内容がよりお店らしく進化します。'
                  : 'お店のこだわりや特徴を入力してください。AIがあなたの専任の広報担当者工なります。'}
              </p>

              {/* Status Pill */}
              <div className="hidden md:inline-flex items-center gap-2 rounded-full px-4 py-2 animate-in zoom-in-95 duration-700 delay-300 bg-white shadow-md ring-1 ring-slate-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse box-shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">AI Engine Ready</span>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="space-y-3 hidden md:block animate-in slide-in-from-bottom-8 duration-1000 delay-500">
              {[
                { title: '個性学習エンジン', desc: '業種やコンセプトを深く理解し、常に「らしい」表現を維持。', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z', color: 'text-yellow-500', bg: 'bg-yellow-50' },
                { title: 'マルチプラットフォーム', desc: '投稿先ごとの特性を考慮し、一貫性のある発信を自動化。', icon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z', color: 'text-purple-500', bg: 'bg-purple-50' }
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-4 p-5 rounded-[24px] transition-all cursor-default bg-white/60 backdrop-blur-sm border border-white/50 shadow-sm hover:shadow-md hover:bg-white hover:-translate-y-0.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${feat.bg} ${feat.color}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d={feat.icon} /></svg>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-widest">{feat.title}</h3>
                    <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed font-medium">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Modern Form */}
        <div className="flex-1 bg-white overflow-y-auto overscroll-contain animate-in slide-in-from-right-8 duration-700">
          <form onSubmit={handleSubmit} className="p-8 md:p-14 space-y-12">

            {/* Industry Selection */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">カテゴリー</h3>
                {!isEditMode && <span className="bg-slate-100 text-slate-500 text-[8px] font-black px-2 py-1 rounded-full tracking-widest uppercase">Required</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {INDUSTRIES.filter(ind => ind !== '旅館・ホテル').map((ind) => (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => setIndustry(ind)}
                    className={`px-5 py-2.5 rounded-full text-[11px] font-black transition-all duration-200 border border-transparent
                        ${industry === ind
                        ? 'bg-[#7F5AF0] text-white shadow-lg shadow-indigo-200 scale-105'
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Info Inputs */}
            <div className="grid grid-cols-1 gap-10">
              <div className="space-y-3">
                <div className="flex items-center gap-2 pl-1">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-widest">
                    店舗名・ブランド名
                  </label>
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="例：焼きたてパンの店 アン"
                    className="w-full px-6 py-5 rounded-[20px] transition-all text-lg text-slate-800 font-bold tracking-tight placeholder:text-slate-300 outline-none bg-slate-50 focus:bg-white focus:shadow-lg focus:shadow-slate-100/50 focus:ring-2 focus:ring-[#7F5AF0]/10"
                    required
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#7F5AF0] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </div>

                  {/* Google Maps Search Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-[24px] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 ring-1 ring-black/5">
                      <div className="p-3 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-[9px] font-black text-slate-400 px-3 uppercase tracking-[0.2em] flex items-center gap-1">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                          Google Maps
                        </span>
                        <button type="button" onClick={() => setSuggestions([])} className="p-1 rounded-full hover:bg-slate-200 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                      </div>
                      <div className="max-h-[280px] overflow-y-auto p-1">
                        {suggestions.map((s) => (
                          <button
                            key={s.place_id}
                            type="button"
                            onClick={() => {
                              setName(s.structured_formatting.main_text);
                              setGooglePlaceId(s.place_id);
                              setSuggestions([]);
                            }}
                            className="w-full text-left px-5 py-3 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-between group"
                          >
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-bold text-slate-800">{s.structured_formatting.main_text}</span>
                              <span className="text-[10px] text-slate-400 truncate max-w-[280px] font-medium">{s.structured_formatting.secondary_text}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 pl-1">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-widest">
                    活動地域（例：横浜市、目黒区）
                  </label>
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="地名を入れるとより親しみやすい文章になります"
                    className="w-full px-6 py-5 rounded-[20px] transition-all text-lg text-slate-800 font-bold tracking-tight placeholder:text-slate-300 outline-none bg-slate-50 focus:bg-white focus:shadow-lg focus:shadow-slate-100/50 focus:ring-2 focus:ring-[#7F5AF0]/10"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#7F5AF0] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">施設の特徴・こだわり</h3>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="例：創業100年の老舗です。全客室から海が見渡せます。地元の新鮮な魚介類を使った料理が自慢です..."
                rows={5}
                className="w-full px-6 py-5 rounded-[24px] transition-all resize-none text-base text-slate-800 font-medium leading-relaxed placeholder:text-slate-300 outline-none bg-slate-50 focus:bg-white focus:shadow-lg focus:shadow-slate-100/50 focus:ring-2 focus:ring-[#7F5AF0]/10"
              />
            </div>

            {/* Instagram Footer: Info Card */}
            <div className="bg-slate-50/50 rounded-[24px] p-6 space-y-4 border border-slate-100 transition-all hover:bg-white hover:shadow-md group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Instagram 定型文</h4>
                  </div>
                </div>
                <span className="text-[9px] font-black text-slate-400 bg-white border border-slate-200 px-3 py-1 rounded-full uppercase tracking-widest">Option</span>
              </div>
              <textarea
                value={instagramFooter}
                onChange={(e) => setInstagramFooter(e.target.value)}
                placeholder="📍 アクセス情報や営業時間をセット..."
                rows={4}
                className="w-full px-5 py-4 rounded-xl transition-all resize-none text-sm text-slate-700 leading-relaxed placeholder-slate-300 font-medium min-h-[100px] outline-none bg-white border border-slate-200 focus:border-[#E1306C]/50 focus:ring-2 focus:ring-[#E1306C]/10"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-slate-50 md:border-0 md:static z-20 pb-4">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 py-4 rounded-[20px] font-bold text-xs text-slate-500 transition-all uppercase tracking-widest bg-slate-50 hover:bg-slate-100 active:scale-95"
                >
                  キャンセル
                </button>
              )}
              <button
                type="submit"
                disabled={name.trim().length < 2}
                className="flex-[2] relative group rounded-[20px] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-1 active:scale-95 active:translate-y-0 p-[1.5px] overflow-hidden"
              >
                {/* 1. Radiant Aura Container (Clipped Background) */}
                <div className="absolute inset-0 rounded-[20px] overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(45deg, #22D3EE, #FACC15, #F472B6)'
                    }}
                  />
                </div>

                {/* 2. Content Layer */}
                <div className="relative z-10 w-full h-full bg-[#111111] text-white rounded-[19px] py-4 flex items-center justify-center gap-3 shadow-xl">
                  <span className="text-xs font-black tracking-[0.2em]">{isEditMode ? '設定を保存する' : '設定を完了してはじめる'}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </div>
              </button>
            </div>
          </form>
        </div>

        {/* Close Button Overlay */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full transition-all group/close active:scale-90 z-50 bg-white/80 backdrop-blur border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-white shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
