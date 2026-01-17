import React from 'react';
import { Cake } from 'lucide-react';

export default function BirthdayCard({ birthdayKids }) {
    return (
        <div className="bg-white dark:bg-k5-black p-8 rounded-k5-lg shadow-sm border border-gray-100 dark:border-k5-deep font-sans">
            {/* Icon Container: k5-md Rundung, Sand/Digital Blue Akzent */}
            <div className="p-4 bg-k5-light-grey dark:bg-k5-deep/30 rounded-k5-md text-k5-digital w-fit mb-8 shadow-sm">
                <Cake size={28} />
            </div>

            {/* Headline: Aeonik Bold, Uppercase, kein Italic */}
            <h3 className="text-[10px] font-bold uppercase text-gray-400 tracking-[0.2em] mb-6">
                Upcoming Birthdays
            </h3>

            <div className="space-y-5">
                {birthdayKids && birthdayKids.length > 0 ? (
                    birthdayKids.slice(0, 3).map((kid, i) => (
                        <div key={i} className="flex justify-between items-center border-b border-gray-50 dark:border-k5-deep/30 pb-3 last:border-0 transition-all hover:translate-x-1">
                            {/* Name: Aeonik Bold */}
                            <span className="font-bold text-k5-black dark:text-white text-base tracking-tight">
                                {kid.displayName}
                            </span>
                            {/* Datum Badge: Deep Blue Glow, Aeonik Bold */}
                            <span className="text-[10px] font-bold text-white bg-glow-deep px-3 py-1 rounded-k5-sm shadow-sm">
                                {kid.nextBirthday?.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-400 font-normal">Keine anstehenden Geburtstage.</p>
                )}
            </div>
        </div>
    );
}