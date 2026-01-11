import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Sun, Palmtree, User, ChevronLeft, ChevronRight, AlertCircle, Laptop, Info } from 'lucide-react';
import { vacationApi, calculateWorkDays, userApi } from '../services/api';
// HIER: PUBLIC_HOLIDAYS hinzufügen
import { STANDARD_VACATION_DAYS, VACATION_TYPES, DEPARTMENT_COLORS, PUBLIC_HOLIDAYS } from '../config/data';

export default function VacationView({ currentUser }) {
    const [vacations, setVacations] = useState([]);
    const [users, setUsers] = useState([]); 
    const [usersMap, setUsersMap] = useState({}); 
    const [loading, setLoading] = useState(true);
    
    // Form State
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [vacationType, setVacationType] = useState('standard');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Kalkulation State
    const [calculatedDays, setCalculatedDays] = useState(0);
    const [myEntitlement, setMyEntitlement] = useState(currentUser.vacationEntitlement || STANDARD_VACATION_DAYS);
    const [myCarryOver, setMyCarryOver] = useState(currentUser.carryOverDays || 0);

    // Kalender State
    const [viewMonth, setViewMonth] = useState(new Date());

    useEffect(() => { loadData(); }, []);

    useEffect(() => {
        if(startDate && endDate) {
            if(new Date(startDate) > new Date(endDate)) {
                setCalculatedDays(0);
                return;
            }
            if (vacationType === 'half') {
                setCalculatedDays(0.5);
            } else {
                const workDays = calculateWorkDays(startDate, endDate);
                const factor = VACATION_TYPES[vacationType]?.factor || 1;
                setCalculatedDays(workDays * factor);
            }
        } else {
            setCalculatedDays(0);
        }
    }, [startDate, endDate, vacationType]);

    const loadData = async () => {
        setLoading(true);
        const [allVacations, allUsers] = await Promise.all([
            vacationApi.getAllVacations(),
            userApi.getAllUsers()
        ]);
        
        setVacations(allVacations);
        
        const sortedUsers = allUsers.sort((a,b) => (a.displayName || '').localeCompare(b.displayName || ''));
        setUsers(sortedUsers);

        const map = {};
        allUsers.forEach(u => { map[u.uid] = u; });
        setUsersMap(map);
        
        const userData = await userApi.getUserData(currentUser.uid);
        if(userData.vacationEntitlement !== undefined) setMyEntitlement(userData.vacationEntitlement);
        if(userData.carryOverDays !== undefined) setMyCarryOver(userData.carryOverDays);
        
        setLoading(false);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (calculatedDays <= 0) return alert("Ungültiger Zeitraum");
        // Check: Überschneidung mit bestehenden Urlauben?
        const hasOverlap = vacations.some(v => {
            // Nur meine eigenen Urlaube prüfen
            if (v.userId !== currentUser.uid) return false;
    
            // Logik: Wenn (NeuerStart <= AlterEnde) UND (NeuerEnde >= AlterStart) -> Überschneidung
            return (startDate <= v.endDate && endDate >= v.startDate);
        });

        if (hasOverlap) {
            alert("⚠️ Für diesen Zeitraum existiert bereits ein Eintrag!");
            return;
        }
        
        setIsSubmitting(true);
        try {
            await vacationApi.addVacation({
                userId: currentUser.uid,
                userName: currentUser.displayName,
                userPhoto: currentUser.photoUrl || '', 
                startDate,
                endDate: vacationType === 'half' ? startDate : endDate,
                type: vacationType,
                status: 'approved',
            });
            setStartDate('');
            setEndDate('');
            setVacationType('standard');
            loadData();
        } catch (e) { alert("Fehler beim Speichern"); }
        setIsSubmitting(false);
    };

    const handleDelete = async (id) => {
        if(confirm("Urlaub wirklich stornieren?")) {
            await vacationApi.deleteVacation(id);
            loadData();
        }
    };

    // --- HELPER FÜR MATRIX (Updated für Feiertage) ---
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        
        return Array.from({ length: days }, (_, i) => {
            const d = new Date(year, month, i + 1);
            
            // Formatierung für Vergleich (YYYY-MM-DD und MM-DD)
            // Wir bauen den String manuell, um Zeitzonen-Probleme von toISOString zu vermeiden
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            const dateString = `${yyyy}-${mm}-${dd}`;
            const monthDay = `${mm}-${dd}`;

            // Check: Ist Wochenende?
            const isWeekend = d.getDay() === 0 || d.getDay() === 6;
            
            // Check: Ist Feiertag? (Fest oder Beweglich)
            const isHoliday = PUBLIC_HOLIDAYS.includes(dateString) || PUBLIC_HOLIDAYS.includes(monthDay);

            return {
                date: d,
                dayStr: i + 1,
                isWeekend: isWeekend,
                isHoliday: isHoliday, // NEU
                isOff: isWeekend || isHoliday, // Zusammenfassung für Styling
                iso: dateString
            };
        });
    };

    const checkVacation = (uid, isoDate) => {
        return vacations.find(v => {
            if (v.userId !== uid) return false;
            return isoDate >= v.startDate && isoDate <= v.endDate;
        });
    };

    const monthName = viewMonth.toLocaleString('de-DE', { month: 'long', year: 'numeric' });
    const changeMonth = (offset) => {
        const newDate = new Date(viewMonth);
        newDate.setMonth(newDate.getMonth() + offset);
        setViewMonth(newDate);
    };
    
    const daysArray = getDaysInMonth(viewMonth);

    const myVacations = vacations.filter(v => v.userId === currentUser.uid);
    const currentYear = new Date().getFullYear();
    const myVacationsThisYear = myVacations.filter(v => v.startDate.startsWith(currentYear.toString()));
    const takenDays = myVacationsThisYear.reduce((acc, curr) => acc + curr.daysCount, 0);
    const totalAvailable = myEntitlement + myCarryOver;
    const remainingDays = totalAvailable - takenDays;

    return (
        <div className="max-w-[95%] mx-auto animate-in fade-in duration-500 pb-20">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <Palmtree className="text-orange-500"/> Urlaubsmanager
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">Planung & Übersicht für {currentYear}</p>
                </div>
            </div>

            {/* TOP BEREICH: STATS & BUCHUNG */}
            <div className="grid lg:grid-cols-3 gap-8 mb-12 max-w-6xl mx-auto">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2"><User size={18}/> Deine Bilanz {currentYear}</h3>
                    <div className="flex items-center justify-around text-center">
                        <div>
                            <div className="text-xl font-bold text-gray-900 dark:text-white flex flex-col items-center">{totalAvailable}</div>
                            <div className="text-[9px] text-gray-400 mt-1 leading-tight">{myEntitlement} Neu <br/>{myCarryOver !== 0 && `${myCarryOver > 0 ? '+' : ''}${myCarryOver} Alt`}</div>
                            <div className="text-[10px] text-gray-500 uppercase font-bold mt-2">Budget</div>
                        </div>
                        <div className="h-10 w-px bg-gray-200 dark:bg-gray-700"></div>
                        <div>
                            <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{takenDays}</div>
                            <div className="text-xs text-gray-500 uppercase font-bold mt-1">Genommen</div>
                        </div>
                        <div className="h-10 w-px bg-gray-200 dark:bg-gray-700"></div>
                        <div>
                            <div className={`text-3xl font-black ${remainingDays < 0 ? 'text-red-500' : 'text-green-500'}`}>{remainingDays}</div>
                            <div className="text-xs text-gray-500 uppercase font-bold mt-1">Verfügbar</div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="font-bold text-xl mb-4 flex items-center gap-2"><Plus size={20}/> Eintrag erstellen</h3>
                        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="w-full md:w-40">
                                <label className="block text-xs font-bold text-blue-100 uppercase mb-1">Art</label>
                                <select className="w-full p-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:bg-white/30 [&>option]:text-black"
                                    value={vacationType} onChange={e => setVacationType(e.target.value)}>
                                    <option value="standard">🏝 Urlaub</option>
                                    <option value="half">🌓 Halber Tag</option>
                                    <option value="workation">💻 Workation</option>
                                </select>
                            </div>
                            <div className="flex-1 w-full">
                                <label className="block text-xs font-bold text-blue-100 uppercase mb-1">Von</label>
                                <input type="date" required className="w-full p-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:bg-white/30"
                                    value={startDate} onChange={e => setStartDate(e.target.value)}/>
                            </div>
                            {vacationType !== 'half' && (
                                <div className="flex-1 w-full">
                                    <label className="block text-xs font-bold text-blue-100 uppercase mb-1">Bis</label>
                                    <input type="date" required className="w-full p-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:bg-white/30"
                                        value={endDate} onChange={e => setEndDate(e.target.value)}/>
                                </div>
                            )}
                            <div className="md:w-20 text-center pb-2 shrink-0">
                                <div className="text-2xl font-black">{calculatedDays}</div>
                                <div className="text-[10px] uppercase opacity-80">Konto</div>
                            </div>
                            <button type="submit" disabled={isSubmitting || calculatedDays <= 0} className="w-full md:w-auto px-6 py-2.5 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 disabled:opacity-50 transition-colors">
                                Buchen
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* MATRIX VIEW */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><Calendar size={18}/> Team Kalender</h3>
                    <div className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-600 shadow-sm">
                        <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><ChevronLeft size={16}/></button>
                        <span className="font-mono font-bold text-sm w-32 text-center">{monthName}</span>
                        <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><ChevronRight size={16}/></button>
                    </div>
                </div>

                <div className="overflow-x-auto pb-4 relative shadow-[inset_-10px_0_10px_-10px_rgba(0,0,0,0.2)]">
                    <table className="w-full border-collapse min-w-max">
                        <thead>
                            <tr>
                                <th className="sticky left-0 z-20 bg-gray-50 dark:bg-gray-800 border-b border-r border-gray-200 dark:border-gray-700 p-3 text-left w-48 min-w-[200px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                    <span className="text-xs font-bold uppercase text-gray-500">Mitarbeiter</span>
                                </th>
                                {daysArray.map(day => (
                                    // HEADER ZELLE
                                    // isOff (Weekend oder Holiday) macht den Hintergrund grau
                                    <th key={day.dayStr} title={day.isHoliday ? 'Feiertag' : ''} className={`border-b border-r border-gray-200 dark:border-gray-700 p-1 w-10 min-w-[2.5rem] text-center ${day.isOff ? 'bg-gray-100 dark:bg-gray-900/50' : 'bg-white dark:bg-gray-800'}`}>
                                        <div className={`text-xs font-bold ${day.isOff ? 'text-gray-400' : 'text-gray-900 dark:text-white'} ${day.isHoliday ? 'text-red-400' : ''}`}>
                                            {day.dayStr}
                                        </div>
                                        <div className="text-[9px] text-gray-400 font-normal uppercase">
                                            {day.date.toLocaleDateString('de-DE', {weekday: 'short'}).slice(0,2)}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.uid} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="sticky left-0 z-10 bg-white dark:bg-gray-800 border-b border-r border-gray-200 dark:border-gray-700 p-2 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                        <div className="flex items-center gap-2">
                                            {user.photoUrl ? (
                                                <img src={user.photoUrl} alt="Av" className="w-6 h-6 rounded-full object-cover"/>
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">{user.displayName?.charAt(0)}</div>
                                            )}
                                            <div className="truncate max-w-[130px]">
                                                <div className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{user.displayName}</div>
                                                <div className="text-[10px] text-gray-400 truncate">{user.department}</div>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    {daysArray.map(day => {
                                        const vac = checkVacation(user.uid, day.iso);
                                        const deptColor = DEPARTMENT_COLORS[user.department] || DEPARTMENT_COLORS['default'];
                                        
                                        return (
                                            // BODY ZELLE
                                            // isOff macht die Zelle grau
                                            <td key={day.dayStr} className={`border-b border-r border-gray-100 dark:border-gray-700 p-0 relative h-10 ${day.isOff ? 'bg-gray-50/50 dark:bg-gray-900/30' : ''}`}>
                                                {vac && (
                                                    <div 
                                                        className={`absolute inset-0.5 rounded-sm flex items-center justify-center text-[8px] font-bold cursor-pointer group tooltip-container ${deptColor.classes}`}
                                                        title={`${user.displayName}: ${vac.type} (${vac.startDate} - ${vac.endDate})`}
                                                        onClick={() => {
                                                            if (user.uid === currentUser.uid || currentUser.role === 'admin') {
                                                                handleDelete(vac.id);
                                                            }
                                                        }}
                                                    >
                                                        {vac.type === 'half' && '½'}
                                                        {vac.type === 'workation' && 'W'}
                                                        {(user.uid === currentUser.uid || currentUser.role === 'admin') && (
                                                            <div className="absolute inset-0 bg-red-500/80 items-center justify-center hidden group-hover:flex rounded-sm text-white">
                                                                <Trash2 size={12}/>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 text-[10px] text-gray-400 flex gap-4 justify-end border-t border-gray-200 dark:border-gray-700">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-200"></span> Wochenende / Feiertag</span>
                    <span className="flex items-center gap-1 font-bold">W = Workation</span>
                    <span className="flex items-center gap-1 font-bold">½ = Halber Tag</span>
                    <span className="flex items-center gap-1">Klick auf Balken zum Löschen (nur eigene)</span>
                </div>
            </div>
        </div>
    );
}