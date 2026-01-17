import React from 'react';
import { Trash2, Paintbrush, ChevronDown, ChevronUp, Copy, Layout } from 'lucide-react';

export default function WikiBlockControls({ block, onUpdate, onDelete, onMove, onDuplicate }) {
    return (
        /* Unsichtbare Brücke für stabiles Hovering */
        <div className="absolute -left-16 top-0 h-full pr-6 z-[70] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto flex items-start">
            
            {/* Das Menü: rounded-k5-sm für präzisen Werkzeug-Look */}
            <div className="flex flex-col gap-2 bg-white dark:bg-k5-black shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 dark:border-k5-deep p-2.5 rounded-k5-sm print:hidden scale-90 group-hover:scale-100 origin-right transition-all font-sans">
                
                {/* 1. Sortierung (Pfeile) */}
                <div className="flex flex-col gap-1">
                    <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onMove('up'); }}
                        className="p-2 hover:bg-k5-light-grey dark:hover:bg-k5-deep text-gray-400 hover:text-k5-digital rounded-md transition-all active:scale-90"
                    >
                        <ChevronUp size={16} />
                    </button>
                    <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onMove('down'); }}
                        className="p-2 hover:bg-k5-light-grey dark:hover:bg-k5-deep text-gray-400 hover:text-k5-digital rounded-md transition-all active:scale-90"
                    >
                        <ChevronDown size={16} />
                    </button>
                </div>

                <div className="border-t border-gray-100 dark:border-k5-deep my-1.5" />

                {/* 2. Headline Level (H2-H6) */}
                {block.type === 'headline' && (
                    <div className="flex flex-col gap-1">
                        {[2, 3, 4, 5, 6].map(lvl => (
                            <button 
                                key={lvl}
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onUpdate(block.id, 'content', { ...block.content, level: lvl }); }}
                                className={`p-2 text-[10px] font-bold rounded-md transition-all ${
                                    (block.content.level === lvl || (!block.content.level && lvl === 2)) 
                                    ? 'bg-k5-digital text-white shadow-lg shadow-k5-digital/30' 
                                    : 'text-gray-400 hover:bg-k5-light-grey dark:hover:bg-k5-deep'
                                }`}
                            >
                                H{lvl}
                            </button>
                        ))}
                        <div className="border-t border-gray-100 dark:border-k5-deep my-1.5" />
                    </div>
                )}

                {/* 3. Spalten-Breite (COL) */}
                <div className="text-[8px] font-bold text-center text-k5-sand uppercase tracking-[0.2em] mb-1.5">Col</div>
                <div className="flex flex-col gap-1">
                    {[1, 2, 3, 4].map(num => {
                        const widthVal = num === 1 ? '4/4' : num === 2 ? '2/4' : num === 3 ? '3/4' : '1/4';
                        const isActive = (num === 1 && (block.width === '4/4' || !block.width)) || 
                                         (num === 2 && block.width === '2/4') || 
                                         (num === 3 && block.width === '3/4') || 
                                         (num === 4 && block.width === '1/4');
                        return (
                            <button 
                                key={num} 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onUpdate(block.id, 'width', widthVal); }}
                                className={`p-2 text-[10px] font-bold rounded-md transition-all ${
                                    isActive ? 'bg-k5-digital text-white' : 'text-gray-400 hover:bg-k5-light-grey dark:hover:bg-k5-deep'
                                }`}
                            >
                                {num === 1 ? '100' : num === 2 ? '50' : num === 3 ? '75' : '25'}
                            </button>
                        );
                    })}
                </div>

                <div className="border-t border-gray-100 dark:border-k5-deep my-1.5" />

                {/* 4. Actions: Duplicate, Style & Delete */}
                <div className="flex flex-col gap-1">
                    <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onDuplicate(); }} 
                        className="p-2 text-gray-400 hover:text-k5-digital hover:bg-k5-light-grey dark:hover:bg-k5-deep rounded-md transition-all"
                        title="Duplizieren"
                    >
                        <Copy size={16}/>
                    </button>   
                    <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onUpdate(block.id, 'style', block.style === 'card' ? 'flat' : 'card'); }} 
                        className={`p-2 rounded-md transition-all ${block.style === 'card' ? 'text-k5-digital bg-k5-digital/10' : 'text-gray-400 hover:bg-k5-light-grey dark:hover:bg-k5-deep'}`}
                        title="Style wechseln"
                    >
                        <Paintbrush size={16}/>
                    </button>
                    
                    <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onDelete(); }} 
                        className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all"
                        title="Löschen"
                    >
                        <Trash2 size={16}/>
                    </button>
                </div>
            </div>
        </div>
    );
}