import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Youtube,
  Mail,
  Phone,
  MapPin,
  Heart,
  ArrowUp,
  Send
} from 'lucide-react';
import { siteConfig } from '../data/siteConfig';
import { useToast } from '../contexts/ToastContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { showToast } = useToast();

  // Safe access to siteConfig
  const safeSiteConfig = siteConfig || {};
  const safeSocialLinks = safeSiteConfig.socialLinks || {};
  const safeNavigation = safeSiteConfig.navigation || [];
  const safeContact = safeSiteConfig.contact || {};
  const safeSite = safeSiteConfig.site || {};

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast('Lütfen email adresinizi girin', 'error');
      return;
    }

    setIsSubscribing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('Bültene başarıyla abone oldunuz!', 'success');
      setEmail('');
    } catch (error) {
      showToast('Abone olurken bir hata oluştu', 'error');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <>
      <footer className="bg-gray-900 text-white relative">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12 px-4">
            {/* Brand Section */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="text-xl font-bold">
                  {safeSite.title ? safeSite.title.split(' - ')[0] : 'Mert'}
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                {safeSite.description || 'Modern web teknolojileri ile yaratıcı çözümler geliştiren Full Stack Developer'}
              </p>
              <div className="flex space-x-4">
                {Object.entries(safeSocialLinks).map(([key, social], index) => (
                  <motion.a
                    key={key}
                    href={social?.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                    aria-label={social?.label || key}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {getSocialIcon(key)}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold">Hızlı Linkler</h3>
              <ul className="space-y-2">
                {safeNavigation.map((item, index) => (
                  <motion.li 
                    key={item?.name || index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      to={item?.href || '/'}
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2 group"
                    >
                      <span className="w-1 h-1 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                      <span>{item?.name || 'Link'}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold">İletişim</h3>
              <div className="space-y-3">
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Mail className="w-5 h-5 text-primary-400" />
                  <a
                    href={`mailto:${safeContact.email || 'contact@example.com'}`}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {safeContact.email || 'contact@example.com'}
                  </a>
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Phone className="w-5 h-5 text-primary-400" />
                  <a
                    href={`tel:${safeContact.phone || '+90 555 123 4567'}`}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {safeContact.phone || '+90 555 123 4567'}
                  </a>
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <MapPin className="w-5 h-5 text-primary-400" />
                  <span className="text-gray-400">
                    {safeContact.address || 'İstanbul, Türkiye'}
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold">Bülten</h3>
              <p className="text-gray-400">
                Yeni projeler ve blog yazılarından haberdar olun.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <input
                  type="email"
                  placeholder="Email adresiniz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isSubscribing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Abone Olunuyor...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Abone Ol</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div 
            className="border-t border-gray-800 py-6 px-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm">
                © {currentYear} {safeSite.title || 'Mert'}. Tüm hakları saklıdır.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <Link
                  to="/privacy"
                  className="hover:text-white transition-colors duration-200"
                >
                  Gizlilik Politikası
                </Link>
                <Link
                  to="/terms"
                  className="hover:text-white transition-colors duration-200"
                >
                  Kullanım Şartları
                </Link>
                <span className="flex items-center space-x-1">
                  <span>Made with</span>
                  <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                  <span>by</span>
                  <button
                    onClick={() => window.location.href = '/admin/login'}
                    className="text-primary-400 hover:text-primary-300 transition-colors duration-200 font-medium cursor-pointer"
                  >
                    Mert
                  </button>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Back to top"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

// Social icon helper
const getSocialIcon = (platform) => {
  const icons = {
    github: <Github className="w-5 h-5" />,
    linkedin: <Linkedin className="w-5 h-5" />,
    twitter: <Twitter className="w-5 h-5" />,
    instagram: <Instagram className="w-5 h-5" />,
    youtube: <Youtube className="w-5 h-5" />
  };
  return icons[platform] || null;
};

export default Footer; 