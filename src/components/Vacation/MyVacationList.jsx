import React from 'react';
import { Clock, Trash2 } from 'lucide-react';

export default function MyVacationList({ vacations, onDelete }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 h-full">
            <h3 className="font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3 uppercase text-xs tracking-widest italic">
                <Clock size={18} className="text-blue-600"/> Meine Anträge
            </h3>
            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {vacations.length === 0 ? (
                    <p className="text-gray-400 italic text-sm">Noch keine Anträge vorhanden.</p>
                ) : (
                    vacations.sort((a,b) => new Date(b.startDate) - new Date(a.startDate)).map(vac => (
                        <div key={vac.id} className="flex justify-between items-center p-4 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black shrink-0 shadow-sm ${vac.type === 'workation' ? 'bg-purple-500 text-white' : 'bg-blue-600 text-white'}`}>
                                    <span className="text-[9px] uppercase leading-none">{new Date(vac.startDate).toLocaleString('de', {month:'short'})}</span>
                                    <span className="text-lg leading-none">{new Date(vac.startDate).getDate()}</span>
                                </div>
                                <div>
                                    <div className="font-black text-sm text-gray-900 dark:text-white uppercase italic tracking-tight">
                                        {vac.type === 'workation' ? 'Workation' : 'Urlaub'}
                                        <span className="text-blue-500 ml-2">({vac.daysCount} Tage)</span>
                                    </div>
                                    <div className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">
                                        bis {new Date(vac.endDate).toLocaleDateString('de-DE')} {vac.comment && `• ${vac.comment}`}
                                    </div>
                                </div>
                            </div>
                            {new Date(vac.startDate) > new Date() && (
                                <button onClick={() => onDelete(vac.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2 opacity-0 group-hover:opacity-100"><Trash2 size={18}/></button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}