import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Plus, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { eventApi } from '../services/api';
import { EVENT_TYPES } from '../config/data';

export default function CalendarView({ currentUser }) {
    const [events, setEvents] = useState([]);
    const [viewDate, setViewDate] = useState(new Date());
    const [modalOpen, setModalOpen] = useState(false);
    
    // Form State
    const [title, setTitle] = useState('');
    const [type, setType] = useState('external');
    const [location, setLocation] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [startTime, setStartTime] = useState('09:00'); // Zeit optional

    useEffect(() => { loadEvents(); }, []);

    const loadEvents = async () => {
        const data = await eventApi.getAllEvents();
        setEvents(data);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!title || !start) return;

        await eventApi.addEvent({
            title,
            type,
            location,
            startDate: start, // YYYY-MM-DD
            endDate: end || start, // Wenn kein Ende, dann 1 Tag
            startTime,
            creatorId: currentUser.uid,
            creatorName: currentUser.displayName
        });
        
        setModalOpen(false);
        setTitle(''); setLocation(''); setStart(''); setEnd('');
        loadEvents();
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Damit sich nicht das Modal öffnet
        if(confirm("Event wirklich löschen?")) {
            await eventApi.deleteEvent(id);
            loadEvents();
        }
    };

    // --- KALENDER LOGIK ---
    const getDaysInMonth = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        const days = [];
        
        // Leere Zellen davor (wenn Monat nicht am Montag startet)
        // getDay(): 0=So, 1=Mo. Wir wollen Mo=0, So=6
        let startDay = firstDay.getDay() - 1; 
        if (startDay === -1) startDay = 6; 

        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }

        // Tage des Monats
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const date = new Date(year, month, i);
            const dateStr = date.toISOString().split('T')[0];
            days.push({ date, dateStr, day: i });
        }
        return days;
    };

    const changeMonth = (delta) => {
        const d = new Date(viewDate);
        d.setMonth(d.getMonth() + delta);
        setViewDate(d);
    };

    const isToday = (d) => {
        if(!d) return false;
        const today = new Date();
        return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    };

    const getEventsForDay = (dateStr) => {
        return events.filter(ev => dateStr >= ev.startDate && dateStr <= ev.endDate);
    };

    const days = getDaysInMonth();
    const monthName = viewDate.toLocaleString('de-DE', { month: 'long', year: 'numeric' });

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <CalendarIcon className="text-blue-600"/> Event Kalender
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">Interne & Externe Termine im Überblick.</p>
                </div>
                <button onClick={() => setModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-blue-500/30 transition-all">
                    <Plus size={20}/> Event eintragen
                </button>
            </div>

            {/* Kalender Grid */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Controls */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><ChevronLeft/></button>
                    <h3 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-wider">{monthName}</h3>
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><ChevronRight/></button>
                </div>

                {/* Weekdays */}
                <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(d => (
                        <div key={d} className="p-3 text-center text-xs font-bold text-gray-400 uppercase">{d}</div>
                    ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 auto-rows-[minmax(120px,auto)] divide-x divide-gray-100 dark:divide-gray-700 bg-gray-100 dark:bg-gray-700 gap-px border-b border-gray-200 dark:border-gray-700">
                    {days.map((dayObj, idx) => {
                        if (!dayObj) return <div key={idx} className="bg-white/50 dark:bg-gray-800/50"></div>; // Leere Zelle

                        const dayEvents = getEventsForDay(dayObj.dateStr);
                        
                        return (
                            <div key={idx} className={`bg-white dark:bg-gray-800 p-2 relative group min-h-[120px] transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${isToday(dayObj.date) ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                                <div className={`text-sm font-bold mb-2 flex justify-between items-center ${isToday(dayObj.date) ? 'text-blue-600' : 'text-gray-400'}`}>
                                    <span className={isToday(dayObj.date) ? "bg-blue-100 dark:bg-blue-900 px-2 rounded-full" : ""}>{dayObj.day}</span>
                                    {isToday(dayObj.date) && <span className="text-[10px] uppercase">Heute</span>}
                                </div>
                                
                                <div className="space-y-1.5">
                                    {dayEvents.map(ev => {
                                        const style = EVENT_TYPES[ev.type] || EVENT_TYPES['external'];
                                        return (
                                            <div key={ev.id} className={`${style.color} text-[10px] p-1.5 rounded shadow-sm border-l-2 ${style.border} cursor-default relative group/item`}>
                                                <div className="font-bold truncate">{ev.title}</div>
                                                {ev.startTime && <div className="flex items-center gap-1 opacity-90"><Clock size={8}/> {ev.startTime}</div>}
                                                
                                                {/* Tooltip on Hover */}
                                                <div className="absolute z-50 left-0 bottom-full mb-1 w-48 bg-gray-900 text-white text-xs p-2 rounded shadow-xl hidden group-hover/item:block pointer-events-none">
                                                    <div className="font-bold mb-1">{ev.title}</div>
                                                    <div className="text-gray-300">{ev.location}</div>
                                                    <div className="text-gray-400 mt-1">von {ev.creatorName}</div>
                                                </div>

                                                {/* Delete Button (Own Events only) */}
                                                {(ev.creatorId === currentUser.uid || currentUser.role === 'admin') && (
                                                    <button onClick={(e) => handleDelete(e, ev.id)} className="absolute top-1 right-1 opacity-0 group-hover/item:opacity-100 bg-black/20 hover:bg-black/40 rounded p-0.5 transition-all text-white">
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

            {/* ADD EVENT MODAL */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Neues Event</h3>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X/></button>
                        </div>
                        <form onSubmit={handleAdd} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Titel</label>
                                <input autoFocus type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="z.B. OMR Festival" required/>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Typ</label>
                                    <select value={type} onChange={e => setType(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                                        {Object.entries(EVENT_TYPES).map(([key, val]) => (
                                            <option key={key} value={key}>{val.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Uhrzeit</label>
                                    <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white outline-none focus:ring-2 focus:ring-blue-500"/>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ort</label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-3 top-3.5 text-gray-400"/>
                                    <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full pl-10 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="München / Office"/>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Startdatum</label>
                                    <input type="date" value={start} onChange={e => setStart(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white outline-none focus:ring-2 focus:ring-blue-500" required/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Enddatum (Optional)</label>
                                    <input type="date" value={end} onChange={e => setEnd(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white outline-none focus:ring-2 focus:ring-blue-500" min={start}/>
                                </div>
                            </div>

                            <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                                Speichern
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}