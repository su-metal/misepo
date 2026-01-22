"use client";
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
        <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#f9f5f2] border-b-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] py-2' : 'bg-transparent py-4'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="bg-[#E88BA3] p-1.5 border-[3px] border-black rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-2xl group-hover:translate-y-[-2px] group-hover:translate-x-[-2px] group-hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all">
                            <Icons.Smartphone size={20} className="text-black" />
                        </div>
                        <span className="font-black text-2xl tracking-tighter text-black uppercase">MisePo</span>
                    </div>
                    <nav className="hidden md:flex items-center space-x-8">
                        {['お悩み', '機能', 'デモ', '料金', 'FAQ'].map((item, i) => (
                            <a key={item} href={['#problem', '#features', '#demo', '#pricing', '#faq'][i]} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors relative group">
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full opacity-50" />
                            </a>
                        ))}
                    </nav>
                    <div className="hidden md:flex items-center space-x-4">
                        <button onClick={() => loginWithGoogle('login')} className="neo-brutalism-button bg-[#F5CC6D] text-black px-5 py-2 text-sm font-black hover:bg-white transition-all">ログイン</button>
                        <button onClick={() => window.location.href = '/start'} className="neo-brutalism-button bg-[#E88BA3] text-black px-6 py-2.5 text-sm font-black hover:bg-black transition-all">無料で始める</button>
                    </div>
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 hover:text-slate-900 focus:outline-none p-2" aria-label="メニューを開く">
                            {isMenuOpen ? <Icons.X /> : <Icons.Menu />}
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-[#f9f5f2] border-b-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-fade-in">
                    <div className="px-4 py-6 space-y-4">
                        {['お悩み', '機能', 'デモ', '料金'].map((item, i) => (
                            <a key={item} href={['#problem', '#features', '#demo', '#pricing'][i]} className="block px-4 py-3 text-lg font-black text-black border-[3px] border-black rounded-2xl bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all" onClick={() => setIsMenuOpen(false)}>{item}</a>
                        ))}
                        <div className="pt-4 flex flex-col gap-4">
                            <button onClick={() => loginWithGoogle('login')} className="neo-brutalism-button w-full bg-[#F5CC6D] text-black px-5 py-4 text-base font-black hover:bg-white transition-all">ログイン</button>
                            <button onClick={() => window.location.href = '/start'} className="neo-brutalism-button w-full bg-[#E88BA3] text-black px-5 py-4 text-base font-black hover:bg-black transition-all">無料で始める</button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};
