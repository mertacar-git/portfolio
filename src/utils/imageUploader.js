// Resim yükleme utility fonksiyonları
// Not: Bu dosya frontend'de çalışır, gerçek dosya yükleme backend'de yapılmalıdır

export const uploadProfileImage = async (file) => {
  try {
    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Dosya boyutu 5MB\'dan büyük olamaz');
    }

    // Dosya tipi kontrolü
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Sadece JPG, PNG ve WebP dosyaları kabul edilir');
    }

    // Simüle edilmiş yükleme süresi
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Gerçek uygulamada burada dosya backend'e yüklenir
    // ve public/images/profile.jpg olarak kaydedilir
    
    console.log('Dosya yüklendi:', file.name);
    console.log('Dosya boyutu:', (file.size / 1024 / 1024).toFixed(2), 'MB');
    console.log('Dosya tipi:', file.type);

    // Başarılı yükleme simülasyonu
    return {
      success: true,
      message: 'Profil resmi başarıyla yüklendi',
      filename: 'profile.jpg',
      url: '/images/profile.jpg'
    };

  } catch (error) {
    console.error('Dosya yükleme hatası:', error);
    throw error;
  }
};

export const validateImageFile = (file) => {
  const errors = [];

  // Dosya boyutu kontrolü
  if (file.size > 5 * 1024 * 1024) {
    errors.push('Dosya boyutu 5MB\'dan büyük olamaz');
  }

  // Dosya tipi kontrolü
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Sadece JPG, PNG ve WebP dosyaları kabul edilir');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const compressImage = async (file, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // En-boy oranını koru
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;

      canvas.width = newWidth;
      canvas.height = newHeight;

      // Resmi çiz
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // Canvas'ı blob'a çevir
      canvas.toBlob((blob) => {
        resolve(new File([blob], file.name, {
          type: file.type,
          lastModified: Date.now()
        }));
      }, file.type, quality);
    };

    img.src = URL.createObjectURL(file);
  });
}; 