import React from 'react';
import { GeneratedPost, Platform, Preset } from '../types';
import {
  CloseIcon,
  XIcon,
  InstagramIcon,
  GoogleMapsIcon,
  LineIcon,
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
    const iconClass = className || "w-3 h-3 text-slate-400";
    switch (p) {
      case Platform.X: return <XIcon className={iconClass} />;
      case Platform.Instagram: return <InstagramIcon className={iconClass} />;
      case Platform.GoogleMaps: return <GoogleMapsIcon className={iconClass} />;
      case Platform.Line: return <LineIcon className={iconClass} color="currentColor" textFill="white" />;
      default: return null;
    }
  };

  const renderHistoryItem = (item: GeneratedPost, idx: number) => {
    const firstResult = pickFirstText(item);
    const previewText = (firstResult && firstResult.trim()) || item.config.inputText || "...";
    const dateLabel = new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

    return (
      <div
        key={item.id}
        className="group relative animate-in fade-in slide-in-from-right-8 duration-500"
        style={{ animationDelay: `${idx * 40}ms` }}
      >
        <button
          onClick={() => {
            onSelect(item);
            toggleOpen();
          }}
          className={`w-full text-left rounded-[28px] transition-all duration-500 relative overflow-hidden flex flex-col gap-3 hover:-translate-y-1 active:scale-[0.98] shadow-[0_20px_45px_rgba(9,13,43,0.05)] ${item.isPinned
            ? 'bg-[var(--brand-primary)]/5 p-[1.5px] shadow-md shadow-[var(--brand-primary)]/5 ring-1 ring-[var(--brand-primary)]/20'
            : 'bg-white/90 p-6 border border-slate-200 shadow-lg shadow-slate-900/5 hover:border-[var(--brand-primary)]/30'
            }`}
        >
          {/* Subtle Inner Glow for Pinned */}
          {item.isPinned && (
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
          )}

          <div className={`relative w-full h-full flex flex-col gap-4 ${item.isPinned ? 'bg-white rounded-[27px] p-6' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {item.config.platforms.map((p, pIdx) => (
                  <div key={`${p}-${pIdx}`} className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-[#2b2b2f]/5 shadow-sm group-hover:border-[var(--brand-primary)]/20 transition-colors">
                    {getPlatformIcon(p, "w-3.5 h-3.5 text-slate-400 group-hover:text-[var(--brand-primary)] transition-colors")}
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                {dateLabel}
              </span>
            </div>

            <p className="text-sm text-[#2b2b2f] font-bold tracking-tight line-clamp-2 leading-relaxed transition-colors group-hover:text-[var(--brand-primary)] pr-12">
              {previewText}
            </p>
          </div>
        </button>

        {/* Floating Actions */}
        <div className={`absolute bottom-6 right-6 flex flex-row md:flex-col gap-2 transition-all duration-500 z-30 ${item.isPinned ? 'opacity-100' : 'opacity-100 md:opacity-0 md:group-hover:opacity-100 md:translate-x-2 md:group-hover:translate-x-0'}`}>
          <button
            onClick={(e) => { e.stopPropagation(); onTogglePin(item.id, !item.isPinned); }}
            className={`w-8.5 h-8.5 flex items-center justify-center transition-all ${item.isPinned
              ? 'text-[var(--brand-accent)]'
              : 'text-slate-200 hover:text-[var(--brand-primary)] hover:scale-110'
              }`}
            title={item.isPinned ? "ピン留めを解除" : "ピン留めして保護"}
          >
            <PinIcon className="w-4 h-4" fill={item.isPinned ? "currentColor" : "none"} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="w-8.5 h-8.5 flex items-center justify-center text-slate-200 hover:text-rose-500 hover:scale-110 transition-all font-black"
            title="履歴を削除"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Pinned Accent Bar */}
        {item.isPinned && (
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--brand-primary)] rounded-r-full shadow-[2px_0_10px_rgba(0,0,0,0.1)] z-20" />
        )}
      </div>
    );
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9990] animate-in fade-in duration-300"
          onClick={toggleOpen}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[85vw] sm:w-[400px] md:w-[440px] transform transition-all duration-500 cubic-bezier(0.2, 0.8, 0.2, 1) z-[9999] flex flex-col overflow-hidden bg-white shadow-2xl ring-1 ring-black/5 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="px-8 py-6 md:py-8 flex items-center justify-between border-b border-[#2b2b2f]/5 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 className="font-black text-[#2b2b2f] text-xl md:text-2xl tracking-tight uppercase leading-none">生成履歴</h2>
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mt-2 opacity-60">過去に作成した全ての投稿案</p>
          </div>
          <button
            onClick={toggleOpen}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all active:scale-90"
            aria-label="Close menu"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content Segment: History */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-6 md:p-8 space-y-8 no-scrollbar bg-slate-50/20">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#2b2b2f]/5 flex items-center justify-center text-[#2b2b2f] shadow-sm">
                <HistoryIcon className="w-6 h-6 opacity-80" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Saved Results</span>
                {isLoggedIn && (
                  <span className="text-sm font-black text-[#2b2b2f] tracking-tighter">
                    {history.length} <span className="text-[10px] opacity-40 ml-1">件の履歴</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-10 pb-10">
            {isLoggedIn ? (
              history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                  <div className="w-24 h-24 mb-6 bg-white rounded-[32px] flex items-center justify-center text-slate-100 shadow-sm ring-1 ring-slate-100/50">
                    <HistoryIcon className="w-10 h-10" />
                  </div>
                  <h5 className="text-sm font-black text-[#2b2b2f] mb-2">まだ履歴がありません</h5>
                  <p className="text-[11px] text-stone-500 font-medium leading-relaxed">
                    作成した投稿案は、ここに自動で保存されます。<br />
                    いつでも見返したり、再編集したりできますよ。
                  </p>
                </div>
              ) : (
                <>
                  {/* Pinned Section */}
                  {displayHistory.some(i => i.isPinned) && (
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 px-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)]"></div>
                        <span className="text-[11px] font-black text-[var(--brand-primary)] uppercase tracking-[0.25em]">お気に入り</span>
                      </div>
                      <div className="space-y-4">
                        {displayHistory.filter(i => i.isPinned).map((item, idx) => renderHistoryItem(item, idx))}
                      </div>
                    </div>
                  )}

                  {/* Recent Section */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 px-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">最近の履歴</span>
                    </div>
                    <div className="space-y-4">
                      {displayHistory.filter(i => !i.isPinned).map((item, idx) => renderHistoryItem(item, idx))}
                    </div>
                  </div>
                </>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="w-24 h-24 bg-white rounded-[40px] shadow-sm flex items-center justify-center mb-10 ring-1 ring-slate-100">
                  <LockIcon className="w-10 h-10 text-slate-100" />
                </div>
                <h3 className="font-black text-slate-800 text-xl md:text-2xl mb-3 tracking-tight">ログインが必要です</h3>
                <p className="text-sm font-bold text-slate-400 mb-10 max-w-[240px] leading-relaxed">
                  履歴を安全に保存・同期するには、アカウントへのログインが必要です。
                </p>
                <button
                  onClick={() => { onOpenLogin(); toggleOpen(); }}
                  className="w-full py-5 bg-[#2b2b2f] text-white rounded-[20px] shadow-xl shadow-slate-100 font-black text-xs uppercase tracking-[0.2em] hover:bg-stone-800 active:scale-95 transition-all"
                >
                  ログイン / 新規登録
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-50 bg-white">
          <p className="text-[9px] font-black text-[#2b2b2f]/30 text-center uppercase tracking-[0.4em]">© 2026 {UI.name}</p>
        </div>
      </div>
    </>
  );
};

export default HistorySidebar;
