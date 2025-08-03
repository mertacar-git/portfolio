import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Settings, 
  LogOut, 
  BarChart3, 
  FileText, 
  Briefcase, 
  User, 
  Home,
  Award,
  TrendingUp
} from 'lucide-react';
import { adminAuth } from '../../utils/auth';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = adminAuth.getUser();
    if (!currentUser) {
      navigate('/admin/login');
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  const handleLogout = () => {
    adminAuth.logout();
    navigate('/admin/login');
  };

  const menuItems = [
    {
      title: 'Ana Sayfa Yönetimi',
      description: 'Ana sayfa içeriklerini düzenle',
      icon: <Home className="w-6 h-6" />,
      href: '/admin/homepage',
      color: 'bg-blue-500'
    },
    {
      title: 'Projeler',
      description: 'Proje portföyünü yönet',
      icon: <Briefcase className="w-6 h-6" />,
      href: '/admin/projects',
      color: 'bg-green-500'
    },
    {
      title: 'Blog Yazıları',
      description: 'Blog içeriklerini düzenle',
      icon: <FileText className="w-6 h-6" />,
      href: '/admin/blog',
      color: 'bg-purple-500'
    },
    {
      title: 'Yetenekler',
      description: 'Teknik yetenekleri güncelle',
      icon: <User className="w-6 h-6" />,
      href: '/admin/skills',
      color: 'bg-orange-500'
    },
    {
      title: 'Başarılar',
      description: 'Başarı ve istatistikleri yönet',
      icon: <Award className="w-6 h-6" />,
      href: '/admin/achievements',
      color: 'bg-red-500'
    },
    {
      title: 'Analitik',
      description: 'Site istatistiklerini görüntüle',
      icon: <BarChart3 className="w-6 h-6" />,
      href: '/admin/analytics',
      color: 'bg-indigo-500'
    },
    {
      title: 'Ayarlar',
      description: 'Sistem ayarlarını yapılandır',
      icon: <Settings className="w-6 h-6" />,
      href: '/admin/settings',
      color: 'bg-gray-500'
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Yönetici Paneli
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Hoş geldin, {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Çıkış</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Yönetici Paneline Hoş Geldiniz
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Web sitenizin içeriklerini yönetmek için aşağıdaki seçenekleri kullanabilirsiniz.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Görüntüleme</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">1,234</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Briefcase className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Aktif Projeler</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Blog Yazıları</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <User className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Yetenekler</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">15</p>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 cursor-pointer group"
                onClick={() => navigate(item.href)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${item.color} text-white group-hover:scale-110 transition-transform duration-200`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard; 