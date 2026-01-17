import React from 'react';

export default function HeadlineBlock({ content, isEditing, onChange }) {
    const level = content.level || 2; 

    // CI-konforme Größenklassen: Aeonik Black, kein Italic, enges Tracking
    const sizeClasses = {
        2: "text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none",
        3: "text-2xl md:text-3xl font-black uppercase tracking-tight leading-tight",
        4: "text-xl font-bold uppercase tracking-widest leading-snug",
        5: "text-lg font-bold tracking-normal",
        6: "text-xs font-bold uppercase tracking-[0.3em] text-k5-sand"
    };

    if (isEditing) {
        return (
            <div className="w-full group/edit relative py-2 animate-in fade-in duration-300">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                        <span className="text-[9px] font-black text-white bg-k5-digital px-1.5 py-0.5 rounded-sm shadow-sm">
                            H{level}
                        </span>
                        <div className="w-px h-full bg-k5-digital/20 mt-1" />
                    </div>
                    <input 
                        className={`${sizeClasses[level]} bg-k5-light-grey/20 dark:bg-k5-deep/10 border-b-2 border-k5-digital/30 focus:border-k5-digital w-full outline-none dark:text-white px-2 py-1 transition-all placeholder:opacity-20`} 
                        value={content.text} 
                        onChange={e => onChange({ ...content, text: e.target.value })} 
                        placeholder={`Headline Level ${level}...`}
                    />
                </div>
            </div>
        );
    }

    const Tag = `h${level}`;
    
    return (
        <div className={`mt-12 mb-6 first:mt-0 group`}>
            <Tag 
                id={content.id} // Wichtig für das Inhaltsverzeichnis (TOC)
                className={`${sizeClasses[level]} text-k5-black dark:text-white relative`}
            >
                {content.text}
                
                {/* CI-Akzent: Nur bei H2 und H3 zeigen wir den massiven K5-Balken */}
                {level <= 3 && (
                    <div className="w-12 h-1.5 bg-k5-digital mt-4 rounded-full group-hover:w-20 transition-all duration-500" />
                )}
            </Tag>
        </div>
    );
}