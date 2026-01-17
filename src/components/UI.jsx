import React, { useState } from 'react';
import { Star, Check, Info, AlertTriangle, Copy, Sparkles, Bell } from 'lucide-react';

// --- CARD: Aeonik Black, rounded-k5-lg, Digital Blue Accent ---
export const Card = ({ icon: Icon, title, desc, onClick, isFavorite, onToggleFavorite, hasUpdate }) => (
  <div 
    onClick={onClick} 
    className="bg-white dark:bg-k5-black p-8 rounded-k5-lg shadow-sm border border-gray-100 dark:border-k5-deep hover:shadow-2xl hover:shadow-k5-digital/10 hover:-translate-y-1 transition-all cursor-pointer group relative h-full flex flex-col font-sans"
  >
    {/* Status Badge: Aeonik Bold & Glow */}
    {hasUpdate && (
        <div className="absolute top-6 left-6 bg-k5-digital text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-lg shadow-k5-digital/40 animate-pulse z-10 tracking-widest uppercase">
            New
        </div>
    )}

    {/* Favorite Toggle: Sand Accent */}
    {onToggleFavorite && (
        <button 
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }} 
            className={`absolute top-6 right-6 p-2 rounded-k5-sm transition-all z-10 ${
                isFavorite 
                ? 'text-k5-sand bg-k5-sand/10 shadow-inner' 
                : 'text-gray-300 dark:text-k5-deep hover:text-k5-sand hover:bg-k5-sand/5'
            }`}
        >
            <Star size={20} fill={isFavorite ? "currentColor" : "none"} strokeWidth={isFavorite ? 0 : 2} />
        </button>
    )}

    {/* Icon Area: rounded-k5-sm */}
    <div className="mb-8 mt-2">
      <div className="w-14 h-14 bg-k5-light-grey dark:bg-k5-deep rounded-k5-sm flex items-center justify-center group-hover:bg-glow-digital group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-k5-digital/30">
        <Icon size={28} className="text-k5-digital dark:text-k5-digital group-hover:text-white transition-colors" />
      </div>
    </div>

    {/* Typography: Aeonik Black Title */}
    <h3 className="font-black text-xl text-k5-black dark:text-white mb-3 pr-8 uppercase tracking-tighter leading-tight group-hover:text-k5-digital transition-colors">
        {title}
    </h3>
    <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 leading-relaxed flex-grow">
        {desc}
    </p>

    {/* Bottom Accent */}
    <div className="w-8 h-1 bg-gray-100 dark:bg-k5-deep mt-6 rounded-full group-hover:w-full group-hover:bg-k5-digital transition-all duration-700" />
  </div>
);

// --- INFO BOX: Handbook Style, rounded-k5-md ---
export const InfoBox = ({ type = 'info', title, children }) => {
  const styles = {
    info: { 
        bg: 'bg-k5-digital/5 dark:bg-k5-digital/10', 
        border: 'border-k5-digital/30', 
        icon: Info, 
        iconColor: 'text-k5-digital',
        label: 'Handbook Note'
    },
    warning: { 
        bg: 'bg-k5-sand/5 dark:bg-k5-sand/10', 
        border: 'border-k5-sand/30', 
        icon: AlertTriangle, 
        iconColor: 'text-k5-sand',
        label: 'Attention Required'
    },
    success: { 
        bg: 'bg-k5-lime/5 dark:bg-k5-lime/10', 
        border: 'border-k5-lime/30', 
        icon: Check, 
        iconColor: 'text-k5-lime',
        label: 'System Confirmed'
    }
  }[type];

  const Icon = styles.icon;

  return (
    <div className={`${styles.bg} border-2 ${styles.border} p-6 rounded-k5-md mb-8 relative overflow-hidden group transition-all font-sans`}>
      <div className="absolute top-0 right-0 p-4 opacity-5 text-current group-hover:opacity-10 transition-opacity">
        <Icon size={80} />
      </div>
      
      <div className="flex flex-col gap-1 mb-4">
        <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${styles.iconColor} opacity-70`}>
            {styles.label}
        </span>
        {title && (
            <div className="flex items-center gap-3 font-black text-lg text-k5-black dark:text-white uppercase tracking-tighter">
                <Icon size={20} className={styles.iconColor} />
                {title}
            </div>
        )}
      </div>

      <div className="text-[14px] font-bold text-gray-700 dark:text-gray-200 leading-relaxed relative z-10">
        {children}
      </div>
    </div>
  );
};

// --- CHECKLIST ITEM: rounded-k5-sm & Aeonik Bold ---
export const ChecklistItem = ({ label }) => {
  const [checked, setChecked] = useState(false);
  return (
    <div 
        onClick={() => setChecked(!checked)} 
        className={`flex items-center p-5 mb-3 rounded-k5-sm border cursor-pointer transition-all duration-300 font-sans ${
            checked 
            ? 'border-k5-digital/20 bg-k5-digital/5' 
            : 'bg-white dark:bg-k5-black border-gray-100 dark:border-k5-deep hover:border-k5-digital/30'
        }`}
    >
      <div className={`w-6 h-6 rounded-k5-sm border-2 mr-4 flex items-center justify-center transition-all ${
          checked 
          ? 'bg-k5-digital border-k5-digital shadow-lg shadow-k5-digital/25' 
          : 'border-gray-200 dark:border-k5-deep bg-white dark:bg-k5-black'
      }`}>
        {checked && <Check size={14} strokeWidth={4} className="text-white" />}
      </div>
      <span className={`text-[13px] font-bold uppercase tracking-tight transition-all ${
          checked 
          ? 'text-gray-400 line-through' 
          : 'text-k5-black dark:text-gray-200'
      }`}>
        {label}
      </span>
    </div>
  );
};

// --- CODE BLOCK: Aeonik Mono & k5-black Look ---
export const CodeBlock = ({ code, label = "SYSTEM_NODE" }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  
  return (
    <div className="relative bg-k5-black rounded-k5-md overflow-hidden my-8 border border-k5-deep shadow-2xl font-sans">
      <div className="flex justify-between items-center px-6 py-4 bg-k5-deep/30 border-b border-k5-deep">
        <div className="flex items-center gap-2">
            <Sparkles size={12} className="text-k5-sand" />
            <span className="text-[10px] font-bold text-k5-sand uppercase tracking-[0.2em]">{label}</span>
        </div>
        <button 
            onClick={handleCopy} 
            className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${
                copied ? 'text-k5-lime' : 'text-gray-400 hover:text-white'
            }`}
        >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy Source"}
        </button>
      </div>
      <pre className="p-6 text-xs font-mono text-k5-digital overflow-x-auto whitespace-pre-wrap leading-relaxed">
        <code className="text-gray-300">
            {code}
        </code>
      </pre>
      {/* Visual terminal dots */}
      <div className="absolute bottom-4 right-6 flex gap-1.5 opacity-20">
          <div className="w-1 h-1 rounded-full bg-white" />
          <div className="w-1 h-1 rounded-full bg-white" />
          <div className="w-1 h-1 rounded-full bg-white" />
      </div>
    </div>
  );
};