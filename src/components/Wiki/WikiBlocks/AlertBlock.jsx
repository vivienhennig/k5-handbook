import React from 'react';
import { AlertCircle, AlertTriangle, Sparkles, Info } from 'lucide-react';

export default function AlertBlock({ content, isEditing, onChange }) {
    const isWarning = content.type === 'warning';

    return (
        <div className={`p-8 rounded-k5-md flex gap-6 border-2 transition-all duration-500 font-sans ${
            isWarning 
            ? 'bg-k5-sand/5 dark:bg-k5-sand/10 text-k5-sand border-k5-sand/20 shadow-lg shadow-k5-sand/5' 
            : 'bg-k5-digital/5 dark:bg-k5-digital/10 text-k5-digital border-k5-digital/20 shadow-lg shadow-k5-digital/5'
        }`}>
            {/* Icon Column */}
            <div className="shrink-0 mt-1">
                {isWarning ? <AlertTriangle size={28} /> : <Info size={28} />}
            </div>

            {/* Content Column */}
            <div className="flex-1 min-w-0">
                {isEditing ? (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Type:</span>
                            <select 
                                className="bg-white dark:bg-k5-black text-[10px] font-bold p-2 rounded-k5-sm outline-none border border-current transition-all focus:ring-4 focus:ring-current/5" 
                                value={content.type} 
                                onChange={e => onChange({...content, type: e.target.value})}
                            >
                                <option value="info">INFO</option>
                                <option value="warning">WARNING</option>
                            </select>
                        </div>
                        <input 
                            className="w-full bg-transparent border-b-2 border-current/20 focus:border-current outline-none font-bold text-lg py-2 transition-all placeholder:opacity-30" 
                            value={content.text} 
                            onChange={e => onChange({...content, text: e.target.value})} 
                            placeholder="Hinweistext schreiben..."
                        />
                    </div>
                ) : (
                    <div className="relative">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-60">
                            {isWarning ? 'Safety & Attention' : 'Handbook Note'}
                        </h4>
                        <p className="font-bold text-gray-800 dark:text-gray-100 leading-relaxed text-lg">
                            {content.text}
                        </p>
                        <div className="absolute -right-2 -top-2 opacity-10">
                            <Sparkles size={40} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}