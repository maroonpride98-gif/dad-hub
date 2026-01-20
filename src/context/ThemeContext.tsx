import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeMode } from '../types';
import { Theme, getTheme, getCategoryColors, ACCENT_COLORS } from '../styles/theme';
import { CategoryColors } from '../types';

interface ThemeContextType {
  mode: ThemeMode;
  theme: Theme;
  categoryColors: CategoryColors;
  accentId: string;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  setAccentColor: (accentId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'dadhub-theme';
const ACCENT_STORAGE_KEY = 'dadhub-accent';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    }
    return 'dark';
  });

  const [accentId, setAccentId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(ACCENT_STORAGE_KEY);
      if (saved && ACCENT_COLORS.find(c => c.id === saved)) {
        return saved;
      }
    }
    return 'amber';
  });

  const theme = getTheme(mode, accentId);
  const categoryColors = getCategoryColors(mode);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem(ACCENT_STORAGE_KEY, accentId);
  }, [accentId]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  const setAccentColor = (newAccentId: string) => {
    setAccentId(newAccentId);
  };

  return (
    <ThemeContext.Provider value={{ mode, theme, categoryColors, accentId, toggleTheme, setThemeMode, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
