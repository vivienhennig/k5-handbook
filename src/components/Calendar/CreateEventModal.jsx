import React, { useState } from 'react';
import { X, MapPin, Sparkles } from 'lucide-react';
import { EVENT_TYPES } from '../../config/data';

export default function CreateEventModal({ isOpen, onClose, onSave, loading }) {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('external');
    const [location, setLocation] = useState('');
    const [website, setWebsite] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ title, type, location, website, startDate, endDate });
        // Reset nach Save erfolgt in der Parent-Komponente
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                    <div>
                        <h3 className="font-black text-2xl dark:text-white uppercase italic tracking-tight">Neuer <span className="text-blue-600">Termin</span></h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Handbook Event Node</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-all shadow-sm">
                        <X className="text-gray-400"/>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 ml-1 italic">Event Titel</label>
                            <input required type="text" className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white transition-all" placeholder="z.B. K5 Konferenz 2024" value={title} onChange={e => setTitle(e.target.value)}/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 ml-1 italic">Typ</label>
                                <select className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white appearance-none cursor-pointer" value={type} onChange={e => setType(e.target.value)}>
                                    {Object.entries(EVENT_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 ml-1 italic">Ort / Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-4 text-gray-400" size={16}/>
                                    <input type="text" className="w-full bg-gray-50 dark:bg-gray-800 pl-11 pr-4 py-4 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white transition-all" value={location} onChange={e => setLocation(e.target.value)}/>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 ml-1 italic">Webseite (URL)</label>
                            <input type="url" className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://..."/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 ml-1 italic">Start Datum</label>
                                <input required type="date" className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white cursor-pointer" value={startDate} onChange={e => setStartDate(e.target.value)}/>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 ml-1 italic">End Datum</label>
                                <input required type="date" className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white cursor-pointer" value={endDate} onChange={e => setEndDate(e.target.value)}/>
                            </div>
                        </div>
                    </div>
                    <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white font-black py-5 rounded-[1.8rem] uppercase italic tracking-widest shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                        {loading ? 'Transmission...' : 'Event registrieren'}
                        <Sparkles size={18}/>
                    </button>
                </form>
            </div>
        </div>
    );
}