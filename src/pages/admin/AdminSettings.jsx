import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  ArrowLeft, 
  Save, 
  Download, 
  Upload, 
  Trash2, 
  Eye,
  EyeOff,
  Palette,
  Globe,
  Shield,
  Database,
  RefreshCw,
  Check,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dataManager, userPreferences } from '../../utils/dataManager';
import { useToast } from '../../contexts/ToastContext';

const AdminSettings = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [siteConfig, setSiteConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const config = dataManager.getSiteConfig();
    setSiteConfig(config);
    setIsLoading(false);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      dataManager.updateSiteConfig(siteConfig);
      showToast('Ayarlar başarıyla kaydedildi!', 'success');
    } catch (error) {
      showToast('Kaydetme sırasında hata oluştu!', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = () => {
    try {
      const data = dataManager.exportAllData();
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `website-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      showToast('Veriler başarıyla dışa aktarıldı!', 'success');
    } catch (error) {
      showToast('Dışa aktarma sırasında hata oluştu!', 'error');
    }
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        dataManager.importAllData(data);
        loadSettings();
        showToast('Veriler başarıyla içe aktarıldı!', 'success');
      } catch (error) {
        showToast('Dosya formatı geçersiz!', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleResetSettings = () => {
    if (window.confirm('Tüm ayarları sıfırlamak istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      try {
        localStorage.clear();
        loadSettings();
        showToast('Ayarlar sıfırlandı!', 'success');
      } catch (error) {
        showToast('Sıfırlama sırasında hata oluştu!', 'error');
      }
    }
  };

  const handleThemeChange = (theme) => {
    userPreferences.setTheme(theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    showToast('Tema değiştirildi!', 'success');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', name: 'Genel', icon: Settings },
    { id: 'appearance', name: 'Görünüm', icon: Palette },
    { id: 'security', name: 'Güvenlik', icon: Shield },
    { id: 'backup', name: 'Yedekleme', icon: Database }
  ];

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
                <div className="p-2 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
                  <Settings className="w-6 h-6 text-gray-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Sistem Ayarları
                </h1>
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isSaving ? 'Kaydediliyor...' : 'Kaydet'}</span>
            </button>
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Genel Ayarlar
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Site Başlığı
                    </label>
                    <input
                      type="text"
                      value={siteConfig?.siteTitle || 'Mert Açar - Portfolio'}
                      onChange={(e) => setSiteConfig(prev => ({ ...prev, siteTitle: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Site Açıklaması
                    </label>
                    <input
                      type="text"
                      value={siteConfig?.siteDescription || 'Full Stack Developer Portfolio'}
                      onChange={(e) => setSiteConfig(prev => ({ ...prev, siteDescription: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Site URL
                    </label>
                    <input
                      type="url"
                      value={siteConfig?.siteUrl || 'https://mertacar.com'}
                      onChange={(e) => setSiteConfig(prev => ({ ...prev, siteUrl: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      İletişim Email
                    </label>
                    <input
                      type="email"
                      value={siteConfig?.contactEmail || 'mertacar011@gmail.com'}
                      onChange={(e) => setSiteConfig(prev => ({ ...prev, contactEmail: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Anahtar Kelimeler
                  </label>
                  <textarea
                    value={siteConfig?.keywords || 'portfolio, developer, web, react, javascript'}
                    onChange={(e) => setSiteConfig(prev => ({ ...prev, keywords: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Virgülle ayırarak anahtar kelimeleri girin"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="maintenanceMode"
                    checked={siteConfig?.maintenanceMode || false}
                    onChange={(e) => setSiteConfig(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="maintenanceMode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bakım Modu
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Görünüm Ayarları
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Tema Seçimi
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => handleThemeChange('light')}
                      className={`p-4 border-2 rounded-lg text-center transition-colors duration-200 ${
                        userPreferences.getTheme() === 'light'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="w-full h-20 bg-white border border-gray-200 rounded mb-2"></div>
                      <span className="font-medium text-gray-900 dark:text-white">Açık Tema</span>
                    </button>

                    <button
                      onClick={() => handleThemeChange('dark')}
                      className={`p-4 border-2 rounded-lg text-center transition-colors duration-200 ${
                        userPreferences.getTheme() === 'dark'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="w-full h-20 bg-gray-800 border border-gray-700 rounded mb-2"></div>
                      <span className="font-medium text-gray-900 dark:text-white">Koyu Tema</span>
                    </button>

                    <button
                      onClick={() => handleThemeChange('auto')}
                      className={`p-4 border-2 rounded-lg text-center transition-colors duration-200 ${
                        userPreferences.getTheme() === 'auto'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="w-full h-20 bg-gradient-to-r from-white to-gray-800 border border-gray-200 rounded mb-2"></div>
                      <span className="font-medium text-gray-900 dark:text-white">Otomatik</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ana Renk
                    </label>
                    <select
                      value={siteConfig?.primaryColor || 'blue'}
                      onChange={(e) => setSiteConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="blue">Mavi</option>
                      <option value="green">Yeşil</option>
                      <option value="purple">Mor</option>
                      <option value="red">Kırmızı</option>
                      <option value="orange">Turuncu</option>
                      <option value="pink">Pembe</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Font Boyutu
                    </label>
                    <select
                      value={siteConfig?.fontSize || 'medium'}
                      onChange={(e) => setSiteConfig(prev => ({ ...prev, fontSize: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="small">Küçük</option>
                      <option value="medium">Orta</option>
                      <option value="large">Büyük</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="animations"
                    checked={siteConfig?.animations || true}
                    onChange={(e) => setSiteConfig(prev => ({ ...prev, animations: e.target.checked }))}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="animations" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Animasyonları Etkinleştir
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Güvenlik Ayarları
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Admin Kullanıcı Adı
                    </label>
                    <input
                      type="text"
                      value={siteConfig?.adminUsername || 'admin'}
                      onChange={(e) => setSiteConfig(prev => ({ ...prev, adminUsername: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Admin Şifresi
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={siteConfig?.adminPassword || 'admin123'}
                        onChange={(e) => setSiteConfig(prev => ({ ...prev, adminPassword: e.target.value }))}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="twoFactorAuth"
                    checked={siteConfig?.twoFactorAuth || false}
                    onChange={(e) => setSiteConfig(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="twoFactorAuth" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    İki Faktörlü Kimlik Doğrulama
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="sessionTimeout"
                    checked={siteConfig?.sessionTimeout || true}
                    onChange={(e) => setSiteConfig(prev => ({ ...prev, sessionTimeout: e.target.checked }))}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="sessionTimeout" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Oturum Zaman Aşımı
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Oturum Süresi (Dakika)
                  </label>
                  <input
                    type="number"
                    value={siteConfig?.sessionDuration || 30}
                    onChange={(e) => setSiteConfig(prev => ({ ...prev, sessionDuration: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    min="5"
                    max="1440"
                  />
                </div>
              </div>
            )}

            {activeTab === 'backup' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Yedekleme ve Geri Yükleme
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
                    <Download className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Verileri Dışa Aktar
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Tüm site verilerini JSON formatında indirin
                    </p>
                    <button
                      onClick={handleExportData}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2 mx-auto"
                    >
                      <Download className="w-4 h-4" />
                      <span>Dışa Aktar</span>
                    </button>
                  </div>

                  <div className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Verileri İçe Aktar
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Önceden yedeklenmiş verileri geri yükleyin
                    </p>
                    <label className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2 mx-auto cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>Dosya Seç</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportData}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Trash2 className="w-6 h-6 text-red-600 mt-1" />
                    <div>
                      <h3 className="text-lg font-medium text-red-900 dark:text-red-100 mb-2">
                        Tehlikeli Bölge
                      </h3>
                      <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                        Bu işlemler geri alınamaz. Dikkatli olun.
                      </p>
                      <button
                        onClick={handleResetSettings}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Tüm Ayarları Sıfırla</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSettings; 