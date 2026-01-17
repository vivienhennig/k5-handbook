import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { contentApi } from '../../services/api.js';

export default function TicketPriceCard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPrices = async () => {
            setLoading(true);
            try {
                const res = await contentApi.getTicketSettings();
                if (res) {
                    setData(res);
                }
            } catch (error) {
                console.error("Fehler beim Laden der Ticket-Daten:", error);
            } finally {
                // Dies ist entscheidend: Es stoppt die Animation und zeigt den Content
                setLoading(false);
            }
        };

        loadPrices();
    }, []);

    // Logik: Aktive Phase anhand des Datums finden
    const getActivePhaseIndex = () => {
        if (!data?.phases) return -1;
        const now = new Date();
        return data.phases.findIndex(phase => {
            const start = new Date(phase.startDate);
            const end = new Date(phase.endDate);
            return now >= start && now <= end;
        });
    };

    const activeIndex = getActivePhaseIndex();
    const currentPhase = data?.phases[activeIndex] || data?.phases[0];

    if (loading) return <div className="h-full bg-gray-50 dark:bg-gray-900/50 animate-pulse rounded-[2.5rem]" />;
    if (!data) return null;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
                <TrendingUp size={120} />
            </div>

            <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-2 italic">Live Pricing</p>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-tight">Ticket Phasen</h3>
                </div>
                {activeIndex !== -1 ? (
                    <div className="bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-2xl border border-green-100 dark:border-green-800 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                        <span className="text-[10px] font-black text-green-600 uppercase italic">{currentPhase.name}</span>
                    </div>
                ) : (
                    <div className="bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-2xl border border-amber-100 dark:border-amber-800 flex items-center gap-2">
                        <AlertCircle size={14} className="text-amber-600" />
                        <span className="text-[10px] font-black text-amber-600 uppercase italic">Phase prüfen</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1 relative z-10">
                {data.types.map((type, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-3xl border border-transparent hover:border-blue-500/10 transition-all">
                        <span className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 italic tracking-wider block mb-1">
                            {type.label}
                        </span>
                        <div className="text-xl font-black text-gray-900 dark:text-white italic">
                            {type.prices[activeIndex] || type.prices[0]}€
                        </div>
                    </div>
                ))}
            </div>

            {/* Phasen Timeline */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 relative z-10">
    <div className="flex justify-between items-center gap-1"> {/* gap verringert */}
        {data.phases.map((phase, i) => (
            <div key={i} className={`flex flex-col items-center flex-1 ${i === activeIndex ? 'opacity-100' : 'opacity-20'}`}>
                <div className={`w-full h-1 rounded-full mb-2 ${i === activeIndex ? 'bg-blue-600' : 'bg-gray-400'}`} />
                <span className="text-[5px] font-black uppercase italic text-center leading-tight dark:text-white truncate w-full"> {/* Text noch etwas kleiner */}
                    {phase.name}
                </span>
            </div>
        ))}
    </div>
</div>
        </div>
    );
}