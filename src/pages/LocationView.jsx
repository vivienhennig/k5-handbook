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
            {/* Header: Italic entfernt, Aeonik Black genutzt */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-100 dark:border-k5-deep pb-10">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => handleNav('tools')}
                        className="w-12 h-12 rounded-k5-md bg-white dark:bg-k5-black shadow-sm border border-gray-100 dark:border-k5-deep flex items-center justify-center text-gray-400 hover:text-k5-digital transition-all active:scale-90"
                    >
                        <ArrowLeft size={20}/>
                    </button>
                    <div>
                        <h2 className="text-4xl lg:text-5xl font-black text-k5-black dark:text-white tracking-tighter uppercase leading-none">
                            Location <span className="text-k5-digital">Scout</span>
                        </h2>
                        <p className="text-k5-sand font-bold uppercase text-[10px] tracking-[0.3em] mt-2 flex items-center gap-2">
                            <Sparkles size={12} className="text-k5-digital"/> Research Agent
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Input Hub: rounded-k5-lg */}
            <div className="bg-white dark:bg-k5-black p-8 md:p-14 rounded-k5-lg shadow-sm border border-gray-100 dark:border-k5-deep">
                
                <div className="grid md:grid-cols-2 gap-10 mb-12">
                    <div className="group">
                        <label className="text-[10px] font-bold uppercase text-k5-digital tracking-widest mb-3 block ml-2">Zielgebiet</label>
                        <div className="relative">
                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-k5-digital transition-colors" size={20}/>
                            <input 
                                type="text" 
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                placeholder="Stadt eingeben..." 
                                className="w-full pl-16 pr-8 py-5 bg-k5-light-grey dark:bg-k5-deep/20 border-none rounded-k5-md text-xl font-bold focus:ring-4 focus:ring-k5-digital/5 outline-none dark:text-white transition-all placeholder:text-gray-300"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase text-k5-digital tracking-widest mb-3 block ml-2">Pax (Kapazität)</label>
                        <select 
                            value={pax} 
                            onChange={e => setPax(e.target.value)}
                            className="w-full px-8 py-5 bg-k5-light-grey dark:bg-k5-deep/20 border-none rounded-k5-md text-lg font-bold outline-none focus:ring-4 focus:ring-k5-digital/5 dark:text-white appearance-none cursor-pointer"
                        >
                            <option value="10-20">10-20 (Small Circle)</option>
                            <option value="20-50">20-50 (Standard Team)</option>
                            <option value="50-100">50-100 (Big Dinner)</option>
                            <option value="100+">100+ (Event Scale)</option>
                        </select>
                    </div>
                </div>

                {/* Switcher: k5-md Rundung & Glow Digital */}
                <div className="bg-k5-light-grey dark:bg-k5-deep/30 p-2 rounded-k5-md flex gap-2 mb-14 shadow-inner">
                    <button 
                        onClick={() => setEventType('meetup')}
                        className={`flex-1 py-4 rounded-k5-md font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                            eventType === 'meetup' 
                            ? 'bg-glow-digital text-white shadow-xl' 
                            : 'text-gray-400 hover:text-k5-black dark:hover:text-white'
                        }`}
                    >
                        <Building2 size={16}/> Meetup Search
                    </button>
                    <button 
                        onClick={() => setEventType('dinner')}
                        className={`flex-1 py-4 rounded-k5-md font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                            eventType === 'dinner' 
                            ? 'bg-glow-digital text-white shadow-xl' 
                            : 'text-gray-400 hover:text-k5-black dark:hover:text-white'
                        }`}
                    >
                        <Utensils size={16}/> Dinner Search
                    </button>
                </div>

                {/* Actions Grid */}
                <div className="animate-in fade-in zoom-in-95 duration-500">
                    <h3 className="text-[10px] font-bold text-k5-sand uppercase tracking-[0.3em] mb-8 ml-2">Search Engines</h3>

                    {eventType === 'dinner' ? (
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { label: 'Maps', platform: 'maps', icon: MapPin, color: 'text-k5-digital' },
                                { label: 'Google Web', platform: 'google', icon: Search, color: 'text-k5-black dark:text-white' },
                                { label: 'Image Check', platform: 'images', icon: ExternalLink, color: 'text-k5-sand' }
                            ].map((btn) => (
                                <button key={btn.label} onClick={() => openSearch(btn.platform)} className="group bg-k5-light-grey dark:bg-k5-deep/20 p-10 rounded-k5-md border border-transparent hover:border-k5-digital transition-all flex flex-col items-center gap-5">
                                    <btn.icon size={32} className={`${btn.color} group-hover:scale-110 transition-transform`}/>
                                    <span className="font-bold uppercase text-[10px] dark:text-white tracking-widest">{btn.label}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-12">
                            <div>
                                <h4 className="text-[9px] font-bold uppercase text-k5-digital tracking-[0.4em] mb-6 ml-4">Retail & Concept Stores</h4>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <button onClick={() => openSearch('google', 'retail')} className="p-8 bg-k5-light-grey dark:bg-k5-deep/20 rounded-k5-md hover:shadow-2xl hover:shadow-k5-digital/10 transition-all text-left flex items-start gap-6 border border-transparent hover:border-k5-digital group">
                                        <div className="p-5 bg-white dark:bg-k5-black rounded-k5-sm shadow-sm text-k5-digital group-hover:bg-k5-digital group-hover:text-white transition-all"><ShoppingBag size={24}/></div>
                                        <div>
                                            <div className="font-bold uppercase text-sm dark:text-white tracking-tight">Brand Stores</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase mt-1.5 tracking-widest">Flagships & Launches</div>
                                        </div>
                                    </button>
                                    <button onClick={() => openSearch('maps')} className="p-8 bg-k5-light-grey dark:bg-k5-deep/20 rounded-k5-md hover:shadow-2xl hover:shadow-k5-digital/10 transition-all text-left flex items-start gap-6 border border-transparent hover:border-k5-digital group">
                                        <div className="p-5 bg-white dark:bg-k5-black rounded-k5-sm shadow-sm text-k5-digital group-hover:bg-k5-digital group-hover:text-white transition-all"><MapPin size={24}/></div>
                                        <div>
                                            <div className="font-bold uppercase text-sm dark:text-white tracking-tight">Geo Radius</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase mt-1.5 tracking-widest">Umgebung explorieren</div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[9px] font-bold uppercase text-k5-digital tracking-[0.4em] mb-6 ml-4">Corporate & Network</h4>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <button onClick={() => openSearch('google', 'office')} className="p-8 bg-k5-light-grey dark:bg-k5-deep/20 rounded-k5-md hover:shadow-2xl hover:shadow-k5-digital/10 transition-all text-left flex items-start gap-6 border border-transparent hover:border-k5-digital group">
                                        <div className="p-5 bg-white dark:bg-k5-black rounded-k5-sm shadow-sm text-k5-digital group-hover:bg-k5-digital group-hover:text-white transition-all"><Briefcase size={24}/></div>
                                        <div>
                                            <div className="font-bold uppercase text-sm dark:text-white tracking-tight">HQ & Offices</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase mt-1.5 tracking-widest">New Work Campuses</div>
                                        </div>
                                    </button>
                                    <button onClick={() => openSearch('linkedin')} className="p-8 bg-blue-600/5 dark:bg-blue-600/10 rounded-k5-md hover:shadow-2xl hover:shadow-blue-600/10 transition-all text-left flex items-start gap-6 border border-transparent hover:border-blue-600 group">
                                        <div className="p-5 bg-white dark:bg-k5-black rounded-k5-sm shadow-sm text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all"><Users size={24}/></div>
                                        <div>
                                            <div className="font-bold uppercase text-sm dark:text-white tracking-tight">LinkedIn Scout</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase mt-1.5 tracking-widest">Local Community Leads</div>
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