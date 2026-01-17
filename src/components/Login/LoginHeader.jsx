import React from 'react';

export default function LoginHeader({ isRegistering }) {
    return (
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-[2rem] text-white font-black italic text-3xl shadow-2xl shadow-blue-500/40 mb-6 rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
                K5
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">
                {isRegistering ? 'Join the' : 'K5'} <span className="text-blue-600">Allstars</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mt-3 italic">
                {isRegistering ? 'Internal Crew Registration' : 'Zentrales Team Handbook'}
            </p>
        </div>
    );
}