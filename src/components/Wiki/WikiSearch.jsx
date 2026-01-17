import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom'; // NEU: Für das Beamen aus der Sidebar
import { Search, FileText, X, Command, ArrowRight, Zap, ExternalLink, ShieldCheck } from 'lucide-react';
import { contentApi } from '../../services/api';

export default function WikiSearch({ handleNav, isMobile, closeMobileMenu }) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [allData, setAllData] = useState([]);
    const [results, setResults] = useState([]);
    const searchRef = useRef(null);

    const quickActions = [
        { title: 'Vivenu Dashboard', url: 'https://vivenu.com', tags: 'sales tickets login ticketing', icon: <Zap size={18}/> },
        { title: 'K5 Konferenz Live-Site', url: 'https://k5.de', tags: 'webseite conference k5 live', icon: <ExternalLink size={18}/> },
        { title: 'K5 LinkedIn Presence', url: 'https://linkedin.com/company/k5-gmbh', tags: 'social media marketing posting', icon: <ExternalLink size={18}/> },
        { title: 'Brand Assets / Logos', url: '#', tags: 'design marketing material logos', icon: <ShieldCheck size={18}/> }
    ];

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') setIsOpen(false);
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen && allData.length === 0) {
            contentApi.getAllWikiData().then(setAllData);
        }
    }, [isOpen, allData.length]);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        const s = query.toLowerCase();
        const actionMatches = quickActions.filter(a => a.title.toLowerCase().includes(s) || a.tags.includes(s)).map(a => ({ ...a, category: 'System & Tools', type: 'action' }));
        const wikiMatches = allData.flatMap(wiki => {
            const matches = [];
            if (wiki.id.toLowerCase().includes(s)) {
                matches.push({ type: 'page', wikiId: wiki.id, title: wiki.id, category: 'Handbook Wissen', subtitle: 'Wiki Seite', icon: <FileText size={18}/> });
            }
            wiki.blocks?.forEach(block => {
                if ((block.title || "").toLowerCase().includes(s) || JSON.stringify(block.content).toLowerCase().includes(s)) {
                    matches.push({ type: 'block', wikiId: wiki.id, title: block.title || 'Inhaltlicher Treffer', subtitle: `In: ${wiki.id.toUpperCase()}`, category: 'Handbook Wissen', icon: <FileText size={18}/> });
                }
            });
            return matches;
        });
        setResults([...actionMatches, ...wikiMatches].slice(0, 10));
    }, [query, allData]);

    const onSelect = (res) => {
        if (res.type === 'action') window.open(res.url, '_blank');
        else handleNav(res.wikiId);
        setIsOpen(false);
        setQuery("");
        if (isMobile) closeMobileMenu();
    };

    // Das Overlay-Element, das per Portal "gebeamt" wird
    const SearchOverlay = (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-[10000] animate-in fade-in duration-300"
                onClick={() => setIsOpen(false)}
            />
            {/* Modal */}
            <div className="fixed top-[10%] left-1/2 -translate-x-1/2 w-[95vw] md:w-[650px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] z-[10001] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center gap-4">
                    <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600"><Zap size={22} className="animate-pulse" /></div>
                    <input autoFocus className="bg-transparent border-none outline-none w-full text-xl font-bold dark:text-white placeholder:text-gray-300" placeholder="Command Center..." value={query} onChange={(e) => setQuery(e.target.value)} />
                    <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"><X size={24} /></button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto p-3 custom-scrollbar">
                    {results.length > 0 ? (
                        <div className="space-y-6 pb-2">
                            {['System & Tools', 'Handbook Wissen'].map(cat => {
                                const catResults = results.filter(r => r.category === cat);
                                if (catResults.length === 0) return null;
                                return (
                                    <div key={cat} className="space-y-1">
                                        <h4 className="px-5 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600/50 dark:text-blue-400/50">{cat}</h4>
                                        {catResults.map((res, i) => (
                                            <button key={i} onClick={() => onSelect(res)} className="w-full flex items-center gap-5 p-4 hover:bg-gray-50 dark:hover:bg-blue-900/20 rounded-[1.5rem] transition-all text-left group">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-all ${res.type === 'action' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40' : 'bg-gray-100 text-gray-400 dark:bg-gray-800 group-hover:bg-blue-600 group-hover:text-white'}`}>{res.icon}</div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-base font-bold text-gray-900 dark:text-white truncate">{res.title}</p>
                                                    {res.subtitle && <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500/70">{res.subtitle}</p>}
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-all flex items-center gap-3 pr-2"><span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Öffnen</span><ArrowRight size={18} className="text-blue-600 -translate-x-4 group-hover:translate-x-0 transition-all" /></div>
                                            </button>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-20 text-center space-y-3">
                            <div className="inline-block p-4 bg-gray-50 dark:bg-gray-800/50 rounded-full mb-2 text-gray-200 dark:text-gray-700"><Search size={32} /></div>
                            <p className="text-[11px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-[0.5em]">{query ? "Keine Treffer" : "Warte auf K5 Command..."}</p>
                        </div>
                    )}
                </div>
                <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-[9px] font-bold text-gray-400">ESC</kbd>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">schließen</span>
                    </div>
                    <span className="text-[9px] font-black text-blue-600/40 uppercase tracking-widest italic text-right">K5 Handbook OS</span>
                </div>
            </div>
        </>
    );

    return (
        <div className="relative px-2 mb-6" ref={searchRef}>
            {/* TRIGGER BUTTON (BLEIBT IN DER SIDEBAR) */}
            <button 
                onClick={() => setIsOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-400 hover:border-blue-500 hover:shadow-lg transition-all group shadow-sm"
            >
                <Search size={18} className="group-hover:text-blue-500" />
                <span className="text-sm font-bold tracking-tight text-left">Suche...</span>
                <div className="hidden lg:flex items-center gap-1 ml-auto bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-md">
                    <Command size={10} /> <span className="text-[10px] font-black uppercase">K</span>
                </div>
            </button>

            {/* PORTAL: Rendert das Overlay außerhalb der Sidebar Hierarchie */}
            {isOpen && createPortal(SearchOverlay, document.body)}
        </div>
    );
}