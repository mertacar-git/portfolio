import React, { useState, useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import ErrorBoundary from './components/ErrorBoundary';
import RouteRenderer from './components/RouteRenderer';
import ThemeProvider from './contexts/ThemeContext';
import ToastProvider from './contexts/ToastContext';

// Utils
import { analytics } from './utils/dataManager';

// Force dark theme immediately when App loads
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

function App() {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Initialize app
    const initializeApp = async () => {
      try {
        // Track page view
        try {
          analytics.incrementPageView('app');
        } catch (error) {
          console.error('Analytics error:', error);
        }
      } catch (error) {
        console.error('App initialization error:', error);
        setHasError(true);
      }
    };

    initializeApp();
  }, []);

  // Error state
  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-300 mb-4">
            Uygulama Başlatılamadı
          </h2>
          <p className="text-gray-400 mb-4">
            Uygulama başlatılırken bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Sayfayı Yenile
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <Router>
            <div className="min-h-screen bg-gray-900">
              <Header />
              <main className="pt-16">
                <RouteRenderer />
              </main>
              <Footer />
              <ScrollProgress />
            </div>
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App; 