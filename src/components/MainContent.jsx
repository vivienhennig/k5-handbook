import React, { useState, useEffect } from 'react';
import { 
  Layout, Calendar, Palmtree, Users, Wrench, Layers, 
  ArrowRight, Star, Clock, AlertCircle, ExternalLink, 
  ChevronRight, MessageSquare, Megaphone, CheckCircle, 
  QrCode, Shield, MapPin, Ticket, Tag, TrendingUp, Construction,
  Cake, Gift // <-- Icons hinzugefügt
} from 'lucide-react';
import { SECTIONS_CONFIG, EVENT_TYPES, TICKET_PHASES } from '../config/data';
import { userApi } from '../services/api'; // <-- API Import für Geburtstage
import confetti from 'canvas-confetti'; // <-- Neu

// Import Pages (Standard)
import VacationView from '../pages/VacationView';
import CalendarView from '../pages/CalendarView';
import AdminDashboard from '../pages/AdminDashboard';
import TeamView from '../pages/TeamView';
import ToolsView from '../pages/ToolsView';
import QRCodeView from '../pages/QRCodeView';
import ResourceView from '../pages/ResourceView';
import LocationView from '../pages/LocationView';

// Import Pages (Event Ops & Guidelines)
import AccreditationView from '../pages/AccreditationView';
import BrandView from '../pages/BrandView';
import SupportView from '../pages/SupportView';
import VivenuView from '../pages/VivenuView';
import WebView from '../pages/WebView';
import VotingView from '../pages/VotingView';
import AutomationView from '../pages/AutomationView';

// Footer Import
import Footer from './Footer';

export default function MainContent({ 
    user, activeTab, newsFeed, upcomingEvents, 
    userFavorites, handleNav, toggleFavorite, hasUpdate,
    adminFeedbackList, isPrivileged, openFeedback, onRefreshFeedback 
}) {

    const [birthdayKids, setBirthdayKids] = useState([]);

    useEffect(() => {
        if (activeTab === 'home') {
            loadBirthdays();
        }
    }, [activeTab]);

    const loadBirthdays = async () => {
        try {
            const users = await userApi.getAllUsers();
            const today = new Date();
            today.setHours(0, 0, 0, 0);
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

            // --- ROBUSTER KONFETTI-CHECK ---
            const hasBirthdayToday = upcoming.some(kid => {
                const bDayStr = kid.nextBirthday.toDateString();
                const todayStr = new Date().toDateString();
                return bDayStr === todayStr;
            });

            // Prüfen, ob heute jemand Geburtstag hat UND ob wir heute schon gefeuert haben
            const confettiKey = `confetti_fired_${new Date().toISOString().split('T')[0]}`;
            const alreadyFired = sessionStorage.getItem(confettiKey);

            if (hasBirthdayToday && !alreadyFired) {
                fireConfetti();
                // Wir speichern im SessionStorage, dass für heute erledigt ist
                sessionStorage.setItem(confettiKey, 'true');
            }
        } catch (e) { 
            console.error("Fehler beim Laden der Geburtstage:", e); 
        }
    };

    // Hilfsfunktion für das Konfetti-Spektakel
    const fireConfetti = () => {
        const duration = 3 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#2563eb', '#f43f5e', '#fbbf24'] // K5 Farben (Blau, Rose, Gelb)
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#2563eb', '#f43f5e', '#fbbf24']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 5) return "Hallo Nachteule";
        if (hour < 11) return "Guten Morgen";
        if (hour < 18) return "Guten Tag";
        return "Guten Abend";
    };

    const parseDate = (dateInput) => {
        if (!dateInput) return null;
        if (typeof dateInput === 'object' && typeof dateInput.toDate === 'function') return dateInput.toDate();
        if (dateInput instanceof Date) return dateInput;
        const d = new Date(dateInput);
        if (!isNaN(d.getTime())) return d; 
        if (typeof dateInput === 'string' && dateInput.includes('.')) {
            const parts = dateInput.split('.');
            if (parts.length >= 3) return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
        return null;
    };

    // --- WIDGET: TICKET COUNTDOWN ---
    const TicketWidget = () => {
        const today = new Date();
        const currentYear = today.getFullYear();
        
        const activePhase = TICKET_PHASES?.find(phase => {
            if (!phase.date) return false;
            const cleanDate = phase.date.replace('bis ', '').trim();
            const [day, month] = cleanDate.split('.');
            const phaseDeadline = new Date(currentYear, parseInt(month) - 1, parseInt(day), 23, 59, 59);
            return phaseDeadline >= today;
        });

        let daysLeft = 0;
        if (activePhase) {
            const cleanDate = activePhase.date.replace('bis ', '').trim();
            const [day, month] = cleanDate.split('.');
            const phaseDeadline = new Date(currentYear, parseInt(month) - 1, parseInt(day), 23, 59, 59);
            const diffTime = phaseDeadline - today;
            daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        }

        if (!activePhase) {
            return (
                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl text-white shadow-xl relative overflow-hidden h-full flex items-center justify-center p-6 text-center">
                    <div className="z-10">
                        <Ticket size={48} className="mx-auto mb-2 text-white/50"/>
                        <h3 className="text-xl font-bold text-white">Keine aktive Ticketphase</h3>
                        <p className="text-blue-200 text-sm">Der Verkauf ist aktuell pausiert oder beendet.</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl text-white shadow-xl relative overflow-hidden group flex flex-col h-full">
                <div className="absolute -right-6 -bottom-12 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform rotate-12">
                    <Ticket size={200} />
                </div>
                <div className="p-8 flex flex-col justify-between h-full relative z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Aktuelle Phase</span>
                                <span className="text-xs text-blue-200 font-medium">Endet am {activePhase.date.replace('bis ', '')}</span>
                            </div>
                            <h3 className="text-3xl font-black tracking-tight text-white mb-1">{activePhase.name}</h3>
                            <p className="text-blue-100 text-sm flex items-center gap-1">
                                <Clock size={14}/> Noch <span className="font-bold text-white">{daysLeft} Tage</span> zum aktuellen Preis
                            </p>
                        </div>
                        <div className="hidden sm:flex flex-col items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 w-20 h-20 rounded-full shadow-lg">
                            <span className="text-2xl font-black">{daysLeft}</span>
                            <span className="text-[9px] uppercase tracking-wider">Tage</span>
                        </div>
                    </div>
                    <div className="flex-1"></div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-black/30 transition-colors">
                            <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-1"><Tag size={12}/> Retailer</div>
                            <div className="text-2xl font-black text-white">{activePhase.price}</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-colors">
                            <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-1"><TrendingUp size={12}/> Non-Retailer</div>
                            <div className="text-2xl font-black text-white">{activePhase.nonRetailer}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // --- WIDGET: Upcoming Events ---
    const UpcomingWidget = () => (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Calendar size={18} className="text-blue-500"/> Anstehend
                </h3>
                <button onClick={() => handleNav('calendar')} className="text-xs text-blue-500 hover:underline">Alle</button>
            </div>
            <div className="flex-1 space-y-3">
                {upcomingEvents.length > 0 ? (
                    upcomingEvents.map(evt => {
                        const rawStart = evt.start || evt.startDate;
                        const dateObj = parseDate(rawStart);
                        const day = dateObj ? dateObj.getDate() : '--';
                        const month = dateObj ? dateObj.toLocaleString('de-DE', {month: 'short'}) : '---';
                        const typeConfig = EVENT_TYPES[evt.type] || EVENT_TYPES['external'];
                        return (
                            <div key={evt.id} 
                                 onClick={() => handleNav('calendar')}
                                 className={`flex gap-3 items-start group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-3 rounded-lg transition-all shadow-sm border border-gray-100 dark:border-gray-700 border-l-4 ${typeConfig.border}`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center shrink-0 transition-colors ${typeConfig.color}`}>
                                    <span className="text-[10px] font-bold uppercase leading-none opacity-80">{month}</span>
                                    <span className="text-sm font-black leading-none">{day}</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate group-hover:text-blue-600 transition-colors">{evt.title}</h4>
                                    <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-1">
                                        <Clock size={10}/> <span>{evt.location || 'K5 HQ'}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm py-4">
                        <Calendar size={24} className="mb-2 opacity-20"/>
                        <span>Keine Termine</span>
                    </div>
                )}
            </div>
        </div>
    );

    // --- WIDGET: BIRTHDAYS ---
    const BirthdayWidget = () => (
        <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden h-full group">
            <div className="absolute -right-4 -bottom-4 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform rotate-12">
                <Gift size={120} />
            </div>
            <h3 className="font-bold text-white mb-4 flex items-center gap-2 relative z-10">
                <Cake size={18}/> Geburtstage
            </h3>
            <div className="space-y-3 relative z-10">
                {birthdayKids.length > 0 ? birthdayKids.map(kid => {
                    const isToday = kid.nextBirthday.toDateString() === new Date().toDateString();
                    return (
                        <div key={kid.uid} className="flex items-center gap-3 bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/5">
                            <div className="w-8 h-8 rounded-full bg-white text-pink-600 flex items-center justify-center text-xs font-black shadow-sm">
                                {kid.displayName?.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold truncate text-white">{kid.displayName}</div>
                                <div className="text-[10px] opacity-80 truncate">{kid.department || 'K5 Team'}</div>
                            </div>
                            <div className={`text-[10px] font-bold px-2 py-1 rounded-lg ${isToday ? 'bg-yellow-400 text-yellow-900 animate-pulse' : 'bg-white/20 text-white'}`}>
                                {isToday ? 'HEUTE 🥳' : kid.nextBirthday.toLocaleDateString('de-DE', {day: '2-digit', month: '2-digit'})}
                            </div>
                        </div>
                    );
                }) : (
                    <div className="text-xs opacity-70 italic text-center py-4 text-white">Keine Geburtstage in Sicht...</div>
                )}
            </div>
        </div>
    );

    // --- VIEW: HOME DASHBOARD ---
    if (activeTab === 'home') {
        const greeting = getGreeting();
        const firstName = user?.displayName?.split(' ')[0] || user?.name || 'K5ler';
        const favoriteCards = SECTIONS_CONFIG.filter(sec => userFavorites.includes(sec.id));

        return (
            <div className="animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-10">
                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                        {greeting}, <span className="text-blue-600 dark:text-blue-400">{firstName}</span>! 👋
                    </h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        Schön, dass du da bist. Hier ist dein Überblick für heute.
                    </p>
                </div>

                {/* Dashboard Grid - Jetzt 3-Spaltig auf Desktop */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 items-stretch">
                    <div className="md:col-span-1 lg:col-span-2"><TicketWidget /></div>
                    <div className="md:col-span-1 flex flex-col gap-6">
                        <div className="flex-1"><UpcomingWidget /></div>
                        <div className="flex-1"><BirthdayWidget /></div>
                    </div>
                </div>

                {favoriteCards.length > 0 && (
                    <div className="mb-10">
                        <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Star size={14} className="fill-yellow-400 text-yellow-400"/> Deine Favoriten
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {favoriteCards.map(sec => (
                                <button key={sec.id} onClick={() => handleNav(sec.id)} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-blue-200 transition-all text-left flex items-center gap-3 group">
                                    <div className={`p-2 rounded-lg bg-${sec.color}-100 dark:bg-${sec.color}-900/30 text-${sec.color}-600`}>
                                        <sec.icon size={20}/>
                                    </div>
                                    <span className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{sec.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-4">Guidelines & Departments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {SECTIONS_CONFIG.map((section) => {
                        const isFav = userFavorites.includes(section.id);
                        const updated = hasUpdate && hasUpdate(section.id);
                        return (
                            <div key={section.id} 
                                onClick={() => handleNav(section.id)}
                                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
                            >
                                {updated && <div className="absolute top-4 right-4 flex items-center gap-1 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full"><AlertCircle size={10}/> NEU</div>}
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-12 h-12 rounded-xl bg-${section.color}-100 dark:bg-${section.color}-900/30 text-${section.color}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <section.icon size={24} />
                                    </div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); toggleFavorite(section.id); }}
                                        className={`p-2 rounded-full transition-colors ${isFav ? 'text-yellow-400 hover:bg-yellow-50' : 'text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                    >
                                        <Star size={18} className={isFav ? "fill-current" : ""} />
                                    </button>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">{section.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 h-10 line-clamp-2">{section.desc}</p>
                                <div className="flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
                                    Öffnen <ArrowRight size={16} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <Footer />
            </div>
        );
    }

    // --- STANDARD VIEWS ---
    if (activeTab === 'calendar') return <CalendarView currentUser={user} />;
    if (activeTab === 'vacation') return <VacationView currentUser={user} />;
    if (activeTab === 'team') return <TeamView />;
    if (activeTab === 'tools') return <ToolsView handleNav={handleNav} />; 
    if (activeTab === 'tool_qr') return <QRCodeView handleNav={handleNav} />; 
    if (activeTab === 'tool_location') return <LocationView handleNav={handleNav} />; 
    if (activeTab === 'resources') return <ResourceView />;

    // --- EVENT OPS & GUIDELINES VIEWS ---
    if (activeTab === 'accreditation') return <AccreditationView openFeedback={openFeedback} />;
    if (activeTab === 'vivenu') return <VivenuView openFeedback={openFeedback} />;
    if (activeTab === 'support') return <SupportView openFeedback={openFeedback} />;
    if (activeTab === 'brand') return <BrandView openFeedback={openFeedback} />; 
    if (activeTab === 'web') return <WebView openFeedback={openFeedback} />; 
    if (activeTab === 'votings') return <VotingView openFeedback={openFeedback} />; 
    if (activeTab === 'automation') return <AutomationView />;

    if (activeTab === 'tickets') { 
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-6 rounded-full mb-6">
                    <Construction size={48} className="text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Coming Soon</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">Die Dokumentation zur Ticketlogik wird gerade erstellt.</p>
                <button onClick={() => handleNav('home')} className="text-blue-600 font-bold hover:underline">Zurück zum Dashboard</button>
            </div>
        );
    }

    if (activeTab === 'admin') {
        return isPrivileged 
            ? <AdminDashboard feedbackList={adminFeedbackList} onRefreshFeedback={onRefreshFeedback} currentUser={user} />
            : <div className="flex flex-col items-center justify-center h-96 text-center animate-in fade-in"><div className="bg-red-100 text-red-600 p-4 rounded-full mb-4"><Shield size={48}/></div><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Zugriff verweigert</h2><p className="text-gray-500 mt-2">Du hast keine Berechtigung für diesen Bereich.</p><button onClick={() => handleNav('home')} className="mt-6 text-blue-600 font-bold hover:underline">Zurück zum Dashboard</button></div>;
    }

    return <div className="text-center py-20 text-gray-400">Inhalt nicht gefunden: {activeTab}</div>;
}