import React from 'react';
import { createPortal } from 'react-dom';
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
    // State to handle client-side rendering for Portal
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
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

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <div
                className="absolute inset-0 bg-[#f9f5f2]/80 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg bg-white rounded-[40px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in-95 duration-200 border-[3px] border-black">
                <div className="flex items-center justify-between p-8 bg-black/5 border-b-[2px] border-black">
                    <h3 className="text-[11px] font-black text-black uppercase tracking-[0.4em] flex items-center gap-3">
                        <div className="text-black">
                            {getPlatformIcon(platform)}
                        </div>
                        <span>Live Preview</span>
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-2xl bg-[#F5CC6D] border-2 border-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all active:scale-95"
                    >
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-0 bg-[#f9f5f2]/30 max-h-[65vh] overflow-y-auto no-scrollbar">
                    {/* Platform Specific Preview */}
                    <div className="flex justify-center px-4 py-10 bg-gradient-to-b from-black/5 to-transparent">

                        {/* Instagram Preview */}
                        {platform === Platform.Instagram && (
                            <div className="w-full bg-white border-2 border-black rounded-[24px] shadow-[6px_6px_0px_0px_#E88BA3] max-w-[370px] overflow-hidden">
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 border-b-2 border-black/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-black/5 border-2 border-black p-[2px]">
                                            <div className="w-full h-full rounded-lg bg-white flex items-center justify-center text-[11px] font-black text-black uppercase">
                                                {(storeProfile.name?.[0] || 'U').toUpperCase()}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[12px] font-black text-black leading-none mb-1">
                                                {storeProfile.name || 'your_account'}
                                            </div>
                                            <div className="text-[10px] font-bold text-black/40 leading-none">Original Audio</div>
                                        </div>
                                    </div>
                                    <MoreHorizontalIcon className="w-5 h-5 text-black/40" />
                                </div>

                                {/* Image Placeholder */}
                                <div className="w-full aspect-square bg-[#f9f5f2] flex flex-col items-center justify-center gap-4 border-y-2 border-black/5">
                                    <div className="w-14 h-14 rounded-[20px] bg-white border-2 border-black/10 flex items-center justify-center text-black/10">
                                        <ShareIcon className="w-8 h-8" />
                                    </div>
                                    <span className="text-[10px] font-black text-black/20 uppercase tracking-[0.3em]">Image Area</span>
                                </div>

                                {/* Actions */}
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-5">
                                            <HeartIcon className="w-7 h-7 text-black" />
                                            <MessageCircleIcon className="w-7 h-7 text-black" />
                                            <SendIcon className="w-7 h-7 text-black" />
                                        </div>
                                        <BookmarkIcon className="w-7 h-7 text-black" />
                                    </div>

                                    <div className="text-xs font-black text-black mb-4">1,234 likes</div>

                                    <div className="text-[14px] text-black font-medium whitespace-pre-wrap leading-relaxed">
                                        <span className="font-black mr-2">{storeProfile.name || 'your_account'}</span>
                                        {text}
                                    </div>
                                    <div className="text-[10px] font-black text-black/20 mt-6 uppercase tracking-widest">2 hours ago</div>
                                </div>
                            </div>
                        )}

                        {/* X (Twitter) Preview */}
                        {platform === Platform.X && (
                            <div className="w-full bg-white border-2 border-black rounded-[32px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-8 max-w-[475px]">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-[14px] font-black text-white flex-shrink-0 border-2 border-black">
                                        {(storeProfile.name?.[0] || 'U').toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-1.5 truncate">
                                                <span className="text-[14px] font-black text-black truncate">{storeProfile.name || 'Name'}</span>
                                                <span className="text-[12px] font-bold text-black/30 truncate">@{storeProfile.name ? 'store_id' : 'id'}</span>
                                                <span className="text-[12px] text-black/20">· 2h</span>
                                            </div>
                                            <MoreHorizontalIcon className="w-5 h-5 text-black/20" />
                                        </div>

                                        <div className="text-[16px] text-black font-medium whitespace-pre-wrap leading-relaxed">
                                            {text}
                                        </div>

                                        <div className="mt-6 flex items-center justify-between text-black/40">
                                            <div className="flex items-center gap-2 group">
                                                <MessageCircleIcon className="w-5 h-5 group-hover:text-black transition-colors" />
                                                <span className="text-[12px] font-black">2</span>
                                            </div>
                                            <div className="flex items-center gap-2 group">
                                                <RotateCcwIcon className="w-5 h-5 group-hover:text-black transition-colors" />
                                                <span className="text-[12px] font-black">5</span>
                                            </div>
                                            <div className="flex items-center gap-2 group">
                                                <HeartIcon className="w-5 h-5 group-hover:text-black transition-colors" />
                                                <span className="text-[12px] font-black">12</span>
                                            </div>
                                            <div className="flex items-center gap-2 group">
                                                <ShareIcon className="w-5 h-5 group-hover:text-black transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Google Maps Preview */}
                        {platform === Platform.GoogleMaps && (
                            <div className="w-full bg-white p-8 max-w-[500px] border-2 border-black rounded-[32px] shadow-[6px_6px_0px_0px_#4DB39A]">
                                <div className="flex gap-4">
                                    {/* Left Border Line (Thread indicator) */}
                                    <div className="w-1 bg-black/5 shrink-0 rounded-full" />

                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-6">
                                            {/* Google blue user icon */}
                                            <div className="w-12 h-12 rounded-[16px] bg-[#4DB39A] border-2 border-black flex items-center justify-center shrink-0 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                                <svg className="w-7 h-7 text-black" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                </svg>
                                            </div>

                                            <div>
                                                <div className="text-[15px] font-black text-black leading-tight">
                                                    {storeProfile.name || 'Your Store Name'}（オーナー）
                                                </div>
                                                <div className="text-[12px] font-bold text-black/30 mt-1">
                                                    1 分前
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-[15px] text-black font-medium whitespace-pre-wrap leading-relaxed">
                                            {text}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                <div className="p-8 bg-black/5 border-t-[2px] border-black">
                    <button
                        onClick={onClose}
                        className="w-full py-5 bg-white text-black border-[3px] border-black rounded-[24px] font-black text-[13px] uppercase tracking-[0.3em] hover:bg-[#F5CC6D] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all active:scale-95 shadow-sm"
                    >
                        CLOSE PREVIEW
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
