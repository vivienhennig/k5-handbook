import React, { useState } from 'react';
import { authService } from '../services/api.js';
import { ShieldCheck } from 'lucide-react';
import LoginHeader from '../components/Login/LoginHeader.jsx';
import LoginForm from '../components/Login/LoginForm.jsx';

export default function LoginView() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Domain Validierung bleibt identisch
        const emailDomain = "@k5-gmbh.com";
        if (!email.toLowerCase().endsWith(emailDomain)) {
            setError(`Zugriff verweigert. Bitte nutze deine offizielle ${emailDomain} Adresse.`);
            setLoading(false);
            return; 
        }

        try {
            if (isRegistering) {
                await authService.register(email, password);
            } else {
                await authService.login(email, password);
            }
        } catch (err) {
            console.error(err);
            const errorMessage = isRegistering 
                ? 'Registrierung fehlgeschlagen. E-Mail existiert evtl. schon.' 
                : 'Login fehlgeschlagen. Bitte prüfe E-Mail und Passwort.';
            setError(errorMessage);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-k5-black p-6 font-sans relative overflow-hidden">
            
            {/* Hintergrund-Deko: Glow-Effekte in CI-Farben */}
            <div className="absolute top-[-15%] left-[-15%] w-[50%] h-[50%] bg-k5-digital/10 rounded-full blur-[140px] animate-pulse" />
            <div className="absolute bottom-[-15%] right-[-15%] w-[50%] h-[50%] bg-k5-digital/5 rounded-full blur-[140px]" />

            <div className="max-w-[480px] w-full relative z-10">
                
                <LoginHeader isRegistering={isRegistering} />

                <LoginForm 
                    email={email} setEmail={setEmail}
                    password={password} setPassword={setPassword}
                    loading={loading} error={error}
                    isRegistering={isRegistering} setIsRegistering={setIsRegistering}
                    handleSubmit={handleSubmit} setError={setError}
                />
                
                {/* Footer Security Note: Italic entfernt, Aeonik Bold genutzt */}
                <div className="mt-10 flex items-center justify-center gap-3 text-gray-400 animate-in fade-in duration-1000 delay-500">
                    <ShieldCheck size={18} className="text-k5-lime/60" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-k5-sand">
                        Internal Network Only
                    </p>
                </div>
            </div>
        </div>
    );
}