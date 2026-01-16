import React from 'react';
import { ExternalLink, Link as LinkIcon } from 'lucide-react';

export default function ToolCard({ tool, handleNav }) {
    const isExternal = tool.url.startsWith('http');

    const handleClick = () => {
        if (isExternal) {
            window.open(tool.url, '_blank');
        } else {
            handleNav(tool.url);
        }
    };

    return (
        <button 
            onClick={handleClick}
            className="group relative bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-left flex flex-col h-full"
        >
            <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg ${tool.color || 'bg-blue-50 text-blue-600'}`}>
                {tool.icon}
            </div>
            
            <div className="flex-1">
                <h4 className="font-black text-gray-900 dark:text-white uppercase italic tracking-tight mb-2 flex items-center gap-2">
                    {tool.name}
                    {isExternal ? <ExternalLink size={14} className="opacity-20 group-hover:opacity-100 transition-opacity" /> : <LinkIcon size={14} className="opacity-20 group-hover:opacity-100" />}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium uppercase tracking-tighter">
                    {tool.description}
                </p>
            </div>

            {/* Subtile Badge für die Kategorie */}
            <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-700 flex justify-between items-center">
                <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">{tool.category}</span>
                <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                    <ExternalLink size={12} className="text-blue-600" />
                </div>
            </div>
        </button>
    );
}