import React from 'react';
import { CheckCircle, RefreshCw, Sparkles } from 'lucide-react';
import FeedbackRow from '../../components/Feedback/FeedbackRow.jsx';

export default function FeedbackInbox({ feedbackList, onRefresh, onAction, loadingAction }) {
    const activeFeedback = React.useMemo(() => {
        if (!feedbackList) return [];
        
        return [...feedbackList]
            .filter(item => item.status !== 'resolved')
            .sort((a, b) => {
                const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt).getTime();
                const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt).getTime();
                return timeB - timeA; 
            });
    }, [feedbackList]);

    return (
        <div className="bg-white dark:bg-k5-black rounded-k5-lg shadow-sm border border-gray-100 dark:border-k5-deep overflow-hidden animate-in slide-in-from-bottom-4 duration-500 font-sans">
            {/* Header: Italic entfernt, Aeonik Bold genutzt */}
            <div className="p-8 border-b border-gray-100 dark:border-k5-deep flex justify-between items-center bg-k5-light-grey/30 dark:bg-k5-deep/20">
                <div className="flex items-center gap-4">
                    <h3 className="font-bold text-k5-black dark:text-white uppercase tracking-[0.2em] text-[11px]">Feedback Inbox</h3>
                    <button 
                        onClick={onRefresh} 
                        className="p-2.5 bg-white dark:bg-k5-black hover:bg-k5-light-grey dark:hover:bg-k5-deep rounded-k5-sm transition-all shadow-sm active:rotate-180 duration-500 border border-gray-100 dark:border-k5-deep"
                    >
                        <RefreshCw size={14} className="text-k5-digital"/>
                    </button>
                </div>
                <div className="flex items-center gap-2 bg-glow-digital px-4 py-2 rounded-full shadow-lg shadow-k5-digital/20">
                    <Sparkles size={12} className="text-white" />
                    <span className="text-white text-[10px] font-bold uppercase tracking-widest">
                        {activeFeedback.length} Offen
                    </span>
                </div>
            </div>

            {activeFeedback.length === 0 ? (
                <div className="p-24 text-center">
                    <div className="w-20 h-20 bg-k5-lime-light rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <CheckCircle size={40} className="text-k5-deep opacity-80"/>
                    </div>
                    <p className="font-bold uppercase text-[11px] tracking-[0.3em] text-k5-sand">Alles erledigt. Saubere Arbeit!</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-k5-light-grey/20 dark:bg-k5-deep/10 text-gray-400 font-bold uppercase text-[9px] tracking-[0.25em] border-b border-gray-100 dark:border-k5-deep">
                                <th className="px-10 py-5">Zeitpunkt</th>
                                <th className="px-10 py-5">Absender</th>
                                <th className="px-10 py-5">Mitteilung</th>
                                <th className="px-10 py-5 text-right">Aktion</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-k5-deep/30">
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