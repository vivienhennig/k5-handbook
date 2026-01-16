import React from 'react';
import { 
    AlignLeft, ImageIcon, TableIcon, CheckSquare, 
    PlayCircle, FileText, Minus, AlertCircle, AlertTriangle, 
    Heading, Maximize2, MinusCircle, Check, ExternalLink, Palette, Plus, Trash2, XCircle, CheckIcon
} from 'lucide-react';

// --- HEADLINE BLOCK ---
// Ersetze den HeadlineBlock in deiner WikiBlocks/index.jsx durch diesen:
export const HeadlineBlock = ({ content, isEditing, onChange }) => {
    const level = content.level || 2; // Default H2

    // Dynamische Größenklassen basierend auf dem Level
    const sizeClasses = {
        2: "text-3xl font-black italic uppercase tracking-tight",
        3: "text-2xl font-black italic tracking-tight",
        4: "text-xl font-bold italic",
        5: "text-lg font-bold",
        6: "text-base font-bold uppercase tracking-widest text-gray-500"
    };

    if (isEditing) {
        return (
            <div className="w-full space-y-2">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded">H{level}</span>
                    <input 
                        className={`${sizeClasses[level]} bg-transparent border-b border-blue-500/30 w-full outline-none dark:text-white`} 
                        value={content.text} 
                        onChange={e => onChange({ ...content, text: e.target.value })} 
                        placeholder={`Überschrift H${level}...`}
                    />
                </div>
            </div>
        );
    }

    // Das entsprechende HTML-Tag dynamisch wählen
    const Tag = `h${level}`;
    return (
        <Tag className={`${sizeClasses[level]} text-gray-900 dark:text-white border-l-4 border-blue-600 pl-4`}>
            {content.text}
        </Tag>
    );
};

// --- TEXT BLOCK ---
export const TextBlock = ({ content, isEditing, onChange, renderLinkedText }) => (
    isEditing ? (
        <textarea 
            className="w-full bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl outline-none min-h-[120px] dark:text-white font-sans text-sm" 
            value={content} 
            onChange={e => onChange(e.target.value)} 
            placeholder="Schreibe etwas... (Nutze @ für Verlinkungen)"
        />
    ) : (
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
            {renderLinkedText(content)}
        </p>
    )
);

// --- IMAGE BLOCK ---
export const ImageBlock = ({ content, isEditing, onChange, onLightbox }) => (
    <div className="space-y-4">
        {isEditing && (
            <div className="flex gap-2 mb-4 bg-gray-50 dark:bg-gray-900 p-2 rounded-2xl">
                <button onClick={() => onChange({...content, layout: 'single'})} className={`flex-1 py-2 rounded-xl text-[10px] font-black ${content.layout === 'single' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>SINGLE</button>
                <button onClick={() => onChange({...content, layout: 'grid'})} className={`flex-1 py-2 rounded-xl text-[10px] font-black ${content.layout === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>GRID</button>
                <button onClick={() => onChange({...content, urls: [...content.urls, ""]})} className="px-4 py-2 bg-blue-100 text-blue-600 rounded-xl text-[10px] font-black">+</button>
            </div>
        )}
        <div className={`grid gap-4 ${content.layout === 'grid' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {content.urls?.map((url, i) => (
                <div key={i} className="relative group/img">
                    <div className="rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm cursor-zoom-in" 
                         onClick={() => !isEditing && url && onLightbox(url)}>
                        {url ? <img src={url} alt="" className="w-full h-full object-cover min-h-[150px] max-h-[500px] transition-transform duration-500 group-hover/img:scale-105" /> 
                             : <div className="p-10 text-center text-gray-300 italic text-xs">Kein Bild geladen</div>}
                        {!isEditing && url && (
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                                <Maximize2 className="text-white" size={24}/>
                            </div>
                        )}
                    </div>
                    {isEditing && (
                        <div className="mt-2 flex gap-2 animate-in slide-in-from-top-1">
                            <input className="flex-1 text-[10px] p-2 bg-gray-50 dark:bg-gray-900 rounded-lg outline-none dark:text-white" 
                                placeholder="Bild URL..." value={url} onChange={e => {
                                    const n = [...content.urls]; n[i] = e.target.value; onChange({...content, urls: n});
                            }} />
                            <button onClick={() => {
                                const n = content.urls.filter((_, idx) => idx !== i);
                                onChange({...content, urls: n});
                            }} className="text-red-400 p-1 hover:bg-red-50 rounded"><MinusCircle size={16}/></button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
);

// --- TABLE BLOCK ---


export const TableBlock = ({ content, isEditing, onChange }) => {
    // Hilfsfunktionen für die Struktur-Änderung
    const addRow = () => {
        const newRow = new Array(content[0].length).fill("");
        onChange([...content, newRow]);
    };

    const deleteRow = (rowIndex) => {
        if (content.length <= 2) return; // Verhindert das Löschen der letzten Datenzeile
        const newTable = content.filter((_, i) => i !== rowIndex);
        onChange(newTable);
    };

    const addColumn = () => {
        const newTable = content.map(row => [...row, ""]);
        onChange(newTable);
    };

    const deleteColumn = (colIndex) => {
        if (content[0].length <= 1) return; // Mindestens eine Spalte muss bleiben
        const newTable = content.map(row => row.filter((_, j) => j !== colIndex));
        onChange(newTable);
    };

    const updateCell = (rowIndex, colIndex, value) => {
        const newTable = [...content];
        newTable[rowIndex][colIndex] = value;
        onChange(newTable);
    };

    return (
        <div className="w-full space-y-4 animate-in fade-in duration-500">
            <div className="overflow-x-auto rounded-[2rem] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-sm">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                            {content[0].map((cell, j) => (
                                <th key={j} className="p-4 border-b dark:border-gray-800 group/col relative">
                                    <div className="flex flex-col gap-1">
                                        {isEditing ? (
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    className="bg-transparent w-full outline-none font-black uppercase text-[10px] text-blue-600 italic focus:text-blue-400" 
                                                    value={cell} 
                                                    onChange={e => updateCell(0, j, e.target.value)}
                                                />
                                                <button 
                                                    onClick={() => deleteColumn(j)}
                                                    className="opacity-0 group-hover/col:opacity-100 text-red-400 hover:text-red-600 transition-all transform hover:scale-110"
                                                    title="Spalte löschen"
                                                >
                                                    <XCircle size={14}/>
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="font-black uppercase text-[10px] text-gray-400 italic tracking-wider">{cell}</span>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {isEditing && <th className="w-10 border-b dark:border-gray-800"></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {content.slice(1).map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50/30 dark:hover:bg-gray-800/20 group/row transition-colors">
                                {row.map((cell, j) => (
                                    <td key={j} className="p-4 border-b border-gray-50 dark:border-gray-800 transition-all">
                                        {isEditing ? (
                                            <input 
                                                className="bg-transparent w-full outline-none text-gray-600 dark:text-gray-300 focus:bg-blue-50/30 rounded px-1" 
                                                value={cell} 
                                                onChange={e => updateCell(i + 1, j, e.target.value)}
                                            />
                                        ) : cell}
                                    </td>
                                ))}
                                {isEditing && (
                                    <td className="p-4 border-b border-gray-50 dark:border-gray-800 text-right">
                                        <button 
                                            onClick={() => deleteRow(i + 1)}
                                            className="opacity-0 group-hover/row:opacity-100 text-red-300 hover:text-red-500 transition-all transform hover:scale-110"
                                            title="Zeile löschen"
                                        >
                                            <Trash2 size={14}/>
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Controls zum Hinzufügen (Nur im Edit-Modus) */}
            {isEditing && (
                <div className="flex gap-3 justify-start animate-in slide-in-from-top-2">
                    <button 
                        onClick={addRow}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl text-[10px] font-black uppercase hover:bg-blue-100 transition-all active:scale-95 border border-blue-100 dark:border-blue-800"
                    >
                        <Plus size={12}/> Zeile hinzufügen
                    </button>
                    <button 
                        onClick={addColumn}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-400 rounded-xl text-[10px] font-black uppercase hover:bg-gray-100 transition-all active:scale-95 border border-gray-100 dark:border-gray-700"
                    >
                        <Plus size={12}/> Spalte hinzufügen
                    </button>
                </div>
            )}
        </div>
    );
};

// --- CHECKLIST BLOCK ---
export const ChecklistBlock = ({ content, isEditing, onChange }) => {
    // Falls content kein Array ist (z.B. null oder leerer String), 
    // wandeln wir ihn hier sicherheitshalber in ein leeres Array um.
    const safeContent = Array.isArray(content) ? content : [];

    return (
        <div className="space-y-3">
            {safeContent.map((item, i) => (
                <div key={item.id || i} className="flex items-start gap-4 bg-gray-50/50 dark:bg-gray-900/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 group/item transition-all">
                    <button 
                        type="button"
                        onClick={() => !isEditing && onChange(safeContent.map((it, idx) => idx === i ? {...it, checked: !it.checked} : it))} 
                        className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border-2 transition-all ${item.checked ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' : 'border-gray-300 hover:border-blue-400'}`}
                    >
                        {item.checked && <CheckIcon size={14} strokeWidth={4}/>}
                    </button>
                    <div className="flex-1">
                        {isEditing ? (
                            <input 
                                className="w-full bg-transparent border-none text-sm font-bold outline-none dark:text-white" 
                                value={item.text || ''} 
                                onChange={e => {
                                    const n = [...safeContent]; 
                                    n[i] = { ...n[i], text: e.target.value }; 
                                    onChange(n);
                                }}
                                placeholder="Listenpunkt bearbeiten..."
                            />
                        ) : (
                            <span className={`text-sm font-bold ${item.checked ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`}>
                                {item.text}
                            </span>
                        )}
                    </div>
                    {isEditing && (
                        <button 
                            type="button"
                            onClick={() => onChange(safeContent.filter((_, idx) => idx !== i))} 
                            className="text-red-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity"
                        >
                            <MinusCircle size={16}/>
                        </button>
                    )}
                </div>
            ))}
            
            {isEditing && (
                <button 
                    type="button"
                    onClick={() => onChange([...safeContent, {id: Date.now(), text: "", checked: false}])} 
                    className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-2"
                >
                    <Plus size={12} /> Punkt hinzufügen
                </button>
            )}
        </div>
    );
};

// --- VIDEO BLOCK ---
export const VideoBlock = ({ content, isEditing, onChange }) => (
    <div className="w-full h-full min-h-[200px] flex flex-col">
        <div className="aspect-video rounded-[2.5rem] overflow-hidden bg-gray-900 shadow-2xl relative group/vid flex-1">
            {isEditing ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gray-800/90 backdrop-blur-sm">
                    <PlayCircle size={40} className="text-blue-500 mb-2" />
                    <input 
                        className="w-full max-w-xs bg-gray-700 text-white p-3 rounded-xl text-[10px] outline-none" 
                        placeholder="YouTube URL..." value={content.url} 
                        onChange={e => onChange({url: e.target.value})} 
                    />
                </div>
            ) : (
                content.url ? (
                    <iframe 
                        className="w-full h-full" 
                        src={content.url.includes('youtube.com') ? content.url.replace('watch?v=', 'embed/') : content.url} 
                        title="Wiki Video" 
                        frameBorder="0" 
                        allowFullScreen
                    ></iframe>
                ) : <div className="flex items-center justify-center h-full text-gray-400 italic text-xs">Kein Video hinterlegt</div>
            )}
        </div>
    </div>
);

// --- ALERT BLOCK ---
export const AlertBlock = ({ content, isEditing, onChange }) => (
    <div className={`p-6 rounded-3xl flex gap-4 border-2 transition-all ${content.type === 'warning' ? 'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/30 shadow-sm shadow-red-500/5' : 'bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/30 shadow-sm shadow-blue-500/5'}`}>
        {content.type === 'warning' ? <AlertTriangle className="shrink-0" /> : <AlertCircle className="shrink-0" />}
        <div className="flex-1">
            {isEditing ? (
                <div className="space-y-2">
                    <select className="bg-white dark:bg-gray-800 text-[10px] font-black p-1 rounded outline-none border border-current" 
                        value={content.type} onChange={e => onChange({...content, type: e.target.value})}>
                        <option value="info">INFO</option>
                        <option value="warning">WARNUNG</option>
                    </select>
                    <input className="w-full bg-transparent border-b border-current outline-none font-bold italic" 
                        value={content.text} onChange={e => onChange({...content, text: e.target.value})} 
                        placeholder="Hinweistext schreiben..."/>
                </div>
            ) : <p className="font-bold italic leading-relaxed">{content.text}</p>}
        </div>
    </div>
);

// --- FILE BLOCK ---
export const FileBlock = ({ content, isEditing, onChange }) => (
    <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl group/file hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all border border-transparent hover:border-blue-100">
        <div className="flex items-center gap-5">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-blue-600 transition-transform group-hover/file:scale-110">
                <FileText size={24}/>
            </div>
            <div className="space-y-1">
                {isEditing ? (
                    <>
                        <input className="bg-transparent border-b border-blue-200 text-sm font-black block w-full outline-none dark:text-white" 
                            placeholder="Anzeigename..." value={content.name} 
                            onChange={e => onChange({...content, name: e.target.value})} />
                        <input className="bg-transparent border-b border-blue-100 text-[10px] block w-64 outline-none italic dark:text-gray-400" 
                            placeholder="URL zum Dokument..." value={content.url} 
                            onChange={e => onChange({...content, url: e.target.value})} />
                    </>
                ) : (
                    <>
                        <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight italic">
                            {content.name || "Unbenanntes Dokument"}
                        </p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">K5 Resource Node</p>
                    </>
                )}
            </div>
        </div>
        {!isEditing && content.url && (
            <a href={content.url} target="_blank" rel="noreferrer" 
               className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg opacity-0 group-hover/file:opacity-100 transition-all transform translate-x-4 group-hover/file:translate-x-0">
                <ExternalLink size={20}/>
            </a>
        )}
    </div>
);

// --- COLOR BLOCK (Ultra-Responsive für schmale Spalten) ---
export const ColorBlock = ({ content, isEditing, onChange }) => {
    const copyToClipboard = (hex) => {
        if (!hex) return;
        navigator.clipboard.writeText(hex);
    };

    return (
        <div className="flex flex-col h-full w-full bg-gray-50/50 dark:bg-gray-900/30 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden transition-all hover:shadow-md">
            
            {/* Farb-Fläche: Nimmt oben den Platz ein */}
            <div 
                className="w-full h-24 sm:h-32 shadow-inner transition-transform cursor-pointer flex items-center justify-center group/color relative"
                style={{ backgroundColor: content.hex || '#cbd5e1' }}
                onClick={() => !isEditing && copyToClipboard(content.hex)}
            >
                {!isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover/color:opacity-100 transition-opacity">
                        <Copy size={20} className="text-white drop-shadow-md" />
                    </div>
                )}
            </div>

            {/* Content-Bereich: Unter der Farbe */}
            <div className="p-4 flex-1 flex flex-col justify-center">
                {isEditing ? (
                    <div className="space-y-2">
                        <input 
                            className="bg-transparent border-b border-blue-200 text-[11px] font-black uppercase tracking-tight outline-none w-full text-center dark:text-white"
                            placeholder="NAME"
                            value={content.label}
                            onChange={e => onChange({...content, label: e.target.value})}
                        />
                        <input 
                            className="bg-white dark:bg-gray-800 px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-700 text-[10px] font-mono outline-none focus:ring-1 focus:ring-blue-500 w-full text-center"
                            value={content.hex}
                            onChange={e => onChange({...content, hex: e.target.value})}
                            placeholder="#HEX"
                        />
                    </div>
                ) : (
                    <div className="text-center space-y-1">
                        <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-tighter text-[11px] leading-tight break-words px-1">
                            {content.label || "FARBE"}
                        </h4>
                        <div className="flex items-center justify-center gap-1.5">
                            <span className="text-[9px] font-mono text-gray-500 bg-white/50 dark:bg-gray-800/50 px-1.5 py-0.5 rounded border border-gray-100 dark:border-gray-700 uppercase tracking-widest shadow-sm">
                                {content.hex || "#------"}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- DIVIDER BLOCK ---
export const DividerBlock = () => (
    <div className="h-px bg-gray-100 dark:bg-gray-800 my-4 shadow-sm w-full"></div>
);