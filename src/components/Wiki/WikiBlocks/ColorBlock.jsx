import React from 'react';
import { Copy, Hash } from 'lucide-react';

export default function ColorBlock({ content, isEditing, onChange }) {
    const copyToClipboard = (hex) => {
        if (!hex) return;
        navigator.clipboard.writeText(hex);
    };

    return (
        <div className="flex flex-col h-full w-full bg-white dark:bg-k5-black rounded-k5-md border border-gray-100 dark:border-k5-deep overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-k5-digital/10 group font-sans">
            
            {/* Farb-Fläche: Mit K5-CI konformem Übergang */}
            <div 
                className="w-full h-28 sm:h-36 shadow-inner transition-transform cursor-pointer flex items-center justify-center group/color relative"
                style={{ backgroundColor: content.hex || '#cbd5e1' }}
                onClick={() => !isEditing && copyToClipboard(content.hex)}
            >
                {!isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-k5-black/20 opacity-0 group-hover/color:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                        <div className="bg-white/90 p-3 rounded-full shadow-xl transform scale-75 group-hover/color:scale-100 transition-transform">
                            <Copy size={18} className="text-k5-black" />
                        </div>
                    </div>
                )}
            </div>

            {/* Content-Bereich: Aeonik Black & Bold */}
            <div className="p-5 flex-1 flex flex-col justify-center bg-k5-light-grey/20 dark:bg-k5-deep/10 border-t border-gray-50 dark:border-k5-deep/30">
                {isEditing ? (
                    <div className="space-y-3 animate-in fade-in duration-300">
                        <input 
                            className="bg-white dark:bg-k5-black border border-gray-100 dark:border-k5-deep text-[11px] font-bold uppercase tracking-[0.2em] outline-none w-full p-2.5 rounded-k5-sm focus:ring-4 focus:ring-k5-digital/5 dark:text-white text-center transition-all"
                            placeholder="NAME"
                            value={content.label}
                            onChange={e => onChange({...content, label: e.target.value})}
                        />
                        <div className="relative">
                            <Hash size={10} className="absolute left-3 top-1/2 -translate-y-1/2 text-k5-sand" />
                            <input 
                                className="bg-white dark:bg-k5-black pl-7 pr-3 py-2 rounded-k5-sm border border-gray-100 dark:border-k5-deep text-[10px] font-mono outline-none focus:border-k5-digital w-full text-center tracking-widest"
                                value={content.hex}
                                onChange={e => onChange({...content, hex: e.target.value})}
                                placeholder="HEX"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <h4 className="font-black text-k5-black dark:text-white uppercase tracking-tight text-xs mb-3 leading-tight break-words">
                            {content.label || "FARBE"}
                        </h4>
                        <button 
                            onClick={() => copyToClipboard(content.hex)}
                            className="flex items-center justify-center gap-2 mx-auto group/btn transition-all"
                        >
                            <span className="text-[10px] font-bold text-k5-sand bg-white dark:bg-k5-deep px-3 py-1.5 rounded-k5-sm border border-gray-100 dark:border-k5-deep/50 uppercase tracking-[0.25em] shadow-sm group-hover/btn:border-k5-digital group-hover/btn:text-k5-digital transition-all">
                                {content.hex || "#------"}
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}