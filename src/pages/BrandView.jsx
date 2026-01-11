import React from 'react';
import { Flag, Type } from 'lucide-react';
import { K5_COLORS } from '../config/data';

export default function BrandView({ openFeedback }) {
    return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Brand Guidelines</h2>
            <button onClick={() => openFeedback('Brand Guidelines')} className="text-gray-400 hover:text-red-500"><Flag size={20}/></button>
        </div>
        <div className="grid gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"><h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Dachmarke Farben</h3><div className="grid grid-cols-2 md:grid-cols-3 gap-4">{K5_COLORS.map((c, i) => (<div key={i} className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600"><div className="h-20" style={{backgroundColor: c.hex}}></div><div className="p-3"><div className="font-bold text-sm text-gray-900 dark:text-white">{c.name}</div><div className="text-xs text-gray-500 font-mono">{c.hex}</div></div></div>))}</div></div>
            <div className="grid md:grid-cols-2 gap-6"><div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"><h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900 dark:text-white"><Type className="text-blue-600 dark:text-blue-400"/> Typografie</h3><div className="space-y-4"><div><div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Headline</div><div className="text-2xl font-bold text-gray-900 dark:text-white">Aeonik Bold</div></div><div><div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Body</div><div className="text-lg text-gray-900 dark:text-white">Aeonik Regular</div></div></div></div><div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col justify-center items-center text-center"><h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Logo Paket</h3><button className="bg-black text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-800 transition-colors">Download .zip</button></div></div>
        </div>
    </div>
    );
}