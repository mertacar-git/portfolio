import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Force dark theme immediately when context loads
(function() {
  try {
    // Force dark theme on document
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    document.body.classList.add('dark');
    document.body.classList.remove('light');
    
    // Force dark theme styles
    document.documentElement.style.backgroundColor = '#111827';
    document.documentElement.style.color = '#f9fafb';
    document.body.style.backgroundColor = '#111827';
    document.body.style.color = '#f9fafb';
    
    // Force localStorage
    localStorage.setItem('theme', 'dark');
    localStorage.removeItem('light');
    
    // Override any existing styles
    const style = document.createElement('style');
    style.textContent = `
      * {
        background-color: #111827 !important;
        color: #f9fafb !important;
      }
      html, body, #root {
        background-color: #111827 !important;
        color: #f9fafb !important;
      }
      .bg-white, .bg-gray-50, .bg-gray-100, .bg-gray-200 {
        background-color: #111827 !important;
      }
    `;
    document.head.appendChild(style);
  } catch (error) {
    console.error('Dark theme enforcement error:', error);
  }
})();

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

  // Tema değiştirme fonksiyonu - sadece dark'a izin ver
  const switchTheme = useCallback(() => {
    // Sadece dark tema kullan
    setCurrentTheme('dark');
    
    // DOM'a hemen uygula
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    
    // localStorage'a kaydet
    try {
      localStorage.setItem('theme', 'dark');
      localStorage.removeItem('light');
    } catch (error) {
      console.error('Tema kaydedilemedi:', error);
    }
  }, []);

  // Belirli temayı ayarlama - sadece dark'a izin ver
  const setTheme = useCallback((theme) => {
    // Sadece dark tema kullan
    setCurrentTheme('dark');
    
    // DOM'a uygula
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    
    // localStorage'a kaydet
    try {
      localStorage.setItem('theme', 'dark');
      localStorage.removeItem('light');
    } catch (error) {
      console.error('Tema kaydedilemedi:', error);
    }
  }, []);

  // İlk yükleme
  useEffect(() => {
    try {
      // localStorage'ı temizle
      localStorage.removeItem('light');
      
      // Her zaman dark tema kullan
      setCurrentTheme('dark');
      
      // DOM'a uygula - her zaman dark başla
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
      
      // localStorage'a dark tema kaydet
      localStorage.setItem('theme', 'dark');
      
      // Sürekli kontrol et
      const interval = setInterval(() => {
        try {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
          document.body.classList.add('dark');
          document.body.classList.remove('light');
          localStorage.setItem('theme', 'dark');
          localStorage.removeItem('light');
        } catch (error) {
          // Hata durumunda sessizce devam et
        }
      }, 100);
      
      // Cleanup
      return () => clearInterval(interval);
      
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