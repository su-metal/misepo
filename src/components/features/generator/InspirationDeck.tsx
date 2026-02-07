import React, { useEffect, useState, useRef } from 'react';
import { StoreProfile, TopicTemplate, DailyContext } from '../../../types';
import { SparklesIcon, RotateCcwIcon, ChevronRightIcon } from '../../Icons';
import { InspirationCard } from '../../../services/geminiService';
import { INDUSTRY_TOPIC_POOL, COMMON_TOPICS } from '../../../constants/industryTopics';

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
    const [selectingId, setSelectingId] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [dailyContext, setDailyContext] = useState<DailyContext | null>(null);
    const [shownTopicTitles, setShownTopicTitles] = useState<string[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const lastIndustryRef = useRef<string | undefined>(storeProfile?.industry);
    const isForceRef = useRef(false);

    useEffect(() => {
        if (!isVisible || !storeProfile) return;

        const currentIndustry = storeProfile.industry || 'その他';
        const industryChanged = currentIndustry !== lastIndustryRef.current;

        if (!industryChanged && cachedCards && cachedCards.length > 0 && refreshKey === 0) return;

        if (industryChanged) {
            lastIndustryRef.current = currentIndustry;
            setShownTopicTitles([]); // Industry changed, reset history
        }

        const fetchInspiration = async () => {
            setLoading(true);
            try {
                const region = storeProfile.region || '日本';
                const todayStr = new Date().toISOString().split('T')[0];
                let force = isForceRef.current;
                isForceRef.current = false; // Reset

                if (force) {
                    setShownTopicTitles([]); // Reset history on force refresh
                }

                // 1. Fetch DailyContext (Layer 2)
                const resTrends = await fetch(`/api/trends?industry=${encodeURIComponent(currentIndustry)}&region=${encodeURIComponent(region)}&date=${todayStr}&force=${force}`);
                const trendData = await resTrends.json();
                const context = trendData.dailyContext as DailyContext;
                setDailyContext(context);

                // 2. Mix 6 Cards (Hybrid 4:2 Ratio Optimization)
                // - Dynamics (Layer 2): Max 1-2 cards
                // - Fixed Pool (Layer 1): 4-5 cards (Cycle-through)

                // A. Collect all available Dynamic items
                const dynamicPool: any[] = [];
                if (context) {
                    if (context.events && context.events.length > 0) {
                        dynamicPool.push({
                            title: context.events[0],
                            description: `${context.events[0]}についてお客様と交流する`,
                            icon: '📅',
                            type: 'trend'
                        });
                    }
                    if (context.weather) {
                        dynamicPool.push({
                            title: '今日の天気について',
                            description: `今の天候（${context.weather}）に合わせた話題`,
                            icon: '🌤️',
                            type: 'trend'
                        });
                    }
                    if (context.localNews && context.localNews.length > 0) {
                        dynamicPool.push({
                            title: '地域の話題',
                            description: context.localNews[0],
                            icon: '📍',
                            type: 'local'
                        });
                    }
                }

                // If no context, add a seasonal placeholder
                if (dynamicPool.length === 0) {
                    dynamicPool.push({
                        title: '季節の話題',
                        description: '今の時期ならではの気配りや発見',
                        icon: '🌸',
                        type: 'trend'
                    });
                }

                // Pick 1-2 dynamics randomly
                const dynamicsCount = Math.floor(Math.random() * 2) + 1; // 1 or 2
                const selectedDynamics = dynamicPool
                    .sort(() => Math.random() - 0.5)
                    .slice(0, Math.min(dynamicsCount, dynamicPool.length));

                // B. Manage Fixed Pool (Round Robin)
                const fullPool = [...(INDUSTRY_TOPIC_POOL[currentIndustry] || INDUSTRY_TOPIC_POOL['その他'] || []), ...COMMON_TOPICS];
                const neededFromFixed = 6 - selectedDynamics.length; // Always 4 or 5

                let availablePool = fullPool.filter(t => !shownTopicTitles.includes(t.title));

                // If pool is running low or empty, reset
                if (availablePool.length < neededFromFixed) {
                    availablePool = fullPool;
                    setShownTopicTitles([]);
                    // After reset, still need to filter to avoid duplicates in the current set if possible
                }

                const selectedFromFixedPool = [...availablePool]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, neededFromFixed);

                // Update history with selected fixed pool titles
                setShownTopicTitles(prev => [...prev, ...selectedFromFixedPool.map(t => t.title)]);

                // Combine and Shuffle
                const mixedTemplates = [...selectedFromFixedPool, ...selectedDynamics];

                const finalCards = mixedTemplates
                    .sort(() => Math.random() - 0.5)
                    .map((t, idx) => ({
                        id: `deck-${t.title}-${idx}-${refreshKey}`,
                        type: (t.type || 'variety') as any,
                        title: t.title,
                        description: t.description,
                        prompt: t.prompt || `話題：${t.title}。${t.description}`,
                        question: t.question, // Might be undefined for dynamic ones
                        icon: t.icon
                    }));

                setLocalCards(finalCards);
                if (onCardsLoaded) onCardsLoaded(finalCards);
            } catch (error) {
                console.error("Failed to fetch inspiration:", error);
                // Simple Fallback
                const fallback = COMMON_TOPICS.slice(0, 6).map((t, idx) => ({
                    id: `fallback-${idx}`,
                    ...t,
                    type: 'variety' as const
                }));
                setLocalCards(fallback);
                if (onCardsLoaded) onCardsLoaded(fallback);
            } finally {
                setLoading(false);
            }
        };

        fetchInspiration();
    }, [isVisible, storeProfile, refreshKey]);

    const handleSelect = async (card: InspirationCard) => {
        if (!storeProfile) return;

        // If question already exists (Layer 1), use it immediately
        if (card.question) {
            onSelect(card.prompt, card.question);
            return;
        }

        // Layer 3: On-demand generation
        setSelectingId(card.id);
        setLoading(true);
        try {
            const res = await fetch('/api/ai/inspiration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode: 'question_only',
                    storeProfile,
                    topic: { title: card.title, description: card.description },
                    context: dailyContext
                })
            });
            const data = await res.json();
            onSelect(data.refinedPrompt || card.prompt, data.question);
        } catch (error) {
            console.error("Failed to generate sommelier question:", error);
            onSelect(card.prompt, "こちらの話題でいかがでしょうか？何か具体的なエピソードはありますか？");
        } finally {
            setSelectingId(null);
            setLoading(false);
        }
    };

    if (!isVisible) return null;

    if (loading && !selectingId) {
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
                    onClick={(e) => {
                        if (e.shiftKey) isForceRef.current = true;
                        setRefreshKey(prev => prev + 1);
                    }}
                    disabled={loading}
                    title={loading ? "Thinking..." : "Shift + Click for Hard Refresh"}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f5f7fa] border border-slate-200 active:scale-95 transition-all group disabled:opacity-50"
                >
                    <RotateCcwIcon className={`w-3 h-3 text-slate-500 group-hover:text-[#1f29fc] transition-colors ${loading && !selectingId ? 'animate-spin' : ''}`} />
                    <span className="text-[9px] font-black text-slate-500 group-hover:text-[#1f29fc] tracking-wider uppercase">Shuffle</span>
                </button>
            </div>

            <div ref={scrollContainerRef} className="flex overflow-x-auto pb-4 -mx-8 px-8 scrollbar-hide scroll-smooth">
                <div className="grid grid-rows-2 grid-flow-col gap-2">
                    {cards.map((card) => (
                        <button
                            key={card.id}
                            disabled={loading}
                            onClick={() => handleSelect(card)}
                            className={`flex items-center gap-2.5 px-5 py-3 bg-white rounded-full border shadow-sm transition-all hover:scale-[1.02] active:scale-95 group shrink-0 whitespace-nowrap ${selectingId === card.id ? 'border-[#1f29fc] bg-blue-50/30' : 'border-stone-100 hover:border-[#1f29fc]/30'
                                }`}
                        >
                            {selectingId === card.id ? (
                                <div className="w-5 h-5 flex items-center justify-center">
                                    <div className="w-3 h-3 border-2 border-[#1f29fc] border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : (
                                <span className="text-xl leading-none">{card.icon}</span>
                            )}
                            <div className="flex flex-col items-start leading-tight">
                                <h4 className="text-[13px] font-bold text-[#111111] group-hover:text-[#1f29fc] transition-colors">{card.title}</h4>
                                <span className={`text-[8px] font-black uppercase tracking-tighter ${card.type === 'trend' || card.type === 'local'
                                    ? 'text-[#1f29fc]'
                                    : 'text-stone-400'
                                    }`}>
                                    {card.type === 'trend' ? 'TREND' : card.type === 'local' ? 'LOCAL' : 'NEW IDEA'}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
