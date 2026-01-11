import React, { useState } from 'react';
import { User, AlertTriangle, Flag, Camera, Briefcase, Save, X, Palmtree } from 'lucide-react';
import { authService, feedbackApi } from '../services/api';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { vacationApi } from '../services/api';
import { STANDARD_VACATION_DAYS } from '../config/data';

// --- LOGIN MODAL (Wird aktuell vom Gatekeeper in App.jsx ersetzt, aber als Fallback gut zu haben) ---
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

// --- FEEDBACK MODAL ---
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

// --- PROFILE EDIT MODAL ---
export const ProfileEditModal = ({ isOpen, onClose, currentUser, onSave }) => {
    const [formData, setFormData] = useState({
        displayName: '',
        position: '',
        department: '',
        responsibilities: '',
        photoUrl: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    
    // State für Urlaubs-Statistik
    const [vacationStats, setVacationStats] = useState(null);

    React.useEffect(() => {
        if (isOpen && currentUser) {
            setFormData({
                displayName: currentUser.displayName || '',
                position: currentUser.position || '',
                department: currentUser.department || '',
                responsibilities: currentUser.responsibilities || '',
                photoUrl: currentUser.photoUrl || ''
            });

            const loadStats = async () => {
                const allVacations = await vacationApi.getAllVacations();
                const currentYear = new Date().getFullYear();
                const myVacations = allVacations.filter(v => 
                    v.userId === currentUser.uid && 
                    v.startDate.startsWith(currentYear.toString())
                );

                const taken = myVacations.reduce((acc, curr) => acc + curr.daysCount, 0);
                const entitlement = currentUser.vacationEntitlement || STANDARD_VACATION_DAYS;
                const carryOver = currentUser.carryOverDays || 0;
                const total = entitlement + carryOver;

                setVacationStats({
                    total: total,
                    taken: taken,
                    remaining: total - taken,
                    year: currentYear
                });
            };
            loadStats();
        }
    }, [isOpen, currentUser]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave(currentUser.uid, formData);
            onClose();
        } catch (error) {
            alert("Fehler beim Speichern.");
        }
        setIsSaving(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6 border-b dark:border-gray-700 pb-4">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <User className="text-blue-600"/> Dein Profil
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white"><X size={24}/></button>
                </div>

                {/* --- NEU: URLAUBS STATISTIK MIT ÜBERSCHRIFT --- */}
                {vacationStats && (
                    <div className="mb-8">
                        <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2 flex items-center gap-1.5 ml-1">
                            <Palmtree size={14}/> Urlaubskonto {vacationStats.year}
                        </h4>
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex justify-between items-center text-center border border-blue-100 dark:border-blue-800 shadow-sm">
                            <div>
                                <div className="text-xl font-black text-gray-800 dark:text-gray-100">{vacationStats.total}</div>
                                <div className="text-[10px] uppercase font-bold text-gray-500">Gesamt</div>
                            </div>
                            <div className="h-8 w-px bg-blue-200 dark:bg-blue-700"></div>
                            <div>
                                <div className="text-xl font-black text-blue-600 dark:text-blue-400">{vacationStats.taken}</div>
                                <div className="text-[10px] uppercase font-bold text-gray-500">Genommen</div>
                            </div>
                            <div className="h-8 w-px bg-blue-200 dark:bg-blue-700"></div>
                            <div>
                                <div className={`text-xl font-black ${vacationStats.remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
                                    {vacationStats.remaining}
                                </div>
                                <div className="text-[10px] uppercase font-bold text-gray-500">Rest</div>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* FOTO URL */}
                    <div className="flex gap-4 items-start">
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600 shrink-0">
                            {formData.photoUrl ? (
                                <img src={formData.photoUrl} alt="Vorschau" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'}/>
                            ) : (
                                <User size={32} className="text-gray-400"/>
                            )}
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Profilbild (URL)</label>
                            <div className="relative">
                                <Camera size={16} className="absolute left-3 top-3 text-gray-400"/>
                                <input type="text" placeholder="https://linkedin.com/bild.jpg" className="w-full pl-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-2.5 text-sm dark:text-white"
                                    value={formData.photoUrl} onChange={e => setFormData({...formData, photoUrl: e.target.value})}
                                />
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1">Rechtsklick auf dein LinkedIn/Firmen-Foto - "Bildadresse kopieren".</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Name</label>
                            <input type="text" required className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-2.5 text-sm dark:text-white font-bold"
                                value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Abteilung</label>
                            <select className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-2.5 text-sm dark:text-white"
                                value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}
                            >
                                <option value="">- Wählen -</option>
                                <option value="Event">Event</option>
                                <option value="Sales">Sales</option>
                                <option value="Geschäftsführung">Geschäftsführung</option>
                                <option value="Finanzen">Finanzen</option>
                                <option value="Audio & Video">Audio & Video</option>
                                <option value="Tech & Tools">Tech & Tools</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Programm & Speaker">Programm & Speaker</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Job Titel (Position)</label>
                        <div className="relative">
                            <Briefcase size={16} className="absolute left-3 top-3 text-gray-400"/>
                            <input type="text" placeholder="z.B. Senior Marketing Manager" className="w-full pl-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-2.5 text-sm dark:text-white"
                                value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Aufgabenbereiche (Stichworte)</label>
                        <textarea rows="3" placeholder="Wofür bist du zuständig? z.B. Ticketing, Rechnungen, Speaker Betreuung..." className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-2.5 text-sm dark:text-white"
                            value={formData.responsibilities} onChange={e => setFormData({...formData, responsibilities: e.target.value})}
                        ></textarea>
                    </div>

                    <button type="submit" disabled={isSaving} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center gap-2 transition-all">
                        {isSaving ? "Speichere..." : <><Save size={18}/> Profil speichern</>}
                    </button>
                </form>
            </div>
        </div>
    );
};