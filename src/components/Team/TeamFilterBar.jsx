import React from 'react';
import { Search } from 'lucide-react';

export default function TeamFilterBar({ searchTerm, setSearchTerm, departments, filterDept, setFilterDept }) {
    return (
        <div className="flex flex-col lg:flex-row gap-8 mb-16 items-center justify-between bg-white dark:bg-k5-black p-8 rounded-k5-lg shadow-sm border border-gray-100 dark:border-k5-deep font-sans">
            
            {/* Search Input Container - Shrink-0 verhindert das Zusammenstauchen */}
            <div className="relative w-full lg:w-80 xl:w-96 shrink-0 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-k5-digital transition-colors" size={20}/>
                <input 
                    type="text" 
                    placeholder="Suche im Team..." 
                    className="w-full pl-14 pr-6 py-4 bg-k5-light-grey dark:bg-k5-deep/20 border-none rounded-k5-md text-sm font-bold outline-none ring-4 ring-transparent focus:ring-k5-digital/5 transition-all dark:text-white placeholder:text-gray-400 placeholder:font-normal"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            
            {/* Filter Buttons - Mac/Trackpad Scroll Fix */}
            <div className="w-full min-w-0 flex justify-start lg:justify-end"> 
                <div className="flex flex-row flex-nowrap gap-3 overflow-x-auto no-scrollbar scroll-smooth p-1 -m-1">
                    {departments.map(dept => (
                        <button 
                            key={dept}
                            onClick={() => setFilterDept(dept)}
                            className={`px-6 py-3 rounded-k5-md text-[10px] font-bold uppercase tracking-[0.15em] transition-all whitespace-nowrap shrink-0 active:scale-95 select-none ${
                                filterDept === dept 
                                ? 'bg-glow-digital text-white shadow-xl shadow-k5-digital/25' 
                                : 'bg-k5-light-grey dark:bg-k5-deep/30 text-k5-sand hover:text-k5-black dark:hover:text-white border border-transparent'
                            }`}
                        >
                            {dept}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}