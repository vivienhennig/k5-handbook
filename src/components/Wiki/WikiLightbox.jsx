import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

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

    return createPortal(
        <div className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out" onClick={onClose}>
            <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-all z-50">
                <X size={40} />
            </button>

            {galleryImages.length > 1 && (
                <>
                    <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-8 p-4 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all border border-white/10 z-50 group">
                        <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-8 p-4 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all border border-white/10 z-50 group">
                        <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/10 rounded-full text-white/60 text-[10px] font-black uppercase tracking-[0.3em] italic border border-white/5">
                        {galleryImages.indexOf(activeLightbox) + 1} / {galleryImages.length}
                    </div>
                </>
            )}

            <img 
                src={activeLightbox} 
                alt="Full" 
                className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-lg animate-in zoom-in-95 cursor-default" 
                onClick={(e) => e.stopPropagation()}
            />
        </div>, document.body
    );
}