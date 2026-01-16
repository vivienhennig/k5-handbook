import React from 'react';

export default function VacationStats({ stats }) {
    return (
        <div className="flex gap-2">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 text-center min-w-[80px]">
                <div className="text-xs text-gray-400 uppercase font-bold tracking-tighter">Genommen</div>
                <div className="text-xl font-black text-gray-900 dark:text-white">{stats.taken}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 text-center min-w-[80px]">
                <div className="text-xs text-gray-400 uppercase font-bold tracking-tighter">Geplant</div>
                <div className="text-xl font-black text-blue-600 dark:text-blue-400">{stats.planned}</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-800 text-center min-w-[80px]">
                <div className="text-xs text-green-600 dark:text-green-400 uppercase font-bold tracking-tighter">Übrig</div>
                <div className="text-xl font-black text-green-700 dark:text-green-300">{stats.remaining}</div>
            </div>
        </div>
    );
}