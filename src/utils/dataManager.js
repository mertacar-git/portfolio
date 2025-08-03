import { storageService } from '../services/storageService';
import { personalInfo } from '../data/personalInfo';
import { projects } from '../data/projects';
import { blogPosts } from '../data/blogPosts';
import { siteConfig } from '../data/siteConfig';

// Data Manager Class
class DataManager {
  constructor() {
    this.initializeData();
  }

  // Initialize data from localStorage or default data
  initializeData() {
    // Personal Info
    if (!storageService.getData('personalInfo')) {
      storageService.saveData('personalInfo', personalInfo);
    }

    // Projects
    if (!storageService.getData('projects')) {
      storageService.saveData('projects', projects);
    }

    // Blog Posts
    if (!storageService.getData('blogPosts')) {
      storageService.saveData('blogPosts', blogPosts);
    }

    // Site Config
    if (!storageService.getData('siteConfig')) {
      storageService.saveData('siteConfig', siteConfig);
    }

    // Analytics
    if (!storageService.getData('analytics')) {
      storageService.saveData('analytics', {
        pageViews: {},
        totalViews: 0,
        uniqueVisitors: 0,
        lastUpdated: new Date().toISOString()
      });
    }
  }

  // Personal Info Management
  getPersonalInfo() {
    return storageService.getData('personalInfo') || personalInfo;
  }

  updatePersonalInfo(data) {
    const currentData = this.getPersonalInfo();
    const updatedData = { ...currentData, ...data };
    storageService.saveData('personalInfo', updatedData);
    return updatedData;
  }

  updateSkills(skills) {
    const currentData = this.getPersonalInfo();
    currentData.skills = skills;
    storageService.saveData('personalInfo', currentData);
    return currentData;
  }

  updateStats(stats) {
    const currentData = this.getPersonalInfo();
    currentData.stats = { ...currentData.stats, ...stats };
    storageService.saveData('personalInfo', currentData);
    return currentData;
  }

  // Projects Management
  getProjects() {
    return storageService.getData('projects') || projects;
  }

  addProject(project) {
    const currentProjects = this.getProjects();
    const newProject = {
      ...project,
      id: Math.max(...currentProjects.map(p => p.id), 0) + 1,
      publishDate: new Date().toLocaleDateString('tr-TR')
    };
    currentProjects.push(newProject);
    storageService.saveData('projects', currentProjects);
    return newProject;
  }

  updateProject(id, data) {
    const currentProjects = this.getProjects();
    const projectIndex = currentProjects.findIndex(p => p.id === id);
    if (projectIndex !== -1) {
      currentProjects[projectIndex] = { ...currentProjects[projectIndex], ...data };
      storageService.saveData('projects', currentProjects);
      return currentProjects[projectIndex];
    }
    return null;
  }

  deleteProject(id) {
    const currentProjects = this.getProjects();
    const filteredProjects = currentProjects.filter(p => p.id !== id);
    storageService.saveData('projects', filteredProjects);
    return filteredProjects;
  }

  // Blog Posts Management
  getBlogPosts() {
    return storageService.getData('blogPosts') || blogPosts;
  }

  addBlogPost(post) {
    const currentPosts = this.getBlogPosts();
    const newPost = {
      ...post,
      id: Math.max(...currentPosts.map(p => p.id), 0) + 1,
      publishDate: new Date().toLocaleDateString('tr-TR'),
      views: 0,
      likes: 0
    };
    currentPosts.push(newPost);
    storageService.saveData('blogPosts', currentPosts);
    return newPost;
  }

  updateBlogPost(id, data) {
    const currentPosts = this.getBlogPosts();
    const postIndex = currentPosts.findIndex(p => p.id === id);
    if (postIndex !== -1) {
      currentPosts[postIndex] = { ...currentPosts[postIndex], ...data };
      storageService.saveData('blogPosts', currentPosts);
      return currentPosts[postIndex];
    }
    return null;
  }

  deleteBlogPost(id) {
    const currentPosts = this.getBlogPosts();
    const filteredPosts = currentPosts.filter(p => p.id !== id);
    storageService.saveData('blogPosts', filteredPosts);
    return filteredPosts;
  }

  incrementBlogViews(id) {
    const currentPosts = this.getBlogPosts();
    const postIndex = currentPosts.findIndex(p => p.id === id);
    if (postIndex !== -1) {
      currentPosts[postIndex].views += 1;
      storageService.saveData('blogPosts', currentPosts);
    }
  }

  // Analytics Management
  getAnalytics() {
    return storageService.getData('analytics') || {
      pageViews: {},
      totalViews: 0,
      uniqueVisitors: 0,
      lastUpdated: new Date().toISOString()
    };
  }

  incrementPageView(page) {
    const analytics = this.getAnalytics();
    analytics.pageViews[page] = (analytics.pageViews[page] || 0) + 1;
    analytics.totalViews += 1;
    analytics.lastUpdated = new Date().toISOString();
    storageService.saveData('analytics', analytics);
  }

  incrementUniqueVisitor() {
    const analytics = this.getAnalytics();
    analytics.uniqueVisitors += 1;
    analytics.lastUpdated = new Date().toISOString();
    storageService.saveData('analytics', analytics);
  }

  // Site Config Management
  getSiteConfig() {
    return storageService.getData('siteConfig') || siteConfig;
  }

  updateSiteConfig(config) {
    const currentConfig = this.getSiteConfig();
    const updatedConfig = { ...currentConfig, ...config };
    storageService.saveData('siteConfig', updatedConfig);
    return updatedConfig;
  }

  // Backup and Restore
  exportAllData() {
    return {
      personalInfo: this.getPersonalInfo(),
      projects: this.getProjects(),
      blogPosts: this.getBlogPosts(),
      siteConfig: this.getSiteConfig(),
      analytics: this.getAnalytics(),
      timestamp: new Date().toISOString()
    };
  }

  importAllData(data) {
    if (data.personalInfo) storageService.saveData('personalInfo', data.personalInfo);
    if (data.projects) storageService.saveData('projects', data.projects);
    if (data.blogPosts) storageService.saveData('blogPosts', data.blogPosts);
    if (data.siteConfig) storageService.saveData('siteConfig', data.siteConfig);
    if (data.analytics) storageService.saveData('analytics', data.analytics);
    return true;
  }

  // Statistics and Reports
  getDashboardStats() {
    const projects = this.getProjects();
    const blogPosts = this.getBlogPosts();
    const analytics = this.getAnalytics();
    const personalInfo = this.getPersonalInfo();

    return {
      totalProjects: projects.length,
      featuredProjects: projects.filter(p => p.featured).length,
      totalBlogPosts: blogPosts.length,
      featuredBlogPosts: blogPosts.filter(p => p.featured).length,
      totalSkills: personalInfo.skills.length,
      totalViews: analytics.totalViews,
      uniqueVisitors: analytics.uniqueVisitors,
      completedProjects: personalInfo.stats.completedProjects,
      webAppsBuilt: personalInfo.stats.webAppsBuilt,
      yearsExperience: personalInfo.stats.yearsExperience,
      happyClients: personalInfo.stats.happyClients
    };
  }

  // Search functionality
  searchProjects(query) {
    const projects = this.getProjects();
    const lowercaseQuery = query.toLowerCase();
    return projects.filter(project => 
      project.title.toLowerCase().includes(lowercaseQuery) ||
      project.description.toLowerCase().includes(lowercaseQuery) ||
      project.technologies.some(tech => tech.toLowerCase().includes(lowercaseQuery))
    );
  }

  searchBlogPosts(query) {
    const posts = this.getBlogPosts();
    const lowercaseQuery = query.toLowerCase();
    return posts.filter(post => 
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.excerpt.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }
}

// User Preferences Management
export const userPreferences = {
  getTheme() {
    return storageService.getData('theme') || 'light';
  },

  setTheme(theme) {
    storageService.saveData('theme', theme);
  },

  getLanguage() {
    return storageService.getData('language') || 'tr';
  },

  setLanguage(language) {
    storageService.saveData('language', language);
  }
};

// Analytics tracking
export const analytics = {
  incrementPageView(page) {
    const dataManager = new DataManager();
    dataManager.incrementPageView(page);
  },

  trackUniqueVisitor() {
    const dataManager = new DataManager();
    dataManager.incrementUniqueVisitor();
  }
};

// Export singleton instance
export const dataManager = new DataManager(); 