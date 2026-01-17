import React from 'react';
import { 
    PlayCircle, FileText, AlertCircle, AlertTriangle, Maximize2, 
    MinusCircle, ExternalLink, Plus, Trash2, XCircle, Check as CheckIcon, Copy
} from 'lucide-react';

// --- FILE BLOCK ---
export default function FileBlock ({ content, isEditing, onChange }) {
    return (
        <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl group/file hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all border border-transparent hover:border-blue-100">
            <div className="flex items-center gap-5">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-blue-600 transition-transform group-hover/file:scale-110">
                    <FileText size={24}/>
                </div>
            <div className="space-y-1">
                {isEditing ? (
                    <>
                        <input className="bg-transparent border-b border-blue-200 text-sm font-black block w-full outline-none dark:text-white" 
                            placeholder="Anzeigename..." value={content.name} 
                            onChange={e => onChange({...content, name: e.target.value})} />
                        <input className="bg-transparent border-b border-blue-100 text-[10px] block w-64 outline-none italic dark:text-gray-400" 
                            placeholder="URL zum Dokument..." value={content.url} 
                            onChange={e => onChange({...content, url: e.target.value})} />
                    </>
                ) : (
                    <>
                        <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight italic">
                            {content.name || "Unbenanntes Dokument"}
                        </p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">K5 Resource Node</p>
                    </>
                )}
            </div>
        </div>
        {!isEditing && content.url && (
            <a href={content.url} target="_blank" rel="noreferrer" 
               className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg opacity-0 group-hover/file:opacity-100 transition-all transform translate-x-4 group-hover/file:translate-x-0">
                <ExternalLink size={20}/>
            </a>
        )}
    </div>
)}