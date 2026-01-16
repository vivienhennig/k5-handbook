import React, { useState } from 'react';
import { authService } from '../services/api';
import { Lock, Mail, ArrowRight, Loader, AlertCircle, UserPlus, ShieldCheck } from 'lucide-react';

export default function LoginView() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isRegistering) {
                await authService.register(email, password);
            } else {
                await authService.login(email, password);
            }
        } catch (err) {
            console.error(err);
            const errorMessage = isRegistering 
                ? 'Registrierung fehlgeschlagen. E-Mail existiert evtl. schon.' 
                : 'Login fehlgeschlagen. Bitte prüfe E-Mail und Passwort.';
            setError(errorMessage);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6 font-sans relative overflow-hidden">
            
            {/* Abstrakte Hintergrund-Deko für den High-End Look */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[120px]" />

            <div className="max-w-[480px] w-full relative">
                
                {/* Brand Header */}
                <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-[2rem] text-white font-black italic text-3xl shadow-2xl shadow-blue-500/40 mb-6 rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
                        K5
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">
                        {isRegistering ? 'Join the' : 'K5'} <span className="text-blue-600">Allstars</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mt-3 italic">
                        {isRegistering ? 'Internal Crew Registration' : 'Zentrales Team Handbook'}
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl shadow-blue-900/5 border border-gray-100 dark:border-gray-800 overflow-hidden animate-in zoom-in-95 duration-500">
                    <div className="p-10 lg:p-12">
                        
                        {error && (
                            <div className="mb-8 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 px-5 py-4 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in shake duration-500">
                                <AlertCircle size={18} className="shrink-0"/>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="group">
                                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 ml-2 italic">Corporate Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20}/>
                                    <input 
                                        type="email" 
                                        required 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-gray-800/50 border-none rounded-[1.8rem] text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none dark:text-white transition-all placeholder:text-gray-300"
                                        placeholder="vorname.nachname@k5.de"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 ml-2 italic">Access Key</label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20}/>
                                    <input 
                                        type="password" 
                                        required 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-gray-800/50 border-none rounded-[1.8rem] text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none dark:text-white transition-all placeholder:text-gray-300"
                                        placeholder="••••••••••••"
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[1.8rem] transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-4 uppercase italic tracking-widest text-xs"
                            >
                                {loading ? (
                                    <Loader className="animate-spin" size={20}/>
                                ) : (
                                    <>
                                        {isRegistering ? 'Account erstellen' : 'System Login'} 
                                        {isRegistering ? <UserPlus size={18}/> : <ArrowRight size={18}/>}
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Mode Switcher */}
                        <div className="mt-10 text-center border-t border-gray-50 dark:border-gray-800 pt-8">
                            <button 
                                onClick={() => {
                                    setIsRegistering(!isRegistering);
                                    setError(null);
                                }}
                                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors italic"
                            >
                                {isRegistering 
                                    ? 'Bereits Teil der Crew? Login' 
                                    : 'Noch keinen Zugang? Registrieren'}
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Footer Security Note */}
                <div className="mt-8 flex items-center justify-center gap-3 text-gray-400 animate-in fade-in duration-1000">
                    <ShieldCheck size={16} className="text-green-500/50" />
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] italic">Encrypted Connection • Internal K5 Ops Only</p>
                </div>
            </div>
        </div>
    );
}