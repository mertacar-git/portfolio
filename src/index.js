import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import App from './App';

// Force dark theme immediately before React loads
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 