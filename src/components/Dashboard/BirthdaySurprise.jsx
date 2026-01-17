import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function BirthdaySurprise({ birthdayKids = [] }) {
    useEffect(() => {
        if (birthdayKids.length === 0) return;

        const today = new Date();
        const hasBirthdayToday = birthdayKids.some(k => {
            if (!k.nextBirthday) return false;
            // Abgleich: Ist heute der Ehrentag?
            return (
                k.nextBirthday.getDate() === today.getDate() &&
                k.nextBirthday.getMonth() === today.getMonth() &&
                k.nextBirthday.getFullYear() === today.getFullYear()
            );
        });

        if (hasBirthdayToday) {
            // CI-konforme K5 Farbpalette für das Konfetti
            const k5Colors = [
                '#2563EB', // Digital Blue
                '#C5A267', // K5 Sand
                '#A3E635', // K5 Lime
                '#EC4899', // K5 Pink (Accent)
                '#FFFFFF'  // White for contrast
            ];

            const fire = (particleRatio, opts) => {
                confetti({
                    ...opts,
                    particleCount: Math.floor(200 * particleRatio),
                    colors: k5Colors,
                });
            };

            const timer = setTimeout(() => {
                // Linke Seite
                fire(0.25, { spread: 26, startVelocity: 55, origin: { x: 0.1, y: 0.8 } });
                fire(0.2, { spread: 60, origin: { x: 0.1, y: 0.8 } });
                
                // Rechte Seite verzögert
                setTimeout(() => {
                    fire(0.25, { spread: 26, startVelocity: 55, origin: { x: 0.9, y: 0.8 } });
                    fire(0.2, { spread: 60, origin: { x: 0.9, y: 0.8 } });
                }, 400);

                // Ein großer Final-Shot in der Mitte nach 1 Sekunde
                setTimeout(() => {
                    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, origin: { x: 0.5, y: 0.6 } });
                }, 1000);

            }, 800);

            return () => clearTimeout(timer);
        }
    }, [birthdayKids]);

    return null;
}