import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  ArrowLeft, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Save,
  X,
  Star,
  Calendar,
  Tag,
  Clock,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dataManager } from '../../utils/dataManager';
import { useToast } from '../../contexts/ToastContext';

const AdminBlog = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [filterCategory, setFilterCategory] = useState('Tümü');
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = () => {
    const data = dataManager.getBlogPosts();
    setBlogPosts(data);
    setIsLoading(false);
  };

  const handleAddPost = () => {
    setEditingPost({
      title: '',
      excerpt: '',
      content: '',
      category: 'Web Geliştirme',
      tags: [],
      featured: false,
      newTag: '',
      readTime: '5 min'
    });
    setShowAddModal(true);
  };

  const handleEditPost = (post) => {
    setEditingPost({
      ...post,
      newTag: ''
    });
    setShowAddModal(true);
  };

  const handleDeletePost = (id) => {
    if (window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
      try {
        dataManager.deleteBlogPost(id);
        loadBlogPosts();
        showToast('Blog yazısı başarıyla silindi!', 'success');
      } catch (error) {
        showToast('Silme sırasında hata oluştu!', 'error');
      }
    }
  };

  const handleSavePost = () => {
    try {
      const postData = {
        title: editingPost.title,
        excerpt: editingPost.excerpt,
        content: editingPost.content,
        category: editingPost.category,
        tags: editingPost.tags,
        featured: editingPost.featured,
        readTime: editingPost.readTime
      };

      if (editingPost.id) {
        dataManager.updateBlogPost(editingPost.id, postData);
        showToast('Blog yazısı başarıyla güncellendi!', 'success');
      } else {
        dataManager.addBlogPost(postData);
        showToast('Blog yazısı başarıyla eklendi!', 'success');
      }

      setShowAddModal(false);
      setEditingPost(null);
      setPreviewMode(false);
      loadBlogPosts();
    } catch (error) {
      showToast('Kaydetme sırasında hata oluştu!', 'error');
    }
  };

  const handleAddTag = () => {
    if (editingPost.newTag.trim()) {
      setEditingPost(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: ''
      }));
    }
  };

  const handleRemoveTag = (index) => {
    setEditingPost(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = filterCategory === 'Tümü' || post.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['Tümü', 'Web Geliştirme', 'Programlama', 'Araçlar', 'Kişisel', 'Diğer'];

  const renderMarkdownPreview = (content) => {
    // Simple markdown rendering for preview
    return content
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/`(.*)`/gim, '<code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">$1</code>')
      .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg overflow-x-auto"><code>$1</code></pre>')
      .replace(/\n/gim, '<br>');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Blog Yönetimi
                </h1>
              </div>
            </div>

            <button
              onClick={handleAddPost}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Yazı</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Yazı</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{blogPosts.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Öne Çıkan</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {blogPosts.filter(p => p.featured).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Görüntüleme</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {blogPosts.reduce((sum, post) => sum + (post.views || 0), 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ortalama Okuma</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {blogPosts.length > 0 ? Math.round(blogPosts.reduce((sum, post) => sum + (post.views || 0), 0) / blogPosts.length) : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Blog yazılarında ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
                        {post.title}
                      </h3>
                      <div className="flex items-center space-x-2 ml-2">
                        <button
                          onClick={() => handleEditPost(post)}
                          className="p-1 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-1 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center space-x-2 mb-4">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {post.category}
                      </span>
                      {post.featured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{post.publishDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-500">
                          <Eye className="w-4 h-4" />
                          <span>{post.views || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Blog yazısı bulunamadı
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Arama kriterlerinize uygun blog yazısı bulunamadı.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {editingPost?.id ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı'}
                  </h2>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setPreviewMode(!previewMode)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        previewMode 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {previewMode ? 'Düzenle' : 'Önizleme'}
                    </button>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {!previewMode ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Başlık *
                        </label>
                        <input
                          type="text"
                          value={editingPost?.title || ''}
                          onChange={(e) => setEditingPost(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Blog yazısı başlığını girin"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Kategori
                        </label>
                        <select
                          value={editingPost?.category || 'Web Geliştirme'}
                          onChange={(e) => setEditingPost(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                          {categories.filter(cat => cat !== 'Tümü').map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Özet *
                      </label>
                      <textarea
                        value={editingPost?.excerpt || ''}
                        onChange={(e) => setEditingPost(prev => ({ ...prev, excerpt: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Blog yazısı özetini girin"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Okuma Süresi
                        </label>
                        <input
                          type="text"
                          value={editingPost?.readTime || '5 min'}
                          onChange={(e) => setEditingPost(prev => ({ ...prev, readTime: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="5 min"
                        />
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={editingPost?.featured || false}
                          onChange={(e) => setEditingPost(prev => ({ ...prev, featured: e.target.checked }))}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Öne çıkan yazı
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Etiketler
                      </label>
                      <div className="flex items-center space-x-2 mb-3">
                        <input
                          type="text"
                          value={editingPost?.newTag || ''}
                          onChange={(e) => setEditingPost(prev => ({ ...prev, newTag: e.target.value }))}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Etiket adı"
                          onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                        />
                        <button
                          onClick={handleAddTag}
                          className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                        >
                          Ekle
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {editingPost?.tags?.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full flex items-center space-x-2"
                          >
                            <span>{tag}</span>
                            <button
                              onClick={() => handleRemoveTag(index)}
                              className="text-gray-500 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        İçerik (Markdown) *
                      </label>
                      <textarea
                        value={editingPost?.content || ''}
                        onChange={(e) => setEditingPost(prev => ({ ...prev, content: e.target.value }))}
                        rows={15}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
                        placeholder="# Başlık

## Alt Başlık

Bu bir **kalın** ve *italik* metindir.

```javascript
console.log('Merhaba Dünya!');
```

- Liste öğesi 1
- Liste öğesi 2"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center space-y-4">
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {editingPost?.title || 'Başlık'}
                      </h1>
                      <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-500">
                        <span>{editingPost?.category || 'Kategori'}</span>
                        <span>•</span>
                        <span>{editingPost?.readTime || '5 min'}</span>
                        {editingPost?.featured && (
                          <>
                            <span>•</span>
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          </>
                        )}
                      </div>
                    </div>

                    <div className="prose dark:prose-invert max-w-none">
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: renderMarkdownPreview(editingPost?.content || 'İçerik burada görünecek...') 
                        }}
                      />
                    </div>

                    {editingPost?.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {editingPost.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  İptal
                </button>
                <button
                  onClick={handleSavePost}
                  disabled={!editingPost?.title || !editingPost?.excerpt || !editingPost?.content}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Kaydet</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBlog; 