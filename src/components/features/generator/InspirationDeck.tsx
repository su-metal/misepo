import React, { useEffect, useState, useRef } from 'react';
import { StoreProfile } from '../../../types';
import { SparklesIcon, ChatHeartIcon, CalendarIcon, MegaphoneIcon, LightbulbIcon } from '../../Icons';
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

    // Reset fetch state if profile changes meaningfully
    const profileKey = `${storeProfile?.name}-${storeProfile?.industry}-${storeProfile?.description}`;
    if (fetched && lastProfileKeyRef.current !== profileKey) {
        setFetched(false);
        setLocalCards([]);
    }

    if (!isVisible || !storeProfile || loading) return;

    // If we have fetched but only got <5 cards, we might be in a loop if the API returns <5. 
    // But for this migration, let's allow re-fetching if fetched is true but items are insufficient, 
    // provided we reset 'fetched' state. 
    // Actually, let's just ignore 'fetched' flag if we have < 5 cards.
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
}, [isVisible, storeProfile, fetched, loading]);

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
        </div>

        <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-3 pb-4 -mx-8 px-8 snap-x snap-mandatory no-scrollbar"
        >
            {cards.map((card, idx) => (
                <button
                    key={card.id || idx}
                    onClick={() => onSelect(card.prompt)}
                    className="
                        relative flex flex-col items-start text-left p-4
                        min-w-[200px] max-w-[200px] h-[140px]
                        bg-white rounded-[24px] border border-stone-100 shadow-sm md:shadow-md
                        snap-center transition-all hover:scale-[1.02] active:scale-95 hover:border-[#0071b9]/30
                        group
                        "
                >
                    {/* Icon & Label */}
                    <div className="flex items-center justify-between w-full mb-2">
                        <span className="text-xl">{card.icon || '✨'}</span>
                        <div className="bg-stone-50 px-2 py-1 rounded-full border border-stone-100">
                            <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest">
                                {card.type === 'review' ? 'PICKUP' : card.type === 'trend' ? 'TREND' : 'IDEA'}
                            </span>
                        </div>
                    </div>

                    <h4 className="text-sm font-bold text-[#111111] mb-1 line-clamp-1 group-hover:text-[#0071b9] transition-colors">
                        {card.title}
                    </h4>
                    <p className="text-[10px] font-medium text-stone-500 leading-relaxed line-clamp-3">
                        {card.description}
                    </p>
                </button>
            ))
            }
        </div >
    </div >
);
};
