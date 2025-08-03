import React from 'react';
import { Navigate } from 'react-router-dom';

// Admin Authentication
export const adminAuth = {
  // Giriş kontrolü
  login: (username, password) => {
    // Güvenli giriş bilgileri (production'da environment variables kullanın)
    const validCredentials = {
      username: 'admin',
      password: 'admin123'
    };

    if (username === validCredentials.username && password === validCredentials.password) {
      const sessionData = {
        username: username,
        loginTime: Date.now(),
        isAdmin: true
      };
      localStorage.setItem('adminSession', JSON.stringify(sessionData));
      return {
        success: true,
        message: 'Giriş başarılı'
      };
    }
    return {
      success: false,
      message: 'Kullanıcı adı veya şifre hatalı'
    };
  },

  // Çıkış
  logout: () => {
    localStorage.removeItem('adminSession');
  },

  // Giriş durumu kontrolü
  isLoggedIn: () => {
    const session = localStorage.getItem('adminSession');
    if (!session) return false;
    
    try {
      const sessionData = JSON.parse(session);
      // Session'ın 24 saat geçerli olup olmadığını kontrol et
      const now = Date.now();
      const sessionAge = now - sessionData.loginTime;
      const maxAge = 24 * 60 * 60 * 1000; // 24 saat
      
      if (sessionAge > maxAge) {
        localStorage.removeItem('adminSession');
        return false;
      }
      
      return true;
    } catch (error) {
      localStorage.removeItem('adminSession');
      return false;
    }
  },

  // Kullanıcı bilgilerini al
  getUser: () => {
    const session = localStorage.getItem('adminSession');
    if (!session) return null;
    
    try {
      return JSON.parse(session);
    } catch (error) {
      return null;
    }
  }
};

// Protected Route bileşeni
export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = adminAuth.isLoggedIn();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
}; 