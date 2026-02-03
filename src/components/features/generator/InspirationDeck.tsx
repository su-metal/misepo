import React, { useEffect, useState, useRef } from 'react';
import { StoreProfile, TopicTemplate } from '../../../types';
import { SparklesIcon, RotateCcwIcon, ChevronRightIcon } from '../../Icons';
import { InspirationCard } from '../../../services/geminiService';
import { INDUSTRY_TOPIC_POOL } from '../../../constants/industryTopics';

export interface InspirationDeckProps {
    storeProfile: StoreProfile | null;
    onSelect: (prompt: string, question?: string) => void;
    isVisible: boolean;
    cachedCards?: InspirationCard[];
    onCardsLoaded?: (cards: InspirationCard[]) => void;
}

export const InspirationDeck: React.FC<InspirationDeckProps> = ({ storeProfile, onSelect, isVisible, cachedCards, onCardsLoaded }) => {
    const [localCards, setLocalCards] = useState<InspirationCard[]>([]);
    const cards = localCards.length > 0 ? localCards : (cachedCards || []);
    const [loading, setLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const lastIndustryRef = useRef<string | undefined>(storeProfile?.industry);

    useEffect(() => {
        if (!isVisible || !storeProfile) return;

        const currentIndustry = storeProfile.industry;
        const industryChanged = currentIndustry !== lastIndustryRef.current;

        // If industry changed, we must re-fetch regardless of cache
        if (!industryChanged && cachedCards && cachedCards.length > 0 && refreshKey === 0) return;

        if (industryChanged) {
            lastIndustryRef.current = currentIndustry;
        }

        setLoading(true);
        // Simulate minor loading for UX "thinking" feel
        setTimeout(() => {
            const industry = storeProfile.industry || 'その他';
            const pool = INDUSTRY_TOPIC_POOL[industry] || INDUSTRY_TOPIC_POOL['その他'];

            // Shuffle and pick up to 6 cards
            const shuffled = [...pool]
                .sort(() => Math.random() - 0.5)
                .slice(0, 6)
                .map((t, idx) => ({
                    id: `temp-${idx}-${refreshKey}`,
                    type: 'variety' as const,
                    title: t.title,
                    description: t.description,
                    prompt: t.prompt,
                    question: t.question,
                    icon: t.icon
                }));

            setLocalCards(shuffled);
            if (onCardsLoaded) onCardsLoaded(shuffled);
            setLoading(false);
        }, 600);
    }, [isVisible, storeProfile, refreshKey]);

    if (!isVisible) return null;

    if (loading) {
        return (
            <div className="w-full h-32 flex items-center justify-center bg-stone-50/50 rounded-2xl mb-4 border border-stone-100/50">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1f29fc] animate-ping" />
                    <span className="text-[9px] font-black text-[#1f29fc]/50 tracking-widest uppercase">Sommelier is thinking...</span>
                </div>
            </div>
        );
    }

    if (cards.length === 0) return null;

    return (
        <div className="mb-6 animate-in slide-in-from-right-4 duration-700 fade-in">
            <div className="flex items-center justify-between px-1 mb-2">
                <div className="flex flex-col">
                    <h3 className="text-sm font-black text-[#111111] mb-1">AIトピック・ソムリエ</h3>
                    <p className="text-[10px] text-[#666666] font-bold">今日の気分で話題を選んでみてください</p>
                </div>
                <button
                    onClick={() => setRefreshKey(prev => prev + 1)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f5f7fa] border border-slate-200 active:scale-95 transition-all group"
                >
                    <RotateCcwIcon className="w-3 h-3 text-slate-500 group-hover:text-[#1f29fc] transition-colors" />
                    <span className="text-[9px] font-black text-slate-500 group-hover:text-[#1f29fc] tracking-wider uppercase">Shuffle</span>
                </button>
            </div>

            <div ref={scrollContainerRef} className="flex overflow-x-auto pb-4 -mx-8 px-8 scrollbar-hide scroll-smooth">
                <div className="grid grid-rows-2 grid-flow-col gap-2">
                    {cards.map((card) => (
                        <button
                            key={card.id}
                            onClick={() => onSelect(card.prompt, card.question)}
                            className="flex items-center gap-2.5 px-5 py-3 bg-white rounded-full border border-stone-100 shadow-sm transition-all hover:scale-[1.02] active:scale-95 hover:border-[#1f29fc]/30 group shrink-0 whitespace-nowrap"
                        >
                            <span className="text-xl leading-none">{card.icon}</span>
                            <div className="flex flex-col items-start leading-tight">
                                <h4 className="text-[13px] font-bold text-[#111111] group-hover:text-[#1f29fc] transition-colors">{card.title}</h4>
                                <span className="text-[8px] font-black text-stone-400 uppercase tracking-tighter">RECOMMEND</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
