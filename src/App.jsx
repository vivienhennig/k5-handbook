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
import { Sparkles } from 'lucide-react';

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
        introText: "Neuer Handbook Node erstellt.",
        blocks: [],
        lastUpdated: new Date().toISOString()
    });
    
    await loadNavigation();
    setIsWikiCreateModalOpen(false);
    // Direkte Navigation zum neuen Node
    window.location.href = `/wiki/${wikiId}`;
  };

  // --- LOADING SCREEN: K5 CI ---
  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-k5-light-grey dark:bg-k5-black font-sans">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-k5-digital/10 border-t-k5-digital rounded-full animate-spin"></div>
        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-k5-sand animate-pulse" size={24} />
      </div>
      <div className="mt-8 text-center">
        <h2 className="text-k5-black dark:text-white font-black uppercase tracking-[0.4em] text-xs">Handbook OS</h2>
        <p className="text-k5-sand font-bold text-[9px] uppercase tracking-[0.2em] mt-2 opacity-50">Initializing Knowledge Nodes...</p>
      </div>
    </div>
  );

  if (!user) return <LoginView onLogin={() => {}} />;

  const isPrivileged = userData?.role === 'admin' || userData?.role === 'privileged';

  return (
    <Router>
      <div className="flex h-screen bg-white dark:bg-k5-black overflow-hidden text-k5-black dark:text-white font-sans selection:bg-k5-digital selection:text-white">
        
        {/* Modals */}
        {isProfileModalOpen && (
            <ProfileModal user={userData} onClose={() => setIsProfileModalOpen(false)} onUpdate={refreshUserData} />
        )}
        {isWikiCreateModalOpen && (
            <WikiCreateModal isOpen={isWikiCreateModalOpen} onClose={() => setIsWikiCreateModalOpen(false)} onSave={handleCreateWiki} isDarkMode={false} />
        )}

        {/* Navigation Sidebar */}
        <Sidebar 
          user={user}
          customWikis={customWikis}
          isPrivileged={isPrivileged}
          onLogout={handleLogout}
          onCreateWiki={() => setIsWikiCreateModalOpen(true)}
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <div className="flex-1 overflow-y-auto p-0 md:p-4 lg:p-8 scroll-smooth custom-scrollbar" id="main-scroll">
             <div className="max-w-[1600px] mx-auto min-h-full">
                <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    
                    {/* Catch-all for Tabs & Wikis via MainContent Wrapper */}
                    <Route path="/:tabId" element={
                      <MainContent 
                        user={userData}
                        upcomingEvents={upcomingEvents}
                        adminFeedbackList={adminFeedbackList}
                        isPrivileged={isPrivileged}
                        onRefreshFeedback={loadFeedback}
                        customWikis={customWikis}
                      />
                    } />

                    <Route path="/wiki/:wikiId" element={
                      <MainContent 
                        user={userData}
                        upcomingEvents={upcomingEvents}
                        adminFeedbackList={adminFeedbackList}
                        isPrivileged={isPrivileged}
                        onRefreshFeedback={loadFeedback}
                        customWikis={customWikis}
                      />
                    } />
                </Routes>
             </div>
          </div>

          {/* Persistent Feedback System */}
          <FeedbackButton user={userData} /> 
        </div>
      </div>
    </Router>
  );
}

export default App;