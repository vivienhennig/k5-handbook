import React from 'react';
import { Download, FileText, ExternalLink, ShieldCheck } from 'lucide-react';

export default function ResourceCard({ resource }) {
    const isDownload = resource.type === 'download' || resource.url.includes('.pdf');

    return (
        <div className="group bg-white dark:bg-k5-black p-8 rounded-k5-md border border-gray-100 dark:border-k5-deep shadow-sm hover:shadow-2xl hover:shadow-k5-digital/10 transition-all duration-500 flex flex-col font-sans h-full">
            {/* Header: Icon & Security Badge */}
            <div className="flex justify-between items-start mb-8">
                <div className={`p-5 rounded-k5-sm shadow-sm transition-transform group-hover:scale-110 duration-500 ${resource.color || 'bg-k5-digital/10 text-k5-digital'}`}>
                    <FileText size={28} />
                </div>
                {resource.isInternal && (
                    <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-k5-lime bg-k5-lime/10 border border-k5-lime/20 px-3 py-1.5 rounded-full">
                        <ShieldCheck size={12} /> Internal
                    </span>
                )}
            </div>

            {/* Content: Aeonik Bold, kein Italic */}
            <div className="flex-1">
                <h4 className="font-bold text-xl text-k5-black dark:text-white uppercase tracking-tight mb-3 leading-tight">
                    {resource.title}
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
                    {resource.description}
                </p>
            </div>

            {/* CTA Button: Glow Digital Effekt */}
            <a 
                href={resource.url} 
                target="_blank" 
                rel="noreferrer"
                className="mt-8 w-full flex items-center justify-center gap-3 py-4 bg-k5-light-grey dark:bg-k5-deep/40 hover:bg-glow-digital hover:text-white rounded-k5-sm text-[10px] font-bold uppercase tracking-[0.25em] transition-all group-hover:shadow-xl group-hover:shadow-k5-digital/25 active:scale-95"
            >
                {isDownload ? <Download size={16} /> : <ExternalLink size={16} />}
                {isDownload ? 'Download File' : 'Open Resource'}
            </a>
        </div>
    );
}