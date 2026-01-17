import React from 'react';
import { Clock, Trash2 } from 'lucide-react';

export default function MyVacationList({ vacations, onDelete }) {
    return (
        <div className="bg-white dark:bg-k5-black p-8 rounded-k5-lg shadow-sm border border-gray-100 dark:border-k5-deep h-full">
            <h3 className="font-bold text-k5-black dark:text-white mb-6 flex items-center gap-3 uppercase text-xs tracking-[0.2em]">
                <Clock size={18} className="text-k5-digital"/> Meine Urlaube
            </h3>
            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {vacations.length === 0 ? (
                    <p className="text-gray-400 font-normal text-sm">Noch keine Urlaube eingetragen.</p>
                ) : (
                    vacations.sort((a,b) => new Date(b.startDate) - new Date(a.startDate)).map(vac => (
                        <div key={vac.id} className="flex justify-between items-center p-5 bg-k5-light-grey dark:bg-k5-deep/10 rounded-k5-md border border-transparent hover:border-k5-sand/30 transition-all group">
                            <div className="flex items-center gap-5">
                                <div className={`w-14 h-14 rounded-k5-md flex flex-col items-center justify-center font-bold shrink-0 shadow-sm ${vac.type === 'workation' ? 'bg-glow-deep text-white' : 'bg-glow-digital text-white'}`}>
                                    <span className="text-[10px] uppercase leading-none mb-1 opacity-80">{new Date(vac.startDate).toLocaleString('de', {month:'short'})}</span>
                                    <span className="text-xl leading-none">{new Date(vac.startDate).getDate()}</span>
                                </div>
                                <div>
                                    <div className="font-bold text-base text-k5-black dark:text-white uppercase tracking-tight">
                                        {vac.type === 'workation' ? 'Workation' : 'Urlaub'}
                                        <span className="text-k5-digital ml-3">({vac.daysCount} Tage)</span>
                                    </div>
                                    <div className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                        bis {new Date(vac.endDate).toLocaleDateString('de-DE')} {vac.comment && `• ${vac.comment}`}
                                    </div>
                                </div>
                            </div>
                            {new Date(vac.startDate) > new Date() && (
                                <button onClick={() => onDelete(vac.id)} className="text-gray-300 hover:text-red-500 transition-all p-3 opacity-0 group-hover:opacity-100 hover:scale-110"><Trash2 size={20}/></button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}