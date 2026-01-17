import React, { useState, useEffect } from 'react';
import { ticketingApi } from '../../services/api.js';
import { ShoppingBag, Building2 } from 'lucide-react';
import CountUp from 'react-countup';

export default function TicketStatsCard() {
    const [stats, setStats] = useState({ total: 0, retailer: 0, nonRetailer: 0 });
    const [loading, setLoading] = useState(true);
    const GOAL = 5000;

    useEffect(() => {
        ticketingApi.getStats().then(res => {
            if (res) setStats(res);
            setLoading(false);
        });
    }, []);

    const totalPercentage = Math.min(Math.round((stats.total / GOAL) * 100), 100);
    const retailerRatio = stats.total > 0 ? (stats.retailer / stats.total) * 100 : 0;
    const nonRetailerRatio = stats.total > 0 ? 100 - retailerRatio : 0;

    if (loading) return <div className="h-72 bg-k5-light-grey dark:bg-k5-deep/20 animate-pulse rounded-k5-lg" />;

    return (
        <div className="bg-white dark:bg-k5-black rounded-k5-lg p-10 border border-gray-100 dark:border-k5-deep shadow-sm flex flex-col h-full relative overflow-hidden group font-sans">
            
            <style>
                {`
                @keyframes custom-shimmer {
                    0% { transform: translateX(-150%); }
                    80%, 100% { transform: translateX(150%); }
                }
                .shimmer-effect {
                    animation: custom-shimmer 5s infinite ease-in-out;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                }
                `}
            </style>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-k5-digital mb-2">Live Sales Status</p>
                        <h3 className="text-4xl font-bold text-k5-black dark:text-white uppercase tracking-tight flex items-baseline gap-3">
                            <span className="text-5xl font-black transition-transform duration-300 group-hover:scale-105 inline-block">
                                <CountUp end={stats.total} duration={2.5} separator="." />
                            </span>
                            <span className="text-sm text-gray-400 font-bold">/ {GOAL.toLocaleString()}</span>
                        </h3>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-black text-k5-digital">
                            <CountUp end={totalPercentage} duration={3} suffix="%" />
                        </span>
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">vom Ziel</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-10">
                    {/* Retailer Card: Glow Digital */}
                    <div className="bg-glow-digital p-6 rounded-k5-md shadow-xl shadow-k5-digital/20 transition-all hover:scale-[1.02] border border-white/10">
                        <div className="flex items-center gap-2 mb-2 text-white/80">
                            <ShoppingBag size={14} />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Retailer</span>
                        </div>
                        <div className="text-3xl font-black text-white">
                            <CountUp end={stats.retailer} duration={2} separator="." />
                        </div>
                    </div>

                    {/* Non-Retailer Card: Subtle Dark/Grey */}
                    <div className="bg-k5-light-grey dark:bg-k5-deep/20 p-6 rounded-k5-md border border-gray-100 dark:border-k5-deep transition-all hover:scale-[1.02]">
                        <div className="flex items-center gap-2 mb-2 text-gray-400">
                            <Building2 size={14} />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Non-Retailer</span>
                        </div>
                        <div className="text-3xl font-black text-k5-black dark:text-white">
                            <CountUp end={stats.nonRetailer} duration={2} separator="." />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest px-1">
                        <span className="text-k5-digital">Ratio: {retailerRatio.toFixed(1)}% Retail</span>
                        <span className="text-gray-400">{nonRetailerRatio.toFixed(1)}% Non-Retail</span>
                    </div>
                    
                    <div className="relative w-full h-6 bg-k5-light-grey dark:bg-k5-deep/30 rounded-full overflow-hidden flex border border-gray-100 dark:border-k5-deep/30 shadow-inner">
                        <div 
                            className="h-full bg-glow-digital transition-all duration-1000 ease-out relative z-10 overflow-hidden" 
                            style={{ width: `${retailerRatio}%` }} 
                        >
                            <div className="shimmer-effect absolute inset-0 w-full h-full" />
                        </div>
                        <div 
                            className="h-full bg-k5-sand/20 dark:bg-k5-sand/10 transition-all duration-1000 ease-out" 
                            style={{ width: `${nonRetailerRatio}%` }} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}