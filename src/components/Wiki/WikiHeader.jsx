import React, { useState } from 'react';
import { Download, Trash2, Edit3, Check, Info, Link as LinkIcon, CheckCircle2, Sparkles } from 'lucide-react';
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
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 border-b border-gray-100 dark:border-k5-deep pb-12 gap-8 font-sans">
            <div className="flex-1 min-w-0">
                {/* Wiki Meta: Aeonik Bold & k5-digital */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-k5-digital text-white rounded-k5-sm shadow-lg shadow-k5-digital/20">
                            {Icon ? <Icon size={24} /> : <Info size={24} />}
                        </div>
                        <span className="text-[10px] font-bold uppercase bg-k5-light-grey dark:bg-k5-deep/40 text-k5-sand px-3 py-1 rounded-k5-sm border border-gray-100 dark:border-k5-deep tracking-[0.2em]">
                            {wikiId}
                        </span>
                    </div>
                </div>

                {/* Title: Aeonik Black, Uppercase, No Italic */}
                <div className="flex items-center gap-6 group">
                    <h2 className="text-4xl lg:text-6xl font-black text-k5-black dark:text-white tracking-tighter uppercase leading-none">
                        {title}
                    </h2>
                    {!isEditing && (
                        <button 
                            onClick={handleCopyLink}
                            className={`p-3 rounded-k5-sm transition-all duration-300 border ${
                                copied 
                                ? 'bg-k5-lime/10 border-k5-lime/20 text-k5-lime' 
                                : 'bg-k5-light-grey dark:bg-k5-deep/20 border-transparent text-gray-300 opacity-0 group-hover:opacity-100 hover:text-k5-digital hover:border-k5-digital/20'
                            }`}
                            title="Link kopieren"
                        >
                            {copied ? <CheckCircle2 size={20} /> : <LinkIcon size={20} />}
                        </button>
                    )}
                </div>

                {/* Intro Text / Editor */}
                {isEditing ? (
                    <div className="relative mt-8">
                        <textarea 
                            className="w-full bg-k5-light-grey dark:bg-k5-deep/20 p-6 rounded-k5-md border border-k5-digital/20 outline-none focus:ring-4 focus:ring-k5-digital/5 text-base font-medium dark:text-white transition-all placeholder:text-gray-400" 
                            value={introText} 
                            onChange={e => setIntroText(e.target.value)} 
                            placeholder="Beschreibe kurz den Inhalt dieser Handbook-Seite..."
                            rows={3}
                        />
                        <div className="absolute top-4 right-4 text-k5-digital opacity-20"><Sparkles size={20}/></div>
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 mt-8 text-xl leading-relaxed max-w-3xl font-medium">
                        {introText}
                    </p>
                )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-4 print:hidden shrink-0 w-full lg:w-auto">
                {!isEditing && (
                    <>
                        <button 
                            onClick={onPrint} 
                            className="flex-1 lg:flex-none p-4 rounded-k5-md bg-white dark:bg-k5-black text-gray-400 hover:text-k5-digital border border-gray-100 dark:border-k5-deep transition-all shadow-sm hover:shadow-md"
                        >
                            <Download size={20}/>
                        </button>
                        {isPrivileged && (
                            <button 
                                onClick={onDelete} 
                                className="flex-1 lg:flex-none p-4 rounded-k5-md bg-red-50 dark:bg-red-950/20 text-red-400 hover:text-red-500 border border-red-100 dark:border-red-900/30 transition-all shadow-sm"
                            >
                                <Trash2 size={20}/>
                            </button>
                        )}
                    </>
                )}
                {isPrivileged && (
                    <button 
                        onClick={isEditing ? onSave : onEdit} 
                        className={`flex-1 lg:flex-none px-10 py-4 rounded-k5-md font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 ${
                            isEditing 
                            ? 'bg-k5-lime text-k5-black shadow-k5-lime/20' 
                            : 'bg-glow-digital text-white shadow-k5-digital/25'
                        }`}
                    >
                        {isEditing ? <Check size={20} strokeWidth={3}/> : <Edit3 size={20}/>} 
                        {isEditing ? 'Speichern' : 'Bearbeiten'}
                    </button>
                )}
            </div>
        </div>
    );
}