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
      color: 'bg-aggressive-white text-aggressive-black'
    },
    {
      title: 'Profil Resmi',
      description: 'Profil resmini yükle ve düzenle',
      icon: <Image className="w-6 h-6" />,
      onClick: goToAdminProfile,
      color: 'bg-aggressive-white text-aggressive-black'
    },
    {
      title: 'Projeler',
      description: 'Proje portföyünü yönet',
      icon: <Briefcase className="w-6 h-6" />,
      onClick: goToAdminProjects,
      color: 'bg-aggressive-white text-aggressive-black'
    },
    {
      title: 'Blog Yazıları',
      description: 'Blog içeriklerini düzenle',
      icon: <FileText className="w-6 h-6" />,
      onClick: goToAdminBlog,
      color: 'bg-aggressive-white text-aggressive-black'
    },
    {
      title: 'Yetenekler',
      description: 'Teknik yetenekleri güncelle',
      icon: <User className="w-6 h-6" />,
      onClick: goToAdminSkills,
      color: 'bg-aggressive-white text-aggressive-black'
    },
    {
      title: 'Başarılar',
      description: 'Başarı ve istatistikleri yönet',
      icon: <Award className="w-6 h-6" />,
      onClick: goToAdminAchievements,
      color: 'bg-aggressive-white text-aggressive-black'
    },
    {
      title: 'Analitik',
      description: 'Site istatistiklerini görüntüle',
      icon: <BarChart3 className="w-6 h-6" />,
      onClick: goToAdminAnalytics,
      color: 'bg-aggressive-white text-aggressive-black'
    },
    {
      title: 'Ayarlar',
      description: 'Sistem ayarlarını yapılandır',
      icon: <Settings className="w-6 h-6" />,
      onClick: goToAdminSettings,
      color: 'bg-aggressive-white text-aggressive-black'
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-aggressive-black">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-aggressive-black text-aggressive-white">
      {/* Header */}
      <div className="bg-aggressive-black border-b-2 border-aggressive-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-aggressive-white">
                Admin Dashboard
              </h1>
              <p className="text-aggressive-gray font-bold">
                Hoş geldin, {user.username}!
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="btn-danger hover-aggressive inline-flex items-center space-x-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="card hover-aggressive">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-aggressive-gray font-bold">Toplam Görüntülenme</p>
                <p className="text-3xl font-bold text-aggressive-white">1,234</p>
              </div>
              <div className="p-3 bg-aggressive-white text-aggressive-black rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="card hover-aggressive">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-aggressive-gray font-bold">Projeler</p>
                <p className="text-3xl font-bold text-aggressive-white">12</p>
              </div>
              <div className="p-3 bg-aggressive-white text-aggressive-black rounded-lg">
                <Briefcase className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="card hover-aggressive">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-aggressive-gray font-bold">Blog Yazıları</p>
                <p className="text-3xl font-bold text-aggressive-white">8</p>
              </div>
              <div className="p-3 bg-aggressive-white text-aggressive-black rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="card hover-aggressive">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-aggressive-gray font-bold">Yetenekler</p>
                <p className="text-3xl font-bold text-aggressive-white">15</p>
              </div>
              <div className="p-3 bg-aggressive-white text-aggressive-black rounded-lg">
                <User className="w-6 h-6" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Menu Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {menuItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              onClick={item.onClick}
              className="card hover-aggressive cursor-pointer group"
            >
              <div className="text-center">
                <div className={`p-4 rounded-lg mb-4 mx-auto w-16 h-16 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform duration-200`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-aggressive-white mb-2">
                  {item.title}
                </h3>
                <p className="text-aggressive-gray font-bold">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard; 