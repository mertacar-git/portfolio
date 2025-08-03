import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES, getRouteByPath, getRouteByPathPattern } from '../config/routes';

const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Mevcut rota bilgisini al
  const getCurrentRoute = useCallback(() => {
    return getRouteByPathPattern(location.pathname);
  }, [location.pathname]);

  // Belirli bir rotaya git
  const goTo = useCallback((path, options = {}) => {
    const { replace = false, state = null } = options;
    
    if (replace) {
      navigate(path, { replace: true, state });
    } else {
      navigate(path, { state });
    }
  }, [navigate]);

  // Ana sayfaya git
  const goHome = useCallback(() => {
    goTo(ROUTES.HOME.path);
  }, [goTo]);

  // Hakkımda sayfasına git
  const goToAbout = useCallback(() => {
    goTo(ROUTES.ABOUT.path);
  }, [goTo]);

  // Portfolio sayfasına git
  const goToPortfolio = useCallback(() => {
    goTo(ROUTES.PORTFOLIO.path);
  }, [goTo]);

  // Blog sayfasına git
  const goToBlog = useCallback(() => {
    goTo(ROUTES.BLOG.path);
  }, [goTo]);

  // Blog yazısına git
  const goToBlogPost = useCallback((id) => {
    goTo(ROUTES.BLOG_POST.path.replace(':id', id));
  }, [goTo]);

  // İletişim sayfasına git
  const goToContact = useCallback(() => {
    goTo(ROUTES.CONTACT.path);
  }, [goTo]);

  // Admin paneline git
  const goToAdmin = useCallback(() => {
    goTo(ROUTES.ADMIN_DASHBOARD.path);
  }, [goTo]);

  // Admin giriş sayfasına git
  const goToAdminLogin = useCallback(() => {
    goTo(ROUTES.ADMIN_LOGIN.path);
  }, [goTo]);

  // Admin projeler sayfasına git
  const goToAdminProjects = useCallback(() => {
    goTo(ROUTES.ADMIN_PROJECTS.path);
  }, [goTo]);

  // Admin blog sayfasına git
  const goToAdminBlog = useCallback(() => {
    goTo(ROUTES.ADMIN_BLOG.path);
  }, [goTo]);

  // Admin ayarlar sayfasına git
  const goToAdminSettings = useCallback(() => {
    goTo(ROUTES.ADMIN_SETTINGS.path);
  }, [goTo]);

  // Admin yetenekler sayfasına git
  const goToAdminSkills = useCallback(() => {
    goTo(ROUTES.ADMIN_SKILLS.path);
  }, [goTo]);

  // Admin başarılar sayfasına git
  const goToAdminAchievements = useCallback(() => {
    goTo(ROUTES.ADMIN_ACHIEVEMENTS.path);
  }, [goTo]);

  // Admin ana sayfa yönetimi sayfasına git
  const goToAdminHomepage = useCallback(() => {
    goTo(ROUTES.ADMIN_HOMEPAGE.path);
  }, [goTo]);

  // Admin analitik sayfasına git
  const goToAdminAnalytics = useCallback(() => {
    goTo(ROUTES.ADMIN_ANALYTICS.path);
  }, [goTo]);

  // Admin profil resmi sayfasına git
  const goToAdminProfile = useCallback(() => {
    goTo(ROUTES.ADMIN_PROFILE.path);
  }, [goTo]);

  // Geri git
  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // İleri git
  const goForward = useCallback(() => {
    navigate(1);
  }, [navigate]);

  // Belirli bir adım git
  const goToStep = useCallback((step) => {
    navigate(step);
  }, [navigate]);

  // Mevcut rotanın aktif olup olmadığını kontrol et
  const isActive = useCallback((path) => {
    return location.pathname === path;
  }, [location.pathname]);

  // Rota pattern'ine göre aktif olup olmadığını kontrol et
  const isActivePattern = useCallback((pattern) => {
    if (pattern.includes(':')) {
      const routePattern = pattern.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(location.pathname);
    }
    return location.pathname === pattern;
  }, [location.pathname]);

  // Mevcut rotanın admin rotası olup olmadığını kontrol et
  const isAdminRoute = useCallback(() => {
    return location.pathname.startsWith('/admin');
  }, [location.pathname]);

  // Mevcut rotanın public rotası olup olmadığını kontrol et
  const isPublicRoute = useCallback(() => {
    return !location.pathname.startsWith('/admin');
  }, [location.pathname]);

  // Rota geçmişini al
  const getHistory = useCallback(() => {
    return window.history;
  }, []);

  // URL'i güncelle (sayfa yenilemeden)
  const updateUrl = useCallback((path, options = {}) => {
    const { replace = true, state = null } = options;
    goTo(path, { replace, state });
  }, [goTo]);

  // Query parametrelerini al
  const getQueryParams = useCallback(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  // Query parametresi ekle/güncelle
  const setQueryParam = useCallback((key, value) => {
    const params = new URLSearchParams(location.search);
    params.set(key, value);
    const newUrl = `${location.pathname}?${params.toString()}`;
    goTo(newUrl, { replace: true });
  }, [location.pathname, location.search, goTo]);

  // Query parametresi kaldır
  const removeQueryParam = useCallback((key) => {
    const params = new URLSearchParams(location.search);
    params.delete(key);
    const newUrl = params.toString() 
      ? `${location.pathname}?${params.toString()}`
      : location.pathname;
    goTo(newUrl, { replace: true });
  }, [location.pathname, location.search, goTo]);

  // Hash'i al
  const getHash = useCallback(() => {
    return location.hash;
  }, [location.hash]);

  // Hash'i ayarla
  const setHash = useCallback((hash) => {
    const newUrl = `${location.pathname}${location.search}${hash}`;
    goTo(newUrl, { replace: true });
  }, [location.pathname, location.search, goTo]);

  return {
    // Mevcut durum
    currentPath: location.pathname,
    currentRoute: getCurrentRoute(),
    isAdminRoute: isAdminRoute(),
    isPublicRoute: isPublicRoute(),
    
    // Navigasyon fonksiyonları
    goTo,
    goHome,
    goToAbout,
    goToPortfolio,
    goToBlog,
    goToBlogPost,
    goToContact,
    goToAdmin,
    goToAdminLogin,
    goToAdminProjects,
    goToAdminBlog,
    goToAdminSettings,
    goToAdminSkills,
    goToAdminAchievements,
    goToAdminHomepage,
    goToAdminAnalytics,
    goToAdminProfile,
    goBack,
    goForward,
    goToStep,
    
    // Kontrol fonksiyonları
    isActive,
    isActivePattern,
    
    // URL yönetimi
    updateUrl,
    getQueryParams,
    setQueryParam,
    removeQueryParam,
    getHash,
    setHash,
    getHistory
  };
};

export default useNavigation; 