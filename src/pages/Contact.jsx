import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { personalInfo as defaultPersonalInfo } from '../data/personalInfo';
import { analytics } from '../utils/dataManager';
import { useToast } from '../contexts/ToastContext';

const Contact = () => {
  const [personalInfo, setPersonalInfo] = useState(defaultPersonalInfo);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    analytics.incrementPageView('contact');
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showToast('Mesajınız başarıyla gönderildi!', 'success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      showToast('Mesaj gönderilirken bir hata oluştu.', 'error');
    } finally {
      setIsSubmitting(false);
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
            İletişim
          </h1>
          <p className="text-xl text-aggressive-gray font-bold max-w-3xl mx-auto">
            Benimle iletişime geçin. Projeleriniz için birlikte çalışalım.
          </p>
        </motion.div>

        {/* Contact Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="card">
              <h2 className="text-2xl font-bold text-aggressive-white mb-6">
                Mesaj Gönder
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-aggressive-white font-bold mb-2">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input-primary w-full"
                    placeholder="Adınız ve soyadınız"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-aggressive-white font-bold mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input-primary w-full"
                    placeholder="ornek@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-aggressive-white font-bold mb-2">
                    Konu
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="input-primary w-full"
                    placeholder="Mesajınızın konusu"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-aggressive-white font-bold mb-2">
                    Mesaj
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="input-primary w-full resize-none"
                    placeholder="Mesajınızı buraya yazın..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full hover-aggressive disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-aggressive-black border-t-transparent rounded-full animate-aggressive-spin"></div>
                      <span>Gönderiliyor...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Mesaj Gönder</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Contact Information */}
            <div className="card">
              <h2 className="text-2xl font-bold text-aggressive-white mb-6">
                İletişim Bilgileri
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-aggressive-white text-aggressive-black rounded-lg">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-aggressive-white mb-1">
                      E-posta
                    </h3>
                    <p className="text-aggressive-gray font-bold">
                      {personalInfo.email || 'mert@example.com'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-aggressive-white text-aggressive-black rounded-lg">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-aggressive-white mb-1">
                      Telefon
                    </h3>
                    <p className="text-aggressive-gray font-bold">
                      {personalInfo.phone || '+90 555 123 4567'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-aggressive-white text-aggressive-black rounded-lg">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-aggressive-white mb-1">
                      Konum
                    </h3>
                    <p className="text-aggressive-gray font-bold">
                      {personalInfo.location || 'İstanbul, Türkiye'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            {personalInfo.socialLinks && (
              <div className="card">
                <h2 className="text-2xl font-bold text-aggressive-white mb-6">
                  Sosyal Medya
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(personalInfo.socialLinks).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-4 bg-aggressive-black border-2 border-aggressive-white rounded-lg hover:bg-aggressive-white hover:text-aggressive-black transition-all duration-200 hover-aggressive font-bold"
                    >
                      {getSocialIcon(platform)}
                      <span className="capitalize">{platform}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Info */}
            <div className="card">
              <h2 className="text-2xl font-bold text-aggressive-white mb-6">
                Hızlı Bilgi
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-aggressive-black border border-aggressive-white rounded-lg">
                  <span className="text-aggressive-white font-bold">Müsaitlik:</span>
                  <span className="text-aggressive-gray font-bold">Açık</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-aggressive-black border border-aggressive-white rounded-lg">
                  <span className="text-aggressive-white font-bold">Yanıt Süresi:</span>
                  <span className="text-aggressive-gray font-bold">24 saat</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-aggressive-black border border-aggressive-white rounded-lg">
                  <span className="text-aggressive-white font-bold">Çalışma Saatleri:</span>
                  <span className="text-aggressive-gray font-bold">9:00 - 18:00</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Social icon helper
const getSocialIcon = (platform) => {
  const icons = {
    github: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>,
    linkedin: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
    twitter: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
  };
  return icons[platform] || null;
};

export default Contact; 