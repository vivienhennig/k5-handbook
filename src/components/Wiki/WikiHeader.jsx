import React, { useState } from 'react';
import { Download, Trash2, Edit3, Check, Info, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';

export default function WikiHeader({ 
    title, wikiId, icon: Icon, isEditing, isPrivileged, 
    introText, setIntroText, onSave, onEdit, onDelete, onPrint 
}) {
    const [copied, setCopied] = useState(false);
    const { addToast } = useToast();

    const handleCopyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            addToast("Link in Zwischenablage kopiert! 🔗");
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-gray-100 dark:border-gray-800 pb-8 gap-6">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-3 text-blue-600">
                        <div className="p-2 bg-blue-600 text-white rounded-xl shadow-lg">
                            {Icon ? <Icon size={24} /> : <Info size={24} />}
                        </div>
                        <span className="text-[10px] font-black uppercase bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800 tracking-widest">
                            {wikiId}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4 group">
                    <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight italic">
                        {title}
                    </h2>
                    {!isEditing && (
                        <button 
                            onClick={handleCopyLink}
                            className={`p-2 rounded-xl transition-all duration-300 ${
                                copied 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600' 
                                : 'bg-gray-50 dark:bg-gray-800 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-blue-600'
                            }`}
                            title="Link kopieren"
                        >
                            {copied ? <CheckCircle2 size={20} /> : <LinkIcon size={20} />}
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <textarea 
                        className="w-full mt-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none ring-2 ring-blue-500/20 text-sm dark:text-white font-sans" 
                        value={introText} 
                        onChange={e => setIntroText(e.target.value)} 
                        placeholder="Kurze Einleitung..."
                    />
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg leading-relaxed max-w-2xl">
                        {introText}
                    </p>
                )}
            </div>
            
            <div className="flex items-center gap-3 print:hidden shrink-0">
                {!isEditing && (
                    <>
                        <button onClick={onPrint} className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-blue-600 border border-gray-100 dark:border-gray-700 transition-all shadow-sm">
                            <Download size={20}/>
                        </button>
                        {isPrivileged && (
                            <button onClick={onDelete} className="p-3 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 transition-all shadow-sm">
                                <Trash2 size={20}/>
                            </button>
                        )}
                    </>
                )}
                {isPrivileged && (
                    <button 
                        onClick={isEditing ? onSave : onEdit} 
                        className={`px-8 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl transition-all active:scale-95 ${
                            isEditing ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
                        }`}
                    >
                        {isEditing ? <Check size={20}/> : <Edit3 size={20}/>} 
                        {isEditing ? 'Speichern' : 'Bearbeiten'}
                    </button>
                )}
            </div>
        </div>
    );
}