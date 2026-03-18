/**
 * Esperion Banner Slide Templates
 *
 * Pre-defined banner templates for the homepage slider.
 * Configurable via dashboard.
 */

export interface BannerSlide {
  id: string
  title_id: string
  title_en: string
  subtitle_id: string
  subtitle_en: string
  cta_text_id: string
  cta_text_en: string
  cta_link: string
  background_image: string
  text_color: 'light' | 'dark'
  alignment: 'left' | 'center' | 'right'
}

export const bannerSlideTemplates: Omit<BannerSlide, 'id'>[] = [
  /**
   * Template 1: Hero Services
   * Focus on main service proposition
   */
  {
    title_id: 'Solusi Digital Komplit untuk Bisnis Anda',
    title_en: 'Complete Digital Solutions for Your Business',
    subtitle_id: 'Dari desain website hingga SEO, kami bantu bisnismu lebih terlihat di online.',
    subtitle_en: 'From web design to SEO, we help your business get noticed online.',
    cta_text_id: 'Lihat Layanan',
    cta_text_en: 'View Services',
    cta_link: '/our-services',
    background_image: '/images/banners/hero-services.jpg',
    text_color: 'light',
    alignment: 'left'
  },

  /**
   * Template 2: Portfolio/Works Showcase
   * Highlight previous projects
   */
  {
    title_id: 'Telah Membantu 50+ Bisnis Berhasil',
    title_en: 'Helped 50+ Businesses Succeed',
    subtitle_id: 'Lihat bagaimana kami membantu klien mencapai tujuan mereka.',
    subtitle_en: 'See how we help our clients achieve their goals.',
    cta_text_id: 'Lihat Portfolio',
    cta_text_en: 'View Portfolio',
    cta_link: '/our-works',
    background_image: '/images/banners/portfolio.jpg',
    text_color: 'light',
    alignment: 'center'
  },

  /**
   * Template 3: Lead Generation
   * Drive contact form submissions
   */
  {
    title_id: 'Siap Tingkatkan Bisnis Anda?',
    title_en: 'Ready to Grow Your Business?',
    subtitle_id: 'Konsultasi gratis untuk memahami kebutuhan digital bisnismu.',
    subtitle_en: 'Free consultation to understand your digital needs.',
    cta_text_id: 'Hubungi Kami',
    cta_text_en: 'Contact Us',
    cta_link: '/contact-us',
    background_image: '/images/banners/lead-gen.jpg',
    text_color: 'dark',
    alignment: 'right'
  },

  /**
   * Template 4: Trust/Social Proof
   * Build credibility
   */
  {
    title_id: 'Dipercaya oleh Bisnis Terbesar',
    title_en: 'Trusted by Leading Businesses',
    subtitle_id: 'Bergabung dengan ratusan klien yang puas dengan layanan kami.',
    subtitle_en: 'Join hundreds of satisfied clients with our services.',
    cta_text_id: 'Baca Testimoni',
    cta_text_en: 'Read Testimonials',
    cta_link: '/about',
    background_image: '/images/banners/trust.jpg',
    text_color: 'light',
    alignment: 'center'
  },

  /**
   * Template 5: Special Offer/Promo
   * Limited time offer
   */
  {
    title_id: 'Promo Spesial: Buat Website Gratis Konsultasi',
    title_en: 'Special Offer: Free Website Consultation',
    subtitle_id: 'Sekarang sampai akhir bulan, konsultasi gratis untuk semua proyek digital.',
    subtitle_en: 'Free consultation for all digital projects until end of month.',
    cta_text_id: 'Ambil Promo',
    cta_text_en: 'Get Offer',
    cta_link: '/contact-us?promo=special',
    background_image: '/images/banners/promo.jpg',
    text_color: 'light',
    alignment: 'center'
  }
]

export default bannerSlideTemplates
