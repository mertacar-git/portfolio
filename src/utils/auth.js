import React from 'react';
import { Navigate } from 'react-router-dom';

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

// Protected Route bileşeni
export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = securityUtils.checkSession();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

// Admin giriş sayfası bileşeni
export const AdminLogin = () => {
  const [credentials, setCredentials] = React.useState({ username: '', password: '' });
  const [message, setMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Rate limiting kontrolü
    const rateLimitCheck = securityUtils.checkRateLimit();
    if (rateLimitCheck.isLocked) {
      setMessage(rateLimitCheck.message);
      setIsLoading(false);
      return;
    }

    // Input sanitization
    const sanitizedUsername = securityUtils.sanitizeInput(credentials.username);
    const sanitizedPassword = securityUtils.sanitizeInput(credentials.password);

    const result = securityUtils.login(sanitizedUsername, sanitizedPassword);
    
    if (result.success) {
      setMessage(result.message);
      setTimeout(() => {
        window.location.href = '/admin';
      }, 1000);
    } else {
      setMessage(result.message);
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: securityUtils.sanitizeInput(value)
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Admin Girişi
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Güvenli erişim için giriş yapın
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Kullanıcı Adı</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-700"
                placeholder="Kullanıcı Adı"
                value={credentials.username}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Şifre</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-700"
                placeholder="Şifre"
                value={credentials.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {message && (
            <div className={`text-sm text-center p-3 rounded-md ${
              message.includes('başarılı') 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            }`}>
              {message}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </div>

          <div className="text-xs text-center text-gray-500 dark:text-gray-400">
            <p>Demo Giriş Bilgileri:</p>
            <p>Kullanıcı: admin | Şifre: Admin123!</p>
            <p>Kullanıcı: mert | Şifre: Mert123!</p>
          </div>
        </form>
      </div>
    </div>
  );
};

const authUtils = { ProtectedRoute, AdminLogin, securityUtils };

export default authUtils; 