import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';
import { X, ChevronDown } from 'lucide-react';

export default function WikiCreateModal({ 
    isOpen, 
    onClose, 
    onSave, 
    isDarkMode 
}) {
    const [newWikiName, setNewWikiName] = useState("");
    const [selectedParent, setSelectedParent] = useState("custom");
    const [iconSearch, setIconSearch] = useState("");
    const [selectedIcon, setSelectedIcon] = useState("Hash");

    const EXCLUDED_ICONS = ['createLucideIcon', 'X', 'ChevronDown', 'ChevronRight', 'Sun', 'Moon'];
    
    const allIconNames = useMemo(() => 
        Object.keys(Icons).filter(name => !EXCLUDED_ICONS.includes(name)), 
    []);

    const filteredIcons = useMemo(() => {
        if (!iconSearch) return allIconNames.slice(0, 30);
        return allIconNames
            .filter(name => name.toLowerCase().includes(iconSearch.toLowerCase()))
            .slice(0, 30);
    }, [iconSearch, allIconNames]);

    if (!isOpen) return null;

    const handleCreate = () => {
        if (!newWikiName.trim()) return;
        onSave({
            title: newWikiName,
            parentId: selectedParent,
            iconName: selectedIcon
        });
        // Reset
        setNewWikiName("");
        setSelectedIcon("Hash");
        setIconSearch("");
    };

    return createPortal(
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-6 font-sans ${isDarkMode ? 'dark' : ''}`}>
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md animate-in fade-in" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-gray-800 w-full max-w-[550px] rounded-[3rem] p-10 shadow-2xl border border-gray-100 dark:border-gray-700 animate-in zoom-in-95">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-3xl font-black mb-1 italic dark:text-white">Neue Seite</h2>
                        <p className="text-gray-400 text-sm italic font-sans">Handbook Knowledge Node</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 transition-all">
                        <X size={24}/>
                    </button>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block ml-1 font-sans">Titel</label>
                        <input 
                            autoFocus
                            className="w-full bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-950 outline-none text-xl font-bold transition-all dark:text-white font-sans" 
                            value={newWikiName} 
                            onChange={e => setNewWikiName(e.target.value)} 
                            placeholder="Name der Seite..." 
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block ml-1 font-sans">Icon suchen</label>
                        <input 
                            className="w-full bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border-none outline-blue-500 text-sm mb-3 dark:text-white font-sans" 
                            placeholder="Suche (en): car, heart, tool..." 
                            value={iconSearch} 
                            onChange={e => setIconSearch(e.target.value)} 
                        />
                        <div className="grid grid-cols-6 gap-2 bg-gray-50 dark:bg-gray-900 p-3 rounded-2xl max-h-[160px] overflow-y-auto scrollbar-hide">
                            {filteredIcons.map(name => {
                                const IconComp = Icons[name] || Icons.Hash;
                                return (
                                    <button 
                                        key={name} 
                                        onClick={() => setSelectedIcon(name)} 
                                        className={`p-3 rounded-xl flex items-center justify-center transition-all ${selectedIcon === name ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'bg-white dark:bg-gray-700 text-gray-400 hover:text-blue-500'}`}
                                    >
                                        <IconComp size={20} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block ml-1 font-sans">Einordnung</label>
                        <div className="relative">
                            <select 
                                value={selectedParent} 
                                onChange={e => setSelectedParent(e.target.value)} 
                                className="w-full bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border-none font-bold dark:text-white cursor-pointer appearance-none font-sans"
                            >
                                <option value="custom">📁 Weitere Wikis (Eigene Gruppe)</option>
                                <option value="event_main">🎫 Event Operations (Setup)</option>
                                <option value="guide_main">📚 Guidelines & Standards</option>
                            </select>
                            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mt-10 font-sans">
                    <button onClick={onClose} className="flex-1 py-4 font-bold text-gray-400 font-sans uppercase text-xs tracking-widest">Abbrechen</button>
                    <button 
                        onClick={handleCreate} 
                        className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20 active:scale-95 transition-all font-sans"
                    >
                        Seite anlegen
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}