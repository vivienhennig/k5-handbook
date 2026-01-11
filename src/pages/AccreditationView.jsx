import React from 'react';
import { Flag, Printer, Smartphone, Check } from 'lucide-react';
import { InfoBox, ChecklistItem } from '../components/UI';

export default function AccreditationView({ openFeedback }) {
    return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Akkreditierung & Einlass</h2>
            <button onClick={() => openFeedback('Akkreditierung')} className="text-gray-400 hover:text-red-500"><Flag size={20}/></button>
        </div>
        <div className="mb-10"><InfoBox title="Szenario 1: K5 Konferenz (Großevent)" type="info">Bei der großen K5 Future Retail Conference übernehmen wir die Akkreditierung <strong>nicht selbst</strong>.<br/><br/><strong>Dienstleister: Fastlane</strong><br/>Hardware, Personal und Badge-Druck werden komplett extern durch Fastlane abgewickelt.</InfoBox></div>
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Szenario 2: Interne Abwicklung</h3>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-6"><div className="flex items-center gap-2 mb-4"><Printer size={24} className="text-blue-600 dark:text-blue-400"/><h3 className="font-bold text-lg text-gray-900 dark:text-white">Events MIT Badge</h3></div><p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Für FCE & Meetups. Wir nutzen eigene Hardware.</p><div className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm mb-4 dark:text-white"><strong>Tool:</strong> Vivenu POS Desktop App</div><ol className="text-sm space-y-2 list-decimal pl-4 text-gray-700 dark:text-gray-300"><li>Laptop + Drucker + Scanner verkabeln</li><li><strong>Vivenu POS App</strong> starten</li><li>Login & "POS" wählen</li><li>Printing Type: <strong>DIRECT</strong></li><li>Ablauf: Scan &rarr; Badge Druck &rarr; Check-in</li></ol></div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"><h4 className="font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white"><Check size={16}/> Checkliste: Mit Badge</h4><ChecklistItem label="Label in Vivenu erstellt?" /><ChecklistItem label="Hardware vollzählig?" /><ChecklistItem label="Labelpapier vorhanden?" /><ChecklistItem label="Verkabelung/Hubs ready?" /><ChecklistItem label="Testdruck gemacht?" /><ChecklistItem label="POS App installiert?" /><ChecklistItem label="Backup-Laptop bereit?" /></div>
            </div>
            <div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-6"><div className="flex items-center gap-2 mb-4"><Smartphone size={24} className="text-green-600 dark:text-green-400"/><h3 className="font-bold text-lg text-gray-900 dark:text-white">Events OHNE Badge</h3></div><p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Für kleine Events (Guestlist).</p><div className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm mb-4 dark:text-white"><strong>App:</strong> Vivenu Scan Manager</div><div className="flex gap-2 mb-4"><a href="https://apps.apple.com/de/app/vivenu-scan-manager/id6745554940" target="_blank" rel="noreferrer" className="text-xs bg-black text-white px-3 py-1.5 rounded font-bold hover:bg-gray-800 transition-colors"> iOS App</a><a href="https://play.google.com/store/apps/details?id=com.vivenu.scanmanager" target="_blank" rel="noreferrer" className="text-xs bg-black text-white px-3 py-1.5 rounded font-bold hover:bg-gray-800 transition-colors">▶ Android App</a></div><p className="text-xs text-gray-500">Wichtig: App exakt nach <a href="https://wiki.vivenu.com/Scan%20Manager%20App%20Setup" target="_blank" rel="noreferrer" className="underline text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">Wiki-Anleitung</a> aufsetzen.</p></div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"><h4 className="font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white"><Check size={16}/> Checkliste: Ohne Badge</h4><ChecklistItem label="App installiert & Update?" /><ChecklistItem label="Akku/Powerbanks?" /><ChecklistItem label="Korrektes Event gewählt?" /><ChecklistItem label="Scan-Modus 'Check-in'?" /></div>
            </div>
        </div>
    </div>
    );
}