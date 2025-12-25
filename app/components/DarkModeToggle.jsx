'use client';

import { useState, useEffect } from 'react';

const SunIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const MoonIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

const STORAGE_KEY = 'darkMode';

export default function DarkModeToggle({ className = '' }) {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage first
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const isDark = saved === 'true';
      setDarkMode(isDark);
      applyDarkMode(isDark);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
      applyDarkMode(prefersDark);
    }
  }, []);

  const applyDarkMode = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem(STORAGE_KEY, String(newValue));
    applyDarkMode(newValue);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        className={`p-2 rounded-full transition-colors ${className}`}
        aria-label="מצב תצוגה"
      >
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleDarkMode}
      className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
        darkMode
          ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      } ${className}`}
      aria-label={darkMode ? 'עבור למצב בהיר' : 'עבור למצב כהה'}
      title={darkMode ? 'מצב בהיר' : 'מצב כהה'}
    >
      {darkMode ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
