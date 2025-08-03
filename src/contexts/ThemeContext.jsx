import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Tema context'i oluştur
const ThemeContext = createContext();

// Tema hook'u
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Tema provider bileşeni
export const ThemeProvider = ({ children }) => {
  // Tema state'i - varsayılan dark
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [isReady, setIsReady] = useState(false);

  // Tema değiştirme fonksiyonu
  const switchTheme = useCallback(() => {
    setCurrentTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      
      // DOM'a hemen uygula
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // localStorage'a kaydet
      try {
        localStorage.setItem('theme', newTheme);
      } catch (error) {
        console.error('Tema kaydedilemedi:', error);
      }
      
      return newTheme;
    });
  }, []);

  // Belirli temayı ayarlama
  const setTheme = useCallback((theme) => {
    if (theme === 'light' || theme === 'dark') {
      setCurrentTheme(theme);
      
      // DOM'a uygula
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // localStorage'a kaydet
      try {
        localStorage.setItem('theme', theme);
      } catch (error) {
        console.error('Tema kaydedilemedi:', error);
      }
    }
  }, []);

  // İlk yükleme
  useEffect(() => {
    try {
      // localStorage'dan tema al
      const savedTheme = localStorage.getItem('theme');
      
      // Eğer light tema varsa sil ve dark yap
      if (savedTheme === 'light') {
        localStorage.removeItem('theme');
      }
      
      // Yeni tema al
      const themeToUse = localStorage.getItem('theme') || 'dark';
      
      // State'i güncelle
      setCurrentTheme(themeToUse);
      
      // DOM'a uygula - her zaman dark başla
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      
      // localStorage'a dark tema kaydet
      localStorage.setItem('theme', 'dark');
      
    } catch (error) {
      console.error('Tema yüklenemedi:', error);
      // Hata durumunda dark tema kullan
      setCurrentTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } finally {
      setIsReady(true);
    }
  }, []);

  // Context değeri
  const contextValue = {
    theme: currentTheme,
    toggleTheme: switchTheme,
    setTheme,
    isReady
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 