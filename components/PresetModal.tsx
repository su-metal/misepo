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
}> = ({ preset, deletingId, onSelect, onDelete, isReordering }) => {
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
      className="group relative flex items-center"
    >
      <button
        onClick={() => onSelect(preset)}
        className="flex-1 text-left p-3 pr-12 rounded-xl bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all group-hover:bg-indigo-50/30"
        type="button"
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded flex items-center justify-center bg-pink-100 text-pink-600">
            <InstagramIcon className="w-3 h-3" />
          </span>
          <div className="font-bold text-sm text-slate-700 truncate">
            {preset.name}
          </div>
        </div>
      </button>
      <div className="absolute right-2 top-2 flex items-center gap-1">
        <button
          type="button"
          {...attributes}
          {...listeners}
          disabled={isReordering}
          className="h-8 w-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-sm hover:bg-slate-200 transition-colors touch-none"
          aria-label="ドラッグして順番を変更"
        >
          <span className="text-xs leading-none">::</span>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(preset);
          }}
          disabled={deletingId === preset.id || isReordering}
          className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="プリセットを削除"
        >
          <TrashIcon />
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
    mobileView === 'edit' ? 'hidden md:block' : 'block md:block';
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
    refreshPresets().catch(() => {});
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
      setOrderError('並び順の保存に失敗しました。リロードして再度お試しください。');
    } finally {
      setIsReordering(false);
    }
  };

  if (!isOpen) return null;

  const modalBody = (
    <div className="flex w-full h-full flex-col md:flex-row overflow-hidden">
      <div
        className={`md:w-1/3 bg-slate-50 border-r border-gray-100 flex flex-col shrink-0 h-full ${listVisibilityClass}`}
      >
        <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <BookmarkIcon className="w-4 h-4 text-amber-500" />
              保存済みプリセット
            </h3>
            <div className="flex flex-col items-end gap-1">
              <button
                type="button"
                onClick={handleStartNew}
                disabled={limitReached}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                  limitReached
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'border-amber-100 bg-white text-amber-600 hover:bg-amber-50'
                }`}
                title={
                  limitReached
                    ? '保存済みプリセットは最大5件です'
                    : '新しいプリセットを作成'
                }
              >
                ＋ 新規作成
              </button>
              {limitReached && (
                <span className="text-[10px] text-gray-400">
                  最大5件まで保存できます
                </span>
              )}
            </div>
          </div>
          {orderError && (
            <p className="mt-2 text-[11px] text-red-500">{orderError}</p>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {orderedPresets.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-xs">
              保存されたプリセットは
              <br />
              ありません
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
                {orderedPresets.map((preset) => (
                  <SortablePresetRow
                    key={preset.id}
                    preset={preset}
                    deletingId={deletingId}
                    isReordering={isReordering}
                    onSelect={handleLoadPreset}
                    onDelete={handleDeletePreset}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      <div
        className={`flex-1 flex flex-col bg-white min-h-0 overflow-hidden h-full ${editVisibilityClass}`}
      >
        <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <SaveIcon className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              プリセット設定
              {isCreatingNew && (
                <span className="text-xs font-bold text-amber-600 tracking-wider">
                  新規作成中
                </span>
              )}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {mobileView === 'edit' && (
              <button
                type="button"
                onClick={goToListView}
                className="md:hidden px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-gray-100 rounded-full"
              >
                ← 一覧へ
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">
              プリセット名 (Save Name)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(enforceSaveNameWidth(e.target.value))}
              placeholder="例: フレンドリーなペルソナ"
              className="w-full px-5 py-4 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-base text-slate-700 placeholder-gray-300 transition-all shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-700 mb-2">
              発信者ペルソナ (Prompt)
            </label>
            <AutoResizingTextarea
              value={customPrompt}
              onChange={setCustomPrompt}
              placeholder="例: 店長として丁寧に。/ 20代アルバイトの親しみある口調で。"
              className="w-full px-5 py-4 bg-amber-50/60 border border-amber-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-300 focus:border-transparent outline-none text-base text-slate-700 placeholder-amber-500 transition-all shadow-sm"
            />
            <p className="text-[11px] text-gray-400 mt-2">
              ここで指定した文体でAIが出力を整えます。
            </p>
          </div>
        </div>

        <div className="px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] border-t border-gray-100 bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0 md:px-4 md:py-4 md:pb-4">
          <div className="w-full md:w-auto flex flex-col gap-2">
            <button
              onClick={handleSave}
              disabled={isSaveDisabled}
              className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 md:py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-colors shadow-sm whitespace-nowrap"
            >
              <SaveIcon className="w-4 h-4" />
              プリセットを保存
            </button>
            {(errorMessage || limitReached) && (
              <p
                className={`text-[11px] ${errorMessage ? 'text-red-500' : 'text-gray-400'}`}
              >
                {errorMessage ??
                  '保存済みプリセットは最大5件です。既存プリセットを編集してください。'}
              </p>
            )}
          </div>

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
  );

  return createPortal(
    <div
      className="fixed inset-0 z-[150] bg-black/30 backdrop-blur-sm md:bg-slate-900/60 md:backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="hidden md:flex w-full h-full items-center justify-center">
        <div
          className="w-full max-w-5xl h-[70vh] rounded-[28px] shadow-2xl overflow-hidden bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          {modalBody}
        </div>
      </div>
      <div className="md:hidden fixed inset-x-0 bottom-0 flex justify-center">
        <div
          className="w-full max-h-[92dvh] bg-white rounded-t-3xl shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center py-2">
            <span className="block w-12 h-1.5 rounded-full bg-slate-300" />
          </div>
          <div className="flex-1 overflow-hidden">{modalBody}</div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PresetModal;
