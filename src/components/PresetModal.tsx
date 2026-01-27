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
  LineIcon,
  BookOpenIcon,
} from './Icons';
import { Platform, Preset, TrainingItem } from '../types';
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
  const [customPrompts, setCustomPrompts] = useState<{ [key: string]: string }>({});
  const [activePromptTab, setActivePromptTab] = useState<Platform>(Platform.X);
  const [isInternalSaving, setIsInternalSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [orderedPresets, setOrderedPresets] = useState<Preset[]>([]);
  const [isReordering, setIsReordering] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'edit'>('list');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showOrderSuccessToast, setShowOrderSuccessToast] = useState(false);
  const [expandingPlatform, setExpandingPlatform] = useState<Platform | null>(null);
  const [editingSampleId, setEditingSampleId] = useState<string | null>(null);
  const [isTrainingLoading, setIsTrainingLoading] = useState(false);
  const [trainingError, setTrainingError] = useState<string | null>(null);
  const [modalText, setModalText] = useState('');
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  const [isSanitizing, setIsSanitizing] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [isAnalyzingPersona, setIsAnalyzingPersona] = useState(false);
  const [personaYaml, setPersonaYaml] = useState<string | null>(null);
  const [hasUnanalyzedChanges, setHasUnanalyzedChanges] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([Platform.General]);
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

  // Initialize state when editing an existing preset
  useEffect(() => {
    if (selectedPresetId) {
      const preset = presets.find(p => p.id === selectedPresetId);
      if (preset) {
        setName(preset.name);
        setAvatar(preset.avatar || 'shop');

        // Parse custom_prompt (supports legacy string or new JSON format)
        try {
          if (preset.custom_prompt) {
            if (preset.custom_prompt.trim().startsWith('{')) {
              const parsed = JSON.parse(preset.custom_prompt);
              setCustomPrompts(parsed);

              // Migration: If 'General' exists, and specific platforms don't, copy 'General' to them
              if (parsed['General']) {
                const updated = { ...parsed };
                [Platform.X, Platform.Instagram, Platform.Line, Platform.GoogleMaps].forEach(p => {
                  if (!updated[p]) updated[p] = parsed['General'];
                });
                delete updated['General'];
                setCustomPrompts(updated);
              }
            } else {
              // Legacy string: Apply to all platforms
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
        setActivePromptTab(Platform.X); // Reset tab to X

        // Initialize Learning Data
        // ... (existing logic)
        const relevantItems = trainingItems.filter(item => item.presetId === preset.id);
        const map: { [key in Platform]?: string } = {};
        relevantItems.forEach(item => {
          // ... (existing logic)
        });
        // We use the aggregated map logic same as handleSave but for display? 
        // Actually, PresetModal uses `trainingItems` directly for the "AI Profile" list.
        // But for `presetSamples` state (if used elsewhere), we might populate it.
        // Current implementation seems to assume `trainingItems` is the source of truth for the list.
      }
    } else {
      // New Preset
      setName('');
      setAvatar('shop');
      setCustomPrompts({});
    }
    setPersonaYaml(null);
    setHasUnanalyzedChanges(false);
    setMobileView('edit');
  }, [selectedPresetId, presets, trainingItems]);


  const handleLoadPreset = (id: string) => {
    const preset = presets.find((p) => p.id === id);
    if (preset) {
      setSelectedPresetId(id);
      // The useEffect above will handle setting name, avatar, customPrompts, etc.
    }
  };

  const handleStartNew = () => {
    setSelectedPresetId(null);
    // The useEffect above will handle setting name, avatar, customPrompts, etc.
  };

  const handleSave = async (overridePrompts?: { [key: string]: string }) => {
    if (!name.trim()) return;
    setIsInternalSaving(true);
    try {
      // Logic to handle auto-analysis if needed (updating customPrompts active tab)
      // For now, let's keep it simple: Save what's in the state.

      // Fix: Use overridden leads (from immediate analysis) or current state
      let finalCustomPrompts = overridePrompts ? { ...customPrompts, ...overridePrompts } : { ...customPrompts };

      // Reconstruct post_samples from trainingItems to ensure DB sync
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

      // Serialize customPrompts
      // Filter out empty strings to keep JSON clean
      const cleanedPrompts: { [key: string]: string } = {};
      Object.entries(finalCustomPrompts).forEach(([k, v]) => {
        if (v && v.trim()) cleanedPrompts[k] = v.trim();
      });
      const customPromptJSON = Object.keys(cleanedPrompts).length > 0 ? JSON.stringify(cleanedPrompts) : null;

      const result = await onSave({
        id: selectedPresetId || undefined,
        name,
        avatar,
        custom_prompt: customPromptJSON, // Save as JSON string
        persona_yaml: null,
        post_samples: newPostSamples,
      });

      // MIGRATION / COPY LOGIC:
      // If we just created a NEW preset, the training items are currently orphaned in 'omakase' (or the source preset).
      // We must COPY them to the new preset ID so they appear in the list.
      if (!selectedPresetId && result && 'id' in result && result.id) {
        console.log('[PresetModal] New preset created. Migrating learning items...', result.id);
        const newId = result.id;

        // Copy all currently visible items to the new ID
        // We run this in parallel for speed, but catching errors individually
        await Promise.all(relatedItems.map(async (item) => {
          try {
            // Pass 'manual' or keep original source? 'manual' is safer to ensure it sticks.
            await onToggleTraining(item.content, item.platform as any, newId, undefined, item.source || 'manual');
          } catch (e) {
            console.error('Failed to migrate item:', item.id, e);
          }
        }));

        // Update local state to point to the new ID, so subsequent edits target the new preset
        setSelectedPresetId(newId);
      }

      setHasUnanalyzedChanges(false);
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

  const performPersonaAnalysis = async (): Promise<string | null> => {
    const presetSamples = trainingItems
      .filter(item => item.presetId === (selectedPresetId || 'omakase'))
      // If we want to filter samples by the ACTIVE tab platform, we could?
      // But usually "Persona Analysis" looks at ALL samples to form a personality.
      // Let's keep consuming ALL samples for now. 
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
          // If the AI returned a JSON string, parse it
          if (typeof instruction === 'string' && instruction.trim().startsWith('{')) {
            const parsed = JSON.parse(instruction);
            setCustomPrompts(prev => ({ ...prev, ...parsed }));
          } else if (typeof instruction === 'object') {
            setCustomPrompts(prev => ({ ...prev, ...instruction }));
          } else {
            // Fallback for flat string
            setCustomPrompts(prev => ({ ...prev, [activePromptTab]: instruction }));
          }
        } catch (e) {
          console.warn('Failed to parse analysis JSON, falling back to flat string:', e);
          setCustomPrompts(prev => ({ ...prev, [activePromptTab]: instruction }));
        }

        setPersonaYaml(null); // Clear legacy YAML
        setHasUnanalyzedChanges(false);
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

  const handleToggleTrainingInternal = async (text: string, platforms: Platform[]) => {
    const presetId = selectedPresetId || 'omakase';
    const normalizedText = text.trim();
    if (!normalizedText || platforms.length === 0) return;

    const replaceId = editingSampleId || undefined;
    const platformString = platforms.join(', ') as any; // Join for DB storage

    setIsTrainingLoading(true);
    setTrainingError(null);
    try {
      await onToggleTraining(normalizedText, platformString, presetId, replaceId, 'manual');
      setHasUnanalyzedChanges(true);
      setExpandingPlatform(null);
      setEditingSampleId(null); // Reset editing state
    } catch (err: any) {
      const msg = err.message || '保存に失敗しました';
      setTrainingError(msg);
      alert(`[ERROR] ${msg}`);
    } finally {
      setIsTrainingLoading(false);
    }
  };

  const renderUnifiedSamples = () => {
    const samples = trainingItems.filter(item =>
      item.presetId === (selectedPresetId || 'omakase')
    );

    // Group samples by platform
    const groupedSamples = useMemo(() => {
      const groups: Record<string, TrainingItem[]> = {};
      samples.forEach(item => {
        // Normalize platform key
        const keys = item.platform.split(',').map(p => p.trim());
        keys.forEach(k => {
          // Map to main platforms or 'Other'
          let key = k;
          if (k.includes('Instagram')) key = Platform.Instagram;
          else if (k.includes('X') || k.includes('Twitter')) key = Platform.X;
          else if (k.includes('LINE') || k.includes('Line')) key = Platform.Line;
          else if (k.includes('Google') || k.includes('Map')) key = Platform.GoogleMaps;
          else if (k === 'General') key = Platform.General;

          if (!groups[key]) groups[key] = [];
          // Avoid duplicates if multiple keys point to same platform group (rare)
          if (!groups[key].find(i => i.id === item.id)) {
            groups[key].push(item);
          }
        });
      });
      return groups;
    }, [samples]);

    const platformOrder = [Platform.Instagram, Platform.X, Platform.Line, Platform.GoogleMaps, Platform.General];

    // State for expanded sections (default to all collapsed)
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
      [Platform.Instagram]: false,
      [Platform.X]: false,
      [Platform.Line]: false,
      [Platform.GoogleMaps]: false,
      [Platform.General]: false,
    });

    const toggleSection = (platform: string) => {
      setExpandedSections(prev => ({
        ...prev,
        [platform]: !prev[platform]
      }));
    };

    const getPlatformIcon = (platform: string) => {
      switch (platform) {
        case Platform.Instagram: return <InstagramIcon className="w-5 h-5" />;
        case Platform.X: return <span className="font-bold text-lg leading-none">𝕏</span>;
        case Platform.Line: return <LineIcon className="w-5 h-5" />;
        case Platform.GoogleMaps: return <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">G</div>;
        default: return <SparklesIcon className="w-5 h-5" />;
      }
    };

    const getPlatformLabel = (platform: string) => {
      switch (platform) {
        case Platform.Instagram: return 'Instagram';
        case Platform.X: return 'X (Twitter)';
        case Platform.Line: return 'LINE Official';
        case Platform.GoogleMaps: return 'Google Maps';
        default: return 'General / Other';
      }
    };

    return (
      <div className="py-8 md:py-12 px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-indigo-600`}>
              <MagicWandIcon className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-sm md:text-lg font-black text-black tracking-tight leading-none mb-1.5">学習データ・ベース</h4>
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">
                  {samples.length} / 50 Samples
                </span>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-black rounded-md border border-indigo-100 uppercase tracking-wider">Stored</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setModalText('');
              setEditingSampleId(null);
              setExpandingPlatform(Platform.General);
            }}
            disabled={samples.length >= 50}
            className={`flex items-center gap-2 px-6 py-3 text-[11px] font-black rounded-xl transition-all group border-2 border-black ${samples.length >= 50 ? 'bg-slate-100 text-slate-400' : 'bg-white text-black hover:bg-[var(--teal)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)]'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span>新しい学習文を追加</span>
          </button>
        </div>

        {samples.length === 0 ? (
          <div className="py-12 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-300 gap-3 mx-6 md:mx-10">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
              <SparklesIcon className="w-8 h-8 opacity-20" />
            </div>
            <div className="text-center">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No data collected yet</p>
              <p className="text-[10px] font-bold text-slate-300 mt-1">過去に書いた文章を学習させましょう</p>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {platformOrder.map(platform => {
              const platformItems = groupedSamples[platform] || [];
              if (platformItems.length === 0) return null;

              const isExpanded = expandedSections[platform];

              return (
                <div key={platform} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <button
                    onClick={() => toggleSection(platform)}
                    className="flex items-center gap-3 mb-4 group w-full text-left"
                  >
                    <div className={`p-2 rounded-lg border-2 border-black transition-all ${isExpanded ? 'bg-black text-white' : 'bg-white text-black group-hover:bg-slate-50'}`}>
                      {getPlatformIcon(platform)}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-black text-sm md:text-base text-black flex items-center gap-3">
                        {getPlatformLabel(platform)}
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] rounded-full border border-slate-200">
                          {platformItems.length}
                        </span>
                      </h5>
                    </div>
                    <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                      <ChevronDownIcon className="w-5 h-5 text-slate-400" />
                    </div>
                  </button>

                  <div className={`
                    flex overflow-x-auto pb-6 gap-3 px-1 
                    md:gap-4
                    transition-all duration-300 origin-top 
                    ${isExpanded ? 'opacity-100 scale-100' : 'hidden opacity-0 scale-95'}
                  `}>
                    {platformItems.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className={`
                          group relative flex flex-col justify-between p-3 md:p-5 rounded-xl bg-white border-2 border-black 
                          hover:bg-[var(--bg-beige)] hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:-translate-y-0.5 
                          transition-all cursor-pointer 
                          min-h-[110px] w-[160px] shrink-0
                          sm:min-h-[140px] sm:w-[280px]
                        `}
                        onClick={() => {
                          setModalText(item.content);
                          setEditingSampleId(item.id);
                          setExpandingPlatform(item.platform);
                          const platforms = item.platform.split(',').map(p => p.trim()) as Platform[];
                          setSelectedPlatforms(platforms);
                        }}
                      >
                        <div>
                          <p className="text-[11px] md:text-[13px] text-black font-bold line-clamp-3 md:line-clamp-4 leading-relaxed whitespace-pre-wrap break-all">
                            {item.content}
                          </p>
                        </div>
                        <div className="mt-2 md:mt-3 flex items-end justify-between">
                          <span className="text-[9px] md:text-[11px] font-black text-slate-300 uppercase tracking-wider scale-90 origin-bottom-left">{item.source === 'generated' ? 'AI' : 'Manual'}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Pass the *current section's* platform (e.g. "Instagram") instead of item.platform ("Instagram, X")
                              // This enables the "Smart Delete" logic in App.tsx to remove just this tag.
                              const targetPlatform = platform as Platform;
                              onToggleTraining(item.content, targetPlatform, item.presetId, undefined, 'manual')
                                .then(() => {
                                  setHasUnanalyzedChanges(true);
                                  // Re-expand the current section to show updated state (optional but nice)
                                  if (!expandedSections[targetPlatform]) toggleSection(targetPlatform);
                                });
                            }}
                            className="p-1 md:p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-100 md:opacity-0 group-hover:opacity-100"
                          >
                            <TrashIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
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
              {/* Profile Settings (Name & Icon) - Unified Block */}
              <div className="space-y-4">
                <label className="block text-[10px] md:text-[11px] font-black text-black uppercase tracking-[0.3em] mb-3 md:mb-4">
                  基本設定 (Basic Proflie)
                </label>

                <div className="bg-white border-2 border-black rounded-[24px] shadow-[4px_4px_0_0_rgba(0,0,0,1)] overflow-hidden">
                  <div className="flex flex-row divide-x-2 divide-slate-100">
                    {/* Part 1: Profile Name (Primary) */}
                    <div className="flex-[3] p-4 md:p-8">
                      <label className="block text-[10px] md:text-[11px] font-black text-black uppercase tracking-[0.3em] mb-3">
                        プロフィール名
                      </label>
                      <div className="relative group">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => handleNameChange(e.target.value)}
                          placeholder="例: 店長（公式）"
                          className="w-full px-4 py-3 md:px-7 md:py-5 bg-slate-50 border-2 border-slate-200 focus:border-black focus:bg-white outline-none rounded-xl text-sm md:text-base text-black font-black placeholder-slate-300 transition-all"
                        />
                      </div>
                    </div>

                    {/* Part 2: Icon Selection Trigger (Secondary) */}
                    <div className={`p-4 md:p-8 flex flex-col justify-center transition-colors duration-300 ${isIconSelectorOpen ? 'bg-[var(--bg-beige)]/30' : 'bg-white'}`}>
                      <div
                        onClick={() => setIsIconSelectorOpen(!isIconSelectorOpen)}
                        className="flex flex-col items-center justify-center gap-1 cursor-pointer group select-none"
                      >
                        <label className="block text-[10px] md:text-[11px] font-black text-black uppercase tracking-[0.3em] group-hover:text-indigo-600 transition-colors">
                          アイコン
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[var(--gold)] border-2 border-black flex items-center justify-center text-black shadow-sm group-hover:scale-110 transition-transform">
                            {renderAvatar(avatar, "w-5 h-5 md:w-6 md:h-6")}
                          </div>
                          <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full bg-slate-100 border-2 border-black flex items-center justify-center transition-transform duration-300 ${isIconSelectorOpen ? 'rotate-180 bg-black border-black' : 'group-hover:bg-slate-200'}`}>
                            <ChevronDownIcon className={`w-2.5 h-2.5 md:w-3 md:h-3 transition-colors ${isIconSelectorOpen ? 'text-white' : 'text-black'}`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Part 3: Expandable Icon Grid (Full Width) */}
                  <div className={`transition-all duration-300 ease-in-out overflow-hidden border-t-2 border-slate-100 ${isIconSelectorOpen ? 'max-h-[500px] opacity-100 bg-[var(--bg-beige)]/10' : 'max-h-0 opacity-0'}`}>
                    <div className="p-6 md:p-8">
                      <div className="grid grid-cols-5 md:flex md:flex-wrap gap-2 md:gap-3">
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
                              }}
                              title={item.label}
                              className={`
                                w-11 h-11 md:w-14 md:h-14 flex items-center justify-center rounded-xl transition-all duration-300 relative shrink-0 border-2
                                ${isSelected
                                  ? 'bg-[var(--gold)] shadow-[3px_3px_0_0_rgba(0,0,0,1)] border-black text-black z-10 scale-105'
                                  : 'bg-white text-slate-300 hover:bg-white hover:text-slate-500 border-slate-200 hover:border-black hover:shadow-sm'
                                }
                              `}
                            >
                              <Icon className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="animate-in slide-in-from-bottom-4 duration-500 delay-100">
            <label className="block text-[10px] md:text-[11px] font-black text-slate-800 uppercase tracking-[0.3em] mb-3 md:mb-5">
              AIプロフィールの育成 (文体学習)
            </label>
            <div className="bg-white border-2 border-black rounded-[32px] overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              {/* Console Header: Status and Description */}
              <div className="p-6 md:p-8 border-b-2 border-slate-100 bg-[var(--bg-beige)]/30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                      <MagicWandIcon className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <h4 className="text-sm md:text-base font-black text-black leading-tight">スタイル・インテリジェンス</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Automated Optimization</p>
                    </div>
                  </div>
                  <p className="text-[11px] md:text-sm text-slate-500 font-bold leading-relaxed max-w-[280px] md:max-w-xl">
                    学習文から「書き方の癖」を抽出・最適化します。
                    <span className="text-indigo-600 font-black block md:inline mt-1 md:mt-0 md:ml-2">※学習文追加後に下の解析を実行してください。</span>
                  </p>
                </div>

                {/* Desktop Hints Row (Subtle) */}
                <div className="hidden md:flex items-center gap-8 mt-4 pt-4 border-t border-slate-100/50">
                  <div className="flex items-center gap-2">
                    <MagicWandIcon className="w-3 h-3 text-indigo-400" />
                    <span className="text-[10px] text-slate-400 font-bold">各SNS 5件まで登録可</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="w-3 h-3 text-rose-400" />
                    <span className="text-[10px] text-slate-400 font-bold">AI伏せ字で個人情報を保護</span>
                  </div>
                </div>

                {/* Mobile-only condensed notice */}
                <p className="md:hidden text-[10px] text-slate-400 font-bold mt-2">
                  追加した学習文はプラットフォームごとに編集できます。
                </p>
              </div>

              {/* Console Content: Unified Samples List */}
              <div className="bg-white">
                {renderUnifiedSamples()}
              </div>
            </div>
          </div>


          <div className="animate-in slide-in-from-bottom-4 duration-500 delay-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <label className="block text-[10px] md:text-[11px] font-black text-black uppercase tracking-[0.3em]">
                追加の指示プロンプト
              </label>

              {/* Action Buttons Group */}
              <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-[20px] border-2 border-black inline-flex self-start md:self-auto">
                <button
                  onClick={async () => {
                    const samples = trainingItems.filter(item => item.presetId === (selectedPresetId || 'omakase'));
                    if (samples.length === 0) {
                      alert('分析するには学習文を1件以上追加してください。');
                      return;
                    }
                    const instruction = await performPersonaAnalysis();
                    if (instruction) {
                      if (!name.trim()) {
                        alert('解析が完了しました！この設定を保存するために、プロフィールの名前を入力してください。');
                        return;
                      }

                      let override: { [key: string]: string } = {};
                      try {
                        if (typeof instruction === 'string' && instruction.trim().startsWith('{')) {
                          override = JSON.parse(instruction);
                        } else if (typeof instruction === 'object') {
                          override = instruction;
                        } else {
                          override = { [activePromptTab]: instruction }; // Fallback
                        }
                      } catch (e) {
                        override = { [activePromptTab]: instruction };
                      }

                      await handleSave(override);
                    }
                  }}
                  disabled={isAnalyzingPersona}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl border-2 border-black transition-all text-[10px] font-black whitespace-nowrap
                            ${isAnalyzingPersona
                      ? 'bg-slate-200 text-slate-400 border-slate-300 shadow-none'
                      : 'bg-indigo-600 text-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]'}`}
                >
                  {isAnalyzingPersona ? (
                    <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <MagicWandIcon className="w-3.5 h-3.5" />
                  )}
                  <span>AI解析を実行</span>
                </button>
                <button
                  onClick={() => {
                    const currentVal = customPrompts[activePromptTab] || '';
                    if (!currentVal.trim()) return;
                    if (!confirm('現在のタブの内容を全プラットフォームに反映しますか？')) return;

                    const next = { ...customPrompts };
                    [Platform.X, Platform.Instagram, Platform.Line, Platform.GoogleMaps].forEach(p => {
                      next[p] = currentVal;
                    });
                    setCustomPrompts(next);
                    setHasUnanalyzedChanges(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border-2 border-black hover:bg-black/5 transition-all text-[10px] font-black text-black whitespace-nowrap"
                >
                  <SparklesIcon className="w-3.5 h-3.5" />
                  <span>一括適用</span>
                </button>
              </div>
            </div>

            {/* Platform Segmented Control (一体型タブ) */}
            <div className="bg-slate-100 p-1 rounded-2xl border-2 border-black inline-flex w-full md:w-auto mb-3 overflow-hidden">
              {[Platform.X, Platform.Instagram, Platform.Line, Platform.GoogleMaps].map(p => {
                const isActive = activePromptTab === p;
                return (
                  <button
                    key={p}
                    onClick={() => setActivePromptTab(p)}
                    className={`
                      flex-1 md:flex-none px-3 md:px-5 py-2 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 whitespace-nowrap
                      ${isActive
                        ? 'bg-black text-white shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]'
                        : 'text-slate-400 hover:text-black hover:bg-white/50'}
                    `}
                  >
                    {/* Platform Specific Icons for distinction */}
                    {p === Platform.X && <span className="w-3 h-3 flex items-center justify-center font-serif">𝕏</span>}
                    {p === Platform.Instagram && <div className="w-3 h-3 rounded-[3px] border-[1.5px] border-current opacity-70" />}
                    {p === Platform.Line && <div className="w-3 h-3 rounded-full border-[1.5px] border-current opacity-70" />}
                    {p === Platform.GoogleMaps && <div className="w-3 h-3 rounded-[3px] border-[1.5px] border-current border-dotted opacity-70" />}

                    <span>{p === Platform.Line ? 'LINE' : (p === Platform.GoogleMaps ? 'G-Maps' : (p === Platform.X ? 'X' : p))}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative p-1 rounded-[32px] group">
              {/* Mobile View: Toggle Button to Open Modal */}
              <div
                className="md:hidden w-full px-5 py-5 bg-slate-50 border-2 border-black rounded-[24px] cursor-pointer hover:bg-slate-100 transition-all flex items-center justify-between group"
                onClick={() => setIsPromptExpanded(true)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-black font-bold truncate opacity-60">
                    {customPrompts[activePromptTab] || `${activePromptTab}専用のルールを入力...`}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 ml-4 shrink-0">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">編集する</span>
                  <SparklesIcon className="w-3.5 h-3.5 text-indigo-500 group-hover:rotate-12 transition-transform" />
                </div>
              </div>

              {/* Desktop View: Inline Textarea */}
              <div className="hidden md:block">
                <AutoResizingTextarea
                  value={customPrompts[activePromptTab] || ''}
                  onChange={(val) => {
                    setCustomPrompts(prev => ({ ...prev, [activePromptTab]: val }));
                    setHasUnanalyzedChanges(true);
                  }}
                  placeholder={`${activePromptTab}専用のルールを入力（例：ハッシュタグをつけて）`}
                  className="w-full px-5 py-4 md:px-6 md:py-5 bg-white border-2 border-black focus:bg-[var(--bg-beige)] focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)] outline-none rounded-[24px] text-sm md:text-base text-black font-bold leading-relaxed placeholder-slate-300 transition-all min-h-[80px] md:min-h-[100px]"
                />
              </div>
            </div>
            <p className="text-[10px] md:text-[11px] text-slate-500 font-black mt-3 md:mt-4 leading-relaxed flex items-center gap-1.5 md:gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--teal)]"></span>
              文体は「過去の投稿学習」が優先されます。ここは特定のルールや制約を指定するのに便利です。
            </p>
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
              onClick={() => handleSave()}
              disabled={isSaveDisabled}
              className="w-full bg-[var(--gold)] hover:bg-[var(--rose)] border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed text-black px-8 py-4 md:py-6 rounded-xl font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all transform hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-0 active:translate-y-0 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] group relative overflow-hidden"
            >
              {(isInternalSaving || isAnalyzingPersona) ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              ) : (
                <SaveIcon className="w-5 h-5 group-hover:scale-110 transition-transform relative z-10" />
              )}
              <span className="relative z-10">
                {isAnalyzingPersona ? '解析＆保存中...' : (selectedPresetId ? '更新して保存' : '新規作成して保存')}
              </span>
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
        <div className="p-5 md:p-8 border-b-[3px] border-black flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shrink-0 bg-[var(--bg-beige)]">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-3 md:gap-4">
              <div className={`p-2.5 md:p-3 rounded-xl border-2 border-black ${expandingPlatform === Platform.X ? 'shadow-[2px_2px_0_0_#9B8FD4]' : 'shadow-[2px_2px_0_0_rgba(0,0,0,1)]'} ${expandingPlatform === Platform.Instagram ? 'bg-pink-50 text-pink-500' :
                expandingPlatform === Platform.X ? 'bg-slate-900 text-white' :
                  expandingPlatform === Platform.Line ? 'bg-[#06C755] text-white' :
                    expandingPlatform === Platform.GoogleMaps ? 'bg-blue-600 text-white' :
                      'bg-indigo-500 text-white'
                }`}>
                {expandingPlatform === Platform.Instagram && <InstagramIcon className="w-5 h-5 md:w-6 md:h-6" />}
                {expandingPlatform === Platform.X && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="md:w-6 md:h-6"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>}
                {expandingPlatform === Platform.Line && <LineIcon className="w-5 h-5 md:w-6 md:h-6" />}
                {expandingPlatform === Platform.GoogleMaps && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="md:w-6 md:h-6"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" /></svg>}
                {expandingPlatform === Platform.General && <MagicWandIcon className="w-5 h-5 md:w-6 md:h-6" />}
              </div>
              <div>
                <h3 className="font-black text-lg md:text-xl text-slate-800 tracking-tight">
                  {expandingPlatform === Platform.General ? '文章スタイルの学習' : `${expandingPlatform} の文体学習`}
                </h3>
                <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Focus Mode Editor</p>
              </div>
            </div>
            {/* Mobile Close Button */}
            <button
              onClick={() => {
                setExpandingPlatform(null);
                setEditingSampleId(null);
                setSelectedPlatforms([Platform.General]);
              }}
              className="md:hidden p-3 bg-white hover:bg-slate-100 text-slate-500 rounded-xl transition-all border-2 border-slate-200 shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0"
              title="閉じる"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
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
                  expandingPlatform === Platform.Line ? 'bg-white text-[#06C755] hover:bg-green-50' :
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
                  if (data.ok && data.sanitized) {
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
                  expandingPlatform === Platform.Line ? 'bg-green-50 text-[#06C755] hover:bg-green-100' :
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
                handleToggleTrainingInternal(modalText, selectedPlatforms);
              }}
              disabled={isTrainingLoading || selectedPlatforms.length === 0}
              className={`flex-1 md:flex-none p-3 bg-[#001738] hover:bg-slate-900 text-white rounded-xl transition-all font-black text-sm px-6 md:px-10 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-0 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {isTrainingLoading && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
              {editingSampleId ? '内容を更新' : `${selectedPlatforms.length === 1 && selectedPlatforms[0] === Platform.General ? '共通' : '選択媒体'}として学習`}
            </button>
            <button
              onClick={() => {
                setExpandingPlatform(null);
                setEditingSampleId(null);
                setSelectedPlatforms([Platform.General]);
              }}
              className="hidden md:flex p-3 bg-white hover:bg-slate-100 text-slate-500 rounded-xl transition-all border-2 border-slate-200 shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0"
              title="閉じる"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>

        {/* Platform Selection Groups */}
        {/* Platform Selection Groups - Compacted */}
        <div className="px-5 md:px-6 py-2 bg-white border-b-2 border-slate-200 flex flex-col gap-2 shrink-0">
          <div className="space-y-2">
            {/* SNS Group */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">SNS 投稿スタイル (発信向け)</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {[Platform.General, Platform.Instagram, Platform.X, Platform.Line].map((p) => {
                  const isCommonSelected = selectedPlatforms.includes(Platform.General);
                  const isSelected = p === Platform.General ? isCommonSelected : (isCommonSelected || selectedPlatforms.includes(p));

                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        if (p === Platform.General) {
                          if (isCommonSelected) {
                            setSelectedPlatforms([Platform.Instagram]); // Default back to one
                          } else {
                            // Select only SNS platforms (X, Instagram, Line) + General
                            setSelectedPlatforms([Platform.General, Platform.X, Platform.Instagram, Platform.Line]);
                          }
                        } else {
                          if (isSelected) {
                            if (selectedPlatforms.length > 1) {
                              // If common was active, unselecting one must turn off common
                              setSelectedPlatforms(selectedPlatforms.filter(item => item !== p && item !== Platform.General));
                            }
                          } else {
                            setSelectedPlatforms([...selectedPlatforms, p]);
                          }
                        }
                      }}
                      className={`
                        px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border-2
                        ${isSelected
                          ? `bg-black text-white border-black ${p === Platform.X ? 'shadow-[1px_1px_0_0_#9B8FD4]' : 'shadow-[1px_1px_0_0_rgba(0,0,0,1)]'} -translate-y-0.5`
                          : 'bg-white text-slate-400 border-slate-100 hover:border-black hover:text-black'
                        }
                      `}
                    >
                      {p === Platform.General ? '共通スタイル' : p.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Google Maps Group */}
            <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest pl-1 mr-2">返信スタイル (対話向け)</span>
                {[Platform.GoogleMaps].map((p) => {
                  const isCommonSelected = selectedPlatforms.includes(Platform.General);
                  const isSelected = selectedPlatforms.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          if (selectedPlatforms.length > 1) {
                            setSelectedPlatforms(selectedPlatforms.filter(item => item !== p));
                          }
                        } else {
                          setSelectedPlatforms([...selectedPlatforms, p]);
                        }
                      }}
                      className={`
                        px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border-2
                        ${isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-[1px_1px_0_0_rgba(29,78,216,0.2)] -translate-y-0.5'
                          : 'bg-white text-slate-400 border-slate-100 hover:border-blue-600 hover:text-blue-600'
                        }
                      `}
                    >
                      {p.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
              <span className="text-[9px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 flex items-center gap-1 shrink-0 ml-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                単独学習推奨
              </span>
            </div>
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

  const promptEditOverlay = isPromptExpanded && createPortal(
    <div className="fixed inset-0 z-[250] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
      <div
        className="w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] bg-white rounded-[32px] border-[3px] border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-8 border-b-[3px] border-black bg-[var(--bg-beige)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-black text-white rounded-xl">
              <MagicWandIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg md:text-xl text-black leading-tight">
                {activePromptTab === Platform.Line ? 'LINE' : (activePromptTab === Platform.GoogleMaps ? 'Google Maps' : (activePromptTab === Platform.X ? 'X' : activePromptTab))} の追加ルール
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Prompt Editor</p>
            </div>
          </div>
          <button
            onClick={() => setIsPromptExpanded(false)}
            className="p-3 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-500 border-2 border-transparent hover:border-black transition-all"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 p-6 md:p-10 bg-slate-50 overflow-y-auto min-h-[200px] md:min-h-[300px]">
          <AutoResizingTextarea
            autoFocus
            value={customPrompts[activePromptTab] || ''}
            onChange={(val) => {
              setCustomPrompts(prev => ({ ...prev, [activePromptTab]: val }));
              setHasUnanalyzedChanges(true);
            }}
            placeholder={`${activePromptTab}専用のルールを入力（例：ハッシュタグをつけて）`}
            className="w-full h-full min-h-[250px] md:min-h-[350px] bg-transparent outline-none text-base md:text-lg text-black font-bold leading-relaxed placeholder-slate-300 transition-all no-scrollbar"
          />
        </div>

        <div className="p-6 md:p-8 border-t-[3px] border-black bg-white flex justify-end shrink-0">
          <button
            onClick={() => setIsPromptExpanded(false)}
            className="w-full md:w-auto px-10 py-4 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none translate-x-[-2px] translate-y-[-2px] hover:translate-x-0 hover:translate-y-0 transition-all active:scale-95"
          >
            設定を完了する
          </button>
        </div>
      </div>
    </div>,
    document.body
  );

  return (
    <>
      {mainPortal}
      {focusModeOverlay}
      {promptEditOverlay}
    </>
  );
};

export default PresetModal;

declare global {
  interface Window {
    google: any;
  }
}
