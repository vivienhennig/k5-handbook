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

    if (loading) return (
        <div className="p-20 text-center text-k5-sand font-bold uppercase tracking-[0.4em] animate-pulse">
            Lade Benutzerdaten...
        </div>
    );

    return (
        <div className="space-y-8 font-sans">
            {/* Statistiken & Search */}
            <UserManagementHeader 
                userCount={users.length} 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
            />

            {/* Table Container: rounded-k5-lg */}
            <div className="bg-white dark:bg-k5-black rounded-k5-lg border border-gray-100 dark:border-k5-deep shadow-sm overflow-hidden transition-all">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-k5-light-grey/50 dark:bg-k5-deep/20 border-b border-gray-100 dark:border-k5-deep">
                            <tr>
                                <th className="px-10 py-6 font-bold text-gray-400 uppercase tracking-[0.25em] text-[10px]">Mitarbeiter</th>
                                <th className="px-10 py-6 font-bold text-gray-400 uppercase tracking-[0.25em] text-[10px]">Rolle</th>
                                <th className="px-10 py-6 font-bold text-gray-400 uppercase tracking-[0.25em] text-[10px]">Urlaubsanspruch</th>
                                <th className="px-10 py-6 font-bold text-gray-400 uppercase tracking-[0.25em] text-[10px] text-right">Aktionen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-k5-deep/30">
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
                <div className="py-24 text-center bg-k5-light-grey/20 dark:bg-k5-deep/10 rounded-k5-lg border-2 border-dashed border-gray-100 dark:border-k5-deep">
                    <p className="text-k5-sand font-bold uppercase tracking-[0.3em] text-[10px]">Keine Mitglieder gefunden</p>
                </div>
            )}
        </div>
    );
}