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
    const [failedMonths, setFailedMonths] = React.useState<Set<string>>(new Set());

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startDay = new Date(currentYear, currentMonth, 1).getDay();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    React.useEffect(() => {
        setTrendCache([]);
        setHasFetched(false);
        setFailedMonths(new Set());
    }, [industry, description]);

    const fetchTrends = async (year: number, month: number, force: boolean = false) => {
        const monthKey = `${year}-${month}`;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/trends`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    year: year,
                    month: month + 1,
                    duration: 3,
                    force: force,
                    industry: industry || '',
                    description: description || ''
                })
            });
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
            // If success, remove from failed if it was there
            setFailedMonths(prev => {
                const next = new Set(prev);
                next.delete(monthKey);
                return next;
            });
        } catch (e) {
            console.error(e);
            setFailedMonths(prev => new Set(prev).add(monthKey));
        } finally {
            setIsLoading(false);
            setHasFetched(true);
        }
    };

    React.useEffect(() => {
        const monthKey = `${currentYear}-${currentMonth}`;
        if (!hasFetched && !failedMonths.has(monthKey)) {
            fetchTrends(currentYear, currentMonth);
        }
    }, [hasFetched, currentYear, currentMonth, failedMonths]);

    React.useEffect(() => {
        const targetPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
        const hasDataForMonth = trendCache.some(t => t.date.startsWith(targetPrefix));
        const monthKey = `${currentYear}-${currentMonth}`;

        if (!hasDataForMonth && !isLoading && !failedMonths.has(monthKey)) {
            fetchTrends(currentYear, currentMonth);
        }
    }, [currentYear, currentMonth, trendCache, isLoading, failedMonths]);

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
            <div className="flex-1 bg-white border border-slate-100 shadow-sm rounded-[32px] p-6 flex flex-col relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-bl from-white to-[#f8fafc]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 flex items-center justify-center">
                            <CalendarIcon className="w-7 h-7 text-[#2b2b2f]" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.15em] text-[#2b2b2f]/40">Trend Command</div>
                            <h2 className="text-base font-black text-[#2b2b2f] tracking-tight leading-none">Calendar</h2>
                        </div>
                    </div>
                    <button
                        onClick={() => fetchTrends(currentYear, currentMonth, true)}
                        disabled={isLoading}
                        className={`w-10 h-10 rounded-full bg-white hover:bg-slate-50 flex items-center justify-center transition-all border border-slate-100 shadow-sm active:scale-95 ${isLoading ? 'animate-spin' : ''}`}
                    >
                        <RotateCcwIcon className="w-5 h-5 text-[#2b2b2f]" />
                    </button>
                </div>

                {/* Month Nav */}
                <div className="flex items-center justify-between mb-4 relative z-10 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <button
                        onClick={handlePrevMonth}
                        disabled={currentYear === baseDate.getFullYear() && currentMonth === baseDate.getMonth()}
                        className="p-1 rounded-lg hover:bg-white hover:shadow-sm transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                        <ChevronRightIcon className="w-4 h-4 text-[#2b2b2f] rotate-180" />
                    </button>
                    <span className="text-xs font-black text-[#2b2b2f] tracking-tight uppercase tracking-widest">{monthNames[currentMonth]} {currentYear}</span>
                    <button
                        onClick={handleNextMonth}
                        disabled={
                            (currentYear > baseDate.getFullYear()) ||
                            (currentYear === baseDate.getFullYear() && currentMonth >= baseDate.getMonth() + 2)
                        }
                        className="p-1 rounded-lg hover:bg-white hover:shadow-sm transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                        <ChevronRightIcon className="w-4 h-4 text-[#2b2b2f]" />
                    </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-6 relative z-10">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <div key={`${d}-${i}`} className="text-center text-[9px] font-bold text-[#b0b0b0] py-1">{d}</div>
                    ))}
                    {Array.from({ length: startDay }).map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}
                    {isLoading && trendCache.length === 0 ? (
                        <div className="col-span-7 h-32 flex flex-col items-center justify-center text-[#b0b0b0]">
                            <div className="w-6 h-6 border-2 border-slate-100 border-t-[#80CAFF] rounded-full animate-spin mb-2" />
                            <span className="text-[9px] font-bold tracking-widest animate-pulse">Scanning Trends...</span>
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
                                        ${isSelected
                                            ? 'bg-[#2b2b2f] text-white scale-110 shadow-lg z-10 ring-2 ring-white'
                                            : 'text-[#2b2b2f] hover:bg-slate-50'}
                                        ${event ? 'font-bold' : 'font-medium opacity-40'}
                                    `}
                                >
                                    <span className="text-xs z-10 relative">{day}</span>
                                    {event && !isLoading && !isSelected && (
                                        <span className="absolute bottom-1 text-[10px] opacity-90 drop-shadow-sm">
                                            {event.icon}
                                        </span>
                                    )}
                                    {event?.isRecommended && !isSelected && (
                                        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#80CAFF] via-[#C084FC] to-[#F87171] animate-pulse border border-white" />
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>

                {/* Guide Text - Shown when nothing is selected */}
                {!currentEvent && (
                    <div className="flex-1 flex flex-col items-center justify-center p-4 text-center animate-in fade-in slide-in-from-bottom-2 duration-1000">
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-700">
                            <SparklesIcon className="w-6 h-6 text-[#80CAFF]/30" />
                        </div>
                        <h3 className="text-xs font-black text-[#2b2b2f]/80 mb-2">カレンダーを活用する</h3>
                        <p className="text-[11px] font-bold text-[#b0b0b0] leading-relaxed max-w-[200px]">
                            カレンダーの日付を選択すると、その時期に合わせた話題やトレンドを提案します。
                        </p>
                        <div className="mt-6 flex gap-1">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-1 h-1 rounded-full bg-slate-100" />
                            ))}
                        </div>
                    </div>
                )}

                {/* Selected Event Card */}
                <div className={`mt-auto transition-all duration-300 transform ${currentEvent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
                    {currentEvent && (
                        <div className="bg-slate-50 rounded-2xl p-4 text-[#2b2b2f] border border-slate-100 relative overflow-hidden group/card shadow-sm">
                            <div className="flex items-start gap-4 relative z-10 mb-4">
                                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                                    <span className="text-3xl drop-shadow-sm">{currentEvent.icon}</span>
                                </div>
                                <div className="flex-1 min-w-0 pt-1">
                                    <h3 className="text-sm font-black leading-tight mb-1.5 tracking-tight text-[#2b2b2f]">{currentEvent.title}</h3>
                                    <p className="text-[10px] text-[#b0b0b0] leading-relaxed font-bold whitespace-pre-wrap">{currentEvent.description}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => !isGoogleMaps && onSelectEvent(currentEvent)}
                                disabled={isGoogleMaps}
                                className={`
                                    w-full py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2 border border-[#2b2b2f]/5
                                    ${isGoogleMaps
                                        ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                                        : 'bg-[#2b2b2f] text-white hover:opacity-90 hover:shadow-md hover:-translate-y-0.5 active:scale-95 active:translate-y-0'
                                    }
                                `}
                            >
                                {isGoogleMaps ? (
                                    <span>利用不可</span>
                                ) : (
                                    <>
                                        <SparklesIcon className="w-4 h-4 text-[#80CAFF]" />
                                        このテーマで作成
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
