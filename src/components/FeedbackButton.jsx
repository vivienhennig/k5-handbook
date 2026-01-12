import React, { useState } from 'react';
import { MessageSquarePlus, X, Send, Loader2 } from 'lucide-react';
import { feedbackApi } from '../services/api'; // <--- Importieren

export default function FeedbackButton({ user }) { 
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState('');
    const [status, setStatus] = useState('idle');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const userName = user?.displayName || user?.name || 'Anonym';
            
            // HIER DIE ÄNDERUNG: Direkt Firebase nutzen
            await feedbackApi.submit({
                user: userName,
                context: 'General', 
                text: text
            });

            setStatus('success');
            setText('');
            setTimeout(() => {
                setIsOpen(false);
                setStatus('idle');
            }, 2000);
        } catch (error) {
            console.error("Feedback error", error);
            setStatus('idle');
            alert("Fehler beim Senden.");
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end animate-in fade-in duration-700">
            {isOpen && (
                <div className="mb-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-72 animate-in slide-in-from-bottom-2">
                    {status !== 'success' ? (
                        <form onSubmit={handleSubmit}>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">Feedback oder Bug? 🐛</h4>
                            <textarea 
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full text-xs p-2 border border-gray-200 dark:border-gray-600 rounded-lg mb-2 dark:bg-gray-700 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 outline-none" 
                                rows="3" 
                                placeholder="Erzähl uns, was wir verbessern können..."
                                required
                                disabled={status === 'loading'}
                            ></textarea>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-gray-400">Wird gespeichert</span>
                                <button type="submit" disabled={status === 'loading'} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-1 transition-colors disabled:opacity-50">
                                    {status === 'loading' ? <Loader2 size={12} className="animate-spin"/> : <Send size={12}/>} Senden
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center py-4 text-green-600 dark:text-green-400 font-bold text-sm flex flex-col items-center gap-2">
                            <span>Danke für dein Feedback! 🙌</span>
                        </div>
                    )}
                </div>
            )}

            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-gray-200 text-gray-600 rotate-90' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
                {isOpen ? <X size={24}/> : <MessageSquarePlus size={24}/>}
            </button>
        </div>
    );
}