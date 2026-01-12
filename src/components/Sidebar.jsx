import React, { useState, useEffect } from 'react';
import { 
  Layout, Calendar, Palmtree, Users, Wrench, Layers, 
  Shield, LogOut, ChevronDown, ChevronRight,
  Ticket, Headphones, Bot, BookOpen, Settings,
  Sun, Moon // <-- NEU: Icons für Darkmode
} from 'lucide-react';
import { authService } from '../services/api';

// NEUE PROPS: isDarkMode und onToggleTheme werden empfangen
export default function Sidebar({ 
    user, 
    activeTab, 
    handleNav, 
    isPrivileged, 
    isMobile, 
    closeMobileMenu, 
    onOpenProfile,
    isDarkMode,    // <-- NEU
    onToggleTheme  // <-- NEU
}) {
    
    const [expandedMenus, setExpandedMenus] = useState({});

    const toggleMenu = (menuId) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    useEffect(() => {
        navGroups.forEach(group => {
            group.items.forEach(item => {
                if (item.subItems) {
                    const hasActiveSub = item.subItems.some(sub => sub.id === activeTab);
                    if (hasActiveSub) {
                        setExpandedMenus(prev => ({ ...prev, [item.id]: true }));
                    }
                }
            });
        });
    }, [activeTab]);

    const navGroups = [
        {
            title: null,
            items: [
                { id: 'home', label: 'Dashboard', icon: Layout },
            ]
        },
        {
            title: 'Organisation',
            items: [
                { id: 'calendar', label: 'Kalender', icon: Calendar },
                { id: 'vacation', label: 'Urlaub', icon: Palmtree },
                { id: 'team', label: 'Team', icon: Users },
            ]
        },
        {
            title: 'Event Operations',
            items: [
                { 
                    id: 'event_main', 
                    label: 'Event Setup', 
                    icon: Ticket,
                    subItems: [
                        { id: 'vivenu', label: 'Vivenu Setup' },
                        { id: 'support', label: 'Customer Support' },
                        { id: 'tickets', label: 'Ticketlogik' },
                        { id: 'accreditation', label: 'Akkreditierung' }
                    ]
                },
            ]
        },
        {
            title: 'Guidelines',
            items: [
                { 
                    id: 'guide_main', 
                    label: 'Standards', 
                    icon: BookOpen,
                    subItems: [
                        { id: 'web', label: 'Website Guidelines' },
                        { id: 'votings', label: 'Voting System' },
                        { id: 'brand', label: 'Branding & Assets' }
                    ]
                },
            ]
        },
        {
            title: 'Wissen & Tools',
            items: [
                { id: 'resources', label: 'Ressourcen & Stack', icon: Layers }, 
                { id: 'tools', label: 'Tools & Helfer', icon: Wrench }, 
                { id: 'automation', label: 'Automation Check', icon: Bot },
            ]
        }
    ];

    const onNavClick = (item) => {
        if (item.subItems) {
            toggleMenu(item.id);
        } else {
            handleNav(item.id);
            if (isMobile && closeMobileMenu) closeMobileMenu();
        }
    };

    const handleLogout = async () => {
        await authService.logout();
        window.location.reload();
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800">
            
            {/* Logo Area & Darkmode Toggle */}
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/30">
                        K5
                    </div>
                    <span className="font-black text-xl tracking-tight text-gray-900 dark:text-white">Handbook</span>
                </div>

                {/* NEU: DARKMODE TOGGLE BUTTON */}
                <button 
                    onClick={onToggleTheme}
                    className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-90"
                    title={isDarkMode ? "Light Mode" : "Dark Mode"}
                >
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>

            {/* Scrollable Nav Content */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-8 scrollbar-hide">
                {navGroups.map((group, idx) => (
                    <div key={idx}>
                        {group.title && (
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">
                                {group.title}
                            </h4>
                        )}
                        
                        <div className="space-y-1">
                            {group.items.map(item => {
                                const isExpanded = expandedMenus[item.id];
                                const isActiveParent = item.subItems?.some(sub => sub.id === activeTab);
                                const isDirectActive = activeTab === item.id;

                                return (
                                    <div key={item.id}>
                                        <button
                                            onClick={() => onNavClick(item)}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 group ${
                                                isDirectActive || (isActiveParent && !isExpanded)
                                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon 
                                                    size={18} 
                                                    className={`transition-colors ${isDirectActive || isActiveParent ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} 
                                                />
                                                {item.label}
                                            </div>
                                            {item.subItems && (
                                                isExpanded ? <ChevronDown size={14}/> : <ChevronRight size={14}/>
                                            )}
                                        </button>

                                        {item.subItems && isExpanded && (
                                            <div className="ml-9 mt-1 space-y-1 border-l-2 border-gray-100 dark:border-gray-800 pl-2">
                                                {item.subItems.map(sub => (
                                                    <button
                                                        key={sub.id}
                                                        onClick={() => {
                                                            handleNav(sub.id);
                                                            if (isMobile && closeMobileMenu) closeMobileMenu();
                                                        }}
                                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                                                            activeTab === sub.id
                                                            ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/10'
                                                            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                                                        }`}
                                                    >
                                                        {sub.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {isPrivileged && (
                    <div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Verwaltung</h4>
                        <button onClick={() => handleNav('admin')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'admin' ? 'bg-red-50 text-red-700' : 'text-gray-500 hover:bg-red-50 hover:text-red-600'}`}>
                            <Shield size={18} className={activeTab === 'admin' ? 'text-red-600' : 'text-gray-400'} /> Admin Konsole
                        </button>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <button 
                    onClick={() => {
                        onOpenProfile();
                        if (isMobile && closeMobileMenu) closeMobileMenu();
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer mb-2 text-left group"
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold group-hover:scale-105 transition-transform overflow-hidden border border-white dark:border-gray-700 shadow-sm">
                        {user?.photoUrl ? (
                            <img src={user.photoUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                            user?.displayName?.charAt(0) || 'U'
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.displayName || 'User'}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.department || 'K5 Team'}</p>
                    </div>
                    <Settings size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors"/>
                </button>

                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-xs font-bold text-gray-400 hover:text-red-500 py-2 transition-colors">
                    <LogOut size={14}/> Abmelden
                </button>
            </div>
        </div>
    );
}