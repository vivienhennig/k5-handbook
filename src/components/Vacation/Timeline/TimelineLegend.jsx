import React from 'react';
import { DEPARTMENT_COLORS } from '../../../config/data.js';

export default function TimelineLegend() {
    return (
        <div className="p-6 bg-gray-50/50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest italic">
            {Object.entries(DEPARTMENT_COLORS).map(([dept, config]) => dept !== 'default' && (
                <div key={dept} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${config.classes}`}></div>
                    <span className="text-gray-500">{dept}</span>
                </div>
            ))}
            <div className="flex items-center gap-2 border-l pl-6">
                <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                <span className="text-gray-500">Workation</span>
            </div>
        </div>
    );
}