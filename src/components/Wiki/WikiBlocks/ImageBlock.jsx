import React from 'react';
import { Maximize2, MinusCircle, Plus, LayoutGrid, Square, Image as ImageIcon } from 'lucide-react';

export default function ImageBlock({ content, isEditing, onChange, onLightbox }) {
    return (    
        <div className="space-y-6 font-sans">
            {/* Editor Controls: rounded-k5-sm */}
            {isEditing && (
                <div className="flex flex-wrap items-center gap-3 mb-6 bg-k5-light-grey/50 dark:bg-k5-deep/20 p-3 rounded-k5-sm border border-gray-100 dark:border-k5-deep/50 animate-in fade-in">
                    <div className="flex bg-white dark:bg-k5-black p-1 rounded-md border border-gray-100 dark:border-k5-deep">
                        <button 
                            onClick={() => onChange({...content, layout: 'single'})} 
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${content.layout === 'single' ? 'bg-k5-digital text-white shadow-md' : 'text-gray-400 hover:text-k5-black dark:hover:text-white'}`}
                        >
                            <Square size={12} /> Single
                        </button>
                        <button 
                            onClick={() => onChange({...content, layout: 'grid'})} 
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${content.layout === 'grid' ? 'bg-k5-digital text-white shadow-md' : 'text-gray-400 hover:text-k5-black dark:hover:text-white'}`}
                        >
                            <LayoutGrid size={12} /> Grid
                        </button>
                    </div>
                    
                    <button 
                        onClick={() => onChange({...content, urls: [...(content.urls || []), ""]})} 
                        className="px-5 py-3 bg-k5-digital/10 text-k5-digital hover:bg-k5-digital hover:text-white rounded-k5-sm text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2"
                    >
                        <Plus size={14} /> Add Image
                    </button>
                </div>
            )}

            {/* Image Display: rounded-k5-lg */}
            <div className={`grid gap-8 ${content.layout === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {content.urls?.map((url, i) => (
                    <div key={i} className="relative group/img flex flex-col h-full">
                        <div 
                            className="relative rounded-k5-lg overflow-hidden bg-k5-light-grey/30 dark:bg-k5-deep/20 border border-gray-50 dark:border-k5-deep/30 shadow-sm cursor-zoom-in aspect-auto min-h-[150px] transition-all duration-500 hover:shadow-2xl hover:shadow-k5-digital/10" 
                            onClick={() => !isEditing && url && onLightbox(url)}
                        >
                            {url ? (
                                <>
                                    <img 
                                        src={url} 
                                        alt="" 
                                        className="w-full h-full object-cover max-h-[600px] transition-transform duration-700 group-hover/img:scale-105" 
                                    />
                                    {!isEditing && (
                                        <div className="absolute inset-0 bg-k5-digital/10 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-[2px]">
                                            <div className="bg-white/90 p-4 rounded-full shadow-2xl transform scale-75 group-hover/img:scale-100 transition-transform">
                                                <Maximize2 className="text-k5-digital" size={24}/>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="p-16 flex flex-col items-center justify-center gap-4 text-gray-300">
                                    <ImageIcon size={40} className="opacity-20" />
                                    <p className="font-bold uppercase text-[10px] tracking-widest">No Asset Loaded</p>
                                </div>
                            )}
                        </div>

                        {/* Editor Input Area */}
                        {isEditing && (
                            <div className="mt-4 flex gap-3 p-2 bg-k5-light-grey/20 dark:bg-k5-deep/10 rounded-k5-sm border border-gray-100 dark:border-k5-deep/30 animate-in slide-in-from-top-2">
                                <input 
                                    className="flex-1 text-[11px] font-bold px-4 py-2 bg-white dark:bg-k5-black rounded border border-gray-100 dark:border-k5-deep outline-none focus:border-k5-digital dark:text-white transition-all placeholder:font-normal" 
                                    placeholder="Paste Image URL..." 
                                    value={url} 
                                    onChange={e => {
                                        const n = [...content.urls]; n[i] = e.target.value; onChange({...content, urls: n});
                                    }} 
                                />
                                <button 
                                    onClick={() => {
                                        const n = content.urls.filter((_, idx) => idx !== i);
                                        onChange({...content, urls: n});
                                    }} 
                                    className="text-gray-300 hover:text-red-500 p-2 transition-colors"
                                >
                                    <MinusCircle size={20}/>
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}