import React from 'react';
import { 
  Layout, Calendar, Palmtree, Users, Wrench, Layers, 
  Settings, LogOut, Shield, ExternalLink, Heart
} from 'lucide-react';
import { authService } from '../services/api';

export default function Sidebar({ user, activeTab, handleNav, isPrivileged, isMobile, closeMobileMenu }) {
    
    // Definition der Navigations-Struktur
    const navGroups = [
        {
            title: null, // Keine Überschrift für den Hauptbereich
            items: [
                { id: 'home', label: 'Dashboard', icon: Layout },
            ]
        },
        {
            title: 'Organisation',
            items: [
                { id: 'calendar', label: 'Kalender', icon: Calendar },
                { id: 'vacation', label: 'Urlaub', icon: Palmtree },
                { id: 'team', label: 'Team', icon: Users }, // <--- HIER IST DAS TEAM JETZT
            ]
        },
        {
            title: 'Wissen & Tools',
            items: [
                { id: 'tools', label: 'Tech Stack', icon: Wrench },
                { id: 'resources', label: 'Ressourcen', icon: Layers },
            ]
        }
    ];

    const onNavClick = (tabId) => {
        handleNav(tabId);
        if (isMobile && closeMobileMenu) closeMobileMenu();
    };

    const handleLogout = async () => {
        await authService.logout();
        window.location.reload();
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800">
            
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-3">
                <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/30">
                    K5
                </div>
                <span className="font-black text-xl tracking-tight text-gray-900 dark:text-white">Handbook</span>
            </div>

            {/* Scrollable Nav Content */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-8 scrollbar-hide">
                
                {navGroups.map((group, idx) => (
                    <div key={idx}>
                        {/* Gruppen-Überschrift (wenn vorhanden) */}
                        {group.title && (
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">
                                {group.title}
                            </h4>
                        )}
                        
                        {/* Items der Gruppe */}
                        <div className="space-y-1">
                            {group.items.map(item => {
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => onNavClick(item.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 group ${
                                            isActive 
                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
                                        }`}
                                    >
                                        <item.icon 
                                            size={18} 
                                            className={`transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} 
                                        />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Admin Area (Nur für Berechtigte) */}
                {isPrivileged && (
                    <div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">
                            Verwaltung
                        </h4>
                        <button
                            onClick={() => onNavClick('admin')}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 group ${
                                activeTab === 'admin'
                                ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                : 'text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/10'
                            }`}
                        >
                            <Shield size={18} className={activeTab === 'admin' ? 'text-red-600' : 'text-gray-400 group-hover:text-red-500'} />
                            Admin Konsole
                        </button>
                    </div>
                )}

            </div>

            {/* User Profile Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-default mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                        {user?.displayName?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.displayName || 'User'}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                </div>
                
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-xs font-bold text-gray-400 hover:text-red-500 py-2 transition-colors">
                    <LogOut size={14}/> Abmelden
                </button>
            </div>
        </div>
    );
}