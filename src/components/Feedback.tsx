"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CloseIcon, SendIcon, StarIcon, MessageCircleIcon } from './Icons';

export const Feedback = () => {
    const [isOpen, setIsOpen] = useState(false);
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

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[100] flex items-center gap-2 px-3 py-3 sm:px-6 sm:py-4 bg-[#E88BA3] text-black rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all group"
            >
                <MessageCircleIcon className="w-6 h-6 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                <span className="font-black text-sm tracking-tight hidden sm:inline-block">フィードバック</span>
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-[#f9f5f2] border-[6px] border-black rounded-[32px] shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] w-full max-w-lg overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 md:p-8 border-b-[4px] border-black flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-black border-[3px] border-black flex items-center justify-center text-[#E88BA3]">
                                    <HeartIconContainer />
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-2xl font-black text-black tracking-tight italic uppercase">フィードバックを送る</h2>
                                    <p className="text-[10px] font-black text-black/40 uppercase tracking-widest mt-1">We value your voice</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-12 h-12 flex items-center justify-center hover:bg-black/5 rounded-full text-black transition-colors"
                            >
                                <CloseIcon className="w-8 h-8" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 md:p-10">
                            {isSuccess ? (
                                <div className="py-12 text-center animate-in zoom-in duration-500">
                                    <div className="w-24 h-24 bg-[#4DB39A] border-[4px] border-white text-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
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
                                            className="w-full h-40 p-5 bg-white border-[4px] border-black rounded-2xl focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all outline-none text-base font-bold text-black resize-none placeholder:text-black/20"
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
                                        className="w-full py-6 bg-[#F5CC6D] text-black border-[4px] border-black rounded-2xl font-black text-xl italic shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:shadow-none hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-3"
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
            )}

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
