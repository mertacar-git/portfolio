import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  GraduationCap,
  Briefcase,
  Award,
  Download,
  Users
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { personalInfo as defaultPersonalInfo } from '../data/personalInfo';
import { analytics } from '../utils/dataManager';
import useProfileImage from '../hooks/useProfileImage';

const About = () => {
  const [personalInfo, setPersonalInfo] = useState(defaultPersonalInfo);
  const { getImageStyle, getImageUrl } = useProfileImage();

  useEffect(() => {
    analytics.incrementPageView('about');
    analytics.trackUniqueVisitor();
    loadPersonalInfo();
  }, []);

  const loadPersonalInfo = () => {
    const savedPersonalInfo = storageService.getData('personalInfo');
    if (savedPersonalInfo) {
      setPersonalInfo(savedPersonalInfo);
    } else {
      setPersonalInfo(defaultPersonalInfo);
      storageService.saveData('personalInfo', defaultPersonalInfo);
    }
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
              Hakkımda
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {personalInfo.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Content */}
      <section className="section-padding bg-white dark:bg-gray-800">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center lg:text-left"
            >
              <div className="relative inline-block">
                <div className="w-64 h-64 mx-auto lg:mx-0 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-2xl">
                  <img
                    src={getImageUrl()}
                    alt="Mert Acar"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    style={getImageStyle()}
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white dark:border-gray-700"></div>
              </div>
            </motion.div>

            {/* About Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Merhaba, Ben {personalInfo.name}
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p 
                  className={`text-${personalInfo.aboutFormat?.fontSize || 'lg'} text-${personalInfo.aboutFormat?.textColor || 'gray-600'} dark:text-${personalInfo.aboutFormat?.darkTextColor || 'gray-300'} leading-${personalInfo.aboutFormat?.lineHeight || 'relaxed'} text-${personalInfo.aboutFormat?.textAlign || 'left'} font-${personalInfo.aboutFormat?.fontWeight || 'normal'} tracking-${personalInfo.aboutFormat?.letterSpacing || 'normal'} mb-${personalInfo.aboutFormat?.paragraphSpacing || '6'}`}
                >
                  {personalInfo.about}
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    {personalInfo.email}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <a
                    href={`tel:${personalInfo.phone}`}
                    className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    {personalInfo.phone}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {personalInfo.location}
                  </span>
                </div>
              </div>

              {/* Download CV Button */}
              <button className="btn-primary inline-flex items-center space-x-2">
                <Download className="w-5 h-5" />
                <span>CV İndir</span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Yeteneklerim
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Geliştirdiğim teknolojiler ve seviyelerim
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {personalInfo.skills?.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {skill.name}
                  </h3>
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    {skill.level}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="bg-gradient-to-r from-primary-600 to-secondary-600 h-2 rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="section-padding bg-white dark:bg-gray-800">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              İş Deneyimi
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Kariyer yolculuğum ve deneyimlerim
            </p>
          </motion.div>

          <div className="space-y-8">
            {personalInfo.experience?.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="flex items-start space-x-6"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {exp.title}
                  </h3>
                  <p className="text-lg text-primary-600 dark:text-primary-400 mb-2">
                    {exp.company}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {exp.period}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Eğitim
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Akademik geçmişim ve sertifikalarım
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {personalInfo.education.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary-100 dark:bg-secondary-900/20 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {edu.degree}
                    </h3>
                    <p className="text-secondary-600 dark:text-secondary-400 mb-2">
                      {edu.school}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {edu.year}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {edu.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* References Section */}
      {personalInfo.references && personalInfo.references.length > 0 && (
        <section className="section-padding bg-white dark:bg-gray-800">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Referanslar
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Kariyer yolculuğumda bana mentorluk yapan değerli kişiler
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {personalInfo.references.map((ref, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-accent-100 dark:bg-accent-900/20 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-accent-600 dark:text-accent-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {ref.name}
                      </h3>
                      <p className="text-accent-600 dark:text-accent-400 text-sm mb-2">
                        {ref.title}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                        {ref.company}
                      </p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-3 h-3 text-gray-500" />
                          <a
                            href={`tel:${ref.phone}`}
                            className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                          >
                            {ref.phone}
                          </a>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-3 h-3 text-gray-500" />
                          <a
                            href={`mailto:${ref.email}`}
                            className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                          >
                            {ref.email}
                          </a>
                        </div>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-3 italic">
                        {ref.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certifications Section */}
      {personalInfo.certifications && personalInfo.certifications.length > 0 && (
        <section className="section-padding bg-white dark:bg-gray-900">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Sertifikalarım
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Profesyonel gelişimim için aldığım sertifikalar
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {personalInfo.certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {cert.name}
                      </h3>
                      <p className="text-primary-600 dark:text-primary-400 text-sm mb-2">
                        {cert.issuer}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {cert.year}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {cert.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Technologies Section */}
      {personalInfo.technologies && (
        <section className="section-padding bg-white dark:bg-gray-800">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Teknolojiler
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Kullandığım teknolojiler ve araçlar
              </p>
            </motion.div>

            <div className="space-y-8">
              {Object.entries(personalInfo.technologies).map(([category, techs], categoryIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 capitalize">
                    {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {techs.map((tech, techIndex) => (
                      <motion.span
                        key={tech}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: categoryIndex * 0.1 + techIndex * 0.05 }}
                        className="px-3 py-2 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-full text-sm font-medium shadow-sm border border-gray-200 dark:border-gray-500 hover:shadow-md transition-shadow duration-200"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default About; 