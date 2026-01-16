import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { contentApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useReactToPrint } from 'react-to-print';
import { Clock, LayoutGrid, DownloadCloud, X, ChevronLeft, ChevronRight } from 'lucide-react';

// Ausgelagerte Komponenten
import * as Blocks from './WikiBlocks';
import WikiTableOfContents from './WikiTableOfContents';
import WikiHeader from './WikiHeader';
import WikiBlockControls from './WikiBlockControls';

export default function UniversalWikiView({ currentUser, wikiId, title, icon: Icon, handleNav }) {
    const { addToast } = useToast();
    const componentRef = useRef(null); 
    
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeLightbox, setActiveLightbox] = useState(null);
    const [content, setContent] = useState({
        introText: "", blocks: [], lastEditor: "", lastUpdated: null
    });

    const isPrivileged = currentUser?.role === 'admin' || currentUser?.role === 'editor' || currentUser?.role === 'privileged';

    // 1. DATEN LADEN
    useEffect(() => {
        const loadContent = async () => {
            setLoading(true);
            try {
                const data = await contentApi.getGuideline(`wiki_${wikiId}`);
                if (data) {
                    setContent({ 
                        introText: data.introText || "",
                        blocks: data.blocks || [],
                        lastEditor: data.lastEditor || "",
                        lastUpdated: data.lastUpdated || null
                    });
                }
            } catch (error) { console.error("Wiki Load Error:", error); }
            setLoading(false);
        };
        loadContent();
    }, [wikiId]);

    // --- NEU: GALERIE LOGIK ---
    const galleryImages = useMemo(() => {
        const urls = [];
        content.blocks.forEach(block => {
            if (block.type === 'image' && block.content?.urls) {
                block.content.urls.forEach(url => {
                    if (url) urls.push(url);
                });
            }
        });
        return urls;
    }, [content.blocks]);

    const showNext = (e) => {
        e?.stopPropagation();
        const currentIndex = galleryImages.indexOf(activeLightbox);
        const nextIndex = (currentIndex + 1) % galleryImages.length;
        setActiveLightbox(galleryImages[nextIndex]);
    };

    const showPrev = (e) => {
        e?.stopPropagation();
        const currentIndex = galleryImages.indexOf(activeLightbox);
        const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        setActiveLightbox(galleryImages[prevIndex]);
    };

    useEffect(() => {
        if (!activeLightbox) return;
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'Escape') setActiveLightbox(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeLightbox, galleryImages]);

    // 2. PRINT FUNKTION
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `K5_Handbook_${title}`,
    });

    // 3. SPEICHERN & LÖSCHEN
    const handleSave = async () => {
        try {
            const updatedContent = {
                ...content,
                lastEditor: currentUser?.displayName || 'Unbekannt',
                lastUpdated: new Date().toISOString(),
            };
            await contentApi.updateGuideline(`wiki_${wikiId}`, updatedContent);
            await contentApi.logActivity(wikiId, title, currentUser, 'update');
            setIsEditing(false);
            addToast("Gespeichert! 🚀");
        } catch (e) { addToast("Fehler beim Speichern", "error"); }
    };

    const handleDeleteWiki = () => {}; // Platzhalter für deine existierende Logik
    const handleDelete = () => handleDeleteWiki(); 

    // 4. BLOCK MANAGEMENT
    const updateBlock = (id, field, value) => {
        setContent(prev => ({
            ...prev,
            blocks: prev.blocks.map(b => b.id === id ? { ...b, [field]: value } : b)
        }));
    };

    const addBlock = (type) => {
        const base = { id: Date.now().toString(), type, width: '4/4', style: 'card' };
        let newContent = "";
        if (type === 'headline') newContent = { text: "Titel", level: 2 };
        if (type === 'image') newContent = { urls: [""], layout: 'single' };
        if (type === 'table') newContent = { 
            rows: [
                { cells: ["Header 1", "Header 2"] }, 
                { cells: ["", ""] }
            ] 
        };
        if (type === 'checklist') newContent = [{ id: Date.now(), text: "Neuer Punkt", checked: false }];
        if (type === 'color') newContent = { hex: "#3b82f6", label: "Farbe" };

        setContent(prev => ({ ...prev, blocks: [...prev.blocks, { ...base, content: newContent }] }));
    };

    const moveBlock = (id, direction) => {
    const index = content.blocks.findIndex(b => b.id === id);
    if (index === -1) return;

    const newBlocks = [...content.blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // Prüfen, ob Verschieben möglich ist (nicht über die Grenzen hinaus)
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;

    // Blöcke tauschen
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];

    setContent(prev => ({ ...prev, blocks: newBlocks }));
};

const duplicateBlock = (id) => {
    const index = content.blocks.findIndex(b => b.id === id);
    if (index === -1) return;

    const blockToCopy = content.blocks[index];
    // Wir erstellen eine tiefe Kopie und geben ihr eine neue ID
    const newBlock = {
        ...JSON.parse(JSON.stringify(blockToCopy)),
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5)
    };

    const newBlocks = [...content.blocks];
    // Den neuen Block direkt unter dem Original einfügen
    newBlocks.splice(index + 1, 0, newBlock);

    setContent(prev => ({ ...prev, blocks: newBlocks }));
    addToast("Block dupliziert! 📋");
};

    // --- OPTIMIERTE LIGHTBOX MIT NAVIGATION ---
    const Lightbox = () => activeLightbox && createPortal(
        <div className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setActiveLightbox(null)}>
            <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-all z-50">
                <X size={40} />
            </button>

            {galleryImages.length > 1 && (
                <>
                    <button onClick={showPrev} className="absolute left-8 p-4 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all border border-white/10 z-50 group">
                        <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <button onClick={showNext} className="absolute right-8 p-4 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all border border-white/10 z-50 group">
                        <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/10 rounded-full text-white/60 text-[10px] font-black uppercase tracking-[0.3em] italic border border-white/5">
                        {galleryImages.indexOf(activeLightbox) + 1} / {galleryImages.length}
                    </div>
                </>
            )}

            <img 
                src={activeLightbox} 
                alt="Full" 
                className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-lg animate-in zoom-in-95 cursor-default" 
                onClick={(e) => e.stopPropagation()}
            />
        </div>, document.body
    );

    if (loading) return <div className="p-20 text-center text-gray-400 font-bold animate-pulse font-sans">LADE HANDBOOK...</div>;

    return (
        <div className="max-w-7xl mx-auto pb-32 px-4 font-sans flex flex-col lg:flex-row gap-10">
            <Lightbox />
            <WikiTableOfContents blocks={content.blocks} isEditing={isEditing} />

            <div className="flex-1 min-w-0 order-1">
                <WikiHeader 
                    title={title} wikiId={wikiId} icon={Icon} isEditing={isEditing} 
                    isPrivileged={isPrivileged} introText={content.introText}
                    setIntroText={(val) => setContent({...content, introText: val})}
                    onSave={handleSave} onEdit={() => setIsEditing(true)} 
                    onDelete={handleDelete} onPrint={handlePrint}
                />

                <div ref={componentRef} className="flex flex-wrap gap-6 items-stretch">
                    {content.blocks.map((block) => {
                        const widthClass = 
                            block.width === '1/4' ? 'w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]' :
                            block.width === '2/4' ? 'w-full lg:w-[calc(50%-12px)]' :
                            block.width === '3/4' ? 'w-full lg:w-[calc(75%-6px)]' : 'w-full';

                        return (
        <div 
            key={block.id} 
            className={`group relative transition-all duration-300 flex flex-col ${widthClass} ...`}
        >
            {isEditing && (
                <WikiBlockControls 
                    block={block} 
                    onUpdate={updateBlock} 
                    onMove={(dir) => moveBlock(block.id, dir)}
                    onDuplicate={() => duplicateBlock(block.id)}
                    onDelete={() => setContent(prev => ({...prev, blocks: prev.blocks.filter(b => b.id !== block.id)}))} 
                />
            )}

                                {block.type === 'headline' && <Blocks.HeadlineBlock content={block.content} isEditing={isEditing} onChange={(v) => updateBlock(block.id, 'content', v)} />}

{block.type === 'text' && (
    <Blocks.TextBlock 
        content={block.content} 
        isEditing={isEditing} 
        // Ändere dies: Statt einer leeren Funktion geben wir den Text einfach zurück
        renderLinkedText={(text) => text} 
        onChange={(v) => updateBlock(block.id, 'content', v)} 
    />
)}
                                {block.type === 'image' && <Blocks.ImageBlock content={block.content} isEditing={isEditing} onLightbox={setActiveLightbox} onChange={(v) => updateBlock(block.id, 'content', v)} />}
                                {block.type === 'video' && <Blocks.VideoBlock content={block.content} isEditing={isEditing} onChange={(v) => updateBlock(block.id, 'content', v)} />}
                                {block.type === 'table' && <Blocks.TableBlock content={block.content} isEditing={isEditing} onChange={(v) => updateBlock(block.id, 'content', v)} />}
                                {block.type === 'checklist' && <Blocks.ChecklistBlock content={block.content} isEditing={isEditing} onChange={(v) => updateBlock(block.id, 'content', v)} />}
                                {block.type === 'alert' && <Blocks.AlertBlock content={block.content} isEditing={isEditing} onChange={(v) => updateBlock(block.id, 'content', v)} />}
                                {block.type === 'file' && <Blocks.FileBlock content={block.content} isEditing={isEditing} onChange={(v) => updateBlock(block.id, 'content', v)} />}
                                {block.type === 'color' && <Blocks.ColorBlock content={block.content} isEditing={isEditing} onChange={(v) => updateBlock(block.id, 'content', v)} />}
                                {block.type === 'divider' && <Blocks.DividerBlock />}
                            </div>
                        );
                    })}
                </div>

                {isEditing && (
                    <div className="mt-16 p-10 bg-gray-50 dark:bg-gray-900/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800 grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
                        {['headline', 'text', 'image', 'video', 'table', 'checklist', 'alert', 'file', 'color', 'divider'].map(type => (
                            <button key={type} onClick={() => addBlock(type)} className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:scale-110 transition-all border-2 border-transparent">
                                <span className="text-blue-600 uppercase font-black text-[9px]">{type}</span>
                            </button>
                        ))}
                    </div>
                )}

                <div className="mt-24 pt-10 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">
                    <div className="flex items-center gap-3"><Clock size={14} className="text-blue-500"/> UPDATED: {content.lastUpdated ? new Date(content.lastUpdated).toLocaleString('de-DE') : 'NEVER'}</div>
                    <div className="flex items-center gap-3"><LayoutGrid size={14} className="text-blue-500"/> EDITOR: {content.lastEditor || 'SYSTEM'}</div>
                </div>
            </div>
        </div>
    );
}