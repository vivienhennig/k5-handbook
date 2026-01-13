import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Moon, Sun, Menu, X, LogOut, 
  Layout, Calendar, Palmtree, Settings, 
  ExternalLink, Layers, LifeBuoy, CreditCard, Shield, FileText, MousePointer, Cpu, Users, Wrench, Book, QrCode, User
} from 'lucide-react';
import { SECTIONS_CONFIG, RESOURCE_LINKS, TECH_STACK } from '../config/data';

export default function Header({ 
    user, activeTab, handleNav, toggleDarkMode, darkMode, 
    onOpenProfile, onLogout, hasUpdate, isPrivileged 
}) {
    // UI States
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false); 
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false); // NEU: Profil Dropdown
    
    // Search States
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    
    // Refs
    const searchRef = useRef(null);
    const guidelinesRef = useRef(null);
    const toolsRef = useRef(null);
    const profileRef = useRef(null); // NEU

    // --- SEARCH LOGIC ---
    useEffect(() => {
        if (searchQuery.trim() === '') { setSearchResults([]); return; }
        const lowerQuery = searchQuery.toLowerCase();
        const results = [];
        
        SECTIONS_CONFIG.forEach(sec => {
            if (sec.title.toLowerCase().includes(lowerQuery) || sec.desc.toLowerCase().includes(lowerQuery)) {
                results.push({ type: 'section', id: sec.id, title: sec.title, subtitle: 'Guideline', icon: sec.icon });
            }
        });
        if ('team'.includes(lowerQuery)) results.push({ type: 'nav', id: 'team', title: 'Team Übersicht', subtitle: 'Page', icon: Users });
        if ('kalender events termine'.includes(lowerQuery)) results.push({ type: 'nav', id: 'calendar', title: 'Event Kalender', subtitle: 'Tool', icon: Calendar });
        if ('urlaub ferien holiday'.includes(lowerQuery)) results.push({ type: 'nav', id: 'vacation', title: 'Urlaubsmanager', subtitle: 'Tool', icon: Palmtree });
        if ('tools tech stack software'.includes(lowerQuery)) results.push({ type: 'nav', id: 'tools', title: 'Tech Stack', subtitle: 'Tool', icon: Wrench });
        if ('qr code generator'.includes(lowerQuery)) results.push({ type: 'nav', id: 'tools', title: 'QR Code Generator', subtitle: 'Tool', icon: QrCode });

        RESOURCE_LINKS.forEach(cat => { cat.items.forEach(item => { if (item.name.toLowerCase().includes(lowerQuery) || item.desc.toLowerCase().includes(lowerQuery)) { results.push({ type: 'link', url: item.url, title: item.name, subtitle: `Link (${cat.category})`, icon: ExternalLink }); }});});
        TECH_STACK.forEach(tool => { if (tool.name.toLowerCase().includes(lowerQuery) || tool.desc.toLowerCase().includes(lowerQuery)) { results.push({ type: 'link', url: tool.url, title: tool.name, subtitle: 'Tech Stack', icon: Layers }); }});
        
        setSearchResults(results);
    }, [searchQuery]);

    // Click Outside Handler
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) setSearchResults([]);
            if (guidelinesRef.current && !guidelinesRef.current.contains(event.target)) setIsGuidelinesOpen(false);
            if (toolsRef.current && !toolsRef.current.contains(event.target)) setIsToolsOpen(false);
            if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false); // NEU
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchResultClick = (result) => {
        if (result.type === 'link') window.open(result.url, '_blank');
        else { handleNav(result.id); setIsMenuOpen(false); }
        setSearchQuery(''); setSearchResults([]);
    };

    // Helper für Notification Dots
    const Dot = ({ id }) => hasUpdate && hasUpdate(id) ? <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> : null;

    // Helper Classes
    const btnClass = (id) => `relative group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer select-none ${activeTab === id ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`;
    const dropdownBtnClass = (isOpen) => `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer select-none ${isOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`;

    return (
        <>
            <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50 shadow-sm">
                <div className="container mx-auto px-4 h-full flex items-center justify-between gap-4">
                    
                    {/* 1. LINKS: Logo & Mobile Trigger */}
                    <div className="flex items-center gap-3 shrink-0">
                        <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><Menu className="text-gray-600 dark:text-gray-300"/></button>
                        <button onClick={() => handleNav('home')} className="flex items-center gap-2 group focus:outline-none">
                            <div className="w-8 h-8 bg-[#092AFF] rounded-lg flex items-center justify-center shadow-md shadow-blue-900/20 group-hover:scale-105 transition-transform"><span className="text-white font-black text-xs">K5</span></div>
                            <span className="font-black text-lg tracking-tight text-gray-900 dark:text-white hidden md:block">HANDBOOK</span>
                        </button>
                    </div>

                    {/* 2. MITTE: Suche */}
                    <div id="nav-search" className="hidden md:flex flex-1 justify-center px-4" ref={searchRef}>
                        <div className="relative group w-full max-w-[300px] lg:max-w-[400px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                            <input type="text" placeholder="Suche..." className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 border focus:border-blue-500 rounded-lg text-sm transition-all outline-none dark:text-white shadow-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                            {searchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden max-h-[400px] overflow-y-auto z-[60]">
                                    {searchResults.map((result, idx) => (
                                        <button key={idx} onClick={() => handleSearchResultClick(result)} className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-3 border-b border-gray-50 dark:border-gray-700/50 last:border-0 transition-colors">
                                            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-blue-600 dark:text-blue-400 shrink-0"><result.icon size={16}/></div>
                                            <div className="min-w-0"><div className="font-bold text-gray-900 dark:text-white text-sm truncate">{result.title}</div><div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{result.subtitle}</div></div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 3. RECHTS: Navigation & Profil */}
                    <div className="flex items-center justify-end gap-2 shrink-0">
                        
                        {/* DESKTOP NAV */}
                        <div className="hidden lg:flex items-center gap-1">
                            {/* Calendar */}
                            <button type="button" onClick={() => handleNav('calendar')} className={btnClass('calendar')}>
                                <Calendar size={18} className={activeTab === 'calendar' ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600'}/>
                                <span className="hidden xl:block text-xs font-bold uppercase tracking-wide">Kalender</span>
                                <Dot id="calendar" />
                            </button>

                            {/* Vacation */}
                            <button type="button" onClick={() => handleNav('vacation')} className={btnClass('vacation')}>
                                <Palmtree size={18} className={activeTab === 'vacation' ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600'}/>
                                <span className="hidden xl:block text-xs font-bold uppercase tracking-wide">Urlaub</span>
                                <Dot id="vacation" />
                            </button>
                            
                            {/* GUIDELINES DROPDOWN */}
                            <div className="relative" ref={guidelinesRef}>
                                <button type="button" onClick={() => setIsGuidelinesOpen(!isGuidelinesOpen)} className={dropdownBtnClass(isGuidelinesOpen)}>
                                    <Book size={18} />
                                    <span className="hidden xl:block text-xs font-bold uppercase tracking-wide">Guidelines</span>
                                </button>
                                {isGuidelinesOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                                        <div className="px-4 py-2 text-[10px] font-bold uppercase text-gray-400">Standards</div>
                                        <button onClick={() => {handleNav('web'); setIsGuidelinesOpen(false)}} className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200"><Layout size={16}/> Webseite</button>
                                        <button onClick={() => {handleNav('brand'); setIsGuidelinesOpen(false)}} className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200"><FileText size={16}/> Branding</button>
                                        <button onClick={() => {handleNav('support'); setIsGuidelinesOpen(false)}} className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200"><LifeBuoy size={16}/> Support</button>
                                        <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
                                        <div className="px-4 py-2 text-[10px] font-bold uppercase text-gray-400">Events</div>
                                        <button onClick={() => {handleNav('vivenu'); setIsGuidelinesOpen(false)}} className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200"><CreditCard size={16}/> Vivenu</button>
                                        <button onClick={() => {handleNav('tickets'); setIsGuidelinesOpen(false)}} className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200"><FileText size={16}/> Tickets</button>
                                        <button onClick={() => {handleNav('accreditation'); setIsGuidelinesOpen(false)}} className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200"><Shield size={16}/> Akkreditierung</button>
                                    </div>
                                )}
                            </div>

                            <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-2"></div>
                            
                            {/* TOOLS MEGA MENU */}
                            <div className="relative" ref={toolsRef}>
                                <button type="button" onClick={() => setIsToolsOpen(!isToolsOpen)} className={dropdownBtnClass(isToolsOpen)}>
                                    <Wrench size={18} />
                                    <span className="hidden xl:block text-xs font-bold uppercase tracking-wide">Tools</span>
                                </button>
                                {isToolsOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                                        <button onClick={() => {handleNav('tools'); setIsToolsOpen(false)}} className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                                            <div className="bg-blue-50 text-blue-600 p-1.5 rounded"><Layers size={14}/></div>
                                            <div>
                                                <div className="font-bold">Tech Stack</div>
                                                <div className="text-[10px] text-gray-400">Alle Software Tools</div>
                                            </div>
                                        </button>
                                        <button onClick={() => {handleNav('tools'); setIsToolsOpen(false)}} className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                                            <div className="bg-purple-50 text-purple-600 p-1.5 rounded"><QrCode size={14}/></div>
                                            <div>
                                                <div className="font-bold">QR Generator</div>
                                                <div className="text-[10px] text-gray-400">Codes erstellen</div>
                                            </div>
                                        </button>
                                        <button onClick={() => {handleNav('automation'); setIsToolsOpen(false)}} className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                                            <div className="bg-green-50 text-green-600 p-1.5 rounded"><Cpu size={14}/></div>
                                            <div>
                                                <div className="font-bold">Automation</div>
                                                <div className="text-[10px] text-gray-400">Prozess Check</div>
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Resources */}
                            <button type="button" onClick={() => handleNav('resources')} className={btnClass('resources')}>
                                <ExternalLink size={18} className={activeTab === 'resources' ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600'}/>
                                <span className="hidden xl:block text-xs font-bold uppercase tracking-wide">Links</span>
                            </button>
                        </div>

                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden lg:block"></div>

                        {/* Profile Toggle (Dark Mode & User Avatar) */}
                        <div id="nav-profile" className="flex items-center gap-2">
                            <button onClick={toggleDarkMode} className="p-2 text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                                {darkMode ? <Sun size={18}/> : <Moon size={18}/>}
                            </button>
                            
                            {/* USER DROPDOWN (NEW FIX!) */}
                            <div className="relative" ref={profileRef}>
                                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 group pl-1 focus:outline-none">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-[2px] group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all shrink-0">
                                        {user.photoUrl ? <img src={user.photoUrl} alt="User" className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-900"/> : <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-blue-600 font-bold text-xs">{user.displayName?.charAt(0) || user.name?.charAt(0)}</div>}
                                    </div>
                                </button>

                                {/* Das Dropdown Menü für Logout & Admin */}
                                {isProfileOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-60 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[70]">
                                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-2">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.displayName || user.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">{user.role}</p>
                                        </div>
                                        
                                        <button onClick={() => {onOpenProfile(); setIsProfileOpen(false)}} className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                                            <User size={16}/> Profil bearbeiten
                                        </button>

                                        {isPrivileged && (
                                            <button onClick={() => {handleNav('admin'); setIsProfileOpen(false)}} className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                                                <Settings size={16}/> Admin Dashboard
                                            </button>
                                        )}

                                        <div className="h-px bg-gray-100 dark:bg-gray-700 my-2"></div>
                                        
                                        <button onClick={() => {onLogout(); setIsProfileOpen(false)}} className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-sm text-red-600 font-bold">
                                            <LogOut size={16}/> Ausloggen
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* MOBILE MENU (Unverändert) */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMenuOpen(false)}></div>
                    <div className="absolute top-0 bottom-0 left-0 w-[280px] bg-white dark:bg-gray-900 shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-left duration-300">
                        <div className="flex justify-between items-center mb-8"><div className="font-black text-xl text-blue-600">MENU</div><button onClick={() => setIsMenuOpen(false)}><X className="text-gray-500"/></button></div>
                        <div className="space-y-6">
                            
                            {/* APPS */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Apps & Tools</h3>
                                <div className="space-y-1">
                                    <button onClick={() => {handleNav('home'); setIsMenuOpen(false)}} className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800"><Layout size={18} className="text-gray-500"/><span className="font-bold text-sm">Dashboard</span></button>
                                    <button onClick={() => {handleNav('calendar'); setIsMenuOpen(false)}} className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800"><Calendar size={18} className="text-gray-500"/><span className="font-bold text-sm">Event Kalender</span></button>
                                    <button onClick={() => {handleNav('vacation'); setIsMenuOpen(false)}} className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800"><Palmtree size={18} className="text-gray-500"/><span className="font-bold text-sm">Urlaubsmanager</span></button>
                                    <button onClick={() => {handleNav('team'); setIsMenuOpen(false)}} className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800"><Users size={18} className="text-gray-500"/><span className="font-bold text-sm">Team Übersicht</span></button>
                                    <button onClick={() => {handleNav('tools'); setIsMenuOpen(false)}} className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800"><Wrench size={18} className="text-gray-500"/><span className="font-bold text-sm">Tech Stack</span></button>
                                    <button onClick={() => {handleNav('resources'); setIsMenuOpen(false)}} className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800"><Layers size={18} className="text-gray-500"/><span className="font-bold text-sm">Ressourcen</span></button>
                                </div>
                            </div>

                            {/* GUIDELINES */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Guidelines</h3>
                                <div className="space-y-1">
                                    <button onClick={() => {handleNav('web'); setIsMenuOpen(false)}} className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800"><Layout size={18} className="text-gray-500"/><span className="font-bold text-sm">Webseite & SEO</span></button>
                                    <button onClick={() => {handleNav('brand'); setIsMenuOpen(false)}} className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800"><FileText size={18} className="text-gray-500"/><span className="font-bold text-sm">Branding</span></button>
                                    <button onClick={() => {handleNav('support'); setIsMenuOpen(false)}} className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800"><LifeBuoy size={18} className="text-gray-500"/><span className="font-bold text-sm">Support</span></button>
                                    <button onClick={() => {handleNav('vivenu'); setIsMenuOpen(false)}} className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800"><CreditCard size={18} className="text-gray-500"/><span className="font-bold text-sm">Vivenu</span></button>
                                    <button onClick={() => {handleNav('tickets'); setIsMenuOpen(false)}} className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800"><FileText size={18} className="text-gray-500"/><span className="font-bold text-sm">Tickets</span></button>
                                    <button onClick={() => {handleNav('accreditation'); setIsMenuOpen(false)}} className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800"><Shield size={18} className="text-gray-500"/><span className="font-bold text-sm">Akkreditierung</span></button>
                                    <button onClick={() => {handleNav('votings'); setIsMenuOpen(false)}} className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800"><MousePointer size={18} className="text-gray-500"/><span className="font-bold text-sm">Votings</span></button>
                                    <button onClick={() => {handleNav('automation'); setIsMenuOpen(false)}} className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800"><Cpu size={18} className="text-gray-500"/><span className="font-bold text-sm">Automation</span></button>
                                </div>
                            </div>

                            {/* ADMIN (NUR WENN PRIVILEGED) */}
                            {isPrivileged && (
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">System</h3>
                                    <button onClick={() => {handleNav('admin'); setIsMenuOpen(false)}} className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800"><Settings size={18} className="text-gray-500"/><span className="font-bold text-sm">Admin Dashboard</span></button>
                                </div>
                            )}

                            {/* LOGOUT (GANZ WICHTIG!) */}
                            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                                <button onClick={() => {onLogout(); setIsMenuOpen(false);}} className="flex items-center gap-3 text-red-500 font-bold text-sm hover:opacity-70 w-full px-4 py-2">
                                    <LogOut size={18}/> Ausloggen
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}