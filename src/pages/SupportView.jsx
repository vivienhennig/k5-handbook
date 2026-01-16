import React, { useState, useEffect } from 'react';
import { 
    LifeBuoy, Edit3, Save, X, Shield, Plus, Trash2, 
    AlignLeft, Table as TableIcon, Image as ImageIcon,
    ChevronUp, ChevronDown, AlertTriangle, CheckSquare, 
    ExternalLink, ListChecks, Info, MousePointer2, Check,
    PlayCircle, FileBox, Clock, FileText, Maximize2, Minimize2,
    MinusCircle, XCircle
} from 'lucide-react';
import { contentApi } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function SupportView({ currentUser }) {
    const { addToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState({
        introText: "Zentrale Wissensdatenbank für alle Support-Prozesse.",
        blocks: [],
        lastEditor: "",
        lastUpdated: null
    });

    const isPrivileged = currentUser?.role === 'admin' || currentUser?.role === 'editor' || currentUser?.role === 'privileged';

    useEffect(() => {
        const loadContent = async () => {
            const data = await contentApi.getGuideline('support_wiki_grid_final');
            if (data) setContent(data);
            setLoading(false);
        };
        loadContent();
    }, []);

    const handleSave = async () => {
        try {
            const updatedContent = {
                ...content,
                lastEditor: currentUser?.displayName || currentUser?.email || 'Unbekannt',
                lastUpdated: new Date().toISOString()
            };
            await contentApi.updateGuideline('support_wiki_grid_final', updatedContent);
            setContent(updatedContent);
            addToast("Wiki erfolgreich aktualisiert! 🚀");
            setIsEditing(false);
        } catch (e) { 
            addToast("Fehler beim Speichern", "error"); 
        }
    };

    const addBlock = (type) => {
        const newBlock = {
            id: Date.now(),
            type: type,
            width: 'full', 
            title: type === 'alert' ? "Wichtiger Hinweis" : "Neuer Titel",
            description: "", 
            content: type === 'table' ? [["Kopf 1", "Kopf 2"], ["Daten 1", "Daten 2"]] : 
                     type === 'checklist' ? [{id: 1, text: "Punkt 1", checked: false}] :
                     type === 'button' || type === 'file' ? { label: "Beschriftung", url: "" } : 
                     type === 'alert' ? "Hier steht der wichtige Hinweis..." : "",
            variant: "info"
        };
        setContent({ ...content, blocks: [...content.blocks, newBlock] });
    };

    const updateBlock = (id, field, value) => {
        setContent({ ...content, blocks: content.blocks.map(b => b.id === id ? { ...b, [field]: value } : b) });
    };

    const toggleWidth = (id) => {
        setContent({ ...content, blocks: content.blocks.map(b => 
            b.id === id ? { ...b, width: b.width === 'full' ? 'half' : 'full' } : b
        )});
    };

    const moveBlock = (index, direction) => {
        const newBlocks = [...content.blocks];
        const target = index + direction;
        if (target < 0 || target >= newBlocks.length) return;
        [newBlocks[index], newBlocks[target]] = [newBlocks[target], newBlocks[index]];
        setContent({ ...content, blocks: newBlocks });
    };

    // --- Management Funktionen ---
    const addRow = (blockId) => {
        setContent(prev => ({
            ...prev,
            blocks: prev.blocks.map(b => {
                if (b.id === blockId) {
                    const newRow = new Array(b.content[0].length).fill("");
                    return { ...b, content: [...b.content, newRow] };
                }
                return b;
            })
        }));
    };

    const removeRow = (blockId, rIdx) => {
        setContent(prev => ({
            ...prev,
            blocks: prev.blocks.map(b => {
                if (b.id === blockId && b.content.length > 1) {
                    return { ...b, content: b.content.filter((_, idx) => idx !== rIdx) };
                }
                return b;
            })
        }));
    };

    const addColumn = (blockId) => {
        setContent(prev => ({
            ...prev,
            blocks: prev.blocks.map(b => {
                if (b.id === blockId) {
                    return { ...b, content: b.content.map(row => [...row, ""]) };
                }
                return b;
            })
        }));
    };

    const removeColumn = (blockId, cIdx) => {
        setContent(prev => ({
            ...prev,
            blocks: prev.blocks.map(b => {
                if (b.id === blockId && b.content[0].length > 1) {
                    return { ...b, content: b.content.map(row => row.filter((_, idx) => idx !== cIdx)) };
                }
                return b;
            })
        }));
    };

    const getEmbedUrl = (url) => {
        if (!url) return null;
        if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
        if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
        if (url.includes('loom.com/share/')) return url.replace('/share/', '/embed/');
        return url;
    };

    if (loading) return <div className="p-20 text-center text-gray-400 font-bold animate-pulse font-sans">Lade Wissensdatenbank...</div>;

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in pb-32 font-sans px-4">
            {/* Header */}
            <div className="flex justify-between items-end mb-12 border-b border-gray-100 dark:border-gray-800 pb-8">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 text-blue-600">
                        <LifeBuoy size={32} />
                        <span className="text-xs font-black uppercase tracking-widest text-blue-600">Operations Wiki</span>
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight italic">Support Playbook</h2>
                    {!isEditing && content.lastUpdated && (
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                            <Clock size={12}/> {new Date(content.lastUpdated).toLocaleDateString()} • {content.lastEditor}
                        </div>
                    )}
                </div>
                {isPrivileged && (
                    <button onClick={isEditing ? handleSave : () => setIsEditing(true)} 
                            className={`px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl transition-all active:scale-95 ${isEditing ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
                        {isEditing ? <><Save size={20}/> Layout speichern</> : <><Edit3 size={20}/> Wiki bearbeiten</>}
                    </button>
                )}
            </div>

            {/* Inhalts-Grid */}
            <div className="flex flex-wrap gap-6 items-start">
                {content.blocks.map((block, idx) => (
                    <div key={block.id} 
                         className={`group relative bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border transition-all duration-300
                         ${block.width === 'half' ? 'w-full lg:w-[calc(50%-12px)]' : 'w-full'}
                         ${isEditing ? 'border-blue-200 ring-4 ring-blue-50' : 'border-gray-100 dark:border-gray-700 shadow-sm'}`}>
                        
                        {/* Editor Controls an der Seite */}
                        {isEditing && (
                            <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-white dark:bg-gray-700 shadow-xl border border-gray-100 dark:border-gray-600 p-2 rounded-xl z-20">
                                <button onClick={() => toggleWidth(block.id)} className="p-1 hover:text-blue-600" title="Breite umschalten">
                                    {block.width === 'full' ? <Minimize2 size={18}/> : <Maximize2 size={18}/>}
                                </button>
                                <div className="h-px bg-gray-100 dark:bg-gray-600 mx-1"></div>
                                <button onClick={() => moveBlock(idx, -1)} className="p-1 hover:text-blue-600" disabled={idx === 0}><ChevronUp size={18}/></button>
                                <button onClick={() => moveBlock(idx, 1)} className="p-1 hover:text-blue-600" disabled={idx === content.blocks.length - 1}><ChevronDown size={18}/></button>
                                <div className="h-px bg-gray-100 dark:bg-gray-600 mx-1"></div>
                                <button onClick={() => setContent({...content, blocks: content.blocks.filter(b => b.id !== block.id)})} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={18}/></button>
                            </div>
                        )}

                        <div className="flex items-center gap-4 mb-6">
                            {isEditing ? (
                                <input className="text-xl font-black bg-transparent border-b-2 border-blue-100 focus:border-blue-500 outline-none px-1 flex-1 dark:text-white"
                                       value={block.title} onChange={e => updateBlock(block.id, 'title', e.target.value)}/>
                            ) : (
                                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight border-l-4 border-blue-600 pl-4 uppercase">{block.title}</h3>
                            )}
                        </div>

                        {/* CONTENT RENDERER */}
                        <div className="space-y-6">
                            
                            {/* TYPE: TEXT */}
                            {block.type === 'text' && isEditing && (
                                <textarea className="w-full bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 text-sm min-h-[120px] outline-none dark:text-white border-none"
                                          value={block.content} onChange={e => updateBlock(block.id, 'content', e.target.value)}/>
                            )}
                            {block.type === 'text' && !isEditing && (
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{block.content}</p>
                            )}

                            {/* TYPE: VIDEO */}
                            {block.type === 'video' && (
                                <div className="space-y-4">
                                    <div className="aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl">
                                        <iframe src={getEmbedUrl(block.content)} className="w-full h-full" allowFullScreen title={block.title}></iframe>
                                    </div>
                                    {isEditing && (
                                        <input className="w-full bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-xs font-mono border-none dark:text-white"
                                               placeholder="URL (Loom/YouTube)..." value={block.content} onChange={e => updateBlock(block.id, 'content', e.target.value)}/>
                                    )}
                                </div>
                            )}

                            {/* TYPE: TABLE */}
                            {block.type === 'table' && (
                                <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                {isEditing && (
                                                    <tr className="bg-red-50/50 dark:bg-red-900/10">
                                                        {block.content[0].map((_, cIdx) => (
                                                            <th key={cIdx} className="p-2 border-r border-gray-100 dark:border-gray-800 last:border-0">
                                                                <button onClick={() => removeColumn(block.id, cIdx)} className="text-red-500 hover:text-red-700 flex items-center justify-center w-full gap-1 text-[9px] font-black uppercase tracking-tighter">
                                                                    <MinusCircle size={12}/> Spalte
                                                                </button>
                                                            </th>
                                                        ))}
                                                        <th className="w-12 bg-transparent"></th>
                                                    </tr>
                                                )}
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 font-sans">
                                                {block.content.map((row, rIdx) => (
                                                    <tr key={rIdx} className={rIdx === 0 ? "bg-gray-50/80 dark:bg-gray-800/50 font-black text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-300"}>
                                                        {row.map((cell, cIdx) => (
                                                            <td key={cIdx} className="p-4 border-r border-gray-100 dark:border-gray-700 last:border-0">
                                                                {isEditing ? (
                                                                    <input className="w-full bg-transparent border-none focus:ring-0 p-0 dark:text-white font-medium" 
                                                                           value={cell} onChange={e => {
                                                                               const newTable = [...block.content];
                                                                               newTable[rIdx][cIdx] = e.target.value;
                                                                               updateBlock(block.id, 'content', newTable);
                                                                           }}/>
                                                                ) : cell}
                                                            </td>
                                                        ))}
                                                        {/* Zeile löschen Button am Ende der Reihe */}
                                                        {isEditing && (
                                                            <td className="w-12 p-2 text-center bg-red-50/30 dark:bg-red-900/10 border-l dark:border-gray-700">
                                                                <button onClick={() => removeRow(block.id, rIdx)} className="text-red-500 hover:text-red-700 transition-colors">
                                                                    <Trash2 size={16}/>
                                                                </button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {isEditing && (
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800/80 flex gap-6 justify-center border-t border-gray-100 dark:border-gray-700">
                                            <button onClick={() => addRow(block.id)} className="flex items-center gap-2 text-[11px] font-black uppercase text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all">
                                                <Plus size={14}/> Zeile hinzufügen
                                            </button>
                                            <button onClick={() => addColumn(block.id)} className="flex items-center gap-2 text-[11px] font-black uppercase text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all">
                                                <Plus size={14}/> Spalte hinzufügen
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TYPE: CHECKLIST (MIT LÖSCHFUNKTION) */}
                            {block.type === 'checklist' && (
                                <div className="grid gap-3">
                                    {block.content.map((item, i) => (
                                        <div key={item.id || i} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-[1.5rem] border border-gray-100 dark:border-gray-700 shadow-sm transition-all">
                                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${item.checked ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/20' : 'border-gray-300 dark:border-gray-600'}`}>
                                                {item.checked && <Check size={14} className="text-white stroke-[4]"/>}
                                            </div>
                                            
                                            <div className="flex-1 flex items-center gap-3">
                                                {isEditing ? (
                                                    <>
                                                        <input className="bg-transparent border-none w-full p-0 text-sm font-bold outline-none dark:text-white" 
                                                               value={item.text} 
                                                               onChange={e => {
                                                                   const newItems = [...block.content];
                                                                   newItems[i].text = e.target.value;
                                                                   updateBlock(block.id, 'content', newItems);
                                                               }}/>
                                                        <button onClick={() => {
                                                            const newItems = block.content.filter((_, idx) => idx !== i);
                                                            updateBlock(block.id, 'content', newItems);
                                                        }} className="text-red-400 hover:text-red-600 p-1 bg-red-50 dark:bg-red-900/20 rounded-lg transition-colors">
                                                            <Trash2 size={16}/>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className={`text-sm font-bold font-sans ${item.checked ? 'line-through text-gray-400 opacity-50' : 'text-gray-700 dark:text-gray-200'}`}>{item.text}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {isEditing && (
                                        <button className="w-fit text-[11px] font-black uppercase text-blue-600 px-6 py-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 transition-all mt-2" 
                                                onClick={() => updateBlock(block.id, 'content', [...block.content, {id: Date.now(), text: "Neuer Punkt", checked: false}])}>
                                            + Punkt hinzufügen
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* TYPE: ALERT */}
                            {block.type === 'alert' && (
                                <div className={`p-8 rounded-[2rem] border-l-[12px] flex gap-5 ${block.variant === 'warning' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-500 text-amber-900 dark:text-amber-200' : 'bg-blue-50 dark:bg-blue-900/10 border-blue-500 text-blue-900 dark:text-blue-200'}`}>
                                    <div className={`p-3 rounded-2xl h-fit ${block.variant === 'warning' ? 'bg-amber-200/50' : 'bg-blue-200/50'}`}>
                                        {block.variant === 'warning' ? <AlertTriangle className="text-amber-700 shrink-0"/> : <Info className="text-blue-700 shrink-0"/>}
                                    </div>
                                    <div className="flex-1">
                                        {isEditing && (
                                            <div className="flex gap-2 mb-4 font-sans">
                                                <button onClick={() => updateBlock(block.id, 'variant', 'info')} className={`text-[10px] px-3 py-1.5 rounded-full font-bold border transition-all ${block.variant === 'info' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400'}`}>INFO</button>
                                                <button onClick={() => updateBlock(block.id, 'variant', 'warning')} className={`text-[10px] px-3 py-1.5 rounded-full font-bold border transition-all ${block.variant === 'warning' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-400'}`}>WARNUNG</button>
                                            </div>
                                        )}
                                        {isEditing ? (
                                            <textarea className="w-full bg-white/50 dark:bg-gray-800 rounded-xl p-3 text-sm outline-none border-none font-bold dark:text-white" value={block.content} onChange={e => updateBlock(block.id, 'content', e.target.value)}/>
                                        ) : (
                                            <p className="text-sm font-black leading-relaxed italic">{block.content}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TYPE: BUTTON */}
                            {block.type === 'button' && (
                                <div className="flex flex-col gap-4">
                                    {isEditing ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-[1.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter ml-1">Label</label>
                                                <input className="w-full text-sm p-3 rounded-xl border-none shadow-sm dark:bg-gray-800 dark:text-white outline-blue-500" value={block.content.label} onChange={e => updateBlock(block.id, 'content', {...block.content, label: e.target.value})}/>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter ml-1">URL</label>
                                                <input className="w-full text-sm p-3 rounded-xl border-none shadow-sm dark:bg-gray-800 dark:text-white outline-blue-500" value={block.content.url} onChange={e => updateBlock(block.id, 'content', {...block.content, url: e.target.value})}/>
                                            </div>
                                        </div>
                                    ) : (
                                        <a href={block.content.url} target="_blank" rel="noreferrer" 
                                           className="inline-flex items-center justify-center gap-3 bg-blue-600 text-white px-12 py-5 rounded-2xl font-black shadow-xl hover:bg-blue-700 hover:-translate-y-1 transition-all w-fit">
                                            {block.content.label} <ExternalLink size={20}/>
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* BESCHREIBUNG (FÜR ALLE) */}
                            {(isEditing || block.description) && (
                                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700/50">
                                    {isEditing ? (
                                        <div className="flex gap-3 items-start bg-blue-50/20 dark:bg-blue-900/5 p-5 rounded-2xl border border-blue-100/30">
                                            <FileText size={18} className="text-blue-500 mt-1 shrink-0"/>
                                            <textarea className="w-full bg-transparent border-none text-sm outline-none resize-none dark:text-gray-200 font-sans leading-relaxed" 
                                                      placeholder="Zusätzliche Anleitung oder Kontext hinzufügen..."
                                                      value={block.description} onChange={e => updateBlock(block.id, 'description', e.target.value)} rows={3}/>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-wrap italic px-2 font-sans">
                                            {block.description}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* BLOCK CREATOR */}
            {isEditing && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 pt-20 border-t-2 border-dashed border-gray-100 dark:border-gray-800">
                    {[
                        { type: 'text', icon: AlignLeft, label: 'Text', color: 'text-blue-500' },
                        { type: 'video', icon: PlayCircle, label: 'Video', color: 'text-red-500' },
                        { type: 'file', icon: FileBox, label: 'Datei', color: 'text-blue-700' },
                        { type: 'table', icon: TableIcon, label: 'Tabelle', color: 'text-purple-500' },
                        { type: 'checklist', icon: ListChecks, label: 'Liste', color: 'text-pink-500' },
                        { type: 'alert', icon: AlertTriangle, label: 'Alert', color: 'text-amber-500' },
                        { type: 'button', icon: MousePointer2, label: 'Button', color: 'text-indigo-500' }
                    ].map((btn) => (
                        <button key={btn.type} onClick={() => addBlock(btn.type)} className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-700 hover:border-blue-500 hover:shadow-xl transition-all group">
                            <btn.icon size={28} className={`mb-2 transition-transform group-hover:scale-110 ${btn.color}`}/>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-blue-600">{btn.label}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Admin Overlay */}
            {isEditing && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-10 py-6 rounded-[3rem] shadow-2xl z-[100] flex items-center gap-10 border border-white/10 animate-in slide-in-from-bottom-10">
                    <div className="flex items-center gap-4 border-r border-gray-700 pr-10">
                        <div className="w-14 h-14 bg-blue-600 rounded-3xl flex items-center justify-center animate-pulse shadow-lg shadow-blue-500/40"><Shield size={28}/></div>
                        <div>
                            <p className="font-black text-base uppercase tracking-widest leading-none mb-1 text-white">Wiki Editor</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Live Publishing Mode</p>
                        </div>
                    </div>
                    <button onClick={handleSave} className="bg-white text-gray-900 px-10 py-4 rounded-2xl font-black text-sm hover:bg-blue-600 hover:text-white transition-all shadow-lg active:scale-95">JETZT PUBLIZIEREN</button>
                </div>
            )}
        </div>
    );
}