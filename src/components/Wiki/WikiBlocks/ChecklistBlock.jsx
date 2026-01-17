import React, { useState } from 'react';
import { MinusCircle, Plus, Check as CheckIcon, Sparkles, AtSign } from 'lucide-react';

export default function ChecklistBlock({ content, isEditing, onChange, renderLinkedText, customWikis }) {
    const safeContent = Array.isArray(content) ? content : [];
    
    const [mentionSearch, setMentionSearch] = useState(null);
    const [activeRow, setActiveRow] = useState(null);
    const [cursorPos, setCursorPos] = useState(0);

    const handleTextChange = (index, value, selectionStart) => {
        const n = [...safeContent]; 
        n[index] = { ...n[index], text: value }; 
        onChange(n);

        setCursorPos(selectionStart);
        setActiveRow(index);

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
        <div className="space-y-4 font-sans">
            {safeContent.map((item, i) => (
                <div key={item.id || i} className="relative flex items-center gap-5 bg-k5-light-grey/30 dark:bg-k5-deep/20 p-5 rounded-k5-sm border border-gray-100 dark:border-k5-deep/50 group/item transition-all hover:border-k5-digital/30">
                    
                    {/* Mention Dropdown: Aeonik Bold & k5-md Rundung */}
                    {isEditing && activeRow === i && mentionSearch !== null && filteredWikis.length > 0 && (
                        <div className="absolute z-[100] bottom-full left-14 mb-3 w-72 bg-white dark:bg-k5-black rounded-k5-md shadow-2xl border border-gray-100 dark:border-k5-deep overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="px-5 py-3 bg-k5-light-grey/50 dark:bg-k5-deep/50 border-b border-gray-100 dark:border-k5-deep flex items-center gap-2">
                                <Sparkles size={12} className="text-k5-sand" />
                                <p className="text-[10px] font-bold text-k5-sand uppercase tracking-[0.2em]">Handbook Link</p>
                            </div>
                            <div className="max-h-48 overflow-y-auto custom-scrollbar">
                                {filteredWikis.map(wiki => (
                                    <button
                                        key={wiki.id}
                                        onClick={() => insertMention(wiki, i)}
                                        className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-k5-digital hover:text-white text-left transition-all group/link"
                                    >
                                        <div className="w-6 h-6 rounded bg-k5-digital/10 group-hover/link:bg-white/20 flex items-center justify-center text-k5-digital group-hover/link:text-white text-[10px] font-black">
                                            <AtSign size={12} />
                                        </div>
                                        <span className="text-xs font-bold truncate uppercase tracking-tight">{wiki.title}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Checkbox: k5-digital Style */}
                    <button 
                        type="button"
                        disabled={isEditing}
                        onClick={() => onChange(safeContent.map((it, idx) => idx === i ? {...it, checked: !it.checked} : it))} 
                        className={`mt-0.5 w-7 h-7 rounded-k5-sm flex items-center justify-center shrink-0 border-2 transition-all ${
                            item.checked 
                            ? 'bg-k5-digital border-k5-digital text-white shadow-lg shadow-k5-digital/25' 
                            : 'border-gray-200 dark:border-k5-deep hover:border-k5-digital/50 bg-white dark:bg-k5-black'
                        }`}
                    >
                        {item.checked && <CheckIcon size={16} strokeWidth={4}/>}
                    </button>

                    <div className="flex-1 min-w-0">
                        {isEditing ? (
                            <input 
                                className="w-full bg-transparent border-none text-[13px] font-bold uppercase tracking-tight outline-none dark:text-white placeholder:text-gray-400" 
                                value={item.text || ''} 
                                onChange={e => handleTextChange(i, e.target.value, e.target.selectionStart)}
                                placeholder="Listenpunkt bearbeiten..."
                            />
                        ) : (
                            <span className={`text-[13px] font-bold uppercase tracking-tight leading-relaxed transition-all ${
                                item.checked 
                                ? 'text-gray-300 dark:text-gray-600 line-through' 
                                : 'text-k5-black dark:text-gray-200'
                            }`}>
                                {renderLinkedText ? renderLinkedText(item.text, customWikis) : item.text}
                            </span>
                        )}
                    </div>

                    {isEditing && (
                        <button 
                            type="button"
                            onClick={() => onChange(safeContent.filter((_, idx) => idx !== i))} 
                            className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all hover:scale-110"
                        >
                            <MinusCircle size={18}/>
                        </button>
                    )}
                </div>
            ))}
            
            {/* Add Button: k5-digital Outline Style */}
            {isEditing && (
                <button 
                    type="button"
                    onClick={() => onChange([...safeContent, {id: Date.now(), text: "", checked: false}])} 
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-k5-digital bg-k5-digital/5 border border-k5-digital/10 px-6 py-3 rounded-k5-sm hover:bg-k5-digital hover:text-white transition-all flex items-center gap-3 active:scale-95"
                >
                    <Plus size={14} /> Punkt hinzufügen
                </button>
            )}
        </div>
    );
}