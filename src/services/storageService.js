// Local Storage Servisi
export const storageService = {
  // Veri kaydet
  saveData(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Veri kaydetme hatası:', error);
      return false;
    }
  },

  // Veri oku
  getData(key) {
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;
      
      // Eğer data bir string ise ve JSON değilse, direkt döndür
      if (typeof data === 'string' && !data.startsWith('{') && !data.startsWith('[')) {
        return data;
      }
      
      return JSON.parse(data);
    } catch (error) {
      console.error('Veri okuma hatası:', error);
      // Hatalı veriyi temizle
      localStorage.removeItem(key);
      return null;
    }
  },

  // Veri sil
  removeData(key) {
    localStorage.removeItem(key);
  },

  // Tüm verileri temizle
  clearAll() {
    localStorage.clear();
  },

  // Veri var mı kontrol et
  hasData(key) {
    return localStorage.getItem(key) !== null;
  },

  // Veri boyutunu kontrol et
  getDataSize(key) {
    const data = localStorage.getItem(key);
    return data ? new Blob([data]).size : 0;
  },

  // Tüm storage boyutunu kontrol et
  getTotalSize() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += new Blob([localStorage[key]]).size;
      }
    }
    return total;
  }
};

// Veri yedekleme servisi
export const backupService = {
  // Verileri dışa aktar
  exportData() {
    const data = {
      personalInfo: storageService.getData('personalInfo'),
      projects: storageService.getData('projects'),
      blogPosts: storageService.getData('blogPosts'),
      siteConfig: storageService.getData('siteConfig'),
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `website-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    return true;
  },

  // Verileri içe aktar
  importData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          
          // Verileri kaydet
          Object.entries(data).forEach(([key, value]) => {
            if (key !== 'timestamp') {
              storageService.saveData(key, value);
            }
          });
          
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  }
}; 