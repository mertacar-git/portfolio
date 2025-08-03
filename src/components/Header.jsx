import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Home, 
  User, 
  Briefcase, 
  BookOpen, 
  Mail,
  Github,
  Linkedin,
  Twitter,
  Search,
  ExternalLink,
  Calendar,
  Tag
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { siteConfig } from '../data/siteConfig';
import { storageService } from '../services/storageService';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, searchResults, selectedIndex]);

  // Global search functionality
  useEffect(() => {
    if (searchTerm.length > 2) {
      setIsSearching(true);
      const timeoutId = setTimeout(() => {
        performSearch(searchTerm);
        setIsSearching(false);
        setSelectedIndex(-1);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setSelectedIndex(-1);
    }
  }, [searchTerm]);

  const performSearch = (term) => {
    const results = [];
    const searchTermLower = term.toLowerCase();

    // Search in projects
    const projects = storageService.getData('projects') || [];
    const projectResults = projects.filter(project =>
      project.title.toLowerCase().includes(searchTermLower) ||
      project.description.toLowerCase().includes(searchTermLower) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchTermLower))
    ).map(project => ({
      ...project,
      type: 'project',
      url: `/portfolio#${project.id}`
    }));

    // Search in blog posts
    const blogPosts = storageService.getData('blogPosts') || [];
    const blogResults = blogPosts.filter(post =>
      post.title.toLowerCase().includes(searchTermLower) ||
      post.excerpt.toLowerCase().includes(searchTermLower) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
    ).map(post => ({
      ...post,
      type: 'blog',
      url: `/blog/${post.id}`
    }));

    // Search in skills
    const personalInfo = storageService.getData('personalInfo');
    const skillResults = personalInfo?.skills?.filter(skill =>
      skill.name.toLowerCase().includes(searchTermLower)
    ).map(skill => ({
      ...skill,
      type: 'skill',
      url: '/#skills'
    })) || [];

    results.push(...projectResults.slice(0, 3), ...blogResults.slice(0, 3), ...skillResults.slice(0, 2));
    setSearchResults(results);
  };

  const handleSearchResultClick = (result) => {
    setIsSearchOpen(false);
    setSearchTerm('');
    navigate(result.url);
  };

  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-lg dark:bg-gray-900/90' 
            : 'bg-transparent'
        }`}
      >
        <div className="container-max">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {siteConfig.site.title.split(' - ')[0]}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {siteConfig.navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
                      : 'text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
                  }`}
                >
                  {getIcon(item.icon)}
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200 relative group"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Ctrl+K
                </span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>

              {/* Social Links */}
              <div className="hidden lg:flex items-center space-x-2">
                {siteConfig.socialLinks && Object.entries(siteConfig.socialLinks).slice(0, 3).map(([key, social]) => (
                  <a
                    key={key}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
                    aria-label={social.label}
                  >
                    {getSocialIcon(key)}
                  </a>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
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
              <div className="px-4 py-4 space-y-2">
                {siteConfig.navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={closeMenu}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
                    }`}
                  >
                    {getIcon(item.icon)}
                    <span>{item.name}</span>
                  </Link>
                ))}
                
                {/* Mobile Social Links */}
                <div className="flex items-center space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {siteConfig.socialLinks && Object.entries(siteConfig.socialLinks).map(([key, social]) => (
                    <a
                      key={key}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
                      aria-label={social.label}
                    >
                      {getSocialIcon(key)}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Global Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
                {/* Search Input */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Projeler, blog yazıları, yetenekler ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white"
                      autoFocus
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Search Results */}
                <div className="max-h-96 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <div className="p-2">
                      {searchResults.map((result, index) => (
                        <motion.div
                          key={`${result.type}-${result.id || index}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleSearchResultClick(result)}
                          className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                            index === selectedIndex 
                              ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700' 
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mr-3">
                            {getResultIcon(result.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {result.title || result.name}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {result.type === 'project' && result.description}
                              {result.type === 'blog' && result.excerpt}
                              {result.type === 'skill' && `${result.level}% seviye`}
                            </p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </motion.div>
                      ))}
                    </div>
                  ) : searchTerm.length > 2 && !isSearching ? (
                    <div className="p-8 text-center">
                      <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        "{searchTerm}" için sonuç bulunamadı
                      </p>
                    </div>
                  ) : null}
                </div>

                {/* Keyboard Shortcuts */}
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-b-xl text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>ESC: Kapat</span>
                    <span>↑↓: Navigasyon</span>
                    <span>Enter: Seç</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Icon helper functions
const getIcon = (iconName) => {
  const icons = {
    home: <Home className="w-4 h-4" />,
    user: <User className="w-4 h-4" />,
    briefcase: <Briefcase className="w-4 h-4" />,
    'book-open': <BookOpen className="w-4 h-4" />,
    mail: <Mail className="w-4 h-4" />
  };
  return icons[iconName] || null;
};

const getSocialIcon = (platform) => {
  const icons = {
    github: <Github className="w-4 h-4" />,
    linkedin: <Linkedin className="w-4 h-4" />,
    twitter: <Twitter className="w-4 h-4" />
  };
  return icons[platform] || null;
};

const getResultIcon = (type) => {
  const icons = {
    project: <Briefcase className="w-5 h-5 text-primary-600" />,
    blog: <BookOpen className="w-5 h-5 text-green-600" />,
    skill: <Tag className="w-5 h-5 text-blue-600" />
  };
  return icons[type] || <Search className="w-5 h-5 text-gray-600" />;
};

export default Header; 