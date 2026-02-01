import React from 'react';
import { TrendEvent } from '@/types';
import {
    SparklesIcon, ChevronRightIcon, RotateCcwIcon, CalendarIcon
} from '../../Icons';

interface TrendSidebarProps {
    onSelectEvent: (event: TrendEvent) => void;
    industry?: string;
    description?: string;
    isGoogleMaps?: boolean;
}

export const TrendSidebar: React.FC<TrendSidebarProps> = ({
    onSelectEvent, industry, description, isGoogleMaps
}) => {
    // Calendar State
    const today = new Date();
    const [currentYear, setCurrentYear] = React.useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = React.useState(today.getMonth());
    const [baseDate] = React.useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

    // Data State
    const [trendCache, setTrendCache] = React.useState<TrendEvent[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [hasFetched, setHasFetched] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState<string | null>(null);

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startDay = new Date(currentYear, currentMonth, 1).getDay();
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
            <div className="flex-1 bg-[#fffbf9]/80 backdrop-blur-xl border border-[#122646]/10 shadow-sm rounded-[32px] p-6 flex flex-col relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-bl from-white/40 to-[#d8e9f4]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 flex items-center justify-center">
                            <CalendarIcon className="w-8 h-8 text-[#122646]" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.15em] text-[#122646]/60">Trend Command</div>
                            <h2 className="text-base font-black text-[#122646] tracking-tight leading-none">Calendar</h2>
                        </div>
                    </div>
                    <button
                        onClick={() => fetchTrends(currentYear, currentMonth, true)}
                        disabled={isLoading}
                        className={`w-10 h-10 rounded-full bg-white hover:bg-[#d8e9f4] flex items-center justify-center transition-colors border border-[#122646]/5 ${isLoading ? 'animate-spin' : ''}`}
                    >
                        <RotateCcwIcon className="w-5 h-5 text-[#122646]" />
                    </button>
                </div>

                {/* Month Nav */}
                <div className="flex items-center justify-between mb-4 relative z-10 bg-white/60 p-2 rounded-xl border border-[#122646]/5">
                    <button
                        onClick={handlePrevMonth}
                        disabled={currentYear === baseDate.getFullYear() && currentMonth === baseDate.getMonth()}
                        className="p-1 rounded-lg hover:bg-[#d8e9f4] transition-colors disabled:opacity-30 disabled:pointer-events-none"
                    >
                        <ChevronRightIcon className="w-4 h-4 text-[#122646] rotate-180" />
                    </button>
                    <span className="text-sm font-black text-[#122646] tracking-tight">{monthNames[currentMonth]} {currentYear}</span>
                    <button
                        onClick={handleNextMonth}
                        disabled={
                            (currentYear > baseDate.getFullYear()) ||
                            (currentYear === baseDate.getFullYear() && currentMonth >= baseDate.getMonth() + 2)
                        }
                        className="p-1 rounded-lg hover:bg-[#d8e9f4] transition-colors disabled:opacity-30 disabled:pointer-events-none"
                    >
                        <ChevronRightIcon className="w-4 h-4 text-[#122646]" />
                    </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-6 relative z-10">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <div key={`${d}-${i}`} className="text-center text-[9px] font-bold text-[#122646]/40 py-1">{d}</div>
                    ))}
                    {Array.from({ length: startDay }).map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}
                    {isLoading && trendCache.length === 0 ? (
                        <div className="col-span-7 h-32 flex flex-col items-center justify-center text-[#122646]/40">
                            <SparklesIcon className="w-6 h-6 animate-spin mb-1 text-[#f2e018]" />
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
                                        ${isSelected ? 'bg-[#122646] text-[#f2e018] scale-110 shadow-lg shadow-[#122646]/30 z-10 ring-2 ring-white' : 'text-[#122646]/80 hover:bg-white'}
                                        ${event ? 'font-bold' : 'font-medium opacity-40'}
                                    `}
                                >
                                    <span className="text-xs z-10 relative">{day}</span>
                                    {event && !isLoading && !isSelected && (
                                        <span className="absolute bottom-1 text-xs opacity-90 drop-shadow-sm">
                                            {event.icon}
                                        </span>
                                    )}
                                    {event?.isRecommended && !isSelected && (
                                        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#f2e018] animate-pulse border border-white" />
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>

                {/* Selected Event Card */}
                <div className={`mt-auto transition-all duration-300 transform ${currentEvent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
                    {currentEvent && (
                        <div className="bg-[#d8e9f4] backdrop-blur-md rounded-2xl p-4 text-[#122646] shadow-xl relative overflow-hidden border border-[#122646]/10 group/card">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] pointer-events-none mix-blend-multiply" />

                            <div className="flex items-start gap-4 relative z-10 mb-4">
                                <div className="w-14 h-14 rounded-2xl bg-white/50 flex items-center justify-center shrink-0 shadow-inner border border-white/40">
                                    <span className="text-4xl drop-shadow-sm">{currentEvent.icon}</span>
                                </div>
                                <div className="flex-1 min-w-0 pt-1">
                                    <h3 className="text-base font-black truncate leading-none mb-1.5 tracking-tight text-[#122646]">{currentEvent.title}</h3>
                                    <p className="text-[11px] text-[#122646]/70 line-clamp-2 leading-relaxed font-bold">{currentEvent.description}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => !isGoogleMaps && onSelectEvent(currentEvent)}
                                disabled={isGoogleMaps}
                                className={`
                                    w-full py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2 border border-[#122646]/5
                                    ${isGoogleMaps
                                        ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                                        : 'bg-white text-[#0071b9] hover:bg-[#fafafa] hover:shadow-md hover:-translate-y-0.5 active:scale-95 active:translate-y-0'
                                    }
                                `}
                            >
                                {isGoogleMaps ? (
                                    <span>GMapでは利用不可</span>
                                ) : (
                                    <>
                                        <SparklesIcon className="w-4 h-4" />
                                        Use this Trend
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
