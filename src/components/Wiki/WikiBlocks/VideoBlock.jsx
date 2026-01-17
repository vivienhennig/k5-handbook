import React from 'react';
import { 
    PlayCircle, Check as CheckIcon, Copy
} from 'lucide-react'


// --- VIDEO BLOCK ---
export default function VideoBlock ({ content, isEditing, onChange }) {
    return (
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
)}