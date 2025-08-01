import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  User, 
  Code, 
  Award, 
  GraduationCap, 
  Briefcase, 
  Users, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Eye,
  TrendingUp
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { personalInfo as defaultPersonalInfo } from '../../data/personalInfo';

const AdminHomepage = () => {
  const [personalInfo, setPersonalInfo] = useState(defaultPersonalInfo);
  const [activeSection, setActiveSection] = useState('hero');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    loadPersonalInfo();
  }, []);

  const loadPersonalInfo = () => {
    const savedPersonalInfo = storageService.getData('personalInfo');
    if (savedPersonalInfo) {
      setPersonalInfo(savedPersonalInfo);
    } else {
      setPersonalInfo(defaultPersonalInfo);
      storageService.saveData('personalInfo', defaultPersonalInfo);
    }
  };

  const savePersonalInfo = (newData) => {
    const updatedInfo = { ...personalInfo, ...newData };
    setPersonalInfo(updatedInfo);
    storageService.saveData('personalInfo', updatedInfo);
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setFormData(item ? { ...item } : getDefaultFormData(type));
    setErrors({});
    setTouched({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType('');
    setEditingItem(null);
    setFormData({});
    setErrors({});
    setTouched({});
  };

  const getDefaultFormData = (type) => {
    switch (type) {
      case 'skill':
        return { name: '', level: 50 };
      case 'achievement':
        return { name: '', value: 0 };
      case 'education':
        return { degree: '', school: '', year: '', description: '' };
      case 'experience':
        return { title: '', company: '', period: '', description: '' };
      case 'certification':
        return { name: '', issuer: '', year: '', description: '' };
      case 'reference':
        return { name: '', title: '', company: '', phone: '', email: '', description: '' };
      case 'technology':
        return { category: '', technologies: [] };
      default:
        return {};
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, formData[fieldName]);
  };

  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };
    
    switch (fieldName) {
      case 'name':
      case 'title':
      case 'degree':
      case 'company':
      case 'school':
        if (!value || value.trim() === '') {
          newErrors[fieldName] = 'Bu alan zorunludur';
        } else if (value.length < 2) {
          newErrors[fieldName] = 'En az 2 karakter olmalıdır';
        } else {
          delete newErrors[fieldName];
        }
        break;
      case 'level':
        const level = parseInt(value);
        if (isNaN(level) || level < 0 || level > 100) {
          newErrors[fieldName] = '0-100 arası bir değer giriniz';
        } else {
          delete newErrors[fieldName];
        }
        break;
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[fieldName] = 'Geçerli bir email adresi giriniz';
        } else {
          delete newErrors[fieldName];
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    Object.keys(formData).forEach(field => {
      setTouched(prev => ({ ...prev, [field]: true }));
      validateField(field, formData[field]);
    });

    if (Object.keys(errors).length > 0) {
      return;
    }

    let updatedInfo = { ...personalInfo };

    switch (modalType) {
      case 'hero':
        updatedInfo = {
          ...updatedInfo,
          name: formData.name,
          title: formData.title,
          subtitle: formData.subtitle,
          about: formData.about
        };
        break;
      case 'skill':
        if (editingItem) {
          updatedInfo.skills = updatedInfo.skills.map(skill => 
            skill.name === editingItem.name ? formData : skill
          );
        } else {
          updatedInfo.skills = [...(updatedInfo.skills || []), formData];
        }
        break;
      case 'achievement':
        if (editingItem) {
          updatedInfo.stats = { ...updatedInfo.stats, [formData.name]: formData.value };
        } else {
          updatedInfo.stats = { ...updatedInfo.stats, [formData.name]: formData.value };
        }
        break;
      case 'education':
        if (editingItem) {
          updatedInfo.education = updatedInfo.education.map(edu => 
            edu === editingItem ? formData : edu
          );
        } else {
          updatedInfo.education = [...(updatedInfo.education || []), formData];
        }
        break;
      case 'experience':
        if (editingItem) {
          updatedInfo.experience = updatedInfo.experience.map(exp => 
            exp === editingItem ? formData : exp
          );
        } else {
          updatedInfo.experience = [...(updatedInfo.experience || []), formData];
        }
        break;
      case 'certification':
        if (editingItem) {
          updatedInfo.certifications = updatedInfo.certifications.map(cert => 
            cert === editingItem ? formData : cert
          );
        } else {
          updatedInfo.certifications = [...(updatedInfo.certifications || []), formData];
        }
        break;
      case 'reference':
        if (editingItem) {
          updatedInfo.references = updatedInfo.references.map(ref => 
            ref === editingItem ? formData : ref
          );
        } else {
          updatedInfo.references = [...(updatedInfo.references || []), formData];
        }
        break;
      case 'technology':
        if (editingItem) {
          updatedInfo.technologies = { ...updatedInfo.technologies, [formData.category]: formData.technologies };
        } else {
          updatedInfo.technologies = { ...updatedInfo.technologies, [formData.category]: formData.technologies };
        }
        break;
      default:
        break;
    }

    savePersonalInfo(updatedInfo);
    closeModal();
  };

  const deleteItem = (type, item) => {
    let updatedInfo = { ...personalInfo };

    switch (type) {
      case 'skill':
        updatedInfo.skills = updatedInfo.skills.filter(skill => skill.name !== item.name);
        break;
      case 'education':
        updatedInfo.education = updatedInfo.education.filter(edu => edu !== item);
        break;
      case 'experience':
        updatedInfo.experience = updatedInfo.experience.filter(exp => exp !== item);
        break;
      case 'certification':
        updatedInfo.certifications = updatedInfo.certifications.filter(cert => cert !== item);
        break;
      case 'reference':
        updatedInfo.references = updatedInfo.references.filter(ref => ref !== item);
        break;
      case 'technology':
        const { [item.category]: removed, ...rest } = updatedInfo.technologies;
        updatedInfo.technologies = rest;
        break;
      default:
        break;
    }

    savePersonalInfo(updatedInfo);
  };

  const sections = [
    { id: 'hero', name: 'Ana Sayfa', icon: Home },
    { id: 'skills', name: 'Yetenekler', icon: Code },
    { id: 'achievements', name: 'Başarılar', icon: Award },
    { id: 'education', name: 'Eğitim', icon: GraduationCap },
    { id: 'experience', name: 'İş Deneyimi', icon: Briefcase },
    { id: 'certifications', name: 'Sertifikalar', icon: Award },
    { id: 'references', name: 'Referanslar', icon: Users },
    { id: 'technologies', name: 'Teknolojiler', icon: Settings }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'hero':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Ana Sayfa Bilgileri</h3>
              <button
                onClick={() => openModal('hero', personalInfo)}
                className="btn-primary"
              >
                <Edit className="w-4 h-4 mr-2" />
                Düzenle
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h4 className="text-lg font-medium mb-4">Kişisel Bilgiler</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">İsim</label>
                    <p className="text-gray-900">{personalInfo.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ünvan</label>
                    <p className="text-gray-900">{personalInfo.title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Alt Başlık</label>
                    <p className="text-gray-900">{personalInfo.subtitle}</p>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h4 className="text-lg font-medium mb-4">Hakkımda</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {personalInfo.about}
                </p>
              </div>
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Yetenekler</h3>
              <button
                onClick={() => openModal('skill')}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Yetenek
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {personalInfo.skills?.map((skill, index) => (
                <div key={index} className="card">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">{skill.name}</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal('skill', skill)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteItem('skill', skill)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary-600 to-secondary-600 h-2 rounded-full"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{skill.level}%</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Başarılar</h3>
              <button
                onClick={() => openModal('achievement')}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Başarı
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(personalInfo.stats || {}).map(([key, value]) => (
                <div key={key} className="card text-center">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <button
                      onClick={() => openModal('achievement', { name: key, value })}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-2xl font-bold text-primary-600">{value}+</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Eğitim</h3>
              <button
                onClick={() => openModal('education')}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Eğitim
              </button>
            </div>
            
            <div className="space-y-4">
              {personalInfo.education?.map((edu, index) => (
                <div key={index} className="card">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{edu.degree}</h4>
                      <p className="text-primary-600">{edu.school}</p>
                      <p className="text-sm text-gray-600">{edu.year}</p>
                      <p className="text-sm text-gray-700 mt-2">{edu.description}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => openModal('education', edu)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteItem('education', edu)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">İş Deneyimi</h3>
              <button
                onClick={() => openModal('experience')}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Deneyim
              </button>
            </div>
            
            <div className="space-y-4">
              {personalInfo.experience?.map((exp, index) => (
                <div key={index} className="card">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{exp.title}</h4>
                      <p className="text-primary-600">{exp.company}</p>
                      <p className="text-sm text-gray-600">{exp.period}</p>
                      <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => openModal('experience', exp)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteItem('experience', exp)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'certifications':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Sertifikalar</h3>
              <button
                onClick={() => openModal('certification')}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Sertifika
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalInfo.certifications?.map((cert, index) => (
                <div key={index} className="card">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{cert.name}</h4>
                      <p className="text-primary-600">{cert.issuer}</p>
                      <p className="text-sm text-gray-600">{cert.year}</p>
                      <p className="text-sm text-gray-700 mt-2">{cert.description}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => openModal('certification', cert)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteItem('certification', cert)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'references':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Referanslar</h3>
              <button
                onClick={() => openModal('reference')}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Referans
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalInfo.references?.map((ref, index) => (
                <div key={index} className="card">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{ref.name}</h4>
                      <p className="text-primary-600">{ref.title}</p>
                      <p className="text-sm text-gray-600">{ref.company}</p>
                      <p className="text-sm text-gray-700 mt-2">{ref.description}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-gray-600">{ref.phone}</p>
                        <p className="text-xs text-gray-600">{ref.email}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => openModal('reference', ref)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteItem('reference', ref)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'technologies':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Teknolojiler</h3>
              <button
                onClick={() => openModal('technology')}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Kategori
              </button>
            </div>
            
            <div className="space-y-4">
              {Object.entries(personalInfo.technologies || {}).map(([category, techs]) => (
                <div key={category} className="card">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium capitalize mb-3">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {techs.map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => openModal('technology', { category, technologies: techs })}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteItem('technology', { category })}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderModal = () => {
    if (!isModalOpen) return null;

    const getModalTitle = () => {
      switch (modalType) {
        case 'hero': return 'Ana Sayfa Bilgilerini Düzenle';
        case 'skill': return editingItem ? 'Yetenek Düzenle' : 'Yeni Yetenek Ekle';
        case 'achievement': return editingItem ? 'Başarı Düzenle' : 'Yeni Başarı Ekle';
        case 'education': return editingItem ? 'Eğitim Düzenle' : 'Yeni Eğitim Ekle';
        case 'experience': return editingItem ? 'Deneyim Düzenle' : 'Yeni Deneyim Ekle';
        case 'certification': return editingItem ? 'Sertifika Düzenle' : 'Yeni Sertifika Ekle';
        case 'reference': return editingItem ? 'Referans Düzenle' : 'Yeni Referans Ekle';
        case 'technology': return editingItem ? 'Teknoloji Kategorisi Düzenle' : 'Yeni Teknoloji Kategorisi Ekle';
        default: return 'Düzenle';
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{getModalTitle()}</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {modalType === 'hero' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İsim
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('name')}
                    className="input-field"
                    placeholder="Mert Açar"
                  />
                  {touched.name && errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ünvan
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('title')}
                    className="input-field"
                    placeholder="Full Stack Developer"
                  />
                  {touched.title && errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Başlık
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle || ''}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Modern web teknolojileri ile yaratıcı çözümler geliştiren Full Stack Developer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hakkımda
                  </label>
                  <textarea
                    name="about"
                    value={formData.about || ''}
                    onChange={handleInputChange}
                    rows={4}
                    className="input-field"
                    placeholder="Kendiniz hakkında kısa bir açıklama..."
                  />
                </div>
              </>
            )}

            {modalType === 'skill' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yetenek Adı
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('name')}
                    className="input-field"
                    placeholder="JavaScript"
                  />
                  {touched.name && errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seviye (%)
                  </label>
                  <input
                    type="number"
                    name="level"
                    value={formData.level || ''}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('level')}
                    className="input-field"
                    min="0"
                    max="100"
                    placeholder="75"
                  />
                  {touched.level && errors.level && (
                    <p className="text-red-500 text-xs mt-1">{errors.level}</p>
                  )}
                </div>
              </>
            )}

            {modalType === 'achievement' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başarı Adı
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('name')}
                    className="input-field"
                    placeholder="completedProjects"
                  />
                  {touched.name && errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Değer
                  </label>
                  <input
                    type="number"
                    name="value"
                    value={formData.value || ''}
                    onChange={handleInputChange}
                    className="input-field"
                    min="0"
                    placeholder="5"
                  />
                </div>
              </>
            )}

            {(modalType === 'education' || modalType === 'experience' || modalType === 'certification') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {modalType === 'education' ? 'Derece' : modalType === 'experience' ? 'Pozisyon' : 'Sertifika Adı'}
                  </label>
                  <input
                    type="text"
                    name={modalType === 'education' ? 'degree' : modalType === 'experience' ? 'title' : 'name'}
                    value={formData[modalType === 'education' ? 'degree' : modalType === 'experience' ? 'title' : 'name'] || ''}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur(modalType === 'education' ? 'degree' : modalType === 'experience' ? 'title' : 'name')}
                    className="input-field"
                    placeholder={modalType === 'education' ? 'Bilgisayar Mühendisliği' : modalType === 'experience' ? 'Full Stack Developer' : 'Web Development Certificate'}
                  />
                  {touched[modalType === 'education' ? 'degree' : modalType === 'experience' ? 'title' : 'name'] && 
                   errors[modalType === 'education' ? 'degree' : modalType === 'experience' ? 'title' : 'name'] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[modalType === 'education' ? 'degree' : modalType === 'experience' ? 'title' : 'name']}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {modalType === 'education' ? 'Okul' : modalType === 'experience' ? 'Şirket' : 'Veren Kurum'}
                  </label>
                  <input
                    type="text"
                    name={modalType === 'education' ? 'school' : modalType === 'experience' ? 'company' : 'issuer'}
                    value={formData[modalType === 'education' ? 'school' : modalType === 'experience' ? 'company' : 'issuer'] || ''}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur(modalType === 'education' ? 'school' : modalType === 'experience' ? 'company' : 'issuer')}
                    className="input-field"
                    placeholder={modalType === 'education' ? 'Üniversite' : modalType === 'experience' ? 'Şirket Adı' : 'Kurum Adı'}
                  />
                  {touched[modalType === 'education' ? 'school' : modalType === 'experience' ? 'company' : 'issuer'] && 
                   errors[modalType === 'education' ? 'school' : modalType === 'experience' ? 'company' : 'issuer'] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[modalType === 'education' ? 'school' : modalType === 'experience' ? 'company' : 'issuer']}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {modalType === 'education' ? 'Yıl' : modalType === 'experience' ? 'Dönem' : 'Yıl'}
                  </label>
                  <input
                    type="text"
                    name={modalType === 'education' ? 'year' : modalType === 'experience' ? 'period' : 'year'}
                    value={formData[modalType === 'education' ? 'year' : modalType === 'experience' ? 'period' : 'year'] || ''}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder={modalType === 'education' ? '2020-2024' : modalType === 'experience' ? '2023 - Günümüz' : '2023'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="input-field"
                    placeholder="Detaylı açıklama..."
                  />
                </div>
              </>
            )}

            {modalType === 'reference' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İsim
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('name')}
                    className="input-field"
                    placeholder="Referans İsmi"
                  />
                  {touched.name && errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pozisyon
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('title')}
                    className="input-field"
                    placeholder="Pozisyon"
                  />
                  {touched.title && errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şirket
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company || ''}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('company')}
                    className="input-field"
                    placeholder="Şirket Adı"
                  />
                  {touched.company && errors.company && (
                    <p className="text-red-500 text-xs mt-1">{errors.company}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="+90 555 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('email')}
                    className="input-field"
                    placeholder="referans@email.com"
                  />
                  {touched.email && errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="input-field"
                    placeholder="Referans açıklaması..."
                  />
                </div>
              </>
            )}

            {modalType === 'technology' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori Adı
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category || ''}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('category')}
                    className="input-field"
                    placeholder="programmingLanguages"
                  />
                  {touched.category && errors.category && (
                    <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teknolojiler (virgülle ayırın)
                  </label>
                  <textarea
                    name="technologies"
                    value={Array.isArray(formData.technologies) ? formData.technologies.join(', ') : ''}
                    onChange={(e) => {
                      const techs = e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech);
                      setFormData(prev => ({ ...prev, technologies: techs }));
                    }}
                    rows={3}
                    className="input-field"
                    placeholder="JavaScript, TypeScript, Python, Java"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="btn-outline"
              >
                İptal
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                <Save className="w-4 h-4 mr-2" />
                Kaydet
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-max py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Ana Sayfa Yönetimi
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Ana sayfa içeriklerini düzenleyin ve yönetin
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Bölümler
                </h3>
              </div>
              <nav className="p-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                        activeSection === section.id
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{section.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                {renderSection()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {renderModal()}
    </div>
  );
};

export default AdminHomepage; 