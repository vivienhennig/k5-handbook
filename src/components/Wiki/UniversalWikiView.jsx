import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { contentApi } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useReactToPrint } from 'react-to-print';
import { Clock, LayoutGrid } from 'lucide-react';

// Blocks
import TextBlock from './WikiBlocks/TextBlock.jsx';
import VideoBlock from './WikiBlocks/VideoBlock.jsx';
import TableBlock from './WikiBlocks/TableBlock.jsx';
import ImageBlock from './WikiBlocks/ImageBlock.jsx';
import HeadlineBlock from './WikiBlocks/HeadlineBlock.jsx';
import FileBlock from './WikiBlocks/FileBlock.jsx';
import DividerBlock from './WikiBlocks/DividerBlock.jsx';
import ColorBlock from './WikiBlocks/ColorBlock.jsx';
import ChecklistBlock from './WikiBlocks/ChecklistBlock.jsx';
import AlertBlock from './WikiBlocks/AlertBlock.jsx';

// UI Helpers & Layout
import WikiTableOfContents from './WikiTableOfContents.jsx';
import WikiHeader from './WikiHeader.jsx';
import WikiBlockControls from './WikiBlockControls.jsx';
import WikiSkeleton from './WikiSkeleton.jsx';
import WikiLightbox from './WikiLightbox.jsx';
import BackToTopButton from '../UI/BackToTopButton.jsx';

export default function UniversalWikiView({ currentUser, wikiId, title, icon: Icon, handleNav, customWikis }) {
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

    // --- GALERIE LOGIK ---
    const galleryImages = useMemo(() => {
        const urls = [];
        content.blocks.forEach(block => {
            if (block.type === 'image' && block.content?.urls) {
                block.content.urls.forEach(url => { if (url) urls.push(url); });
            }
        });
        return urls;
    }, [content.blocks]);

    const handleNext = () => {
        const currentIndex = galleryImages.indexOf(activeLightbox);
        setActiveLightbox(galleryImages[(currentIndex + 1) % galleryImages.length]);
    };

    const handlePrev = () => {
        const currentIndex = galleryImages.indexOf(activeLightbox);
        setActiveLightbox(galleryImages[(currentIndex - 1 + galleryImages.length) % galleryImages.length]);
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `K5_Handbook_${title}`,
    });

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
        if (type === 'table') newContent = { rows: [{ cells: ["H1", "H2"] }, { cells: ["", ""] }] };
        if (type === 'checklist') newContent = [{ id: Date.now(), text: "Neu", checked: false }];
        if (type === 'color') newContent = { hex: "#3b82f6", label: "Farbe" };
        setContent(prev => ({ ...prev, blocks: [...prev.blocks, { ...base, content: newContent }] }));
    };

    const moveBlock = (id, direction) => {
        const index = content.blocks.findIndex(b => b.id === id);
        if (index === -1) return;
        const newBlocks = [...content.blocks];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
        [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
        setContent(prev => ({ ...prev, blocks: newBlocks }));
    };

    const duplicateBlock = (id) => {
        const index = content.blocks.findIndex(b => b.id === id);
        if (index === -1) return;
        const newBlock = { ...JSON.parse(JSON.stringify(content.blocks[index])), id: Date.now().toString() + Math.random().toString(36).substr(2, 5) };
        const newBlocks = [...content.blocks];
        newBlocks.splice(index + 1, 0, newBlock);
        setContent(prev => ({ ...prev, blocks: newBlocks }));
        addToast("Dupliziert! 📋");
    };

    const renderLinkedText = (text, customWikis) => {
        if (!text) return "";
        const parts = text.split(/(@\[?[a-zA-Z0-9\säöüÄÖÜß]+\]?)/g);
        return parts.map((part, i) => {
            if (part.startsWith('@')) {
                const cleanName = part.replace(/^@\[?/, '').replace(/\]?$/, '');
                const targetWiki = customWikis?.find(w => w.title.toLowerCase() === cleanName.toLowerCase());
                if (targetWiki) {
                    return (
                        <Link key={i} to={`/wiki/${targetWiki.id}`} className="text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-400/10 px-1.5 py-0.5 rounded-md font-bold hover:underline transition-all">
                            {part}
                        </Link>
                    );
                }
            }
            return part;
        });
    };

    if (loading) return <WikiSkeleton />;

    return (
        <div className="max-w-7xl mx-auto pb-32 px-4 font-sans flex flex-col lg:flex-row gap-10">
            <WikiLightbox 
                activeLightbox={activeLightbox} 
                galleryImages={galleryImages} 
                onClose={() => setActiveLightbox(null)} 
                onNext={handleNext} 
                onPrev={handlePrev} 
            />
            
            <WikiTableOfContents blocks={content.blocks} isEditing={isEditing} />

            <div className="flex-1 min-w-0 order-1">
                <WikiHeader 
                    title={title} wikiId={wikiId} icon={Icon} isEditing={isEditing} 
                    isPrivileged={isPrivileged} introText={content.introText}
                    setIntroText={(val) => setContent({...content, introText: val})}
                    onSave={handleSave} onEdit={() => setIsEditing(true)} 
                    onDelete={() => {}} onPrint={handlePrint}
                />

                <div ref={componentRef} className="flex flex-wrap gap-6 items-stretch">
                    {content.blocks.map((block) => {
                        const widthClass = block.width === '1/4' ? 'w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]' :
                                           block.width === '2/4' ? 'w-full lg:w-[calc(50%-12px)]' :
                                           block.width === '3/4' ? 'w-full lg:w-[calc(75%-6px)]' : 'w-full';

                        return (
                            <div key={block.id} className={`group relative transition-all duration-300 flex flex-col ${widthClass}`}>
                                {isEditing && (
                                    <WikiBlockControls 
                                        block={block} onUpdate={updateBlock} 
                                        onMove={(dir) => moveBlock(block.id, dir)}
                                        onDuplicate={() => duplicateBlock(block.id)}
                                        onDelete={() => setContent(prev => ({...prev, blocks: prev.blocks.filter(b => b.id !== block.id)}))} 
                                    />
                                )}

                                {block.type === 'headline' && <HeadlineBlock content={block.content} isEditing={isEditing} onChange={(v) => updateBlock(block.id, 'content', v)} />}
                                {block.type === 'text' && <TextBlock content={block.content} isEditing={isEditing} renderLinkedText={(t) => renderLinkedText(t, customWikis || [])} onChange={(v) => updateBlock(block.id, 'content', v)} customWikis={customWikis || []} />}
                                {block.type === 'image' && <ImageBlock content={block.content} isEditing={isEditing} onLightbox={setActiveLightbox} onChange={(v) => updateBlock(block.id, 'content', v)} />}
                                {block.type === 'video' && <VideoBlock content={block.content} isEditing={isEditing} onChange={(v) => updateBlock(block.id, 'content', v)} />}
                                {block.type === 'table' && <TableBlock content={block.content} isEditing={isEditing} onChange={(v) => updateBlock(block.id, 'content', v)} />}
                                {block.type === 'checklist' && <ChecklistBlock content={block.content} isEditing={isEditing} onChange={(v) => updateBlock(block.id, 'content', v)} renderLinkedText={(t) => renderLinkedText(t, customWikis || [])} customWikis={customWikis} />}
                                {block.type === 'alert' && <AlertBlock content={block.content} isEditing={isEditing} onChange={(v) => updateBlock(block.id, 'content', v)} />}
                                {block.type === 'file' && <FileBlock content={block.content} isEditing={isEditing} onChange={(v) => updateBlock(block.id, 'content', v)} />}
                                {block.type === 'color' && <ColorBlock content={block.content} isEditing={isEditing} onChange={(v) => updateBlock(block.id, 'content', v)} />}
                                {block.type === 'divider' && <DividerBlock />}
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
            <BackToTopButton />
        </div>
    );
}