import React from 'react';
import { VACATION_TYPES } from '../../config/data.js';

export default function VacationForm({ newVacation, setNewVacation, onSubmit, isSubmitting, previewDays }) {
    return (
        <div className="bg-white dark:bg-k5-black p-8 rounded-k5-lg shadow-sm border border-gray-100 dark:border-k5-deep">
            <h3 className="text-xl font-bold text-k5-black dark:text-white mb-6 uppercase tracking-tight">Neuer Urlaub</h3>
            <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Von</label>
                        <input type="date" required className="w-full p-4 bg-k5-light-grey dark:bg-k5-deep/20 border-none rounded-k5-md dark:text-white text-sm outline-none focus:ring-2 focus:ring-k5-digital/20 transition-all"
                            value={newVacation.startDate} onChange={e => setNewVacation({...newVacation, startDate: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Bis</label>
                        <input type="date" required className="w-full p-4 bg-k5-light-grey dark:bg-k5-deep/20 border-none rounded-k5-md dark:text-white text-sm outline-none focus:ring-2 focus:ring-k5-digital/20 transition-all"
                            value={newVacation.endDate} onChange={e => setNewVacation({...newVacation, endDate: e.target.value})} />
                    </div>
                </div>
                
                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Art des Urlaubs</label>
                    <div className="grid grid-cols-3 gap-2">
                        {Object.entries(VACATION_TYPES).map(([key, val]) => (
                            <button key={key} type="button" onClick={() => setNewVacation({...newVacation, type: key})}
                                className={`py-3 px-1 rounded-k5-md text-[10px] font-bold border transition-all uppercase tracking-tighter ${newVacation.type === key ? 'bg-k5-digital text-white border-k5-digital shadow-lg shadow-k5-digital/20' : 'bg-white dark:bg-k5-deep/10 text-gray-400 border-gray-100 dark:border-k5-deep hover:border-k5-digital/50'}`}>
                                {key === 'standard' ? 'Urlaub' : key === 'half' ? '½ Tag' : 'Workation'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-k5-light-grey dark:bg-k5-deep/20 p-4 rounded-k5-md flex justify-between items-center text-sm border border-transparent dark:border-k5-deep/30">
                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Netto Arbeitstage:</span>
                    <span className="font-bold text-k5-black dark:text-white text-lg">{previewDays}</span>
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full bg-glow-digital text-white font-bold py-5 rounded-k5-md transition-all shadow-xl shadow-k5-digital/20 disabled:opacity-50 active:scale-95 uppercase tracking-[0.1em] text-xs"
                >
                    {isSubmitting ? 'Wird übermittelt...' : 'Jetzt eintragen'}
                </button>
            </form>
        </div>
    );
}