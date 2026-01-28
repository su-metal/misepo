import React from 'react';
import { Icons } from '../LandingPageIcons';

interface HeaderProps {
    scrolled: boolean;
    isMenuOpen: boolean;
    setIsMenuOpen: (open: boolean) => void;
    loginWithGoogle: (type: 'login' | 'signup') => void;
}

export const Header = ({ scrolled, isMenuOpen, setIsMenuOpen, loginWithGoogle }: HeaderProps) => {
    return (
        <header className={`fixed w-full z-50 transition-all duration-500 rounded-b-[30px] ${scrolled ? 'bg-[#F9F7F2]/90 border-b border-black/5 shadow-sm backdrop-blur-md py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="bg-[#E88BA3] w-10 h-10 flex items-center justify-center rounded-xl shadow-lg shadow-[#E88BA3]/30 transition-transform group-hover:scale-105">
                            <Icons.Smartphone size={20} className="text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-2xl tracking-tight text-slate-800 leading-none">MisePo</span>
                            <span className="text-[10px] font-medium text-slate-500 tracking-wide hidden sm:block">
                                お店のポストを丸っとおまかせ
                            </span>
                        </div>
                    </div>
                    <nav className="hidden md:flex items-center space-x-10">
                        {['お悩み', '機能', 'デモ', '料金', 'FAQ'].map((item, i) => (
                            <a key={item} href={['#problem', '#features', '#demo', '#pricing', '#faq'][i]} className="text-sm font-medium text-slate-500 hover:text-[#4DB39A] transition-colors relative group">
                                {item}
                                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#4DB39A] rounded-full opacity-0 group-hover:opacity-100 transition-all" />
                            </a>
                        ))}
                    </nav>
                    <div className="hidden md:flex items-center space-x-4">
                        <button onClick={() => loginWithGoogle('login')} className="text-slate-600 px-5 py-2 text-sm font-bold hover:text-slate-900 transition-all">ログイン</button>
                        <button onClick={() => window.location.href = '/start'} className="bg-[#4DB39A] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-[#4DB39A]/30 hover:shadow-[#4DB39A]/40 hover:-translate-y-0.5 transition-all">無料で始める</button>
                    </div>
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 hover:text-slate-900 focus:outline-none p-2" aria-label="メニューを開く">
                            {isMenuOpen ? <Icons.X /> : <Icons.Menu />}
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-4 right-4 bg-white/95 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/20 animate-fade-in mt-2 overflow-hidden">
                    <div className="px-6 py-8 space-y-2">
                        {['お悩み', '機能', 'デモ', '料金'].map((item, i) => (
                            <a key={item} href={['#problem', '#features', '#demo', '#pricing'][i]} className="block px-4 py-3 text-lg font-bold text-slate-800 hover:bg-slate-50 rounded-xl transition-all" onClick={() => setIsMenuOpen(false)}>{item}</a>
                        ))}
                        <div className="pt-6 flex flex-col gap-3">
                            <button onClick={() => loginWithGoogle('login')} className="w-full bg-slate-100 text-slate-600 px-5 py-3 rounded-xl text-base font-bold hover:bg-slate-200 transition-all">ログイン</button>
                            <button onClick={() => window.location.href = '/start'} className="w-full bg-[#4DB39A] text-white px-5 py-3 rounded-xl text-base font-bold shadow-lg shadow-[#4DB39A]/30 transition-all">無料で始める</button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};
