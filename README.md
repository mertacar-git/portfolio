# Mert Kişisel Web Sitesi

Modern ve kullanıcı dostu kişisel web sitesi. React, Tailwind CSS ve Framer Motion kullanılarak geliştirilmiştir.

## ✨ Özellikler

### 🎨 Kullanıcı Deneyimi
- **Dark/Light Tema**: Otomatik tema değiştirme ve tercih kaydetme
- **Global Arama**: Ctrl+K kısayolu ile projeler, blog yazıları ve yeteneklerde arama
- **Scroll Progress**: Sayfa okuma ilerlemesini gösteren çubuk
- **Back to Top**: Sayfanın üstüne dönmek için animasyonlu buton
- **Loading Skeletons**: Veri yüklenirken gösterilen iskelet ekranlar
- **Error Boundary**: Hata durumlarında kullanıcı dostu mesajlar
- **Keyboard Navigation**: Klavye ile navigasyon desteği

### 📱 Responsive Tasarım
- Mobil, tablet ve masaüstü uyumlu
- Touch-friendly arayüz
- Optimized performance

### 🔧 Admin Paneli
- **Dashboard**: Genel istatistikler ve hızlı işlemler
- **Proje Yönetimi**: Proje ekleme, düzenleme, silme
- **Blog Yönetimi**: Blog yazısı ekleme, düzenleme, silme
- **Ana Sayfa Yönetimi**: Tüm içerikleri tek yerden düzenleme
- **Analytics**: Canlı site istatistikleri
- **Yetenekler & Başarılar**: Kişisel yetenekler ve başarıları yönetme

### 🎯 Performans
- Lazy loading
- Optimized images
- Smooth animations
- Fast page transitions

## 🚀 Kurulum

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Geliştirme sunucusunu başlatın:**
```bash
npm start
```

3. **Production build:**
```bash
npm run build
```

## 📁 Proje Yapısı

```
src/
├── components/          # Yeniden kullanılabilir bileşenler
│   ├── Header.jsx      # Navigasyon ve arama
│   ├── Footer.jsx      # Footer ve back-to-top
│   ├── LoadingSkeleton.jsx  # Yükleme iskeletleri
│   ├── NoResults.jsx   # Sonuç bulunamadı bileşeni
│   ├── ScrollProgress.jsx   # Scroll ilerleme çubuğu
│   └── ErrorBoundary.jsx    # Hata yakalama
├── pages/              # Sayfa bileşenleri
│   ├── Home.jsx        # Ana sayfa
│   ├── About.jsx       # Hakkımda
│   ├── Portfolio.jsx   # Projeler
│   ├── Blog.jsx        # Blog listesi
│   ├── BlogPost.jsx    # Blog detayı
│   ├── Contact.jsx     # İletişim
│   └── admin/          # Admin sayfaları
├── contexts/           # React Context'leri
├── data/              # Statik veriler
├── services/          # API servisleri
├── utils/             # Yardımcı fonksiyonlar
└── styles/            # CSS stilleri
```

## 🎨 Tema Sistemi

Site iki tema modunu destekler:
- **Light Mode**: Açık tema
- **Dark Mode**: Koyu tema (varsayılan)

Tema tercihi localStorage'da saklanır ve sayfa yenilendiğinde korunur.

## 🔍 Arama Sistemi

Global arama özelliği şunları destekler:
- **Projeler**: Başlık, açıklama ve teknolojilerde arama
- **Blog Yazıları**: Başlık, özet, içerik ve etiketlerde arama
- **Yetenekler**: Yetenek adlarında arama

### Klavye Kısayolları
- `Ctrl+K` (veya `Cmd+K`): Arama modalını aç
- `ESC`: Arama modalını kapat
- `↑↓`: Sonuçlar arasında gezin
- `Enter`: Seçili sonucu aç

## 📊 Admin Paneli

Admin paneline `/admin/login` adresinden erişebilirsiniz.

### Özellikler:
- **Güvenli Giriş**: Basit şifre koruması
- **Dashboard**: Genel istatistikler
- **İçerik Yönetimi**: Tüm site içeriklerini düzenleme
- **Analytics**: Canlı ziyaretçi istatistikleri
- **Yedekleme**: Veri dışa aktarma/aktarma

## 🎭 Animasyonlar

Framer Motion kullanılarak eklenen animasyonlar:
- Sayfa geçişleri
- Hover efektleri
- Loading states
- Scroll-triggered animations
- Micro-interactions

## 🔧 Özelleştirme

### Renkler
`tailwind.config.js` dosyasında tema renklerini özelleştirebilirsiniz:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        // ... diğer tonlar
        900: '#1e3a8a',
      },
      secondary: {
        // ... secondary renkler
      }
    }
  }
}
```

### İçerik
`src/data/` klasöründeki dosyaları düzenleyerek site içeriğini değiştirebilirsiniz:
- `personalInfo.js`: Kişisel bilgiler
- `projects.js`: Proje listesi
- `blogPosts.js`: Blog yazıları
- `siteConfig.js`: Site ayarları

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### GitHub Pages
1. Repository'yi GitHub'a push edin
2. Settings > Pages > Source: Deploy from a branch
3. Branch: main, folder: / (root)

### Netlify
1. Netlify'e bağlayın
2. Build command: `npm run build`
3. Publish directory: `build`

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **Email**: mertacar011@gmail.com
- **LinkedIn**: [Mert Açar](https://linkedin.com/in/mertacar)
- **GitHub**: [mertacar-git](https://github.com/mertacar-git)

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın! 
## Aerospace portfolio update

Six validated aerospace projects are featured in the project catalog. [Try the laboratory](https://mertacar-git.github.io/portfolio/lab/index.html). Browser demos, screenshots and short videos are included in `public/`. The project migration backs up existing local project data and preserves custom entries. Run `npm test -- --watchAll=false --runInBand` and `npm run build` to validate changes.
