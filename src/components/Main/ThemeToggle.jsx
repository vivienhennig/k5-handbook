import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function ThemeToggle() {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button 
            onClick={toggleTheme}
            className="p-3 rounded-k5-md bg-k5-light-grey dark:bg-k5-deep text-k5-sand dark:text-k5-sand transition-all hover:scale-110 active:scale-95 shadow-sm border border-gray-100 dark:border-k5-deep/50 group"
            title={isDarkMode ? 'Light Mode aktivieren' : 'Dark Mode aktivieren'}
        >
            {isDarkMode ? (
                <Sun size={20} className="group-hover:rotate-45 transition-transform duration-500" />
            ) : (
                <Moon size={20} className="group-hover:-rotate-12 transition-transform duration-500" />
            )}
        </button>
    );
}