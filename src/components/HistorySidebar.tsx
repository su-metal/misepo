import React from 'react';
import { GeneratedPost, Platform, GeneratedResult } from '../types';
import { XIcon, InstagramIcon, GoogleMapsIcon, LockIcon, TrashIcon, HistoryIcon } from './Icons';

interface HistorySidebarProps {
  history: GeneratedPost[];
  isLoggedIn: boolean;
  onSelect: (post: GeneratedPost) => void;
  isOpen: boolean;
  toggleOpen: () => void;
  onOpenLogin: () => void;
  onDelete: (id: string) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, isLoggedIn, onSelect, isOpen, toggleOpen, onOpenLogin, onDelete }) => {
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
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] transition-opacity duration-300"
          onClick={toggleOpen}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full bg-[#0F172A] w-80 transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-[110] flex flex-col shadow-[24px_0_80px_rgba(0,0,0,0.4)] overflow-hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Tech Background Effects */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <HistoryIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-black text-white text-lg tracking-tight leading-none">History</h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Generation Archive</p>
            </div>
          </div>
          <button
            onClick={toggleOpen}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5 active:scale-95"
            aria-label="Close history"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-6 relative z-10 space-y-4 no-scrollbar">
          {!isLoggedIn ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-6">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-[32px] flex items-center justify-center border border-indigo-500/20 text-indigo-400 animate-pulse">
                <LockIcon className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white">履歴の保存</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                  作成した内容は自動で保存されます。<br />
                  いつでも振り返りが可能です。
                </p>
              </div>
              <button
                onClick={() => {
                  onOpenLogin();
                  if (window.innerWidth < 768) toggleOpen();
                }}
                className="w-full py-5 bg-white text-[#0F172A] text-sm font-black rounded-2xl shadow-xl shadow-black/20 hover:bg-slate-100 transition-all active:scale-95 flex items-center justify-center gap-2 group"
              >
                ログイン / 登録
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="translate-x-0 group-hover:translate-x-1 transition-transform"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
              </button>
            </div>
          ) : (
            <>
              {displayHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                  <div className="w-16 h-16 bg-white/5 rounded-[24px] flex items-center justify-center mb-4 border border-white/5">
                    <HistoryIcon className="w-8 h-8 text-slate-500" />
                  </div>
                  <p className="text-sm text-slate-500 font-black uppercase tracking-widest">No Record Found</p>
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
                        if (typeof validEntry === "string") {
                          return validEntry;
                        }

                        const fallback = group.data[0];
                        if (typeof fallback === "string") {
                          return fallback;
                        }
                      }

                      const firstRaw = results[0];
                      if (typeof firstRaw === "string") {
                        return firstRaw;
                      }
                    }

                    if (typeof results === "string") {
                      return results;
                    }

                    return "";
                  };

                  const firstResult = pickFirstText(item.results);
                  const previewText =
                    (firstResult && firstResult.trim()) ||
                    item.config.inputText ||
                    "No preview available";

                  return (
                    <div
                      key={item.id}
                      className="group relative animate-in slide-in-from-bottom-4 duration-500"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <button
                        onClick={() => {
                          onSelect(item);
                          toggleOpen();
                        }}
                        className="w-full text-left p-6 md:p-5 rounded-[28px] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] group-active:scale-[0.98]"
                      >
                        <div className="flex items-center gap-1.5 mb-4">
                          {item.config.platforms.map((p) => (
                            <span
                              key={p}
                              className={`flex items-center justify-center w-5 h-5 rounded-lg shadow-lg ${getPlatformColor(p)} border border-white/10`}
                              title={p}
                            >
                              {getPlatformIcon(p)}
                            </span>
                          ))}
                          <span className="ml-auto text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-bold line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                          {previewText}
                        </p>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item.id);
                        }}
                        className="absolute -top-1 -right-1 w-8 h-8 flex items-center justify-center bg-rose-500/90 text-white rounded-full opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all hover:bg-rose-600 shadow-lg z-20"
                        aria-label="Delete history"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default HistorySidebar;
