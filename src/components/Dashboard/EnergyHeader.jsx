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
                `Guten Morgen München (oder Berlin, oder Ostfriesland)!`,
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
                `Abend-Modus aktiviert! Gib nochmal alles! 🔥`,
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
      <div className="mb-10 pt-4">
            {/* Minimalistisches Value-Band */}
            <div className="flex gap-4 mb-4 overflow-x-auto no-scrollbar py-1">
                {['Boldness', 'Energy', 'Greatness', 'Ownership', 'Abundance', 'Trust'].map((val) => (
                    <span key={val} className="text-[7px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 border-b border-transparent hover:border-blue-600 transition-colors cursor-default">
                        {val}
                    </span>
                ))}
            </div>

            <div className="flex flex-col gap-1">
                {/* Die Haupt-Begrüßung: Groß, fett, präsent */}
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tighter italic leading-none">
                    {parts[0]}
                </h1>
                
                {/* Der Motivations-Spruch: Kleiner, feiner, in K5-Blau */}
                {parts[1] && (
                    <p className="text-base lg:text-lg font-bold text-blue-600 dark:text-blue-500 tracking-tight max-w-2xl opacity-90">
                        {parts[1].trim()}
                    </p>
                )}
            </div>
        </div>
    );
}