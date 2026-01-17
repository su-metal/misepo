"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
    Smartphone: ({ size = 20 }: { size?: number }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
    Twitter: ({ size = 24 }: { size?: number }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const problems = [
        { icon: <Icons.Clock />, bg: "bg-rose-50", color: "text-rose-500", title: "時間が足りない", desc: "営業終了後は疲れ果てて、SNS投稿を作る気力がない。結局「明日やろう」と先延ばしにしてしまう。" },
        { icon: <Icons.HelpCircle />, bg: "bg-orange-50", color: "text-orange-500", title: "何を書けばいいかわからない", desc: "「今日のランチ」以外に書くことがない。魅力的な文章表現や、流行りのハッシュタグがわからない。" },
        { icon: <Icons.Battery />, bg: "bg-amber-50", color: "text-amber-500", title: "アプリの切り替えが面倒", desc: "インスタを開いて、Xを開いて、Googleマップを開いて...。それぞれのアプリを行き来するだけで一苦労。" },
        { icon: <Icons.TrendingDown />, bg: "bg-slate-100", color: "text-slate-500", title: "外注コストが高い", desc: "MEO対策やSNS運用代行に見積もりをとったら月額3万円〜。個人店には負担が大きすぎる。" },
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
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {/* Header */}
            <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm py-2' : 'bg-transparent py-4'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                            <div className="bg-gradient-to-br from-indigo-600 to-pink-500 p-1.5 rounded-lg text-white shadow-md">
                                <Icons.Smartphone size={20} />
                            </div>
                            <span className="font-black text-xl tracking-tight text-slate-800">MisePo</span>
                        </div>
                        <nav className="hidden md:flex items-center space-x-8">
                            {['お悩み', '機能', 'デモ', '料金', 'FAQ'].map((item, i) => (
                                <a key={item} href={['#problem', '#features', '#demo', '#pricing', '#faq'][i]} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">{item}</a>
                            ))}
                        </nav>
                        <div className="hidden md:flex items-center space-x-3">
                            <button className="text-slate-600 font-bold hover:text-indigo-600 px-4 py-2 text-sm">ログイン</button>
                            <button onClick={() => router.push('/generate')} className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg hover:bg-indigo-600 transition-all">無料で始める</button>
                        </div>
                        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <Icons.X /> : <Icons.Menu />}</button>
                    </div>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xl px-4 py-6 space-y-3">
                        {['お悩み', '機能', 'デモ', '料金'].map((item, i) => (
                            <a key={item} href={['#problem', '#features', '#demo', '#pricing'][i]} className="block px-4 py-3 font-bold text-slate-700 hover:bg-slate-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>{item}</a>
                        ))}
                        <button onClick={() => router.push('/generate')} className="w-full bg-indigo-600 text-white px-5 py-3.5 rounded-xl font-bold">無料で始める</button>
                    </div>
                )}
            </header>

            {/* Hero */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-40 overflow-hidden bg-slate-50">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-indigo-100/40 rounded-full blur-[120px] -z-10" />
                    <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-purple-100/40 rounded-full blur-[100px] -z-10" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
                            <div className="inline-flex items-center gap-2 bg-white border border-indigo-100 px-4 py-1.5 rounded-full text-indigo-600 font-bold text-xs shadow-sm mb-8">
                                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" /></span>
                                <span>総計生成数 10,000件突破</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.15] mb-6 tracking-tight">
                                店舗の広報は、<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">AIに丸投げする時代。</span>
                            </h1>
                            <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
                                Googleマップの口コミ返信も、Instagramの投稿文も。<br className="hidden md:block" />
                                MisePo（ミセポ）なら、たった5秒で「来店したくなる」文章が完成します。
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-10">
                                <a href="#demo" className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white text-base font-bold rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 group">
                                    <Icons.Sparkles size={18} className="text-yellow-400 group-hover:animate-pulse" />無料で試してみる
                                </a>
                                <a href="#pricing" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-slate-700 border border-slate-200 text-base font-bold rounded-xl flex items-center justify-center hover:shadow-md">料金プラン</a>
                            </div>
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm font-bold text-slate-500">
                                {["クレカ登録不要", "アプリDL不要", "30秒で開始"].map(t => (
                                    <div key={t} className="flex items-center gap-2"><Icons.CheckCircle size={16} className="text-indigo-500" /><span>{t}</span></div>
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
                                        <div className="w-1/3 h-24 bg-gradient-to-br from-pink-500 to-rose-400 rounded-xl shadow-lg p-3 text-white flex flex-col justify-between"><span className="text-xs font-bold opacity-90">Instagram</span><div className="w-8 h-1 bg-white/40 rounded-full" /></div>
                                        <div className="w-1/3 h-24 bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-between"><span className="text-xs font-bold text-slate-400">X (Twitter)</span><div className="w-8 h-1 bg-slate-200 rounded-full" /></div>
                                        <div className="w-1/3 h-24 bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-between"><span className="text-xs font-bold text-slate-400">Google Maps</span><div className="w-8 h-1 bg-slate-200 rounded-full" /></div>
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
                            <div className="absolute -z-10 top-10 right-10 w-full h-full bg-indigo-600/5 rounded-2xl transform rotate-3 scale-95 border border-indigo-100" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem */}
            <section id="problem" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
                        <div>
                            <span className="text-indigo-600 font-bold tracking-wider text-sm uppercase mb-2 block">Problem</span>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-6">「いいお店」なのに、<br /><span className="text-slate-400">知られていないだけかもしれない。</span></h2>
                            <p className="text-slate-600 text-lg leading-relaxed">素晴らしい商品やサービスを持っていても、日々の業務に追われて「発信」まで手が回らない。<br />そんなオーナー様の悩みを、MisePoは技術で解決します。</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {problems.map((p, i) => (
                            <div key={i} className="group relative bg-white rounded-2xl p-8 border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1">
                                <div className={`w-12 h-12 rounded-xl ${p.bg} flex items-center justify-center mb-6 ${p.color} group-hover:scale-110 transition-transform`}>{p.icon}</div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3">{p.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-24 bg-slate-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-indigo-600 font-bold tracking-wider text-sm uppercase mb-2 block">All-in-One Platform</span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">必要なのは、<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">このアプリひとつだけ。</span></h2>
                        <p className="text-slate-600 text-lg">店舗集客に必要な3大プラットフォームを完全網羅。<br />それぞれの媒体特性に合わせて、AIが最適な「振る舞い」をします。</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100 rounded-full blur-[80px] -mr-16 -mt-16 opacity-50 group-hover:opacity-70 transition-opacity" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg shadow-pink-200"><Icons.Instagram size={24} /></div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Instagram 投稿作成</h3>
                                <p className="text-slate-600 mb-6 max-w-md">「映える」文章構成と、集客に効果的なハッシュタグ選定を自動化。絵文字のバランスも完璧に調整します。</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500" />
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6"><Icons.MapPin size={24} /></div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">MEO対策・返信</h3>
                            <p className="text-slate-600 text-sm mb-4">口コミへの丁寧な返信文を数秒で。Googleからの評価を高めます。</p>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="flex text-yellow-400 gap-1 mb-2">{[...Array(5)].map((_, i) => <Icons.Zap key={i} size={12} fill="currentColor" />)}</div>
                                <div className="text-[10px] text-slate-500">ご来店ありがとうございます！...</div>
                            </div>
                        </div>
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-sky-500" />
                            <div className="w-12 h-12 bg-sky-100 text-sky-500 rounded-xl flex items-center justify-center mb-6"><Icons.Twitter size={24} /></div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">X (Twitter)</h3>
                            <p className="text-slate-600 text-sm mb-4">140文字の制限内で最大限の魅力を。拡散されやすい文章を作成。</p>
                        </div>
                        <div className="md:col-span-2 bg-slate-900 rounded-[2rem] p-8 md:p-10 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-full h-full opacity-10">
                                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <path d="M0 100 C 20 0 50 0 100 100" stroke="white" fill="none" strokeWidth="2" />
                                    <path d="M0 100 C 30 20 70 20 100 100" stroke="white" fill="none" strokeWidth="2" />
                                </svg>
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-1">
                                    <div className="inline-flex items-center gap-2 bg-indigo-500/30 px-3 py-1 rounded-full text-indigo-300 text-xs font-bold mb-4 border border-indigo-500/50"><Icons.Zap size={14} /> Performance</div>
                                    <h3 className="text-2xl font-bold mb-2">圧倒的なスピード</h3>
                                    <p className="text-slate-400">PWA技術により、ネイティブアプリ同等の起動速度を実現。お客様対応の合間にもストレスなく利用できます。</p>
                                </div>
                                <div className="text-center"><div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 mb-1">0.5s</div><div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Startup Time</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Demo */}
            <section id="demo" className="py-24 bg-[#0f172a] text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 to-slate-950" />
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />
                </div>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight"><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">AIの実力</span>を今すぐ体験</h2>
                        <p className="text-slate-300 text-lg">1行のメモから、プロ並みの投稿文が数秒で完成します。</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl overflow-hidden max-w-5xl mx-auto flex flex-col md:flex-row min-h-[550px]">
                        <div className="p-8 md:w-1/2 border-b md:border-b-0 md:border-r border-white/10 flex flex-col bg-slate-900/50">
                            <label className="flex items-center gap-2 text-sm font-bold text-white mb-4">投稿メモを入力</label>
                            <textarea className="w-full h-40 p-4 bg-slate-800/80 border border-slate-700 text-slate-100 rounded-xl focus:outline-none resize-none text-base placeholder:text-slate-500" placeholder={"例：\n・今日は雨だけど元気に営業中\n・新作のいちごタルト始めました\n・数量限定なのでお早めに"} readOnly />
                            <button onClick={() => router.push('/generate')} className="w-full py-4 mt-6 rounded-xl font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all">
                                <Icons.Sparkles size={20} />AIで文章を生成する
                            </button>
                        </div>
                        <div className="md:w-1/2 p-8 flex flex-col items-center justify-center bg-slate-950/30">
                            <div className="bg-white border border-gray-200 rounded-2xl max-w-xs w-full shadow-2xl overflow-hidden">
                                <div className="flex items-center justify-between p-3 border-b border-gray-50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px]"><div className="w-full h-full rounded-full bg-white" /></div>
                                        <span className="font-bold text-slate-900 text-xs">misepo_cafe</span>
                                    </div>
                                </div>
                                <div className="bg-gray-100 aspect-square w-full"><img src="https://picsum.photos/id/425/600/600" alt="post" className="w-full h-full object-cover" /></div>
                                <div className="p-3 text-xs text-slate-800 leading-relaxed">
                                    <span className="font-bold mr-2">misepo_cafe</span>
                                    <span className="text-slate-400">ここにAIが生成した投稿文が表示されます。ハッシュタグも含めて提案します。</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PWA Section */}
            <section id="pwa" className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                        <div className="lg:w-1/2">
                            <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold mb-3">アプリストア不要</div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">アイコンタップから<br /><span className="text-indigo-600">5秒で投稿完了。</span></h2>
                            <p className="text-base text-gray-600 mb-6 leading-relaxed">MisePoは最新技術「PWA」を採用。ブラウザで開いて「ホーム画面に追加」するだけで、ネイティブアプリを超えるスピードで起動します。</p>
                        </div>
                        <div className="lg:w-1/2 w-full bg-gray-50 rounded-2xl p-5 border border-gray-100">
                            <h3 className="text-center font-bold text-gray-800 mb-4 text-sm">導入はたったの2ステップ</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white p-3 rounded-lg shadow-sm flex flex-col items-center text-center">
                                    <div className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs mb-2">1</div>
                                    <Icons.Smartphone size={20} /><p className="font-bold text-gray-700 text-xs">メニューを開く</p>
                                </div>
                                <div className="bg-white p-3 rounded-lg shadow-sm flex flex-col items-center text-center">
                                    <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xs mb-2">2</div>
                                    <p className="font-bold text-gray-700 text-xs">ホーム画面に追加</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">シンプルで透明な<br /><span className="text-indigo-600">料金プラン</span></h2>
                        <p className="text-slate-600 text-lg">まずは無料プランでお試しください。クレジットカードの登録は不要です。</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan, i) => (
                            <div key={i} className={`relative rounded-3xl p-8 flex flex-col h-full transition-all ${plan.recommended ? 'bg-slate-900 text-white shadow-2xl scale-105 z-10 ring-1 ring-white/20' : 'bg-white text-slate-900 border border-slate-200 hover:border-slate-300 hover:shadow-xl'}`}>
                                {plan.recommended && <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg">Most Popular</div>}
                                <div className="mb-8">
                                    <h3 className={`text-lg font-bold mb-2 ${plan.recommended ? 'text-slate-300' : 'text-slate-500'}`}>{plan.name}</h3>
                                    <div className="flex items-baseline gap-1"><span className="text-4xl font-black">¥{plan.price}</span><span className={`text-sm font-bold ${plan.recommended ? 'text-slate-400' : 'text-slate-400'}`}>/月</span></div>
                                </div>
                                <div className={`h-px w-full mb-8 ${plan.recommended ? 'bg-slate-800' : 'bg-slate-100'}`} />
                                <ul className="space-y-4 mb-8 flex-1">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className="flex items-start gap-3">
                                            <div className={`mt-0.5 rounded-full p-0.5 ${plan.recommended ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}><Icons.Check /></div>
                                            <span className={`text-sm font-medium ${plan.recommended ? 'text-slate-300' : 'text-slate-600'}`}>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => router.push('/generate')} className={`w-full py-4 rounded-xl font-bold transition-all ${plan.recommended ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-indigo-600'}`}>
                                    {plan.name === 'Free' ? '無料で始める' : 'このプランを選択'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">よくある質問</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                                <button className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 flex justify-between items-center" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                    <span className="font-bold text-gray-800">{faq.q}</span>
                                    {openFaq === i ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
                                </button>
                                <div className={`bg-gray-50 px-6 overflow-hidden transition-all ${openFaq === i ? 'max-h-48 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'}`}>
                                    <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-2">
                            <h3 className="text-2xl font-bold mb-4">MisePo</h3>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">店舗の魅力を、AIの力で世界へ。<br />忙しい店主のための広報パートナー。</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">サービス</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white">機能一覧</a></li>
                                <li><a href="#" className="hover:text-white">料金プラン</a></li>
                                <li><a href="#" className="hover:text-white">導入事例</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">サポート</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white">ヘルプセンター</a></li>
                                <li><a href="#" className="hover:text-white">お問い合わせ</a></li>
                                <li><a href="#" className="hover:text-white">利用規約</a></li>
                                <li><a href="#" className="hover:text-white">プライバシーポリシー</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">© {new Date().getFullYear()} MisePo. All rights reserved.</div>
                </div>
            </footer>

            <style jsx global>{`
                html { scroll-behavior: smooth; scroll-padding-top: 80px; }
                .gradient-text { background: linear-gradient(135deg, #4f46e5 0%, #ec4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            `}</style>
        </div>
    );
}
