import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  ArrowLeft, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Save,
  X,
  TrendingUp,
  Target,
  Trophy,
  Star,
  Users,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dataManager } from '../../utils/dataManager';
import { useToast } from '../../contexts/ToastContext';

const AdminAchievements = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [personalInfo, setPersonalInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = dataManager.getPersonalInfo();
    setPersonalInfo(data);
    setIsLoading(false);
  };

  const handleAddAchievement = () => {
    setEditingAchievement({
      title: '',
      description: '',
      value: 0,
      icon: 'Trophy',
      color: 'blue',
      category: 'Project',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddModal(true);
  };

  const handleEditAchievement = (achievement, index) => {
    setEditingAchievement({
      ...achievement,
      index
    });
    setShowAddModal(true);
  };

  const handleDeleteAchievement = (index) => {
    if (window.confirm('Bu başarıyı silmek istediğinizden emin misiniz?')) {
      try {
        const updatedAchievements = personalInfo.achievements.filter((_, i) => i !== index);
        dataManager.updatePersonalInfo({ ...personalInfo, achievements: updatedAchievements });
        loadData();
        showToast('Başarı başarıyla silindi!', 'success');
      } catch (error) {
        showToast('Silme sırasında hata oluştu!', 'error');
      }
    }
  };

  const handleSaveAchievement = () => {
    try {
      const achievementData = {
        title: editingAchievement.title,
        description: editingAchievement.description,
        value: parseInt(editingAchievement.value),
        icon: editingAchievement.icon,
        color: editingAchievement.color,
        category: editingAchievement.category,
        date: editingAchievement.date
      };

      let updatedAchievements = [...(personalInfo.achievements || [])];

      if (editingAchievement.index !== undefined) {
        // Update existing achievement
        updatedAchievements[editingAchievement.index] = achievementData;
        showToast('Başarı başarıyla güncellendi!', 'success');
      } else {
        // Add new achievement
        updatedAchievements.push(achievementData);
        showToast('Başarı başarıyla eklendi!', 'success');
      }

      dataManager.updatePersonalInfo({ ...personalInfo, achievements: updatedAchievements });
      setShowAddModal(false);
      setEditingAchievement(null);
      loadData();
    } catch (error) {
      showToast('Kaydetme sırasında hata oluştu!', 'error');
    }
  };

  const handleStatsChange = (field, value) => {
    try {
      const updatedStats = {
        ...personalInfo.stats,
        [field]: parseInt(value) || 0
      };
      dataManager.updateStats(updatedStats);
      loadData();
      showToast('İstatistikler güncellendi!', 'success');
    } catch (error) {
      showToast('Güncelleme sırasında hata oluştu!', 'error');
    }
  };

  const filteredAchievements = personalInfo?.achievements?.filter(achievement => {
    return achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           achievement.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           achievement.category.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  const categories = ['Project', 'Award', 'Certification', 'Experience', 'Other'];

  const getIconComponent = (iconName) => {
    const icons = {
      Trophy: Trophy,
      Star: Star,
      TrendingUp: TrendingUp,
      Users: Users,
      Calendar: Calendar,
      BarChart3: BarChart3,
      Target: Target,
      Award: Award
    };
    return icons[iconName] || Award;
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
      green: 'text-green-600 bg-green-100 dark:bg-green-900/30',
      yellow: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
      red: 'text-red-600 bg-red-100 dark:bg-red-900/30',
      purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
      orange: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30'
    };
    return colors[color] || colors.blue;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
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
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Award className="w-6 h-6 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Başarı Yönetimi
                </h1>
              </div>
            </div>

            <button
              onClick={handleAddAchievement}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Başarı</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 ${
                    activeTab === 'stats'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>İstatistikler</span>
                </button>
                <button
                  onClick={() => setActiveTab('achievements')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 ${
                    activeTab === 'achievements'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Trophy className="w-4 h-4" />
                  <span>Başarılar</span>
                </button>
              </nav>
            </div>
          </div>

          {activeTab === 'stats' && (
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tamamlanan Projeler</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{personalInfo.stats.completedProjects}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Web Uygulamaları</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{personalInfo.stats.webAppsBuilt}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                      <Calendar className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Deneyim (Yıl)</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{personalInfo.stats.yearsExperience}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Mutlu Müşteriler</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{personalInfo.stats.happyClients}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Editor */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  İstatistikleri Düzenle
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tamamlanan Projeler
                    </label>
                    <input
                      type="number"
                      value={personalInfo.stats.completedProjects}
                      onChange={(e) => handleStatsChange('completedProjects', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Web Uygulamaları
                    </label>
                    <input
                      type="number"
                      value={personalInfo.stats.webAppsBuilt}
                      onChange={(e) => handleStatsChange('webAppsBuilt', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Deneyim (Yıl)
                    </label>
                    <input
                      type="number"
                      value={personalInfo.stats.yearsExperience}
                      onChange={(e) => handleStatsChange('yearsExperience', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mutlu Müşteriler
                    </label>
                    <input
                      type="number"
                      value={personalInfo.stats.happyClients}
                      onChange={(e) => handleStatsChange('happyClients', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-6">
              {/* Search */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Başarılarda ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Achievements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredAchievements.map((achievement, index) => {
                    const IconComponent = getIconComponent(achievement.icon);
                    return (
                      <motion.div
                        key={`${achievement.title}-${index}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className={`p-2 rounded-lg ${getColorClasses(achievement.color)}`}>
                                  <IconComponent className="w-5 h-5" />
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                  {achievement.category}
                                </span>
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                {achievement.title}
                              </h3>
                            </div>
                            <div className="flex items-center space-x-2 ml-2">
                              <button
                                onClick={() => handleEditAchievement(achievement, index)}
                                className="p-1 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAchievement(index)}
                                className="p-1 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                            {achievement.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                              {achievement.value}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-500">
                              {achievement.date}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {filteredAchievements.length === 0 && (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Başarı bulunamadı
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Arama kriterlerinize uygun başarı bulunamadı.
                  </p>
                </div>
              )}
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
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {editingAchievement?.index !== undefined ? 'Başarı Düzenle' : 'Yeni Başarı Ekle'}
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Başlık *
                  </label>
                  <input
                    type="text"
                    value={editingAchievement?.title || ''}
                    onChange={(e) => setEditingAchievement(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Başarı başlığı..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={editingAchievement?.description || ''}
                    onChange={(e) => setEditingAchievement(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Başarı açıklaması..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Değer
                    </label>
                    <input
                      type="number"
                      value={editingAchievement?.value || 0}
                      onChange={(e) => setEditingAchievement(prev => ({ ...prev, value: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Kategori
                    </label>
                    <select
                      value={editingAchievement?.category || 'Project'}
                      onChange={(e) => setEditingAchievement(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      İkon
                    </label>
                    <select
                      value={editingAchievement?.icon || 'Trophy'}
                      onChange={(e) => setEditingAchievement(prev => ({ ...prev, icon: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Trophy">Trophy</option>
                      <option value="Star">Star</option>
                      <option value="TrendingUp">TrendingUp</option>
                      <option value="Users">Users</option>
                      <option value="Calendar">Calendar</option>
                      <option value="BarChart3">BarChart3</option>
                      <option value="Target">Target</option>
                      <option value="Award">Award</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Renk
                    </label>
                    <select
                      value={editingAchievement?.color || 'blue'}
                      onChange={(e) => setEditingAchievement(prev => ({ ...prev, color: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="blue">Mavi</option>
                      <option value="green">Yeşil</option>
                      <option value="yellow">Sarı</option>
                      <option value="red">Kırmızı</option>
                      <option value="purple">Mor</option>
                      <option value="orange">Turuncu</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tarih
                  </label>
                  <input
                    type="date"
                    value={editingAchievement?.date || ''}
                    onChange={(e) => setEditingAchievement(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  İptal
                </button>
                <button
                  onClick={handleSaveAchievement}
                  disabled={!editingAchievement?.title}
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

export default AdminAchievements; 