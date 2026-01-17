import React from 'react';
import { FileText, ExternalLink, Sparkles } from 'lucide-react';

export default function FileBlock({ content, isEditing, onChange }) {
    return (
        <div className="flex items-center justify-between p-8 bg-white dark:bg-k5-black rounded-k5-md group/file hover:shadow-2xl hover:shadow-k5-digital/10 transition-all duration-500 border border-gray-100 dark:border-k5-deep font-sans">
            <div className="flex items-center gap-6">
                {/* Icon Container: rounded-k5-sm */}
                <div className="p-5 bg-k5-light-grey dark:bg-k5-deep text-k5-digital rounded-k5-sm shadow-sm transition-all duration-500 group-hover/file:bg-k5-digital group-hover/file:text-white group-hover/file:scale-110">
                    <FileText size={28}/>
                </div>
                
                <div className="space-y-1.5">
                    {isEditing ? (
                        <div className="space-y-3 animate-in fade-in duration-300">
                            <input 
                                className="bg-transparent border-b-2 border-k5-digital/20 focus:border-k5-digital text-base font-black uppercase tracking-tight block w-full outline-none dark:text-white transition-all" 
                                placeholder="Anzeigename des Dokuments..." 
                                value={content.name} 
                                onChange={e => onChange({...content, name: e.target.value})} 
                            />
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-k5-sand uppercase tracking-widest">URL:</span>
                                <input 
                                    className="bg-k5-light-grey/50 dark:bg-k5-deep/30 px-3 py-1.5 rounded-k5-sm text-[11px] font-medium block w-80 outline-none dark:text-gray-400 border border-transparent focus:border-k5-sand/30" 
                                    placeholder="https://drive.google.com/..." 
                                    value={content.url} 
                                    onChange={e => onChange({...content, url: e.target.value})} 
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <h4 className="font-black text-lg text-k5-black dark:text-white uppercase tracking-tight leading-none group-hover/file:text-k5-digital transition-colors">
                                {content.name || "Unbenanntes Dokument"}
                            </h4>
                            <div className="flex items-center gap-2">
                                <Sparkles size={12} className="text-k5-sand" />
                                <p className="text-[10px] text-k5-sand font-bold uppercase tracking-[0.3em]">
                                    K5 Resource Node
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {!isEditing && content.url && (
                <a 
                    href={content.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-4 bg-glow-digital text-white rounded-k5-sm shadow-xl shadow-k5-digital/20 opacity-0 group-hover/file:opacity-100 transition-all duration-500 transform translate-x-4 group-hover/file:translate-x-0 flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                    <span className="text-[10px] font-bold uppercase tracking-widest pl-2 hidden sm:inline">Open</span>
                    <ExternalLink size={20}/>
                </a>
            )}
        </div>
    );
}