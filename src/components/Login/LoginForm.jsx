import React from 'react';
import { Lock, Mail, ArrowRight, Loader, AlertCircle, UserPlus } from 'lucide-react';

export default function LoginForm({ 
    email, setEmail, 
    password, setPassword, 
    loading, error, 
    isRegistering, setIsRegistering, 
    handleSubmit, setError 
}) {
    return (
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
                        <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 ml-2 italic">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20}/>
                            <input 
                                type="email" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-gray-800/50 border-none rounded-[1.8rem] text-sm font-bold focus:ring-4 outline-none dark:text-white transition-all placeholder:text-gray-300 ${
                                    email && !email.toLowerCase().endsWith('@k5-gmbh.com') 
                                    ? 'ring-2 ring-red-500/50' 
                                    : 'focus:ring-blue-500/5'
                                }`}
                                placeholder="name@k5-gmbh.com"
                            />
                        </div>
                    </div>

                    <div className="group">
                        <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 ml-2 italic">Passwort</label>
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
    );
}