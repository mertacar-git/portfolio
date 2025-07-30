// Portfolio Projeleri
export const projects = [
  {
    id: 1,
    title: "Kişisel Portfolio Web Sitesi",
    description: "React ve Tailwind CSS ile geliştirdiğim modern portfolio web sitesi. Responsive tasarım, dark mode ve admin paneli özellikleri içeriyor.",
    image: "/images/projects/portfolio.jpg",
    technologies: ["React", "Tailwind CSS", "JavaScript", "GitHub"],
    category: "Portfolio",
    liveUrl: "https://mertacar.github.io",
    githubUrl: "https://github.com/mertacar/portfolio",
    featured: true,
    year: "2024"
  },
  {
    id: 2,
    title: "Todo Uygulaması",
    description: "React ile geliştirdiğim basit todo uygulaması. LocalStorage kullanarak veri saklama ve temel CRUD işlemleri.",
    image: "/images/projects/todo.jpg",
    technologies: ["React", "JavaScript", "LocalStorage", "CSS"],
    category: "Web Uygulaması",
    liveUrl: "https://mertacar.github.io/todo-app",
    githubUrl: "https://github.com/mertacar/todo-app",
    featured: true,
    year: "2024"
  },
  {
    id: 3,
    title: "Hava Durumu Uygulaması",
    description: "OpenWeatherMap API kullanarak geliştirdiğim hava durumu uygulaması. Gerçek zamanlı hava bilgileri ve responsive tasarım.",
    image: "/images/projects/weather.jpg",
    technologies: ["JavaScript", "HTML", "CSS", "API"],
    category: "Web Uygulaması",
    liveUrl: "https://mertacar.github.io/weather-app",
    githubUrl: "https://github.com/mertacar/weather-app",
    featured: true,
    year: "2023"
  },
  {
    id: 4,
    title: "Hesap Makinesi",
    description: "JavaScript ile geliştirdiğim basit hesap makinesi uygulaması. Temel matematik işlemleri ve kullanıcı dostu arayüz.",
    image: "/images/projects/calculator.jpg",
    technologies: ["JavaScript", "HTML", "CSS"],
    category: "Web Uygulaması",
    liveUrl: "https://mertacar.github.io/calculator",
    githubUrl: "https://github.com/mertacar/calculator",
    featured: false,
    year: "2023"
  },
  {
    id: 5,
    title: "Renk Paleti Oluşturucu",
    description: "CSS ve JavaScript ile geliştirdiğim renk paleti oluşturucu. Rastgele renkler üretme ve kopyalama özellikleri.",
    image: "/images/projects/color-palette.jpg",
    technologies: ["JavaScript", "HTML", "CSS"],
    category: "Web Uygulaması",
    liveUrl: "https://mertacar.github.io/color-palette",
    githubUrl: "https://github.com/mertacar/color-palette",
    featured: false,
    year: "2023"
  }
];

// Proje Kategorileri
export const projectCategories = [
  "Tümü",
  "Web Uygulaması",
  "Portfolio",
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