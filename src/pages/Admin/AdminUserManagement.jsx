import React, { useState, useEffect } from 'react';
import { userApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import UserManagementHeader from '../../components/Admin/UserManagementHeader';
import UserManagementRow from '../../components/Admin/UserManagementRow'; 

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

    const filteredUsers = users.filter(u => 
        u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-gray-400 font-sans">Lade Benutzerdaten...</div>;

    return (
        <div className="space-y-6 font-sans">
            <UserManagementHeader 
                userCount={users.length} 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
            />

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-xs italic">Mitarbeiter</th>
                                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-xs italic">Rolle</th>
                                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-xs italic">Urlaub</th>
                                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-xs text-right italic">Aktionen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
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
        </div>
    );
}