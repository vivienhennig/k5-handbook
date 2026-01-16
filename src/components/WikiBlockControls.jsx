import React from 'react';
import { Trash2, Paintbrush } from 'lucide-react';

export default function WikiBlockControls({ block, onUpdate, onDelete }) {
    return (
        <div className="absolute -left-12 top-4 flex flex-col gap-2 bg-white dark:bg-gray-700 shadow-xl border p-2 rounded-xl z-20 print:hidden animate-in slide-in-from-right-2">
            <button onClick={onDelete} className="text-red-500 p-1 hover:bg-red-50 rounded">
                <Trash2 size={16}/>
            </button>
            <button 
                onClick={() => onUpdate(block.id, 'style', block.style === 'card' ? 'flat' : 'card')} 
                className="text-blue-500 p-1 hover:bg-blue-50 rounded"
            >
                <Paintbrush size={16}/>
            </button>

            {block.type === 'headline' && (
                <div className="border-t border-gray-100 dark:border-gray-600 mt-1 pt-1 flex flex-col gap-1">
                    {[2, 3, 4, 5, 6].map(lvl => (
                        <button 
                            key={lvl}
                            onClick={() => onUpdate(block.id, 'content', { ...block.content, level: lvl })}
                            className={`p-1 text-[9px] font-black rounded ${
                                (block.content.level === lvl || (!block.content.level && lvl === 2)) 
                                ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-100'
                            }`}
                        >
                            H{lvl}
                        </button>
                    ))}
                </div>
            )}

            <div className="border-t border-gray-100 dark:border-gray-600 mt-1 pt-1 flex flex-col gap-1 text-[10px] text-center font-bold text-gray-300 italic">COL</div>
            {[1, 2, 3, 4].map(num => (
                <button 
                    key={num} 
                    onClick={() => onUpdate(block.id, 'width', num === 1 ? '4/4' : num === 2 ? '2/4' : num === 3 ? '3/4' : '1/4')} 
                    className={`p-1 text-[10px] font-black rounded ${
                        (num === 1 && (block.width === '4/4' || !block.width)) || 
                        (num === 2 && block.width === '2/4') || 
                        (num === 3 && block.width === '3/4') || 
                        (num === 4 && block.width === '1/4') 
                        ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-100'
                    }`}
                >
                    {num}
                </button>
            ))}
        </div>
    );
}