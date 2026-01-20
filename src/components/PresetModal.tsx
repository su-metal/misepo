import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Preset, Platform } from '../types';
import {
  CloseIcon,
  BookmarkIcon,
  SaveIcon,
  TrashIcon,
  MagicWandIcon,
  InstagramIcon,
  TieIcon,
  SneakersIcon,
  LaptopIcon,
  CookingIcon,
  CoffeeIcon,
  BuildingIcon,
  LeafIcon,
  GemIcon,
  MegaphoneIcon,
  SparklesIcon,
} from './Icons';

const AVATAR_OPTIONS = [
  { id: '👔', icon: TieIcon, label: '店長/公式' },
  { id: '👟', icon: SneakersIcon, label: 'スタッフ' },
  { id: '💻', icon: LaptopIcon, label: '広報/IT' },
  { id: '🍳', icon: CookingIcon, label: '料理/製作' },
  { id: '☕', icon: CoffeeIcon, label: 'カフェ/日常' },
  { id: '🏢', icon: BuildingIcon, label: '店舗/外観' },
  { id: '✨', icon: SparklesIcon, label: 'キラキラ' },
  { id: '📣', icon: MegaphoneIcon, label: 'お知らせ' },
  { id: '🌿', icon: LeafIcon, label: 'ナチュラル' },
  { id: '💎', icon: GemIcon, label: 'プレミアム' }
];

const renderAvatar = (avatarId: string | null, className: string = "w-6 h-6") => {
  const option = AVATAR_OPTIONS.find(opt => opt.id === avatarId);
  if (option) {
    const Icon = option.icon;
    return <Icon className={className} />;
  }
  return <div className={className}><TieIcon /></div>; // Default
};

interface PresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  presets: Preset[];
  refreshPresets: () => Promise<void>;
  onApply: (preset: Preset) => void;
  currentConfig: {
    customPrompt: string;
    postSamples?: { [key in Platform]?: string };
  };
}

const SortablePresetRow: React.FC<{
  preset: Preset;
  isReordering: boolean;
  deletingId: string | null;
  onSelect: (preset: Preset) => void;
  onDelete: (preset: Preset) => void;
  isSelected: boolean;
}> = ({ preset, deletingId, onSelect, onDelete, isReordering, isSelected }) => {
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
    zIndex: isDragging ? 50 : undefined,
  } as React.CSSProperties;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex items-center transition-all duration-300 animate-in slide-in-from-left-4 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <button
        onClick={() => onSelect(preset)}
        className={`flex-1 text-left p-6 pr-16 rounded-[28px] border-2 transition-all duration-300 ${isSelected
          ? 'bg-[#001738] text-white shadow-2xl shadow-navy-900/30 border-[#001738]'
          : 'bg-white border-slate-100 hover:border-[#001738] hover:bg-slate-50 shadow-sm'
          }`}
        type="button"
      >
        <div className="flex items-center gap-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 ${isSelected ? 'bg-white/10 shadow-inner scale-105' : 'bg-slate-50'}`}>
            {renderAvatar(preset.avatar, "w-7 h-7")}
          </div>
          <div className={`font-black text-sm tracking-tight truncate ${isSelected ? 'text-white' : 'text-slate-600 group-hover:text-[#001738]'}`}>
            {preset.name}
          </div>
        </div>
      </button>
      <div className="absolute right-4 flex items-center gap-1.5">
        <button
          type="button"
          {...attributes}
          {...listeners}
          disabled={isReordering}
          className={`h-9 w-9 rounded-xl flex items-center justify-center text-xs transition-all touch-none active:scale-95 ${isSelected ? 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-700'}`}
          aria-label="ドラッグして順番を変更"
        >
          <div className="grid grid-cols-2 gap-1">
            {[...Array(4)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-current" />)}
          </div>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(preset);
          }}
          disabled={deletingId === preset.id || isReordering}
          className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-20 ${isSelected ? 'text-white/40 hover:text-[#E5005A] hover:bg-[#E5005A]/10' : 'text-slate-300 hover:text-[#E5005A] hover:bg-[#E5005A]/5'}`}
          aria-label="プリセットを削除"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const MAX_SAVE_NAME_WIDTH = 40;

const enforceSaveNameWidth = (value: string, maxWidth: number = MAX_SAVE_NAME_WIDTH) => {
  let width = 0;
  let truncated = '';
  for (const char of Array.from(value)) {
    const code = char.codePointAt(0) ?? 0;
    const isHalfWidth = code <= 0x7f;
    const delta = isHalfWidth ? 1 : 2;
    if (width + delta > maxWidth) break;
    truncated += char;
    width += delta;
  }
  return truncated;
};

const AutoResizingTextarea: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}> = ({ value, onChange, placeholder, className }) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = 'auto';
    ref.current.style.height = `${ref.current.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
      rows={1}
      style={{ overflow: 'hidden' }}
    />
  );
};

const PresetModal: React.FC<PresetModalProps> = ({
  isOpen,
  onClose,
  presets,
  refreshPresets,
  onApply,
  currentConfig,
}) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('👤');
  const [customPrompt, setCustomPrompt] = useState('');
  const [postSamples, setPostSamples] = useState<{ [key in Platform]?: string }>({});
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [orderedPresets, setOrderedPresets] = useState<Preset[]>(presets);
  const [isReordering, setIsReordering] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'edit'>('list');
  const [expandingPlatform, setExpandingPlatform] = useState<Platform | null>(null);
  const [isSanitizing, setIsSanitizing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));
  const goToListView = () => setMobileView('list');
  const listVisibilityClass =
    mobileView === 'edit' ? 'hidden md:flex' : 'flex md:flex';
  const editVisibilityClass =
    mobileView === 'list' ? 'hidden md:flex' : 'flex md:flex';

  useEffect(() => {
    setOrderedPresets(presets);
  }, [presets]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedPresetId(null);
      setErrorMessage(null);
      setOrderError(null);
      setMobileView('list');
      setExpandingPlatform(null);
      return;
    }

    setName('');
    setAvatar('👔');
    setCustomPrompt('');
    setPostSamples({});
    setSelectedPresetId(null);
    setErrorMessage(null);
    setOrderError(null);
    setMobileView('list');
    refreshPresets().catch(() => { });
  }, [isOpen, refreshPresets]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const limitReached = orderedPresets.length >= 10 && !selectedPresetId;
  const isSaveDisabled = isSaving || !name.trim() || limitReached;
  const isCreatingNew = selectedPresetId === null;

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage('プリセット名を入力してください');
      return;
    }

    const trimmedPrompt = customPrompt.trim();
    setIsSaving(true);
    setErrorMessage(null);

    try {
      const payload = {
        name: trimmedName,
        avatar: avatar,
        custom_prompt: trimmedPrompt, // Send empty string, not null (DB has NOT NULL constraint)
        post_samples: postSamples, // Store learning samples per platform
      };
      const endpoint = selectedPresetId
        ? `/api/me/presets/${selectedPresetId}`
        : '/api/me/presets';
      const method = selectedPresetId ? 'PATCH' : 'POST';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || data?.ok === false) {
        if (!selectedPresetId && res.status === 409) {
          setErrorMessage(
            '保存済みプリセットは最大10件です。既存プリセットを編集してください。'
          );
        } else {
          setErrorMessage(data?.error ?? '保存に失敗しました。');
        }
        return;
      }

      await refreshPresets();

      // If we were editing an active preset, re-apply it to sync the generator UI
      if (selectedPresetId && onApply) {
        onApply({
          id: selectedPresetId,
          name: trimmedName,
          avatar: avatar,
          custom_prompt: trimmedPrompt || null,
          postSamples,
          sort_order: 0, // Not critical for apply
        });
      }

      setName(trimmedName);
      setAvatar(avatar);
      setCustomPrompt(trimmedPrompt);
      setPostSamples(postSamples);

      // Show success toast
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);

      // Only reset if it was a completely NEW creation
      if (!selectedPresetId) {
        setName('');
        setAvatar('👔');
        setCustomPrompt('');
        setPostSamples({});
        setSelectedPresetId(null);
      }
    } catch (err) {
      console.error('preset save failed:', err);
      setErrorMessage('保存に失敗しました。時間をおいて再度お試しください。');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadPreset = (preset: Preset) => {
    setSelectedPresetId(preset.id);
    setName(enforceSaveNameWidth(preset.name));
    setAvatar(preset.avatar || '👔');
    setCustomPrompt(preset.custom_prompt ?? '');
    setPostSamples(preset.postSamples || {});
    setErrorMessage(null);
    setOrderError(null);
    setMobileView('edit');
  };

  const handleStartNew = () => {
    if (limitReached) return;
    setSelectedPresetId(null);
    setName('');
    setAvatar('👤');
    setCustomPrompt('');
    setPostSamples({});
    setErrorMessage(null);
    setOrderError(null);
    setMobileView('edit');
  };

  const handleDeletePreset = async (preset: Preset) => {
    setDeletingId(preset.id);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/me/presets/${preset.id}`, {
        method: 'DELETE',
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || data?.ok === false) {
        setErrorMessage('削除に失敗しました。');
        return;
      }
      await refreshPresets();
      if (selectedPresetId === preset.id) {
        setSelectedPresetId(null);
        setName('');
        setAvatar('👔');
        setCustomPrompt(currentConfig.customPrompt ?? '');
        setPostSamples(currentConfig.postSamples || {});
      }
    } catch (err) {
      console.error('preset delete failed:', err);
      setErrorMessage('削除に失敗しました。');
    } finally {
      setDeletingId(null);
    }
  };

  const handleApplyCurrent = () => {
    const trimmedPrompt = customPrompt.trim();
    const personaPreset: Preset = {
      id: 'temp',
      name: name || 'Persona',
      avatar: avatar,
      custom_prompt: trimmedPrompt || null,
      postSamples,
      sort_order: 0,
    };
    onApply(personaPreset);
    onClose();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIndex = orderedPresets.findIndex((preset) => preset.id === active.id);
    const overIndex = orderedPresets.findIndex((preset) => preset.id === over.id);
    if (activeIndex === -1 || overIndex === -1) return;

    const nextOrder = arrayMove(orderedPresets, activeIndex, overIndex);
    const previousOrder = orderedPresets;
    setOrderedPresets(nextOrder);
    setIsReordering(true);
    setOrderError(null);

    try {
      const res = await fetch('/api/me/presets/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: nextOrder.map((p) => p.id) }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || data?.ok === false) {
        setOrderedPresets(previousOrder);
        setOrderError('並び順の保存に失敗しました。リロードして再度お試しください。');
        return;
      }
      await refreshPresets();
    } catch (err) {
      console.error('reorder failed:', err);
      setOrderedPresets(previousOrder);
      setOrderError('並び順의 保存に失敗しました。リロードして再度お試しください。');
    } finally {
      setIsReordering(false);
    }
  };

  if (!isOpen) return null;

  const modalBody = (
    <div className="flex w-full h-full flex-col md:flex-row overflow-hidden">
      {/* SIDEBAR: Dark Tech Theme */}
      <div
        className={`md:w-5/12 lg:w-4/12 bg-white border-r border-slate-100 flex flex-col shrink-0 h-full relative overflow-hidden ${listVisibilityClass}`}
      >
        <div className="relative z-10 p-8 flex flex-col h-full">
          <div className="mb-10 flex items-center justify-between gap-4">
            <div className="space-y-2">
              <h3 className="font-black text-2xl text-[#001738] tracking-tighter flex items-center gap-3">
                <div className="w-2 h-7 bg-[#E5005A] rounded-full shadow-lg shadow-[#E5005A]/20"></div>
                投稿者プロフィール
              </h3>
              <p className="text-[11px] font-black text-[#E5005A] uppercase tracking-[0.3em] opacity-80">Sender Profiles</p>
            </div>
            <button
              type="button"
              onClick={handleStartNew}
              disabled={limitReached}
              className={`p-2 rounded-xl transition-all border-2 flex items-center justify-center ${limitReached
                ? 'border-stone-100 text-stone-300'
                : 'border-stone-200 bg-white text-stone-600 hover:bg-black hover:text-lime hover:border-black shadow-sm'
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            </button>
          </div>

          <div className="mb-6 bg-[#001738]/5 border border-[#001738]/10 rounded-2xl p-4">
            <p className="text-[11px] text-[#001738] font-black leading-relaxed flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E5005A] animate-pulse"></span>
              上位3件が入力画面に表示されます
            </p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pb-6">
            {orderedPresets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center space-y-2 opacity-50">
                <BookmarkIcon className="w-8 h-8 text-stone-300" />
                <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                  プリセットがありません
                </div>
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
            {limitReached && (
              <div className="bg-[#E5005A]/10 border border-[#E5005A]/20 rounded-2xl p-4">
                <p className="text-[11px] text-[#E5005A] font-black leading-tight">
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
        <div className="p-8 md:p-10 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-[18px] flex items-center justify-center bg-[#001738] text-[#E5005A] shadow-lg shadow-navy-900/20">
              <MagicWandIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-2xl text-[#001738] tracking-tighter">プロファイルの編集</h2>
              <p className="text-[11px] font-black text-[#E5005A] uppercase tracking-[0.3em] opacity-80">Profile Editor</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {mobileView === 'edit' && (
              <button
                type="button"
                onClick={goToListView}
                className="md:hidden flex items-center gap-2 px-5 py-2.5 text-xs font-black text-slate-500 bg-slate-100 rounded-full hover:bg-[#001738] hover:text-white transition-all active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                戻る
              </button>
            )}
            <button
              onClick={onClose}
              className="p-3 hover:bg-[#E5005A]/5 rounded-2xl text-slate-300 hover:text-[#E5005A] transition-all active:scale-90"
            >
              <CloseIcon className="w-7 h-7" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10">
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-8">
              {/* Profile Name */}
              <div className="space-y-4">
                <label className="block text-[11px] font-black text-[#E5005A] uppercase tracking-[0.3em]">
                  プロフィール名 (Account Name)
                </label>
                <div className="relative group max-w-md">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(enforceSaveNameWidth(e.target.value))}
                    placeholder="例: 店長（公式）"
                    className="w-full px-7 py-5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#001738] outline-none rounded-2xl text-base text-[#001738] font-black placeholder-slate-300 transition-all shadow-sm"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#001738] transition-colors">
                    {renderAvatar(avatar, "w-8 h-8")}
                  </div>
                </div>
              </div>

              {/* Icon Selection */}
              <div className="space-y-5">
                <label className="block text-[11px] font-black text-[#E5005A] uppercase tracking-[0.3em]">
                  アイコンの選択 (Select Icon)
                </label>
                <div className="flex flex-wrap gap-3 p-6 bg-slate-50/50 border border-slate-100 rounded-[40px] shadow-inner">
                  {AVATAR_OPTIONS.map((item) => {
                    const Icon = item.icon;
                    const isSelected = avatar === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setAvatar(item.id)}
                        title={item.label}
                        className={`
                          w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-300 relative
                          ${isSelected
                            ? 'bg-[#001738] shadow-2xl shadow-navy-900/30 scale-110 z-10 text-white'
                            : 'bg-white text-slate-300 hover:bg-slate-50 hover:text-[#001738] border border-transparent hover:border-[#001738]/10'
                          }
                        `}
                      >
                        <Icon className="w-6 h-6" />
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#E5005A] rounded-full border-4 border-white shadow-sm" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="animate-in slide-in-from-bottom-4 duration-500 delay-100">
            <label className="block text-[11px] font-black text-[#E5005A] uppercase tracking-[0.3em] mb-4">
              追加の指示プロンプト (Additional Instructions)
            </label>
            <div className="relative p-[1px] rounded-[32px] bg-gradient-to-br from-[#001738]/10 via-slate-100 to-[#E5005A]/10">
              <AutoResizingTextarea
                value={customPrompt}
                onChange={setCustomPrompt}
                placeholder={'例：\n・「ご来店お待ちしております」は使わないでください\n・必ず「#〇〇」のタグをつけてください\n・語尾は「〜だワン！」にしてください'}
                className="w-full px-8 py-8 bg-white border-2 border-transparent focus:border-[#001738] outline-none rounded-[30px] text-base text-slate-800 font-bold leading-relaxed placeholder-slate-300 transition-all shadow-inner min-h-[160px]"
              />
            </div>
            <p className="text-[11px] text-slate-400 font-black mt-4 leading-relaxed flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E5005A]"></span>
              文体は「過去の投稿学習」が優先されます。ここは特定のルールや制約を指定するのに便利です。
            </p>
          </div>

          <div className="animate-in slide-in-from-bottom-4 duration-500 delay-200">
            <label className="block text-[11px] font-black text-[#001738] uppercase tracking-[0.3em] mb-5">
              AIプロフィールの育成 (文体学習)
            </label>
            <div className="bg-slate-50/50 rounded-[40px] p-2 border border-slate-100">
              {/* Instagram Sample */}
              <div className="bg-white rounded-[32px] p-6 mb-2 shadow-sm border border-slate-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 shadow-sm">
                      <InstagramIcon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-black text-[#E5005A] uppercase tracking-widest">Instagram Learning</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpandingPlatform(Platform.Instagram)}
                    className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-[#E5005A] bg-pink-50 hover:bg-pink-100 rounded-xl transition-all group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" /></svg>
                    <span>拡大表示で集中入力</span>
                  </button>
                </div>
                <AutoResizingTextarea
                  value={postSamples[Platform.Instagram] || ''}
                  onChange={(val) => setPostSamples(prev => ({ ...prev, [Platform.Instagram]: val }))}
                  placeholder={'例：\nこんにちは！今日のランチは... 🍝\n---\n新作のケーキが焼き上がりました！ 🍰\n---\n(このように「---」で区切る)'}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-pink-300 outline-none transition-all resize-none text-xs text-slate-800 font-bold leading-relaxed placeholder-slate-300 min-h-[100px]"
                />
              </div>

              {/* X Sample */}
              <div className="bg-white rounded-[32px] p-6 mb-2 shadow-sm border border-slate-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#001738] flex items-center justify-center text-white shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
                    </div>
                    <span className="text-[11px] font-black text-[#001738] uppercase tracking-widest">X (Twitter) Learning</span>
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
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-slate-300 outline-none transition-all resize-none text-xs text-slate-800 font-bold leading-relaxed placeholder-slate-300 min-h-[80px]"
                />
              </div>

              {/* Google Maps Sample */}
              <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
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
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-300 outline-none transition-all resize-none text-xs text-slate-800 font-bold leading-relaxed placeholder-slate-300 min-h-[80px]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10 border-t border-slate-100 bg-white flex flex-col md:flex-row items-stretch justify-between gap-6 shrink-0 backdrop-blur-sm">
          <div className="flex-1 flex flex-col gap-2 relative">
            {showSuccessToast && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 z-[50] animate-in slide-in-from-bottom-2 fade-in duration-500">
                <div className="bg-white text-[#001738] px-5 py-2.5 rounded-xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] flex items-center gap-2 border border-slate-100 whitespace-nowrap">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[11px] font-black uppercase tracking-widest">保存しました</span>
                </div>
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={isSaveDisabled}
              className="w-full bg-[#001738] hover:bg-[#001D47] disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-6 rounded-[28px] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-2xl shadow-navy-900/40 group"
            >
              <SaveIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {selectedPresetId ? '更新して保存' : '新規作成'}
            </button>
          </div>

          <button
            onClick={handleApplyCurrent}
            className="flex-[1.2] bg-[#E5005A] hover:bg-[#C2004D] text-white font-black py-6 px-10 rounded-[28px] shadow-2xl shadow-[#E5005A]/30 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-4 text-sm uppercase tracking-[0.3em] group"
          >
            <MagicWandIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            プロファイルを適用
          </button>
        </div>
      </div>
    </div>
  );

  const mainPortal = createPortal(
    <div
      className="fixed inset-0 z-[150] bg-[#001738]/80 backdrop-blur-xl transition-all duration-300 animate-in fade-in"
      onClick={onClose}
    >
      <div className="hidden md:flex w-full h-full items-center justify-center">
        <div
          className="w-full max-w-6xl h-[90vh] rounded-[48px] shadow-[0_32px_128px_-32px_rgba(0,17,45,0.7)] overflow-hidden bg-white border border-white/20 animate-in zoom-in-95 duration-500 scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          {modalBody}
        </div>
      </div>
      <div className="md:hidden fixed inset-x-0 bottom-0 flex justify-center p-0">
        <div
          className="w-full max-h-[98dvh] bg-white rounded-t-[48px] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-500"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center py-4">
            <span className="block w-16 h-1.5 rounded-full bg-slate-100" />
          </div>
          <div className="flex-1 overflow-hidden">{modalBody}</div>
        </div>
      </div>

      {/* Success Toast within Modal - REMOVED from here to move inside footer */}
    </div>,
    document.body
  );

  const focusModeOverlay = expandingPlatform && createPortal(
    <div className="fixed inset-0 z-[200] bg-[#001738]/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
      <div className="w-full max-w-4xl h-full max-h-[800px] bg-white rounded-[48px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl shadow-sm ${expandingPlatform === Platform.Instagram ? 'bg-pink-100 text-pink-600' :
              expandingPlatform === Platform.X ? 'bg-[#001738] text-white' :
                'bg-blue-600 text-white'
              }`}>
              {expandingPlatform === Platform.Instagram && <InstagramIcon className="w-6 h-6" />}
              {expandingPlatform === Platform.X && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>}
              {expandingPlatform === Platform.GoogleMaps && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" /></svg>}
            </div>
            <div>
              <h3 className="font-black text-xl text-[#001738] tracking-tight">{expandingPlatform} の文体学習</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Focus Mode Editor</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
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
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-[11px] transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 ${expandingPlatform === Platform.Instagram ? 'bg-pink-50 text-[#E5005A] hover:bg-pink-100' :
                expandingPlatform === Platform.X ? 'bg-slate-100 text-[#001738] hover:bg-slate-200' :
                  'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
            >
              {isSanitizing ? (
                <>
                  <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  AIが名前を伏せ字にしています...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-4 h-4" />
                  AIで名前を伏せる
                </>
              )}
            </button>
            <button
              onClick={() => setExpandingPlatform(null)}
              className="p-3 bg-slate-100 hover:bg-[#001738] text-slate-400 hover:text-white rounded-2xl transition-all font-black text-sm px-6"
            >
              完了
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Instructions / Tips */}
          <div className="p-8 bg-slate-50/50 flex flex-col md:flex-row gap-6 shrink-0">
            <div className="flex-1 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                <MagicWandIcon className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[11px] font-black text-[#001738] uppercase tracking-wider">AI学習を成功させるヒント</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-bold">
                  気に入っている過去の投稿を3〜5件貼り付けるのがベストです。<br />
                  文体や絵文字の使い方はAIが自動で学習します。
                </p>
              </div>
            </div>
            <div className="flex-1 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#E5005A]/10 flex items-center justify-center shrink-0">
                <SparklesIcon className="w-5 h-5 text-[#E5005A]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[11px] font-black text-[#E5005A] uppercase tracking-wider">個人情報を守る</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-bold">
                  「AIで名前を伏せる」ボタンを押すと、文章の中の特定の名前などをAIが自動で伏せ字（[担当者名]など）に書き換えます。<br />
                  コピペした後にボタンを押すだけで、安全な学習データが作れます。
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 p-8 overflow-y-auto">
            <textarea
              autoFocus
              value={postSamples[expandingPlatform] || ''}
              onChange={(e) => setPostSamples(prev => ({ ...prev, [expandingPlatform]: e.target.value }))}
              className="w-full h-full min-h-[400px] bg-transparent outline-none text-lg text-slate-800 font-bold leading-loose placeholder-slate-200 resize-none no-scrollbar"
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
