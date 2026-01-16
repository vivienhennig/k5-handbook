import React, { useState } from 'react';
import { Mail, Briefcase, Award } from 'lucide-react';

export default function UserCard({ user, deptStyle }) {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full font-sans">
            {/* Color Banner */}
            <div className={`h-2 w-full ${deptStyle.classes.split(' ')[0]}`}></div>
            
            <div className="p-6 flex flex-col flex-1 relative">
                <div className="absolute top-4 right-4">
                     <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${deptStyle.classes}`}>
                        {user.department || 'Team'}
                     </span>
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl font-black text-gray-400 overflow-hidden border-2 border-white dark:border-gray-600 shadow-md group-hover:scale-110 transition-transform duration-300 shrink-0">
                        {user.photoUrl && !imgError ? (
                            <img src={user.photoUrl} alt={user.displayName} onError={() => setImgError(true)} className="w-full h-full object-cover" />
                        ) : (
                            <span className="italic uppercase">{user.displayName?.charAt(0) || '?'}</span>
                        )}
                    </div>
                    <div className="min-w-0 flex-1"> {/* flex-1 hilft beim Platzmanagement */}
                        <h3 className="font-black text-base text-gray-900 dark:text-white leading-tight italic uppercase tracking-tight mb-0.5">
                            {user.displayName}
                        </h3>
                        <p className="text-[10px] font-bold text-gray-400 flex items-start gap-1 uppercase tracking-tighter leading-snug">
                            <Briefcase size={12} className="shrink-0 mt-0.5"/> 
                            <span className="break-words"> {/* break-words erlaubt den Umbruch */}
                                {user.position || 'K5 Member'}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="flex-1">
                    {user.responsibilities ? (
                        <div className="space-y-2">
                            <p className="text-[9px] font-black uppercase text-blue-600/50 flex items-center gap-1 italic tracking-widest">
                                <Award size={10}/> Focus Area
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {user.responsibilities.split(',').map((tag, i) => (
                                    <span key={i} className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-lg text-[10px] font-bold border border-gray-100 dark:border-gray-800">
                                        {tag.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-[10px] text-gray-300 italic">Keine Aufgaben hinterlegt.</p>
                    )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <button 
                        onClick={() => window.location.href=`mailto:${user.email}`}
                        className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-2 italic"
                    >
                        <Mail size={12}/> Write Mail
                    </button>
                </div>
            </div>
        </div>
    );
}