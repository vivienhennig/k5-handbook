import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, FileText, X, Command, ArrowRight, Zap, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
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

    const SearchOverlay = (
        <>
            <div 
                className="fixed inset-0 bg-k5-black/70 backdrop-blur-md z-[10000] animate-in fade-in duration-300"
                onClick={() => setIsOpen(false)}
            />
            <div className="fixed top-[12%] left-1/2 -translate-x-1/2 w-[95vw] md:w-[700px] bg-white dark:bg-k5-black border border-gray-100 dark:border-k5-deep rounded-k5-lg shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] z-[10001] overflow-hidden animate-in fade-in zoom-in-95 duration-200 font-sans">
                <div className="p-8 border-b border-gray-100 dark:border-k5-deep flex items-center gap-6">
                    <div className="p-3 bg-k5-light-grey dark:bg-k5-deep/30 rounded-k5-sm text-k5-digital">
                        <Sparkles size={24} className="animate-pulse" />
                    </div>
                    <input 
                        autoFocus 
                        className="bg-transparent border-none outline-none w-full text-2xl font-bold dark:text-white placeholder:text-gray-300 tracking-tight" 
                        placeholder="Command Center..." 
                        value={query} 
                        onChange={(e) => setQuery(e.target.value)} 
                    />
                    <button onClick={() => setIsOpen(false)} className="p-3 text-gray-400 hover:bg-k5-light-grey dark:hover:bg-k5-deep rounded-k5-md transition-all">
                        <X size={24} />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                    {results.length > 0 ? (
                        <div className="space-y-8 pb-4">
                            {['System & Tools', 'Handbook Wissen'].map(cat => {
                                const catResults = results.filter(r => r.category === cat);
                                if (catResults.length === 0) return null;
                                return (
                                    <div key={cat} className="space-y-2">
                                        <h4 className="px-6 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-k5-sand">{cat}</h4>
                                        {catResults.map((res, i) => (
                                            <button key={i} onClick={() => onSelect(res)} className="w-full flex items-center gap-5 p-5 hover:bg-k5-light-grey dark:hover:bg-k5-deep/40 rounded-k5-md transition-all text-left group border border-transparent hover:border-gray-100 dark:hover:border-k5-deep/50">
                                                <div className={`w-14 h-14 rounded-k5-sm flex items-center justify-center shadow-sm transition-all ${res.type === 'action' ? 'bg-k5-sand/20 text-k5-sand' : 'bg-k5-light-grey text-gray-400 dark:bg-k5-deep group-hover:bg-k5-digital group-hover:text-white'}`}>{res.icon}</div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-lg font-bold text-k5-black dark:text-white truncate tracking-tight">{res.title}</p>
                                                    {res.subtitle && <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 group-hover:text-k5-digital">{res.subtitle}</p>}
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-all flex items-center gap-4 pr-3">
                                                    <span className="text-[10px] font-bold text-k5-digital uppercase tracking-widest">Öffnen</span>
                                                    <ArrowRight size={18} className="text-k5-digital -translate-x-4 group-hover:translate-x-0 transition-all" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-24 text-center space-y-4">
                            <div className="inline-block p-6 bg-k5-light-grey dark:bg-k5-deep/20 rounded-full mb-2 text-gray-200 dark:text-k5-deep/50"><Search size={40} /></div>
                            <p className="text-[11px] font-bold text-k5-sand uppercase tracking-[0.5em]">{query ? "Keine Treffer" : "Warte auf K5 Command..."}</p>
                        </div>
                    )}
                </div>

                <div className="px-8 py-5 bg-k5-light-grey/30 dark:bg-k5-deep/20 border-t border-gray-100 dark:border-k5-deep flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="flex gap-1">
                            <kbd className="px-2 py-1 bg-white dark:bg-k5-deep border border-gray-200 dark:border-k5-deep rounded text-[10px] font-bold text-gray-400">ESC</kbd>
                        </div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">schließen</span>
                    </div>
                    <span className="text-[9px] font-bold text-k5-digital/60 uppercase tracking-widest">K5 Handbook OS v1.2</span>
                </div>
            </div>
        </>
    );

    return (
        <div className="relative px-1 mb-8" ref={searchRef}>
            <button 
                onClick={() => setIsOpen(true)}
                className="w-full flex items-center gap-4 px-5 py-4 bg-k5-light-grey/50 dark:bg-k5-deep/20 border border-gray-100 dark:border-k5-deep/50 rounded-k5-md text-gray-400 hover:border-k5-digital hover:shadow-xl hover:shadow-k5-digital/10 transition-all group shadow-sm"
            >
                <Search size={18} className="group-hover:text-k5-digital transition-colors" />
                <span className="text-[13px] font-bold tracking-tight text-left uppercase">Suchen</span>
                <div className="hidden lg:flex items-center gap-1.5 ml-auto bg-white dark:bg-k5-deep px-2 py-1 rounded-md border border-gray-100 dark:border-k5-deep">
                    <Command size={10} className="text-gray-400" /> <span className="text-[10px] font-bold text-gray-400">K</span>
                </div>
            </button>

            {isOpen && createPortal(SearchOverlay, document.body)}
        </div>
    );
}