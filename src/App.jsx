import React from 'react';
import { HashRouter as Router } from 'react-router-dom';

// Components
import Header from './components/Header';
import ScrollProgress from './components/ScrollProgress';
import ErrorBoundary from './components/ErrorBoundary';
import RouteRenderer from './components/RouteRenderer';
import ThemeProvider from './contexts/ThemeContext';
import ToastProvider from './contexts/ToastContext';

// Force dark theme immediately when App loads
(function() {
  try {
    // Force dark theme on document
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    document.body.classList.add('dark');
    document.body.classList.remove('light');
    
    // Force localStorage
    localStorage.setItem('theme', 'dark');
    localStorage.removeItem('light');
  } catch (error) {
    console.error('Dark theme enforcement error:', error);
  }
})();

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <Router>
            <div className="min-h-screen bg-aggressive-black text-aggressive-white">
              <Header />
              <main className="pt-16">
                <RouteRenderer />
              </main>
              <ScrollProgress />
            </div>
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App; 