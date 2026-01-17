import React from 'react';

export default function WikiSkeleton() {
    return (
        <div className="max-w-7xl mx-auto pb-32 px-4 font-sans animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 border-b border-gray-100 dark:border-k5-deep pb-12 gap-8">
                <div className="flex-1 space-y-6">
                    {/* Wiki ID Badge */}
                    <div className="w-24 h-8 bg-k5-light-grey dark:bg-k5-deep/40 rounded-k5-sm" />
                    
                    {/* Main Title */}
                    <div className="w-3/4 h-16 bg-k5-light-grey dark:bg-k5-deep/60 rounded-k5-md" />
                    
                    {/* Intro Text line */}
                    <div className="w-1/2 h-6 bg-k5-light-grey/50 dark:bg-k5-deep/30 rounded-k5-sm" />
                </div>
                
                {/* Action Buttons Skeleton */}
                <div className="flex gap-4 w-full lg:w-auto">
                    <div className="flex-1 lg:w-14 h-14 bg-k5-light-grey dark:bg-k5-deep/40 rounded-k5-md" />
                    <div className="flex-1 lg:w-40 h-14 bg-k5-light-grey dark:bg-k5-deep/60 rounded-k5-md" />
                </div>
            </div>

            {/* Content Blocks Skeleton */}
            <div className="space-y-10">
                {/* Large Content Card */}
                <div className="w-full h-64 bg-k5-light-grey/30 dark:bg-k5-deep/20 rounded-k5-lg border border-gray-50 dark:border-k5-deep/10" />
                
                {/* 2-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-48 bg-k5-light-grey/30 dark:bg-k5-deep/20 rounded-k5-lg border border-gray-50 dark:border-k5-deep/10" />
                    <div className="h-48 bg-k5-light-grey/30 dark:bg-k5-deep/20 rounded-k5-lg border border-gray-50 dark:border-k5-deep/10" />
                </div>

                {/* Text Block Skeleton */}
                <div className="space-y-4 pt-4">
                    <div className="w-full h-4 bg-k5-light-grey/40 dark:bg-k5-deep/20 rounded-full" />
                    <div className="w-full h-4 bg-k5-light-grey/40 dark:bg-k5-deep/20 rounded-full" />
                    <div className="w-2/3 h-4 bg-k5-light-grey/40 dark:bg-k5-deep/20 rounded-full" />
                </div>
            </div>
        </div>
    );
}