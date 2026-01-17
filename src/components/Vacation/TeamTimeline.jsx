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
        <div className="bg-white dark:bg-k5-black rounded-k5-lg shadow-sm border border-gray-100 dark:border-k5-deep overflow-hidden font-sans">
            <TimelineHeader monthName={monthName} changeMonth={changeMonth} />

            <div className="overflow-x-auto">
                <div className="min-w-[1000px]">
                    {/* Header Spalte: Tage */}
                    <div className="flex border-b border-gray-100 dark:border-k5-deep bg-white dark:bg-k5-black">
                        <div className="w-56 shrink-0 p-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] sticky left-0 bg-white dark:bg-k5-black z-10 border-r border-gray-100 dark:border-k5-deep">
                            Mitarbeiter
                        </div>
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                            <div 
                                key={day} 
                                className={`flex-1 min-w-[34px] p-3 text-center text-[10px] font-black border-r border-gray-50 dark:border-k5-deep/30 
                                ${isWeekend(viewDate.getFullYear(), viewDate.getMonth(), day) ? 'bg-k5-light-grey/50 dark:bg-k5-deep/20 text-gray-300 dark:text-gray-600' : 'text-gray-500'}`}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Body: User Rows */}
                    <div className="divide-y divide-gray-100 dark:divide-k5-deep/50 max-h-[600px] overflow-y-auto custom-scrollbar bg-white dark:bg-k5-black">
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