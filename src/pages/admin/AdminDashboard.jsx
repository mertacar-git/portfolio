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
import { useNavigate } from 'react-router-dom';

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
      onClick: () => navigate('/admin/homepage'),
      color: 'bg-aggressive-white text-aggressive-black'
    },
    {
      title: 'Profil Resmi',
      description: 'Profil resmini yükle ve düzenle',
      icon: <Image className="w-6 h-6" />,
      onClick: () => navigate('/admin/profile'),
      color: 'bg-aggressive-white text-aggressive-black'
    },
    {
      title: 'Projeler',
      description: 'Proje portföyünü yönet',
      icon: <Briefcase className="w-6 h-6" />,
      onClick: () => navigate('/admin/projects'),
      color: 'bg-aggressive-white text-aggressive-black'
    },
    {
      title: 'Blog Yazıları',
      description: 'Blog içeriklerini düzenle',
      icon: <FileText className="w-6 h-6" />,
      onClick: () => navigate('/admin/blog'),
      color: 'bg-aggressive-white text-aggressive-black'
    },
    {
      title: 'Yetenekler',
      description: 'Teknik yetenekleri güncelle',
      icon: <User className="w-6 h-6" />,
      onClick: () => navigate('/admin/skills'),
      color: 'bg-aggressive-white text-aggressive-black'
    },
    {
      title: 'Başarılar',
      description: 'Başarı ve istatistikleri yönet',
      icon: <Award className="w-6 h-6" />,
      onClick: () => navigate('/admin/achievements'),
      color: 'bg-aggressive-white text-aggressive-black'
    },
    {
      title: 'Analitik',
      description: 'Site istatistiklerini görüntüle',
      icon: <BarChart3 className="w-6 h-6" />,
      onClick: () => navigate('/admin/analytics'),
      color: 'bg-aggressive-white text-aggressive-black'
    },
    {
      title: 'Ayarlar',
      description: 'Sistem ayarlarını yapılandır',
      icon: <Settings className="w-6 h-6" />,
      onClick: () => navigate('/admin/settings'),
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
      <header className="bg-aggressive-gray border-b-4 border-aggressive-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-aggressive-white">
                Admin Dashboard
              </h1>
              <p className="text-aggressive-gray font-bold">
                Hoş geldin, {user.username}!
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="btn-secondary hover-aggressive"
              >
                Siteyi Görüntüle
              </button>
              <button
                onClick={handleLogout}
                className="btn-danger hover-aggressive"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card"
          >
            <div className="flex items-center">
              <div className="p-3 bg-aggressive-white rounded-lg mr-4">
                <TrendingUp className="w-6 h-6 text-aggressive-black" />
              </div>
              <div>
                <p className="text-aggressive-gray font-bold text-sm">Toplam Görüntülenme</p>
                <p className="text-2xl font-bold text-aggressive-white">1,234</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center">
              <div className="p-3 bg-aggressive-white rounded-lg mr-4">
                <User className="w-6 h-6 text-aggressive-black" />
              </div>
              <div>
                <p className="text-aggressive-gray font-bold text-sm">Benzersiz Ziyaretçi</p>
                <p className="text-2xl font-bold text-aggressive-white">567</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center">
              <div className="p-3 bg-aggressive-white rounded-lg mr-4">
                <Briefcase className="w-6 h-6 text-aggressive-black" />
              </div>
              <div>
                <p className="text-aggressive-gray font-bold text-sm">Projeler</p>
                <p className="text-2xl font-bold text-aggressive-white">15</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center">
              <div className="p-3 bg-aggressive-white rounded-lg mr-4">
                <FileText className="w-6 h-6 text-aggressive-black" />
              </div>
              <div>
                <p className="text-aggressive-gray font-bold text-sm">Blog Yazıları</p>
                <p className="text-2xl font-bold text-aggressive-white">8</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card cursor-pointer hover-aggressive"
              onClick={item.onClick}
            >
              <div className="text-center">
                <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-aggressive-xl`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-aggressive-white mb-2">
                  {item.title}
                </h3>
                <p className="text-aggressive-gray font-bold text-sm">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 