"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

// Icons
const Icons = {
    Check: ({ className = "" }: { className?: string }) => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={className}>
            <polyline points="20 6 9 17 4 12" />
        </svg>
    ),
    ChevronDown: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
        </svg>
    ),
    ChevronUp: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="18 15 12 9 6 15" />
        </svg>
    ),
    Sparkles: ({ size = 20, className = "" }: { size?: number; className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
        </svg>
    ),
    Clock: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
    ),
    HelpCircle: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    ),
    Battery: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="16" height="10" rx="2" /><line x1="22" y1="11" x2="22" y2="13" /><line x1="6" y1="11" x2="6" y2="13" />
        </svg>
    ),
    TrendingDown: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" />
        </svg>
    ),
    Smartphone: ({ size = 20, className = "" }: { size?: number; className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
    ),
    Menu: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
    ),
    X: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    ),
    CheckCircle: ({ size = 16, className = "" }: { size?: number; className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    ),
    Instagram: ({ size = 24 }: { size?: number }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
    ),
    MapPin: ({ size = 24 }: { size?: number }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
        </svg>
    ),
    Twitter: ({ size = 24, className = "" }: { size?: number; className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    ),
    Zap: ({ size = 12, fill = "none" }: { size?: number; fill?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    ),
};

export default function LandingPage() {
    const router = useRouter();
    const { loginWithGoogle } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const problems = [
        { icon: <Icons.Clock />, bg: "bg-black", color: "text-lime", title: "時間が足りない", desc: "営業終了後は疲れ果てて、SNS投稿を作る気力がない。結局「明日やろう」と先延ばしにしてしまう。" },
        { icon: <Icons.HelpCircle />, bg: "bg-black", color: "text-lime", title: "何を書けばいいかわからない", desc: "「今日のランチ」以外に書くことがない。魅力的な文章表現や、流行りのハッシュタグがわからない。" },
        { icon: <Icons.Battery />, bg: "bg-black", color: "text-lime", title: "アプリの切り替えが面倒", desc: "インスタを開いて、Xを開いて、Googleマップを開いて...。それぞれのアプリを行き来するだけで一苦労。" },
        { icon: <Icons.TrendingDown />, bg: "bg-black", color: "text-lime", title: "外注コストが高い", desc: "MEO対策やSNS運用代行に見積もりをとったら月額3万円〜。個人店には負担が大きすぎる。" },
    ];

    const plans = [
        { name: "Free", price: "0", features: ["AI投稿生成 (月5回まで)", "Instagram投稿作成 (1案のみ)", "基本的なハッシュタグ提案"] },
        { name: "Standard", price: "980", features: ["AI投稿生成 (無制限)", "Googleマップ/Insta/X 全対応", "投稿履歴の保存", "チャットサポート"] },
        { name: "Premium", price: "2,980", features: ["Standardの全機能", "3パターン同時生成", "SNS同時書き出し (Insta & X)", "Refine機能 (チャット微調整)", "カスタム口調設定", "多言語出力 (英・中・韓)"], recommended: true },
    ];

    const faqs = [
        { q: "どのような業種で利用されていますか？", a: "カフェ、美容室、居酒屋、整体院、歯科医院など、地域密着型の店舗ビジネス全般でご利用いただいております。" },
        { q: "パソコンが苦手ですが使えますか？", a: "はい、スマートフォンだけで完結します。LINEでメッセージを送るような感覚で操作できます。" },
        { q: "MEO対策の効果はすぐに出ますか？", a: "継続的な投稿と口コミへの返信が重要です。MisePoを使えば作業頻度を高められるため、通常より早く効果が期待できます。" },
        { q: "生成された文章はそのまま使っても大丈夫ですか？", a: "はい、そのまま投稿可能です。ただし、店主様ご自身の言葉を少し加えると、より温かみのある投稿になります。" },
    ];

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-lime/30">
            {/* Header */}
            <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm py-2' : 'bg-transparent py-4'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14">
                        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo(0, 0)}>
                            <div className="bg-black p-1.5 rounded-lg text-lime shadow-lg group-hover:scale-110 transition-transform">
                                <Icons.Smartphone size={20} />
                            </div>
                            <span className="font-black text-2xl tracking-tighter text-black uppercase">MisePo</span>
                        </div>
                        <nav className="hidden md:flex items-center space-x-8">
                            {['お悩み', '機能', 'デモ', '料金', 'FAQ'].map((item, i) => (
                                <a key={item} href={['#problem', '#features', '#demo', '#pricing', '#faq'][i]} className="text-sm font-black text-black/60 hover:text-black transition-colors uppercase tracking-widest">{item}</a>
                            ))}
                        </nav>
                        <div className="hidden md:flex items-center space-x-4">
                            <button onClick={() => loginWithGoogle('login')} className="text-black font-black hover:opacity-70 px-4 py-2 text-sm uppercase tracking-widest">Login</button>
                            <button onClick={() => loginWithGoogle('trial')} className="bg-lime text-black px-6 py-2.5 rounded-full text-sm font-black shadow-[0_5px_15px_rgba(202,253,0,0.4)] hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">Get Started</button>
                        </div>
                        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <Icons.X /> : <Icons.Menu />}</button>
                    </div>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-b border-black/5 shadow-xl px-4 py-8 space-y-4">
                        {['お悩み', '機能', 'デモ', '料金'].map((item, i) => (
                            <a key={item} href={['#problem', '#features', '#demo', '#pricing'][i]} className="block px-4 py-3 font-black text-black/60 hover:text-black uppercase tracking-widest text-sm" onClick={() => setIsMenuOpen(false)}>{item}</a>
                        ))}
                        <button onClick={() => loginWithGoogle('trial')} className="w-full bg-lime text-black px-5 py-4 rounded-xl font-black uppercase tracking-widest shadow-brutal mt-4">Get Started</button>
                    </div>
                )}
            </header>

            {/* Hero */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-40 overflow-hidden bg-slate-50">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-lime/10 rounded-full blur-[150px] -z-10" />
                    <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-black/5 rounded-full blur-[100px] -z-10" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
                            <div className="inline-flex items-center gap-2 bg-black border border-white/10 px-4 py-2 rounded-full text-lime font-black text-[10px] shadow-xl mb-10 uppercase tracking-[0.2em]">
                                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-lime" /></span>
                                <span>10,000+ GENERATED</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-black leading-[1.05] mb-8 tracking-tighter italic uppercase">
                                店舗広報を、<br /><span className="bg-lime text-black px-3 py-1 -rotate-1 inline-block mt-2 shadow-brutal">AIに丸投げ。</span>
                            </h1>
                            <p className="text-lg text-black/60 mb-12 leading-relaxed font-bold max-w-lg">
                                Googleマップの口コミ返信も、Instagramの投稿文も。<br className="hidden md:block" />
                                MisePoなら、たった5秒で「来店したくなる」文章へ。
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start mb-12">
                                <button onClick={() => loginWithGoogle('trial')} className="w-full sm:w-auto px-10 py-5 bg-black hover:bg-black/90 text-lime text-lg font-black rounded-full shadow-2xl transition-all flex items-center justify-center gap-3 group uppercase tracking-widest">
                                    <Icons.Sparkles size={20} className="group-hover:animate-pulse" />Start Free Trial
                                </button>
                                <a href="#pricing" className="text-black font-black border-b-2 border-black/10 hover:border-lime transition-all py-2 text-sm uppercase tracking-widest">View Pricing</a>
                            </div>
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-3 text-[11px] font-black text-black/40 uppercase tracking-[0.1em]">
                                {["No Credit Card Required", "PWA Support", "Instant Start"].map(t => (
                                    <div key={t} className="flex items-center gap-2"><Icons.CheckCircle size={16} className="text-lime" /><span>{t}</span></div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 w-full relative">
                            <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all lg:rotate-y-[-12deg] lg:rotate-x-[5deg] lg:hover:scale-105 z-10">
                                <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2">
                                    <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-400" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-400" /><div className="w-2.5 h-2.5 rounded-full bg-green-400" /></div>
                                    <div className="ml-4 bg-white border border-slate-200 rounded-md px-3 py-1 text-[10px] text-slate-400 font-mono flex-1 text-center">misepo.app/dashboard</div>
                                </div>
                                <div className="p-6 bg-slate-50/50 min-h-[360px]">
                                    <div className="flex gap-4 mb-6">
                                        <div className="w-1/3 h-24 bg-lime rounded-xl shadow-lg p-3 text-black flex flex-col justify-between"><span className="text-[10px] font-black uppercase tracking-widest">Instagram</span><div className="w-8 h-1 bg-black/20 rounded-full" /></div>
                                        <div className="w-1/3 h-24 bg-white border border-black/10 rounded-xl p-3 flex flex-col justify-between"><span className="text-[10px] font-black text-black/20 uppercase tracking-widest">X (Twitter)</span><div className="w-8 h-1 bg-black/5 rounded-full" /></div>
                                        <div className="w-1/3 h-24 bg-white border border-black/10 rounded-xl p-3 flex flex-col justify-between"><span className="text-[10px] font-black text-black/20 uppercase tracking-widest">Google Maps</span><div className="w-8 h-1 bg-black/5 rounded-full" /></div>
                                    </div>
                                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm mb-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center"><Icons.Sparkles size={14} /></div>
                                            <span className="text-xs font-bold text-slate-700">AI生成結果</span>
                                        </div>
                                        <div className="space-y-2"><div className="h-2 bg-slate-100 rounded w-3/4" /><div className="h-2 bg-slate-100 rounded w-full" /><div className="h-2 bg-slate-100 rounded w-5/6" /></div>
                                    </div>
                                    <div className="flex justify-end"><div className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-lg">コピーして投稿</div></div>
                                </div>
                            </div>
                            {/* MEOスコア UP! カード - 右上 */}
                            <div className="absolute -right-8 top-12 bg-white p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 animate-float hidden lg:block z-20">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-100 p-2 rounded-full text-green-600">
                                        <Icons.CheckCircle size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-black/40 font-black uppercase tracking-widest">MEO Score</p>
                                        <p className="text-sm font-black text-black">UP!</p>
                                    </div>
                                </div>
                            </div>
                            {/* 口コミ返信 完了 カード - 左下 */}
                            <div className="absolute -left-4 bottom-20 bg-white p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 animate-float-delayed hidden lg:block z-20">
                                <div className="flex items-center gap-3">
                                    <div className="bg-yellow-100 p-2 rounded-full text-yellow-600">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-black/40 font-black uppercase tracking-widest">Reply Status</p>
                                        <p className="text-sm font-black text-black">DONE</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -z-10 top-10 right-10 w-full h-full bg-indigo-600/5 rounded-2xl transform rotate-3 scale-95 border border-indigo-100" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem */}
            <section id="problem" className="py-32 bg-[#fafafa]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-20">
                        <span className="text-black/40 font-black tracking-[0.3em] text-xs uppercase mb-4 block">The Problem</span>
                        <h2 className="text-4xl md:text-6xl font-black text-black leading-tight mb-8 italic uppercase tracking-tighter">
                            「いいお店」なのに、<br />
                            <span className="text-black/30">知られていないだけかもしれない。</span>
                        </h2>
                        <p className="text-black/60 text-xl leading-relaxed font-bold max-w-2xl">
                            素晴らしい技術やサービスを持っていても、日々の業務に追われて「発信」まで手が回らない。<br />
                            そんなオーナー様の悩みを、MisePoは最新鋭のAIで解決します。
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {problems.map((p, i) => (
                            <div key={i} className="group relative bg-white rounded-3xl p-10 border border-black/5 shadow-sm hover:shadow-brutal hover:-translate-y-1 transition-all">
                                <div className={`w-14 h-14 rounded-2xl bg-black flex items-center justify-center mb-8 text-lime group-hover:scale-110 transition-transform`}>{p.icon}</div>
                                <h3 className="text-xl font-black text-black mb-4 uppercase tracking-tight">{p.title}</h3>
                                <p className="text-sm text-black/50 leading-relaxed font-medium">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-32 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto mb-20">
                        <span className="text-black/40 font-black tracking-[0.3em] text-xs uppercase mb-4 block">All-in-One Engine</span>
                        <h2 className="text-4xl md:text-7xl font-black text-black mb-8 tracking-tighter italic uppercase">
                            必要なのは、<br />
                            <span className="bg-black text-lime px-4 py-2 inline-block -rotate-1 shadow-brutal mt-2">このアプリひとつ。</span>
                        </h2>
                        <p className="text-black/60 text-xl font-bold">
                            店舗集客に必要な3大プラットフォームを完全網羅。<br />
                            AIがそれぞれの媒体に最適化されたコンテンツを生成します。
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 bg-black rounded-[2.5rem] p-12 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-lime/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-lime text-black rounded-2xl flex items-center justify-center mb-10 shadow-[0_0_30px_rgba(202,253,0,0.3)]"><Icons.Instagram size={24} /></div>
                                <h3 className="text-3xl font-black mb-4 uppercase tracking-tight">Instagram Creator</h3>
                                <p className="text-white/60 text-lg font-bold max-w-md leading-relaxed">
                                    「映える」文章構成と効果的なハッシュタグを自動選定。フォロワーの心に刺さる言葉をAIが紡ぎ出します。
                                </p>
                            </div>
                        </div>
                        <div className="bg-[#f0f0f0] rounded-[2.5rem] p-10 flex flex-col justify-between group">
                            <div>
                                <div className="w-14 h-14 bg-black text-lime rounded-2xl flex items-center justify-center mb-8 shadow-sm"><Icons.MapPin size={24} /></div>
                                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight italic">MEO Boost</h3>
                                <p className="text-black/50 text-base font-bold leading-relaxed mb-8">
                                    口コミへの丁寧な返信を数秒で。Googleマップでの検索順位を最大化。
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-black/5 flex items-center gap-3">
                                <div className="text-lime flex gap-1"><Icons.Zap size={14} fill="currentColor" /></div>
                                <div className="text-[10px] font-black text-black/30 uppercase tracking-widest">Efficiency: 100%</div>
                            </div>
                        </div>
                        <div className="bg-[#f0f0f0] rounded-[2.5rem] p-10 border border-black/5 flex flex-col justify-between">
                            <div>
                                <div className="w-14 h-14 bg-black text-lime rounded-2xl flex items-center justify-center mb-8"><Icons.Twitter size={24} /></div>
                                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight italic">X Engine</h3>
                                <p className="text-black/50 text-base font-bold leading-relaxed">
                                    140文字の制限内で最大の魅力を。拡散されやすい短文構成をAIが提案。
                                </p>
                            </div>
                        </div>
                        <div className="md:col-span-2 bg-lime rounded-[2.5rem] p-12 text-black relative overflow-hidden group shadow-brutal-lg border-2 border-black">
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                                <div className="flex-1">
                                    <div className="inline-flex items-center gap-2 bg-black/10 px-4 py-2 rounded-full text-black text-[10px] font-black mb-6 uppercase tracking-widest border border-black/10"><Icons.Zap size={14} /> Performance</div>
                                    <h3 className="text-4xl font-black mb-4 uppercase italic tracking-tighter leading-none">圧倒的な<br />スピード</h3>
                                    <p className="text-black/60 text-lg font-bold leading-relaxed">
                                        PWA技術により、ネイティブアプリ同等の起動速度を実現。
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="text-7xl font-black mb-2 italic tracking-tighter">0.5s</div>
                                    <div className="text-[10px] text-black font-black uppercase tracking-[0.2em] opacity-40">System Cold Start</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Demo */}
            <section id="demo" className="py-32 bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-[#111]" />
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-lime/10 rounded-full blur-[150px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px]" />
                </div>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-24">
                        <h2 className="text-5xl md:text-8xl font-black mb-10 italic uppercase tracking-tighter leading-none">
                            <span className="text-lime">AIの実力</span>を体験。
                        </h2>
                        <p className="text-white/50 text-xl font-bold uppercase tracking-widest">Instant Content Generation in 5 Seconds.</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-3xl overflow-hidden max-w-5xl mx-auto flex flex-col md:flex-row min-h-[600px]">
                        <div className="p-12 md:w-1/2 border-b md:border-b-0 md:border-r border-white/10 flex flex-col bg-white/5">
                            <label className="flex items-center gap-2 text-[10px] font-black text-lime mb-6 uppercase tracking-[0.3em]">Input Prompt</label>
                            <textarea className="w-full h-64 p-6 bg-black/50 border border-white/10 text-white rounded-3xl focus:outline-none resize-none text-lg font-bold placeholder:text-white/20" placeholder={"例：\n・新作のピザ始めました\n・期間限定で10%OFF\n・夜22時まで営業中"} readOnly />
                            <button onClick={() => loginWithGoogle('trial')} className="w-full py-6 mt-10 rounded-full font-black flex items-center justify-center gap-3 bg-lime text-black shadow-[0_10px_30px_rgba(202,253,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-base">
                                <Icons.Sparkles size={20} /> Generate Now
                            </button>
                        </div>
                        <div className="md:w-1/2 p-12 flex flex-col items-center justify-center bg-black/20">
                            <div className="bg-white border border-black/5 rounded-[2rem] max-w-xs w-full shadow-brutal-lg overflow-hidden transform rotate-2">
                                <div className="flex items-center justify-between p-4 border-b border-black/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-lime font-black text-xs">M</div>
                                        <span className="font-black text-black text-xs uppercase italic">misepo_studio</span>
                                    </div>
                                </div>
                                <div className="bg-[#f0f0f0] aspect-square w-full"><img src="https://picsum.photos/id/425/600/600" alt="post" className="w-full h-full object-cover grayscale brightness-110" /></div>
                                <div className="p-5 text-[11px] text-black font-bold leading-relaxed">
                                    <span className="font-black mr-2 italic uppercase">misepo_studio</span>
                                    <span className="opacity-60">AIが生成した投稿文がここに表示されます。ハッシュタグも含めて瞬時に提案。</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PWA Section */}
            <section id="pwa" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        <div className="lg:w-1/2">
                            <div className="inline-block px-4 py-1 bg-lime text-black rounded-full text-[10px] font-black mb-6 uppercase tracking-widest shadow-sm">No App Store Needed</div>
                            <h2 className="text-4xl md:text-6xl font-black text-black mb-8 leading-[1.1] italic uppercase tracking-tighter">
                                アイコンタップから<br /><span className="text-black/30">5秒で投稿完了。</span>
                            </h2>
                            <p className="text-lg text-black/60 mb-10 leading-relaxed font-bold">MisePoは最新鋭の PWA 技術を採用。ブラウザで開いて「ホーム画面に追加」するだけで、ネイティブアプリを超えるスピードで起動。</p>

                            {/* 追加機能リスト */}
                            <div className="space-y-6">
                                <div className="flex items-start gap-5 group">
                                    <div className="bg-black p-3 rounded-2xl text-lime transition-transform group-hover:scale-110">
                                        <Icons.Clock />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-black text-lg uppercase italic tracking-tight">Insane Startup Speed</h3>
                                        <p className="text-sm font-bold text-black/50 leading-relaxed">無駄なロード時間はゼロ。お客様対応の合間に、瞬時に投稿作成が可能。</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5 group">
                                    <div className="bg-black p-3 rounded-2xl text-lime transition-transform group-hover:scale-110">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                                            <path d="m9 12 2 2 4-4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-black text-lg uppercase italic tracking-tight">Always Up-To-Date</h4>
                                        <p className="text-sm font-bold text-black/50 leading-relaxed">アプリストアの更新は不要。アクセスするだけで常に最新のAIモデルを利用可能。</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 w-full bg-[#f0f0f0] rounded-[3rem] p-10 border border-black/5 shadow-inner">
                            <h3 className="text-center font-black text-black/30 mb-8 text-[10px] uppercase tracking-[0.3em]">Easy Setup in 2 Steps</h3>
                            <div className="grid grid-cols-2 gap-6 mb-10">
                                <div className="bg-white p-6 rounded-[2rem] shadow-sm flex flex-col items-center text-center group hover:shadow-brutal transition-all">
                                    <div className="w-8 h-8 bg-black text-lime rounded-full flex items-center justify-center font-black text-xs mb-4">1</div>
                                    <Icons.Smartphone size={24} className="mb-2 text-black/40" />
                                    <p className="font-black text-black text-xs uppercase italic">Open Menu</p>
                                    <p className="text-[9px] font-black text-black/30 uppercase tracking-widest mt-1">Safari / Chrome</p>
                                </div>
                                <div className="bg-white p-6 rounded-[2rem] shadow-sm flex flex-col items-center text-center group hover:shadow-brutal-lime transition-all border border-lime/20">
                                    <div className="w-8 h-8 bg-lime text-black rounded-full flex items-center justify-center font-black text-xs mb-4">2</div>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-2 text-black">
                                        <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
                                    </svg>
                                    <p className="font-black text-black text-xs uppercase italic">Add to Home</p>
                                    <p className="text-[9px] font-black text-lime uppercase tracking-widest mt-1">Ready in 3 Sec</p>
                                </div>
                            </div>

                            {/* スマホモックアップ */}
                            <div className="relative mx-auto w-48 border-black border-[8px] rounded-[2.5rem] h-[300px] shadow-2xl flex flex-col overflow-hidden bg-black">
                                <div className="flex-1 bg-white relative w-full h-full overflow-hidden flex flex-col rounded-[1.8rem]">
                                    {/* ブラウザバー */}
                                    <div className="h-8 bg-[#f5f5f5] flex items-center justify-center border-b border-black/5 px-3">
                                        <div className="w-full h-4 bg-white rounded-lg flex items-center px-2">
                                            <div className="w-1.5 h-1.5 bg-black/10 rounded-full" />
                                            <div className="ml-2 w-12 h-1.5 bg-black/5 rounded-full" />
                                        </div>
                                    </div>
                                    {/* コンテンツエリア */}
                                    <div className="flex-1 p-4 space-y-4 opacity-20">
                                        <div className="w-full h-16 bg-lime/30 rounded-xl" />
                                        <div className="space-y-2">
                                            <div className="w-3/4 h-1.5 bg-black/10 rounded" />
                                            <div className="w-1/2 h-1.5 bg-black/10 rounded" />
                                            <div className="w-full h-1.5 bg-black/10 rounded" />
                                        </div>
                                        <div className="w-full h-10 bg-black/5 rounded-xl" />
                                    </div>
                                    {/* シェアシート (模擬) */}
                                    <div className="absolute bottom-0 w-full bg-white border-t border-black/5 p-4 transform translate-y-1 animate-in slide-in-from-bottom duration-700">
                                        <div className="flex justify-center mb-3"><div className="w-8 h-1 bg-black/10 rounded-full" /></div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3 px-4 py-3 bg-lime text-black rounded-2xl font-black text-[10px] uppercase italic tracking-widest shadow-lg">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                                                Add to Home Screen
                                            </div>
                                            <div className="flex items-center gap-3 px-4 py-3 bg-black/5 text-black/40 rounded-2xl font-black text-[10px] uppercase italic tracking-widest">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                                                Share via...
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-center text-[8px] font-black text-black/20 mt-4 uppercase tracking-widest">Simulation Interface v2.0</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-32 bg-[#fafafa]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-24">
                        <span className="text-black/40 font-black tracking-[0.3em] text-xs uppercase mb-4 block">Pricing</span>
                        <h2 className="text-4xl md:text-7xl font-black text-black mb-8 italic uppercase tracking-tighter leading-none">
                            シンプルかつ<br /><span className="text-lime bg-black px-4 py-2 inline-block -rotate-1 shadow-brutal mt-2">透明な料金。</span>
                        </h2>
                        <p className="text-black/50 text-xl font-bold italic uppercase tracking-widest">No Hidden Fees. Just Results.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan, i) => (
                            <div key={i} className={`relative rounded-[2.5rem] p-12 flex flex-col h-full transition-all ${plan.recommended ? 'bg-black text-white shadow-brutal-lg scale-105 z-10' : 'bg-white text-black border border-black/5 shadow-sm hover:shadow-brutal'}`}>
                                {plan.recommended && <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-lime text-black px-8 py-2 rounded-full text-xs font-black shadow-lg uppercase tracking-widest">Highly Recommended</div>}
                                <div className="mb-10">
                                    <h3 className={`text-xs font-black mb-6 uppercase tracking-[0.3em] ${plan.recommended ? 'text-lime' : 'text-black/40'}`}>{plan.name}</h3>
                                    <div className="flex items-baseline gap-2"><span className="text-6xl font-black italic tracking-tighter">¥{plan.price}</span><span className={`text-xs font-black uppercase tracking-widest ${plan.recommended ? 'text-white/40' : 'text-black/20'}`}>/month</span></div>
                                </div>
                                <div className={`h-px w-full mb-10 ${plan.recommended ? 'bg-white/10' : 'bg-black/5'}`} />
                                <ul className="space-y-6 mb-12 flex-1">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className="flex items-start gap-4">
                                            <div className={`mt-0.5 rounded-full p-1 ${plan.recommended ? 'bg-lime text-black' : 'bg-black text-lime'}`}><Icons.Check /></div>
                                            <span className={`text-sm font-black uppercase italic tracking-tight ${plan.recommended ? 'text-white/70' : 'text-black/60'}`}>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => loginWithGoogle('trial')} className={`w-full py-6 rounded-full font-black transition-all uppercase tracking-widest text-sm ${plan.recommended ? 'bg-lime text-black hover:scale-105' : 'bg-black text-white hover:bg-black/90'}`}>
                                    {plan.name === 'Free' ? 'Get Started' : 'Subscribe Now'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="py-32 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <span className="text-black/40 font-black tracking-[0.3em] text-xs uppercase mb-4 block">F.A.Q</span>
                        <h2 className="text-4xl md:text-6xl font-black text-black italic uppercase tracking-tighter">よくある質問</h2>
                    </div>
                    <div className="space-y-6">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-[#fafafa] rounded-[2rem] border border-black/5 overflow-hidden transition-all hover:shadow-brutal">
                                <button className="w-full px-10 py-8 text-left flex justify-between items-center group" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                    <span className="font-black text-black text-lg uppercase tracking-tight italic group-hover:text-lime group-hover:bg-black group-hover:px-2 transition-all">{faq.q}</span>
                                    <div className={`transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}>
                                        <Icons.ChevronDown />
                                    </div>
                                </button>
                                <div className={`overflow-hidden transition-all duration-500 ${openFaq === i ? 'max-h-[500px] pb-10 px-10 border-t border-black/5 pt-8' : 'max-h-0'}`}>
                                    <div className="p-8 bg-white rounded-3xl border border-black/5">
                                        <p className="text-black/60 leading-relaxed font-bold text-lg">{faq.a}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black text-white py-24 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                        <div className="col-span-1 md:col-span-2">
                            <h3 className="text-4xl font-black italic uppercase italic tracking-tighter mb-6">MisePo <span className="text-lime">Studio</span></h3>
                            <p className="text-white/40 text-sm font-bold leading-relaxed max-w-sm uppercase tracking-widest">
                                店舗の魅力を、AIの力で世界へ。<br />次世代の広報エンジン。
                            </p>
                        </div>
                        <div>
                            <h4 className="font-black text-[10px] text-lime uppercase tracking-[0.3em] mb-8">Service</h4>
                            <ul className="space-y-4 text-xs font-black text-white/50 uppercase tracking-widest">
                                <li><a href="#" className="hover:text-lime transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-lime transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-lime transition-colors">Showcase</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-black text-[10px] text-lime uppercase tracking-[0.3em] mb-8">Connect</h4>
                            <ul className="space-y-4 text-xs font-black text-white/50 uppercase tracking-widest">
                                <li><a href="#" className="hover:text-lime transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-lime transition-colors">Support</a></li>
                                <li><a href="#" className="hover:text-lime transition-colors">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">© {new Date().getFullYear()} MISEPO STUDIO. ALL RIGHTS RESERVED.</div>
                        <div className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-lime transition-colors cursor-pointer"><Icons.Twitter size={16} /></div><div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-lime transition-colors cursor-pointer"><Icons.Instagram size={16} /></div></div>
                    </div>
                </div>
            </footer>

            <style jsx global>{`
                html { scroll-behavior: smooth; scroll-padding-top: 80px; }
                .gradient-text { background: linear-gradient(135deg, #4f46e5 0%, #ec4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float { animation: float 3s ease-in-out infinite; }
                .animate-float-delayed { animation: float 3s ease-in-out infinite; animation-delay: 1.5s; }
            `}</style>
        </div>
    );
}
