// Merkezi rota yapılandırması
export const ROUTES = {
  // Ana sayfalar
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
  
  ABOUT: {
    path: '/about',
    name: 'Hakkımda',
    icon: 'User',
    component: 'About',
    isPublic: true,
    isNavVisible: true,
    order: 2,
    meta: {
      title: 'Hakkımda',
      description: 'Mert Açar hakkında detaylı bilgi'
    }
  },
  
  PORTFOLIO: {
    path: '/portfolio',
    name: 'Portfolio',
    icon: 'Briefcase',
    component: 'Portfolio',
    isPublic: true,
    isNavVisible: true,
    order: 3,
    meta: {
      title: 'Portfolio',
      description: 'Mert Açar projeleri ve çalışmaları'
    }
  },
  
  BLOG: {
    path: '/blog',
    name: 'Blog',
    icon: 'BookOpen',
    component: 'Blog',
    isPublic: true,
    isNavVisible: true,
    order: 4,
    meta: {
      title: 'Blog',
      description: 'Mert Açar blog yazıları'
    }
  },
  
  BLOG_POST: {
    path: '/blog/:id',
    name: 'Blog Yazısı',
    icon: 'BookOpen',
    component: 'BlogPost',
    isPublic: true,
    isNavVisible: false,
    order: 5,
    meta: {
      title: 'Blog Yazısı',
      description: 'Blog yazısı detayı'
    }
  },
  
  CONTACT: {
    path: '/contact',
    name: 'İletişim',
    icon: 'Mail',
    component: 'Contact',
    isPublic: true,
    isNavVisible: true,
    order: 6,
    meta: {
      title: 'İletişim',
      description: 'Mert Açar ile iletişime geçin'
    }
  },
  
  // Admin sayfaları
  ADMIN_LOGIN: {
    path: '/admin/login',
    name: 'Admin Giriş',
    icon: 'Lock',
    component: 'AdminLogin',
    isPublic: true,
    isNavVisible: false,
    order: 100,
    meta: {
      title: 'Admin Giriş',
      description: 'Admin paneli giriş sayfası'
    }
  },
  
  ADMIN_DASHBOARD: {
    path: '/admin',
    name: 'Admin Panel',
    icon: 'LayoutDashboard',
    component: 'AdminDashboard',
    isPublic: false,
    isNavVisible: false,
    order: 101,
    meta: {
      title: 'Admin Panel',
      description: 'Admin paneli ana sayfa'
    }
  },
  
  ADMIN_DASHBOARD_ALT: {
    path: '/admin/dashboard',
    name: 'Admin Panel',
    icon: 'LayoutDashboard',
    component: 'AdminDashboard',
    isPublic: false,
    isNavVisible: false,
    order: 102,
    meta: {
      title: 'Admin Panel',
      description: 'Admin paneli ana sayfa'
    }
  },
  
  ADMIN_PROJECTS: {
    path: '/admin/projects',
    name: 'Projeler Yönetimi',
    icon: 'Briefcase',
    component: 'AdminProjects',
    isPublic: false,
    isNavVisible: false,
    order: 103,
    meta: {
      title: 'Projeler Yönetimi',
      description: 'Projeleri yönet'
    }
  },
  
  ADMIN_BLOG: {
    path: '/admin/blog',
    name: 'Blog Yönetimi',
    icon: 'BookOpen',
    component: 'AdminBlog',
    isPublic: false,
    isNavVisible: false,
    order: 104,
    meta: {
      title: 'Blog Yönetimi',
      description: 'Blog yazılarını yönet'
    }
  },
  
  ADMIN_SETTINGS: {
    path: '/admin/settings',
    name: 'Site Ayarları',
    icon: 'Settings',
    component: 'AdminSettings',
    isPublic: false,
    isNavVisible: false,
    order: 105,
    meta: {
      title: 'Site Ayarları',
      description: 'Site genel ayarları'
    }
  },
  
  ADMIN_SKILLS: {
    path: '/admin/skills',
    name: 'Yetenekler Yönetimi',
    icon: 'Target',
    component: 'AdminSkills',
    isPublic: false,
    isNavVisible: false,
    order: 106,
    meta: {
      title: 'Yetenekler Yönetimi',
      description: 'Yetenekleri yönet'
    }
  },
  
  ADMIN_ACHIEVEMENTS: {
    path: '/admin/achievements',
    name: 'Başarılar Yönetimi',
    icon: 'Award',
    component: 'AdminAchievements',
    isPublic: false,
    isNavVisible: false,
    order: 107,
    meta: {
      title: 'Başarılar Yönetimi',
      description: 'Başarıları yönet'
    }
  },
  
  ADMIN_HOMEPAGE: {
    path: '/admin/homepage',
    name: 'Ana Sayfa Yönetimi',
    icon: 'Home',
    component: 'AdminHomepage',
    isPublic: false,
    isNavVisible: false,
    order: 108,
    meta: {
      title: 'Ana Sayfa Yönetimi',
      description: 'Ana sayfa içeriğini yönet'
    }
  },
  
  ADMIN_ANALYTICS: {
    path: '/admin/analytics',
    name: 'Analitik',
    icon: 'BarChart3',
    component: 'AdminAnalytics',
    isPublic: false,
    isNavVisible: false,
    order: 109,
    meta: {
      title: 'Analitik',
      description: 'Site analitikleri'
    }
  },
  
  ADMIN_PROFILE: {
    path: '/admin/profile',
    name: 'Profil Resmi',
    icon: 'Image',
    component: 'AdminProfile',
    isPublic: false,
    isNavVisible: false,
    order: 110,
    meta: {
      title: 'Profil Resmi',
      description: 'Profil resmini yönet'
    }
  },
  
  // 404 sayfası
  NOT_FOUND: {
    path: '*',
    name: 'Sayfa Bulunamadı',
    icon: 'AlertTriangle',
    component: 'NotFound',
    isPublic: true,
    isNavVisible: false,
    order: 999,
    meta: {
      title: '404 - Sayfa Bulunamadı',
      description: 'Aradığınız sayfa bulunamadı'
    }
  }
};

// Navigasyon için görünür rotaları al
export const getVisibleRoutes = () => {
  return Object.values(ROUTES)
    .filter(route => route.isNavVisible)
    .sort((a, b) => a.order - b.order);
};

// Public rotaları al
export const getPublicRoutes = () => {
  return Object.values(ROUTES)
    .filter(route => route.isPublic)
    .sort((a, b) => a.order - b.order);
};

// Admin rotalarını al
export const getAdminRoutes = () => {
  return Object.values(ROUTES)
    .filter(route => !route.isPublic && route.path.startsWith('/admin'))
    .sort((a, b) => a.order - b.order);
};

// Rota path'inden rota bilgisini al
export const getRouteByPath = (path) => {
  return Object.values(ROUTES).find(route => route.path === path);
};

// Rota path'inden rota bilgisini al (parametreli rotalar için)
export const getRouteByPathPattern = (path) => {
  return Object.values(ROUTES).find(route => {
    // Parametreli rotalar için pattern matching
    if (route.path.includes(':')) {
      const routePattern = route.path.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(path);
    }
    return route.path === path;
  });
};

// Rota meta bilgilerini al
export const getRouteMeta = (path) => {
  const route = getRouteByPathPattern(path);
  return route ? route.meta : null;
};

// Rota başlığını al
export const getRouteTitle = (path) => {
  const meta = getRouteMeta(path);
  return meta ? meta.title : 'Mert Açar';
};

// Rota açıklamasını al
export const getRouteDescription = (path) => {
  const meta = getRouteMeta(path);
  return meta ? meta.description : 'Mert Açar - Software Developer';
}; 