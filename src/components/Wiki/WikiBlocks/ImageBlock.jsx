import React from 'react';
import { Maximize2, MinusCircle, Check as CheckIcon} from 'lucide-react';

// --- IMAGE BLOCK ---
export default function ImageBlock ({ content, isEditing, onChange, onLightbox }) {
    return (    
    <div className="space-y-4">
        {isEditing && (
            <div className="flex gap-2 mb-4 bg-gray-50 dark:bg-gray-900 p-2 rounded-2xl">
                <button onClick={() => onChange({...content, layout: 'single'})} className={`flex-1 py-2 rounded-xl text-[10px] font-black ${content.layout === 'single' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>SINGLE</button>
                <button onClick={() => onChange({...content, layout: 'grid'})} className={`flex-1 py-2 rounded-xl text-[10px] font-black ${content.layout === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>GRID</button>
                <button onClick={() => onChange({...content, urls: [...content.urls, ""]})} className="px-4 py-2 bg-blue-100 text-blue-600 rounded-xl text-[10px] font-black">+</button>
            </div>
        )}
        <div className={`grid gap-4 ${content.layout === 'grid' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {content.urls?.map((url, i) => (
                <div key={i} className="relative group/img">
                    <div className="rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm cursor-zoom-in" 
                         onClick={() => !isEditing && url && onLightbox(url)}>
                        {url ? <img src={url} alt="" className="w-full h-full object-cover min-h-[150px] max-h-[500px] transition-transform duration-500 group-hover/img:scale-105" /> 
                             : <div className="p-10 text-center text-gray-300 italic text-xs">Kein Bild geladen</div>}
                        {!isEditing && url && (
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                                <Maximize2 className="text-white" size={24}/>
                            </div>
                        )}
                    </div>
                    {isEditing && (
                        <div className="mt-2 flex gap-2 animate-in slide-in-from-top-1">
                            <input className="flex-1 text-[10px] p-2 bg-gray-50 dark:bg-gray-900 rounded-lg outline-none dark:text-white" 
                                placeholder="Bild URL..." value={url} onChange={e => {
                                    const n = [...content.urls]; n[i] = e.target.value; onChange({...content, urls: n});
                            }} />
                            <button onClick={() => {
                                const n = content.urls.filter((_, idx) => idx !== i);
                                onChange({...content, urls: n});
                            }} className="text-red-400 p-1 hover:bg-red-50 rounded"><MinusCircle size={16}/></button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
)}