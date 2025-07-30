import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Settings, 
  Plus, 
  Trash2,
  Eye,
  TrendingUp,
  Clock,
  LogOut,
  RefreshCw,
  TestTube,
  Database,
  Gamepad2,
  Globe,
  Award,
  Shield,
  CheckCircle
} from 'lucide-react';
import { ProtectedRoute, securityUtils } from '../../utils/auth';
import { useToast } from '../../contexts/ToastContext';
import { analytics } from '../../utils/dataManager';
import { storageService } from '../../services/storageService';
import { testLocalStorage } from '../../utils/testLocalStorage';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalBlogPosts: 0,
    totalViews: 0,
    recentActivity: [],
    gameProjects: 3,
    webProjects: 4,
    certifications: 3,
    references: 2
  });
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const analyticsData = analytics.getStats();
      const savedProjects = storageService.getData('projects') || [];
      const savedBlogPosts = storageService.getData('blogPosts') || [];
      
      setStats({
        totalProjects: savedProjects.length,
        totalBlogPosts: savedBlogPosts.length,
        totalViews: analyticsData.totalPageViews + analyticsData.totalProjectViews + analyticsData.totalBlogViews,
        recentActivity: [
          {
            id: 1,
            type: 'project',
            title: 'Yeni proje eklendi',
            description: 'E-Ticaret Platformu projesi eklendi',
            time: '2 saat önce'
          },
          {
            id: 2,
            type: 'blog',
            title: 'Blog yazısı yayınlandı',
            description: 'React 18 yazısı yayınlandı',
            time: '1 gün önce'
          },
          {
            id: 3,
            type: 'view',
            title: 'Yüksek trafik',
            description: 'Ana sayfa 150 görüntüleme aldı',
            time: '2 gün önce'
          }
        ],
        gameProjects: 3,
        webProjects: 4,
        certifications: 3,
        references: 2
      });
    } catch (error) {
      showToast('Dashboard verileri yüklenirken hata oluştu', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleLogout = () => {
    securityUtils.logout();
    showToast('Başarıyla çıkış yapıldı', 'success');
    setTimeout(() => {
      window.location.href = '/admin/login';
    }, 1000);
  };

  const handleRunTests = () => {
    try {
      testLocalStorage.runAllTests();
      showToast('Testler başarıyla çalıştırıldı. Console\'u kontrol edin.', 'success');
    } catch (error) {
      showToast('Testler çalıştırılırken hata oluştu', 'error');
    }
  };

  const handleCreateDemoData = () => {
    try {
      testLocalStorage.createDemoData();
      showToast('Demo veriler başarıyla oluşturuldu', 'success');
      loadDashboardData(); // Dashboard'u yenile
    } catch (error) {
      showToast('Demo veriler oluşturulurken hata oluştu', 'error');
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('Tüm verileri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      try {
        storageService.clearAll();
        showToast('Tüm veriler başarıyla silindi', 'success');
        loadDashboardData(); // Dashboard'u yenile
      } catch (error) {
        showToast('Veriler silinirken hata oluştu', 'error');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Dashboard yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Admin Dashboard
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={loadDashboardData}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                  title="Yenile"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={handleRunTests}
                  className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
                  title="Test Çalıştır"
                >
                  <TestTube className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCreateDemoData}
                  className="p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors duration-200"
                  title="Demo Veriler Oluştur"
                >
                  <Database className="w-5 h-5" />
                </button>
                <button
                  onClick={handleClearAllData}
                  className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
                  title="Tüm Verileri Temizle"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
                  title="Çıkış Yap"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Toplam Proje
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalProjects}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Blog Yazısı
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalBlogPosts}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Toplam Görüntüleme
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalViews}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Bu Ay
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    +12%
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center">
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <Gamepad2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Oyun Projeleri
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.gameProjects || 3}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                  <Globe className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Web Projeleri
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.webProjects || 4}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Sertifikalar
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.certifications || 3}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center">
                <div className="p-3 bg-teal-100 dark:bg-teal-900/20 rounded-lg">
                  <Users className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Referanslar
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.references || 2}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-8"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Hızlı İşlemler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to="/admin/projects"
                className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200 group"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-200">
                  <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium block">
                    Yeni Proje
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 text-xs">
                    Portfolio'a proje ekle
                  </span>
                </div>
              </Link>
              
              <Link
                to="/admin/blog"
                className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200 group"
              >
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-200">
                  <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <span className="text-green-700 dark:text-green-300 font-medium block">
                    Yeni Blog
                  </span>
                  <span className="text-green-600 dark:text-green-400 text-xs">
                    Blog yazısı oluştur
                  </span>
                </div>
              </Link>
              
              <Link
                to="/admin/settings"
                className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200 group"
              >
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-200">
                  <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <span className="text-purple-700 dark:text-purple-300 font-medium block">
                    Ayarlar
                  </span>
                  <span className="text-purple-600 dark:text-purple-400 text-xs">
                    Site konfigürasyonu
                  </span>
                </div>
              </Link>
              
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors duration-200 group"
              >
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-200">
                  <Eye className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <span className="text-orange-700 dark:text-orange-300 font-medium block">
                    Siteyi Görüntüle
                  </span>
                  <span className="text-orange-600 dark:text-orange-400 text-xs">
                    Yeni sekmede aç
                  </span>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Advanced Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-8"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Gelişmiş İşlemler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={handleCreateDemoData}
                className="flex items-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors duration-200 group"
              >
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-200">
                  <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium block">
                    Demo Veriler
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-xs">
                    Test verileri oluştur
                  </span>
                </div>
              </button>

              <button
                onClick={handleRunTests}
                className="flex items-center p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-colors duration-200 group"
              >
                <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-200">
                  <TestTube className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <span className="text-cyan-700 dark:text-cyan-300 font-medium block">
                    Sistem Testi
                  </span>
                  <span className="text-cyan-600 dark:text-cyan-400 text-xs">
                    Local storage test et
                  </span>
                </div>
              </button>

              <button
                onClick={handleClearAllData}
                className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200 group"
              >
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-200">
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <span className="text-red-700 dark:text-red-300 font-medium block">
                    Verileri Temizle
                  </span>
                  <span className="text-red-600 dark:text-red-400 text-xs">
                    Tüm verileri sil
                  </span>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Security Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-8"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              Güvenlik Durumu
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <span className="text-green-700 dark:text-green-300 font-medium block">
                    Admin Girişi
                  </span>
                  <span className="text-green-600 dark:text-green-400 text-xs">
                    Güvenli
                  </span>
                </div>
              </div>

              <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <span className="text-green-700 dark:text-green-300 font-medium block">
                    Local Storage
                  </span>
                  <span className="text-green-600 dark:text-green-400 text-xs">
                    Şifrelenmiş
                  </span>
                </div>
              </div>

              <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <span className="text-green-700 dark:text-green-300 font-medium block">
                    Input Validation
                  </span>
                  <span className="text-green-600 dark:text-green-400 text-xs">
                    Aktif
                  </span>
                </div>
              </div>

              <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <span className="text-green-700 dark:text-green-300 font-medium block">
                    XSS Koruması
                  </span>
                  <span className="text-green-600 dark:text-green-400 text-xs">
                    Aktif
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Son Aktiviteler
            </h2>
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className={`p-2 rounded-lg mr-4 ${
                    activity.type === 'project' ? 'bg-blue-100 dark:bg-blue-900/20' :
                    activity.type === 'blog' ? 'bg-green-100 dark:bg-green-900/20' :
                    'bg-purple-100 dark:bg-purple-900/20'
                  }`}>
                    {activity.type === 'project' && <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                    {activity.type === 'blog' && <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />}
                    {activity.type === 'view' && <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {activity.time}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard; 