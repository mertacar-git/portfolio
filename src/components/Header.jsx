import React, { useState, useEffect } from 'react';
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
  const location = useLocation();

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
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, searchResults, selectedIndex]);

  const performSearch = (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const results = [
        { id: 1, title: 'Ana Sayfa', url: '/', type: 'page' },
        { id: 2, title: 'Hakkımda', url: '/about', type: 'page' },
        { id: 3, title: 'Portfolio', url: '/portfolio', type: 'page' },
        { id: 4, title: 'Blog', url: '/blog', type: 'page' },
        { id: 5, title: 'İletişim', url: '/contact', type: 'page' }
      ].filter(result => 
        result.title.toLowerCase().includes(term.toLowerCase())
      );
      
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    performSearch(value);
  };

  const handleSearchResultClick = (result) => {
    setIsSearchOpen(false);
    setSearchTerm('');
    // Use window.location for simple navigation
    window.location.href = result.url;
  };

  const closeMenu = () => setIsMenuOpen(false);

  const getSocialIcon = (platform) => {
    switch (platform) {
      case 'github': return <Github className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      default: return null;
    }
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'page': return <Search className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navigation = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Hakkımda', href: '/about' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Blog', href: '/blog' },
    { name: 'İletişim', href: '/contact' }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-aggressive-black/95 backdrop-blur-md border-b-2 border-aggressive-white' 
        : 'bg-aggressive-black/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group hover-aggressive">
            <span className="text-xl font-bold text-aggressive-white group-hover:text-aggressive-white transition-colors duration-200">
              {siteConfig.site.title.split(' - ')[0]}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-bold transition-all duration-200 hover-aggressive ${
                  isActive(item.href)
                    ? 'text-aggressive-white bg-aggressive-white text-aggressive-black px-4 py-2 rounded-lg'
                    : 'text-aggressive-white hover:text-aggressive-black hover:bg-aggressive-white px-4 py-2 rounded-lg'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-aggressive-white hover:text-aggressive-black hover:bg-aggressive-white rounded-lg transition-all duration-200 hover-aggressive"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              disabled={isThemeLoading}
              className="p-2 text-aggressive-white hover:text-aggressive-black hover:bg-aggressive-white rounded-lg transition-all duration-200 hover-aggressive disabled:opacity-50"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-aggressive-white hover:text-aggressive-black hover:bg-aggressive-white rounded-lg transition-all duration-200 hover-aggressive"
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

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-aggressive-black border-t-2 border-aggressive-white"
          >
            <nav className="px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={closeMenu}
                  className={`block px-3 py-2 rounded-lg text-sm font-bold transition-all duration-200 hover-aggressive ${
                    isActive(item.href)
                      ? 'text-aggressive-black bg-aggressive-white'
                      : 'text-aggressive-white hover:text-aggressive-black hover:bg-aggressive-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-aggressive-black/75 backdrop-blur-sm z-50"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="max-w-2xl mx-auto mt-20 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-aggressive-black rounded-lg border-2 border-aggressive-white shadow-aggressive-xl">
                <div className="p-4 border-b-2 border-aggressive-white">
                  <div className="flex items-center space-x-3">
                    <Search className="w-5 h-5 text-aggressive-white" />
                    <input
                      type="text"
                      placeholder="Ara..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="flex-1 bg-transparent text-aggressive-white placeholder-aggressive-gray outline-none font-bold"
                      autoFocus
                    />
                    {isSearching && (
                      <div className="w-5 h-5 border-2 border-aggressive-white border-t-transparent rounded-full animate-aggressive-spin"></div>
                    )}
                  </div>
                </div>
                
                {searchResults.length > 0 && (
                  <div className="max-h-64 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <button
                        key={result.id}
                        onClick={() => handleSearchResultClick(result)}
                        className={`w-full p-3 text-left hover:bg-aggressive-white hover:text-aggressive-black transition-all duration-200 flex items-center space-x-3 font-bold ${
                          index === selectedIndex ? 'bg-aggressive-white text-aggressive-black' : ''
                        }`}
                      >
                        {getResultIcon(result.type)}
                        <span>{result.title}</span>
                      </button>
                    ))}
                  </div>
                )}
                
                {searchTerm && searchResults.length === 0 && !isSearching && (
                  <div className="p-4 text-aggressive-gray text-center font-bold">
                    Sonuç bulunamadı
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header; 