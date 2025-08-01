import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { ProtectedRoute } from '../../utils/auth';
import { useToast } from '../../contexts/ToastContext';
import { storageService } from '../../services/storageService';
import { personalInfo as defaultPersonalInfo } from '../../data/personalInfo';
import { sanitizeInput } from '../../utils/validation';

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { showToast } = useToast();

  // Local storage'dan skills verilerini yükle
  const loadSkills = () => {
    const savedPersonalInfo = storageService.getData('personalInfo');
    if (savedPersonalInfo && savedPersonalInfo.skills) {
      setSkills(savedPersonalInfo.skills);
    } else {
      setSkills(defaultPersonalInfo.skills);
      // İlk kez çalıştırıldığında varsayılan verileri kaydet
      const currentPersonalInfo = storageService.getData('personalInfo') || defaultPersonalInfo;
      storageService.saveData('personalInfo', {
        ...currentPersonalInfo,
        skills: defaultPersonalInfo.skills
      });
    }
  };

  const saveSkills = (updatedSkills) => {
    const currentPersonalInfo = storageService.getData('personalInfo') || defaultPersonalInfo;
    const updatedPersonalInfo = {
      ...currentPersonalInfo,
      skills: updatedSkills
    };
    storageService.saveData('personalInfo', updatedPersonalInfo);
    setSkills(updatedSkills);
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleAddSkill = () => {
    setEditingSkill(null);
    setIsModalOpen(true);
  };

  const handleEditSkill = (skill) => {
    setEditingSkill(skill);
    setIsModalOpen(true);
  };

  const handleDeleteSkill = async (skillName) => {
    if (window.confirm('Bu yeteneği silmek istediğinizden emin misiniz?')) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const updatedSkills = skills.filter(skill => skill.name !== skillName);
        saveSkills(updatedSkills);
        showToast('Yetenek başarıyla silindi', 'success');
      } catch (error) {
        showToast('Yetenek silinirken hata oluştu', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveSkill = async (skillData) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let updatedSkills;
      if (editingSkill) {
        // Update existing skill
        updatedSkills = skills.map(skill => 
          skill.name === editingSkill.name ? { ...skill, ...skillData } : skill
        );
        showToast('Yetenek başarıyla güncellendi', 'success');
      } else {
        // Add new skill
        const newSkill = {
          ...skillData,
          name: skillData.name.trim()
        };
        updatedSkills = [...skills, newSkill];
        showToast('Yetenek başarıyla eklendi', 'success');
      }
      
      saveSkills(updatedSkills);
      setIsModalOpen(false);
    } catch (error) {
      showToast('Yetenek kaydedilirken hata oluştu', 'error');
    } finally {
      setIsLoading(false);
    }
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
                  Yetenek Yönetimi
                </h1>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {skills.length} yetenek
                </span>
              </div>
              <button
                onClick={handleAddSkill}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Yeni Yetenek</span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {skill.name}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditSkill(skill)}
                        className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
                        title="Düzenle"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill.name)}
                        className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Seviye
                      </span>
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-600 to-secondary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Son güncelleme: Az önce
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {skills.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Henüz yetenek eklenmemiş
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                İlk yeteneğinizi eklemek için "Yeni Yetenek" butonuna tıklayın.
              </p>
            </motion.div>
          )}
        </div>

        {/* Skill Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <SkillModal
              skill={editingSkill}
              onSave={handleSaveSkill}
              onClose={() => setIsModalOpen(false)}
              isLoading={isLoading}
            />
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
};

// Skill Modal Component
const SkillModal = ({ skill, onSave, onClose, isLoading }) => {
  const [formData, setFormData] = useState({
    name: skill?.name || '',
    level: skill?.level || 50
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    const errors = [];
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          errors.push('Yetenek adı gereklidir');
        } else if (value.trim().length < 2) {
          errors.push('Yetenek adı en az 2 karakter olmalıdır');
        } else if (value.trim().length > 50) {
          errors.push('Yetenek adı en fazla 50 karakter olabilir');
        }
        break;
        
      case 'level':
        if (value < 0 || value > 100) {
          errors.push('Seviye 0-100 arasında olmalıdır');
        }
        break;
        
      default:
        break;
    }
    
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = name === 'level' ? parseInt(value) || 0 : sanitizeInput.preventXSS(value);
    
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
            {skill ? 'Yetenek Düzenle' : 'Yeni Yetenek Ekle'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Skill Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Yetenek Adı
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('name')}
                  className={`input-field pr-10 ${
                    touched.name && errors.name?.length > 0 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : touched.name && !errors.name?.length 
                        ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                        : ''
                  }`}
                  required
                />
                {touched.name && errors.name?.length > 0 && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                )}
                {touched.name && !errors.name?.length && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              {touched.name && errors.name?.length > 0 && (
                <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.name.map((error, index) => (
                    <div key={index} className="flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {error}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Skill Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seviye: {formData.level}%
              </label>
              <div className="relative">
                <input
                  type="range"
                  name="level"
                  min="0"
                  max="100"
                  value={formData.level}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('level')}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
              {touched.level && errors.level?.length > 0 && (
                <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.level.map((error, index) => (
                    <div key={index} className="flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {error}
                    </div>
                  ))}
                </div>
              )}
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
                    <span>{skill ? 'Güncelle' : 'Ekle'}</span>
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

export default AdminSkills; 