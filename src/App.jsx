import React, { useState, useEffect, useMemo } from 'react';
import { Search, Menu, X, ChevronDown, User, LifeBuoy, CreditCard, Layout, Shield, Cpu, MousePointer, FileText, Settings, LogOut, LogIn, Moon, Sun, Bell, Plus, Trash2, MessageSquare, Lock, Star, Clock } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';

// Config & Services
import { auth } from './config/firebase';
import { MASTER_ADMIN_EMAIL, SECTIONS_CONFIG, SNIPPETS } from './config/data';
import { userApi, newsApi, authService, feedbackApi, levenshteinDistance } from './services/api';

// Components
import { Card, NewsWidget } from './components/UI';
import { LoginModal, FeedbackModal } from './components/Modals';

// Pages
import Wizard from './pages/Wizard';
import SupportView from './pages/SupportView';
import VivenuView from './pages/VivenuView';
import AccreditationView from './pages/AccreditationView';
import WebView from './pages/WebView';
import BrandView from './pages/BrandView';
import VotingView from './pages/VotingView';

export default function K5HandbookApp() {
  // 1. INITIAL STATE: Wir schauen beim Laden in die URL (?tab=...)
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'home';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackContext, setFeedbackContext] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userFavorites, setUserFavorites] = useState([]);
  const [userReadHistory, setUserReadHistory] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [adminFeedbackList, setAdminFeedbackList] = useState([]);
  
  const [newsFeed, setNewsFeed] = useState([]);
  const [newNewsText, setNewNewsText] = useState('');
  const [newNewsType, setNewNewsType] = useState('info');

  // 2. BACK BUTTON LISTENER: Wenn der User "Zurück" drückt, reagieren wir
  useEffect(() => {
    const onPopState = () => {
        const params = new URLSearchParams(window.location.search);
        const tabFromUrl = params.get('tab') || 'home';
        setActiveTab(tabFromUrl);
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
      if (localStorage.getItem('k5_dark_mode') === 'true') setDarkMode(true);
      newsApi.getAll().then(setNewsFeed);
      const storedUser = localStorage.getItem('k5_session_user');
      if (storedUser) {
           const u = JSON.parse(storedUser);
           setUser(u); 
           userApi.getUserData(u.name).then(data => { setUserFavorites(data.favorites); setUserReadHistory(data.readHistory); });
      }
      if(auth) {
          const unsubscribe = onAuthStateChanged(auth, async (u) => {
              if(u) {
                 const userData = await userApi.getUserData(u.uid);
                 const role = u.email === MASTER_ADMIN_EMAIL ? 'admin' : userData.role || 'user'; 
                 setUser({ ...u, name: u.email.split('@')[0], role: role });
                 setUserFavorites(userData.favorites);
                 setUserReadHistory(userData.readHistory);
              } else { setUser(null); setUserFavorites([]); setUserReadHistory({}); }
          });
          return () => unsubscribe();
      }
  }, []);

  const toggleDarkMode = () => { const newVal = !darkMode; setDarkMode(newVal); localStorage.setItem('k5_dark_mode', newVal); };
  const handleLogout = () => { authService.logout(); setUser(null); localStorage.removeItem('k5_session_user'); };
  const handleLoginSuccess = () => {};

  const toggleFavorite = (cardId) => {
      if (!user) { setLoginModalOpen(true); return; }
      const newFavs = userFavorites.includes(cardId) ? userFavorites.filter(id => id !== cardId) : [...userFavorites, cardId];
      setUserFavorites(newFavs);
      userApi.saveFavorites(user.name || user.uid, newFavs);
  };

  // 3. NAVIGATION UPDATE: Pusht den neuen Tab in die URL-Historie
  const handleNav = (tab) => {
    setActiveTab(tab); 
    setMobileMenuOpen(false); 
    setSearchQuery(''); 
    window.scrollTo(0, 0);

    // URL Aktualisieren (Push State)
    const newUrl = tab === 'home' ? window.location.pathname : `?tab=${tab}`;
    // Wir prüfen, ob wir schon auf dem Tab sind, um doppelte Einträge zu vermeiden
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

  const hasUpdate = (sectionId) => {
      if (!user) return false; 
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
      setNewsFeed(updated);
      setNewNewsText('');
  };

  const handleDeleteNews = async (id) => { const updated = await newsApi.delete(id); setNewsFeed(updated); };

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

  useEffect(() => {
    if (activeTab === 'admin' && user?.role === 'admin') { feedbackApi.getAll().then(setAdminFeedbackList); newsApi.getAll().then(setNewsFeed); }
  }, [activeTab, user]);

  const openFeedback = (ctx) => { setFeedbackContext(ctx); setFeedbackModalOpen(true); };
  const favoriteCards = useMemo(() => SECTIONS_CONFIG.filter(sec => userFavorites.includes(sec.id)), [userFavorites]);

  return (
    <div className={darkMode ? "dark" : ""}>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-100 transition-colors duration-200 flex flex-col">
      <header className="fixed top-0 w-full bg-[#092AFF] dark:bg-blue-900 text-white z-50 h-20 shadow-md transition-colors">
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo click jetzt auch mit Navigation */}
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
          </nav>
          
          <div className="flex items-center gap-4">
             <div className="relative hidden md:block group"><div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-200 group-focus-within:text-blue-600 transition-colors"><Search size={16} /></div><input id="searchInput" type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-blue-800/50 dark:bg-blue-950/50 border border-blue-400/30 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-blue-200 focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 w-48 transition-all focus:w-64"/>{searchResults.length > 0 && (<div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl text-gray-800 dark:text-white overflow-hidden z-50 border border-gray-100 dark:border-gray-700">{searchResults.map((res, idx) => (<div key={idx} onClick={() => handleNav(res.id)} className="p-3 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0"><div className="font-bold text-sm text-blue-600 dark:text-blue-400">{res.title}</div><div className="text-xs text-gray-500 dark:text-gray-400">in {res.section}</div></div>))}</div>)}</div>
             <button onClick={toggleDarkMode} className="text-white hover:text-blue-200 transition p-1">{darkMode ? <Sun size={20}/> : <Moon size={20}/>}</button>
             {user?.role === 'admin' && <button onClick={() => handleNav('admin')} className="text-white hover:text-blue-200 transition"><Settings size={20} /></button>}
             {user ? (<button onClick={handleLogout} className="text-white hover:text-blue-200"><LogOut size={20}/></button>) : (<button onClick={() => setLoginModalOpen(true)} className="text-white hover:text-blue-200 flex items-center gap-2 text-sm font-bold"><LogIn size={18}/> Login</button>)}
             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-white">{mobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}</button>
          </div>
        </div>
      </header>

      <FeedbackModal isOpen={feedbackModalOpen} onClose={() => setFeedbackModalOpen(false)} context={feedbackContext} user={user} />
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} onLogin={handleLoginSuccess} />

      {mobileMenuOpen && <div className="fixed inset-0 bg-white dark:bg-gray-900 z-40 pt-24 px-6 overflow-y-auto lg:hidden text-gray-800 dark:text-white"><div className="text-center p-4">Menu Content (Mobile)</div></div>}

      <main className="container mx-auto px-4 lg:px-8 py-12 pt-32 max-w-6xl flex-grow">
        {activeTab === 'home' && (
          <div className="animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-16">
              <h1 className="text-4xl lg:text-6xl font-black text-[#092AFF] dark:text-blue-400 mb-4 tracking-tight">DIGITAL HANDBOOK</h1>
              <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Der zentrale Leitfaden für Web, Events, Brand & Operations bei K5.</p>
            </div>
            <NewsWidget news={newsFeed} />
            {user && favoriteCards.length > 0 && (
                <div className="mb-12"><h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Star className="text-yellow-400 fill-yellow-400" size={24}/> Deine Favoriten</h3><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{favoriteCards.map((sec) => (<Card key={sec.id} icon={sec.icon} title={sec.title} desc={sec.desc} onClick={() => handleNav(sec.id)} isFavorite={true} onToggleFavorite={() => toggleFavorite(sec.id)} hasUpdate={hasUpdate(sec.id)}/>))}</div><div className="h-px bg-gray-200 dark:bg-gray-700 w-full my-12"></div></div>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{SECTIONS_CONFIG.filter(sec => sec.id !== 'exhibitor').map((sec) => (<Card key={sec.id} icon={sec.icon} title={sec.title} desc={sec.desc} onClick={() => handleNav(sec.id)} isFavorite={userFavorites.includes(sec.id)} onToggleFavorite={user ? () => toggleFavorite(sec.id) : null} hasUpdate={hasUpdate(sec.id)}/>))}</div>
          </div>
        )}

        {activeTab === 'support' && <SupportView openFeedback={openFeedback} />}
        {activeTab === 'vivenu' && <VivenuView openFeedback={openFeedback} />}
        {activeTab === 'accreditation' && <AccreditationView openFeedback={openFeedback} />}
        {activeTab === 'web' && <WebView openFeedback={openFeedback} />}
        {activeTab === 'brand' && <BrandView openFeedback={openFeedback} />}
        {activeTab === 'votings' && <VotingView openFeedback={openFeedback} />}
        {activeTab === 'automation' && <div className="animate-in zoom-in duration-300"><div className="text-center mb-8"><h2 className="text-3xl font-black text-gray-900 dark:text-white">Automation Check</h2></div><Wizard /></div>}
        {activeTab === 'tickets' && <div className="text-center py-20"><div className="inline-block p-6 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-6"><Clock size={48} className="text-blue-600 dark:text-blue-400" /></div><h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Ticket Logik 2026</h2><p className="text-xl text-gray-500 dark:text-gray-400 font-medium">Coming Soon</p></div>}
        
        {activeTab === 'admin' && (
            <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
                {user?.role === 'admin' ? (
                    <>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3"><Settings/> Admin Dashboard</h2>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2"><Bell size={18}/> News Management</h3>
                            <div className="flex gap-2 mb-4"><input type="text" placeholder="Neue Nachricht..." className="flex-1 border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newNewsText} onChange={e => setNewNewsText(e.target.value)} /><select className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newNewsType} onChange={e => setNewNewsType(e.target.value)}><option value="info">Info</option><option value="alert">Alert</option><option value="update">Update</option></select><button onClick={handleAddNews} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-1 hover:bg-blue-700"><Plus size={16}/> Hinzufügen</button></div>
                            <div className="space-y-2">{newsFeed.map(n => (<div key={n.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-100 dark:border-gray-600"><span className="text-sm dark:text-gray-200"><span className="font-mono text-gray-400 mr-2">{n.date}</span>{n.text} <span className="text-xs uppercase bg-gray-200 dark:bg-gray-600 px-1 rounded ml-2">{n.type}</span></span><button onClick={() => handleDeleteNews(n.firebaseId || n.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button></div>))}</div>
                        </div>
                        <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2"><MessageSquare size={18}/> Feedback Log</h3>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">{adminFeedbackList.length === 0 ? <div className="p-8 text-center text-gray-500">Noch kein Feedback vorhanden. 🎉</div> : <div className="divide-y divide-gray-100 dark:divide-gray-700">{adminFeedbackList.map(item => (<div key={item.id} className="p-4 flex gap-4"><div className="text-2xl pt-1">{item.type === 'outdated' ? '⏳' : item.type === 'error' ? '🐛' : '💡'}</div><div className="flex-1"><div className="flex justify-between mb-1"><span className="font-bold text-gray-900 dark:text-white uppercase text-xs tracking-wider bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{item.type}</span><span className="text-xs text-gray-400">{item.createdAt.split('T')[0]} • von {item.userName || 'Gast'}</span></div><div className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">{item.context}</div><div className="text-sm text-gray-600 dark:text-gray-400">{item.comment}</div></div></div>))}</div>}</div>
                    </>
                ) : <div className="text-center py-20"><div className="text-red-500 mb-4 flex justify-center"><Lock size={48}/></div><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Zugriff verweigert</h2></div>}
            </div>
        )}
      </main>
    </div>
    </div>
  );
}