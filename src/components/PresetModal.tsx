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
import { Platform, Preset, TrainingItem } from '../types';
import { AutoResizingTextarea } from './ResizableTextarea';

interface PresetModalProps {
  presets: Preset[];
  onSave: (preset: Partial<Preset>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onApply: (preset: Preset) => void;
  onClose: () => void;
  initialPresetId?: string;
  isSaving?: boolean;
  onReorder?: () => Promise<Preset[] | void>;
  trainingItems: TrainingItem[];
  onToggleTraining: (text: string, platform: Platform, presetId: string | null, replaceId?: string) => Promise<void>;
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
        group flex items-center gap-3 p-4 rounded-xl transition-all duration-300 border-2 border-black
        ${isSelected
          ? 'bg-[var(--teal)] shadow-[4px_4px_0_0_rgba(0,0,0,1)] scale-[1.02] z-10'
          : 'bg-white hover:bg-[var(--bg-beige)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:-translate-y-0.5'
        }
        ${isDragging ? 'opacity-50' : ''}
      `}
    >
      <div
        {...attributes}
        {...listeners}
        className={`cursor-grab active:cursor-grabbing p-1 transition-colors touch-none ${isSelected ? 'text-black' : 'text-slate-300 hover:text-black'}`}
      >
        <MenuIcon className="w-5 h-5" />
      </div>
      <button
        onClick={() => onSelect(preset.id)}
        className="flex-1 text-left min-w-0"
      >
        <div className={`font-black text-sm truncate mb-0.5 ${isSelected ? 'text-black' : 'text-slate-800'}`}>{preset.name}</div>
        <div className={`text-[10px] font-bold uppercase tracking-widest truncate ${isSelected ? 'text-black/70' : 'text-slate-400'}`}>
          Custom Style
        </div>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(preset.id);
        }}
        disabled={deletingId === preset.id}
        className={`p-2.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${isSelected ? 'text-black hover:bg-black/10' : 'text-slate-300 hover:text-rose-500 hover:bg-rose-50'}`}
      >
        {deletingId === preset.id ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
  trainingItems,
  onToggleTraining,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(initialPresetId || null);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('shop');
  const [customPrompt, setCustomPrompt] = useState('');
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
      setMobileView('edit');
    }
  };

  const handleStartNew = () => {
    setSelectedPresetId(null);
    setName('');
    setAvatar('shop');
    setCustomPrompt('');
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

  const getSamplesForPlatform = (platform: Platform): TrainingItem[] => {
    return trainingItems.filter(item =>
      item.platform === platform &&
      item.presetId === (selectedPresetId || 'omakase')
    );
  };

  const handleToggleTrainingInternal = async (text: string, platform: Platform) => {
    const presetId = selectedPresetId || 'omakase';
    const normalizedText = text.trim();
    if (!normalizedText) return;

    let replaceId: string | undefined = undefined;
    if (editingSampleIndex !== null) {
      const samples = getSamplesForPlatform(platform);
      if (samples[editingSampleIndex]) {
        replaceId = samples[editingSampleIndex].id;
      }
    }

    try {
      await onToggleTraining(normalizedText, platform, presetId, replaceId);
      setExpandingPlatform(null);
      setEditingSampleIndex(null); // Reset editing index
    } catch (err) {
      console.error('Training failed:', err);
    }
  };

  const renderSampleList = (platform: Platform, colorClass: string, Icon: any) => {
    const samples = getSamplesForPlatform(platform);
    return (
      <div className="bg-white rounded-xl p-6 mb-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] border-2 border-black transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] ${colorClass}`}>
              <Icon className="w-4 h-4" />
            </div>
            <span className={`text-[11px] font-black uppercase tracking-widest text-black`}>{platform} Learning</span>
            <span className="text-[10px] font-black text-black bg-[var(--bg-beige)] border-2 border-black px-2 py-0.5 rounded-full">{samples.length} / 50</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setModalText('');
              setEditingSampleIndex(null);
              setExpandingPlatform(platform);
            }}
            disabled={samples.length >= 50}
            className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black rounded-lg transition-all group border-2 border-black ${samples.length >= 50 ? 'bg-slate-100 text-slate-400' : 'bg-white text-black hover:bg-[var(--teal)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)]'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span>学習文を追加する</span>
          </button>
        </div>

        {samples.length === 0 ? (
          <div className="py-8 border-2 border-dashed border-black rounded-xl flex flex-col items-center justify-center text-slate-300 gap-2">
            <Icon className="w-8 h-8 opacity-20" />
            <p className="text-[10px] font-bold text-slate-400">まだ学習データがありません</p>
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-3 pb-2 snap-x pr-2">
            {samples.map((item, idx) => (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between min-w-[200px] w-[200px] h-[140px] p-4 rounded-xl bg-white border-2 border-black hover:bg-[var(--bg-beige)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all cursor-pointer snap-start shrink-0"
                onClick={() => {
                  setModalText(item.content);
                  setEditingSampleIndex(idx);
                  setExpandingPlatform(platform);
                }}
              >
                <div className="w-full">
                  <p className="text-[11px] text-black font-bold line-clamp-4 leading-relaxed whitespace-pre-wrap">
                    {item.content}
                  </p>
                </div>
                <div className="mt-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleTraining(item.content, item.platform, item.presetId);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all border-2 border-transparent hover:border-black"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
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
        className={`w-full md:w-[420px] shrink-0 border-r-[3px] border-black flex flex-col bg-[var(--bg-beige)] overflow-hidden ${listVisibilityClass}`}
      >
        <div className="p-8 border-b-[3px] border-black flex items-center justify-between shrink-0 bg-[var(--bg-beige)]">
          <div>
            <h2 className="font-black text-xl text-black tracking-tight">AIプロファイル</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Management</p>
          </div>
          <button
            onClick={handleStartNew}
            className="p-3 bg-white text-black border-2 border-black rounded-xl hover:bg-[var(--gold)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all active:translate-x-0 active:translate-y-0 active:shadow-none group"
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
        className={`flex-1 flex flex-col bg-white min-h-0 overflow-hidden h-full ${editVisibilityClass}`}
      >
        <div className="p-6 md:p-10 border-b-[3px] border-black flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--lavender)] border-2 border-black text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <MagicWandIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-lg md:text-2xl text-black tracking-tighter">プロファイルの編集</h2>
              <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] opacity-80">Profile Editor</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {mobileView === 'edit' && (
              <button
                type="button"
                onClick={goToListView}
                className="md:hidden flex items-center gap-2 px-5 py-2.5 text-xs font-black text-black bg-white border-2 border-black rounded-full hover:bg-slate-50 transition-all active:scale-95 shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                戻る
              </button>
            )}
            <button
              onClick={onClose}
              className="p-3 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-500 border-2 border-transparent hover:border-black hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all active:scale-90"
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
                <label className="block text-[10px] md:text-[11px] font-black text-black uppercase tracking-[0.3em]">
                  プロフィール名 (Account Name)
                </label>
                <div className="relative group max-w-md">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="例: 店長（公式）"
                    className="w-full px-5 py-4 md:px-7 md:py-5 bg-white border-2 border-black focus:bg-[var(--bg-beige)] outline-none rounded-xl text-sm md:text-base text-black font-black placeholder-slate-300 transition-all shadow-none focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
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
                  className="flex flex-col gap-4 p-5 bg-white border-2 border-black rounded-[24px] shadow-[4px_4px_0_0_rgba(0,0,0,1)] cursor-pointer hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-[10px] md:text-[11px] font-black text-black uppercase tracking-[0.3em] mb-1">
                        アイコンの選択 (Select Icon)
                      </label>
                      <div className="text-sm font-bold text-slate-500">
                        {AVATAR_OPTIONS.find(o => o.id === avatar)?.label}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Selected Icon Preview */}
                      <div className="w-12 h-12 rounded-xl bg-[var(--gold)] border-2 border-black flex items-center justify-center text-black shadow-sm">
                        {renderAvatar(avatar, "w-6 h-6")}
                      </div>
                      <div className={`w-8 h-8 rounded-full bg-slate-100 border-2 border-black flex items-center justify-center transition-transform duration-300 ${isIconSelectorOpen ? 'rotate-180' : ''}`}>
                        <ChevronDownIcon className="w-4 h-4 text-black" />
                      </div>
                    </div>
                  </div>

                  {/* Expandable Grid */}
                  <div className={`grid grid-cols-5 md:flex md:flex-wrap gap-2 md:gap-3 transition-all duration-300 ease-in-out overflow-hidden ${isIconSelectorOpen ? 'max-h-[500px] opacity-100 pt-4 border-t-2 border-slate-100' : 'max-h-0 opacity-0'}`}>
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
                            w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-lg md:rounded-xl transition-all duration-300 relative shrink-0 border-2
                            ${isSelected
                              ? 'bg-[var(--gold)] shadow-[2px_2px_0_0_rgba(0,0,0,1)] border-black text-black z-10 scale-110'
                              : 'bg-white text-slate-300 hover:bg-slate-50 hover:text-slate-500 border-slate-200 hover:border-black'
                            }
                          `}
                        >
                          <Icon className="w-4 h-4 md:w-6 md:h-6" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="animate-in slide-in-from-bottom-4 duration-500 delay-100">
            <label className="block text-[10px] md:text-[11px] font-black text-black uppercase tracking-[0.3em] mb-3 md:mb-4">
              追加の指示プロンプト (Additional Instructions)
            </label>
            <div className="relative p-1 rounded-[32px]">
              <AutoResizingTextarea
                value={customPrompt}
                onChange={setCustomPrompt}
                placeholder={'例：\n・「ご来店お待ちしております」は使わないでください\n・必ず「#〇〇」のタグをつけてください\n・語尾は「〜だワン！」にしてください'}
                className="w-full px-6 py-6 md:px-8 md:py-8 bg-white border-2 border-black focus:bg-[var(--bg-beige)] focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)] outline-none rounded-[24px] text-sm md:text-base text-black font-bold leading-relaxed placeholder-slate-300 transition-all min-h-[120px] md:min-h-[160px]"
              />
            </div>
            <p className="text-[10px] md:text-[11px] text-slate-500 font-black mt-3 md:mt-4 leading-relaxed flex items-center gap-1.5 md:gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--teal)]"></span>
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

        <div className="p-8 md:p-10 border-t-[3px] border-black bg-white flex flex-col md:flex-row items-stretch justify-between gap-6 shrink-0 z-10 relative">
          <div className="flex-1 flex flex-col gap-2 relative">
            {showSuccessToast && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 z-[50] animate-in slide-in-from-bottom-2 fade-in duration-500">
                <div className="bg-white text-black px-5 py-2.5 rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex items-center gap-2 border-2 border-black whitespace-nowrap">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[11px] font-black uppercase tracking-widest">保存しました</span>
                </div>
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={isSaveDisabled}
              className="w-full bg-[var(--gold)] hover:bg-[var(--rose)] border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed text-black px-8 py-4 md:py-6 rounded-xl font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all transform hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-0 active:translate-y-0 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] group relative overflow-hidden"
            >
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
          className="w-full max-w-6xl h-[90vh] rounded-[24px] overflow-hidden animate-in zoom-in-95 duration-500 scale-100 border-[3px] border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)]"
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
    <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
      <div className="w-full max-w-4xl h-full max-h-[800px] bg-white rounded-3xl border-[3px] border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="p-5 md:p-8 border-b-[3px] border-black flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0 bg-[var(--bg-beige)]">
          <div className="flex items-center gap-3 md:gap-4">
            <div className={`p-2.5 md:p-3 rounded-xl border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] ${expandingPlatform === Platform.Instagram ? 'bg-pink-50 text-pink-500' :
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
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-5 py-3 rounded-xl font-black text-[10px] md:text-[11px] transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] ${expandingPlatform === Platform.Instagram ? 'bg-white text-pink-500 hover:bg-pink-50' :
                expandingPlatform === Platform.X ? 'bg-white text-slate-700 hover:bg-slate-50' :
                  'bg-white text-blue-600 hover:bg-blue-50'
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
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-5 py-3 rounded-xl font-black text-[10px] md:text-[11px] transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] ${expandingPlatform === Platform.Instagram ? 'bg-pink-50 text-pink-600 hover:bg-pink-100' :
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
                handleToggleTrainingInternal(modalText, expandingPlatform!);
              }}
              className="flex-none p-3 bg-[#001738] hover:bg-slate-900 text-white rounded-xl transition-all font-black text-sm px-8 md:px-10 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-0 active:translate-y-0"
            >
              更新して学習
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col bg-slate-50">
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
