import React, { useState } from 'react';
import { MessageSquarePlus, X, Send, Loader2, Sparkles } from 'lucide-react';
import { feedbackApi } from '../../services/api.js';

export default function FeedbackButton({ user }) { 
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState('');
    const [status, setStatus] = useState('idle');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const userName = user?.displayName || user?.name || 'Anonym';
            
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
            // Toast wäre hier besser, aber wir halten uns an die Logik
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[9999] flex flex-col items-end animate-in fade-in duration-700 font-sans">
            {isOpen && (
                <div className="mb-4 bg-white dark:bg-k5-black p-6 rounded-k5-md shadow-2xl border border-gray-100 dark:border-k5-deep w-80 animate-in slide-in-from-bottom-4 duration-300">
                    {status !== 'success' ? (
                        <form onSubmit={handleSubmit}>
                            <h4 className="font-bold text-k5-black dark:text-white mb-3 text-sm uppercase tracking-tight flex items-center gap-2">
                                <Sparkles size={16} className="text-k5-digital" /> Feedback oder Bug?
                            </h4>
                            <textarea 
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full text-xs p-4 bg-k5-light-grey dark:bg-k5-deep/20 border-none rounded-k5-sm mb-4 dark:text-white resize-none outline-none focus:ring-2 focus:ring-k5-digital/30 transition-all placeholder:text-gray-400 font-bold" 
                                rows={4} 
                                placeholder="Erzähl uns, was wir verbessern können..."
                                required
                                disabled={status === 'loading'}
                            ></textarea>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-k5-sand uppercase tracking-widest">Internal Only</span>
                                <button 
                                    type="submit" 
                                    disabled={status === 'loading'} 
                                    className="bg-glow-digital text-white px-5 py-2.5 rounded-k5-sm text-[10px] font-bold uppercase tracking-widest hover:opacity-90 flex items-center gap-2 transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-k5-digital/20"
                                >
                                    {status === 'loading' ? (
                                        <Loader2 size={12} className="animate-spin"/>
                                    ) : (
                                        <Send size={12}/>
                                    )} 
                                    Abschicken
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center py-6 text-k5-digital font-bold text-sm flex flex-col items-center gap-3 animate-in zoom-in-95">
                            <div className="w-12 h-12 bg-k5-lime-light rounded-full flex items-center justify-center text-k5-deep shadow-inner">
                                <Sparkles size={24} />
                            </div>
                            <span className="uppercase tracking-tight">Danke für dein Feedback! 🙌</span>
                        </div>
                    )}
                </div>
            )}

            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 flex items-center justify-center ${
                    isOpen 
                    ? 'bg-k5-light-grey text-k5-black dark:bg-k5-deep dark:text-white rotate-90' 
                    : 'bg-glow-digital text-white hover:shadow-k5-digital/40'
                }`}
            >
                {isOpen ? <X size={28}/> : <MessageSquarePlus size={28}/>}
            </button>
        </div>
    );
}