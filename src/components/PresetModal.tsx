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
import { Platform, Preset } from '../types';
import { AutoResizingTextarea } from './ResizableTextarea';

interface PresetModalProps {
  presets: Preset[];
  onSave: (preset: Partial<Preset>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onApply: (preset: Preset) => void;
  onClose: () => void;
  initialPresetId?: string;
  isSaving?: boolean;
  onReorder?: () => Promise<void>;
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
  preset: Preset;
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
        className="cursor-grab active:cursor-grabbing p-1 text-slate-300 hover:text-slate-500 transition-colors touch-none"
      >
        <MenuIcon className="w-5 h-5" />
      </div>
      <button
        onClick={() => onSelect(preset.id)}
        className="flex-1 text-left min-w-0"
      >
        <div className="font-black text-sm text-slate-800 truncate mb-0.5">{preset.name}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
          Custom Style

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
  onReorder,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(initialPresetId || null);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('shop');
  const [customPrompt, setCustomPrompt] = useState('');
  const [post_samples, setPostSamples] = useState<Record<string, string>>({});
  const [isInternalSaving, setIsInternalSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [orderedPresets, setOrderedPresets] = useState<Preset[]>([]);
  const [isReordering, setIsReordering] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'edit'>('list');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showOrderSuccessToast, setShowOrderSuccessToast] = useState(false);
  const [expandingPlatform, setExpandingPlatform] = useState<Platform | null>(null);
  const [editingSampleIndex, setEditingSampleIndex] = useState<number | null>(null);
  const [modalText, setModalText] = useState('');
  const [isSanitizing, setIsSanitizing] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);

  const isSaving = isExternalSaving || isInternalSaving;

  useEffect(() => {
    setOrderedPresets(presets);
  }, [presets]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

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
        post_samples: post_samples,
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
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: newOrder.map((p) => p.id) }),
      });
      if (!res.ok) throw new Error('Failed to save order');
      if (onReorder) await onReorder();
      setShowOrderSuccessToast(true);
      setTimeout(() => setShowOrderSuccessToast(false), 2000);
    } catch (err) {
      console.error('Failed to reorder:', err);
      setOrderError('並び替えの保存に失敗しました');
      setOrderedPresets(presets); // Only revert on error
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
  };

  const isSaveDisabled = isSaving || !name.trim();

  // Handle mobile view transitions
  const editVisibilityClass = mobileView === 'edit' ? 'flex' : 'hidden md:flex';
  const listVisibilityClass = mobileView === 'list' ? 'flex' : 'hidden md:flex';

  const goToListView = () => setMobileView('list');

  const getSamplesArray = (platform: Platform): string[] => {
    const raw = post_samples[platform] || '';
    return raw.split('\n---\n').filter(s => s.trim() !== '');
  };

  const updateSampleAtIndex = (platform: Platform, index: number | null, newText: string) => {
    const samples = getSamplesArray(platform);
    if (index === null) {
      if (newText.trim()) samples.push(newText.trim());
    } else {
      if (newText.trim()) {
        samples[index] = newText.trim();
      } else {
        samples.splice(index, 1);
      }
    }
    setPostSamples(prev => ({ ...prev, [platform]: samples.join('\n---\n') }));
  };

  const deleteSampleAtIndex = (platform: Platform, index: number) => {
    const samples = getSamplesArray(platform);
    samples.splice(index, 1);
    setPostSamples(prev => ({ ...prev, [platform]: samples.join('\n---\n') }));
  };

  const renderSampleList = (platform: Platform, colorClass: string, Icon: any) => {
    const samples = getSamplesArray(platform);
    return (
      <div className="bg-white rounded-[32px] p-6 mb-2 shadow-sm border border-slate-100 transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm ${colorClass}`}>
              <Icon className="w-4 h-4" />
            </div>
            <span className={`text-[11px] font-black uppercase tracking-widest ${colorClass.replace('bg-', 'text-')}`}>{platform} Learning</span>
            <span className="text-[10px] font-black text-slate-300 bg-slate-50 px-2 py-0.5 rounded-full">{samples.length} / 5</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setModalText('');
              setEditingSampleIndex(null);
              setExpandingPlatform(platform);
            }}
            disabled={samples.length >= 5}
            className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black rounded-xl transition-all group ${samples.length >= 5 ? 'bg-slate-50 text-slate-300' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span>学習文を追加する</span>
          </button>
        </div>

        {samples.length === 0 ? (
          <div className="py-8 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-300 gap-2">
            <Icon className="w-8 h-8 opacity-20" />
            <p className="text-[10px] font-bold">まだ学習データがありません</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {samples.map((text, idx) => (
              <div
                key={idx}
                className="group relative flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all cursor-pointer"
                onClick={() => {
                  setModalText(text);
                  setEditingSampleIndex(idx);
                  setExpandingPlatform(platform);
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-600 font-bold line-clamp-1 leading-relaxed">
                    {text}
                  </p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSampleAtIndex(platform, idx);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

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

        <div className="px-8 pb-4 relative">
          {showOrderSuccessToast && (
            <div className="absolute inset-x-0 -top-2 px-8 z-50 animate-in slide-in-from-top-1 fade-in duration-300">
              <div className="bg-green-500 text-white text-[10px] font-black uppercase tracking-[0.2em] py-1.5 rounded-full text-center shadow-lg shadow-green-100 flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                順序を保存しました
              </div>
            </div>
          )}
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
              {renderSampleList(Platform.Instagram, 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500', InstagramIcon)}

              {/* X Sample */}
              {renderSampleList(Platform.X, 'bg-slate-900', (props: any) => (
                <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                </svg>
              ))}

              {/* Google Maps Sample */}
              {renderSampleList(Platform.GoogleMaps, 'bg-blue-600', (props: any) => (
                <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
                </svg>
              ))}
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
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file || !expandingPlatform) return;

                setIsAnalyzingImage(true);
                try {
                  const reader = new FileReader();
                  reader.onloadend = async () => {
                    const base64 = reader.result as string;
                    const res = await fetch('/api/ai/analyze-screenshot', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        image: base64,
                        mimeType: file.type,
                        platform: expandingPlatform,
                      }),
                    });
                    const data = await res.json();
                    if (data.ok && data.text) {
                      setModalText(prev => {
                        const separator = prev.trim() ? '\n---\n' : '';
                        return prev + separator + data.text;
                      });
                    }
                  };
                  reader.readAsDataURL(file);
                } catch (err) {
                  console.error('Image analysis failed:', err);
                } finally {
                  setIsAnalyzingImage(false);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzingImage}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-5 py-3 rounded-2xl font-black text-[10px] md:text-[11px] transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 border-2 ${expandingPlatform === Platform.Instagram ? 'bg-white border-pink-100 text-pink-500 hover:bg-pink-50' :
                expandingPlatform === Platform.X ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50' :
                  'bg-white border-blue-100 text-blue-600 hover:bg-blue-50'
                }`}
            >
              {isAnalyzingImage ? (
                <>
                  <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>解析中...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
                  <span className="hidden md:inline">スクショから読み込む</span>
                  <span className="md:hidden">スクショ読込</span>
                </>
              )}
            </button>
            <button
              onClick={async () => {
                const currentText = modalText;
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
                    setModalText(data.sanitized);
                  }
                } catch (err) {
                  console.error('Sanitization failed:', err);
                } finally {
                  setIsSanitizing(false);
                }
              }}
              disabled={isSanitizing || !modalText.trim()}
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
              onClick={() => {
                updateSampleAtIndex(expandingPlatform!, editingSampleIndex, modalText);
                setExpandingPlatform(null);
                setEditingSampleIndex(null);
              }}
              className="flex-none p-3 bg-[#001738] hover:bg-slate-900 text-white rounded-2xl transition-all font-black text-sm px-8 md:px-10"
            >
              保存して閉じる
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col bg-slate-50/30">
          <div className="flex-1 p-5 md:p-8 overflow-y-auto">
            <AutoResizingTextarea
              autoFocus
              value={modalText}
              onChange={setModalText}
              className="w-full h-full min-h-[400px] bg-transparent outline-none text-base md:text-lg text-slate-800 font-bold leading-loose placeholder-slate-300 resize-none no-scrollbar"
              placeholder={'ここに過去の投稿を貼り付けてください...'}
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
