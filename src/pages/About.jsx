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
    <div className="min-h-screen bg-aggressive-black text-aggressive-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-aggressive-white mb-6">
            Hakkımda
          </h1>
          <p className="text-xl text-aggressive-gray font-bold max-w-3xl mx-auto">
            {personalInfo.subtitle}
          </p>
        </motion.div>

        {/* About Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <div className="relative inline-block">
              <div className="w-64 h-64 mx-auto lg:mx-0 rounded-full overflow-hidden border-4 border-aggressive-white shadow-aggressive-xl">
                <img
                  src={getImageUrl()}
                  alt="Mert Acar"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  style={getImageStyle()}
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-aggressive-white rounded-full border-4 border-aggressive-black"></div>
            </div>
          </motion.div>

          {/* About Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-aggressive-white mb-6">
              Merhaba, Ben {personalInfo.name}
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-aggressive-gray leading-relaxed text-left font-bold mb-6">
                {personalInfo.about}
              </p>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {personalInfo.email && (
                <div className="flex items-center space-x-3 p-3 bg-aggressive-black border border-aggressive-white rounded-lg">
                  <Mail className="w-5 h-5 text-aggressive-white" />
                  <span className="text-aggressive-white font-bold">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center space-x-3 p-3 bg-aggressive-black border border-aggressive-white rounded-lg">
                  <Phone className="w-5 h-5 text-aggressive-white" />
                  <span className="text-aggressive-white font-bold">{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center space-x-3 p-3 bg-aggressive-black border border-aggressive-white rounded-lg">
                  <MapPin className="w-5 h-5 text-aggressive-white" />
                  <span className="text-aggressive-white font-bold">{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.birthDate && (
                <div className="flex items-center space-x-3 p-3 bg-aggressive-black border border-aggressive-white rounded-lg">
                  <Calendar className="w-5 h-5 text-aggressive-white" />
                  <span className="text-aggressive-white font-bold">{personalInfo.birthDate}</span>
                </div>
              )}
            </div>

            {/* Download CV */}
            {personalInfo.cvUrl && (
              <a
                href={personalInfo.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary hover-aggressive inline-flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>CV İndir</span>
              </a>
            )}
          </motion.div>
        </div>

        {/* Skills Section */}
        {personalInfo.skills && personalInfo.skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-16"
          >
            <div className="card">
              <h2 className="text-3xl font-bold text-aggressive-white mb-8 text-center">
                Yeteneklerim
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {personalInfo.skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                    className="bg-aggressive-black border-2 border-aggressive-white rounded-lg p-6 hover-aggressive"
                  >
                    <h3 className="text-xl font-bold text-aggressive-white mb-3">
                      {skill.name}
                    </h3>
                    <div className="w-full bg-aggressive-black border border-aggressive-white rounded-full h-3 mb-3">
                      <div
                        className="bg-aggressive-white h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                    <p className="text-aggressive-gray font-bold">
                      {skill.level}%
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Experience Section */}
        {personalInfo.experience && personalInfo.experience.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-16"
          >
            <div className="card">
              <h2 className="text-3xl font-bold text-aggressive-white mb-8 text-center">
                Deneyim
              </h2>
              <div className="space-y-8">
                {personalInfo.experience.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1 + index * 0.2 }}
                    className="flex items-start space-x-6"
                  >
                    <div className="p-3 bg-aggressive-white text-aggressive-black rounded-lg">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-aggressive-white mb-2">
                        {exp.title}
                      </h3>
                      <p className="text-aggressive-white font-bold mb-1">
                        {exp.company}
                      </p>
                      <p className="text-aggressive-gray font-bold mb-3">
                        {exp.period}
                      </p>
                      <p className="text-aggressive-gray font-bold">
                        {exp.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Education Section */}
        {personalInfo.education && personalInfo.education.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mb-16"
          >
            <div className="card">
              <h2 className="text-3xl font-bold text-aggressive-white mb-8 text-center">
                Eğitim
              </h2>
              <div className="space-y-8">
                {personalInfo.education.map((edu, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
                    className="flex items-start space-x-6"
                  >
                    <div className="p-3 bg-aggressive-white text-aggressive-black rounded-lg">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-aggressive-white mb-2">
                        {edu.degree}
                      </h3>
                      <p className="text-aggressive-white font-bold mb-1">
                        {edu.institution}
                      </p>
                      <p className="text-aggressive-gray font-bold mb-3">
                        {edu.period}
                      </p>
                      <p className="text-aggressive-gray font-bold">
                        {edu.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Certifications Section */}
        {personalInfo.certifications && personalInfo.certifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mb-16"
          >
            <div className="card">
              <h2 className="text-3xl font-bold text-aggressive-white mb-8 text-center">
                Sertifikalar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {personalInfo.certifications.map((cert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                    className="bg-aggressive-black border-2 border-aggressive-white rounded-lg p-6 hover-aggressive"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <Award className="w-6 h-6 text-aggressive-white" />
                      <h3 className="text-lg font-bold text-aggressive-white">
                        {cert.name}
                      </h3>
                    </div>
                    <p className="text-aggressive-gray font-bold mb-2">
                      {cert.issuer}
                    </p>
                    <p className="text-aggressive-gray font-bold text-sm">
                      {cert.date}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Section */}
        {personalInfo.stats && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <div className="card">
              <h2 className="text-3xl font-bold text-aggressive-white mb-8 text-center">
                İstatistikler
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {Object.entries(personalInfo.stats).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.6 + index * 0.1 }}
                    className="text-center"
                  >
                    <motion.div
                      className="text-3xl md:text-4xl font-bold text-aggressive-white mb-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8, delay: 1.8 + index * 0.1 }}
                    >
                      {value}+
                    </motion.div>
                    <div className="text-aggressive-gray text-sm capitalize font-bold">
                      {key === 'completedProjects' && 'Tamamlanan Proje'}
                      {key === 'webAppsBuilt' && 'Web Uygulaması'}
                      {key === 'yearsExperience' && 'Yıl Deneyim'}
                      {key === 'happyClients' && 'Mutlu Müşteri'}
                      {key === 'totalViews' && 'Toplam Görüntülenme'}
                      {key === 'uniqueVisitors' && 'Benzersiz Ziyaretçi'}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default About; 