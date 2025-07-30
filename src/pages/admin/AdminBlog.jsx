import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Calendar,
  Eye,
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { sanitizeInput } from '../../utils/validation';
import { ProtectedRoute } from '../../utils/auth';
import { useToast } from '../../contexts/ToastContext';
import { storageService } from '../../services/storageService';
import { blogPosts as defaultBlogPosts, blogCategories } from '../../data/blogPosts';

const AdminBlog = () => {
  const [blogList, setBlogList] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { showToast } = useToast();

  // Local storage'dan blog yazılarını yükle
  const loadBlogPosts = () => {
    const savedPosts = storageService.getData('blogPosts');
    if (savedPosts && savedPosts.length > 0) {
      setBlogList(savedPosts);
    } else {
      // İlk kez çalıştırıldığında varsayılan blog yazılarını yükle
      setBlogList(defaultBlogPosts);
      storageService.saveData('blogPosts', defaultBlogPosts);
    }
  };

  const saveBlogPosts = (posts) => {
    storageService.saveData('blogPosts', posts);
    setBlogList(posts);
  };

  const filterPosts = useCallback(() => {
    let filtered = blogList;
    
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
  }, [blogList, selectedCategory, searchTerm]);

  useEffect(() => {
    loadBlogPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [filterPosts]);

  const handleAddPost = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const updatedPosts = blogList.filter(post => post.id !== postId);
        saveBlogPosts(updatedPosts);
        showToast('Blog yazısı başarıyla silindi', 'success');
      } catch (error) {
        showToast('Blog yazısı silinirken hata oluştu', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSavePost = async (postData) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (editingPost) {
        const updatedPosts = blogList.map(post => 
          post.id === editingPost.id ? { ...post, ...postData } : post
        );
        saveBlogPosts(updatedPosts);
        showToast('Blog yazısı başarıyla güncellendi', 'success');
      } else {
        const newPost = {
          ...postData,
          id: blogList.length > 0 ? Math.max(...blogList.map(p => p.id)) + 1 : 1,
          publishDate: new Date().toLocaleDateString('tr-TR'),
          views: 0,
          featured: false
        };
        const updatedPosts = [...blogList, newPost];
        saveBlogPosts(updatedPosts);
        showToast('Blog yazısı başarıyla eklendi', 'success');
      }
      
      setIsModalOpen(false);
    } catch (error) {
      showToast('Blog yazısı kaydedilirken hata oluştu', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Blog Yönetimi
                </h1>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredPosts.length} yazı
                </span>
              </div>
              <button
                onClick={handleAddPost}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Yeni Yazı</span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Blog yazılarında ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  {/* Blog Image */}
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700"></div>

                  {/* Blog Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditPost(post)}
                          className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {post.publishDate}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {post.views}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-secondary-100 text-secondary-700 dark:bg-secondary-900/20 dark:text-secondary-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 text-xs rounded-full">
                          +{post.tags.length - 2}
                        </span>
                      )}
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
                </motion.div>
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
                <FileText className="w-8 h-8 text-gray-400" />
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

        {/* Blog Post Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <BlogPostModal
              post={editingPost}
              onSave={handleSavePost}
              onClose={() => setIsModalOpen(false)}
              isLoading={isLoading}
            />
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
};

// Blog Post Modal Component
const BlogPostModal = ({ post, onSave, onClose, isLoading }) => {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    tags: post?.tags || [],
    category: post?.category || 'Teknoloji',
    featured: post?.featured || false
  });

  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation rules for blog post fields
  const validateField = (name, value) => {
    const errors = [];
    
    switch (name) {
      case 'title':
        if (!value.trim()) {
          errors.push('Başlık gereklidir');
        } else if (value.trim().length < 3) {
          errors.push('Başlık en az 3 karakter olmalıdır');
        } else if (value.trim().length > 100) {
          errors.push('Başlık en fazla 100 karakter olabilir');
        }
        break;
        
      case 'excerpt':
        if (!value.trim()) {
          errors.push('Özet gereklidir');
        } else if (value.trim().length < 10) {
          errors.push('Özet en az 10 karakter olmalıdır');
        } else if (value.trim().length > 300) {
          errors.push('Özet en fazla 300 karakter olabilir');
        }
        break;
        
      case 'content':
        if (!value.trim()) {
          errors.push('İçerik gereklidir');
        } else if (value.trim().length < 50) {
          errors.push('İçerik en az 50 karakter olmalıdır');
        } else if (value.trim().length > 10000) {
          errors.push('İçerik en fazla 10,000 karakter olabilir');
        }
        break;
        
      case 'tags':
        if (!Array.isArray(value)) {
          errors.push('Etiketler dizi formatında olmalıdır');
        } else if (value.length === 0) {
          errors.push('En az bir etiket eklenmelidir');
        } else if (value.length > 10) {
          errors.push('En fazla 10 etiket eklenebilir');
        } else {
          // Check individual tags
          value.forEach((tag, index) => {
            if (!tag.trim()) {
              errors.push(`Etiket ${index + 1} boş olamaz`);
            } else if (tag.trim().length < 2) {
              errors.push(`Etiket ${index + 1} en az 2 karakter olmalıdır`);
            } else if (tag.trim().length > 20) {
              errors.push(`Etiket ${index + 1} en fazla 20 karakter olabilir`);
            }
          });
        }
        break;
        
      case 'category':
        if (!value) {
          errors.push('Kategori seçilmelidir');
        }
        break;
        
      default:
        break;
    }
    
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const sanitizedValue = type === 'checkbox' ? checked : sanitizeInput.preventXSS(value);
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
    
    // Real-time validation for touched fields
    if (touched[name]) {
      const fieldErrors = validateField(name, sanitizedValue);
      setErrors(prev => ({ ...prev, [name]: fieldErrors }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const fieldErrors = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: fieldErrors }));
  };

  const handleAddTag = () => {
    const sanitizedTag = sanitizeInput.preventXSS(newTag.trim());
    if (sanitizedTag && !formData.tags.includes(sanitizedTag)) {
      const updatedTags = [...formData.tags, sanitizedTag];
      setFormData(prev => ({
        ...prev,
        tags: updatedTags
      }));
      setNewTag('');
      
      // Validate tags after adding
      const tagErrors = validateField('tags', updatedTags);
      setErrors(prev => ({ ...prev, tags: tagErrors }));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = formData.tags.filter(tag => tag !== tagToRemove);
    setFormData(prev => ({
      ...prev,
      tags: updatedTags
    }));
    
    // Validate tags after removing
    const tagErrors = validateField('tags', updatedTags);
    setErrors(prev => ({ ...prev, tags: tagErrors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => { allTouched[key] = true; });
    setTouched(allTouched);
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(fieldName => {
      const fieldErrors = validateField(fieldName, formData[fieldName]);
      if (fieldErrors.length > 0) {
        newErrors[fieldName] = fieldErrors;
      }
    });
    setErrors(newErrors);
    
    // Check if there are any errors
    const hasErrors = Object.keys(newErrors).length > 0;
    
    if (!hasErrors) {
      onSave(formData);
    }
  };

  // Check if form has any errors
  const hasErrors = Object.keys(errors).some(field => errors[field].length > 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {post ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Başlık
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('title')}
                  className={`input-field pr-10 ${
                    touched.title && errors.title?.length > 0 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : touched.title && !errors.title?.length 
                        ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                        : ''
                  }`}
                  required
                />
                {touched.title && errors.title?.length > 0 && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                )}
                {touched.title && !errors.title?.length && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              {touched.title && errors.title?.length > 0 && (
                <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.title.map((error, index) => (
                    <div key={index} className="flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {error}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Özet
              </label>
              <div className="relative">
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('excerpt')}
                  rows={3}
                  className={`input-field pr-10 ${
                    touched.excerpt && errors.excerpt?.length > 0 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : touched.excerpt && !errors.excerpt?.length 
                        ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                        : ''
                  }`}
                  required
                />
                {touched.excerpt && errors.excerpt?.length > 0 && (
                  <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
                )}
                {touched.excerpt && !errors.excerpt?.length && (
                  <CheckCircle className="absolute right-3 top-3 w-5 h-5 text-green-500" />
                )}
              </div>
              {touched.excerpt && errors.excerpt?.length > 0 && (
                <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.excerpt.map((error, index) => (
                    <div key={index} className="flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {error}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                İçerik
              </label>
              <div className="relative">
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('content')}
                  rows={10}
                  className={`input-field pr-10 ${
                    touched.content && errors.content?.length > 0 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : touched.content && !errors.content?.length 
                        ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                        : ''
                  }`}
                  required
                  placeholder="Markdown formatında yazabilirsiniz..."
                />
                {touched.content && errors.content?.length > 0 && (
                  <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
                )}
                {touched.content && !errors.content?.length && (
                  <CheckCircle className="absolute right-3 top-3 w-5 h-5 text-green-500" />
                )}
              </div>
              {touched.content && errors.content?.length > 0 && (
                <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.content.map((error, index) => (
                    <div key={index} className="flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {error}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Etiketler
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 input-field"
                  placeholder="Yeni etiket ekle"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Ekle
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-secondary-100 text-secondary-700 dark:bg-secondary-900/20 dark:text-secondary-300 rounded-full text-sm flex items-center space-x-1"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-secondary-900 dark:hover:text-secondary-100"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              {touched.tags && errors.tags?.length > 0 && (
                <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.tags.map((error, index) => (
                    <div key={index} className="flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {error}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kategori
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('category')}
                  className={`input-field pr-10 ${
                    touched.category && errors.category?.length > 0 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : touched.category && !errors.category?.length 
                        ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                        : ''
                  }`}
                >
                  {blogCategories.filter(cat => cat !== 'Tümü').map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {touched.category && errors.category?.length > 0 && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500 pointer-events-none" />
                )}
                {touched.category && !errors.category?.length && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 pointer-events-none" />
                )}
              </div>
              {touched.category && errors.category?.length > 0 && (
                <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.category.map((error, index) => (
                    <div key={index} className="flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {error}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Featured */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Öne çıkan yazı olarak işaretle
              </label>
            </div>

            {/* Validation Summary */}
            {hasErrors && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Doğrulama Hataları
                </h4>
                <div className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  {Object.keys(errors).map(fieldName => (
                    errors[fieldName].map((error, index) => (
                      <div key={`${fieldName}-${index}`} className="flex items-start">
                        <span className="font-medium mr-2">•</span>
                        <span>{error}</span>
                      </div>
                    ))
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                disabled={isLoading}
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={isLoading || hasErrors}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  isLoading || hasErrors
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <span>{post ? 'Güncelle' : 'Ekle'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminBlog; 