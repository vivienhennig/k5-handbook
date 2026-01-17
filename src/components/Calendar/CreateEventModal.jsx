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
    };

    return (
        <div className="fixed inset-0 bg-k5-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white dark:bg-k5-black w-full max-w-lg rounded-k5-lg shadow-2xl border border-gray-100 dark:border-k5-deep overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b dark:border-k5-deep flex justify-between items-center bg-k5-light-grey/50 dark:bg-k5-deep/50">
                    <div>
                        <h3 className="font-bold text-2xl dark:text-white uppercase tracking-tight text-k5-black dark:text-white">Neuer <span className="text-k5-digital">Termin</span></h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Handbook Event Node</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white dark:hover:bg-k5-black rounded-xl transition-all shadow-sm">
                        <X className="text-gray-400"/>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold text-k5-digital uppercase tracking-widest mb-2 ml-1">Event Titel</label>
                            <input required type="text" className="w-full bg-k5-light-grey dark:bg-k5-deep/20 p-4 rounded-k5-md border-none font-bold outline-none focus:ring-2 focus:ring-k5-digital/20 dark:text-white transition-all font-sans" placeholder="z.B. K5 Konferenz 2024" value={title} onChange={e => setTitle(e.target.value)}/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-k5-digital uppercase tracking-widest mb-2 ml-1">Typ</label>
                                <select className="w-full bg-k5-light-grey dark:bg-k5-deep/20 p-4 rounded-k5-md border-none font-bold outline-none focus:ring-2 focus:ring-k5-digital/20 dark:text-white appearance-none cursor-pointer font-sans" value={type} onChange={e => setType(e.target.value)}>
                                    {Object.entries(EVENT_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-k5-digital uppercase tracking-widest mb-2 ml-1">Ort / Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-4 text-gray-400" size={16}/>
                                    <input type="text" className="w-full bg-k5-light-grey dark:bg-k5-deep/20 pl-11 pr-4 py-4 rounded-k5-md border-none font-bold outline-none focus:ring-2 focus:ring-k5-digital/20 dark:text-white transition-all font-sans" value={location} onChange={e => setLocation(e.target.value)}/>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-k5-digital uppercase tracking-widest mb-2 ml-1">Webseite (URL)</label>
                            <input type="url" className="w-full bg-k5-light-grey dark:bg-k5-deep/20 p-4 rounded-k5-md border-none font-bold outline-none focus:ring-2 focus:ring-k5-digital/20 dark:text-white font-sans" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://..."/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-k5-digital uppercase tracking-widest mb-2 ml-1">Start Datum</label>
                                <input required type="date" className="w-full bg-k5-light-grey dark:bg-k5-deep/20 p-4 rounded-k5-md border-none font-bold outline-none focus:ring-2 focus:ring-k5-digital/20 dark:text-white cursor-pointer font-sans" value={startDate} onChange={e => setStartDate(e.target.value)}/>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-k5-digital uppercase tracking-widest mb-2 ml-1">End Datum</label>
                                <input required type="date" className="w-full bg-k5-light-grey dark:bg-k5-deep/20 p-4 rounded-k5-md border-none font-bold outline-none focus:ring-2 focus:ring-k5-digital/20 dark:text-white cursor-pointer font-sans" value={endDate} onChange={e => setEndDate(e.target.value)}/>
                            </div>
                        </div>
                    </div>
                    <button disabled={loading} type="submit" className="w-full bg-glow-digital text-white font-bold py-5 rounded-k5-md uppercase tracking-widest shadow-xl shadow-k5-digital/20 hover:opacity-90 transition-all flex items-center justify-center gap-3">
                        {loading ? 'Transmission...' : 'Event registrieren'}
                        <Sparkles size={18}/>
                    </button>
                </form>
            </div>
        </div>
    );
}