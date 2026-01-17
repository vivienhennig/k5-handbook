import React from 'react';
import { 
    PlayCircle, FileText, AlertCircle, AlertTriangle, Maximize2, 
    MinusCircle, ExternalLink, Plus, Trash2, XCircle, Check as CheckIcon, Copy
} from 'lucide-react';

// --- ALERT BLOCK ---
export default function AlertBlock({ content, isEditing, onChange }) {
    return (
        <div className={`p-6 rounded-3xl flex gap-4 border-2 transition-all ${content.type === 'warning' ? 'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/30 shadow-sm shadow-red-500/5' : 'bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/30 shadow-sm shadow-blue-500/5'}`}>
            {content.type === 'warning' ? <AlertTriangle className="shrink-0" /> : <AlertCircle className="shrink-0" />}
            <div className="flex-1">
                {isEditing ? (
                    <div className="space-y-2">
                    <select className="bg-white dark:bg-gray-800 text-[10px] font-black p-1 rounded outline-none border border-current" 
                        value={content.type} onChange={e => onChange({...content, type: e.target.value})}>
                        <option value="info">INFO</option>
                        <option value="warning">WARNUNG</option>
                    </select>
                    <input className="w-full bg-transparent border-b border-current outline-none font-bold italic" 
                        value={content.text} onChange={e => onChange({...content, text: e.target.value})} 
                        placeholder="Hinweistext schreiben..."/>
                </div>
            ) : <p className="font-bold italic leading-relaxed">{content.text}</p>}
        </div>
    </div>
)}