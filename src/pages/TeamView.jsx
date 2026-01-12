import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Briefcase, Award } from 'lucide-react';
import { userApi } from '../services/api';
import { DEPARTMENT_COLORS } from '../config/data';

export default function TeamView() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('Alle');

    useEffect(() => {
        const loadUsers = async () => {
            const data = await userApi.getAllUsers();
            setUsers(data);
            setLoading(false);
        };
        loadUsers();
    }, []);

    const departments = ['Alle', ...Object.keys(DEPARTMENT_COLORS).filter(k => k !== 'default')];

    const AvatarWithFallback = ({ src, alt, initial }) => {
        const [error, setError] = useState(false);
    
        // Wenn wir eine URL haben und noch kein Fehler auftrat -> Bild zeigen
        if (src && !error) {
            return (
                <img 
                    src={src} 
                    alt={alt} 
                    className="w-full h-full object-cover"
                    onError={() => setError(true)} // Bei Fehler -> State ändern
                />
            );
        }
        // Sonst -> Initialen zeigen
        return <span>{initial || '?'}</span>;
    };

    // Hilfsfunktion: Abteilungsfarbe holen
    const getDeptStyle = (deptName) => {
        // Findet den passenden Key in DEPARTMENT_COLORS
        const key = Object.keys(DEPARTMENT_COLORS).find(k => deptName?.includes(k)) || 'default';
        return DEPARTMENT_COLORS[key];
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            user.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.responsibilities?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesDept = filterDept === 'Alle' || user.department === filterDept;

        return matchesSearch && matchesDept;
    });

    if (loading) return <div className="p-10 text-center text-gray-400">Lade Team...</div>;

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-20">
            
            {/* Header Area */}
            <div className="mb-10 text-center">
                <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                    K5 Allstars Team
                </h2>
                <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                    Wer macht eigentlich was? Hier findest du alle Ansprechpartner und Verantwortlichkeiten.
                </p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18}/>
                    <input 
                        type="text" 
                        placeholder="Suche nach Name, Job oder Aufgabe..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                    {departments.map(dept => (
                        <button 
                            key={dept}
                            onClick={() => setFilterDept(dept)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                                filterDept === dept 
                                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md' 
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        >
                            {dept}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredUsers.map(user => {
                    const deptStyle = getDeptStyle(user.department);
                    
                    return (
                        <div key={user.uid} className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                            
                            {/* Color Banner */}
                            <div className={`h-2 w-full ${deptStyle.classes.split(' ')[0]}`}></div> {/* Nutzt nur die bg-Klasse */}
                            
                            <div className="p-6 flex flex-col flex-1 relative">
                                {/* Department Badge */}
                                <div className="absolute top-4 right-4">
                                     <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${deptStyle.classes}`}>
                                        {user.department || 'Team'}
                                     </span>
                                </div>

                                {/* Avatar & Name */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative shrink-0">
                                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl font-black text-gray-400 overflow-hidden border-2 border-white dark:border-gray-600 shadow-md group-hover:scale-110 transition-transform duration-300">
                                            {/* Verbesserter Avatar Bereich */}
                                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl font-black text-gray-400 overflow-hidden border-2 border-white dark:border-gray-600 shadow-md group-hover:scale-110 transition-transform duration-300">
                                                <AvatarWithFallback src={user.photoUrl} alt={user.displayName} initial={user.displayName?.charAt(0)} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate" title={user.displayName}>
                                            {user.displayName}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                                            <Briefcase size={12}/> {user.position || 'K5 Member'}
                                        </p>
                                    </div>
                                </div>

                                {/* Responsibilities */}
                                <div className="flex-1">
                                    {user.responsibilities ? (
                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-gray-400 mb-2 flex items-center gap-1">
                                                <Award size={12}/> Aufgabenbereiche
                                            </p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {user.responsibilities.split(',').map((tag, i) => (
                                                    <span key={i} className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md text-xs font-medium border border-gray-100 dark:border-gray-600">
                                                        {tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">Keine Aufgaben hinterlegt.</p>
                                    )}
                                </div>

                                {/* Contact Footer */}
                                <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-700/50 flex items-center justify-between text-xs text-gray-400">
                                    <span className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer" title={user.email} onClick={() => window.location.href=`mailto:${user.email}`}>
                                        <Mail size={12}/> E-Mail senden
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                    <Users size={48} className="mx-auto mb-4 opacity-20"/>
                    <p>Kein Teammitglied gefunden.</p>
                </div>
            )}

        </div>
    );
}