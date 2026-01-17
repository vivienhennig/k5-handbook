import React from 'react';
import { DEPARTMENT_COLORS } from '../../../config/data.js';

export default function TimelineLegend() {
    return (
        <div className="p-8 bg-white dark:bg-k5-black/50 border-t border-gray-100 dark:border-k5-deep flex flex-wrap gap-8 text-[10px] font-bold uppercase tracking-[0.2em]">
            {Object.entries(DEPARTMENT_COLORS).map(([dept, config]) => dept !== 'default' && (
                <div key={dept} className="flex items-center gap-2.5">
                    {/* Beibehaltung der funktionalen Klassen für die Farbpunkte */}
                    <div className={`w-3 h-3 rounded-full shadow-sm ${config.classes}`}></div>
                    <span className="text-gray-500 dark:text-gray-400">{dept}</span>
                </div>
            ))}
            <div className="flex items-center gap-2.5 border-l border-gray-100 dark:border-k5-deep pl-8">
                {/* Workation nutzt weiterhin den lila Indikator */}
                <div className="w-3 h-3 rounded-full bg-glow-deep shadow-sm"></div>
                <span className="text-gray-500 dark:text-gray-400">Workation</span>
            </div>
        </div>
    );
}