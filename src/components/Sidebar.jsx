import React from 'react';
import * as Icons from 'lucide-react'; 
import { 
    Home, Calendar, Palmtree, Users, Wrench, Database, Cpu, 
    ChevronRight, LayoutGrid, Shield, PlusCircle, LogOut, User, Settings,
    FileText, Tent, BookOpen
} from 'lucide-react';
// HIER: Import deines neuen Toggles
import ThemeToggle from '../components/ThemeToggle'; 

export default function Sidebar({ 
    user, 
    activeTab, 
    handleNav, 
    customWikis = [], 
    isPrivileged, 
    onLogout, 
    onCreateWiki,
    onOpenProfile 
}) {
    
    const NavItem = ({ id, icon: Icon, label, colorClass = "text-gray-400" }) => {
        const IconComponent = Icon || LayoutGrid; 
        return (
            <button
                onClick={() => handleNav(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                    activeTab === id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-[1.02]' 
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
                <IconComponent size={20} className={activeTab === id ? 'text-white' : colorClass} />
                <span className={`text-xs font-black uppercase tracking-widest italic ${activeTab === id ? 'text-white' : 'dark:text-gray-400'}`}>
                    {label}
                </span>
                {activeTab === id && <ChevronRight size={14} className="ml-auto" />}
            </button>
        );
    };

    const renderWikiGroup = (parentId, label, defaultIcon = LayoutGrid) => {
        const filteredWikis = customWikis.filter(w => (w.parentId || 'custom') === parentId);
        if (filteredWikis.length === 0 && parentId === 'custom') return null;

        return (
            <div className="space-y-1 mt-6">
                <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-3 italic">
                    {label}
                </p>
                {filteredWikis.map(wiki => (
                    <NavItem 
                        key={wiki.id} 
                        id={wiki.id} 
                        icon={Icons[wiki.iconName] || defaultIcon} 
                        label={wiki.title} 
                    />
                ))}
            </div>
        );
    };

    return (
        <aside className="w-72 h-screen sticky top-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 p-6 flex flex-col font-sans overflow-hidden">
            
            {/* Logo */}
            <div className="mb-8 px-4 shrink-0">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black italic shadow-lg">K5</div>
                    <span className="font-black italic text-xl tracking-tighter dark:text-white uppercase">Handbook</span>
                </div>
            </div>

            {/* Aktion: Neue Seite */}
            {isPrivileged && (
                <div className="mb-6 px-2 shrink-0">
                    <button 
                        onClick={onCreateWiki}
                        className="w-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 py-3 rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-800 flex items-center justify-center gap-2 hover:bg-blue-100 transition-all group"
                    >
                        <PlusCircle size={18} className="group-hover:rotate-90 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest italic text-blue-600">Neue Seite</span>
                    </button>
                </div>
            )}

            {/* Navigation (Scrollbereich) */}
            <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar pr-1">
                <div className="space-y-1">
                    <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-3 italic">Main Console</p>
                    <NavItem id="home" icon={Home} label="Dashboard" colorClass="text-blue-500" />
                    <NavItem id="calendar" icon={Calendar} label="Kalender" colorClass="text-teal-500" />
                    <NavItem id="vacation" icon={Palmtree} label="Urlaub" colorClass="text-amber-500" />
                    <NavItem id="team" icon={Users} label="Team" colorClass="text-indigo-500" />
                </div>

                {renderWikiGroup('event_main', 'Event Operations', Tent)}
                {renderWikiGroup('guide_main', 'Guidelines & Standards', BookOpen)}
                {renderWikiGroup('custom', 'Weitere Wikis', LayoutGrid)}

                <div className="space-y-1 mt-6">
                    <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-3 italic">System</p>
                    <NavItem id="tools" icon={Wrench} label="Toolbox" colorClass="text-blue-500" />
                    <NavItem id="resources" icon={Database} label="Ressourcen" colorClass="text-emerald-500" />
                    <NavItem id="automation" icon={Database} label="Automation" colorClass="text-orange-500" />
                </div>
            </div>

            {/* Footer: Profil & Logout & ThemeToggle */}
            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3 shrink-0">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={onOpenProfile} 
                        className="flex-1 flex items-center gap-3 p-3 rounded-[1.5rem] transition-all group border border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 shrink-0 overflow-hidden relative border-2 border-white dark:border-gray-700 shadow-sm">
                            {(user?.photoUrl || user?.photoURL) ? (
                                <img src={user.photoUrl || user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="font-black text-xs uppercase italic">{user?.displayName?.charAt(0)}</span>
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Settings size={14} className="text-white" />
                            </div>
                        </div>
                        <div className="min-w-0 text-left flex-1">
                            <p className="text-[10px] font-black uppercase text-gray-900 dark:text-white truncate">
                                {user?.displayName || "K5 Member"}
                            </p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase italic">Profil</p>
                        </div>
                    </button>

                    {/* HIER: Der integrierte ThemeToggle */}
                    <ThemeToggle />
                </div>

                <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-red-500 transition-all group"
                >
                    <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Abmelden</span>
                </button>
            </div>
        </aside>
    );
}