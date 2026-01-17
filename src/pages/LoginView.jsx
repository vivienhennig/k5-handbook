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

        // NEU: Domain Validierung
        const emailDomain = "@k5-gmbh.com";
        if (!email.toLowerCase().endsWith(emailDomain)) {
            setError(`Zugriff verweigert. Bitte nutze deine offizielle ${emailDomain} Adresse.`);
            setLoading(false);
            return; // Prozess hier stoppen
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6 font-sans relative overflow-hidden">
            
            {/* Hintergrund-Deko */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[120px]" />

            <div className="max-w-[480px] w-full relative">
                
                <LoginHeader isRegistering={isRegistering} />

                <LoginForm 
                    email={email} setEmail={setEmail}
                    password={password} setPassword={setPassword}
                    loading={loading} error={error}
                    isRegistering={isRegistering} setIsRegistering={setIsRegistering}
                    handleSubmit={handleSubmit} setError={setError}
                />
                
                {/* Footer Security Note */}
                <div className="mt-8 flex items-center justify-center gap-3 text-gray-400 animate-in fade-in duration-1000">
                    <ShieldCheck size={16} className="text-green-500/50" />
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] italic">Internal Only</p>
                </div>
            </div>
        </div>
    );
}