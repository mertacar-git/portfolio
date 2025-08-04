import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Force aggressive theme immediately when context loads
(function() {
  try {
    // Force aggressive theme on document
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    document.body.classList.add('dark');
    document.body.classList.remove('light');
    
    // Force aggressive theme styles
    document.documentElement.style.backgroundColor = '#000000';
    document.documentElement.style.color = '#ffffff';
    document.body.style.backgroundColor = '#000000';
    document.body.style.color = '#ffffff';
    
    // Force localStorage
    localStorage.setItem('theme', 'dark');
    localStorage.removeItem('light');
    
    // Override any existing styles with aggressive theme
    const style = document.createElement('style');
    style.textContent = `
      * {
        background-color: #000000 !important;
        color: #ffffff !important;
      }
      html, body, #root {
        background-color: #000000 !important;
        color: #ffffff !important;
      }
      .bg-white, .bg-gray-50, .bg-gray-100, .bg-gray-200 {
        background-color: #000000 !important;
      }
      .text-gray-900, .text-gray-800, .text-gray-700 {
        color: #ffffff !important;
      }
    `;
    document.head.appendChild(style);
  } catch (error) {
    console.error('Aggressive theme enforcement error:', error);
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

  // Tema değiştirme fonksiyonu - dark ve light arasında geçiş
  const toggleTheme = useCallback(() => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(newTheme);
    
    // DOM'a hemen uygula
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
      
      // Aggressive dark theme styles
      document.documentElement.style.backgroundColor = '#000000';
      document.documentElement.style.color = '#ffffff';
      document.body.style.backgroundColor = '#000000';
      document.body.style.color = '#ffffff';
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light');
      document.body.classList.remove('dark');
      
      // Aggressive light theme styles
      document.documentElement.style.backgroundColor = '#ffffff';
      document.documentElement.style.color = '#000000';
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#000000';
    }
    
    // localStorage'a kaydet
    try {
      localStorage.setItem('theme', newTheme);
      if (newTheme === 'dark') {
        localStorage.removeItem('light');
      } else {
        localStorage.removeItem('dark');
      }
    } catch (error) {
      console.error('Tema kaydedilemedi:', error);
    }
  }, [currentTheme]);

  // Belirli temayı ayarlama
  const setTheme = useCallback((theme) => {
    setCurrentTheme(theme);
    
    // DOM'a uygula
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
      
      // Aggressive dark theme styles
      document.documentElement.style.backgroundColor = '#000000';
      document.documentElement.style.color = '#ffffff';
      document.body.style.backgroundColor = '#000000';
      document.body.style.color = '#ffffff';
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light');
      document.body.classList.remove('dark');
      
      // Aggressive light theme styles
      document.documentElement.style.backgroundColor = '#ffffff';
      document.documentElement.style.color = '#000000';
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#000000';
    }
    
    // localStorage'a kaydet
    try {
      localStorage.setItem('theme', theme);
      if (theme === 'dark') {
        localStorage.removeItem('light');
      } else {
        localStorage.removeItem('dark');
      }
    } catch (error) {
      console.error('Tema kaydedilemedi:', error);
    }
  }, []);

  // İlk yükleme
  useEffect(() => {
    try {
      // localStorage'dan tema al
      const savedTheme = localStorage.getItem('theme') || 'dark';
      setCurrentTheme(savedTheme);
      
      // DOM'a uygula
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.body.classList.add('dark');
        document.body.classList.remove('light');
        
        // Aggressive dark theme styles
        document.documentElement.style.backgroundColor = '#000000';
        document.documentElement.style.color = '#ffffff';
        document.body.style.backgroundColor = '#000000';
        document.body.style.color = '#ffffff';
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
        document.body.classList.add('light');
        document.body.classList.remove('dark');
        
        // Aggressive light theme styles
        document.documentElement.style.backgroundColor = '#ffffff';
        document.documentElement.style.color = '#000000';
        document.body.style.backgroundColor = '#ffffff';
        document.body.style.color = '#000000';
      }
      
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
    toggleTheme,
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