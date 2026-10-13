export const projects = [
  {
    "id": 101,
    "title": "Flight Telemetry Analyzer",
    "description": "Uçuş CSV kayıtlarından irtifa, hız ve batarya analizi; eşik uyarıları, veri kalitesi kontrolü ve rapor dışa aktarma.",
    "image": process.env.PUBLIC_URL + "/images/projects/flight-telemetry-analyzer.jpg",
    "technologies": [
      "Python",
      "Streamlit",
      "JavaScript",
      "Numerical Analysis"
    ],
    "category": "Uçuş Verisi",
    "liveUrl": "https://mertacar-git.github.io/flight-telemetry-analyzer/",
    "githubUrl": "https://github.com/mertacar-git/flight-telemetry-analyzer",
    "featured": true,
    "publishDate": "14 Ekim 2026"
  },
  {
    "id": 102,
    "title": "OrbitWatch",
    "description": "SGP4 ile uydu konumu, yer izi ve gözlemciye göre geçiş tahmini. Çevrimdışı örnek ve TLE doğrulama.",
    "image": process.env.PUBLIC_URL + "/images/projects/orbitwatch.jpg",
    "technologies": [
      "Python",
      "Streamlit",
      "JavaScript",
      "SGP4"
    ],
    "category": "Uzay",
    "liveUrl": "https://mertacar-git.github.io/orbitwatch/",
    "githubUrl": "https://github.com/mertacar-git/orbitwatch",
    "featured": true,
    "publishDate": "14 Ekim 2026"
  },
  {
    "id": 103,
    "title": "Flight Control Lab",
    "description": "PID ayarlarını değiştirme, bozucu etki ekleme ve kontrolcü karşılaştırması. Sayısal model ve performans ölçümleri.",
    "image": process.env.PUBLIC_URL + "/images/projects/flight-control-lab.jpg",
    "technologies": [
      "Python",
      "Streamlit",
      "JavaScript",
      "Numerical Analysis"
    ],
    "category": "Kontrol Sistemleri",
    "liveUrl": "https://mertacar-git.github.io/flight-control-lab/",
    "githubUrl": "https://github.com/mertacar-git/flight-control-lab",
    "featured": true,
    "publishDate": "14 Ekim 2026"
  },
  {
    "id": 104,
    "title": "Rocket Flight Lab",
    "description": "Değişen kütle, atmosfer ve sürükleme içeren dikey roket uçuş modeli. RK4 integrasyonu, apogee ve iniş analizi.",
    "image": process.env.PUBLIC_URL + "/images/projects/rocket-flight-lab.jpg",
    "technologies": [
      "Python",
      "Streamlit",
      "JavaScript",
      "Numerical Analysis"
    ],
    "category": "Simülasyon",
    "liveUrl": "https://mertacar-git.github.io/rocket-flight-lab/",
    "githubUrl": "https://github.com/mertacar-git/rocket-flight-lab",
    "featured": true,
    "publishDate": "14 Ekim 2026"
  },
  {
    "id": 105,
    "title": "Aero Telemetry Protocol",
    "description": "CRC kontrollü ikili telemetri protokolü. Python/C++ kodlayıcılar, parçalı akış çözme ve paket sırası takibi.",
    "image": process.env.PUBLIC_URL + "/images/projects/aero-telemetry-protocol.jpg",
    "technologies": [
      "C++",
      "Python",
      "CRC",
      "JavaScript"
    ],
    "category": "Sistem Yazılımı",
    "liveUrl": "https://mertacar-git.github.io/aero-telemetry-protocol/",
    "githubUrl": "https://github.com/mertacar-git/aero-telemetry-protocol",
    "featured": true,
    "publishDate": "14 Ekim 2026"
  },
  {
    "id": 106,
    "title": "Wing Design Lab",
    "description": "Trapez kanat geometrisi, analitik aerodinamik karşılaştırma ve NACA profil koordinatları. Varsayımları açık mühendislik modeli.",
    "image": process.env.PUBLIC_URL + "/images/projects/wing-design-lab.jpg",
    "technologies": [
      "Python",
      "Streamlit",
      "JavaScript",
      "Numerical Analysis"
    ],
    "category": "Aerodinamik",
    "liveUrl": "https://mertacar-git.github.io/wing-design-lab/",
    "githubUrl": "https://github.com/mertacar-git/wing-design-lab",
    "featured": true,
    "publishDate": "14 Ekim 2026"
  },
  {
    "id": 1,
    "title": "Kişisel Portfolio Web Sitesi",
    "description": "React ve Tailwind CSS ile kişisel portföy, proje filtreleri ve havacılık/uzay demo laboratuvarı.",
    "image": "",
    "technologies": [
      "React",
      "Tailwind CSS",
      "JavaScript",
      "GitHub Pages"
    ],
    "category": "Web Uygulaması",
    "liveUrl": "https://mertacar-git.github.io/portfolio/",
    "githubUrl": "https://github.com/mertacar-git/portfolio",
    "featured": false
  }
];

export const projectCategories = ["Tümü", ...new Set(projects.map(p => p.category))];
export const filterProjectsByCategory = category => category === "Tümü" ? projects : projects.filter(p => p.category === category);
export const getFeaturedProjects = () => projects.filter(p => p.featured);
