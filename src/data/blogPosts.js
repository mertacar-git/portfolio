// Blog Yazıları
export const blogPosts = [
  {
    id: 1,
    title: "React ile İlk Projemi Geliştirirken Öğrendiklerim",
    excerpt: "React öğrenme sürecimde karşılaştığım zorluklar ve çözümler. Hooks, state yönetimi ve component yapısı hakkında deneyimlerim.",
    content: `# React ile İlk Projemi Geliştirirken Öğrendiklerim

React öğrenmeye başladığımda, modern web geliştirme dünyasının kapılarını araladığımı hissettim. İşte bu yolculukta öğrendiklerim.

## Neden React?

React'in component tabanlı yapısı ve geniş ekosistemi beni cezbetti. Özellikle:
- Yeniden kullanılabilir componentler
- Virtual DOM'un performans avantajları
- Geniş topluluk desteği

## İlk Adımlar

### 1. Kurulum ve Yapılandırma
Create React App ile başladım:
\`\`\`bash
npx create-react-app my-first-app
cd my-first-app
npm start
\`\`\`

### 2. Component Yapısını Anlama
İlk başta component'lerin nasıl çalıştığını anlamak zordu. Props ve state kavramları kafa karıştırıcıydı.

\`\`\`jsx
function Welcome(props) {
  return <h1>Merhaba, {props.name}!</h1>;
}
\`\`\`

## Karşılaştığım Zorluklar

### State Yönetimi
State'in nasıl çalıştığını anlamak zaman aldı. useState hook'u ile başladım:

\`\`\`jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Sayı: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Artır
      </button>
    </div>
  );
}
\`\`\`

### useEffect Hook
Side effect'leri yönetmek başlangıçta karmaşıktı. API çağrıları ve DOM manipülasyonu için kullanımını öğrendim.

## Öğrendiğim Best Practices

1. **Component'leri küçük tutun**
2. **Props'ları doğru kullanın**
3. **State'i en üst seviyede yönetin**
4. **Performance optimizasyonlarına dikkat edin**

## Sonuç

React öğrenme sürecim hala devam ediyor. Her yeni proje ile daha fazla şey öğreniyorum. Sabırlı olmak ve pratik yapmak en önemlisi.

Bu yolculukta bana yardımcı olan tüm kaynaklara teşekkürler!`,
    publishDate: "2024-01-15",
    readTime: "5 min",
    category: "Web Geliştirme",
    tags: ["React", "JavaScript", "Frontend", "Öğrenme"],
    featured: true,
    views: 0,
    likes: 0
  },
  {
    id: 2,
    title: "Git ve GitHub Kullanımı",
    excerpt: "Versiyon kontrol sistemi Git ve GitHub platformunu kullanarak projelerimi nasıl yönettiğimi anlatıyorum.",
    content: `# Git ve GitHub Kullanımı

Modern yazılım geliştirmenin vazgeçilmez araçlarından biri Git'tir. İşte Git ve GitHub kullanımı hakkında öğrendiklerim.

## Git Nedir?

Git, dağıtık versiyon kontrol sistemidir. Projelerinizin farklı versiyonlarını takip etmenizi sağlar.

## Temel Git Komutları

### 1. Repository Oluşturma
\`\`\`bash
git init
git clone https://github.com/kullanici/repo.git
\`\`\`

### 2. Değişiklikleri Takip Etme
\`\`\`bash
git add .
git commit -m "İlk commit mesajı"
\`\`\`

### 3. Branch Yönetimi
\`\`\`bash
git branch yeni-ozellik
git checkout yeni-ozellik
git merge yeni-ozellik
\`\`\`

## GitHub Kullanımı

### Repository Oluşturma
1. GitHub'da yeni repository oluşturun
2. Local projenizi bağlayın
3. İlk push'u yapın

### Pull Request Süreci
1. Yeni branch oluşturun
2. Değişiklikleri yapın
3. Commit ve push yapın
4. Pull request açın

## Best Practices

1. **Anlamlı commit mesajları yazın**
2. **Düzenli commit yapın**
3. **Branch'leri doğru kullanın**
4. **README dosyası ekleyin**

## Sonuç

Git ve GitHub kullanımı başlangıçta karmaşık görünebilir, ancak pratik yaptıkça kolaylaşır. Bu araçlar yazılım geliştirme sürecinizi çok daha verimli hale getirir.`,
    publishDate: "2024-01-10",
    readTime: "4 min",
    category: "Araçlar",
    tags: ["Git", "GitHub", "Versiyon Kontrol", "Araçlar"],
    featured: true,
    views: 0,
    likes: 0
  },
  {
    id: 3,
    title: "JavaScript Temelleri",
    excerpt: "JavaScript programlama dilinin temel kavramları ve modern JavaScript özellikleri hakkında bilgiler.",
    content: `# JavaScript Temelleri

JavaScript, web geliştirmenin temel taşlarından biridir. İşte JavaScript'in temel kavramları.

## Değişkenler ve Veri Tipleri

### let, const ve var
\`\`\`javascript
let degisken = "değer";
const sabit = "değişmez";
var eskiYontem = "kullanmayın";
\`\`\`

### Veri Tipleri
\`\`\`javascript
let string = "metin";
let number = 42;
let boolean = true;
let array = [1, 2, 3];
let object = { name: "Mert" };
\`\`\`

## Fonksiyonlar

### Geleneksel Fonksiyon
\`\`\`javascript
function selamla(isim) {
  return "Merhaba " + isim;
}
\`\`\`

### Arrow Function
\`\`\`javascript
const selamla = (isim) => {
  return "Merhaba " + isim;
};
\`\`\`

## Modern JavaScript Özellikleri

### Destructuring
\`\`\`javascript
const kisi = { ad: "Mert", yas: 25 };
const { ad, yas } = kisi;
\`\`\`

### Template Literals
\`\`\`javascript
const mesaj = \`Merhaba \${ad}, yaşınız \${yas}\`;
\`\`\`

### Async/Await
\`\`\`javascript
async function veriGetir() {
  try {
    const response = await fetch('/api/veri');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Hata:', error);
  }
}
\`\`\`

## Sonuç

JavaScript öğrenmek web geliştirme yolculuğunuzda çok önemlidir. Temelleri iyi öğrenmek, daha karmaşık konuları anlamanızı kolaylaştırır.`,
    publishDate: "2024-01-05",
    readTime: "6 min",
    category: "Programlama",
    tags: ["JavaScript", "ES6", "Programlama", "Temeller"],
    featured: false,
    views: 0,
    likes: 0
  },
  {
    id: 4,
    title: "Web Geliştirme Yolculuğum",
    excerpt: "Web geliştirme öğrenme sürecimde yaşadığım deneyimler ve gelecek hedeflerim hakkında kişisel bir yazı.",
    content: `# Web Geliştirme Yolculuğum

Web geliştirme öğrenmeye başladığım günden bu yana geçen süreçte yaşadığım deneyimleri paylaşmak istiyorum.

## Başlangıç

İlk olarak HTML ve CSS ile başladım. Basit web sayfaları oluşturmak bile büyük bir başarı hissi veriyordu.

### HTML Öğrenimi
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>İlk Sayfam</title>
</head>
<body>
    <h1>Merhaba Dünya!</h1>
    <p>Bu benim ilk web sayfam.</p>
</body>
</html>
\`\`\`

## JavaScript'e Geçiş

HTML ve CSS'ten sonra JavaScript öğrenmeye başladım. İlk başta zor gelse de, pratik yaptıkça kolaylaştı.

## React ile Tanışma

Modern web geliştirme için React öğrenmeye karar verdim. Component tabanlı yapısı çok mantıklı geldi.

## Karşılaştığım Zorluklar

1. **Kavramları anlamak**: İlk başta birçok kavram kafa karıştırıcıydı
2. **Pratik yapmak**: Teori ile pratik arasında denge kurmak önemli
3. **Güncel kalmak**: Teknoloji çok hızlı değişiyor

## Öğrendiğim Dersler

1. **Sabırlı olun**: Öğrenme süreci zaman alır
2. **Pratik yapın**: Sadece okumak yeterli değil
3. **Projeler geliştirin**: Gerçek projeler en iyi öğretmendir
4. **Topluluğa katılın**: Diğer geliştiricilerden öğrenin

## Gelecek Hedeflerim

- Node.js ve backend geliştirme
- TypeScript öğrenimi
- Daha karmaşık projeler
- Open source katkıları

## Sonuç

Web geliştirme yolculuğum henüz başlangıç aşamasında. Her gün yeni şeyler öğreniyorum ve bu süreçten büyük keyif alıyorum.

Bu yolculukta bana destek olan herkese teşekkürler!`,
    publishDate: "2023-12-28",
    readTime: "7 min",
    category: "Kişisel",
    tags: ["Web Geliştirme", "Öğrenme", "Deneyim", "Hedefler"],
    featured: false,
    views: 0,
    likes: 0
  }
];

// Blog Kategorileri
export const blogCategories = [
  "Tümü",
  "Web Geliştirme",
  "Programlama",
  "Araçlar",
  "Kişisel",
  "Diğer"
];

// Blog yazılarını kategoriye göre filtreleme
export const filterBlogPostsByCategory = (category) => {
  if (category === "Tümü") {
    return blogPosts;
  }
  return blogPosts.filter(post => post.category === category);
};

// Öne çıkan blog yazılarını getirme
export const getFeaturedBlogPosts = () => {
  return blogPosts.filter(post => post.featured);
};

// Blog yazılarını tarihe göre sıralama (en yeni önce)
export const getSortedBlogPosts = () => {
  return [...blogPosts].sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
};

// Blog yazısını ID'ye göre bulma
export const getBlogPostById = (id) => {
  return blogPosts.find(post => post.id === parseInt(id));
}; 