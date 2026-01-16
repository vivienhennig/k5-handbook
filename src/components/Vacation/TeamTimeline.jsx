import React from 'react';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { DEPARTMENT_COLORS } from '../../config/data';

export default function TeamTimeline({ 
    viewDate, changeMonth, daysInMonth, monthName, allUsers, 
    isWeekend, getVacationForUserAndDay, getDepartmentColorClass 
}) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/30">
                <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2 italic uppercase text-xs tracking-widest">
                    <AlertCircle size={18} className="text-blue-600"/> Team Timeline
                </h3>
                <div className="flex items-center gap-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><ChevronLeft size={20}/></button>
                    <span className="font-black text-sm min-w-[140px] text-center italic">{monthName}</span>
                    <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><ChevronRight size={20}/></button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[1000px]">
                    {/* Header: Tage */}
                    <div className="flex border-b border-gray-100 dark:border-gray-700">
                        <div className="w-56 shrink-0 p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest sticky left-0 bg-white dark:bg-gray-800 z-10 border-r">Mitarbeiter</div>
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                            <div key={day} className={`flex-1 min-w-[32px] p-2 text-center text-[10px] font-black border-r border-gray-50 dark:border-gray-700/50 ${isWeekend(viewDate.getFullYear(), viewDate.getMonth(), day) ? 'bg-gray-50 dark:bg-gray-900/50 text-gray-300' : 'text-gray-500'}`}>{day}</div>
                        ))}
                    </div>

                    {/* Body: User Rows */}
                    <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
                        {allUsers.map(user => (
                            <div key={user.uid} className="flex hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                                <div className="w-56 shrink-0 p-3 flex items-center gap-3 sticky left-0 bg-white dark:bg-gray-800 z-10 border-r border-gray-100 dark:border-gray-700">
                                    <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-black text-gray-500 uppercase">{user.displayName?.charAt(0)}</div>
                                    <div className="min-w-0">
                                        <div className="text-xs font-black text-gray-900 dark:text-white truncate uppercase italic">{user.displayName}</div>
                                        <div className="text-[9px] text-gray-400 truncate font-bold uppercase tracking-tighter">{user.department || 'General'}</div>
                                    </div>
                                </div>

                                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                                    const vac = getVacationForUserAndDay(user.uid, day);
                                    const isWE = isWeekend(viewDate.getFullYear(), viewDate.getMonth(), day);
                                    let cellClass = isWE ? 'bg-gray-50/50 dark:bg-gray-900/20' : '';
                                    
                                    if (vac) {
                                        cellClass = vac.type === 'workation' ? 'bg-purple-400' : getDepartmentColorClass(user.department);
                                        if (vac.type === 'half') cellClass += ' opacity-40';
                                    }

                                    return <div key={day} className={`flex-1 min-w-[32px] border-r border-gray-50 dark:border-gray-700/30 relative h-12 ${cellClass}`}></div>;
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Legende (vereinfacht) */}
            <div className="p-6 bg-gray-50/50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest italic">
                {Object.entries(DEPARTMENT_COLORS).map(([dept, config]) => dept !== 'default' && (
                    <div key={dept} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${config.classes}`}></div>
                        <span className="text-gray-500">{dept}</span>
                    </div>
                ))}
                <div className="flex items-center gap-2 border-l pl-6"><div className="w-3 h-3 rounded-full bg-purple-400"></div><span className="text-gray-500">Workation</span></div>
            </div>
        </div>
    );
}