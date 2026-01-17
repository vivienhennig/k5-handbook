import React, { useState } from 'react';
import { Check, Zap, Cpu, ChevronUp, ChevronDown, Rocket, RotateCcw, Boxes, Sparkles } from 'lucide-react';
import { AVAILABLE_TOOLS } from '../config/data.js';
import { CodeBlock } from '../components/UI.jsx';

export default function AutomationView() {
    const [step, setStep] = useState(1);
    const [selectedTools, setSelectedTools] = useState([]);
    const [automationMode, setAutomationMode] = useState('');
    const [toolDescriptions, setToolDescriptions] = useState({});

    // --- LOGIK (Unverändert übernommen) ---
    const reset = () => { setStep(1); setSelectedTools([]); setToolDescriptions({}); setAutomationMode(''); };
    const toggleTool = (t) => setSelectedTools(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
    const updateDescription = (t, v) => setToolDescriptions(prev => ({...prev, [t]: v}));
    const moveTool = (index, direction) => {
        const newTools = [...selectedTools];
        if (index + direction < 0 || index + direction >= newTools.length) return;
        const temp = newTools[index]; newTools[index] = newTools[index + direction]; newTools[index + direction] = temp;
        setSelectedTools(newTools);
    };
    const generateN8nJson = () => {
        const nodes = selectedTools.map((tool, index) => ({
          parameters: {}, name: tool, type: "n8n-nodes-base." + tool.toLowerCase().replace(' ', ''),
          typeVersion: 1, position: [250 + (index * 200), 300], notes: toolDescriptions[tool] || (index === 0 ? "Trigger" : "Action")
        }));
        nodes.unshift({ parameters: {}, name: "Start", type: "n8n-nodes-base.start", typeVersion: 1, position: [50, 300] });
        const connections = {};
        for (let i = 0; i < nodes.length - 1; i++) { connections[nodes[i].name] = { main: [[{ node: nodes[i+1].name, type: "main", index: 0 }]] }; }
        return JSON.stringify({ nodes, connections }, null, 2);
    };

    // --- UI HELPER (Aeonik CI Update) ---
    const StepHeading = ({ num, title, sub }) => (
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-2">
            <span className="text-[10px] font-bold text-k5-digital uppercase tracking-[0.4em] mb-3 block">Step {num} of 5</span>
            <h3 className="text-3xl lg:text-5xl font-black text-k5-black dark:text-white uppercase tracking-tighter leading-none">{title}</h3>
            {sub && <p className="text-k5-sand text-[11px] font-bold uppercase tracking-widest mt-4">{sub}</p>}
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto pb-32 px-4 font-sans">
            {/* Header */}
            <div className="mb-16 border-b border-gray-100 dark:border-k5-deep pb-10 flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
                <div>
                    <h2 className="text-5xl lg:text-6xl font-black text-k5-black dark:text-white mb-4 tracking-tighter uppercase leading-none">
                        K5 <span className="text-k5-digital">Automation</span>
                    </h2>
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                        <Sparkles size={14} className="text-k5-digital" />
                        <p className="text-k5-sand font-bold uppercase text-[11px] tracking-[0.3em]">Workflow Builder & API Blueprint</p>
                    </div>
                </div>
                {step > 1 && (
                    <button onClick={reset} className="flex items-center gap-2 text-[11px] font-bold text-gray-400 hover:text-k5-digital transition-all uppercase tracking-widest">
                        <RotateCcw size={14} /> Reset Analysis
                    </button>
                )}
            </div>

            <div className="bg-white dark:bg-k5-black p-8 md:p-14 rounded-k5-lg border border-gray-100 dark:border-k5-deep shadow-sm relative overflow-hidden">
                
                {/* STEP 1: Häufigkeit */}
                {step === 1 && (
                    <div className="animate-in fade-in duration-500">
                        <StepHeading num="1" title="Prozess-Frequenz" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { t: "Daily / Weekly", s: 2, c: "digital" },
                                { t: "Monthly (Mass)", s: 2, c: "digital" },
                                { t: "Rarely (Manual)", s: 99, c: "sand" }
                            ].map((btn, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => setStep(btn.s)} 
                                    className={`p-8 rounded-k5-md border-2 font-bold uppercase tracking-widest text-xs transition-all ${
                                        btn.c === 'digital' 
                                        ? 'border-k5-digital/10 text-k5-digital bg-k5-light-grey/50 dark:bg-k5-deep/20 hover:bg-glow-digital hover:text-white hover:border-transparent' 
                                        : 'border-gray-100 dark:border-k5-deep text-gray-400 hover:border-k5-sand hover:text-k5-sand'
                                    }`}
                                >
                                    {btn.t}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 2: Regeln */}
                {step === 2 && (
                    <div className="animate-in fade-in duration-500">
                        <StepHeading num="2" title="Logik-Check" sub="Folgt der Prozess festen Regeln?" />
                        <div className="bg-k5-light-grey dark:bg-k5-deep/30 p-8 rounded-k5-md mb-10 border border-gray-100 dark:border-k5-deep text-sm text-k5-black dark:text-gray-300">
                            <span className="text-k5-digital font-bold uppercase tracking-widest block mb-2 text-[10px]">Beispiel für JA:</span>
                            "Wenn E-Mail Betreff 'Rechnung' enthält → speichere Anhang in Google Drive."
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <button onClick={() => setStep(3)} className="px-12 py-5 bg-glow-digital text-white font-bold rounded-k5-md uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-k5-digital/25 hover:scale-105 transition-all">Ja, feste Logik</button>
                            <button onClick={() => setStep(98)} className="px-12 py-5 bg-k5-light-grey dark:bg-k5-deep/50 text-k5-sand font-bold rounded-k5-md uppercase tracking-[0.2em] text-[11px] hover:bg-gray-200 dark:hover:bg-k5-deep transition-all">Nein, Bauchgefühl</button>
                        </div>
                    </div>
                )}

                {/* STEP 3: Tools Selection */}
                {step === 3 && (
                    <div className="animate-in fade-in duration-500">
                        <StepHeading num="3" title="Tech Stack" sub="Wähle die beteiligten Applikationen" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                            {AVAILABLE_TOOLS.map(tool => (
                                <button 
                                    key={tool} 
                                    onClick={() => toggleTool(tool)} 
                                    className={`p-4 rounded-k5-sm border transition-all flex items-center justify-between font-bold text-[10px] uppercase tracking-wider ${
                                        selectedTools.includes(tool) 
                                        ? 'border-k5-digital bg-k5-digital text-white shadow-lg' 
                                        : 'border-gray-100 dark:border-k5-deep text-gray-400 hover:border-k5-digital/50'
                                    }`}
                                >
                                    {tool} {selectedTools.includes(tool) && <Check size={14}/>}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => selectedTools.length > 0 ? setStep(4) : alert('Tool wählen!')} className="w-full py-6 bg-glow-digital text-white font-bold rounded-k5-md uppercase tracking-[0.2em] text-xs shadow-xl shadow-k5-digital/25 flex items-center justify-center gap-4 active:scale-95 transition-all">
                             Engine-Check einleiten <Rocket size={20}/>
                        </button>
                    </div>
                )}

                {/* STEP 4: Mode Selection */}
                {step === 4 && (
                    <div className="animate-in fade-in duration-500">
                        <StepHeading num="4" title="Automation Engine" />
                        <div className="grid md:grid-cols-2 gap-8">
                            <button onClick={() => { setAutomationMode('zapier'); setStep(5); }} className="p-10 rounded-k5-lg border border-gray-100 dark:border-k5-deep hover:border-k5-digital bg-k5-light-grey/20 dark:bg-k5-deep/10 transition-all text-left group relative overflow-hidden">
                                <Zap className="text-k5-sand mb-6" size={40}/>
                                <h4 className="font-bold text-2xl uppercase tracking-tight dark:text-white group-hover:text-k5-digital transition-colors">Linear (Zapier)</h4>
                                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-4 leading-relaxed">"Wenn X, dann Y". Einfache Workflows ohne komplexe Logik.</p>
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Zap size={100} /></div>
                            </button>
                            <button onClick={() => { setAutomationMode('n8n'); setStep(5); }} className="p-10 rounded-k5-lg border border-gray-100 dark:border-k5-deep hover:border-k5-digital bg-k5-light-grey/20 dark:bg-k5-deep/10 transition-all text-left group relative overflow-hidden">
                                <Cpu className="text-k5-digital mb-6" size={40}/>
                                <h4 className="font-bold text-2xl uppercase tracking-tight dark:text-white group-hover:text-k5-digital transition-colors">Advanced (n8n)</h4>
                                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-4 leading-relaxed">Komplexe Logik, Verzweigungen & DSGVO-konforme Datenwege.</p>
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Cpu size={100} /></div>
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 5: Konfigurator */}
                {step === 5 && (
                    <div className="animate-in fade-in duration-500">
                        <StepHeading num="5" title={`Config: ${automationMode}`} />
                        <div className="space-y-6 mb-12">
                            {selectedTools.map((tool, index) => (
                                <div key={tool} className="bg-k5-light-grey dark:bg-k5-deep/20 p-6 rounded-k5-md flex flex-col md:flex-row gap-8 items-center border border-gray-50 dark:border-k5-deep/30">
                                    <div className="flex items-center gap-6 w-full md:w-2/5">
                                        <div className="w-12 h-12 rounded-k5-sm bg-k5-digital text-white flex items-center justify-center font-black shadow-lg shadow-k5-digital/20">{index + 1}</div>
                                        <div className="flex flex-col">
                                            <span className="font-bold uppercase text-base dark:text-white tracking-tight">{tool}</span>
                                            <span className={`text-[9px] font-bold uppercase px-3 py-1 rounded-full w-max tracking-widest mt-1 ${index === 0 ? 'bg-k5-sand text-white' : 'bg-gray-200 dark:bg-k5-deep text-gray-500'}`}>{index === 0 ? 'Trigger' : 'Action'}</span>
                                        </div>
                                        <div className="flex gap-2 ml-auto">
                                            <button onClick={() => moveTool(index, -1)} disabled={index === 0} className="p-2 hover:text-k5-digital disabled:opacity-10"><ChevronUp size={24} /></button>
                                            <button onClick={() => moveTool(index, 1)} disabled={index === selectedTools.length - 1} className="p-2 hover:text-k5-digital disabled:opacity-10"><ChevronDown size={24} /></button>
                                        </div>
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder={index === 0 ? "Event (z.B. Neuer Lead)" : "Aktion (z.B. Mail senden)"} 
                                        className="flex-1 p-5 bg-white dark:bg-k5-black dark:text-white rounded-k5-sm border border-transparent focus:border-k5-digital/30 font-bold text-sm outline-none transition-all" 
                                        value={toolDescriptions[tool] || ''} 
                                        onChange={(e) => updateDescription(tool, e.target.value)} 
                                    />
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setStep(6)} className="w-full py-6 bg-glow-digital text-white font-bold rounded-k5-md uppercase tracking-[0.2em] text-xs shadow-xl flex items-center justify-center gap-4">
                            <Boxes size={22}/> Blueprint generieren
                        </button>
                    </div>
                )}

                {/* STEP 6: Result */}
                {step === 6 && (
                    <div className="animate-in zoom-in-95 duration-500 text-center">
                        <div className="w-24 h-24 bg-k5-light-grey dark:bg-k5-deep/40 text-k5-digital rounded-k5-md flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <Check size={48} strokeWidth={3}/>
                        </div>
                        <h3 className="text-4xl font-black text-k5-black dark:text-white uppercase tracking-tighter mb-10 leading-none text-center">Blueprint Ready!</h3>
                        
                        {automationMode === 'n8n' ? (
                            <div className="text-left">
                                <p className="text-[10px] font-bold text-k5-sand uppercase tracking-[0.3em] mb-4 text-center">Copy & Paste this JSON directly into n8n</p>
                                <CodeBlock code={generateN8nJson()} label="n8n-workflow.json" />
                            </div>
                        ) : (
                            <div className="bg-k5-light-grey dark:bg-k5-deep/20 p-10 rounded-k5-lg text-left border border-gray-100 dark:border-k5-deep">
                                <h4 className="font-bold text-xs uppercase tracking-[0.3em] text-k5-sand mb-8 flex items-center gap-3">
                                    <Zap size={20} className="text-k5-sand" /> Zapier Recipe
                                </h4>
                                <div className="space-y-8">
                                    {selectedTools.map((tool, i) => (
                                        <div key={i} className="flex gap-6 items-start">
                                            <div className="w-8 h-8 bg-k5-digital text-white rounded-k5-sm flex items-center justify-center text-[11px] font-black shrink-0 shadow-lg shadow-k5-digital/20">{i+1}</div>
                                            <div>
                                                <div className="font-bold text-base uppercase tracking-tight dark:text-white">{tool}</div>
                                                <div className="text-[10px] text-k5-sand font-bold uppercase tracking-widest mt-1">{toolDescriptions[tool] || "Configure Event"}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <button onClick={reset} className="mt-14 text-k5-digital font-bold uppercase text-[11px] tracking-[0.3em] hover:opacity-70 transition-opacity">Neustart der Analyse</button>
                    </div>
                )}

                {/* Error / Warning Steps */}
                {(step === 99 || step === 98) && (
                    <div className="text-center py-16">
                        <div className="text-7xl mb-8 flex justify-center">{step===99?<Zap className="text-k5-sand" size={64}/>:<Cpu className="text-k5-sand" size={64}/>}</div>
                        <h3 className="text-4xl font-black text-k5-black dark:text-white uppercase tracking-tighter mb-6">{step===99?'Abbruch!':'Manueller Task'}</h3>
                        <p className="text-gray-500 font-bold uppercase text-[11px] tracking-widest max-w-md mx-auto leading-relaxed">{step===99?'Der Aufwand für die Automatisierung übersteigt den Nutzen bei so seltenen Prozessen.':'Prozesse, die Bauchgefühl oder menschliche Intuition brauchen, sind aktuell nicht prozess-sicher automatisierbar.'}</p>
                        <button onClick={reset} className="mt-12 px-10 py-4 bg-k5-light-grey dark:bg-k5-deep text-k5-black dark:text-white font-bold rounded-k5-md uppercase text-[11px] tracking-widest transition-all hover:scale-105">Zurück zum Start</button>
                    </div>
                )}
            </div>
        </div>
    );
}