import React, { useState } from 'react';
import { User, AlertTriangle, Flag } from 'lucide-react';
import { authService, feedbackApi } from '../services/api';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export const LoginModal = ({ isOpen, onClose, onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    
    if (!isOpen) return null;
    
    const handleSubmit = async (e) => {
        e.preventDefault(); setError('');
        if (!email.toLowerCase().endsWith('@k5-gmbh.com')) { setError('Zugriff verweigert. Bitte @k5-gmbh.com nutzen.'); return; }
        setIsLoading(true);
        try {
            let user;
            if(auth) {
                if (isRegistering) { const cred = await createUserWithEmailAndPassword(auth, email, password); user = cred.user; } 
                else { user = await authService.login(email, password); }
            } else {
                user = await authService.login(email, password);
            }
            onLogin(user); onClose(); setEmail(''); setPassword(''); 
        } catch (error) { 
             console.error(error);
             setError(isRegistering ? "Registrierung fehlgeschlagen" : "Login fehlgeschlagen."); 
        }
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-8">
                <div className="text-center mb-6"><div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4"><User size={32} className="text-blue-600 dark:text-blue-300"/></div><h2 className="text-2xl font-black text-gray-900 dark:text-white">K5 Login</h2><p className="text-sm text-gray-500 dark:text-gray-400">Logge dich mit deiner Firmen-Email ein.</p></div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">E-Mail</label><input type="email" className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-3 text-sm" placeholder="name@k5-gmbh.com" value={email} onChange={(e) => setEmail(e.target.value)} required/></div>
                    <div><div className="flex justify-between items-center mb-1"><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Passwort</label></div><input type="password" className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-3 text-sm" placeholder="Dein Passwort" value={password} onChange={(e) => setPassword(e.target.value)}/></div>
                    {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs p-3 rounded-lg flex items-center gap-2"><AlertTriangle size={14}/>{error}</div>}
                    <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50">{isLoading ? "Prüfe..." : (isRegistering ? "Registrieren" : "Einloggen")}</button>
                </form>
                {auth && (
                    <div className="mt-4 text-center"><button onClick={() => setIsRegistering(!isRegistering)} className="text-xs text-blue-500 hover:underline">{isRegistering ? "Zurück zum Login" : "Noch keinen Account? Hier registrieren"}</button></div>
                )}
                <button onClick={onClose} className="w-full mt-4 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">Abbrechen</button>
            </div>
        </div>
    );
};

export const FeedbackModal = ({ isOpen, onClose, context, user }) => {
  const [type, setType] = useState('outdated');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  if (!isOpen) return null;
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try { await feedbackApi.submit({ type, comment, context, userName: user?.email ? user.email.split('@')[0] : 'Gast', userRole: user?.role || 'guest' }); alert('Danke für dein Feedback!'); setComment(''); onClose(); } catch (e) { alert('Fehler beim Senden.'); }
    setIsSubmitting(false);
  };
  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-gray-900 dark:text-white"><Flag className="text-red-500" size={20}/> Problem melden</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Kontext: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">{context}</span></p>
        <div className="flex gap-2 mb-4">{['outdated', 'error', 'suggestion'].map(t => (<button key={t} onClick={() => setType(t)} className={`flex-1 py-2 px-3 rounded text-sm border capitalize ${type === t ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>{t}</button>))}</div>
        <textarea className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-2 text-sm mb-6" rows="3" placeholder="Kommentar..." value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
        <div className="flex justify-end gap-3"><button onClick={onClose} className="px-4 py-2 text-gray-500 font-medium text-sm">Abbrechen</button><button onClick={handleSubmit} disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700">{isSubmitting ? 'Sende...' : 'Senden'}</button></div>
      </div>
    </div>
  );
};