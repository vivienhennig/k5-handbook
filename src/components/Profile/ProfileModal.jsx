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
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-k5-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white dark:bg-k5-black w-full max-w-xl rounded-k5-lg shadow-2xl border border-gray-100 dark:border-k5-deep overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col font-sans">
                
                {/* Header Section: Italic entfernt, Aeonik Bold genutzt */}
                <div className="p-8 border-b border-gray-100 dark:border-k5-deep bg-k5-light-grey/30 dark:bg-k5-deep/30 flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="text-3xl font-black text-k5-black dark:text-white uppercase tracking-tighter">Edit <span className="text-k5-digital">Profile</span></h3>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-2 flex items-center gap-2">
                            <Sparkles size={14} className="text-k5-digital" /> K5 Team Member Node
                        </p>
                    </div>
                    <button onClick={onClose} className="p-4 bg-white dark:bg-k5-black hover:bg-k5-light-grey dark:hover:bg-k5-deep rounded-k5-md transition-all shadow-sm group border border-gray-100 dark:border-k5-deep">
                        <X size={20} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <form onSubmit={handleSubmit} className="p-10 overflow-y-auto custom-scrollbar space-y-10">
                    
                    {/* Avatar Preview & Photo URL: k5-md Rundung */}
                    <div className="flex flex-col md:flex-row items-center gap-8 bg-k5-light-grey dark:bg-k5-deep/20 p-8 rounded-k5-md border border-gray-100 dark:border-k5-deep/50">
                        <div className="relative shrink-0">
                            <div className="w-32 h-32 rounded-k5-md bg-white dark:bg-k5-deep flex items-center justify-center text-4xl font-black text-gray-200 overflow-hidden shadow-2xl border-4 border-white dark:border-k5-deep/50 rotate-[-3deg]">
                                {formData.photoUrl ? (
                                    <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <span>{formData.displayName.charAt(0) || 'U'}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 w-full space-y-3">
                            <label className="text-[10px] font-bold uppercase text-k5-digital tracking-widest ml-1">Avatar URL (LinkedIn/Slack)</label>
                            <div className="relative">
                                <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
                                <input 
                                    type="url" 
                                    value={formData.photoUrl}
                                    onChange={e => setFormData({...formData, photoUrl: e.target.value})}
                                    className="w-full pl-14 pr-6 py-5 bg-white dark:bg-k5-black border border-gray-100 dark:border-k5-deep rounded-k5-md font-bold text-sm focus:ring-4 focus:ring-k5-digital/10 outline-none dark:text-white transition-all shadow-sm"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Personal Info Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="md:col-span-2 group">
                            <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-3 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-k5-digital transition-colors" size={18}/>
                                <input 
                                    type="text" required value={formData.displayName}
                                    onChange={e => setFormData({...formData, displayName: e.target.value})}
                                    className="w-full pl-14 pr-6 py-5 bg-k5-light-grey dark:bg-k5-deep/20 border-none rounded-k5-md font-black text-xl focus:ring-4 focus:ring-k5-digital/10 outline-none dark:text-white transition-all tracking-tight"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-3 ml-1">Position</label>
                            <div className="relative">
                                <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
                                <input 
                                    type="text" value={formData.position}
                                    onChange={e => setFormData({...formData, position: e.target.value})}
                                    className="w-full pl-14 pr-6 py-5 bg-k5-light-grey dark:bg-k5-deep/20 border-none rounded-k5-md font-bold text-sm focus:ring-4 focus:ring-k5-digital/10 outline-none dark:text-white transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-3 ml-1">Department</label>
                            <div className="relative">
                                <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
                                <select 
                                    value={formData.department}
                                    onChange={e => setFormData({...formData, department: e.target.value})}
                                    className="w-full pl-14 pr-6 py-5 bg-k5-light-grey dark:bg-k5-deep/20 border-none rounded-k5-md font-bold text-sm focus:ring-4 focus:ring-k5-digital/10 outline-none dark:text-white appearance-none cursor-pointer"
                                >
                                    {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-[10px] font-bold uppercase text-k5-sand tracking-widest mb-3 ml-1">Birthday (Cake Time! 🎂)</label>
                            <div className="relative">
                                <Cake className="absolute left-5 top-1/2 -translate-y-1/2 text-k5-sand" size={18}/>
                                <input 
                                    type="date" value={formData.birthDate}
                                    onChange={e => setFormData({...formData, birthDate: e.target.value})}
                                    className="w-full pl-14 pr-6 py-5 bg-k5-light-grey dark:bg-k5-deep/20 border-none rounded-k5-md font-bold text-sm focus:ring-4 focus:ring-k5-sand/10 outline-none dark:text-white cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Responsibilities */}
                    <div className="group">
                        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-3 ml-1">Main Responsibilities</label>
                        <div className="relative">
                            <List className="absolute left-5 top-5 text-gray-300 group-focus-within:text-k5-digital transition-colors" size={18}/>
                            <textarea 
                                value={formData.responsibilities}
                                onChange={e => setFormData({...formData, responsibilities: e.target.value})}
                                className="w-full pl-14 pr-8 py-5 bg-k5-light-grey dark:bg-k5-deep/20 border-none rounded-k5-md font-bold text-sm focus:ring-4 focus:ring-k5-digital/10 outline-none dark:text-white transition-all resize-none min-h-[140px]"
                                placeholder="Wofür bist du im Team zuständig?"
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-4 pt-6 shrink-0">
                        <button 
                            type="button" onClick={onClose}
                            className="flex-1 py-5 rounded-k5-md font-bold uppercase tracking-widest text-[10px] text-gray-400 hover:bg-k5-light-grey dark:hover:bg-k5-deep transition-all"
                        >
                            Abbrechen
                        </button>
                        <button 
                            type="submit" disabled={isLoading}
                            className="flex-[2] bg-glow-digital text-white py-5 rounded-k5-md font-bold uppercase tracking-widest text-xs shadow-xl shadow-k5-digital/25 hover:opacity-90 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
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