import React from 'react';
import { Plus, Trash2, XCircle, Sparkles } from 'lucide-react';

export default function TableBlock ({ content, isEditing, onChange }) {
    // Falls content noch das alte Format (Array) hat oder leer ist, konvertieren
    const safeContent = React.useMemo(() => {
        if (!content) return { rows: [{ cells: ["Spalte 1", "Spalte 2"] }, { cells: ["", ""] }] };
        if (Array.isArray(content)) {
            return { rows: content.map(row => ({ cells: Array.isArray(row) ? row : [""] })) };
        }
        return content;
    }, [content]);

    const rows = safeContent.rows || [];

    const updateCell = (rowIndex, colIndex, value) => {
        const newRows = JSON.parse(JSON.stringify(rows));
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
        <div className="w-full space-y-6 font-sans">
            {/* Table Container: rounded-k5-lg */}
            <div className="overflow-x-auto rounded-k5-lg border border-gray-100 dark:border-k5-deep bg-white dark:bg-k5-black shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-k5-digital/5">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        {/* Header: k5-light-grey / k5-deep Background */}
                        <tr className="bg-k5-light-grey/50 dark:bg-k5-deep/30 border-b border-gray-100 dark:border-k5-deep">
                            {rows[0]?.cells.map((cell, j) => (
                                <th key={j} className="p-6 group/col relative min-w-[120px]">
                                    <div className="flex flex-col gap-1">
                                        {isEditing ? (
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    className="bg-k5-digital/5 dark:bg-k5-black/40 px-2 py-1 rounded-sm border border-transparent focus:border-k5-digital/30 w-full outline-none font-bold uppercase text-[11px] text-k5-digital transition-all" 
                                                    value={cell} 
                                                    onChange={e => updateCell(0, j, e.target.value)}
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => deleteColumn(j)}
                                                    className="opacity-0 group-hover/col:opacity-100 text-red-400 hover:text-red-600 transition-all p-1"
                                                >
                                                    <XCircle size={14}/>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Sparkles size={10} className="text-k5-sand opacity-50" />
                                                <span className="font-black uppercase text-[10px] text-k5-sand tracking-[0.25em]">{cell}</span>
                                            </div>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {isEditing && <th className="w-12 border-b dark:border-k5-deep bg-k5-light-grey/20 dark:bg-k5-black"></th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-k5-deep/30">
                        {rows.slice(1).map((row, i) => (
                            <tr key={i} className="hover:bg-k5-light-grey/20 dark:hover:bg-k5-deep/10 group/row transition-colors">
                                {row.cells.map((cell, j) => (
                                    <td key={j} className="p-6 text-k5-black dark:text-gray-200">
                                        {isEditing ? (
                                            <input 
                                                className="bg-transparent w-full outline-none font-medium text-sm focus:bg-k5-digital/5 rounded px-2 py-1 transition-all" 
                                                value={cell} 
                                                onChange={e => updateCell(i + 1, j, e.target.value)}
                                            />
                                        ) : (
                                            <span className="font-medium">{cell}</span>
                                        )}
                                    </td>
                                ))}
                                {isEditing && (
                                    <td className="p-6 text-right">
                                        <button 
                                            type="button"
                                            onClick={() => deleteRow(i + 1)}
                                            className="opacity-0 group-hover/row:opacity-100 text-gray-300 hover:text-red-500 transition-all transform hover:scale-110"
                                        >
                                            <Trash2 size={16}/>
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Buttons: rounded-k5-sm & Aeonik Bold */}
            {isEditing && (
                <div className="flex flex-wrap gap-4 justify-start animate-in slide-in-from-top-2">
                    <button 
                        type="button"
                        onClick={addRow}
                        className="flex items-center gap-3 px-6 py-3 bg-k5-digital text-white rounded-k5-sm text-[10px] font-bold uppercase tracking-widest hover:bg-glow-digital shadow-lg shadow-k5-digital/20 transition-all active:scale-95"
                    >
                        <Plus size={14}/> Zeile hinzufügen
                    </button>
                    <button 
                        type="button"
                        onClick={addColumn}
                        className="flex items-center gap-3 px-6 py-3 bg-k5-light-grey dark:bg-k5-deep text-k5-sand rounded-k5-sm text-[10px] font-bold uppercase tracking-widest hover:text-k5-black dark:hover:text-white border border-gray-100 dark:border-k5-deep transition-all active:scale-95"
                    >
                        <Plus size={14}/> Spalte hinzufügen
                    </button>
                </div>
            )}
        </div>
    );
}