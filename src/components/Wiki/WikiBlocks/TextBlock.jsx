import React, {useState, useRef } from 'react';


// --- TEXT BLOCK ---
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
        // Timeout stellt sicher, dass der Fokus nach dem State-Update zurückspringt
        setTimeout(() => textareaRef.current?.focus(), 10);
    };

    const insertStyle = (symbol) => {
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const selectedText = content.substring(start, end);
        const before = content.substring(0, start);
        const after = content.substring(end);
        
        // Wenn Text markiert ist, umschließen wir ihn, sonst fügen wir es am Ende an
        const newText = selectedText 
            ? before + symbol + selectedText + symbol + after
            : content + symbol;
            
        onChange(newText);
    };

    const filteredWikis = (mentionSearch !== null && customWikis)
        ? customWikis.filter(w => w.title.toLowerCase().includes(mentionSearch.toLowerCase()))
        : [];

    return isEditing ? (
        <div className="relative space-y-2">
            {/* Styling Toolbar */}
            <div className="flex items-center gap-1 mb-2 p-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl w-fit border border-gray-200/50 dark:border-gray-700/50">
                <button 
                    onClick={() => insertStyle('**')} 
                    className="px-3 py-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 transition-all shadow-sm"
                >
                    Bold
                </button>
                <button 
                    onClick={() => insertStyle('_')} 
                    className="px-3 py-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 transition-all shadow-sm"
                >
                    Italic
                </button>
                <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />
                {['👋', '🚀', '✅', '⚠️', '💡'].map(emoji => (
                    <button 
                        key={emoji}
                        onClick={() => onChange(content + ' ' + emoji)} 
                        className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all text-sm"
                    >
                        {emoji}
                    </button>
                ))}
            </div>

            {/* Mention Dropdown */}
            {mentionSearch !== null && filteredWikis.length > 0 && (
                <div className="absolute z-50 bottom-full left-0 mb-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in slide-in-from-bottom-2">
                    <p className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                        Seiten verlinken
                    </p>
                    <div className="max-h-48 overflow-y-auto custom-scrollbar">
                        {filteredWikis.map(wiki => (
                            <button
                                key={wiki.id}
                                onClick={() => insertMention(wiki)}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-left transition-colors"
                            >
                                <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 text-[10px] font-bold">
                                    @
                                </div>
                                <span className="text-sm font-bold dark:text-white truncate">{wiki.title}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <textarea 
                ref={textareaRef}
                className="w-full bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl outline-none min-h-[140px] dark:text-white font-sans text-sm border border-transparent focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-gray-400" 
                value={content} 
                onChange={handleTextChange}
                placeholder="Schreibe etwas... (Nutze @ für Verlinkungen)"
            />
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic ml-2">
                Tipp: Nutze @[Name] für interne Wiki-Links
            </p>
        </div>
    ) : (
        <div className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
            {renderLinkedText(content, customWikis)}
        </div>
    );
};