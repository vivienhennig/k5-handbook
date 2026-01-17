import React, { useState, useEffect } from 'react';
import { Palmtree } from 'lucide-react';
import { STANDARD_VACATION_DAYS, DEPARTMENT_COLORS } from '../config/data.js';
import { vacationApi, userApi, calculateWorkDays } from '../services/api.js'; 
import { useToast } from '../context/ToastContext.jsx';

// Neue Sub-Komponenten
import VacationStats from '../components/Vacation/VacationStats.jsx';
import VacationForm from '../components/Vacation/VacationForm.jsx';
import TeamTimeline from '../components/Vacation/TeamTimeline.jsx';
import MyVacationList from '../components/Vacation/MyVacationList.jsx';

export default function VacationView({ currentUser }) {
    const { addToast } = useToast();
    const [vacations, setVacations] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [viewDate, setViewDate] = useState(new Date());

    const [newVacation, setNewVacation] = useState({
        startDate: '', endDate: '', type: 'standard', comment: ''
    });

    const [stats, setStats] = useState({ taken: 0, planned: 0, remaining: STANDARD_VACATION_DAYS });

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
        } catch (error) { console.error("Load Error:", error); }
        finally { setLoading(false); }
    };

    const calculateStats = (vacationList) => {
        if (!currentUser) return;
        const myVacations = vacationList.filter(v => v.userId === currentUser.uid);
        const today = new Date();
        
        const taken = myVacations
            .filter(v => new Date(v.endDate) < today)
            .reduce((sum, v) => sum + (v.daysCount || 0), 0);

        const planned = myVacations
            .filter(v => new Date(v.endDate) >= today)
            .reduce((sum, v) => sum + (v.daysCount || 0), 0);

        const entitlement = (currentUser.vacationEntitlement || STANDARD_VACATION_DAYS) + (currentUser.carryOverDays || 0);
        setStats({ taken, planned, remaining: entitlement - taken - planned });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newVacation.startDate || !newVacation.endDate) return addToast("Bitte Datum wählen", "error");
        
        setIsSubmitting(true);
        try {
            const daysNeeded = calculateWorkDays(newVacation.startDate, newVacation.endDate);
            let finalDays = newVacation.type === 'half' ? 0.5 : (newVacation.type === 'workation' ? 0 : daysNeeded);

            if (newVacation.type !== 'workation' && finalDays > stats.remaining) {
                addToast(`Nicht genug Resturlaub (${stats.remaining} übrig)`, "error");
                return;
            }

            await vacationApi.addVacation({
                userId: currentUser.uid,
                userName: currentUser.displayName || currentUser.email,
                startDate: newVacation.startDate,
                endDate: newVacation.endDate,
                type: newVacation.type,
                comment: newVacation.comment,
                daysCount: finalDays,
                status: 'approved'
            });

            setNewVacation({ startDate: '', endDate: '', type: 'standard', comment: '' });
            addToast("Urlaub erfolgreich eingetragen! 🌴");
            loadData();
        } catch (e) { addToast("Fehler beim Speichern", "error"); }
        finally { setIsSubmitting(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Urlaub wirklich stornieren?")) return;
        try {
            await vacationApi.deleteVacation(id);
            addToast("Storniert.");
            loadData();
        } catch (e) { addToast("Fehler beim Löschen", "error"); }
    };

    // Hilfsfunktionen für Timeline
    const getDepartmentColorClass = (dept) => {
        const key = Object.keys(DEPARTMENT_COLORS).find(k => dept?.includes(k)) || 'default';
        return DEPARTMENT_COLORS[key].classes;
    };

    if (loading) return <div className="p-20 text-center text-gray-400 font-black animate-pulse uppercase tracking-widest">Lade Urlaubsplaner...</div>;

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-20 px-4 font-sans">
            {/* Header mit Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 border-b border-gray-100 dark:border-gray-800 pb-8">
                <div>
                    <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white flex items-center gap-4 italic tracking-tight">
                        <Palmtree className="text-orange-500" size={40}/> Urlaubsplaner
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Verwalte deine freien Tage und Workations im Team.</p>
                </div>
                <VacationStats stats={stats} />
            </div>

            <div className="grid lg:grid-cols-3 gap-10 mb-16">
                {/* Formular zum Beantragen */}
                <VacationForm 
                    newVacation={newVacation} 
                    setNewVacation={setNewVacation} 
                    onSubmit={handleSubmit} 
                    isSubmitting={isSubmitting}
                    previewDays={newVacation.startDate && newVacation.endDate ? calculateWorkDays(newVacation.startDate, newVacation.endDate) : 0}
                />

                {/* Liste der eigenen Anträge */}
                <div className="lg:col-span-2">
                    <MyVacationList 
                        vacations={vacations.filter(v => v.userId === currentUser.uid)} 
                        onDelete={handleDelete}
                    />
                </div>
            </div>

            {/* Team Timeline Matrix */}
            <TeamTimeline 
                viewDate={viewDate}
                changeMonth={(delta) => {
                    const d = new Date(viewDate);
                    d.setMonth(d.getMonth() + delta);
                    setViewDate(d);
                }}
                daysInMonth={new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate()}
                monthName={viewDate.toLocaleString('de-DE', { month: 'long', year: 'numeric' })}
                allUsers={allUsers}
                isWeekend={(y, m, d) => {
                    const day = new Date(y, m, d).getDay();
                    return day === 0 || day === 6;
                }}
                getVacationForUserAndDay={(uid, day) => {
                    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                    d.setHours(0,0,0,0);
                    return vacations.find(v => {
                        if (v.userId !== uid) return false;
                        const s = new Date(v.startDate); s.setHours(0,0,0,0);
                        const e = new Date(v.endDate); e.setHours(0,0,0,0);
                        return d >= s && d <= e;
                    });
                }}
                getDepartmentColorClass={getDepartmentColorClass}
            />
        </div>
    );
}