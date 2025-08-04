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
    
    // Force aggressive black theme styles
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
    console.error('Dark theme enforcement error:', error);
  }
})();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 