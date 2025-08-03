import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES, getPublicRoutes, getAdminRoutes } from '../config/routes';
import { ProtectedRoute } from '../utils/auth';
import LoadingSkeleton from './LoadingSkeleton';

// Lazy loading için component mapping
const componentMap = {
  // Ana sayfalar
  'Home': lazy(() => import('../pages/Home')),
  'About': lazy(() => import('../pages/About')),
  'Portfolio': lazy(() => import('../pages/Portfolio')),
  'Blog': lazy(() => import('../pages/Blog')),
  'BlogPost': lazy(() => import('../pages/BlogPost')),
  'Contact': lazy(() => import('../pages/Contact')),
  
  // Admin sayfaları
  'AdminLogin': lazy(() => import('../pages/admin/AdminLogin')),
  'AdminDashboard': lazy(() => import('../pages/admin/AdminDashboard')),
  'AdminProjects': lazy(() => import('../pages/admin/AdminProjects')),
  'AdminBlog': lazy(() => import('../pages/admin/AdminBlog')),
  'AdminSettings': lazy(() => import('../pages/admin/AdminSettings')),
  'AdminSkills': lazy(() => import('../pages/admin/AdminSkills')),
  'AdminAchievements': lazy(() => import('../pages/admin/AdminAchievements')),
  'AdminHomepage': lazy(() => import('../pages/admin/AdminHomepage')),
  'AdminAnalytics': lazy(() => import('../pages/admin/AdminAnalytics')),
  'AdminProfile': lazy(() => import('../pages/admin/AdminProfile')),
  
  // 404 sayfası
  'NotFound': lazy(() => import('../components/NotFound'))
};

// Error fallback component
const ErrorFallback = ({ componentName }) => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl">⚠️</span>
      </div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Sayfa Yüklenemedi
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {componentName} bileşeni yüklenirken bir hata oluştu.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="btn-primary"
      >
        Sayfayı Yenile
      </button>
    </div>
  </div>
);

// Component yükleyici with error handling
const loadComponent = (componentName) => {
  const Component = componentMap[componentName];
  if (!Component) {
    console.error(`Component not found: ${componentName}`);
    return () => <ErrorFallback componentName={componentName} />;
  }
  
  // Wrap component with error boundary
  const WrappedComponent = (props) => (
    <React.Suspense fallback={<LoadingSkeleton />}>
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    </React.Suspense>
  );
  
  return WrappedComponent;
};

// Simple Error Boundary for individual components
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback componentName="Unknown" />;
    }
    return this.props.children;
  }
}

// Rota renderer
const RouteRenderer = () => {
  // Public rotaları al
  const publicRoutes = getPublicRoutes();
  
  // Admin rotalarını al
  const adminRoutes = getAdminRoutes();

  return (
    <Routes>
      {/* Public Routes */}
      {publicRoutes.map((route) => {
        const Component = loadComponent(route.component);
        
        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              <Suspense fallback={<LoadingSkeleton />}>
                <Component />
              </Suspense>
            }
          />
        );
      })}
      
      {/* Admin Routes */}
      {adminRoutes.map((route) => {
        const Component = loadComponent(route.component);
        
        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSkeleton />}>
                  <Component />
                </Suspense>
              </ProtectedRoute>
            }
          />
        );
      })}
      
      {/* 404 Route */}
      <Route
        path="*"
        element={
          <Suspense fallback={<LoadingSkeleton />}>
            <NotFound />
          </Suspense>
        }
      />
    </Routes>
  );
};

// 404 sayfası component'i
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Sayfa bulunamadı
        </p>
        <p className="text-gray-500 dark:text-gray-500 mb-8">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <a 
          href="/" 
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          Ana Sayfaya Dön
        </a>
      </div>
    </div>
  );
};

export default RouteRenderer; 