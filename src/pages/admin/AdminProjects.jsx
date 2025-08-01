import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  ExternalLink,
  Github,
  Calendar,
  Tag,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { ProtectedRoute } from '../../utils/auth';
import { useToast } from '../../contexts/ToastContext';
import { storageService } from '../../services/storageService';
import { projects as defaultProjects, projectCategories } from '../../data/projects';
import { sanitizeInput } from '../../utils/validation';

const AdminProjects = () => {
  const [projectList, setProjectList] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { showToast } = useToast();

  // Local storage'dan projeleri yükle
  const loadProjects = () => {
    const savedProjects = storageService.getData('projects');
    if (savedProjects && savedProjects.length > 0) {
      setProjectList(savedProjects);
    } else {
      // İlk kez çalıştırıldığında varsayılan projeleri yükle
      setProjectList(defaultProjects);
      storageService.saveData('projects', defaultProjects);
    }
  };

  const saveProjects = (projects) => {
    storageService.saveData('projects', projects);
    setProjectList(projects);
  };

  const filterProjects = useCallback(() => {
    let filtered = projectList;

    // Kategori filtreleme
    if (selectedCategory !== 'Tümü') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Arama filtreleme
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some(tech => 
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredProjects(filtered);
  }, [projectList, selectedCategory, searchTerm]);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [filterProjects]);

  const handleAddProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const updatedProjects = projectList.filter(project => project.id !== projectId);
        saveProjects(updatedProjects);
        showToast('Proje başarıyla silindi', 'success');
      } catch (error) {
        showToast('Proje silinirken hata oluştu', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveProject = async (projectData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (editingProject) {
        // Update existing project
        const updatedProjects = projectList.map(project => 
          project.id === editingProject.id ? { ...project, ...projectData } : project
        );
        saveProjects(updatedProjects);
        showToast('Proje başarıyla güncellendi', 'success');
      } else {
        // Add new project
        const newProject = {
          ...projectData,
          id: projectList.length > 0 ? Math.max(...projectList.map(p => p.id)) + 1 : 1,
          year: new Date().getFullYear()
        };
        const updatedProjects = [...projectList, newProject];
        saveProjects(updatedProjects);
        showToast('Proje başarıyla eklendi', 'success');
      }
      
      setIsModalOpen(false);
    } catch (error) {
      showToast('Proje kaydedilirken hata oluştu', 'error');
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
                  Proje Yönetimi
                </h1>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredProjects.length} proje
                </span>
              </div>
              <button
                onClick={handleAddProject}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Yeni Proje</span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Projelerde ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {projectCategories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  {/* Project Image */}
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="flex space-x-2">
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors duration-200"
                        >
                          <ExternalLink className="w-4 h-4 text-white" />
                        </a>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors duration-200"
                        >
                          <Github className="w-4 h-4 text-white" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {project.title}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProject(project)}
                          className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 text-xs rounded-full">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Project Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Tag className="w-4 h-4" />
                        <span>{project.category}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{project.publishDate}</span>
                      </div>
                    </div>

                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="mt-3">
                        <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 text-xs rounded-full">
                          Öne Çıkan
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Proje bulunamadı
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Arama kriterlerinize uygun proje bulunamadı.
              </p>
            </motion.div>
          )}
        </div>

        {/* Project Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <ProjectModal
              project={editingProject}
              onSave={handleSaveProject}
              onClose={() => setIsModalOpen(false)}
              isLoading={isLoading}
            />
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
};

// Project Modal Component
const ProjectModal = ({ project, onSave, onClose, isLoading }) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    image: project?.image || '',
    technologies: project?.technologies || [],
    category: project?.category || 'Web Uygulaması',
    liveUrl: project?.liveUrl || '',
    githubUrl: project?.githubUrl || '',
    featured: project?.featured || false,
    publishDate: project?.publishDate || ''
  });

  const [newTech, setNewTech] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    const validationRules = {
      title: {
        required: true,
        minLength: 3,
        maxLength: 100
      },
      description: {
        required: true,
        minLength: 10,
        maxLength: 500
      },
      technologies: {
        required: true,
        minItems: 1,
        maxItems: 10
      },
      category: {
        required: true
      },
      liveUrl: {
        required: false,
        pattern: /^https?:\/\/.+/
      },
      githubUrl: {
        required: false,
        pattern: /^https?:\/\/github\.com\/.+/
      },
      publishDate: {
        required: true,
        minLength: 5,
        maxLength: 20
      }
    };

    const rules = validationRules[name];
    if (!rules) return [];

    const fieldErrors = [];

    // Required kontrolü
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0))) {
      fieldErrors.push('Bu alan zorunludur');
    }

    // Min length kontrolü
    if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      fieldErrors.push(`En az ${rules.minLength} karakter olmalıdır`);
    }

    // Max length kontrolü
    if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      fieldErrors.push(`En fazla ${rules.maxLength} karakter olmalıdır`);
    }

    // Min items kontrolü
    if (rules.minItems && Array.isArray(value) && value.length < rules.minItems) {
      fieldErrors.push(`En az ${rules.minItems} teknoloji seçilmelidir`);
    }

    // Max items kontrolü
    if (rules.maxItems && Array.isArray(value) && value.length > rules.maxItems) {
      fieldErrors.push(`En fazla ${rules.maxItems} teknoloji seçilebilir`);
    }

    // Pattern kontrolü
    if (rules.pattern && value && !rules.pattern.test(value)) {
      if (name === 'liveUrl') {
        fieldErrors.push('Geçerli bir URL giriniz (http:// veya https:// ile başlamalı)');
      } else if (name === 'githubUrl') {
        fieldErrors.push('Geçerli bir GitHub URL\'si giriniz');
      }
    }

    return fieldErrors;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const sanitizedValue = type === 'checkbox' ? checked : sanitizeInput.preventXSS(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    // Real-time validation
    if (touched[name]) {
      const fieldErrors = validateField(name, sanitizedValue);
      setErrors(prev => ({
        ...prev,
        [name]: fieldErrors
      }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const fieldErrors = validateField(name, formData[name]);
    setErrors(prev => ({
      ...prev,
      [name]: fieldErrors
    }));
  };

  const handleAddTechnology = () => {
    const sanitizedTech = sanitizeInput.preventXSS(newTech.trim());
    if (sanitizedTech && !formData.technologies.includes(sanitizedTech)) {
      const updatedTechnologies = [...formData.technologies, sanitizedTech];
      setFormData(prev => ({
        ...prev,
        technologies: updatedTechnologies
      }));
      
      // Validate technologies
      const techErrors = validateField('technologies', updatedTechnologies);
      setErrors(prev => ({
        ...prev,
        technologies: techErrors
      }));
      
      setNewTech('');
    }
  };

  const handleRemoveTechnology = (techToRemove) => {
    const updatedTechnologies = formData.technologies.filter(tech => tech !== techToRemove);
    setFormData(prev => ({
      ...prev,
      technologies: updatedTechnologies
    }));

    // Validate technologies
    const techErrors = validateField('technologies', updatedTechnologies);
    setErrors(prev => ({
      ...prev,
      technologies: techErrors
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(fieldName => {
      const fieldErrors = validateField(fieldName, formData[fieldName]);
      if (fieldErrors.length > 0) {
        newErrors[fieldName] = fieldErrors;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (validateForm()) {
      onSave(formData);
    }
  };

  const hasErrors = Object.keys(errors).some(key => errors[key].length > 0);

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
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {project ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Proje Adı
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                onBlur={() => handleBlur('title')}
                className="input-field"
                required
              />
              {touched.title && errors.title && errors.title.length > 0 && (
                <p className="text-red-500 text-xs mt-1">{errors.title[0]}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Açıklama
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                onBlur={() => handleBlur('description')}
                rows={4}
                className="input-field"
                required
              />
              {touched.description && errors.description && errors.description.length > 0 && (
                <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>
              )}
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Resim URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                onBlur={() => handleBlur('image')}
                className="input-field"
                placeholder="https://example.com/image.jpg"
              />
              {touched.image && errors.image && errors.image.length > 0 && (
                <p className="text-red-500 text-xs mt-1">{errors.image[0]}</p>
              )}
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Teknolojiler
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  className="flex-1 input-field"
                  placeholder="Yeni teknoloji ekle"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
                />
                <button
                  type="button"
                  onClick={handleAddTechnology}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Ekle
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 rounded-full text-sm flex items-center space-x-1"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTechnology(tech)}
                      className="ml-1 hover:text-primary-900 dark:hover:text-primary-100"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              {touched.technologies && errors.technologies && errors.technologies.length > 0 && (
                <p className="text-red-500 text-xs mt-1">{errors.technologies[0]}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kategori
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                onBlur={() => handleBlur('category')}
                className="input-field"
              >
                {projectCategories.filter(cat => cat !== 'Tümü').map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {touched.category && errors.category && errors.category.length > 0 && (
                <p className="text-red-500 text-xs mt-1">{errors.category[0]}</p>
              )}
            </div>

            {/* Publish Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Yayın Tarihi
              </label>
              <input
                type="text"
                name="publishDate"
                value={formData.publishDate}
                onChange={handleInputChange}
                onBlur={() => handleBlur('publishDate')}
                className="input-field"
                placeholder="15 Ocak 2024"
              />
              {touched.publishDate && errors.publishDate && errors.publishDate.length > 0 && (
                <p className="text-red-500 text-xs mt-1">{errors.publishDate[0]}</p>
              )}
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Canlı Demo URL
                </label>
                <input
                  type="url"
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('liveUrl')}
                  className="input-field"
                  placeholder="https://example.com"
                />
                {touched.liveUrl && errors.liveUrl && errors.liveUrl.length > 0 && (
                  <p className="text-red-500 text-xs mt-1">{errors.liveUrl[0]}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('githubUrl')}
                  className="input-field"
                  placeholder="https://github.com/user/repo"
                />
                {touched.githubUrl && errors.githubUrl && errors.githubUrl.length > 0 && (
                  <p className="text-red-500 text-xs mt-1">{errors.githubUrl[0]}</p>
                )}
              </div>
            </div>

            {/* Featured */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Öne çıkan proje olarak işaretle
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={isLoading || hasErrors}
                className={`px-6 py-2 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                  isLoading || hasErrors
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="spinner w-4 h-4"></div>
                    <span>Kaydediliyor...</span>
                  </>
                ) : hasErrors ? (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    <span>Hataları Düzeltin</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>{project ? 'Güncelle' : 'Kaydet'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Validation Summary */}
            {hasErrors && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                  Lütfen aşağıdaki hataları düzeltin:
                </h4>
                <ul className="text-xs text-red-700 dark:text-red-300 space-y-1">
                  {Object.keys(errors).map(fieldName => 
                    errors[fieldName].map((error, index) => (
                      <li key={`${fieldName}-${index}`} className="flex items-center space-x-1">
                        <span>•</span>
                        <span className="capitalize">{fieldName}:</span>
                        <span>{error}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminProjects; 