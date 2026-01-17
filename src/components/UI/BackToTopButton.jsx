import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';

export default function BackToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-10 right-10 p-4 bg-blue-600 text-white rounded-2xl shadow-2xl shadow-blue-500/40 hover:scale-110 hover:bg-blue-700 transition-all duration-300 z-[5000] animate-in slide-in-from-bottom-10"
        >
            <ChevronLeft size={24} className="rotate-90" />
        </button>
    );
}