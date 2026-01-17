import React from 'react';
import { List, ChevronUp, ArrowRight } from 'lucide-react';

export default function WikiTableOfContents({ blocks, isEditing }) {
    if (isEditing || !blocks) return null;

    const headlines = blocks
        .filter(b => b.type === 'headline' && b.content?.text)
        .map(b => ({
            id: b.id,
            text: b.content.text,
            level: b.content.level || 2
        }));

    if (headlines.length < 1) return null;

    const scrollToId = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 120; 
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
        <aside className="hidden lg:block w-72 shrink-0 order-2 print:hidden">
            <div className="sticky top-32 p-8 bg-white dark:bg-k5-black rounded-k5-lg border border-gray-100 dark:border-k5-deep shadow-sm font-sans">
                {/* Header: Aeonik Bold & k5-sand */}
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-k5-sand mb-8 flex items-center gap-3">
                    <List size={16} className="text-k5-digital"/> ON THIS PAGE
                </h4>
                
                <nav className="space-y-3">
                    {headlines.map((h) => (
                        <button
                            key={h.id}
                            onClick={() => scrollToId(h.id)}
                            className={`block w-full text-left transition-all group relative
                                ${h.level === 2 
                                    ? 'text-[11px] font-black uppercase tracking-tight text-k5-black dark:text-white' 
                                    : h.level === 3 
                                    ? 'text-[11px] font-bold text-gray-500 pl-4 border-l-2 border-gray-100 dark:border-k5-deep ml-1 hover:border-k5-sand' 
                                    : 'text-[10px] font-medium text-gray-400 pl-6 border-l border-gray-100 dark:border-k5-deep ml-1 hover:border-k5-digital'}`}
                        >
                            <span className="group-hover:text-k5-digital group-hover:translate-x-1 inline-block transition-all duration-300">
                                {h.text}
                            </span>
                            {h.level === 2 && (
                                <ArrowRight size={10} className="absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 text-k5-digital transition-all" />
                            )}
                        </button>
                    ))}
                </nav>
                
                {/* Back to Top: Aeonik Bold & Digital Blue */}
                <div className="mt-10 pt-6 border-t border-gray-100 dark:border-k5-deep/50">
                    <button 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-k5-digital flex items-center gap-3 transition-colors group"
                    >
                        <div className="p-1.5 bg-k5-light-grey dark:bg-k5-deep rounded-full group-hover:bg-k5-digital group-hover:text-white transition-all">
                            <ChevronUp size={12}/>
                        </div>
                        BACK TO TOP
                    </button>
                </div>
            </div>
        </aside>
    );
}