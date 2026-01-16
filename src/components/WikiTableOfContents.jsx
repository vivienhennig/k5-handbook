import React from 'react';
import { List, ChevronUp } from 'lucide-react';

export default function WikiTableOfContents({ blocks, isEditing }) {
    // Falls wir im Edit-Modus sind oder keine Blöcke haben, zeigen wir nichts an
    if (isEditing || !blocks) return null;

    // Headlines extrahieren (H2 bis H6)
    const headlines = blocks
        .filter(b => b.type === 'headline' && b.content?.text)
        .map(b => ({
            id: b.id,
            text: b.content.text,
            level: b.content.level || 2
        }));

    // Nur anzeigen, wenn mindestens 2 Headlines existieren (sonst lohnt es sich meist nicht)
    if (headlines.length < 1) return null;

    const scrollToId = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Platz für den Header
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <aside className="hidden lg:block w-64 shrink-0 order-2 print:hidden">
            <div className="sticky top-24 p-6 bg-gray-50/50 dark:bg-gray-800/30 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 backdrop-blur-sm">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-2 italic">
                    <List size={14} className="text-blue-600"/> Inhaltsverzeichnis
                </h4>
                
                <nav className="space-y-1">
                    {headlines.map((h) => (
                        <button
                            key={h.id}
                            onClick={() => scrollToId(h.id)}
                            className={`block w-full text-left transition-all hover:text-blue-600 py-1.5 rounded-lg group
                                ${h.level === 2 ? 'text-xs font-black uppercase tracking-tight text-gray-700 dark:text-gray-200' : 
                                  h.level === 3 ? 'text-xs font-bold text-gray-500 pl-3 border-l border-gray-200 dark:border-gray-700 ml-1' : 
                                  'text-[10px] font-medium text-gray-400 pl-5 ml-1 border-l border-gray-100 dark:border-gray-800'}`}
                        >
                            <span className="group-hover:translate-x-1 inline-block transition-transform">
                                {h.text}
                            </span>
                        </button>
                    ))}
                </nav>
                
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <button 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="text-[9px] font-black uppercase text-blue-600 hover:text-blue-700 flex items-center gap-2 transition-colors"
                    >
                        <ChevronUp size={12}/> Nach oben
                    </button>
                </div>
            </div>
        </aside>
    );
}