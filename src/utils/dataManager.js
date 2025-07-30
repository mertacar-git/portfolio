// Veri Yönetimi Yardımcı Fonksiyonları
import { personalInfo } from '../data/personalInfo';
import { projects, filterProjectsByCategory, getFeaturedProjects } from '../data/projects';
import { blogPosts, filterBlogPostsByCategory, getFeaturedBlogPosts, getBlogPostById } from '../data/blogPosts';
import { siteConfig } from '../data/siteConfig';

// Local Storage Yardımcı Fonksiyonları
export const storage = {
  // Veri kaydetme
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Local storage kaydetme hatası:', error);
      return false;
    }
  },

  // Veri okuma
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Local storage okuma hatası:', error);
      return defaultValue;
    }
  },

  // Veri silme
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Local storage silme hatası:', error);
      return false;
    }
  },

  // Tüm verileri temizleme
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Local storage temizleme hatası:', error);
      return false;
    }
  }
};

// Kullanıcı Tercihleri Yönetimi
export const userPreferences = {
  // Tema tercihi
  getTheme: () => {
    return storage.get('theme', 'light');
  },

  setTheme: (theme) => {
    storage.set('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  },

  // Dil tercihi
  getLanguage: () => {
    return storage.get('language', 'tr');
  },

  setLanguage: (language) => {
    storage.set('language', language);
  },

  // Bildirim tercihi
  getNotifications: () => {
    return storage.get('notifications', true);
  },

  setNotifications: (enabled) => {
    storage.set('notifications', enabled);
  }
};

// Form Veri Yönetimi
export const formData = {
  // Form verilerini kaydetme
  saveFormData: (formName, data) => {
    const key = `form_${formName}`;
    storage.set(key, data);
  },

  // Form verilerini yükleme
  loadFormData: (formName) => {
    const key = `form_${formName}`;
    return storage.get(key, {});
  },

  // Form verilerini temizleme
  clearFormData: (formName) => {
    const key = `form_${formName}`;
    storage.remove(key);
  },

  // Form validasyonu
  validateForm: (data, rules) => {
    const errors = {};

    Object.keys(rules).forEach(field => {
      const value = data[field];
      const rule = rules[field];

      // Gerekli alan kontrolü
      if (rule.required && (!value || value.trim() === '')) {
        errors[field] = `${rule.label || field} alanı zorunludur.`;
        return;
      }

      // Email formatı kontrolü
      if (rule.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors[field] = 'Geçerli bir email adresi giriniz.';
        }
      }

      // Minimum uzunluk kontrolü
      if (rule.minLength && value && value.length < rule.minLength) {
        errors[field] = `${rule.label || field} en az ${rule.minLength} karakter olmalıdır.`;
      }

      // Maksimum uzunluk kontrolü
      if (rule.maxLength && value && value.length > rule.maxLength) {
        errors[field] = `${rule.label || field} en fazla ${rule.maxLength} karakter olmalıdır.`;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

// Arama ve Filtreleme
export const searchAndFilter = {
  // Projelerde arama
  searchProjects: (query, projects = projects) => {
    if (!query) return projects;

    const searchTerm = query.toLowerCase();
    return projects.filter(project => 
      project.title.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm) ||
      project.technologies.some(tech => 
        tech.toLowerCase().includes(searchTerm)
      )
    );
  },

  // Blog yazılarında arama
  searchBlogPosts: (query, posts = blogPosts) => {
    if (!query) return posts;

    const searchTerm = query.toLowerCase();
    return posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => 
        tag.toLowerCase().includes(searchTerm)
      )
    );
  },

  // Tarihe göre filtreleme
  filterByDate: (items, startDate, endDate) => {
    return items.filter(item => {
      const itemDate = new Date(item.publishDate || item.year);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && itemDate < start) return false;
      if (end && itemDate > end) return false;
      return true;
    });
  },

  // Popülerlik sıralaması
  sortByPopularity: (items) => {
    return [...items].sort((a, b) => {
      const scoreA = (a.views || 0) + (a.likes || 0) * 2;
      const scoreB = (b.views || 0) + (b.likes || 0) * 2;
      return scoreB - scoreA;
    });
  }
};

// İstatistik ve Analytics
export const analytics = {
  // Sayfa görüntüleme sayısı
  incrementPageView: (pageName) => {
    const key = `page_views_${pageName}`;
    const currentViews = storage.get(key, 0);
    storage.set(key, currentViews + 1);
  },

  // Proje görüntüleme sayısı
  incrementProjectView: (projectId) => {
    const key = `project_views_${projectId}`;
    const currentViews = storage.get(key, 0);
    storage.set(key, currentViews + 1);
  },

  // Blog yazısı görüntüleme sayısı
  incrementBlogView: (postId) => {
    const key = `blog_views_${postId}`;
    const currentViews = storage.get(key, 0);
    storage.set(key, currentViews + 1);
  },

  // İstatistikleri getirme
  getStats: () => {
    const stats = {
      totalPageViews: 0,
      totalProjectViews: 0,
      totalBlogViews: 0,
      popularPages: [],
      popularProjects: [],
      popularBlogPosts: []
    };

    // Local storage'dan tüm istatistikleri topla
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('page_views_')) {
        const pageName = key.replace('page_views_', '');
        const views = storage.get(key, 0);
        stats.totalPageViews += views;
        stats.popularPages.push({ page: pageName, views });
      } else if (key.startsWith('project_views_')) {
        const projectId = key.replace('project_views_', '');
        const views = storage.get(key, 0);
        stats.totalProjectViews += views;
        stats.popularProjects.push({ projectId, views });
      } else if (key.startsWith('blog_views_')) {
        const postId = key.replace('blog_views_', '');
        const views = storage.get(key, 0);
        stats.totalBlogViews += views;
        stats.popularBlogPosts.push({ postId, views });
      }
    });

    // Popüler listeleri sırala
    stats.popularPages.sort((a, b) => b.views - a.views);
    stats.popularProjects.sort((a, b) => b.views - a.views);
    stats.popularBlogPosts.sort((a, b) => b.views - a.views);

    return stats;
  }
};

// Veri Export/Import
export const dataExport = {
  // Tüm verileri export etme
  exportAllData: () => {
    const data = {
      personalInfo,
      projects,
      blogPosts,
      siteConfig,
      userPreferences: {
        theme: userPreferences.getTheme(),
        language: userPreferences.getLanguage(),
        notifications: userPreferences.getNotifications()
      },
      analytics: analytics.getStats(),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mert-portfolio-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Verileri import etme
  importData: (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      
      // Kullanıcı tercihlerini güncelle
      if (data.userPreferences) {
        userPreferences.setTheme(data.userPreferences.theme);
        userPreferences.setLanguage(data.userPreferences.language);
        userPreferences.setNotifications(data.userPreferences.notifications);
      }

      return { success: true, message: 'Veriler başarıyla import edildi.' };
    } catch (error) {
      return { success: false, message: 'Veri import hatası: ' + error.message };
    }
  }
};

// Cache Yönetimi
export const cache = {
  // Cache'e veri kaydetme
  set: (key, data, ttl = 3600000) => { // Varsayılan 1 saat
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl
    };
    storage.set(`cache_${key}`, cacheData);
  },

  // Cache'den veri okuma
  get: (key) => {
    const cacheData = storage.get(`cache_${key}`);
    
    if (!cacheData) return null;

    const now = Date.now();
    const isExpired = (now - cacheData.timestamp) > cacheData.ttl;

    if (isExpired) {
      storage.remove(`cache_${key}`);
      return null;
    }

    return cacheData.data;
  },

  // Cache'i temizleme
  clear: () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('cache_')) {
        storage.remove(key);
      }
    });
  }
}; 