import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';

export default function EventGrid({ upcomingEvents, onSelectEvent, eventTypes }) {
    return (
        <div className="lg:col-span-2 bg-white dark:bg-k5-black p-8 rounded-k5-lg shadow-sm border border-gray-100 dark:border-k5-deep font-sans">
            {/* Icon & Title: k5-md Rundung, CI Blue Akzent, kein Italic */}
            <div className="p-4 bg-k5-light-grey dark:bg-k5-deep/30 rounded-k5-md text-k5-digital w-fit mb-8 shadow-sm">
                <Calendar size={28} />
            </div>
            <h3 className="text-[10px] font-bold uppercase text-gray-400 tracking-[0.2em] mb-6">
                Upcoming Events
            </h3>

            {/* Grid der Event-Karten */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {upcomingEvents && upcomingEvents.length > 0 ? (
                    upcomingEvents.slice(0, 3).map((event, i) => {
                        // Dynamisches Styling basierend auf dem Event-Typ bleibt erhalten
                        const typeCfg = eventTypes[event.type] || { color: 'bg-gray-500' };
                        
                        return (
                            <button 
                                key={i} 
                                onClick={() => onSelectEvent(event)} 
                                className={`${typeCfg.color} p-6 rounded-k5-md transition-all hover:scale-105 hover:shadow-xl text-left group flex flex-col justify-between min-h-[160px] shadow-sm border border-transparent hover:border-white/20`}
                            >
                                {/* Datum: Aeonik Bold, kein Italic */}
                                <p className="text-[10px] font-bold uppercase opacity-80 tracking-widest">
                                    {new Date(event.start || event.date).toLocaleDateString('de-DE', { 
                                        day: '2-digit', 
                                        month: 'short' 
                                    })}
                                </p>
                                
                                {/* Titel: Aeonik Bold, Majuskeln, kein Italic */}
                                <h4 className="font-bold leading-tight uppercase text-sm flex justify-between items-center text-white tracking-tight">
                                    {event.title} 
                                    <ChevronRight 
                                        size={18} 
                                        className="opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0"
                                    />
                                </h4>
                            </button>
                        );
                    })
                ) : (
                    <div className="col-span-3 py-16 text-center text-gray-300 dark:text-gray-600 text-[10px] font-bold uppercase tracking-[0.3em] border-2 border-dashed border-gray-100 dark:border-k5-deep rounded-k5-lg bg-k5-light-grey/30 dark:bg-k5-deep/10">
                        Keine anstehenden Events
                    </div>
                )}
            </div>
        </div>
    );
}