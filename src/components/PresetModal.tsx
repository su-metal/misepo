import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  CloseIcon,
  MagicWandIcon,
  SparklesIcon,
  SaveIcon,
  TrashIcon,
  MenuIcon,
  InstagramIcon,
  BookmarkIcon,
  ChevronDownIcon,
  CoffeeIcon,
  TieIcon,
  SneakersIcon,
  LaptopIcon,
  CookingIcon,
  BuildingIcon,
  LeafIcon,
  GemIcon,
} from './Icons';
import { Platform, UserPreset } from '../types';
import AutoResizingTextarea from './AutoResizingTextarea';

interface PresetModalProps {
  presets: UserPreset[];
  onSave: (preset: Partial<UserPreset>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onApply: (preset: UserPreset) => void;
  onClose: () => void;
  initialPresetId?: string;
  isSaving?: boolean;
}

const AVATAR_OPTIONS = [
  { id: 'shop', icon: BookmarkIcon, label: '店舗' },
  { id: 'chef', icon: MagicWandIcon, label: '店主' },
  { id: 'star', icon: SparklesIcon, label: 'スター' },
  { id: 'mail', icon: InstagramIcon, label: '公式' },
  { id: 'business', icon: TieIcon, label: 'ビジネス' },
  { id: 'casual', icon: SneakersIcon, label: 'カジュアル' },
  { id: 'tech', icon: LaptopIcon, label: 'テック' },
  { id: 'food', icon: CookingIcon, label: '飲食' },
  { id: 'cafe', icon: CoffeeIcon, label: 'カフェ' },
  { id: 'office', icon: BuildingIcon, label: 'オフィス' },
  { id: 'nature', icon: LeafIcon, label: '自然' },
  { id: 'premium', icon: GemIcon, label: 'プレミアム' },
];

const SortablePresetRow = ({
  preset,
  deletingId,
  isReordering,
  onSelect,
  onDelete,
  isSelected,
}: {
  preset: UserPreset;
  deletingId: string | null;
  isReordering: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: preset.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 border-2
        ${isSelected
          ? 'bg-indigo-50/80 border-indigo-200 shadow-lg shadow-indigo-100/50 scale-[1.02]'
          : 'bg-white border-slate-100 hover:border-indigo-100 hover:bg-slate-50/50'
        }
        ${isDragging ? 'opacity-50' : ''}
      `}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 text-slate-300 hover:text-slate-500 transition-colors"
      >
        <MenuIcon className="w-5 h-5" />
      </div>
      <button
        onClick={() => onSelect(preset.id)}
        className="flex-1 text-left min-w-0"
      >
        <div className="font-black text-sm text-slate-800 truncate mb-0.5">{preset.name}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
          {preset.platform === Platform.Instagram && 'Instagram Style'}
          {preset.platform === Platform.X && 'X (Twitter) Style'}
          {preset.platform === Platform.GoogleMaps && 'Map Reply Style'}
          {!preset.platform && 'Generic Style'}
        </div>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(preset.id);
        }}
        disabled={deletingId === preset.id}
        className="p-2.5 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
      >
        {deletingId === preset.id ? (
          <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <TrashIcon className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};

const PresetModal: React.FC<PresetModalProps> = ({
  presets,
  onSave,
  onDelete,
  onApply,
  onClose,
  initialPresetId,
  isSaving: isExternalSaving,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(initialPresetId || null);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('shop');
  const [customPrompt, setCustomPrompt] = useState('');
  const [postSamples, setPostSamples] = useState<Record<string, string>>({});
  const [isInternalSaving, setIsInternalSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [orderedPresets, setOrderedPresets] = useState<UserPreset[]>([]);
  const [isReordering, setIsReordering] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'edit'>('list');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [expandingPlatform, setExpandingPlatform] = useState<Platform | null>(null);
  const [isSanitizing, setIsSanitizing] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);

  const isSaving = isExternalSaving || isInternalSaving;

  useEffect(() => {
    setOrderedPresets(presets);
  }, [presets]);

  useEffect(() => {
    if (initialPresetId) {
      handleLoadPreset(initialPresetId);
      setMobileView('edit');
    }
  }, [initialPresetId]);

  const handleLoadPreset = (id: string) => {
    const preset = presets.find((p) => p.id === id);
    if (preset) {
      setSelectedPresetId(id);
      setName(preset.name);
      setAvatar(preset.avatar || 'shop');
      setCustomPrompt(preset.custom_prompt || '');
      setPostSamples(preset.post_samples || {});
      setMobileView('edit');
    }
  };

  const handleStartNew = () => {
    setSelectedPresetId(null);
    setName('');
    setAvatar('shop');
    setCustomPrompt('');
    setPostSamples({});
    setMobileView('edit');
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsInternalSaving(true);
    try {
      await onSave({
        id: selectedPresetId || undefined,
        name,
        avatar,
        custom_prompt: customPrompt,
        post_samples: postSamples,
      });
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (err) {
      console.error('Failed to save preset:', err);
    } finally {
      setIsInternalSaving(false);
    }
  };

  const handleDeletePreset = async (id: string) => {
    if (!window.confirm('このプロファイルを削除してもよろしいですか？')) return;
    setDeletingId(id);
    try {
      await onDelete(id);
      if (selectedPresetId === id) {
        handleStartNew();
        setMobileView('list');
      }
    } catch (err) {
      console.error('Failed to delete preset:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleApplyCurrent = () => {
    if (selectedPresetId) {
      const preset = presets.find(p => p.id === selectedPresetId);
      if (preset) {
        onApply(preset);
        onClose();
      }
    }
  };

  // Drag and Drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedPresets.findIndex((p) => p.id === active.id);
    const newIndex = orderedPresets.findIndex((p) => p.id === over.id);

    const newOrder = arrayMove(orderedPresets, oldIndex, newIndex);
    setOrderedPresets(newOrder);

    // Save order to backend
    setIsReordering(true);
    setOrderError(null);
    try {
      const res = await fetch('/api/me/presets/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder.map((p) => p.id) }),
      });
      if (!res.ok) throw new Error('Failed to save order');
    } catch (err) {
      console.error('Failed to reorder:', err);
      setOrderError('並び替えの保存に失敗しました');
      setOrderedPresets(presets); // Revert
    } finally {
      setIsReordering(false);
    }
  };

  const renderAvatar = (id: string, className = "w-6 h-6") => {
    const opt = AVATAR_OPTIONS.find(o => o.id === id) || AVATAR_OPTIONS[0];
    const Icon = opt.icon;
    return <Icon className={className} />;
  };

  const enforceSaveNameWidth = (n: string) => {
    return n.length > 20 ? n.slice(0, 20) : n;
  };

  const handleNameChange = async (val: string) => {
    const limited = enforceSaveNameWidth(val);
    setName(limited);
    if (!limited.trim()) {
      setSuggestions([]);
      return;
    }

    // Google Places Search Suggestions
    if (window.google && window.google.maps && window.google.maps.places) {
      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        { input: limited, types: ['establishment'] },
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

  const isSaveDisabled = isSaving || !name.trim();

  // Handle mobile view transitions
  const editVisibilityClass = mobileView === 'edit' ? 'flex' : 'hidden md:flex';
  const listVisibilityClass = mobileView === 'list' ? 'flex' : 'hidden md:flex';

  const goToListView = () => setMobileView('list');

  const modalBody = (
    <div className="flex h-full bg-white relative">
      {/* SIDEBAR: Profile List */}
      <div
        className={`w-full md:w-[420px] shrink-0 border-r border-slate-100 flex flex-col bg-white overflow-hidden ${listVisibilityClass}`}
      >
        <div className="p-8 border-b border-slate-50 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-black text-xl text-slate-800 tracking-tight">AIプロファイル</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Management</p>
          </div>
          <button
            onClick={handleStartNew}
            className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all active:scale-95 group"
          >
            <MagicWandIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col p-6 space-y-6">
          <div className="mb-6 bg-indigo-50/50 border border-indigo-100/50 rounded-2xl p-4">
            <p className="text-[11px] text-indigo-900/80 font-bold leading-relaxed flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-sm shadow-indigo-200"></span>
              上位3件が入力画面に表示されます
            </p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pb-6 px-1">
            {orderedPresets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 opacity-60">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-2">
                  <BookmarkIcon className="w-8 h-8" />
                </div>
                <div className="text-xs font-bold text-slate-400">
                  プリセットがありません
                </div>
                <button onClick={handleStartNew} className="text-xs font-black text-indigo-500 hover:underline">
                  新しく作成する
                </button>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={orderedPresets.map((preset) => preset.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {orderedPresets.map((preset) => (
                      <SortablePresetRow
                        key={preset.id}
                        preset={preset}
                        deletingId={deletingId}
                        isReordering={isReordering}
                        onSelect={handleLoadPreset}
                        onDelete={handleDeletePreset}
                        isSelected={selectedPresetId === preset.id}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
            {orderedPresets.length >= 10 && (
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4">
                <p className="text-[10px] text-rose-500 font-bold leading-tight">
                  保存上限(10件)に達しています。既存の設定を編集してください。
                </p>
              </div>
            )}
          </div>
          {orderError && (
            <p className="mt-4 text-[10px] text-rose-500 font-bold animate-pulse">{orderError}</p>
          )}
        </div>
      </div>

      {/* MAIN CONTENT: Premium Form */}
      <div
        className={`flex-1 flex flex-col bg-slate-50/30 min-h-0 overflow-hidden h-full ${editVisibilityClass}`}
      >
        <div className="p-6 md:p-10 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/60 backdrop-blur-md">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-[20px] flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-200">
              <MagicWandIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-lg md:text-2xl text-slate-800 tracking-tighter">プロファイルの編集</h2>
              <p className="text-[9px] md:text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] opacity-80">Profile Editor</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {mobileView === 'edit' && (
              <button
                type="button"
                onClick={goToListView}
                className="md:hidden flex items-center gap-2 px-5 py-2.5 text-xs font-black text-slate-500 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:text-indigo-600 transition-all active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                戻る
              </button>
            )}
            <button
              onClick={onClose}
              className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-600 transition-all active:scale-90"
            >
              <CloseIcon className="w-7 h-7" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10">
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-8">
              {/* Profile Name */}
              <div className="space-y-4">
                <label className="block text-[10px] md:text-[11px] font-black text-indigo-500 uppercase tracking-[0.3em]">
                  プロフィール名 (Account Name)
                </label>
                <div className="relative group max-w-md">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="例: 店長（公式）"
                    className="w-full px-5 py-4 md:px-7 md:py-5 bg-white border border-slate-200 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50/50 outline-none rounded-2xl text-sm md:text-base text-slate-800 font-black placeholder-slate-300 transition-all shadow-sm"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                    {renderAvatar(avatar, "w-6 h-6 md:w-8 md:h-8")}
                  </div>

                  {/* Google Maps Search Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-slate-100 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="p-3 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <span className="text-[10px] font-black text-slate-400 px-3 uppercase tracking-[0.2em]">Google Mapsから選択</span>
                        <button onClick={() => setSuggestions([])} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
                          <CloseIcon className="w-3.5 h-3.5 text-slate-300" />
                        </button>
                      </div>
                      <div className="max-h-[320px] overflow-y-auto">
                        {suggestions.map((s) => (
                          <button
                            key={s.place_id}
                            onClick={() => {
                              setName(enforceSaveNameWidth(s.structured_formatting.main_text));
                              setSuggestions([]);
                            }}
                            className="w-full text-left px-6 py-4 hover:bg-slate-50 transition-all flex items-center justify-between group border-b border-slate-50 last:border-0"
                          >
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-black text-slate-700 group-hover:text-indigo-600 transition-colors">{s.structured_formatting.main_text}</span>
                              <span className="text-[11px] font-bold text-slate-400 truncate max-w-[280px]">{s.structured_formatting.secondary_text}</span>
                            </div>
                            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Icon Selection - Accordion Style */}
              <div className="space-y-4">
                <div
                  onClick={() => setIsIconSelectorOpen(!isIconSelectorOpen)}
                  className="flex flex-col gap-4 p-5 bg-white border border-slate-200 rounded-[32px] shadow-sm cursor-pointer hover:border-indigo-200 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-[10px] md:text-[11px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-1">
                        アイコンの選択 (Select Icon)
                      </label>
                      <div className="text-sm font-bold text-slate-500">
                        {AVATAR_OPTIONS.find(o => o.id === avatar)?.label}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Selected Icon Preview */}
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        {renderAvatar(avatar, "w-6 h-6")}
                      </div>
                      <div className={`w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center transition-transform duration-300 ${isIconSelectorOpen ? 'rotate-180' : ''}`}>
                        <ChevronDownIcon className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                      </div>
                    </div>
                  </div>

                  {/* Expandable Grid */}
                  <div className={`grid grid-cols-5 md:flex md:flex-wrap gap-2 md:gap-3 transition-all duration-300 ease-in-out overflow-hidden ${isIconSelectorOpen ? 'max-h-[500px] opacity-100 pt-4 border-t border-slate-100' : 'max-h-0 opacity-0'}`}>
                    {AVATAR_OPTIONS.map((item) => {
                      const Icon = item.icon;
                      const isSelected = avatar === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setAvatar(item.id);
                            // setIsIconSelectorOpen(false); // Optional: close on select
                          }}
                          title={item.label}
                          className={`
                            w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-xl md:rounded-2xl transition-all duration-300 relative shrink-0
                            ${isSelected
                              ? 'bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg md:shadow-xl shadow-indigo-200 scale-110 z-10 text-white'
                              : 'bg-slate-50 text-slate-300 hover:bg-slate-100 hover:text-slate-500 border border-slate-100'
                            }
                          `}
                        >
                          <Icon className="w-4 h-4 md:w-6 md:h-6" />
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 md:w-3.5 md:h-3.5 bg-white rounded-full border-[3px] border-indigo-500 shadow-sm" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="animate-in slide-in-from-bottom-4 duration-500 delay-100">
            <label className="block text-[10px] md:text-[11px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-3 md:mb-4">
              追加の指示プロンプト (Additional Instructions)
            </label>
            <div className="relative p-1 rounded-[32px] bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-100 shadow-sm">
              <AutoResizingTextarea
                value={customPrompt}
                onChange={setCustomPrompt}
                placeholder={'例：\n・「ご来店お待ちしております」は使わないでください\n・必ず「#〇〇」のタグをつけてください\n・語尾は「〜だワン！」にしてください'}
                className="w-full px-6 py-6 md:px-8 md:py-8 bg-white/50 border-2 border-transparent focus:bg-white focus:border-indigo-100 outline-none rounded-[28px] text-sm md:text-base text-slate-800 font-bold leading-relaxed placeholder-slate-300 transition-all min-h-[120px] md:min-h-[160px]"
              />
            </div>
            <p className="text-[10px] md:text-[11px] text-slate-400 font-black mt-3 md:mt-4 leading-relaxed flex items-center gap-1.5 md:gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              文体は「過去の投稿学習」が優先されます。ここは特定のルールや制約を指定するのに便利です。
            </p>
          </div>

          <div className="animate-in slide-in-from-bottom-4 duration-500 delay-200">
            <label className="block text-[10px] md:text-[11px] font-black text-slate-800 uppercase tracking-[0.3em] mb-3 md:mb-5">
              AIプロフィールの育成 (文体学習)
            </label>
            <div className="bg-slate-100/50 rounded-[40px] p-1.5 md:p-2 border border-slate-200/50">
              {/* Learning Hints relocated from Focus Mode */}
              <div className="p-5 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 shrink-0 bg-white/40 rounded-[32px] mb-2 border border-slate-100">
                <div className="flex-1 flex gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                    <MagicWandIcon className="w-4 h-4 md:w-5 md:h-5 text-indigo-500" />
                  </div>
                  <div className="space-y-0.5 md:space-y-1">
                    <h4 className="text-[10px] md:text-[11px] font-black text-indigo-900 uppercase tracking-wider">学習のヒント</h4>
                    <p className="text-[11px] md:text-xs text-slate-500 leading-relaxed font-bold">
                      過去の投稿を3〜5件貼り付けるのがベストです。<span className="hidden md:inline"><br />文体や絵文字はAIが自動で学習します。</span>
                    </p>
                  </div>
                </div>
                <div className="flex-1 flex gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                    <SparklesIcon className="w-4 h-4 md:w-5 md:h-5 text-rose-500" />
                  </div>
                  <div className="space-y-0.5 md:space-y-1">
                    <h4 className="text-[10px] md:text-[11px] font-black text-rose-900 uppercase tracking-wider">個人情報を守る</h4>
                    <p className="text-[11px] md:text-xs text-slate-500 leading-relaxed font-bold">
                      「AI伏せ字」で名前などを自動で書き換えます。<span className="hidden md:inline"><br />安全な学習データが作れます。</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Instagram Sample */}
              <div className="bg-white rounded-[32px] p-6 mb-2 shadow-sm border border-slate-100 hover:border-pink-200 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500 shadow-sm">
                      <InstagramIcon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-black text-pink-500 uppercase tracking-widest">Instagram Learning</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpandingPlatform(Platform.Instagram)}
                    className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-pink-600 bg-pink-50 hover:bg-pink-100 rounded-xl transition-all group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" /></svg>
                    <span>拡大表示で集中入力</span>
                  </button>
                </div>
                <AutoResizingTextarea
                  value={postSamples[Platform.Instagram] || ''}
                  onChange={(val) => setPostSamples(prev => ({ ...prev, [Platform.Instagram]: val }))}
                  placeholder={'例：\nこんにちは！今日のランチは... 🍝\n---\n新作のケーキが焼き上がりました！ 🍰\n---\n(このように「---」で区切る)'}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-pink-300 outline-none transition-all resize-none text-xs text-slate-800 font-bold leading-relaxed placeholder-slate-300 min-h-[100px]"
                />
              </div>

              {/* X Sample */}
              <div className="bg-white rounded-[32px] p-6 mb-2 shadow-sm border border-slate-100 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
                    </div>
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">X (Twitter) Learning</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpandingPlatform(Platform.X)}
                    className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" /></svg>
                    <span>拡大表示で集中入力</span>
                  </button>
                </div>
                <AutoResizingTextarea
                  value={postSamples[Platform.X] || ''}
                  onChange={(val) => setPostSamples(prev => ({ ...prev, [Platform.X]: val }))}
                  placeholder="過去の気に入っている投稿を3件ほど貼り付けてください..."
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-slate-400 outline-none transition-all resize-none text-xs text-slate-800 font-bold leading-relaxed placeholder-slate-300 min-h-[80px]"
                />
              </div>

              {/* Google Maps Sample */}
              <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" /></svg>
                    </div>
                    <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest">Map Replies Learning</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpandingPlatform(Platform.GoogleMaps)}
                    className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" /></svg>
                    <span>拡大表示で集中入力</span>
                  </button>
                </div>
                <AutoResizingTextarea
                  value={postSamples[Platform.GoogleMaps] || ''}
                  onChange={(val) => setPostSamples(prev => ({ ...prev, [Platform.GoogleMaps]: val }))}
                  placeholder="過去のオーナー返信を3件ほど貼り付けてください..."
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-300 outline-none transition-all resize-none text-xs text-slate-800 font-bold leading-relaxed placeholder-slate-300 min-h-[80px]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10 border-t border-slate-100 bg-white/60 flex flex-col md:flex-row items-stretch justify-between gap-6 shrink-0 backdrop-blur-md">
          <div className="flex-1 flex flex-col gap-2 relative">
            {showSuccessToast && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 z-[50] animate-in slide-in-from-bottom-2 fade-in duration-500">
                <div className="bg-white text-slate-800 px-5 py-2.5 rounded-xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] flex items-center gap-2 border border-slate-100 whitespace-nowrap">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[11px] font-black uppercase tracking-widest">保存しました</span>
                </div>
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={isSaveDisabled}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 md:py-6 rounded-[28px] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-xl shadow-indigo-300/40 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <SaveIcon className="w-5 h-5 group-hover:scale-110 transition-transform relative z-10" />
              <span className="relative z-10">{selectedPresetId ? '更新して保存' : '新規作成して保存'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const mainPortal = createPortal(
    <div
      className="fixed inset-0 z-[150] bg-slate-900/40 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      onClick={onClose}
    >
      <div className="hidden md:flex w-full h-full items-center justify-center p-6">
        <div
          className="w-full max-w-6xl h-[90vh] rounded-[32px] overflow-hidden animate-in zoom-in-95 duration-500 scale-100 ring-1 ring-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          {modalBody}
        </div>
      </div>
      <div className="md:hidden fixed inset-x-0 bottom-0 flex justify-center p-0">
        <div
          className="w-full max-h-[98dvh] bg-transparent rounded-t-[32px] overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-500"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center py-4 absolute top-0 inset-x-0 z-50 pointer-events-none">
            <span className="block w-16 h-1.5 rounded-full bg-slate-300/50 backdrop-blur-sm" />
          </div>
          <div className="flex-1 overflow-hidden">{modalBody}</div>
        </div>
      </div>
    </div>,
    document.body
  );

  const focusModeOverlay = expandingPlatform && createPortal(
    <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
      <div className="w-full max-w-4xl h-full max-h-[800px] bg-white rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-500 ring-1 ring-white/50">
        <div className="p-5 md:p-8 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 md:gap-4">
            <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl shadow-sm ${expandingPlatform === Platform.Instagram ? 'bg-pink-50 text-pink-500' :
              expandingPlatform === Platform.X ? 'bg-slate-900 text-white' :
                'bg-blue-600 text-white'
              }`}>
              {expandingPlatform === Platform.Instagram && <InstagramIcon className="w-5 h-5 md:w-6 md:h-6" />}
              {expandingPlatform === Platform.X && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="md:w-6 md:h-6"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>}
              {expandingPlatform === Platform.GoogleMaps && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="md:w-6 md:h-6"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" /></svg>}
            </div>
            <div>
              <h3 className="font-black text-lg md:text-xl text-slate-800 tracking-tight">{expandingPlatform} の文体学習</h3>
              <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Focus Mode Editor</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
            <button
              onClick={async () => {
                const currentText = postSamples[expandingPlatform!] || '';
                if (!currentText.trim() || isSanitizing) return;
                setIsSanitizing(true);
                try {
                  const res = await fetch('/api/ai/sanitize', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: currentText }),
                  });
                  const data = await res.json();
                  if (data.sanitized) {
                    setPostSamples(prev => ({ ...prev, [expandingPlatform!]: data.sanitized }));
                  }
                } catch (err) {
                  console.error('Sanitization failed:', err);
                } finally {
                  setIsSanitizing(false);
                }
              }}
              disabled={isSanitizing || !(postSamples[expandingPlatform!] || '').trim()}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-5 py-3 rounded-2xl font-black text-[10px] md:text-[11px] transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 ${expandingPlatform === Platform.Instagram ? 'bg-pink-50 text-pink-600 hover:bg-pink-100' :
                expandingPlatform === Platform.X ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' :
                  'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
            >
              {isSanitizing ? (
                <>
                  <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span className="hidden md:inline">AIが名前を伏せ字にしています...</span>
                  <span className="md:hidden">伏せ字中...</span>
                </>
              ) : (
                <>
                  <MagicWandIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="hidden md:inline">AIで名前を伏せる</span>
                  <span className="md:hidden text-[11px]">AI伏せ字</span>
                </>
              )}
            </button>
            <button
              onClick={() => setExpandingPlatform(null)}
              className="flex-none p-3 bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-2xl transition-all font-black text-sm px-5 md:px-6"
            >
              完了
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col bg-slate-50/30">
          <div className="flex-1 p-5 md:p-8 overflow-y-auto">
            <textarea
              autoFocus
              value={postSamples[expandingPlatform] || ''}
              onChange={(e) => setPostSamples(prev => ({ ...prev, [expandingPlatform]: e.target.value }))}
              className="w-full h-full min-h-[400px] bg-transparent outline-none text-base md:text-lg text-slate-800 font-bold leading-loose placeholder-slate-300 resize-none no-scrollbar"
              placeholder={'ここに過去の投稿を貼り付けてください...\n複数の投稿を入れる場合は「---」で区切ってください。'}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );

  return (
    <>
      {mainPortal}
      {focusModeOverlay}
    </>
  );
};

export default PresetModal;

declare global {
  interface Window {
    google: any;
  }
}
