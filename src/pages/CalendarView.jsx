import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Trash2, ChevronLeft, ChevronRight, X, CheckSquare } from 'lucide-react';
import { eventApi } from '../services/api';
import { EVENT_TYPES } from '../config/data'; // <--- Hier kommen deine Typen her
import HelpBeacon from '../components/Tuturials/HelpBeacon';

export default function CalendarView({ currentUser }) {
    const [events, setEvents] = useState([]);
    const [viewDate, setViewDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // FORM STATE
    const [title, setTitle] = useState('');
    const [type, setType] = useState('external'); // Standard: Extern
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState('09:00');
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [endTime, setEndTime] = useState('10:00');
    const [isAllDay, setIsAllDay] = useState(false);

    const [loading, setLoading] = useState(false);
    const isPrivileged = currentUser?.role === 'admin' || currentUser?.role === 'editor';

    useEffect(() => { loadEvents(); }, []);

    // Auto-Ganztägig bei Datumsänderung
    useEffect(() => {
        if (startDate !== endDate) setIsAllDay(true);
    }, [startDate, endDate]);

    const loadEvents = async () => {
        const data = await eventApi.getAllEvents();
        setEvents(data);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        let finalStart = startDate;
        let finalEnd = endDate;

        if (!isAllDay) {
            finalStart = `${startDate}T${startTime}`;
            finalEnd = `${endDate}T${endTime}`;
        }

        const newEvent = {
            title,
            type, // Hier speichern wir jetzt 'k5_conf', 'meetup' etc.
            location,
            startDate: finalStart, 
            start: finalStart,
            end: finalEnd,
            allDay: isAllDay,
            createdBy: currentUser?.email || 'System'
        };

        await eventApi.addEvent(newEvent);
        setIsModalOpen(false);
        resetForm();
        loadEvents();
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Termin wirklich löschen?')) {
            await eventApi.deleteEvent(id);
            loadEvents();
        }
    };

    const resetForm = () => {
        setTitle('');
        setLocation('');
        setType('external');
        setStartDate(new Date().toISOString().split('T')[0]);
        setEndDate(new Date().toISOString().split('T')[0]);
        setStartTime('09:00');
        setEndTime('10:00');
        setIsAllDay(false);
    };

    // --- KALENDER LOGIK ---
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay(); 
        const offset = firstDay === 0 ? 6 : firstDay - 1; 

        const result = [];
        for (let i = 0; i < offset; i++) result.push(null);
        for (let i = 1; i <= days; i++) result.push(new Date(year, month, i));
        return result;
    };

    const days = getDaysInMonth(viewDate);
    const monthName = viewDate.toLocaleString('de-DE', { month: 'long', year: 'numeric' });

    const getEventsForDay = (date) => {
        if (!date) return [];
        const dateStr = date.toISOString().split('T')[0];
        
        return events.filter(evt => {
            const rawStart = evt.start || evt.startDate || '';
            const rawEnd = evt.end || rawStart;
            return dateStr >= rawStart.split('T')[0] && dateStr <= rawEnd.split('T')[0];
        });
    };

    const changeMonth = (delta) => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() + delta);
        setViewDate(newDate);
    };

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <CalendarIcon className="text-blue-600"/> Event Kalender
                        <HelpBeacon context="calendar" />
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">Interne & Externe Termine im Überblick.</p>
                </div>
                {isPrivileged && (
                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/30">
                        <Plus size={20}/> Termin eintragen
                    </button>
                )}
            </div>

            {/* Kalender Grid */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><ChevronLeft/></button>
                    <h3 className="text-xl font-bold uppercase tracking-widest text-gray-700 dark:text-gray-200">{monthName}</h3>
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><ChevronRight/></button>
                </div>

                <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                    {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
                        <div key={day} className="py-3 text-center text-xs font-bold text-gray-400 uppercase">{day}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 auto-rows-fr">
                    {days.map((date, idx) => {
                        if (!date) return <div key={idx} className="bg-gray-50/30 dark:bg-gray-800/50 min-h-[120px] border-b border-r border-gray-100 dark:border-gray-700/50"/>;
                        
                        const dayEvents = getEventsForDay(date);
                        const isToday = new Date().toDateString() === date.toDateString();
                        const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                        return (
                            <div key={idx} className={`min-h-[120px] p-2 border-b border-r border-gray-100 dark:border-gray-700 transition-colors ${isWeekend ? 'bg-gray-50/50 dark:bg-gray-800/30' : 'bg-white dark:bg-gray-800'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400'}`}>
                                        {date.getDate()}
                                    </span>
                                </div>
                                
                                <div className="space-y-1">
                                    {dayEvents.map(evt => {
                                        // HIER: Wir nutzen direkt deine Konfiguration!
                                        // Falls der Typ nicht existiert (altes Event), nehmen wir 'external' als Fallback
                                        const typeConfig = EVENT_TYPES[evt.type] || EVENT_TYPES['external'];
                                        
                                        const rawStart = evt.start || evt.startDate || '';
                                        const timeStr = (!evt.allDay && rawStart.includes('T')) 
                                            ? rawStart.split('T')[1].substring(0,5) 
                                            : '';

                                        return (
                                            <div key={evt.id} 
                                                // Wir nutzen .color (z.B. 'bg-blue-600 text-white') und .border direkt aus deiner Config
                                                className={`text-[10px] px-2 py-1 rounded border-l-4 truncate cursor-pointer hover:opacity-80 transition-opacity group relative shadow-sm ${typeConfig.color} ${typeConfig.border}`}
                                            >
                                                <span className="font-bold mr-1 opacity-90 border-r border-white/30 pr-1 mr-1 inline-block">
                                                    {evt.allDay ? 'Ganztägig' : timeStr} 
                                                </span>
                                                {evt.title}
                                                
                                                {isPrivileged && (
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(evt.id); }}
                                                        className="absolute right-1 top-1/2 -translate-y-1/2 hidden group-hover:block bg-white text-red-500 rounded-full p-0.5 shadow-sm"
                                                    >
                                                        <Trash2 size={10}/>
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Neuer Termin</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400 hover:text-gray-600"/></button>
                        </div>
                        
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Titel</label><input required type="text" className="w-full border dark:border-gray-600 p-2 rounded-lg dark:bg-gray-700 dark:text-white" value={title} onChange={e => setTitle(e.target.value)} placeholder="z.B. K5 Konferenz"/></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Typ</label>
                                    <select className="w-full border dark:border-gray-600 p-2 rounded-lg dark:bg-gray-700 dark:text-white" value={type} onChange={e => setType(e.target.value)}>
                                        {/* HIER: Wir generieren die Optionen aus deinem EVENT_TYPES Objekt */}
                                        {Object.entries(EVENT_TYPES).map(([key, val]) => (
                                            <option key={key} value={key}>{val.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ort</label><input type="text" className="w-full border dark:border-gray-600 p-2 rounded-lg dark:bg-gray-700 dark:text-white" value={location} onChange={e => setLocation(e.target.value)} placeholder="Optional"/></div>
                            </div>
                            <hr className="border-gray-100 dark:border-gray-700 my-2"/>
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsAllDay(!isAllDay)}>
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isAllDay ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 bg-white'}`}>{isAllDay && <CheckSquare size={14}/>}</div>
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 select-none">Ganztägiges Event</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Start Datum</label><input required type="date" className="w-full border dark:border-gray-600 p-2 rounded-lg dark:bg-gray-700 dark:text-white" value={startDate} onChange={e => setStartDate(e.target.value)}/></div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ende Datum</label><input required type="date" className="w-full border dark:border-gray-600 p-2 rounded-lg dark:bg-gray-700 dark:text-white" value={endDate} onChange={e => setEndDate(e.target.value)}/></div>
                                {!isAllDay && (
                                    <>
                                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Start Zeit</label><input required type="time" className="w-full border dark:border-gray-600 p-2 rounded-lg dark:bg-gray-700 dark:text-white" value={startTime} onChange={e => setStartTime(e.target.value)}/></div>
                                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ende Zeit</label><input required type="time" className="w-full border dark:border-gray-600 p-2 rounded-lg dark:bg-gray-700 dark:text-white" value={endTime} onChange={e => setEndTime(e.target.value)}/></div>
                                    </>
                                )}
                            </div>
                            <div className="pt-4"><button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex justify-center items-center gap-2">{loading ? 'Speichere...' : <><Plus size={18}/> Termin erstellen</>}</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}