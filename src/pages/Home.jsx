import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Github,
  Linkedin,
  Twitter,
  Mail,
  ChevronDown,
  Eye
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { personalInfo as defaultPersonalInfo } from '../data/personalInfo';
import { projects as defaultProjects } from '../data/projects';
import { blogPosts as defaultBlogPosts } from '../data/blogPosts';
import { analytics, dataManager } from '../utils/dataManager';
import useProfileImage from '../hooks/useProfileImage';

const Home = () => {
  const [personalInfo, setPersonalInfo] = useState(defaultPersonalInfo);
  const [analyticsData, setAnalyticsData] = useState({
    totalViews: 0,
    uniqueVisitors: 0
  });
  const { getImageStyle, getImageUrl } = useProfileImage();

  useEffect(() => {
    // Analytics tracking
    analytics.incrementPageView('home');
    analytics.trackUniqueVisitor();
    
    loadData();
    loadAnalytics();
    
    // Her 30 saniyede bir analytics'i güncelle
    const interval = setInterval(() => {
      loadAnalytics();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    try {
      // Kişisel bilgileri yükle
      const savedPersonalInfo = storageService.getData('personalInfo');
      if (savedPersonalInfo && typeof savedPersonalInfo === 'object') {
        setPersonalInfo(savedPersonalInfo);
      } else {
        setPersonalInfo(defaultPersonalInfo);
        storageService.saveData('personalInfo', defaultPersonalInfo);
      }

      // Projeleri yükle
      const savedProjects = storageService.getData('projects');
      if (!savedProjects || !Array.isArray(savedProjects) || savedProjects.length === 0) {
        storageService.saveData('projects', defaultProjects);
      }

      // Blog yazılarını yükle
      const savedBlogPosts = storageService.getData('blogPosts');
      if (!savedBlogPosts || !Array.isArray(savedBlogPosts) || savedBlogPosts.length === 0) {
        storageService.saveData('blogPosts', defaultBlogPosts);
      }
    } catch (error) {
      console.error('loadData error:', error);
      // Hata durumunda varsayılan verileri kullan
      setPersonalInfo(defaultPersonalInfo);
      storageService.saveData('personalInfo', defaultPersonalInfo);
      storageService.saveData('projects', defaultProjects);
      storageService.saveData('blogPosts', defaultBlogPosts);
    }
  };

  const loadAnalytics = () => {
    try {
      const analytics = dataManager.getAnalytics();
      setAnalyticsData({
        totalViews: analytics.totalViews || 0,
        uniqueVisitors: analytics.uniqueVisitors || 0
      });
      
      // Sayfa yüklendiğinde görüntülenme sayısını artır
      dataManager.incrementPageView('home');
    } catch (error) {
      console.error('Analytics yükleme hatası:', error);
      setAnalyticsData({
        totalViews: 0,
        uniqueVisitors: 0
      });
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Stats with analytics data
  const getStats = () => {
    try {
      const baseStats = personalInfo.stats ? { ...personalInfo.stats } : {};
      return {
        ...baseStats,
        totalViews: analyticsData.totalViews || 0,
        uniqueVisitors: analyticsData.uniqueVisitors || 0
      };
    } catch (error) {
      console.error('getStats error:', error);
      return {
        totalViews: 0,
        uniqueVisitors: 0,
        completedProjects: 0,
        webAppsBuilt: 0,
        yearsExperience: 0,
        happyClients: 0
      };
    }
  };

  return (
    <div className="min-h-screen bg-aggressive-black text-aggressive-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-aggressive-black">
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
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-aggressive-white shadow-aggressive-xl mx-auto">
                  <img
                    src={getImageUrl()}
                    alt="Mert Acar"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    style={getImageStyle()}
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-aggressive-white rounded-full border-4 border-aggressive-black"></div>
              </div>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold text-aggressive-white mb-6">
              {personalInfo?.name || 'Mert Acar'}
            </h1>
            <h2 className="text-xl md:text-2xl text-aggressive-white font-bold mb-6">
              {personalInfo?.title || 'Full Stack Developer'}
            </h2>
            <p className="text-lg md:text-xl text-aggressive-gray mb-8 max-w-3xl mx-auto font-bold">
              {personalInfo?.subtitle || 'Modern web teknolojileri ile kullanıcı dostu uygulamalar geliştiriyorum.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/portfolio"
                className="btn-primary hover-aggressive inline-flex items-center space-x-2"
              >
                <span>Projelerimi Gör</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="btn-secondary hover-aggressive inline-flex items-center space-x-2"
              >
                <Mail className="w-5 h-5" />
                <span>İletişime Geç</span>
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex justify-center space-x-4 mb-8">
              {personalInfo?.socialLinks && Object.entries(personalInfo.socialLinks).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-aggressive-white/10 backdrop-blur-sm rounded-lg hover:bg-aggressive-white hover:text-aggressive-black transition-all duration-200 hover-aggressive"
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
                className="p-2 text-aggressive-white hover:text-aggressive-black hover:bg-aggressive-white rounded-lg transition-all duration-200 hover-aggressive"
              >
                <ChevronDown className="w-6 h-6 animate-aggressive-bounce" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 bg-aggressive-gray">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-aggressive-white mb-6">
                Hakkımda
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-aggressive-gray leading-relaxed font-bold">
                  {personalInfo.about}
                </p>
              </div>
              <div className="mt-8">
                <Link
                  to="/about"
                  className="btn-primary hover-aggressive inline-flex items-center space-x-2"
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
              <div className="card">
                <h3 className="text-xl font-bold text-aggressive-white mb-6">
                  Teknolojiler
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {personalInfo.technologies && Array.isArray(personalInfo.technologies) && 
                    personalInfo.technologies.slice(0, 8).map((tech, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-aggressive-black/50 rounded-lg border border-aggressive-white"
                      >
                        <div className="w-2 h-2 bg-aggressive-white rounded-full"></div>
                        <span className="text-aggressive-white font-bold">
                          {tech}
                        </span>
                      </div>
                    ))
                  }
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-aggressive-black border-t-2 border-aggressive-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-aggressive-white mb-4">
              Başarılarım
            </h2>
            <p className="text-xl text-aggressive-gray font-bold">
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
                  className="text-3xl md:text-4xl font-bold text-aggressive-white mb-2 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                >
                  {key === 'totalViews' && <Eye className="w-6 h-6 mr-2" />}
                  {value}+
                </motion.div>
                <div className="text-aggressive-gray text-sm capitalize font-bold">
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
    github: <Github className="w-5 h-5" />,
    linkedin: <Linkedin className="w-5 h-5" />,
    twitter: <Twitter className="w-5 h-5" />
  };
  return icons[platform] || null;
};

export default Home; 