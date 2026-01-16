import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';

export default function EventGrid({ upcomingEvents, onSelectEvent, eventTypes }) {
    return (
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 italic">
            {/* Icon & Title */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 w-fit mb-6">
                <Calendar size={24} />
            </div>
            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">
                Upcoming Events
            </h3>

            {/* Grid der Event-Karten */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {upcomingEvents && upcomingEvents.length > 0 ? (
                    upcomingEvents.slice(0, 3).map((event, i) => {
                        // Dynamisches Styling basierend auf dem Event-Typ
                        const typeCfg = eventTypes[event.type] || { color: 'bg-gray-500' };
                        
                        return (
                            <button 
                                key={i} 
                                onClick={() => onSelectEvent(event)} 
                                className={`${typeCfg.color} p-6 rounded-3xl transition-all hover:scale-105 hover:shadow-lg text-left group flex flex-col justify-between min-h-[140px] shadow-sm`}
                            >
                                <p className="text-[10px] font-black uppercase opacity-70 mb-1">
                                    {new Date(event.start || event.date).toLocaleDateString('de-DE', { 
                                        day: '2-digit', 
                                        month: 'short' 
                                    })}
                                </p>
                                <h4 className="font-black leading-tight uppercase text-sm flex justify-between items-center text-white">
                                    {event.title} 
                                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-4px] group-hover:translate-x-0"/>
                                </h4>
                            </button>
                        );
                    })
                ) : (
                    <div className="col-span-3 py-10 text-center text-gray-300 text-xs font-black uppercase tracking-widest border-2 border-dashed border-gray-50 dark:border-gray-800 rounded-3xl">
                        Keine anstehenden Events
                    </div>
                )}
            </div>
        </div>
    );
}