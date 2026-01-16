import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import LoginView from './pages/LoginView';
import FeedbackButton from './components/FeedbackButton';
import ProfileModal from './components/ProfileModal';
import WikiCreateModal from './components/WikiCreateModal'; // Import für das Wiki-Erstellen
import { Menu, X } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth'; // signOut ergänzt
import { auth } from './config/firebase';
import { userApi, eventApi, feedbackApi, contentApi } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isWikiCreateModalOpen, setIsWikiCreateModalOpen] = useState(false); // NEU
  
  // Data States
  const [customWikis, setCustomWikis] = useState([]); // NEU: Damit Sidebar mappen kann
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [adminFeedbackList, setAdminFeedbackList] = useState([]);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const dbUser = await userApi.getUserData(currentUser.uid, currentUser.email);
        setUserData(dbUser);
        setUser({ ...currentUser, ...dbUser });
        loadDashboardData();
        loadFeedback();
        loadNavigation(); // Wikis für die Sidebar laden
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loadNavigation = async () => {
    const navData = await contentApi.getGuideline('settings_navigation');
    if (navData?.customWikis) setCustomWikis(navData.customWikis);
  };

  const loadDashboardData = async () => {
    const events = await eventApi.getUpcoming(3);
    setUpcomingEvents(events);
  };

  const loadFeedback = async () => {
      const data = await feedbackApi.getAll();
      setAdminFeedbackList(data);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const refreshUserData = async () => {
      if (user?.uid) {
          const updatedUser = await userApi.getUserData(user.uid, user.email);
          setUserData(updatedUser);
          setUser(prev => ({ ...prev, ...updatedUser }));
      }
  };

  const handleNav = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  // Funktion zum Speichern eines neuen Wikis
  const handleCreateWiki = async (wikiConfig) => {
    const wikiId = wikiConfig.title.toLowerCase().replace(/\s+/g, '_');
    const newList = [...customWikis, { id: wikiId, title: wikiConfig.title, iconName: wikiConfig.iconName }];
    
    await contentApi.updateGuideline('settings_navigation', { customWikis: newList });
    await contentApi.updateGuideline(`wiki_${wikiId}`, {
        introText: "Neue Seite erstellt.",
        blocks: [],
        lastUpdated: new Date().toISOString()
    });
    
    await loadNavigation();
    setIsWikiCreateModalOpen(false);
    handleNav(wikiId);
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  if (!user) return <LoginView onLogin={() => {}} />;

  const isPrivileged = userData?.role === 'admin' || userData?.role === 'privileged';

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden text-gray-900 dark:text-gray-100 font-sans">
      
      {/* Modale */}
      {isProfileModalOpen && (
          <ProfileModal user={userData} onClose={() => setIsProfileModalOpen(false)} onUpdate={refreshUserData} />
      )}
      {isWikiCreateModalOpen && (
          <WikiCreateModal isOpen={isWikiCreateModalOpen} onClose={() => setIsWikiCreateModalOpen(false)} onSave={handleCreateWiki} isDarkMode={false} />
      )}

      {/* Sidebar */}
      <Sidebar 
        user={user}
        activeTab={activeTab}
        handleNav={handleNav}
        customWikis={customWikis}
        isPrivileged={isPrivileged}
        onLogout={handleLogout}
        onCreateWiki={() => setIsWikiCreateModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth" id="main-scroll">
           <MainContent 
              user={userData}
              activeTab={activeTab}
              upcomingEvents={upcomingEvents}
              handleNav={handleNav}
              adminFeedbackList={adminFeedbackList}
              isPrivileged={isPrivileged}
              onRefreshFeedback={loadFeedback}
           />
        </div>
        <FeedbackButton user={userData} /> 
      </div>
    </div>
  );
}

export default App;