import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { TUTORIAL_STEPS } from '../../config/data';

export default function TutorialOverlay({ onClose }) {
    const [stepIndex, setStepIndex] = useState(0);
    const [coords, setCoords] = useState(null);

    const step = TUTORIAL_STEPS[stepIndex];
    const isLast = stepIndex === TUTORIAL_STEPS.length - 1;

    useEffect(() => {
        // Position des Ziels berechnen
        const updatePosition = () => {
            const element = document.getElementById(step.targetId);
            if (element) {
                const rect = element.getBoundingClientRect();
                setCoords({
                    top: rect.top + rect.height + 15, // 15px unter dem Element
                    left: rect.left + (rect.width / 2) - 150, // Zentriert (Box ist 300px breit)
                    targetRect: rect // Für den "Spotlight" Effekt
                });
            } else {
                // Fallback: Mitte des Bildschirms, falls Element nicht gefunden
                setCoords({ top: window.innerHeight / 2 - 100, left: window.innerWidth / 2 - 150, targetRect: null });
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        return () => window.removeEventListener('resize', updatePosition);
    }, [stepIndex]);

    const handleNext = () => {
        if (isLast) onClose();
        else setStepIndex(prev => prev + 1);
    };

    if (!coords) return null;

    return (
        <div className="fixed inset-0 z-[100] animate-in fade-in duration-500">
            {/* Dark Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose}></div>

            {/* Spotlight Effect (Optional: Highlighting the target) */}
            {coords.targetRect && (
                <div 
                    className="absolute bg-white/10 border-2 border-white rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 ease-out"
                    style={{
                        top: coords.targetRect.top - 5,
                        left: coords.targetRect.left - 5,
                        width: coords.targetRect.width + 10,
                        height: coords.targetRect.height + 10
                    }}
                />
            )}

            {/* The Box */}
            <div 
                className="absolute w-[300px] bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-out"
                style={{ top: coords.top, left: coords.left }}
            >
                {/* Arrow pointing up */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45 border-t border-l border-gray-200 dark:border-gray-700"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Schritt {stepIndex + 1}/{TUTORIAL_STEPS.length}</span>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={16}/></button>
                    </div>
                    
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        {step.text}
                    </p>

                    <div className="flex justify-between items-center">
                        <button 
                            onClick={() => setStepIndex(prev => prev - 1)} 
                            disabled={stepIndex === 0}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-0 transition-colors"
                        >
                            <ChevronLeft size={20}/>
                        </button>
                        
                        <button 
                            onClick={handleNext}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition-all shadow-lg shadow-blue-500/30"
                        >
                            {isLast ? "Fertig" : "Weiter"} <ChevronRight size={16}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}