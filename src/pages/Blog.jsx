import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar,
  User,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { blogPosts as defaultBlogPosts } from '../data/blogPosts';
import { analytics } from '../utils/dataManager';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState(defaultBlogPosts);
  const [filteredPosts, setFilteredPosts] = useState(defaultBlogPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    analytics.incrementPageView('blog');
    analytics.trackUniqueVisitor();
    loadBlogPosts();
  }, []);

  const loadBlogPosts = () => {
    const savedPosts = storageService.getData('blogPosts');
    if (savedPosts && savedPosts.length > 0) {
      setBlogPosts(savedPosts);
      setFilteredPosts(savedPosts);
    } else {
      setBlogPosts(defaultBlogPosts);
      setFilteredPosts(defaultBlogPosts);
      storageService.saveData('blogPosts', defaultBlogPosts);
    }
  };

  // Tüm etiketleri topla
  const allTags = [...new Set(
    blogPosts.flatMap(post => post.tags || [])
  )].filter(Boolean);

  // Kategorileri topla
  const categories = ['all', ...new Set(blogPosts.map(post => post.category).filter(Boolean))];

  useEffect(() => {
    let filtered = blogPosts;

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.tags && post.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    // Kategori filtresi
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Etiket filtresi
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post =>
        post.tags && selectedTags.every(tag =>
          post.tags.includes(tag)
        )
      );
    }

    setFilteredPosts(filtered);
  }, [blogPosts, searchTerm, selectedCategory, selectedTags]);

  const handleTagToggle = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedTags([]);
  };

  const getCategoryName = (category) => {
    const categoryNames = {
      'teknoloji': 'Teknoloji',
      'yazılım': 'Yazılım',
      'web': 'Web Geliştirme',
      'kişisel': 'Kişisel',
      'diğer': 'Diğer'
    };
    return categoryNames[category] || category;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-aggressive-black text-aggressive-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-aggressive-white mb-6">
            Blog
          </h1>
          <p className="text-xl text-aggressive-gray font-bold max-w-3xl mx-auto">
            Yazılım, teknoloji ve kişisel deneyimlerim hakkında yazılar
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-aggressive-gray" />
                <input
                  type="text"
                  placeholder="Blog yazısı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-primary w-full pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all duration-200 hover-aggressive ${
                    selectedCategory === category
                      ? 'bg-aggressive-white text-aggressive-black'
                      : 'bg-aggressive-black text-aggressive-white border-2 border-aggressive-white hover:bg-aggressive-white hover:text-aggressive-black'
                  }`}
                >
                  {getCategoryName(category)}
                </button>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-5 h-5 text-aggressive-white" />
                <span className="text-aggressive-white font-bold">Etiketler:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-bold transition-all duration-200 hover-aggressive ${
                      selectedTags.includes(tag)
                        ? 'bg-aggressive-white text-aggressive-black'
                        : 'bg-aggressive-black text-aggressive-white border border-aggressive-white hover:bg-aggressive-white hover:text-aggressive-black'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clear Filters */}
          {(searchTerm || selectedCategory !== 'all' || selectedTags.length > 0) && (
            <div className="mt-4">
              <button
                onClick={clearFilters}
                className="text-aggressive-gray hover:text-aggressive-white font-bold transition-colors duration-200"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </motion.div>

        {/* Blog Posts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card hover-aggressive group"
            >
              {/* Post Image */}
              {post.image && (
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {post.featured && (
                    <div className="absolute top-2 right-2 bg-aggressive-white text-aggressive-black px-2 py-1 rounded text-sm font-bold">
                      Öne Çıkan
                    </div>
                  )}
                </div>
              )}

              {/* Post Content */}
              <div className="flex-1">
                <div className="flex items-center space-x-4 text-sm text-aggressive-gray font-bold mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-aggressive-white mb-3">
                  {post.title}
                </h3>
                
                <p className="text-aggressive-gray mb-4 font-bold line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Tags */}
                {post.tags && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-aggressive-black text-aggressive-white text-xs rounded border border-aggressive-white font-bold"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="px-2 py-1 bg-aggressive-black text-aggressive-white text-xs rounded border border-aggressive-white font-bold">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Read More Button */}
                <Link
                  to={`/blog/${post.id}`}
                  className="btn-primary text-sm py-2 px-3 inline-flex items-center space-x-1"
                >
                  <span>Devamını Oku</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-aggressive-gray text-lg font-bold">
              Seçilen kriterlere uygun blog yazısı bulunamadı.
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary mt-4"
            >
              Tüm Yazıları Göster
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Blog; 