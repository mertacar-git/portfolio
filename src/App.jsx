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
    console.log('App.jsx: Force dark theme starting...');
    
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
    
    console.log('App.jsx: Force dark theme completed');
  } catch (error) {
    console.error('App.jsx: Dark theme enforcement error:', error);
  }
})();

function App() {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    console.log('App.jsx: useEffect starting...');
    
    // Initialize app
    const initializeApp = async () => {
      try {
        console.log('App.jsx: initializeApp starting...');
        
        // Track page view
        try {
          analytics.incrementPageView('app');
          console.log('App.jsx: Analytics tracked');
        } catch (error) {
          console.error('App.jsx: Analytics error:', error);
        }
        
        // Simulate some loading time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('App.jsx: App initialization completed');
        setIsLoading(false);
        setDebugInfo('App loaded successfully');
        
      } catch (error) {
        console.error('App.jsx: App initialization error:', error);
        setHasError(true);
        setDebugInfo(`Error: ${error.message}`);
      }
    };

    initializeApp();
  }, []);

  console.log('App.jsx: Rendering, isLoading:', isLoading, 'hasError:', hasError);

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
          <p className="text-red-400 mb-4 text-sm">
            Debug: {debugInfo}
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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-300">
            Yükleniyor...
          </h2>
          <p className="text-gray-400 mt-2">
            React uygulaması başlatılıyor...
          </p>
        </div>
      </div>
    );
  }

  // Main app
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