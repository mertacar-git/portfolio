import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Eye,
  ArrowLeft,
  Share2
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { analytics } from '../utils/dataManager';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true);
      try {
        analytics.trackUniqueVisitor();
        const savedPosts = storageService.getData('blogPosts');
        if (savedPosts && savedPosts.length > 0) {
          const foundPost = savedPosts.find(p => p.id === parseInt(id));
          if (foundPost) {
            setPost(foundPost);
            analytics.incrementBlogView(foundPost.id);
          }
        }
      } catch (error) {
        console.error('Blog post yüklenirken hata:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Blog yazısı yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Blog yazısı bulunamadı
          </h1>
          <Link to="/blog" className="btn-primary">
            Blog'a Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Back Button */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container-max py-4">
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Blog'a Dön</span>
          </Link>
        </div>
      </div>

      {/* Blog Content */}
      <div className="container-max py-8">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {post.publishDate}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {post.readTime}
              </span>
              <span className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                {post.views} görüntüleme
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-secondary-100 text-secondary-700 dark:bg-secondary-900/20 dark:text-secondary-300 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Share Button */}
            <button className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
              <Share2 className="w-4 h-4" />
              <span>Paylaş</span>
            </button>
          </header>

          {/* Featured Image */}
          {post.image && (
            <div className="mb-8">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="markdown">
              {post.content.split('\n').map((paragraph, index) => {
                if (paragraph.trim() === '') return <br key={index} />;
                
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 mt-8">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-xl font-medium text-gray-900 dark:text-white mb-3 mt-6">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                
                if (paragraph.startsWith('```')) {
                  return (
                    <pre key={index} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                      <code>{paragraph.replace('```', '')}</code>
                    </pre>
                  );
                }
                
                if (paragraph.startsWith('- ')) {
                  return (
                    <ul key={index} className="list-disc list-inside mb-4 space-y-2">
                      <li className="text-gray-700 dark:text-gray-300">
                        {paragraph.replace('- ', '')}
                      </li>
                    </ul>
                  );
                }
                
                return (
                  <p key={index} className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Bu yazıyı beğendiniz mi?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Daha fazla içerik için blog sayfamızı takip edin.
                </p>
              </div>
              <Link
                to="/blog"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <span>Tüm Yazıları Gör</span>
              </Link>
            </div>
          </footer>
        </motion.article>
      </div>
    </div>
  );
};

export default BlogPost; 