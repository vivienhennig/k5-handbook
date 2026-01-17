import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function BirthdaySurprise({ birthdayKids = [] }) {
    useEffect(() => {
        if (birthdayKids.length === 0) return;

        const today = new Date();
        const hasBirthdayToday = birthdayKids.some(k => {
            if (!k.nextBirthday) return false;
            // Wir vergleichen, ob das berechnete nächste Geburtsdatum HEUTE ist
            return (
                k.nextBirthday.getDate() === today.getDate() &&
                k.nextBirthday.getMonth() === today.getMonth() &&
                k.nextBirthday.getFullYear() === today.getFullYear()
            );
        });

        if (hasBirthdayToday) {
            console.log("🎉 Konfetti Zeit!");
            const timer = setTimeout(() => {
                confetti({ particleCount: 150, spread: 70, origin: { x: 0.1, y: 0.8 }, colors: ['#2563eb', '#fbbf24', '#ffffff'] });
                setTimeout(() => {
                    confetti({ particleCount: 150, spread: 70, origin: { x: 0.9, y: 0.8 }, colors: ['#2563eb', '#fbbf24', '#ffffff'] });
                }, 300);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [birthdayKids]);

    return null;
}