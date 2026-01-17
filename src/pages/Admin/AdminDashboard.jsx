import React, { useState } from 'react';
import { MessageSquare, Users, Shield, Tag, Sparkles } from 'lucide-react';
import AdminUserManagement from './AdminUserManagement.jsx'; 
import FeedbackInbox from './FeedbackInbox.jsx';
import AdminTicketEditor from '../../components/Admin/AdminTicketEditor.jsx';
import { feedbackApi } from '../../services/api.js';

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
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-32 px-4 font-sans">
            {/* Header Area: Aeonik Black, Italic entfernt */}
            <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end mb-16 border-b border-gray-100 dark:border-k5-deep pb-12 gap-8 text-center lg:text-left">
                <div>
                    <h2 className="text-5xl lg:text-6xl font-black text-k5-black dark:text-white flex items-center justify-center lg:justify-start gap-5 tracking-tighter uppercase leading-none">
                        <Shield className="text-k5-digital" size={48}/> Admin <span className="text-k5-digital">Console</span>
                    </h2>
                    <div className="flex items-center gap-3 justify-center lg:justify-start mt-4">
                        <Sparkles size={14} className="text-k5-sand" />
                        <p className="text-k5-sand dark:text-k5-sand/80 font-bold uppercase text-[11px] tracking-[0.4em]">Systemstatus & Feedback Zentrale</p>
                    </div>
                </div>

                {/* Tab Switcher: Aeonik Bold, rounded-k5-md */}
                <div className="bg-k5-light-grey dark:bg-k5-deep/30 p-2 rounded-k5-md flex items-center gap-2 shadow-inner border border-gray-100 dark:border-k5-deep/50">
                    {[
                        { id: 'feedback', icon: MessageSquare, label: 'Feedback' },
                        { id: 'users', icon: Users, label: 'Users' },
                        { id: 'tickets', icon: Tag, label: 'Tickets' }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveSubTab(tab.id)}
                            className={`px-8 py-3.5 rounded-k5-md text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 transition-all active:scale-95 ${
                                activeSubTab === tab.id 
                                ? 'bg-glow-digital text-white shadow-xl shadow-k5-digital/25' 
                                : 'text-k5-sand hover:text-k5-black dark:hover:text-white'
                            }`}
                        >
                            <tab.icon size={16}/> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area: k5-lg Rundung für die inneren Views falls nötig */}
            <div className="min-h-[600px] animate-in slide-in-from-bottom-4 duration-500">
                {activeSubTab === 'feedback' && (
                    <FeedbackInbox 
                        feedbackList={feedbackList} 
                        onRefresh={onRefreshFeedback} 
                        onAction={handleAction}
                        loadingAction={loadingAction}
                    />
                )}
                
                {activeSubTab === 'users' && (
                    <AdminUserManagement currentUser={currentUser} />
                )}

                {activeSubTab === 'tickets' && (
                    <AdminTicketEditor />
                )}
            </div>
        </div>
    );
}