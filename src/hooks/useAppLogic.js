import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { userApi, newsApi, eventApi, feedbackApi, authService } from '../services/api';
import { MASTER_ADMIN_EMAIL, SECTIONS_CONFIG } from '../config/data';

export function useAppLogic() {
  // Navigation & UI
  const [activeTab, setActiveTab] = useState(() => new URLSearchParams(window.location.search).get('tab') || 'home');
  const [darkMode, setDarkMode] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [feedbackContext, setFeedbackContext] = useState('');
  
  // TUTORIAL STATE (NEU)
  const [showTutorial, setShowTutorial] = useState(false);

  // Data
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userFavorites, setUserFavorites] = useState([]);
  const [userReadHistory, setUserReadHistory] = useState({});
  const [newsFeed, setNewsFeed] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  
  // Admin Data
  const [adminFeedbackList, setAdminFeedbackList] = useState([]);

  const isPrivileged = user?.role === 'admin' || user?.role === 'editor';

  // --- INIT & AUTH ---
  useEffect(() => {
    // 1. Dark Mode laden
    if (localStorage.getItem('k5_dark_mode') === 'true') setDarkMode(true);
    
    // 2. Tutorial Check (NEU)
    // Wir warten 1 Sekunde, damit die Seite sicher geladen ist
    const tutorialSeen = localStorage.getItem('k5_tutorial_seen');
    if (!tutorialSeen) {
        setTimeout(() => {
            setShowTutorial(true);
        }, 1000);
    }

    // 3. Globale Daten laden
    newsApi.getAll().then(setNewsFeed);
    eventApi.getUpcoming(3).then(setUpcomingEvents);

    // 4. User aus LocalStorage holen (für schnellen Start)
    const storedUser = localStorage.getItem('k5_session_user');
    if (storedUser) {
         const u = JSON.parse(storedUser);
         setUser(u);
         // Im Hintergrund aktualisieren
         userApi.getUserData(u.uid, u.email).then(data => { 
             setUserFavorites(data.favorites); 
             setUserReadHistory(data.readHistory);
             setUser(prev => ({...prev, ...data})); 
         });
    }

    // 5. Firebase Auth Listener
    if(auth) {
        const unsubscribe = onAuthStateChanged(auth, async (u) => {
            if(u) {
               const userData = await userApi.getUserData(u.uid, u.email);
               const role = u.email === MASTER_ADMIN_EMAIL ? 'admin' : userData.role || 'user'; 
               const appUser = { ...u, name: u.email.split('@')[0], ...userData, role: role };
               setUser(appUser);
               setUserFavorites(userData.favorites);
               setUserReadHistory(userData.readHistory);
               localStorage.setItem('k5_session_user', JSON.stringify(appUser));
            } else { 
                setUser(null); setUserFavorites([]); setUserReadHistory({}); localStorage.removeItem('k5_session_user');
            }
            setAuthLoading(false);
        });
        return () => unsubscribe();
    } else { setAuthLoading(false); }
  }, []);

  // --- ACTIONS ---
  const toggleDarkMode = () => { const val = !darkMode; setDarkMode(val); localStorage.setItem('k5_dark_mode', val); };
  
  const handleNav = (tab) => {
    setActiveTab(tab); window.scrollTo(0, 0);
    const newUrl = tab === 'home' ? window.location.pathname : `?tab=${tab}`;
    const currentParams = new URLSearchParams(window.location.search);
    if (currentParams.get('tab') !== tab && !(tab === 'home' && !currentParams.get('tab'))) window.history.pushState(null, '', newUrl);
    
    if (user && tab !== 'home' && tab !== 'admin') { 
        userApi.markSectionRead(user.name || user.uid, tab).then(() => { 
            setUserReadHistory(prev => ({ ...prev, [tab]: new Date().toISOString() })); 
        }); 
    }
  };

  const hasUpdate = (sectionId) => {
      const section = SECTIONS_CONFIG.find(s => s.id === sectionId);
      if (!section || !section.lastUpdated) return false;
      const lastRead = userReadHistory[sectionId];
      return !lastRead || new Date(section.lastUpdated) > new Date(lastRead);
  };

  const toggleFavorite = (cardId) => {
      if (!user) return;
      const newFavs = userFavorites.includes(cardId) ? userFavorites.filter(id => id !== cardId) : [...userFavorites, cardId];
      setUserFavorites(newFavs);
      userApi.saveFavorites(user.name || user.uid, newFavs);
  };

  // Browser Back Button Support
  useEffect(() => {
    const onPopState = () => { setActiveTab(new URLSearchParams(window.location.search).get('tab') || 'home'); };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Admin Data Loading
  useEffect(() => {
    if (activeTab === 'admin' && isPrivileged) { 
        feedbackApi.getAll().then(setAdminFeedbackList); 
        newsApi.getAll().then(setNewsFeed); 
    }
  }, [activeTab, user, isPrivileged]);

  // NEU: Tutorial Beenden
  const finishTutorial = () => {
      setShowTutorial(false);
      localStorage.setItem('k5_tutorial_seen', 'true');
  };

  return {
    // State
    activeTab, darkMode, user, authLoading, isPrivileged,
    newsFeed, upcomingEvents, userFavorites,
    feedbackModalOpen, profileModalOpen, feedbackContext,
    adminFeedbackList, showTutorial, // <--- WICHTIG
    // Setters
    setNewsFeed, setFeedbackModalOpen, setProfileModalOpen, setFeedbackContext, setUser,
    // Actions
    toggleDarkMode, handleNav, hasUpdate, toggleFavorite, finishTutorial, // <--- WICHTIG
    handleLogout: () => { authService.logout(); setUser(null); localStorage.removeItem('k5_session_user'); },
    handleLoginSuccess: (u) => { if(!auth) localStorage.setItem('k5_session_user', JSON.stringify(u)); setUser(u); },
    handleProfileSave: async (uid, data) => { await userApi.updateUserProfile(uid, data); setUser(prev => ({ ...prev, ...data })); }
  };
}