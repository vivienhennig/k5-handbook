import React from 'react';
import { Card, NewsWidget } from './UI';
import UpcomingWidget from './UpcomingWidget';
import Wizard from '../pages/Wizard';
import SupportView from '../pages/SupportView';
import VivenuView from '../pages/VivenuView';
import AccreditationView from '../pages/AccreditationView';
import WebView from '../pages/WebView';
import BrandView from '../pages/BrandView';
import VotingView from '../pages/VotingView';
import AdminUserManagement from '../pages/AdminUserManagement';
import TeamView from '../pages/TeamView';
import VacationView from '../pages/VacationView';
import ResourceView from '../pages/ResourceView';
import CalendarView from '../pages/CalendarView';
import ToolsView from '../pages/ToolsView';
import { SECTIONS_CONFIG } from '../config/data';
import { Star, Settings, Bell, MessageSquare, Lock, Plus, Trash2 } from 'lucide-react';
import { newsApi } from '../services/api';

export default function MainContent({ 
    activeTab, user, isPrivileged, 
    newsFeed, upcomingEvents, userFavorites, 
    handleNav, hasUpdate, toggleFavorite, openFeedback,
    adminFeedbackList, setNewsFeed // Für Admin Dashboard
}) {

    // Helper für Admin Dashboard Logic
    const [newNewsText, setNewNewsText] = React.useState('');
    const [newNewsType, setNewNewsType] = React.useState('info');
    
    const handleAddNews = async () => {
        if(!newNewsText) return;
        const today = new Date();
        const dateStr = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.`;
        const newItem = { date: dateStr, text: newNewsText, type: newNewsType };
        const updated = await newsApi.add(newItem);
        setNewsFeed(updated); setNewNewsText('');
    };
    const handleDeleteNews = async (id) => { const updated = await newsApi.delete(id); setNewsFeed(updated); };

    // --- HOME VIEW ---
    if (activeTab === 'home') {
        const favoriteCards = SECTIONS_CONFIG.filter(sec => userFavorites.includes(sec.id));
        return (
            <div className="animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-16">
                    <h1 className="text-4xl lg:text-6xl font-black text-[#092AFF] dark:text-blue-400 mb-4 tracking-tight">DIGITAL HANDBOOK</h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Der zentrale Leitfaden für Web, Events, Brand & Operations bei K5.</p>
                </div>
                <UpcomingWidget events={upcomingEvents} onNavigate={() => handleNav('calendar')} />
                <NewsWidget news={newsFeed} />
                
                {favoriteCards.length > 0 && (
                    <div className="mb-12"><h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Star className="text-yellow-400 fill-yellow-400" size={24}/> Deine Favoriten</h3><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{favoriteCards.map((sec) => (<Card key={sec.id} icon={sec.icon} title={sec.title} desc={sec.desc} onClick={() => handleNav(sec.id)} isFavorite={true} onToggleFavorite={() => toggleFavorite(sec.id)} hasUpdate={hasUpdate(sec.id)}/>))}</div><div className="h-px bg-gray-200 dark:bg-gray-700 w-full my-12"></div></div>
                )}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{SECTIONS_CONFIG.filter(sec => sec.id !== 'exhibitor').map((sec) => (<Card key={sec.id} icon={sec.icon} title={sec.title} desc={sec.desc} onClick={() => handleNav(sec.id)} isFavorite={userFavorites.includes(sec.id)} onToggleFavorite={user ? () => toggleFavorite(sec.id) : null} hasUpdate={hasUpdate(sec.id)}/>))}</div>
            </div>
        );
    }

    // --- ADMIN VIEW ---
    if (activeTab === 'admin') {
        return (
            <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
                {isPrivileged ? (
                    <>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3"><Settings/> {user.role === 'admin' ? 'Admin Dashboard' : 'Content Dashboard'}</h2>
                        {user.role === 'admin' && <AdminUserManagement />}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2"><Bell size={18}/> News Management</h3>
                            <div className="flex gap-2 mb-4"><input type="text" placeholder="Neue Nachricht..." className="flex-1 border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newNewsText} onChange={e => setNewNewsText(e.target.value)} /><select className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newNewsType} onChange={e => setNewNewsType(e.target.value)}><option value="info">Info</option><option value="alert">Alert</option><option value="update">Update</option></select><button onClick={handleAddNews} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-1 hover:bg-blue-700"><Plus size={16}/> Hinzufügen</button></div>
                            <div className="space-y-2">{newsFeed.map(n => (<div key={n.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-100 dark:border-gray-600"><span className="text-sm dark:text-gray-200"><span className="font-mono text-gray-400 mr-2">{n.date}</span>{n.text} <span className="text-xs uppercase bg-gray-200 dark:bg-gray-600 px-1 rounded ml-2">{n.type}</span></span><button onClick={() => handleDeleteNews(n.firebaseId || n.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button></div>))}</div>
                        </div>
                        {user.role === 'admin' && (
                            <>
                                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2"><MessageSquare size={18}/> Feedback Log</h3>
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">{adminFeedbackList.length === 0 ? <div className="p-8 text-center text-gray-500">Noch kein Feedback vorhanden. 🎉</div> : <div className="divide-y divide-gray-100 dark:divide-gray-700">{adminFeedbackList.map(item => (<div key={item.id} className="p-4 flex gap-4"><div className="text-2xl pt-1">{item.type === 'outdated' ? '⏳' : item.type === 'error' ? '🐛' : '💡'}</div><div className="flex-1"><div className="flex justify-between mb-1"><span className="font-bold text-gray-900 dark:text-white uppercase text-xs tracking-wider bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{item.type}</span><span className="text-xs text-gray-400">{item.createdAt.split('T')[0]} • von {item.userName || 'Gast'}</span></div><div className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">{item.context}</div><div className="text-sm text-gray-600 dark:text-gray-400">{item.comment}</div></div></div>))}</div>}</div>
                            </>
                        )}
                    </>
                ) : <div className="text-center py-20"><div className="text-red-500 mb-4 flex justify-center"><Lock size={48}/></div><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Zugriff verweigert</h2></div>}
            </div>
        );
    }

    // --- SUB PAGES ---
    switch(activeTab) {
        case 'calendar': return <CalendarView currentUser={user} />;
        case 'team': return <TeamView />;
        case 'vacation': return <VacationView currentUser={user} />;
        case 'resources': return <ResourceView />;
        case 'tools': return <ToolsView />;
        case 'tickets': return <TicketView />;
        case 'support': return <SupportView openFeedback={openFeedback} />;
        case 'vivenu': return <VivenuView openFeedback={openFeedback} />;
        case 'accreditation': return <AccreditationView openFeedback={openFeedback} />;
        case 'web': return <WebView openFeedback={openFeedback} />;
        case 'brand': return <BrandView openFeedback={openFeedback} />;
        case 'votings': return <VotingView openFeedback={openFeedback} />;
        case 'automation': return <div className="animate-in zoom-in duration-300"><div className="text-center mb-8"><h2 className="text-3xl font-black text-gray-900 dark:text-white">Automation Check</h2></div><Wizard /></div>;
        default: return null;
    }
}