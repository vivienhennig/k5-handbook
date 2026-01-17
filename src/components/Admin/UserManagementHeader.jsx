import React from 'react';
import { Search, User } from 'lucide-react';

export default function UserManagementHeader({ userCount, searchTerm, setSearchTerm }) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600">
                    <User size={20}/>
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Benutzerverwaltung</h3>
                    <p className="text-xs text-gray-500">{userCount} Registrierte Nutzer</p>
                </div>
            </div>

            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16}/>
                <input 
                    type="text" 
                    placeholder="Suchen..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                />
            </div>
        </div>
    );
}