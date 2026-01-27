"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CloseIcon, SendIcon, StarIcon, MessageCircleIcon } from './Icons';
import { IS_HOSPITALITY_MODE } from '../constants';

export const Feedback = ({ mode = 'floating' }: { mode?: 'floating' | 'sidebar' }) => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Only show on App/Generator pages (/generate)
    const showFeedback = pathname?.startsWith('/generate');

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError('満足度を選択してください');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            const { error: submitError } = await supabase
                .from('feedbacks')
                .insert({
                    user_id: user?.id || null,
                    rating,
                    content,
                });

            if (submitError) throw submitError;

            setIsSuccess(true);
            setTimeout(() => {
                setIsOpen(false);
                resetForm();
            }, 2000);
        } catch (err: any) {
            console.error('Feedback submission error:', err);
            setError('送信に失敗しました。時間をおいて再度お試しください。');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setRating(0);
        setContent('');
        setIsSuccess(false);
        setError(null);
    };

    if (!showFeedback) return null;

    return (
        <>
            {/* Floating Button */}
            {/* Trigger Button */}
            {mode === 'sidebar' ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all group w-full h-full ${IS_HOSPITALITY_MODE ? 'bg-white border border-slate-100 shadow-sm hover:shadow-md' : 'bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-[#E88BA3] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)]'}`}
                    title="フィードバック"
                >
                    <MessageCircleIcon className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
                    <span className="text-[8px] font-black text-black tracking-widest uppercase">Feedback</span>
                </button>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className={`hidden md:flex fixed bottom-8 right-8 z-[100] items-center gap-2 transition-all group ${IS_HOSPITALITY_MODE ? 'px-6 py-4 bg-[#1A252F] text-white rounded-2xl shadow-2xl shadow-slate-200/50 hover:-translate-y-1' : 'px-3 py-3 sm:px-6 sm:py-4 bg-[#E88BA3] text-black rounded-2xl border-[3px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95'}`}
                >
                    <MessageCircleIcon className="w-6 h-6 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                    <span className="font-black text-sm tracking-tight hidden sm:inline-block">フィードバック</span>
                </button>
            )}

            {/* Modal Overlay */}
            {(isOpen && mounted) && createPortal(
                <div
                    className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className={`w-full max-w-lg rounded-[32px] overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300 ${IS_HOSPITALITY_MODE ? 'bg-white shadow-2xl shadow-slate-200/50 border border-slate-100' : 'bg-[var(--bg-beige)] border-[3px] border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)]'}`}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className={`px-8 py-5 border-b-[3px] flex items-center justify-between sticky top-0 z-20 ${IS_HOSPITALITY_MODE ? 'bg-slate-50 border-slate-100' : 'bg-white border-black'}`}>
                            <h2 className="text-xl font-black text-black tracking-tight uppercase">Send Feedback</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 ${IS_HOSPITALITY_MODE ? 'bg-white border border-slate-200 text-slate-400 hover:text-[#1A252F] hover:border-slate-300 shadow-sm' : 'bg-white border-2 border-black text-black hover:bg-slate-100 shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'}`}
                            >
                                <CloseIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 md:p-8 bg-[var(--bg-beige)]">
                            {isSuccess ? (
                                <div className="py-12 text-center animate-in zoom-in duration-500">
                                    <div className={`w-24 h-24 border-[4px] border-white text-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl ${IS_HOSPITALITY_MODE ? 'bg-[#1A252F] text-white shadow-slate-200' : 'bg-[#4DB39A] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]'}`}>
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-3xl font-black text-black mb-2 italic">送信完了！</h3>
                                    <p className="text-black/60 font-bold">貴重なご意見ありがとうございます。</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-10">
                                    {/* Star Rating */}
                                    <div className="text-center">
                                        <p className="text-base font-black text-black mb-6 tracking-tight">満足度を教えてください <span className="text-rose-500">*</span></p>
                                        <div className="flex justify-center gap-4">
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <button
                                                    key={num}
                                                    type="button"
                                                    onMouseEnter={() => setHoverRating(num)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => setRating(num)}
                                                    className="focus:outline-none transition-all hover:scale-125 active:scale-90"
                                                >
                                                    <StarIcon
                                                        className={`w-12 h-12 ${(hoverRating || rating) >= num ? 'text-[#F5CC6D] fill-[#F5CC6D]' : 'text-black/10'}`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Comment */}
                                    <div className="space-y-4">
                                        <label className="text-base font-black text-black tracking-tight flex justify-between">
                                            詳細なご意見・ご要望 <span className="text-[10px] text-black/30 uppercase tracking-widest leading-none mt-1">Optional</span>
                                        </label>
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="アプリの使い心地はいかがですか？改善点やご要望など、どんなことでもお気軽にお聞かせください..."
                                            className={`w-full h-40 p-5 rounded-2xl transition-all outline-none text-base font-bold text-black resize-none placeholder:text-black/20 ${IS_HOSPITALITY_MODE ? 'bg-slate-50 border border-slate-100 focus:bg-white focus:border-slate-300' : 'bg-white border-[4px] border-black focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'}`}
                                            maxLength={500}
                                        />
                                        <div className="flex justify-end">
                                            <span className="text-xs font-black text-black/20 tracking-widest">{content.length} / 500</span>
                                        </div>
                                    </div>

                                    {error && (
                                        <p className="text-sm font-black text-rose-500 text-center animate-bounce">{error}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || rating === 0}
                                        className={`w-full py-6 rounded-2xl font-black text-xl italic transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:shadow-none ${IS_HOSPITALITY_MODE ? 'bg-[#1A252F] text-white shadow-xl shadow-slate-300 hover:scale-[1.01]' : 'bg-[#F5CC6D] text-black border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]'}`}
                                    >
                                        {isSubmitting ? (
                                            <div className="w-8 h-8 border-4 border-black/30 border-t-black rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <SendIcon className="w-6 h-6" />
                                                送信する
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
                , document.body)}

            <style jsx>{`
        .animate-in { 
          animation-duration: 300ms;
          animation-fill-mode: both;
        }
        .fade-in {
          animation-name: fadeIn;
        }
        .zoom-in-95 {
          animation-name: zoomIn95;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn95 {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
        </>
    );
};

const HeartIconContainer = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
);
