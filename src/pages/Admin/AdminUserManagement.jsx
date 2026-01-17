import React, { useState, useEffect, useMemo } from 'react';
import { userApi } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import UserManagementHeader from '../../components/Admin/UserManagementHeader.jsx';
import UserManagementRow from '../../components/Admin/UserManagementRow.jsx'; 

export default function AdminUserManagement({ currentUser }) {
    const { addToast } = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingStatsId, setEditingStatsId] = useState(null);
    const [tempStats, setTempStats] = useState({ entitlement: 0, carryOver: 0 });

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await userApi.getAllUsers();
            setUsers(data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const handleRoleChange = async (targetUserId, newRole) => {
        if (targetUserId === currentUser.uid) return;
        try {
            setUsers(users.map(u => u.uid === targetUserId ? { ...u, role: newRole } : u));
            await userApi.updateUserRole(targetUserId, newRole);
            addToast("Rolle aktualisiert");
        } catch (error) {
            addToast("Fehler beim Ändern der Rolle", "error");
            loadUsers();
        }
    };

    const saveStats = async (targetUserId) => {
        try {
            await userApi.updateAdminUserStats(targetUserId, tempStats);
            setUsers(users.map(u => u.uid === targetUserId ? { 
                ...u, 
                vacationEntitlement: parseFloat(tempStats.entitlement), 
                carryOverDays: parseFloat(tempStats.carryOver) 
            } : u));
            setEditingStatsId(null);
            addToast("Statistiken gespeichert");
        } catch (error) { addToast("Fehler beim Speichern", "error"); }
    };

    // Gefilterte und alphabetisch sortierte User-Liste
    const filteredUsers = useMemo(() => {
        return users
            .filter(u => 
                u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.department?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
                const nameA = a.displayName || "";
                const nameB = b.displayName || "";
                return nameA.localeCompare(nameB, 'de', { sensitivity: 'base' });
            });
    }, [users, searchTerm]);

    if (loading) return <div className="p-8 text-center text-gray-400 font-sans italic uppercase tracking-widest font-black">Lade Benutzerdaten...</div>;

    return (
        <div className="space-y-6 font-sans">
            {/* Dein Header mit Statistiken und Search-Input */}
            <UserManagementHeader 
                userCount={users.length} 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
            />

            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-all">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                            <tr>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-[0.2em] text-[10px] italic">Mitarbeiter</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-[0.2em] text-[10px] italic">Rolle</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-[0.2em] text-[10px] italic">Urlaub</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-[0.2em] text-[10px] text-right italic">Aktionen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                            {filteredUsers.map(user => (
                                <UserManagementRow 
                                    key={user.uid}
                                    user={user}
                                    isMe={currentUser?.uid === user.uid}
                                    isEditing={editingStatsId === user.uid}
                                    tempStats={tempStats}
                                    setTempStats={setTempStats}
                                    onRoleChange={handleRoleChange}
                                    onStartEdit={(u) => {
                                        setEditingStatsId(u.uid);
                                        setTempStats({ entitlement: u.vacationEntitlement || 30, carryOver: u.carryOverDays || 0 });
                                    }}
                                    onCancelEdit={() => setEditingStatsId(null)}
                                    onSaveStats={saveStats}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {filteredUsers.length === 0 && (
                <div className="py-20 text-center">
                    <p className="text-gray-400 font-black italic uppercase tracking-widest text-sm">Keine Mitglieder gefunden</p>
                </div>
            )}
        </div>
    );
}