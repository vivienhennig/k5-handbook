import React, { useState, useEffect } from 'react';
import { ticketingApi } from '../../services/api.js';
import { ShoppingBag, Building2, Users } from 'lucide-react';
import CountUp from 'react-countup'; // Neu importiert

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

    if (loading) return <div className="h-64 bg-gray-50 dark:bg-gray-900 animate-pulse rounded-[2.5rem]" />;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col h-full relative overflow-hidden font-sans group">
            
            <style>
                {`
                @keyframes custom-shimmer {
                    0% { transform: translateX(-150%); }
                    80%, 100% { transform: translateX(150%); }
                }
                .shimmer-effect {
                    animation: custom-shimmer 5s infinite ease-in-out;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
                }
                .odometer-number {
                    display: inline-block;
                    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .group:hover .odometer-number {
                    transform: scale(1.05);
                }
                `}
            </style>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-1 italic">Live Sales Status</p>
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white italic uppercase tracking-tight flex items-baseline gap-2">
                            <span className="odometer-number text-5xl">
                                <CountUp end={stats.total} duration={2.5} separator="." />
                            </span>
                            <span className="text-sm text-gray-400 font-bold">/ {GOAL.toLocaleString()}</span>
                        </h3>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-black text-blue-600 italic">
                            <CountUp end={totalPercentage} duration={3} suffix="%" />
                        </span>
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest italic">vom Ziel</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-blue-600 p-4 rounded-3xl border border-blue-500 shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40">
                        <div className="flex items-center gap-2 mb-1 text-white/80">
                            <ShoppingBag size={14} />
                            <span className="text-[9px] font-black uppercase italic">Retailer</span>
                        </div>
                        <div className="text-2xl font-black text-white italic">
                            <CountUp end={stats.retailer} duration={2} separator="." />
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-3xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-1 text-gray-500">
                            <Building2 size={14} />
                            <span className="text-[9px] font-black uppercase italic">Non-Retailer</span>
                        </div>
                        <div className="text-2xl font-black dark:text-white italic">
                            <CountUp end={stats.nonRetailer} duration={2} separator="." />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-[9px] font-black uppercase italic tracking-widest px-1">
                        <span className="text-blue-600">Ratio: {retailerRatio.toFixed(1)}% Retail</span>
                        <span className="text-gray-400">{nonRetailerRatio.toFixed(1)}% Non-Retail</span>
                    </div>
                    
                    <div className="relative w-full h-5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex shadow-inner border border-gray-100/50 dark:border-gray-800">
                        <div 
                            className="h-full bg-blue-600 transition-all duration-1000 ease-out relative z-10 overflow-hidden" 
                            style={{ width: `${retailerRatio}%` }} 
                        >
                            <div className="shimmer-effect absolute inset-0 w-full h-full" />
                        </div>
                        <div 
                            className="h-full bg-gray-300 dark:bg-gray-700 transition-all duration-1000 ease-out" 
                            style={{ width: `${nonRetailerRatio}%` }} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}