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
} from './Icons';

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
        className={`flex-1 text-left p-4 pr-14 rounded-2xl border-2 transition-all duration-300 ${isSelected
          ? 'bg-black text-white shadow-lg shadow-black/10 border-black'
          : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50'
          }`}
        type="button"
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 ${isSelected ? 'bg-white shadow-inner scale-105' : 'bg-stone-100'}`}>
            {preset.avatar || "👤"}
          </div>
          <div className={`font-bold text-sm truncate ${isSelected ? 'text-white' : 'text-stone-700 group-hover:text-black'}`}>
            {preset.name}
          </div>
        </div>
      </button>
      <div className="absolute right-3 flex items-center gap-1">
        <button
          type="button"
          {...attributes}
          {...listeners}
          disabled={isReordering}
          className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs transition-all touch-none active:scale-95 ${isSelected ? 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white' : 'bg-stone-100 text-stone-400 hover:bg-stone-200 hover:text-stone-700'}`}
          aria-label="ドラッグして順番を変更"
        >
          <div className="grid grid-cols-2 gap-0.5">
            {[...Array(4)].map((_, i) => <div key={i} className="w-1 h-1 rounded-full bg-current" />)}
          </div>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(preset);
          }}
          disabled={deletingId === preset.id || isReordering}
          className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-20 ${isSelected ? 'text-white/40 hover:text-rose-400 hover:bg-rose-500/10' : 'text-stone-400 hover:text-rose-500 hover:bg-rose-50'}`}
          aria-label="プリセットを削除"
        >
          <TrashIcon className="w-4 h-4" />
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
      return;
    }

    setName('');
    setAvatar('👤');
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
        // postSamples: postSamples, // Commented out: DB column doesn't exist yet
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

      setName('');
      setAvatar('👤');
      setCustomPrompt('');
      setPostSamples({});
      setSelectedPresetId(null);
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
    setAvatar(preset.avatar || '👤');
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
        setAvatar('👤');
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
        className={`md:w-5/12 lg:w-4/12 bg-stone-50 border-r border-stone-200 flex flex-col shrink-0 h-full relative overflow-hidden ${listVisibilityClass}`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

        <div className="relative z-10 p-6 md:p-8 flex flex-col h-full">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-black text-xl text-stone-800 tracking-tight flex items-center gap-2">
                <div className="w-1.5 h-6 bg-lime rounded-full shadow-sm"></div>
                投稿者プロフィール
              </h3>
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Sender Profiles</p>
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

          <div className="mb-4 bg-indigo-50/50 border border-indigo-100/50 rounded-xl p-3">
            <p className="text-[10px] text-indigo-500 font-bold leading-relaxed flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
              上位4件が入力画面に表示されます
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
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                <p className="text-[10px] text-amber-500 font-bold leading-tight">
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
        <div className="p-6 md:p-8 border-b border-stone-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-black shadow-inner" style={{ backgroundColor: 'rgba(239,255,0,0.2)' }}>
              <MagicWandIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-xl text-stone-900 tracking-tight">プロファイルの編集</h2>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Profile Editor</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {mobileView === 'edit' && (
              <button
                type="button"
                onClick={goToListView}
                className="md:hidden flex items-center gap-1.5 px-4 py-2 text-xs font-black text-stone-500 bg-stone-100 rounded-full hover:bg-stone-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                戻る
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2.5 hover:bg-lime/10 rounded-2xl text-stone-300 hover:text-lime transition-all active:scale-95"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10">
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-8">
              {/* Profile Name */}
              <div className="space-y-3">
                <label className="block text-[11px] font-black text-stone-400 uppercase tracking-[0.2em]">
                  プロフィール名 (Account Name)
                </label>
                <div className="relative group max-w-md">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(enforceSaveNameWidth(e.target.value))}
                    placeholder="例: 店長（公式）"
                    className="w-full px-6 py-4.5 bg-stone-50 border-2 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-[8px] focus:ring-indigo-500/10 outline-none rounded-2xl text-base text-stone-800 font-bold placeholder-stone-300 transition-all shadow-sm"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-200 group-focus-within:text-indigo-500">
                    <span className="text-xl">{avatar}</span>
                  </div>
                </div>
              </div>

              {/* Icon Selection */}
              <div className="space-y-4">
                <label className="block text-[11px] font-black text-stone-400 uppercase tracking-[0.2em]">
                  アイコンの選択 (Select Icon)
                </label>
                <div className="flex flex-wrap gap-2.5 p-5 bg-stone-50 border border-stone-100 rounded-[32px] shadow-inner-sm">
                  {[
                    { e: '👔', l: '店長/公式' },
                    { e: '👟', l: 'スタッフ' },
                    { e: '💻', l: '広報/IT' },
                    { e: '🍳', l: '料理/製作' },
                    { e: '☕', l: 'カフェ/日常' },
                    { e: '🏢', l: '店舗/外観' },
                    { e: '✨', l: 'キラキラ' },
                    { e: '📣', l: 'お知らせ' },
                    { e: '🌿', l: 'ナチュラル' },
                    { e: '💎', l: 'プレミアム' }
                  ].map((item) => (
                    <button
                      key={item.e}
                      type="button"
                      onClick={() => setAvatar(item.e)}
                      title={item.l}
                      className={`w-12 h-12 flex items-center justify-center text-2xl rounded-2xl transition-all duration-300 ${avatar === item.e ? 'bg-white shadow-lg ring-2 ring-indigo-500 scale-110 z-10' : 'hover:bg-white hover:shadow-md opacity-40 hover:opacity-100'}`}
                    >
                      {item.e}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="animate-in slide-in-from-bottom-4 duration-500 delay-100">
            <label className="block text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-3">
              追加の指示プロンプト (Additional Instructions)
            </label>
            <div className="relative p-[1px] rounded-[24px] bg-gradient-to-br from-indigo-500/20 via-gray-100 to-indigo-500/10">
              <AutoResizingTextarea
                value={customPrompt}
                onChange={setCustomPrompt}
                placeholder={'例：\n・「ご来店お待ちしております」は使わないでください\n・必ず「#〇〇」のタグをつけてください\n・語尾は「〜だワン！」にしてください'}
                className="w-full px-6 py-6 bg-white border-2 border-transparent focus:border-indigo-500 focus:ring-[8px] focus:ring-indigo-500/10 outline-none rounded-[22px] text-base text-gray-800 font-medium leading-relaxed placeholder-gray-300 transition-all shadow-inner min-h-[140px]"
              />
            </div>
            <p className="text-[11px] text-stone-400 font-medium mt-3 leading-relaxed flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              文体は「過去の投稿学習」が優先されます。ここは特定のルールや制約を指定するのに便利です。
            </p>
          </div>

          <div className="animate-in slide-in-from-bottom-4 duration-500 delay-200">
            <label className="block text-[11px] font-black text-stone-900 uppercase tracking-[0.2em] mb-4">
              AIプロフィールの育成 (文体学習)
            </label>
            <div className="bg-stone-100 rounded-[28px] p-1">
              {/* Instagram Sample */}
              <div className="bg-white rounded-[24px] p-5 mb-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600">
                    <InstagramIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-black text-stone-500 uppercase">Instagram Learning</span>
                </div>
                <textarea
                  value={postSamples[Platform.Instagram] || ''}
                  onChange={(e) => setPostSamples(prev => ({ ...prev, [Platform.Instagram]: e.target.value }))}
                  placeholder={'例：\nこんにちは！今日のランチは... 🍝\n---\n新作のケーキが焼き上がりました！ 🍰\n---\n(このように「---」で区切る)'}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-transparent focus:bg-white focus:border-pink-500 outline-none transition-all resize-none text-xs text-stone-800 leading-relaxed placeholder-stone-400"
                />
              </div>

              {/* X Sample */}
              <div className="bg-white rounded-[24px] p-5 mb-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-stone-900 flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
                  </div>
                  <span className="text-[10px] font-black text-stone-500 uppercase">X (Twitter) Learning</span>
                </div>
                <textarea
                  value={postSamples[Platform.X] || ''}
                  onChange={(e) => setPostSamples(prev => ({ ...prev, [Platform.X]: e.target.value }))}
                  placeholder="過去の気に入っている投稿を3件ほど貼り付けてください..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-transparent focus:bg-white focus:border-stone-500 outline-none transition-all resize-none text-xs text-stone-800 leading-relaxed placeholder-stone-400"
                />
              </div>

              {/* Google Maps Sample */}
              <div className="bg-white rounded-[24px] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" /></svg>
                  </div>
                  <span className="text-[10px] font-black text-stone-500 uppercase">Map Replies Learning</span>
                </div>
                <textarea
                  value={postSamples[Platform.GoogleMaps] || ''}
                  onChange={(e) => setPostSamples(prev => ({ ...prev, [Platform.GoogleMaps]: e.target.value }))}
                  placeholder="過去のオーナー返信を3件ほど貼り付けてください..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all resize-none text-xs text-stone-800 leading-relaxed placeholder-stone-400"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 border-t border-stone-100 bg-stone-50/50 flex flex-col md:flex-row items-stretch justify-between gap-4 shrink-0">
          <div className="flex-1 flex flex-col gap-2">
            <button
              onClick={handleSave}
              disabled={isSaveDisabled}
              className="w-full bg-black hover:bg-stone-900 disabled:opacity-50 disabled:cursor-not-allowed text-indigo-400 border border-indigo-500/50 px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-xl shadow-black/20"
            >
              <SaveIcon className="w-4 h-4" />
              {selectedPresetId ? '更新して保存' : '新規作成'}
            </button>
          </div>

          <button
            onClick={handleApplyCurrent}
            className="flex-[1.2] bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 px-8 rounded-2xl shadow-xl shadow-indigo-200 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
          >
            <MagicWandIcon className="w-4 h-4" />
            プロファイルを適用
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(
    <div
      className="fixed inset-0 z-[150] bg-stone-950/80 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      onClick={onClose}
    >
      <div className="hidden md:flex w-full h-full items-center justify-center">
        <div
          className="w-full max-w-6xl h-[85vh] rounded-[32px] shadow-2xl overflow-hidden bg-white border border-white/20 animate-in zoom-in-95 duration-500 scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          {modalBody}
        </div>
      </div>
      <div className="md:hidden fixed inset-x-0 bottom-0 flex justify-center p-2">
        <div
          className="w-full max-h-[95dvh] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-500"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center py-3">
            <span className="block w-12 h-1.5 rounded-full bg-stone-200" />
          </div>
          <div className="flex-1 overflow-hidden">{modalBody}</div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PresetModal;
