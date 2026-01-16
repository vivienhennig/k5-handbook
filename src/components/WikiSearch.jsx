import React, { useState, useEffect, useRef } from 'react';
import { Search, FileText, X, Command, ArrowRight } from 'lucide-react';
import { contentApi } from '../services/api';

export default function WikiSearch({ handleNav, isMobile, closeMobileMenu }) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [allData, setAllData] = useState([]);
    const [results, setResults] = useState([]);
    const searchRef = useRef(null);

    // Klick außerhalb schließt Suche
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Daten einmalig laden, wenn Suche geöffnet wird
    useEffect(() => {
        if (isOpen && allData.length === 0) {
            contentApi.getAllWikiData().then(setAllData);
        }
    }, [isOpen]);

    // Echtzeit-Suche in Blöcken und Titeln
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        const s = query.toLowerCase();
        const filtered = allData.flatMap(wiki => {
            const matches = [];
            // Suche in Wiki-Titel
            if (wiki.id.toLowerCase().includes(s)) matches.push({ type: 'page', wikiId: wiki.id, title: wiki.id, context: 'Seite' });
            
            // Suche in Blöcken
            wiki.blocks?.forEach(block => {
                const blockText = JSON.stringify(block.content).toLowerCase();
                const blockTitle = (block.title || "").toLowerCase();
                if (blockText.includes(s) || blockTitle.includes(s)) {
                    matches.push({
                        type: 'block',
                        wikiId: wiki.id,
                        title: block.title || 'Inhalt',
                        context: wiki.id.toUpperCase()
                    });
                }
            });
            return matches;
        }).slice(0, 6); // Max 6 Ergebnisse
        setResults(filtered);
    }, [query, allData]);

    const onSelect = (wikiId) => {
        handleNav(wikiId);
        setIsOpen(false);
        setQuery("");
        if (isMobile) closeMobileMenu();
    };

    return (
        <div className="relative px-2 mb-6" ref={searchRef}>
            {/* Such-Trigger */}
            <button 
                onClick={() => setIsOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-400 hover:border-blue-500 transition-all group"
            >
                <Search size={18} className="group-hover:text-blue-500" />
                <span className="text-sm font-medium">Suche im Handbook...</span>
                <div className="hidden lg:flex items-center gap-1 ml-auto opacity-30">
                    <Command size={10} /> <span className="text-[10px] font-bold">K</span>
                </div>
            </button>

            {/* Ergebnis-Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-2 right-2 mt-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-[2rem] shadow-2xl z-[100] overflow-hidden animate-in slide-in-from-top-2">
                    <div className="p-4 border-b border-gray-50 dark:border-gray-800 flex items-center gap-3">
                        <Search size={18} className="text-blue-500" />
                        <input 
                            autoFocus
                            className="bg-transparent border-none outline-none w-full text-sm font-bold dark:text-white"
                            placeholder="Suchen nach..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button onClick={() => setIsOpen(false)}><X size={16} className="text-gray-400" /></button>
                    </div>

                    <div className="max-h-80 overflow-y-auto p-2">
                        {results.length > 0 ? (
                            results.map((res, i) => (
                                <button 
                                    key={i}
                                    onClick={() => onSelect(res.wikiId)}
                                    className="w-full flex items-center gap-4 p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all text-left group"
                                >
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-500 group-hover:text-white">
                                        <FileText size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{res.context}</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{res.title}</p>
                                    </div>
                                    <ArrowRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                </button>
                            ))
                        ) : query ? (
                            <p className="p-10 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Keine Treffer</p>
                        ) : (
                            <p className="p-10 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Tippe etwas ein...</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}