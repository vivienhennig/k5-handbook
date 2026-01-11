import React, { useState, useEffect, useMemo } from 'react';
// WICHTIG: Hier ist 'Users' (Plural) jetzt dabei für den Team-Button
import { 
  Search, Menu, X, ChevronDown, User, Users, LifeBuoy, CreditCard, 
  Layout, Shield, Cpu, MousePointer, FileText, Settings, LogOut, 
  LogIn, Moon, Sun, Bell, Plus, Trash2, MessageSquare, Lock, Star, 
  Clock, AlertTriangle
} from 'lucide-react';
import { onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';

// Config & Services
import { auth } from './config/firebase';
import { MASTER_ADMIN_EMAIL, SECTIONS_CONFIG, SNIPPETS } from './config/data';
import { userApi, newsApi, authService, feedbackApi, levenshteinDistance } from './services/api';

// Components
import { Card, NewsWidget } from './components/UI';
// ProfileEditModal hier importieren
import { FeedbackModal, ProfileEditModal } from './components/Modals';

// Pages
import Wizard from './pages/Wizard';
import SupportView from './pages/SupportView';
import VivenuView from './pages/VivenuView';
import AccreditationView from './pages/AccreditationView';
import WebView from './pages/WebView';
import BrandView from './pages/BrandView';
import VotingView from './pages/VotingView';
import AdminUserManagement from './pages/AdminUserManagement';
import TeamView from './pages/TeamView'; // Die neue Team-Seite

// --- 1. LOGIN SCREEN KOMPONENTE ---
const LoginScreen = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); setError('');
        if (!email.toLowerCase().endsWith('@k5-gmbh.com')) { setError('Zugriff nur mit @k5-gmbh.com Email.'); return; }
        setIsLoading(true);
        try {
            let user;
            if(auth) {
                if (isRegistering) { const cred = await createUserWithEmailAndPassword(auth, email, password); user = cred.user; } 
                else { user = await authService.login(email, password); }
            } else {
                user = await authService.login(email, password); // Mock Fallback
            }
            onLogin(user);
        } catch (error) { 
             console.error(error);
             setError(isRegistering ? "Registrierung fehlgeschlagen." : "Login fehlgeschlagen. Passwort falsch?"); 
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-[#092AFF] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                        <span className="text-white font-black text-3xl tracking-tighter">K5</span>
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Digital Handbook</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Bitte logge dich mit deiner K5-Adresse ein.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">E-Mail</label>
                        <input type="email" className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="name@k5-gmbh.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Passwort</label>
                        <input type="password" className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    </div>
                    
                    {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs p-3 rounded-lg flex items-center gap-2"><AlertTriangle size={14}/>{error}</div>}
                    
                    <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-[#092AFF] text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20">
                        {isLoading ? "Prüfe..." : (isRegistering ? "Account erstellen" : "Einloggen")}
                    </button>
                </form>

                {auth && (
                    <div className="mt-6 text-center">
                        <button onClick={() => setIsRegistering(!isRegistering)} className="text-xs text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                            {isRegistering ? "Zurück zum Login" : "Neu hier? Account erstellen"}
                        </button>
                    </div>
                )}
            </div>
            <div className="mt-8 text-gray-400 text-xs">© K5 GmbH • Internal Use Only</div>
        </div>
    );
};

// --- 2. HAUPT APP ---

export default function K5HandbookApp() {
  // Navigation State
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'home';
  });

  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  
  // Modals
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackContext, setFeedbackContext] = useState('');
  const [profileModalOpen, setProfileModalOpen] = useState(false); // NEU: Profil Modal
  
  // Auth State
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userFavorites, setUserFavorites] = useState([]);
  const [userReadHistory, setUserReadHistory] = useState({});
  
  // Admin & Content State
  const [darkMode, setDarkMode] = useState(false);
  const [adminFeedbackList, setAdminFeedbackList] = useState([]);
  const [newsFeed, setNewsFeed] = useState([]);
  const [newNewsText, setNewNewsText] = useState('');
  const [newNewsType, setNewNewsType] = useState('info');

  // Helper: Wer darf ins Admin Panel? (Admin oder Editor)
  const isPrivileged = user?.role === 'admin' || user?.role === 'editor';

  // --- INITIALISIERUNG ---
  useEffect(() => {
      if (localStorage.getItem('k5_dark_mode') === 'true') setDarkMode(true);
      newsApi.getAll().then(setNewsFeed);
      
      const storedUser = localStorage.getItem('k5_session_user');
      if (storedUser) {
           const u = JSON.parse(storedUser);
           setUser(u); 
           userApi.getUserData(u.uid, u.email).then(data => { 
               setUserFavorites(data.favorites); 
               setUserReadHistory(data.readHistory);
               // Wir updaten den lokalen User mit den DB Daten (für Rolle/Foto)
               setUser(prev => ({...prev, ...data})); 
           });
      }
      
      if(auth) {
          const unsubscribe = onAuthStateChanged(auth, async (u) => {
              if(u) {
                 const userData = await userApi.getUserData(u.uid, u.email);
                 
                 // Fallback Admin Check via Email
                 const role = u.email === MASTER_ADMIN_EMAIL ? 'admin' : userData.role || 'user'; 
                 
                 const appUser = { 
                     ...u, 
                     name: u.email.split('@')[0], 
                     ...userData, // Merge DB Daten (Foto, Rolle, Department)
                     role: role 
                 };
                 
                 setUser(appUser);
                 setUserFavorites(userData.favorites);
                 setUserReadHistory(userData.readHistory);
                 
                 localStorage.setItem('k5_session_user', JSON.stringify(appUser));
              } else { 
                  setUser(null); 
                  setUserFavorites([]); 
                  setUserReadHistory({}); 
                  localStorage.removeItem('k5_session_user');
              }
              setAuthLoading(false);
          });
          return () => unsubscribe();
      } else {
          setAuthLoading(false);
      }
  }, []);

  // --- EVENT HANDLERS ---

  const toggleDarkMode = () => { const newVal = !darkMode; setDarkMode(newVal); localStorage.setItem('k5_dark_mode', newVal); };
  
  const handleLoginSuccess = (u) => { 
      if(!auth) localStorage.setItem('k5_session_user', JSON.stringify(u));
      setUser(u); 
  };
  
  const handleLogout = () => { 
      authService.logout(); 
      setUser(null); 
      localStorage.removeItem('k5_session_user'); 
  };
  
  const toggleFavorite = (cardId) => {
      if (!user) return;
      const newFavs = userFavorites.includes(cardId) ? userFavorites.filter(id => id !== cardId) : [...userFavorites, cardId];
      setUserFavorites(newFavs);
      userApi.saveFavorites(user.name || user.uid, newFavs);
  };

  const handleNav = (tab) => {
    setActiveTab(tab); setMobileMenuOpen(false); setSearchQuery(''); window.scrollTo(0, 0);
    
    const newUrl = tab === 'home' ? window.location.pathname : `?tab=${tab}`;
    const currentParams = new URLSearchParams(window.location.search);
    if (currentParams.get('tab') !== tab && !(tab === 'home' && !currentParams.get('tab'))) {
        window.history.pushState(null, '', newUrl);
    }

    if (user) { 
        userApi.markSectionRead(user.name || user.uid, tab).then(() => { 
            setUserReadHistory({ ...userReadHistory, [tab]: new Date().toISOString() }); 
        }); 
    }
  };

  // Profil Speichern Handler
  const handleProfileSave = async (uid, data) => {
      await userApi.updateUserProfile(uid, data);
      // Lokal updaten
      setUser(prev => ({ ...prev, ...data }));
  };

  const hasUpdate = (sectionId) => {
      const section = SECTIONS_CONFIG.find(s => s.id === sectionId);
      if (!section || !section.lastUpdated) return false;
      const lastRead = userReadHistory[sectionId];
      return !lastRead || new Date(section.lastUpdated) > new Date(lastRead);
  };

  const handleAddNews = async () => {
      if(!newNewsText) return;
      const today = new Date();
      const dateStr = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.`;
      const newItem = { date: dateStr, text: newNewsText, type: newNewsType };
      const updated = await newsApi.add(newItem);
      setNewsFeed(updated); setNewNewsText('');
  };

  const handleDeleteNews = async (id) => { const updated = await newsApi.delete(id); setNewsFeed(updated); };

  const openFeedback = (ctx) => { setFeedbackContext(ctx); setFeedbackModalOpen(true); };

  // --- EFFEKTE ---

  // Back-Button
  useEffect(() => {
    const onPopState = () => { setActiveTab(new URLSearchParams(window.location.search).get('tab') || 'home'); };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Live-Search
  useEffect(() => {
    if (searchQuery.length < 2) { setSearchResults([]); return; }
    const lowerQ = searchQuery.toLowerCase();
    let searchable = [
        ...SECTIONS_CONFIG.map(s => ({ id: s.id, title: s.title, text: s.desc, section: 'Bereich' })),
        ...SNIPPETS.map(s => ({ id: 'support', title: s.title, text: s.text, section: 'Snippet' })),
        { id: 'support', title: 'Preise', text: 'ticket preise retailer early bird', section: 'Support' },
        { id: 'accreditation', title: 'Scanner', text: 'einlass akkreditierung app', section: 'Events' }
    ];
    const results = searchable.filter(item => {
        if (item.title.toLowerCase().includes(lowerQ) || (item.text && item.text.toLowerCase().includes(lowerQ))) return true;
        if (!item.text) return false;
        const words = (item.title + " " + item.text).toLowerCase().split(" ");
        return words.some(word => Math.abs(word.length - lowerQ.length) <= 2 && levenshteinDistance(word, lowerQ) <= 2);
    });
    setSearchResults(results);
  }, [searchQuery]);

  // Admin Data Fetch
  useEffect(() => {
    if (activeTab === 'admin' && isPrivileged) { 
        feedbackApi.getAll().then(setAdminFeedbackList); 
        newsApi.getAll().then(setNewsFeed); 
    }
  }, [activeTab, user, isPrivileged]);

  const favoriteCards = useMemo(() => SECTIONS_CONFIG.filter(sec => userFavorites.includes(sec.id)), [userFavorites]);

  // --- RENDER ---

  if (authLoading) {
      return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
      );
  }

  if (!user) {
      return <LoginScreen onLogin={handleLoginSuccess} />;
  }

  return (
    <div className={darkMode ? "dark" : ""}>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-100 transition-colors duration-200 flex flex-col">
      <header className="fixed top-0 w-full bg-[#092AFF] dark:bg-blue-900 text-white z-50 h-20 shadow-md transition-colors">
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <div onClick={() => handleNav('home')} className="font-black text-2xl tracking-tighter cursor-pointer flex items-center gap-2">K5 <span className="font-light opacity-80">HANDBOOK</span></div>
          
          <nav className="hidden lg:flex items-center gap-8 h-full">
            <button onClick={() => handleNav('home')} className={`h-full border-b-4 px-2 font-bold uppercase text-sm tracking-wide transition-colors ${activeTab === 'home' ? 'border-white' : 'border-transparent opacity-80 hover:opacity-100'}`}>Home</button>
            <div className="group h-full flex items-center relative cursor-pointer"><button className={`h-full border-b-4 px-2 font-bold uppercase text-sm tracking-wide flex items-center gap-1 ${['web','brand','support'].includes(activeTab) ? 'border-white' : 'border-transparent opacity-80 hover:opacity-100'}`}>Guidelines <ChevronDown size={14}/>{(hasUpdate('web') || hasUpdate('brand') || hasUpdate('support')) && <span className="absolute top-4 right-[-5px] w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}</button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-b-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 p-6 grid grid-cols-2 gap-8 border-t border-gray-100 dark:border-gray-700">
                <div><h4 className="font-bold text-xs uppercase text-gray-400 mb-3 tracking-wider border-b dark:border-gray-700 pb-2">Identity</h4><div onClick={() => handleNav('web')} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-3 font-semibold text-sm"><Layout size={18} className="text-blue-600 dark:text-blue-400"/> Webseite {hasUpdate('web') && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}</div><div onClick={() => handleNav('brand')} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-3 font-semibold text-sm"><FileText size={18} className="text-blue-600 dark:text-blue-400"/> Branding & Assets {hasUpdate('brand') && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}</div></div>
                <div><h4 className="font-bold text-xs uppercase text-gray-400 mb-3 tracking-wider border-b dark:border-gray-700 pb-2">Communication</h4><div onClick={() => handleNav('support')} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-3 font-semibold text-sm"><LifeBuoy size={18} className="text-blue-600 dark:text-blue-400"/> Customer Support {hasUpdate('support') && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}</div></div>
              </div>
            </div>
            <div className="group h-full flex items-center relative cursor-pointer"><button className={`h-full border-b-4 px-2 font-bold uppercase text-sm tracking-wide flex items-center gap-1 ${['vivenu','tickets','accreditation'].includes(activeTab) ? 'border-white' : 'border-transparent opacity-80 hover:opacity-100'}`}>Events <ChevronDown size={14}/>{(hasUpdate('vivenu') || hasUpdate('tickets') || hasUpdate('accreditation')) && <span className="absolute top-4 right-[-5px] w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}</button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[500px] bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-b-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 p-6 grid grid-cols-2 gap-6 border-t border-gray-100 dark:border-gray-700">
                <div><h4 className="font-bold text-xs uppercase text-gray-400 mb-3 tracking-wider border-b dark:border-gray-700 pb-2">Setup</h4><div onClick={() => handleNav('vivenu')} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-3 font-semibold text-sm"><CreditCard size={18} className="text-blue-600 dark:text-blue-400"/> Vivenu Setup {hasUpdate('vivenu') && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}</div><div onClick={() => handleNav('tickets')} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-3 font-semibold text-sm"><FileText size={18} className="text-blue-600 dark:text-blue-400"/> Ticket Logik {hasUpdate('tickets') && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}</div></div>
                <div><h4 className="font-bold text-xs uppercase text-gray-400 mb-3 tracking-wider border-b dark:border-gray-700 pb-2">On-Site</h4><div onClick={() => handleNav('accreditation')} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-3 font-semibold text-sm"><Shield size={18} className="text-blue-600 dark:text-blue-400"/> Akkreditierung {hasUpdate('accreditation') && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}</div></div>
              </div>
            </div>
             <div className="group h-full flex items-center relative cursor-pointer"><button className={`h-full border-b-4 px-2 font-bold uppercase text-sm tracking-wide flex items-center gap-1 ${['votings','automation'].includes(activeTab) ? 'border-white' : 'border-transparent opacity-80 hover:opacity-100'}`}>Tech <ChevronDown size={14}/>{(hasUpdate('votings') || hasUpdate('automation')) && <span className="absolute top-4 right-[-5px] w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}</button>
              <div className="absolute top-full right-0 w-[400px] bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-b-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 p-6 border-t border-gray-100 dark:border-gray-700">
                  <div onClick={() => handleNav('votings')} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-3 font-semibold text-sm mb-2"><MousePointer size={18} className="text-blue-600 dark:text-blue-400"/> Voting System {hasUpdate('votings') && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}</div>
                  <div onClick={() => handleNav('automation')} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-3 font-semibold text-sm"><Cpu size={18} className="text-blue-600 dark:text-blue-400"/> Automation Wizard {hasUpdate('automation') && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}</div>
              </div>
            </div>
            
            {/* NEU: TEAM BUTTON */}
            <button onClick={() => handleNav('team')} className={`h-full border-b-4 px-2 font-bold uppercase text-sm tracking-wide transition-colors flex items-center gap-2 ${activeTab === 'team' ? 'border-white' : 'border-transparent opacity-80 hover:opacity-100'}`}>
                <Users size={16}/> Team
            </button>
          </nav>
          
          <div className="flex items-center gap-4">
             <div className="relative hidden md:block group"><div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-200 group-focus-within:text-blue-600 transition-colors"><Search size={16} /></div><input id="searchInput" type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-blue-800/50 dark:bg-blue-950/50 border border-blue-400/30 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-blue-200 focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 w-48 transition-all focus:w-64"/>{searchResults.length > 0 && (<div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl text-gray-800 dark:text-white overflow-hidden z-50 border border-gray-100 dark:border-gray-700">{searchResults.map((res, idx) => (<div key={idx} onClick={() => handleNav(res.id)} className="p-3 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0"><div className="font-bold text-sm text-blue-600 dark:text-blue-400">{res.title}</div><div className="text-xs text-gray-500 dark:text-gray-400">in {res.section}</div></div>))}</div>)}</div>
             <button onClick={toggleDarkMode} className="text-white hover:text-blue-200 transition p-1">{darkMode ? <Sun size={20}/> : <Moon size={20}/>}</button>
             
             {/* Settings Button (Sichtbar für Admin und Editor) */}
             {isPrivileged && <button onClick={() => handleNav('admin')} className="text-white hover:text-blue-200 transition"><Settings size={20} /></button>}
             
             {/* NEU: Profil & Logout Bereich */}
             <div className="flex items-center gap-2 pl-2 border-l border-white/20">
                 <button onClick={() => setProfileModalOpen(true)} className="flex items-center gap-2 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium text-white">
                    {user?.photoUrl ? (
                        <img src={user.photoUrl} alt="Me" className="w-6 h-6 rounded-full object-cover border border-white/50"/>
                    ) : (
                        <User size={18}/>
                    )}
                    <span className="hidden xl:inline">{user?.displayName || 'Profil'}</span>
                 </button>
                 <button onClick={handleLogout} className="text-white/70 hover:text-white transition-colors p-1" title="Ausloggen"><LogOut size={18}/></button>
             </div>

             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-white">{mobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}</button>
          </div>
        </div>
      </header>

      {/* --- MODALS --- */}
      <FeedbackModal isOpen={feedbackModalOpen} onClose={() => setFeedbackModalOpen(false)} context={feedbackContext} user={user} />
      {/* Profil Modal (nur rendern wenn User eingeloggt ist) */}
      {user && <ProfileEditModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} currentUser={user} onSave={handleProfileSave} />}

      {mobileMenuOpen && <div className="fixed inset-0 bg-white dark:bg-gray-900 z-40 pt-24 px-6 overflow-y-auto lg:hidden text-gray-800 dark:text-white"><div className="text-center p-4">Menu Content (Mobile)</div></div>}

      <main className="container mx-auto px-4 lg:px-8 py-12 pt-32 max-w-6xl flex-grow">
        {activeTab === 'home' && (
          <div className="animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-16">
              <h1 className="text-4xl lg:text-6xl font-black text-[#092AFF] dark:text-blue-400 mb-4 tracking-tight">DIGITAL HANDBOOK</h1>
              <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Der zentrale Leitfaden für Web, Events, Brand & Operations bei K5.</p>
            </div>
            <NewsWidget news={newsFeed} />
            {favoriteCards.length > 0 && (
                <div className="mb-12"><h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Star className="text-yellow-400 fill-yellow-400" size={24}/> Deine Favoriten</h3><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{favoriteCards.map((sec) => (<Card key={sec.id} icon={sec.icon} title={sec.title} desc={sec.desc} onClick={() => handleNav(sec.id)} isFavorite={true} onToggleFavorite={() => toggleFavorite(sec.id)} hasUpdate={hasUpdate(sec.id)}/>))}</div><div className="h-px bg-gray-200 dark:bg-gray-700 w-full my-12"></div></div>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{SECTIONS_CONFIG.filter(sec => sec.id !== 'exhibitor').map((sec) => (<Card key={sec.id} icon={sec.icon} title={sec.title} desc={sec.desc} onClick={() => handleNav(sec.id)} isFavorite={userFavorites.includes(sec.id)} onToggleFavorite={user ? () => toggleFavorite(sec.id) : null} hasUpdate={hasUpdate(sec.id)}/>))}</div>
          </div>
        )}

        {/* Content Views */}
        {activeTab === 'team' && <TeamView />}
        {activeTab === 'support' && <SupportView openFeedback={openFeedback} />}
        {activeTab === 'vivenu' && <VivenuView openFeedback={openFeedback} />}
        {activeTab === 'accreditation' && <AccreditationView openFeedback={openFeedback} />}
        {activeTab === 'web' && <WebView openFeedback={openFeedback} />}
        {activeTab === 'brand' && <BrandView openFeedback={openFeedback} />}
        {activeTab === 'votings' && <VotingView openFeedback={openFeedback} />}
        {activeTab === 'automation' && <div className="animate-in zoom-in duration-300"><div className="text-center mb-8"><h2 className="text-3xl font-black text-gray-900 dark:text-white">Automation Check</h2></div><Wizard /></div>}
        {activeTab === 'tickets' && <div className="text-center py-20"><div className="inline-block p-6 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-6"><Clock size={48} className="text-blue-600 dark:text-blue-400" /></div><h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Ticket Logik 2026</h2><p className="text-xl text-gray-500 dark:text-gray-400 font-medium">Coming Soon</p></div>}
        
        {/* Admin / Editor Dashboard */}
        {activeTab === 'admin' && (
            <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
                {isPrivileged ? (
                    <>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                            <Settings/> {user.role === 'admin' ? 'Admin Dashboard' : 'Content Dashboard'}
                        </h2>
                        
                        {/* User Management NUR für echte Admins, nicht für Editoren */}
                        {user.role === 'admin' && <AdminUserManagement />}

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2"><Bell size={18}/> News Management</h3>
                            <div className="flex gap-2 mb-4"><input type="text" placeholder="Neue Nachricht..." className="flex-1 border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newNewsText} onChange={e => setNewNewsText(e.target.value)} /><select className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newNewsType} onChange={e => setNewNewsType(e.target.value)}><option value="info">Info</option><option value="alert">Alert</option><option value="update">Update</option></select><button onClick={handleAddNews} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-1 hover:bg-blue-700"><Plus size={16}/> Hinzufügen</button></div>
                            <div className="space-y-2">{newsFeed.map(n => (<div key={n.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-100 dark:border-gray-600"><span className="text-sm dark:text-gray-200"><span className="font-mono text-gray-400 mr-2">{n.date}</span>{n.text} <span className="text-xs uppercase bg-gray-200 dark:bg-gray-600 px-1 rounded ml-2">{n.type}</span></span><button onClick={() => handleDeleteNews(n.firebaseId || n.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button></div>))}</div>
                        </div>

                        {/* Feedback Log auch NUR für echte Admins */}
                        {user.role === 'admin' && (
                            <>
                                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2"><MessageSquare size={18}/> Feedback Log</h3>
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">{adminFeedbackList.length === 0 ? <div className="p-8 text-center text-gray-500">Noch kein Feedback vorhanden. 🎉</div> : <div className="divide-y divide-gray-100 dark:divide-gray-700">{adminFeedbackList.map(item => (<div key={item.id} className="p-4 flex gap-4"><div className="text-2xl pt-1">{item.type === 'outdated' ? '⏳' : item.type === 'error' ? '🐛' : '💡'}</div><div className="flex-1"><div className="flex justify-between mb-1"><span className="font-bold text-gray-900 dark:text-white uppercase text-xs tracking-wider bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{item.type}</span><span className="text-xs text-gray-400">{item.createdAt.split('T')[0]} • von {item.userName || 'Gast'}</span></div><div className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">{item.context}</div><div className="text-sm text-gray-600 dark:text-gray-400">{item.comment}</div></div></div>))}</div>}</div>
                            </>
                        )}
                    </>
                ) : <div className="text-center py-20"><div className="text-red-500 mb-4 flex justify-center"><Lock size={48}/></div><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Zugriff verweigert</h2></div>}
            </div>
        )}
      </main>
    </div>
    </div>
  );
}