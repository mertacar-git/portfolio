import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  ArrowLeft, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Save,
  X,
  BarChart3,
  Target,
  TrendingUp,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dataManager } from '../../utils/dataManager';
import { useToast } from '../../contexts/ToastContext';

const AdminSkills = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [personalInfo, setPersonalInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [filterCategory, setFilterCategory] = useState('Tümü');

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = () => {
    const data = dataManager.getPersonalInfo();
    setPersonalInfo(data);
    setIsLoading(false);
  };

  const handleAddSkill = () => {
    setEditingSkill({
      name: '',
      level: 50,
      category: 'Programming',
      description: '',
      icon: '',
      color: 'blue'
    });
    setShowAddModal(true);
  };

  const handleEditSkill = (skill, index) => {
    setEditingSkill({
      ...skill,
      index
    });
    setShowAddModal(true);
  };

  const handleDeleteSkill = (index) => {
    if (window.confirm('Bu yeteneği silmek istediğinizden emin misiniz?')) {
      try {
        const updatedSkills = personalInfo.skills.filter((_, i) => i !== index);
        dataManager.updateSkills(updatedSkills);
        loadSkills();
        showToast('Yetenek başarıyla silindi!', 'success');
      } catch (error) {
        showToast('Silme sırasında hata oluştu!', 'error');
      }
    }
  };

  const handleSaveSkill = () => {
    try {
      const skillData = {
        name: editingSkill.name,
        level: parseInt(editingSkill.level),
        category: editingSkill.category,
        description: editingSkill.description,
        icon: editingSkill.icon,
        color: editingSkill.color
      };

      let updatedSkills = [...personalInfo.skills];

      if (editingSkill.index !== undefined) {
        // Update existing skill
        updatedSkills[editingSkill.index] = skillData;
        showToast('Yetenek başarıyla güncellendi!', 'success');
      } else {
        // Add new skill
        updatedSkills.push(skillData);
        showToast('Yetenek başarıyla eklendi!', 'success');
      }

      dataManager.updateSkills(updatedSkills);
      setShowAddModal(false);
      setEditingSkill(null);
      loadSkills();
    } catch (error) {
      showToast('Kaydetme sırasında hata oluştu!', 'error');
    }
  };

  const filteredSkills = personalInfo?.skills?.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'Tümü' || skill.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  }) || [];

  const categories = ['Tümü', 'Programming', 'Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Other'];

  const getSkillLevelColor = (level) => {
    if (level >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    if (level >= 60) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
    if (level >= 40) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-red-600 bg-red-100 dark:bg-red-900/30';
  };

  const getSkillLevelText = (level) => {
    if (level >= 80) return 'Uzman';
    if (level >= 60) return 'İleri';
    if (level >= 40) return 'Orta';
    return 'Başlangıç';
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
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <User className="w-6 h-6 text-orange-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Yetenek Yönetimi
                </h1>
              </div>
            </div>

            <button
              onClick={handleAddSkill}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Yetenek</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Yetenek</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{personalInfo.skills.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Uzman Seviye</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {personalInfo.skills.filter(s => s.level >= 80).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">İleri Seviye</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {personalInfo.skills.filter(s => s.level >= 60 && s.level < 80).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ortalama Seviye</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {personalInfo.skills.length > 0 
                      ? Math.round(personalInfo.skills.reduce((sum, skill) => sum + skill.level, 0) / personalInfo.skills.length)
                      : 0
                    }%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Yeteneklerde ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={`${skill.name}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {skill.name}
                        </h3>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getSkillLevelColor(skill.level)}`}>
                          {getSkillLevelText(skill.level)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 ml-2">
                        <button
                          onClick={() => handleEditSkill(skill, index)}
                          className="p-1 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(index)}
                          className="p-1 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {skill.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {skill.description}
                      </p>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Seviye</span>
                        <span className="font-medium text-gray-900 dark:text-white">{skill.level}%</span>
                      </div>
                      
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            skill.level >= 80 ? 'bg-green-500' :
                            skill.level >= 60 ? 'bg-blue-500' :
                            skill.level >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Kategori</span>
                        <span className="font-medium text-gray-900 dark:text-white">{skill.category}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredSkills.length === 0 && (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Yetenek bulunamadı
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Arama kriterlerinize uygun yetenek bulunamadı.
              </p>
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
                    {editingSkill?.index !== undefined ? 'Yetenek Düzenle' : 'Yeni Yetenek Ekle'}
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
                    Yetenek Adı *
                  </label>
                  <input
                    type="text"
                    value={editingSkill?.name || ''}
                    onChange={(e) => setEditingSkill(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="JavaScript, React, Node.js..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Seviye *
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={editingSkill?.level || 50}
                      onChange={(e) => setEditingSkill(prev => ({ ...prev, level: e.target.value }))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Başlangıç</span>
                      <span className="font-medium text-gray-900 dark:text-white">{editingSkill?.level || 50}%</span>
                      <span className="text-gray-600 dark:text-gray-400">Uzman</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kategori
                  </label>
                  <select
                    value={editingSkill?.category || 'Programming'}
                    onChange={(e) => setEditingSkill(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {categories.filter(cat => cat !== 'Tümü').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={editingSkill?.description || ''}
                    onChange={(e) => setEditingSkill(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Yetenek hakkında kısa açıklama..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    İkon (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={editingSkill?.icon || ''}
                    onChange={(e) => setEditingSkill(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="🔧, ⚡, 🚀..."
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
                  onClick={handleSaveSkill}
                  disabled={!editingSkill?.name}
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

export default AdminSkills; 