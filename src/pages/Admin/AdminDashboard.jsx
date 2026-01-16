import React, { useState } from 'react';
import { MessageSquare, Users, Shield } from 'lucide-react';
import AdminUserManagement from './AdminUserManagement'; 
import FeedbackInbox from './FeedbackInbox'; // Neu importiert
import { feedbackApi } from '../../services/api';

export default function AdminDashboard({ feedbackList = [], onRefreshFeedback, currentUser }) {
    const [activeSubTab, setActiveSubTab] = useState('feedback');
    const [loadingAction, setLoadingAction] = useState(null);

    const handleAction = async (id, actionType) => {
        if (actionType === 'delete' && !window.confirm("Eintrag wirklich löschen?")) return;
        setLoadingAction(id);
        try {
            if (actionType === 'delete') await feedbackApi.delete(id);
            else if (actionType === 'resolve') await feedbackApi.resolve(id);
            if (onRefreshFeedback) await onRefreshFeedback();
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingAction(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-20 px-4 font-sans">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-gray-100 dark:border-gray-800 pb-8 gap-6">
                <div>
                    <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white flex items-center gap-4 italic tracking-tight uppercase">
                        <Shield className="text-red-600" size={40}/> Admin <span className="text-blue-600">Console</span>
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-bold uppercase text-xs tracking-widest italic">Systemstatus & Feedback Zentrale</p>
                </div>

                {/* Tab Switcher */}
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-2xl flex items-center gap-2 shadow-inner">
                    {[
                        { id: 'feedback', icon: MessageSquare, label: 'Feedback' },
                        { id: 'users', icon: Users, label: 'Users' }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveSubTab(tab.id)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                                activeSubTab === tab.id 
                                ? 'bg-white dark:bg-gray-700 shadow-lg text-blue-600' 
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            <tab.icon size={14}/> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {activeSubTab === 'feedback' ? (
                    <FeedbackInbox 
                        feedbackList={feedbackList} 
                        onRefresh={onRefreshFeedback} 
                        onAction={handleAction}
                        loadingAction={loadingAction}
                    />
                ) : (
                    <AdminUserManagement currentUser={currentUser} />
                )}
            </div>
        </div>
    );
}