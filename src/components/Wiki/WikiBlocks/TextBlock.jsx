import React, { useState, useRef } from 'react';
import { AtSign, Sparkles, Bold, Type } from 'lucide-react';

export default function TextBlock ({ content, isEditing, onChange, renderLinkedText, customWikis }) {
    const [mentionSearch, setMentionSearch] = useState(null); 
    const [cursorPos, setCursorPos] = useState(0);
    const textareaRef = useRef(null);

    const handleTextChange = (e) => {
        const value = e.target.value;
        const selectionStart = e.target.selectionStart;
        setCursorPos(selectionStart);
        onChange(value);

        const lastPart = value.slice(0, selectionStart).split(/[\s\n]/).pop();
        if (lastPart && lastPart.startsWith('@')) {
            setMentionSearch(lastPart.substring(1));
        } else {
            setMentionSearch(null);
        }
    };

    const insertMention = (wiki) => {
        const before = content.slice(0, cursorPos - mentionSearch.length - 1);
        const after = content.slice(cursorPos);
        const mentionText = `@[${wiki.title}] `;
        onChange(before + mentionText + after);
        setMentionSearch(null);
        setTimeout(() => textareaRef.current?.focus(), 10);
    };

    const insertStyle = (symbol) => {
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const selectedText = content.substring(start, end);
        const before = content.substring(0, start);
        const after = content.substring(end);
        
        const newText = selectedText 
            ? before + symbol + selectedText + symbol + after
            : content + symbol;
            
        onChange(newText);
    };

    const filteredWikis = (mentionSearch !== null && customWikis)
        ? customWikis.filter(w => w.title.toLowerCase().includes(mentionSearch.toLowerCase()))
        : [];

    return isEditing ? (
        <div className="relative space-y-4 font-sans animate-in fade-in duration-300">
            {/* CI Toolbar: rounded-k5-sm & Aeonik Bold */}
            <div className="flex items-center gap-2 p-1.5 bg-k5-light-grey dark:bg-k5-deep/40 rounded-k5-sm w-fit border border-gray-100 dark:border-k5-deep/50">
                <button 
                    onClick={() => insertStyle('**')} 
                    className="flex items-center gap-2 px-4 py-2 hover:bg-white dark:hover:bg-k5-black rounded-md text-[10px] font-bold uppercase tracking-widest text-k5-black dark:text-white transition-all shadow-sm border border-transparent hover:border-k5-digital/20"
                >
                    <Bold size={12} /> Fett
                </button>
                <div className="w-px h-5 bg-gray-200 dark:bg-k5-deep mx-1" />
                {['👋', '🚀', '✅', '⚠️', '💡'].map(emoji => (
                    <button 
                        key={emoji}
                        onClick={() => onChange(content + ' ' + emoji)} 
                        className="p-2 hover:bg-white dark:hover:bg-k5-black rounded-md transition-all text-base hover:scale-110 active:scale-90"
                    >
                        {emoji}
                    </button>
                ))}
            </div>

            {/* Mention Dropdown: Aeonik Black & k5-sand */}
            {mentionSearch !== null && filteredWikis.length > 0 && (
                <div className="absolute z-50 bottom-full left-0 mb-3 w-72 bg-white dark:bg-k5-black rounded-k5-md shadow-2xl border border-gray-100 dark:border-k5-deep overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="px-5 py-3 bg-k5-light-grey/50 dark:bg-k5-deep/50 border-b border-gray-100 dark:border-k5-deep flex items-center gap-2">
                        <Sparkles size={12} className="text-k5-sand" />
                        <p className="text-[10px] font-bold text-k5-sand uppercase tracking-[0.2em]">Seiten verlinken</p>
                    </div>
                    <div className="max-h-56 overflow-y-auto custom-scrollbar">
                        {filteredWikis.map(wiki => (
                            <button
                                key={wiki.id}
                                onClick={() => insertMention(wiki)}
                                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-k5-digital hover:text-white text-left transition-all group"
                            >
                                <div className="w-7 h-7 rounded bg-k5-digital/10 group-hover:bg-white/20 flex items-center justify-center text-k5-digital group-hover:text-white">
                                    <AtSign size={14} />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-tight">{wiki.title}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="relative group">
                <textarea 
                    ref={textareaRef}
                    className="w-full bg-k5-light-grey/30 dark:bg-k5-deep/20 p-6 rounded-k5-md outline-none min-h-[160px] dark:text-white font-sans text-base leading-relaxed border border-transparent focus:border-k5-digital/30 focus:ring-4 focus:ring-k5-digital/5 transition-all placeholder:text-gray-400" 
                    value={content} 
                    onChange={handleTextChange}
                    placeholder="Handbook Content schreiben... (Nutze @ für Verlinkungen)"
                />
                <div className="absolute bottom-4 right-4 text-k5-digital opacity-20 pointer-events-none group-focus-within:opacity-50 transition-opacity">
                    <Type size={20} />
                </div>
            </div>

            <div className="flex items-center gap-2 ml-1">
                <Sparkles size={12} className="text-k5-sand" />
                <p className="text-[10px] text-k5-sand font-bold uppercase tracking-[0.25em]">
                    Nutze @[Name] für intelligente Querverweise
                </p>
            </div>
        </div>
    ) : (
        <div className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-lg font-medium">
            {renderLinkedText(content, customWikis)}
        </div>
    );
};