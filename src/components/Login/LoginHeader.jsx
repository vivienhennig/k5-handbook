import React from 'react';

export default function LoginHeader({ isRegistering }) {
    return (
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
            {/* Logo Icon: Italic entfernt, Aeonik Black, k5-md Rundung */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-k5-digital rounded-k5-md text-white font-black text-3xl shadow-2xl shadow-k5-digital/40 mb-8 rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
                K5
            </div>

            {/* Headline: Aeonik Bold (font-black), Uppercase, kein Italic */}
            <h1 className="text-4xl lg:text-6xl font-black text-k5-black dark:text-white tracking-tighter uppercase leading-none">
                {isRegistering ? 'Join the' : 'K5'}{" "}
                <span className="text-k5-digital drop-shadow-sm">Allstars</span>
            </h1>

            {/* Subline: Aeonik Bold, k5-sand für edlen Kontrast, erhöhtes Tracking */}
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-k5-sand mt-4">
                {isRegistering ? 'Internal Crew Registration' : 'Zentrales Team Handbook'}
            </p>
        </div>
    );
}