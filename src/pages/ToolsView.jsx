import React, { useState } from 'react';
import QRCode from "react-qr-code";
import { Download, Link, Type, Wifi, Image as ImageIcon, FileCode } from 'lucide-react';

export default function ToolsView() {
    const [text, setText] = useState('https://k5.de');
    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');
    const [mode, setMode] = useState('link'); // 'link', 'text', 'wifi'

    // 1. Download als SVG (Vektor - gut für Druck)
    const handleDownloadSVG = () => {
        const svg = document.getElementById("QRCode");
        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.href = url;
        link.download = "k5-qr-code.svg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // 2. Download als PNG (Bild - gut für Powerpoint/Web)
    const handleDownloadPNG = () => {
        const svg = document.getElementById("QRCode");
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        
        // Canvas Größe setzen (wir nehmen das Doppelte für gute Qualität/Retina)
        const size = 500; 
        canvas.width = size;
        canvas.height = size;

        img.onload = () => {
            // Hintergrund weiß machen (wichtig für PNGs, sonst transparent)
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, size, size);
            // Bild zeichnen
            ctx.drawImage(img, 0, 0, size, size);
            
            // Download auslösen
            const pngUrl = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = "k5-qr-code.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        };

        // SVG Daten in ein Bild-Format umwandeln
        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    };

    // WLAN String Generator
    const getWifiString = () => `WIFI:S:${ssid};T:WPA;P:${password};;`;
    const activeValue = mode === 'wifi' ? getWifiString() : text;

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-20">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">QR-Code Generator</h2>
                <p className="text-gray-500 dark:text-gray-400">Erstelle Codes für WLAN, Webseiten oder Texte.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                
                {/* EINGABE BEREICH */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex gap-2 mb-6">
                        <button onClick={() => setMode('link')} className={`flex-1 py-2 text-sm font-bold rounded-lg border flex items-center justify-center gap-2 ${mode === 'link' ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800' : 'border-gray-200 dark:border-gray-700 text-gray-500'}`}>
                            <Link size={16}/> Link
                        </button>
                        <button onClick={() => setMode('wifi')} className={`flex-1 py-2 text-sm font-bold rounded-lg border flex items-center justify-center gap-2 ${mode === 'wifi' ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800' : 'border-gray-200 dark:border-gray-700 text-gray-500'}`}>
                            <Wifi size={16}/> WLAN
                        </button>
                        <button onClick={() => setMode('text')} className={`flex-1 py-2 text-sm font-bold rounded-lg border flex items-center justify-center gap-2 ${mode === 'text' ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800' : 'border-gray-200 dark:border-gray-700 text-gray-500'}`}>
                            <Type size={16}/> Text
                        </button>
                    </div>

                    {mode === 'wifi' ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Netzwerkname (SSID)</label>
                                <input type="text" value={ssid} onChange={(e) => setSsid(e.target.value)} placeholder="K5-Guest" className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Passwort</label>
                                <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Geheim123" className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"/>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{mode === 'link' ? 'Webseiten URL' : 'Dein Text'}</label>
                            <textarea rows={mode === 'link' ? 2 : 4} value={text} onChange={(e) => setText(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="Hier tippen..."></textarea>
                        </div>
                    )}
                </div>

                {/* VORSCHAU BEREICH */}
                <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="bg-white p-4 rounded-xl shadow-lg mb-6 border border-gray-100">
                        <QRCode
                            id="QRCode"
                            value={activeValue || "https://k5.de"}
                            size={200}
                            bgColor={"#ffffff"}
                            fgColor={"#000000"}
                            level={"L"}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 w-full">
                        <button onClick={handleDownloadPNG} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-blue-500/30">
                            <ImageIcon size={18}/> PNG
                        </button>
                        <button onClick={handleDownloadSVG} className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 px-4 py-2.5 rounded-lg font-bold transition-all">
                            <FileCode size={18}/> SVG
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-4 text-center">
                        PNG für Präsentationen, SVG für Druck.
                    </p>
                </div>
            </div>
        </div>
    );
}