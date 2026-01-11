import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, User, PenTool, RefreshCw } from 'lucide-react';
import { userApi } from '../services/api';

export default function AdminUserManagement() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        setLoading(true);
        const data = await userApi.getAllUsers();
        setUsers(data);
        setLoading(false);
    };

    // NEU: Zyklischer Rollenwechsel: User -> Editor -> Admin -> User
    const cycleRole = async (uid, currentRole) => {
        let newRole = 'user';
        if (currentRole === 'user' || !currentRole) newRole = 'editor';
        else if (currentRole === 'editor') newRole = 'admin';
        else if (currentRole === 'admin') newRole = 'user';

        if (window.confirm(`Rolle ändern zu "${newRole.toUpperCase()}"?`)) {
            await userApi.updateUserRole(uid, newRole);
            loadUsers();
        }
    };

    const filteredUsers = users.filter(u => 
        (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (u.displayName && u.displayName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        u.uid.includes(searchTerm)
    );

    const getRoleBadge = (role) => {
        switch(role) {
            case 'admin': return <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300"><Shield size={12}/> Admin</span>;
            case 'editor': return <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"><PenTool size={12}/> Content Manager</span>;
            default: return <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"><User size={12}/> User</span>;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <Users size={18} className="text-blue-600 dark:text-blue-400"/> User & Rechte Verwaltung
                </h3>
                <button onClick={loadUsers} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /></button>
            </div>

            <div className="relative mb-6">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Search size={16} /></div>
                <input type="text" placeholder="Suchen..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"/>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-4 py-3 rounded-l-lg">User</th>
                            <th className="px-4 py-3">Rolle</th>
                            <th className="px-4 py-3 rounded-r-lg text-right">Aktion</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredUsers.map((u) => (
                            <tr key={u.uid} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                    <div className="flex flex-col">
                                        <span className="font-bold">{u.displayName}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">{u.email || u.uid}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">{getRoleBadge(u.role)}</td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={() => cycleRole(u.uid, u.role)} className="text-xs font-bold px-3 py-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40">
                                        Rolle ändern
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}