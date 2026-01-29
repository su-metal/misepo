import React from 'react';
import { GeneratedPost, Platform, GeneratedResult, StoreProfile, Preset } from '../types';
import {
  CloseIcon,
  XIcon,
  InstagramIcon,
  GoogleMapsIcon,
  LineCircleIcon,
  LockIcon,
  TrashIcon,
  HistoryIcon,
  PinIcon
} from './Icons';
import { UI } from '../constants';

interface HistorySidebarProps {
  history: GeneratedPost[];
  isLoggedIn: boolean;
  onSelect: (post: GeneratedPost) => void;
  isOpen: boolean;
  toggleOpen: () => void;
  onOpenLogin: () => void;
  onDelete: (id: string) => void;
  presets?: Preset[];
  onTogglePin: (id: string, isPinned: boolean) => Promise<void>;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({
  history,
  isLoggedIn,
  onSelect,
  isOpen,
  toggleOpen,
  onOpenLogin,
  onDelete,
  presets = [],
  onTogglePin
}) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Helper to pick representative text
  const pickFirstText = (item: GeneratedPost): string => {
    if (Array.isArray(item.results) && item.results.length > 0) {
      const group = item.results.find(
        (group) => group && Array.isArray(group.data) && group.data.length > 0
      );
      if (group) {
        const validEntry = group.data.find(
          (entry) => typeof entry === "string" && entry.trim()
        );
        if (typeof validEntry === "string") return validEntry;
      }
    }
    return "";
  };

  const displayHistory = React.useMemo(() => {
    return [...history].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.timestamp - a.timestamp;
    });
  }, [history]);

  const getPlatformIcon = (p: Platform, className?: string) => {
    const iconClass = className || "w-3 h-3 text-stone-500";
    switch (p) {
      case Platform.X: return <XIcon className={iconClass} />;
      case Platform.Instagram: return <InstagramIcon className={iconClass} />;
      case Platform.GoogleMaps: return <GoogleMapsIcon className={iconClass} />;
      case Platform.Line: return <LineCircleIcon className={iconClass} />;
      default: return null;
    }
  };

  const getPlatformColor = (p: Platform) => {
    switch (p) {
      case Platform.X: return 'bg-stone-900';
      case Platform.Instagram: return 'bg-rose-500';
      case Platform.GoogleMaps: return 'bg-green-600';
      case Platform.Line: return 'bg-green-500';
      default: return 'bg-stone-500';
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-stone-900/20 backdrop-blur-[2px] z-[9990] transition-opacity duration-300"
          onClick={toggleOpen}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[85vw] sm:w-[400px] md:w-[440px] transform transition-all duration-500 cubic-bezier(0.2, 0.8, 0.2, 1) z-[9999] flex flex-col overflow-hidden bg-stone-50 ${isOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full shadow-none'}`}
      >
        {/* Header */}
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-stone-100 bg-white">
          <div>
            <h2 className="font-black text-stone-900 text-2xl tracking-tight">History</h2>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">Your Past Generations</p>
          </div>
          <button
            onClick={toggleOpen}
            className="w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 bg-stone-50 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
            aria-label="Close menu"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content Segment: History */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-6 md:p-8 space-y-6 no-scrollbar bg-stone-50">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/50">
                <HistoryIcon className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">History</span>
                {isLoggedIn && (
                  <span className="text-[11px] font-bold text-stone-800 tracking-tight">
                    {history.filter(h => !h.isPinned).length} items
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 pb-12">
            {isLoggedIn ? (
              displayHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                  <div className="w-20 h-20 mb-6 bg-white border border-stone-100 rounded-[2.5rem] flex items-center justify-center text-stone-200 shadow-sm">
                    <HistoryIcon className="w-10 h-10" />
                  </div>
                  <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">
                    履歴はありません
                  </p>
                </div>
              ) : (
                displayHistory.map((item, idx) => {
                  const firstResult = pickFirstText(item);
                  const previewText = (firstResult && firstResult.trim()) || item.config.inputText || "...";
                  const dateLabel = new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

                  return (
                    <div
                      key={item.id}
                      className="group relative animate-in fade-in slide-in-from-right-4 duration-300"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <button
                        onClick={() => {
                          onSelect(item);
                          toggleOpen();
                        }}
                        className="w-full text-left p-5 rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 relative overflow-hidden"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex flex-col gap-1.5">
                            {item.config.platforms.map((p, pIdx) => (
                              <div key={`${p}-${pIdx}`} className="w-8 h-8 rounded-lg flex items-center justify-center bg-stone-50 border border-stone-100 shadow-sm">
                                {getPlatformIcon(p, "w-4 h-4 text-stone-400")}
                              </div>
                            ))}
                          </div>
                          <div className="flex-1 min-w-0 pr-2">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                                {dateLabel}
                              </span>
                            </div>
                            <p className="text-sm text-stone-700 font-bold line-clamp-2 leading-relaxed transition-colors group-hover:text-indigo-600">
                              {previewText}
                            </p>
                          </div>
                        </div>
                      </button>

                      <div className="absolute top-3 right-3 flex items-center gap-1">
                        {/* Pin Button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); onTogglePin(item.id, !item.isPinned); }}
                          className={`p-2 rounded-lg transition-all ${item.isPinned
                            ? 'text-indigo-600 bg-indigo-50'
                            : 'text-stone-300 hover:text-indigo-400 hover:bg-stone-100 opacity-0 group-hover:opacity-100'
                            }`}
                          title={item.isPinned ? "ピン留めを解除" : "ピン留めして保護"}
                        >
                          <PinIcon className="w-3.5 h-3.5" fill={item.isPinned ? "currentColor" : "none"} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item.id);
                          }}
                          className="p-2 rounded-lg text-stone-300 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                          title="履歴を削除"
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 bg-white border border-stone-100 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-sm">
                  <LockIcon className="w-10 h-10 text-stone-200" />
                </div>
                <h3 className="font-bold text-stone-900 text-xl mb-2">ログインが必要です</h3>
                <p className="text-xs font-medium text-stone-400 mb-8 max-w-[200px]">
                  履歴を保存・閲覧するにはログインを行ってください。
                </p>
                <button
                  onClick={() => { onOpenLogin(); toggleOpen(); }}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg shadow-indigo-100 font-bold uppercase tracking-widest hover:opacity-90 transition-all"
                >
                  Login / Register
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer: Legal Notice (Simple) */}
        <div className="p-8 border-t border-stone-100 bg-stone-50/50">
          <p className="text-[9px] font-bold text-stone-300 text-center uppercase tracking-[0.4em]">© 2026 {UI.name}</p>
        </div>
      </div>
    </>
  );
};

export default HistorySidebar;
