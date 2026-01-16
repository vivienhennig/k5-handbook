import React from 'react';
import { VACATION_TYPES } from '../../config/data';

export default function VacationForm({ newVacation, setNewVacation, onSubmit, isSubmitting, previewDays }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Neuen Antrag stellen</h3>
            <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Von</label>
                        <input type="date" required className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                            value={newVacation.startDate} onChange={e => setNewVacation({...newVacation, startDate: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Bis</label>
                        <input type="date" required className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                            value={newVacation.endDate} onChange={e => setNewVacation({...newVacation, endDate: e.target.value})} />
                    </div>
                </div>
                
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Art des Fernbleibens</label>
                    <div className="grid grid-cols-3 gap-2">
                        {Object.entries(VACATION_TYPES).map(([key, val]) => (
                            <button key={key} type="button" onClick={() => setNewVacation({...newVacation, type: key})}
                                className={`py-2 px-1 rounded-lg text-[10px] font-black border transition-all ${newVacation.type === key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-700 text-gray-500 border-gray-100 dark:border-gray-600 hover:border-blue-400'}`}>
                                {key === 'standard' ? 'Urlaub' : key === 'half' ? '½ Tag' : 'Workation'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Netto Arbeitstage:</span>
                    <span className="font-black text-gray-900 dark:text-white">{previewDays}</span>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 active:scale-95">
                    {isSubmitting ? 'Wird übermittelt...' : 'Jetzt beantragen'}
                </button>
            </form>
        </div>
    );
}