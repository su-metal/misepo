import React from 'react';
import { Platform, StoreProfile } from '../../../types';
import { getPlatformIcon } from './utils';
import { CloseIcon, HeartIcon, MessageCircleIcon, SendIcon, BookmarkIcon, MoreHorizontalIcon, ShareIcon, RotateCcwIcon } from '../../Icons';

interface PostPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    platform: Platform;
    text: string;
    storeProfile: StoreProfile;
}

export const PostPreviewModal: React.FC<PostPreviewModalProps> = ({
    isOpen,
    onClose,
    platform,
    text,
    storeProfile
}) => {
    // Lock body scroll when modal is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.setAttribute('data-preview-modal-open', 'true');
        } else {
            document.body.style.overflow = '';
            document.body.removeAttribute('data-preview-modal-open');
        }
        return () => {
            document.body.style.overflow = '';
            document.body.removeAttribute('data-preview-modal-open');
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <div
                className="absolute inset-0 bg-stone-100/90 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden animate-in zoom-in-95 duration-200 border border-stone-100">
                <div className="flex items-center justify-between p-6 bg-stone-50/50 border-b border-stone-100">
                    <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] flex items-center gap-3">
                        <div className="text-stone-600">
                            {getPlatformIcon(platform)}
                        </div>
                        <span>Preview</span>
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-stone-200 text-stone-400 hover:text-stone-800 hover:border-stone-400 transition-all active:scale-90"
                    >
                        <CloseIcon className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-0 bg-stone-50/30 max-h-[70vh] overflow-y-auto">
                    {/* Platform Specific Preview */}
                    <div className="flex justify-center px-2 py-6 bg-gradient-to-b from-stone-50 to-white">

                        {/* Instagram Preview */}
                        {platform === Platform.Instagram && (
                            <div className="w-full bg-white border border-stone-100 rounded-2xl shadow-xl shadow-stone-200/50 max-w-[370px] overflow-hidden">
                                {/* Header */}
                                <div className="flex items-center justify-between p-3 border-b border-stone-50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 p-[1px]">
                                            <div className="w-full h-full rounded-full bg-stone-50 flex items-center justify-center text-[10px] font-black text-stone-400 uppercase">
                                                {(storeProfile.name?.[0] || 'U').toUpperCase()}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-bold text-stone-900 leading-none mb-0.5">
                                                {storeProfile.name || 'your_account'}
                                            </div>
                                            <div className="text-[9px] text-stone-500 leading-none">Original Audio</div>
                                        </div>
                                    </div>
                                    <MoreHorizontalIcon className="w-4 h-4 text-stone-400" />
                                </div>

                                {/* Image Placeholder */}
                                <div className="w-full aspect-square bg-stone-50 flex flex-col items-center justify-center gap-3 border-y border-stone-50">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-stone-100 flex items-center justify-center text-stone-200">
                                        <ShareIcon className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Image Area</span>
                                </div>

                                {/* Actions */}
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <HeartIcon className="w-6 h-6 text-stone-800" />
                                            <MessageCircleIcon className="w-6 h-6 text-stone-800" />
                                            <SendIcon className="w-6 h-6 text-stone-800" />
                                        </div>
                                        <BookmarkIcon className="w-6 h-6 text-stone-800" />
                                    </div>

                                    <div className="text-xs font-bold text-stone-900 mb-2">1,234 likes</div>

                                    <div className="text-[14px] text-[#262626] whitespace-pre-wrap leading-relaxed tracking-normal">
                                        <span className="font-bold mr-2">{storeProfile.name || 'your_account'}</span>
                                        {text}
                                    </div>
                                    <div className="text-[10px] text-stone-400 mt-3 uppercase tracking-wider">2 hours ago</div>
                                </div>
                            </div>
                        )}

                        {/* X (Twitter) Preview */}
                        {platform === Platform.X && (
                            <div className="w-full bg-white border border-stone-100 rounded-3xl shadow-xl shadow-stone-200/50 p-5 max-w-[475px]">
                                <div className="flex gap-4">
                                    <div className="w-11 h-11 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-[12px] font-black text-stone-400 flex-shrink-0">
                                        {(storeProfile.name?.[0] || 'U').toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-1.5 truncate">
                                                <span className="text-[13px] font-bold text-stone-900 truncate">{storeProfile.name || 'Name'}</span>
                                                <span className="text-[11px] text-stone-400 truncate">@{storeProfile.name ? 'store_id' : 'id'}</span>
                                                <span className="text-[11px] text-stone-400">· 2h</span>
                                            </div>
                                            <MoreHorizontalIcon className="w-4 h-4 text-stone-300" />
                                        </div>

                                        <div className="text-[15px] text-[#0f1419] whitespace-pre-wrap leading-[1.5] tracking-normal">
                                            {text}
                                        </div>

                                        <div className="mt-4 flex items-center justify-between text-stone-400">
                                            <div className="flex items-center gap-1.5 group">
                                                <MessageCircleIcon className="w-4 h-4 group-hover:text-blue-500 transition-colors" />
                                                <span className="text-[11px]">2</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 group">
                                                <RotateCcwIcon className="w-4 h-4 group-hover:text-emerald-500 transition-colors" />
                                                <span className="text-[11px]">5</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 group">
                                                <HeartIcon className="w-4 h-4 group-hover:text-rose-500 transition-colors" />
                                                <span className="text-[11px]">12</span>
                                            </div>
                                            <div className="flex items-center gap-1 group">
                                                <ShareIcon className="w-4 h-4 group-hover:text-blue-500 transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Google Maps Preview */}
                        {platform === Platform.GoogleMaps && (
                            <div className="w-full bg-white p-6 max-w-[500px] border border-stone-100 rounded-[2rem] shadow-xl shadow-stone-200/40">
                                <div className="flex gap-4">
                                    {/* Left Border Line (Thread indicator) */}
                                    <div className="w-0.5 bg-[#e8eaed] shrink-0" />

                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-4">
                                            {/* Google blue user icon */}
                                            <div className="w-10 h-10 rounded-full bg-[#4285f4] flex items-center justify-center shrink-0">
                                                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                </svg>
                                            </div>

                                            <div>
                                                <div className="text-[14px] font-bold text-gray-900 leading-tight">
                                                    {storeProfile.name || 'Your Store Name'}（オーナー）
                                                </div>
                                                <div className="text-[12px] text-gray-500 mt-1">
                                                    1 分前
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-[14px] text-[#3c4043] whitespace-pre-wrap leading-relaxed tracking-normal">
                                            {text}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                <div className="p-6 bg-white border-t border-stone-100">
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-stone-100 text-stone-900 border border-stone-200 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-stone-200 transition-all active:scale-95 shadow-sm"
                    >
                        CLOSE PREVIEW
                    </button>
                </div>
            </div>
        </div>
    );
};
