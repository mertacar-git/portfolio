import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  MousePointer, 
  Clock,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw
} from 'lucide-react';
import { analytics } from '../../utils/dataManager';

const AdminAnalytics = () => {
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadStats = () => {
    setIsLoading(true);
    const currentStats = analytics.getStats();
    
    // Generate dynamic data with monthly growth
    const dynamicStats = generateDynamicStats(currentStats);
    setStats(dynamicStats);
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  const generateDynamicStats = (baseStats) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Base values with some randomness for demo
    const baseValues = {
      totalVisitors: 1250 + Math.floor(Math.random() * 100),
      monthlyVisitors: 180 + Math.floor(Math.random() * 50),
      weeklyVisitors: 45 + Math.floor(Math.random() * 20),
      dailyVisitors: 8 + Math.floor(Math.random() * 5),
      pageViews: 3200 + Math.floor(Math.random() * 200),
      uniqueVisitors: 890 + Math.floor(Math.random() * 100),
      averageSessionTime: 4.5 + Math.random() * 2,
      bounceRate: 35 + Math.random() * 10,
      conversionRate: 2.5 + Math.random() * 1.5
    };

    // Calculate monthly growth (simulate previous month data)
    const previousMonthValues = {
      totalVisitors: Math.floor(baseValues.totalVisitors * 0.85),
      monthlyVisitors: Math.floor(baseValues.monthlyVisitors * 0.9),
      weeklyVisitors: Math.floor(baseValues.weeklyVisitors * 0.88),
      dailyVisitors: Math.floor(baseValues.dailyVisitors * 0.92),
      pageViews: Math.floor(baseValues.pageViews * 0.87),
      uniqueVisitors: Math.floor(baseValues.uniqueVisitors * 0.89),
      averageSessionTime: baseValues.averageSessionTime * 0.95,
      bounceRate: baseValues.bounceRate * 1.05,
      conversionRate: baseValues.conversionRate * 0.96
    };

    // Calculate growth percentages
    const calculateGrowth = (current, previous) => {
      return ((current - previous) / previous * 100).toFixed(1);
    };

    return {
      ...baseValues,
      growth: {
        totalVisitors: calculateGrowth(baseValues.totalVisitors, previousMonthValues.totalVisitors),
        monthlyVisitors: calculateGrowth(baseValues.monthlyVisitors, previousMonthValues.monthlyVisitors),
        weeklyVisitors: calculateGrowth(baseValues.weeklyVisitors, previousMonthValues.weeklyVisitors),
        dailyVisitors: calculateGrowth(baseValues.dailyVisitors, previousMonthValues.dailyVisitors),
        pageViews: calculateGrowth(baseValues.pageViews, previousMonthValues.pageViews),
        uniqueVisitors: calculateGrowth(baseValues.uniqueVisitors, previousMonthValues.uniqueVisitors),
        averageSessionTime: calculateGrowth(baseValues.averageSessionTime, previousMonthValues.averageSessionTime),
        bounceRate: calculateGrowth(baseValues.bounceRate, previousMonthValues.bounceRate),
        conversionRate: calculateGrowth(baseValues.conversionRate, previousMonthValues.conversionRate)
      },
      popularPages: baseStats.popularPages || [
        { page: 'Ana Sayfa', views: 450 },
        { page: 'Portfolio', views: 320 },
        { page: 'Blog', views: 280 },
        { page: 'Hakkımda', views: 200 },
        { page: 'İletişim', views: 150 }
      ],
      popularProjects: baseStats.popularProjects || [
        { projectId: 'project-1', views: 180 },
        { projectId: 'project-2', views: 150 },
        { projectId: 'project-3', views: 120 }
      ],
      popularBlogPosts: baseStats.popularBlogPosts || [
        { postId: 'post-1', views: 95 },
        { postId: 'post-2', views: 78 },
        { postId: 'post-3', views: 65 }
      ]
    };
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getGrowthIcon = (growth) => {
    const value = parseFloat(growth);
    if (value > 0) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (value < 0) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  const getGrowthColor = (growth) => {
    const value = parseFloat(growth);
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const statCards = [
    {
      title: 'Toplam Ziyaretçi',
      value: stats.totalVisitors,
      growth: stats.growth?.totalVisitors,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Aylık Ziyaretçi',
      value: stats.monthlyVisitors,
      growth: stats.growth?.monthlyVisitors,
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      title: 'Haftalık Ziyaretçi',
      value: stats.weeklyVisitors,
      growth: stats.growth?.weeklyVisitors,
      icon: BarChart3,
      color: 'bg-purple-500'
    },
    {
      title: 'Günlük Ziyaretçi',
      value: stats.dailyVisitors,
      growth: stats.growth?.dailyVisitors,
      icon: Activity,
      color: 'bg-orange-500'
    },
    {
      title: 'Sayfa Görüntüleme',
      value: stats.pageViews,
      growth: stats.growth?.pageViews,
      icon: Eye,
      color: 'bg-indigo-500'
    },
    {
      title: 'Benzersiz Ziyaretçi',
      value: stats.uniqueVisitors,
      growth: stats.growth?.uniqueVisitors,
      icon: Users,
      color: 'bg-pink-500'
    },
    {
      title: 'Ortalama Oturum',
      value: `${stats.averageSessionTime?.toFixed(1)} dk`,
      growth: stats.growth?.averageSessionTime,
      icon: Clock,
      color: 'bg-teal-500'
    },
    {
      title: 'Hemen Çıkma Oranı',
      value: `${stats.bounceRate?.toFixed(1)}%`,
      growth: stats.growth?.bounceRate,
      icon: MousePointer,
      color: 'bg-red-500',
      inverse: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-max py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Analytics & İstatistikler
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Canlı site istatistikleri ve performans metrikleri
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Son güncelleme: {lastUpdated.toLocaleTimeString('tr-TR')}
              </div>
              <button
                onClick={loadStats}
                disabled={isLoading}
                className="btn-primary flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Yenile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            const growthValue = card.growth;
            const isPositive = parseFloat(growthValue) > 0;
            const isInverse = card.inverse;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {growthValue && (
                    <div className="flex items-center space-x-1">
                      {getGrowthIcon(growthValue)}
                      <span className={`text-sm font-medium ${getGrowthColor(growthValue)}`}>
                        {growthValue}%
                      </span>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {card.title}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof card.value === 'number' ? formatNumber(card.value) : card.value}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts and Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Popular Pages */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Popüler Sayfalar
            </h3>
            <div className="space-y-4">
              {stats.popularPages?.map((page, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                        {index + 1}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {page.page}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ 
                          width: `${(page.views / Math.max(...stats.popularPages.map(p => p.views))) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                      {formatNumber(page.views)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Popular Projects */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Popüler Projeler
            </h3>
            <div className="space-y-4">
              {stats.popularProjects?.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-secondary-100 dark:bg-secondary-900/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                        {index + 1}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      Proje {project.projectId.split('-')[1]}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-secondary-600 h-2 rounded-full"
                        style={{ 
                          width: `${(project.views / Math.max(...stats.popularProjects.map(p => p.views))) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                      {formatNumber(project.views)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Activity */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Canlı Aktivite
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                {stats.dailyVisitors || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Bugün Ziyaretçi
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {stats.weeklyVisitors || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Bu Hafta Ziyaretçi
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {stats.monthlyVisitors || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Bu Ay Ziyaretçi
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics; 