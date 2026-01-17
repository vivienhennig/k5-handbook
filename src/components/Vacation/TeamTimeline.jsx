import React, { useMemo } from 'react';
import TimelineHeader from './Timeline/TimelineHeader.jsx';
import TimelineLegend from './Timeline/TimelineLegend.jsx';
import TimelineUserRow from './Timeline/TimelineUserRow.jsx';


export default function TeamTimeline({ 
    viewDate, changeMonth, daysInMonth, monthName, allUsers, 
    isWeekend, getVacationForUserAndDay, getDepartmentColorClass 
}) {
    // Alphabetische Sortierung beibehalten
    const sortedUsers = useMemo(() => {
        return [...allUsers].sort((a, b) => 
            (a.displayName || "").localeCompare(b.displayName || "", 'de', { sensitivity: 'base' })
        );
    }, [allUsers]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden font-sans">
            <TimelineHeader monthName={monthName} changeMonth={changeMonth} />

            <div className="overflow-x-auto">
                <div className="min-w-[1000px]">
                    {/* Header Spalte: Tage */}
                    <div className="flex border-b border-gray-100 dark:border-gray-700">
                        <div className="w-56 shrink-0 p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest sticky left-0 bg-white dark:bg-gray-800 z-10 border-r">
                            Mitarbeiter
                        </div>
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                            <div 
                                key={day} 
                                className={`flex-1 min-w-[32px] p-2 text-center text-[10px] font-black border-r border-gray-50 dark:border-gray-700/50 
                                ${isWeekend(viewDate.getFullYear(), viewDate.getMonth(), day) ? 'bg-gray-50 dark:bg-gray-900/50 text-gray-300' : 'text-gray-500'}`}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Body: User Rows */}
                    <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[600px] overflow-y-auto custom-scrollbar">
                        {sortedUsers.map(user => (
                            <TimelineUserRow 
                                key={user.uid}
                                user={user}
                                daysInMonth={daysInMonth}
                                viewDate={viewDate}
                                isWeekend={isWeekend}
                                getVacationForUserAndDay={getVacationForUserAndDay}
                                getDepartmentColorClass={getDepartmentColorClass}
                            />
                        ))}
                    </div>
                </div>
            </div>
            
            <TimelineLegend />
        </div>
    );
}