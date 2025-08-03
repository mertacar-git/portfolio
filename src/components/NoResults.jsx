import React from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Briefcase, Tag, AlertCircle } from 'lucide-react';

const NoResults = ({ 
  type = 'general', 
  title = 'Sonuç bulunamadı', 
  description = 'Aradığınız kriterlere uygun sonuç bulunamadı.',
  action = null 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'search':
        return <Search className="w-12 h-12 text-gray-400" />;
      case 'projects':
        return <Briefcase className="w-12 h-12 text-gray-400" />;
      case 'blog':
        return <FileText className="w-12 h-12 text-gray-400" />;
      case 'skills':
        return <Tag className="w-12 h-12 text-gray-400" />;
      default:
        return <AlertCircle className="w-12 h-12 text-gray-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        {getIcon()}
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold text-gray-900 dark:text-white mb-2"
      >
        {title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 dark:text-gray-400 max-w-md"
      >
        {description}
      </motion.p>
      
      {action && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
};

export default NoResults; 