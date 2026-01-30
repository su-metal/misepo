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
  PencilIcon,
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
  ChevronLeftIcon,
  ChevronRightIcon,
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

const SampleSlider = ({
  samples,
  mode,
  onEdit,
  onDelete
}: {
  samples: TrainingItem[],
  mode: 'sns' | 'maps',
  onEdit: (item: TrainingItem) => void,
  onDelete: (item: TrainingItem) => void
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const width = scrollRef.current.clientWidth;
    if (width === 0) return;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < samples.length) {
      setCurrentIndex(newIndex);
    }
  };

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current || index < 0 || index >= samples.length) return;
    const width = scrollRef.current.clientWidth;
    scrollRef.current.scrollTo({ left: index * width, behavior: 'smooth' });
  };

  if (samples.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
        <div className="w-16 h-16 rounded-[2rem] bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-200">
          <BookOpenIcon className="w-8 h-8" />
        </div>
        <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">No Data</p>
      </div>
    );
  }

  return (
    <div className="relative group/slider mt-4">
      {/* Pagination Guide */}
      <div className="absolute -top-10 right-2 flex items-center gap-2">
        <span className="text-[10px] font-black text-stone-400 tracking-[0.2em] font-mono bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100">
          {currentIndex + 1}<span className="text-stone-300 mx-1">/</span>{samples.length}
        </span>
      </div>

      <div className="relative flex items-center overflow-hidden rounded-[2.5rem]">
        {/* Left Arrow Overlay - High Contrast */}
        <button
          onClick={() => scrollToIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
          className={`absolute left-2 w-11 h-11 rounded-full bg-stone-900 text-white flex items-center justify-center transition-all shadow-xl active:scale-95 disabled:opacity-0 disabled:pointer-events-none z-30 ring-4 ring-white/10`}
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="w-full overflow-x-auto snap-x snap-mandatory no-scrollbar flex pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {samples.map((item) => (
            <div
              key={item.id}
              className="snap-center shrink-0 w-full group p-8 md:p-12 bg-white border border-stone-50 rounded-[2.5rem] shadow-sm hover:shadow-md hover:border-indigo-100 transition-all flex flex-col justify-between min-h-[180px] relative overflow-hidden"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest ${mode === 'sns' ? 'bg-indigo-50 text-indigo-400' : 'bg-teal-50 text-teal-500'}`}>
                    {mode === 'sns' ? 'SNS Post' : 'Review Reply'}
                  </span>
                  <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">
                    {item.source || 'manual'}
                  </span>
                </div>
                <p className="text-base text-stone-600 font-bold leading-relaxed line-clamp-4 px-2">
                  {item.content}
                </p>
              </div>

              <div className="mt-8 flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                <button
                  onClick={() => onEdit(item)}
                  className="p-3 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all border border-transparent hover:border-indigo-100"
                  title="詳細を表示"
                >
                  <BookOpenIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(item)}
                  className="p-3 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all border border-transparent hover:border-rose-100"
                  title="削除"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow Overlay - High Contrast */}
        <button
          onClick={() => scrollToIndex(currentIndex + 1)}
          disabled={currentIndex === samples.length - 1}
          className={`absolute right-2 w-11 h-11 rounded-full bg-stone-900 text-white flex items-center justify-center transition-all shadow-xl active:scale-95 disabled:opacity-0 disabled:pointer-events-none z-30 ring-4 ring-white/10`}
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
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
  const [isInternalSaving, setIsInternalSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [orderedPresets, setOrderedPresets] = useState<Preset[]>([]);
  const [isReordering, setIsReordering] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'edit'>('list');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
  const [expandingPlatform, setExpandingPlatform] = useState<Platform | null>(null);
  const [modalText, setModalText] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([Platform.General]);
  const [isTrainingLoading, setIsTrainingLoading] = useState(false);
  const [isSanitizing, setIsSanitizing] = useState(false);
  const [learningMode, setLearningMode] = useState<'sns' | 'maps'>('sns');
  const [isAnalyzingPersona, setIsAnalyzingPersona] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [viewingSampleId, setViewingSampleId] = useState<string | null>(null);

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

  useEffect(() => {
    // setIsStyleExpanded(false); // Removed
  }, [learningMode, selectedPresetId]);

  const handleStartNew = () => {
    setSelectedPresetId(null);
    setMobileView('edit');
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

  const performPersonaAnalysis = async (overrideSamples?: { content: string, platform: string }[]): Promise<any> => {
    // Current target platform based on tab mode
    const targetKey = learningMode === 'maps' ? Platform.GoogleMaps : 'General';

    // Filter samples relevant to the current mode
    // SNS mode: Includes X, Instagram, Line, General
    // Maps mode: Includes GoogleMaps
    const samplesToUse = overrideSamples || trainingItems
      .filter(item => {
        const p = item.presetId === (selectedPresetId || 'omakase');
        const plats = item.platform.split(',').map(s => s.trim());
        const isMaps = plats.includes(Platform.GoogleMaps);
        if (learningMode === 'maps') return p && isMaps;
        return p && !isMaps;
      })
      .map(item => ({
        content: item.content,
        platform: item.platform
      }));

    if (samplesToUse.length === 0) return null;

    setIsAnalyzingPersona(true);
    try {
      const res = await fetch('/api/ai/analyze-persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ samples: samplesToUse }),
      });
      const data = await res.json();
      if (data.instruction) {
        let instruction = data.instruction;
        const newPrompts = { ...customPrompts };

        // Helper to extract string content
        let contentToApply = '';

        if (typeof instruction === 'string' && !instruction.trim().startsWith('{')) {
          contentToApply = instruction;
        } else {
          try {
            const parsed = typeof instruction === 'string' ? JSON.parse(instruction) : instruction;
            if (learningMode === 'sns') {
              contentToApply = parsed.General || (typeof instruction === 'string' ? instruction : JSON.stringify(instruction));
            } else {
              contentToApply = parsed.GoogleMaps || (typeof instruction === 'string' ? instruction : JSON.stringify(instruction));
            }
          } catch (e) {
            contentToApply = typeof instruction === 'string' ? instruction : JSON.stringify(instruction);
          }
        }

        // Apply to Targets
        if (learningMode === 'sns') {
          newPrompts['General'] = contentToApply;
          newPrompts[Platform.X] = contentToApply;
          newPrompts[Platform.Instagram] = contentToApply;
          newPrompts[Platform.Line] = contentToApply;
        } else {
          newPrompts[Platform.GoogleMaps] = contentToApply;
        }

        setCustomPrompts(newPrompts);
        return newPrompts;
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

    const platformString = platforms.join(', ') as any;

    setIsTrainingLoading(true);
    try {
      await onToggleTraining(normalizedText, platformString, presetId, undefined, 'manual');

      // Close overlay immediately for better UX
      setExpandingPlatform(null);
      setModalText('');

      // Construct optimistic samples for immediate analysis
      let newSamples = trainingItems
        .filter(item => item.presetId === presetId)
        .map(item => ({ content: item.content, platform: item.platform }));

      newSamples.push({ content: normalizedText, platform: platformString });

      // Trigger Auto-Analysis
      setIsAnalyzingPersona(true); // Show spinner immediately
      const newStyle = await performPersonaAnalysis(newSamples);

      if (newStyle && name.trim()) {
        // Auto-save the new style to the preset if we have a name
        // We pass the newStyle as overridePrompts to handleSave
        // Note: handleSave expects {[key:string]: string}.
        // performPersonaAnalysis returns object or string. We normalized it to return object above.
        await handleSave(newStyle as any);
      }

    } catch (err: any) {
      alert(`保存に失敗しました: ${err.message}`);
    } finally {
      setIsTrainingLoading(false);
      setIsAnalyzingPersona(false);
    }
  };

  const handleResetLearningForMode = async (mode: 'sns' | 'maps') => {
    const presetId = selectedPresetId || 'omakase';
    if (!confirm(`${mode === 'sns' ? 'SNS投稿' : 'マップ返信'}の全学習データを削除してもよろしいですか？この操作は取り消せません。`)) return;

    setIsResetting(true);
    try {
      const platform = mode === 'sns' ? 'sns_all' : Platform.GoogleMaps;
      const res = await fetch(`/api/me/learning?presetId=${presetId}&platform=${platform}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to reset learning');

      window.location.reload();
    } catch (err) {
      console.error('Failed to reset learning:', err);
      alert('リセットに失敗しました。');
    } finally {
      setIsResetting(false);
    }
  };

  const currentPresetSamples = useMemo(() => {
    return trainingItems.filter(item => item.presetId === (selectedPresetId || 'omakase'));
  }, [trainingItems, selectedPresetId]);

  // Tabbed Content Renders
  const renderProfileTab = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-6">
        <div className="shrink-0">
          <button
            onClick={() => setIsIconSelectorOpen(!isIconSelectorOpen)}
            className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm hover:shadow-md transition-all active:scale-95 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-indigo-500/5 group-hover:to-indigo-500/10 transition-all" />
            <div className="relative transform group-hover:scale-110 transition-transform">
              {renderAvatarIcon(avatar, "w-8 h-8")}
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-white rounded-full border border-stone-100 flex items-center justify-center text-stone-400 shadow-sm translate-x-1/4 translate-y-1/4">
              <ChevronDownIcon className={`w-2.5 h-2.5 transition-transform ${isIconSelectorOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-black text-stone-400 uppercase tracking-[0.2em] ml-1">Profile Name</h4>
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例: 店長（公式）, SNS担当者"
            className="w-full px-5 py-4 bg-stone-50 border border-stone-100 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/5 outline-none rounded-2xl text-stone-800 font-bold placeholder-stone-300 transition-all shadow-sm text-sm"
          />
        </div>
      </div>

      {isIconSelectorOpen && (
        <div className="p-5 bg-stone-50/50 rounded-[2rem] border border-stone-100 animate-in zoom-in-95 duration-300">
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
            {AVATAR_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => { setAvatar(opt.id); setIsIconSelectorOpen(false); }}
                className={`aspect-square rounded-xl flex items-center justify-center transition-all ${avatar === opt.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border border-stone-100 text-stone-400 hover:text-stone-600 hover:border-stone-200'}`}
                title={opt.label}
              >
                {React.createElement(opt.icon, { className: "w-5 h-5" })}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderLearningAndStyleTab = () => {
    const snsSamples = currentPresetSamples.filter(item => !item.platform.includes(Platform.GoogleMaps));
    const mapsSamples = currentPresetSamples.filter(item => item.platform.includes(Platform.GoogleMaps));

    const renderSampleSection = (title: string, samples: TrainingItem[], mode: 'sns' | 'maps', icon: React.ReactNode, accentClass: string, bgClass: string) => (
      <div className={`p-8 ${bgClass} rounded-[2.5rem] border ${accentClass} space-y-6 relative overflow-hidden group`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="text-stone-400">{icon}</div>
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] block">Learning Category</label>
            </div>
            <h4 className="font-black text-stone-900 tracking-tighter text-lg">{title}</h4>
          </div>
          <button
            onClick={() => {
              setModalText('');
              setLearningMode(mode);
              setExpandingPlatform(mode === 'sns' ? Platform.General : Platform.GoogleMaps);
              setSelectedPlatforms(mode === 'sns' ? [Platform.General] : [Platform.GoogleMaps]);
            }}
            className={`flex items-center gap-2 px-6 py-3 border text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg active:scale-95 ${mode === 'sns' ? 'bg-stone-900 border-stone-900 hover:bg-indigo-600 hover:border-indigo-600 shadow-indigo-100' : 'bg-teal-700 border-teal-700 hover:bg-teal-600 hover:border-teal-600 shadow-teal-100'}`}
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Data</span>
          </button>
        </div>

        <SampleSlider
          samples={samples}
          mode={mode}
          onEdit={(item) => {
            setModalText(item.content);
            setLearningMode(mode);
            setViewingSampleId(item.id);
            setExpandingPlatform(item.platform as any);
          }}
          onDelete={(item) => onToggleTraining(item.content, item.platform as any, item.presetId, undefined, 'manual')}
        />

        {samples.length > 0 && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => handleResetLearningForMode(mode)}
              className="flex items-center gap-2 px-6 py-3 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95"
            >
              <RotateCcwIcon className="w-3.5 h-3.5" />
              <span>Reset {mode.toUpperCase()} Data</span>
            </button>
          </div>
        )}
      </div>
    );

    return (
      <div className="space-y-12">
        <div className="flex items-center justify-between px-1">
          <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] block">2. Learning & Style</label>

          <div className="flex p-1 bg-stone-100 rounded-2xl border border-stone-200 shadow-inner overflow-hidden">
            <button
              onClick={() => setLearningMode('sns')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${learningMode === 'sns' ? 'bg-white text-indigo-600 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
            >
              SNS
            </button>
            <button
              onClick={() => setLearningMode('maps')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${learningMode === 'maps' ? 'bg-white text-teal-600 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
            >
              G-MAPS
            </button>
          </div>
        </div>

        <div className="animate-in fade-in duration-500">
          {learningMode === 'sns' ? (
            renderSampleSection(
              'SNS Identity',
              snsSamples,
              'sns',
              <SparklesIcon className="w-4 h-4" />,
              'border-indigo-100/50',
              'bg-gradient-to-br from-indigo-500/5 to-purple-500/5'
            )
          ) : (
            renderSampleSection(
              'Maps Replies',
              mapsSamples,
              'maps',
              <GoogleMapsIcon className="w-4 h-4" />,
              'border-teal-100/50',
              'bg-gradient-to-br from-teal-500/5 to-emerald-500/5'
            )
          )}
        </div>
      </div>
    );
  };


  const modalBody = (
    <div className="flex h-full bg-stone-50 overflow-hidden text-stone-900 font-inter">
      {/* SIDEBAR */}
      <div className={`w-full md:w-[320px] lg:w-[380px] shrink-0 bg-stone-50 border-r border-stone-100 flex flex-col ${mobileView === 'list' ? 'flex' : 'hidden md:flex'}`}>
        <div className="px-8 py-8 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-stone-900 leading-none">分身</h2>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">Profiles</p>
          </div>
          <button
            onClick={onClose}
            className="md:hidden w-10 h-10 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-900 shadow-sm transition-all"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="px-8 pb-4 flex items-center justify-between">
          <label className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Select Profile</label>
          <button
            onClick={handleStartNew}
            className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Add New</span>
          </button>
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
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md relative z-10 shrink-0 border-b border-stone-100 flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            {mobileView === 'edit' && (
              <button
                onClick={() => setMobileView('list')}
                className="md:hidden w-10 h-10 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-900 shadow-sm transition-all mr-1"
              >
                <ChevronDownIcon className="w-5 h-5 rotate-90" />
              </button>
            )}

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                {renderAvatarIcon(avatar, "w-5 h-5")}
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-black text-stone-300 uppercase tracking-[0.2em] block leading-none mb-1">Editing Profile</span>
                <h4 className="text-sm font-black text-stone-900 tracking-tight truncate max-w-[120px] md:max-w-[200px] leading-none">{name || 'Unnamed Profile'}</h4>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-all font-bold"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Combined Scrollable Content View */}
        <div className="flex-1 overflow-y-auto p-8 md:p-10 no-scrollbar pb-32 bg-stone-50/30">
          <div className="max-w-4xl mx-auto space-y-8">
            {renderProfileTab()}
            <div className="h-px bg-stone-100/30 w-full" />
            {renderLearningAndStyleTab()}
          </div>
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

        {showSuccessToast && (
          <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-top-4 duration-500">
            <div className="bg-stone-900 text-white px-8 py-3 rounded-full font-black text-xs tracking-widest uppercase shadow-2xl flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              SAVED SUCCESSFULLY
            </div>
          </div>
        )}
      </div>
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
              {viewingSampleId ? <BookOpenIcon className="w-6 h-6" /> : <MagicWandIcon className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-black text-xl text-stone-900 tracking-tight">
                {viewingSampleId ? '学習データの詳細' : '新しい学習データ'}
              </h3>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Training Focus</p>
            </div>
          </div>
          <button
            onClick={() => {
              setExpandingPlatform(null);
              setViewingSampleId(null);
            }}
            className="p-3 text-stone-300 hover:text-stone-900 transition-colors"
          >
            <CloseIcon className="w-7 h-7" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="space-y-1">
                <h4 className="font-black text-stone-900 tracking-tight text-sm">
                  {learningMode === 'sns' ? '普段の投稿文を入力' : '過去の返信内容を入力'}
                </h4>
                <p className="text-[10px] text-stone-500 font-medium">
                  {learningMode === 'sns' ? 'X, Instagram, LINEなどの投稿をそのまま貼り付けてください。' : 'Googleマップでの口コミへの返信文を貼り付けてください。'}
                </p>
              </div>
              <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${learningMode === 'sns' ? 'bg-indigo-50 text-indigo-500' : 'bg-teal-50 text-teal-600'}`}>
                {learningMode === 'sns' ? 'For SNS' : 'For Maps'}
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]"></span>
              {!viewingSampleId && (
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
              )}
            </div>

            <div className="bg-stone-50 border border-stone-100 rounded-[2.5rem] p-8">
              <AutoResizingTextarea
                autoFocus={!viewingSampleId}
                readOnly={!!viewingSampleId}
                value={modalText}
                onChange={setModalText}
                placeholder={learningMode === 'sns' ? "例：今日は雨だけど元気に営業中！足元に気をつけて来てね☔️ #カフェ" : "例：高評価ありがとうございます！またのご来店を心よりお待ちしております。"}
                className="w-full min-h-[300px] bg-transparent outline-none text-stone-800 font-bold leading-relaxed placeholder-stone-200 resize-none no-scrollbar text-lg"
              />
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-stone-100 flex justify-end">
          {viewingSampleId ? (
            <button
              onClick={() => {
                setExpandingPlatform(null);
                setViewingSampleId(null);
              }}
              className="w-full md:w-auto px-12 py-5 bg-stone-900 text-white rounded-[2rem] font-black text-sm tracking-[0.2em] shadow-xl hover:bg-stone-800 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <CloseIcon className="w-5 h-5" />
              <span>CLOSE</span>
            </button>
          ) : (
            <button
              onClick={() => handleToggleTrainingInternal(modalText, selectedPlatforms)}
              disabled={isTrainingLoading || !modalText.trim()}
              className="w-full md:w-auto px-12 py-5 bg-stone-900 text-white rounded-[2rem] font-black text-sm tracking-[0.2em] shadow-xl hover:bg-indigo-600 active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
            >
              {isTrainingLoading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <SaveIcon className="w-5 h-5" />}
              <span>SAVE TRAINING DATA</span>
            </button>
          )}
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
