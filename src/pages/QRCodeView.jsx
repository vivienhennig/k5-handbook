import React, { useState } from 'react';
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
            const padding = 60; 
            canvas.width = 1024; 
            canvas.height = 1024;

            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-100 dark:border-k5-deep pb-10">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => handleNav('tools')}
                        className="w-12 h-12 rounded-k5-md bg-white dark:bg-k5-black shadow-sm border border-gray-100 dark:border-k5-deep flex items-center justify-center text-gray-400 hover:text-k5-digital transition-all active:scale-90"
                    >
                        <ArrowLeft size={20}/>
                    </button>
                    <div>
                        <h2 className="text-4xl lg:text-5xl font-black text-k5-black dark:text-white tracking-tighter uppercase leading-none">
                            QR <span className="text-k5-digital">Studio</span>
                        </h2>
                        <p className="text-k5-sand font-bold uppercase text-[10px] tracking-[0.3em] mt-2 flex items-center gap-2">
                            <Sparkles size={12} className="text-k5-digital"/> Offline Branding Engine
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
                
                {/* Configuration Panel */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-k5-black p-8 rounded-k5-lg border border-gray-100 dark:border-k5-deep shadow-sm">
                        <label className="text-[10px] font-bold uppercase text-k5-digital tracking-[0.2em] mb-4 block ml-2 flex items-center gap-2">
                            <Link size={14}/> Ziel-Destination
                        </label>
                        <input 
                            type="text" 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full px-6 py-5 bg-k5-light-grey dark:bg-k5-deep/20 border-none rounded-k5-md text-lg font-bold focus:ring-4 focus:ring-k5-digital/5 outline-none dark:text-white transition-all placeholder:font-normal"
                            placeholder="https://k5.de/..."
                        />
                    </div>

                    <div className="bg-white dark:bg-k5-black p-8 rounded-k5-lg border border-gray-100 dark:border-k5-deep shadow-sm">
                        <label className="text-[10px] font-bold uppercase text-k5-digital tracking-[0.2em] mb-6 block ml-2 flex items-center gap-2">
                            <Palette size={14}/> Brand Identity
                        </label>
                        
                        <div className="grid grid-cols-4 gap-4 mb-8">
                            {[
                                { name: 'Pitch Black', hex: '#000000' },
                                { name: 'Digital Blue', hex: '#2563EB' },
                                { name: 'K5 Sand', hex: '#C5A267' },
                                { name: 'K5 Lime', hex: '#A3E635' }
                            ].map((color) => (
                                <button 
                                    key={color.hex}
                                    onClick={() => setFgColor(color.hex)}
                                    className={`h-16 rounded-k5-sm border-4 transition-all flex items-center justify-center ${fgColor === color.hex ? 'border-k5-digital scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    style={{ backgroundColor: color.hex }}
                                    title={color.name}
                                >
                                    {fgColor === color.hex && <div className="w-2 h-2 bg-white rounded-full animate-ping" />}
                                </button>
                            ))}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4 px-2">
                                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Anzeige-Größe</label>
                                <span className="text-[10px] font-bold text-white bg-k5-digital px-3 py-1 rounded-full">{size}px</span>
                            </div>
                            <input 
                                type="range" 
                                min="128" 
                                max="512" 
                                step="32" 
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                                className="w-full h-2 bg-k5-light-grey dark:bg-k5-deep rounded-full appearance-none cursor-pointer accent-k5-digital"
                            />
                        </div>
                    </div>
                </div>

                {/* Preview & Export */}
                <div className="sticky top-8 space-y-6">
                    <div className="bg-k5-light-grey dark:bg-k5-deep/20 p-12 rounded-k5-lg border-2 border-dashed border-gray-100 dark:border-k5-deep flex flex-col items-center justify-center text-center">
                        <div className="bg-white p-10 rounded-k5-md shadow-2xl shadow-black/5 animate-in zoom-in-95 duration-500">
                            <div style={{ height: "auto", margin: "0 auto", maxWidth: size, width: "100%" }}>
                                <QRCode
                                    id="QRCode"
                                    size={1024}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    value={text}
                                    viewBox={`0 0 1024 1024`}
                                    fgColor={fgColor}
                                    bgColor="#ffffff"
                                    level="H"
                                />
                            </div>
                        </div>
                        
                        <div className="mt-12 space-y-4 w-full max-w-sm">
                            <button 
                                onClick={downloadQR}
                                className="w-full bg-glow-digital text-white py-6 rounded-k5-md font-bold uppercase tracking-widest text-[11px] shadow-xl shadow-k5-digital/25 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                <Download size={20}/> Export PNG (High Res)
                            </button>
                            <button 
                                onClick={() => {
                                    setText('https://k5.de');
                                    setFgColor('#000000');
                                }}
                                className="w-full py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:text-k5-digital transition-colors"
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