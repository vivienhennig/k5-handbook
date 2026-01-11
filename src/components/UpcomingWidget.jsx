import React from 'react';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { EVENT_TYPES } from '../config/data';

export default function UpcomingWidget({ events, onNavigate }) {
    if (!events || events.length === 0) return null; // Nichts anzeigen, wenn keine Events da sind

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Calendar className="text-blue-600" size={20}/> Anstehende Events
                </h3>
                <button onClick={onNavigate} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    Zum Kalender <ArrowRight size={12}/>
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {events.map(event => {
                    const date = new Date(event.startDate);
                    const day = date.getDate();
                    const month = date.toLocaleString('de-DE', { month: 'short' }).toUpperCase();
                    const typeStyle = EVENT_TYPES[event.type] || EVENT_TYPES['external'];

                    return (
                        <div key={event.id} className="flex gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            {/* Datum Box */}
                            <div className="flex flex-col items-center justify-center w-12 h-14 bg-gray-100 dark:bg-gray-700 rounded-lg shrink-0">
                                <span className="text-xs font-bold text-gray-400 uppercase leading-none mb-1">{month}</span>
                                <span className="text-xl font-black text-gray-800 dark:text-white leading-none">{day}</span>
                            </div>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider truncate max-w-full ${typeStyle.color.replace('text-white', 'text-white/90')}`}>
                                        {typeStyle.label}
                                    </span>
                                </div>
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate" title={event.title}>
                                    {event.title}
                                </h4>
                                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {event.startTime && <span className="flex items-center gap-1"><Clock size={10}/> {event.startTime}</span>}
                                    {event.location && <span className="flex items-center gap-1 truncate"><MapPin size={10}/> {event.location}</span>}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}