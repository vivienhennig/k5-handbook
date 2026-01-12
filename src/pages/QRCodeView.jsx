import React, { useState, useRef } from 'react';
import QRCode from "react-qr-code"; // Das npm package
import { ArrowLeft, Download, Link, Type } from 'lucide-react';
import { InfoBox } from '../components/UI';

export default function QRCodeView({ handleNav }) {
    const [text, setText] = useState('https://k5.de');
    const [size, setSize] = useState(256);
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    
    // Wir brauchen eine Referenz auf das SVG Element für den Download
    const qrRef = useRef();

    const downloadQR = () => {
        // 1. Das SVG Element finden
        const svg = document.getElementById("QRCode");
        if (!svg) return;

        // 2. XML Daten serialisieren
        const svgData = new XMLSerializer().serializeToString(svg);
        
        // 3. Ein Canvas erstellen, um das SVG in ein Bild zu malen
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        
        // SVG Daten in base64 umwandeln
        img.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));

        img.onload = () => {
            // Canvas Größe setzen (plus etwas weißer Rand/Padding für bessere Scanbarkeit)
            const padding = 20; 
            canvas.width = parseInt(size) + (padding * 2);
            canvas.height = parseInt(size) + (padding * 2);

            // Weißen Hintergrund füllen (wichtig für PNG Transparenz)
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Bild zeichnen
            ctx.drawImage(img, padding, padding);

            // Als PNG herunterladen
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = "k5-qr-code.png";
            downloadLink.href = `${pngFile}`;
            downloadLink.click();
        };
    };

    return (
        <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header mit Zurück-Button */}
            <div className="flex items-center gap-4 mb-8">
                <button 
                    onClick={() => handleNav('tools')}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500"
                >
                    <ArrowLeft size={24}/>
                </button>
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white">QR Code Studio</h2>
                    <p className="text-gray-500 dark:text-gray-400">Offline Generator powered by React.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                
                {/* Linke Spalte: Einstellungen */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                            <Link size={16}/> Inhalt (URL/Text)
                        </label>
                        <input 
                            type="text" 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="https://..."
                        />
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                            <Type size={16}/> Design
                        </label>
                        
                        <div className="mb-4">
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Farbe</label>
                            <div className="flex gap-3">
                                <button onClick={() => setFgColor('#000000')} className={`w-8 h-8 rounded-full bg-black border-2 ${fgColor === '#000000' ? 'border-blue-500' : 'border-transparent'}`}></button>
                                <button onClick={() => setFgColor('#2563EB')} className={`w-8 h-8 rounded-full bg-blue-600 border-2 ${fgColor === '#2563EB' ? 'border-blue-500' : 'border-transparent'}`}></button>
                                <button onClick={() => setFgColor('#EC4899')} className={`w-8 h-8 rounded-full bg-pink-500 border-2 ${fgColor === '#EC4899' ? 'border-blue-500' : 'border-transparent'}`}></button>
                                <button onClick={() => setFgColor('#10B981')} className={`w-8 h-8 rounded-full bg-emerald-500 border-2 ${fgColor === '#10B981' ? 'border-blue-500' : 'border-transparent'}`}></button>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Größe (Vorschau)</label>
                            <input 
                                type="range" 
                                min="128" 
                                max="512" 
                                step="32" 
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                                className="w-full accent-blue-600"
                            />
                            <div className="text-right text-xs text-gray-500 mt-1">{size} px</div>
                        </div>
                    </div>

                    <InfoBox type="info" title="Offline Ready">
                        Dieser Generator funktioniert auch ohne Internetverbindung, da der Code direkt in deinem Browser berechnet wird.
                    </InfoBox>
                </div>

                {/* Rechte Spalte: Vorschau */}
                <div className="bg-gray-100 dark:bg-gray-900 p-8 rounded-2xl flex flex-col items-center justify-center text-center border border-gray-200 dark:border-gray-700 min-h-[400px]">
                    <div className="bg-white p-4 rounded-xl shadow-lg mb-6">
                        {/* HIER IST DIE REACT-QR-CODE KOMPONENTE */}
                        <div style={{ height: "auto", margin: "0 auto", maxWidth: size, width: "100%" }}>
                            <QRCode
                                id="QRCode" // Wichtig für den Download Selector
                                size={256}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                value={text}
                                viewBox={`0 0 256 256`}
                                fgColor={fgColor}
                                bgColor={bgColor}
                                level="H" // Hohes Error Correction Level für bessere Lesbarkeit
                            />
                        </div>
                    </div>
                    
                    <button 
                        onClick={downloadQR}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30"
                    >
                        <Download size={18}/> PNG Herunterladen
                    </button>
                    <p className="text-xs text-gray-400 mt-4">Generiert mit react-qr-code</p>
                </div>
            </div>
        </div>
    );
}