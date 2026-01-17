import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';
import { X, ChevronDown, Sparkles, Search } from 'lucide-react';

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
        setNewWikiName("");
        setSelectedIcon("Hash");
        setIconSearch("");
    };

    return createPortal(
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-6 font-sans ${isDarkMode ? 'dark' : ''}`}>
            {/* Backdrop: Dark Deep Overlay */}
            <div className="absolute inset-0 bg-k5-black/80 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose}></div>
            
            {/* Modal Container: rounded-k5-lg */}
            <div className="relative bg-white dark:bg-k5-black w-full max-w-[600px] rounded-k5-lg p-10 md:p-12 shadow-2xl border border-gray-100 dark:border-k5-deep animate-in zoom-in-95 duration-300">
                
                {/* Header: Aeonik Black & k5-sand */}
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h2 className="text-4xl font-black mb-2 uppercase tracking-tighter dark:text-white leading-none">
                            Neue Seite
                        </h2>
                        <div className="flex items-center gap-2">
                            <Sparkles size={14} className="text-k5-sand" />
                            <p className="text-k5-sand text-[10px] font-bold uppercase tracking-[0.3em]">Knowledge Node anlegen</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-300 hover:text-k5-digital transition-all hover:rotate-90 duration-300">
                        <X size={32} strokeWidth={1.5} />
                    </button>
                </div>
                
                <div className="space-y-8">
                    {/* Titel Input: Aeonik Bold */}
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-k5-digital mb-3 block ml-1">Page Title</label>
                        <input 
                            autoFocus
                            className="w-full bg-k5-light-grey dark:bg-k5-deep/20 p-6 rounded-k5-md border-2 border-transparent focus:border-k5-digital/30 focus:bg-white dark:focus:bg-k5-black outline-none text-2xl font-bold transition-all dark:text-white placeholder:opacity-30" 
                            value={newWikiName} 
                            onChange={e => setNewWikiName(e.target.value)} 
                            placeholder="z.B. Hotel Setup 2026..." 
                        />
                    </div>

                    {/* Icon Picker: k5-sm grid */}
                    <div>
                        <div className="flex justify-between items-end mb-3 px-1">
                            <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-k5-digital">Visual Identifier</label>
                            <div className="relative w-40 group">
                                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-k5-digital transition-colors" />
                                <input 
                                    className="w-full bg-k5-light-grey/50 dark:bg-k5-deep/30 pl-8 pr-3 py-1.5 rounded-k5-sm border border-transparent focus:border-k5-digital/20 text-[10px] font-bold outline-none dark:text-white transition-all" 
                                    placeholder="Search Icons..." 
                                    value={iconSearch} 
                                    onChange={e => setIconSearch(e.target.value)} 
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-6 gap-3 bg-k5-light-grey/30 dark:bg-k5-deep/10 p-4 rounded-k5-md max-h-[180px] overflow-y-auto custom-scrollbar border border-gray-50 dark:border-k5-deep/30">
                            {filteredIcons.map(name => {
                                const IconComp = Icons[name] || Icons.Hash;
                                return (
                                    <button 
                                        key={name} 
                                        onClick={() => setSelectedIcon(name)} 
                                        className={`p-4 rounded-k5-sm flex items-center justify-center transition-all duration-300 ${
                                            selectedIcon === name 
                                            ? 'bg-k5-digital text-white scale-110 shadow-xl shadow-k5-digital/30' 
                                            : 'bg-white dark:bg-k5-black text-gray-400 hover:text-k5-digital hover:shadow-md'
                                        }`}
                                        title={name}
                                    >
                                        <IconComp size={20} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Parent Selection: rounded-k5-md */}
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-k5-digital mb-3 block ml-1">Einordnung (Parent)</label>
                        <div className="relative">
                            <select 
                                value={selectedParent} 
                                onChange={e => setSelectedParent(e.target.value)} 
                                className="w-full bg-k5-light-grey/50 dark:bg-k5-deep/20 p-5 rounded-k5-md border border-transparent focus:border-k5-digital/30 font-bold dark:text-white cursor-pointer appearance-none outline-none transition-all uppercase text-[11px] tracking-widest"
                            >
                                <option value="custom">📁 Weitere Wikis (Eigene Gruppe)</option>
                                <option value="event_main">🎫 Event Operations (Setup)</option>
                                <option value="guide_main">📚 Guidelines & Standards</option>
                            </select>
                            <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-k5-sand pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Actions: k5-digital Glow Button */}
                <div className="flex items-center gap-6 mt-12">
                    <button 
                        onClick={onClose} 
                        className="flex-1 py-4 font-bold text-gray-400 hover:text-k5-black dark:hover:text-white uppercase text-[10px] tracking-[0.3em] transition-colors"
                    >
                        Abbrechen
                    </button>
                    <button 
                        onClick={handleCreate} 
                        className="flex-[2] py-5 bg-glow-digital text-white rounded-k5-md font-bold uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-k5-digital/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <Sparkles size={16} /> Seite anlegen
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}