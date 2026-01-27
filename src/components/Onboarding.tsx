import React, { useState, useEffect, useRef } from 'react';
import { StoreProfile } from '../types';
import { INDUSTRIES, UI, IS_HOSPITALITY_MODE, TOKENS } from '../constants';

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

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-0 sm:p-4 z-[100] backdrop-blur-sm animate-in fade-in duration-500">
      <div className={`bg-white rounded-none sm:rounded-[24px] ${IS_HOSPITALITY_MODE ? 'border border-slate-100 shadow-2xl overflow-hidden' : 'border-[3px] border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)]'} w-full max-w-lg md:max-w-6xl md:h-[90vh] h-full sm:max-h-[800px] flex flex-col md:flex-row md:overflow-hidden relative animate-in zoom-in-95 duration-500 mobile-scroll-container`}>

        {/* LEFT PANEL */}
        <div className={`md:w-5/12 ${IS_HOSPITALITY_MODE ? 'bg-[#F9FAFB]' : 'bg-[var(--bg-beige)]'} relative p-6 sm:p-8 md:p-12 flex flex-col justify-between shrink-0 border-b-[3px] md:border-b-0 md:border-r-[3px] ${IS_HOSPITALITY_MODE ? 'border-slate-100' : 'border-black'} min-h-min md:h-full`}>

          <div className="relative z-10 flex flex-col h-auto md:h-full">
            <div className="mb-6 md:mb-10 animate-in slide-in-from-top-4 duration-700">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <div className="w-2 h-2 rounded-full bg-black shadow-sm animate-pulse"></div>
                <span className="text-[9px] md:text-[10px] font-black tracking-[0.3em] text-black uppercase">{IS_HOSPITALITY_MODE ? '宿泊施設専用アシスタント' : '店舗専用アシスタント'}</span>
              </div>
              <h1 className={`text-2xl md:text-4xl tracking-tighter leading-none italic ${IS_HOSPITALITY_MODE ? 'font-serif-hospitality text-[#1A252F]' : 'font-black text-black'}`}>
                {UI.name}
              </h1>
            </div>

            <div className="space-y-4 md:space-y-6 mb-6 md:mb-12 flex-1">
              <h2 className={`text-lg md:text-3xl leading-tight animate-in slide-in-from-left-4 duration-700 delay-100 ${IS_HOSPITALITY_MODE ? 'font-serif-hospitality font-bold text-[#1A252F]' : 'font-black text-black'}`}>
                {isEditMode ? (IS_HOSPITALITY_MODE ? '施設設定の最適化' : '店舗設定の最適化') : 'AIが提案する、\n次世代の集客。'}
              </h2>
              <p className="text-slate-600 text-sm font-bold leading-relaxed animate-in slide-in-from-left-4 duration-700 delay-200">
                {isEditMode
                  ? '設定を変更することで、AIの文章トーンや提案内容がリアルタイムに進化します。'
                  : `${IS_HOSPITALITY_MODE ? '施設' : 'お店'}のこだわりや特徴を入力してください。AIがあなたの専任の広報担当者となります。`}
              </p>

              {/* Status Pill */}
              <div className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 animate-in zoom-in-95 duration-700 delay-300 ${IS_HOSPITALITY_MODE ? 'bg-[#1A252F] shadow-lg shadow-slate-200' : 'bg-black border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${IS_HOSPITALITY_MODE ? 'bg-[#D4AF37]' : 'bg-[var(--teal)]'} animate-ping`}></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white">AI解析エンジンの準備完了</span>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="space-y-3 hidden md:block animate-in slide-in-from-bottom-8 duration-1000 delay-500">
              {[
                { title: '個性学習エンジン', desc: '業種やコンセプトを深く理解し、常に「らしい」表現を維持。', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
                { title: 'マルチプラットフォーム', desc: '投稿先ごとの特性を考慮し、一貫性のある発信を自動化。', icon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' }
              ].map((feat, i) => (
                <div key={i} className={`flex items-start gap-4 p-5 rounded-2xl transition-all cursor-default group/feat ${IS_HOSPITALITY_MODE ? 'bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5' : 'bg-white text-black border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]'}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 group-hover/feat:scale-110 transition-all duration-300 ${IS_HOSPITALITY_MODE ? 'bg-slate-50 text-[#1A252F]' : 'bg-[var(--lavender)] border-2 border-black text-black shadow-sm'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d={feat.icon} /></svg>
                  </div>
                  <div>
                    <h3 className="font-black text-xs text-black uppercase tracking-widest group-hover/feat:text-[var(--rose)] transition-colors">{feat.title}</h3>
                    <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed font-bold">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Modern Form */}
        <div className="flex-1 bg-white md:overflow-y-auto overscroll-contain animate-in slide-in-from-right-8 duration-700">
          <form onSubmit={handleSubmit} className="p-8 md:p-14 space-y-12">

            {/* Industry Selection */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-black uppercase tracking-[0.3em]">{IS_HOSPITALITY_MODE ? '施設カテゴリー' : '業種カテゴリー'}</h3>
                {!isEditMode && <span className="bg-black text-white text-[8px] font-black px-2 py-0.5 rounded-full tracking-widest uppercase">Required</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => setIndustry(ind)}
                    className={`px-6 py-3 rounded-full text-[11px] font-black transition-all duration-200 border-2
                        ? (IS_HOSPITALITY_MODE ? 'bg-gradient-to-br from-indigo-950 to-slate-900 border-transparent text-white shadow-lg' : 'bg-black border-black text-white shadow-[4px_4px_0_0_rgba(0,0,0,1)]')
                        : (IS_HOSPITALITY_MODE ? 'bg-white border-slate-200 text-slate-500 hover:border-slate-400' : 'bg-white border-black text-slate-500 hover:bg-[var(--teal)] hover:text-black hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)]')
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
                <div className="flex items-center gap-2 border-l-4 border-black pl-3">
                  <label className="text-xs font-black text-black uppercase tracking-widest">
                    店舗名・ブランド名
                  </label>
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="例：焼きたてパンの店 アン"
                    className={`w-full px-7 py-6 rounded-2xl transition-all text-xl text-black font-black tracking-tight placeholder:text-slate-300 outline-none ${IS_HOSPITALITY_MODE ? 'bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10' : 'bg-white focus:bg-[var(--bg-beige)] border-2 border-black focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)]'}`}
                    required
                  />
                  <div className="absolute right-7 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </div>

                  {/* Google Maps Search Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white border-2 border-black rounded-xl shadow-[8px_8px_0_0_rgba(0,0,0,1)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="p-4 border-b-2 border-black flex items-center justify-between bg-[var(--bg-beige)]">
                        <span className="text-[10px] font-black text-black px-3 uppercase tracking-[0.2em]">Google Mapsから選択</span>
                        <button type="button" onClick={() => setSuggestions([])} className="p-1.5 hover:bg-white border-2 border-transparent hover:border-black rounded-lg transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-black"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                      </div>
                      <div className="max-h-[320px] overflow-y-auto">
                        {suggestions.map((s) => (
                          <button
                            key={s.place_id}
                            type="button"
                            onClick={() => {
                              setName(s.structured_formatting.main_text);
                              setGooglePlaceId(s.place_id);
                              setSuggestions([]);
                            }}
                            className="w-full text-left px-7 py-5 hover:bg-[var(--teal)] transition-all flex items-center justify-between group border-b-2 border-slate-100 last:border-0 hover:border-black"
                          >
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-black text-black group-hover:text-black transition-colors">{s.structured_formatting.main_text}</span>
                              <span className="text-xs font-bold text-slate-500 truncate max-w-[320px]">{s.structured_formatting.secondary_text}</span>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-white border-2 border-slate-200 group-hover:border-black flex items-center justify-center text-slate-300 group-hover:text-black transition-all">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 border-l-4 border-black pl-3">
                  <label className="text-xs font-black text-black uppercase tracking-widest">
                    活動地域（例：横浜市、目黒区）
                  </label>
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="地名を入れるとより親しみやすい文章になります"
                    className={`w-full px-7 py-6 rounded-2xl transition-all text-xl text-black font-black tracking-tight placeholder:text-slate-300 outline-none ${IS_HOSPITALITY_MODE ? 'bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10' : 'bg-white focus:bg-[var(--bg-beige)] border-2 border-black focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)]'}`}
                  />
                  <div className="absolute right-7 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-black uppercase tracking-[0.3em]">{IS_HOSPITALITY_MODE ? '施設の特徴・こだわり' : 'お店の特徴・こだわり'}</h3>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={IS_HOSPITALITY_MODE ? "例：創業100年の老舗旅館です。全客室から海が見渡せます。地元の新鮮な魚介類を使った創作料理が自慢です..." : "例：薪窯で焼くナポリピッツァの専門店です。イタリア産の小麦粉 and チーズにこだわっています。家族連れでも楽しめるカジュアルな雰囲気です..."}
                className={`w-full rounded-2xl p-5 text-black font-bold placeholder:text-black/10 transition-all min-h-[140px] focus:outline-none ${IS_HOSPITALITY_MODE ? 'bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10' : 'bg-white border-[3px] border-black focus:shadow-[6px_6px_0_0_rgba(0,0,0,1)]'}`}
              />
            </div>

            {/* Instagram Footer: Info Card */}
            <div className={`rounded-[24px] p-8 space-y-5 transition-all group ${IS_HOSPITALITY_MODE ? 'bg-white border border-slate-100 shadow-xl shadow-slate-200/50' : 'bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px]'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E1306C] border-2 border-black flex items-center justify-center text-white shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-black uppercase tracking-widest">Instagram 定型文</h4>
                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">投稿末尾に自動挿入されます</p>
                  </div>
                </div>
                <span className="text-[9px] font-black text-black bg-[var(--gold)] border border-black px-3 py-1.5 rounded-full uppercase tracking-widest">Option</span>
              </div>
              <textarea
                value={instagramFooter}
                onChange={(e) => setInstagramFooter(e.target.value)}
                placeholder="📍 アクセス情報や営業時間をセット..."
                rows={6}
                className="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-200 focus:bg-white focus:border-black outline-none transition-all resize-none text-sm text-slate-700 leading-relaxed placeholder-slate-300 font-bold min-h-[160px]"
              />
            </div>

            {/* Actions */}
            <div className={`flex flex-col sm:flex-row gap-4 pt-4 sticky bottom-0 border-t-[3px] md:border-0 md:static z-20 pb-4 ${IS_HOSPITALITY_MODE ? 'bg-[#F9FAFB] md:bg-transparent border-slate-100' : 'bg-white border-black md:bg-transparent'}`}>
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className={`flex-1 py-5 rounded-xl border-2 font-black text-[11px] text-black transition-all uppercase tracking-widest ${IS_HOSPITALITY_MODE ? 'bg-white border-slate-200 hover:bg-slate-50 shadow-sm' : 'border-black hover:bg-slate-100 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px]'}`}
                >
                  キャンセル
                </button>
              )}
              <button
                type="submit"
                disabled={name.trim().length < 2}
                className={`flex-[2] relative group overflow-hidden font-black py-5 rounded-xl transition-all duration-300 flex items-center justify-center gap-4 disabled:opacity-50 disabled:pointer-events-none ${IS_HOSPITALITY_MODE ? 'bg-gradient-to-br from-indigo-950 to-slate-900 text-white shadow-xl shadow-indigo-900/40 hover:shadow-indigo-900/60 hover:-translate-y-0.5' : 'bg-[var(--gold)] text-black border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-[var(--rose)]'}`}
              >
                <span className="relative z-10 text-xs tracking-[0.2em]">{isEditMode ? '設定を保存する' : '設定を完了してはじめる'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </button>
            </div>
          </form>
        </div>

        {/* Close Button Overlay */}
        {onCancel && (
          <button
            onClick={onCancel}
            className={`absolute top-4 right-4 md:top-8 md:right-8 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl transition-all group/close active:translate-x-[2px] active:translate-y-[2px] z-50 ${IS_HOSPITALITY_MODE ? 'bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 text-[#1A252F] hover:bg-slate-50' : 'bg-white text-black hover:bg-[var(--rose)] border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)]'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
