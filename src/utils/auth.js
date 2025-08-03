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
      return true;
    }
    return false;
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

// Güvenlik yardımcı fonksiyonları
export const securityUtils = {
  // Rate limiting kontrolü
  checkRateLimit: () => {
    const attempts = localStorage.getItem('loginAttempts') || 0;
    const lockoutTime = localStorage.getItem('lockoutTime');
    
    if (lockoutTime && Date.now() < parseInt(lockoutTime)) {
      const remainingTime = Math.ceil((parseInt(lockoutTime) - Date.now()) / 1000 / 60);
      return {
        isLocked: true,
        remainingMinutes: remainingTime,
        message: `Çok fazla başarısız giriş denemesi. ${remainingTime} dakika sonra tekrar deneyin.`
      };
    }
    
    if (parseInt(attempts) >= 5) {
      const lockoutEnd = Date.now() + (15 * 60 * 1000); // 15 dakika
      localStorage.setItem('lockoutTime', lockoutEnd.toString());
      return {
        isLocked: true,
        remainingMinutes: 15,
        message: 'Çok fazla başarısız giriş denemesi. 15 dakika sonra tekrar deneyin.'
      };
    }
    
    return { isLocked: false };
  },

  // Giriş denemesi kaydet
  recordLoginAttempt: (success = false) => {
    if (success) {
      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('lockoutTime');
    } else {
      const attempts = (parseInt(localStorage.getItem('loginAttempts') || 0) + 1);
      localStorage.setItem('loginAttempts', attempts.toString());
    }
  },

  // Güvenli giriş
  login: (username, password) => {
    const rateLimit = securityUtils.checkRateLimit();
    if (rateLimit.isLocked) {
      return {
        success: false,
        message: rateLimit.message
      };
    }

    const isValid = adminAuth.login(username, password);
    securityUtils.recordLoginAttempt(isValid);

    if (isValid) {
      return {
        success: true,
        message: 'Giriş başarılı'
      };
    } else {
      return {
        success: false,
        message: 'Kullanıcı adı veya şifre hatalı'
      };
    }
  },

  // Güvenlik durumu raporu
  getSecurityStatus: () => {
    const session = adminAuth.getUser();
    const attempts = parseInt(localStorage.getItem('loginAttempts') || 0);
    
    return {
      isLoggedIn: !!session,
      loginAttempts: attempts,
      remainingAttempts: Math.max(0, 5 - attempts),
      isLocked: securityUtils.checkRateLimit().isLocked
    };
  }
}; 