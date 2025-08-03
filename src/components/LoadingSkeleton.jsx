import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton = ({ type = 'card', count = 1, className = '' }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
            </div>
          </div>
        );

      case 'project':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-300 dark:bg-gray-600"></div>
            <div className="p-6">
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3"></div>
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-16"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-20"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-14"></div>
              </div>
            </div>
          </div>
        );

      case 'blog':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-300 dark:bg-gray-600"></div>
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-3">
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
              </div>
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3"></div>
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-12"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-16"></div>
                </div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
              </div>
            </div>
          </div>
        );

      case 'skill':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-gray-300 dark:bg-gray-600 h-2 rounded-full w-3/4"></div>
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="p-6">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-6"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/6"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/6"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'spinner':
        return (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        );

      default:
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        );
    }
  };

  if (count === 1) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={className}
      >
        {renderSkeleton()}
      </motion.div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </div>
  );
};

export default LoadingSkeleton; 