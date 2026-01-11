import React from 'react';
import { ExternalLink, Folder, Link as LinkIcon, Copy, Check, Layers } from 'lucide-react';
// HIER: TECH_STACK importieren
import { RESOURCE_LINKS, TECH_STACK } from '../config/data';

export default function ResourceView() {
    const [copied, setCopied] = React.useState(null);

    const handleCopy = (url) => {
        navigator.clipboard.writeText(url);
        setCopied(url);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-20">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Ressourcen & Links</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                    Der Schnellzugriff auf unseren Tech Stack, Cloud-Ordner und Dashboards.
                </p>
            </div>

            {/* --- 1. TECH STACK (Logos) --- */}
            <div className="mb-16">
                <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                    <Layers className="text-blue-600 dark:text-blue-400" size={20}/> K5 Tech Stack
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {TECH_STACK.map((tool, idx) => (
                        <a 
                            key={idx} 
                            href={tool.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="group bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all flex items-center gap-4"
                        >
                            {/* LOGO TRICK MIT CLEARBIT */}
                            <div className="w-12 h-12 shrink-0 bg-gray-50 dark:bg-white rounded-lg p-2 flex items-center justify-center border border-gray-100">
                                <img 
                                    src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=128`} 
                                    alt={tool.name} 
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        e.target.style.display='none';
                                        // Fallback: Ersten Buchstaben anzeigen
                                        e.target.parentElement.innerHTML = `<span class="text-xl font-bold text-gray-400">${tool.name.charAt(0)}</span>`;
                                    }}/>
                            </div>
                            <div className="overflow-hidden">
                                <div className="font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                                    {tool.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {tool.desc}
                                </div>
                            </div>
                            <ExternalLink size={14} className="ml-auto text-gray-300 group-hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100"/>
                        </a>
                    ))}
                </div>
            </div>

            {/* --- 2. ORDNER & LINKS (Die alte Liste) --- */}
            <div className="space-y-12">
                {RESOURCE_LINKS.map((section, idx) => (
                    <div key={idx}>
                        <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                            <Folder className="text-blue-600 dark:text-blue-400" size={20}/> {section.category}
                        </h3>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {section.items.map((item, i) => (
                                <div key={i} className="group bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-2.5 rounded-lg text-blue-600 dark:text-blue-400">
                                            <LinkIcon size={20}/>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleCopy(item.url)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg" title="Link kopieren">
                                                {copied === item.url ? <Check size={16} className="text-green-500"/> : <Copy size={16}/>}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">{item.name}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 min-h-[2.5em]">
                                        {item.desc}
                                    </p>
                                    
                                    <a href={item.url} target="_blank" rel="noreferrer" className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-gray-50 dark:bg-gray-700 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-sm font-bold text-gray-600 dark:text-gray-300 rounded-lg transition-colors group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                                        Öffnen <ExternalLink size={14}/>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}