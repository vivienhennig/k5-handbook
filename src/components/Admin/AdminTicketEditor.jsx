import React, { useState, useEffect } from 'react';
import { contentApi } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { Save, Calendar, Sparkles, Tag } from 'lucide-react';

export default function AdminTicketEditor() {
    const { addToast } = useToast();
    const [data, setData] = useState({
        phases: Array(7).fill(0).map((_, i) => ({ name: `Phase ${i+1}`, startDate: '', endDate: '' })),
        types: [
            { label: "Retailer", prices: Array(7).fill(0) },
            { label: "Non-Retailer", prices: Array(7).fill(0) },
            { label: "Retailer Startup", prices: Array(7).fill(0) },
            { label: "Non-Retailer Startup", prices: Array(7).fill(0) },
            { label: "Team Ticket", prices: Array(7).fill(0) },
            { label: "VIP Ticket", prices: Array(7).fill(0) }
        ]
    });

    useEffect(() => {
        contentApi.getTicketSettings().then(res => { 
            if(res) setData(res); 
        });
    }, []);

    const handleSave = async () => {
        try {
            await contentApi.updateTicketSettings(data);
            addToast("Preise & Phasen aktualisiert! 🎫");
        } catch (e) { 
            addToast("Fehler beim Speichern", "error"); 
        }
    };

    return (
        <div className="bg-white dark:bg-k5-black rounded-k5-lg p-8 md:p-12 border border-gray-100 dark:border-k5-deep font-sans transition-all shadow-sm">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-k5-digital text-white rounded-k5-sm shadow-lg shadow-k5-digital/20">
                        <Tag size={24} />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black uppercase tracking-tighter dark:text-white leading-none">Ticket-Master</h3>
                        <div className="flex items-center gap-2 mt-2">
                            <Sparkles size={12} className="text-k5-sand" />
                            <p className="text-[10px] font-bold text-k5-sand uppercase tracking-[0.3em]">Preisphasen & Kategorien</p>
                        </div>
                    </div>
                </div>
                
                <button 
                    onClick={handleSave} 
                    className="w-full md:w-auto bg-glow-digital text-white px-10 py-4 rounded-k5-md font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-xl shadow-k5-digital/25 hover:scale-105 active:scale-95 transition-all"
                >
                    <Save size={18} /> Speichern
                </button>
            </div>

            <div className="overflow-x-auto -mx-4 md:mx-0">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="p-6 text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 min-w-[200px]">Kategorie / Phase</th>
                            {data.phases.map((p, i) => (
                                <th key={i} className="p-4 min-w-[160px] bg-k5-light-grey/30 dark:bg-k5-deep/20 rounded-t-k5-sm border-x border-t border-gray-100 dark:border-k5-deep">
                                    <input 
                                        className="bg-white dark:bg-k5-black border border-gray-100 dark:border-k5-deep rounded-k5-sm text-[11px] font-black uppercase tracking-wider w-full px-3 py-2 mb-3 outline-none focus:border-k5-digital dark:text-white transition-all shadow-sm"
                                        value={p.name}
                                        onChange={e => {
                                            const newPhases = [...data.phases];
                                            newPhases[i].name = e.target.value;
                                            setData({...data, phases: newPhases});
                                        }}
                                    />
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 px-2">
                                            <Calendar size={10} className="text-k5-digital shrink-0" />
                                            <input type="date" className="text-[9px] font-bold bg-transparent dark:text-gray-400 outline-none w-full" value={p.startDate} onChange={e => {
                                                const newPhases = [...data.phases];
                                                newPhases[i].startDate = e.target.value;
                                                setData({...data, phases: newPhases});
                                            }} />
                                        </div>
                                        <div className="flex items-center gap-2 px-2">
                                            <div className="w-[10px] h-[2px] bg-k5-sand shrink-0 ml-[1px]" />
                                            <input type="date" className="text-[9px] font-bold bg-transparent dark:text-gray-400 outline-none w-full" value={p.endDate} onChange={e => {
                                                const newPhases = [...data.phases];
                                                newPhases[i].endDate = e.target.value;
                                                setData({...data, phases: newPhases});
                                            }} />
                                        </div>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.types.map((type, typeIdx) => (
                            <tr key={typeIdx} className="border-b border-gray-50 dark:border-k5-deep/30 hover:bg-k5-light-grey/20 transition-colors">
                                <td className="p-6">
                                    <div className="text-[11px] font-black text-k5-black dark:text-white uppercase tracking-widest">{type.label}</div>
                                </td>
                                {type.prices.map((price, phaseIdx) => (
                                    <td key={phaseIdx} className="p-3 border-x border-gray-50 dark:border-k5-deep/20">
                                        <div className="relative group">
                                            <input 
                                                type="number"
                                                className="w-full bg-white dark:bg-k5-black border border-gray-100 dark:border-k5-deep/50 rounded-k5-sm px-4 py-3 text-sm font-bold dark:text-white outline-none focus:border-k5-digital focus:ring-4 focus:ring-k5-digital/5 transition-all shadow-sm"
                                                value={price}
                                                onChange={e => {
                                                    const newTypes = [...data.types];
                                                    newTypes[typeIdx].prices[phaseIdx] = e.target.value;
                                                    setData({...data, types: newTypes});
                                                }}
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-k5-sand">€</span>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="mt-12 p-6 bg-k5-light-grey/30 dark:bg-k5-deep/10 rounded-k5-md border border-gray-100 dark:border-k5-deep/50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] leading-relaxed text-center">
                    Hinweis: Diese Preise werden global für alle Ticket-Widgets und die K5 Allstars Website synchronisiert.
                </p>
            </div>
        </div>
    );
}