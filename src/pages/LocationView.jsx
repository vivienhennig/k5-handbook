import React, { useState } from 'react';
import { 
    ArrowLeft, MapPin, Search, Utensils, Building2, 
    Briefcase, ShoppingBag, Users, ExternalLink 
} from 'lucide-react';

export default function LocationView({ handleNav }) {
    // --- STATE ---
    const [city, setCity] = useState('');
    const [eventType, setEventType] = useState('meetup'); 
    const [pax, setPax] = useState('20-50');

    // --- LOGIK (Dein Code) ---
    const openSearch = (platform, subType = null) => {
        if (!city) return alert('Bitte gib eine Stadt ein.');

        let query = '';
        
        if (eventType === 'dinner') {
            // --- DINNER LOGIK ---
            if (platform === 'maps') {
                query = `Restaurant with private dining room ${city}`;
            } else if (platform === 'google') {
                // Hier nutzen wir pax dynamisch
                query = `Restaurant "separater Raum" ${city} Firmenessen ${pax} Personen`;
            } else if (platform === 'images') {
                query = `Restaurant Private Dining ${city} interior design`;
            }
        } else {
            // --- MEETUP LOGIK ---
            
            // 1. STORES
            if (subType === 'retail') {
                if (platform === 'maps') {
                    query = `Flagship Store OR Concept Store ${city}`;
                } else if (platform === 'google') {
                    query = `(Flagship Store OR "Concept Store" OR "Brand Store") ${city} (Event OR Eröffnung OR Launch)`;
                } else if (platform === 'images') {
                    query = `Retail Design ${city} Store Interior`;
                }
            } 
            // 2. HEADQUARTERS
            else if (subType === 'office') {
                if (platform === 'maps') {
                    query = `Headquarter OR Campus OR Unternehmenszentrale ${city}`;
                } else if (platform === 'google') {
                    query = `("New Work Office" OR "Headquarter" OR "Unternehmenszentrale" OR "Campus") ${city} Eventlocation`;
                } else if (platform === 'images') {
                    query = `Coolest Offices ${city} Interior`;
                }
            }
            // 3. LINKEDIN
            else if (platform === 'linkedin') {
                query = `site:linkedin.com/in ("Event Manager" OR "Community Manager" OR "Brand Manager") "${city}"`;
            }
        }

        // URL öffnen
        if (platform === 'maps') window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank');
        if (platform === 'google') window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        if (platform === 'images') window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`, '_blank');
        if (platform === 'linkedin') window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    };

    return (
        <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button 
                    onClick={() => handleNav('tools')}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500"
                >
                    <ArrowLeft size={24}/>
                </button>
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                        Location Scout <span className="text-sm font-normal bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">AI Search</span>
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">Der Research-Agent findet passende Locations für dich im Web.</p>
                </div>
            </div>

            {/* Main Interface */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                
                {/* 1. INPUTS */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Stadt / Region</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400" size={20}/>
                            <input 
                                type="text" 
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                placeholder="z.B. Berlin" 
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-lg font-bold focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Personen (Pax)</label>
                        <select 
                            value={pax} 
                            onChange={e => setPax(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-lg font-medium focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                        >
                            <option value="10-20">10-20 (Intim)</option>
                            <option value="20-50">20-50 (Team)</option>
                            <option value="50-100">50-100 (Event)</option>
                            <option value="100+">100+ (Party)</option>
                        </select>
                    </div>
                </div>

                {/* 2. MODE SWITCHER */}
                <div className="bg-gray-100 dark:bg-gray-900 p-1.5 rounded-xl flex gap-1 mb-8">
                    <button 
                        onClick={() => setEventType('meetup')}
                        className={`flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                            eventType === 'meetup' 
                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                        <Building2 size={18}/> Meetup (Brands & Offices)
                    </button>
                    <button 
                        onClick={() => setEventType('dinner')}
                        className={`flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                            eventType === 'dinner' 
                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                        <Utensils size={18}/> Dinner & Private Dining
                    </button>
                </div>

                {/* 3. ACTION BUTTONS */}
                <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Search size={16} className="text-blue-500"/>
                        Suche starten auf...
                    </h3>

                    {eventType === 'dinner' ? (
                        <div className="grid md:grid-cols-3 gap-4">
                            <button onClick={() => openSearch('maps')} className="h-16 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl font-bold flex flex-col items-center justify-center border border-blue-200 dark:border-blue-800 transition-all">
                                <MapPin size={20} className="mb-1"/>
                                Google Maps
                            </button>
                            <button onClick={() => openSearch('google')} className="h-16 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-bold flex flex-col items-center justify-center border border-gray-200 dark:border-gray-600 transition-all">
                                <Search size={20} className="mb-1"/>
                                Web Suche
                            </button>
                            <button onClick={() => openSearch('images')} className="h-16 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-bold flex flex-col items-center justify-center border border-gray-200 dark:border-gray-600 transition-all">
                                <ExternalLink size={20} className="mb-1"/>
                                Bilder (Vibe Check)
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Retail Section */}
                            <div>
                                <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Stores & Retail</h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <button onClick={() => openSearch('google', 'retail')} className="p-4 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl text-left transition-all group">
                                        <ShoppingBag className="text-purple-500 mb-2" size={24}/>
                                        <div className="font-bold text-gray-900 dark:text-white">Brand Stores</div>
                                        <div className="text-xs text-gray-500">Flagship & Concept</div>
                                    </button>
                                    <button onClick={() => openSearch('maps')} className="p-4 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl text-left transition-all group">
                                        <MapPin className="text-purple-500 mb-2" size={24}/>
                                        <div className="font-bold text-gray-900 dark:text-white">Maps Suche</div>
                                        <div className="text-xs text-gray-500">Umgebung checken</div>
                                    </button>
                                </div>
                            </div>

                            {/* Office Section */}
                            <div>
                                <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Offices & People</h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <button onClick={() => openSearch('google', 'office')} className="p-4 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl text-left transition-all group">
                                        <Briefcase className="text-indigo-500 mb-2" size={24}/>
                                        <div className="font-bold text-gray-900 dark:text-white">HQ & Campus</div>
                                        <div className="text-xs text-gray-500">New Work Spaces</div>
                                    </button>
                                    <button onClick={() => openSearch('linkedin')} className="p-4 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-[#0077b5] rounded-xl text-left transition-all group">
                                        <Users className="text-[#0077b5] mb-2" size={24}/>
                                        <div className="font-bold text-gray-900 dark:text-white">LinkedIn Scout</div>
                                        <div className="text-xs text-gray-500">Event Manager finden</div>
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