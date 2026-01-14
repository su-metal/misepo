import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Preset } from '../types';
import {
  CloseIcon,
  BookmarkIcon,
  SaveIcon,
  TrashIcon,
  MagicWandIcon,
  InstagramIcon,
  StarIcon,
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
  const [pinningId, setPinningId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedPresetId(null);
      setErrorMessage(null);
      return;
    }

    setName('');
    setCustomPrompt(currentConfig.customPrompt ?? '');
    setSelectedPresetId(null);
    setErrorMessage(null);
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

  const limitReached = presets.length >= 5 && !selectedPresetId;
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
    setName(preset.name);
    setCustomPrompt(preset.custom_prompt ?? '');
    setErrorMessage(null);
  };

  const handleStartNew = () => {
    if (limitReached) return;
    setSelectedPresetId(null);
    setName('');
    setCustomPrompt('');
    setErrorMessage(null);
  };

  const handleTogglePin = async (preset: Preset) => {
    setPinningId(preset.id);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/me/presets/${preset.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_pinned: !preset.is_pinned }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || data?.ok === false) {
        setErrorMessage('ピンの更新に失敗しました。');
        return;
      }
      await refreshPresets();
    } catch (err) {
      console.error('pin toggle failed:', err);
      setErrorMessage('ピンの更新に失敗しました。');
    } finally {
      setPinningId(null);
    }
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
      is_pinned: false,
      pinned_at: null,
    };
    onApply(personaPreset);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* LEFT COLUMN: Presets List */}
        <div className="md:w-1/3 bg-slate-50 border-r border-gray-100 flex flex-col shrink-0 h-[200px] md:h-auto">
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
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${limitReached ? 'border-gray-300 text-gray-400 cursor-not-allowed' : 'border-amber-100 bg-white text-amber-600 hover:bg-amber-50'}`}
                  title={limitReached ? '保存済みプリセットは最大5件です' : '新しいプリセットを作成'}
                >
                  ＋ 新規作成
                </button>
                {limitReached && (
                  <span className="text-[10px] text-gray-400">最大5件まで保存できます</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {presets.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-xs">
                保存されたプリセットは
                <br />
                ありません
              </div>
            ) : (
              presets.map((preset) => {
                const preview = (preset.custom_prompt ?? '').trim().slice(0, 60);
                const isPresetPinned = preset.is_pinned === true;
                return (
                  <div key={preset.id} className="group relative flex items-center">
                    <button
                      onClick={() => handleLoadPreset(preset)}
                      className="flex-1 text-left p-3 pr-12 rounded-xl bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all group-hover:bg-indigo-50/30"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="p-1 rounded flex items-center justify-center bg-pink-100 text-pink-600">
                          <InstagramIcon className="w-3 h-3" />
                        </span>
                        <div className="font-bold text-sm text-slate-700 truncate">
                          {preset.name}
                        </div>
                      </div>
                      <div className="text-[10px] text-gray-400 pl-7 truncate">
                        {preview || 'ペルソナ未設定'}
                      </div>
                    </button>
                    <div className="absolute right-2 top-2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePin(preset);
                        }}
                        disabled={pinningId === preset.id || deletingId === preset.id}
                        className={`p-1.5 rounded-lg transition-colors ${isPresetPinned ? 'bg-amber-50 text-amber-600 hover:text-amber-700' : 'text-gray-300 hover:text-amber-500'} disabled:opacity-50 disabled:cursor-not-allowed`}
                        aria-label={isPresetPinned ? 'お気に入りを外す' : 'お気に入りに追加'}
                      >
                        <StarIcon className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePreset(preset);
                        }}
                        disabled={deletingId === preset.id || pinningId === preset.id}
                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="プリセットを削除"
                      >
                        <TrashIcon />
                      </button>
                    </div>
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
              <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                プリセット設定
                {isCreatingNew && (
                  <span className="text-xs font-bold text-amber-600 tracking-wider">
                    新規作成中
                  </span>
                )}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">
                プリセット名 (Save Name)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例: フレンドリーなペルソナ"
                className="w-full px-5 py-4 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-base text-slate-700 placeholder-gray-300 transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-700 mb-2">
                発信者ペルソナ (Prompt)
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="例: 店長として丁寧に。/ 20代アルバイトの親しみある口調で。"
                rows={5}
                className="w-full px-5 py-4 bg-amber-50/60 border border-amber-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-300 focus:border-transparent outline-none text-base text-slate-700 placeholder-amber-500 transition-all resize-none shadow-sm"
              />
              <p className="text-[11px] text-gray-400 mt-2">
                ここで指定した文体でAIが出力を整えます。
              </p>
            </div>
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
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
    </div>,
    document.body
  );
};

export default PresetModal;
