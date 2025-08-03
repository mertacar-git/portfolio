import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Save, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut,
  Move,
  Crop,
  Eye,
  Download,
  Trash2,
  Settings,
  User
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { analytics } from '../../utils/dataManager';
import { uploadProfileImage, validateImageFile, compressImage } from '../../utils/imageUploader';

const AdminProfile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('/images/profile.jpg');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    crop: { x: 0, y: 0, width: 100, height: 100 },
    zoom: 1,
    rotation: 0,
    brightness: 100,
    contrast: 100,
    saturation: 100
  });
  const [activeTab, setActiveTab] = useState('upload');
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    analytics.incrementPageView('admin-profile');
    loadProfileSettings();
  }, []);

  const loadProfileSettings = () => {
    try {
      const savedSettings = storageService.getData('profileSettings');
      if (savedSettings) {
        setSettings(savedSettings);
      }
    } catch (error) {
      console.error('Profil ayarları yüklenemedi:', error);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Dosya validasyonu
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        alert('Dosya hatası: ' + validation.errors.join(', '));
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // Resmi sıkıştır
      const compressedFile = await compressImage(selectedFile);
      
      // Dosyayı yükle
      const result = await uploadProfileImage(compressedFile);
      
      if (result.success) {
        // Ayarları kaydet
        storageService.saveData('profileSettings', settings);
        
        setSelectedFile(null);
        setPreviewUrl('/images/profile.jpg');
        
        // Başarı mesajı göster
        alert(result.message);
      }
      
    } catch (error) {
      console.error('Dosya yükleme hatası:', error);
      alert('Dosya yüklenirken hata oluştu: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    try {
      storageService.saveData('profileSettings', settings);
      alert('Ayarlar kaydedildi!');
    } catch (error) {
      console.error('Ayarlar kaydedilemedi:', error);
      alert('Ayarlar kaydedilirken hata oluştu!');
    } finally {
      setIsSaving(false);
    }
  };

  const resetSettings = () => {
    const defaultSettings = {
      crop: { x: 0, y: 0, width: 100, height: 100 },
      zoom: 1,
      rotation: 0,
      brightness: 100,
      contrast: 100,
      saturation: 100
    };
    setSettings(defaultSettings);
    storageService.saveData('profileSettings', defaultSettings);
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateCropSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      crop: {
        ...prev.crop,
        [key]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container-max py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profil Resmi Yönetimi
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Profil resminizi yükleyin ve görünümünü özelleştirin
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sol Panel - Resim Önizleme */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Önizleme Alanı */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Önizleme
              </h3>
              
              <div className="space-y-4">
                {/* Header Önizleme */}
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Header'da Görünüm</h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg overflow-hidden border-2 border-white dark:border-gray-600 shadow-sm">
                      <img
                        src={previewUrl}
                        alt="Profil Önizleme"
                        className="w-full h-full object-cover"
                        style={{
                          transform: `scale(${settings.zoom}) rotate(${settings.rotation}deg)`,
                          filter: `brightness(${settings.brightness}%) contrast(${settings.contrast}%) saturate(${settings.saturation}%)`,
                          objectPosition: `${settings.crop.x}% ${settings.crop.y}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Mert Acar</span>
                  </div>
                </div>

                {/* Ana Sayfa Önizleme */}
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ana Sayfada Görünüm</h4>
                  <div className="flex justify-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-600 shadow-2xl">
                      <img
                        src={previewUrl}
                        alt="Profil Önizleme"
                        className="w-full h-full object-cover"
                        style={{
                          transform: `scale(${settings.zoom}) rotate(${settings.rotation}deg)`,
                          filter: `brightness(${settings.brightness}%) contrast(${settings.contrast}%) saturate(${settings.saturation}%)`,
                          objectPosition: `${settings.crop.x}% ${settings.crop.y}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Hakkımda Sayfası Önizleme */}
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hakkımda Sayfasında Görünüm</h4>
                  <div className="flex justify-center">
                    <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white dark:border-gray-600 shadow-2xl">
                      <img
                        src={previewUrl}
                        alt="Profil Önizleme"
                        className="w-full h-full object-cover"
                        style={{
                          transform: `scale(${settings.zoom}) rotate(${settings.rotation}deg)`,
                          filter: `brightness(${settings.brightness}%) contrast(${settings.contrast}%) saturate(${settings.saturation}%)`,
                          objectPosition: `${settings.crop.x}% ${settings.crop.y}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sağ Panel - Kontroller */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Tab Navigation */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-1">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'upload'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Resim Yükle
                </button>
                <button
                  onClick={() => setActiveTab('edit')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'edit'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Crop className="w-4 h-4 inline mr-2" />
                  Düzenle
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Settings className="w-4 h-4 inline mr-2" />
                  Ayarlar
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              {/* Upload Tab */}
              {activeTab === 'upload' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Yeni Resim Yükle
                  </h3>
                  
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Resim dosyasını seçin veya sürükleyip bırakın
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                      PNG, JPG, JPEG (Max: 5MB)
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-primary"
                      disabled={isUploading}
                    >
                      {isUploading ? 'Yükleniyor...' : 'Resim Seç'}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  {selectedFile && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img
                            src={previewUrl}
                            alt="Seçilen resim"
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {selectedFile.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedFile(null)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="w-full btn-primary"
                      >
                        {isUploading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Yükleniyor...
                          </div>
                        ) : (
                          'Resmi Yükle ve Uygula'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Edit Tab */}
              {activeTab === 'edit' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Resim Düzenleme
                  </h3>

                  {/* Crop Settings */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                      <Crop className="w-4 h-4 mr-2" />
                      Kırpma Ayarları
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          X Pozisyonu (%)
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={settings.crop.x}
                          onChange={(e) => updateCropSetting('x', parseInt(e.target.value))}
                          className="w-full"
                        />
                        <span className="text-sm text-gray-500">{settings.crop.x}%</span>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Y Pozisyonu (%)
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={settings.crop.y}
                          onChange={(e) => updateCropSetting('y', parseInt(e.target.value))}
                          className="w-full"
                        />
                        <span className="text-sm text-gray-500">{settings.crop.y}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Zoom and Rotation */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                      <ZoomIn className="w-4 h-4 mr-2" />
                      Yakınlaştırma ve Döndürme
                    </h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Yakınlaştırma
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="3"
                        step="0.1"
                        value={settings.zoom}
                        onChange={(e) => updateSetting('zoom', parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-500">{settings.zoom}x</span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Döndürme (Derece)
                      </label>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={settings.rotation}
                        onChange={(e) => updateSetting('rotation', parseInt(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-500">{settings.rotation}°</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Görsel Ayarlar
                  </h3>

                  {/* Image Filters */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Filtre Ayarları
                    </h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Parlaklık
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={settings.brightness}
                        onChange={(e) => updateSetting('brightness', parseInt(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-500">{settings.brightness}%</span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Kontrast
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={settings.contrast}
                        onChange={(e) => updateSetting('contrast', parseInt(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-500">{settings.contrast}%</span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Doygunluk
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={settings.saturation}
                        onChange={(e) => updateSetting('saturation', parseInt(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-500">{settings.saturation}%</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleSaveSettings}
                      disabled={isSaving}
                      className="flex-1 btn-primary"
                    >
                      {isSaving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
                    </button>
                    <button
                      onClick={resetSettings}
                      className="btn-secondary"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile; 