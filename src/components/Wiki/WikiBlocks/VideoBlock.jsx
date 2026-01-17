import React from 'react';
import { PlayCircle, Youtube, Sparkles, Video } from 'lucide-react';

export default function VideoBlock({ content, isEditing, onChange }) {
    return (
        <div className="w-full h-full min-h-[250px] flex flex-col font-sans">
            {/* Video Container: rounded-k5-lg & K5-Deep Shadow */}
            <div className="aspect-video rounded-k5-lg overflow-hidden bg-k5-black shadow-2xl shadow-k5-digital/10 relative group/vid flex-1 border border-gray-100 dark:border-k5-deep/50 transition-all duration-500 hover:shadow-k5-digital/20">
                
                {isEditing ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-k5-deep/80 backdrop-blur-md animate-in fade-in duration-300">
                        <div className="p-4 bg-k5-digital/10 rounded-full mb-4">
                            <PlayCircle size={48} className="text-k5-digital animate-pulse" />
                        </div>
                        
                        <div className="w-full max-w-sm space-y-3">
                            <div className="flex items-center gap-2 justify-center mb-1">
                                <Youtube size={14} className="text-k5-sand" />
                                <span className="text-[10px] font-bold text-k5-sand uppercase tracking-[0.3em]">Embed Source</span>
                            </div>
                            <input 
                                className="w-full bg-k5-black/50 text-white border border-k5-digital/30 focus:border-k5-digital p-4 rounded-k5-sm text-xs font-bold outline-none transition-all placeholder:opacity-30" 
                                placeholder="YouTube / Vimeo URL hier einfügen..." 
                                value={content.url} 
                                onChange={e => onChange({url: e.target.value})} 
                            />
                        </div>
                    </div>
                ) : (
                    content.url ? (
                        <iframe 
                            className="w-full h-full" 
                            src={content.url.includes('youtube.com') ? content.url.replace('watch?v=', 'embed/') : content.url} 
                            title="Handbook Video Asset" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4 bg-k5-light-grey/10 dark:bg-k5-deep/20">
                            <Video size={40} className="opacity-20" />
                            <div className="flex items-center gap-2">
                                <Sparkles size={12} className="text-k5-sand" />
                                <p className="font-bold uppercase text-[10px] tracking-[0.3em] text-k5-sand">Kein Video hinterlegt</p>
                            </div>
                        </div>
                    )
                )}
            </div>

            {/* Subtiler Footer für Video-Metadaten im Dashboard */}
            {!isEditing && content.url && (
                <div className="mt-4 px-2 flex items-center justify-between opacity-40 group-hover/vid:opacity-100 transition-opacity">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        K5 Digital Asset
                    </p>
                </div>
            )}
        </div>
    );
}