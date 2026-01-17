import React from 'react';
import { Laptop, Sparkles } from 'lucide-react';
import { RESOURCE_LINKS, TECH_STACK } from '../config/data.js';
import ResourceSection from '../components/Resources/ResourceSection.jsx';

export default function ResourceView() {
    
    // Hilfsfunktion für die Logos
    const getLogoUrl = (domain) => `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-32 px-4 font-sans">
            
            {/* Header: Italic entfernt, Aeonik Black genutzt */}
            <div className="mb-20 border-b border-gray-100 dark:border-k5-deep pb-12">
                <h2 className="text-5xl lg:text-6xl font-black text-k5-black dark:text-white mb-6 tracking-tighter uppercase leading-none">
                    K5 <span className="text-k5-digital">Resources</span>
                </h2>
                <div className="flex items-center gap-3 ml-1">
                    <Sparkles size={14} className="text-k5-digital" />
                    <p className="text-k5-sand font-bold uppercase text-[11px] tracking-[0.4em]">
                        Zentrale Dateiablage & Tool-Verzeichnis
                    </p>
                </div>
            </div>

            {/* Haupt-Ressourcen (Google Drive, PDFs, Boards) */}
            <div className="mb-24">
                {RESOURCE_LINKS.map((group, index) => (
                    <ResourceSection 
                        key={index} 
                        category={group.category} 
                        items={group.items} 
                    />
                ))}
            </div>

            {/* Tech Stack Sektion: rounded-k5-lg & Aeonik Typo */}
            <div className="bg-k5-light-grey/50 dark:bg-k5-deep/20 p-8 md:p-14 rounded-k5-lg border border-gray-100 dark:border-k5-deep/50">
                <div className="flex justify-between items-center mb-12">
                    <h3 className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-k5-sand">
                        <Laptop size={18} className="text-k5-digital" /> Official Tech Stack
                    </h3>
                    <div className="h-px flex-1 bg-gray-200 dark:bg-k5-deep mx-8 hidden md:block opacity-50"></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {TECH_STACK.map((tech, i) => (
                        <a 
                            key={i} 
                            href={tech.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="bg-white dark:bg-k5-black p-8 rounded-k5-md shadow-sm border border-transparent hover:border-k5-digital hover:shadow-xl hover:shadow-k5-digital/10 hover:-translate-y-1 transition-all text-center group flex flex-col items-center justify-center gap-4"
                        >
                            {/* Logo Wrapper: k5-sm Rundung */}
                            <div className="w-14 h-14 flex items-center justify-center p-3 bg-k5-light-grey dark:bg-k5-deep rounded-k5-sm group-hover:scale-110 transition-transform">
                                <img 
                                    src={getLogoUrl(tech.domain)} 
                                    alt={`${tech.name} logo`}
                                    className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                                    onError={(e) => { e.target.src = 'https://lucide.dev/api/icon/globe'; }}
                                />
                            </div>

                            <div className="w-full">
                                <div className="text-[11px] font-bold text-k5-black dark:text-white uppercase truncate tracking-tight">
                                    {tech.name}
                                </div>
                                <div className="text-[8px] text-k5-sand font-bold tracking-widest uppercase mt-1">
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