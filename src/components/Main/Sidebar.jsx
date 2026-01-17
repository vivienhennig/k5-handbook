import React from 'react';
import * as Icons from 'lucide-react'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    Home, Calendar, Palmtree, Users, Wrench, Database,
    ChevronRight, LayoutGrid, PlusCircle, LogOut, Settings,
    Tent, BookOpen, Shield 
} from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx'; 
import WikiSearch from '../Wiki/WikiSearch.jsx';

export default function Sidebar({ 
    user, 
    customWikis = [], 
    isPrivileged, 
    onLogout, 
    onCreateWiki,
    onOpenProfile 
}) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNav = (wikiId) => {
        navigate(`/wiki/${wikiId}`);
    };

    const checkActive = (id) => {
        const path = location.pathname;
        if (id === 'home' && path === '/home') return true;
        return path.includes(id);
    };
    
    const NavItem = ({ id, icon: Icon, label, colorClass = "text-gray-400", isWiki = false }) => {
        const IconComponent = Icon || LayoutGrid; 
        const isActive = checkActive(id);
        const targetPath = isWiki ? `/wiki/${id}` : `/${id}`;

        return (
            <button
                onClick={() => navigate(targetPath)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-k5-md transition-all duration-300 group ${
                    isActive 
                    ? 'bg-glow-digital text-white shadow-lg shadow-k5-digital/30 scale-[1.02]' 
                    : 'text-gray-500 hover:bg-k5-light-grey dark:hover:bg-k5-deep/20'
                }`}
            >
                <IconComponent size={18} className={isActive ? 'text-white' : colorClass} />
                <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${isActive ? 'text-white' : 'dark:text-gray-400'}`}>
                    {label}
                </span>
                {isActive && <ChevronRight size={14} className="ml-auto animate-in slide-in-from-left-2" />}
            </button>
        );
    };

    const renderWikiGroup = (parentId, label, defaultIcon = LayoutGrid) => {
        const filteredWikis = customWikis.filter(w => (w.parentId || 'custom') === parentId);
        if (filteredWikis.length === 0 && parentId === 'custom') return null;

        return (
            <div className="space-y-1 mt-8">
                <p className="px-4 text-[9px] font-bold uppercase tracking-[0.3em] text-k5-sand mb-4">
                    {label}
                </p>
                {filteredWikis.map(wiki => (
                    <NavItem 
                        key={wiki.id} 
                        id={wiki.id} 
                        isWiki={true}
                        icon={Icons[wiki.iconName] || defaultIcon} 
                        label={wiki.title} 
                    />
                ))}
            </div>
        );
    };

    return (
        <aside className="w-72 h-screen sticky top-0 bg-white dark:bg-k5-black border-r border-gray-100 dark:border-k5-deep p-6 flex flex-col font-sans overflow-hidden">
            {/* Logo Section: Italic entfernt, Aeonik Black genutzt */}
            <div className="mb-8 px-4 shrink-0">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/home')}>
                    <div className="w-9 h-9 bg-k5-digital rounded-k5-sm flex items-center justify-center text-white font-black shadow-lg shadow-k5-digital/20 group-hover:scale-110 transition-transform">K5</div>
                    <span className="font-black text-xl tracking-tighter dark:text-white uppercase">Handbook</span>
                </div>
            </div>

            {/* WikiSearch Command Center */}
            <div className="mb-6 shrink-0 px-1">
                <WikiSearch handleNav={handleNav} />
            </div>

            {/* Scrollable Navigation Area */}
            <div className="flex-1 space-y-10 overflow-y-auto no-scrollbar pr-1">
                <div className="space-y-1">
                    <p className="px-4 text-[9px] font-bold uppercase tracking-[0.3em] text-k5-sand mb-4">Main Console</p>
                    <NavItem id="home" icon={Home} label="Dashboard" colorClass="text-k5-digital" />
                    <NavItem id="calendar" icon={Calendar} label="Kalender" colorClass="text-k5-digital" />
                    <NavItem id="vacation" icon={Palmtree} label="Urlaub" colorClass="text-k5-digital" />
                    <NavItem id="team" icon={Users} label="Team" colorClass="text-k5-digital" />
                </div>

                {renderWikiGroup('event_main', 'Event Operations', Tent)}
                {renderWikiGroup('guide_main', 'Guidelines & Standards', BookOpen)}
                {renderWikiGroup('custom', 'Weitere Wikis', LayoutGrid)}

                {isPrivileged && (
                    <div className="px-2 mt-8">
                        <button 
                            onClick={onCreateWiki}
                            className="w-full bg-k5-light-grey dark:bg-k5-deep/20 text-k5-digital py-4 rounded-k5-md border-2 border-dashed border-k5-digital/20 hover:border-k5-digital transition-all group flex items-center justify-center gap-3"
                        >
                            <PlusCircle size={18} className="group-hover:rotate-90 transition-transform" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Neue Seite</span>
                        </button>
                    </div>
                )}

                <div className="space-y-1 pt-4">
                    <p className="px-4 text-[9px] font-bold uppercase tracking-[0.3em] text-k5-sand mb-4">System</p>
                    <NavItem id="tools" icon={Wrench} label="Toolbox" colorClass="text-gray-400" />
                    <NavItem id="resources" icon={Database} label="Ressourcen" colorClass="text-gray-400" />
                    <NavItem id="automation" icon={Database} label="Automation" colorClass="text-gray-400" />
                    {user?.role === 'admin' && <NavItem id="admin" icon={Shield} label="Admin Panel" colorClass="text-red-500" />}
                </div>
            </div>

            {/* User Profile Section */}
            <div className="mt-auto pt-6 border-t border-gray-100 dark:border-k5-deep space-y-4 shrink-0">
                <div className="flex items-center gap-2">
                    <button onClick={onOpenProfile} className="flex-1 flex items-center gap-3 p-2.5 rounded-k5-md transition-all group border border-transparent hover:bg-k5-light-grey dark:hover:bg-k5-deep/30">
                        <div className="w-10 h-10 rounded-k5-sm bg-k5-light-grey dark:bg-k5-deep flex items-center justify-center text-gray-400 shrink-0 overflow-hidden relative border border-gray-100 dark:border-k5-deep shadow-sm">
                            {(user?.photoUrl || user?.photoURL) ? (
                                <img src={user.photoUrl || user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="font-black text-xs uppercase">{user?.displayName?.charAt(0)}</span>
                            )}
                            <div className="absolute inset-0 bg-k5-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Settings size={14} className="text-white" />
                            </div>
                        </div>
                        <div className="min-w-0 text-left flex-1">
                            <p className="text-[10px] font-black uppercase text-k5-black dark:text-white truncate tracking-tight">{user?.displayName || "K5 Member"}</p>
                            <p className="text-[8px] font-bold text-k5-sand uppercase tracking-widest mt-0.5">Profil</p>
                        </div>
                    </button>
                    <ThemeToggle />
                </div>
                <button onClick={onLogout} className="w-full flex items-center gap-3 px-5 py-2 text-gray-400 hover:text-red-500 transition-all group">
                    <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Abmelden</span>
                </button>
            </div>
        </aside>
    );
}