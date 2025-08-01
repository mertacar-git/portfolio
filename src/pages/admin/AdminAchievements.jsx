import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  AlertCircle,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { ProtectedRoute } from '../../utils/auth';
import { useToast } from '../../contexts/ToastContext';
import { storageService } from '../../services/storageService';
import { personalInfo as defaultPersonalInfo } from '../../data/personalInfo';
import { sanitizeInput } from '../../utils/validation';

const AdminAchievements = () => {
  const [achievements, setAchievements] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { showToast } = useToast();

  // Local storage'dan achievements verilerini yükle
  const loadAchievements = () => {
    const savedPersonalInfo = storageService.getData('personalInfo');
    if (savedPersonalInfo && savedPersonalInfo.stats) {
      setAchievements(savedPersonalInfo.stats);
    } else {
      setAchievements(defaultPersonalInfo.stats);
      // İlk kez çalıştırıldığında varsayılan verileri kaydet
      const currentPersonalInfo = storageService.getData('personalInfo') || defaultPersonalInfo;
      storageService.saveData('personalInfo', {
        ...currentPersonalInfo,
        stats: defaultPersonalInfo.stats
      });
    }
  };

  const saveAchievements = (updatedAchievements) => {
    const currentPersonalInfo = storageService.getData('personalInfo') || defaultPersonalInfo;
    const updatedPersonalInfo = {
      ...currentPersonalInfo,
      stats: updatedAchievements
    };
    storageService.saveData('personalInfo', updatedPersonalInfo);
    setAchievements(updatedAchievements);
  };

  useEffect(() => {
    loadAchievements();
  }, []);

  const handleEditAchievement = (key, value) => {
    setEditingAchievement({ key, value });
    setIsModalOpen(true);
  };

  const handleSaveAchievement = async (achievementData) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedAchievements = {
        ...achievements,
        [achievementData.key]: achievementData.value
      };
      
      saveAchievements(updatedAchievements);
      showToast('Başarı başarıyla güncellendi', 'success');
      setIsModalOpen(false);
    } catch (error) {
      showToast('Başarı kaydedilirken hata oluştu', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getAchievementLabel = (key) => {
    const labels = {
      completedProjects: 'Tamamlanan Projeler',
      webAppsBuilt: 'Geliştirilen Web Uygulamaları',
      yearsExperience: 'Deneyim Yılı',
      happyClients: 'Mutlu Müşteri'
    };
    return labels[key] || key;
  };

  const getAchievementIcon = (key) => {
    const icons = {
      completedProjects: '📁',
      webAppsBuilt: '🌐',
      yearsExperience: '⏰',
      happyClients: '😊'
    };
    return icons[key] || '🏆';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Başarı Yönetimi
                </h1>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {Object.keys(achievements).length} başarı
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8"
          >
            <div className="flex items-start space-x-3">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Başarı İstatistikleri
                </h3>
                <p className="text-blue-700 dark:text-blue-300">
                  Bu bölümde kariyeriniz boyunca elde ettiğiniz başarıları düzenleyebilirsiniz. 
                  Bu veriler ana sayfada ve hakkımda sayfasında görüntülenir.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {Object.entries(achievements).map(([key, value], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">
                      {getAchievementIcon(key)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {getAchievementLabel(key)}
                    </h3>
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-4">
                      {value}+
                    </div>
                    <button
                      onClick={() => handleEditAchievement(key, value)}
                      className="btn-outline inline-flex items-center space-x-2 w-full justify-center"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Düzenle</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Önizleme
              </h2>
              <p className="text-primary-100">
                Ana sayfada nasıl görüneceği
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Object.entries(achievements).map(([key, value], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {value}+
                  </div>
                  <div className="text-primary-100 text-sm capitalize">
                    {getAchievementLabel(key)}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Achievement Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <AchievementModal
              achievement={editingAchievement}
              onSave={handleSaveAchievement}
              onClose={() => setIsModalOpen(false)}
              isLoading={isLoading}
            />
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
};

// Achievement Modal Component
const AchievementModal = ({ achievement, onSave, onClose, isLoading }) => {
  const [formData, setFormData] = useState({
    key: achievement?.key || '',
    value: achievement?.value || 0
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const getAchievementLabel = (key) => {
    const labels = {
      completedProjects: 'Tamamlanan Projeler',
      webAppsBuilt: 'Geliştirilen Web Uygulamaları',
      yearsExperience: 'Deneyim Yılı',
      happyClients: 'Mutlu Müşteri'
    };
    return labels[key] || key;
  };

  const validateField = (name, value) => {
    const errors = [];
    
    switch (name) {
      case 'value':
        if (value < 0) {
          errors.push('Değer 0\'dan küçük olamaz');
        } else if (value > 999) {
          errors.push('Değer 999\'dan büyük olamaz');
        }
        break;
        
      default:
        break;
    }
    
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = name === 'value' ? parseInt(value) || 0 : sanitizeInput.preventXSS(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
    
    // Real-time validation for touched fields
    if (touched[name]) {
      const fieldErrors = validateField(name, sanitizedValue);
      setErrors(prev => ({ ...prev, [name]: fieldErrors }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const fieldErrors = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: fieldErrors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => { allTouched[key] = true; });
    setTouched(allTouched);
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(fieldName => {
      const fieldErrors = validateField(fieldName, formData[fieldName]);
      if (fieldErrors.length > 0) {
        newErrors[fieldName] = fieldErrors;
      }
    });
    setErrors(newErrors);
    
    // Check if there are any errors
    const hasErrors = Object.keys(newErrors).length > 0;
    
    if (!hasErrors) {
      onSave(formData);
    }
  };

  // Check if form has any errors
  const hasErrors = Object.keys(errors).some(field => errors[field].length > 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Başarı Düzenle
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Achievement Type (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Başarı Türü
              </label>
              <input
                type="text"
                value={getAchievementLabel(formData.key)}
                className="input-field bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
                readOnly
              />
            </div>

            {/* Achievement Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Değer
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="value"
                  min="0"
                  max="999"
                  value={formData.value}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('value')}
                  className={`input-field pr-10 ${
                    touched.value && errors.value?.length > 0 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : touched.value && !errors.value?.length 
                        ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                        : ''
                  }`}
                  required
                />
                {touched.value && errors.value?.length > 0 && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                )}
                {touched.value && !errors.value?.length && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              {touched.value && errors.value?.length > 0 && (
                <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.value.map((error, index) => (
                    <div key={index} className="flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {error}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Önizleme
              </h4>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {formData.value}+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {getAchievementLabel(formData.key)}
                </div>
              </div>
            </div>

            {/* Validation Summary */}
            {hasErrors && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Doğrulama Hataları
                </h4>
                <div className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  {Object.keys(errors).map(fieldName => (
                    errors[fieldName].map((error, index) => (
                      <div key={`${fieldName}-${index}`} className="flex items-start">
                        <span className="font-medium mr-2">•</span>
                        <span>{error}</span>
                      </div>
                    ))
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                disabled={isLoading}
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={isLoading || hasErrors}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  isLoading || hasErrors
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Güncelle</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminAchievements; 