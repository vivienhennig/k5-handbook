import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Menu, X, ChevronDown, ChevronUp, Check, AlertTriangle, 
  Info, ArrowRight, User, Shield, LifeBuoy, FileText, 
  CreditCard, Layout, MousePointer, Cpu, Users, Copy, Database, Send, BarChart,
  Globe, Image, Type, Printer, Smartphone, Wifi, Zap, Settings, List, PenTool, Flag, MessageSquare, LogIn, LogOut, Lock, Star, Moon, Sun
} from 'lucide-react';

// --- MOCK API SERVICES ---

const feedbackApi = {
    async submit(data) {
        console.log("Sende an DB...", data);
        return new Promise((resolve) => {
            setTimeout(() => {
                const currentData = JSON.parse(localStorage.getItem('k5_feedback_db') || '[]');
                const newRecord = { 
                    id: crypto.randomUUID(), 
                    createdAt: new Date().toISOString(),
                    status: 'open',
                    ...data 
                };
                localStorage.setItem('k5_feedback_db', JSON.stringify([newRecord, ...currentData]));
                resolve({ success: true });
            }, 600);
        });
    },

    async getAll() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const data = JSON.parse(localStorage.getItem('k5_feedback_db') || '[]');
                resolve(data);
            }, 600);
        });
    }
};

const userApi = {
    async getFavorites(username) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const favs = JSON.parse(localStorage.getItem(`k5_favs_${username}`) || '[]');
                resolve(favs);
            }, 400);
        });
    },

    async saveFavorites(username, newFavorites) {
        return new Promise((resolve) => {
            setTimeout(() => {
                localStorage.setItem(`k5_favs_${username}`, JSON.stringify(newFavorites));
                console.log(`Favoriten für ${username} in DB gespeichert:`, newFavorites);
                resolve({ success: true });
            }, 400);
        });
    },

    async markSectionRead(username, sectionId) {
        return new Promise((resolve) => {
            const history = JSON.parse(localStorage.getItem(`k5_read_${username}`) || '{}');
            history[sectionId] = new Date().toISOString();
            localStorage.setItem(`k5_read_${username}`, JSON.stringify(history));
            resolve({ success: true });
        });
    },

    async getUserData(username) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const favs = JSON.parse(localStorage.getItem(`k5_favs_${username}`) || '[]');
                const readHistory = JSON.parse(localStorage.getItem(`k5_read_${username}`) || '{}');
                resolve({ favorites: favs, readHistory: readHistory });
            }, 400);
        });
    }
};

const authService = {
    async login(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const namePart = email.split('@')[0];
                const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

                if (password === 'k5') {
                    resolve({ 
                        id: 'admin_1', 
                        name: displayName + ' (Admin)', 
                        role: 'admin', 
                        avatar: '👨‍✈️'
                    });
                } else {
                    resolve({ 
                        id: `user_${Date.now()}`, 
                        name: displayName, 
                        role: 'user', 
                        avatar: '👤'
                    });
                }
            }, 800);
        });
    }
};

// --- DATA & CONTENT ---

const K5_COLORS = [
  { name: 'Deep Blue', hex: '#052364', text: 'white' },
  { name: 'Digital Blue', hex: '#092AFF', text: 'white' },
  { name: 'Heritage Blue', hex: '#00a5e5', text: 'white' },
  { name: 'Black', hex: '#000000', text: 'white' },
  { name: 'Lime', hex: '#E9FF86', text: 'black' },
  { name: 'Light Grey', hex: '#F5F5F5', text: 'black' }
];

const SECTIONS_CONFIG = [
  { id: 'web', title: "Webseite Guidelines", desc: "Content, Bilder, SEO und Design.", icon: Layout, lastUpdated: '2025-11-01T10:00:00Z' },
  { id: 'vivenu', title: "Vivenu Event Setup", desc: "Einstellungen und Checklisten für neue Events.", icon: CreditCard, lastUpdated: '2025-12-01T10:00:00Z' },
  // { id: 'exhibitor', title: "Ausstellerportal", desc: "Partner Onboarding, Login & Assets.", icon: Users, lastUpdated: '2025-11-15T10:00:00Z' }, // HIDDEN
  { id: 'support', title: "Customer Support", desc: "Playbook, Snippets & Eskalations-Matrix.", icon: LifeBuoy, lastUpdated: '2026-01-14T14:30:00Z' },
  { id: 'tickets', title: "Ticket Logik", desc: "Preise, Kategorien und Phasen.", icon: FileText, lastUpdated: '2026-01-10T09:00:00Z' },
  { id: 'votings', title: "Voting System", desc: "Awards, User Flow & Tech Stack.", icon: MousePointer, lastUpdated: '2025-10-01T10:00:00Z' },
  { id: 'brand', title: "Branding & Assets", desc: "Farben, Logos, Typo und Assets (v1.0).", icon: FileText, lastUpdated: '2025-09-01T10:00:00Z' }, 
  { id: 'accreditation', title: "Vor Ort Akkreditierung", desc: "Voraussetzungen und Setup der Akkreditierung.", icon: Shield, lastUpdated: '2025-12-10T10:00:00Z' }, 
  { id: 'automation', title: "Automation Check", desc: "Ist dein Prozess automatisierbar?", icon: Cpu, lastUpdated: '2025-08-01T10:00:00Z' }
];

const CONTACTS = [
  { topic: "Tickets / Rechnungen", responsible: "Marina & Micha (M&M)", backup: "Caro & Kati" },
  { topic: "App / Programm", responsible: "Marina & Micha (M&M)", backup: "Caro & Kati" },
  { topic: "Stornierungen", responsible: "Caro (Statistik)", backup: "-" },
  { topic: "Wartelisten", responsible: "Kati", backup: "Caro" },
  { topic: "Presse", responsible: "Caro", backup: "-" },
  { topic: "Hotel / Vor Ort", responsible: "M&M", backup: "Verena L. & Kathi" },
];

const SNIPPETS = [
  {
    id: "snip_ticket",
    title: "🎟️ Ticket nicht erhalten",
    text: `Hallo [Name],\n\nvielen Dank für deine Nachricht.\n\nIch habe gerade im System nachgeschaut: Deine Bestellung war erfolgreich! 🎉\nManchmal landen die Tickets im Spam-Ordner. Der Absender ist "Vivenu".\n\nIch habe dir das Ticket zur Sicherheit nochmal an [Email] gesendet.\nSag Bescheid, falls es immer noch nicht da ist.\n\nLiebe Grüße,\n[Dein Name]`
  },
  {
    id: "snip_invoice",
    title: "📄 Rechnung ändern (Adresse)",
    text: `Hallo [Name],\n\ndanke für die Info. Ich habe die Rechnungsadresse wie gewünscht angepasst.\nAnbei findest du die korrigierte Rechnung als PDF.\n\nBeste Grüße,\n[Dein Name]`
  },
  {
    id: "snip_cancel",
    title: "⛔ Storno Anfrage (Ablehnung)",
    text: `Hallo [Name],\n\ndanke für deine Nachricht. Es tut uns leid zu hören, dass du nicht dabei sein kannst.\n\nLeider sind unsere Tickets laut AGB generell vom Umtausch und der Rückgabe ausgeschlossen. Daher können wir den Betrag nicht erstatten.\n\nDu kannst dein Ticket aber jederzeit an einen Kollegen oder Bekannten weitergeben. Nutze dafür einfach den Link in deiner Bestätigungsmail ("Ticket verwalten").\n\nHoffentlich klappt es beim nächsten Mal!\n\nViele Grüße,\n[Dein Name]`
  }
];

const TICKET_PHASES = [
  { name: "Early Bird", date: "bis 31.03.", price: "499€" },
  { name: "Late Bird", date: "bis 30.04.", price: "599€" },
  { name: "Regular", date: "bis 28.05.", price: "699€" },
  { name: "Last Minute", date: "bis 13.06.", price: "799€" },
  { name: "Full Price", date: "bis 25.06.", price: "899€" },
];

const VOTING_BLUEPRINT = `{
  "name": "Award Voting Workflow",
  "nodes": [
    {
      "parameters": { "httpMethod": "POST", "path": "vote-submit" },
      "name": "Typeform Trigger",
      "type": "n8n-nodes-base.webhook",
      "notes": "Produktions-URL in Typeform eintragen"
    },
    {
      "parameters": { "jsCode": "// Logic: Check User Status..." },
      "name": "Validation Logic",
      "type": "n8n-nodes-base.code"
    },
    {
      "parameters": { "conditions": { "boolean": [{ "value1": "={{ $json.hasVotedCategory }}", "value2": true }] } },
      "name": "Duplicate?",
      "type": "n8n-nodes-base.if"
    }
  ]
}`;

const AVAILABLE_TOOLS = [
  'Hubspot', 'Brevo', 'Google Sheets', 'Vivenu', 'Asana', 'Gmail',
  'Slack', 'Google Docs', 'Typeform', 'Wordpress'
];

// --- COMPONENTS ---

const LoginModal = ({ isOpen, onClose, onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!email.toLowerCase().endsWith('@k5-gmbh.com')) {
            setError('Zugriff verweigert. Bitte nutze deine @k5-gmbh.com Adresse.');
            return;
        }

        setIsLoading(true);
        try {
            const user = await authService.login(email, password);
            onLogin(user);
            onClose();
            setEmail('');
            setPassword('');
        } catch (error) {
            setError("Login fehlgeschlagen. Bitte prüfe deine Daten.");
        }
        setIsLoading(false);
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-8 animate-in zoom-in-95 duration-200">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User size={32} className="text-blue-600 dark:text-blue-300"/>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">K5 Login</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Bitte logge dich mit deiner Firmen-Email ein.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">E-Mail Adresse</label>
                        <input 
                            type="email" 
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="name@k5-gmbh.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Passwort</label>
                            <span className="text-[10px] text-gray-400">Admin Code: k5</span>
                        </div>
                        <input 
                            type="password" 
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Dein Passwort"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs p-3 rounded-lg flex items-center gap-2">
                            <AlertTriangle size={14} className="shrink-0"/>
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? "Prüfe..." : "Einloggen"}
                    </button>
                </form>
                <button onClick={onClose} className="w-full mt-4 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">Abbrechen</button>
            </div>
        </div>
    );
};

const FeedbackModal = ({ isOpen, onClose, context, user }) => {
  const [type, setType] = useState('outdated');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await feedbackApi.submit({
        type,
        comment,
        context,
        userName: user ? user.name : 'Gast',
        userRole: user ? user.role : 'guest'
      });
      
      alert('Danke für dein Feedback! Wir kümmern uns darum.');
      setComment('');
      onClose();
    } catch (e) {
      console.error("Error submitting feedback: ", e);
      alert('Fehler beim Senden. Bitte versuche es später.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
          <Flag className="text-red-500" size={20}/> Problem melden
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Kontext: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">{context}</span>
        </p>

        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Was ist das Problem?</label>
        <div className="flex gap-2 mb-4">
          <button 
            onClick={() => setType('outdated')} 
            className={`flex-1 py-2 px-3 rounded text-sm border ${type === 'outdated' ? 'bg-red-50 border-red-500 text-red-700 dark:bg-red-900/30 dark:text-red-300 font-bold' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}
          >
            Veraltet ⏳
          </button>
          <button 
            onClick={() => setType('error')} 
            className={`flex-1 py-2 px-3 rounded text-sm border ${type === 'error' ? 'bg-red-50 border-red-500 text-red-700 dark:bg-red-900/30 dark:text-red-300 font-bold' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}
          >
            Fehler 🐛
          </button>
          <button 
            onClick={() => setType('suggestion')} 
            className={`flex-1 py-2 px-3 rounded text-sm border ${type === 'suggestion' ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-bold' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}
          >
            Idee 💡
          </button>
        </div>

        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Kommentar (Optional)</label>
        <textarea 
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none mb-6"
          rows="3"
          placeholder="Z.B. Der Preis hat sich geändert..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium text-sm">Abbrechen</button>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Sende...' : 'Feedback senden'}
          </button>
        </div>
      </div>
    </div>
  );
};


const Card = ({ icon: Icon, title, desc, onClick, isFavorite, onToggleFavorite, hasUpdate }) => (
  <div 
    onClick={onClick}
    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-t-4 border-blue-600 hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer group relative border border-gray-200 dark:border-gray-700"
  >
    {hasUpdate && (
        <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md animate-pulse z-10">
            NEU
        </div>
    )}

    {onToggleFavorite && (
        <button 
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
            className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors z-10 ${isFavorite ? 'text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30'}`}
            title={isFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
        >
            <Star size={20} fill={isFavorite ? "currentColor" : "none"} />
        </button>
    )}

    <div className="flex items-center justify-between mb-4 mt-2">
      <div className="p-3 bg-blue-50 dark:bg-gray-700 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
        <Icon size={24} className="text-blue-600 dark:text-blue-400 group-hover:text-white" />
      </div>
    </div>
    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 pr-8">{title}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
  </div>
);

const InfoBox = ({ type = 'info', title, children }) => {
  const styles = {
    info: { 
        bg: 'bg-blue-50 dark:bg-blue-900/20', 
        border: 'border-blue-600', 
        icon: Info, 
        iconColor: 'text-blue-600 dark:text-blue-400' 
    },
    warning: { 
        bg: 'bg-amber-50 dark:bg-amber-900/20', 
        border: 'border-amber-500', 
        icon: AlertTriangle, 
        iconColor: 'text-amber-600 dark:text-amber-400' 
    },
    success: { 
        bg: 'bg-green-50 dark:bg-green-900/20', 
        border: 'border-green-500', 
        icon: Check, 
        iconColor: 'text-green-600 dark:text-green-400' 
    }
  }[type];

  const Icon = styles.icon;

  return (
    <div className={`${styles.bg} border-l-4 ${styles.border} p-4 rounded-r-lg mb-6`}>
      {title && (
        <div className="flex items-center gap-2 mb-2 font-bold text-gray-900 dark:text-white">
          <Icon size={18} className={styles.iconColor} />
          {title}
        </div>
      )}
      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{children}</div>
    </div>
  );
};

const ChecklistItem = ({ label }) => {
  const [checked, setChecked] = useState(false);
  return (
    <div 
      onClick={() => setChecked(!checked)}
      className={`flex items-center p-3 mb-2 bg-white dark:bg-gray-800 rounded-lg border cursor-pointer transition-all ${checked ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500'}`}
    >
      <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${checked ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600'}`}>
        {checked && <Check size={14} className="text-white" />}
      </div>
      <span className={checked ? 'text-gray-500 dark:text-gray-500 line-through' : 'text-gray-700 dark:text-gray-200 font-medium'}>{label}</span>
    </div>
  );
};

const CodeBlock = ({ code, label = "JSON Blueprint" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-slate-900 rounded-lg overflow-hidden my-4 border border-slate-700 shadow-lg">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-800 border-b border-slate-700">
        <span className="text-xs font-mono text-slate-400">{label}</span>
        <button 
          onClick={handleCopy}
          className="text-xs flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
        >
          {copied ? <Check size={14} className="text-green-400"/> : <Copy size={14}/>}
          {copied ? "Kopiert!" : "Kopieren"}
        </button>
      </div>
      <pre className="p-4 text-xs font-mono text-green-400 overflow-x-auto whitespace-pre-wrap">
        {code}
      </pre>
    </div>
  );
};

// --- WIZARD COMPONENT ---

const Wizard = () => {
  const [step, setStep] = useState(1);
  const [history, setHistory] = useState([]);
  
  const [selectedTools, setSelectedTools] = useState([]);
  const [toolDescriptions, setToolDescriptions] = useState({});
  const [automationMode, setAutomationMode] = useState(''); 

  const next = (nextStep) => {
    setHistory([...history, step]);
    setStep(nextStep);
  };

  const back = () => {
    const prev = history.pop();
    setHistory([...history]);
    setStep(prev || 1);
  };

  const reset = () => {
    setStep(1);
    setHistory([]);
    setSelectedTools([]);
    setToolDescriptions({});
    setAutomationMode('');
  };

  const toggleTool = (tool) => {
    if (selectedTools.includes(tool)) {
      setSelectedTools(selectedTools.filter(t => t !== tool));
    } else {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  const updateDescription = (tool, desc) => {
    setToolDescriptions({...toolDescriptions, [tool]: desc});
  };

  const moveTool = (index, direction) => {
    const newTools = [...selectedTools];
    if (index + direction < 0 || index + direction >= newTools.length) return;
    
    const temp = newTools[index];
    newTools[index] = newTools[index + direction];
    newTools[index + direction] = temp;
    
    setSelectedTools(newTools);
  };

  const generateN8nJson = () => {
    const nodes = selectedTools.map((tool, index) => ({
      parameters: {},
      name: tool,
      type: "n8n-nodes-base." + tool.toLowerCase().replace(' ', ''),
      typeVersion: 1,
      position: [250 + (index * 200), 300],
      notes: toolDescriptions[tool] || (index === 0 ? "Trigger" : "Action")
    }));
    
    nodes.unshift({
        parameters: {},
        name: "Start",
        type: "n8n-nodes-base.start",
        typeVersion: 1,
        position: [50, 300]
    });

    const connections = {};
    for (let i = 0; i < nodes.length - 1; i++) {
        connections[nodes[i].name] = { main: [[{ node: nodes[i+1].name, type: "main", index: 0 }]] };
    }

    return JSON.stringify({ nodes, connections }, null, 2);
  };

  return (
    <div className="bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-8 text-center max-w-2xl mx-auto my-8 min-h-[400px] flex flex-col justify-center">
      
      {/* STEP 1: Frequency */}
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-black text-blue-900 dark:text-blue-300 mb-6">1. Wie oft führst du den Prozess aus?</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => next(2)} className="px-6 py-3 bg-white dark:bg-gray-700 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-300 font-bold rounded-full hover:bg-blue-600 hover:text-white transition-all">Täglich / Wöchentlich</button>
            <button onClick={() => next(2)} className="px-6 py-3 bg-white dark:bg-gray-700 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-300 font-bold rounded-full hover:bg-blue-600 hover:text-white transition-all">Monatlich (viele Daten)</button>
            <button onClick={() => next(99)} className="px-6 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 font-bold rounded-full hover:border-gray-400 transition-all">Selten (1-2x Jahr)</button>
          </div>
        </div>
      )}

      {/* STEP 2: Logic */}
      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-black text-blue-900 dark:text-blue-300 mb-6">2. Folgt der Prozess festen Regeln?</h3>
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-left mb-6 text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 inline-block">
            <strong>Beispiel für JA:</strong> "Wenn E-Mail Betreff 'Rechnung' enthält &rarr; speichere Anhang."
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => next(3)} className="px-6 py-3 bg-white dark:bg-gray-700 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-300 font-bold rounded-full hover:bg-blue-600 hover:text-white transition-all">Ja, feste Logik</button>
            <button onClick={() => next(98)} className="px-6 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 font-bold rounded-full hover:border-gray-400 transition-all">Nein, Bauchgefühl nötig</button>
          </div>
        </div>
      )}

      {/* STEP 3: Tool Selection */}
      {step === 3 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-black text-blue-900 dark:text-blue-300 mb-2">3. Welche Tools sind beteiligt?</h3>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Wähle alle Tools aus, die verbunden werden sollen.</p>
          
          <div className="grid grid-cols-2 gap-3 text-left mb-6 max-w-md mx-auto">
            {AVAILABLE_TOOLS.map(tool => (
              <div 
                key={tool}
                onClick={() => toggleTool(tool)}
                className={`p-3 border rounded-lg cursor-pointer flex items-center justify-between transition-all ${selectedTools.includes(tool) ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-500' : 'border-gray-200 dark:border-gray-600 dark:bg-gray-700 hover:border-blue-300'}`}
              >
                <span className="font-medium text-sm dark:text-gray-200">{tool}</span>
                {selectedTools.includes(tool) && <Check size={16} className="text-blue-600 dark:text-blue-400"/>}
              </div>
            ))}
          </div>

          <div className="flex justify-center">
             <button 
                onClick={() => selectedTools.length > 0 ? next(4) : alert('Bitte wähle mindestens ein Tool.')}
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
             >
               API Check & Weiter &rarr;
             </button>
          </div>
        </div>
      )}

      {/* STEP 4: Complexity */}
      {step === 4 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-black text-blue-900 dark:text-blue-300 mb-6">4. Wie komplex ist der Ablauf?</h3>
          <div className="flex flex-col gap-4 max-w-sm mx-auto">
            <button onClick={() => { setAutomationMode('zapier'); next(5); }} className="p-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-600 hover:shadow-md transition-all text-left group">
              <div className="flex items-center gap-2 font-bold text-lg mb-1 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"><Zap size={20}/> Einfach / Linear</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">"Wenn das passiert, dann mach das." (Z.B. Neuer Lead &rarr; E-Mail senden)</div>
            </button>
            <button onClick={() => { setAutomationMode('n8n'); next(5); }} className="p-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-600 hover:shadow-md transition-all text-left group">
              <div className="flex items-center gap-2 font-bold text-lg mb-1 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"><Cpu size={20}/> Komplex / Logik</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Mehrere Schritte, Bedingungen, Berechnungen oder DSGVO-kritische Daten.</div>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Configuration */}
      {step === 5 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
          <h3 className="text-2xl font-black text-blue-900 dark:text-blue-300 mb-2 text-center">5. Konfigurator ({automationMode})</h3>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">Beschreibe kurz, was jedes Tool tun soll. (Pos 1 = Trigger)</p>

          <div className="space-y-4 mb-8">
            {selectedTools.map((tool, index) => (
              <div key={tool} className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 flex flex-col md:flex-row gap-4 items-center">
                <div className="flex items-center gap-3 w-full md:w-1/3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold flex-shrink-0">{index + 1}</div>
                  
                  <div className="flex flex-col">
                    <span className="font-bold dark:text-white">{tool}</span>
                    <span className={`text-xs uppercase px-2 py-0.5 rounded w-max ${index === 0 ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300' : 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-300'}`}>
                        {index === 0 ? '⚡ Trigger' : '▶ Action'}
                    </span>
                  </div>

                  {/* Move Controls */}
                  <div className="flex flex-col ml-auto">
                    <button 
                        onClick={() => moveTool(index, -1)} 
                        disabled={index === 0}
                        className="text-gray-400 hover:text-blue-600 disabled:opacity-20 disabled:hover:text-gray-400"
                    >
                        <ChevronUp size={16} />
                    </button>
                    <button 
                        onClick={() => moveTool(index, 1)} 
                        disabled={index === selectedTools.length - 1}
                        className="text-gray-400 hover:text-blue-600 disabled:opacity-20 disabled:hover:text-gray-400"
                    >
                        <ChevronDown size={16} />
                    </button>
                  </div>
                </div>
                
                <input 
                  type="text" 
                  placeholder={index === 0 ? "Z.B. Neuer Kontakt erstellt" : "Z.B. Nachricht in Channel senden"}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-500 dark:bg-gray-800 dark:text-white rounded text-sm w-full"
                  value={toolDescriptions[tool] || ''}
                  onChange={(e) => updateDescription(tool, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center">
             <button 
                onClick={() => next(6)}
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
             >
               {automationMode === 'n8n' ? <Cpu size={18}/> : <Zap size={18}/>}
               Blueprint generieren
             </button>
          </div>
        </div>
      )}

      {/* STEP 6: Result (Generated Code) */}
      {step === 6 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32}/>
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Dein {automationMode === 'n8n' ? 'Workflow Blueprint' : 'Rezept'} ist fertig!</h3>
          </div>

          {automationMode === 'n8n' ? (
            <div className="text-left">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 text-center">Kopiere diesen JSON-Code und füge ihn direkt in n8n (Strg+V) ein.</p>
                <CodeBlock code={generateN8nJson()} label="n8n Workflow JSON" />
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-left mb-6">
                <h4 className="font-bold text-lg mb-4 border-b dark:border-gray-700 pb-2 flex items-center gap-2 text-gray-900 dark:text-white"><Zap className="text-orange-500"/> Zapier Rezept</h4>
                <ol className="space-y-4 relative border-l-2 border-gray-100 dark:border-gray-700 ml-3 pl-6">
                    {selectedTools.map((tool, i) => (
                        <li key={i} className="relative">
                            <span className="absolute -left-[31px] top-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">{i+1}</span>
                            <div className="font-bold text-gray-900 dark:text-white">{tool}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{toolDescriptions[tool] || (i===0 ? "Trigger Event wählen" : "Action definieren")}</div>
                        </li>
                    ))}
                </ol>
                <div className="mt-6 text-center">
                    <a href="https://zapier.com/app/editor" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:underline">
                        In Zapier öffnen <ArrowRight size={16}/>
                    </a>
                </div>
            </div>
          )}

          <button onClick={reset} className="mt-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm underline">Neuen Check starten</button>
        </div>
      )}

      {/* FAIL STATES */}
      {step === 99 && (
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Nicht automatisieren</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Der Aufwand lohnt sich nicht für so seltene Fälle.</p>
          <button onClick={reset} className="underline text-gray-500 hover:text-blue-600">Neu starten</button>
        </div>
      )}
      
      {step === 98 && (
        <div className="text-center">
          <div className="text-4xl mb-4">🧠</div>
          <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Manuelle Bearbeitung empfohlen</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Prozesse, die "Bauchgefühl" brauchen, sind schwer zu automatisieren.</p>
          <button onClick={reset} className="underline text-gray-500 hover:text-blue-600">Neu starten</button>
        </div>
      )}

      {step > 1 && step < 6 && step !== 99 && step !== 98 && (
        <button onClick={back} className="mt-8 text-sm text-gray-400 hover:text-gray-600 underline">Zurück</button>
      )}
    </div>
  );
};

// --- MAIN APP ---

export default function K5HandbookApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackContext, setFeedbackContext] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userFavorites, setUserFavorites] = useState([]);
  const [userReadHistory, setUserReadHistory] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  
  const [adminFeedbackList, setAdminFeedbackList] = useState([]);
  
  useEffect(() => {
      if (localStorage.getItem('k5_dark_mode') === 'true') {
          setDarkMode(true);
      }

      const storedUser = localStorage.getItem('k5_session_user');
      if (storedUser) {
          const u = JSON.parse(storedUser);
          setUser(u);
          userApi.getUserData(u.name).then(data => {
              setUserFavorites(data.favorites);
              setUserReadHistory(data.readHistory);
          });
      }
  }, []);

  const toggleDarkMode = () => {
      const newVal = !darkMode;
      setDarkMode(newVal);
      localStorage.setItem('k5_dark_mode', newVal);
  };

  const handleLogin = (loggedInUser) => {
      setUser(loggedInUser);
      localStorage.setItem('k5_session_user', JSON.stringify(loggedInUser));
      userApi.getUserData(loggedInUser.name).then(data => {
          setUserFavorites(data.favorites);
          setUserReadHistory(data.readHistory);
      });
  };

  const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('k5_session_user');
      setUserFavorites([]);
      setUserReadHistory({});
  };

  const toggleFavorite = (cardId) => {
      if (!user) {
          alert("Bitte logge dich ein, um Favoriten zu speichern.");
          setLoginModalOpen(true);
          return;
      }
      
      let newFavs;
      if (userFavorites.includes(cardId)) {
          newFavs = userFavorites.filter(id => id !== cardId);
      } else {
          newFavs = [...userFavorites, cardId];
      }
      
      setUserFavorites(newFavs);
      userApi.saveFavorites(user.name, newFavs);
  };
  
  const handleNav = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setSearchQuery('');
    window.scrollTo(0, 0);

    if (user && userReadHistory) {
        userApi.markSectionRead(user.name, tab).then(() => {
            setUserReadHistory({
                ...userReadHistory,
                [tab]: new Date().toISOString()
            });
        });
    }
  };

  const hasUpdate = (sectionId) => {
      if (!user) return false; 
      const section = SECTIONS_CONFIG.find(s => s.id === sectionId);
      if (!section || !section.lastUpdated) return false;

      const lastRead = userReadHistory[sectionId];
      if (!lastRead) return true;

      return new Date(section.lastUpdated) > new Date(lastRead);
  };


  useEffect(() => {
    if (activeTab === 'admin' && user?.role === 'admin') {
       feedbackApi.getAll().then(setAdminFeedbackList);
    }
  }, [activeTab, user]);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const lowerQ = searchQuery.toLowerCase();
    
    const searchable = [
      { id: 'support', title: 'Support Rules (24h)', text: '24h antwortzeit duzen regeln', section: 'Support' },
      { id: 'support', title: 'Eskalations Matrix', text: 'l1 l2 l3 management storno kulanz', section: 'Support' },
      { id: 'vivenu', title: 'Vivenu Setup', text: 'event erstellen steuern 19% verstecken', section: 'Events' },
      { id: 'tickets', title: 'Ticket Preise', text: 'early bird late bird kosten preise', section: 'Tickets' },
      // { id: 'exhibitor', title: 'Partner Login', text: 'portal zugang passwort aussteller', section: 'Partners' }, // HIDDEN
      { id: 'brand', title: 'Brand Colors', text: 'blau hex code logo download', section: 'Brand' },
      { id: 'votings', title: 'Voting Setup', text: 'award abstimmung typeform n8n', section: 'Tech' },
      { id: 'accreditation', title: 'Scan App', text: 'scanner einlass akkreditierung', section: 'Events' },
      { id: 'web', title: 'Webseite Bilder', text: 'webp format größe upload', section: 'Web' },
    ];

    const results = searchable.filter(item => 
      item.title.toLowerCase().includes(lowerQ) || item.text.includes(lowerQ)
    );
    setSearchResults(results);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  const openFeedback = (ctx) => {
      setFeedbackContext(ctx);
      setFeedbackModalOpen(true);
  }

  const favoriteCards = useMemo(() => {
      return SECTIONS_CONFIG.filter(sec => userFavorites.includes(sec.id));
  }, [userFavorites]);

  return (
    <div className={darkMode ? "dark" : ""}>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-100 transition-colors duration-200">
      
      {/* HEADER */}
      <header className="fixed top-0 w-full bg-[#092AFF] dark:bg-blue-900 text-white z-50 h-20 shadow-md transition-colors">
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          
          <div onClick={() => handleNav('home')} className="font-black text-2xl tracking-tighter cursor-pointer flex items-center gap-2">
            K5 <span className="font-light opacity-80">HANDBOOK</span>
          </div>

          <nav className="hidden lg:flex items-center gap-8 h-full">
            <button onClick={() => handleNav('home')} className={`h-full border-b-4 px-2 font-bold uppercase text-sm tracking-wide transition-colors ${activeTab === 'home' ? 'border-white' : 'border-transparent opacity-80 hover:opacity-100'}`}>
              Home
            </button>
            <div className="group h-full flex items-center relative cursor-pointer">
              <button className={`h-full border-b-4 px-2 font-bold uppercase text-sm tracking-wide flex items-center gap-1 ${['web','brand','support'].includes(activeTab) ? 'border-white' : 'border-transparent opacity-80 hover:opacity-100'}`}>
                Guidelines <ChevronDown size={14}/>
                {(hasUpdate('web') || hasUpdate('brand') || hasUpdate('support')) && (
                    <span className="absolute top-4 right-[-5px] w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-b-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 p-6 grid grid-cols-2 gap-8 border-t border-gray-100 dark:border-gray-700">
                <div>
                  <h4 className="font-bold text-xs uppercase text-gray-400 mb-3 tracking-wider border-b dark:border-gray-700 pb-2">Identity</h4>
                  <div onClick={() => handleNav('web')} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-3 font-semibold text-sm">
                    <Layout size={18} className="text-blue-600 dark:text-blue-400"/> Webseite
                    {hasUpdate('web') && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
                  </div>
                  <div onClick={() => handleNav('brand')} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-3 font-semibold text-sm">
                    <FileText size={18} className="text-blue-600 dark:text-blue-400"/> Branding & Assets
                    {hasUpdate('brand') && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase text-gray-400 mb-3 tracking-wider border-b dark:border-gray-700 pb-2">Communication</h4>
                  <div onClick={() => handleNav('support')} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-3 font-semibold text-sm">
                    <LifeBuoy size={18} className="text-blue-600 dark:text-blue-400"/> Customer Support
                    {hasUpdate('support') && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="group h-full flex items-center relative cursor-pointer">
              <button className={`h-full border-b-4 px-2 font-bold uppercase text-sm tracking-wide flex items-center gap-1 ${['vivenu','tickets','accreditation'].includes(activeTab) ? 'border-white' : 'border-transparent opacity-80 hover:opacity-100'}`}>
                Events <ChevronDown size={14}/>
                {(hasUpdate('vivenu') || hasUpdate('tickets') || hasUpdate('accreditation')) && (
                    <span className="absolute top-4 right-[-5px] w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[500px] bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-b-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 p-6 grid grid-cols-2 gap-6 border-t border-gray-100 dark:border-gray-700">
                <div>
                  <h4 className="font-bold text-xs uppercase text-gray-400 mb-3 tracking-wider border-b dark:border-gray-700 pb-2">Setup</h4>
                  <div onClick={() => handleNav('vivenu')} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-3 font-semibold text-sm">
                    <CreditCard size={18} className="text-blue-600 dark:text-blue-400"/> Vivenu Setup
                    {hasUpdate('vivenu') && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
                  </div>
                  <div onClick={() => handleNav('tickets')} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-3 font-semibold text-sm">
                    <FileText size={18} className="text-blue-600 dark:text-blue-400"/> Tickets
                    {hasUpdate('tickets') && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase text-gray-400 mb-3 tracking-wider border-b dark:border-gray-700 pb-2">On-Site</h4>
                  <div onClick={() => handleNav('accreditation')} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-3 font-semibold text-sm">
                    <Shield size={18} className="text-blue-600 dark:text-blue-400"/> Akkreditierung
                    {hasUpdate('accreditation') && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="group h-full flex items-center relative cursor-pointer">
              <button className={`h-full border-b-4 px-2 font-bold uppercase text-sm tracking-wide flex items-center gap-1 ${['votings','automation'].includes(activeTab) ? 'border-white' : 'border-transparent opacity-80 hover:opacity-100'}`}>
                Tech <ChevronDown size={14}/>
                {(hasUpdate('votings') || hasUpdate('automation')) && (
                    <span className="absolute top-4 right-[-5px] w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
              <div className="absolute top-full right-0 w-[400px] bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-b-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 p-6 border-t border-gray-100 dark:border-gray-700">
                 <div onClick={() => handleNav('votings')} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-3 font-semibold text-sm mb-2">
                    <MousePointer size={18} className="text-blue-600 dark:text-blue-400"/> Voting System
                    {hasUpdate('votings') && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
                  </div>
                  <div onClick={() => handleNav('automation')} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-3 font-semibold text-sm">
                    <Cpu size={18} className="text-blue-600 dark:text-blue-400"/> Automation Wizard
                    {hasUpdate('automation') && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
                  </div>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-200 group-focus-within:text-blue-600 transition-colors">
                <Search size={16} />
              </div>
              <input 
                id="searchInput"
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-blue-800/50 dark:bg-blue-950/50 border border-blue-400/30 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-blue-200 focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 w-48 transition-all focus:w-64"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-200 border border-blue-400/50 rounded px-1 group-focus-within:hidden">Ctrl+K</div>
              
              {searchResults.length > 0 && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl text-gray-800 dark:text-white overflow-hidden z-50 border border-gray-100 dark:border-gray-700">
                  {searchResults.map((res, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handleNav(res.id)}
                      className="p-3 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0"
                    >
                      <div className="font-bold text-sm text-blue-600 dark:text-blue-400">{res.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">in {res.section}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={toggleDarkMode} className="text-white hover:text-blue-200 transition p-1">
                {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
            </button>

            {user?.role === 'admin' && (
                <button onClick={() => handleNav('admin')} className="text-white hover:text-blue-200 transition">
                    <Settings size={20} />
                </button>
            )}

            {user ? (
                 <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <div className="text-xs font-bold text-white">{user.name}</div>
                        <div className="text-[10px] text-blue-200 uppercase">{user.role}</div>
                    </div>
                    <button onClick={handleLogout} className="text-white hover:text-blue-200">
                        <LogOut size={20}/>
                    </button>
                 </div>
            ) : (
                <button onClick={() => setLoginModalOpen(true)} className="text-white hover:text-blue-200 flex items-center gap-2 text-sm font-bold">
                    <LogIn size={18}/> Login
                </button>
            )}

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-white">
              {mobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>
          </div>
        </div>
      </header>

      <FeedbackModal 
        isOpen={feedbackModalOpen} 
        onClose={() => setFeedbackModalOpen(false)} 
        context={feedbackContext}
        user={user}
      />
      
      <LoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
        onLogin={handleLogin}
      />

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 z-40 pt-24 px-6 overflow-y-auto lg:hidden text-gray-800 dark:text-white">
          <div className="space-y-6">
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Main</div>
              <div onClick={() => handleNav('home')} className="text-xl font-bold py-2 border-b border-gray-100 dark:border-gray-700">Home Dashboard</div>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Guidelines</div>
              <div onClick={() => handleNav('web')} className="text-xl font-bold py-2 border-b border-gray-100 dark:border-gray-700">Webseite</div>
              <div onClick={() => handleNav('brand')} className="text-xl font-bold py-2 border-b border-gray-100 dark:border-gray-700">Branding</div>
              <div onClick={() => handleNav('support')} className="text-xl font-bold py-2 border-b border-gray-100 dark:border-gray-700">Support</div>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Events</div>
              <div onClick={() => handleNav('vivenu')} className="text-xl font-bold py-2 border-b border-gray-100 dark:border-gray-700">Vivenu Setup</div>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tech</div>
              <div onClick={() => handleNav('votings')} className="text-xl font-bold py-2 border-b border-gray-100 dark:border-gray-700">Voting System</div>
              <div onClick={() => handleNav('automation')} className="text-xl font-bold py-2 border-b border-gray-100 dark:border-gray-700">Automation</div>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 lg:px-8 py-12 pt-32 max-w-6xl">
        
        {activeTab === 'home' && (
          <div className="animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-16">
              <h1 className="text-4xl lg:text-6xl font-black text-[#092AFF] dark:text-blue-400 mb-4 tracking-tight">DIGITAL HANDBOOK</h1>
              <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Der zentrale Leitfaden für Web, Events, Brand & Operations bei K5.</p>
            </div>
            
            {user && favoriteCards.length > 0 && (
                <div className="mb-12">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Star className="text-yellow-400 fill-yellow-400" size={24}/> Deine Favoriten
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favoriteCards.map((sec) => (
                             <Card 
                                key={sec.id}
                                icon={sec.icon} 
                                title={sec.title} 
                                desc={sec.desc} 
                                onClick={() => handleNav(sec.id)}
                                isFavorite={true}
                                onToggleFavorite={() => toggleFavorite(sec.id)}
                                hasUpdate={hasUpdate(sec.id)}
                            />
                        ))}
                    </div>
                    <div className="h-px bg-gray-200 dark:bg-gray-700 w-full my-12"></div>
                </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SECTIONS_CONFIG
                  .filter(sec => sec.id !== 'exhibitor') // Ensure Exhibitor is hidden
                  .map((sec) => (
                    <Card 
                        key={sec.id}
                        icon={sec.icon} 
                        title={sec.title} 
                        desc={sec.desc} 
                        onClick={() => handleNav(sec.id)}
                        isFavorite={userFavorites.includes(sec.id)}
                        onToggleFavorite={user ? () => toggleFavorite(sec.id) : null}
                        hasUpdate={hasUpdate(sec.id)}
                    />
                ))}
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
            <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
                {user?.role === 'admin' ? (
                    <>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                            <Settings/> Feedback Log
                        </h2>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            {adminFeedbackList.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">Noch kein Feedback vorhanden. 🎉</div>
                            ) : (
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {adminFeedbackList.map(item => (
                                        <div key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 flex gap-4">
                                            <div className="text-2xl pt-1">
                                                {item.type === 'outdated' ? '⏳' : item.type === 'error' ? '🐛' : '💡'}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-1">
                                                    <span className="font-bold text-gray-900 dark:text-white uppercase text-xs tracking-wider bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{item.type}</span>
                                                    <span className="text-xs text-gray-400">{item.createdAt.split('T')[0]} • von {item.userName || 'Gast'}</span>
                                                </div>
                                                <div className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">{item.context}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">{item.comment}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-red-500 mb-4 flex justify-center"><Lock size={48}/></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Zugriff verweigert</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Dieser Bereich ist nur für Administratoren sichtbar.</p>
                        <button onClick={() => handleNav('home')} className="mt-6 text-blue-600 dark:text-blue-400 hover:underline">Zurück zum Dashboard</button>
                    </div>
                )}
            </div>
        )}

        {activeTab === 'web' && (
          <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">Webseite Guidelines</h2>
                <button onClick={() => openFeedback('Web Guidelines')} className="text-gray-400 hover:text-red-500"><Flag size={20}/></button>
            </div>
            
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900 dark:text-white"><Layout className="text-blue-600 dark:text-blue-400"/> 01 // Design & Layout</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200 dark:border-green-800">
                    <strong className="text-green-800 dark:text-green-400 block mb-1">DO</strong>
                    <div className="text-sm dark:text-gray-300">Nutze vordefinierte Blöcke</div>
                    <div className="text-sm dark:text-gray-300">Button-Stil "Primary" verwenden</div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800">
                    <strong className="text-red-800 dark:text-red-400 block mb-1">DON'T</strong>
                    <div className="text-sm dark:text-gray-300">Eigene Spalten bauen</div>
                    <div className="text-sm dark:text-gray-300">Farbe manuell ändern</div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900 dark:text-white"><PenTool className="text-blue-600 dark:text-blue-400"/> 02 // Text & Inhalte</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200 dark:border-green-800">
                    <strong className="text-green-800 dark:text-green-400 block mb-1">DO</strong>
                    <div className="text-sm dark:text-gray-300">Anrede: <strong>Du/Euch</strong> GROSS</div>
                    <div className="text-sm dark:text-gray-300">Struktur: H1 &rarr; H2 &rarr; H3</div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800">
                    <strong className="text-red-800 dark:text-red-400 block mb-1">DON'T</strong>
                    <div className="text-sm dark:text-gray-300">Anrede: du/euch klein</div>
                    <div className="text-sm dark:text-gray-300">Überspringen: H1 &rarr; H4</div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900 dark:text-white"><Image className="text-blue-600 dark:text-blue-400"/> 03 // Bilder & Medien</h3>
                <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500"/> Format: <strong>WebP</strong> (immer!)</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500"/> Benennung: <code>team-2026.webp</code> (kein IMG_123.jpg)</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500"/> Update: Bild im CMS <strong>ersetzen</strong>, nicht neu hochladen.</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900 dark:text-white"><Globe className="text-blue-600 dark:text-blue-400"/> 04 // SEO & URLs</h3>
                <InfoBox type="info">
                  URLs immer kurz halten! <br/>
                  Gut: <code>k5.de/podcast</code> <br/>
                  Schlecht: <code>k5.de/k5-podcast-overview-2026</code>
                </InfoBox>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900 dark:text-white"><Flag className="text-blue-600 dark:text-blue-400"/> 05 // Workflow</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200 dark:border-green-800">
                    <strong className="text-green-800 dark:text-green-400 block mb-1">DO</strong>
                    <div className="text-sm dark:text-gray-300">Live erst bei 100% fertig</div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800">
                    <strong className="text-red-800 dark:text-red-400 block mb-1">DON'T</strong>
                    <div className="text-sm dark:text-gray-300">Platzhaltertexte live stellen</div>
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-xl mt-8 mb-4 text-gray-900 dark:text-white">Go-Live Checkliste</h3>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <ChecklistItem label="Seite 100% fertig & Text freigegeben?" />
                <ChecklistItem label="Anrede 'Du/Euch' großgeschrieben?" />
                <ChecklistItem label="Bilder WebP, komprimiert & benannt?" />
                <ChecklistItem label="Mobile Ansicht geprüft?" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'brand' && (
          <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Brand Guidelines</h2>
            
            <div className="grid gap-8">
              <div className="bg-white p-6 rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Dachmarke Farben</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {K5_COLORS.map((c, i) => (
                    <div key={i} className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                      <div className="h-20" style={{backgroundColor: c.hex}}></div>
                      <div className="p-3">
                        <div className="font-bold text-sm text-gray-900 dark:text-white">{c.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">{c.hex}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900 dark:text-white"><Type className="text-blue-600 dark:text-blue-400"/> Typografie</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Headline</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">Aeonik Bold</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Body</div>
                      <div className="text-lg text-gray-900 dark:text-white">Aeonik Regular</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Zeilenabstand 130%</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-center items-center text-center">
                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Logo Paket</h3>
                  <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">Print & Digital (EPS, SVG, PNG)</p>
                  <button className="bg-black text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-800 transition-colors">
                    Download .zip
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vivenu' && (
          <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">Vivenu Event Setup</h2>
                <button onClick={() => openFeedback('Vivenu Setup')} className="text-gray-400 hover:text-red-500"><Flag size={20}/></button>
            </div>
            
            <InfoBox type="warning" title="WICHTIG">
              Immer auf <strong>SPEICHERN</strong> klicken. Nur aufgeführte Punkte ändern.
            </InfoBox>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2"><FileText size={20}/> 📂 Benötigte Assets</h3>
                <ul className="grid grid-cols-2 gap-2 text-sm text-blue-800 dark:text-blue-200">
                    <li className="flex items-center gap-2"><Check size={14}/> Titelbild</li>
                    <li className="flex items-center gap-2"><Check size={14}/> Design für Tickets (PDF, Wallet)</li>
                    <li className="flex items-center gap-2"><Check size={14}/> Ticketfooter</li>
                    <li className="flex items-center gap-2"><Check size={14}/> Start/Endzeit & Eventname</li>
                </ul>
            </div>

            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">1. Neues Event & Grundeinstellungen</h3>
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr><td className="py-3 font-bold text-gray-700 dark:text-gray-300">Event Typ</td><td className="py-3 dark:text-gray-200">Einfaches Event</td></tr>
                    <tr><td className="py-3 font-bold text-gray-700 dark:text-gray-300">Tickets pro Kauf</td><td className="py-3 dark:text-gray-200">Klein: 3-5 | Konferenz: 20</td></tr>
                    <tr><td className="py-3 font-bold text-gray-700 dark:text-gray-300">SEO Index</td><td className="py-3"><span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-1 rounded text-xs font-bold">NO INDEX</span> (Wichtig!)</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">2. & 3. Darstellung</h3>
                <ul className="text-sm space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-3"><div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center shrink-0"><Check size={14}/></div> Titelbild & Farbe hinterlegen</li>
                  <li className="flex items-center gap-3"><div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center shrink-0"><Check size={14}/></div> "Invite Only" / Startpreis auf "Verstecken" setzen</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">4. Ticketkategorien</h3>
                <InfoBox type="info">
                    <strong>WICHTIG:</strong> "Kategorien" in Vivenu sind NICHT unsere Ticketkategorien. Unsere Kategorien heißen in Vivenu <strong>Tickettypen</strong>.
                </InfoBox>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Alle Kategorien und Abfragen müssen strikt nach den <span className="text-blue-600 dark:text-blue-400 font-bold cursor-pointer" onClick={() => handleNav('tickets')}>Ticket-Guidelines</span> erstellt werden.</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">5. Verkauf</h3>
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr><td className="py-3 font-bold text-gray-700 dark:text-gray-300">Steuern</td><td className="py-3 font-bold text-blue-600 dark:text-blue-400">19% (Pflicht!)</td></tr>
                    <tr><td className="py-3 font-bold text-gray-700 dark:text-gray-300">Start</td><td className="py-3 dark:text-gray-200">"Ab sofort"</td></tr>
                    <tr><td className="py-3 font-bold text-gray-700 dark:text-gray-300">Rabatte</td><td className="py-3 dark:text-gray-200">Nur nach Absprache</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h4 className="font-bold text-sm uppercase text-gray-400 mb-3">6. Daten & Personalisierung</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Personalisierung</strong> ist erforderlich. Extrafelder nur nach Leitfaden anlegen.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h4 className="font-bold text-sm uppercase text-gray-400 mb-3">7. Geheime Shops</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Nur nach Absprache erstellen.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h4 className="font-bold text-sm uppercase text-gray-400 mb-3">8. Ticket Design</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Grafiken einfügen und Schriftfarbe anpassen (Lesbarkeit!).</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800">
                    <h4 className="font-bold text-sm uppercase text-red-800 dark:text-red-300 mb-3 flex items-center gap-2"><AlertTriangle size={16}/> 9. Gebühren</h4>
                    <p className="text-sm text-red-700 dark:text-red-400 font-bold">NICHTS ANFASSEN! Standard lassen.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h4 className="font-bold text-sm uppercase text-gray-400 mb-3">10. Tracking</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Tags entsprechend Tagging-Konzept einfügen.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h4 className="font-bold text-sm uppercase text-gray-400 mb-3">12. Emails</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Alle Mails müssen mit dem <strong>Marketing Team</strong> abgesprochen werden.</p>
                  </div>
              </div>

              <h3 className="font-bold text-xl mt-12 mb-4 text-gray-900 dark:text-white">Ready-to-Go Check</h3>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-12">
                <ChecklistItem label="Gefilterte Übersicht des Ticketkaufs erstellen" />
                <ChecklistItem label="Link in Slack Canvas posten" />
                <ChecklistItem label="Shop einer weiteren Person zum Double Check geben" />
                <ChecklistItem label="Test Ticket gekauft" />
                <ChecklistItem label="Automatisierungen angelegt / gebrieft" />
                <ChecklistItem label="Shop auf der LP integriert" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'accreditation' && (
          <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Akkreditierung & Einlass</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Printer size={24} className="text-blue-600 dark:text-blue-400"/>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Szenario: Mit Badge</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Für FCE & Meetups. Wir nutzen eigene Hardware.</p>
                <ol className="text-sm space-y-2 list-decimal pl-4 text-gray-700 dark:text-gray-300">
                  <li>Laptop + Drucker + Scanner verkabeln</li>
                  <li><strong>Vivenu POS Desktop App</strong> starten</li>
                  <li>Login & korrekten "POS" wählen</li>
                  <li>Printing Type auf <strong>DIRECT</strong> stellen</li>
                </ol>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Smartphone size={24} className="text-green-600 dark:text-green-400"/>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Szenario: Guestlist</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Für kleine Events ohne Namensschilder.</p>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm mb-2 dark:text-white">
                  <strong>App:</strong> Vivenu Scan Manager
                </div>
                <div className="flex gap-2">
                  <span className="text-xs bg-black text-white px-2 py-1 rounded">iOS</span>
                  <span className="text-xs bg-black text-white px-2 py-1 rounded">Android</span>
                </div>
              </div>
            </div>

            <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">Scanner Checkliste</h3>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-12">
              <ChecklistItem label="App installiert & Update gemacht?" />
              <ChecklistItem label="Akku geladen / Powerbanks dabei?" />
              <ChecklistItem label="Korrektes Event ausgewählt?" />
              <ChecklistItem label="Scan-Modus auf 'Check-in' (nicht Check-out)?" />
            </div>

            <div className="flex gap-4 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-full"></div> Grün = Okay</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Rot = Ungültig</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div> Gelb = Falscher Sektor</span>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Customer Support Playbook</h2>
                    <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-lg inline-block text-sm font-medium">
                        Ziel: Wir lösen Probleme schnell, freundlich und im "K5 Tone of Voice".
                    </div>
                </div>
                <button onClick={() => openFeedback('Support Playbook')} className="text-gray-400 hover:text-red-500"><Flag size={20}/></button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <InfoBox title="Wichtige Regeln" type="warning">
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>24h Regel:</strong> Jede Mail wird innerhalb von 24h beantwortet.</li>
                  <li><strong>Du-Kultur:</strong> Wir duzen unsere Kunden konsequent.</li>
                  <li><strong>CC Clean-Up:</strong> "K5 GmbH" aus Empfängerzeile entfernen.</li>
                  <li><strong>Schreibweise:</strong> K5 FUTURE RETAIL CONFERENCE 2026</li>
                  <li><strong>Kulanz:</strong> Code <code>welovek5</code> (10%) bei Ärger (nur vor Kauf!).</li>
                </ul>
              </InfoBox>
              
              <InfoBox title="Slack Channels" type="info">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <code className="bg-white dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded border dark:border-gray-600">@customersupport</code>
                    <span className="text-gray-500 dark:text-gray-400">Das gesamte Team</span>
                  </div>
                  <div className="flex justify-between">
                    <code className="bg-white dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded border dark:border-gray-600">@mgmt</code>
                    <span className="text-gray-500 dark:text-gray-400">Notfälle (Owner/Lead)</span>
                  </div>
                </div>
              </InfoBox>
            </div>

            {/* TICKET WISSEN (WIEDERVERWENDET) */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Ticket Preise (Retailer)</h3>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <table className="w-full text-sm">
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {TICKET_PHASES.map((p, i) => (
                                    <tr key={i}>
                                        <td className="px-4 py-2 font-medium text-gray-800 dark:text-gray-200">{p.name}</td>
                                        <td className="px-4 py-2 text-gray-500 dark:text-gray-400 text-xs">{p.date}</td>
                                        <td className="px-4 py-2 font-bold text-blue-600 dark:text-blue-400 text-right">{p.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Retailer Definition</h3>
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800 text-sm text-amber-900 dark:text-amber-200">
                        <p className="mb-2 font-bold">Unterscheidung ist kritisch für Pricing!</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li><strong>Retailer:</strong> Shops (Online/Stationär), Bildung, Verlage, Hersteller.</li>
                            <li><strong>Non-Retailer:</strong> Agenturen, Berater, Dienstleister (Teurer!).</li>
                        </ul>
                    </div>
                </div>
            </div>

            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2">Eskalations-Matrix (L1 - L3)</h3>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-12">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 uppercase font-bold">
                  <tr>
                    <th className="px-6 py-4">Level</th>
                    <th className="px-6 py-4">Zuständigkeit</th>
                    <th className="px-6 py-4">Beispiel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  <tr className="hover:bg-blue-50/50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">L1 Support <br/><span className="text-xs font-normal text-gray-500 dark:text-gray-400">Happiness Team</span></td>
                    <td className="px-6 py-4 dark:text-gray-300">Standard Anfragen, Infos, Umschreibung</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">"Wo ist mein Ticket?"</td>
                  </tr>
                  <tr className="hover:bg-blue-50/50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-bold text-purple-600 dark:text-purple-400">L2 Support <br/><span className="text-xs font-normal text-gray-500 dark:text-gray-400">Leads</span></td>
                    <td className="px-6 py-4 dark:text-gray-300">Kleine Kulanz, Eskalation, Storno (Einzelfall)</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">Kunde beschwert sich.</td>
                  </tr>
                  <tr className="hover:bg-blue-50/50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-bold text-red-600 dark:text-red-400">L3 Support <br/><span className="text-xs font-normal text-gray-500 dark:text-gray-400">Owner</span></td>
                    <td className="px-6 py-4 dark:text-gray-300">Kulanz &gt; 10%, Große Stornos, Legal</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">Gruppen-Storno, Anwalt.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2">Zuständigkeiten 2026</h3>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-12">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-bold">
                  <tr><th className="px-6 py-3 text-left">Thema</th><th className="px-6 py-3 text-left">Verantwortlich</th><th className="px-6 py-3 text-left">Backup</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {CONTACTS.map((c, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">{c.topic}</td>
                      <td className="px-6 py-3 text-blue-600 dark:text-blue-400 font-bold">{c.responsible}</td>
                      <td className="px-6 py-3 text-gray-500 dark:text-gray-400">{c.backup}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2">Textbausteine (Snippets)</h3>
            <div className="grid gap-4">
              {SNIPPETS.map((snip, i) => (
                <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-hidden group">
                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 font-bold text-sm flex justify-between items-center cursor-pointer group-hover:bg-gray-100 dark:group-hover:bg-gray-600 text-gray-900 dark:text-white">
                    <span className="flex items-center gap-2">{snip.title} <Flag size={14} className="text-gray-300 hover:text-red-500" onClick={(e) => {e.stopPropagation(); openFeedback(`Snippet: ${snip.title}`)}}/></span>
                    <span className="text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded border dark:border-gray-600">Copy</span>
                  </div>
                  <div className="p-4 text-xs font-mono bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed border-t border-gray-100 dark:border-gray-700">
                    {snip.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- EXHIBITOR PAGE --- */}
        {activeTab === 'exhibitor' && (
          <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Ausstellerportal & Partner</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><User size={20} className="text-blue-600"/> Zugang & Login</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Jeder Partner erhält einen Haupt-Admin-Account. Passwörter können selbständig zurückgesetzt werden.</p>
                <a href="#" className="text-sm font-bold text-blue-600 hover:underline">portal.k5.de öffnen &rarr;</a>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><FileText size={20} className="text-blue-600"/> Asset Specs</h3>
                <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500"/> Logo Vektor (.eps, .svg)</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500"/> Logo Digital (.png, transparent)</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500"/> Video (nur YouTube Link)</li>
                </ul>
              </div>
            </div>

            <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">Onboarding Checkliste</h3>
            <div className="bg-white p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-12">
              <ChecklistItem label="Admin-User im Portal angelegt & Invite gesendet?" />
              <ChecklistItem label="Logo (Vektor + PNG) geprüft?" />
              <ChecklistItem label="Rechnungsadresse im CRM korrekt?" />
              <ChecklistItem label="Paket-Größe (S/M/L) in Vivenu gematched?" />
            </div>
          </div>
        )}

        {/* --- TICKETS PAGE --- */}
        {activeTab === 'tickets' && (
          <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 text-center py-20">
             <div className="inline-block p-6 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-6">
                <FileText size={48} className="text-blue-600 dark:text-blue-400" />
             </div>
             <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Ticket Logik 2026</h2>
             <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">Coming Soon</p>
             <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Dieser Bereich wird gerade überarbeitet.</p>
          </div>
        )}

        {/* --- VOTINGS PAGE (NEW) --- */}
        {activeTab === 'votings' && (
          <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Voting Guidelines & Setup</h2>
            <InfoBox title="Zielsetzung" type="info">
              Fairer Wettbewerb durch intelligente Verifizierung (Double-Opt-In). <strong>Ein User = Eine Stimme</strong> pro Kategorie.
            </InfoBox>

            {/* FLOW */}
            <h3 className="text-xl font-bold mb-6 mt-12 text-gray-900 dark:text-white">01 // Der User Flow</h3>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-12">
                <div className="flex flex-col md:flex-row gap-4 items-stretch text-center">
                    <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600">
                        <div className="font-bold text-lg mb-1 dark:text-white">1. Vote</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">User wählt Favorit & gibt Email ein.</div>
                    </div>
                    <div className="flex items-center justify-center text-gray-300 dark:text-gray-600"><ArrowRight/></div>
                    <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600">
                        <div className="font-bold text-lg mb-1 dark:text-white">2. Check</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Backend prüft Status (Neu/Bekannt).</div>
                    </div>
                    <div className="flex items-center justify-center text-gray-300 dark:text-gray-600"><ArrowRight/></div>
                    <div className="flex-1 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 text-blue-800 dark:text-blue-200">
                        <div className="font-bold text-lg mb-1">3. Verify</div>
                        <div className="text-sm">Bei neuen Usern: DOI-Mail senden.</div>
                    </div>
                </div>
            </div>

            {/* TECH STACK */}
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">02 // Tech Stack</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
                    <FileText className="mx-auto mb-2 text-gray-400" size={24}/>
                    <div className="font-bold text-sm dark:text-white">Typeform</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Frontend</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
                    <Cpu className="mx-auto mb-2 text-blue-600" size={24}/>
                    <div className="font-bold text-sm dark:text-white">n8n</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Logic</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
                    <Send className="mx-auto mb-2 text-green-600" size={24}/>
                    <div className="font-bold text-sm dark:text-white">Brevo</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Mail</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
                    <Database className="mx-auto mb-2 text-green-700" size={24}/>
                    <div className="font-bold text-sm dark:text-white">Sheets</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">DB</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
                    <BarChart className="mx-auto mb-2 text-yellow-600" size={24}/>
                    <div className="font-bold text-sm dark:text-white">Looker</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Report</div>
                </div>
            </div>

            {/* SETUP REQUIREMENTS (NEW) */}
            <h3 className="text-xl font-bold mb-4 mt-12 text-gray-900 dark:text-white">03 // Setup Requirements</h3>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-12">
                <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                        <div className="mt-1 bg-gray-100 dark:bg-gray-700 p-1 rounded text-gray-600 dark:text-gray-300"><FileText size={16}/></div>
                        <div>
                            <strong className="block text-gray-900 dark:text-white">Typeform</strong>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Erstelle <strong>ein Formular pro Kategorie</strong> (nicht alles in einem), um die Daten sauber zu trennen.</span>
                        </div>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded text-green-700 dark:text-green-400"><Database size={16}/></div>
                        <div>
                            <strong className="block text-gray-900 dark:text-white">Google Sheets</strong>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Nutze <strong>ein Master-Sheet</strong> für alle eingehenden Votes, um Duplikate kategorieübergreifend zu prüfen.</span>
                        </div>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 p-1 rounded text-blue-700 dark:text-blue-400"><Send size={16}/></div>
                        <div>
                            <strong className="block text-gray-900 dark:text-white">Brevo Templates</strong>
                            <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Erstelle folgende 3 E-Mail-Vorlagen:</span>
                            <ul className="text-sm list-disc pl-4 space-y-1 text-gray-500 dark:text-gray-400">
                                <li><strong>Verifizierung (DOI):</strong> "Bitte bestätige deine Stimme."</li>
                                <li><strong>Bestätigung:</strong> "Danke, deine Stimme wurde gezählt."</li>
                                <li><strong>Ablehnung:</strong> "Sorry, deine Stimme zählt nicht, da du in dieser Kategorie bereits abgestimmt hast."</li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>

            {/* BLUEPRINT */}
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">04 // n8n Blueprint Template</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Kopiere diesen Code und füge ihn in n8n (Strg+V) ein, um den Workflow zu importieren.</p>
            <CodeBlock code={VOTING_BLUEPRINT} />

            {/* CHECKLIST */}
            <h3 className="text-xl font-bold mb-4 mt-12 text-gray-900 dark:text-white">05 // Setup Checkliste</h3>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-12">
              <ChecklistItem label="Typeforms erstellt & Webhook an n8n gesetzt?" />
              <ChecklistItem label="Brevo Templates (DOI, Bestätigung, Ablehnung) aktiv?" />
              <ChecklistItem label="n8n Workflow auf 'Active' geschaltet?" />
              <ChecklistItem label="Google Sheet mit Looker Studio verbunden?" />
            </div>
          </div>
        )}

        {/* --- AUTOMATION WIZARD --- */}
        {activeTab === 'automation' && (
          <div className="animate-in zoom-in duration-300">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">Automation Check</h2>
              <p className="text-gray-500 dark:text-gray-400">Lohnt sich die Automatisierung?</p>
            </div>
            <Wizard />
          </div>
        )}

      </main>
    </div>
    </div>
  );
}