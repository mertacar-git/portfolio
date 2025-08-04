import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ExternalLink,
  Github,
  Filter,
  Search
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
    <div className="min-h-screen bg-aggressive-black text-aggressive-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-aggressive-white mb-4">
            Portfolio
          </h1>
          <p className="text-xl text-aggressive-gray font-bold max-w-2xl mx-auto">
            Geliştirdiğim projeler ve çalışmalarım
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-aggressive-gray" />
                <input
                  type="text"
                  placeholder="Proje ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-primary w-full pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all duration-200 hover-aggressive ${
                    selectedCategory === category
                      ? 'bg-aggressive-white text-aggressive-black'
                      : 'bg-aggressive-black text-aggressive-white border-2 border-aggressive-white hover:bg-aggressive-white hover:text-aggressive-black'
                  }`}
                >
                  {getCategoryName(category)}
                </button>
              ))}
            </div>
          </div>

          {/* Technology Filter */}
          {allTechnologies.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-5 h-5 text-aggressive-white" />
                <span className="text-aggressive-white font-bold">Teknolojiler:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTechnologies.map((technology) => (
                  <button
                    key={technology}
                    onClick={() => handleTechnologyToggle(technology)}
                    className={`px-3 py-1 rounded-full text-sm font-bold transition-all duration-200 hover-aggressive ${
                      selectedTechnologies.includes(technology)
                        ? 'bg-aggressive-white text-aggressive-black'
                        : 'bg-aggressive-black text-aggressive-white border border-aggressive-white hover:bg-aggressive-white hover:text-aggressive-black'
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
            <div className="mt-4">
              <button
                onClick={clearFilters}
                className="text-aggressive-gray hover:text-aggressive-white font-bold transition-colors duration-200"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card hover-aggressive group"
            >
              {/* Project Image */}
              {project.image && (
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {project.featured && (
                    <div className="absolute top-2 right-2 bg-aggressive-white text-aggressive-black px-2 py-1 rounded text-sm font-bold">
                      Öne Çıkan
                    </div>
                  )}
                </div>
              )}

              {/* Project Info */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-aggressive-white mb-2">
                  {project.title}
                </h3>
                <p className="text-aggressive-gray mb-4 font-bold">
                  {project.description}
                </p>

                {/* Technologies */}
                {project.technologies && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-aggressive-black text-aggressive-white text-xs rounded border border-aggressive-white font-bold"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-aggressive-black text-aggressive-white text-xs rounded border border-aggressive-white font-bold">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Project Links */}
                <div className="flex gap-2">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-sm py-2 px-3 inline-flex items-center space-x-1"
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
                      className="btn-secondary text-sm py-2 px-3 inline-flex items-center space-x-1"
                    >
                      <Github className="w-4 h-4" />
                      <span>Kod</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-aggressive-gray text-lg font-bold">
              Seçilen kriterlere uygun proje bulunamadı.
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary mt-4"
            >
              Tüm Projeleri Göster
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Portfolio; 