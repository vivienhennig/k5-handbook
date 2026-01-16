import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { userApi } from '../services/api';
import { DEPARTMENT_COLORS } from '../config/data';
import UserCard from '../components/Team/UserCard';
import TeamFilterBar from '../components/Team/TeamFilterBar';

export default function TeamView() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('Alle');

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await userApi.getAllUsers();
                setUsers(data);
            } catch (e) { console.error(e); }
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

    if (loading) return <div className="p-20 text-center text-gray-400 font-black animate-pulse uppercase tracking-widest">Gathering the Squad...</div>;

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-20 px-4 font-sans">
            {/* Header */}
            <div className="mb-16 text-center">
                <h2 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter italic uppercase">
                    K5 Allstars <span className="text-blue-600">Team</span>
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-bold uppercase text-xs tracking-widest italic">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredUsers.map(user => (
                    <UserCard 
                        key={user.uid} 
                        user={user} 
                        deptStyle={getDeptStyle(user.department)} 
                    />
                ))}
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-24 bg-gray-50 dark:bg-gray-900/50 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                    <Users size={48} className="mx-auto mb-4 text-gray-200"/>
                    <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest italic">Niemand gefunden, der zu deiner Suche passt.</p>
                </div>
            )}
        </div>
    );
}