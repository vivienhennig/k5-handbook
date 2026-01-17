import React from 'react';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

export default function TimelineHeader({ monthName, changeMonth }) {
    return (
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/30">
            <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2 italic uppercase text-xs tracking-widest">
                <AlertCircle size={18} className="text-blue-600"/> Team Timeline
            </h3>
            <div className="flex items-center gap-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <ChevronLeft size={20}/>
                </button>
                <span className="font-black text-sm min-w-[140px] text-center italic">{monthName}</span>
                <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <ChevronRight size={20}/>
                </button>
            </div>
        </div>
    );
}