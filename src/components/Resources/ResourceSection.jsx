import React from 'react';
import { ExternalLink, Folder } from 'lucide-react';

export default function ResourceSection({ category, items }) {
    return (
        <div className="mb-12">
            <h3 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-6 italic ml-2">
                <Folder size={14} /> {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, i) => (
                    <a 
                        key={i} 
                        href={item.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="group bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-black text-gray-900 dark:text-white uppercase italic tracking-tight group-hover:text-blue-600 transition-colors">
                                {item.name}
                            </h4>
                            <ExternalLink size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter leading-snug">
                            {item.desc}
                        </p>
                    </a>
                ))}
            </div>
        </div>
    );
}