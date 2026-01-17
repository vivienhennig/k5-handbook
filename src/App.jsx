import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Main/Sidebar.jsx';
import MainContent from './components/Main/MainContent.jsx';
import LoginView from './pages/LoginView.jsx';
import FeedbackButton from './components/Feedback/FeedbackButton.jsx';
import ProfileModal from './components/Profile/ProfileModal.jsx';
import WikiCreateModal from './components/Wiki/WikiCreateModal.jsx';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './config/firebase.js';
import { userApi, eventApi, feedbackApi, contentApi } from './services/api.js';

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isWikiCreateModalOpen, setIsWikiCreateModalOpen] = useState(false);
  
  const [customWikis, setCustomWikis] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [adminFeedbackList, setAdminFeedbackList] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const dbUser = await userApi.getUserData(currentUser.uid, currentUser.email);
        setUserData(dbUser);
        setUser({ ...currentUser, ...dbUser });
        loadDashboardData();
        loadFeedback();
        loadNavigation();
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
    // Navigation erfolgt nach dem Erstellen via Pfad
    window.location.href = `/wiki/${wikiId}`;
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  if (!user) return <LoginView onLogin={() => {}} />;

  const isPrivileged = userData?.role === 'admin' || userData?.role === 'privileged';

  return (
    <Router>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden text-gray-900 dark:text-gray-100 font-sans">
        
        {isProfileModalOpen && (
            <ProfileModal user={userData} onClose={() => setIsProfileModalOpen(false)} onUpdate={refreshUserData} />
        )}
        {isWikiCreateModalOpen && (
            <WikiCreateModal isOpen={isWikiCreateModalOpen} onClose={() => setIsWikiCreateModalOpen(false)} onSave={handleCreateWiki} isDarkMode={false} />
        )}

        {/* Sidebar bleibt immer sichtbar */}
        <Sidebar 
          user={user}
          customWikis={customWikis}
          isPrivileged={isPrivileged}
          onLogout={handleLogout}
          onCreateWiki={() => setIsWikiCreateModalOpen(true)}
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />

        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth" id="main-scroll">
             <Routes>
                {/* Standard-Weiterleitung auf Home */}
                <Route path="/" element={<Navigate to="/home" replace />} />
                
                {/* Dynamische Route für alle Tabs */}
                <Route path="/:tabId" element={
                  <MainContent 
                    user={userData}
                    upcomingEvents={upcomingEvents}
                    adminFeedbackList={adminFeedbackList}
                    isPrivileged={isPrivileged}
                    onRefreshFeedback={loadFeedback}
                  />
                } />

                {/* Eigene Route für Wikis */}
                <Route path="/wiki/:wikiId" element={
                  <MainContent 
                    user={userData}
                    upcomingEvents={upcomingEvents}
                    adminFeedbackList={adminFeedbackList}
                    isPrivileged={isPrivileged}
                    onRefreshFeedback={loadFeedback}
                  />
                } />
             </Routes>
          </div>
          <FeedbackButton user={userData} /> 
        </div>
      </div>
    </Router>
  );
}

export default App;