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
  XIcon,
  GoogleMapsIcon,
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
  LineIcon,
  BookOpenIcon,
  RotateCcwIcon,
  PlusIcon,
  ClockIcon,
} from './Icons';
import { Platform, Preset, PostPurpose, Tone, Length, TrainingItem } from '../types';
import { AutoResizingTextarea } from './ResizableTextarea';

interface PresetModalProps {
  presets: Preset[];
  onSave: (preset: Partial<Preset>) => Promise<Preset | null | void>;
  onDelete: (id: string) => Promise<void>;
  onApply: (preset: Preset) => void;
  onClose: () => void;
  initialPresetId?: string;
  isSaving?: boolean;
  onReorder?: () => Promise<Preset[] | void>;
  trainingItems: TrainingItem[];
  onToggleTraining: (text: string, platform: Platform, presetId: string | null, replaceId?: string, source?: 'generated' | 'manual') => Promise<void>;
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
        group flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-300 border
        ${isSelected
          ? 'bg-white border-indigo-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-indigo-500/20'
          : 'bg-white/40 border-stone-100 hover:bg-white hover:border-stone-200 hover:shadow-sm'
        }
        ${isDragging ? 'opacity-50 ring-2 ring-indigo-500' : ''}
      `}
    >
      <div
        {...attributes}
        {...listeners}
        className={`cursor-grab active:cursor-grabbing p-1 transition-colors touch-none ${isSelected ? 'text-indigo-400' : 'text-stone-300 hover:text-stone-500'}`}
      >
        <MenuIcon className="w-4 h-4" />
      </div>
      <button
        onClick={() => onSelect(preset.id)}
        className="flex-1 text-left min-w-0"
      >
        <div className={`font-black text-[13px] truncate mb-0.5 ${isSelected ? 'text-indigo-950' : 'text-stone-700'}`}>
          {preset.name}
        </div>
        <div className={`text-[10px] font-bold uppercase tracking-widest truncate ${isSelected ? 'text-indigo-400' : 'text-stone-400'}`}>
          Bunshin Profile
        </div>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(preset.id);
        }}
        disabled={deletingId === preset.id}
        className={`p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100 ${isSelected ? 'text-stone-300 hover:text-stone-900 hover:bg-stone-50' : 'text-stone-200 hover:text-rose-500 hover:bg-rose-50'}`}
      >
        {deletingId === preset.id ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <TrashIcon className="w-3.5 h-3.5" />
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
  const [customPrompts, setCustomPrompts] = useState<{ [key: string]: string }>({});
  const [activePromptTab, setActivePromptTab] = useState<Platform>(Platform.X);
  const [isInternalSaving, setIsInternalSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [orderedPresets, setOrderedPresets] = useState<Preset[]>([]);
  const [isReordering, setIsReordering] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'edit'>('list');
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'learning' | 'rules'>('profile');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
  const [expandingPlatform, setExpandingPlatform] = useState<Platform | null>(null);
  const [editingSampleId, setEditingSampleId] = useState<string | null>(null);
  const [modalText, setModalText] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([Platform.General]);
  const [isTrainingLoading, setIsTrainingLoading] = useState(false);
  const [isSanitizing, setIsSanitizing] = useState(false);
  const [isAnalyzingPersona, setIsAnalyzingPersona] = useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isSaving = isExternalSaving || isInternalSaving;

  useEffect(() => {
    setOrderedPresets(presets);
  }, [presets]);

  // Handle Preset Switching
  useEffect(() => {
    if (selectedPresetId) {
      const preset = presets.find(p => p.id === selectedPresetId);
      if (preset) {
        setName(preset.name);
        setAvatar(preset.avatar || 'shop');

        try {
          if (preset.custom_prompt) {
            if (preset.custom_prompt.trim().startsWith('{')) {
              const parsed = JSON.parse(preset.custom_prompt);
              setCustomPrompts(parsed);

              if (parsed['General']) {
                const updated = { ...parsed };
                [Platform.X, Platform.Instagram, Platform.Line, Platform.GoogleMaps].forEach(p => {
                  if (!updated[p]) updated[p] = parsed['General'];
                });
                delete updated['General'];
                setCustomPrompts(updated);
              }
            } else {
              const legacyVal = preset.custom_prompt;
              const initialPrompts: { [key: string]: string } = {};
              [Platform.X, Platform.Instagram, Platform.Line, Platform.GoogleMaps].forEach(p => {
                initialPrompts[p] = legacyVal;
              });
              setCustomPrompts(initialPrompts);
            }
          } else {
            setCustomPrompts({});
          }
        } catch (e) {
          const legacyVal = preset.custom_prompt || '';
          const initialPrompts: { [key: string]: string } = {};
          [Platform.X, Platform.Instagram, Platform.Line, Platform.GoogleMaps].forEach(p => {
            initialPrompts[p] = legacyVal;
          });
          setCustomPrompts(initialPrompts);
        }
      }
    } else {
      setName('');
      setAvatar('shop');
      setCustomPrompts({});
    }
  }, [selectedPresetId, presets]);

  const handleStartNew = () => {
    setSelectedPresetId(null);
    setMobileView('edit');
    setActiveSubTab('profile');
  };

  const handleSave = async (overridePrompts?: { [key: string]: string }) => {
    if (!name.trim()) return;
    setIsInternalSaving(true);
    try {
      let finalCustomPrompts = overridePrompts ? { ...customPrompts, ...overridePrompts } : { ...customPrompts };
      const currentPresetId = selectedPresetId || 'omakase';
      const relatedItems = trainingItems.filter(item => item.presetId === currentPresetId);
      const newPostSamples: { [key in Platform]?: string } = {};

      relatedItems.forEach(item => {
        const platforms = item.platform.split(',').map(p => p.trim()) as Platform[];
        platforms.forEach(p => {
          if (newPostSamples[p]) {
            newPostSamples[p] += `\n\n---\n\n${item.content}`;
          } else {
            newPostSamples[p] = item.content;
          }
        });
      });

      const cleanedPrompts: { [key: string]: string } = {};
      Object.entries(finalCustomPrompts).forEach(([k, v]) => {
        if (v && v.trim()) cleanedPrompts[k] = v.trim();
      });
      const customPromptJSON = Object.keys(cleanedPrompts).length > 0 ? JSON.stringify(cleanedPrompts) : null;

      const result = await onSave({
        id: selectedPresetId || undefined,
        name,
        avatar,
        custom_prompt: customPromptJSON,
        persona_yaml: null,
        post_samples: newPostSamples,
      });

      if (!selectedPresetId && result && 'id' in result && result.id) {
        const newId = result.id;
        await Promise.all(relatedItems.map(async (item) => {
          try {
            await onToggleTraining(item.content, item.platform as any, newId, undefined, item.source || 'manual');
          } catch (e) {
            console.error('Failed to migrate item:', item.id, e);
          }
        }));
        setSelectedPresetId(newId);
      }

      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (err) {
      console.error('Failed to save preset:', err);
      alert('保存中にエラーが発生しました。');
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

    setIsReordering(true);
    try {
      const res = await fetch('/api/me/presets/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: newOrder.map((p) => p.id) }),
      });
      if (!res.ok) throw new Error('Failed to save order');
      if (onReorder) await onReorder();
    } catch (err) {
      console.error('Failed to reorder:', err);
      setOrderedPresets(presets);
    } finally {
      setIsReordering(false);
    }
  };

  const performPersonaAnalysis = async (): Promise<string | null> => {
    const presetSamples = trainingItems
      .filter(item => item.presetId === (selectedPresetId || 'omakase'))
      .map(item => ({
        content: item.content,
        platform: item.platform
      }));

    if (presetSamples.length === 0) return null;

    setIsAnalyzingPersona(true);
    try {
      const res = await fetch('/api/ai/analyze-persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ samples: presetSamples }),
      });
      const data = await res.json();
      if (data.instruction) {
        let instruction = data.instruction;
        try {
          if (typeof instruction === 'string' && instruction.trim().startsWith('{')) {
            const parsed = JSON.parse(instruction);
            setCustomPrompts(prev => ({ ...prev, ...parsed }));
          } else if (typeof instruction === 'object') {
            setCustomPrompts(prev => ({ ...prev, ...instruction }));
          } else {
            setCustomPrompts(prev => ({ ...prev, [activePromptTab]: instruction }));
          }
        } catch (e) {
          setCustomPrompts(prev => ({ ...prev, [activePromptTab]: instruction }));
        }
        return typeof instruction === 'string' ? instruction : JSON.stringify(instruction);
      } else {
        throw new Error(data.error || 'Failed to analyze persona');
      }
    } catch (err) {
      console.error('Failed to analyze persona:', err);
      return null;
    } finally {
      setIsAnalyzingPersona(false);
    }
  };

  const renderAvatarIcon = (id: string, className = "w-5 h-5") => {
    const opt = AVATAR_OPTIONS.find(o => o.id === id) || AVATAR_OPTIONS[0];
    const Icon = opt.icon;
    return <Icon className={className} />;
  };

  const handleToggleTrainingInternal = async (text: string, platforms: Platform[]) => {
    const presetId = selectedPresetId || 'omakase';
    const normalizedText = text.trim();
    if (!normalizedText || platforms.length === 0) return;

    const replaceId = editingSampleId || undefined;
    const platformString = platforms.join(', ') as any;

    setIsTrainingLoading(true);
    try {
      await onToggleTraining(normalizedText, platformString, presetId, replaceId, 'manual');
      setExpandingPlatform(null);
      setEditingSampleId(null);
      setModalText('');
    } catch (err: any) {
      alert(`保存に失敗しました: ${err.message}`);
    } finally {
      setIsTrainingLoading(false);
    }
  };

  const currentPresetSamples = useMemo(() => {
    return trainingItems.filter(item => item.presetId === (selectedPresetId || 'omakase'));
  }, [trainingItems, selectedPresetId]);

  // Tabbed Content Renders
  const renderProfileTab = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-4 block">Basic Information</label>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => setIsIconSelectorOpen(!isIconSelectorOpen)}
              className="w-24 h-24 rounded-[2rem] bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm hover:shadow-md transition-all active:scale-95 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-indigo-500/5 group-hover:to-indigo-500/10 transition-all" />
              <div className="relative transform group-hover:scale-110 transition-transform">
                {renderAvatarIcon(avatar, "w-10 h-10")}
              </div>
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-white rounded-full border border-stone-100 flex items-center justify-center text-stone-400 shadow-sm">
                <ChevronDownIcon className={`w-3 h-3 transition-transform ${isIconSelectorOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Icon Selection</span>
          </div>

          <div className="flex-1 w-full space-y-2">
            <h4 className="text-[13px] font-bold text-stone-900 tracking-tight ml-1">プロフィール名</h4>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: 店長（公式）, SNS担当者"
              className="w-full px-6 py-5 bg-stone-50 border border-stone-100 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/5 outline-none rounded-3xl text-stone-800 font-bold placeholder-stone-300 transition-all shadow-sm"
            />
            <p className="text-[10px] text-stone-400 font-medium ml-1">
              AIが「誰になりきって」投稿するかを決める最も基本的な設定です。
            </p>
          </div>
        </div>

        {isIconSelectorOpen && (
          <div className="p-6 bg-stone-50/50 rounded-[2.5rem] border border-stone-100 animate-in zoom-in-95 duration-300 overflow-hidden">
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {AVATAR_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => { setAvatar(opt.id); setIsIconSelectorOpen(false); }}
                  className={`aspect-square rounded-2xl flex items-center justify-center transition-all ${avatar === opt.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border border-stone-100 text-stone-400 hover:text-stone-600 hover:border-stone-200'}`}
                  title={opt.label}
                >
                  {React.createElement(opt.icon, { className: "w-6 h-6" })}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-[2.5rem] border border-indigo-100/50 space-y-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
          <SparklesIcon className="w-24 h-24 text-indigo-600" />
        </div>
        <div className="relative z-10">
          <h4 className="text-stone-900 font-black tracking-tight mb-2">Bunshin スタイルについて</h4>
          <p className="text-sm text-stone-600 leading-relaxed max-w-lg font-medium">
            名前とアイコンを設定するだけで、AIはそのキャラクターに基づいたトーンを選択します。<br />
            さらに個別の癖を覚えさせたい場合は、隣の「学習データ」から投稿例を追加してください。
          </p>
        </div>
      </div>
    </div>
  );

  const renderLearningTab = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] block">Training Data</label>
          <h4 className="font-black text-stone-900 tracking-tighter text-lg">学習データ・ベース</h4>
        </div>
        <button
          onClick={() => { setModalText(''); setExpandingPlatform(Platform.General); }}
          className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100 active:scale-95"
        >
          <PlusIcon className="w-4 h-4" />
          <span>新しい文章を学習</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentPresetSamples.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
            <div className="w-20 h-20 rounded-[2.5rem] bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-200">
              <BookOpenIcon className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <p className="font-black text-stone-900 tracking-widest uppercase text-xs">No Learning Data</p>
              <p className="text-[11px] font-bold text-stone-500">過去の投稿を学習させて「あなたらしさ」を高めましょう</p>
            </div>
          </div>
        ) : (
          currentPresetSamples.map((item, idx) => (
            <div
              key={item.id}
              className="group p-5 bg-white border border-stone-100 rounded-[2rem] shadow-sm hover:shadow-md hover:border-indigo-100 transition-all flex flex-col justify-between min-h-[160px] relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {item.platform.split(',').map(p => {
                      const plat = p.trim() as Platform;
                      return (
                        <div key={plat} className="p-1 rounded-md bg-stone-50 text-stone-400 group-hover:text-indigo-500 transition-colors">
                          {plat === Platform.X && <XIcon className="w-3 h-3" />}
                          {plat === Platform.Instagram && <InstagramIcon className="w-3 h-3" />}
                          {plat === Platform.Line && <LineIcon className="w-3 h-3" />}
                          {plat === Platform.GoogleMaps && <GoogleMapsIcon className="w-3 h-3" />}
                          {plat === Platform.General && <SparklesIcon className="w-3 h-3" />}
                        </div>
                      );
                    })}
                  </div>
                  <span className="text-[9px] font-black text-stone-300 uppercase tracking-widest">
                    {item.source || 'manual'}
                  </span>
                </div>
                <p className="text-sm text-stone-600 font-bold leading-relaxed line-clamp-4">
                  {item.content}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                <button
                  onClick={() => {
                    setModalText(item.content);
                    setEditingSampleId(item.id);
                    setExpandingPlatform(item.platform as any);
                    setSelectedPlatforms(item.platform.split(',').map(p => p.trim()) as any);
                  }}
                  className="p-2 text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                >
                  <MagicWandIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onToggleTraining(item.content, item.platform as any, item.presetId, undefined, 'manual')}
                  className="p-2 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderRulesTab = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] block">Platform Rules</label>
          <h4 className="font-black text-stone-900 tracking-tighter text-lg">プロンプト詳細指示</h4>
        </div>

        <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-2xl border border-stone-200 shadow-inner">
          <button
            onClick={async () => {
              const instruction = await performPersonaAnalysis();
              if (instruction) handleSave(typeof instruction === 'object' ? instruction : JSON.parse(instruction));
            }}
            disabled={isAnalyzingPersona || currentPresetSamples.length === 0}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[11px] transition-all shadow-sm ${isAnalyzingPersona ? 'bg-white text-indigo-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-indigo-200'}`}
          >
            {isAnalyzingPersona ? <div className="w-3 h-3 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /> : <MagicWandIcon className="w-4 h-4" />}
            <span>AI自動生成</span>
          </button>
          <button
            onClick={() => {
              const current = customPrompts[activePromptTab] || '';
              if (!current.trim()) return;
              if (!confirm('全プラットフォームに反映しますか？')) return;
              const next = { ...customPrompts };
              [Platform.X, Platform.Instagram, Platform.Line, Platform.GoogleMaps].forEach(p => next[p] = current);
              setCustomPrompts(next);
            }}
            className="px-4 py-2.5 font-black text-[11px] text-stone-500 hover:text-stone-900 transition-colors"
          >
            一括適用
          </button>
        </div>
      </div>

      <div className="bg-stone-50 border border-stone-100 rounded-[2.5rem] overflow-hidden">
        <div className="flex border-b border-stone-100 bg-white/50">
          {[Platform.X, Platform.Instagram, Platform.Line, Platform.GoogleMaps].map(p => (
            <button
              key={p}
              onClick={() => setActivePromptTab(p)}
              className={`flex-1 py-4 text-[11px] font-black transition-all border-b-2 ${activePromptTab === p ? 'text-indigo-600 border-indigo-600 bg-white' : 'text-stone-400 border-transparent hover:text-stone-600'}`}
            >
              {p === Platform.GoogleMaps ? 'G-Maps' : p}
            </button>
          ))}
        </div>

        <div className="p-8">
          <AutoResizingTextarea
            value={customPrompts[activePromptTab] || ''}
            onChange={(val) => setCustomPrompts(prev => ({ ...prev, [activePromptTab]: val }))}
            placeholder={`${activePromptTab} で投稿を生成する際の「こだわり」を入力してください。例：ハッシュタグを末尾にいれる、絵文字は控えめに、など`}
            className="w-full min-h-[240px] bg-transparent outline-none text-stone-800 font-bold leading-relaxed placeholder-stone-200 resize-none no-scrollbar text-base"
          />
        </div>
      </div>

      <p className="text-[10px] text-stone-400 font-medium px-4 leading-relaxed">
        ※学習データがある場合、AIはまず過去の書き方を参考にします。この詳細ルールには、学習データだけでは補いきれない「禁止事項」や「必ず入れてほしいキーワード」などを指定するのが効果的です。
      </p>
    </div>
  );

  const modalBody = (
    <div className="flex h-full bg-stone-50 overflow-hidden text-stone-900 font-inter">
      {/* SIDEBAR */}
      <div className={`w-full md:w-[320px] lg:w-[380px] shrink-0 bg-stone-50 border-r border-stone-100 flex flex-col ${mobileView === 'list' ? 'flex' : 'hidden md:flex'}`}>
        <div className="px-6 py-5 md:px-8 md:py-7 flex items-center justify-between bg-white/40">
          <div className="space-y-0.5">
            <h2 className="text-xl font-black tracking-tight text-stone-900">Bunshin</h2>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Profile Manager</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleStartNew}
              className="w-10 h-10 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-stone-900 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all active:scale-95"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="md:hidden w-10 h-10 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-900 transition-all"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-3 no-scrollbar">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={orderedPresets.map(p => p.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {orderedPresets.map(p => (
                  <SortablePresetRow
                    key={p.id}
                    preset={p}
                    deletingId={deletingId}
                    isReordering={isReordering}
                    onSelect={(id) => { setSelectedPresetId(id); setMobileView('edit'); }}
                    onDelete={handleDeletePreset}
                    isSelected={selectedPresetId === p.id}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {orderedPresets.length === 0 && (
            <div className="py-20 text-center opacity-40">
              <ClockIcon className="w-10 h-10 mx-auto mb-4 text-stone-200" />
              <p className="text-xs font-bold text-stone-500">プロフィールがありません</p>
            </div>
          )}
        </div>
      </div>

      {/* MAIN VIEW */}
      <div className={`flex-1 flex flex-col bg-white overflow-hidden shadow-2xl relative z-10 ${mobileView === 'edit' ? 'flex' : 'hidden md:flex'}`}>
        {/* Sub Header (Tabs) */}
        <div className="px-6 py-4 md:px-8 md:py-6 border-b border-stone-100 flex items-center justify-between bg-white relative z-10 shrink-0">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 -mb-1">
            <button
              onClick={() => setActiveSubTab('profile')}
              className={`px-4 py-3 text-[10px] md:text-xs font-black transition-all border-b-2 tracking-widest whitespace-nowrap ${activeSubTab === 'profile' ? 'text-indigo-600 border-indigo-600' : 'text-stone-400 border-transparent hover:text-stone-600'}`}
            >
              PROFILE
            </button>
            <button
              onClick={() => setActiveSubTab('learning')}
              className={`px-4 py-3 text-[10px] md:text-xs font-black transition-all border-b-2 tracking-widest whitespace-nowrap ${activeSubTab === 'learning' ? 'text-indigo-600 border-indigo-600' : 'text-stone-400 border-transparent hover:text-stone-600'}`}
            >
              LEARNING
            </button>
            <button
              onClick={() => setActiveSubTab('rules')}
              className={`px-4 py-3 text-[10px] md:text-xs font-black transition-all border-b-2 tracking-widest whitespace-nowrap ${activeSubTab === 'rules' ? 'text-indigo-600 border-indigo-600' : 'text-stone-400 border-transparent hover:text-stone-600'}`}
            >
              RULES
            </button>
          </div>

          <div className="flex items-center gap-2 ml-4 shrink-0">
            {mobileView === 'edit' && (
              <button
                onClick={() => setMobileView('list')}
                className="md:hidden w-10 h-10 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-950 transition-all"
                title="一覧に戻る"
              >
                <ChevronDownIcon className="w-5 h-5 rotate-90" />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
              title="閉じる"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 no-scrollbar pb-32">
          {activeSubTab === 'profile' && renderProfileTab()}
          {activeSubTab === 'learning' && renderLearningTab()}
          {activeSubTab === 'rules' && renderRulesTab()}
        </div>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-8 pt-4 bg-gradient-to-t from-white via-white to-white/0 pointer-events-none">
          <div className="max-w-4xl mx-auto flex gap-4 pointer-events-auto">
            {!selectedPresetId ? (
              <button
                onClick={() => handleSave()}
                disabled={isSaving || !name.trim()}
                className="flex-1 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-[2rem] font-black text-sm tracking-[0.2em] shadow-xl shadow-indigo-100 hover:opacity-90 active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
              >
                {isSaving ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <SaveIcon className="w-5 h-5" />}
                <span>CREATE PROFILE</span>
              </button>
            ) : (
              <div className="flex-1 flex gap-3">
                <button
                  onClick={() => handleSave()}
                  disabled={isSaving || !name.trim()}
                  className="flex-1 py-5 bg-stone-900 text-white rounded-[2rem] font-black text-sm tracking-[0.2em] shadow-xl shadow-stone-100 hover:bg-indigo-600 active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
                >
                  {isSaving ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <SaveIcon className="w-5 h-5" />}
                  <span>UPDATE</span>
                </button>
                <button
                  onClick={handleApplyCurrent}
                  className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-[2rem] font-black text-sm tracking-[0.2em] shadow-xl shadow-indigo-100 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <MagicWandIcon className="w-5 h-5" />
                  <span>APPLY</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSuccessToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-top-4 duration-500">
          <div className="bg-stone-900 text-white px-8 py-3 rounded-full font-black text-xs tracking-widest uppercase shadow-2xl flex items-center gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            SAVED SUCCESSFULLY
          </div>
        </div>
      )}
    </div>
  );

  const mainPortal = createPortal(
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-8">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-950/20 backdrop-blur-md animate-in fade-in duration-500" onClick={onClose} />

      {/* Container */}
      <div className="w-full max-w-7xl h-full md:max-h-[850px] bg-white md:rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-700 relative z-10 flex flex-col border border-stone-100">
        {modalBody}
      </div>
    </div>,
    document.body
  );

  // Focus Mode Overlay (Learning Editor)
  const focusModeOverlay = expandingPlatform && createPortal(
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-0 md:p-8">
      <div className="absolute inset-0 bg-indigo-950/20 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setExpandingPlatform(null)} />

      <div className="w-full max-w-4xl h-full md:max-h-[700px] bg-white md:rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 relative z-10 flex flex-col">
        <div className="p-8 md:p-10 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
              <MagicWandIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-xl text-stone-900 tracking-tight">{editingSampleId ? '学習データの編集' : '新しい学習データ'}</h3>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Training Focus</p>
            </div>
          </div>
          <button onClick={() => setExpandingPlatform(null)} className="p-3 text-stone-300 hover:text-stone-900 transition-colors">
            <CloseIcon className="w-7 h-7" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Platform Selection</span>
              <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">複数選択可</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[Platform.General, Platform.Instagram, Platform.X, Platform.Line, Platform.GoogleMaps].map(p => {
                const isSelected = selectedPlatforms.includes(p);
                return (
                  <button
                    key={p}
                    onClick={() => {
                      if (isSelected) {
                        if (selectedPlatforms.length > 1) setSelectedPlatforms(selectedPlatforms.filter(item => item !== p));
                      } else {
                        setSelectedPlatforms([...selectedPlatforms, p]);
                      }
                    }}
                    className={`px-6 py-3 rounded-2xl text-[11px] font-black tracking-widest transition-all ${isSelected ? 'bg-stone-900 text-white shadow-lg' : 'bg-stone-50 text-stone-400 hover:bg-stone-100 border border-stone-100'}`}
                  >
                    {p === Platform.General ? '共通スタイル' : p}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Custom Content</span>
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 text-[10px] font-black text-indigo-600 hover:opacity-70"
                >
                  <TieIcon className="w-3.5 h-3.5" />
                  スクショ解析
                </button>
                <button
                  onClick={async () => {
                    setIsSanitizing(true);
                    const res = await fetch('/api/ai/sanitize', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: modalText }) });
                    const data = await res.json();
                    if (data.ok) setModalText(data.sanitized);
                    setIsSanitizing(false);
                  }}
                  disabled={isSanitizing || !modalText.trim()}
                  className="flex items-center gap-2 text-[10px] font-black text-indigo-600 hover:opacity-70 disabled:opacity-30"
                >
                  <SparklesIcon className="w-3.5 h-3.5" />
                  AI伏せ字
                </button>
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-100 rounded-[2.5rem] p-8">
              <AutoResizingTextarea
                autoFocus
                value={modalText}
                onChange={setModalText}
                placeholder="ここに過去の投稿内容を貼り付けるか、AIに学ばせたい文章を入力してください..."
                className="w-full min-h-[300px] bg-transparent outline-none text-stone-800 font-bold leading-relaxed placeholder-stone-200 resize-none no-scrollbar text-lg"
              />
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-stone-100 flex justify-end">
          <button
            onClick={() => handleToggleTrainingInternal(modalText, selectedPlatforms)}
            disabled={isTrainingLoading || !modalText.trim()}
            className="w-full md:w-auto px-12 py-5 bg-stone-900 text-white rounded-[2rem] font-black text-sm tracking-[0.2em] shadow-xl hover:bg-indigo-600 active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
          >
            {isTrainingLoading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <SaveIcon className="w-5 h-5" />}
            <span>SAVE TRAINING DATA</span>
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onloadend = async () => {
              const res = await fetch('/api/ai/analyze-screenshot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: reader.result as string, mimeType: file.type, platform: expandingPlatform }) });
              const data = await res.json();
              if (data.ok) setModalText(prev => prev + (prev.trim() ? '\n---\n' : '') + data.text);
            };
            reader.readAsDataURL(file);
          }}
        />
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
