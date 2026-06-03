'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'night' | 'classic' | 'minimal';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: 'classic', setTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('classic');

  useEffect(() => {
    const saved = (typeof window !== 'undefined' ? localStorage.getItem('sac_theme') : null);
    const valid: Theme[] = ['night', 'classic', 'minimal'];
    if (saved && valid.includes(saved as Theme)) setThemeState(saved as Theme);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('sac_theme', t);
    document.documentElement.setAttribute('data-theme', t);
  };

  // Apply on mount and change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
