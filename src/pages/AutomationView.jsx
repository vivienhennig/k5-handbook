import React, { useState } from 'react';
import { Check, Zap, Cpu, ChevronUp, ChevronDown, Rocket, RotateCcw, Boxes } from 'lucide-react';
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

    // --- UI HELPER ---
    const StepHeading = ({ num, title, sub }) => (
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-2">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] italic mb-2 block">Step {num} of 5</span>
            <h3 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">{title}</h3>
            {sub && <p className="text-gray-500 text-xs font-bold uppercase mt-2">{sub}</p>}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto pb-32 px-4 font-sans">
            {/* Header */}
            <div className="mb-12 border-b border-gray-100 dark:border-gray-800 pb-10 flex justify-between items-end">
                <div>
                    <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter italic uppercase">
                        K5 <span className="text-blue-600">Automation</span>
                    </h2>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] italic text-center md:text-left">Workflow Builder & API Blueprint</p>
                </div>
                {step > 1 && (
                    <button onClick={reset} className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-blue-600 transition-all uppercase italic">
                        <RotateCcw size={14} /> Reset
                    </button>
                )}
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                
                {/* STEP 1: Häufigkeit */}
                {step === 1 && (
                    <div className="animate-in fade-in duration-500">
                        <StepHeading num="1" title="Prozess-Frequenz" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { t: "Daily / Weekly", s: 2, c: "blue" },
                                { t: "Monthly (Mass)", s: 2, c: "blue" },
                                { t: "Rarely (Manual)", s: 99, c: "gray" }
                            ].map((btn, i) => (
                                <button key={i} onClick={() => setStep(btn.s)} className={`p-6 rounded-[2rem] border-2 font-black uppercase italic text-sm transition-all ${btn.c === 'blue' ? 'border-blue-50 text-blue-600 hover:border-blue-600 hover:bg-blue-600 hover:text-white' : 'border-gray-100 text-gray-400 hover:border-gray-300'}`}>
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
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl mb-8 border border-blue-100 dark:border-blue-800 italic text-sm text-blue-700 dark:text-blue-300">
                            <strong>Beispiel für JA:</strong> "Wenn E-Mail Betreff 'Rechnung' enthält → speichere Anhang in Drive."
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <button onClick={() => setStep(3)} className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl uppercase italic tracking-widest shadow-lg shadow-blue-500/20 hover:scale-105 transition-all">Ja, feste Logik</button>
                            <button onClick={() => setStep(98)} className="px-10 py-4 bg-gray-100 dark:bg-gray-700 text-gray-400 font-black rounded-2xl uppercase italic tracking-widest hover:bg-gray-200 transition-all">Nein, Bauchgefühl</button>
                        </div>
                    </div>
                )}

                {/* STEP 3: Tools Selection */}
                {step === 3 && (
                    <div className="animate-in fade-in duration-500">
                        <StepHeading num="3" title="Tech Stack" sub="Wähle die beteiligten Applikationen" />
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
                            {AVAILABLE_TOOLS.map(tool => (
                                <button key={tool} onClick={() => toggleTool(tool)} className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between font-bold text-xs uppercase ${selectedTools.includes(tool) ? 'border-blue-600 bg-blue-600 text-white shadow-lg' : 'border-gray-50 dark:border-gray-700 text-gray-400 hover:border-blue-300'}`}>
                                    {tool} {selectedTools.includes(tool) && <Check size={16}/>}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => selectedTools.length > 0 ? setStep(4) : alert('Tool wählen!')} className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl uppercase italic tracking-widest shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3">
                             Weiter zum Engine-Check <Rocket size={20}/>
                        </button>
                    </div>
                )}

                {/* STEP 4: Mode Selection */}
                {step === 4 && (
                    <div className="animate-in fade-in duration-500">
                        <StepHeading num="4" title="Automation Engine" />
                        <div className="grid md:grid-cols-2 gap-6">
                            <button onClick={() => { setAutomationMode('zapier'); setStep(5); }} className="p-8 rounded-[2.5rem] border-2 border-gray-50 dark:border-gray-700 hover:border-blue-600 transition-all text-left group">
                                <Zap className="text-orange-500 mb-4" size={32}/>
                                <h4 className="font-black text-xl italic uppercase dark:text-white group-hover:text-blue-600">Linear (Zapier)</h4>
                                <p className="text-xs text-gray-400 font-bold uppercase mt-2">"Wenn X, dann Y". Einfache Workflows ohne komplexe Logik.</p>
                            </button>
                            <button onClick={() => { setAutomationMode('n8n'); setStep(5); }} className="p-8 rounded-[2.5rem] border-2 border-gray-50 dark:border-gray-700 hover:border-blue-600 transition-all text-left group">
                                <Cpu className="text-blue-500 mb-4" size={32}/>
                                <h4 className="font-black text-xl italic uppercase dark:text-white group-hover:text-blue-600">Advanced (n8n)</h4>
                                <p className="text-xs text-gray-400 font-bold uppercase mt-2">Komplexe Logik, Verzweigungen & DSGVO-konforme Datenwege.</p>
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 5: Konfigurator */}
                {step === 5 && (
                    <div className="animate-in fade-in duration-500">
                        <StepHeading num="5" title={`Config: ${automationMode}`} />
                        <div className="space-y-4 mb-10">
                            {selectedTools.map((tool, index) => (
                                <div key={tool} className="bg-gray-50 dark:bg-gray-900 p-6 rounded-[2rem] flex flex-col md:flex-row gap-6 items-center">
                                    <div className="flex items-center gap-4 w-full md:w-1/3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black italic shadow-lg">{index + 1}</div>
                                        <div className="flex flex-col">
                                            <span className="font-black italic uppercase text-sm dark:text-white">{tool}</span>
                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full w-max tracking-widest ${index === 0 ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>{index === 0 ? 'Trigger' : 'Action'}</span>
                                        </div>
                                        <div className="flex gap-1 ml-auto">
                                            <button onClick={() => moveTool(index, -1)} disabled={index === 0} className="p-1 hover:text-blue-600 disabled:opacity-20"><ChevronUp size={20} /></button>
                                            <button onClick={() => moveTool(index, 1)} disabled={index === selectedTools.length - 1} className="p-1 hover:text-blue-600 disabled:opacity-20"><ChevronDown size={20} /></button>
                                        </div>
                                    </div>
                                    <input type="text" placeholder={index === 0 ? "Event (z.B. Neuer Lead)" : "Aktion (z.B. Mail senden)"} className="flex-1 p-4 bg-white dark:bg-gray-800 dark:text-white rounded-2xl border-none font-bold text-sm outline-none ring-2 ring-transparent focus:ring-blue-500/20" value={toolDescriptions[tool] || ''} onChange={(e) => updateDescription(tool, e.target.value)} />
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setStep(6)} className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl uppercase italic tracking-widest shadow-xl flex items-center justify-center gap-3">
                            <Boxes size={20}/> Generate Blueprint
                        </button>
                    </div>
                )}

                {/* STEP 6: Result */}
                {step === 6 && (
                    <div className="animate-in zoom-in-95 duration-500 text-center">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl">
                            <Check size={40} strokeWidth={3}/>
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight mb-8">Blueprint Ready!</h3>
                        
                        {automationMode === 'n8n' ? (
                            <div className="text-left">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">Copy & Paste this JSON directly into n8n</p>
                                <CodeBlock code={generateN8nJson()} label="n8n-workflow.json" />
                            </div>
                        ) : (
                            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-[2.5rem] text-left border border-gray-100 dark:border-gray-800">
                                <h4 className="font-black text-sm uppercase italic tracking-widest text-orange-500 mb-6 flex items-center gap-2">
                                    <Zap size={18}/> Zapier Recipe
                                </h4>
                                <div className="space-y-6">
                                    {selectedTools.map((tool, i) => (
                                        <div key={i} className="flex gap-4 items-start">
                                            <div className="w-6 h-6 bg-blue-600 text-white rounded-lg flex items-center justify-center text-[10px] font-black italic shrink-0">{i+1}</div>
                                            <div>
                                                <div className="font-black text-sm uppercase italic dark:text-white">{tool}</div>
                                                <div className="text-xs text-gray-400 font-bold uppercase">{toolDescriptions[tool] || "Configure Event"}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <button onClick={reset} className="mt-12 text-blue-600 font-black uppercase text-[10px] tracking-widest italic hover:underline">Start New Analysis</button>
                    </div>
                )}

                {/* Error / Warning Steps */}
                {(step === 99 || step === 98) && (
                    <div className="text-center py-10">
                        <div className="text-6xl mb-6">{step===99?'🛑':'🧠'}</div>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic mb-4">{step===99?'Stop!':'Manuelle Arbeit'}</h3>
                        <p className="text-gray-500 font-bold uppercase text-xs max-w-sm mx-auto leading-relaxed">{step===99?'Der Aufwand für die Automatisierung übersteigt den Nutzen bei so seltenen Prozessen.':'Prozesse, die Bauchgefühl oder menschliche Intuition brauchen, sind (noch) nicht automatisierbar.'}</p>
                        <button onClick={reset} className="mt-10 px-8 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-black rounded-xl uppercase text-[10px] tracking-widest">Zurück zum Start</button>
                    </div>
                )}
            </div>
        </div>
    );
}