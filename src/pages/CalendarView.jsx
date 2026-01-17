import React, { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { eventApi } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';

import { doc, updateDoc } from "firebase/firestore";
import { db } from '../config/firebase.js';

// Komponenten
import CalendarDay from '../components/Calendar/CalendarDay.jsx';
import CreateEventModal from '../components/Calendar/CreateEventModal.jsx';
import EventDetailModal from '../components/Calendar/EventDetailModal.jsx';

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

    const handleUpdateEvent = async (eventId, newData) => {
        try {
            const eventRef = doc(db, 'events', eventId);
            await updateDoc(eventRef, newData);
            setEvents(prev => prev.map(evt => evt.id === eventId ? { ...evt, ...newData } : evt));
            setSelectedEvent(null);
            addToast("Event erfolgreich aktualisiert! 🚀");
        } catch (error) {
            console.error("Fehler beim Update:", error);
            addToast("Fehler beim Speichern der Änderungen", "error");
        }
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

    const handleDeleteEvent = async (eventId) => {
        try {
            await eventApi.deleteEvent(eventId);
            setEvents(prev => prev.filter(evt => evt.id !== eventId));
            setSelectedEvent(null);
            addToast("Event erfolgreich gelöscht.");
        } catch (error) {
            console.error("Lösch-Fehler:", error);
            addToast("Fehler beim Löschen des Events", "error");
        }
    }

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
        if (!eventId || !currentUser) {
            addToast("Fehler: Nutzer nicht erkannt", "error");
            return;
        }

        try {
            await eventApi.updateRSVP(eventId, currentUser.uid, status, currentUser.displayName);
            setSelectedEvent(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    participants: {
                        ...(prev.participants || {}),
                        [currentUser.uid]: { status: status, name: currentUser.displayName }
                    }
                };
            });
            await loadEvents();
            addToast(status === 'going' ? "Zusage gespeichert! 🎉" : "Absage gespeichert.");
        } catch (error) {
            console.error("RSVP Error:", error);
            addToast("Fehler beim Speichern.", "error");
        }
    };

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-20 px-4 font-sans">
            {/* Header: Italic entfernt, Aeonik Bold (font-bold) und CI Blue genutzt */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-gray-100 dark:border-k5-deep pb-8 gap-6">
                <div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-k5-black dark:text-white flex items-center gap-4 tracking-tight uppercase">
                        <CalendarIcon className="text-k5-digital" size={40}/> K5 <span className="text-k5-digital">Events</span>
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-bold uppercase text-xs tracking-widest leading-copy">Termine, Deadlines & Event-Phasen</p>
                </div>
                {isPrivileged && (
                    <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="bg-glow-digital text-white px-8 py-3.5 rounded-k5-md font-bold uppercase tracking-widest text-xs transition-all shadow-xl shadow-k5-digital/20 flex items-center gap-2 active:scale-95"
                    >
                        <Plus size={18}/> Termin eintragen
                    </button>
                )}
            </div>

            {/* Kalender Container mit k5-lg Rundung */}
            <div className="bg-white dark:bg-k5-black rounded-k5-lg shadow-sm border border-gray-100 dark:border-k5-deep overflow-hidden">
                <div className="flex justify-between items-center p-8 bg-k5-light-grey/30 dark:bg-k5-deep/30 border-b border-gray-100 dark:border-k5-deep">
                    <button onClick={() => changeMonth(-1)} className="p-3 bg-white dark:bg-k5-black hover:bg-k5-light-grey dark:hover:bg-k5-deep rounded-k5-md transition-all shadow-sm active:scale-90 border border-gray-100 dark:border-k5-deep">
                        <ChevronLeft className="text-k5-black dark:text-white" />
                    </button>
                    <h3 className="text-xl font-bold uppercase tracking-[0.2em] text-k5-black dark:text-white">{monthName}</h3>
                    <button onClick={() => changeMonth(1)} className="p-3 bg-white dark:bg-k5-black hover:bg-k5-light-grey dark:hover:bg-k5-deep rounded-k5-md transition-all shadow-sm active:scale-90 border border-gray-100 dark:border-k5-deep">
                        <ChevronRight className="text-k5-black dark:text-white" />
                    </button>
                </div>

                <div className="grid grid-cols-7 bg-white dark:bg-k5-black border-b border-gray-100 dark:border-k5-deep">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <div key={day} className="py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center border-r border-gray-50 dark:border-k5-deep/30 last:border-none">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 auto-rows-[minmax(140px,auto)] bg-gray-50 dark:bg-k5-black">
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
                onUpdate={handleUpdateEvent}
                onDelete={handleDeleteEvent}
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