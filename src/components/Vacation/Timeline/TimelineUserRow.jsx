import React from 'react';

export default function TimelineUserRow({ 
    user, 
    daysInMonth, 
    viewDate, 
    isWeekend, 
    getVacationForUserAndDay, 
    getDepartmentColorClass 
}) {
    return (
        <div className="flex hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
            <div className="w-56 shrink-0 p-3 flex items-center gap-3 sticky left-0 bg-white dark:bg-gray-800 z-10 border-r border-gray-100 dark:border-gray-700">
                <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-black text-gray-500 uppercase">
                    {user.displayName?.charAt(0)}
                </div>
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

                return (
                    <div key={day} className={`flex-1 min-w-[32px] border-r border-gray-50 dark:border-gray-700/30 relative h-12 ${cellClass}`}>
                        {/* Hier könnte man später Tooltips hinzufügen */}
                    </div>
                );
            })}
        </div>
    );
}