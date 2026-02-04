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

        const fetchInspiration = async () => {
            setLoading(true);
            try {
                const industry = storeProfile.industry || 'その他';
                const basePool = INDUSTRY_TOPIC_POOL[industry] || INDUSTRY_TOPIC_POOL['その他'];
                const tailoredPool = storeProfile.tailoredTopics || [];

                // 1. Pick 5 cards by mixing (Tailored wins priority, then fill with Base)
                // Mix: Up to 3 from tailored, others from Base to ensure variety
                const selectedTailored = [...tailoredPool].sort(() => Math.random() - 0.5).slice(0, 3);
                const remainingCount = 5 - selectedTailored.length;

                // Avoid duplicates by filtering out base items that were used for tailoring
                const tailoredSources = new Set([
                    ...selectedTailored.map(t => t.title),
                    ...selectedTailored.map(t => t.originalTitle).filter(Boolean)
                ]);

                const filteredBase = basePool.filter(t => !tailoredSources.has(t.title));
                const selectedBase = [...filteredBase].sort(() => Math.random() - 0.5).slice(0, remainingCount);

                const mixedPool = [...selectedTailored, ...selectedBase];

                const localTemplates = mixedPool
                    .sort(() => Math.random() - 0.5)
                    .map((t, idx) => ({
                        id: `local-${t.title}-${idx}-${refreshKey}`,
                        type: 'variety' as const,
                        title: t.title,
                        description: t.description,
                        prompt: t.prompt,
                        question: t.question,
                        icon: t.icon
                    }));

                // 2. Fetch only the TREND card from AI
                const todayStr = new Date().toISOString().split('T')[0];
                const resTrend = await fetch(`/api/trends?industry=${encodeURIComponent(industry)}`);
                const trendData = await resTrend.json();
                const todayTrend = trendData.trends?.find((t: any) => t.date === todayStr) || trendData.trends?.[0];

                const resInspiration = await fetch('/api/ai/inspiration', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        date: todayStr,
                        storeProfile,
                        trend: todayTrend,
                        seed: `trend-only-${refreshKey}`,
                        mode: 'trend_only' // Custom flag to tell AI to only return variety
                    })
                });

                const aiData = await resInspiration.json();
                const aiTrendCard = aiData.cards?.[0];

                // 3. Mix (5 local + 1 AI trend)
                const finalCards = aiTrendCard
                    ? [...localTemplates, aiTrendCard].sort(() => Math.random() - 0.5)
                    : localTemplates;

                setLocalCards(finalCards);
                if (onCardsLoaded) onCardsLoaded(finalCards);
            } catch (error) {
                console.error("Failed to fetch inspiration:", error);
                // Fallback strictly to local pool
                const industry = storeProfile.industry || 'その他';
                const basePool = INDUSTRY_TOPIC_POOL[industry] || INDUSTRY_TOPIC_POOL['その他'];
                const tailoredPool = storeProfile.tailoredTopics || [];

                const selectedTailored = [...tailoredPool].sort(() => Math.random() - 0.5).slice(0, 3);
                const remainingCount = 6 - selectedTailored.length;

                const tailoredSources = new Set([
                    ...selectedTailored.map(t => t.title),
                    ...selectedTailored.map(t => t.originalTitle).filter(Boolean)
                ]);

                const filteredBase = basePool.filter(t => !tailoredSources.has(t.title));
                const selectedBase = [...filteredBase].sort(() => Math.random() - 0.5).slice(0, remainingCount);

                const shuffled = [...selectedTailored, ...selectedBase]
                    .sort(() => Math.random() - 0.5)
                    .map((t, idx) => ({
                        id: `temp-${t.title}-${idx}-${refreshKey}`,
                        type: 'variety' as const,
                        title: t.title,
                        description: t.description,
                        prompt: t.prompt,
                        question: t.question,
                        icon: t.icon
                    }));
                setLocalCards(shuffled);
                if (onCardsLoaded) onCardsLoaded(shuffled);
            } finally {
                setLoading(false);
            }
        };

        fetchInspiration();
    }, [isVisible, storeProfile, refreshKey]);

    if (!isVisible) return null;

    if (loading) {
        return (
            <div className="w-full h-32 flex items-center justify-center bg-stone-50/50 rounded-2xl mb-4 border border-stone-100/50">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2b2b2f] animate-ping" />
                    <span className="text-[9px] font-black text-[#2b2b2f]/50 tracking-widest uppercase">Sommelier is thinking...</span>
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
                    <RotateCcwIcon className="w-3 h-3 text-slate-500 group-hover:text-[#2b2b2f] transition-colors" />
                    <span className="text-[9px] font-black text-slate-500 group-hover:text-[#2b2b2f] tracking-wider uppercase">Shuffle</span>
                </button>
            </div>

            <div ref={scrollContainerRef} className="flex overflow-x-auto pb-4 -mx-8 px-8 scrollbar-hide scroll-smooth">
                <div className="grid grid-rows-2 grid-flow-col gap-2">
                    {cards.map((card) => (
                        <button
                            key={card.id}
                            onClick={() => onSelect(card.prompt, card.question)}
                            className="flex items-center gap-2.5 px-5 py-3 bg-white rounded-full border border-stone-100 shadow-sm transition-all hover:scale-[1.02] active:scale-95 hover:border-[#2b2b2f]/30 group shrink-0 whitespace-nowrap"
                        >
                            <span className="text-xl leading-none">{card.icon}</span>
                            <div className="flex flex-col items-start leading-tight">
                                <h4 className="text-[13px] font-bold text-[#111111] group-hover:text-[#2b2b2f] transition-colors">{card.title}</h4>
                                <span className={`text-[8px] font-black uppercase tracking-tighter ${card.type === 'trend' || card.type === 'web'
                                    ? 'text-[#C986D3]'
                                    : 'text-stone-400'
                                    }`}>
                                    {card.type === 'trend' ? 'TREND' : card.type === 'web' ? 'WEB TREND' : 'NEW IDEA'}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
