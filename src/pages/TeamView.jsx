import React, { useState, useEffect } from 'react';
import { Search, Mail, User, Briefcase, Info } from 'lucide-react';
import { userApi } from '../services/api';

export default function TeamView() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        userApi.getAllUsers().then(data => {
            const sorted = data.sort((a, b) => (a.displayName || '').localeCompare(b.displayName || ''));
            setUsers(sorted);
            setLoading(false);
        });
    }, []);

    const filtered = users.filter(u => 
        (u.displayName || '').toLowerCase().includes(search.toLowerCase()) || 
        (u.department || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.responsibilities || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Team K5</h2>
                    <p className="text-gray-500 dark:text-gray-400">Wer macht was beim Event?</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                    <input type="text" placeholder="Suche (Name, Aufgabe)..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"/>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-400">Lade Team...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(user => (
                        <div key={user.uid} className="bg-white dark:bg-gray-800 rounded-xl p-0 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all overflow-hidden flex flex-col h-full">
                            {/* Header mit Abteilung & Rolle */}
                            <div className="h-20 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 relative">
                                {user.department && (
                                    <span className="absolute top-3 right-3 bg-white/90 dark:bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider text-gray-600 dark:text-gray-300 border border-white/50 dark:border-white/10">
                                        {user.department}
                                    </span>
                                )}
                            </div>
                            
                            <div className="px-6 relative flex-grow flex flex-col">
                                {/* Avatar / Foto */}
                                <div className="-mt-10 mb-3">
                                    <div className="w-20 h-20 rounded-xl border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-700 shadow-sm overflow-hidden flex items-center justify-center">
                                        {user.photoUrl ? (
                                            <img src={user.photoUrl} alt={user.displayName} className="w-full h-full object-cover"/>
                                        ) : (
                                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User/>}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Info */}
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight mb-1">
                                    {user.displayName || 'Unbekannt'}
                                </h3>
                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-4 h-5">
                                    {user.position || user.role}
                                </p>

                                {/* Aufgaben */}
                                {user.responsibilities && (
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4 text-xs text-gray-600 dark:text-gray-300 leading-relaxed border border-gray-100 dark:border-gray-700 flex-grow">
                                        <strong className="block text-gray-400 dark:text-gray-500 mb-1 text-[10px] uppercase">Zuständig für:</strong>
                                        {user.responsibilities}
                                    </div>
                                )}
                                
                                {/* Footer: Kontakt */}
                                <div className="mt-auto py-4 border-t border-gray-100 dark:border-gray-700">
                                    <a href={`mailto:${user.email}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300 transition-colors">
                                        <Mail size={14}/> {user.email || '-'}
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}