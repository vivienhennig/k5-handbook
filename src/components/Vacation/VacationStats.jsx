import React from 'react';

export default function VacationStats({ stats }) {
    return (
        <div className="flex gap-3">
            <div className="bg-white dark:bg-k5-black p-4 rounded-k5-md border border-gray-100 dark:border-k5-deep text-center min-w-[100px]">
                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Genommen</div>
                <div className="text-2xl font-bold text-k5-black dark:text-white leading-none">{stats.taken}</div>
            </div>
            <div className="bg-white dark:bg-k5-black p-4 rounded-k5-md border border-gray-100 dark:border-k5-deep text-center min-w-[100px]">
                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Geplant</div>
                <div className="text-2xl font-bold text-k5-digital leading-none">{stats.planned}</div>
            </div>
            <div className="bg-k5-lime-light dark:bg-k5-lime/10 p-4 rounded-k5-md border border-k5-lime/30 text-center min-w-[100px]">
                <div className="text-[10px] text-k5-deep dark:text-k5-lime uppercase font-bold tracking-widest mb-1">Übrig</div>
                <div className="text-2xl font-bold text-k5-deep dark:text-k5-lime leading-none">{stats.remaining}</div>
            </div>
        </div>
    );
}