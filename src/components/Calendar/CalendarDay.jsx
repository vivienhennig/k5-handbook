import React from 'react';
import { EVENT_TYPES } from '../../config/data';

export default function CalendarDay({ date, events, isToday, onClickEvent }) {
    if (!date) {
        return (
            <div className="bg-gray-50/30 dark:bg-gray-900/10 border-b border-r border-gray-100 dark:border-gray-700/50 min-h-[140px]" />
        );
    }

    return (
        <div className="p-3 border-b border-r border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 group hover:bg-blue-50/20 dark:hover:bg-blue-900/10 transition-colors min-h-[140px]">
            <div className="flex justify-between items-start mb-3">
                <span className={`text-xs font-black w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                    isToday 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110' 
                    : 'text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                }`}>
                    {date.getDate()}
                </span>
            </div>
            <div className="space-y-1.5">
                {events.map(evt => (
                    <button 
                        key={evt.id} 
                        onClick={() => onClickEvent(evt)}
                        className={`w-full text-left text-[9px] px-2 py-1.5 rounded-lg border-l-[3px] font-black uppercase tracking-tighter truncate hover:scale-[1.03] transition-all shadow-sm ${
                            EVENT_TYPES[evt.type]?.color || 'bg-gray-100 border-gray-400 text-gray-600'
                        }`}
                    >
                        {evt.title}
                    </button>
                ))}
            </div>
        </div>
    );
}