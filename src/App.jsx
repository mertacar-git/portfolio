import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';


// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import ErrorBoundary from './components/ErrorBoundary';
import ThemeProvider from './contexts/ThemeContext';
import ToastProvider from './contexts/ToastContext';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';

// Admin Pages (Hidden from users)
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminBlog from './pages/admin/AdminBlog';
import AdminSettings from './pages/admin/AdminSettings';
import AdminSkills from './pages/admin/AdminSkills';
import AdminAchievements from './pages/admin/AdminAchievements';
import AdminHomepage from './pages/admin/AdminHomepage';
import AdminAnalytics from './pages/admin/AdminAnalytics';

// Utils
import { ProtectedRoute } from './utils/auth';
import { userPreferences } from './utils/dataManager';
import { analytics } from './utils/dataManager';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize app
    const initializeApp = async () => {
      try {
        // Set initial theme
        const savedTheme = userPreferences.getTheme();
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        
        // Track page view
        analytics.incrementPageView('app');
        
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIsLoading(false);
      } catch (error) {
        console.error('App initialization error:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Yükleniyor...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Header />
              <main className="pt-16">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:id" element={<BlogPost />} />
                  <Route path="/contact" element={<Contact />} />
                  
                  {/* Hidden Admin Routes - Only accessible via direct URL */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/dashboard" element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/projects" element={
                    <ProtectedRoute>
                      <AdminProjects />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/blog" element={
                    <ProtectedRoute>
                      <AdminBlog />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/settings" element={
                    <ProtectedRoute>
                      <AdminSettings />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/skills" element={
                    <ProtectedRoute>
                      <AdminSkills />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/achievements" element={
                    <ProtectedRoute>
                      <AdminAchievements />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/homepage" element={
                    <ProtectedRoute>
                      <AdminHomepage />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/analytics" element={
                    <ProtectedRoute>
                      <AdminAnalytics />
                    </ProtectedRoute>
                  } />
                  
                  {/* 404 Route */}
                  <Route path="*" element={
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Sayfa bulunamadı</p>
                        <Link to="/" className="btn-primary">
                          Ana Sayfaya Dön
                        </Link>
                      </div>
                    </div>
                  } />
                </Routes>
              </main>
              
              <Footer />
              <ScrollProgress />
            </div>
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App; 