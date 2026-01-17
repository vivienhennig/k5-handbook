import React from 'react';
import { CheckCircle, Trash2, User } from 'lucide-react';

export default function FeedbackRow({ item, onAction, isLoading }) {
    const formatDate = (dateInput) => {
        try {
            if (!dateInput) return { date: 'Kein Datum', time: '' };
            let d;
            if (dateInput.seconds) {
                d = new Date(dateInput.seconds * 1000);
            } else {
                d = new Date(dateInput);
            }
            if (isNaN(d.getTime())) return { date: 'Datum Fehler', time: '' };

            return {
                date: d.toLocaleDateString('de-DE'),
                time: d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
            };
        } catch (e) {
            return { date: 'Fehler', time: '' };
        }
    };

    const formatted = formatDate(item.createdAt);

    return (
        <tr className={`hover:bg-k5-light-grey/40 dark:hover:bg-k5-deep/20 transition-all font-sans border-b border-gray-50 dark:border-k5-deep/30 ${isLoading ? 'opacity-30 pointer-events-none' : ''}`}>
            {/* Zeitpunkt: Aeonik Bold, k5-sand Akzent */}
            <td className="px-10 py-7 text-[11px] font-bold text-gray-400">
                <div className="flex flex-col gap-1">
                    <span className="text-k5-black dark:text-white tracking-tight">{formatted.date}</span>
                    <span className="text-k5-sand tracking-[0.1em]">{formatted.time}</span>
                </div>
            </td>

            {/* Absender: Aeonik Black, k5-sm Avatar */}
            <td className="px-10 py-7">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-k5-sm bg-k5-light-grey dark:bg-k5-deep text-k5-digital flex items-center justify-center text-[11px] font-black border border-gray-100 dark:border-k5-deep/50 shadow-sm">
                        {item.user?.charAt(0) || <User size={14}/>}
                    </div>
                    <div className="min-w-0">
                        <div className="text-[13px] font-black text-k5-black dark:text-white uppercase tracking-tight truncate">{item.user}</div>
                        <div className="text-[9px] font-bold text-k5-sand bg-k5-sand/5 dark:bg-k5-sand/10 px-2 py-0.5 rounded-k5-sm mt-1.5 inline-block uppercase tracking-widest border border-k5-sand/20">
                            @{item.context || 'General'}
                        </div>
                    </div>
                </div>
            </td>

            {/* Mitteilung: Italic entfernt, Aeonik Medium Style */}
            <td className="px-10 py-7 text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-md">
                <div className="relative pl-4 border-l-2 border-k5-digital/20">
                    <span className="font-medium">"{item.text}"</span>
                </div>
            </td>

            {/* Aktionen: Hover-Effekte auf CI-Farben angepasst */}
            <td className="px-10 py-7 text-right">
                <div className="flex justify-end gap-3">
                    <button 
                        onClick={() => onAction(item.id, 'resolve')} 
                        title="Als erledigt markieren"
                        className="p-3 hover:bg-k5-lime/10 text-gray-300 hover:text-k5-lime rounded-k5-sm transition-all hover:scale-110 border border-transparent hover:border-k5-lime/20"
                    >
                        <CheckCircle size={20}/>
                    </button>
                    <button 
                        onClick={() => onAction(item.id, 'delete')} 
                        title="Löschen"
                        className="p-3 hover:bg-red-500/10 text-gray-300 hover:text-red-500 rounded-k5-sm transition-all hover:scale-110 border border-transparent hover:border-red-500/20"
                    >
                        <Trash2 size={20}/>
                    </button>
                </div>
            </td>
        </tr>
    );
}