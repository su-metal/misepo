
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { StoreProfile } from '../types';
import { INDUSTRIES, TARGET_AUDIENCES } from '../constants';
import { AutoResizingTextarea } from './features/generator/AutoResizingTextarea';

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
  // Helper to detect industry from Google Maps types
  const detectIndustryFromTypes = (types: string[]): string => {
    if (!types || types.length === 0) return INDUSTRIES[INDUSTRIES.length - 1]; // その他

    const typeSet = new Set(types);

    // mapping logic
    if (typeSet.has('cafe')) return 'カフェ';
    if (typeSet.has('bar') || typeSet.has('night_club')) return '居酒屋';
    if (typeSet.has('restaurant') || typeSet.has('food')) return '飲食店';
    if (typeSet.has('hair_care') || typeSet.has('beauty_salon')) return '美容室';
    if (typeSet.has('nail_salon')) return 'ネイル・まつげ';
    if (typeSet.has('spa')) return 'エステ・サロン';
    if (typeSet.has('lodging')) return '旅館・ホテル';
    if (typeSet.has('physiotherapist')) return '整体・接骨院';
    if (typeSet.has('gym') || typeSet.has('health')) return 'ジム';
    if (typeSet.has('store') || typeSet.has('establishment')) return '小売';

    return INDUSTRIES[INDUSTRIES.length - 1]; // その他
  };

  const [industry, setIndustry] = useState<string>(INDUSTRIES[0]);
  const [targetAudiences, setTargetAudiences] = useState<string[]>([]);
  const [name, setName] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [instagramFooter, setInstagramFooter] = useState<string>('');
  const [googlePlaceId, setGooglePlaceId] = useState<string>('');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [tailoredTopics, setTailoredTopics] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const autocompleteService = useRef<any>(null);
  const placesService = useRef<any>(null);

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
      setAiAnalysis(initialProfile.aiAnalysis || '');
      setTailoredTopics(initialProfile.tailoredTopics || []);
      if (initialProfile.targetAudience) {
        setTargetAudiences(initialProfile.targetAudience.split(',').map(s => s.trim()));
      }
      setShowDetails(true);
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
      googlePlaceId: googlePlaceId,
      aiAnalysis: aiAnalysis,
      tailoredTopics: tailoredTopics,
      targetAudience: targetAudiences.join(', ')
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

  const handlePlaceSelect = async (place: any) => {
    setName(place.structured_formatting.main_text);
    setGooglePlaceId(place.place_id);
    setSuggestions([]);

    if (typeof window !== 'undefined' && window.google) {
      if (!placesService.current) {
        // Dummy element for PlacesService
        const dummy = document.createElement('div');
        placesService.current = new window.google.maps.places.PlacesService(dummy);
      }

      setIsAnalyzing(true);
      placesService.current.getDetails(
        {
          placeId: place.place_id,
          fields: [
            'address_components',
            'formatted_address',
            'formatted_phone_number',
            'opening_hours',
            'website',
            'editorial_summary',
            'reviews',
            'types'
          ]
        },
        async (details: any, status: any) => {
          if (status === 'OK' && details) {
            // 0. Auto-detect industry
            let currentDetected = industry;
            if (details.types) {
              currentDetected = detectIndustryFromTypes(details.types);
              setIndustry(currentDetected);
            }

            // 1. Auto-fill Instagram Footer
            const address = details.address_components
              ?.filter((c: any) => c.types.includes('locality') || c.types.includes('sublocality') || c.types.includes('street_number'))
              .map((c: any) => c.long_name)
              .reverse()
              .join(' ');

            const phone = details.formatted_phone_number || '';
            const hours = details.opening_hours?.weekday_text?.[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]?.split(': ')[1] || '';
            const website = details.website || '';

            // 2. Auto-fill Region (locality)
            const locality = details.address_components?.find((c: any) => c.types.includes('locality'))?.long_name || '';
            if (locality) setRegion(locality);

            let footer = '';
            if (address) footer += `📍 ${address}\n`;
            if (phone) footer += `📞 ${phone}\n`;
            if (hours) footer += `🕒 ${hours}\n`;
            if (website) footer += `🔗 ${website}`;

            setInstagramFooter(footer.trim());

            // 1.5. Auto-fill Description (Facility Specialties)
            if (details.editorial_summary?.overview) {
              setDescription(details.editorial_summary.overview);
            } else {
              // Fallback: Combine types and address for a basic description
              const types = details.types
                ?.slice(0, 3)
                .map((t: string) => t.replace(/_/g, ' '))
                .join(', ');
              const fallbackDesc = `${details.formatted_address || ''}${types ? ` (${types})` : ''}`;
              if (fallbackDesc.trim()) {
                setDescription(fallbackDesc.trim());
              }
            }

            // 2. Trigger AI Analysis
            try {
              const res = await fetch('/api/me/analyze-store', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  industry: currentDetected,
                  placeData: {
                    name: place.structured_formatting.main_text,
                    editorial_summary: details.editorial_summary?.overview,
                    reviews: details.reviews?.slice(0, 5).map((r: any) => ({ text: r.text })),
                    types: details.types
                  }
                })
              });
              const data = await res.json();
              if (data.ok) {
                setAiAnalysis(data.aiAnalysis);
                if (data.description) {
                  setDescription(data.description);
                }
                if (data.tailoredTopics) {
                  setTailoredTopics(data.tailoredTopics);
                }
              }
            } catch (err) {
              console.error("AI analysis trigger failed:", err);
            }
          }
          setIsAnalyzing(false);
        }
      );
    }
  };

  const isEditMode = !!initialProfile;

  // Portal target - Standard global portal
  const portalTarget = typeof document !== 'undefined' ? document.body : null;

  if (!portalTarget) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-8 animate-in fade-in duration-500 pointer-events-auto">
      {/* VisionOS Style Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onCancel} />

      <div className="bg-white w-full h-full md:max-w-7xl md:max-h-[90vh] md:rounded-[3rem] shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-500 relative overflow-hidden border border-stone-100">

        {/* LEFT PANEL: Rich Info (Always visible on desktop, compact on mobile) */}
        <div className="w-full md:w-[42%] lg:w-[480px] shrink-0 bg-slate-50 relative p-8 md:p-14 flex flex-col">

          {/* Decorative gradients */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-purple-200/40 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-200/40 rounded-full blur-[80px]" />
          </div>

          <div className="relative z-10 flex flex-col h-auto md:h-full">
            <div className="mb-6 md:mb-10 animate-in slide-in-from-top-4 duration-700">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <div className="w-2 h-2 rounded-full bg-[#eb714f] shadow-[0_0_10px_rgba(127,90,240,0.5)] animate-pulse"></div>
                <span className="text-[9px] md:text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">Hospitality Assistant</span>
              </div>
              <h1 className="text-3xl md:text-5xl tracking-tighter leading-none font-black text-slate-800">
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
              <div className="md:inline-flex items-center gap-2 rounded-full px-4 py-2 animate-in zoom-in-95 duration-700 delay-300 bg-white shadow-md ring-1 ring-slate-100 hidden">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse box-shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">AI Engine Ready</span>
              </div>
            </div>

            {/* Feature Cards & Characters */}
            <div className="space-y-6 hidden md:block animate-in slide-in-from-bottom-8 duration-1000 delay-500">
              {/* Generated Characters Display */}
              <div className="flex items-center justify-center -space-x-4 pb-4">
                {[1, 2, 3, 4].map((num, i) => (
                  <div
                    key={num}
                    className="relative w-16 h-16 rounded-full border-4 border-slate-50 overflow-hidden shadow-lg transform transition-transform hover:scale-110 hover:-translate-y-2 z-0 hover:z-10 bg-white"
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <img
                      src={`/assets/avatar_0${num}.png`}
                      alt={`Assistant ${num}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div className="pl-6 text-xs font-bold text-slate-400">
                  <span className="block text-[#7F5AF0]">many</span>
                  Owners
                </div>
              </div>

              <div className="space-y-3">
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
        </div>

        {/* RIGHT PANEL: Modern Form */}
        <div className="flex-1 bg-white overflow-y-auto overscroll-contain animate-in slide-in-from-right-8 duration-700">
          <form onSubmit={handleSubmit} className="p-8 md:p-14 space-y-12">

            {/* Basic Info Inputs */}
            <div className="grid grid-cols-1 gap-10">
              <div className="space-y-3">
                <div className="flex items-center gap-2 pl-1">
                  <label className="text-xs font-black text-slate-700 uppercase tracking_widest">
                    店舗名・ブランド名
                  </label>
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    onBlur={() => { if (name.trim().length > 1) setShowDetails(true); }}
                    placeholder="例：焼きたてパンの店 アン"
                    className="w-full px-6 py-5 rounded-[20px] transition-all text-lg text-slate-800 font-bold tracking-tight placeholder:text-slate-300 outline-none bg-slate-50 border border-slate-200 focus:bg-white focus:shadow-lg focus:shadow-slate-100/50 focus:ring-2 focus:ring-[#7F5AF0]/10"
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
                            onClick={() => handlePlaceSelect(s)}
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

              {/* Step-by-step content */}
              {showDetails && (
                <div className="space-y-12 animate-in slide-in-from-top-4 duration-500">
                  {/* Category Selection */}
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
                              ? 'bg-[#1f29fc] text-white shadow-lg shadow-stone-200 scale-105'
                              : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                            }`}
                        >
                          {ind}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Target Audience Selection */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">主な客層（複数選択可）</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {TARGET_AUDIENCES.map((target) => {
                        const isSelected = targetAudiences.includes(target);
                        return (
                          <button
                            key={target}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setTargetAudiences(prev => prev.filter(t => t !== target));
                              } else {
                                setTargetAudiences(prev => [...prev, target]);
                              }
                            }}
                            className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all duration-200 border
                                ${isSelected
                                ? 'bg-[#122646] text-[#f2e018] border-[#122646] shadow-md scale-105'
                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                              }`}
                          >
                            {isSelected && <span className="mr-1">✓</span>}
                            {target}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pl-1">
                      <label className="text-xs font-black text-slate-700 uppercase tracking_widest">
                        活動地域（例：横浜市、目黒区）
                      </label>
                    </div>
                    <div className="relative group">
                      <input
                        type="text"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        placeholder="地名を入れるとより親しみやすい文章になります"
                        className="w-full px-6 py-5 rounded-[20px] transition-all text-lg text-slate-800 font-bold tracking-tight placeholder:text-slate-300 outline-none bg-slate-50 border border-slate-200 focus:bg-white focus:shadow-lg focus:shadow-slate-100/50 focus:ring-2 focus:ring-[#7F5AF0]/10"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#7F5AF0] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">施設の特徴・こだわり</h3>
                      {isAnalyzing && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded-full animate-in fade-in zoom-in duration-300">
                          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                          <span className="text-[8px] font-black text-blue-500 uppercase tracking_widest">AI Generating...</span>
                        </div>
                      )}
                    </div>
                    <AutoResizingTextarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="例：創業100年の老舗です。全客室から海が見渡せます。地元の新鮮な魚介類を使った料理が自慢です..."
                      className="w-full px-6 py-5 rounded-[24px] transition-all resize-none text-base text-slate-800 font-medium leading-relaxed placeholder:text-slate-300 outline-none bg-slate-50 border border-slate-200 focus:bg-white focus:shadow-lg focus:shadow-slate-100/50 focus:ring-2 focus:ring-[#7F5AF0]/10 min-h-[120px]"
                    />
                  </div>

                  {/* Instagram Footer: Info Card */}
                  <div className="bg-slate-50/50 rounded-[24px] p-4 md:p-6 space-y-4 border border-slate-100 transition-all hover:bg-white hover:shadow-md group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y2="6.5" y1="6.5" /></svg>
                        </div>
                        <div className="flex flex-col">
                          <h4 className="text-[10px] font-black text-slate-700 uppercase tracking_widest">Instagram 定型文</h4>
                          {aiAnalysis && (
                            <span className="text-[8px] font-bold text-emerald-500 flex items-center gap-1">
                              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                              AIによる店舗背景の解析が完了しました
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isAnalyzing && (
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                            <span className="text-[8px] font-black text-blue-500 uppercase tracking_widest">AI Analyzing...</span>
                          </div>
                        )}
                        <span className="text-[9px] font-black text-slate-400 bg-white border border-slate-200 px-3 py-1 rounded-full uppercase tracking_widest">Option</span>
                      </div>
                    </div>
                    <AutoResizingTextarea
                      value={instagramFooter}
                      onChange={(e) => setInstagramFooter(e.target.value)}
                      placeholder="📍 アクセス情報や営業時間をセット..."
                      className="w-full px-4 md:px-5 py-4 rounded-xl transition-all resize-none text-sm text-slate-700 leading-relaxed placeholder_slate-300 font-medium min-h-[100px] outline-none bg-white border border-slate-200 focus:border-[#E1306C]/50 focus:ring-2 focus:ring-[#E1306C]/10"
                    />
                  </div>
                </div>
              )}
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
                <div className="relative z-10 w-full h-full bg-[#122646] text-white rounded-[19px] py-4 flex items-center justify-center gap-3 shadow-xl">
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
    </div>,
    portalTarget
  );
};

export default Onboarding;
