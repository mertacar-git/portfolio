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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    loadSettings();
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

  const getImageStyle = () => {
    return {
      transform: `scale(${settings.zoom}) rotate(${settings.rotation}deg)`,
      filter: `brightness(${settings.brightness}%) contrast(${settings.contrast}%) saturate(${settings.saturation}%)`,
      objectPosition: `${settings.crop.x}% ${settings.crop.y}%`,
      opacity: imageLoaded ? 1 : 0,
      transition: 'opacity 0.3s ease-in-out'
    };
  };

  const getImageUrl = () => {
    return '/images/profile.jpg';
  };

  const handleImageError = () => {
    console.error('Profil resmi yüklenemedi: /images/profile.jpg');
    setImageError(true);
    setImageLoaded(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  return {
    settings,
    imageLoaded,
    imageError,
    getImageStyle,
    getImageUrl,
    handleImageError,
    handleImageLoad,
    loadSettings
  };
};

export default useProfileImage; 