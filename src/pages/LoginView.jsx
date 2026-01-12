import React, { useState } from 'react';
import { authService } from '../services/api';
import { Lock, Mail, ArrowRight, Loader, AlertCircle } from 'lucide-react';

export default function LoginView() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await authService.login(email, password);
            // App.jsx bemerkt den Login automatisch via onAuthStateChanged
        } catch (err) {
            console.error(err);
            setError('Login fehlgeschlagen. Bitte prüfe E-Mail und Passwort.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                
                {/* Header Decoration */}
                <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600 w-full"></div>

                <div className="p-8">
                    {/* Logo & Title */}
                    <div className="text-center mb-8">
                        <div className="bg-blue-50 dark:bg-blue-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400 font-black text-2xl shadow-sm">
                            K5
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">K5 Handbook</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Bitte melde dich mit deinem Account an.</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                            <AlertCircle size={18} className="shrink-0 mt-0.5"/>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-gray-500 uppercase ml-1">E-Mail Adresse</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                                <input 
                                    type="email" 
                                    required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="name@k5.de"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-gray-500 uppercase ml-1">Passwort</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                                <input 
                                    type="password" 
                                    required 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? <Loader className="animate-spin" size={20}/> : <>Anmelden <ArrowRight size={18}/></>}
                        </button>

                    </form>
                </div>
                
                {/* Footer */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 text-center border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-400">© {new Date().getFullYear()} K5 GmbH • Internal Use Only</p>
                </div>
            </div>
        </div>
    );
}