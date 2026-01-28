import React from 'react';
import { GeneratedPost, Platform, GeneratedResult, StoreProfile, Preset } from '../types';
import { CloseIcon, XIcon, InstagramIcon, GoogleMapsIcon, LineIcon, LineCircleIcon, LockIcon, TrashIcon, HistoryIcon, HelpIcon, LogOutIcon, ChevronDownIcon, PinIcon, MessageCircleIcon } from './Icons';
import { Feedback } from './Feedback';
import { UI, TOKENS } from '../constants';

interface HistorySidebarProps {
  history: GeneratedPost[];
  isLoggedIn: boolean;
  onSelect: (post: GeneratedPost) => void;
  isOpen: boolean;
  toggleOpen: () => void;
  onOpenLogin: () => void;
  onDelete: (id: string) => void;
  onOpenGuide?: () => void;
  onOpenSettings?: () => void;
  onOpenAccount?: () => void;
  onLogout?: () => void;
  storeProfile?: StoreProfile | null;
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
  onOpenGuide,
  onOpenSettings,
  onOpenAccount,
  onLogout,
  storeProfile,
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
    // Default: Show history log
    return [...history].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.timestamp - a.timestamp;
    });
  }, [history]);

  const getPlatformIcon = (p: Platform) => {
    switch (p) {
      case Platform.X: return <XIcon className="w-3 h-3 text-white" />;
      case Platform.Instagram: return <InstagramIcon className="w-3 h-3 text-white" />;
      case Platform.GoogleMaps: return <GoogleMapsIcon className="w-3 h-3 text-white" />;
      case Platform.Line: return <LineCircleIcon className="w-3 h-3 text-white" />;
      default: return null;
    }
  };

  const getPlatformColor = (p: Platform) => {
    switch (p) {
      case Platform.X: return 'bg-black';
      case Platform.Instagram: return 'bg-[#E1306C]'; // Instagram official color
      case Platform.GoogleMaps: return 'bg-[#34A853]'; // Google Green
      case Platform.Line: return 'bg-[#06C755]'; // LINE Official Green
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      {/* Mobile Toggle Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9990] transition-opacity duration-300"
          onClick={toggleOpen}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full bg-[var(--bg-beige)] border-r-[3px] border-black shadow-[8px_0_0_0_rgba(0,0,0,0.1)] w-[85vw] sm:w-[400px] md:w-[480px] transform transition-all duration-500 cubic-bezier(0.2, 0.8, 0.2, 1) z-[9999] flex flex-col overflow-hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header: User Profile & Close */}
        <div className="p-4 md:p-6 border-b-[3px] relative z-10 bg-[var(--bg-beige)] border-black">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-black text-2xl tracking-tighter">MENU</h2>
            <button
              onClick={toggleOpen}
              className="w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 group bg-white border-2 border-black text-black hover:bg-[var(--rose)] active:translate-y-1 active:shadow-none shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
              aria-label="Close menu"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {isLoggedIn ? (
            <div className="space-y-4">
              <button
                onClick={() => { onOpenSettings?.(); toggleOpen(); }}
                className="flex items-center gap-3 p-3 rounded-xl transition-all text-left group bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] w-full hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg shrink-0 bg-[var(--lavender)] border-2 border-black text-black">
                  {(storeProfile?.name?.[0] || 'S').toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-widest mb-0 text-slate-500">Store Profile</p>
                  <p className="text-sm font-black text-black tracking-tight truncate">{storeProfile?.name || 'User'}</p>
                </div>
              </button>

              {/* Quick Navigation Pack */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => { onOpenAccount?.(); toggleOpen(); }}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all group bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-[var(--bg-beige)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                  title="アカウント設定"
                >
                  <ChevronDownIcon className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
                  <span className="text-[8px] font-black text-black tracking-widest uppercase">Account</span>
                </button>
                <button
                  onClick={() => { onOpenGuide?.(); toggleOpen(); }}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all group bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-[var(--bg-beige)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                  title="Docs"
                >
                  <HelpIcon className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
                  <span className="text-[8px] font-black text-black tracking-widest uppercase">Docs</span>
                </button>
                <Feedback mode="sidebar" />
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => { onLogout?.(); toggleOpen(); }}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl transition-all text-[9px] font-black tracking-widest uppercase text-slate-400 hover:text-black hover:bg-white border-2 border-transparent hover:border-black hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                >
                  <LogOutIcon className="w-3 h-3" />
                  Sign Out
                </button>
              </div>

            </div>
          ) : (
            <button
              onClick={() => { onOpenLogin(); toggleOpen(); }}
              className="w-full py-4 bg-[var(--gold)] text-black border-2 border-black rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] text-sm font-black hover:bg-[var(--rose)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-3 group"
            >
              ログイン / 登録
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="translate-x-0 group-hover:translate-x-1 transition-transform"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
            </button>
          )}
        </div>

        {/* Content Segment: History */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-6 md:p-8 relative z-10 space-y-6 no-scrollbar bg-[var(--bg-beige)]">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-black">
                <HistoryIcon className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-black uppercase tracking-[0.3em]">History</span>
                {isLoggedIn && (
                  <span className="text-[9px] font-bold text-slate-500 -mt-0.5">
                    {history.filter(h => !h.isPinned).length} items
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {isLoggedIn ? (
              displayHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                  <div className="w-16 h-16 mb-4 rounded-full flex items-center justify-center bg-white border-2 border-black text-slate-300">
                    <HistoryIcon className="w-8 h-8" />
                  </div>
                  <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">
                    履歴はありません
                  </p>
                </div>
              ) : (
                displayHistory.map((item, idx) => {
                  const firstResult = pickFirstText(item);
                  const previewText = (firstResult && firstResult.trim()) || item.config.inputText || "...";

                  // Removed isFavorited logic for display
                  // const isFavorited = checkIfFavorited(item); 
                  const primaryPlatform = item.config.platforms[0] || Platform.Instagram;
                  // Removed isTraining check as we only show history

                  return (
                    <div
                      key={item.id}
                      className="group relative animate-in slide-in-from-bottom-2 duration-500"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <button
                        onClick={() => {
                          onSelect(item);
                          toggleOpen();
                        }}
                        className="w-full text-left p-5 rounded-xl transition-all group-hover:bg-[var(--bg-beige)] bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          {item.config.platforms.map((p, pIdx) => (
                            <span key={`${p}-${pIdx}`} className={`flex items-center justify-center w-6 h-6 rounded-full ${getPlatformColor(p)} border-2 border-black text-white`}>
                              {getPlatformIcon(p)}
                            </span>
                          ))}
                          <div className="ml-auto flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 py-1">
                              {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-700 font-bold line-clamp-2 leading-relaxed opacity-90 group-hover:opacity-100 group-hover:text-black transition-colors">
                          {previewText}
                        </p>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item.id);
                        }}
                        className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center rounded-full transition-all z-20 hover:scale-110 bg-white text-rose-500 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] opacity-0 group-hover:opacity-100"
                        title="履歴を削除"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>

                      {/* Pin Button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); onTogglePin(item.id, !item.isPinned); }}
                        className={`absolute -top-3 left-6 w-8 h-8 flex items-center justify-center rounded-full transition-all z-20 hover:scale-110 ${item.isPinned
                          ? 'bg-[var(--gold)] text-black border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]'
                          : 'bg-white text-slate-300 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] opacity-0 group-hover:opacity-100'
                          }`}
                        title={item.isPinned ? "ピン留めを解除" : "ピン留めして保護"}
                      >
                        <PinIcon className="w-4 h-4" fill={item.isPinned ? "currentColor" : "none"} />
                      </button>
                    </div>
                  );
                })
              )
            ) : null}
          </div>
        </div>

        {/* Footer: Legal */}
        <div className="p-6 border-t-[3px] border-black bg-[var(--bg-beige)] relative z-20">
          <div className="flex items-center justify-center gap-6 mb-2">
            <a href="/terms" className="text-[10px] font-black text-slate-500 hover:text-black transition-colors uppercase tracking-widest">利用規約</a>
            <a href="/privacy" className="text-[10px] font-black text-slate-500 hover:text-black transition-colors uppercase tracking-widest">プライバシーポリシー</a>
            <a href="/commercial-law" className="text-[10px] font-black text-slate-500 hover:text-black transition-colors uppercase tracking-widest">特定商取引法</a>
          </div>
          <p className="text-[9px] font-bold text-slate-500 text-center uppercase tracking-[0.2em] mt-2">© 2026 {UI.name}</p>
        </div>
      </div >
    </>
  );
};

export default HistorySidebar;
