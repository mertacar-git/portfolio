import React from 'react';
import { Navigate } from 'react-router-dom';

// Admin Authentication
export const adminAuth = {
  // Giriş kontrolü
  login: (username, password) => {
    // Demo kullanıcı bilgileri
    const validCredentials = {
      'mert': 'Mert123!',
      'admin': 'Admin123!'
    };

    if (validCredentials[username] && validCredentials[username] === password) {
      // Session bilgilerini localStorage'a kaydet
      const session = {
        username,
        loginTime: Date.now(),
        isAdmin: true
      };
      
      localStorage.setItem('adminSession', JSON.stringify(session));
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

// Güvenlik ayarları
const SECURITY_CONFIG = {
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 dakika
  sessionTimeout: 30 * 60 * 1000, // 30 dakika
  passwordMinLength: 8,
  requireSpecialChars: true,
  requireNumbers: true,
  requireUppercase: true
};

// Local storage anahtarları
const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  LOGIN_ATTEMPTS: 'login_attempts',
  LOCKOUT_TIME: 'lockout_time',
  LAST_ACTIVITY: 'last_activity',
  USER_SESSION: 'user_session'
};

// Şifreleme fonksiyonu (basit base64, production'da daha güçlü şifreleme kullanın)
const encrypt = (data) => {
  try {
    return btoa(JSON.stringify(data));
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

// Şifre çözme fonksiyonu
const decrypt = (encryptedData) => {
  try {
    return JSON.parse(atob(encryptedData));
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// Güvenli local storage işlemleri
const secureStorage = {
  setItem: (key, value) => {
    try {
      const encryptedValue = encrypt(value);
      if (encryptedValue) {
        localStorage.setItem(key, encryptedValue);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Secure storage set error:', error);
      return false;
    }
  },

  getItem: (key) => {
    try {
      const encryptedValue = localStorage.getItem(key);
      if (encryptedValue) {
        return decrypt(encryptedValue);
      }
      return null;
    } catch (error) {
      console.error('Secure storage get error:', error);
      return null;
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Secure storage remove error:', error);
      return false;
    }
  }
};

// Güvenlik yardımcı fonksiyonları
export const securityUtils = {
  // XSS koruması
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input;
    
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  },

  // SQL Injection koruması (basit)
  sanitizeSQL: (input) => {
    if (typeof input !== 'string') return input;
    
    const dangerousChars = [';', '--', '/*', '*/', 'xp_', 'sp_', 'exec', 'select', 'insert', 'update', 'delete', 'drop', 'create'];
    let sanitized = input.toLowerCase();
    
    dangerousChars.forEach(char => {
      sanitized = sanitized.replace(new RegExp(char, 'g'), '');
    });
    
    return sanitized;
  },

  // Şifre güvenlik kontrolü
  validatePassword: (password) => {
    const errors = [];
    
    if (password.length < SECURITY_CONFIG.passwordMinLength) {
      errors.push(`Şifre en az ${SECURITY_CONFIG.passwordMinLength} karakter olmalıdır`);
    }
    
    if (SECURITY_CONFIG.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Şifre en az bir büyük harf içermelidir');
    }
    
    if (SECURITY_CONFIG.requireNumbers && !/\d/.test(password)) {
      errors.push('Şifre en az bir rakam içermelidir');
    }
    
    if (SECURITY_CONFIG.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Şifre en az bir özel karakter içermelidir');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Rate limiting kontrolü
  checkRateLimit: () => {
    const attempts = secureStorage.getItem(STORAGE_KEYS.LOGIN_ATTEMPTS) || 0;
    const lockoutTime = secureStorage.getItem(STORAGE_KEYS.LOCKOUT_TIME);
    
    if (lockoutTime && Date.now() < lockoutTime) {
      const remainingTime = Math.ceil((lockoutTime - Date.now()) / 1000 / 60);
      return {
        isLocked: true,
        remainingMinutes: remainingTime,
        message: `Çok fazla başarısız giriş denemesi. ${remainingTime} dakika sonra tekrar deneyin.`
      };
    }
    
    if (attempts >= SECURITY_CONFIG.maxLoginAttempts) {
      const lockoutEnd = Date.now() + SECURITY_CONFIG.lockoutDuration;
      secureStorage.setItem(STORAGE_KEYS.LOCKOUT_TIME, lockoutEnd);
      return {
        isLocked: true,
        remainingMinutes: Math.ceil(SECURITY_CONFIG.lockoutDuration / 1000 / 60),
        message: `Çok fazla başarısız giriş denemesi. ${Math.ceil(SECURITY_CONFIG.lockoutDuration / 1000 / 60)} dakika sonra tekrar deneyin.`
      };
    }
    
    return { isLocked: false };
  },

  // Giriş denemesi kaydet
  recordLoginAttempt: (success = false) => {
    if (success) {
      secureStorage.removeItem(STORAGE_KEYS.LOGIN_ATTEMPTS);
      secureStorage.removeItem(STORAGE_KEYS.LOCKOUT_TIME);
    } else {
      const attempts = (secureStorage.getItem(STORAGE_KEYS.LOGIN_ATTEMPTS) || 0) + 1;
      secureStorage.setItem(STORAGE_KEYS.LOGIN_ATTEMPTS, attempts);
    }
  },

  // Session kontrolü
  checkSession: () => {
    const lastActivity = secureStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY);
    const session = secureStorage.getItem(STORAGE_KEYS.USER_SESSION);
    
    if (!session) return false;
    
    if (lastActivity && Date.now() - lastActivity > SECURITY_CONFIG.sessionTimeout) {
      securityUtils.logout();
      return false;
    }
    
    // Son aktivite zamanını güncelle
    secureStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now());
    return true;
  },

  // Güvenli giriş
  login: (username, password) => {
    // Rate limiting kontrolü
    const rateLimitCheck = securityUtils.checkRateLimit();
    if (rateLimitCheck.isLocked) {
      return {
        success: false,
        message: rateLimitCheck.message
      };
    }

    // Şifre doğrulama (demo için basit)
    const validCredentials = {
      admin: 'Admin123!',
      mert: 'Mert123!'
    };

    if (validCredentials[username] === password) {
      const session = {
        username,
        loginTime: Date.now(),
        token: Math.random().toString(36).substring(2) + Date.now().toString(36)
      };
      
      secureStorage.setItem(STORAGE_KEYS.USER_SESSION, session);
      secureStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now());
      secureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, session.token);
      
      securityUtils.recordLoginAttempt(true);
      
      return {
        success: true,
        message: 'Giriş başarılı!'
      };
    } else {
      securityUtils.recordLoginAttempt(false);
      
      return {
        success: false,
        message: 'Kullanıcı adı veya şifre hatalı!'
      };
    }
  },

  // Güvenli çıkış
  logout: () => {
    secureStorage.removeItem(STORAGE_KEYS.USER_SESSION);
    secureStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    secureStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
    secureStorage.removeItem(STORAGE_KEYS.LOGIN_ATTEMPTS);
    secureStorage.removeItem(STORAGE_KEYS.LOCKOUT_TIME);
  },

  // Kullanıcı bilgilerini al
  getUser: () => {
    return secureStorage.getItem(STORAGE_KEYS.USER_SESSION);
  },

  // Güvenlik durumu raporu
  getSecurityStatus: () => {
    const session = securityUtils.getUser();
    const lastActivity = secureStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY);
    const attempts = secureStorage.getItem(STORAGE_KEYS.LOGIN_ATTEMPTS) || 0;
    
    return {
      isLoggedIn: !!session,
      sessionActive: session && lastActivity && (Date.now() - lastActivity < SECURITY_CONFIG.sessionTimeout),
      loginAttempts: attempts,
      remainingAttempts: Math.max(0, SECURITY_CONFIG.maxLoginAttempts - attempts),
      sessionTimeout: session ? Math.ceil((SECURITY_CONFIG.sessionTimeout - (Date.now() - lastActivity)) / 1000 / 60) : 0
    };
  }
};

const authUtils = { ProtectedRoute, adminAuth, securityUtils };

export default authUtils; 