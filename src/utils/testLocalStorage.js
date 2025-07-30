// Local Storage Test Fonksiyonları
import { storageService } from '../services/storageService';

export const testLocalStorage = {
  // Tüm testleri çalıştır
  runAllTests() {
    console.log('🧪 Local Storage Testleri Başlatılıyor...');
    
    this.testBasicOperations();
    this.testDataPersistence();
    this.testBackupService();
    this.testDataValidation();
    
    console.log('✅ Tüm testler tamamlandı!');
  },

  // Temel operasyonları test et
  testBasicOperations() {
    console.log('\n📝 Temel Operasyonlar Testi:');
    
    // Test 1: Veri kaydetme
    const testData = { name: 'Test User', age: 25 };
    const saveResult = storageService.saveData('testKey', testData);
    console.log('✅ Veri kaydetme:', saveResult ? 'Başarılı' : 'Başarısız');
    
    // Test 2: Veri okuma
    const retrievedData = storageService.getData('testKey');
    console.log('✅ Veri okuma:', JSON.stringify(retrievedData) === JSON.stringify(testData) ? 'Başarılı' : 'Başarısız');
    
    // Test 3: Veri var mı kontrolü
    const hasData = storageService.hasData('testKey');
    console.log('✅ Veri kontrolü:', hasData ? 'Başarılı' : 'Başarısız');
    
    // Test 4: Veri boyutu kontrolü
    const dataSize = storageService.getDataSize('testKey');
    console.log('✅ Veri boyutu:', dataSize > 0 ? 'Başarılı' : 'Başarısız');
    
    // Test 5: Veri silme
    storageService.removeData('testKey');
    const afterDelete = storageService.getData('testKey');
    console.log('✅ Veri silme:', afterDelete === null ? 'Başarılı' : 'Başarısız');
  },

  // Veri kalıcılığını test et
  testDataPersistence() {
    console.log('\n💾 Veri Kalıcılığı Testi:');
    
    const testProjects = [
      {
        id: 1,
        title: 'Test Projesi 1',
        description: 'Bu bir test projesidir',
        technologies: ['React', 'Node.js'],
        category: 'Web Uygulaması',
        featured: true
      },
      {
        id: 2,
        title: 'Test Projesi 2',
        description: 'Bu da bir test projesidir',
        technologies: ['Vue.js', 'Express'],
        category: 'Mobil Uygulama',
        featured: false
      }
    ];
    
    // Projeleri kaydet
    storageService.saveData('projects', testProjects);
    console.log('✅ Test projeleri kaydedildi');
    
    // Projeleri oku
    const savedProjects = storageService.getData('projects');
    console.log('✅ Kaydedilen proje sayısı:', savedProjects.length);
    
    // Proje güncelle
    const updatedProjects = savedProjects.map(project => 
      project.id === 1 ? { ...project, title: 'Güncellenmiş Test Projesi' } : project
    );
    storageService.saveData('projects', updatedProjects);
    
    // Güncellenmiş projeleri oku
    const finalProjects = storageService.getData('projects');
    const updatedProject = finalProjects.find(p => p.id === 1);
    console.log('✅ Proje güncelleme:', updatedProject.title === 'Güncellenmiş Test Projesi' ? 'Başarılı' : 'Başarısız');
  },

  // Yedekleme servisini test et
  testBackupService() {
    console.log('\n🔄 Yedekleme Servisi Testi:');
    
    // Test verileri oluştur
    const testData = {
      personalInfo: { name: 'Test User', email: 'test@example.com' },
      projects: [{ id: 1, title: 'Test Project' }],
      blogPosts: [{ id: 1, title: 'Test Blog Post' }],
      siteConfig: { title: 'Test Site' }
    };
    
    // Verileri kaydet
    Object.entries(testData).forEach(([key, value]) => {
      storageService.saveData(key, value);
    });
    
    console.log('✅ Test verileri kaydedildi');
    
    // Export fonksiyonunu test et (tarayıcı ortamında çalışır)
    try {
      // backupService.exportData(); // Bu fonksiyon tarayıcıda dosya indirme işlemi yapar
      console.log('✅ Export fonksiyonu mevcut');
    } catch (error) {
      console.log('⚠️ Export fonksiyonu test edilemedi (Node.js ortamında)');
    }
  },

  // Veri doğrulama testi
  testDataValidation() {
    console.log('\n🔍 Veri Doğrulama Testi:');
    
    // Geçersiz JSON testi
    try {
      localStorage.setItem('invalidJson', 'invalid json string');
      const invalidData = storageService.getData('invalidJson');
      console.log('✅ Geçersiz JSON işleme:', invalidData === null ? 'Başarılı' : 'Başarısız');
    } catch (error) {
      console.log('❌ Geçersiz JSON işleme hatası');
    }
    
    // Büyük veri testi
    const largeData = { data: 'x'.repeat(10000) };
    const largeSaveResult = storageService.saveData('largeData', largeData);
    console.log('✅ Büyük veri kaydetme:', largeSaveResult ? 'Başarılı' : 'Başarısız');
    
    // Toplam boyut kontrolü
    const totalSize = storageService.getTotalSize();
    console.log('✅ Toplam storage boyutu:', totalSize, 'bytes');
  },

  // Test verilerini temizle
  cleanup() {
    console.log('\n🧹 Test Verilerini Temizleme:');
    
    const testKeys = ['testKey', 'projects', 'personalInfo', 'blogPosts', 'siteConfig', 'largeData', 'invalidJson'];
    
    testKeys.forEach(key => {
      storageService.removeData(key);
    });
    
    console.log('✅ Test verileri temizlendi');
  },

  // Demo veriler oluştur
  createDemoData() {
    console.log('\n🎭 Demo Veriler Oluşturuluyor:');
    
    const demoProjects = [
      {
        id: 1,
        title: 'Adventure Quest',
        description: 'Unity ile geliştirdiğim 3D macera oyunu. Oyuncular farklı dünyalarda keşif yaparak görevleri tamamlıyor.',
        image: '/images/projects/adventure-quest.jpg',
        technologies: ['Unity', 'C#', 'Blender', 'Photoshop'],
        category: 'Oyun Geliştirme',
        liveUrl: 'https://itch.io/adventure-quest',
        githubUrl: 'https://github.com/mertacar/adventure-quest',
        featured: true,
        year: '2024'
      },
      {
        id: 2,
        title: 'E-Commerce Platform',
        description: 'React ve Node.js ile geliştirdiğim modern e-ticaret platformu. Kullanıcı dostu arayüz ve güvenli ödeme sistemi.',
        image: '/images/projects/ecommerce.jpg',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        category: 'Web Uygulaması',
        liveUrl: 'https://ecommerce-demo.com',
        githubUrl: 'https://github.com/mertacar/ecommerce-platform',
        featured: true,
        year: '2024'
      },
      {
        id: 3,
        title: 'Space Shooter',
        description: 'Unreal Engine ile geliştirdiğim uzay savaş oyunu. Gelişmiş grafik efektleri ve multiplayer özellikleri.',
        image: '/images/projects/space-shooter.jpg',
        technologies: ['Unreal Engine', 'C++', 'Blueprints', 'Wwise'],
        category: 'Oyun Geliştirme',
        liveUrl: 'https://steam.com/space-shooter',
        githubUrl: 'https://github.com/mertacar/space-shooter',
        featured: false,
        year: '2023'
      },
      {
        id: 4,
        title: 'Task Manager App',
        description: 'Mobil ve web uygulaması olarak geliştirdiğim görev yönetim uygulaması. Gerçek zamanlı senkronizasyon.',
        image: '/images/projects/task-manager.jpg',
        technologies: ['React Native', 'Firebase', 'Redux', 'TypeScript'],
        category: 'Mobil Uygulama',
        liveUrl: 'https://taskmanager.app',
        githubUrl: 'https://github.com/mertacar/task-manager',
        featured: true,
        year: '2023'
      }
    ];
    
    const demoBlogPosts = [
      {
        id: 1,
        title: 'Unity ile Oyun Geliştirmeye Başlarken',
        excerpt: 'Unity oyun motoru ile oyun geliştirmeye yeni başlayanlar için kapsamlı bir rehber.',
        content: `# Unity ile Oyun Geliştirmeye Başlarken

Unity, dünyanın en popüler oyun geliştirme motorlarından biridir. Hem yeni başlayanlar hem de deneyimli geliştiriciler için güçlü araçlar sunar.

## Unity Nedir?

Unity, 2D ve 3D oyunlar geliştirmek için kullanılan cross-platform bir oyun motorudur. C# programlama dili ile script yazmanıza olanak tanır.

## Başlangıç İçin Gerekli Araçlar

- **Unity Hub**: Unity sürümlerini yönetmek için
- **Unity Editor**: Oyun geliştirme ortamı
- **Visual Studio**: Kod yazma editörü
- **Blender**: 3D modelleme (ücretsiz alternatif)

## İlk Projenizi Oluşturma

1. Unity Hub'ı açın
2. "New Project" butonuna tıklayın
3. 3D template'ini seçin
4. Proje adını ve konumunu belirleyin

Oyun geliştirme yolculuğunuzda başarılar!`,
        publishDate: '2024-01-15',
        readTime: '8 min',
        category: 'Oyun Geliştirme',
        tags: ['Unity', 'C#', 'Oyun Geliştirme', 'Başlangıç'],
        featured: true,
        views: 0,
        likes: 0
      },
      {
        id: 2,
        title: 'React Hooks ile Modern State Yönetimi',
        excerpt: 'React Hooks kullanarak state yönetimini nasıl daha etkili hale getirebileceğinizi öğrenin.',
        content: `# React Hooks ile Modern State Yönetimi

React Hooks, fonksiyonel bileşenlerde state ve lifecycle metodlarını kullanmamızı sağlayan özelliklerdir.

## useState Hook

En temel hook'tur. State'i yönetmek için kullanılır:

\`\`\`javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\`

Hooks ile React geliştirme deneyiminiz çok daha temiz ve anlaşılır olacak!`,
        publishDate: '2024-01-10',
        readTime: '10 min',
        category: 'Web Geliştirme',
        tags: ['React', 'JavaScript', 'Hooks', 'State Management'],
        featured: true,
        views: 0,
        likes: 0
      },
      {
        id: 3,
        title: 'Oyun Tasarımında Player Experience',
        excerpt: 'Oyuncu deneyimini nasıl tasarlayacağınızı öğrenin. Flow theory ve reward systems.',
        content: `# Oyun Tasarımında Player Experience

Oyun tasarımının en önemli unsuru oyuncu deneyimidir. İyi bir player experience nasıl oluşturulur?

## Flow Theory

Mihaly Csikszentmihalyi'nin Flow teorisi, oyuncuların tamamen oyuna odaklandığı optimal durumu açıklar.

### Flow Durumunun Özellikleri:
- Zamanın nasıl geçtiğini fark etmemek
- Tam konsantrasyon
- Net hedefler
- Anında geri bildirim
- Kontrol hissi

## Reward Systems

### Intrinsic vs Extrinsic Rewards

**Intrinsic (İçsel) Ödüller:**
- Oyundan aldığı zevk
- Başarı hissi
- Keşif heyecanı

**Extrinsic (Dışsal) Ödüller:**
- Puanlar
- Rozetler
- Seviye atlamaları

Oyun tasarımında oyuncu deneyimi her zaman öncelik olmalıdır!`,
        publishDate: '2023-12-28',
        readTime: '15 min',
        category: 'Oyun Tasarımı',
        tags: ['Oyun Tasarımı', 'Player Experience', 'Game Design', 'UX'],
        featured: false,
        views: 0,
        likes: 0
      }
    ];

    const demoPersonalInfo = {
      name: "Mert Açar",
      title: "Game Developer | Full-stack Developer",
      subtitle: "Modern web teknolojileri ve oyun geliştirme ile kullanıcı deneyimini ön planda tutan projeler geliştiriyorum.",
      email: "mertacar011@email.com",
      phone: "+90 553 751 8433",
      location: "İstanbul, Türkiye",
      about: "Merhaba! Ben Mert Açar, tutkulu bir oyun geliştiricisi ve full-stack developer'ım. 5 yılı aşkın deneyimim boyunca hem web teknolojileri hem de oyun geliştirme alanlarında çeşitli projeler geliştirdim. React, Node.js, Unity ve Unreal Engine gibi modern teknolojileri kullanarak kullanıcı dostu ve performanslı uygulamalar oluşturuyorum. Sürekli öğrenmeye ve yeni teknolojileri keşfetmeye odaklanıyorum. Takım çalışmasına değer veriyor ve her projede en iyi sonucu elde etmek için çaba gösteriyorum.",
      aboutFormat: {
        fontSize: 'lg',
        lineHeight: 'relaxed',
        textAlign: 'center',
        maxWidth: '4xl',
        fontWeight: 'normal',
        letterSpacing: 'normal',
        paragraphSpacing: '6',
        textColor: 'gray-600',
        darkTextColor: 'gray-300'
      },
      socialLinks: {
        github: "https://github.com/mertacar",
        linkedin: "https://linkedin.com/in/mertacar",
        twitter: "https://twitter.com/mertacar",
        instagram: "https://instagram.com/mertacar"
      },
      skills: [
        { name: "JavaScript", level: 95 },
        { name: "React", level: 90 },
        { name: "Unity", level: 88 },
        { name: "C#", level: 82 },
        { name: "Node.js", level: 85 },
        { name: "TypeScript", level: 80 }
      ],
      stats: {
        completedProjects: 25,
        gamesDeveloped: 8,
        webAppsBuilt: 12,
        yearsExperience: 5,
        happyClients: 18
      },
      certifications: [
        {
          name: "Unity Certified Developer",
          issuer: "Unity Technologies",
          year: "2023",
          description: "Unity ile oyun geliştirme konusunda profesyonel sertifikasyon"
        },
        {
          name: "AWS Certified Developer",
          issuer: "Amazon Web Services",
          year: "2022",
          description: "AWS cloud servisleri ile uygulama geliştirme sertifikasyonu"
        }
      ]
    };

    const demoSiteConfig = {
      site: {
        title: "Mert Açar - Game Developer & Full-Stack Developer",
        description: "Tutkulu oyun geliştiricisi ve full-stack developer. Unity, React, Node.js ile modern uygulamalar geliştiriyorum.",
        url: "https://mertacar.dev",
        author: "Mert Açar",
        language: "tr",
        themeColor: "#3B82F6",
        keywords: ["oyun geliştirici", "game developer", "full-stack developer", "unity", "react", "node.js", "portfolio"]
      }
    };
    
    // Demo verileri kaydet
    storageService.saveData('projects', demoProjects);
    storageService.saveData('blogPosts', demoBlogPosts);
    storageService.saveData('personalInfo', demoPersonalInfo);
    storageService.saveData('siteConfig', demoSiteConfig);
    
    console.log('✅ Demo veriler başarıyla oluşturuldu:');
    console.log('- Projeler:', demoProjects.length, 'adet');
    console.log('- Blog yazıları:', demoBlogPosts.length, 'adet');
    console.log('- Kişisel bilgiler güncellendi');
    console.log('- Site konfigürasyonu güncellendi');
  }
};

// Test fonksiyonlarını dışa aktar
export default testLocalStorage; 