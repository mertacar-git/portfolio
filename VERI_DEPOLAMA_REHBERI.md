# Veri Depolama Çözümleri Rehberi

Bu rehber, kişisel web sitenizde verileri nasıl saklayacağınızı ve yöneteceğinizi açıklar.

## 📋 Mevcut Durum

Şu anda veriler `src/data/` klasöründeki JavaScript dosyalarında saklanıyor:
- `personalInfo.js` - Kişisel bilgiler
- `projects.js` - Proje verileri
- `blogPosts.js` - Blog yazıları
- `siteConfig.js` - Site ayarları

## 🚀 Veri Depolama Seçenekleri

### 1. **Local Storage (Basit Çözüm)**
**Avantajlar:**
- Kurulum gerektirmez
- Hızlı implementasyon
- Ücretsiz

**Dezavantajlar:**
- Sadece tarayıcıda saklanır
- Veri boyutu sınırlı (5-10MB)
- Cihazlar arası senkronizasyon yok

**Kullanım:**
```javascript
// Veri kaydetme
localStorage.setItem('websiteData', JSON.stringify(data));

// Veri okuma
const data = JSON.parse(localStorage.getItem('websiteData'));
```

### 2. **JSON Server (Geliştirme/Test)**
**Avantajlar:**
- RESTful API
- Gerçek veritabanı simülasyonu
- Hızlı kurulum

**Kurulum:**
```bash
npm install -g json-server
```

**Kullanım:**
```bash
# db.json dosyası oluşturun
json-server --watch db.json --port 3001
```

### 3. **Firebase (Önerilen)**
**Avantajlar:**
- Google'ın güvenilir altyapısı
- Gerçek zamanlı veritabanı
- Authentication sistemi
- Hosting
- Ücretsiz tier mevcut

**Kurulum:**
```bash
npm install firebase
```

**Konfigürasyon:**
```javascript
// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

### 4. **Supabase (Alternatif)**
**Avantajlar:**
- PostgreSQL veritabanı
- Real-time subscriptions
- Authentication
- Storage
- Açık kaynak

**Kurulum:**
```bash
npm install @supabase/supabase-js
```

### 5. **MongoDB Atlas (Cloud Database)**
**Avantajlar:**
- NoSQL veritabanı
- Ölçeklenebilir
- Ücretsiz tier
- Kolay yönetim

## 🔧 Implementasyon Örnekleri

### Firebase ile Veri Yönetimi

**1. Veri Servisi Oluşturma:**
```javascript
// src/services/dataService.js
import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';

export const dataService = {
  // Blog yazılarını getir
  async getBlogPosts() {
    const querySnapshot = await getDocs(collection(db, 'blogPosts'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Blog yazısı ekle
  async addBlogPost(postData) {
    return await addDoc(collection(db, 'blogPosts'), postData);
  },

  // Blog yazısını güncelle
  async updateBlogPost(id, postData) {
    const docRef = doc(db, 'blogPosts', id);
    return await updateDoc(docRef, postData);
  },

  // Blog yazısını sil
  async deleteBlogPost(id) {
    const docRef = doc(db, 'blogPosts', id);
    return await deleteDoc(docRef);
  }
};
```

**2. Context ile Veri Yönetimi:**
```javascript
// src/contexts/DataContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [posts, projs] = await Promise.all([
        dataService.getBlogPosts(),
        dataService.getProjects()
      ]);
      setBlogPosts(posts);
      setProjects(projs);
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBlogPost = async (postData) => {
    try {
      await dataService.addBlogPost(postData);
      await loadData(); // Verileri yeniden yükle
    } catch (error) {
      throw error;
    }
  };

  const value = {
    blogPosts,
    projects,
    loading,
    addBlogPost,
    loadData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
```

### Local Storage ile Veri Yönetimi

**1. Storage Servisi:**
```javascript
// src/services/storageService.js
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
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Veri okuma hatası:', error);
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
  }
};
```

## 📊 Veri Yedekleme ve Senkronizasyon

### 1. **Otomatik Yedekleme**
```javascript
// src/utils/backupService.js
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
```

### 2. **Cloud Sync (Firebase)**
```javascript
// src/services/syncService.js
import { db } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const syncService = {
  // Verileri cloud'a yükle
  async uploadToCloud(userId, data) {
    try {
      await setDoc(doc(db, 'users', userId), {
        ...data,
        lastSync: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Cloud yükleme hatası:', error);
      return false;
    }
  },

  // Verileri cloud'dan indir
  async downloadFromCloud(userId) {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Cloud indirme hatası:', error);
      return null;
    }
  }
};
```

## 🔐 Güvenlik Önlemleri

### 1. **Veri Doğrulama**
```javascript
// src/utils/validation.js
export const validateData = {
  blogPost(post) {
    const errors = [];
    
    if (!post.title || post.title.length < 3) {
      errors.push('Başlık en az 3 karakter olmalıdır');
    }
    
    if (!post.content || post.content.length < 10) {
      errors.push('İçerik en az 10 karakter olmalıdır');
    }
    
    return errors;
  },

  project(project) {
    const errors = [];
    
    if (!project.title) {
      errors.push('Proje başlığı gereklidir');
    }
    
    if (!project.description) {
      errors.push('Proje açıklaması gereklidir');
    }
    
    return errors;
  }
};
```

### 2. **XSS Koruması**
```javascript
// src/utils/security.js
export const sanitizeInput = (input) => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};
```

## 📱 Mobil Uygulama Entegrasyonu

### 1. **PWA (Progressive Web App)**
```javascript
// public/manifest.json
{
  "name": "Kişisel Web Sitesi",
  "short_name": "Portfolio",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3B82F6",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### 2. **Service Worker**
```javascript
// public/sw.js
const CACHE_NAME = 'portfolio-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});
```

## 🚀 Deployment Seçenekleri

### 1. **Vercel (Önerilen)**
```bash
npm install -g vercel
vercel
```

### 2. **Netlify**
```bash
npm install -g netlify-cli
netlify deploy
```

### 3. **Firebase Hosting**
```bash
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

## 💡 Öneriler

1. **Başlangıç için:** Local Storage kullanın
2. **Gelişmiş kullanım için:** Firebase seçin
3. **Kurumsal kullanım için:** MongoDB Atlas veya Supabase
4. **Maliyet optimizasyonu için:** Ücretsiz tier'ları değerlendirin

## 🔄 Geçiş Stratejisi

1. Mevcut verileri export edin
2. Yeni veri servisini implement edin
3. Test ortamında deneyin
4. Canlı ortama geçin
5. Eski verileri yedekleyin

Bu rehber ile web sitenizi profesyonel bir veri yönetim sistemi ile donatabilirsiniz! 🎉 