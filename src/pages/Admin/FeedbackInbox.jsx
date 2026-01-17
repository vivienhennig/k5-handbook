import React from 'react';
import { CheckCircle, RefreshCw } from 'lucide-react';
import FeedbackRow from '../../components/Feedback/FeedbackRow.jsx';

export default function FeedbackInbox({ feedbackList, onRefresh, onAction, loadingAction }) {
    const activeFeedback = React.useMemo(() => {
        if (!feedbackList) return [];
        
        return [...feedbackList]
            .filter(item => item.status !== 'resolved')
            .sort((a, b) => {
                // Konvertierung in Zeitstempel für den Vergleich
                const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt).getTime();
                const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt).getTime();
                return timeB - timeA; // B - A sorgt für absteigende Sortierung (neueste zuerst)
            });
    }, [feedbackList]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/30">
                <div className="flex items-center gap-3">
                    <h3 className="font-black text-gray-900 dark:text-white uppercase italic tracking-widest text-xs">Feedback Inbox</h3>
                    <button 
                        onClick={onRefresh} 
                        className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-all shadow-sm active:rotate-180 duration-500"
                    >
                        <RefreshCw size={14} className="text-blue-600"/>
                    </button>
                </div>
                <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg shadow-blue-500/20">
                    {activeFeedback.length} OFFEN
                </span>
            </div>

            {activeFeedback.length === 0 ? (
                <div className="p-20 text-center text-gray-400">
                    <CheckCircle size={48} className="mx-auto mb-4 opacity-10 text-green-500"/>
                    <p className="font-black uppercase text-[10px] tracking-[0.2em] italic">Alles erledigt. Saubere Arbeit!</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-400 font-black uppercase text-[10px] tracking-widest italic">
                                <th className="px-8 py-4">Zeitpunkt</th>
                                <th className="px-8 py-4">Absender</th>
                                <th className="px-8 py-4">Mitteilung</th>
                                <th className="px-8 py-4 text-right">Aktion</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {activeFeedback.map((item) => (
                                <FeedbackRow 
                                    key={item.id} 
                                    item={item} 
                                    onAction={onAction} 
                                    isLoading={loadingAction === item.id}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}