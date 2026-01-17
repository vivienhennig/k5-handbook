import React from 'react';

export default function DividerBlock() { 
    return (  
        <div className="relative w-full py-12 flex items-center justify-center group">
            {/* Die Hauptlinie: K5-Deep oder Light Grey */}
            <div className="h-px w-full bg-gray-100 dark:bg-k5-deep/50 relative">
                {/* Ein kleiner zentrierter Akzent für den Handbook-Look */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-1 bg-k5-digital/20 rounded-full group-hover:w-24 group-hover:bg-k5-digital transition-all duration-700"></div>
            </div>
            
            {/* Subtiler Glow-Effekt im Hintergrund */}
            <div className="absolute inset-0 bg-k5-digital/5 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
        </div>
    );
}