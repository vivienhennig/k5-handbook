import React from 'react';
import { QrCode, MapPin, Wrench } from 'lucide-react';
import ToolCard from '../components/Tools/ToolCard.jsx';

export default function ToolsView({ handleNav }) {
    
    // Die Datenstruktur muss exakt so sein, wie ToolCard sie erwartet
    const tools = [
        {
            name: 'QR-Code Generator',
            description: 'Erstelle K5-gebrandete QR-Codes für Flyer, Badges oder Wegeleitung.',
            url: 'qrcode', // Wird an handleNav übergeben (da kein http)
            icon: <QrCode size={28} />,
            color: 'bg-blue-50 text-blue-600',
            category: 'Operations'
        },
        {
            name: 'Location Guide',
            description: 'Finde Locations für unsere Events',
            url: 'location', // Wird an handleNav übergeben
            icon: <MapPin size={28} />,
            color: 'bg-purple-50 text-purple-600',
            category: 'Events'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-20 px-4 font-sans">
            
            {/* Header Bereich */}
            <div className="mb-16 border-b border-gray-100 dark:border-gray-800 pb-10">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-2 bg-blue-600 rounded-lg text-white">
                        <Wrench size={20} />
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase">
                        K5 <span className="text-blue-600">Toolbox</span>
                    </h2>
                </div>
                <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] italic ml-14">
                    Spezial-Applikationen für Event Operations
                </p>
            </div>

            {/* Grid mit ToolCards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                {tools.map((tool, index) => (
                    <ToolCard 
                        key={index} 
                        tool={tool} 
                        handleNav={handleNav} 
                    />
                ))}
            </div>

            {/* Info Footer */}
            <div className="mt-16 p-8 bg-gray-50 dark:bg-gray-800/50 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 text-center max-w-4xl">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">
                    Weitere Tools wie Slack, Asana & Co. findest du im Bereich <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => handleNav('resources')}>Ressourcen</span>.
                </p>
            </div>
        </div>
    );
}