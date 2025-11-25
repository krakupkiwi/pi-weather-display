import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Theme } from './types';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();
      // Day: 6 AM to 6 PM, Night: 6 PM to 6 AM
      const newTheme: Theme = hour >= 6 && hour < 18 ? 'light' : 'dark';
      setTheme(newTheme);
    };

    updateTheme();
    const interval = setInterval(updateTheme, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
