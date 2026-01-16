import React from 'react';
import { PlusCircle, Edit3, ChevronRight } from 'lucide-react';

export default function ActivityFeed({ activities, handleNav, getTimeAgo }) {
    return (
        <div className="lg:col-span-2 space-y-6">
            <h3 className="font-black text-gray-400 text-[10px] uppercase tracking-[0.3em] mb-4 px-2 italic">Letzte Handbook Updates</h3>
            <div className="space-y-4">
                {activities.map((act, i) => (
                    <div key={i} onClick={() => handleNav(act.wikiId)} className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-6 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${act.type === 'create' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                            {act.type === 'create' ? <PlusCircle size={20} /> : <Edit3 size={20} />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-black text-gray-900 dark:text-white uppercase text-sm truncate">{act.title}</h4>
                            <p className="text-xs text-gray-500">Bearbeitet von <span className="font-bold">{act.userName}</span></p>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-[10px] font-black text-blue-600 uppercase mb-1">{getTimeAgo(act.timestamp)}</p>
                            <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 ml-auto" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}