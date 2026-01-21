"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const WorkflowSection = () => {
    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-indigo-600 font-bold tracking-wider text-sm uppercase mb-2 block">Seamless Workflow</span>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        「作成」から「投稿」まで、<br />
                        <span className="gradient-text text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">流れるように。</span>
                    </h2>
                    <p className="text-slate-600 text-lg">
                        文章をコピーする手間すら、MisePoが引き受けます。<br className="hidden md:block" />
                        ボタン一押しで、各SNSの最適なページへあなたを案内します。
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* X (Twitter) */}
                    <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 hover:shadow-xl transition-all duration-300">
                        <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center mb-6 shadow-lg"><Icons.Twitter size={24} /></div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">X (Twitter)</h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-6">
                            生成された文章が自動コピーされ、そのまま<span className="font-bold text-slate-900">投稿画面</span>が立ち上がります。あとは貼り付けて投稿ボタンを押すだけ。
                        </p>
                        <div className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm">
                            <span>そのまま投稿画面へ</span>
                            <Icons.ChevronDown size={14} className="-rotate-90" />
                        </div>
                    </div>

                    {/* Instagram */}
                    <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 hover:shadow-xl transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white rounded-xl flex items-center justify-center mb-6 shadow-lg"><Icons.Instagram size={24} /></div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Instagram</h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-6">
                            文章を保持した状態で<span className="font-bold text-slate-900">Instagramアプリ</span>へジャンプ。ハッシュタグも含めて一気にコピーされるので手間いらずです。
                        </p>
                        <div className="inline-flex items-center gap-2 text-pink-600 font-bold text-sm">
                            <span>アプリを自動起動</span>
                            <Icons.ChevronDown size={14} className="-rotate-90" />
                        </div>
                    </div>

                    {/* Google Maps */}
                    <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 hover:shadow-xl transition-all duration-300">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6 shadow-lg"><Icons.MapPin size={24} /></div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Googleビジネス</h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-6">
                            あなたのお店の<span className="font-bold text-slate-900">クチコミ管理ページ</span>へ直行。どのクチコミに返信するか迷う時間をゼロにします。
                        </p>
                        <div className="inline-flex items-center gap-2 text-green-600 font-bold text-sm">
                            <span>クチコミページへ直行</span>
                            <Icons.ChevronDown size={14} className="-rotate-90" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
