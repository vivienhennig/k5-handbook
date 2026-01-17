import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function ThemeToggle() {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button 
            onClick={toggleTheme}
            className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-yellow-400 transition-all hover:scale-110 active:scale-95 shadow-sm border border-gray-200 dark:border-gray-700"
            title={isDarkMode ? 'Light Mode aktivieren' : 'Dark Mode aktivieren'}
        >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}