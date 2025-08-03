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
      objectPosition: `${settings.crop.x}% ${settings.crop.y}%`
    };
  };

  const getImageUrl = () => {
    return '/images/profile.jpg';
  };

  return {
    settings,
    getImageStyle,
    getImageUrl,
    loadSettings
  };
};

export default useProfileImage; 