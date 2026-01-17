import React, { useMemo } from 'react';
import { Heart, Coffee, Terminal } from 'lucide-react';

export default function Footer() {
    
    // Interne "Weisheiten" oder motivierende Sprüche
    const quotes = [
        "Energizing E-Commerce",
        "Sky is the limit",
        "Nach dem Event ist vor dem Event.",
        "Wo wir sind ist Vorne",
        "Eat the frog in the morning",
        "Trust the process",
        "Einlass ist erst, wenn der Scanner piept."
    ];

    // Wählt einen zufälligen Spruch aus (bleibt stabil dank useMemo)
    const randomQuote = useMemo(() => {
        return quotes[Math.floor(Math.random() * quotes.length)];
    }, []);

    return (
        <footer className="mt-20 pt-10 pb-10 border-t border-gray-100 dark:border-k5-deep animate-in fade-in duration-700 font-sans">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">
                
                {/* Links: Copyright & Version */}
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-2 hover:text-k5-digital transition-colors cursor-default">
                        <Terminal size={12} className="text-k5-digital"/> v1.2.0 (STABLE)
                    </span>
                    <span className="hidden md:inline text-gray-200 dark:text-k5-deep">|</span>
                    <span>&copy; {new Date().getFullYear()} K5 GMBH</span>
                </div>

                {/* Mitte: Random Quote - Italic entfernt, Aeonik Bold genutzt */}
                <div className="hidden md:flex items-center gap-3 bg-k5-light-grey dark:bg-k5-deep/20 px-4 py-2 rounded-full border border-gray-100 dark:border-k5-deep shadow-sm">
                    <Coffee size={12} className="text-k5-sand"/>
                    <span className="text-gray-500 dark:text-gray-400 tracking-tight">"{randomQuote}"</span>
                </div>

                {/* Rechts: Status & Credit */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 group cursor-help" title="Alle Systeme laufen normal">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-k5-lime opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-k5-lime"></span>
                        </span>
                        <span className="group-hover:text-k5-lime transition-colors">SYSTEMS OPERATIONAL</span>
                    </div>
                    
                    <div className="flex items-center gap-1 hover:text-red-500 transition-all cursor-pointer transform hover:scale-110" title="Made in Berlin">
                        <Heart size={14} className="fill-current"/>
                    </div>
                </div>
            </div>
        </footer>
    );
}