import React from 'react';
import { Icons } from '../LandingPageIcons';

interface HeaderProps {
    scrolled: boolean;
    isMenuOpen: boolean;
    setIsMenuOpen: (open: boolean) => void;
    loginWithGoogle: (type: 'login' | 'signup') => void;
    user: any;
}

export const Header = ({ scrolled, isMenuOpen, setIsMenuOpen, loginWithGoogle, user }: HeaderProps) => {
    return (
        <header className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 border-b border-slate-100 shadow-xl shadow-slate-200/20 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center h-14">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        {/* <div className="bg-[#1823ff] w-10 h-10 flex items-center justify-center rounded-xl shadow-lg shadow-[#1823ff]/30 transition-transform group-hover:scale-105">
                            <Icons.Smartphone size={20} className="text-white" />
                        </div> */}
                        <div className="flex flex-col justify-center">
                            <span className="font-inter font-black text-2xl md:text-3xl tracking-tighter text-[#282d32] leading-none">MisePo</span>
                            <span className="text-[8px] md:text-[10px] font-bold text-slate-500 mt-1 tracking-widest whitespace-nowrap">お店のポストを丸っとおまかせ</span>
                        </div>
                    </div>
                    <nav className="hidden md:flex items-center space-x-12">
                        {['お悩み', '機能', 'デモ', '料金', 'FAQ'].map((item, i) => (
                            <a key={item} href={['#problem', '#features', '#demo', '#pricing', '#faq'][i]} className="text-[10px] font-black text-slate-400 hover:text-[#1823ff] transition-colors relative group tracking-[0.2em] uppercase">
                                {item}
                            </a>
                        ))}
                    </nav>
                    <div className="hidden md:flex flex-col items-end gap-2">
                        {user ? (
                            <>
                                <div className="flex items-center space-x-4">
                                    <button onClick={() => loginWithGoogle('login')} className="text-[10px] font-black text-[#282d32] px-6 py-3 rounded-full border border-slate-200 hover:bg-slate-50 transition-all tracking-[0.2em]">別アカウントでログイン</button>
                                    <button onClick={() => window.location.href = '/generate'} className="bg-[#1823ff] text-white px-8 py-3 rounded-full text-[10px] font-black shadow-2xl shadow-[#1823ff]/20 hover:scale-[1.02] transition-all tracking-[0.2em]">ダッシュボードへ</button>
                                </div>
                                <span className="text-[10px] text-slate-500 tracking-widest">Googleのアカウント選択画面で切り替えできます。</span>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center space-x-4">
                                    <button onClick={() => loginWithGoogle('login')} className="text-[10px] font-black text-[#282d32] px-6 py-3 rounded-full border border-slate-200 hover:bg-slate-50 transition-all tracking-[0.2em]">サインイン</button>
                                    <button onClick={() => window.location.href = '/start'} className="bg-[#1823ff] text-white px-8 py-3 rounded-full text-[10px] font-black shadow-2xl shadow-[#1823ff]/20 hover:scale-[1.02] transition-all tracking-[0.2em]">7日間無料で試す</button>
                                </div>
                                <span className="text-[10px] text-slate-500 tracking-widest">別アカウントでログインする場合はGoogle側で一度サインアウトしてください。</span>
                            </>
                        )}
                    </div>
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 hover:text-slate-900 focus:outline-none p-2" aria-label="メニューを開く">
                            {isMenuOpen ? <Icons.X /> : <Icons.Menu />}
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-4 right-4 bg-white shadow-2xl rounded-[32px] border border-slate-100 mt-2 overflow-hidden">
                    <div className="px-6 py-8 space-y-2">
                        {['お悩み', '機能', 'デモ', '料金'].map((item, i) => (
                            <a key={item} href={['#problem', '#features', '#demo', '#pricing'][i]} className="block px-4 py-3 text-lg font-black text-[#282d32] hover:bg-slate-50 rounded-xl transition-all" onClick={() => setIsMenuOpen(false)}>{item.toUpperCase()}</a>
                        ))}
                        <div className="pt-6 flex flex-col gap-3">
                            {user ? (
                                <>
                                    <button onClick={() => loginWithGoogle('login')} className="w-full bg-white border border-slate-200 text-[#282d32] px-5 py-3 rounded-xl text-xs font-black hover:bg-slate-50 transition-all shadow-sm">別アカウントでログイン</button>
                                    <button onClick={() => window.location.href = '/generate'} className="w-full bg-[#1823ff] text-white px-5 py-4 rounded-xl text-xs font-black shadow-lg shadow-[#1823ff]/30 transition-all">ダッシュボードへ</button>
                                    <span className="text-[10px] text-slate-500 tracking-widest text-center">Googleのアカウント選択画面で切り替えできます。</span>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => loginWithGoogle('login')} className="w-full bg-white border border-slate-200 text-[#282d32] px-5 py-3 rounded-xl text-xs font-black hover:bg-slate-50 transition-all shadow-sm">サインイン</button>
                                    <button onClick={() => window.location.href = '/start'} className="w-full bg-[#1823ff] text-white px-5 py-4 rounded-xl text-xs font-black shadow-lg shadow-[#1823ff]/30 transition-all">7日間無料で試す</button>
                                    <span className="text-[10px] text-slate-500 tracking-widest text-center">別アカウントでログインする場合はGoogle側で一度サインアウトしてください。</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};
