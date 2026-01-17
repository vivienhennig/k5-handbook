import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';
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
                setLoading(false);
            }
        };

        loadPrices();
    }, []);

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

    // Design-Update: Lade-Status mit CI-Farben
    if (loading) return <div className="h-full bg-k5-light-grey dark:bg-k5-deep/20 animate-pulse rounded-k5-lg" />;
    if (!data) return null;

    return (
        <div className="bg-white dark:bg-k5-black rounded-k5-lg p-10 border border-gray-100 dark:border-k5-deep shadow-sm flex flex-col h-full relative overflow-hidden group font-sans">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
                <TrendingUp size={120} />
            </div>

            {/* Header: Italic entfernt, Aeonik Bold genutzt */}
            <div className="flex justify-between items-start mb-10 relative z-10">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-k5-digital mb-2">Live Pricing</p>
                    <h3 className="text-3xl font-bold text-k5-black dark:text-white uppercase tracking-tight">Ticket Phasen</h3>
                </div>
                {activeIndex !== -1 ? (
                    <div className="bg-k5-lime-light dark:bg-k5-lime/10 px-4 py-2 rounded-k5-md border border-k5-lime/20 flex items-center gap-2">
                        <div className="w-2 h-2 bg-k5-lime rounded-full animate-ping" />
                        <span className="text-[10px] font-bold text-k5-deep dark:text-k5-lime uppercase tracking-widest">{currentPhase.name}</span>
                    </div>
                ) : (
                    <div className="bg-k5-sand/10 dark:bg-k5-sand/5 px-4 py-2 rounded-k5-md border border-k5-sand/20 flex items-center gap-2">
                        <AlertCircle size={14} className="text-k5-sand" />
                        <span className="text-[10px] font-bold text-k5-sand uppercase tracking-widest">Phase prüfen</span>
                    </div>
                )}
            </div>

            {/* Price Grid */}
            <div className="grid grid-cols-2 gap-6 flex-1 relative z-10">
                {data.types.map((type, i) => (
                    <div key={i} className="bg-k5-light-grey dark:bg-k5-deep/20 p-6 rounded-k5-md border border-transparent hover:border-k5-digital/20 transition-all">
                        <span className="text-[9px] font-bold uppercase text-gray-400 dark:text-gray-500 tracking-[0.1em] block mb-2">
                            {type.label}
                        </span>
                        <div className="text-2xl font-black text-k5-black dark:text-white">
                            {type.prices[activeIndex] || type.prices[0]}€
                        </div>
                    </div>
                ))}
            </div>

            {/* Phasen Timeline: Italic entfernt, Aeonik Bold genutzt */}
            <div className="mt-10 pt-8 border-t border-gray-100 dark:border-k5-deep/30 relative z-10">
                <div className="flex justify-between items-center gap-2">
                    {data.phases.map((phase, i) => (
                        <div key={i} className={`flex flex-col items-center flex-1 transition-opacity duration-500 ${i === activeIndex ? 'opacity-100' : 'opacity-20'}`}>
                            <div className={`w-full h-1.5 rounded-full mb-3 ${i === activeIndex ? 'bg-k5-digital' : 'bg-k5-sand/30'}`} />
                            <span className="text-[8px] font-bold uppercase tracking-tighter text-center leading-tight dark:text-white truncate w-full">
                                {phase.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}