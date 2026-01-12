import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import LoginView from './pages/LoginView';
import FeedbackButton from './components/FeedbackButton';
import ProfileModal from './components/ProfileModal'; // <--- MODAL IMPORT
import { Menu, X } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { userApi, eventApi, feedbackApi } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // <--- Modal State
  
  // Data States
  const [newsFeed, setNewsFeed] = useState([]);
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
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loadDashboardData = async () => {
    const events = await eventApi.getUpcoming(3);
    setUpcomingEvents(events);
  };

  const loadFeedback = async () => {
      const data = await feedbackApi.getAll();
      setAdminFeedbackList(data);
  };

  // Wird aufgerufen, wenn im Profil-Modal gespeichert wird
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

  const toggleFavorite = async (sectionId) => {
    if (!user) return;
    const currentFavs = userData?.favorites || [];
    const newFavs = currentFavs.includes(sectionId)
      ? currentFavs.filter(id => id !== sectionId)
      : [...currentFavs, sectionId];
    
    setUserData(prev => ({ ...prev, favorites: newFavs }));
    await userApi.saveFavorites(user.uid, newFavs);
  };

  const openFeedback = (context = '') => {
      console.log("Feedback requested for:", context);
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  if (!user) {
    return <LoginView onLogin={() => {}} />;
  }

  const isPrivileged = userData?.role === 'admin' || userData?.role === 'privileged';

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden text-gray-900 dark:text-gray-100 font-sans">
      
      {/* Profil Modal Overlay */}
      {isProfileModalOpen && (
          <ProfileModal 
              user={userData} 
              onClose={() => setIsProfileModalOpen(false)}
              onUpdate={refreshUserData}
          />
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 border-r border-gray-200 dark:border-gray-700 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
          user={userData} 
          activeTab={activeTab} 
          handleNav={handleNav} 
          isPrivileged={isPrivileged}
          isMobile={true}
          closeMobileMenu={() => setIsMobileMenuOpen(false)}
          onOpenProfile={() => setIsProfileModalOpen(true)} // <--- Handler übergeben
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <div className="md:hidden bg-white dark:bg-gray-800 p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div className="font-black text-xl tracking-tight text-blue-600">K5 Handbook</div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 dark:text-gray-300">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth relative" id="main-scroll">
           <MainContent 
              user={userData}
              activeTab={activeTab}
              newsFeed={newsFeed}
              upcomingEvents={upcomingEvents}
              userFavorites={userData?.favorites || []}
              handleNav={handleNav}
              toggleFavorite={toggleFavorite}
              adminFeedbackList={adminFeedbackList}
              isPrivileged={isPrivileged}
              openFeedback={openFeedback}
              onRefreshFeedback={loadFeedback}
           />
        </div>

        {/* Floating Feedback Button */}
        <FeedbackButton user={userData} /> 
        
      </div>
    </div>
  );
}

export default App;