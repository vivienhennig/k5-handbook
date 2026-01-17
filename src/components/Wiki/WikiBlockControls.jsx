import React from 'react';
import { Trash2, Paintbrush, ChevronDown, ChevronUp, XCircle, Copy } from 'lucide-react';

export default function WikiBlockControls({ block, onUpdate, onDelete, onMove, onDuplicate }) {
    return (
        /* ÄNDERUNG: Wir fügen "pr-4" hinzu (Padding Right). 
           Das ist die unsichtbare Brücke zwischen Menü und Block.
        */
        <div className="absolute -left-14 top-0 h-full pr-4 z-[70] opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
            
            {/* Das eigentliche sichtbare Menü */}
            <div className="flex flex-col gap-2 bg-white dark:bg-gray-800 shadow-2xl border border-gray-100 dark:border-gray-700 p-2 rounded-2xl print:hidden scale-90 group-hover:scale-100 origin-right transition-transform">
                
                {/* 1. Sortierung (Pfeile) */}
                <div className="flex flex-col gap-1">
                    <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onMove('up'); }}
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-400 hover:text-blue-600 rounded-xl transition-all"
                    >
                        <ChevronUp size={16} />
                    </button>
                    <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onMove('down'); }}
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-400 hover:text-blue-600 rounded-xl transition-all"
                    >
                        <ChevronDown size={16} />
                    </button>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 my-1" />

                {/* 2. Headline Level */}
                {block.type === 'headline' && (
                    <div className="flex flex-col gap-1">
                        {[2, 3, 4, 5, 6].map(lvl => (
                            <button 
                                key={lvl}
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onUpdate(block.id, 'content', { ...block.content, level: lvl }); }}
                                className={`p-1.5 text-[9px] font-black rounded-lg transition-all ${
                                    (block.content.level === lvl || (!block.content.level && lvl === 2)) 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                                    : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                H{lvl}
                            </button>
                        ))}
                        <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                    </div>
                )}

                {/* 3. Spalten-Breite (COL) */}
                <div className="text-[8px] font-black text-center text-gray-300 uppercase italic tracking-widest mb-1">Col</div>
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
                                className={`p-1.5 text-[10px] font-black rounded-lg transition-all ${
                                    isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                {num === 1 ? '100' : num === 2 ? '50' : num === 3 ? '75' : '25'}
                            </button>
                        );
                    })}
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 my-1" />

                {/* 4. Style & Delete */}
                <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onDuplicate(); }} 
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                    title="Block duplizieren"
                >
                    <Copy size={16}/>
                </button>   
                <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onUpdate(block.id, 'style', block.style === 'card' ? 'flat' : 'card'); }} 
                    className={`p-2 rounded-xl transition-all ${block.style === 'card' ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                    <Paintbrush size={16}/>
                </button>
                
                <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onDelete(); }} 
                    className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                >
                    <Trash2 size={16}/>
                </button>
            </div>
        </div>
    );
}