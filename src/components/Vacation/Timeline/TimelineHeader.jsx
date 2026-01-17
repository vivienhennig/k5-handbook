import React from 'react';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';

export default function TimelineHeader({ monthName, changeMonth }) {
    return (
        <div className="p-8 border-b border-gray-100 dark:border-k5-deep flex justify-between items-center bg-white dark:bg-k5-black/50">
            <h3 className="font-bold text-k5-black dark:text-white flex items-center gap-3 uppercase text-xs tracking-[0.2em]">
                <Users size={20} className="text-k5-digital"/> Team Timeline
            </h3>
            <div className="flex items-center gap-4 bg-k5-light-grey dark:bg-k5-deep/20 px-6 py-3 rounded-k5-md border border-gray-100 dark:border-k5-deep shadow-sm">
                <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white dark:hover:bg-k5-black rounded-lg transition-all active:scale-90">
                    <ChevronLeft size={20} className="text-k5-black dark:text-white" />
                </button>
                <span className="font-bold text-sm min-w-[160px] text-center uppercase tracking-widest text-k5-black dark:text-white">{monthName}</span>
                <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white dark:hover:bg-k5-black rounded-lg transition-all active:scale-90">
                    <ChevronRight size={20} className="text-k5-black dark:text-white" />
                </button>
            </div>
        </div>
    );
}