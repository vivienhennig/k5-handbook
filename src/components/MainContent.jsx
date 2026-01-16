import React, { useState, useEffect } from 'react';
import { userApi, contentApi, eventApi } from '../services/api';
import { EVENT_TYPES } from '../config/data';
import { useToast } from '../context/ToastContext';

// Components
import UniversalWikiView from './UniversalWikiView';
import EventDetailModal from '../components/EventDetailModal';
import Footer from './Footer';

// Ausgelagerte Dashboard-Widgets
import BirthdayCard from './Dashboard/BirthdayCard';
import EventGrid from './Dashboard/EventGrid';
import ActivityFeed from './Dashboard/ActivityFeed';

// Views / Pages
import VacationView from '../pages/VacationView';
import CalendarView from '../pages/CalendarView';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import TeamView from '../pages/TeamView';
import ToolsView from '../pages/ToolsView';
import ResourceView from '../pages/ResourceView';
import AutomationView from '../pages/AutomationView';
import LocationView from '../pages/LocationView';
import QRCodeView from '../pages/QRCodeView';

export default function MainContent({ 
    user, activeTab, upcomingEvents, handleNav, 
    isPrivileged, onRefreshFeedback, adminFeedbackList 
}) {
    const [birthdayKids, setBirthdayKids] = useState([]);
    const [customWikis, setCustomWikis] = useState([]);
    const [activities, setActivities] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const { addToast } = useToast();

    // 1. DASHBOARD DATEN LADEN
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                // Geburtstage berechnen
                const users = await userApi.getAllUsers();
                const today = new Date();
                const nextTwoWeeks = new Date(today);
                nextTwoWeeks.setDate(today.getDate() + 14);

                const upcoming = users.filter(u => {
                    if (!u.birthDate) return false;
                    const bDay = new Date(u.birthDate);
                    const thisYear = new Date(today.getFullYear(), bDay.getMonth(), bDay.getDate());
                    if (thisYear < today) thisYear.setFullYear(today.getFullYear() + 1);
                    return thisYear >= today && thisYear <= nextTwoWeeks;
                }).map(u => {
                    const bDay = new Date(u.birthDate);
                    let next = new Date(today.getFullYear(), bDay.getMonth(), bDay.getDate());
                    if (next < today) next.setFullYear(today.getFullYear() + 1);
                    return { ...u, nextBirthday: next };
                }).sort((a,b) => a.nextBirthday - b.nextBirthday);
                
                setBirthdayKids(upcoming);

                // Wikis & Handbook Aktivitäten parallel laden
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

    // 2. RSVP LOGIK
    const handleRSVP = async (eventId, status) => {
        // 1. Sicherheitscheck
        if (!eventId || !user) {
            addToast("Fehler: Nutzer oder Event nicht erkannt", "error");
            return;
        }

        try {
            // 2. API Call ausführen
            await eventApi.updateRSVP(eventId, user.uid, status, user.displayName);

            // 3. Den State im Parent aktualisieren
            // Wir nutzen eine Funktion in setSelectedEvent, um sicherzustellen, 
            // dass wir auf dem aktuellsten Stand arbeiten
            setSelectedEvent(prevEvent => {
                if (!prevEvent || prevEvent.id !== eventId) return prevEvent;

                // Neue Teilnehmer-Liste erstellen
                const updatedParticipants = {
                    ...(prevEvent.participants || {}),
                    [user.uid]: {
                        status: status,
                        name: user.displayName,
                        updatedAt: new Date().toISOString()
                    }
                };

                // Das aktualisierte Event-Objekt zurückgeben
                return {
                    ...prevEvent,
                    participants: updatedParticipants
                };
            });

            // 4. Feedback an den User
            addToast(status === 'going' ? "Zusage gespeichert! 🎉" : "Absage gespeichert.");
        
            // 5. Hintergrund-Daten aktualisieren (falls vorhanden)
            if (typeof loadEvents === 'function') {
                await loadEvents();
            }

        } catch (error) {
            console.error("RSVP Error:", error);
            addToast("Fehler beim Speichern der Teilnahme", "error");
        }
    };

    // 3. HILFSFUNKTION ZEITSTEMPEL
    const getTimeAgo = (timestamp) => {
        const diff = (new Date() - new Date(timestamp)) / 1000;
        if (diff < 60) return 'Gerade eben';
        if (diff < 3600) return `${Math.floor(diff / 60)} Min.`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} Std.`;
        return new Date(timestamp).toLocaleDateString();
    };

    // --- RENDER HOME / DASHBOARD ---
    if (activeTab === 'home') {
        return (
            <div className="animate-in fade-in duration-500 font-sans max-w-7xl mx-auto px-4">
                <div className="mb-10">
                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tight italic">
                        Hallo, <span className="text-blue-600">{user?.displayName?.split(' ')[0] || "K5ler"}</span>! 👋
                    </h1>
                </div>

                {/* Oberes Grid: Geburtstage & Events */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    <BirthdayCard birthdayKids={birthdayKids} />
                    
                    <EventGrid 
                        upcomingEvents={upcomingEvents} 
                        onSelectEvent={setSelectedEvent} 
                        eventTypes={EVENT_TYPES} 
                    />
                </div>

                {/* Unteres Grid: Aktivitäten Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <ActivityFeed 
                        activities={activities} 
                        handleNav={handleNav} 
                        getTimeAgo={getTimeAgo} 
                    />
                </div>

                {selectedEvent && (
                    <EventDetailModal 
                        event={selectedEvent} 
                        onClose={() => setSelectedEvent(null)} 
                        currentUser={user} 
                        onRSVP={handleRSVP} 
                        isPrivileged={false} 
                    />
                )}
                <Footer />
            </div>
        );
    }

    // --- ROUTER FÜR ANDERE TABS ---
    if (activeTab === 'calendar') return <CalendarView currentUser={user} />;
    if (activeTab === 'vacation') return <VacationView currentUser={user} />;
    if (activeTab === 'team')     return <TeamView />;
    if (activeTab === 'tools')    return <ToolsView handleNav={handleNav} />;
    if (activeTab === 'admin')    return <AdminDashboard feedbackList={adminFeedbackList} onRefreshFeedback={onRefreshFeedback} currentUser={user} />;
    if (activeTab === 'resources') return <ResourceView />;
    if (activeTab === 'automation') return <AutomationView />;
    if (activeTab === 'qrcode') return <QRCodeView />;
    if (activeTab === 'location') return <LocationView />;

    // --- WIKI ROUTER ---
    const currentWiki = customWikis.find(w => w.id === activeTab);
    if (currentWiki) {
        return (
            <UniversalWikiView 
                key={currentWiki.id} 
                currentUser={user} 
                wikiId={currentWiki.id} 
                title={currentWiki.title} 
                handleNav={handleNav} 
            />
        );
    }

    return (
        <div className="p-20 text-center text-gray-400 uppercase font-black italic tracking-widest">
            Node nicht gefunden
        </div>
    );
}