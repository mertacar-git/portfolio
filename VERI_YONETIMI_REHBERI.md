# 📊 Veri Yönetimi Rehberi

Bu rehber, kişisel web sitenizde verilerinizi nasıl yöneteceğinizi ve güncelleyeceğinizi açıklar.

## 📁 Veri Dosyaları Yapısı

```
src/data/
├── personalInfo.js      # Kişisel bilgiler
├── projects.js          # Portfolio projeleri
├── blogPosts.js         # Blog yazıları
└── siteConfig.js        # Site konfigürasyonu

src/utils/
└── dataManager.js       # Veri yönetimi yardımcı fonksiyonları
```

## 🔧 Veri Güncelleme Yöntemleri

### 1. **Kişisel Bilgileri Güncelleme**

`src/data/personalInfo.js` dosyasını düzenleyin:

```javascript
export const personalInfo = {
  name: "Mert",                    // Adınızı değiştirin
  title: "Full Stack Developer",   // Unvanınızı değiştirin
  subtitle: "Modern web teknolojileri ile yaratıcı çözümler geliştiriyorum",
  email: "mert@example.com",       // Email adresinizi değiştirin
  phone: "+90 555 123 45 67",      // Telefon numaranızı değiştirin
  location: "İstanbul, Türkiye",   // Konumunuzu değiştirin
  
  // Hakkımda bölümünü güncelleyin
  about: `Merhaba! Ben Mert, tutkulu bir Full Stack Developer'ım...`,
  
  // Sosyal medya linklerinizi güncelleyin
  socialLinks: {
    github: "https://github.com/GERCEK_KULLANICI_ADINIZ",
    linkedin: "https://linkedin.com/in/GERCEK_KULLANICI_ADINIZ",
    twitter: "https://twitter.com/GERCEK_KULLANICI_ADINIZ",
    instagram: "https://instagram.com/GERCEK_KULLANICI_ADINIZ",
    youtube: "https://youtube.com/@GERCEK_KULLANICI_ADINIZ"
  },
  
  // Yeteneklerinizi güncelleyin
  skills: [
    { name: "React", level: 90 },
    { name: "JavaScript", level: 95 },
    // Yeni yetenekler ekleyin veya mevcut olanları güncelleyin
  ],
  
  // Eğitim bilgilerinizi güncelleyin
  education: [
    {
      degree: "Bilgisayar Mühendisliği",
      school: "İstanbul Teknik Üniversitesi",
      year: "2018-2022",
      description: "Yazılım geliştirme ve algoritma analizi üzerine odaklandım."
    }
    // Yeni eğitim bilgileri ekleyin
  ],
  
  // İş deneyimlerinizi güncelleyin
  experience: [
    {
      title: "Senior Frontend Developer",
      company: "Tech Company A",
      period: "2022 - Günümüz",
      description: "React ve TypeScript kullanarak büyük ölçekli web uygulamaları geliştiriyorum."
    }
    // Yeni iş deneyimleri ekleyin
  ]
};
```

### 2. **Portfolio Projelerini Güncelleme**

`src/data/projects.js` dosyasını düzenleyin:

```javascript
export const projects = [
  {
    id: 1, // Benzersiz ID (otomatik artırın)
    title: "Proje Adı",
    description: "Proje açıklaması...",
    image: "/images/projects/proje-resmi.jpg", // Resim yolunu güncelleyin
    technologies: ["React", "Node.js", "MongoDB"], // Kullanılan teknolojiler
    category: "Full Stack", // Kategori: "Full Stack", "Frontend", "Backend", "Mobile"
    liveUrl: "https://canli-proje-linki.com", // Canlı proje linki
    githubUrl: "https://github.com/kullaniciadi/proje-adi", // GitHub linki
    featured: true, // Öne çıkan proje mi?
    year: 2025 // Proje yılı
  }
  // Yeni projeler ekleyin
];
```

**Yeni Proje Ekleme Adımları:**

1. **Proje resmini ekleyin:**
   - Resmi `public/images/projects/` klasörüne koyun
   - `image` alanını güncelleyin

2. **Proje bilgilerini doldurun:**
   - `title`: Proje adı
   - `description`: Detaylı açıklama
   - `technologies`: Kullanılan teknolojiler listesi
   - `category`: Proje kategorisi
   - `liveUrl`: Canlı demo linki
   - `githubUrl`: GitHub repository linki

3. **Öne çıkan proje yapın:**
   - `featured: true` yaparak ana sayfada gösterin

### 3. **Blog Yazılarını Güncelleme**

`src/data/blogPosts.js` dosyasını düzenleyin:

```javascript
export const blogPosts = [
  {
    id: 1, // Benzersiz ID
    title: "Blog Yazısı Başlığı",
    excerpt: "Kısa özet...",
    content: `Blog yazısının tam içeriği...
    
    ## Alt Başlık
    İçerik devam eder...
    
    - Liste öğesi 1
    - Liste öğesi 2`,
    author: "Mert",
    publishDate: "2024-01-15", // YYYY-MM-DD formatında
    readTime: "8 min", // Tahmini okuma süresi
    category: "React", // Kategori
    tags: ["React", "JavaScript", "Frontend"], // Etiketler
    image: "/images/blog/blog-resmi.jpg", // Blog resmi
    featured: true, // Öne çıkan yazı mı?
    views: 0, // Görüntülenme sayısı (otomatik artar)
    likes: 0 // Beğeni sayısı
  }
  // Yeni blog yazıları ekleyin
];
```

**Yeni Blog Yazısı Ekleme:**

1. **Blog resmini ekleyin:**
   - Resmi `public/images/blog/` klasörüne koyun

2. **İçeriği yazın:**
   - Markdown formatında yazabilirsiniz
   - Başlıklar için `##` kullanın
   - Listeler için `-` kullanın

3. **Meta bilgileri doldurun:**
   - `publishDate`: Yayın tarihi
   - `category`: Kategori
   - `tags`: İlgili etiketler

### 4. **Site Konfigürasyonunu Güncelleme**

`src/data/siteConfig.js` dosyasını düzenleyin:

```javascript
export const siteConfig = {
  site: {
    title: "Mert - Full Stack Developer",
    description: "Site açıklaması...",
    url: "https://gercek-site-adresi.com",
    author: "Mert",
    language: "tr",
    themeColor: "#3B82F6", // Tema rengi
    keywords: ["anahtar", "kelimeler"] // SEO anahtar kelimeleri
  },
  
  // SEO ayarları
  seo: {
    titleTemplate: "%s | Mert Portfolio",
    defaultTitle: "Mert - Full Stack Developer",
    defaultDescription: "Site açıklaması...",
    canonical: "https://gercek-site-adresi.com",
    openGraph: {
      // Sosyal medya paylaşım ayarları
    }
  },
  
  // Navigasyon menüsü
  navigation: [
    {
      name: "Ana Sayfa",
      href: "/",
      icon: "home"
    }
    // Yeni menü öğeleri ekleyin
  ],
  
  // Sosyal medya linkleri
  socialLinks: {
    github: {
      url: "https://github.com/GERCEK_KULLANICI_ADINIZ",
      icon: "github",
      label: "GitHub"
    }
    // Diğer sosyal medya hesapları
  },
  
  // İletişim bilgileri
  contact: {
    email: "gercek@email.com",
    phone: "+90 555 123 45 67",
    address: "Gerçek adres",
    workingHours: "Pazartesi - Cuma: 09:00 - 18:00"
  }
};
```

## 🛠️ Gelişmiş Veri Yönetimi

### **Local Storage Kullanımı**

```javascript
import { storage, userPreferences, formData } from '../utils/dataManager';

// Kullanıcı tercihlerini kaydetme
userPreferences.setTheme('dark');
userPreferences.setLanguage('en');

// Form verilerini kaydetme
formData.saveFormData('contact', {
  name: 'John Doe',
  email: 'john@example.com'
});

// Verileri okuma
const theme = userPreferences.getTheme();
const contactForm = formData.loadFormData('contact');
```

### **Arama ve Filtreleme**

```javascript
import { searchAndFilter } from '../utils/dataManager';

// Projelerde arama
const searchResults = searchAndFilter.searchProjects('React');

// Blog yazılarında arama
const blogResults = searchAndFilter.searchBlogPosts('JavaScript');

// Tarihe göre filtreleme
const recentProjects = searchAndFilter.filterByDate(projects, '2023-01-01');
```

### **İstatistik Takibi**

```javascript
import { analytics } from '../utils/dataManager';

// Sayfa görüntüleme sayısını artırma
analytics.incrementPageView('home');

// Proje görüntüleme sayısını artırma
analytics.incrementProjectView(1);

// İstatistikleri alma
const stats = analytics.getStats();
console.log('Toplam sayfa görüntüleme:', stats.totalPageViews);
```

## 📝 Veri Güncelleme İpuçları

### **1. Düzenli Güncelleme**
- Haftalık olarak blog yazıları ekleyin
- Ayda bir portfolio projelerini güncelleyin
- 3 ayda bir kişisel bilgileri kontrol edin

### **2. SEO Optimizasyonu**
- Blog yazılarında anahtar kelimeler kullanın
- Meta açıklamaları güncelleyin
- Resim alt metinlerini doldurun

### **3. Performans**
- Resimleri optimize edin (WebP formatı kullanın)
- Büyük dosyaları sıkıştırın
- Lazy loading kullanın

### **4. Yedekleme**
- Verilerinizi düzenli olarak yedekleyin
- GitHub'da versiyon kontrolü yapın
- Export/Import özelliklerini kullanın

## 🔄 Otomatik Veri Güncelleme

### **API Entegrasyonu (Opsiyonel)**

Eğer dinamik veri istiyorsanız, API entegrasyonu ekleyebilirsiniz:

```javascript
// src/services/api.js
export const fetchPersonalInfo = async () => {
  const response = await fetch('/api/personal-info');
  return response.json();
};

export const fetchProjects = async () => {
  const response = await fetch('/api/projects');
  return response.json();
};

export const fetchBlogPosts = async () => {
  const response = await fetch('/api/blog-posts');
  return response.json();
};
```

### **CMS Entegrasyonu (Opsiyonel)**

Content Management System kullanarak verilerinizi web arayüzünden güncelleyebilirsiniz:

- **Strapi**: Headless CMS
- **Sanity**: Modern CMS
- **Contentful**: Cloud CMS
- **WordPress**: REST API ile

## 📊 Veri Analizi

### **Google Analytics Entegrasyonu**

```javascript
// src/utils/analytics.js
export const trackPageView = (pageName) => {
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_TRACKING_ID', {
      page_title: pageName,
      page_location: window.location.href
    });
  }
};

export const trackEvent = (action, category, label) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: category,
      event_label: label
    });
  }
};
```

## 🚀 Deployment Sonrası

### **Veri Güncelleme Adımları**

1. **Geliştirme ortamında test edin**
2. **Değişiklikleri commit edin**
3. **GitHub'a push edin**
4. **Deployment platformunda otomatik build bekleyin**
5. **Canlı sitede kontrol edin**

### **Hızlı Güncelleme İçin**

```bash
# Değişiklikleri commit etme
git add .
git commit -m "Veri güncellemesi: Yeni proje eklendi"
git push origin main

# Vercel otomatik deployment
# Netlify otomatik deployment
# GitHub Pages için manuel deployment
```

Bu rehber ile verilerinizi kolayca güncelleyebilir ve web sitenizi dinamik tutabilirsiniz! 🎉

## 🛠️ Admin Paneli ile Veri Yönetimi

### **Admin Panel Özellikleri**

Admin paneli `/admin` rotasında bulunur ve şu özellikleri içerir:

- **Giriş Sistemi**: Güvenli admin girişi
- **Dashboard**: Genel istatistikler ve hızlı erişim
- **Kişisel Bilgiler Yönetimi**: Profil bilgilerini düzenleme
- **Proje Yönetimi**: Projeleri ekleme, düzenleme, silme
- **Blog Yönetimi**: Blog yazılarını ekleme, düzenleme, silme
- **Site Ayarları**: SEO, tema, navigasyon ayarları
- **İstatistikler**: Ziyaretçi istatistikleri ve analitikler
- **Yedekleme**: Veri export/import işlemleri

### **Admin Paneli Kullanımı**

1. **Giriş Yapma:**
   ```
   http://localhost:3000/admin
   Kullanıcı adı: admin
   Şifre: admin123
   ```

2. **Dashboard:**
   - Toplam proje sayısı
   - Toplam blog yazısı sayısı
   - Son ziyaretçi istatistikleri
   - Hızlı işlem butonları

3. **Kişisel Bilgiler:**
   - Ad, email, telefon güncelleme
   - Sosyal medya linkleri
   - Yetenekler ve seviyeleri
   - Eğitim ve deneyim bilgileri

4. **Proje Yönetimi:**
   - Yeni proje ekleme
   - Mevcut projeleri düzenleme
   - Proje silme
   - Resim yükleme
   - Kategori ve etiket yönetimi

5. **Blog Yönetimi:**
   - Yeni blog yazısı oluşturma
   - Markdown editör ile içerik yazma
   - Resim yükleme
   - Kategori ve etiket atama
   - Yayın durumu kontrolü

6. **Site Ayarları:**
   - SEO meta etiketleri
   - Tema renkleri
   - Navigasyon menüsü
   - İletişim bilgileri

### **Admin Panel Güvenliği**

```javascript
// src/utils/auth.js
export const adminAuth = {
  username: 'admin',
  password: 'admin123', // Production'da güçlü şifre kullanın
  
  login: (username, password) => {
    if (username === adminAuth.username && password === adminAuth.password) {
      localStorage.setItem('adminLoggedIn', 'true');
      return true;
    }
    return false;
  },
  
  logout: () => {
    localStorage.removeItem('adminLoggedIn');
  },
  
  isLoggedIn: () => {
    return localStorage.getItem('adminLoggedIn') === 'true';
  }
};
```

### **Veri Yedekleme ve Geri Yükleme**

Admin panelinde veri yedekleme özellikleri:

1. **Otomatik Yedekleme:**
   - Her gün otomatik yedekleme
   - Son 7 günlük yedekler saklanır
   - Yedekleme durumu bildirimleri

2. **Manuel Yedekleme:**
   - Tek tıkla tüm verileri export etme
   - JSON formatında indirme
   - Yedek dosyasını geri yükleme

3. **Yedekleme Ayarları:**
   - Yedekleme sıklığı ayarlama
   - Yedekleme konumu seçme
   - Şifreli yedekleme seçeneği

### **Admin Panel Kısayolları**

```javascript
// Klavye kısayolları
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey) {
    switch(e.key) {
      case 'n': // Yeni proje
        e.preventDefault();
        navigateToNewProject();
        break;
      case 'b': // Yeni blog
        e.preventDefault();
        navigateToNewBlog();
        break;
      case 's': // Kaydet
        e.preventDefault();
        saveCurrentForm();
        break;
      case 'e': // Export
        e.preventDefault();
        exportData();
        break;
    }
  }
});
```

### **Admin Panel Bildirimleri**

```javascript
// Toast bildirimleri
export const showNotification = (message, type = 'success') => {
  const notification = {
    id: Date.now(),
    message,
    type,
    duration: 3000
  };
  
  // Bildirim gösterme
  displayToast(notification);
};
```

Bu admin paneli ile verilerinizi web arayüzünden kolayca yönetebilirsiniz! 🎉 