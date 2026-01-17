import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userApi, contentApi, eventApi } from '../../services/api';
import { EVENT_TYPES } from '../../config/data';
import { useToast } from '../../context/ToastContext.jsx';

import UniversalWikiView from '../Wiki/UniversalWikiView.jsx';
import EventDetailModal from '../Calendar/EventDetailModal.jsx';
import Footer from './Footer.jsx';
import BirthdayCard from '../Dashboard/BirthdayCard.jsx';
import EventGrid from '../Dashboard/EventGrid.jsx';
import ActivityFeed from '../Dashboard/ActivityFeed.jsx';
import TicketPriceCard from '../Dashboard/TicketPriceCard.jsx';
import TicketStatsCard from '../Dashboard/TicketStatsCard.jsx';
import BirthdaySurprise from '../Dashboard/BirthdaySurprise.jsx';

import VacationView from '../../pages/VacationView.jsx';
import CalendarView from '../../pages/CalendarView.jsx';
import AdminDashboard from '../../pages/Admin/AdminDashboard.jsx';
import TeamView from '../../pages/TeamView.jsx';
import ToolsView from '../../pages/ToolsView.jsx';
import ResourceView from '../../pages/ResourceView.jsx';
import AutomationView from '../../pages/AutomationView.jsx';
import LocationView from '../../pages/LocationView.jsx';
import QRCodeView from '../../pages/QRCodeView.jsx';
import EnergyHeader from '../Dashboard/EnergyHeader.jsx';

export default function MainContent({ 
    user, upcomingEvents, isPrivileged, onRefreshFeedback, adminFeedbackList 
}) {
    // URL Parameter auslesen
    const { tabId, wikiId } = useParams();
    const navigate = useNavigate();
    const activeTab = wikiId ? wikiId : tabId;

    const [birthdayKids, setBirthdayKids] = useState([]);
    const [customWikis, setCustomWikis] = useState([]);
    const [activities, setActivities] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const { addToast } = useToast();

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const users = await userApi.getAllUsers();
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Zeit auf Mitternacht setzen für exakten Vergleich

            const upcoming = users.filter(u => {
                if (!u.birthDate) return false;

                // FIX: Falls das Format DD.MM.YYYY ist, wandeln wir es um
                let dateStr = u.birthDate;
                if (dateStr.includes('.')) {
                    const [day, month, year] = dateStr.split('.');
                    dateStr = `${year}-${month}-${day}`;
                }

                const bDay = new Date(dateStr);
                if (isNaN(bDay)) return false; // Ungültiges Datum ignorieren

                let next = new Date(today.getFullYear(), bDay.getMonth(), bDay.getDate());
            
                // Wenn der Geburtstag dieses Jahr schon war, nimm das nächste Jahr
                if (next < today) {
                    next.setFullYear(today.getFullYear() + 1);
            }

                // Wir speichern das berechnete Datum für den Vergleich
                u.nextBirthday = next;
            // Prüfen, ob der Geburtstag heute oder in den nächsten 14 Tagen ist
            const diffTime = next - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // 0 bedeutet heute
            return diffDays >= 0 && diffDays <= 14;
        }).sort((a, b) => a.nextBirthday - b.nextBirthday);
        
        setBirthdayKids(upcoming);

                const [navData, latestActions] = await Promise.all([
                    contentApi.getGuideline('settings_navigation'),
                    contentApi.getLatestActivities(5)
                ]);
                
                if (navData?.customWikis) setCustomWikis(navData.customWikis);
                setActivities(latestActions);
            } catch (e) { console.error("Dashboard Load Error:", e); }
        };
        loadDashboardData();
    }, [activeTab]);

    const handleRSVP = async (eventId, status) => {
        if (!eventId || !user) return;
        try {
            await eventApi.updateRSVP(eventId, user.uid, status, user.displayName);
            setSelectedEvent(prev => {
                if (!prev || prev.id !== eventId) return prev;
                return { ...prev, participants: { ...prev.participants, [user.uid]: { status, name: user.displayName, updatedAt: new Date().toISOString() } } };
            });
            addToast(status === 'going' ? "Zusage gespeichert! 🎉" : "Absage gespeichert.");
        } catch (error) { addToast("Fehler", "error"); }
    };

    const getTimeAgo = (timestamp) => {
        const diff = (new Date() - new Date(timestamp)) / 1000;
        if (diff < 60) return 'Gerade eben';
        if (diff < 3600) return `${Math.floor(diff / 60)} Min.`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} Std.`;
        return new Date(timestamp).toLocaleDateString();
    };

    // Navigation innerhalb des Contents (z.B. Activity Feed)
    const handleInternalNav = (id) => navigate(`/wiki/${id}`);

    if (activeTab === 'home') {
        return (
            <div className="animate-in fade-in duration-500 font-sans max-w-7xl mx-auto px-4">
                <BirthdaySurprise birthdayKids={birthdayKids} />
                <div className="mb-10">
                    <EnergyHeader user={user} />
                </div>
                <div className="grid grid-cols-1 gap-10 mb-10">
                    <TicketStatsCard />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    <BirthdayCard birthdayKids={birthdayKids} />
                    <EventGrid upcomingEvents={upcomingEvents} onSelectEvent={setSelectedEvent} eventTypes={EVENT_TYPES} />
                </div>
                <div className="grid grid-cols-1 gap-10 mb-10">
                    <TicketPriceCard />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <ActivityFeed activities={activities} handleNav={handleInternalNav} getTimeAgo={getTimeAgo} />
                </div>
                {selectedEvent && (
                    <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} currentUser={user} onRSVP={handleRSVP} isPrivileged={false} />
                )}
                <Footer />
            </div>
        );
    }


    if (activeTab === 'calendar') return <CalendarView currentUser={user} />;
    if (activeTab === 'vacation') return <VacationView currentUser={user} />;
    if (activeTab === 'team')     return <TeamView />;
    if (activeTab === 'tools')    return <ToolsView handleNav={handleInternalNav} />;
    if (activeTab === 'admin')    return <AdminDashboard feedbackList={adminFeedbackList} onRefreshFeedback={onRefreshFeedback} currentUser={user} />;
    if (activeTab === 'resources') return <ResourceView />;
    if (activeTab === 'automation') return <AutomationView />;
    if (activeTab === 'qrcode') return <QRCodeView />;
    if (activeTab === 'location') return <LocationView />;

    const currentWiki = customWikis.find(w => w.id === activeTab);
    if (currentWiki) {
        return (
            <UniversalWikiView 
                key={currentWiki.id}
                icon={currentWiki.icon} 
                currentUser={user} 
                wikiId={currentWiki.id} 
                title={currentWiki.title} 
                handleNav={handleInternalNav} 
                customWikis={customWikis}
            />
        );
    }

    return <div className="p-20 text-center text-gray-400 uppercase font-black italic tracking-widest">Seite nicht gefunden</div>;
}