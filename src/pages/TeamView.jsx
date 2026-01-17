import React, { useState, useEffect } from 'react';
import { Users, SearchX } from 'lucide-react';
import { userApi } from '../services/api.js';
import { DEPARTMENT_COLORS } from '../config/data.js';
import UserCard from '../components/Team/UserCard.jsx';
import TeamFilterBar from '../components/Team/TeamFilterBar.jsx';

export default function TeamView() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('Alle');

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await userApi.getAllUsers();
            
                // Alphabetische Sortierung hinzufügen
                const sortedData = [...data].sort((a, b) => {
                    const nameA = a.displayName?.toLowerCase() || '';
                    const nameB = b.displayName?.toLowerCase() || '';
                    return nameA.localeCompare(nameB);
                });
                setUsers(sortedData);
            } catch (e) { 
                console.error(e); 
            }
            setLoading(false);
        };
        loadUsers();
    }, []);

    const departments = ['Alle', ...Object.keys(DEPARTMENT_COLORS).filter(k => k !== 'default')];

    const getDeptStyle = (deptName) => {
        const key = Object.keys(DEPARTMENT_COLORS).find(k => deptName?.includes(k)) || 'default';
        return DEPARTMENT_COLORS[key];
    };

    const filteredUsers = users.filter(user => {
        const searchStr = searchTerm.toLowerCase();
        const matchesSearch = 
            user.displayName?.toLowerCase().includes(searchStr) || 
            user.position?.toLowerCase().includes(searchStr) ||
            user.responsibilities?.toLowerCase().includes(searchStr);
        const matchesDept = filterDept === 'Alle' || user.department === filterDept;
        return matchesSearch && matchesDept;
    });

    if (loading) return (
        <div className="p-32 text-center text-k5-sand font-bold uppercase tracking-[0.4em] animate-pulse">
            Gathering the Squad...
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-32 px-4 font-sans">
            {/* Header: Italic entfernt, Aeonik Black genutzt */}
            <div className="mb-20 text-center">
                <h2 className="text-5xl lg:text-7xl font-black text-k5-black dark:text-white mb-6 tracking-tighter uppercase leading-none">
                    K5 Allstars <span className="text-k5-digital">Team</span>
                </h2>
                <p className="text-k5-sand dark:text-k5-sand/80 max-w-2xl mx-auto font-bold uppercase text-[11px] tracking-[0.3em]">
                    Wer macht was? Alle Ansprechpartner auf einen Blick.
                </p>
            </div>

            <TeamFilterBar 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                departments={departments} 
                filterDept={filterDept} 
                setFilterDept={setFilterDept} 
            />

            {/* Responsive Grid: 3 Spalten auf Laptop (lg), 4 auf XL Monitoren */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
                {filteredUsers.map(user => (
                    <UserCard 
                        key={user.uid} 
                        user={user} 
                        deptStyle={getDeptStyle(user.department)} 
                    />
                ))}
            </div>

            {/* Empty State: k5-lg Rundung */}
            {filteredUsers.length === 0 && (
                <div className="text-center py-32 bg-white dark:bg-k5-black/40 rounded-k5-lg border-2 border-dashed border-gray-100 dark:border-k5-deep mt-10">
                    <div className="w-20 h-20 bg-k5-light-grey dark:bg-k5-deep/20 rounded-full flex items-center justify-center mx-auto mb-6 text-k5-sand">
                        <SearchX size={40} />
                    </div>
                    <p className="text-k5-black dark:text-white font-bold uppercase text-xs tracking-[0.2em] mb-2">
                        Niemand gefunden
                    </p>
                    <p className="text-gray-400 text-[10px] uppercase tracking-widest">
                        Versuche es mit einem anderen Suchbegriff oder Filter.
                    </p>
                </div>
            )}
        </div>
    );
}