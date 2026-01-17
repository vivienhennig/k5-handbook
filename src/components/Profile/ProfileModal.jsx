import React, { useState } from 'react';
import { X, Save, User, Briefcase, Building2, Loader2, Image as ImageIcon, List, Cake, Sparkles } from 'lucide-react';
import { userApi } from '../../services/api.js';
import { DEPARTMENT_COLORS } from '../../config/data.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function ProfileModal({ user, onClose, onUpdate }) {
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        displayName: user?.displayName || '',
        position: user?.position || '',
        department: user?.department || 'Marketing',
        photoUrl: user?.photoUrl || '',
        responsibilities: user?.responsibilities || '',
        birthDate: user?.birthDate || ''
    });

    const departments = Object.keys(DEPARTMENT_COLORS).filter(k => k !== 'default');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await userApi.updateUserProfile(user.uid, formData);
            addToast("Profil erfolgreich aktualisiert! ✨");
            if (onUpdate) await onUpdate();
            onClose();
        } catch (error) {
            console.error("Fehler beim Speichern:", error);
            addToast("Fehler beim Speichern.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-800 w-full max-w-xl rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                
                {/* Header Section */}
                <div className="p-8 border-b border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Edit <span className="text-blue-600">Profile</span></h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-1 flex items-center gap-2">
                            <Sparkles size={12} className="text-blue-500" /> K5 Team Member Node
                        </p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white dark:hover:bg-gray-700 rounded-2xl transition-all shadow-sm group">
                        <X size={20} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar space-y-8">
                    
                    {/* Avatar Preview & Photo URL */}
                    <div className="flex flex-col md:flex-row items-center gap-8 bg-blue-50/30 dark:bg-blue-900/10 p-6 rounded-[2rem] border border-blue-100/50 dark:border-blue-800/30">
                        <div className="relative shrink-0">
                            <div className="w-28 h-28 rounded-[2rem] bg-white dark:bg-gray-700 flex items-center justify-center text-4xl font-black text-gray-200 overflow-hidden shadow-2xl border-4 border-white dark:border-gray-600 rotate-[-3deg]">
                                {formData.photoUrl ? (
                                    <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="italic">{formData.displayName.charAt(0) || 'U'}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 w-full space-y-3">
                            <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest ml-1 italic">Avatar URL (LinkedIn/Slack)</label>
                            <div className="relative">
                                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
                                <input 
                                    type="url" 
                                    value={formData.photoUrl}
                                    onChange={e => setFormData({...formData, photoUrl: e.target.value})}
                                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border-none rounded-2xl font-bold text-sm focus:ring-4 focus:ring-blue-500/10 outline-none dark:text-white transition-all shadow-sm"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Personal Info Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 group">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 ml-1 italic">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18}/>
                                <input 
                                    type="text" required value={formData.displayName}
                                    onChange={e => setFormData({...formData, displayName: e.target.value})}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl font-black italic text-lg focus:ring-4 focus:ring-blue-500/10 outline-none dark:text-white transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 ml-1 italic">Position</label>
                            <div className="relative">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
                                <input 
                                    type="text" value={formData.position}
                                    onChange={e => setFormData({...formData, position: e.target.value})}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl font-bold text-sm focus:ring-4 focus:ring-blue-500/10 outline-none dark:text-white transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 ml-1 italic">Department</label>
                            <div className="relative">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
                                <select 
                                    value={formData.department}
                                    onChange={e => setFormData({...formData, department: e.target.value})}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl font-bold text-sm focus:ring-4 focus:ring-blue-500/10 outline-none dark:text-white appearance-none cursor-pointer"
                                >
                                    {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 ml-1 italic text-pink-500">Birthday (Cake Time! 🎂)</label>
                            <div className="relative">
                                <Cake className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" size={18}/>
                                <input 
                                    type="date" value={formData.birthDate}
                                    onChange={e => setFormData({...formData, birthDate: e.target.value})}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl font-bold text-sm focus:ring-4 focus:ring-pink-500/10 outline-none dark:text-white cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Responsibilities */}
                    <div className="group">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 ml-1 italic">Main Responsibilities</label>
                        <div className="relative">
                            <List className="absolute left-4 top-4 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18}/>
                            <textarea 
                                value={formData.responsibilities}
                                onChange={e => setFormData({...formData, responsibilities: e.target.value})}
                                className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-[2rem] font-bold text-sm focus:ring-4 focus:ring-blue-500/10 outline-none dark:text-white transition-all resize-none min-h-[120px]"
                                placeholder="Wofür bist du im Team zuständig?"
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-4 pt-4 shrink-0">
                        <button 
                            type="button" onClick={onClose}
                            className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all italic"
                        >
                            Abbrechen
                        </button>
                        <button 
                            type="submit" disabled={isLoading}
                            className="flex-[2] bg-blue-600 text-white py-5 rounded-[1.8rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 italic active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin"/> : <Save size={18}/>}
                            Update Identity
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}