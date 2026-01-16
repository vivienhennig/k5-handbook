import React, { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { eventApi } from '../services/api';
import { useToast } from '../context/ToastContext';

// Komponenten
import CalendarDay from '../components/Calendar/CalendarDay';
import CreateEventModal from '../components/Calendar/CreateEventModal';
import EventDetailModal from '../components/EventDetailModal';

export default function CalendarView({ currentUser }) {
    const { addToast } = useToast();
    const [events, setEvents] = useState([]);
    const [viewDate, setViewDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(false);

    const isPrivileged = currentUser?.role === 'admin' || currentUser?.role === 'editor';

    useEffect(() => { loadEvents(); }, []);

    const loadEvents = async () => {
        const data = await eventApi.getAllEvents();
        setEvents(data);
    };

    const handleSave = async (formData) => {
        setLoading(true);
        const newEvent = {
            ...formData,
            start: formData.startDate,
            end: formData.endDate,
            allDay: true,
            participants: {},
            createdBy: currentUser?.displayName || 'System'
        };

        try {
            await eventApi.addEvent(newEvent);
            addToast("Termin wurde erfolgreich erstellt! 🎉");
            setIsModalOpen(false);
            await loadEvents();
        } catch (error) {
            addToast("Fehler beim Speichern", "error");
        } finally {
            setLoading(false);
        }
    };

    const { days, monthName } = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const numDays = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const offset = firstDay === 0 ? 6 : firstDay - 1;

        const calendarDays = [];
        for (let i = 0; i < offset; i++) calendarDays.push(null);
        for (let i = 1; i <= numDays; i++) calendarDays.push(new Date(year, month, i));

        return {
            days: calendarDays,
            monthName: viewDate.toLocaleString('de-DE', { month: 'long', year: 'numeric' })
        };
    }, [viewDate]);

    const getEventsForDay = (date) => {
        if (!date) return [];
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const localDateStr = `${year}-${month}-${day}`;

        return events.filter(evt => {
            const eventStart = (evt.start || evt.startDate || '').split('T')[0];
            const eventEnd = (evt.end || eventStart).split('T')[0];
            return localDateStr >= eventStart && localDateStr <= eventEnd;
        });
    };

    const changeMonth = (offset) => {
        const d = new Date(viewDate);
        d.setMonth(d.getMonth() + offset);
        setViewDate(d);
    };

    const handleRSVP = async (eventId, status) => {
    // Check auf currentUser (da das Prop in dieser Datei so heißt)
    if (!eventId || !currentUser) {
        addToast("Fehler: Nutzer nicht erkannt", "error");
        return;
    }

    try {
        // 1. API Call mit currentUser
        await eventApi.updateRSVP(eventId, currentUser.uid, status, currentUser.displayName);
        
        // 2. State-Update für das Modal (damit der Button sofort grün wird)
        setSelectedEvent(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                participants: {
                    ...(prev.participants || {}),
                    [currentUser.uid]: { 
                        status: status, 
                        name: currentUser.displayName 
                    }
                }
            };
        });

        // 3. Kalenderliste im Hintergrund aktualisieren
        await loadEvents();
        
        addToast(status === 'going' ? "Zusage gespeichert! 🎉" : "Absage gespeichert.");
    } catch (error) {
        console.error("RSVP Error:", error);
        addToast("Fehler beim Speichern.", "error");
    }
};

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-20 px-4 font-sans">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-gray-100 dark:border-gray-800 pb-8 gap-6">
                <div>
                    <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white flex items-center gap-4 italic tracking-tight uppercase">
                        <CalendarIcon className="text-blue-600" size={40}/> K5 <span className="text-blue-600">Events</span>
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-bold uppercase text-xs tracking-widest italic">Termine, Deadlines & Event-Phasen</p>
                </div>
                {isPrivileged && (
                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-black uppercase italic tracking-widest text-xs transition-all shadow-xl shadow-blue-500/20 flex items-center gap-2 active:scale-95">
                        <Plus size={18}/> Termin eintragen
                    </button>
                )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="flex justify-between items-center p-8 bg-gray-50/50 dark:bg-gray-900/30 border-b border-gray-100 dark:border-gray-700">
                    <button onClick={() => changeMonth(-1)} className="p-3 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-all shadow-sm active:scale-90"><ChevronLeft/></button>
                    <h3 className="text-xl font-black uppercase italic tracking-[0.2em] text-gray-900 dark:text-white">{monthName}</h3>
                    <button onClick={() => changeMonth(1)} className="p-3 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-all shadow-sm active:scale-90"><ChevronRight/></button>
                </div>

                <div className="grid grid-cols-7 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <div key={day} className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest italic text-center border-r border-gray-50 dark:border-gray-700/50 last:border-none">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 auto-rows-[minmax(140px,auto)]">
                    {days.map((date, idx) => (
                        <CalendarDay 
                            key={idx} 
                            date={date} 
                            events={getEventsForDay(date)} 
                            isToday={new Date().toDateString() === date?.toDateString()}
                            onClickEvent={setSelectedEvent}
                        />
                    ))}
                </div>
            </div>

            <EventDetailModal 
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
                currentUser={currentUser}
                onRSVP={handleRSVP}
                isPrivileged={isPrivileged}
            />

            <CreateEventModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSave} 
                loading={loading} 
            />
        </div>
    );
}