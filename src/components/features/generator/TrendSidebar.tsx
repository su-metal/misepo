import React from 'react';
import { TrendEvent } from '@/types';
import { SparklesIcon, ChevronRightIcon, RotateCcwIcon, CalendarIcon } from '../../Icons';

interface TrendSidebarProps {
    onSelectEvent: (event: TrendEvent) => void;
    industry?: string;
    description?: string;
}

export const TrendSidebar: React.FC<TrendSidebarProps> = ({
    onSelectEvent, industry, description
}) => {
    // Calendar State
    const [currentYear, setCurrentYear] = React.useState(2026);
    const [currentMonth, setCurrentMonth] = React.useState(1); // Start at Feb (0-indexed 1)
    const [baseDate] = React.useState(() => new Date(2026, 1, 1));

    // Data State
    const [trendCache, setTrendCache] = React.useState<TrendEvent[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [hasFetched, setHasFetched] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState<string | null>(null);

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startDay = new Date(currentYear, currentMonth, 1).getDay(); // Sunday = 0
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    React.useEffect(() => {
        setTrendCache([]);
        setHasFetched(false);
    }, [industry, description]);

    const fetchTrends = async (year: number, month: number, force: boolean = false) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                year: year.toString(),
                month: (month + 1).toString(),
                duration: '3',
                force: force ? 'true' : 'false',
                industry: industry || '',
                description: description || ''
            });
            const res = await fetch(`/api/trends?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();

            if (data.trends) {
                setTrendCache(prev => {
                    const newTrends = data.trends as TrendEvent[];
                    const trendMap = new Map(prev.map(t => [t.date, t]));
                    newTrends.forEach(t => trendMap.set(t.date, t));
                    return Array.from(trendMap.values());
                });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
            setHasFetched(true);
        }
    };

    React.useEffect(() => {
        if (!hasFetched) {
            fetchTrends(currentYear, currentMonth);
        }
    }, [hasFetched, currentYear, currentMonth]);

    React.useEffect(() => {
        const targetPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
        const hasDataForMonth = trendCache.some(t => t.date.startsWith(targetPrefix));
        if (!hasDataForMonth && !isLoading) {
            fetchTrends(currentYear, currentMonth);
        }
    }, [currentYear, currentMonth, trendCache, isLoading]);

    const handlePrevMonth = () => {
        let newMonth = currentMonth - 1;
        let newYear = currentYear;
        if (newMonth < 0) {
            newMonth = 11;
            newYear -= 1;
        }
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
        setSelectedDate(null);
    };

    const handleNextMonth = () => {
        let newMonth = currentMonth + 1;
        let newYear = currentYear;
        if (newMonth > 11) {
            newMonth = 0;
            newYear += 1;
        }
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
        setSelectedDate(null);
    };

    const currentEvent = selectedDate
        ? trendCache.find(e => e.date === selectedDate)
        : null;

    return (
        <div className="w-[300px] h-full flex flex-col gap-6 animate-in slide-in-from-right duration-700">
            {/* Main Card */}
            <div className="flex-1 bg-white/80 backdrop-blur-xl border border-white/40 shadow-sm rounded-[32px] p-6 flex flex-col relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-bl from-amber-50/50 to-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--plexo-yellow)] to-amber-300 flex items-center justify-center shadow-lg shadow-amber-200/50">
                            <CalendarIcon className="w-4 h-4 text-black" />
                        </div>
                        <div>
                            <div className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">Trend Command</div>
                            <h2 className="text-sm font-black text-slate-800 tracking-tight">Calendar</h2>
                        </div>
                    </div>
                    <button
                        onClick={() => fetchTrends(currentYear, currentMonth, true)}
                        disabled={isLoading}
                        className={`w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors ${isLoading ? 'animate-spin' : ''}`}
                    >
                        <RotateCcwIcon className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                </div>

                {/* Month Nav */}
                <div className="flex items-center justify-between mb-4 relative z-10 bg-white/50 p-2 rounded-xl border border-white/60">
                    <button onClick={handlePrevMonth} className="p-1 rounded-lg hover:bg-white transition-colors">
                        <ChevronRightIcon className="w-4 h-4 text-slate-400 rotate-180" />
                    </button>
                    <span className="text-sm font-black text-slate-700">{monthNames[currentMonth]} {currentYear}</span>
                    <button onClick={handleNextMonth} className="p-1 rounded-lg hover:bg-white transition-colors">
                        <ChevronRightIcon className="w-4 h-4 text-slate-400" />
                    </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-6 relative z-10">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <div key={`${d}-${i}`} className="text-center text-[9px] font-bold text-slate-400 py-1">{d}</div>
                    ))}
                    {Array.from({ length: startDay }).map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}
                    {isLoading && trendCache.length === 0 ? (
                        <div className="col-span-7 h-32 flex flex-col items-center justify-center text-slate-300">
                            <SparklesIcon className="w-6 h-6 animate-spin mb-1 text-[var(--plexo-yellow)]" />
                            <span className="text-[9px] font-bold tracking-widest animate-pulse">Loading...</span>
                        </div>
                    ) : (
                        Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const event = trendCache.find(e => e.date === dateStr);
                            const isSelected = selectedDate === dateStr;

                            return (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDate(dateStr)}
                                    className={`
                                        aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all duration-300
                                        ${isSelected ? 'bg-[var(--plexo-black)] text-white scale-110 shadow-lg z-10' : 'text-slate-600 hover:bg-slate-100'}
                                        ${event ? 'font-bold' : 'font-medium opacity-40'}
                                    `}
                                >
                                    <span className="text-xs z-10 relative">{day}</span>
                                    {event && !isLoading && !isSelected && (
                                        <span className="absolute bottom-0.5 text-[8px] opacity-70">
                                            {event.icon}
                                        </span>
                                    )}
                                    {event?.isRecommended && !isSelected && (
                                        <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-[#FF4081] animate-pulse" />
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>

                {/* Selected Event Card */}
                <div className={`mt-auto transition-all duration-300 transform ${currentEvent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
                    {currentEvent && (
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <SparklesIcon className="w-16 h-16" />
                            </div>

                            <div className="flex items-start gap-3 relative z-10 mb-3">
                                <div className="text-3xl">{currentEvent.icon}</div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-bold truncate leading-tight mb-1">{currentEvent.title}</h3>
                                    <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed">{currentEvent.description}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => onSelectEvent(currentEvent)}
                                className="w-full py-2.5 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[var(--plexo-yellow)] transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-2"
                            >
                                <SparklesIcon className="w-3 h-3" />
                                Use this Trend
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
