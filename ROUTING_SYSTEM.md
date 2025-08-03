# Yeni Sayfa Yönlendirme Sistemi

Bu dokümantasyon, web sitesi için sıfırdan yazılmış yeni sayfa yönlendirme sistemini açıklamaktadır.

## 🎯 Sistem Genel Bakış

Yeni routing sistemi aşağıdaki özellikleri içerir:

- **Merkezi Rota Yapılandırması**: Tüm rotalar tek bir dosyada tanımlanır
- **Tip Güvenliği**: TypeScript benzeri yapı ile rota tanımları
- **Lazy Loading**: Sayfa bileşenleri ihtiyaç duyulduğunda yüklenir
- **Programatik Navigasyon**: Hook tabanlı navigasyon sistemi
- **Breadcrumb Desteği**: Otomatik breadcrumb oluşturma
- **Admin/Public Ayrımı**: Güvenli rota yönetimi

## 📁 Dosya Yapısı

```
src/
├── config/
│   └── routes.js              # Merkezi rota yapılandırması
├── hooks/
│   └── useNavigation.js       # Navigasyon hook'u
├── components/
│   ├── RouteRenderer.jsx      # Rota renderer bileşeni
│   ├── Navigation.jsx         # Navigasyon bileşeni
│   └── NotFound.jsx           # 404 sayfası
└── App.jsx                    # Ana uygulama (güncellenmiş)
```

## 🔧 Ana Bileşenler

### 1. Merkezi Rota Yapılandırması (`src/config/routes.js`)

Tüm rotalar tek bir dosyada tanımlanır:

```javascript
export const ROUTES = {
  HOME: {
    path: '/',
    name: 'Ana Sayfa',
    icon: 'Home',
    component: 'Home',
    isPublic: true,
    isNavVisible: true,
    order: 1,
    meta: {
      title: 'Ana Sayfa',
      description: 'Mert Açar - Software Developer Ana Sayfası'
    }
  },
  // ... diğer rotalar
};
```

**Rota Özellikleri:**
- `path`: URL yolu
- `name`: Görünen isim
- `icon`: Navigasyon ikonu
- `component`: React bileşen adı
- `isPublic`: Public erişim (true/false)
- `isNavVisible`: Navigasyonda görünür (true/false)
- `order`: Sıralama
- `meta`: SEO ve meta bilgileri

### 2. Navigasyon Hook'u (`src/hooks/useNavigation.js`)

Programatik navigasyon için kullanılır:

```javascript
const { 
  goTo, 
  goHome, 
  goToAbout, 
  goToPortfolio,
  isActive,
  currentPath 
} = useNavigation();
```

**Temel Fonksiyonlar:**
- `goTo(path, options)`: Belirli bir rotaya git
- `goHome()`: Ana sayfaya git
- `goToAbout()`: Hakkımda sayfasına git
- `isActive(path)`: Rota aktif mi kontrol et
- `currentPath`: Mevcut rota yolu

### 3. Rota Renderer (`src/components/RouteRenderer.jsx`)

Rotaları dinamik olarak render eder:

```javascript
const RouteRenderer = () => {
  const publicRoutes = getPublicRoutes();
  const adminRoutes = getAdminRoutes();

  return (
    <Routes>
      {publicRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <Suspense fallback={<LoadingSkeleton />}>
              <Component />
            </Suspense>
          }
        />
      ))}
      {/* Admin routes with ProtectedRoute */}
    </Routes>
  );
};
```

### 4. Navigasyon Bileşeni (`src/components/Navigation.jsx`)

Farklı navigasyon türleri için kullanılır:

```javascript
// Desktop navigation
<Navigation variant="desktop" />

// Mobile navigation
<Navigation variant="mobile" onItemClick={closeMenu} />

// Breadcrumb navigation
<BreadcrumbNavigation />

// Tab navigation
<TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
```

## 🚀 Kullanım Örnekleri

### 1. Yeni Rota Ekleme

```javascript
// src/config/routes.js
export const ROUTES = {
  // ... mevcut rotalar
  NEW_PAGE: {
    path: '/new-page',
    name: 'Yeni Sayfa',
    icon: 'Star',
    component: 'NewPage',
    isPublic: true,
    isNavVisible: true,
    order: 7,
    meta: {
      title: 'Yeni Sayfa',
      description: 'Yeni sayfa açıklaması'
    }
  }
};
```

### 2. Programatik Navigasyon

```javascript
import useNavigation from '../hooks/useNavigation';

const MyComponent = () => {
  const { goTo, goHome, isActive } = useNavigation();

  const handleClick = () => {
    goTo('/about');
  };

  return (
    <div>
      <button onClick={goHome}>Ana Sayfa</button>
      <button onClick={handleClick}>Hakkımda</button>
      {isActive('/about') && <span>Aktif sayfa</span>}
    </div>
  );
};
```

### 3. Admin Sayfası Ekleme

```javascript
// src/config/routes.js
ADMIN_NEW: {
  path: '/admin/new',
  name: 'Yeni Admin Sayfası',
  icon: 'Settings',
  component: 'AdminNew',
  isPublic: false,
  isNavVisible: false,
  order: 111,
  meta: {
    title: 'Yeni Admin Sayfası',
    description: 'Admin paneli yeni sayfa'
  }
}
```

## 🔒 Güvenlik

### Admin Rotaları
- `isPublic: false` olan rotalar otomatik olarak `ProtectedRoute` ile sarılır
- Kullanıcı giriş yapmamışsa `/admin/login` sayfasına yönlendirilir

### Public Rotaları
- `isPublic: true` olan rotalar herkese açıktır
- Navigasyonda görünür olması için `isNavVisible: true` olmalıdır

## 📱 Responsive Tasarım

Navigasyon bileşeni otomatik olarak responsive davranır:

- **Desktop**: Yatay menü
- **Mobile**: Hamburger menü
- **Tablet**: Responsive grid

## 🎨 Özelleştirme

### Tema Desteği
Tüm navigasyon bileşenleri dark/light tema desteği ile gelir:

```javascript
// Dark mode classes otomatik olarak uygulanır
className="text-gray-900 dark:text-white"
```

### Animasyonlar
Framer Motion ile smooth animasyonlar:

```javascript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.1 }}
>
```

## 🔧 Yardımcı Fonksiyonlar

### Rota Yardımcıları

```javascript
import { 
  getVisibleRoutes, 
  getPublicRoutes, 
  getAdminRoutes,
  getRouteByPath,
  getRouteMeta 
} from '../config/routes';

// Görünür rotaları al
const visibleRoutes = getVisibleRoutes();

// Public rotaları al
const publicRoutes = getPublicRoutes();

// Rota meta bilgilerini al
const meta = getRouteMeta('/about');
```

### URL Yönetimi

```javascript
const { 
  getQueryParams, 
  setQueryParam, 
  removeQueryParam,
  getHash,
  setHash 
} = useNavigation();

// Query parametresi ekle
setQueryParam('page', '2');

// Hash değiştir
setHash('#section1');
```

## 🐛 Hata Ayıklama

### Yaygın Sorunlar

1. **Component bulunamadı hatası**
   - `componentMap`'e yeni bileşeni ekleyin
   - Import path'ini kontrol edin

2. **Rota çalışmıyor**
   - `ROUTES` objesinde doğru tanımlandığından emin olun
   - `isPublic` ve `isNavVisible` değerlerini kontrol edin

3. **Admin erişim sorunu**
   - `adminAuth.getUser()` fonksiyonunu kontrol edin
   - `ProtectedRoute` bileşeninin doğru çalıştığından emin olun

## 📈 Performans

### Lazy Loading
Tüm sayfa bileşenleri lazy loading ile yüklenir:

```javascript
const componentMap = {
  'Home': lazy(() => import('../pages/Home')),
  'About': lazy(() => import('../pages/About')),
  // ...
};
```

### Code Splitting
Her sayfa ayrı bir bundle olarak yüklenir, bu da performansı artırır.

## 🔄 Gelecek Geliştirmeler

1. **Nested Routes**: Alt rotalar desteği
2. **Route Guards**: Daha gelişmiş erişim kontrolü
3. **Route History**: Rota geçmişi yönetimi
4. **Route Analytics**: Rota bazlı analitik
5. **Route Caching**: Rota bazlı önbellekleme

## 📝 Notlar

- Tüm eski `useNavigate` kullanımları `useNavigation` hook'u ile değiştirildi
- `siteConfig.js`'den eski navigation array'i kaldırıldı
- Admin sayfaları yeni sisteme uyarlandı
- 404 sayfası yeniden tasarlandı

Bu yeni sistem daha maintainable, scalable ve performanslı bir routing çözümü sunar. 