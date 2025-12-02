import { useState, useEffect } from 'react';

// Theme configurations based on popular e-commerce sites
export const THEMES = {
  amazon: {
    name: 'Amazon',
    icon: '📦',
    primary: 'orange-500',
    secondary: 'slate-800',
    gradient: 'from-orange-50 via-orange-100 to-yellow-50',
    buttonGradient: 'from-orange-400 to-orange-500',
    accentColor: '#ff9900',
    description: 'כתום וצהוב בהשראת Amazon',
  },
  aliexpress: {
    name: 'AliExpress',
    icon: '🛍️',
    primary: 'red-600',
    secondary: 'orange-500',
    gradient: 'from-red-50 via-orange-50 to-yellow-50',
    buttonGradient: 'from-red-500 to-orange-500',
    accentColor: '#e4393c',
    description: 'אדום וכתום בהשראת AliExpress',
  },
  alibaba: {
    name: 'Alibaba',
    icon: '🏭',
    primary: 'orange-600',
    secondary: 'amber-500',
    gradient: 'from-orange-50 via-amber-50 to-orange-100',
    buttonGradient: 'from-orange-500 to-amber-500',
    accentColor: '#ff6a00',
    description: 'כתום חם בהשראת Alibaba',
  },
  ebay: {
    name: 'eBay',
    icon: '🎯',
    primary: 'blue-600',
    secondary: 'yellow-400',
    gradient: 'from-blue-50 via-sky-50 to-yellow-50',
    buttonGradient: 'from-blue-500 to-sky-500',
    accentColor: '#0064d2',
    description: 'כחול וצהוב בהשראת eBay',
  },
  etsy: {
    name: 'Etsy',
    icon: '🎨',
    primary: 'orange-500',
    secondary: 'slate-700',
    gradient: 'from-orange-50 via-amber-50 to-orange-100',
    buttonGradient: 'from-orange-500 to-amber-600',
    accentColor: '#f56400',
    description: 'כתום יצירתי בהשראת Etsy',
  },
  walmart: {
    name: 'Walmart',
    icon: '⭐',
    primary: 'blue-600',
    secondary: 'yellow-400',
    gradient: 'from-blue-50 via-sky-50 to-blue-100',
    buttonGradient: 'from-blue-600 to-blue-700',
    accentColor: '#0071ce',
    description: 'כחול וצהוב בהשראת Walmart',
  },
  shopify: {
    name: 'Shopify',
    icon: '🛒',
    primary: 'green-600',
    secondary: 'emerald-500',
    gradient: 'from-green-50 via-emerald-50 to-teal-50',
    buttonGradient: 'from-green-600 to-emerald-600',
    accentColor: '#5e8e3e',
    description: 'ירוק מודרני בהשראת Shopify',
  },
  wish: {
    name: 'Wish',
    icon: '💙',
    primary: 'sky-500',
    secondary: 'blue-400',
    gradient: 'from-sky-50 via-blue-50 to-cyan-50',
    buttonGradient: 'from-sky-500 to-blue-500',
    accentColor: '#2fb7ec',
    description: 'תכלת עליז בהשראת Wish',
  },
};

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState('amazon');

  useEffect(() => {
    // Load theme from localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('vipo_theme') || 'amazon';
      setCurrentTheme(savedTheme);
    }

    // Listen for theme changes
    const handleThemeChange = () => {
      const newTheme = localStorage.getItem('vipo_theme') || 'default';
      setCurrentTheme(newTheme);
    };

    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  const theme = THEMES[currentTheme] || THEMES.amazon;

  const changeTheme = (themeKey) => {
    if (THEMES[themeKey]) {
      localStorage.setItem('vipo_theme', themeKey);
      setCurrentTheme(themeKey);
      window.dispatchEvent(new Event('themeChanged'));
    }
  };

  return {
    theme,
    currentTheme,
    changeTheme,
    allThemes: THEMES,
  };
}
