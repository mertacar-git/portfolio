import { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

const useProfileImage = () => {
  const [settings, setSettings] = useState({
    crop: { x: 0, y: 0, width: 100, height: 100 },
    zoom: 1,
    rotation: 0,
    brightness: 100,
    contrast: 100,
    saturation: 100
  });
  const [imageUrl, setImageUrl] = useState('/images/profile.jpg');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    loadSettings();
    loadImageUrl();
  }, []);

  const loadSettings = () => {
    try {
      const savedSettings = storageService.getData('profileSettings');
      if (savedSettings) {
        setSettings(savedSettings);
      }
    } catch (error) {
      console.error('Profil ayarları yüklenemedi:', error);
    }
  };

  const loadImageUrl = () => {
    try {
      const savedImageUrl = storageService.getData('profileImageUrl');
      if (savedImageUrl) {
        setImageUrl(savedImageUrl);
      }
    } catch (error) {
      console.error('Profil resmi URL yüklenemedi:', error);
    }
  };

  const getImageStyle = () => {
    return {
      transform: `scale(${settings.zoom}) rotate(${settings.rotation}deg)`,
      filter: `brightness(${settings.brightness}%) contrast(${settings.contrast}%) saturate(${settings.saturation}%)`,
      objectPosition: `${settings.crop.x}% ${settings.crop.y}%`
    };
  };

  const getImageUrl = () => {
    return imageUrl;
  };

  const updateImageUrl = (newUrl) => {
    setImageUrl(newUrl);
    try {
      storageService.saveData('profileImageUrl', newUrl);
    } catch (error) {
      console.error('Profil resmi URL kaydedilemedi:', error);
    }
  };

  const handleImageError = () => {
    setImageError(true);
    // Fallback to default image
    setImageUrl('/images/profile.jpg');
  };

  return {
    settings,
    imageUrl,
    imageError,
    getImageStyle,
    getImageUrl,
    updateImageUrl,
    handleImageError,
    loadSettings
  };
};

export default useProfileImage; 