import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Save, Eye, User, Mail, Phone, MapPin, Github, Linkedin, Twitter, Instagram } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dataManager } from '../../utils/dataManager';
import { useToast } from '../../contexts/ToastContext';

const AdminHomepage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [personalInfo, setPersonalInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    const loadData = () => {
      const data = dataManager.getPersonalInfo();
      setPersonalInfo(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleSave = () => {
    try {
      dataManager.updatePersonalInfo(personalInfo);
      setIsEditing(false);
      showToast('Bilgiler başarıyla güncellendi!', 'success');
    } catch (error) {
      showToast('Güncelleme sırasında hata oluştu!', 'error');
    }
  };

  const handleInputChange = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleStatsChange = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [field]: parseInt(value) || 0
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'hero', name: 'Hero Bölümü', icon: Home },
    { id: 'about', name: 'Hakkımda', icon: User },
    { id: 'contact', name: 'İletişim', icon: Mail },
    { id: 'stats', name: 'İstatistikler', icon: Home }
  ];

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
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Home className="w-6 h-6 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Ana Sayfa Yönetimi
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  isEditing 
                    ? 'bg-gray-600 text-white hover:bg-gray-700' 
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {isEditing ? 'Düzenlemeyi Durdur' : 'Düzenle'}
              </button>
              {isEditing && (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Kaydet</span>
                </button>
              )}
            </div>
          </div>

          {/* Profile Image Preview */}
          <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <User className="w-5 h-5 text-primary-600" />
              <span>Profil Fotoğrafı</span>
            </h3>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
                  <img
                    src="/images/profile.jpg"
                    alt="Profil Fotoğrafı"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-2xl font-bold" style={{ display: 'none' }}>
                    M
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-700"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Profil fotoğrafınızı değiştirmek için <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">public/images/profile.jpg</code> dosyasını güncelleyin.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Önerilen boyut: 400x400 piksel veya daha büyük, JPG formatında
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Edit Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                İçerik Düzenleme
              </h2>

              {activeTab === 'hero' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      İsim
                    </label>
                    <input
                      type="text"
                      value={personalInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Başlık
                    </label>
                    <input
                      type="text"
                      value={personalInfo.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Alt Başlık
                    </label>
                    <textarea
                      value={personalInfo.subtitle}
                      onChange={(e) => handleInputChange('subtitle', e.target.value)}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hakkımda Metni
                    </label>
                    <textarea
                      value={personalInfo.about}
                      onChange={(e) => handleInputChange('about', e.target.value)}
                      disabled={!isEditing}
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={personalInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Konum
                    </label>
                    <input
                      type="text"
                      value={personalInfo.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-900 dark:text-white">Sosyal Medya Linkleri</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Github className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <input
                          type="url"
                          placeholder="GitHub URL"
                          value={personalInfo.socialLinks.github}
                          onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                          disabled={!isEditing}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                        />
                      </div>

                      <div className="flex items-center space-x-3">
                        <Linkedin className="w-5 h-5 text-blue-600" />
                        <input
                          type="url"
                          placeholder="LinkedIn URL"
                          value={personalInfo.socialLinks.linkedin}
                          onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                          disabled={!isEditing}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                        />
                      </div>

                      <div className="flex items-center space-x-3">
                        <Twitter className="w-5 h-5 text-blue-400" />
                        <input
                          type="url"
                          placeholder="Twitter URL"
                          value={personalInfo.socialLinks.twitter}
                          onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                          disabled={!isEditing}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                        />
                      </div>

                      <div className="flex items-center space-x-3">
                        <Instagram className="w-5 h-5 text-pink-600" />
                        <input
                          type="url"
                          placeholder="Instagram URL"
                          value={personalInfo.socialLinks.instagram}
                          onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                          disabled={!isEditing}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'stats' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tamamlanan Projeler
                      </label>
                      <input
                        type="number"
                        value={personalInfo.stats.completedProjects}
                        onChange={(e) => handleStatsChange('completedProjects', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
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
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
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
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
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
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Önizleme
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Eye className="w-4 h-4" />
                  <span>Canlı Önizleme</span>
                </div>
              </div>

              <div className="space-y-6">
                {activeTab === 'hero' && (
                  <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {personalInfo.name}
                    </h1>
                    <h2 className="text-xl text-primary-600 dark:text-primary-400 font-semibold">
                      {personalInfo.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                      {personalInfo.subtitle}
                    </p>
                  </div>
                )}

                {activeTab === 'about' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Hakkımda
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {personalInfo.about}
                    </p>
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      İletişim Bilgileri
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{personalInfo.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{personalInfo.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{personalInfo.location}</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                        Sosyal Medya
                      </h4>
                      <div className="flex space-x-4">
                        {personalInfo.socialLinks.github && (
                          <a href={personalInfo.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                            <Github className="w-6 h-6" />
                          </a>
                        )}
                        {personalInfo.socialLinks.linkedin && (
                          <a href={personalInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                            <Linkedin className="w-6 h-6" />
                          </a>
                        )}
                        {personalInfo.socialLinks.twitter && (
                          <a href={personalInfo.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
                            <Twitter className="w-6 h-6" />
                          </a>
                        )}
                        {personalInfo.socialLinks.instagram && (
                          <a href={personalInfo.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700">
                            <Instagram className="w-6 h-6" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'stats' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      İstatistikler
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                          {personalInfo.stats.completedProjects}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Tamamlanan Proje
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                          {personalInfo.stats.webAppsBuilt}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Web Uygulaması
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                          {personalInfo.stats.yearsExperience}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Yıl Deneyim
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                          {personalInfo.stats.happyClients}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Mutlu Müşteri
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminHomepage; 