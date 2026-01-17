import React from 'react';
import { Lock, Check, X, Edit2, User } from 'lucide-react';

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
        <tr className="hover:bg-k5-light-grey/30 dark:hover:bg-k5-deep/20 transition-all font-sans border-b border-gray-50 dark:border-k5-deep/30">
            {/* Spalte 1: Info - Aeonik Black & k5-sm Avatar */}
            <td className="px-10 py-6">
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-k5-sm bg-k5-light-grey dark:bg-k5-deep flex items-center justify-center font-black text-k5-digital overflow-hidden border border-gray-100 dark:border-k5-deep shadow-sm">
                        {user.photoUrl ? (
                            <img src={user.photoUrl} alt="" className="w-full h-full object-cover"/>
                        ) : (
                            <span className="text-base uppercase">{user.displayName?.charAt(0) || <User size={18}/>}</span>
                        )}
                    </div>
                    <div>
                        <div className="font-bold text-[15px] text-k5-black dark:text-white flex items-center gap-3 tracking-tight">
                            {user.displayName}
                            {isMe && (
                                <span className="bg-k5-digital/10 text-k5-digital text-[9px] font-bold px-2 py-0.5 rounded-full border border-k5-digital/20 uppercase tracking-widest">
                                    Me
                                </span>
                            )}
                        </div>
                        <div className="text-[11px] text-gray-500 font-medium">{user.email}</div>
                        <div className="text-[10px] text-k5-sand font-bold uppercase tracking-widest mt-1">
                            {user.department || 'No Department'}
                        </div>
                    </div>
                </div>
            </td>

            {/* Spalte 2: Rolle - Clean Select Design */}
            <td className="px-10 py-6">
                <div className="flex items-center gap-2">
                    {isMe ? (
                        <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest bg-k5-light-grey/50 dark:bg-k5-deep/50 px-3 py-2 rounded-k5-sm border border-gray-200 dark:border-k5-deep/50 cursor-not-allowed">
                            <Lock size={12}/> Admin (Fixed)
                        </div>
                    ) : (
                        <select 
                            value={user.role || 'user'}
                            onChange={(e) => onRoleChange(user.uid, e.target.value)}
                            className={`px-4 py-2 rounded-k5-sm border text-[10px] font-bold uppercase tracking-widest cursor-pointer outline-none transition-all focus:ring-4 focus:ring-k5-digital/5 ${
                                user.role === 'admin' 
                                ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:border-red-900/50' 
                                : user.role === 'privileged'
                                ? 'bg-k5-digital/5 text-k5-digital border-k5-digital/20 dark:bg-k5-deep/50 dark:border-k5-digital/30'
                                : 'bg-white dark:bg-k5-black border-gray-200 dark:border-k5-deep text-k5-sand'
                            }`}
                        >
                            <option value="user">User</option>
                            <option value="privileged">Privileged</option>
                            <option value="admin">Admin</option>
                        </select>
                    )}
                </div>
            </td>

            {/* Spalte 3: Urlaub Stats - Aeonik Bold & k5-sand */}
            <td className="px-10 py-6">
                {isEditing ? (
                    <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-2 duration-300">
                        <div>
                            <label className="text-[9px] uppercase font-bold text-k5-sand tracking-widest block mb-1">Entitlement</label>
                            <input 
                                type="number" 
                                className="w-20 px-3 py-2 text-xs font-bold border border-gray-200 dark:border-k5-deep rounded-k5-sm bg-white dark:bg-k5-black dark:text-white outline-none focus:border-k5-digital"
                                value={tempStats.entitlement}
                                onChange={e => setTempStats({...tempStats, entitlement: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-[9px] uppercase font-bold text-k5-sand tracking-widest block mb-1">Carry Over</label>
                            <input 
                                type="number" 
                                className="w-20 px-3 py-2 text-xs font-bold border border-gray-100 dark:border-k5-deep rounded-k5-sm bg-white dark:bg-k5-black dark:text-white outline-none focus:border-k5-digital"
                                value={tempStats.carryOver}
                                onChange={e => setTempStats({...tempStats, carryOver: e.target.value})}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <div className="font-bold text-sm text-k5-black dark:text-white uppercase tracking-tight">
                            {user.vacationEntitlement || 30} <span className="text-gray-400 font-bold ml-1">Days</span>
                        </div>
                        {user.carryOverDays > 0 && (
                            <div className="text-[10px] text-k5-digital font-bold uppercase tracking-widest mt-1">
                                + {user.carryOverDays} Carry Over
                            </div>
                        )}
                    </div>
                )}
            </td>

            {/* Spalte 4: Actions - Hover-Effekte auf CI Farben */}
            <td className="px-10 py-6 text-right">
                {isEditing ? (
                    <div className="flex justify-end gap-2 animate-in zoom-in-95">
                        <button onClick={() => onSaveStats(user.uid)} className="p-2.5 bg-k5-digital text-white rounded-k5-sm hover:opacity-90 transition-all shadow-md shadow-k5-digital/20">
                            <Check size={18}/>
                        </button>
                        <button onClick={onCancelEdit} className="p-2.5 bg-k5-light-grey dark:bg-k5-deep text-gray-500 rounded-k5-sm hover:text-k5-black dark:hover:text-white transition-all">
                            <X size={18}/>
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => onStartEdit(user)} 
                        className="p-3 text-gray-300 hover:text-k5-digital hover:bg-k5-digital/5 dark:hover:bg-k5-deep/50 rounded-k5-sm transition-all group"
                        title="Edit Statistics"
                    >
                        <Edit2 size={18} className="group-hover:scale-110 transition-transform"/>
                    </button>
                )}
            </td>
        </tr>
    );
}