import React, { useState } from 'react';
import { 
    ArrowLeft, MapPin, Search, Utensils, Building2, 
    Briefcase, ShoppingBag, Users, ExternalLink, Sparkles 
} from 'lucide-react';

export default function LocationView({ handleNav }) {
    const [city, setCity] = useState('');
    const [eventType, setEventType] = useState('meetup'); 
    const [pax, setPax] = useState('20-50');

    // --- LOGIK (Exakt beibehalten) ---
    const openSearch = (platform, subType = null) => {
        if (!city) return alert('Bitte gib eine Stadt ein.');
        let query = '';
        
        if (eventType === 'dinner') {
            if (platform === 'maps') query = `Restaurant with private dining room ${city}`;
            else if (platform === 'google') query = `Restaurant "separater Raum" ${city} Firmenessen ${pax} Personen`;
            else if (platform === 'images') query = `Restaurant Private Dining ${city} interior design`;
        } else {
            if (subType === 'retail') {
                if (platform === 'maps') query = `Flagship Store OR Concept Store ${city}`;
                else if (platform === 'google') query = `(Flagship Store OR "Concept Store" OR "Brand Store") ${city} (Event OR Eröffnung OR Launch)`;
                else if (platform === 'images') query = `Retail Design ${city} Store Interior`;
            } 
            else if (subType === 'office') {
                if (platform === 'maps') query = `Unternehmenszentrale OR Campus ${city}`;
                else if (platform === 'google') query = `("New Work Office" OR "Headquarter" OR "Campus") ${city} Eventlocation`;
                else if (platform === 'images') query = `Coolest Offices ${city} Interior`;
            }
            else if (platform === 'linkedin') query = `site:linkedin.com/in ("Event Manager" OR "Community Manager") "${city}"`;
        }

        const urls = {
            maps: `https://www.google.com/maps/search/${encodeURIComponent(query)}`,
            google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
            images: `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`,
            linkedin: `https://www.google.com/search?q=${encodeURIComponent(query)}`
        };
        window.open(urls[platform], '_blank');
    };

    return (
        <div className="max-w-5xl mx-auto animate-in fade-in duration-500 pb-20 px-4 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-100 dark:border-gray-800 pb-10">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => handleNav('tools')}
                        className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all active:scale-90"
                    >
                        <ArrowLeft size={20}/>
                    </button>
                    <div>
                        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase">
                            Location <span className="text-blue-600">Scout</span>
                        </h2>
                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] italic mt-1 flex items-center gap-2">
                            <Sparkles size={12} className="text-blue-500"/> AI-Powered Research Agent
                        </p>
                    </div>
                </div>
            </div>

            {/* Input Hub */}
            <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-700">
                
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="group">
                        <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-3 block ml-2">Zielgebiet</label>
                        <div className="relative">
                            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20}/>
                            <input 
                                type="text" 
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                placeholder="Stadt eingeben..." 
                                className="w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-gray-900 border-none rounded-[1.8rem] text-xl font-black italic focus:ring-4 focus:ring-blue-500/5 outline-none dark:text-white transition-all placeholder:text-gray-300"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-3 block ml-2">Pax (Kapazität)</label>
                        <select 
                            value={pax} 
                            onChange={e => setPax(e.target.value)}
                            className="w-full px-6 py-5 bg-gray-50 dark:bg-gray-900 border-none rounded-[1.8rem] text-lg font-bold italic outline-none focus:ring-4 focus:ring-blue-500/5 dark:text-white appearance-none cursor-pointer"
                        >
                            <option value="10-20">10-20 (Small Circle)</option>
                            <option value="20-50">20-50 (Standard Team)</option>
                            <option value="50-100">50-100 (Big Dinner)</option>
                            <option value="100+">100+ (Event Scale)</option>
                        </select>
                    </div>
                </div>

                {/* Switcher */}
                <div className="bg-gray-50 dark:bg-gray-950/50 p-2 rounded-[2rem] flex gap-2 mb-12 shadow-inner">
                    <button 
                        onClick={() => setEventType('meetup')}
                        className={`flex-1 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                            eventType === 'meetup' 
                            ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-xl' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        <Building2 size={16}/> Meetup Search
                    </button>
                    <button 
                        onClick={() => setEventType('dinner')}
                        className={`flex-1 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                            eventType === 'dinner' 
                            ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-xl' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        <Utensils size={16}/> Dinner Search
                    </button>
                </div>

                {/* Actions */}
                <div className="animate-in fade-in zoom-in-95 duration-500">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 ml-2 italic">Search Engines</h3>

                    {eventType === 'dinner' ? (
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { label: 'Maps', platform: 'maps', icon: MapPin, color: 'text-blue-500' },
                                { label: 'Google Web', platform: 'google', icon: Search, color: 'text-gray-900' },
                                { label: 'Image Check', platform: 'images', icon: ExternalLink, color: 'text-purple-500' }
                            ].map((btn) => (
                                <button key={btn.label} onClick={() => openSearch(btn.platform)} className="group bg-gray-50 dark:bg-gray-900 p-8 rounded-[2rem] border border-transparent hover:border-blue-500 transition-all flex flex-col items-center gap-4">
                                    <btn.icon size={28} className={`${btn.color} group-hover:scale-110 transition-transform`}/>
                                    <span className="font-black italic uppercase text-xs dark:text-white tracking-widest">{btn.label}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-10">
                            <div>
                                <h4 className="text-[9px] font-black uppercase text-blue-500 tracking-[0.3em] mb-4 ml-4">Retail & Concept Stores</h4>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <button onClick={() => openSearch('google', 'retail')} className="p-8 bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] hover:shadow-2xl hover:shadow-blue-500/10 transition-all text-left flex items-start gap-6 border border-transparent hover:border-blue-500 group">
                                        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-purple-500 group-hover:bg-blue-600 group-hover:text-white transition-all"><ShoppingBag size={24}/></div>
                                        <div>
                                            <div className="font-black italic uppercase text-sm dark:text-white tracking-tight">Brand Stores</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-tighter italic">Flagships & Launches</div>
                                        </div>
                                    </button>
                                    <button onClick={() => openSearch('maps')} className="p-8 bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] hover:shadow-2xl hover:shadow-blue-500/10 transition-all text-left flex items-start gap-6 border border-transparent hover:border-blue-500 group">
                                        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all"><MapPin size={24}/></div>
                                        <div>
                                            <div className="font-black italic uppercase text-sm dark:text-white tracking-tight">Geo Radius</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-tighter italic">Umgebung explorieren</div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[9px] font-black uppercase text-blue-500 tracking-[0.3em] mb-4 ml-4">Corporate & Network</h4>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <button onClick={() => openSearch('google', 'office')} className="p-8 bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] hover:shadow-2xl hover:shadow-blue-500/10 transition-all text-left flex items-start gap-6 border border-transparent hover:border-blue-500 group">
                                        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-indigo-500 group-hover:bg-blue-600 group-hover:text-white transition-all"><Briefcase size={24}/></div>
                                        <div>
                                            <div className="font-black italic uppercase text-sm dark:text-white tracking-tight">HQ & Offices</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-tighter italic">New Work Campuses</div>
                                        </div>
                                    </button>
                                    <button onClick={() => openSearch('linkedin')} className="p-8 bg-[#0077b5]/5 rounded-[2.5rem] hover:shadow-2xl hover:shadow-[#0077b5]/10 transition-all text-left flex items-start gap-6 border border-transparent hover:border-[#0077b5] group">
                                        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-[#0077b5] group-hover:bg-[#0077b5] group-hover:text-white transition-all"><Users size={24}/></div>
                                        <div>
                                            <div className="font-black italic uppercase text-sm dark:text-white tracking-tight">LinkedIn Scout</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-tighter italic">Local Community Leads</div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}