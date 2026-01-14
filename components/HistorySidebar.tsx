
import React from 'react';
import { GeneratedPost, Platform, GeneratedResult } from '../types';
import { XIcon, InstagramIcon, GoogleMapsIcon, LockIcon, TrashIcon } from './Icons';

interface HistorySidebarProps {
  history: GeneratedPost[];
  isPro: boolean;
  isLoggedIn: boolean;
  onSelect: (post: GeneratedPost) => void;
  isOpen: boolean;
  toggleOpen: () => void;
  onOpenLogin: () => void;
  onOpenUpgrade?: () => void;
  onDelete: (id: string) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, isPro, isLoggedIn, onSelect, isOpen, toggleOpen, onOpenLogin, onOpenUpgrade }) => {
  const displayHistory = isPro ? history : history.slice(0, 3);

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
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleOpen}
        />
      )}

      <div
        className={`fixed md:relative top-0 left-0 h-full bg-white/90 backdrop-blur-xl md:bg-white border-r border-gray-100 w-72 transform transition-transform duration-300 ease-out z-50 flex flex-col shadow-2xl md:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
      >
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-800 tracking-tight">History</h2>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${!isLoggedIn ? 'bg-gray-100 text-gray-400' : isPro ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
              {!isLoggedIn ? 'GUEST' : isPro ? 'PRO' : `${displayHistory.length}/3`}
            </span>
            <button
              onClick={toggleOpen}
              className="text-gray-400 hover:text-gray-600 ml-2"
              aria-label="Close history"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>

        <div className="flex-1 overflow-y-auto p-4 scrollbar-hide space-y-3">
          {!isLoggedIn ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4 mt-10">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-4 text-indigo-300">
                <LockIcon className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-700 mb-2">履歴の保存</h3>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                ユーザー登録（無料）すると<br />
                作成した投稿が自動で<br />
                履歴に保存されます。
              </p>
              <button
                onClick={() => {
                  onOpenLogin();
                  if (window.innerWidth < 768) toggleOpen();
                }}
                className="w-full py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-colors"
              >
                ログイン / 登録
              </button>
            </div>
          ) : (
            <>
              {displayHistory.length === 0 ? (
                <div className="text-center mt-20">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" /><path d="M12 6v6l4 2" /></svg>
                  </div>
                  <p className="text-xs text-gray-400 font-medium">No history yet</p>
                </div>
              ) : (
                displayHistory.map((item) => {
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
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelect(item);
                        if (window.innerWidth < 768) toggleOpen();
                      }}
                    className="w-full text-left p-5 md:p-4 rounded-2xl bg-white hover:bg-indigo-50/50 transition-all border border-gray-100 hover:border-indigo-100 group shadow-sm hover:shadow-md relative"
                  >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item.id);
                        }}
                        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 bg-white/90 p-1 rounded-full focus:outline-none"
                        aria-label="Delete history"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-1 mb-2 flex-wrap">
                        {item.config.platforms.map((p) => (
                          <span
                            key={p}
                            className={`flex items-center justify-center w-5 h-5 rounded-full shadow-sm ${getPlatformColor(p)}`}
                            title={p}
                          >
                            {getPlatformIcon(p)}
                          </span>
                        ))}
                        <span className="ml-auto text-xs md:text-[10px] text-gray-400 font-medium">
                          {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-sm md:text-xs text-gray-600 font-medium line-clamp-2 leading-relaxed">
                        {previewText}
                      </p>
                    </button>
                  );
                })
              )}

              {!isPro && history.length >= 3 && (
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl text-center border border-gray-200 mt-4 space-y-2">
                  <p className="text-xs text-gray-500 mb-0 font-medium">Free plan limit reached</p>
                  <p className="text-[10px] text-gray-400">Proプランなら履歴表示が無制限です。</p>
                  <button
                    onClick={() => {
                      onOpenUpgrade?.();
                      if (window.innerWidth < 768) toggleOpen();
                    }}
                    className="w-full py-2 text-xs font-bold rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                  >
                    PROにアップグレードする
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default HistorySidebar;
