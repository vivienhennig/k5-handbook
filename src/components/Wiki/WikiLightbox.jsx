import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function WikiLightbox({ activeLightbox, onClose, galleryImages, onNext, onPrev }) {
    useEffect(() => {
        if (!activeLightbox) return;
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') onNext();
            if (e.key === 'ArrowLeft') onPrev();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeLightbox, onNext, onPrev, onClose]);

    if (!activeLightbox) return null;

    const currentIndex = galleryImages.indexOf(activeLightbox);

    return createPortal(
        <div 
            className="fixed inset-0 z-[10000] bg-k5-black/90 backdrop-blur-2xl flex items-center justify-center p-6 cursor-zoom-out animate-in fade-in duration-500" 
            onClick={onClose}
        >
            {/* Close Button: K5 Style */}
            <button 
                className="absolute top-10 right-10 text-white/40 hover:text-white transition-all z-50 hover:rotate-90 duration-300"
                onClick={onClose}
            >
                <X size={48} strokeWidth={1.5} />
            </button>

            {galleryImages.length > 1 && (
                <>
                    {/* Navigation: Digital Blue Glow */}
                    <button 
                        onClick={(e) => { e.stopPropagation(); onPrev(); }} 
                        className="absolute left-10 p-6 bg-white/5 hover:bg-k5-digital text-white rounded-full transition-all border border-white/10 z-50 group shadow-2xl hover:shadow-k5-digital/40"
                    >
                        <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    
                    <button 
                        onClick={(e) => { e.stopPropagation(); onNext(); }} 
                        className="absolute right-10 p-6 bg-white/5 hover:bg-k5-digital text-white rounded-full transition-all border border-white/10 z-50 group shadow-2xl hover:shadow-k5-digital/40"
                    >
                        <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Counter: Aeonik Bold & k5-sand */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 px-8 py-3 bg-white/5 backdrop-blur-md rounded-k5-sm border border-white/10 text-white z-50">
                        <Sparkles size={14} className="text-k5-sand" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.4em] leading-none">
                            Asset {currentIndex + 1} <span className="text-white/30 mx-2">/</span> {galleryImages.length}
                        </span>
                    </div>
                </>
            )}

            {/* Image Container */}
            <div className="relative group/container cursor-default" onClick={(e) => e.stopPropagation()}>
                <img 
                    src={activeLightbox} 
                    alt="Handbook Asset" 
                    className="max-w-[95vw] max-h-[85vh] object-contain shadow-[0_0_80px_rgba(0,0,0,0.5)] rounded-k5-md animate-in zoom-in-95 duration-500 ring-1 ring-white/10" 
                />
                
                {/* Subtle Digital Blue Glow behind image */}
                <div className="absolute -inset-4 bg-k5-digital/5 blur-[60px] -z-10 rounded-full opacity-50"></div>
            </div>
        </div>, document.body
    );
}