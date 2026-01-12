import React, { useState, useEffect } from 'react';
import { Calendar as CalIcon, Check, Trash2, AlertCircle, Clock, Palmtree, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { VACATION_TYPES, STANDARD_VACATION_DAYS, DEPARTMENT_COLORS } from '../config/data'; // <--- DEPARTMENT_COLORS importiert
import { vacationApi, userApi, calculateWorkDays } from '../services/api'; 
import { useToast } from '../context/ToastContext';

export default function VacationView({ currentUser }) {
    const { addToast } = useToast();
    const [vacations, setVacations] = useState([]);
    const [allUsers, setAllUsers] = useState([]); // <--- Neu: Liste aller User für die Timeline
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State für die Timeline-Ansicht
    const [viewDate, setViewDate] = useState(new Date());

    // Form State
    const [newVacation, setNewVacation] = useState({
        startDate: '',
        endDate: '',
        type: 'standard', 
        comment: ''
    });

    // Berechnete Stats
    const [stats, setStats] = useState({
        taken: 0,
        planned: 0,
        remaining: STANDARD_VACATION_DAYS
    });

    useEffect(() => {
        loadData();
    }, [currentUser]);

    const loadData = async () => {
        try {
            const [vacationData, usersData] = await Promise.all([
                vacationApi.getAllVacations(),
                userApi.getAllUsers()
            ]);
            
            setVacations(vacationData);
            setAllUsers(usersData);
            calculateStats(vacationData);
        } catch (error) {
            console.error("Fehler beim Laden:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (vacationList) => {
        if (!currentUser) return;
        const myVacations = vacationList.filter(v => v.userId === currentUser.uid);
        
        const taken = myVacations
            .filter(v => new Date(v.endDate) < new Date())
            .reduce((sum, v) => sum + (v.daysCount || 0), 0);

        const planned = myVacations
            .filter(v => new Date(v.endDate) >= new Date())
            .reduce((sum, v) => sum + (v.daysCount || 0), 0);

        const entitlement = (currentUser.vacationEntitlement || STANDARD_VACATION_DAYS) + (currentUser.carryOverDays || 0);

        setStats({
            taken,
            planned,
            remaining: entitlement - taken - planned
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newVacation.startDate || !newVacation.endDate) return useToast("Bitte Datum wählen");
        if (new Date(newVacation.startDate) > new Date(newVacation.endDate)) return useToast("Ende muss nach Start sein");

        setIsSubmitting(true);

        try {
            const workDays = calculateWorkDays(newVacation.startDate, newVacation.endDate);
            let daysNeeded = workDays;
            if (newVacation.type === 'half') daysNeeded = 0.5;
            if (newVacation.type === 'workation') daysNeeded = 0; 

            if (newVacation.type !== 'workation' && daysNeeded > stats.remaining) {
                useToast(`Nicht genügend Resturlaub! Du hast noch ${stats.remaining} Tage.`);
                setIsSubmitting(false);
                return;
            }

            const vacationData = {
                userId: currentUser.uid,
                userName: currentUser.displayName || currentUser.email,
                startDate: newVacation.startDate,
                endDate: newVacation.endDate,
                type: newVacation.type,
                comment: newVacation.comment,
                status: 'approved' 
            };

            await vacationApi.addVacation(vacationData);
            setNewVacation({ startDate: '', endDate: '', type: 'standard', comment: '' });
            loadData(); // Alles neu laden
            
        } catch (error) {
            useToast("Fehler beim Speichern des Urlaubs.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Urlaub wirklich stornieren?")) return;
        try {
            await vacationApi.deleteVacation(id);
            loadData();
        } catch (error) {
            useToast("Konnte nicht gelöscht werden.");
        }
    };

    const getPreviewDays = () => {
        if (!newVacation.startDate || !newVacation.endDate) return 0;
        const raw = calculateWorkDays(newVacation.startDate, newVacation.endDate);
        if (newVacation.type === 'half') return 0.5;
        if (newVacation.type === 'workation') return raw + " (Workation)";
        return raw;
    };

    // --- TIMELINE LOGIC ---
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const changeMonth = (delta) => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() + delta);
        setViewDate(newDate);
    };

    const isWeekend = (year, month, day) => {
        const d = new Date(year, month, day);
        const dayOfWeek = d.getDay();
        return dayOfWeek === 0 || dayOfWeek === 6;
    };

    const getVacationForUserAndDay = (uid, day) => {
        const checkDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        checkDate.setHours(0,0,0,0); // Normalize

        return vacations.find(v => {
            if (v.userId !== uid) return false;
            // Workation in der Timeline anders darstellen? Ggf. später.
            // Hier prüfen wir nur, ob der Tag im Range liegt
            const start = new Date(v.startDate); start.setHours(0,0,0,0);
            const end = new Date(v.endDate); end.setHours(0,0,0,0);
            return checkDate >= start && checkDate <= end;
        });
    };

    const getDepartmentColorClass = (department) => {
        if (!department) return DEPARTMENT_COLORS['default'].classes;
        // Wir suchen nach einem Key, der im Abteilungsnamen enthalten ist oder exakt matcht
        // Z.B. "Marketing Team" -> findet "Marketing"
        const key = Object.keys(DEPARTMENT_COLORS).find(k => department.includes(k));
        return (DEPARTMENT_COLORS[key] || DEPARTMENT_COLORS['default']).classes;
    };

    if (loading) return <div className="p-10 text-center text-gray-400">Lade Urlaubsdaten...</div>;

    const daysInCurrentMonth = getDaysInMonth(viewDate);
    const monthName = viewDate.toLocaleString('de-DE', { month: 'long', year: 'numeric' });

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <Palmtree className="text-orange-500"/> Urlaubsplaner
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">Verwalte deine freien Tage und Workations.</p>
                </div>
                
                {/* Stats Cards */}
                <div className="flex gap-2">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 text-center min-w-[80px]">
                        <div className="text-xs text-gray-400 uppercase font-bold">Genommen</div>
                        <div className="text-xl font-black text-gray-900 dark:text-white">{stats.taken}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 text-center min-w-[80px]">
                        <div className="text-xs text-gray-400 uppercase font-bold">Geplant</div>
                        <div className="text-xl font-black text-blue-600 dark:text-blue-400">{stats.planned}</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-800 text-center min-w-[80px]">
                        <div className="text-xs text-green-600 dark:text-green-400 uppercase font-bold">Übrig</div>
                        <div className="text-xl font-black text-green-700 dark:text-green-300">{stats.remaining}</div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
                
                {/* LINKE SPALTE: ANTRAG STELLEN */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Neuen Antrag stellen</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Von</label>
                                    <input 
                                        type="date" 
                                        required
                                        className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white text-sm"
                                        value={newVacation.startDate}
                                        onChange={e => setNewVacation({...newVacation, startDate: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bis</label>
                                    <input 
                                        type="date" 
                                        required
                                        className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white text-sm"
                                        value={newVacation.endDate}
                                        onChange={e => setNewVacation({...newVacation, endDate: e.target.value})}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Art</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {Object.entries(VACATION_TYPES).map(([key, val]) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => setNewVacation({...newVacation, type: key})}
                                            className={`py-2 px-1 rounded-lg text-[10px] font-bold border transition-all ${
                                                newVacation.type === key 
                                                ? 'bg-blue-600 text-white border-blue-600' 
                                                : 'bg-white dark:bg-gray-700 text-gray-500 border-gray-200 dark:border-gray-600 hover:border-blue-400'
                                            }`}
                                        >
                                            {key === 'standard' ? 'Urlaub' : key === 'half' ? '½ Tag' : 'Workation'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kommentar</label>
                                <input 
                                    type="text" 
                                    placeholder="z.B. Sommerurlaub"
                                    className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white text-sm"
                                    value={newVacation.comment}
                                    onChange={e => setNewVacation({...newVacation, comment: e.target.value})}
                                />
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg flex justify-between items-center text-sm">
                                <span className="text-gray-500">Berechnete Tage:</span>
                                <span className="font-bold text-gray-900 dark:text-white">{getPreviewDays()}</span>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg disabled:opacity-50"
                            >
                                {isSubmitting ? 'Speichert...' : 'Beantragen'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* RECHTE SPALTE: MEINE LISTE */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-full">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Clock size={18}/> Meine Anträge
                        </h3>
                        
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {vacations.filter(v => v.userId === currentUser.uid).length === 0 ? (
                                <p className="text-gray-400 text-sm">Noch keine Anträge gestellt.</p>
                            ) : (
                                vacations
                                    .filter(v => v.userId === currentUser.uid)
                                    .sort((a,b) => new Date(b.startDate) - new Date(a.startDate)) // Neueste zuerst
                                    .map(vac => (
                                    <div key={vac.id} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border border-transparent hover:border-gray-100 dark:hover:border-gray-600 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center font-bold shrink-0 ${
                                                vac.type === 'workation' ? 'bg-purple-100 text-purple-600' : 'bg-blue-50 text-blue-600'
                                            }`}>
                                                <span className="text-[10px] uppercase">{new Date(vac.startDate).toLocaleString('de', {month:'short'})}</span>
                                                <span className="text-sm leading-none">{new Date(vac.startDate).getDate()}</span>
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-gray-900 dark:text-white">
                                                    {vac.type === 'workation' ? 'Workation' : 'Urlaub'}
                                                    <span className="text-gray-400 font-normal ml-2 text-xs">
                                                        ({vac.daysCount} Tage)
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    bis {new Date(vac.endDate).toLocaleDateString()}
                                                    {vac.comment && <span className="opacity-70"> • {vac.comment}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        {new Date(vac.startDate) > new Date() && (
                                            <button onClick={() => handleDelete(vac.id)} className="text-gray-300 hover:text-red-500 p-2"><Trash2 size={16}/></button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- TEAM TIMELINE (NEU) --- */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Timeline Header */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <AlertCircle size={18}/> Team Übersicht
                    </h3>
                    <div className="flex items-center gap-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                        <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><ChevronLeft size={16}/></button>
                        <span className="font-bold text-sm min-w-[100px] text-center">{monthName}</span>
                        <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><ChevronRight size={16}/></button>
                    </div>
                </div>

                {/* Matrix Grid */}
                <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                        {/* Header Row (Days) */}
                        <div className="flex border-b border-gray-100 dark:border-gray-700">
                            <div className="w-48 shrink-0 p-3 text-xs font-bold text-gray-400 uppercase tracking-wider sticky left-0 bg-white dark:bg-gray-800 z-10 border-r border-gray-100 dark:border-gray-700">
                                Mitarbeiter
                            </div>
                            {Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1).map(day => {
                                const isWE = isWeekend(viewDate.getFullYear(), viewDate.getMonth(), day);
                                return (
                                    <div key={day} className={`flex-1 min-w-[30px] p-2 text-center text-xs font-bold border-r border-gray-50 dark:border-gray-700/50 ${isWE ? 'bg-gray-50 dark:bg-gray-900/50 text-gray-300' : 'text-gray-500'}`}>
                                        {day}
                                    </div>
                                );
                            })}
                        </div>

                        {/* User Rows */}
                        <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[500px] overflow-y-auto">
                            {allUsers
                                .sort((a, b) => (a.department || 'z').localeCompare(b.department || 'z')) // Sort by Dept
                                .map(user => (
                                <div key={user.uid} className="flex hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                                    {/* Name Spalte */}
                                    <div className="w-48 shrink-0 p-3 flex items-center gap-3 sticky left-0 bg-white dark:bg-gray-800 z-10 border-r border-gray-100 dark:border-gray-700">
                                        <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                            {user.displayName?.charAt(0) || '?'}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-xs font-bold text-gray-900 dark:text-white truncate">{user.displayName}</div>
                                            <div className="text-[9px] text-gray-400 truncate">{user.department || 'K5 Team'}</div>
                                        </div>
                                    </div>

                                    {/* Tage Spalten */}
                                    {Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1).map(day => {
                                        const vac = getVacationForUserAndDay(user.uid, day);
                                        const isWE = isWeekend(viewDate.getFullYear(), viewDate.getMonth(), day);
                                        
                                        let cellClass = isWE ? 'bg-gray-50 dark:bg-gray-900/30' : '';
                                        let content = null;

                                        if (vac) {
                                            if (vac.type === 'workation') {
                                                cellClass = 'bg-purple-100 dark:bg-purple-900/50 border-l-2 border-purple-500';
                                            } else {
                                                // HIER GREIFT DIE ABTEILUNGS-FARBE
                                                // Wir nutzen Tailwind Klassen aus data.js, aber müssen border entfernen für Zellen-Look
                                                // oder wir nutzen einfach inline styles für Background, wenn die Klassen zu komplex sind.
                                                // Die Klassen in data.js sind z.B. "bg-[oklch(...)] text-white".
                                                const colorClass = getDepartmentColorClass(user.department);
                                                cellClass = `${colorClass} shadow-sm`; 
                                                if (vac.type === 'half') cellClass += ' opacity-50'; // Halbe Tage heller
                                            }
                                        }

                                        return (
                                            <div key={day} className={`flex-1 min-w-[30px] border-r border-gray-50 dark:border-gray-700/50 relative group ${cellClass}`}>
                                                {/* Tooltip on Hover */}
                                                {vac && (
                                                    <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-20 bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                                                        {vac.type === 'workation' ? 'Workation' : 'Urlaub'}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Legende */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 text-xs">
                    <span className="font-bold text-gray-400 uppercase tracking-wider mr-2">Legende:</span>
                    {Object.entries(DEPARTMENT_COLORS).map(([dept, config]) => {
                        if (dept === 'default') return null;
                        return (
                            <div key={dept} className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${config.classes}`}></div>
                                <span className="text-gray-600 dark:text-gray-300">{dept}</span>
                            </div>
                        );
                    })}
                    <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200 dark:border-gray-600">
                        <div className="w-3 h-3 rounded-full bg-purple-100 border-l-2 border-purple-500"></div>
                        <span className="text-gray-600 dark:text-gray-300">Workation</span>
                    </div>
                </div>
            </div>
        </div>
    );
}