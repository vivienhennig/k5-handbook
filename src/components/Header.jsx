import React, { useState, useEffect } from 'react';
import { 
  Search, Menu, X, ChevronDown, User, Users, LifeBuoy, CreditCard, 
  Layout, Shield, Cpu, MousePointer, FileText, Settings, LogOut, 
  Sun, Moon, Palmtree, Link as LinkIcon, Briefcase, QrCode, Calendar
} from 'lucide-react';
import { SECTIONS_CONFIG, SNIPPETS } from '../config/data';
import { levenshteinDistance } from '../services/api';

export default function Header({ 
  user, 
  activeTab, 
  handleNav, 
  toggleDarkMode, 
  darkMode, 
  onOpenProfile, 
  onLogout, 
  hasUpdate,
  isPrivileged 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // --- SEARCH LOGIC (aus App.jsx ausgelagert) ---
  useEffect(() => {
    if (searchQuery.length < 2) { setSearchResults([]); return; }
    const lowerQ = searchQuery.toLowerCase();
    
    // Wir bauen einen durchsuchbaren Index
    let searchable = [
        ...SECTIONS_CONFIG.map(s => ({ id: s.id, title: s.title, text: s.desc, section: 'Bereich' })),
        ...SNIPPETS.map(s => ({ id: 'support', title: s.title, text: s.text, section: 'Snippet' })),
        { id: 'support', title: 'Preise', text: 'ticket preise retailer early bird', section: 'Support' },
        { id: 'team', title: 'Team', text: 'mitarbeiter kollegen telefonliste', section: 'Workplace' },
        { id: 'vacation', title: 'Urlaub', text: 'urlaubsantrag resturlaub ferien', section: 'Workplace' },
        { id: 'resources', title: 'Links & Ressourcen', text: 'drive asana personio tools', section: 'Workplace' }
    ];

    const results = searchable.filter(item => {
        if (item.title.toLowerCase().includes(lowerQ) || (item.text && item.text.toLowerCase().includes(lowerQ))) return true;
        if (!item.text) return false;
        // Fuzzy Search
        const words = (item.title + " " + item.text).toLowerCase().split(" ");
        return words.some(word => Math.abs(word.length - lowerQ.length) <= 2 && levenshteinDistance(word, lowerQ) <= 2);
    });
    setSearchResults(results);
  }, [searchQuery]);

  const onSearchResultClick = (id) => {
      handleNav(id);
      setSearchQuery('');
      setSearchResults([]);
      setMobileMenuOpen(false);
  };

  // Helper für Navigation Items
  const NavItem = ({ id, label, icon: Icon }) => (
      <button onClick={() => { handleNav(id); setMobileMenuOpen(false); }} 
        className={`w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded flex items-center gap-3 font-semibold text-sm ${activeTab === id ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-200'}`}>
        <Icon size={18} className={activeTab === id ? "text-blue-600 dark:text-blue-400" : "text-gray-400"}/> 
        {label}
        {hasUpdate(id) && <span className="w-2 h-2 bg-red-500 rounded-full ml-auto"></span>}
      </button>
  );

  return (
    <header className="fixed top-0 w-full bg-[#092AFF] dark:bg-blue-900 text-white z-50 h-20 shadow-md transition-colors">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        
        {/* LOGO */}
        <div onClick={() => handleNav('home')} className="font-black text-2xl tracking-tighter cursor-pointer flex items-center gap-2">
            K5 <span className="font-light opacity-80">HANDBOOK</span>
        </div>
        
        {/* DESKTOP NAV */}
        <nav className="hidden xl:flex items-center gap-6 h-full">
          <button onClick={() => handleNav('home')} className={`h-full border-b-4 px-2 font-bold uppercase text-sm tracking-wide transition-colors ${activeTab === 'home' ? 'border-white' : 'border-transparent opacity-80 hover:opacity-100'}`}>Home</button>
          
          {/* 1. GUIDELINES DROPDOWN */}
          <div className="group h-full flex items-center relative cursor-pointer">
              <button className={`h-full border-b-4 px-2 font-bold uppercase text-sm tracking-wide flex items-center gap-1 ${['web','brand','support'].includes(activeTab) ? 'border-white' : 'border-transparent opacity-80 hover:opacity-100'}`}>
                  Guidelines <ChevronDown size={14}/>
                  {(hasUpdate('web') || hasUpdate('brand') || hasUpdate('support')) && <span className="absolute top-4 right-[-5px] w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[500px] bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-b-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 p-6 grid grid-cols-2 gap-6 border-t border-gray-100 dark:border-gray-700">
                <div>
                    <h4 className="font-bold text-xs uppercase text-gray-400 mb-3 tracking-wider border-b dark:border-gray-700 pb-2">Identity</h4>
                    <NavItem id="web" label="Webseite" icon={Layout} />
                    <NavItem id="brand" label="Branding & Assets" icon={FileText} />
                </div>
                <div>
                    <h4 className="font-bold text-xs uppercase text-gray-400 mb-3 tracking-wider border-b dark:border-gray-700 pb-2">Communication</h4>
                    <NavItem id="support" label="Customer Support" icon={LifeBuoy} />
                </div>
              </div>
          </div>

          {/* 2. EVENTS DROPDOWN */}
          <div className="group h-full flex items-center relative cursor-pointer">
              <button className={`h-full border-b-4 px-2 font-bold uppercase text-sm tracking-wide flex items-center gap-1 ${['vivenu','tickets','accreditation'].includes(activeTab) ? 'border-white' : 'border-transparent opacity-80 hover:opacity-100'}`}>
                  Events <ChevronDown size={14}/>
                  {(hasUpdate('vivenu') || hasUpdate('tickets') || hasUpdate('accreditation')) && <span className="absolute top-4 right-[-5px] w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[500px] bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-b-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 p-6 grid grid-cols-2 gap-6 border-t border-gray-100 dark:border-gray-700">
                <div>
                    <h4 className="font-bold text-xs uppercase text-gray-400 mb-3 tracking-wider border-b dark:border-gray-700 pb-2">Planung</h4>
                    <NavItem id="calendar" label="Event Kalender" icon={Calendar} />
                </div>
                <div>
                    <h4 className="font-bold text-xs uppercase text-gray-400 mb-3 tracking-wider border-b dark:border-gray-700 pb-2">Setup</h4>
                    <NavItem id="vivenu" label="Vivenu Setup" icon={CreditCard} />
                    <NavItem id="tickets" label="Ticket Logik" icon={FileText} />
                </div>
                <div>
                    <h4 className="font-bold text-xs uppercase text-gray-400 mb-3 tracking-wider border-b dark:border-gray-700 pb-2">On-Site</h4>
                    <NavItem id="accreditation" label="Akkreditierung" icon={Shield} />
                </div>
              </div>
          </div>

           {/* 3. TECH DROPDOWN */}
           <div className="group h-full flex items-center relative cursor-pointer">
            <button className={`h-full border-b-4 px-2 font-bold uppercase text-sm tracking-wide flex items-center gap-1 ${['votings','automation','tools'].includes(activeTab) ? 'border-white' : 'border-transparent opacity-80 hover:opacity-100'}`}>
                Tech <ChevronDown size={14}/>
                {(hasUpdate('votings') || hasUpdate('automation')) && <span className="absolute top-4 right-[-5px] w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-[300px] bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-b-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 p-6 border-t border-gray-100 dark:border-gray-700">
                <NavItem id="votings" label="Voting System" icon={MousePointer} />
                <NavItem id="automation" label="Automation Check" icon={Cpu} />
                {/* NEU: TOOLS */}
                <NavItem id="tools" label="QR-Code Generator" icon={QrCode} />
            </div>
          </div>

          {/* 4. WORKPLACE DROPDOWN (NEU GRUPPIERT) */}
          <div className="group h-full flex items-center relative cursor-pointer">
            <button className={`h-full border-b-4 px-2 font-bold uppercase text-sm tracking-wide flex items-center gap-1 ${['team','vacation','resources'].includes(activeTab) ? 'border-white' : 'border-transparent opacity-80 hover:opacity-100'}`}>
                Office <ChevronDown size={14}/>
            </button>
            <div className="absolute top-full right-0 w-[300px] bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-b-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 p-6 border-t border-gray-100 dark:border-gray-700 space-y-2">
                <NavItem id="team" label="Team Verzeichnis" icon={Users} />
                <NavItem id="vacation" label="Urlaubsmanager" icon={Palmtree} />
                <NavItem id="resources" label="Links & Assets" icon={LinkIcon} />
            </div>
          </div>
        </nav>
        
        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-4">
           {/* SEARCH */}
           <div className="relative hidden md:block group">
               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-200 group-focus-within:text-blue-600 transition-colors"><Search size={16} /></div>
               <input type="text" placeholder="Suche..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
                    className="bg-blue-800/50 dark:bg-blue-950/50 border border-blue-400/30 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-blue-200 focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 w-32 transition-all focus:w-64"/>
               
               {/* Search Results Dropdown */}
               {searchResults.length > 0 && (
                   <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl text-gray-800 dark:text-white overflow-hidden z-50 border border-gray-100 dark:border-gray-700">
                       {searchResults.map((res, idx) => (
                           <div key={idx} onClick={() => onSearchResultClick(res.id)} className="p-3 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0">
                               <div className="font-bold text-sm text-blue-600 dark:text-blue-400">{res.title}</div>
                               <div className="text-xs text-gray-500 dark:text-gray-400">in {res.section}</div>
                           </div>
                       ))}
                   </div>
               )}
           </div>

           <button onClick={toggleDarkMode} className="text-white hover:text-blue-200 transition p-1">{darkMode ? <Sun size={20}/> : <Moon size={20}/>}</button>
           
           {isPrivileged && <button onClick={() => handleNav('admin')} className="text-white hover:text-blue-200 transition"><Settings size={20} /></button>}
           
           {/* PROFILE */}
           <div className="flex items-center gap-2 pl-2 border-l border-white/20">
               <button onClick={onOpenProfile} className="flex items-center gap-2 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium text-white">
                  {user?.photoUrl ? (
                      <img src={user.photoUrl} alt="Me" className="w-6 h-6 rounded-full object-cover border border-white/50"/>
                  ) : (
                      <User size={18}/>
                  )}
                  <span className="hidden xl:inline">{user?.displayName || 'Profil'}</span>
               </button>
               <button onClick={onLogout} className="text-white/70 hover:text-white transition-colors p-1" title="Ausloggen"><LogOut size={18}/></button>
           </div>

           {/* MOBILE BURGER */}
           <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="xl:hidden text-white">{mobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}</button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 z-40 pt-24 px-6 overflow-y-auto xl:hidden text-gray-800 dark:text-white animate-in slide-in-from-right duration-200">
             <div className="space-y-6 pb-20">
                {/* Wir wiederholen die Navigation hier vereinfacht für Mobile */}
                <div>
                    <h3 className="text-xs font-bold uppercase text-gray-400 mb-2">General</h3>
                    <NavItem id="home" label="Home" icon={Layout} />
                </div>
                <div>
                    <h3 className="text-xs font-bold uppercase text-gray-400 mb-2">Office & Team</h3>
                    <NavItem id="team" label="Team Directory" icon={Users} />
                    <NavItem id="vacation" label="Urlaub" icon={Palmtree} />
                    <NavItem id="resources" label="Links & Ressourcen" icon={LinkIcon} />
                </div>
                <div>
                    <h3 className="text-xs font-bold uppercase text-gray-400 mb-2">Guidelines</h3>
                    <NavItem id="web" label="Webseite" icon={Layout} />
                    <NavItem id="brand" label="Branding" icon={FileText} />
                    <NavItem id="support" label="Support" icon={LifeBuoy} />
                </div>
                <div>
                    <h3 className="text-xs font-bold uppercase text-gray-400 mb-2">Events & Tech</h3>
                    <NavItem id="vivenu" label="Vivenu" icon={CreditCard} />
                    <NavItem id="tickets" label="Tickets" icon={FileText} />
                    <NavItem id="accreditation" label="Akkreditierung" icon={Shield} />
                    <NavItem id="votings" label="Votings" icon={MousePointer} />
                </div>
             </div>
        </div>
      )}
    </header>
  );
}