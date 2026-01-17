import React from 'react';
import { Lock, Check, X, Edit2 } from 'lucide-react';

export default function UserManagementRow({ 
    user, 
    isMe, 
    isEditing, 
    tempStats, 
    setTempStats, 
    onRoleChange, 
    onStartEdit, 
    onCancelEdit, 
    onSaveStats 
}) {
    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
            {/* Spalte 1: Info */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-500 overflow-hidden">
                        {user.photoUrl ? (
                            <img src={user.photoUrl} alt="" className="w-full h-full object-cover"/>
                        ) : (
                            user.displayName?.charAt(0) || '?'
                        )}
                    </div>
                    <div>
                        <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {user.displayName}
                            {isMe && <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded border border-blue-200">Du</span>}
                        </div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{user.department || 'Keine Abteilung'}</div>
                    </div>
                </div>
            </td>

            {/* Spalte 2: Rolle */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    {isMe ? (
                        <div className="flex items-center gap-2 text-gray-400 text-xs bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 cursor-not-allowed" title="Du kannst deine eigene Rolle nicht ändern">
                            <Lock size={12}/> Admin (Fest)
                        </div>
                    ) : (
                        <select 
                            value={user.role || 'user'}
                            onChange={(e) => onRoleChange(user.uid, e.target.value)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 ${
                                user.role === 'admin' 
                                ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:border-red-800' 
                                : user.role === 'privileged'
                                ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                        >
                            <option value="user">User</option>
                            <option value="privileged">Privileged (Content)</option>
                            <option value="admin">Admin (Full)</option>
                        </select>
                    )}
                </div>
            </td>

            {/* Spalte 3: Urlaub Stats */}
            <td className="px-6 py-4">
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <div>
                            <label className="text-[9px] uppercase font-bold text-gray-400 block">Anspruch</label>
                            <input 
                                type="number" 
                                className="w-16 p-1 text-sm border rounded bg-white dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                                value={tempStats.entitlement}
                                onChange={e => setTempStats({...tempStats, entitlement: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-[9px] uppercase font-bold text-gray-400 block">Übertrag</label>
                            <input 
                                type="number" 
                                className="w-16 p-1 text-sm border rounded bg-white dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                                value={tempStats.carryOver}
                                onChange={e => setTempStats({...tempStats, carryOver: e.target.value})}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="text-sm">
                        <div className="font-bold text-gray-900 dark:text-white">
                            {user.vacationEntitlement || 30} <span className="text-gray-400 font-normal">Tage</span>
                        </div>
                        {user.carryOverDays > 0 && (
                            <div className="text-xs text-green-600 dark:text-green-400">
                                + {user.carryOverDays} Übertrag
                            </div>
                        )}
                    </div>
                )}
            </td>

            {/* Spalte 4: Actions */}
            <td className="px-6 py-4 text-right">
                {isEditing ? (
                    <div className="flex justify-end gap-2">
                        <button onClick={() => onSaveStats(user.uid)} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">
                            <Check size={16}/>
                        </button>
                        <button onClick={onCancelEdit} className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200">
                            <X size={16}/>
                        </button>
                    </div>
                ) : (
                    <button onClick={() => onStartEdit(user)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Statistik bearbeiten">
                        <Edit2 size={16}/>
                    </button>
                )}
            </td>
        </tr>
    );
}