import React, { useState, useEffect } from 'react';
import { contentApi } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { Save, Calendar } from 'lucide-react';

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
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-800 font-sans">
            <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black italic uppercase italic tracking-tight dark:text-white">Ticket-Master Konfiguration</h3>
                <button onClick={handleSave} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-700 transition-all">
                    <Save size={20} /> SPEICHERN
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr>
                            <th className="p-4 text-[10px] font-black uppercase text-gray-400 italic">Kategorie / Phase</th>
                            {data.phases.map((p, i) => (
                                <th key={i} className="p-4">
                                    <input 
                                        className="bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-[10px] font-black uppercase italic w-full p-2 mb-2 dark:text-white"
                                        value={p.name}
                                        onChange={e => {
                                            const newPhases = [...data.phases];
                                            newPhases[i].name = e.target.value;
                                            setData({...data, phases: newPhases});
                                        }}
                                    />
                                    <div className="flex flex-col gap-1">
                                        <input type="date" className="text-[8px] bg-transparent dark:text-gray-400" value={p.startDate} onChange={e => {
                                            const newPhases = [...data.phases];
                                            newPhases[i].startDate = e.target.value;
                                            setData({...data, phases: newPhases});
                                        }} />
                                        <input type="date" className="text-[8px] bg-transparent dark:text-gray-400" value={p.endDate} onChange={e => {
                                            const newPhases = [...data.phases];
                                            newPhases[i].endDate = e.target.value;
                                            setData({...data, phases: newPhases});
                                        }} />
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.types.map((type, typeIdx) => (
                            <tr key={typeIdx} className="border-t border-gray-50 dark:border-gray-800">
                                <td className="p-4 text-xs font-bold dark:text-white uppercase italic">{type.label}</td>
                                {type.prices.map((price, phaseIdx) => (
                                    <td key={phaseIdx} className="p-2">
                                        <div className="relative">
                                            <input 
                                                type="number"
                                                className="w-full bg-gray-50 dark:bg-gray-800/50 border-none rounded-xl p-3 text-sm font-black italic dark:text-white"
                                                value={price}
                                                onChange={e => {
                                                    const newTypes = [...data.types];
                                                    newTypes[typeIdx].prices[phaseIdx] = e.target.value;
                                                    setData({...data, types: newTypes});
                                                }}
                                            />
                                            <span className="absolute right-3 top-3 text-[10px] text-gray-400">€</span>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}