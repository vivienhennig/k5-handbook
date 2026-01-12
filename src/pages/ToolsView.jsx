import React from 'react';
import { MapPin, QrCode } from 'lucide-react';

export default function ToolsView({ handleNav }) {
    return (
        <div className="max-w-5xl mx-auto animate-in fade-in duration-500 pb-20">
            <div className="mb-10">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Tools & Helfer</h2>
                <p className="text-gray-500 dark:text-gray-400">
                    Interaktive Werkzeuge für Event-Planung und Operations.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                
                {/* 1. LOCATION SCOUT LAUNCHER */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white p-8 rounded-2xl shadow-xl flex flex-col justify-between h-[500px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-10 transform translate-x-10 -translate-y-10">
                        <MapPin size={200} />
                    </div>

                    <div className="relative z-10">
                        <div className="bg-white/10 w-fit p-3 rounded-xl mb-6 backdrop-blur-sm">
                            <MapPin size={32} className="text-blue-200"/>
                        </div>
                        <h3 className="font-black text-3xl mb-2">Location Scout</h3>
                        <p className="text-blue-100 text-lg leading-relaxed mb-8">
                            Dein <strong>AI Research Agent</strong>.
                            <br/>Findet Restaurants, Brand Stores und Ansprechpartner weltweit via Google & LinkedIn.
                        </p>
                    </div>

                    <div className="relative z-10">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-6 border border-white/10">
                            <div className="flex justify-between text-sm mb-2 text-blue-200">
                                <span>Such-Algorithmen</span>
                                <span>Dinner / Retail / HQs</span>
                            </div>
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full w-full bg-blue-400 rounded-full"></div>
                            </div>
                        </div>

                        <button 
                            onClick={() => handleNav('tool_location')} 
                            className="w-full bg-white text-blue-900 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg flex items-center justify-center gap-2 group-hover:scale-[1.02] duration-200"
                        >
                            Suche starten <span className="text-xl">→</span>
                        </button>
                    </div>
                </div>

                {/* 2. QR CODE GENERATOR LAUNCHER */}
                {/* (Dieser Teil bleibt gleich wie vorher) */}
                <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-8 rounded-2xl shadow-xl flex flex-col justify-between h-[500px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-10 transform translate-x-10 -translate-y-10">
                        <QrCode size={200} />
                    </div>

                    <div className="relative z-10">
                        <div className="bg-white/10 w-fit p-3 rounded-xl mb-6 backdrop-blur-sm">
                            <QrCode size={32} className="text-purple-300"/>
                        </div>
                        <h3 className="font-black text-3xl mb-2">QR Code Studio</h3>
                        <p className="text-purple-200 text-lg leading-relaxed mb-8">
                            Erstelle DSGVO-konforme QR Codes für WLAN, vCards oder Marketing-Links. 
                            <br/><br/>
                            <span className="text-sm bg-purple-800/50 px-2 py-1 rounded text-purple-100">
                                ⚡ Funktioniert auch Offline
                            </span>
                        </p>
                    </div>

                    <div className="relative z-10">
                         <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-6 border border-white/10">
                            <div className="flex justify-between text-sm mb-2 text-purple-200">
                                <span>High-Res Download</span>
                                <span>PNG / SVG</span>
                            </div>
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full w-3/4 bg-purple-400 rounded-full"></div>
                            </div>
                        </div>

                        <button 
                            onClick={() => handleNav('tool_qr')}
                            className="w-full bg-white text-purple-900 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transition-colors shadow-lg flex items-center justify-center gap-2 group-hover:scale-[1.02] duration-200"
                        >
                            Generator öffnen <span className="text-xl">→</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}