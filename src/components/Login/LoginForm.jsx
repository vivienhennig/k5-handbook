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
        <div className="bg-white dark:bg-k5-black rounded-k5-lg shadow-2xl border border-gray-100 dark:border-k5-deep overflow-hidden animate-in zoom-in-95 duration-500 font-sans">
            <div className="p-10 lg:p-14">
                
                {/* Error Alert: Aeonik Bold, K5-Sand/Red Akzent */}
                {error && (
                    <div className="mb-10 bg-red-50 dark:bg-red-900/10 border-l-4 border-k5-sand text-red-700 dark:text-red-400 px-6 py-5 rounded-k5-md text-xs font-bold flex items-center gap-4 animate-in shake duration-500">
                        <AlertCircle size={20} className="shrink-0"/>
                        <span className="tracking-tight">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Email Input */}
                    <div className="group">
                        <label className="block text-[10px] font-bold uppercase text-gray-400 tracking-[0.2em] mb-3 ml-2">Email Adresse</label>
                        <div className="relative">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-k5-digital transition-colors" size={20}/>
                            <input 
                                type="email" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full pl-16 pr-8 py-5 bg-k5-light-grey dark:bg-k5-deep/20 border-none rounded-k5-md text-sm font-bold focus:ring-4 outline-none dark:text-white transition-all placeholder:text-gray-300 ${
                                    email && !email.toLowerCase().endsWith('@k5-gmbh.com') 
                                    ? 'ring-2 ring-k5-sand/50' 
                                    : 'focus:ring-k5-digital/5'
                                }`}
                                placeholder="name@k5-gmbh.com"
                            />
                        </div>
                    </div>

                    {/* Passwort Input */}
                    <div className="group">
                        <label className="block text-[10px] font-bold uppercase text-gray-400 tracking-[0.2em] mb-3 ml-2">Passwort</label>
                        <div className="relative">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-k5-digital transition-colors" size={20}/>
                            <input 
                                type="password" 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-16 pr-8 py-5 bg-k5-light-grey dark:bg-k5-deep/20 border-none rounded-k5-md text-sm font-bold focus:ring-4 focus:ring-k5-digital/5 outline-none dark:text-white transition-all placeholder:text-gray-300"
                                placeholder="••••••••••••"
                            />
                        </div>
                    </div>

                    {/* Submit Button: Glow Digital, Aeonik Bold */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-glow-digital hover:opacity-90 text-white font-bold py-6 rounded-k5-md transition-all shadow-xl shadow-k5-digital/25 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-4 uppercase tracking-[0.2em] text-[11px]"
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

                {/* Switch Login/Register */}
                <div className="mt-12 text-center border-t border-gray-100 dark:border-k5-deep/30 pt-10">
                    <button 
                        onClick={() => {
                            setIsRegistering(!isRegistering);
                            setError(null);
                        }}
                        className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-k5-digital transition-colors"
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