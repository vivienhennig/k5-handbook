import React from 'react';
import { RefreshCw, CheckCircle, Trash2, MessageSquare } from 'lucide-react';

export default function FeedbackInbox({ feedbackList, onRefresh, onAction, loadingAction }) {
    const activeFeedback = feedbackList?.filter(item => item.status !== 'resolved') || [];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/30">
                <div className="flex items-center gap-3">
                    <h3 className="font-black text-gray-900 dark:text-white uppercase italic tracking-widest text-xs">Feedback Inbox</h3>
                    <button onClick={onRefresh} className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-all shadow-sm active:rotate-180 duration-500">
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
                                <tr key={item.id} className={`hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all ${loadingAction === item.id ? 'opacity-30' : ''}`}>
                                    <td className="px-8 py-6 text-[11px] font-bold text-gray-400">
                                        <div className="flex flex-col">
                                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                            <span className="text-blue-500/50">{new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                    </td>
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
                                            <button onClick={() => onAction(item.id, 'resolve')} className="p-2 hover:bg-green-50 dark:hover:bg-green-900/30 text-green-500 rounded-xl transition-all hover:scale-110">
                                                <CheckCircle size={18}/>
                                            </button>
                                            <button onClick={() => onAction(item.id, 'delete')} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-400 rounded-xl transition-all hover:scale-110">
                                                <Trash2 size={18}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}