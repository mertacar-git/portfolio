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
      <div className="min-h-screen flex items-center justify-center bg-aggressive-black text-aggressive-white">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-aggressive-gray font-bold">Blog yazısı yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-aggressive-black text-aggressive-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-aggressive-white mb-4">
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
    <div className="min-h-screen bg-aggressive-black text-aggressive-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 text-aggressive-white hover:text-aggressive-black hover:bg-aggressive-white px-4 py-2 rounded-lg transition-all duration-200 hover-aggressive font-bold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Blog'a Dön</span>
          </Link>
        </div>

        {/* Blog Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card"
        >
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-aggressive-white mb-4">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-aggressive-gray font-bold mb-6">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {post.publishDate}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {post.readTime} dk okuma
              </span>
              <span className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                {post.views || 0} görüntülenme
              </span>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-aggressive-black text-aggressive-white text-sm rounded-full border border-aggressive-white font-bold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Author */}
            <div className="flex items-center space-x-4 p-4 bg-aggressive-black border border-aggressive-white rounded-lg">
              <div className="w-12 h-12 bg-aggressive-white rounded-full flex items-center justify-center">
                <span className="text-aggressive-black font-bold text-lg">
                  {post.author?.charAt(0) || 'M'}
                </span>
              </div>
              <div>
                <p className="text-aggressive-white font-bold">{post.author}</p>
                <p className="text-aggressive-gray text-sm font-bold">{post.authorTitle}</p>
              </div>
            </div>
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
          <div className="prose prose-lg max-w-none">
            <div className="text-aggressive-white font-bold leading-relaxed">
              {post.content}
            </div>
          </div>

          {/* Share Section */}
          <div className="mt-8 pt-8 border-t border-aggressive-white">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-aggressive-white">Bu yazıyı paylaş:</h3>
              <div className="flex space-x-2">
                <button className="p-2 bg-aggressive-black border border-aggressive-white rounded-lg hover:bg-aggressive-white hover:text-aggressive-black transition-all duration-200 hover-aggressive">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export default BlogPost; 