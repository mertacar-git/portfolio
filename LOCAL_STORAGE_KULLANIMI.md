# Local Storage Kullanım Rehberi

Bu rehber, projenizde local storage ile veri yönetiminin nasıl yapıldığını açıklar.

## 🎯 Genel Bakış

Proje, verileri şimdilik local storage'da saklamak üzere tasarlanmıştır. Bu sayede:
- Veritabanı kurulumu olmadan test yapabilirsiniz
- Veriler tarayıcıda kalıcı olarak saklanır
- Admin panelinden veri yönetimi yapabilirsiniz
- Veri yedekleme ve geri yükleme özellikleri mevcuttur

## 📁 Dosya Yapısı

```
src/
├── services/
│   └── storageService.js          # Ana storage servisi
├── utils/
│   ├── dataManager.js             # Veri yönetimi yardımcıları
│   └── testLocalStorage.js        # Test fonksiyonları
└── pages/
    ├── admin/                     # Admin sayfaları
    │   ├── AdminDashboard.jsx
    │   ├── AdminProjects.jsx
    │   ├── AdminBlog.jsx
    │   └── AdminSettings.jsx
    └── ...                        # Diğer sayfalar
```

## 🔧 Temel Kullanım

### 1. Storage Service Kullanımı

```javascript
import { storageService } from '../services/storageService';

// Veri kaydetme
storageService.saveData('key', data);

// Veri okuma
const data = storageService.getData('key');

// Veri silme
storageService.removeData('key');

// Veri var mı kontrolü
const exists = storageService.hasData('key');
```

### 2. Veri Tipleri

Projede saklanan veri tipleri:

- **projects**: Proje listesi
- **blogPosts**: Blog yazıları
- **personalInfo**: Kişisel bilgiler
- **siteConfig**: Site ayarları

### 3. Admin Panel Kullanımı

Admin paneline `/admin` URL'sinden erişebilirsiniz:

- **Dashboard**: Genel istatistikler ve hızlı işlemler
- **Projects**: Proje ekleme, düzenleme, silme
- **Blog**: Blog yazısı ekleme, düzenleme, silme
- **Settings**: Kişisel bilgiler ve site ayarları

## 🧪 Test Fonksiyonları

### Test Çalıştırma

Admin dashboard'da test butonları mevcuttur:

```javascript
import { testLocalStorage } from '../utils/testLocalStorage';

// Tüm testleri çalıştır
testLocalStorage.runAllTests();

// Demo veriler oluştur
testLocalStorage.createDemoData();

// Test verilerini temizle
testLocalStorage.cleanup();
```

### Test Edilen Özellikler

1. **Temel Operasyonlar**: Kaydetme, okuma, silme
2. **Veri Kalıcılığı**: Verilerin doğru saklanması
3. **Yedekleme Servisi**: Export/import işlemleri
4. **Veri Doğrulama**: Hata durumları

## 📊 Veri Yapıları

### Proje Verisi

```javascript
{
  id: 1,
  title: "Proje Adı",
  description: "Proje açıklaması",
  image: "/images/projects/project.jpg",
  technologies: ["React", "Node.js"],
  category: "Web Uygulaması",
  liveUrl: "https://example.com",
  githubUrl: "https://github.com/user/project",
  featured: true,
  year: "2024"
}
```

### Blog Yazısı Verisi

```javascript
{
  id: 1,
  title: "Blog Başlığı",
  excerpt: "Kısa özet",
  content: "Markdown formatında içerik",
  publishDate: "2024-01-15",
  readTime: "5 min",
  category: "Teknoloji",
  tags: ["React", "JavaScript"],
  featured: true,
  views: 0,
  likes: 0
}
```

### Kişisel Bilgi Verisi

```javascript
{
  name: "Ad Soyad",
  title: "Unvan",
  subtitle: "Alt başlık",
  email: "email@example.com",
  phone: "+90 555 123 4567",
  location: "İstanbul, Türkiye",
  about: "Hakkımda metni",
  skills: [
    { name: "React", level: 90 },
    { name: "Node.js", level: 85 }
  ],
  socialLinks: {
    github: "https://github.com/user",
    linkedin: "https://linkedin.com/in/user"
  }
}
```

## 🔄 Yedekleme ve Geri Yükleme

### Veri Dışa Aktarma

Admin Settings > Yedekleme sekmesinden:

1. "Verileri Dışa Aktar" butonuna tıklayın
2. JSON dosyası otomatik olarak indirilir
3. Dosya tüm verileri içerir

### Veri İçe Aktarma

1. "Dosya Seç" butonuna tıklayın
2. Daha önce dışa aktardığınız JSON dosyasını seçin
3. Veriler otomatik olarak yüklenir

## 🚀 Gelecek Geliştirmeler

Local storage sistemi, gelecekte veritabanı entegrasyonu için hazırlanmıştır:

1. **API Servisleri**: Backend API'leri ile entegrasyon
2. **Veritabanı**: MongoDB, PostgreSQL gibi veritabanları
3. **Gerçek Zamanlı**: WebSocket ile gerçek zamanlı güncellemeler
4. **Kullanıcı Yönetimi**: Kullanıcı hesapları ve yetkilendirme

## ⚠️ Önemli Notlar

1. **Tarayıcı Sınırları**: Local storage ~5-10MB sınırı vardır
2. **Veri Güvenliği**: Hassas veriler local storage'da saklanmamalıdır
3. **Tarayıcı Temizleme**: Tarayıcı verileri temizlendiğinde veriler silinir
4. **Çoklu Sekme**: Aynı anda birden fazla sekmede çalışırken dikkatli olun

## 🛠️ Sorun Giderme

### Veriler Görünmüyor

1. Console'u kontrol edin (F12)
2. Local storage'ı kontrol edin (Application > Storage)
3. Test fonksiyonlarını çalıştırın

### Veri Kaydetme Hatası

1. Tarayıcı storage alanını kontrol edin
2. Veri boyutunu kontrol edin
3. JSON formatını kontrol edin

### Admin Paneli Erişim

1. `/admin` URL'sine gidin
2. Gerekirse giriş yapın
3. Yetkilendirme ayarlarını kontrol edin

## 📞 Destek

Sorun yaşarsanız:

1. Console hatalarını kontrol edin
2. Test fonksiyonlarını çalıştırın
3. Local storage'ı temizleyip yeniden deneyin
4. Tarayıcıyı yeniden başlatın

---

**Not**: Bu sistem test amaçlıdır. Prodüksiyon ortamında gerçek bir veritabanı kullanmanız önerilir. 