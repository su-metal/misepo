import React from 'react';
import { GeneratedPost, Platform, GeneratedResult, StoreProfile } from '../types';
import { XIcon, InstagramIcon, GoogleMapsIcon, LockIcon, TrashIcon, HistoryIcon, HelpIcon, LogOutIcon, ChevronDownIcon } from './Icons';

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
  onLogout?: () => void;
  storeProfile?: StoreProfile | null;
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
  onLogout,
  storeProfile
}) => {
  const displayHistory = history;

  const getPlatformIcon = (p: Platform) => {
    switch (p) {
      case Platform.X: return <XIcon className="w-3 h-3 text-white" />;
      case Platform.Instagram: return <InstagramIcon className="w-3 h-3 text-white" />;
      case Platform.GoogleMaps: return <GoogleMapsIcon className="w-3 h-3 text-white" />;
      default: return null;
    }
  };

  const getPlatformColor = (p: Platform) => {
    switch (p) {
      case Platform.X: return 'bg-black';
      case Platform.Instagram: return 'bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500';
      case Platform.GoogleMaps: return 'bg-green-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      {/* Mobile Toggle Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-[9990] transition-opacity duration-300"
          onClick={toggleOpen}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full bg-white w-80 transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-[9999] flex flex-col shadow-[24px_0_80px_rgba(0,0,0,0.15)] overflow-hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Tech Background Effects */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

        {/* Header: User Profile & Close */}
        <div className="p-8 border-b border-stone-100 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-black text-stone-800 text-2xl tracking-tighter">MENU</h2>
            <button
              onClick={toggleOpen}
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-stone-50 text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-all border border-stone-100 active:scale-95 shadow-sm"
              aria-label="Close menu"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {isLoggedIn ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-3xl bg-stone-50 border border-stone-100">
                <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-lime font-black text-xl shadow-lg shadow-black/20">
                  {(storeProfile?.name?.[0] || 'S').toUpperCase()}
                </div>
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Account</p>
                  <p className="text-sm font-black text-stone-800 tracking-tight">{storeProfile?.name || 'User'}</p>
                </div>
              </div>

              {/* Quick Navigation Pack */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { onOpenSettings?.(); toggleOpen(); }}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-stone-50 border border-stone-100 hover:border-lime/30 hover:bg-white transition-all group"
                >
                  <ChevronDownIcon className="w-5 h-5 text-stone-400 group-hover:text-lime rotate-180" />
                  <span className="text-[10px] font-black text-stone-600 tracking-widest uppercase">Profile</span>
                </button>
                <button
                  onClick={() => { onOpenGuide?.(); toggleOpen(); }}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-stone-50 border border-stone-100 hover:border-lime/30 hover:bg-white transition-all group"
                >
                  <HelpIcon className="w-5 h-5 text-stone-400 group-hover:text-lime" />
                  <span className="text-[10px] font-black text-stone-600 tracking-widest uppercase">Docs</span>
                </button>
              </div>

              <button
                onClick={() => { onLogout?.(); toggleOpen(); }}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-stone-400 hover:text-rose-500 hover:bg-rose-50 border border-stone-50 hover:border-rose-100 transition-all text-[10px] font-black tracking-widest uppercase"
              >
                <LogOutIcon className="w-4 h-4" />
                Sign Out
              </button>

            </div>
          ) : (
            <button
              onClick={() => { onOpenLogin(); toggleOpen(); }}
              className="w-full py-5 bg-black text-lime text-sm font-black rounded-2xl shadow-xl shadow-black/20 hover:bg-stone-900 transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
              ログイン / 登録
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transtone-x-0 group-hover:transtone-x-1 transition-transform"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
            </button>
          )}
        </div>

        {/* Content Segment: History */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-6 relative z-10 space-y-6 no-scrollbar">
          <div className="flex items-center gap-2 px-2">
            <HistoryIcon className="w-4 h-4 text-stone-300" />
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">History Archive</span>
          </div>

          <div className="space-y-4">
            {isLoggedIn ? (
              displayHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
                  <p className="text-xs text-stone-400 font-bold tracking-widest uppercase">履歴はありません</p>
                </div>
              ) : (
                displayHistory.map((item, idx) => {
                  const pickFirstText = (results: GeneratedResult[] | unknown): string => {
                    if (Array.isArray(results) && results.length > 0) {
                      const group = (results as GeneratedResult[]).find(
                        (group) => group && Array.isArray(group.data) && group.data.length > 0
                      );

                      if (group) {
                        const validEntry = group.data.find(
                          (entry) => typeof entry === "string" && entry.trim()
                        );
                        if (typeof validEntry === "string") return validEntry;
                      }
                    }
                    return typeof results === "string" ? results : "";
                  };

                  const firstResult = pickFirstText(item.results);
                  const previewText = (firstResult && firstResult.trim()) || item.config.inputText || "...";

                  return (
                    <div
                      key={item.id}
                      className="group relative animate-in slide-in-from-bottom-2 duration-500"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <button
                        onClick={() => { onSelect(item); toggleOpen(); }}
                        className="w-full text-left p-5 rounded-[2rem] bg-stone-50 border border-stone-100 hover:bg-white hover:border-lime/30 transition-all shadow-sm"
                      >
                        <div className="flex items-center gap-1.5 mb-3">
                          {item.config.platforms.map((p) => (
                            <span key={p} className={`flex items-center justify-center w-4 h-4 rounded-md ${getPlatformColor(p)}`}>
                              {getPlatformIcon(p)}
                            </span>
                          ))}
                          <span className="ml-auto text-[9px] font-black text-stone-400 uppercase tracking-tighter">
                            {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 font-bold line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100">
                          {previewText}
                        </p>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                        className="absolute -top-1 -right-1 w-7 h-7 flex items-center justify-center bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all hover:bg-rose-600 shadow-lg z-20"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )
            ) : null}
          </div>
        </div>

        {/* Footer: Legal */}
        <div className="p-6 border-t border-stone-100 bg-stone-50/50 relative z-20">
          <div className="flex items-center justify-center gap-6">
            <a href="/terms" className="text-[10px] font-black text-stone-400 hover:text-lime transition-colors uppercase tracking-widest">Terms</a>
            <a href="/privacy" className="text-[10px] font-black text-stone-400 hover:text-lime transition-colors uppercase tracking-widest">Privacy</a>
          </div>
          <p className="text-[9px] font-bold text-stone-300 text-center mt-3 uppercase tracking-widest">© 2026 MisePo Inc.</p>
        </div>
      </div>
    </>
  );
};

export default HistorySidebar;
