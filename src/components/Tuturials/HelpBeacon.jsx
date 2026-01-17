import React, { useState } from 'react';
import { HelpCircle, Info } from 'lucide-react';
import { HELP_TEXTS } from '../../config/data.js';

export default function HelpBeacon({ context }) {
    const [isOpen, setIsOpen] = useState(false);
    const content = HELP_TEXTS[context];

    if (!content) return null;

    return (
        <div className="relative z-20 inline-block ml-2">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative group focus:outline-none"
                aria-label="Hilfe anzeigen"
            >
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                <div className={`relative bg-white dark:bg-gray-800 text-blue-500 hover:text-blue-600 rounded-full p-1 transition-colors ${isOpen ? 'text-blue-700 ring-2 ring-blue-200' : ''}`}>
                    <HelpCircle size={20} className={isOpen ? 'fill-blue-100' : ''}/>
                </div>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div> {/* Klick außerhalb schließt */}
                    <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 z-20 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-start gap-3">
                            <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 shrink-0">
                                <Info size={18}/>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{content.title}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-pre-line leading-relaxed">
                                    {content.text}
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}