import React from 'react';
import { QrCode, MapPin, Wrench, Sparkles } from 'lucide-react';
import ToolCard from '../components/Tools/ToolCard.jsx';

export default function ToolsView({ handleNav }) {
    
    // Konfiguration angepasst auf K5 CI-Palette (Digital Blue & Sand)
    const tools = [
        {
            name: 'QR-Code Studio',
            description: 'Erstelle K5-gebrandete QR-Codes für Flyer, Badges oder Wegeleitung.',
            url: 'qrcode',
            icon: <QrCode size={28} />,
            color: 'bg-k5-digital/10 text-k5-digital',
            category: 'Operations'
        },
        {
            name: 'Location Scout',
            description: 'KI-gestützte Research-Engine für Event-Locations und Partner-Stores.',
            url: 'location',
            icon: <MapPin size={28} />,
            color: 'bg-k5-sand/20 text-k5-sand',
            category: 'Events'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-32 px-4 font-sans">
            
            {/* Header Bereich: Italic entfernt, Aeonik Black genutzt */}
            <div className="mb-20 border-b border-gray-100 dark:border-k5-deep pb-12">
                <div className="flex items-center gap-6 mb-4">
                    <div className="p-3 bg-k5-digital rounded-k5-sm text-white shadow-lg shadow-k5-digital/20">
                        <Wrench size={24} />
                    </div>
                    <h2 className="text-5xl lg:text-6xl font-black text-k5-black dark:text-white tracking-tighter uppercase leading-none">
                        K5 <span className="text-k5-digital">Toolbox</span>
                    </h2>
                </div>
                <div className="flex items-center gap-3 ml-1">
                    <Sparkles size={14} className="text-k5-digital" />
                    <p className="text-k5-sand font-bold uppercase text-[11px] tracking-[0.4em]">
                        Spezial-Applikationen für Event Operations
                    </p>
                </div>
            </div>

            {/* Grid mit ToolCards: Breiteres Grid für bessere Scannbarkeit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl">
                {tools.map((tool, index) => (
                    <ToolCard 
                        key={index} 
                        tool={tool} 
                        handleNav={handleNav} 
                    />
                ))}
            </div>

            {/* Info Footer: Aeonik Bold, k5-lg Rundung */}
            <div className="mt-20 p-10 bg-k5-light-grey/50 dark:bg-k5-deep/20 rounded-k5-lg border border-gray-100 dark:border-k5-deep/50 text-center max-w-5xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] leading-relaxed">
                    Weitere Tools wie Slack, Asana & Co. findest du im Bereich{' '}
                    <span 
                        className="text-k5-digital cursor-pointer hover:text-k5-black dark:hover:text-white transition-colors border-b border-k5-digital/30 hover:border-k5-digital" 
                        onClick={() => handleNav('resources')}
                    >
                        Ressourcen
                    </span>.
                </p>
            </div>
        </div>
    );
}