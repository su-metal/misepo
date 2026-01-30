import React from 'react';
import { MOCK_TRENDS, TrendEvent } from './TrendData';
import { SparklesIcon, CloseIcon, ChevronRightIcon } from '../../Icons';

interface MobileCalendarOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectEvent: (event: TrendEvent) => void;
}

export const MobileCalendarOverlay: React.FC<MobileCalendarOverlayProps> = ({
    isOpen, onClose, onSelectEvent
}) => {
    // Basic calendar logic (Static Feb 2026 for Mock)
    // Calendar State
    const [currentYear, setCurrentYear] = React.useState(2026);
    const [currentMonth, setCurrentMonth] = React.useState(1); // Start at Feb (0-indexed 1)

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startDay = new Date(currentYear, currentMonth, 1).getDay(); // Sunday = 0
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Handlers
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

    const [selectedDate, setSelectedDate] = React.useState<string | null>(null);

    // Reset selection on open
    React.useEffect(() => {
        if (isOpen) setSelectedDate(null);
    }, [isOpen]);

    if (!isOpen) return null;

    const currentEvent = selectedDate
        ? MOCK_TRENDS.find(e => e.date === selectedDate)
        : null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Calendar Card */}
            <div className="relative w-[90%] max-w-sm bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[40px] shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                {/* Header with Navigation */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <button onClick={handlePrevMonth} className="p-1 -ml-1 hover:bg-white/10 rounded-full transition-colors active:scale-95">
                                <ChevronRightIcon className="w-4 h-4 text-white rotate-180" />
                            </button>
                            <h2 className="text-2xl font-black text-white tracking-tight w-32 text-center">{monthNames[currentMonth]}</h2>
                            <button onClick={handleNextMonth} className="p-1 hover:bg-white/10 rounded-full transition-colors active:scale-95">
                                <ChevronRightIcon className="w-4 h-4 text-white" />
                            </button>
                        </div>
                        <span className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">{currentYear} トレンド予報</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        <CloseIcon className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-6">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                        <div key={d} className="text-center text-[10px] font-bold text-white/30 py-2">{d}</div>
                    ))}
                    {Array.from({ length: startDay }).map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const event = MOCK_TRENDS.find(e => e.date === dateStr);
                        const isSelected = selectedDate === dateStr;

                        return (
                            <button
                                key={day}
                                onClick={() => setSelectedDate(dateStr)}
                                className={`
                                    aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all duration-300
                                    ${isSelected ? 'bg-[var(--plexo-yellow)] text-black scale-110 shadow-lg z-10' : 'text-white hover:bg-white/5'}
                                    ${event ? 'font-bold' : 'font-medium opacity-60'}
                                `}
                            >
                                <span className="text-sm z-10 relative">{day}</span>
                                {event && (
                                    <span className="absolute -bottom-1 text-[10px] transform scale-75">{event.icon}</span>
                                )}
                                {event?.isRecommended && !isSelected && (
                                    <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#FF4081] animate-pulse" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Event Detail & Action */}
                <div className={`transition-all duration-300 ${currentEvent || selectedDate ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
                    {currentEvent ? (
                        <div className="bg-white/5 rounded-[24px] p-5 border border-white/10">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="text-4xl">{currentEvent.icon}</div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold text-white leading-tight">{currentEvent.title}</h3>
                                        {currentEvent.isRecommended && (
                                            <span className="bg-[#FF4081] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Hot</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-white/70 leading-relaxed">{currentEvent.description}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => onSelectEvent(currentEvent)}
                                className="w-full py-4 rounded-[20px] bg-gradient-to-r from-[var(--plexo-yellow)] to-amber-300 text-black font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <SparklesIcon className="w-4 h-4" />
                                戦略を作成する
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white/5 rounded-[24px] p-5 border border-white/10 flex items-center justify-center h-[140px] text-white/30 text-xs font-bold uppercase tracking-widest">
                            {selectedDate ? "特になし" : "日付を選択"}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
