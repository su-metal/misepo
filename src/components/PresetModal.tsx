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
import { Preset } from '../types';
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
            ? 'bg-white/15 border-indigo-500/50 shadow-lg shadow-indigo-950/20'
            : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10'
          }`}
        type="button"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-400 group-hover:bg-white/20'}`}>
            <BookmarkIcon className="w-4 h-4" />
          </div>
          <div className={`font-bold text-sm truncate ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
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
          className="h-8 w-8 rounded-lg bg-white/5 text-slate-500 flex items-center justify-center text-xs hover:bg-white/10 hover:text-white transition-all touch-none active:scale-95"
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
          className="h-8 w-8 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center transition-all disabled:opacity-20"
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
  const [customPrompt, setCustomPrompt] = useState('');
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
    setCustomPrompt(currentConfig.customPrompt ?? '');
    setSelectedPresetId(null);
    setErrorMessage(null);
    setOrderError(null);
    setMobileView('list');
    refreshPresets().catch(() => { });
  }, [isOpen, currentConfig.customPrompt, refreshPresets]);

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

  const limitReached = orderedPresets.length >= 5 && !selectedPresetId;
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
        custom_prompt: trimmedPrompt || null,
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
            '保存済みプリセットは最大5件です。既存プリセットを編集してください。'
          );
        } else {
          setErrorMessage(data?.error ?? '保存に失敗しました。');
        }
        return;
      }

      await refreshPresets();
      setName('');
      setCustomPrompt('');
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
    setCustomPrompt(preset.custom_prompt ?? '');
    setErrorMessage(null);
    setOrderError(null);
    setMobileView('edit');
  };

  const handleStartNew = () => {
    if (limitReached) return;
    setSelectedPresetId(null);
    setName('');
    setCustomPrompt('');
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
        setCustomPrompt(currentConfig.customPrompt ?? '');
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
      name: 'Persona',
      custom_prompt: trimmedPrompt || null,
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
        className={`md:w-5/12 lg:w-4/12 bg-[#0F172A] border-r border-white/5 flex flex-col shrink-0 h-full relative overflow-hidden ${listVisibilityClass}`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

        <div className="relative z-10 p-6 md:p-8 flex flex-col h-full">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-black text-xl text-white tracking-tight flex items-center gap-2">
                <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                PRESETS
              </h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Saved Configurations</p>
            </div>
            <button
              type="button"
              onClick={handleStartNew}
              disabled={limitReached}
              className={`p-2 rounded-xl transition-all border-2 flex items-center justify-center ${limitReached
                  ? 'border-white/5 text-slate-600'
                  : 'border-white/10 bg-white/5 text-indigo-400 hover:bg-indigo-500 hover:text-white hover:border-indigo-500'
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pb-6">
            {orderedPresets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center space-y-2 opacity-50">
                <BookmarkIcon className="w-8 h-8 text-slate-700" />
                <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                  No Presets Found
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
                  保存上限(5件)に達しています。既存の設定を編集してください。
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
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
              <MagicWandIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-xl text-slate-900 tracking-tight">プリセット編集</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Configuration Editor</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {mobileView === 'edit' && (
              <button
                type="button"
                onClick={goToListView}
                className="md:hidden flex items-center gap-1.5 px-4 py-2 text-xs font-black text-slate-500 bg-slate-100 rounded-full hover:bg-slate-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                BACK
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2.5 hover:bg-rose-50 rounded-2xl text-slate-300 hover:text-rose-500 transition-all active:scale-95"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10">
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
              プリセット名 (Save Name)
            </label>
            <div className="relative group">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(enforceSaveNameWidth(e.target.value))}
                placeholder="例: フレンドリーな店長"
                className="w-full px-6 py-4.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-[8px] focus:ring-indigo-500/5 outline-none rounded-2xl text-base text-slate-800 font-bold placeholder-slate-300 transition-all shadow-sm"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-indigo-400">
                <BookmarkIcon className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="animate-in slide-in-from-bottom-4 duration-500 delay-100">
            <label className="block text-[11px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">
              発信者ペルソナ (Prompt Instruction)
            </label>
            <div className="relative p-[1px] rounded-[24px] bg-gradient-to-br from-indigo-500/20 via-slate-100 to-indigo-500/10">
              <AutoResizingTextarea
                value={customPrompt}
                onChange={setCustomPrompt}
                placeholder="例: 活気のある若手スタッフの口調で、親しみやすく丁寧なタメ口を交えて。"
                className="w-full px-6 py-6 bg-white border-2 border-transparent focus:border-indigo-500 focus:ring-[8px] focus:ring-indigo-500/5 outline-none rounded-[22px] text-base text-slate-800 font-medium leading-relaxed placeholder-slate-300 transition-all shadow-inner min-h-[140px]"
              />
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-3 leading-relaxed flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              ここで指定した性格や文体がAIの出力に反映されます。
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-stretch justify-between gap-4 shrink-0">
          <div className="flex-1 flex flex-col gap-2">
            <button
              onClick={handleSave}
              disabled={isSaveDisabled}
              className="w-full bg-[#0F172A] hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-xl shadow-slate-200"
            >
              <SaveIcon className="w-4 h-4" />
              {selectedPresetId ? 'UPDATE PRESET' : 'SAVE TO LIST'}
            </button>
          </div>

          <button
            onClick={handleApplyCurrent}
            className="flex-[1.2] bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 px-8 rounded-2xl shadow-xl shadow-indigo-200 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
          >
            <MagicWandIcon className="w-4 h-4" />
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(
    <div
      className="fixed inset-0 z-[150] bg-slate-950/80 backdrop-blur-md transition-all duration-300 animate-in fade-in"
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
            <span className="block w-12 h-1.5 rounded-full bg-slate-200" />
          </div>
          <div className="flex-1 overflow-hidden">{modalBody}</div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PresetModal;
