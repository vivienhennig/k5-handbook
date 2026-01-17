import React, { useState, useEffect } from 'react';
import { 
    X, Calendar as CalendarIcon, MapPin, 
    Users, Check, XCircle, Trash2, Sparkles, 
    Edit2, Save, Globe 
} from 'lucide-react';
import { EVENT_TYPES } from '../../config/data.js';

export default function EventDetailModal({ 
    event, 
    onClose, 
    currentUser, 
    onRSVP, 
    onDelete, 
    onUpdate, 
    isPrivileged 
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: '',
        location: '',
        url: '',
        date: '',
        type: 'event'
    });

    useEffect(() => {
        if (event) {
            const initialDate = event.date || event.start || "";
            const websiteUrl = event.website || event.url || '';
            
            setEditData({
                title: event.title || '',
                location: event.location || '',
                url: websiteUrl,
                date: typeof initialDate === 'string' ? initialDate.split('T')[0] : initialDate,
                type: event.type || 'event'
            });
        }
    }, [event, isEditing]);

    if (!event) return null;

    const handleSave = () => {
        const finalData = {
            ...event,
            title: editData.title,
            location: editData.location,
            website: editData.url,
            url: editData.url,
            start: editData.date,
            date: editData.date,
            type: editData.type
        };
        onUpdate(event.id, finalData);
        setIsEditing(false);
    };

    const displayUrl = event.website || event.url;
    const typeConfig = EVENT_TYPES[isEditing ? editData.type : event.type] || { label: 'Event', color: 'bg-gray-600' };
    
    // Logik für Teilnehmerliste wiederhergestellt
    const participants = event.participants || {};
    const myStatus = participants[currentUser?.uid]?.status;
    
    const goingParticipants = Object.values(participants).filter(p => p.status === 'going');
    const declinedCount = Object.values(participants).filter(p => p.status === 'declined').length;

    return (
        <div 
            onClick={(e) => e.target === e.currentTarget && onClose()}
            className="fixed inset-0 bg-k5-black/80 z-[10000] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300"
        >
            <div className="bg-white dark:bg-k5-black w-full max-w-lg rounded-k5-lg shadow-2xl overflow-hidden border border-gray-100 dark:border-k5-deep animate-in zoom-in-95 duration-300">
                
                {/* Header Bereich */}
                <div className={`p-10 text-white relative overflow-hidden ${typeConfig.color}`}>
                    <div className="relative z-10 flex justify-between items-start">
                        <div className="flex-1 mr-4">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] bg-white/20 px-3 py-1 rounded-full">
                                {typeConfig.label}
                            </span>
                            {isEditing ? (
                                <input 
                                    className="w-full bg-white/20 border-none rounded-xl px-3 py-2 text-2xl font-bold mt-4 tracking-tighter uppercase outline-none text-white placeholder:text-white/50"
                                    value={editData.title}
                                    onChange={e => setEditData({...editData, title: e.target.value})}
                                />
                            ) : (
                                <h3 className="text-3xl font-bold mt-4 tracking-tighter uppercase leading-tight">
                                    {event.title}
                                </h3>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {isPrivileged && (
                                <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className="p-2 bg-white/20 hover:bg-white/30 rounded-2xl transition-all">
                                    {isEditing ? <Save size={20}/> : <Edit2 size={20}/>}
                                </button>
                            )}
                            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-2xl transition-all">
                                <X size={24}/>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="p-10 space-y-6">
                    <div className="grid gap-4">
                        {/* Wann */}
                        <div className="flex items-center gap-5 p-4 bg-k5-light-grey dark:bg-k5-deep/20 rounded-k5-md border border-gray-100 dark:border-k5-deep">
                            <div className="w-12 h-12 bg-glow-digital rounded-xl flex items-center justify-center text-white">
                                <CalendarIcon size={20}/>
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Wann</p>
                                {isEditing ? (
                                    <input type="date" className="w-full bg-transparent border-none font-bold text-k5-black dark:text-white outline-none" value={editData.date} onChange={e => setEditData({...editData, date: e.target.value})}/>
                                ) : (
                                    <p className="font-bold text-k5-black dark:text-white">{new Date(event.start || event.date).toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' })}</p>
                                )}
                            </div>
                        </div>

                        {/* Location */}
                        {(event.location || isEditing) && (
                            <div className="flex items-center gap-5 p-4 bg-k5-light-grey dark:bg-k5-deep/20 rounded-k5-md border border-gray-100 dark:border-k5-deep">
                                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white">
                                    <MapPin size={20}/>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</p>
                                    {isEditing ? (
                                        <input className="w-full bg-transparent border-none font-bold text-k5-black dark:text-white outline-none" value={editData.location} onChange={e => setEditData({...editData, location: e.target.value})}/>
                                    ) : (
                                        <p className="font-bold text-k5-black dark:text-white">{event.location}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Webseite */}
                        {(displayUrl || isEditing) && (
                            <div className="flex items-center gap-5 p-4 bg-k5-light-grey dark:bg-k5-deep/20 rounded-k5-md border border-gray-100 dark:border-k5-deep">
                                <div className="w-12 h-12 bg-k5-heritage rounded-xl flex items-center justify-center text-white">
                                    <Globe size={20}/>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Webseite</p>
                                    {isEditing ? (
                                        <input className="w-full bg-transparent border-none font-bold text-k5-black dark:text-white outline-none" value={editData.url} onChange={e => setEditData({...editData, url: e.target.value})} placeholder="https://..."/>
                                    ) : (
                                        <a href={displayUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-k5-digital hover:underline truncate block">
                                            {displayUrl.replace(/^https?:\/\/(www\.)?/, '')}
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RSVP Buttons (Original-Logik) */}
                    {!isEditing && (
                        <div className="pt-2">
                            <div className="flex items-center gap-2 mb-4 ml-2">
                                <Sparkles size={14} className="text-k5-digital" />
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Deine Teilnahme</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => onRSVP(event.id, 'going')} 
                                    className={`flex items-center justify-center gap-3 py-4 rounded-k5-md font-bold uppercase tracking-widest text-[11px] transition-all ${
                                        myStatus === 'going' 
                                        ? 'bg-green-600 text-white shadow-lg shadow-green-500/30' 
                                        : 'bg-k5-light-grey dark:bg-k5-deep/20 text-gray-400'
                                    }`}
                                >
                                    <Check size={18} className={myStatus === 'going' ? 'animate-bounce' : ''}/> Bin dabei
                                </button>
                                <button 
                                    onClick={() => onRSVP(event.id, 'declined')} 
                                    className={`flex items-center justify-center gap-3 py-4 rounded-k5-md font-bold uppercase tracking-widest text-[11px] transition-all ${
                                        myStatus === 'declined' 
                                        ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' 
                                        : 'bg-k5-light-grey dark:bg-k5-deep/20 text-gray-400'
                                    }`}
                                >
                                    <XCircle size={18}/> Absagen
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Teilnehmerliste (Wiederhergestellt) */}
                    <div className="space-y-4 pt-6 border-t dark:border-k5-deep/30">
                        <div className="flex justify-between items-center px-2">
                            <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest flex items-center gap-2">
                                <Users size={12}/> Bestätigt ({goingParticipants.length})
                            </span>
                            <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">
                                Abgesagt ({declinedCount})
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar p-1">
                            {goingParticipants.map((p, i) => (
                                <div key={i} className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-k5-sm text-[10px] font-bold uppercase tracking-tight border border-green-100 dark:border-green-800/30">
                                    {p.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Admin Delete */}
                    {isPrivileged && (
                        <div className="pt-6 border-t border-dashed dark:border-k5-deep/30">
                            <button 
                                onClick={() => onDelete(event.id)} 
                                className="w-full py-4 text-[10px] font-bold text-red-400/50 hover:text-red-600 flex items-center justify-center gap-2 uppercase tracking-[0.2em] transition-all group"
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