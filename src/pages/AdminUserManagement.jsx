import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, User, RefreshCw, Briefcase, X } from 'lucide-react';
import { userApi } from '../services/api';
import { STANDARD_VACATION_DAYS } from '../config/data';

// Kleines Sub-Modal zum Bearbeiten der Tage
const UserVacationModal = ({ user, onClose, onSave }) => {
    const [entitlement, setEntitlement] = useState(user.vacationEntitlement || STANDARD_VACATION_DAYS);
    const [carryOver, setCarryOver] = useState(user.carryOverDays || 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(user.uid, { entitlement, carryOver });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[90] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white">Urlaubskonto: {user.displayName}</h3>
                    <button onClick={onClose}><X size={20} className="text-gray-400"/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200 mb-2">
                        Gesamtbudget: <strong>{parseFloat(entitlement) + parseFloat(carryOver)} Tage</strong>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Jahresanspruch (Aktuelles Jahr)</label>
                        <input type="number" step="0.5" className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={entitlement} onChange={e => setEntitlement(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Übertrag aus Vorjahr (Resturlaub)</label>
                        <input type="number" step="0.5" className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={carryOver} onChange={e => setCarryOver(e.target.value)} />
                        <p className="text-[10px] text-gray-400 mt-1">Positive Zahl = Resturlaub vom Vorjahr.<br/>Negative Zahl = Minusstunden/Vorgriff.</p>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700">Speichern</button>
                </form>
            </div>
        </div>
    );
};

export default function AdminUserManagement() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        setLoading(true);
        const data = await userApi.getAllUsers();
        setUsers(data);
        setLoading(false);
    };

    const handleRoleChange = async (uid, currentRole) => {
        let newRole = 'user';
        if (currentRole === 'user' || !currentRole) newRole = 'editor';
        else if (currentRole === 'editor') newRole = 'admin';
        else if (currentRole === 'admin') newRole = 'user';

        if (window.confirm(`Rolle ändern zu "${newRole.toUpperCase()}"?`)) {
            await userApi.updateUserRole(uid, newRole);
            loadUsers();
        }
    };

    const handleVacationSave = async (uid, stats) => {
        await userApi.updateAdminUserStats(uid, stats);
        setEditingUser(null);
        loadUsers();
    };

    const filteredUsers = users.filter(u => 
        (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (u.displayName && u.displayName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        u.uid.includes(searchTerm)
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8 animate-in fade-in duration-500">
            {editingUser && <UserVacationModal user={editingUser} onClose={() => setEditingUser(null)} onSave={handleVacationSave} />}
            
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <Users size={18} className="text-blue-600 dark:text-blue-400"/> User & Rechte
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
                            <th className="px-4 py-3 text-center">Urlaub (Neu + Vorjahr)</th>
                            <th className="px-4 py-3 rounded-r-lg text-right">Aktion</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredUsers.map((u) => (
                            <tr key={u.uid} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                    <div className="flex flex-col">
                                        <span className="font-bold">{u.displayName}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">{u.email}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <button onClick={() => handleRoleChange(u.uid, u.role)} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                                        {u.role || 'user'}
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <div className="flex flex-col items-center">
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            {(u.vacationEntitlement || STANDARD_VACATION_DAYS) + (u.carryOverDays || 0)} Ges.
                                        </span>
                                        <span className="text-[10px] text-gray-400">
                                            {u.vacationEntitlement || STANDARD_VACATION_DAYS} Neu 
                                            {(u.carryOverDays || 0) !== 0 && ` + ${u.carryOverDays} Alt`}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={() => setEditingUser(u)} className="text-xs font-bold px-3 py-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 flex items-center gap-1 ml-auto">
                                        <Briefcase size={12}/> Konto
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