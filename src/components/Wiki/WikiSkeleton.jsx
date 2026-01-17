import React from 'react';

export default function WikiSkeleton() {
    return (
        <div className="max-w-7xl mx-auto pb-32 px-4 font-sans animate-pulse">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-gray-100 dark:border-gray-800 pb-8 gap-6">
                <div className="flex-1 space-y-4">
                    <div className="w-32 h-6 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                    <div className="w-3/4 h-12 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                    <div className="w-1/2 h-6 bg-gray-100 dark:bg-gray-800/50 rounded-lg" />
                </div>
            </div>
            <div className="space-y-8">
                <div className="w-full h-40 bg-gray-50 dark:bg-gray-800/30 rounded-[2.5rem]" />
                <div className="grid grid-cols-2 gap-6">
                    <div className="h-32 bg-gray-50 dark:bg-gray-800/30 rounded-[2.5rem]" />
                    <div className="h-32 bg-gray-50 dark:bg-gray-800/30 rounded-[2.5rem]" />
                </div>
            </div>
        </div>
    );
}