"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const MobilePWA = () => {
    return (
        <section className="bg-white rounded-3xl p-6 shadow-sm mb-6">
            <h3 className="font-bold text-slate-800 text-lg mb-4 text-center">アプリとして使う</h3>

            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                    <Icons.Smartphone size={24} className="text-slate-400" />
                </div>
                <div>
                    <h4 className="font-bold text-sm text-slate-700">ホーム画面に追加</h4>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                        ストアからのDL不要。<br />
                        0.5秒で起動します。
                    </p>
                </div>
            </div>

            <div className="mt-4 flex justify-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg">
                    <Icons.Share size={12} className="text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500">シェア</span>
                </div>
                <span className="text-xs text-slate-300 font-bold self-center">→</span>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg">
                    <Icons.PlusSquare size={12} className="text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500">ホームに追加</span>
                </div>
            </div>
        </section>
    );
};
