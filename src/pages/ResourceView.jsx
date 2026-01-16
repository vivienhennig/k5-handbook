import React from 'react';
import { Laptop } from 'lucide-react';
import { RESOURCE_LINKS, TECH_STACK } from '../config/data';
import ResourceSection from '../components/Resources/ResourceSection';

export default function ResourceView() {
    
    // Hilfsfunktion für die Logos (zieht das High-Res Favicon via Google S2)
    const getLogoUrl = (domain) => `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-20 px-4 font-sans">
            
            {/* Header */}
            <div className="mb-16 border-b border-gray-100 dark:border-gray-800 pb-10">
                <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter italic uppercase">
                    K5 <span className="text-blue-600">Resources</span>
                </h2>
                <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] italic">Zentrale Dateiablage & Tool-Verzeichnis</p>
            </div>

            {/* Haupt-Ressourcen (Google Drive, PDFs, Boards) */}
            <div className="mb-20">
                {RESOURCE_LINKS.map((group, index) => (
                    <ResourceSection 
                        key={index} 
                        category={group.category} 
                        items={group.items} 
                    />
                ))}
            </div>

            {/* Tech Stack Sektion mit Logos */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 md:p-10 rounded-[3rem] border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-10">
                    <h3 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic">
                        <Laptop size={16} /> Official Tech Stack
                    </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {TECH_STACK.map((tech, i) => (
                        <a 
                            key={i} 
                            href={tech.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] shadow-sm border border-transparent hover:border-blue-500 hover:shadow-xl transition-all text-center group flex flex-col items-center justify-center gap-3"
                        >
                            {/* Logo Wrapper */}
                            <div className="w-12 h-12 flex items-center justify-center p-2 bg-gray-50 dark:bg-gray-800 rounded-xl group-hover:scale-110 transition-transform">
                                <img 
                                    src={getLogoUrl(tech.domain)} 
                                    alt={`${tech.name} logo`}
                                    className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all"
                                    onError={(e) => { e.target.src = 'https://lucide.dev/api/icon/globe'; }} // Fallback
                                />
                            </div>

                            <div>
                                <div className="text-[10px] font-black text-gray-900 dark:text-white uppercase truncate">
                                    {tech.name}
                                </div>
                                <div className="text-[8px] text-gray-400 font-bold tracking-tighter uppercase opacity-60">
                                    {tech.domain}
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}