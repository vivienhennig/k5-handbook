import React from 'react';
import {  Plus, Trash2, XCircle, Check as CheckIcon} from 'lucide-react';


// --- TABLE BLOCK ---

export default function TableBlock ({ content, isEditing, onChange }) {
    // Falls content noch das alte Format (Array) hat oder leer ist, 
    // konvertieren wir es hier on-the-fly in die neue Objekt-Struktur
    const safeContent = React.useMemo(() => {
        if (!content) return { rows: [{ cells: ["Spalte 1", "Spalte 2"] }, { cells: ["", ""] }] };
        if (Array.isArray(content)) {
            return { rows: content.map(row => ({ cells: Array.isArray(row) ? row : [""] })) };
        }
        return content;
    }, [content]);

    const rows = safeContent.rows || [];

    const updateCell = (rowIndex, colIndex, value) => {
        const newRows = JSON.parse(JSON.stringify(rows)); // Tiefe Kopie
        newRows[rowIndex].cells[colIndex] = value;
        onChange({ rows: newRows });
    };

    const addRow = () => {
        const numCols = rows[0]?.cells.length || 1;
        const newRow = { cells: new Array(numCols).fill("") };
        onChange({ rows: [...rows, newRow] });
    };

    const deleteRow = (rowIndex) => {
        if (rows.length <= 2) return;
        const newRows = rows.filter((_, i) => i !== rowIndex);
        onChange({ rows: newRows });
    };

    const addColumn = () => {
        const newRows = rows.map(row => ({
            cells: [...row.cells, ""]
        }));
        onChange({ rows: newRows });
    };

    const deleteColumn = (colIndex) => {
        if (rows[0].cells.length <= 1) return;
        const newRows = rows.map(row => ({
            cells: row.cells.filter((_, j) => j !== colIndex)
        }));
        onChange({ rows: newRows });
    };

    return (
        <div className="w-full space-y-4 animate-in fade-in duration-500">
            <div className="overflow-x-auto rounded-[2rem] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-sm">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                            {rows[0]?.cells.map((cell, j) => (
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
                                                    type="button"
                                                    onClick={() => deleteColumn(j)}
                                                    className="opacity-0 group-hover/col:opacity-100 text-red-400 hover:text-red-600 transition-all transform hover:scale-110"
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
                        {rows.slice(1).map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50/30 dark:hover:bg-gray-800/20 group/row transition-colors">
                                {row.cells.map((cell, j) => (
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
                                            type="button"
                                            onClick={() => deleteRow(i + 1)}
                                            className="opacity-0 group-hover/row:opacity-100 text-red-300 hover:text-red-500 transition-all transform hover:scale-110"
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
            
            {isEditing && (
                <div className="flex gap-3 justify-start animate-in slide-in-from-top-2">
                    <button 
                        type="button"
                        onClick={addRow}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl text-[10px] font-black uppercase hover:bg-blue-100 transition-all active:scale-95 border border-blue-100 dark:border-blue-800"
                    >
                        <Plus size={12}/> Zeile hinzufügen
                    </button>
                    <button 
                        type="button"
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