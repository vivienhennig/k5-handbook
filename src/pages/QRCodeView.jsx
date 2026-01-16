import React, { useState, useRef } from 'react';
import QRCode from "react-qr-code";
import { ArrowLeft, Download, Link, Palette, Sparkles, RefreshCcw } from 'lucide-react';

export default function QRCodeView({ handleNav }) {
    const [text, setText] = useState('https://k5.de');
    const [size, setSize] = useState(256);
    const [fgColor, setFgColor] = useState('#000000');
    
    const downloadQR = () => {
        const svg = document.getElementById("QRCode");
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        
        img.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));

        img.onload = () => {
            const padding = 40; // Mehr Padding für modernen Look
            canvas.width = 1024; // Wir exportieren immer High-Res
            canvas.height = 1024;

            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // QR Code zentriert zeichnen
            ctx.drawImage(img, padding, padding, canvas.width - (padding * 2), canvas.height - (padding * 2));

            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `K5_QR_${text.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
            downloadLink.href = `${pngFile}`;
            downloadLink.click();
        };
    };

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-20 px-4 font-sans">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-100 dark:border-gray-800 pb-10">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => handleNav('tools')}
                        className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all active:scale-90"
                    >
                        <ArrowLeft size={20}/>
                    </button>
                    <div>
                        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase">
                            QR <span className="text-blue-600">Studio</span>
                        </h2>
                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] italic mt-1 flex items-center gap-2">
                            <Sparkles size={12} className="text-blue-500"/> Offline Branding Engine
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
                
                {/* Configuration Panel */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
                        <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-4 block ml-2 flex items-center gap-2">
                            <Link size={14}/> Ziel-Destination
                        </label>
                        <input 
                            type="text" 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full px-6 py-5 bg-gray-50 dark:bg-gray-900 border-none rounded-[1.8rem] text-lg font-black italic focus:ring-4 focus:ring-blue-500/5 outline-none dark:text-white transition-all"
                            placeholder="https://k5.de/..."
                        />
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
                        <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-6 block ml-2 flex items-center gap-2">
                            <Palette size={14}/> Brand Identity
                        </label>
                        
                        <div className="grid grid-cols-4 gap-4 mb-8">
                            {[
                                { name: 'Pitch Black', hex: '#000000' },
                                { name: 'K5 Blue', hex: '#2563EB' },
                                { name: 'K5 Pink', hex: '#EC4899' },
                                { name: 'K5 Green', hex: '#10B981' }
                            ].map((color) => (
                                <button 
                                    key={color.hex}
                                    onClick={() => setFgColor(color.hex)}
                                    className={`h-16 rounded-2xl border-4 transition-all flex items-center justify-center ${fgColor === color.hex ? 'border-blue-500 scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    style={{ backgroundColor: color.hex }}
                                    title={color.name}
                                >
                                    {fgColor === color.hex && <div className="w-2 h-2 bg-white rounded-full animate-ping" />}
                                </button>
                            ))}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4 px-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest italic">Anzeige-Größe</label>
                                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{size}px</span>
                            </div>
                            <input 
                                type="range" 
                                min="128" 
                                max="512" 
                                step="32" 
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                                className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Preview & Export */}
                <div className="sticky top-8 space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-900 p-12 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-center">
                        <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-black/5 animate-in zoom-in-95 duration-500">
                            <div style={{ height: "auto", margin: "0 auto", maxWidth: size, width: "100%" }}>
                                <QRCode
                                    id="QRCode"
                                    size={1024} // Intern immer High-Res
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    value={text}
                                    viewBox={`0 0 1024 1024`}
                                    fgColor={fgColor}
                                    bgColor="#ffffff"
                                    level="H"
                                />
                            </div>
                        </div>
                        
                        <div className="mt-10 space-y-4 w-full max-w-xs">
                            <button 
                                onClick={downloadQR}
                                className="w-full bg-blue-600 text-white py-5 rounded-[1.8rem] font-black uppercase italic tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:scale-105 transition-all flex items-center justify-center gap-3"
                            >
                                <Download size={20}/> Export PNG
                            </button>
                            <button 
                                onClick={() => setText('https://k5.de')}
                                className="w-full py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic flex items-center justify-center gap-2 hover:text-gray-600 transition-colors"
                            >
                                <RefreshCcw size={12}/> Reset Generator
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}