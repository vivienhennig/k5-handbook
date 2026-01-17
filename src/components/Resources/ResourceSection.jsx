import React from 'react';
import { ExternalLink, Folder } from 'lucide-react';

export default function ResourceSection({ category, items }) {
    return (
        <div className="mb-16">
            {/* Category Header: Aeonik Bold, K5-Sand für edlen Look */}
            <h3 className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-k5-sand mb-8 ml-2">
                <Folder size={16} className="text-k5-digital" /> {category}
            </h3>

            {/* Grid Layout: Optimiert auf 3 Spalten (LG) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item, i) => (
                    <a 
                        key={i} 
                        href={item.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="group bg-white dark:bg-k5-black p-8 rounded-k5-lg border border-gray-100 dark:border-k5-deep shadow-sm hover:shadow-2xl hover:shadow-k5-digital/10 hover:-translate-y-1.5 transition-all duration-500 font-sans"
                    >
                        <div className="flex justify-between items-start mb-4">
                            {/* Name: Aeonik Black, Uppercase */}
                            <h4 className="font-black text-lg text-k5-black dark:text-white uppercase tracking-tight group-hover:text-k5-digital transition-colors leading-tight">
                                {item.name}
                            </h4>
                            <div className="p-2 bg-k5-light-grey dark:bg-k5-deep/50 rounded-k5-sm group-hover:bg-k5-digital group-hover:text-white transition-all">
                                <ExternalLink size={16} className="text-gray-400 group-hover:text-inherit" />
                            </div>
                        </div>

                        {/* Description: Aeonik Bold, K5-Sand für Metadaten */}
                        <p className="text-[11px] text-k5-sand font-bold uppercase tracking-widest leading-relaxed">
                            {item.desc}
                        </p>
                        
                        {/* Subtiler Glow-Akzent am Boden bei Hover */}
                        <div className="mt-6 h-1 w-0 group-hover:w-full bg-k5-digital transition-all duration-500 rounded-full opacity-50" />
                    </a>
                ))}
            </div>
        </div>
    );
}