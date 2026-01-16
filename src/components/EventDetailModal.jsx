import React from 'react';
import { 
    X, Calendar as CalendarIcon, MapPin, Globe, 
    Users, Check, XCircle, Trash2, Sparkles 
} from 'lucide-react';
import { EVENT_TYPES } from '../config/data';

export default function EventDetailModal({ 
    event, 
    onClose, 
    currentUser, 
    onRSVP, 
    onDelete, 
    isPrivileged 
}) {
    if (!event) return null;

    // Funktion zum Schließen beim Klick auf den Hintergrund
    const handleBackdropClick = (e) => {
        // e.target ist das Element, auf das geklickt wurde
        // e.currentTarget ist das Element, an dem der Handler hängt (unser Backdrop)
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const formatDate = (dateInput) => {
        try {
            const date = new Date(dateInput);
            if (isNaN(date)) return "Datum unklar";
            return date.toLocaleDateString('de-DE', { 
                weekday: 'long', 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric' 
            });
        } catch (e) { return "Datum Fehler"; }
    };

    const typeConfig = EVENT_TYPES[event.type] || { label: 'Event', color: 'bg-gray-600' };
    const participants = event.participants || {};
    const myStatus = participants[currentUser?.uid]?.status;
    
    const goingCount = Object.values(participants).filter(p => p.status === 'going').length;
    const declinedCount = Object.values(participants).filter(p => p.status === 'declined').length;

    return (
        /* HIER: onClick Handler zum Schließen hinzugefügt */
        <div 
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/80 z-[10000] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300 cursor-pointer"
        >
            <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden font-sans border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-300 cursor-default" onClick={e => e.stopPropagation()}>
                
                {/* Visual Header */}
                <div className={`p-10 text-white relative overflow-hidden ${typeConfig.color}`}>
                    <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-white/20 px-3 py-1 rounded-full italic">
                                {typeConfig.label}
                            </span>
                            <h3 className="text-3xl font-black mt-4 italic tracking-tighter uppercase leading-tight">
                                {event.title}
                            </h3>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-2xl transition-all">
                            <X size={24}/>
                        </button>
                    </div>
                </div>
                
                <div className="p-10 space-y-8">
                    {/* Information Cluster */}
                    <div className="grid gap-4">
                        <div className="flex items-center gap-5 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                <CalendarIcon size={20}/>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Wann & Datum</p>
                                <p className="font-bold text-gray-900 dark:text-white">{formatDate(event.start || event.date)}</p>
                            </div>
                        </div>

                        {event.location && (
                            <div className="flex items-center gap-5 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                                    <MapPin size={20}/>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Location</p>
                                    <p className="font-bold text-gray-900 dark:text-white">{event.location}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RSVP Interaction */}
                    <div className="pt-2">
                        <div className="flex items-center gap-2 mb-4 ml-2">
                            <Sparkles size={14} className="text-blue-600" />
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Deine Teilnahme</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => onRSVP(event.id, 'going')} 
                                className={`group flex items-center justify-center gap-3 py-5 rounded-[1.8rem] font-black uppercase italic tracking-widest text-[11px] transition-all active:scale-95 ${
                                    myStatus === 'going' 
                                    ? 'bg-green-600 text-white shadow-xl shadow-green-500/30' 
                                    : 'bg-gray-50 dark:bg-gray-800 text-gray-400 hover:bg-gray-100'
                                }`}
                            >
                                <Check size={18} className={myStatus === 'going' ? 'animate-bounce' : ''}/> Bin dabei
                            </button>
                            <button 
                                onClick={() => onRSVP(event.id, 'declined')} 
                                className={`group flex items-center justify-center gap-3 py-5 rounded-[1.8rem] font-black uppercase italic tracking-widest text-[11px] transition-all active:scale-95 ${
                                    myStatus === 'declined' 
                                    ? 'bg-red-600 text-white shadow-xl shadow-red-500/30' 
                                    : 'bg-gray-50 dark:bg-gray-800 text-gray-400 hover:bg-gray-100'
                                }`}
                            >
                                <XCircle size={18}/> Absagen
                            </button>
                        </div>
                    </div>

                    {/* Participants List */}
                    <div className="space-y-4 pt-8 border-t dark:border-gray-800">
                        <div className="flex justify-between items-center px-2">
                            <span className="text-[9px] font-black text-green-500 uppercase tracking-widest flex items-center gap-2">
                                <Users size={12}/> Confirmed ({goingCount})
                            </span>
                            <span className="text-[9px] font-black text-red-400 uppercase tracking-widest">
                                Declined ({declinedCount})
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar p-1">
                            {Object.values(participants).filter(p => p.status === 'going').map((p, i) => (
                                <div key={i} className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase italic tracking-tighter border border-green-100 dark:border-green-800/30">
                                    {p.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Admin Actions */}
                    {isPrivileged && (
                        <div className="pt-6 border-t border-dashed dark:border-gray-800">
                            <button 
                                onClick={() => onDelete(event.id)} 
                                className="w-full py-4 text-[10px] font-black text-red-400/50 hover:text-red-600 flex items-center justify-center gap-2 uppercase tracking-[0.2em] italic transition-all group"
                            >
                                <Trash2 size={14} className="group-hover:scale-110 transition-transform"/> Termin unwiderruflich löschen
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}