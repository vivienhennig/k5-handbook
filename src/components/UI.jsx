import React, { useState } from 'react';
import { Star, Check, Info, AlertTriangle, Copy, Bell } from 'lucide-react';

export const Card = ({ icon: Icon, title, desc, onClick, isFavorite, onToggleFavorite, hasUpdate }) => (
  <div onClick={onClick} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-t-4 border-blue-600 hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer group relative border border-gray-200 dark:border-gray-700 h-full flex flex-col">
    {hasUpdate && <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md animate-pulse z-10">NEU</div>}
    {onToggleFavorite && (
        <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }} className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors z-10 ${isFavorite ? 'text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30'}`}>
            <Star size={20} fill={isFavorite ? "currentColor" : "none"} />
        </button>
    )}
    <div className="flex items-center justify-between mb-4 mt-2">
      <div className="p-3 bg-blue-50 dark:bg-gray-700 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
        <Icon size={24} className="text-blue-600 dark:text-blue-400 group-hover:text-white" />
      </div>
    </div>
    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 pr-8">{title}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-grow">{desc}</p>
  </div>
);

export const InfoBox = ({ type = 'info', title, children }) => {
  const styles = {
    info: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-600', icon: Info, iconColor: 'text-blue-600 dark:text-blue-400' },
    warning: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-500', icon: AlertTriangle, iconColor: 'text-amber-600 dark:text-amber-400' },
    success: { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-500', icon: Check, iconColor: 'text-green-600 dark:text-green-400' }
  }[type];
  const Icon = styles.icon;
  return (
    <div className={`${styles.bg} border-l-4 ${styles.border} p-4 rounded-r-lg mb-6`}>
      {title && <div className="flex items-center gap-2 mb-2 font-bold text-gray-900 dark:text-white"><Icon size={18} className={styles.iconColor} />{title}</div>}
      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{children}</div>
    </div>
  );
};

export const ChecklistItem = ({ label }) => {
  const [checked, setChecked] = useState(false);
  return (
    <div onClick={() => setChecked(!checked)} className={`flex items-center p-3 mb-2 bg-white dark:bg-gray-800 rounded-lg border cursor-pointer transition-all ${checked ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'}`}>
      <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${checked ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600'}`}>{checked && <Check size={14} className="text-white" />}</div>
      <span className={checked ? 'text-gray-500 dark:text-gray-500 line-through' : 'text-gray-700 dark:text-gray-200 font-medium'}>{label}</span>
    </div>
  );
};

export const CodeBlock = ({ code, label = "JSON" }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="relative bg-slate-900 rounded-lg overflow-hidden my-4 border border-slate-700 shadow-lg">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-800 border-b border-slate-700"><span className="text-xs font-mono text-slate-400">{label}</span><button onClick={handleCopy} className="text-xs flex items-center gap-1 text-slate-400 hover:text-white">{copied ? <Check size={14} className="text-green-400"/> : <Copy size={14}/>}{copied ? "Kopiert!" : "Kopieren"}</button></div>
      <pre className="p-4 text-xs font-mono text-green-400 overflow-x-auto whitespace-pre-wrap">{code}</pre>
    </div>
  );
};

export const NewsWidget = ({ news }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Bell size={18} className="text-blue-600 dark:text-blue-400"/> Updates</h3>
        <div className="space-y-4">
            {news && news.length > 0 ? news.map((item, i) => (
                <div key={item.id || i} className="flex gap-3 text-sm">
                    <span className="font-mono text-gray-400 shrink-0">{item.date}</span>
                    <span className="text-gray-700 dark:text-gray-300">
                        {item.type === 'alert' && '🔴 '} {item.type === 'update' && '🔵 '} {item.type === 'info' && '🟢 '} {item.text}
                    </span>
                </div>
            )) : <div className="text-gray-400 text-sm">Keine aktuellen Nachrichten.</div>}
        </div>
    </div>
);