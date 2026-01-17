import React from 'react';
import { CheckCircle, Trash2 } from 'lucide-react';

export default function FeedbackRow({ item, onAction, isLoading }) {
    // Hilfsfunktion zur Konvertierung von Firestore Timestamps oder Strings
    const formatDate = (dateInput) => {
        try {
            if (!dateInput) return { date: 'Kein Datum', time: '' };
            
            let d;
            // Falls es ein Firestore Timestamp Objekt ist
            if (dateInput.seconds) {
                d = new Date(dateInput.seconds * 1000);
            } else {
                // Falls es ein ISO-String oder Millisekunden sind
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
        <tr className={`hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all ${isLoading ? 'opacity-30 pointer-events-none' : ''}`}>
            <td className="px-8 py-6 text-[11px] font-bold text-gray-400">
                <div className="flex flex-col">
                    <span>{formatted.date}</span>
                    <span className="text-blue-500/50">{formatted.time}</span>
                </div>
            </td>
            {/* ... Rest der Komponente bleibt identisch ... */}
            <td className="px-8 py-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-[10px] font-black">
                        {item.user?.charAt(0) || '?'}
                    </div>
                    <div className="min-w-0">
                        <div className="text-xs font-black text-gray-900 dark:text-white uppercase truncate">{item.user}</div>
                        <div className="text-[9px] font-mono text-gray-400 bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded mt-1 inline-block">
                            @{item.context || 'General'}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-8 py-6 text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed">
                "{item.text}"
            </td>
            <td className="px-8 py-6 text-right">
                <div className="flex justify-end gap-2">
                    <button 
                        onClick={() => onAction(item.id, 'resolve')} 
                        className="p-2 hover:bg-green-50 dark:hover:bg-green-900/30 text-green-500 rounded-xl transition-all hover:scale-110"
                    >
                        <CheckCircle size={18}/>
                    </button>
                    <button 
                        onClick={() => onAction(item.id, 'delete')} 
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-400 rounded-xl transition-all hover:scale-110"
                    >
                        <Trash2 size={18}/>
                    </button>
                </div>
            </td>
        </tr>
    );
}