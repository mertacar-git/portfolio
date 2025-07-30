export const siteConfig = {
  site: {
    title: "Mert Açar - Software Developer",
    description: "Tutkulu yazılım geliştiricisi. React, JavaScript ve modern web teknolojileri ile kullanıcı dostu uygulamalar geliştiriyorum.",
    url: "https://mertacar.github.io",
    author: "Mert Açar",
    language: "tr",
    themeColor: "#3B82F6",
    keywords: ["yazılım geliştirici", "software developer", "react", "javascript", "portfolio", "web geliştirici"]
  },
  
  seo: {
    titleTemplate: "%s | Mert Açar",
    defaultTitle: "Mert Açar - Software Developer",
    defaultDescription: "Tutkulu yazılım geliştiricisi. React, JavaScript ve modern web teknolojileri ile kullanıcı dostu uygulamalar geliştiriyorum.",
    canonical: "https://mertacar.github.io",
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url: "https://mertacar.github.io",
      title: "Mert Açar - Software Developer",
      description: "Tutkulu yazılım geliştiricisi. React, JavaScript ve modern web teknolojileri ile kullanıcı dostu uygulamalar geliştiriyorum.",
      siteName: "Mert Açar Portfolio"
    },
    twitter: {
      handle: "@mertacar",
      site: "@mertacar",
      cardType: "summary_large_image"
    }
  },
  
  navigation: [
    { name: "Ana Sayfa", href: "/" },
    { name: "Hakkımda", href: "/about" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Blog", href: "/blog" },
    { name: "İletişim", href: "/contact" }
  ],
  
  socialLinks: {
    github: {
      url: "https://github.com/mertacar",
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
      github: "https://github.com/mertacar",
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