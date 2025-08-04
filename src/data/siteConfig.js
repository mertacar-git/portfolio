export const siteConfig = {
  site: {
    title: "Mert Açar - Full Stack Developer",
    description: "Modern web teknolojileri ile yaratıcı çözümler geliştiren Full Stack Developer",
    url: "https://mertacar-git.github.io/portfolio",
    author: "Mert Açar",
    language: "tr",
    themeColor: "#111827",
    keywords: ["full stack developer", "react", "javascript", "portfolio", "web developer", "mert acar"]
  },
  
  seo: {
    titleTemplate: "%s | Mert Açar",
    defaultTitle: "Mert Açar - Full Stack Developer",
    defaultDescription: "Modern web teknolojileri ile yaratıcı çözümler geliştiren Full Stack Developer",
    canonical: "https://mertacar-git.github.io/portfolio",
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url: "https://mertacar-git.github.io/portfolio",
      title: "Mert Açar - Full Stack Developer",
      description: "Modern web teknolojileri ile yaratıcı çözümler geliştiren Full Stack Developer",
      siteName: "Mert Açar Portfolio"
    },
    twitter: {
      handle: "@mertacar",
      site: "@mertacar",
      cardType: "summary_large_image"
    }
  },
  
  navigation: [
    { name: "Ana Sayfa", href: "/", icon: "Home" },
    { name: "Hakkımda", href: "/about", icon: "User" },
    { name: "Portfolio", href: "/portfolio", icon: "Briefcase" },
    { name: "Blog", href: "/blog", icon: "FileText" },
    { name: "İletişim", href: "/contact", icon: "Mail" }
  ],
  
  socialLinks: {
    github: {
      url: "https://github.com/mertacar-git",
      label: "GitHub"
    },
    linkedin: {
      url: "https://linkedin.com/in/mertacar",
      label: "LinkedIn"
    },
    twitter: {
      url: "https://twitter.com/mertacar",
      label: "Twitter"
    },
    instagram: {
      url: "https://instagram.com/mertacar",
      label: "Instagram"
    }
  },
  
  contact: {
    email: "mertacar011@gmail.com",
    phone: "+90 553 751 8433",
    address: "İstanbul, Türkiye",
    socialMedia: {
      github: "https://github.com/mertacar-git",
      linkedin: "https://linkedin.com/in/mertacar",
      twitter: "https://twitter.com/mertacar",
      instagram: "https://instagram.com/mertacar"
    }
  },

  // Ek özellikler
  features: {
    darkMode: true,
    animations: true,
    responsive: true,
    seoOptimized: true,
    fastLoading: true
  },

  // Analytics
  analytics: {
    googleAnalytics: "", // Google Analytics ID
    googleTagManager: "" // Google Tag Manager ID
  },

  // Performance
  performance: {
    imageOptimization: true,
    lazyLoading: true,
    codeSplitting: true,
    caching: true
  }
}; 