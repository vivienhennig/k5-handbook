import React, { useMemo } from 'react';

export default function EnergyHeader({ user }) {
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        const firstName = user?.displayName?.split(' ')[0] || "K5ler";
        
        const greetings = {
            morning: [
                `Moini, ${firstName} ⚓️`,
                `Guten Morgen, ${firstName}! Erstmal ein Kaffee? ☕️`,
                `It's a good day, to have a good day 🥰`,
                `Start your day right, ${firstName}! ⚡️`,
                `Guten Morgen München!`,
                `Schön, dass Du da bist, ${firstName}! 🌞`,
                `Good Morning, ${firstName}! Relax, take it easy. 🌈`,
                `Hey, ${firstName}! Abundance mindset: Let's create more. 🌊`,
                `Bold Moves, Kind Heart, ${firstName} 💪❤️`,
            ],
            noon: [
                `Schön, dass Du da bist, ${firstName} 🌞`,
                `Servus, ${firstName} 🥨`,
                `Keep going, ${firstName}! Du rockst das! ⭐`,
                `K5 goes Champions League! ${firstName} ⚽️`,
                `1, 2, 3... Energy! ${firstName}! ⚡️`,
                `BE GOAT, ${firstName}! 💪`,
                `${firstName}! Manifesting 5.000 Tickets. 🕯️`,
                `Hi, ${firstName}! Making the impossible look easy. 💅`,
            ],
            evening: [
                `Fast geschafft, ${firstName}! 🏁`,
                `Schön, dass Du da bist, ${firstName}! 🌞`,
                `Hey, ${firstName}! Noch kurz die Welt retten? 🌍`,
                `Energy-Level noch stabil, ${firstName}? ⚡️`,
                `Bis morgen, ${firstName}? 👋`,
                `Abend-Modus aktiviert! 🔥`,
                `Peak Performance, ${firstName}! Greatness is a habit. ⭐`
            ],
            night: [
                `Ab in's Bett ${firstName} 🌙`,
                `${firstName}! Noch voller K5-Energy? 🔋`,
                `Nightshift, ${firstName}! Trust the process. 🦉`,
                `Work hard, sleep hard, ${firstName} 😴`,
                `Ok, jetzt hilft nur noch Red Bull 🫩`,
                `Ab ins Bett, ${firstName}! Midnights become my afternoons. 🌙`,
                `${firstName}! Ownership doesn't sleep, but you should. 😴`,
            ]
        };

        let timeKey = 'morning';
        if (hour >= 11 && hour < 15) timeKey = 'noon';
        else if (hour >= 15 && hour < 20) timeKey = 'evening';
        else if (hour >= 20 || hour < 5) timeKey = 'night';

        const category = greetings[timeKey];
        return category[Math.floor(Math.random() * category.length)];
    }, [user]);

    // Den String am ersten "!" teilen, um den zweiten Teil blau einzufärben
    const parts = greeting.split('!');

    return (
      <div className="mb-12 pt-6 font-sans">
            {/* Minimalistisches Value-Band: Italic entfernt, Aeonik Bold genutzt */}
            <div className="flex gap-6 mb-6 overflow-x-auto no-scrollbar py-1">
                {['Boldness', 'Energy', 'Greatness', 'Ownership', 'Abundance', 'Trust'].map((val) => (
                    <span key={val} className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-300 dark:text-gray-500 border-b-2 border-transparent hover:border-k5-digital transition-all cursor-default">
                        {val}
                    </span>
                ))}
            </div>

            <div className="flex flex-col gap-2">
                {/* Die Haupt-Begrüßung: Aeonik Bold (font-black), Majuskeln, kein Italic */}
                <h1 className="text-5xl lg:text-6xl font-black text-k5-black dark:text-white tracking-tighter leading-none uppercase">
                    {parts[0]}
                </h1>
                
                {/* Der Motivations-Spruch: Aeonik Bold, K5-Digital Blue, kein Italic */}
                {parts[1] && (
                    <p className="text-lg lg:text-xl font-bold text-k5-digital dark:text-k5-heritage tracking-tight max-w-2xl leading-copy">
                        {parts[1].trim()}
                    </p>
                )}
            </div>
        </div>
    );
}