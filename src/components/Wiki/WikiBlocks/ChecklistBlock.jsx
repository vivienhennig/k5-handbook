import React, { useState } from 'react';
import { 
    MinusCircle, Plus, Check as CheckIcon, Copy
} from 'lucide-react';

// --- CHECKLIST BLOCK ---

export default function ChecklistBlock({ content, isEditing, onChange, renderLinkedText, customWikis }) {
    const safeContent = Array.isArray(content) ? content : [];
    
    // States für das Mention-System
    const [mentionSearch, setMentionSearch] = useState(null);
    const [activeRow, setActiveRow] = useState(null);
    const [cursorPos, setCursorPos] = useState(0);

    const handleTextChange = (index, value, selectionStart) => {
        const n = [...safeContent]; 
        n[index] = { ...n[index], text: value }; 
        onChange(n);

        setCursorPos(selectionStart);
        setActiveRow(index);

        // Prüfe auf @ Mentions
        const lastPart = value.slice(0, selectionStart).split(/[\s\n]/).pop();
        if (lastPart && lastPart.startsWith('@')) {
            setMentionSearch(lastPart.substring(1));
        } else {
            setMentionSearch(null);
        }
    };

    const insertMention = (wiki, index) => {
        const itemText = safeContent[index].text || "";
        const before = itemText.slice(0, cursorPos - mentionSearch.length - 1);
        const after = itemText.slice(cursorPos);
        const mentionText = `@[${wiki.title}] `;
        
        const n = [...safeContent];
        n[index] = { ...n[index], text: before + mentionText + after };
        
        onChange(n);
        setMentionSearch(null);
        setActiveRow(null);
    };

    const filteredWikis = (mentionSearch !== null && customWikis)
        ? customWikis.filter(w => w.title.toLowerCase().includes(mentionSearch.toLowerCase()))
        : [];

    return (
        <div className="space-y-3">
            {safeContent.map((item, i) => (
                <div key={item.id || i} className="relative flex items-start gap-4 bg-gray-50/50 dark:bg-gray-900/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 group/item transition-all">
                    
                    {/* Mention Dropdown für diesen Listenpunkt */}
                    {isEditing && activeRow === i && mentionSearch !== null && filteredWikis.length > 0 && (
                        <div className="absolute z-[100] bottom-full left-12 mb-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in zoom-in-95 duration-200">
                            <p className="px-4 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b dark:border-gray-700 bg-gray-50/50">Verlinken</p>
                            <div className="max-h-40 overflow-y-auto custom-scrollbar">
                                {filteredWikis.map(wiki => (
                                    <button
                                        key={wiki.id}
                                        onClick={() => insertMention(wiki, i)}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-left transition-colors"
                                    >
                                        <div className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 text-[9px] font-bold">@</div>
                                        <span className="text-xs font-bold dark:text-white truncate">{wiki.title}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <button 
                        type="button"
                        onClick={() => !isEditing && onChange(safeContent.map((it, idx) => idx === i ? {...it, checked: !it.checked} : it))} 
                        className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border-2 transition-all ${item.checked ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' : 'border-gray-300 hover:border-blue-400 dark:border-gray-700'}`}
                    >
                        {item.checked && <CheckIcon size={14} strokeWidth={4}/>}
                    </button>

                    <div className="flex-1">
                        {isEditing ? (
                            <input 
                                className="w-full bg-transparent border-none text-sm font-bold outline-none dark:text-white placeholder:text-gray-300" 
                                value={item.text || ''} 
                                onChange={e => handleTextChange(i, e.target.value, e.target.selectionStart)}
                                placeholder="Listenpunkt bearbeiten..."
                            />
                        ) : (
                            <span className={`text-sm font-bold leading-relaxed ${item.checked ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`}>
                                {renderLinkedText ? renderLinkedText(item.text, customWikis) : item.text}
                            </span>
                        )}
                    </div>

                    {isEditing && (
                        <button 
                            type="button"
                            onClick={() => onChange(safeContent.filter((_, idx) => idx !== i))} 
                            className="text-red-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity"
                        >
                            <MinusCircle size={16}/>
                        </button>
                    )}
                </div>
            ))}
            
            {isEditing && (
                <button 
                    type="button"
                    onClick={() => onChange([...safeContent, {id: Date.now(), text: "", checked: false}])} 
                    className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-2"
                >
                    <Plus size={12} /> Punkt hinzufügen
                </button>
            )}
        </div>
    );
};