import React, { useEffect, useState, useRef } from 'react';
import { StoreProfile } from '../../../types';
import { SparklesIcon, ChatHeartIcon, CalendarIcon, MegaphoneIcon, LightbulbIcon, RotateCcwIcon } from '../../Icons';
import { InspirationCard } from '../../../services/geminiService';

interface InspirationDeckProps {
    storeProfile: StoreProfile | null;
    onSelect: (prompt: string) => void;
    isVisible: boolean;
    cachedCards?: InspirationCard[];
    onCardsLoaded?: (cards: InspirationCard[]) => void;
}

export const InspirationDeck: React.FC<InspirationDeckProps> = ({ storeProfile, onSelect, isVisible, cachedCards, onCardsLoaded }) => {
    const [localCards, setLocalCards] = useState<InspirationCard[]>([]);
    // Prioritize localCards if populated (new fetch), otherwise use cachedCards
    const cards = localCards.length > 0 ? localCards : (cachedCards || []);

    const [loading, setLoading] = useState(false);
    const [fetched, setFetched] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const lastProfileKeyRef = useRef<string>("");


    useEffect(() => {
        // Reset fetch state if profile changes meaningfully
        const profileKey = `${storeProfile?.name}-${storeProfile?.industry}-${storeProfile?.description}`;
        if (fetched && lastProfileKeyRef.current !== profileKey) {
            setFetched(false);
            setLocalCards([]);
        }

        // Early return conditions
        if (!storeProfile || loading) return;

        // If not visible now, just return
        if (!isVisible) return;

        // If already have cached cards from parent (5+), use them (don't re-fetch)
        if (cachedCards && cachedCards.length >= 5) return;

        // If already fetched locally and have enough cards, use cache (don't re-fetch)
        if (fetched && cards.length >= 5) return;



        const fetchInspiration = async () => {
            setLoading(true);
            try {
                let reviews: { text: string }[] = [];

                // 1. Fetch Reviews if Place ID exists
                if (storeProfile.googlePlaceId && window.google && window.google.maps) {
                    try {
                        const mapDiv = document.createElement('div');
                        const service = new window.google.maps.places.PlacesService(mapDiv);

                        await new Promise<void>((resolve) => {
                            service.getDetails({
                                placeId: storeProfile.googlePlaceId!,
                                fields: ['reviews']
                            }, (place, status) => {
                                if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.reviews) {
                                    // Filter for good reviews (>= 4 stars)
                                    reviews = place.reviews
                                        .filter((r: any) => r.rating >= 4 && r.text && r.text.length > 10)
                                        .slice(0, 5)
                                        .map((r: any) => ({ text: r.text }));
                                }
                                resolve();
                            });
                        });
                    } catch (e) {
                        console.warn('Failed to fetch Google Reviews for inspiration', e);
                    }
                }

                // 2. Fetch Trend Data for today
                let trendData = null;
                try {
                    const today = new Date();
                    const year = today.getFullYear();
                    const month = today.getMonth() + 1; // getMonth() is 0-indexed

                    const trendRes = await fetch(`/api/trends?year=${year}&month=${month}&duration=1`);
                    if (trendRes.ok) {
                        const trendJson = await trendRes.json();
                        // Find today's trend from the returned trends array
                        const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
                        if (trendJson.trends && Array.isArray(trendJson.trends)) {
                            const todayTrend = trendJson.trends.find((t: any) => t.date === todayStr);
                            trendData = todayTrend || trendJson.trends[0]; // Fallback to first trend if exact match not found
                        }
                    }
                } catch (e) {
                    console.warn('Failed to fetch trend data for inspiration', e);
                }

                console.log('[InspirationDeck] Fetched data:', {
                    reviewCount: reviews.length,
                    reviewSample: reviews[0]?.text?.substring(0, 50) || 'No reviews',
                    trendData: trendData ? JSON.stringify(trendData).substring(0, 100) : 'No trend'
                });

                // 3. Call Inspiration API
                const res = await fetch('/api/ai/inspiration', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        date: new Date().toISOString(),
                        storeProfile,
                        reviews,
                        trend: trendData
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.cards) {
                        setLocalCards(data.cards);
                        lastProfileKeyRef.current = `${storeProfile?.name}-${storeProfile?.industry}-${storeProfile?.description}`;
                        if (onCardsLoaded) {
                            onCardsLoaded(data.cards);
                        }
                    }
                }
            } catch (error) {
                console.error("Inspiration fetch error:", error);
            } finally {
                setLoading(false);
                setFetched(true);
            }
        };

        fetchInspiration();
    }, [storeProfile]); // Only re-run when storeProfile changes

    if (!isVisible) return null;

    if (loading) {
        return (
            <div className="w-full h-32 flex items-center justify-center bg-stone-50/50 rounded-2xl mb-4 border border-stone-100/50">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0071b9] animate-ping" />
                    <span className="text-[9px] font-black text-[#0071b9]/50 tracking-widest uppercase">Looking for ideas...</span>
                </div>
            </div>
        );
    }

    if (cards.length === 0 && !loading) return null;

    return (
        <div className="mb-6 animate-in slide-in-from-right-4 duration-700 fade-in">
            {/* Header / Brand */}
            <div className="flex items-center justify-between px-1 mb-2">
                <div className="flex flex-col">
                    <h3 className="text-sm font-black text-[#111111] mb-1">
                        {loading ? 'アイデアを探しています...' : 'AIトピック・ソムリエ'}
                    </h3>
                    <p className="text-[10px] text-[#666666] font-bold">
                        {loading ? '少々お待ちください' : '話題を選んで書き始めよう'}
                    </p>
                </div>

                {/* Shuffle Button */}
                {!loading && (
                    <button
                        onClick={() => {
                            setFetched(false);
                            setLocalCards([]);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f5f7fa] border border-slate-200 active:scale-95 transition-all group"
                    >
                        <RotateCcwIcon className={`w-3 h-3 text-slate-500 group-hover:text-[#0071b9] transition-colors ${loading ? 'animate-spin' : ''}`} />
                        <span className="text-[9px] font-black text-slate-500 group-hover:text-[#0071b9] tracking-wider uppercase">Shuffle</span>
                    </button>
                )}
            </div>

            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto pb-4 -mx-8 px-8 scrollbar-hide scroll-smooth"
            >
                <div className="grid grid-rows-2 grid-flow-col gap-2">
                    {cards.map((card, idx) => (
                        <button
                            key={card.id || idx}
                            onClick={() => onSelect(card.prompt)}
                            className="
                            flex items-center gap-2.5 px-5 py-3
                            bg-white rounded-full border border-stone-100 shadow-sm md:shadow-md
                            transition-all hover:scale-[1.02] active:scale-95 hover:border-[#0071b9]/30
                            group shrink-0 whitespace-nowrap
                            "
                        >
                            {/* Icon */}
                            <span className="text-xl leading-none">{card.icon || '✨'}</span>

                            {/* Title & Type Badge (Mini) */}
                            <div className="flex flex-col items-start leading-tight">
                                <h4 className="text-[13px] font-bold text-[#111111] group-hover:text-[#0071b9] transition-colors">
                                    {card.title}
                                </h4>
                                <span className="text-[8px] font-black text-stone-400 uppercase tracking-tighter">
                                    {card.type === 'review' ? 'PICKUP' : card.type === 'trend' ? 'TREND' : 'IDEA'}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div >
        </div >
    );
};
