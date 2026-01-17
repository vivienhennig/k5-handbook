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

export const VOTING_BLUEPRINT = `{
  "name": "Award Voting Workflow",
  "nodes": [
    { "name": "Typeform Trigger", "type": "n8n-nodes-base.webhook" },
    { "name": "Validation Logic", "type": "n8n-nodes-base.code" },
    { "name": "Duplicate?", "type": "n8n-nodes-base.if" }
  ]
}`;

export const AVAILABLE_TOOLS = ['Hubspot', 'Brevo', 'Google Sheets', 'Vivenu', 'Asana', 'Gmail', 'Slack', 'Google Docs', 'Typeform', 'Wordpress'];

// --- URLAUBS KONFIGURATION ---

export const STANDARD_VACATION_DAYS = 30;

// Deutsche Feiertage (Format: MM-DD oder YYYY-MM-DD)
export const PUBLIC_HOLIDAYS = [
    "01-01", "01-06", "05-01", "10-03", "11-01", "12-24" ,"12-25", "12-26", "12-31",
    // Bewegliche Feiertage 2025
    "2025-04-18", "2025-04-21", "2025-05-29", "2025-06-09", "2025-06-19",
    // Bewegliche Feiertage 2026
    "2026-04-03", "2026-04-06", "2026-05-14", "2026-05-25", "2026-06-04"
];

// Urlaubs-Typen Definition & Faktor
export const VACATION_TYPES = {
    standard: { label: "Urlaub (Ganztags)", factor: 1 },
    half: { label: "Urlaub (Halber Tag)", factor: 0.5 }, 
    workation: { label: "Workation (50% Anrechnung)", factor: 0.5 } 
};

// Farben für Abteilungen (Tailwind Klassen)
export const DEPARTMENT_COLORS = {
    'Event': { 
        classes: 'bg-[oklch(70.2%_0.183_293.541)] text-white border-transparent' 
    },
    'Sales': { 
        // Achtung: Da der Hintergrund sehr helles Gelb ist, nutzen wir hier dunkle Schrift!
        classes: 'bg-[oklch(90.5%_0.182_98.111)] text-gray-900 border-transparent' 
    },
    'Geschäftsführung': { 
        classes: 'bg-[oklch(55.3%_0.013_58.071)] text-white border-transparent' 
    },
    'Finanzen': { 
        classes: 'bg-[oklch(71.8%_0.202_349.761)] text-white border-transparent' 
    },
    'Audio & Video': { 
        // Auch hier: Das Grün ist sehr leuchtend/hell -> dunkle Schrift für Lesbarkeit
        classes: 'bg-[oklch(79.2%_0.209_151.711)] text-gray-900 border-transparent' 
    },
    'Tech & Tools': { 
        classes: 'bg-[oklch(75%_0.183_55.934)] text-white border-transparent' 
    },
    'Marketing': { 
        classes: 'bg-[oklch(70.7%_0.165_254.624)] text-white border-transparent' 
    },
    'Programm & Speaker': { 
        classes: 'bg-[oklch(78.9%_0.154_211.53)] text-white border-transparent' 
    },
    // Fallback
    'default': { 
        classes: 'bg-gray-500 text-white border-gray-600' 
    }
};

export const RESOURCE_LINKS = [
    {
        category: "Daily Tools",
        items: [
            { name: "Asana Board", url: "https://asana.com", desc: "Projektmanagement & Tasks" },
            { name: "Slack", url: "https://slack.com", desc: "Interne Kommunikation" },
            { name: "Hubspot", url: "https://hubspot.com", desc: "CRM & Sales Deals" },
            { name: "Parki", url: "https://parki.k5.de", desc: "Parkplatzmanagement" },
            { name: "UTM Builder", url: "https://utm.k5.de", desc: "Link Builder" },
        ]
    },
    {
        category: "Assets & Brand",
        items: [
            { name: "Logo Paket (Drive)", url: "https://drive.google.com/drive/folders/1F8sPB5ZBxJ3h7s-i9E-57smQS9k-VDDg?usp=drive_link", desc: "Alle Logos (PNG, SVG, EPS)" },
            { name: "Schriftarten", url: "https://drive.google.com/drive/folders/12T2crbECWQyQHOmCkz_dkra-44BhR5RC?usp=drive_link", desc: "K5 Font Family Download" },
            { name: "Brand Manual", url: "https://drive.google.com/file/d/1Ye2uvTMAAEHF3jZ7sIaq8_o7sj6gh72l/view?usp=drive_link", desc: "K5 Brand Manual" },
        ]
    },
    {
        category: "Events & Tech",
        items: [
            { name: "Vivenu Dashboard", url: "https://dashboard.vivenu.com/login", desc: "Ticketing Backend" },
            { name: "k5.de Admin", url: "https://k5.de/wp-admin", desc: "Webseiten Verwaltung" },
            { name: "konferenz.k5.de Admin", url: "https://konferenz.k5.de/wp-admin", desc: "Webseiten Verwaltung" },
            { name: "Typeform", url: "https://typeform.com", desc: "Votings, Umfragen, Formulare" },
        ]
    }
];

export const TECH_STACK = [
    { name: "Slack", domain: "slack.com", url: "https://slack.com/signin", desc: "Team Chat & News" },
    { name: "Asana", domain: "asana.com", url: "https://asana.com", desc: "Projektmanagement" },
    { name: "HubSpot", domain: "hubspot.com", url: "https://app.hubspot.com", desc: "CRM & Sales Deals" },
    { name: "Vivenu", domain: "vivenu.com", url: "https://dashboard.vivenu.com/login", desc: "Ticketing Backend" },
    { name: "Miro", domain: "miro.com", url: "https://miro.com/app", desc: "Whiteboards & Brainstorming" },
    { name: "Google Workspace", domain: "google.com", url: "https://workspace.google.com", desc: "Mail, Drive & Docs" },
    { name: "Canva", domain: "canva.com", url: "https://canva.com", desc: "Design" },
    { name: "Adobe Creative Cloud", domain: "adobe.com", url: "https://www.adobe.com/de/creativecloud.html", desc: "Audio & Video" },
    { name: "Riverside.fm", domain: "riverside.com", url: "https://riverside.com", desc: "Audio & Video" },
    { name: "ChatGPT", domain: "openai.com", url: "https://chat.openai.com", desc: "AI Assistant" },
    { name: "Gemini", domain: "gemini.google.com", url: "https://gemini.google.com", desc: "AI Assistant" },
    { name: "Brevo", domain: "brevo.com", url: "https://brevo.com", desc: "Newsletter & Marketing" },
    { name: "Wordpress", domain: "wordpress.com", url: "https://wordpress.com", desc: "Webseiten" },
    { name: "Cloudflare", domain: "cloudflare.com", url: "https://cloudflare.com", desc: "Hosting, CDN, Subdomains" },
    { name: "Zapier", domain: "zapier.com", url: "https://zapier.com", desc: "Automatisierungen" },
    { name: "n8n", domain: "n8n.k5.de", url: "https://n8n.k5.de", desc: "Automatisierungen" },
];

export const EVENT_TYPES = {
    'k5_conf': { label: 'K5 Konferenz', color: 'bg-blue-600 text-white', border: 'border-blue-700' },
    'meetup': { label: 'MEETup', color: 'bg-indigo-500 text-white', border: 'border-indigo-600' },
    'female': { label: 'Female Circle', color: 'bg-purple-500 text-white', border: 'border-purple-600' },
    'dinner': { label: 'Dinner', color: 'bg-stone-500 text-white', border: 'border-stone-600' },
    'award': { label: 'Award', color: 'bg-yellow-500 text-white', border: 'border-yellow-600' },
    'deadline': { label: 'Deadline', color: 'bg-red-500 text-white', border: 'border-red-600' },
    'second_seat': { label: 'Second Seat Dinner', color: 'bg-indigo-500 text-white', border: 'border-indigo-600' },
    'team': { label: 'Team Event', color: 'bg-emerald-500 text-white', border: 'border-emerald-600' },
    'scaleup': { label: 'Scale Up', color: 'bg-cyan-500 text-white', border: 'border-cyan-600' },
    'health': { label: 'Health / Sport', color: 'bg-green-400 text-white', border: 'border-green-500' },
    'external': { label: 'Extern / Branche', color: 'bg-gray-500 text-white', border: 'border-gray-600' },
};

export const TUTORIAL_STEPS = [
    {
        targetId: 'nav-search', // ID des HTML Elements
        title: 'Alles finden',
        text: 'Nutze die Suche, um Guidelines, Links oder Personen sofort zu finden. Auch Beschreibungen werden durchsucht!'
    },
    {
        targetId: 'nav-vacation',
        title: 'Urlaub buchen',
        text: 'Hier findest du deinen Urlaubsanspruch und kannst Anträge stellen. Achte auf die farbigen Feiertage!'
    },
    {
        targetId: 'nav-calendar',
        title: 'Team Events',
        text: 'Der zentrale Kalender für alle K5 Events, Meetups und Team-Dinner.'
    },
    {
        targetId: 'nav-profile',
        title: 'Dein Profil',
        text: 'Hier kannst du dich ausloggen oder zwischen Hell- und Dunkelmodus wechseln.'
    }
];

// Hilfetexte für spezifische Bereiche (Help Beacons)
export const HELP_TEXTS = {
    vacation: {
        title: "So funktioniert der Planer",
        text: "Klicke auf ein Datum im Kalender, um Tage auszuwählen. \n\nGrau = Wochenende/Feiertag\nFarbe = Genommener Urlaub\n\nDu kannst nur deine eigenen Einträge löschen (Klick auf den Balken)."
    },
    calendar: {
        title: "Events eintragen",
        text: "Jeder darf Events eintragen! Wähle den passenden Typ (z.B. 'Meetup' oder 'Team Event'), damit die Farben stimmen. Events können auch über mehrere Tage gehen."
    }
};