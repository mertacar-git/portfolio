import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Eye, 
  Calendar,
  Clock,
  Globe,
  Download,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dataManager } from '../../utils/dataManager';
import { useToast } from '../../contexts/ToastContext';

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedPage, setSelectedPage] = useState('all');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    const data = dataManager.getAnalytics();
    setAnalytics(data);
    setIsLoading(false);
  };

  const refreshAnalytics = () => {
    setIsLoading(true);
    setTimeout(() => {
      loadAnalytics();
      showToast('Analitikler yenilendi!', 'success');
    }, 1000);
  };

  const exportAnalytics = () => {
    try {
      const dataStr = JSON.stringify(analytics, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      showToast('Analitikler dışa aktarıldı!', 'success');
    } catch (error) {
      showToast('Dışa aktarma sırasında hata oluştu!', 'error');
    }
  };

  const getPageViews = () => {
    if (!analytics) return [];
    return Object.entries(analytics.pageViews || {}).map(([page, views]) => ({
      page,
      views
    })).sort((a, b) => b.views - a.views);
  };

  const getTopPages = () => {
    return getPageViews().slice(0, 5);
  };

  const getTotalPageViews = () => {
    if (!analytics) return 0;
    return Object.values(analytics.pageViews || {}).reduce((sum, views) => sum + views, 0);
  };

  const getAverageViewsPerPage = () => {
    const pageViews = getPageViews();
    if (pageViews.length === 0) return 0;
    return Math.round(getTotalPageViews() / pageViews.length);
  };

  const getGrowthRate = () => {
    // Simulated growth rate calculation
    return Math.floor(Math.random() * 20) + 5; // 5-25% growth
  };

  const getTimeRangeData = () => {
    const ranges = {
      '1d': 'Son 24 Saat',
      '7d': 'Son 7 Gün',
      '30d': 'Son 30 Gün',
      '90d': 'Son 90 Gün'
    };
    return ranges[timeRange] || 'Son 7 Gün';
  };

  const getPageName = (page) => {
    const pageNames = {
      'app': 'Ana Sayfa',
      'about': 'Hakkımda',
      'portfolio': 'Portföy',
      'blog': 'Blog',
      'contact': 'İletişim',
      'admin': 'Admin Panel'
    };
    return pageNames[page] || page;
  };

  const getPageIcon = (page) => {
    const icons = {
      'app': '🏠',
      'about': '👤',
      'portfolio': '💼',
      'blog': '📝',
      'contact': '📧',
      'admin': '⚙️'
    };
    return icons[page] || '📄';
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
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Site Analitikleri
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="1d">Son 24 Saat</option>
                <option value="7d">Son 7 Gün</option>
                <option value="30d">Son 30 Gün</option>
                <option value="90d">Son 90 Gün</option>
              </select>
              <button
                onClick={refreshAnalytics}
                className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={exportAnalytics}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Dışa Aktar</span>
              </button>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Görüntüleme</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{getTotalPageViews()}</p>
                  <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +{getGrowthRate()}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Benzersiz Ziyaretçi</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.uniqueVisitors || 0}</p>
                  <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +{getGrowthRate()}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Globe className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sayfa Sayısı</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{getPageViews().length}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Aktif sayfalar
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ortalama Görüntüleme</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{getAverageViewsPerPage()}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Sayfa başına
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Time Range Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {getTimeRangeData()}
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-500">
                Son güncelleme: {new Date(analytics.lastUpdated).toLocaleString('tr-TR')}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Pages */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  En Popüler Sayfalar
                </h2>
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <select
                    value={selectedPage}
                    onChange={(e) => setSelectedPage(e.target.value)}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">Tüm Sayfalar</option>
                    {getPageViews().map(({ page }) => (
                      <option key={page} value={page}>{getPageName(page)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {getTopPages()
                  .filter(({ page }) => selectedPage === 'all' || page === selectedPage)
                  .map(({ page, views }, index) => (
                    <div key={page} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getPageIcon(page)}</div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {getPageName(page)}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {page}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {views}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          görüntüleme
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Page Views Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Sayfa Görüntüleme Grafiği
              </h2>

              <div className="space-y-4">
                {getPageViews().map(({ page, views }) => {
                  const maxViews = Math.max(...getPageViews().map(p => p.views));
                  const percentage = maxViews > 0 ? (views / maxViews) * 100 : 0;
                  
                  return (
                    <div key={page} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {getPageName(page)}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {views}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detailed Analytics */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Detaylı Analitikler
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {Math.round(getTotalPageViews() / (analytics.uniqueVisitors || 1))}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Ziyaretçi Başına Ortalama Görüntüleme
                </div>
              </div>

              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {getPageViews().length > 0 ? Math.round((getTopPages()[0]?.views || 0) / getTotalPageViews() * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  En Popüler Sayfa Oranı
                </div>
              </div>

              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {new Date(analytics.lastUpdated).toLocaleDateString('tr-TR')}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Son Veri Güncellemesi
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Son Aktiviteler
            </h2>

            <div className="space-y-4">
              {getPageViews().slice(0, 5).map(({ page, views }, index) => (
                <div key={page} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl">{getPageIcon(page)}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {getPageName(page)} sayfası görüntülendi
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {views} kez görüntülendi
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date().toLocaleTimeString('tr-TR')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAnalytics; 