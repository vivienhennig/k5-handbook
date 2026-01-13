import React, { useMemo } from 'react';
import { Heart, Activity, Coffee, Terminal } from 'lucide-react';

export default function Footer() {
    
    // Interne "Weisheiten" oder motivierende Sprüche
    const quotes = [
        "Energizing E-Commerce",
        "Sky is the limit",
        "Nach dem Event ist vor dem Event.",
        "Tickets don't sell themselves (yet).",
        "Einlass ist erst, wenn der Scanner piept."
    ];

    // Wählt einen zufälligen Spruch aus (bleibt stabil dank useMemo)
    const randomQuote = useMemo(() => {
        return quotes[Math.floor(Math.random() * quotes.length)];
    }, []);

    return (
        <footer className="mt-20 pt-10 pb-6 border-t border-gray-100 dark:border-gray-800 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-400 dark:text-gray-500 font-medium">
                
                {/* Links: Copyright & Version */}
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-default">
                        <Terminal size={12}/> v1.2.0 (Stable)
                    </span>
                    <span className="hidden md:inline text-gray-200 dark:text-gray-700">|</span>
                    <span>&copy; {new Date().getFullYear()} K5 GmbH</span>
                </div>

                {/* Mitte: Random Quote */}
                <div className="hidden md:flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-800">
                    <Coffee size={12} className="text-amber-600 dark:text-amber-500"/>
                    <span className="italic text-gray-500 dark:text-gray-400">"{randomQuote}"</span>
                </div>

                {/* Rechts: Status & Credit */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 group cursor-help" title="Alle Systeme laufen normal">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="group-hover:text-emerald-600 transition-colors">Systems Operational</span>
                    </div>
                    
                    <div className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer" title="Made in Berlin">
                        <Heart size={12} className="fill-current"/>
                    </div>
                </div>
            </div>
        </footer>
    );
}