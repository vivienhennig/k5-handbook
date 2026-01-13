import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Nach 4 Sekunden automatisch entfernen
        setTimeout(() => {
            removeToast(id);
        }, 4000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-3 w-full max-w-xs">
                {toasts.map((toast) => (
                    <div 
                        key={toast.id}
                        className={`flex items-center gap-3 p-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right duration-300 ${
                            toast.type === 'success' 
                                ? 'bg-white dark:bg-gray-800 border-green-100 dark:border-green-900/30 text-green-800 dark:text-green-400' 
                                : 'bg-white dark:bg-gray-800 border-red-100 dark:border-red-900/30 text-red-800 dark:text-red-400'
                        }`}
                    >
                        {toast.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
                        <p className="text-sm font-bold flex-1">{toast.message}</p>
                        <button onClick={() => removeToast(toast.id)} className="opacity-50 hover:opacity-100">
                            <X size={16}/>
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);