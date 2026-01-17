import React from 'react';

// --- HEADLINE BLOCK ---
export default function HeadlineBlock ({ content, isEditing, onChange }) {
    const level = content.level || 2; // Default H2

    // Dynamische Größenklassen basierend auf dem Level
    const sizeClasses = {
        2: "text-3xl font-black italic uppercase tracking-tight",
        3: "text-2xl font-black italic tracking-tight",
        4: "text-xl font-bold italic",
        5: "text-lg font-bold",
        6: "text-base font-bold uppercase tracking-widest text-gray-500"
    };

    if (isEditing) {
        return (
            <div className="w-full space-y-2">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded">H{level}</span>
                    <input 
                        className={`${sizeClasses[level]} bg-transparent border-b border-blue-500/30 w-full outline-none dark:text-white`} 
                        value={content.text} 
                        onChange={e => onChange({ ...content, text: e.target.value })} 
                        placeholder={`Überschrift H${level}...`}
                    />
                </div>
            </div>
        );
    }

    // Das entsprechende HTML-Tag dynamisch wählen
    const Tag = `h${level}`;
    return (
        <
            // @ts-ignore
        Tag className={`${sizeClasses[level]} text-gray-900 dark:text-white border-l-4 border-blue-600 pl-4`}>
            {content.text}
        </Tag>
    );
};