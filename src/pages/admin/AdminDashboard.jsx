import React, { useState, useEffect } from 'react';
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
  TrendingUp,
  Image
} from 'lucide-react';
import { adminAuth } from '../../utils/auth';
import useNavigation from '../../hooks/useNavigation';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const { goToAdminLogin, goToAdminHomepage, goToAdminProfile, goToAdminProjects, goToAdminBlog, goToAdminSkills, goToAdminAchievements, goToAdminAnalytics, goToAdminSettings } = useNavigation();

  useEffect(() => {
    const currentUser = adminAuth.getUser();
    if (!currentUser) {
      goToAdminLogin();
      return;
    }
    setUser(currentUser);
  }, [goToAdminLogin]);

  const handleLogout = () => {
    adminAuth.logout();
    goToAdminLogin();
  };

  const menuItems = [
    {
      title: 'Ana Sayfa Yönetimi',
      description: 'Ana sayfa içeriklerini düzenle',
      icon: <Home className="w-6 h-6" />,
      onClick: goToAdminHomepage,
      color: 'bg-blue-500'
    },
    {
      title: 'Profil Resmi',
      description: 'Profil resmini yükle ve düzenle',
      icon: <Image className="w-6 h-6" />,
      onClick: goToAdminProfile,
      color: 'bg-pink-500'
    },
    {
      title: 'Projeler',
      description: 'Proje portföyünü yönet',
      icon: <Briefcase className="w-6 h-6" />,
      onClick: goToAdminProjects,
      color: 'bg-green-500'
    },
    {
      title: 'Blog Yazıları',
      description: 'Blog içeriklerini düzenle',
      icon: <FileText className="w-6 h-6" />,
      onClick: goToAdminBlog,
      color: 'bg-purple-500'
    },
    {
      title: 'Yetenekler',
      description: 'Teknik yetenekleri güncelle',
      icon: <User className="w-6 h-6" />,
      onClick: goToAdminSkills,
      color: 'bg-orange-500'
    },
    {
      title: 'Başarılar',
      description: 'Başarı ve istatistikleri yönet',
      icon: <Award className="w-6 h-6" />,
      onClick: goToAdminAchievements,
      color: 'bg-red-500'
    },
    {
      title: 'Analitik',
      description: 'Site istatistiklerini görüntüle',
      icon: <BarChart3 className="w-6 h-6" />,
      onClick: goToAdminAnalytics,
      color: 'bg-indigo-500'
    },
    {
      title: 'Ayarlar',
      description: 'Sistem ayarlarını yapılandır',
      icon: <Settings className="w-6 h-6" />,
      onClick: goToAdminSettings,
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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container-max py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Admin Panel
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Hoş geldin, {user.username}! Site içeriklerini yönetebilirsin.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </motion.div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={item.onClick}
                className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${item.color} text-white group-hover:scale-110 transition-transform duration-200`}>
                    {item.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Toplam Görüntülenme</p>
                <p className="text-2xl font-bold">1,234</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Projeler</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Briefcase className="w-8 h-8 text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Blog Yazıları</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <FileText className="w-8 h-8 text-purple-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Yetenekler</p>
                <p className="text-2xl font-bold">15</p>
              </div>
              <User className="w-8 h-8 text-orange-200" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard; 