import React from 'react';
import { Link } from 'react-router-dom';
import { getVisibleRoutes } from '../config/routes';
import useNavigation from '../hooks/useNavigation';

// Icon mapping
const iconMap = {
  'Home': '🏠',
  'User': '👤',
  'Briefcase': '💼',
  'BookOpen': '📖',
  'Mail': '✉️',
  'Settings': '⚙️',
  'Target': '🎯',
  'Award': '🏆',
  'BarChart3': '📊',
  'Image': '🖼️',
  'LayoutDashboard': '📋',
  'Lock': '🔒',
  'AlertTriangle': '⚠️'
};

// Icon helper function
const getIcon = (iconName) => {
  return iconMap[iconName] || '📄';
};

const Navigation = ({ 
  variant = 'desktop', 
  onItemClick = null,
  className = '',
  showIcons = true,
  showLabels = true 
}) => {
  const { isActive, isActivePattern } = useNavigation();
  const visibleRoutes = getVisibleRoutes();

  const handleItemClick = (route) => {
    if (onItemClick) {
      onItemClick(route);
    }
  };

  const getActiveClass = (route) => {
    if (route.path.includes(':')) {
      return isActivePattern(route.path)
        ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
        : 'text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400';
    }
    
    return isActive(route.path)
      ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
      : 'text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400';
  };

  const getItemClass = (route) => {
    const baseClass = 'flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-200';
    const activeClass = getActiveClass(route);
    
    return `${baseClass} ${activeClass}`;
  };

  const getMobileItemClass = (route) => {
    const baseClass = 'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200';
    const activeClass = getActiveClass(route);
    
    return `${baseClass} ${activeClass}`;
  };

  if (variant === 'mobile') {
    return (
      <nav className={`space-y-2 ${className}`}>
        {visibleRoutes.map((route) => (
          <Link
            key={route.path}
            to={route.path}
            onClick={() => handleItemClick(route)}
            className={getMobileItemClass(route)}
          >
            {showIcons && (
              <span className="text-lg">{getIcon(route.icon)}</span>
            )}
            {showLabels && (
              <span className="font-medium">{route.name}</span>
            )}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className={`hidden md:flex items-center space-x-8 ${className}`}>
      {visibleRoutes.map((route) => (
        <Link
          key={route.path}
          to={route.path}
          onClick={() => handleItemClick(route)}
          className={getItemClass(route)}
        >
          {showIcons && (
            <span className="text-sm">{getIcon(route.icon)}</span>
          )}
          {showLabels && (
            <span>{route.name}</span>
          )}
        </Link>
      ))}
    </nav>
  );
};

// Breadcrumb navigation component
export const BreadcrumbNavigation = ({ className = '' }) => {
  const { currentPath, currentRoute, goHome } = useNavigation();
  
  if (!currentRoute || currentRoute.path === '/') {
    return null;
  }

  const breadcrumbs = [
    { name: 'Ana Sayfa', path: '/', icon: '🏠' },
    { name: currentRoute.name, path: currentRoute.path, icon: getIcon(currentRoute.icon) }
  ];

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`}>
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          {index > 0 && (
            <span className="text-gray-400 dark:text-gray-600">/</span>
          )}
          {index === breadcrumbs.length - 1 ? (
            <span className="text-gray-900 dark:text-white font-medium">
              {crumb.name}
            </span>
          ) : (
            <Link
              to={crumb.path}
              className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {crumb.name}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// Tab navigation component
export const TabNavigation = ({ 
  tabs, 
  activeTab, 
  onTabChange,
  className = '' 
}) => {
  return (
    <nav className={`flex space-x-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-1 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

// Pagination component
export const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = '' 
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  return (
    <nav className={`flex items-center justify-center space-x-2 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Önceki
      </button>
      
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            currentPage === page
              ? 'bg-primary-600 text-white'
              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Sonraki
      </button>
    </nav>
  );
};

export default Navigation; 