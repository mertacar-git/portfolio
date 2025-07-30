import React, { createContext, useContext, useState, useEffect } from 'react';
import { userPreferences } from '../utils/dataManager';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = userPreferences.getTheme();
    setTheme(savedTheme);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      // Apply theme to document
      document.documentElement.classList.toggle('dark', theme === 'dark');
      // Save theme preference
      userPreferences.setTheme(theme);
    }
  }, [theme, isLoaded]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    toggleTheme,
    isLoaded
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 