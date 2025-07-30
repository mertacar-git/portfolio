import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  Download, 
  Upload,
  Globe,
  User
} from 'lucide-react';
import { ProtectedRoute } from '../../utils/auth';
import { useToast } from '../../contexts/ToastContext';
import { storageService } from '../../services/storageService';
import { personalInfo as defaultPersonalInfo } from '../../data/personalInfo';
import { siteConfig as defaultSiteConfig } from '../../data/siteConfig';
import { backupService } from '../../services/storageService';

const AdminSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const { showToast } = useToast();

  const [personalData, setPersonalData] = useState({
    name: '',
    title: '',
    subtitle: '',
    email: '',
    phone: '',
    location: '',
    about: '',
    aboutFormat: {
      fontSize: 'lg',
      lineHeight: 'relaxed',
      textAlign: 'center',
      maxWidth: '3xl',
      fontWeight: 'normal',
      letterSpacing: 'normal',
      paragraphSpacing: '6',
      textColor: 'gray-600',
      darkTextColor: 'gray-300'
    }
  });

  const [siteData, setSiteData] = useState({
    title: '',
    description: '',
    url: '',
    themeColor: '#3B82F6',
    keywords: ''
  });

  // Local storage'dan verileri yükle
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    // Kişisel bilgileri yükle
    const savedPersonalInfo = storageService.getData('personalInfo');
    if (savedPersonalInfo) {
      setPersonalData(savedPersonalInfo);
    } else {
      setPersonalData({
        name: defaultPersonalInfo.name,
        title: defaultPersonalInfo.title,
        subtitle: defaultPersonalInfo.subtitle,
        email: defaultPersonalInfo.email,
        phone: defaultPersonalInfo.phone,
        location: defaultPersonalInfo.location,
        about: defaultPersonalInfo.about,
        aboutFormat: defaultPersonalInfo.aboutFormat
      });
      storageService.saveData('personalInfo', {
        name: defaultPersonalInfo.name,
        title: defaultPersonalInfo.title,
        subtitle: defaultPersonalInfo.subtitle,
        email: defaultPersonalInfo.email,
        phone: defaultPersonalInfo.phone,
        location: defaultPersonalInfo.location,
        about: defaultPersonalInfo.about,
        aboutFormat: defaultPersonalInfo.aboutFormat
      });
    }

    // Site ayarlarını yükle
    const savedSiteConfig = storageService.getData('siteConfig');
    if (savedSiteConfig) {
      setSiteData({
        title: savedSiteConfig.site.title,
        description: savedSiteConfig.site.description,
        url: savedSiteConfig.site.url,
        themeColor: savedSiteConfig.site.themeColor,
        keywords: savedSiteConfig.site.keywords.join(', ')
      });
    } else {
      setSiteData({
        title: defaultSiteConfig.site.title,
        description: defaultSiteConfig.site.description,
        url: defaultSiteConfig.site.url,
        themeColor: defaultSiteConfig.site.themeColor,
        keywords: defaultSiteConfig.site.keywords.join(', ')
      });
      storageService.saveData('siteConfig', defaultSiteConfig);
    }
  };

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAboutFormatChange = (field, value) => {
    setPersonalData(prev => ({
      ...prev,
      aboutFormat: {
        ...prev.aboutFormat,
        [field]: value
      }
    }));
  };

  const handleSiteChange = (e) => {
    const { name, value } = e.target;
    setSiteData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSavePersonal = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      storageService.saveData('personalInfo', personalData);
      showToast('Kişisel bilgiler başarıyla güncellendi', 'success');
    } catch (error) {
      showToast('Güncelleme sırasında hata oluştu', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSite = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const updatedSiteConfig = {
        site: {
          title: siteData.title,
          description: siteData.description,
          url: siteData.url,
          themeColor: siteData.themeColor,
          keywords: siteData.keywords.split(',').map(k => k.trim()).filter(k => k)
        }
      };
      storageService.saveData('siteConfig', updatedSiteConfig);
      showToast('Site ayarları başarıyla güncellendi', 'success');
    } catch (error) {
      showToast('Güncelleme sırasında hata oluştu', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    try {
      backupService.exportData();
      showToast('Veriler başarıyla dışa aktarıldı', 'success');
    } catch (error) {
      showToast('Veri dışa aktarma hatası', 'error');
    }
  };

  const handleImportData = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await backupService.importData(file);
        showToast('Veriler başarıyla içe aktarıldı', 'success');
        // Sayfayı yenile
        window.location.reload();
      } catch (error) {
        showToast('Dosya formatı geçersiz', 'error');
      }
    }
  };

  const tabs = [
    { id: 'personal', name: 'Kişisel Bilgiler', icon: User },
    { id: 'site', name: 'Site Ayarları', icon: Globe },
    { id: 'backup', name: 'Yedekleme', icon: Download }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Site Ayarları
                </h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'personal' && (
                  <motion.div
                    key="personal"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                      Kişisel Bilgiler
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Ad Soyad
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={personalData.name}
                          onChange={handlePersonalChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Unvan
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={personalData.title}
                          onChange={handlePersonalChange}
                          className="input-field"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Alt Başlık
                        </label>
                        <input
                          type="text"
                          name="subtitle"
                          value={personalData.subtitle}
                          onChange={handlePersonalChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={personalData.email}
                          onChange={handlePersonalChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Telefon
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={personalData.phone}
                          onChange={handlePersonalChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Konum
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={personalData.location}
                          onChange={handlePersonalChange}
                          className="input-field"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Hakkımda
                        </label>
                        <textarea
                          name="about"
                          value={personalData.about}
                          onChange={handlePersonalChange}
                          rows={4}
                          className="input-field"
                        />
                      </div>

                      {/* Hakkımda Format Seçenekleri */}
                      <div className="md:col-span-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                          Hakkımda Yazısı Format Ayarları
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          {/* Font Boyutu */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Font Boyutu
                            </label>
                            <select
                              value={personalData.aboutFormat?.fontSize || 'lg'}
                              onChange={(e) => handleAboutFormatChange('fontSize', e.target.value)}
                              className="input-field"
                            >
                              <option value="xs">Çok Küçük (xs)</option>
                              <option value="sm">Küçük (sm)</option>
                              <option value="base">Normal (base)</option>
                              <option value="lg">Büyük (lg)</option>
                              <option value="xl">Çok Büyük (xl)</option>
                              <option value="2xl">2x Büyük (2xl)</option>
                              <option value="3xl">3x Büyük (3xl)</option>
                            </select>
                          </div>

                          {/* Satır Yüksekliği */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Satır Yüksekliği
                            </label>
                            <select
                              value={personalData.aboutFormat?.lineHeight || 'relaxed'}
                              onChange={(e) => handleAboutFormatChange('lineHeight', e.target.value)}
                              className="input-field"
                            >
                              <option value="tight">Sıkı (tight)</option>
                              <option value="normal">Normal (normal)</option>
                              <option value="relaxed">Rahat (relaxed)</option>
                              <option value="loose">Gevşek (loose)</option>
                            </select>
                          </div>

                          {/* Metin Hizalama */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Metin Hizalama
                            </label>
                            <select
                              value={personalData.aboutFormat?.textAlign || 'center'}
                              onChange={(e) => handleAboutFormatChange('textAlign', e.target.value)}
                              className="input-field"
                            >
                              <option value="left">Sola (left)</option>
                              <option value="center">Ortaya (center)</option>
                              <option value="right">Sağa (right)</option>
                              <option value="justify">İki Yana (justify)</option>
                            </select>
                          </div>

                          {/* Maksimum Genişlik */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Maksimum Genişlik
                            </label>
                            <select
                              value={personalData.aboutFormat?.maxWidth || '3xl'}
                              onChange={(e) => handleAboutFormatChange('maxWidth', e.target.value)}
                              className="input-field"
                            >
                              <option value="sm">Küçük (sm)</option>
                              <option value="md">Orta (md)</option>
                              <option value="lg">Büyük (lg)</option>
                              <option value="xl">Çok Büyük (xl)</option>
                              <option value="2xl">2x Büyük (2xl)</option>
                              <option value="3xl">3x Büyük (3xl)</option>
                              <option value="4xl">4x Büyük (4xl)</option>
                              <option value="5xl">5x Büyük (5xl)</option>
                              <option value="6xl">6x Büyük (6xl)</option>
                              <option value="7xl">7x Büyük (7xl)</option>
                            </select>
                          </div>

                          {/* Font Kalınlığı */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Font Kalınlığı
                            </label>
                            <select
                              value={personalData.aboutFormat?.fontWeight || 'normal'}
                              onChange={(e) => handleAboutFormatChange('fontWeight', e.target.value)}
                              className="input-field"
                            >
                              <option value="light">İnce (light)</option>
                              <option value="normal">Normal (normal)</option>
                              <option value="medium">Orta (medium)</option>
                              <option value="semibold">Yarı Kalın (semibold)</option>
                              <option value="bold">Kalın (bold)</option>
                            </select>
                          </div>

                          {/* Harf Aralığı */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Harf Aralığı
                            </label>
                            <select
                              value={personalData.aboutFormat?.letterSpacing || 'normal'}
                              onChange={(e) => handleAboutFormatChange('letterSpacing', e.target.value)}
                              className="input-field"
                            >
                              <option value="tight">Sıkı (tight)</option>
                              <option value="normal">Normal (normal)</option>
                              <option value="wide">Geniş (wide)</option>
                            </select>
                          </div>

                          {/* Paragraf Aralığı */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Paragraf Aralığı
                            </label>
                            <select
                              value={personalData.aboutFormat?.paragraphSpacing || '6'}
                              onChange={(e) => handleAboutFormatChange('paragraphSpacing', e.target.value)}
                              className="input-field"
                            >
                              <option value="2">Çok Az (2)</option>
                              <option value="3">Az (3)</option>
                              <option value="4">Orta Az (4)</option>
                              <option value="5">Orta (5)</option>
                              <option value="6">Orta Çok (6)</option>
                              <option value="8">Çok (8)</option>
                              <option value="10">Çok Fazla (10)</option>
                              <option value="12">En Fazla (12)</option>
                            </select>
                          </div>

                          {/* Açık Tema Renk */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Açık Tema Renk
                            </label>
                            <select
                              value={personalData.aboutFormat?.textColor || 'gray-600'}
                              onChange={(e) => handleAboutFormatChange('textColor', e.target.value)}
                              className="input-field"
                            >
                              <option value="gray-500">Gri Açık (gray-500)</option>
                              <option value="gray-600">Gri Orta (gray-600)</option>
                              <option value="gray-700">Gri Koyu (gray-700)</option>
                              <option value="gray-800">Gri Çok Koyu (gray-800)</option>
                              <option value="gray-900">Gri En Koyu (gray-900)</option>
                            </select>
                          </div>

                          {/* Koyu Tema Renk */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Koyu Tema Renk
                            </label>
                            <select
                              value={personalData.aboutFormat?.darkTextColor || 'gray-300'}
                              onChange={(e) => handleAboutFormatChange('darkTextColor', e.target.value)}
                              className="input-field"
                            >
                              <option value="gray-200">Gri Çok Açık (gray-200)</option>
                              <option value="gray-300">Gri Açık (gray-300)</option>
                              <option value="gray-400">Gri Orta (gray-400)</option>
                              <option value="gray-500">Gri Koyu (gray-500)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={handleSavePersonal}
                        disabled={isLoading}
                        className="btn-primary inline-flex items-center space-x-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="spinner"></div>
                            <span>Kaydediliyor...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            <span>Kaydet</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'site' && (
                  <motion.div
                    key="site"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                      Site Ayarları
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Site Başlığı
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={siteData.title}
                          onChange={handleSiteChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Site URL
                        </label>
                        <input
                          type="url"
                          name="url"
                          value={siteData.url}
                          onChange={handleSiteChange}
                          className="input-field"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Site Açıklaması
                        </label>
                        <textarea
                          name="description"
                          value={siteData.description}
                          onChange={handleSiteChange}
                          rows={3}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tema Rengi
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            name="themeColor"
                            value={siteData.themeColor}
                            onChange={handleSiteChange}
                            className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-lg"
                          />
                          <input
                            type="text"
                            name="themeColor"
                            value={siteData.themeColor}
                            onChange={handleSiteChange}
                            className="flex-1 input-field"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Anahtar Kelimeler
                        </label>
                        <input
                          type="text"
                          name="keywords"
                          value={siteData.keywords}
                          onChange={handleSiteChange}
                          className="input-field"
                          placeholder="Virgülle ayırarak yazın"
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={handleSaveSite}
                        disabled={isLoading}
                        className="btn-primary inline-flex items-center space-x-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="spinner"></div>
                            <span>Kaydediliyor...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            <span>Kaydet</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'backup' && (
                  <motion.div
                    key="backup"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                      Veri Yedekleme
                    </h2>
                    <div className="space-y-6">
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                          Veri Dışa Aktarma
                        </h3>
                        <p className="text-blue-700 dark:text-blue-300 mb-4">
                          Tüm site verilerinizi JSON formatında dışa aktarın.
                        </p>
                        <button
                          onClick={handleExportData}
                          className="btn-primary inline-flex items-center space-x-2"
                        >
                          <Download className="w-5 h-5" />
                          <span>Verileri Dışa Aktar</span>
                        </button>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-green-900 dark:text-green-100 mb-2">
                          Veri İçe Aktarma
                        </h3>
                        <p className="text-green-700 dark:text-green-300 mb-4">
                          Daha önce dışa aktardığınız verileri geri yükleyin.
                        </p>
                        <div className="flex items-center space-x-4">
                          <input
                            type="file"
                            accept=".json"
                            onChange={handleImportData}
                            className="hidden"
                            id="import-file"
                          />
                          <label
                            htmlFor="import-file"
                            className="btn-secondary inline-flex items-center space-x-2 cursor-pointer"
                          >
                            <Upload className="w-5 h-5" />
                            <span>Dosya Seç</span>
                          </label>
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                          Otomatik Yedekleme
                        </h3>
                        <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                          Otomatik yedekleme ayarlarını yapılandırın.
                        </p>
                        <div className="flex items-center space-x-4">
                          <select className="input-field w-auto">
                            <option value="daily">Günlük</option>
                            <option value="weekly">Haftalık</option>
                            <option value="monthly">Aylık</option>
                          </select>
                          <button className="btn-outline">
                            <span>Yedekleme Ayarla</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminSettings; 