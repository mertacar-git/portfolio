// Portfolio Projeleri
export const projects = [
  {
    id: 1,
    title: "Kişisel Portfolio Web Sitesi",
    description: "React ve Tailwind CSS ile geliştirdiğim modern portfolio web sitesi. Responsive tasarım, dark mode ve admin paneli özellikleri içeriyor.",
    image: "/images/projects/portfolio.jpg",
    technologies: ["React", "Tailwind CSS", "JavaScript", "GitHub Pages"],
    category: "Web Uygulaması",
    liveUrl: "https://mertacar-git.github.io/portfolio",
    githubUrl: "https://github.com/mertacar-git/portfolio",
    featured: true,
    publishDate: "15 Ocak 2024"
  },
  {
    id: 2,
    title: "E-Ticaret Platformu",
    description: "React ve Node.js ile geliştirdiğim tam özellikli e-ticaret platformu. Kullanıcı yönetimi, ürün kataloğu ve ödeme sistemi.",
    image: "/images/projects/ecommerce.jpg",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    category: "Web Uygulaması",
    liveUrl: "https://mertacar-git.github.io/ecommerce",
    githubUrl: "https://github.com/mertacar-git/ecommerce",
    featured: true,
    publishDate: "10 Ocak 2024"
  },
  {
    id: 3,
    title: "Task Management App",
    description: "React ve Firebase ile geliştirdiğim görev yönetim uygulaması. Gerçek zamanlı veri senkronizasyonu ve kullanıcı yetkilendirmesi.",
    image: "/images/projects/task-manager.jpg",
    technologies: ["React", "Firebase", "Material-UI", "JavaScript"],
    category: "Web Uygulaması",
    liveUrl: "https://mertacar-git.github.io/task-manager",
    githubUrl: "https://github.com/mertacar-git/task-manager",
    featured: true,
    publishDate: "20 Aralık 2023"
  },
  {
    id: 4,
    title: "Weather Dashboard",
    description: "OpenWeatherMap API kullanarak geliştirdiğim hava durumu dashboard'u. 5 günlük tahmin ve detaylı hava bilgileri.",
    image: "/images/projects/weather.jpg",
    technologies: ["JavaScript", "HTML", "CSS", "API"],
    category: "Web Uygulaması",
    liveUrl: "https://mertacar-git.github.io/weather-app",
    githubUrl: "https://github.com/mertacar-git/weather-app",
    featured: false,
    publishDate: "5 Aralık 2023"
  },
  {
    id: 5,
    title: "Blog Platform",
    description: "React ve Node.js ile geliştirdiğim blog platformu. Markdown desteği, yorum sistemi ve admin paneli.",
    image: "/images/projects/blog.jpg",
    technologies: ["React", "Node.js", "MongoDB", "Markdown"],
    category: "Web Uygulaması",
    liveUrl: "https://mertacar-git.github.io/blog-platform",
    githubUrl: "https://github.com/mertacar-git/blog-platform",
    featured: false,
    publishDate: "15 Kasım 2023"
  }
];

// Proje Kategorileri
export const projectCategories = [
  "Tümü",
  "Web Uygulaması",
  "Mobile App",
  "API",
  "Diğer"
];

// Projeleri kategoriye göre filtreleme fonksiyonu
export const filterProjectsByCategory = (category) => {
  if (category === "Tümü") {
    return projects;
  }
  return projects.filter(project => project.category === category);
};

// Öne çıkan projeleri getirme fonksiyonu
export const getFeaturedProjects = () => {
  return projects.filter(project => project.featured);
}; 