import React from 'react';
import { Download, FileText, ExternalLink, ShieldCheck } from 'lucide-react';

export default function ResourceCard({ resource }) {
    const isDownload = resource.type === 'download' || resource.url.includes('.pdf');

    return (
        <div className="group bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl shadow-sm ${resource.color || 'bg-blue-50 text-blue-600'}`}>
                    <FileText size={24} />
                </div>
                {resource.isInternal && (
                    <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-lg">
                        <ShieldCheck size={10} /> Internal
                    </span>
                )}
            </div>

            <div className="flex-1">
                <h4 className="font-black text-gray-900 dark:text-white uppercase italic tracking-tight mb-2">
                    {resource.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    {resource.description}
                </p>
            </div>

            <a 
                href={resource.url} 
                target="_blank" 
                rel="noreferrer"
                className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-gray-50 dark:bg-gray-900 hover:bg-blue-600 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all group-hover:shadow-lg italic"
            >
                {isDownload ? <Download size={14} /> : <ExternalLink size={14} />}
                {isDownload ? 'Download' : 'Öffnen'}
            </a>
        </div>
    );
}