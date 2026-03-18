import type { WorkMetric } from '../types/api'

export interface PublicArticle {
  id: number
  slug_id: string
  slug_en?: string
  title: string
  excerpt_id: string
  category: string
  image: string
  author: string
  published_at: string
  read_time: number
}

export interface PublicServiceFeature {
  icon: string
  title: string
  description: string
}

export interface PublicServiceProcessStep {
  title: string
  description: string
}

export interface PublicServiceFaq {
  question: string
  answer: string
}

export interface PublicService {
  slug: string
  title: string
  description: string
  icon: string
  pricing: string // Display string (legacy)
  pricingUSD: number // Price in USD for conversion
  features: PublicServiceFeature[]
  process: PublicServiceProcessStep[]
  faqs: PublicServiceFaq[]
}

export interface PublicWork {
  id: number
  slug: string
  title: string
  description: string
  image: string
  service: string
  platform: string
  featured: boolean
  client_name: string
  metrics: WorkMetric[]
  features: string[]
  gallery: string[]
}

const defaultServiceFeatures: PublicServiceFeature[] = [
  { icon: '🎨', title: 'Desain Terarah', description: 'Tampilan disusun agar sesuai dengan karakter brand dan kebutuhan pengguna.' },
  { icon: '⚡', title: 'Performa Cepat', description: 'Dibangun dengan perhatian pada kecepatan, stabilitas, dan kemudahan akses.' },
  { icon: '📱', title: 'Responsif di Semua Perangkat', description: 'Pengalaman tetap nyaman dipakai di desktop, tablet, maupun ponsel.' },
  { icon: '🔒', title: 'Pondasi Aman', description: 'Mengikuti praktik implementasi yang lebih aman untuk kebutuhan produksi.' },
  { icon: '🔍', title: 'Siap Ditemukan', description: 'Struktur konten dan teknis mendukung visibilitas organik yang lebih baik.' },
  { icon: '🛠️', title: 'Mudah Dirawat', description: 'Fondasi dibuat agar mudah diperbarui oleh tim internal setelah peluncuran.' }
]

const defaultServiceProcess: PublicServiceProcessStep[] = [
  { title: 'Discovery', description: 'Kami memahami konteks bisnis, sasaran utama, dan kebutuhan prioritas Anda.' },
  { title: 'Planning', description: 'Ruang lingkup, alur kerja, dan milestone disusun agar keputusan tetap terarah.' },
  { title: 'Design', description: 'Solusi divisualkan lewat struktur, eksplorasi antarmuka, dan arah pengalaman pengguna.' },
  { title: 'Development', description: 'Implementasi dilakukan bertahap agar perubahan bisa diuji dan ditinjau lebih jelas.' },
  { title: 'Testing', description: 'Setiap rilisan melewati validasi kualitas sebelum dipublikasikan.' },
  { title: 'Launch', description: 'Proyek dirilis dengan monitoring awal untuk memastikan performa dan pengalaman tetap terjaga.' }
]

const defaultServiceFaqs: PublicServiceFaq[] = [
  { question: 'Berapa lama durasi proyek biasanya?', answer: 'Durasi proyek umumnya 4-12 minggu, tergantung kompleksitas, integrasi, dan kebutuhan validasi.' },
  { question: 'Teknologi apa yang biasa digunakan?', answer: 'Stack dipilih berdasarkan kebutuhan proyek, performa, dan kesiapan tim untuk mengelola hasil akhirnya.' },
  { question: 'Apakah ada dukungan setelah peluncuran?', answer: 'Ya. Kami dapat menyiapkan fase maintenance atau pendampingan lanjutan sesuai kebutuhan tim Anda.' },
  { question: 'Apakah bisa bekerja dari desain yang sudah ada?', answer: 'Bisa. Kami dapat melanjutkan dari materi yang sudah tersedia atau membantu menyempurnakannya lebih dulu.' }
]

export const publicArticles: PublicArticle[] = [
  {
    id: 1,
    slug_id: 'digital-marketing-trends-2024',
    slug_en: 'digital-marketing-trends-2024',
    title: 'Digital Marketing Trends to Watch in 2024',
    excerpt_id: 'Discover the latest trends shaping the future of digital marketing and how to leverage them for your business.',
    category: 'Marketing',
    image: '/articles/article-1.jpg',
    author: 'Tim Editorial Esperion',
    published_at: '2024-01-15',
    read_time: 8
  },
  {
    id: 2,
    slug_id: 'ui-ux-best-practices',
    slug_en: 'ui-ux-best-practices',
    title: 'UI/UX Best Practices for Modern Websites',
    excerpt_id: 'Learn the essential principles of user interface and experience design that drive engagement.',
    category: 'Design',
    image: '/articles/article-2.jpg',
    author: 'Tim Editorial Esperion',
    published_at: '2024-01-10',
    read_time: 7
  },
  {
    id: 3,
    slug_id: 'ecommerce-optimization-guide',
    slug_en: 'ecommerce-optimization-guide',
    title: 'Complete Guide to E-Commerce Optimization',
    excerpt_id: 'Proven strategies to increase conversions and boost your online store performance.',
    category: 'E-Commerce',
    image: '/articles/article-3.jpg',
    author: 'Tim Editorial Esperion',
    published_at: '2024-01-05',
    read_time: 9
  },
  {
    id: 4,
    slug_id: 'react-vs-vue-2024',
    slug_en: 'react-vs-vue-2024',
    title: 'React vs Vue: Which Framework to Choose in 2024?',
    excerpt_id: 'A comprehensive comparison of React and Vue for your next web project.',
    category: 'Development',
    image: '/articles/article-4.jpg',
    author: 'Tim Editorial Esperion',
    published_at: '2024-01-01',
    read_time: 10
  },
  {
    id: 5,
    slug_id: 'seo-basics-2024',
    slug_en: 'seo-basics-2024',
    title: 'SEO Basics Every Business Should Know',
    excerpt_id: 'Essential SEO strategies to improve your online visibility and drive organic traffic.',
    category: 'Marketing',
    image: '/articles/article-5.jpg',
    author: 'Tim Editorial Esperion',
    published_at: '2023-12-28',
    read_time: 6
  },
  {
    id: 6,
    slug_id: 'mobile-first-design',
    slug_en: 'mobile-first-design',
    title: 'Why Mobile-First Design Matters',
    excerpt_id: 'Understanding the importance of mobile-first design in todays digital landscape.',
    category: 'Design',
    image: '/articles/article-6.jpg',
    author: 'Tim Editorial Esperion',
    published_at: '2023-12-25',
    read_time: 7
  },
  {
    id: 7,
    slug_id: 'business-growth-strategies',
    slug_en: 'business-growth-strategies',
    title: '10 Strategies for Business Growth',
    excerpt_id: 'Practical strategies to scale your business and increase revenue.',
    category: 'Business',
    image: '/articles/article-7.jpg',
    author: 'Tim Editorial Esperion',
    published_at: '2023-12-20',
    read_time: 8
  },
  {
    id: 8,
    slug_id: 'web-performance-optimization',
    slug_en: 'web-performance-optimization',
    title: 'Web Performance Optimization Tips',
    excerpt_id: 'Learn how to make your website faster and improve user experience.',
    category: 'Development',
    image: '/articles/article-8.jpg',
    author: 'Tim Editorial Esperion',
    published_at: '2023-12-15',
    read_time: 6
  },
  {
    id: 9,
    slug_id: 'social-media-marketing',
    slug_en: 'social-media-marketing',
    title: 'Social Media Marketing Best Practices',
    excerpt_id: 'Maximize your social media presence with these proven strategies.',
    category: 'Marketing',
    image: '/articles/article-9.jpg',
    author: 'Tim Editorial Esperion',
    published_at: '2023-12-10',
    read_time: 8
  },
  {
    id: 10,
    slug_id: 'branding-guide',
    slug_en: 'branding-guide',
    title: 'Complete Branding Guide for Startups',
    excerpt_id: 'Build a strong brand identity from scratch with this comprehensive guide.',
    category: 'Business',
    image: '/articles/article-10.jpg',
    author: 'Tim Editorial Esperion',
    published_at: '2023-12-05',
    read_time: 9
  },
  {
    id: 11,
    slug_id: 'accessibility-web',
    slug_en: 'accessibility-web',
    title: 'Web Accessibility: Why It Matters',
    excerpt_id: 'Making your website accessible to everyone is not just good practice, its essential.',
    category: 'Development',
    image: '/articles/article-11.jpg',
    author: 'Tim Editorial Esperion',
    published_at: '2023-12-01',
    read_time: 6
  },
  {
    id: 12,
    slug_id: 'color-theory-design',
    slug_en: 'color-theory-design',
    title: 'Color Theory for Web Designers',
    excerpt_id: 'Understanding color psychology and how to use it effectively in your designs.',
    category: 'Design',
    image: '/articles/article-12.jpg',
    author: 'Tim Editorial Esperion',
    published_at: '2023-11-28',
    read_time: 7
  }
]

export const publicServices: PublicService[] = [
  {
    slug: 'web-development',
    title: 'Web Development',
    description: 'Website dan aplikasi web yang dirancang untuk kebutuhan bisnis, mulai dari landing page hingga sistem dengan alur yang lebih kompleks.',
    icon: '💻',
    pricing: '$5,000',
    pricingUSD: 5000,
    features: defaultServiceFeatures,
    process: defaultServiceProcess,
    faqs: defaultServiceFaqs
  },
  {
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    description: 'Aplikasi mobile untuk iOS dan Android dengan pendekatan native maupun cross-platform sesuai kebutuhan produk dan tim Anda.',
    icon: '📱',
    pricing: '$7,500',
    pricingUSD: 7500,
    features: defaultServiceFeatures,
    process: defaultServiceProcess,
    faqs: defaultServiceFaqs
  },
  {
    slug: 'ui-ux-design',
    title: 'UI/UX Design',
    description: 'Desain pengalaman dan antarmuka yang membantu produk terasa jelas, mudah dipakai, dan konsisten dengan karakter brand.',
    icon: '🎨',
    pricing: '$3,000',
    pricingUSD: 3000,
    features: defaultServiceFeatures,
    process: defaultServiceProcess,
    faqs: defaultServiceFaqs
  },
  {
    slug: 'digital-marketing',
    title: 'Digital Marketing',
    description: 'Strategi SEO, kampanye digital, dan arah konten untuk membantu brand tampil lebih jelas dan mendorong konversi yang lebih sehat.',
    icon: '📈',
    pricing: '$2,500',
    pricingUSD: 2500,
    features: defaultServiceFeatures,
    process: defaultServiceProcess,
    faqs: defaultServiceFaqs
  },
  {
    slug: 'ecommerce-solutions',
    title: 'E-Commerce Solutions',
    description: 'Pengembangan dan optimalisasi toko online dengan alur belanja, pembayaran, dan pengelolaan katalog yang lebih rapi.',
    icon: '🛒',
    pricing: '$6,000',
    pricingUSD: 6000,
    features: defaultServiceFeatures,
    process: defaultServiceProcess,
    faqs: defaultServiceFaqs
  },
  {
    slug: 'consulting',
    title: 'Digital Consulting',
    description: 'Konsultasi strategi digital untuk membantu bisnis menentukan prioritas produk, proses, dan eksekusi yang paling relevan.',
    icon: '💡',
    pricing: '$2,000',
    pricingUSD: 2000,
    features: defaultServiceFeatures,
    process: defaultServiceProcess,
    faqs: defaultServiceFaqs
  }
]

export const publicWorks: PublicWork[] = [
  {
    id: 1,
    slug: 'ecommerce-platform-redesign',
    title: 'E-Commerce Platform Redesign',
    description: 'Complete redesign of online store resulting in 45% increase in conversions and improved user experience.',
    image: '/works/work-1.jpg',
    service: 'Web Development',
    platform: 'Shopify',
    featured: true,
    client_name: 'Fashion Retailer',
    metrics: [
      { label: 'Conversion Increase', value: '45', suffix: '%' },
      { label: 'Revenue Growth', value: '120', suffix: '%' },
      { label: 'Page Speed', value: '2.1', suffix: 's' }
    ],
    features: [
      'Custom Shopify theme development',
      'Mobile-first responsive design',
      'Advanced product filtering',
      'Integrated payment gateway',
      'Inventory management system',
      'Customer account dashboard',
      'SEO optimization',
      'Performance optimization'
    ],
    gallery: ['/works/work-1-gallery-1.jpg', '/works/work-1-gallery-2.jpg', '/works/work-1-gallery-3.jpg', '/works/work-1-gallery-4.jpg']
  },
  {
    id: 2,
    slug: 'mobile-banking-app',
    title: 'Mobile Banking App',
    description: 'Secure and intuitive mobile banking experience with biometric authentication and real-time notifications.',
    image: '/works/work-2.jpg',
    service: 'Mobile App Development',
    platform: 'React Native',
    featured: true,
    client_name: 'Regional Bank',
    metrics: [
      { label: 'Downloads', value: '50', suffix: 'K+' },
      { label: 'App Rating', value: '4.8', suffix: '/5' },
      { label: 'Active Users', value: '30', suffix: 'K' }
    ],
    features: [
      'Biometric authentication flow',
      'Real-time transaction notifications',
      'Secure fund transfer modules',
      'Card and account management dashboard'
    ],
    gallery: ['/works/work-2-gallery-1.jpg', '/works/work-2-gallery-2.jpg', '/works/work-2-gallery-3.jpg', '/works/work-2-gallery-4.jpg']
  },
  {
    id: 3,
    slug: 'healthcare-portal',
    title: 'Healthcare Patient Portal',
    description: 'Comprehensive patient management system with telemedicine capabilities and electronic health records.',
    image: '/works/work-3.jpg',
    service: 'Web Development',
    platform: 'Next.js',
    featured: true,
    client_name: 'Healthcare Network',
    metrics: [
      { label: 'Patients Served', value: '100', suffix: 'K+' },
      { label: 'Doctors', value: '500', suffix: '+' },
      { label: 'Uptime', value: '99.9', suffix: '%' }
    ],
    features: [
      'Patient profile and appointment management',
      'Telemedicine session scheduling',
      'Secure records and role-based access'
    ],
    gallery: ['/works/work-3-gallery-1.jpg', '/works/work-3-gallery-2.jpg', '/works/work-3-gallery-3.jpg', '/works/work-3-gallery-4.jpg']
  },
  {
    id: 4,
    slug: 'restaurant-website',
    title: 'Restaurant Chain Website',
    description: 'Multi-location website with online ordering integration and real-time menu management.',
    image: '/works/work-4.jpg',
    service: 'Web Development',
    platform: 'Nuxt',
    featured: false,
    client_name: 'Restaurant Group',
    metrics: [
      { label: 'Locations', value: '25', suffix: '+' },
      { label: 'Online Orders', value: '10', suffix: 'K/mo' },
      { label: 'SEO Traffic', value: '200', suffix: '%' }
    ],
    features: [
      'Location-aware menu presentation',
      'Online ordering and checkout',
      'Campaign and seasonal promotion slots'
    ],
    gallery: ['/works/work-4-gallery-1.jpg', '/works/work-4-gallery-2.jpg', '/works/work-4-gallery-3.jpg', '/works/work-4-gallery-4.jpg']
  },
  {
    id: 5,
    slug: 'fitness-tracking-app',
    title: 'Fitness Tracking App',
    description: 'Comprehensive fitness tracking application with AI-powered workout recommendations and nutrition planning.',
    image: '/works/work-5.jpg',
    service: 'Mobile App Development',
    platform: 'Flutter',
    featured: true,
    client_name: 'Fitness Startup',
    metrics: [
      { label: 'Active Users', value: '25', suffix: 'K' },
      { label: 'Workouts Tracked', value: '1', suffix: 'M+' },
      { label: 'App Rating', value: '4.7', suffix: '/5' }
    ],
    features: [
      'Workout planner with adaptive routines',
      'Nutrition and progress tracking',
      'Goal milestones and reminders'
    ],
    gallery: ['/works/work-5-gallery-1.jpg', '/works/work-5-gallery-2.jpg', '/works/work-5-gallery-3.jpg', '/works/work-5-gallery-4.jpg']
  },
  {
    id: 6,
    slug: 'saas-dashboard-ui',
    title: 'SaaS Dashboard UI Design',
    description: 'Modern and intuitive dashboard design for B2B SaaS platform with complex data visualization.',
    image: '/works/work-6.jpg',
    service: 'UI/UX Design',
    platform: 'Vue.js',
    featured: false,
    client_name: 'SaaS Company',
    metrics: [
      { label: 'User Engagement', value: '60', suffix: '%' },
      { label: 'Task Completion', value: '85', suffix: '%' },
      { label: 'NPS Score', value: '72', suffix: '' }
    ],
    features: [
      'Component-based design system',
      'High-density analytics cards',
      'Contextual command patterns'
    ],
    gallery: ['/works/work-6-gallery-1.jpg', '/works/work-6-gallery-2.jpg', '/works/work-6-gallery-3.jpg', '/works/work-6-gallery-4.jpg']
  },
  {
    id: 7,
    slug: 'digital-marketing-campaign',
    title: 'Digital Marketing Campaign',
    description: 'Integrated digital marketing campaign across multiple channels driving brand awareness and lead generation.',
    image: '/works/work-7.jpg',
    service: 'Digital Marketing',
    platform: 'WordPress',
    featured: false,
    client_name: 'Tech Startup',
    metrics: [
      { label: 'Lead Increase', value: '300', suffix: '%' },
      { label: 'CTR', value: '4.5', suffix: '%' },
      { label: 'ROI', value: '450', suffix: '%' }
    ],
    features: [
      'Multi-channel campaign orchestration',
      'Performance dashboard and attribution',
      'Audience segmentation and retargeting'
    ],
    gallery: ['/works/work-7-gallery-1.jpg', '/works/work-7-gallery-2.jpg', '/works/work-7-gallery-3.jpg', '/works/work-7-gallery-4.jpg']
  },
  {
    id: 8,
    slug: 'ecommerce-mobile-app',
    title: 'E-Commerce Mobile App',
    description: 'Native shopping app with AR product visualization and seamless checkout experience.',
    image: '/works/work-8.jpg',
    service: 'Mobile App Development',
    platform: 'React Native',
    featured: false,
    client_name: 'Retail Brand',
    metrics: [
      { label: 'App Sales', value: '35', suffix: '%' },
      { label: 'Retention Rate', value: '45', suffix: '%' },
      { label: 'Avg Order Value', value: '85', suffix: '$' }
    ],
    features: [
      'AR product preview',
      'One-tap checkout flows',
      'Saved carts and personalized offers'
    ],
    gallery: ['/works/work-8-gallery-1.jpg', '/works/work-8-gallery-2.jpg', '/works/work-8-gallery-3.jpg', '/works/work-8-gallery-4.jpg']
  },
  {
    id: 9,
    slug: 'corporate-website',
    title: 'Corporate Website Redesign',
    description: 'Enterprise website redesign with improved navigation and content management system.',
    image: '/works/work-9.jpg',
    service: 'Web Development',
    platform: 'Laravel',
    featured: false,
    client_name: 'Corporation',
    metrics: [
      { label: 'Page Views', value: '500', suffix: 'K/mo' },
      { label: 'Bounce Rate', value: '-40', suffix: '%' },
      { label: 'Load Time', value: '1.8', suffix: 's' }
    ],
    features: [
      'Structured information architecture',
      'Multi-author CMS workflow',
      'SEO-safe migration setup'
    ],
    gallery: ['/works/work-9-gallery-1.jpg', '/works/work-9-gallery-2.jpg', '/works/work-9-gallery-3.jpg', '/works/work-9-gallery-4.jpg']
  },
  {
    id: 10,
    slug: 'brand-identity-design',
    title: 'Brand Identity Design',
    description: 'Complete brand identity package including logo, color palette, and brand guidelines.',
    image: '/works/work-10.jpg',
    service: 'UI/UX Design',
    platform: 'Nuxt',
    featured: false,
    client_name: 'Startup',
    metrics: [
      { label: 'Brand Recognition', value: '75', suffix: '%' },
      { label: 'Social Engagement', value: '200', suffix: '%' },
      { label: 'Website Traffic', value: '150', suffix: '%' }
    ],
    features: [
      'Identity system and logo suite',
      'Brand expression for product UI',
      'Guideline handoff documentation'
    ],
    gallery: ['/works/work-10-gallery-1.jpg', '/works/work-10-gallery-2.jpg', '/works/work-10-gallery-3.jpg', '/works/work-10-gallery-4.jpg']
  },
  {
    id: 11,
    slug: 'seo-optimization-project',
    title: 'SEO Optimization Project',
    description: 'Comprehensive SEO strategy resulting in top rankings for competitive keywords.',
    image: '/works/work-11.jpg',
    service: 'Digital Marketing',
    platform: 'WordPress',
    featured: false,
    client_name: 'Service Company',
    metrics: [
      { label: 'Organic Traffic', value: '400', suffix: '%' },
      { label: 'Keyword Rankings', value: '50', suffix: '+' },
      { label: 'Backlinks', value: '200', suffix: '+' }
    ],
    features: [
      'Technical SEO remediation',
      'Content cluster planning',
      'Search performance reporting'
    ],
    gallery: ['/works/work-11-gallery-1.jpg', '/works/work-11-gallery-2.jpg', '/works/work-11-gallery-3.jpg', '/works/work-11-gallery-4.jpg']
  },
  {
    id: 12,
    slug: 'digital-transformation-consulting',
    title: 'Digital Transformation Consulting',
    description: 'Strategic consulting for enterprise digital transformation initiative.',
    image: '/works/work-12.jpg',
    service: 'Consulting',
    platform: 'Nuxt',
    featured: false,
    client_name: 'Enterprise',
    metrics: [
      { label: 'Cost Reduction', value: '30', suffix: '%' },
      { label: 'Efficiency Gain', value: '50', suffix: '%' },
      { label: 'Employee Satisfaction', value: '85', suffix: '%' }
    ],
    features: [
      'Stakeholder and process mapping',
      'Roadmap and capability planning',
      'Execution governance model'
    ],
    gallery: ['/works/work-12-gallery-1.jpg', '/works/work-12-gallery-2.jpg', '/works/work-12-gallery-3.jpg', '/works/work-12-gallery-4.jpg']
  }
]

export function findPublicArticleBySlug(slug: string): PublicArticle | undefined {
  return publicArticles.find(article => article.slug_id === slug || article.slug_en === slug)
}

export function findPublicServiceBySlug(slug: string): PublicService | undefined {
  return publicServices.find(service => service.slug === slug)
}

export function findPublicWorkBySlug(slug: string): PublicWork | undefined {
  return publicWorks.find(work => work.slug === slug)
}

export function getFeaturedWorks(limit = 5): PublicWork[] {
  return publicWorks.filter(work => work.featured).slice(0, limit)
}

export function getRelatedArticles(slug: string, limit = 3): PublicArticle[] {
  const current = findPublicArticleBySlug(slug)
  const sameCategory = publicArticles.filter(
    article => article.slug_id !== slug && article.category === current?.category
  )

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit)
  }

  const fallback = publicArticles.filter(
    article => article.slug_id !== slug && article.category !== current?.category
  )

  return [...sameCategory, ...fallback].slice(0, limit)
}

export function getRelatedServices(slug: string, limit = 3): PublicService[] {
  return publicServices.filter(service => service.slug !== slug).slice(0, limit)
}

export function getRelatedWorks(slug: string, limit = 3): PublicWork[] {
  const current = findPublicWorkBySlug(slug)
  const sameService = publicWorks.filter(
    work => work.slug !== slug && work.service === current?.service
  )

  if (sameService.length >= limit) {
    return sameService.slice(0, limit)
  }

  const fallback = publicWorks.filter(
    work => work.slug !== slug && work.service !== current?.service
  )

  return [...sameService, ...fallback].slice(0, limit)
}
