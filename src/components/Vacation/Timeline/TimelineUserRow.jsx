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
        <div className="flex hover:bg-k5-light-grey dark:hover:bg-k5-deep/10 transition-colors group">
            {/* Linke Spalte: Mitarbeiter Info */}
            <div className="w-56 shrink-0 p-4 flex items-center gap-4 sticky left-0 bg-white dark:bg-k5-black z-10 border-r border-gray-100 dark:border-k5-deep">
                {/* Avatar Bereich: Prüft auf Bild-URL */}
                <div className="w-9 h-9 rounded-k5-sm bg-k5-light-grey dark:bg-k5-deep flex items-center justify-center text-xs font-bold text-gray-500 uppercase overflow-hidden shrink-0 shadow-sm border border-gray-100 dark:border-k5-deep/50">
                    {user.photoUrl ? (
                        <img 
                            src={user.photoUrl} 
                            alt={user.displayName} 
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }} // Fallback bei kaputtem Link
                        />
                    ) : (
                        <span>{user.displayName?.charAt(0)}</span>
                    )}
                </div>
                
                <div className="min-w-0">
                    <div className="text-xs font-bold text-k5-black dark:text-white truncate uppercase tracking-tight">
                        {user.displayName}
                    </div>
                    <div className="text-[9px] text-gray-400 truncate font-bold uppercase tracking-widest mt-0.5">
                        {user.department || 'General'}
                    </div>
                </div>
            </div>

            {/* Rechte Matrix: Tage */}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const vac = getVacationForUserAndDay(user.uid, day);
                const isWE = isWeekend(viewDate.getFullYear(), viewDate.getMonth(), day);
                let cellClass = isWE ? 'bg-k5-light-grey/50 dark:bg-k5-deep/20' : '';
                
                if (vac) {
                    // Die funktionalen Farben bleiben erhalten
                    cellClass = vac.type === 'workation' ? 'bg-glow-deep' : getDepartmentColorClass(user.department);
                    if (vac.type === 'half') cellClass += ' opacity-40';
                }

                return (
                    <div key={day} className={`flex-1 min-w-[34px] border-r border-gray-50 dark:border-k5-deep/30 relative h-14 ${cellClass}`}>
                        {/* Optionale Tooltips könnten hier ergänzt werden */}
                    </div>
                );
            })}
        </div>
    );
}