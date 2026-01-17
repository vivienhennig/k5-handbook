import React from 'react';
import { ExternalLink, Link as LinkIcon, ArrowRight } from 'lucide-react';

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
            className="group relative bg-white dark:bg-k5-black p-8 rounded-k5-lg border border-gray-100 dark:border-k5-deep shadow-sm hover:shadow-2xl hover:shadow-k5-digital/10 hover:-translate-y-2 transition-all duration-500 text-left flex flex-col h-full font-sans overflow-hidden"
        >
            {/* Icon Container: k5-md Rundung */}
            <div className={`w-16 h-16 rounded-k5-md mb-8 flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-lg ${tool.color || 'bg-k5-digital/10 text-k5-digital'}`}>
                {React.cloneElement(tool.icon, { size: 32 })}
            </div>
            
            <div className="flex-1">
                {/* Headline: Aeonik Bold, Uppercase, kein Italic */}
                <h4 className="font-bold text-xl text-k5-black dark:text-white uppercase tracking-tight mb-3 flex items-center gap-2">
                    {tool.name}
                    {isExternal ? (
                        <ExternalLink size={16} className="text-k5-sand opacity-40 group-hover:opacity-100 transition-opacity" />
                    ) : (
                        <LinkIcon size={16} className="text-k5-digital opacity-40 group-hover:opacity-100 transition-opacity" />
                    )}
                </h4>
                {/* Description: Aeonik Medium/Bold Style */}
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-bold uppercase tracking-wider">
                    {tool.description}
                </p>
            </div>

            {/* Footer Area: Aeonik Bold Metadaten */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-k5-deep/50 flex justify-between items-center relative z-10">
                <span className="text-[10px] font-bold text-k5-sand uppercase tracking-[0.25em]">
                    {tool.category}
                </span>
                
                {/* Glow Button Effekt bei Hover */}
                <div className="w-10 h-10 rounded-full bg-k5-light-grey dark:bg-k5-deep flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-glow-digital text-white transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                    <ArrowRight size={18} />
                </div>
            </div>

            {/* Subtiler Background Glow im Darkmode bei Hover */}
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-k5-digital/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </button>
    );
}