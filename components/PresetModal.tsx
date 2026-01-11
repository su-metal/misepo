
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Preset, Tone, Length, Platform, GoogleMapPurpose, PostPurpose } from '../types';
import { TONES, LENGTHS, LANGUAGES, POST_PURPOSES } from '../constants';
import { 
    CloseIcon, BookmarkIcon, SaveIcon, TrashIcon, MagicWandIcon, 
    InstagramIcon, MegaphoneIcon, BookOpenIcon, 
    LightbulbIcon, ChatHeartIcon, SparklesIcon
} from './Icons';

interface PresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  presets: Preset[];
  onSave: (preset: Preset) => void;
  onDelete: (id: string) => void;
  onApply: (preset: Preset) => void;
  currentConfig: {
    tone: Tone;
    length: Length;
    inputText: string;
    language: string;
    storeSupplement: string;
    customPrompt: string;
    includeSymbols: boolean;
    includeEmojis: boolean;
    xConstraint140: boolean;
    targetPlatform?: Platform;
    gmapPurpose?: GoogleMapPurpose;
    postPurpose?: PostPurpose;
    starRating?: number | null;
  };
  initialPresetName?: string;
  initialTemplateText?: string;
}

const PresetModal: React.FC<PresetModalProps> = ({ 
  isOpen, 
  onClose, 
  presets, 
  onSave, 
  onDelete, 
  onApply,
  currentConfig,
  initialPresetName,
  initialTemplateText
}) => {
  // Form State
  const [name, setName] = useState('');
  
  // General Config
  const [tone, setTone] = useState<Tone>(Tone.Standard);
  const [length, setLength] = useState<Length>(Length.Medium);
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState('Japanese');
  const [storeSupplement, setStoreSupplement] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [xConstraint140, setXConstraint140] = useState(true);
  
  // Purpose Config
  const [postPurpose, setPostPurpose] = useState<PostPurpose>(PostPurpose.Promotion);

  // Initialize form with current config when opening
  useEffect(() => {
    if (isOpen) {
      setTone(currentConfig.tone);
      setLength(currentConfig.length);

      // Prefer initialTemplateText if provided (from active preset context)
      if (initialTemplateText !== undefined) {
          setInputText(initialTemplateText);
      } else {
          setInputText(currentConfig.inputText);
      }

      setLanguage(currentConfig.language);
      setStoreSupplement(currentConfig.storeSupplement);
      setCustomPrompt(currentConfig.customPrompt);
      setIncludeSymbols(currentConfig.includeSymbols);
      setIncludeEmojis(currentConfig.includeEmojis);
      setXConstraint140(currentConfig.xConstraint140);
      
      // Initialize with Social settings (Ignore Google Maps settings if present)
      if (currentConfig.postPurpose) {
          setPostPurpose(currentConfig.postPurpose);
      }
      
      setName(initialPresetName || '');
    }
  }, [isOpen, currentConfig, initialPresetName, initialTemplateText]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleToneSelect = (newTone: Tone) => {
    setTone(newTone);
    if (newTone === Tone.Formal) {
      setIncludeEmojis(false);
      setIncludeSymbols(false);
    } else {
      setIncludeEmojis(true);
      setIncludeSymbols(false);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('プリセット名を入力してください');
      return;
    }
    const newPreset: Preset = {
      id: Date.now().toString(),
      name: name.trim(),
      config: {
        tone,
        length,
        inputText,
        language,
        storeSupplement,
        customPrompt,
        includeSymbols,
        includeEmojis,
        xConstraint140,
        targetPlatform: Platform.Instagram, // Default to Instagram/Social
        postPurpose: postPurpose,
        // Explicitly undefined for map-specific fields
        gmapPurpose: undefined,
        starRating: undefined
      }
    };
    onSave(newPreset);
    setName(''); // Clear name after save
  };

  const handleLoadPreset = (preset: Preset) => {
    setName(preset.name);
    
    // Only load social purpose
    if (preset.config.postPurpose) {
        setPostPurpose(preset.config.postPurpose);
    }

    setTone(preset.config.tone);
    setLength(preset.config.length);
    setInputText(preset.config.inputText || '');
    setLanguage(preset.config.language);
    setStoreSupplement(preset.config.storeSupplement);
    setCustomPrompt(preset.config.customPrompt);
    setIncludeSymbols(preset.config.includeSymbols ?? false);
    setIncludeEmojis(preset.config.includeEmojis ?? true);
    setXConstraint140(preset.config.xConstraint140 ?? true);
  };

  const handleApplyCurrent = () => {
    const tempPreset: Preset = {
      id: 'temp',
      name: 'Temp',
      config: {
        tone,
        length,
        inputText,
        language,
        storeSupplement,
        customPrompt,
        includeSymbols,
        includeEmojis,
        xConstraint140,
        targetPlatform: Platform.Instagram,
        postPurpose,
        gmapPurpose: undefined,
        starRating: undefined
      }
    };
    onApply(tempPreset);
    onClose();
  };

  const getPurposeIcon = (value: string) => {
    switch (value) {
      case PostPurpose.Promotion: return <MegaphoneIcon />;
      case PostPurpose.Story: return <BookOpenIcon />;
      case PostPurpose.Educational: return <LightbulbIcon />;
      case PostPurpose.Engagement: return <ChatHeartIcon />;
      default: return <SparklesIcon />;
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        
        {/* LEFT COLUMN: Presets List */}
        <div className="md:w-1/3 bg-slate-50 border-r border-gray-100 flex flex-col shrink-0 h-[200px] md:h-auto">
          <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <BookmarkIcon className="w-4 h-4 text-amber-500" />
              保存済みプリセット
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {presets.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-xs">
                保存されたプリセットは<br/>ありません
              </div>
            ) : (
              presets.map(preset => {
                return (
                  <div key={preset.id} className="group relative flex items-center">
                     <button
                      onClick={() => handleLoadPreset(preset)}
                      className="flex-1 text-left p-3 rounded-xl bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all group-hover:bg-indigo-50/30"
                     >
                       <div className="flex items-center gap-2 mb-1">
                          <span className="p-1 rounded flex items-center justify-center bg-pink-100 text-pink-600">
                             <InstagramIcon className="w-3 h-3" />
                          </span>
                          <div className="font-bold text-sm text-slate-700 truncate">{preset.name}</div>
                       </div>
                       <div className="text-[10px] text-gray-400 pl-7 truncate">
                          {`${TONES.find(t => t.value === preset.config.tone)?.label} / ${preset.config.language}`}
                       </div>
                     </button>
                     <button
                      onClick={(e) => { e.stopPropagation(); onDelete(preset.id); }}
                      className="absolute right-2 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                     >
                       <TrashIcon />
                     </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Configuration Form */}
        <div className="flex-1 flex flex-col bg-white min-h-0 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <SaveIcon className="w-4 h-4" />
                </div>
                <h2 className="font-bold text-lg text-slate-800">プリセット設定</h2>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
               <CloseIcon className="w-5 h-5" />
             </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
             {/* Preset Name Input */}
             <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">プリセット名 (Save Name)</label>
                <input 
                   type="text" 
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   placeholder="例: ランチ投稿（親しみ）"
                   className="w-full px-5 py-4 md:px-4 md:py-3 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-base md:text-sm font-bold text-slate-700 placeholder-gray-300 transition-all shadow-sm"
                 />
             </div>

             {/* --- SOCIAL MEDIA SETTINGS --- */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                {/* Purpose Selection */}
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-2">投稿の目的 (Purpose)</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                       {POST_PURPOSES.map(p => (
                          <button
                            key={p.value}
                            onClick={() => setPostPurpose(p.value)}
                            className={`py-3 px-2 rounded-lg text-xs md:text-xs font-bold border text-center flex flex-col items-center gap-1 transition-all ${
                               postPurpose === p.value
                               ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                               : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300'
                            }`}
                          >
                             <span className="scale-90">{getPurposeIcon(p.value)}</span>
                             {p.label}
                          </button>
                       ))}
                    </div>
                </div>

                {/* Tone & Length */}
                <div className="space-y-4">
                   <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2">トーン (Tone)</label>
                      <div className="flex bg-gray-50 p-1 rounded-xl">
                        {TONES.map(t => (
                          <button
                            key={t.value}
                            onClick={() => handleToneSelect(t.value as Tone)}
                            className={`flex-1 py-3 md:py-1.5 text-xs font-bold rounded-lg transition-all ${
                              tone === t.value ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2">長さ (Length)</label>
                      <div className="flex bg-gray-50 p-1 rounded-xl">
                        {LENGTHS.map(l => (
                          <button
                            key={l.value}
                            onClick={() => setLength(l.value as Length)}
                            className={`flex-1 py-3 md:py-1.5 text-xs font-bold rounded-lg transition-all ${
                              length === l.value ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                            }`}
                          >
                            {l.label}
                          </button>
                        ))}
                      </div>
                   </div>
                </div>

                {/* Pro Settings (Language) - Pattern Count Removed */}
                <div className="space-y-4 p-4 bg-amber-50/50 rounded-xl border border-amber-100/50">
                    <div>
                        <label className="block text-xs font-bold text-amber-800/70 mb-1.5">出力言語</label>
                        <select 
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full p-2 bg-white border border-amber-100 rounded-lg text-xs font-bold text-amber-900 focus:ring-2 focus:ring-amber-400 outline-none"
                        >
                          {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                        </select>
                    </div>
                </div>
             </div>

             {/* Toggles */}
             <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <button
                  onClick={() => { setIncludeEmojis(!includeEmojis); if(!includeEmojis) setIncludeSymbols(false); }}
                  className={`px-3 py-3 md:py-2 rounded-lg text-xs font-bold border transition-all flex items-center gap-2 ${
                    includeEmojis ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-gray-50 border-gray-100 text-gray-400'
                  }`}
                >
                  <span className={`w-4 h-4 rounded border flex items-center justify-center ${includeEmojis ? 'bg-indigo-500 border-indigo-500' : 'bg-white border-gray-300'}`}>
                    {includeEmojis && <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"/></svg>}
                  </span>
                  絵文字を使用 (✨)
                </button>
                <button
                  onClick={() => { setIncludeSymbols(!includeSymbols); if(!includeSymbols) setIncludeEmojis(false); }}
                  className={`px-3 py-3 md:py-2 rounded-lg text-xs font-bold border transition-all flex items-center gap-2 ${
                    includeSymbols ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-gray-50 border-gray-100 text-gray-400'
                  }`}
                >
                  <span className={`w-4 h-4 rounded border flex items-center justify-center ${includeSymbols ? 'bg-indigo-500 border-indigo-500' : 'bg-white border-gray-300'}`}>
                    {includeSymbols && <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"/></svg>}
                  </span>
                  装飾記号モード (✦)
                </button>
                <button
                  onClick={() => setXConstraint140(!xConstraint140)}
                  className={`px-3 py-3 md:py-2 rounded-lg text-xs font-bold border transition-all flex items-center gap-2 ${
                    xConstraint140 ? 'bg-black text-white border-black' : 'bg-gray-50 border-gray-100 text-gray-400'
                  }`}
                >
                  <span className={`w-4 h-4 rounded border flex items-center justify-center ${xConstraint140 ? 'bg-white border-white' : 'bg-white border-gray-300'}`}>
                    {xConstraint140 && <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </span>
                  X 140文字制限
                </button>
             </div>

             {/* Common Text Inputs */}
             <div className="space-y-4">
                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-2">テンプレート文章 (Input Template)</label>
                   <textarea
                     value={inputText}
                     onChange={(e) => setInputText(e.target.value)}
                     placeholder="投稿の雛形として保存したい文章があれば入力..."
                     rows={3}
                     className="w-full px-5 py-4 md:px-4 md:py-3 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none text-base md:text-sm text-slate-700 resize-none transition-all"
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-bold text-amber-700 mb-2">カスタムプロンプト (Prompt)</label>
                     <input
                       type="text"
                       value={customPrompt}
                       onChange={(e) => setCustomPrompt(e.target.value)}
                       placeholder="AIへの追加指示..."
                       className="w-full px-3 py-3 md:py-2 bg-amber-50/50 border border-amber-100 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-300 outline-none text-base md:text-xs text-slate-700"
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-amber-700 mb-2">店舗補足 (Supplement)</label>
                     <input
                       type="text"
                       value={storeSupplement}
                       onChange={(e) => setStoreSupplement(e.target.value)}
                       placeholder="内部事情メモ..."
                       className="w-full px-3 py-3 md:py-2 bg-amber-50/50 border border-amber-100 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-300 outline-none text-base md:text-xs text-slate-700"
                     />
                   </div>
                </div>
             </div>
             
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
             {/* Save Button */}
             <button 
               onClick={handleSave}
               disabled={!name.trim()}
               className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 md:py-3 rounded-xl font-bold text-base md:text-sm flex items-center justify-center gap-2 transition-colors shadow-sm whitespace-nowrap"
             >
               <SaveIcon className="w-4 h-4" />
               プリセットを保存
             </button>

             {/* Apply Button */}
             <button
               onClick={handleApplyCurrent}
               className="w-full md:w-auto bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 md:py-3 px-8 rounded-xl shadow-lg hover:shadow-indigo-200 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 whitespace-nowrap text-lg md:text-base"
             >
               <MagicWandIcon className="w-4 h-4" />
               この設定を適用する
             </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PresetModal;
