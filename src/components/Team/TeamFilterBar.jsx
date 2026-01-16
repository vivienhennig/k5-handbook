import React from 'react';
import { Search } from 'lucide-react';

export default function TeamFilterBar({ searchTerm, setSearchTerm, departments, filterDept, setFilterDept }) {
    return (
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-3.5 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={18}/>
                <input 
                    type="text" 
                    placeholder="Suche im Team..." 
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl text-sm outline-none ring-2 ring-transparent focus:ring-blue-500/10 transition-all dark:text-white font-sans"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                {departments.map(dept => (
                    <button 
                        key={dept}
                        onClick={() => setFilterDept(dept)}
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                            filterDept === dept 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-105' 
                            : 'bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 border border-transparent'
                        }`}
                    >
                        {dept}
                    </button>
                ))}
            </div>
        </div>
    );
}