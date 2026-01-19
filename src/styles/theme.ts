import { ThemeMode, CategoryColors } from '../types';

export interface Theme {
  mode: ThemeMode;
  colors: {
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
      gradient: string;
    };
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    accent: {
      primary: string;
      secondary: string;
      gradient: string;
    };
    border: string;
    success: string;
    error: string;
    card: string;
    cardHover: string;
    input: string;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
    accent: string;
  };
}

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    background: {
      primary: '#1c1917',
      secondary: '#292524',
      tertiary: '#44403c',
      gradient: 'linear-gradient(180deg, #1c1917 0%, #292524 50%, #1c1917 100%)',
    },
    text: {
      primary: '#fafaf9',
      secondary: '#a8a29e',
      muted: '#78716c',
    },
    accent: {
      primary: '#d97706',
      secondary: '#f59e0b',
      gradient: 'linear-gradient(135deg, #d97706, #f59e0b)',
    },
    border: 'rgba(168, 162, 158, 0.1)',
    success: '#4ade80',
    error: '#ef4444',
    card: 'rgba(68, 64, 60, 0.4)',
    cardHover: 'rgba(68, 64, 60, 0.6)',
    input: 'rgba(68, 64, 60, 0.6)',
  },
  shadows: {
    small: '0 2px 8px rgba(0,0,0,0.2)',
    medium: '0 4px 20px rgba(0,0,0,0.3)',
    large: '0 20px 40px rgba(0,0,0,0.4)',
    accent: '0 4px 20px rgba(217, 119, 6, 0.4)',
  },
};

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    background: {
      primary: '#fafaf9',
      secondary: '#f5f5f4',
      tertiary: '#e7e5e4',
      gradient: 'linear-gradient(180deg, #fafaf9 0%, #f5f5f4 50%, #fafaf9 100%)',
    },
    text: {
      primary: '#1c1917',
      secondary: '#57534e',
      muted: '#78716c',
    },
    accent: {
      primary: '#d97706',
      secondary: '#f59e0b',
      gradient: 'linear-gradient(135deg, #d97706, #f59e0b)',
    },
    border: 'rgba(28, 25, 23, 0.1)',
    success: '#22c55e',
    error: '#dc2626',
    card: 'rgba(231, 229, 228, 0.6)',
    cardHover: 'rgba(231, 229, 228, 0.9)',
    input: 'rgba(231, 229, 228, 0.8)',
  },
  shadows: {
    small: '0 2px 8px rgba(0,0,0,0.08)',
    medium: '0 4px 20px rgba(0,0,0,0.1)',
    large: '0 20px 40px rgba(0,0,0,0.15)',
    accent: '0 4px 20px rgba(217, 119, 6, 0.3)',
  },
};

export const getCategoryColors = (mode: ThemeMode): CategoryColors => ({
  Advice: {
    bg: mode === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)',
    text: mode === 'dark' ? '#60a5fa' : '#2563eb',
  },
  Wins: {
    bg: mode === 'dark' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.1)',
    text: mode === 'dark' ? '#4ade80' : '#16a34a',
  },
  Gear: {
    bg: mode === 'dark' ? 'rgba(249, 115, 22, 0.15)' : 'rgba(249, 115, 22, 0.1)',
    text: mode === 'dark' ? '#fb923c' : '#ea580c',
  },
  Recipes: {
    bg: mode === 'dark' ? 'rgba(236, 72, 153, 0.15)' : 'rgba(236, 72, 153, 0.1)',
    text: mode === 'dark' ? '#f472b6' : '#db2777',
  },
  Support: {
    bg: mode === 'dark' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(168, 85, 247, 0.1)',
    text: mode === 'dark' ? '#c084fc' : '#9333ea',
  },
});

export const getTheme = (mode: ThemeMode): Theme => {
  return mode === 'dark' ? darkTheme : lightTheme;
};
