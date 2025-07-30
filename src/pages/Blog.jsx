import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock,
  Tag,
  Eye
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { blogPosts as defaultBlogPosts, blogCategories, filterBlogPostsByCategory } from '../data/blogPosts';
import { analytics } from '../utils/dataManager';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    analytics.incrementPageView('blog');
    loadBlogPosts();
  }, []);

  useEffect(() => {
    let filtered = blogPosts;
    
    // Kategori filtreleme
    if (selectedCategory !== 'Tümü') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    setFilteredPosts(filtered);
  }, [selectedCategory, searchTerm, blogPosts]);

  const loadBlogPosts = () => {
    const savedPosts = storageService.getData('blogPosts');
    if (savedPosts && savedPosts.length > 0) {
      setBlogPosts(savedPosts);
    } else {
      // İlk kez çalıştırıldığında varsayılan blog yazılarını yükle
      setBlogPosts(defaultBlogPosts);
      storageService.saveData('blogPosts', defaultBlogPosts);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Blog
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Teknoloji ve yazılım geliştirme hakkında yazılarım
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="section-padding bg-white dark:bg-gray-800">
        <div className="container-max">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Blog yazılarında ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {blogCategories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card overflow-hidden group"
                >
                  {/* Blog Image */}
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700"></div>

                  {/* Blog Content */}
                  <div className="p-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {post.publishDate}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-secondary-100 text-secondary-700 dark:bg-secondary-900/20 dark:text-secondary-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {post.views} görüntüleme
                      </span>
                      <Link
                        to={`/blog/${post.id}`}
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                        onClick={() => analytics.incrementBlogView(post.id)}
                      >
                        Devamını Oku →
                      </Link>
                    </div>

                    {/* Featured Badge */}
                    {post.featured && (
                      <div className="mt-3">
                        <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 text-xs rounded-full">
                          Öne Çıkan
                        </span>
                      </div>
                    )}
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Blog yazısı bulunamadı
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Arama kriterlerinize uygun blog yazısı bulunamadı.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog; 