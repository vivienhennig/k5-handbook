import React, { useState } from 'react';
import { Mail, Briefcase, Award } from 'lucide-react';

export default function UserCard({ user, deptStyle }) {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="group bg-white dark:bg-k5-black rounded-k5-lg overflow-hidden border border-gray-100 dark:border-k5-deep shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full font-sans">
            {/* Color Banner */}
            <div className={`h-1.5 w-full ${deptStyle.classes.split(' ')[0]}`}></div>
            
            <div className="p-6 lg:p-8 flex flex-col flex-1">
                {/* Avatar & Department Badge */}
                <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-k5-md bg-k5-light-grey dark:bg-k5-deep flex items-center justify-center text-xl font-black text-gray-400 overflow-hidden border-2 border-white dark:border-k5-deep shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0">
                        {user.photoUrl && !imgError ? (
                            <img src={user.photoUrl} alt={user.displayName} onError={() => setImgError(true)} className="w-full h-full object-cover" />
                        ) : (
                            <span className="uppercase">{user.displayName?.charAt(0) || '?'}</span>
                        )}
                    </div>
                    <span className={`text-[8px] font-bold px-2 py-1 rounded-k5-sm uppercase tracking-[0.2em] mt-1 ${deptStyle.classes}`}>
                        {user.department || 'Team'}
                    </span>
                </div>

                {/* Name & Position - Vertikal gestapelt gegen Abschneiden */}
                <div className="mb-6">
                    <h3 className="font-bold text-lg text-k5-black dark:text-white leading-tight uppercase tracking-tight mb-2">
                        {user.displayName}
                    </h3>
                    <p className="text-[10px] font-bold text-k5-sand flex items-center gap-1.5 uppercase tracking-widest">
                        <Briefcase size={12} className="shrink-0 text-k5-digital"/> 
                        <span>{user.position || 'K5 Member'}</span>
                    </p>
                </div>

                {/* Focus Area */}
                <div className="flex-1">
                    {user.responsibilities ? (
                        <div className="space-y-3">
                            <p className="text-[9px] font-bold uppercase text-k5-digital flex items-center gap-2 tracking-[0.2em]">
                                <Award size={12}/> Focus Area
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {user.responsibilities.split(',').slice(0, 3).map((tag, i) => (
                                    <span key={i} className="bg-k5-light-grey dark:bg-k5-deep/40 text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-k5-sm text-[9px] font-bold border border-gray-100 dark:border-k5-deep/50">
                                        {tag.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-[10px] text-gray-400 font-normal">Keine Aufgaben hinterlegt.</p>
                    )}
                </div>

                {/* Footer Action */}
                <div className="mt-6 pt-6 border-t border-gray-50 dark:border-k5-deep/30 flex items-center justify-between">
                    <button 
                        onClick={() => window.location.href=`mailto:${user.email}`}
                        className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-k5-digital transition-all flex items-center gap-2"
                    >
                        <Mail size={14}/> Write Mail
                    </button>
                    <div className="w-1.5 h-1.5 rounded-full bg-k5-digital/20"></div>
                </div>
            </div>
        </div>
    );
}