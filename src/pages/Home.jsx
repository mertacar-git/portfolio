import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  ChevronDown,
  Eye
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { personalInfo as defaultPersonalInfo } from '../data/personalInfo';
import { projects as defaultProjects } from '../data/projects';
import { blogPosts as defaultBlogPosts } from '../data/blogPosts';
import { analytics, dataManager } from '../utils/dataManager';

const Home = () => {
  const [personalInfo, setPersonalInfo] = useState(defaultPersonalInfo);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [featuredBlogPosts, setFeaturedBlogPosts] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({
    totalViews: 0,
    uniqueVisitors: 0
  });

  useEffect(() => {
    // Analytics tracking
    analytics.incrementPageView('home');
    analytics.trackUniqueVisitor();
    
    loadData();
    loadAnalytics();
  }, []);

  const loadData = () => {
    // Kişisel bilgileri yükle
    const savedPersonalInfo = storageService.getData('personalInfo');
    if (savedPersonalInfo) {
      setPersonalInfo(savedPersonalInfo);
    } else {
      setPersonalInfo(defaultPersonalInfo);
      storageService.saveData('personalInfo', defaultPersonalInfo);
    }

    // Projeleri yükle
    const savedProjects = storageService.getData('projects');
    if (savedProjects && savedProjects.length > 0) {
      const featured = savedProjects.filter(project => project.featured);
      setFeaturedProjects(featured);
    } else {
      const featured = defaultProjects.filter(project => project.featured);
      setFeaturedProjects(featured);
      storageService.saveData('projects', defaultProjects);
    }

    // Blog yazılarını yükle
    const savedBlogPosts = storageService.getData('blogPosts');
    if (savedBlogPosts && savedBlogPosts.length > 0) {
      const featured = savedBlogPosts.filter(post => post.featured);
      setFeaturedBlogPosts(featured);
    } else {
      const featured = defaultBlogPosts.filter(post => post.featured);
      setFeaturedBlogPosts(featured);
      storageService.saveData('blogPosts', defaultBlogPosts);
    }
  };

  const loadAnalytics = () => {
    const analytics = dataManager.getAnalytics();
    setAnalyticsData({
      totalViews: analytics.totalViews || 0,
      uniqueVisitors: analytics.uniqueVisitors || 0
    });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Stats with analytics data
  const getStats = () => {
    const baseStats = { ...personalInfo.stats };
    return {
      ...baseStats,
      totalViews: analyticsData.totalViews,
      uniqueVisitors: analyticsData.uniqueVisitors
    };
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8"
            >
              <div className="relative inline-block">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-2xl mx-auto">
                  <img
                    src="/images/profile.jpg"
                    alt="Mert Acar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center text-white text-4xl font-bold" style={{ display: 'none' }}>
                    M
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-700"></div>
              </div>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              {personalInfo.name}
            </h1>
            <h2 className="text-xl md:text-2xl text-blue-600 dark:text-blue-400 font-semibold mb-6">
              {personalInfo.title}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              {personalInfo.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/portfolio"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
              >
                <span>Projelerimi Gör</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
              >
                <Mail className="w-5 h-5" />
                <span>İletişime Geç</span>
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex justify-center space-x-4 mb-8">
              {personalInfo.socialLinks && Object.entries(personalInfo.socialLinks).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors duration-200"
                  aria-label={`${platform} profilim`}
                >
                  {getSocialIcon(platform)}
                </a>
              ))}
            </div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <button
                onClick={() => scrollToSection('about')}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                <ChevronDown className="w-6 h-6 animate-bounce" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Hakkımda
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {personalInfo.about}
                </p>
              </div>
              <div className="mt-8">
                <Link
                  to="/about"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
                >
                  <span>Daha Fazla Bilgi</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Teknolojiler
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {personalInfo.technologies.slice(0, 8).map((tech, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {tech}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Başarılarım
            </h2>
            <p className="text-xl text-blue-100">
              Kariyerim boyunca elde ettiğim başarılar
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8">
            {Object.entries(getStats()).map(([key, value], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <motion.div
                  className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                >
                  {key === 'totalViews' && <Eye className="w-6 h-6 mr-2" />}
                  {value}+
                </motion.div>
                <div className="text-blue-100 text-sm capitalize">
                  {key === 'totalViews' && 'Toplam Görüntülenme'}
                  {key === 'uniqueVisitors' && 'Benzersiz Ziyaretçi'}
                  {key === 'completedProjects' && 'Tamamlanan Proje'}
                  {key === 'webAppsBuilt' && 'Web Uygulaması'}
                  {key === 'yearsExperience' && 'Yıl Deneyim'}
                  {key === 'happyClients' && 'Mutlu Müşteri'}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Social icon helper
const getSocialIcon = (platform) => {
  const icons = {
    github: <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />,
    linkedin: <Linkedin className="w-5 h-5 text-blue-600" />,
    twitter: <Twitter className="w-5 h-5 text-blue-400" />
  };
  return icons[platform] || null;
};

export default Home; 