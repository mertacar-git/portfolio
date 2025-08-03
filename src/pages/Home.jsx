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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-secondary-600/10"></div>
        
        <div className="container-max relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
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
                  <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-4xl font-bold" style={{ display: 'none' }}>
                    M
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-700"></div>
              </div>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              {personalInfo.name}
            </h1>
            <h2 className="text-xl md:text-2xl text-primary-600 dark:text-primary-400 font-semibold mb-6">
              {personalInfo.title}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              {personalInfo.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/portfolio"
                className="btn-primary btn-lg inline-flex items-center space-x-2"
              >
                <span>Projelerimi Gör</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="btn-secondary btn-lg inline-flex items-center space-x-2"
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
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              >
                <ChevronDown className="w-6 h-6 animate-bounce" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding bg-white dark:bg-gray-800">
        <div className="container-max">
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
                  className="btn-primary btn-lg inline-flex items-center space-x-2"
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
              <div className="bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Teknolojiler
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {personalInfo.technologies.slice(0, 8).map((tech, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
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
      <section className="section-padding bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="container-max">
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
            <p className="text-xl text-primary-100">
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
                <div className="text-primary-100 text-sm capitalize">
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

      {/* Featured Projects */}
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Öne Çıkan Projeler
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              En son geliştirdiğim projelerden bazıları
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card overflow-hidden group"
              >
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="flex space-x-2">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors duration-200"
                        onClick={() => analytics.incrementProjectView(project.id)}
                      >
                        <ExternalLink className="w-4 h-4 text-white" />
                      </a>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors duration-200"
                      >
                        <Github className="w-4 h-4 text-white" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies && project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 text-xs rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/portfolio#project-${project.id}`}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium inline-flex items-center space-x-1"
                  >
                    <span>Detayları Gör</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/portfolio"
              className="btn-outline inline-flex items-center space-x-2"
            >
              <span>Tüm Projeleri Gör</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section className="section-padding bg-white dark:bg-gray-800">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Son Blog Yazıları
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Teknoloji ve yazılım geliştirme hakkında yazılarım
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBlogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card overflow-hidden group"
              >
                <div className="aspect-video bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <span>{post.publishDate}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags && post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-secondary-100 text-secondary-700 dark:bg-secondary-900/20 dark:text-secondary-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/blog/${post.id}`}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium inline-flex items-center space-x-1"
                    onClick={() => analytics.incrementBlogView(post.id)}
                  >
                    <span>Devamını Oku</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/blog"
              className="btn-outline inline-flex items-center space-x-2"
            >
              <span>Tüm Yazıları Gör</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Projeniz İçin Birlikte Çalışalım
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Modern ve kullanıcı dostu web uygulamaları geliştirmek için hazırım.
              Projenizi hayata geçirmek için benimle iletişime geçin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
              >
                <Mail className="w-5 h-5" />
                <span>İletişime Geç</span>
              </Link>
              {personalInfo.socialLinks?.linkedin && (
                <a
                  href={personalInfo.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary-700 text-white hover:bg-primary-800 font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>LinkedIn'de Takip Et</span>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Social icon helper
const getSocialIcon = (platform) => {
  const icons = {
    github: <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />,
    linkedin: <Linkedin className="w-5 h-5 text-gray-700 dark:text-gray-300" />,
    twitter: <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  };
  return icons[platform] || null;
};

export default Home; 