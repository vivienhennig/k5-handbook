import React from 'react';
import { Search, Users, Sparkles } from 'lucide-react';

export default function UserManagementHeader({ userCount, searchTerm, setSearchTerm }) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white dark:bg-k5-black p-6 md:p-8 rounded-k5-md border border-gray-100 dark:border-k5-deep shadow-sm font-sans">
            
            {/* Info Area: Aeonik Bold & Black */}
            <div className="flex items-center gap-5">
                <div className="bg-k5-digital text-white p-4 rounded-k5-sm shadow-lg shadow-k5-digital/20">
                    <Users size={24}/>
                </div>
                <div>
                    <h3 className="font-black text-xl text-k5-black dark:text-white uppercase tracking-tight leading-none">
                        Benutzerverwaltung
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                        <Sparkles size={12} className="text-k5-sand" />
                        <p className="text-[10px] font-bold text-k5-sand uppercase tracking-[0.2em]">
                            {userCount} Registrierte Nutzer
                        </p>
                    </div>
                </div>
            </div>

            {/* Search Input: rounded-k5-md Style */}
            <div className="relative w-full md:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-k5-digital transition-colors" size={18}/>
                <input 
                    type="text" 
                    placeholder="Nutzer suchen..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-k5-light-grey dark:bg-k5-deep/20 border-none rounded-k5-sm text-sm font-bold outline-none ring-4 ring-transparent focus:ring-k5-digital/5 transition-all dark:text-white placeholder:text-gray-400 placeholder:font-normal"
                />
            </div>
        </div>
    );
}