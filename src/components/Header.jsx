import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Search,
  Github,
  Linkedin,
  Twitter
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { siteConfig } from '../data/siteConfig';
import { storageService } from '../services/storageService';
import { personalInfo as defaultPersonalInfo } from '../data/personalInfo';
import useProfileImage from '../hooks/useProfileImage';
import useNavigation from '../hooks/useNavigation';
import Navigation from './Navigation';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [personalInfo, setPersonalInfo] = useState(defaultPersonalInfo);
  const { theme, toggleTheme } = useTheme();
  const [isThemeLoading, setIsThemeLoading] = useState(false);
  const { getImageStyle, getImageUrl } = useProfileImage();
  const { goTo } = useNavigation();

  const handleSearchResultClick = useCallback((result) => {
    setIsSearchOpen(false);
    setSearchTerm('');
    goTo(result.url);
  }, [goTo]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load personal info for social links
  useEffect(() => {
    const loadPersonalInfo = () => {
      const savedPersonalInfo = storageService.getData('personalInfo');
      if (savedPersonalInfo) {
        setPersonalInfo(savedPersonalInfo);
      } else {
        setPersonalInfo(defaultPersonalInfo);
      }
    };
    
    loadPersonalInfo();
  }, []);

  // Keyboard navigation for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Global search shortcut (Ctrl+K)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        return;
      }

      if (!isSearchOpen) return;

      switch (e.key) {
        case 'Escape':
          setIsSearchOpen(false);
          setSearchTerm('');
          setSelectedIndex(-1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < searchResults.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : searchResults.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && searchResults[selectedIndex]) {
            handleSearchResultClick(searchResults[selectedIndex]);
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, searchResults, selectedIndex, handleSearchResultClick]);

  // Search functionality
  const performSearch = (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const results = [
        {
          id: 1,
          title: 'Ana Sayfa',
          description: 'Mert Açar ana sayfası',
          url: '/',
          type: 'page'
        },
        {
          id: 2,
          title: 'Hakkımda',
          description: 'Mert Açar hakkında bilgiler',
          url: '/about',
          type: 'page'
        },
        {
          id: 3,
          title: 'Portfolio',
          description: 'Projeler ve çalışmalar',
          url: '/portfolio',
          type: 'page'
        },
        {
          id: 4,
          title: 'Blog',
          description: 'Blog yazıları',
          url: '/blog',
          type: 'page'
        },
        {
          id: 5,
          title: 'İletişim',
          description: 'İletişim bilgileri',
          url: '/contact',
          type: 'page'
        }
      ].filter(item => 
        item.title.toLowerCase().includes(term.toLowerCase()) ||
        item.description.toLowerCase().includes(term.toLowerCase())
      );

      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  useEffect(() => {
    performSearch(searchTerm);
  }, [searchTerm]);

  const closeMenu = () => setIsMenuOpen(false);

  const getSocialIcon = (platform) => {
    const icons = {
      github: <Github className="w-5 h-5" />,
      linkedin: <Linkedin className="w-5 h-5" />,
      twitter: <Twitter className="w-5 h-5" />
    };
    return icons[platform] || <Github className="w-5 h-5" />;
  };

  const getResultIcon = (type) => {
    const icons = {
      page: '📄',
      project: '💼',
      blog: '📖',
      contact: '✉️'
    };
    return icons[type] || '📄';
  };

  return (
    <>
      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20 px-4"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Ara... (Ctrl+K ile aç/kapat)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    Aranıyor...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="p-2">
                    {searchResults.map((result, index) => (
                      <button
                        key={result.id}
                        onClick={() => handleSearchResultClick(result)}
                        className={`w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                          index === selectedIndex ? 'bg-gray-100 dark:bg-gray-700' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{getResultIcon(result.type)}</span>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {result.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {result.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : searchTerm ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    Sonuç bulunamadı
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    Arama yapmak için yazmaya başlayın
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg' 
          : 'bg-white dark:bg-gray-900'
      }`}>
        <div className="container-max">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden border-2 border-white dark:border-gray-700 shadow-sm">
                <img
                  src={getImageUrl()}
                  alt="Mert Acar"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  style={getImageStyle()}
                  onError={(e) => {
                    console.error('Profil fotoğrafı yüklenemedi:', e);
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {siteConfig.site.title.split(' - ')[0]}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <Navigation variant="desktop" />

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="btn-icon btn-icon-secondary relative group"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Ctrl+K
                </span>
              </button>

              {/* Tema Değiştirme Butonu */}
              <button
                onClick={() => {
                  if (!isThemeLoading) {
                    setIsThemeLoading(true);
                    toggleTheme();
                    // Kısa bir süre sonra loading durumunu kaldır
                    setTimeout(() => setIsThemeLoading(false), 300);
                  }
                }}
                disabled={isThemeLoading}
                className={`btn-icon btn-icon-secondary relative overflow-hidden transition-all duration-300 ${
                  isThemeLoading 
                    ? 'opacity-70 cursor-not-allowed scale-95' 
                    : 'hover:scale-110 hover:shadow-lg'
                }`}
                aria-label="Tema değiştir"
              >
                {/* Loading animasyonu */}
                {isThemeLoading && (
                  <div className="absolute inset-0 bg-primary-500/20 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                
                {/* Tema ikonu */}
                <div className={`transition-all duration-300 ${isThemeLoading ? 'opacity-0' : 'opacity-100'}`}>
                  {theme === 'light' ? (
                    <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
              </button>

              {/* Social Links */}
              <div className="hidden lg:flex items-center space-x-2">
                {personalInfo.socialLinks && Object.entries(personalInfo.socialLinks).slice(0, 3).map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-icon btn-icon-secondary"
                    aria-label={`${key} profilim`}
                  >
                    {getSocialIcon(key)}
                  </a>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden btn-icon btn-icon-secondary"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="px-4 py-4">
                <Navigation 
                  variant="mobile" 
                  onItemClick={closeMenu}
                />
                
                {/* Mobile Social Links */}
                <div className="flex items-center space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {personalInfo.socialLinks && Object.entries(personalInfo.socialLinks).map(([key, url]) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-icon btn-icon-secondary"
                      aria-label={`${key} profilim`}
                    >
                      {getSocialIcon(key)}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header; 