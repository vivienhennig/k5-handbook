import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// Config & Logic
import { auth } from './config/firebase';
import { authService } from './services/api';
import { useAppLogic } from './hooks/useAppLogic'; // <--- UNSER HOOK

// Components
import Header from './components/Header';
import MainContent from './components/MainContent'; // <--- CONTENT KOMPONENTE
import { FeedbackModal, ProfileEditModal } from './components/Modals';

// --- LOGIN SCREEN (kann hier bleiben) ---
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
            } else { user = await authService.login(email, password); }
            onLogin(user);
        } catch (error) { console.error(error); setError(isRegistering ? "Registrierung fehlgeschlagen." : "Login fehlgeschlagen."); }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="text-center mb-8"><div className="w-20 h-20 bg-[#092AFF] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"><span className="text-white font-black text-3xl">K5</span></div><h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Digital Handbook</h1><p className="text-gray-500 dark:text-gray-400 text-sm">Bitte logge dich mit deiner K5-Adresse ein.</p></div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">E-Mail</label><input type="email" className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg p-3 text-sm" placeholder="name@k5-gmbh.com" value={email} onChange={(e) => setEmail(e.target.value)} required/></div>
                    <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Passwort</label><input type="password" className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg p-3 text-sm" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required/></div>
                    {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs p-3 rounded-lg flex items-center gap-2"><AlertTriangle size={14}/>{error}</div>}
                    <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-[#092AFF] text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all">{isLoading ? "Prüfe..." : (isRegistering ? "Account erstellen" : "Einloggen")}</button>
                </form>
                {auth && <div className="mt-6 text-center"><button onClick={() => setIsRegistering(!isRegistering)} className="text-xs text-gray-500 hover:text-blue-600">{isRegistering ? "Zurück zum Login" : "Neu hier? Account erstellen"}</button></div>}
            </div>
        </div>
    );
};

// --- HAUPT APP ---
export default function K5HandbookApp() {
  const app = useAppLogic(); // Hier kommt die ganze Logik her!

  if (app.authLoading) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!app.user) return <LoginScreen onLogin={app.handleLoginSuccess} />;

  return (
    <div className={app.darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-100 transition-colors duration-200 flex flex-col">
        
        {/* Header */}
        <Header 
            user={app.user}
            activeTab={app.activeTab}
            handleNav={app.handleNav}
            toggleDarkMode={app.toggleDarkMode}
            darkMode={app.darkMode}
            onOpenProfile={() => app.setProfileModalOpen(true)}
            onLogout={app.handleLogout}
            hasUpdate={app.hasUpdate}
            isPrivileged={app.isPrivileged}
        />

        {/* Modals */}
        <FeedbackModal 
            isOpen={app.feedbackModalOpen} 
            onClose={() => app.setFeedbackModalOpen(false)} 
            context={app.feedbackContext} 
            user={app.user} 
        />
        {app.user && (
            <ProfileEditModal 
                isOpen={app.profileModalOpen} 
                onClose={() => app.setProfileModalOpen(false)} 
                currentUser={app.user} 
                onSave={app.handleProfileSave} 
            />
        )}

        {/* Content Area */}
        <main className="container mx-auto px-4 lg:px-8 py-12 pt-32 max-w-6xl flex-grow">
            <MainContent 
                {...app} // Übergibt ALLES aus useAppLogic an MainContent
                openFeedback={(ctx) => { app.setFeedbackContext(ctx); app.setFeedbackModalOpen(true); }}
            />
        </main>
      </div>
    </div>
  );
}