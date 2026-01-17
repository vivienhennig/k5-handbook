import React from 'react';
import { Cake } from 'lucide-react';

export default function BirthdayCard({ birthdayKids }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 italic">
            <div className="p-3 bg-pink-50 dark:bg-pink-900/30 rounded-2xl text-pink-500 w-fit mb-6"><Cake size={24} /></div>
            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Upcoming Birthdays</h3>
            <div className="space-y-4">
                {birthdayKids.slice(0, 3).map((kid, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-gray-50 dark:border-gray-800 pb-2 last:border-0">
                        <span className="font-bold text-gray-900 dark:text-white">{kid.displayName}</span>
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                            {kid.nextBirthday?.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}