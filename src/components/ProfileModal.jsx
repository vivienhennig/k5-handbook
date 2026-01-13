import React, { useState } from 'react';
import { X, Save, User, Briefcase, Building2, Loader2, Image as ImageIcon, List, Cake } from 'lucide-react';
import { userApi } from '../services/api';
import { DEPARTMENT_COLORS } from '../config/data';
import { useToast } from '../context/ToastContext';

export default function ProfileModal({ user, onClose, onUpdate }) {
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    
    // Form State initialisieren
    const [formData, setFormData] = useState({
        displayName: user?.displayName || '',
        position: user?.position || '',
        department: user?.department || 'Marketing',
        photoUrl: user?.photoUrl || '',
        responsibilities: user?.responsibilities || '',
        birthDate: user?.birthDate || '' // NEU: Geburtsdatum State
    });

    const departments = Object.keys(DEPARTMENT_COLORS).filter(k => k !== 'default');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await userApi.updateUserProfile(user.uid, formData);
            if (onUpdate) await onUpdate();
            onClose();
        } catch (error) {
            console.error("Fehler beim Speichern:", error);
            useToast("Fehler beim Speichern des Profils.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden scale-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
                
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 sticky top-0 z-10">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">Profil bearbeiten</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500">
                        <X size={20}/>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    
                    {/* Avatar Preview */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-3xl font-black text-gray-400 overflow-hidden shadow-lg border-4 border-white dark:border-gray-600">
                                {formData.photoUrl ? (
                                    <img 
                                        src={formData.photoUrl} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {e.target.style.display='none'}}
                                    />
                                ) : (
                                    <span>{formData.displayName.charAt(0) || 'U'}</span>
                                )}
                            </div>
                            {formData.photoUrl && (
                                <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
                            )}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Anzeigename</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-400" size={18}/>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.displayName}
                                    onChange={e => setFormData({...formData, displayName: e.target.value})}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Max Mustermann"
                                />
                            </div>
                        </div>

                        {/* Position */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Job Titel</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-3 text-gray-400" size={18}/>
                                <input 
                                    type="text" 
                                    value={formData.position}
                                    onChange={e => setFormData({...formData, position: e.target.value})}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Senior Manager"
                                />
                            </div>
                        </div>

                        {/* Abteilung */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Abteilung</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-3 text-gray-400" size={18}/>
                                <select 
                                    value={formData.department}
                                    onChange={e => setFormData({...formData, department: e.target.value})}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Wählen...</option>
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* NEU: Geburtstag */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Geburtstag</label>
                            <div className="relative">
                                <Cake className="absolute left-3 top-3 text-gray-400" size={18}/>
                                <input 
                                    type="date" 
                                    value={formData.birthDate}
                                    onChange={e => setFormData({...formData, birthDate: e.target.value})}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Foto URL */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Profilbild URL</label>
                        <div className="relative">
                            <ImageIcon className="absolute left-3 top-3 text-gray-400" size={18}/>
                            <input 
                                type="url" 
                                value={formData.photoUrl}
                                onChange={e => setFormData({...formData, photoUrl: e.target.value})}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                placeholder="https://linkedin.com/image.jpg"
                            />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 ml-1">Rechtsklick auf dein LinkedIn/Slack Bild - "Bildadresse kopieren"</p>
                    </div>

                    {/* Aufgabenbereiche */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Aufgabenbereiche</label>
                        <div className="relative">
                            <List className="absolute left-3 top-3 text-gray-400" size={18}/>
                            <textarea 
                                value={formData.responsibilities}
                                onChange={e => setFormData({...formData, responsibilities: e.target.value})}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm resize-none"
                                rows="3"
                                placeholder="Wofür bist du im Team zuständig? (z.B. Ticketing, B2B Sales, Catering...)"
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            Abbrechen
                        </button>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin"/> : <Save size={18}/>}
                            Speichern
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}