import { Layout, CreditCard, LifeBuoy, FileText, MousePointer, Shield, Cpu } from 'lucide-react';

export const MASTER_ADMIN_EMAIL = "admin@k5-gmbh.com"; 

export const K5_COLORS = [
  { name: 'Deep Blue', hex: '#052364', text: 'white' },
  { name: 'Digital Blue', hex: '#092AFF', text: 'white' },
  { name: 'Heritage Blue', hex: '#00a5e5', text: 'white' },
  { name: 'Black', hex: '#000000', text: 'white' },
  { name: 'Lime', hex: '#E9FF86', text: 'black' },
  { name: 'Light Grey', hex: '#F5F5F5', text: 'black' }
];

export const SECTIONS_CONFIG = [
  { id: 'web', title: "Webseite Guidelines", desc: "Content, Bilder, SEO und Design.", icon: Layout, lastUpdated: '2025-11-01T10:00:00Z' },
  { id: 'vivenu', title: "Vivenu Event Setup", desc: "Einstellungen und Checklisten für neue Events.", icon: CreditCard, lastUpdated: '2025-12-01T10:00:00Z' },
  { id: 'support', title: "Customer Support", desc: "Playbook, Snippets & Eskalations-Matrix.", icon: LifeBuoy, lastUpdated: '2026-01-16T10:00:00Z' },
  { id: 'tickets', title: "Ticket Logik", desc: "Preise, Kategorien und Phasen.", icon: FileText, lastUpdated: '2026-01-10T09:00:00Z' },
  { id: 'votings', title: "Voting System", desc: "Awards, User Flow & Tech Stack.", icon: MousePointer, lastUpdated: '2025-10-01T10:00:00Z' },
  { id: 'brand', title: "Branding & Assets", desc: "Farben, Logos, Typo und Assets (v1.0).", icon: FileText, lastUpdated: '2025-09-01T10:00:00Z' }, 
  { id: 'accreditation', title: "Vor Ort Akkreditierung", desc: "Voraussetzungen und Setup der Akkreditierung.", icon: Shield, lastUpdated: '2025-12-10T10:00:00Z' }, 
  { id: 'automation', title: "Automation Check", desc: "Ist dein Prozess automatisierbar?", icon: Cpu, lastUpdated: '2025-08-01T10:00:00Z' }
];

export const TICKET_PHASES = [
  { name: "Early Bird", date: "bis 31.03.", price: "499€", nonRetailer: "899€" },
  { name: "Late Bird", date: "bis 30.04.", price: "599€", nonRetailer: "1.099€" },
  { name: "Regular", date: "bis 28.05.", price: "699€", nonRetailer: "1.299€" },
  { name: "Last Minute", date: "bis 13.06.", price: "799€", nonRetailer: "1.499€" },
  { name: "Full Price", date: "bis 25.06.", price: "899€", nonRetailer: "1.699€" },
];

export const SNIPPETS = [
  { id: "snip_ticket", title: "🎟️ Ticket nicht erhalten", text: `Hallo [Name],\n\nvielen Dank für deine Nachricht.\n\nIch habe gerade im System nachgeschaut: Deine Bestellung war erfolgreich! 🎉\nManchmal landen die Tickets im Spam-Ordner. Der Absender ist "Vivenu".\n\nIch habe dir das Ticket zur Sicherheit nochmal an [Email] gesendet.\nSag Bescheid, falls es immer noch nicht da ist.\n\nLiebe Grüße,\n[Dein Name]` },
  { id: "snip_invoice", title: "📄 Rechnung ändern (Adresse)", text: `Hallo [Name],\n\ndanke für die Info. Ich habe die Rechnungsadresse wie gewünscht angepasst.\nAnbei findest du die korrigierte Rechnung als PDF.\n\nBeste Grüße,\n[Dein Name]` },
  { id: "snip_cancel", title: "⛔ Storno Anfrage (Ablehnung)", text: `Hallo [Name],\n\ndanke für deine Nachricht. Es tut uns leid zu hören, dass du nicht dabei sein kannst.\n\nLeider sind unsere Tickets laut AGB generell vom Umtausch und der Rückgabe ausgeschlossen. Daher können wir den Betrag nicht erstatten.\n\nDu kannst dein Ticket aber jederzeit an einen Kollegen oder Bekannten weitergeben. Nutze dafür einfach den Link in deiner Bestätigungsmail ("Ticket verwalten").\n\nHoffentlich klappt es beim nächsten Mal!\n\nViele Grüße,\n[Dein Name]` }
];

export const VOTING_BLUEPRINT = `{
  "name": "Award Voting Workflow",
  "nodes": [
    { "name": "Typeform Trigger", "type": "n8n-nodes-base.webhook" },
    { "name": "Validation Logic", "type": "n8n-nodes-base.code" },
    { "name": "Duplicate?", "type": "n8n-nodes-base.if" }
  ]
}`;

export const AVAILABLE_TOOLS = ['Hubspot', 'Brevo', 'Google Sheets', 'Vivenu', 'Asana', 'Gmail', 'Slack', 'Google Docs', 'Typeform', 'Wordpress'];

export const INITIAL_NEWS = [
    { id: 1, date: "15.01.", text: "Neue Non-Retailer Preise im Support-Tab ergänzt.", type: "update" },
    { id: 2, date: "14.01.", text: "WLAN-Passwort für die Akkreditierung geändert.", type: "alert" },
    { id: 3, date: "10.01.", text: "Handbook v1.0 ist live! 🎉", type: "info" }
];