import React from 'react';
import { PostPurpose, GoogleMapPurpose, Tone, Length, Platform, Preset, UserPlan, StoreProfile } from '../../../types';
import {
    MegaphoneIcon, BookOpenIcon, LightbulbIcon, ChatHeartIcon,
    AutoSparklesIcon, HandHeartIcon, ApologyIcon, InfoIcon, SparklesIcon,
    TieIcon, SneakersIcon, LaptopIcon, CookingIcon, CoffeeIcon,
    BuildingIcon, LeafIcon, GemIcon
} from '../../Icons';

export interface PostInputFormProps {
    storeProfile: StoreProfile;
    platforms: Platform[];
    activePlatform: Platform;
    isMultiGen: boolean;
    onPlatformToggle: (platform: Platform) => void;
    onToggleMultiGen: () => void;
    onSetActivePlatform: (platform: Platform) => void;
    platform: Platform;
    postPurpose: PostPurpose;
    gmapPurpose: GoogleMapPurpose;
    onPostPurposeChange: (p: PostPurpose) => void;
    onGmapPurposeChange: (p: GoogleMapPurpose) => void;
    tone: Tone;
    onToneChange: (t: Tone) => void;
    length: Length;
    onLengthChange: (l: Length) => void;
    inputText: string;
    onInputTextChange: (text: string) => void;
    starRating: number | null;
    onStarRatingChange: (r: number | null) => void;
    includeEmojis: boolean;
    onIncludeEmojisChange: (value: boolean) => void;
    includeSymbols: boolean;
    onIncludeSymbolsChange: (value: boolean) => void;
    xConstraint140: boolean;
    onXConstraint140Change: (value: boolean) => void;
    isGenerating: boolean;
    onGenerate: () => void;
    generateButtonRef?: React.RefObject<HTMLButtonElement>;
    plan: UserPlan;
    presets: Preset[];
    activePresetId: string | null;
    onApplyPreset: (preset: Preset) => void;
    onOpenPresetModal: () => void;
    customPrompt: string;
    onCustomPromptChange: (val: string) => void;
    storeSupplement: string;
    onStoreSupplementChange: (val: string) => void;
    language: string;
    onLanguageChange: (val: string) => void;
    onOpenGuide?: () => void;
    hasResults?: boolean;
    isStyleLocked?: boolean;
    onReset?: () => void;
    resetTrigger?: number;
    closeDrawerTrigger?: number; // New prop for closing drawer without reset
    openDrawerTrigger?: number; // New prop for opening drawer explicitly
    // Result related props
    generatedResults?: any[]; // Using any[] here to avoid circular or complex import issues if needed, but GeneratedResult is better.
    activeResultTab?: number;
    onResultTabChange?: (index: number) => void;
    onManualEdit?: (groupIndex: number, itemIndex: number, text: string) => void;
    onToggleFooter?: (groupIndex: number, itemIndex: number) => void;
    onRefine?: (groupIndex: number, itemIndex: number) => void;
    onRegenerateSingle?: (platform: Platform) => void;
    onShare?: (platform: Platform, text: string) => void;
    getShareButtonLabel?: (p: Platform) => string;
    refiningKey?: string | null;
    onRefineToggle?: (gIdx: number, iIdx: number) => void;
    refineText?: string;
    onRefineTextChange?: (text: string) => void;
    onPerformRefine?: (gIdx: number, iIdx: number) => void;
    isRefining?: boolean;
    includeFooter?: boolean;
    onIncludeFooterChange?: (val: boolean) => void;
    onAutoFormat?: (gIdx: number, iIdx: number) => void;
    isAutoFormatting?: { [key: string]: boolean };
    onCopy?: (text: string) => void;
    onMobileResultOpen?: (isOpen: boolean) => void;
    onStepChange?: (step: 'platform' | 'input' | 'confirm' | 'result') => void;
    restoreId?: string;
    onOpenOnboarding?: () => void;
    onOpenSettings?: () => void;
    targetAudiences?: string[];
    onTargetAudiencesChange?: (audiences: string[]) => void;
}

export const AVATAR_OPTIONS = [
    { id: '👔', icon: TieIcon },
    { id: '👟', icon: SneakersIcon },
    { id: '💻', icon: LaptopIcon },
    { id: '🍳', icon: CookingIcon },
    { id: '☕', icon: CoffeeIcon },
    { id: '🏢', icon: BuildingIcon },
    { id: '✨', icon: SparklesIcon },
    { id: '📣', icon: MegaphoneIcon },
    { id: '🌿', icon: LeafIcon },
    { id: '💎', icon: GemIcon }
];

export const renderAvatar = (avatarId: string | null, className: string = "w-6 h-6") => {
    const option = AVATAR_OPTIONS.find(opt => opt.id === avatarId);
    if (option) {
        const Icon = option.icon;
        return <Icon className={className} />;
    }
    return <TieIcon className={className} />; // Default
};

export const PURPOSES = [
    { id: PostPurpose.Auto, label: '自動', icon: <AutoSparklesIcon /> },
    { id: PostPurpose.Promotion, label: '宣伝・告知', icon: <MegaphoneIcon /> },
    { id: PostPurpose.Story, label: 'ストーリー', icon: <BookOpenIcon /> },
    { id: PostPurpose.Educational, label: 'お役立ち', icon: <LightbulbIcon /> },
    { id: PostPurpose.Engagement, label: '交流', icon: <ChatHeartIcon /> },
];

export const GMAP_PURPOSES = [
    { id: GoogleMapPurpose.Auto, label: '自動', icon: <AutoSparklesIcon /> },
    { id: GoogleMapPurpose.Thanks, label: 'お礼', icon: <HandHeartIcon /> },
    { id: GoogleMapPurpose.Apology, label: 'お詫び', icon: <ApologyIcon /> },
    { id: GoogleMapPurpose.Info, label: '情報', icon: <InfoIcon /> },
];

export const TONES = [
    { id: Tone.Formal, label: 'きっちり' },
    { id: Tone.Standard, label: '標準' },
    { id: Tone.Friendly, label: '親しみ' },
];

export const LENGTHS = [
    { id: Length.Short, label: '短め' },
    { id: Length.Medium, label: '標準' },
    { id: Length.Long, label: '長め' },
];
