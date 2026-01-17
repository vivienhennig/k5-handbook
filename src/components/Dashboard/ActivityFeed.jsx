import React from 'react';
import { PlusCircle, Edit3, ChevronRight } from 'lucide-react';

export default function ActivityFeed({ activities, handleNav, getTimeAgo }) {
    return (
        <div className="lg:col-span-2 space-y-6 font-sans">
            {/* Headline: Aeonik Bold, Uppercase, kein Italic */}
            <h3 className="font-bold text-gray-400 text-[10px] uppercase tracking-[0.3em] mb-4 px-4">
                Letzte Handbook Updates
            </h3>
            <div className="space-y-4">
                {activities.map((act, i) => (
                    <div 
                        key={i} 
                        onClick={() => handleNav(act.wikiId)} 
                        className="bg-white dark:bg-k5-black p-6 rounded-k5-lg border border-gray-100 dark:border-k5-deep shadow-sm flex items-center gap-6 hover:shadow-md hover:border-k5-digital transition-all cursor-pointer group"
                    >
                        {/* Icon-Container: Abgerundet nach k5-md */}
                        <div className={`w-12 h-12 rounded-k5-md flex items-center justify-center shrink-0 ${
                            act.type === 'create' 
                            ? 'bg-k5-lime-light text-k5-deep' 
                            : 'bg-k5-light-grey dark:bg-k5-deep/30 text-k5-digital'
                        }`}>
                            {act.type === 'create' ? <PlusCircle size={20} /> : <Edit3 size={20} />}
                        </div>

                        {/* Textbereich: Aeonik Bold für Titel, Regular für Copy */}
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-k5-black dark:text-white uppercase text-sm truncate tracking-tight">
                                {act.title}
                            </h4>
                            <p className="text-xs text-gray-500 leading-copy mt-0.5">
                                Bearbeitet von <span className="font-bold text-k5-black dark:text-gray-300">{act.userName}</span>
                            </p>
                        </div>

                        {/* Status & Action */}
                        <div className="text-right shrink-0">
                            <p className="text-[10px] font-bold text-k5-digital uppercase tracking-widest mb-1">
                                {getTimeAgo(act.timestamp)}
                            </p>
                            <div className="flex justify-end">
                                <ChevronRight 
                                    size={18} 
                                    className="text-gray-300 group-hover:text-k5-digital transition-transform group-hover:translate-x-1" 
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}