import React, { useState } from 'react';
import { MessageSquare, Users, Shield, CheckCircle, Trash2, RefreshCw } from 'lucide-react';
import AdminUserManagement from './AdminUserManagement'; 
import { feedbackApi } from '../services/api'; // <--- API Importieren

export default function AdminDashboard({ feedbackList = [], onRefreshFeedback, currentUser }) {
    const [activeSubTab, setActiveSubTab] = useState('feedback');
    const [loadingAction, setLoadingAction] = useState(null);

    // Funktion zum Löschen/Erledigen (ruft Backend auf)
    const handleAction = async (id, actionType) => {
        if (actionType === 'delete' && !window.confirm("Eintrag wirklich löschen?")) return;
        
        setLoadingAction(id);
        try {
            if (actionType === 'delete') {
                await feedbackApi.delete(id);
            } else if (actionType === 'resolve') {
                await feedbackApi.resolve(id);
            }
            
            // Liste neu laden (ruft Funktion in App.jsx auf)
            if (onRefreshFeedback) await onRefreshFeedback();
            
        } catch (error) {
            console.error(error);
            alert("Fehler bei der Aktion");
        } finally {
            setLoadingAction(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <Shield className="text-red-500"/> Admin Konsole
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">Systemstatus & Feedback Zentrale.</p>
                </div>

                {/* Tab Switcher */}
                <div className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-xl flex items-center gap-1">
                    <button 
                        onClick={() => setActiveSubTab('feedback')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                            activeSubTab === 'feedback' 
                            ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' 
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                        <MessageSquare size={16}/> Feedback
                    </button>
                    <button 
                        onClick={() => setActiveSubTab('users')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                            activeSubTab === 'users' 
                            ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' 
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                        <Users size={16}/> Users
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                
                {/* TAB 1: FEEDBACK */}
                {activeSubTab === 'feedback' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Posteingang</h3>
                                <button onClick={onRefreshFeedback} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" title="Neu laden">
                                    <RefreshCw size={14} className="text-gray-400"/>
                                </button>
                            </div>
                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                                {feedbackList?.length || 0}
                            </span>
                        </div>

                        {(!feedbackList || feedbackList.length === 0) ? (
                            <div className="p-12 text-center text-gray-400">
                                <CheckCircle size={48} className="mx-auto mb-4 opacity-20"/>
                                <p>Kein offenes Feedback vorhanden.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 font-bold uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-3 rounded-l-lg">Datum</th>
                                            <th className="px-4 py-3">User</th>
                                            <th className="px-4 py-3">Nachricht</th>
                                            <th className="px-4 py-3 rounded-r-lg text-right">Aktion</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {feedbackList.map((item) => {
                                            const safeUser = item.user || 'Unbekannt';
                                            const safeInitial = safeUser.charAt(0) || '?';
                                            const isDeleting = loadingAction === item.id;
                                            const isResolved = item.status === 'resolved';

                                            if (isResolved) return null; // Erledigte ausblenden (optional)

                                            return (
                                                <tr key={item.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-opacity ${isDeleting ? 'opacity-50' : ''}`}>
                                                    <td className="px-4 py-4 text-gray-400 whitespace-nowrap align-top w-32">
                                                        <div className="flex flex-col">
                                                            <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}</span>
                                                            <span className="text-[10px]">{item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 font-bold text-gray-900 dark:text-white align-top w-48">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-[10px] font-black shrink-0">
                                                                {safeInitial}
                                                            </div>
                                                            <span className="truncate">{safeUser}</span>
                                                        </div>
                                                        <div className="mt-1 ml-8">
                                                            <span className="bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded text-[10px] font-mono border border-gray-200 dark:border-gray-600 text-gray-500">
                                                                {item.context || 'General'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300 align-top">
                                                        {item.text || '-'}
                                                    </td>
                                                    <td className="px-4 py-4 text-right align-top w-24">
                                                        <div className="flex justify-end gap-2">
                                                            <button 
                                                                onClick={() => handleAction(item.id, 'resolve')} 
                                                                disabled={isDeleting}
                                                                className="p-1.5 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 rounded-lg transition-colors disabled:opacity-50" 
                                                                title="Als Erledigt markieren"
                                                            >
                                                                <CheckCircle size={18}/>
                                                            </button>
                                                            <button 
                                                                onClick={() => handleAction(item.id, 'delete')} 
                                                                disabled={isDeleting}
                                                                className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors disabled:opacity-50" 
                                                                title="Löschen"
                                                            >
                                                                <Trash2 size={18}/>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 2: USER MANAGEMENT */}
                {activeSubTab === 'users' && (
                    <AdminUserManagement currentUser={currentUser} />
                )}

            </div>
        </div>
    );
}