import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ExternalLink,
  Github,
  Filter,
  Search,
  Calendar,
  Tag
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { projects as defaultProjects } from '../data/projects';
import { analytics } from '../utils/dataManager';

const Portfolio = () => {
  const [projects, setProjects] = useState(defaultProjects);
  const [filteredProjects, setFilteredProjects] = useState(defaultProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);

  useEffect(() => {
    analytics.incrementPageView('portfolio');
    analytics.trackUniqueVisitor();
    loadProjects();
  }, []);

  const loadProjects = () => {
    const savedProjects = storageService.getData('projects');
    if (savedProjects && savedProjects.length > 0) {
      setProjects(savedProjects);
      setFilteredProjects(savedProjects);
    } else {
      setProjects(defaultProjects);
      setFilteredProjects(defaultProjects);
      storageService.saveData('projects', defaultProjects);
    }
  };

  // Tüm teknolojileri topla
  const allTechnologies = [...new Set(
    projects.flatMap(project => project.technologies || [])
  )].filter(Boolean);

  // Kategorileri topla
  const categories = ['all', ...new Set(projects.map(project => project.category).filter(Boolean))];

  useEffect(() => {
    let filtered = projects;

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.technologies && project.technologies.some(tech => 
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    // Kategori filtresi
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Teknoloji filtresi
    if (selectedTechnologies.length > 0) {
      filtered = filtered.filter(project =>
        project.technologies && selectedTechnologies.every(tech =>
          project.technologies.includes(tech)
        )
      );
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedCategory, selectedTechnologies]);

  const handleTechnologyToggle = (technology) => {
    setSelectedTechnologies(prev =>
      prev.includes(technology)
        ? prev.filter(tech => tech !== technology)
        : [...prev, technology]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedTechnologies([]);
  };

  const getCategoryName = (category) => {
    const categoryNames = {
      'web': 'Web',
      'mobile': 'Mobil',
      'desktop': 'Masaüstü',
      'other': 'Diğer'
    };
    return categoryNames[category] || category;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Portföy
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Geliştirdiğim projeler ve çalışmalarım
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="section-padding bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container-max">
          <div className="space-y-6">
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Proje ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {category === 'all' ? 'Tümü' : getCategoryName(category)}
                </button>
              ))}
            </div>

            {/* Technology Filter */}
            {allTechnologies.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
                  Teknoloji Filtresi
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {allTechnologies.map(technology => (
                    <button
                      key={technology}
                      onClick={() => handleTechnologyToggle(technology)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                        selectedTechnologies.includes(technology)
                          ? 'bg-secondary-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {technology}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clear Filters */}
            {(searchTerm || selectedCategory !== 'all' || selectedTechnologies.length > 0) && (
              <div className="text-center">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  Filtreleri Temizle
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="container-max">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Proje Bulunamadı
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Arama kriterlerinize uygun proje bulunamadı.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Project Image */}
                  <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl font-bold text-gray-400">
                          {project.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded">
                        {getCategoryName(project.category)}
                      </span>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.slice(0, 3).map(tech => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Project Links */}
                    <div className="flex space-x-3">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary flex-1 inline-flex items-center justify-center space-x-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Demo</span>
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary flex-1 inline-flex items-center justify-center space-x-2"
                        >
                          <Github className="w-4 h-4" />
                          <span>Kod</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Portfolio; 