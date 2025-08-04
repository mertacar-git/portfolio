import { storageService } from '../services/storageService';

// Simple Analytics Object
export const analytics = {
  incrementPageView(page) {
    try {
      const analytics = storageService.getData('analytics') || {
        pageViews: {},
        totalViews: 0,
        uniqueVisitors: 0,
        lastUpdated: new Date().toISOString()
      };
      
      analytics.pageViews[page] = (analytics.pageViews[page] || 0) + 1;
      analytics.totalViews += 1;
      analytics.lastUpdated = new Date().toISOString();
      
      storageService.saveData('analytics', analytics);
    } catch (error) {
      console.error('Analytics error:', error);
    }
  },

  trackUniqueVisitor() {
    try {
      const analytics = storageService.getData('analytics') || {
        pageViews: {},
        totalViews: 0,
        uniqueVisitors: 0,
        lastUpdated: new Date().toISOString()
      };
      
      // Simple unique visitor tracking
      const visitorId = localStorage.getItem('visitorId');
      if (!visitorId) {
        const newVisitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('visitorId', newVisitorId);
        analytics.uniqueVisitors += 1;
        storageService.saveData('analytics', analytics);
      }
    } catch (error) {
      console.error('Visitor tracking error:', error);
    }
  },

  incrementBlogView(id) {
    try {
      const analytics = storageService.getData('analytics') || {
        pageViews: {},
        totalViews: 0,
        uniqueVisitors: 0,
        blogViews: {},
        lastUpdated: new Date().toISOString()
      };
      
      analytics.blogViews[id] = (analytics.blogViews[id] || 0) + 1;
      analytics.lastUpdated = new Date().toISOString();
      
      storageService.saveData('analytics', analytics);
    } catch (error) {
      console.error('Blog view tracking error:', error);
    }
  },

  getAnalytics() {
    try {
      return storageService.getData('analytics') || {
        pageViews: {},
        totalViews: 0,
        uniqueVisitors: 0,
        blogViews: {},
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Get analytics error:', error);
      return {
        pageViews: {},
        totalViews: 0,
        uniqueVisitors: 0,
        blogViews: {},
        lastUpdated: new Date().toISOString()
      };
    }
  }
};

// Simple Data Manager
export const dataManager = {
  getAnalytics() {
    return analytics.getAnalytics();
  },

  incrementPageView(page) {
    analytics.incrementPageView(page);
  },

  trackUniqueVisitor() {
    analytics.trackUniqueVisitor();
  },

  incrementBlogView(id) {
    analytics.incrementBlogView(id);
  }
};

// User Preferences
export const userPreferences = {
  getTheme() {
    try {
      return localStorage.getItem('theme') || 'dark';
    } catch (error) {
      return 'dark';
    }
  },

  setTheme(theme) {
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error('Theme save error:', error);
    }
  },

  getLanguage() {
    try {
      return localStorage.getItem('language') || 'tr';
    } catch (error) {
      return 'tr';
    }
  },

  setLanguage(language) {
    try {
      localStorage.setItem('language', language);
    } catch (error) {
      console.error('Language save error:', error);
    }
  }
}; 