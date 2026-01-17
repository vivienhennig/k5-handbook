import React from 'react';
import { 
    PlayCircle, FileText, AlertCircle, AlertTriangle, Maximize2, 
    MinusCircle, ExternalLink, Plus, Trash2, XCircle, Check as CheckIcon, Copy
} from 'lucide-react';

// --- COLOR BLOCK (Ultra-Responsive für schmale Spalten) ---
export default function ColorBlock({ content, isEditing, onChange }) {
    const copyToClipboard = (hex) => {
        if (!hex) return;
        navigator.clipboard.writeText(hex);
    };

    return (
        <div className="flex flex-col h-full w-full bg-gray-50/50 dark:bg-gray-900/30 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden transition-all hover:shadow-md">
            
            {/* Farb-Fläche: Nimmt oben den Platz ein */}
            <div 
                className="w-full h-24 sm:h-32 shadow-inner transition-transform cursor-pointer flex items-center justify-center group/color relative"
                style={{ backgroundColor: content.hex || '#cbd5e1' }}
                onClick={() => !isEditing && copyToClipboard(content.hex)}
            >
                {!isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover/color:opacity-100 transition-opacity">
                        <Copy size={20} className="text-white drop-shadow-md" />
                    </div>
                )}
            </div>

            {/* Content-Bereich: Unter der Farbe */}
            <div className="p-4 flex-1 flex flex-col justify-center">
                {isEditing ? (
                    <div className="space-y-2">
                        <input 
                            className="bg-transparent border-b border-blue-200 text-[11px] font-black uppercase tracking-tight outline-none w-full text-center dark:text-white"
                            placeholder="NAME"
                            value={content.label}
                            onChange={e => onChange({...content, label: e.target.value})}
                        />
                        <input 
                            className="bg-white dark:bg-gray-800 px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-700 text-[10px] font-mono outline-none focus:ring-1 focus:ring-blue-500 w-full text-center"
                            value={content.hex}
                            onChange={e => onChange({...content, hex: e.target.value})}
                            placeholder="#HEX"
                        />
                    </div>
                ) : (
                    <div className="text-center space-y-1">
                        <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-tighter text-[11px] leading-tight break-words px-1">
                            {content.label || "FARBE"}
                        </h4>
                        <div className="flex items-center justify-center gap-1.5">
                            <span className="text-[9px] font-mono text-gray-500 bg-white/50 dark:bg-gray-800/50 px-1.5 py-0.5 rounded border border-gray-100 dark:border-gray-700 uppercase tracking-widest shadow-sm">
                                {content.hex || "#------"}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};