

import React, { useState, useEffect } from 'react';

// Input Validation Sistemi
export const validationRules = {
  // Proje validasyon kuralları
  project: {
    title: {
      required: true,
      minLength: 3,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9\s\-_.,!?()]+$/
    },
    description: {
      required: true,
      minLength: 10,
      maxLength: 500
    },
    technologies: {
      required: true,
      minItems: 1,
      maxItems: 10
    },
    category: {
      required: true,
      allowedValues: ['Oyun Geliştirme', 'Web Uygulaması', 'Mobil Uygulama', 'E-ticaret', 'Blog', 'Portfolio', 'Diğer']
    },
    liveUrl: {
      required: false,
      pattern: /^https?:\/\/.+/,
      message: 'Geçerli bir URL giriniz (http:// veya https:// ile başlamalı)'
    },
    githubUrl: {
      required: false,
      pattern: /^https?:\/\/github\.com\/.+/,
      message: 'Geçerli bir GitHub URL\'si giriniz'
    }
  },

  // Blog yazısı validasyon kuralları
  blogPost: {
    title: {
      required: true,
      minLength: 5,
      maxLength: 200,
      pattern: /^[a-zA-Z0-9\s\-_.,!?()]+$/
    },
    excerpt: {
      required: true,
      minLength: 20,
      maxLength: 300
    },
    content: {
      required: true,
      minLength: 100
    },
    category: {
      required: true,
      allowedValues: ['Oyun Geliştirme', 'Web Geliştirme', 'Backend Geliştirme', 'Oyun Tasarımı', 'Teknoloji', 'Kişisel Gelişim', 'Diğer']
    },
    tags: {
      required: false,
      maxItems: 10,
      pattern: /^[a-zA-Z0-9\s]+$/
    }
  },

  // Kişisel bilgi validasyon kuralları
  personalInfo: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/
    },
    title: {
      required: true,
      minLength: 5,
      maxLength: 100
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Geçerli bir email adresi giriniz'
    },
    phone: {
      required: false,
      pattern: /^[+]?[0-9\s\-()]+$/,
      message: 'Geçerli bir telefon numarası giriniz'
    },
    about: {
      required: true,
      minLength: 50,
      maxLength: 2000
    }
  },

  // Site konfigürasyonu validasyon kuralları
  siteConfig: {
    title: {
      required: true,
      minLength: 5,
      maxLength: 100
    },
    description: {
      required: true,
      minLength: 20,
      maxLength: 300
    },
    url: {
      required: true,
      pattern: /^https?:\/\/.+/,
      message: 'Geçerli bir site URL\'si giriniz'
    },
    themeColor: {
      required: true,
      pattern: /^#[0-9A-Fa-f]{6}$/,
      message: 'Geçerli bir hex renk kodu giriniz (#RRGGBB)'
    }
  }
};

// Validation fonksiyonları
export const validateField = (value, rules) => {
  const errors = [];

  // Required kontrolü
  if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    errors.push('Bu alan zorunludur');
    return errors;
  }

  if (!value) return errors; // Boş değerler için diğer kontrolleri atla

  // Min length kontrolü
  if (rules.minLength && value.length < rules.minLength) {
    errors.push(`En az ${rules.minLength} karakter olmalıdır`);
  }

  // Max length kontrolü
  if (rules.maxLength && value.length > rules.maxLength) {
    errors.push(`En fazla ${rules.maxLength} karakter olmalıdır`);
  }

  // Pattern kontrolü
  if (rules.pattern && !rules.pattern.test(value)) {
    errors.push(rules.message || 'Geçersiz format');
  }

  // Allowed values kontrolü
  if (rules.allowedValues && !rules.allowedValues.includes(value)) {
    errors.push(`Geçerli değerler: ${rules.allowedValues.join(', ')}`);
  }

  // Min items kontrolü (array için)
  if (rules.minItems && Array.isArray(value) && value.length < rules.minItems) {
    errors.push(`En az ${rules.minItems} öğe seçilmelidir`);
  }

  // Max items kontrolü (array için)
  if (rules.maxItems && Array.isArray(value) && value.length > rules.maxItems) {
    errors.push(`En fazla ${rules.maxItems} öğe seçilebilir`);
  }

  return errors;
};

// Form validasyonu
export const validateForm = (data, formType) => {
  const errors = {};
  const rules = validationRules[formType];

  if (!rules) {
    console.error(`Validation rules not found for form type: ${formType}`);
    return errors;
  }

  Object.keys(rules).forEach(fieldName => {
    const fieldRules = rules[fieldName];
    const fieldValue = data[fieldName];
    const fieldErrors = validateField(fieldValue, fieldRules);

    if (fieldErrors.length > 0) {
      errors[fieldName] = fieldErrors;
    }
  });

  return errors;
};

// Real-time validation hook
export const useValidation = (initialData = {}, formType) => {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateFieldRealTime = (fieldName, value) => {
    const rules = validationRules[formType]?.[fieldName];
    if (!rules) return [];

    return validateField(value, rules);
  };

  const handleChange = (fieldName, value) => {
    setData(prev => ({ ...prev, [fieldName]: value }));
    
    // Real-time validation
    if (touched[fieldName]) {
      const fieldErrors = validateFieldRealTime(fieldName, value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: fieldErrors
      }));
    }
  };

  const handleBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    const fieldErrors = validateFieldRealTime(fieldName, data[fieldName]);
    setErrors(prev => ({
      ...prev,
      [fieldName]: fieldErrors
    }));
  };

  const validateForm = () => {
    const formErrors = validateForm(data, formType);
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const resetForm = () => {
    setData(initialData);
    setErrors({});
    setTouched({});
  };

  return {
    data,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setData
  };
};

// Sanitization fonksiyonları
export const sanitizeInput = {
  // HTML tag'lerini temizle
  removeHtmlTags: (input) => {
    if (typeof input !== 'string') return input;
    return input.replace(/<[^>]*>/g, '');
  },

  // XSS koruması
  preventXSS: (input) => {
    if (typeof input !== 'string') return input;
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  },

  // SQL injection koruması
  preventSQLInjection: (input) => {
    if (typeof input !== 'string') return input;
    const dangerousChars = [';', '--', '/*', '*/', 'xp_', 'sp_', 'exec', 'select', 'insert', 'update', 'delete', 'drop', 'create'];
    let sanitized = input.toLowerCase();
    
    dangerousChars.forEach(char => {
      sanitized = sanitized.replace(new RegExp(char, 'g'), '');
    });
    
    return sanitized;
  },

  // URL güvenliği
  sanitizeUrl: (url) => {
    if (!url) return url;
    
    // Sadece http ve https protokollerine izin ver
    if (!url.match(/^https?:\/\//)) {
      return `https://${url}`;
    }
    
    return url;
  },

  // Email güvenliği
  sanitizeEmail: (email) => {
    if (!email) return email;
    return email.toLowerCase().trim();
  }
};

// Validation mesajları
export const validationMessages = {
  required: 'Bu alan zorunludur',
  minLength: (min) => `En az ${min} karakter olmalıdır`,
  maxLength: (max) => `En fazla ${max} karakter olmalıdır`,
  invalidEmail: 'Geçerli bir email adresi giriniz',
  invalidUrl: 'Geçerli bir URL giriniz',
  invalidPhone: 'Geçerli bir telefon numarası giriniz',
  invalidColor: 'Geçerli bir renk kodu giriniz',
  minItems: (min) => `En az ${min} öğe seçilmelidir`,
  maxItems: (max) => `En fazla ${max} öğe seçilebilir`
};

const validationUtils = {
  validationRules,
  validateField,
  validateForm,
  useValidation,
  sanitizeInput,
  validationMessages
};

export default validationUtils; 