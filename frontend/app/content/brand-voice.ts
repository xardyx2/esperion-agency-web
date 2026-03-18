/**
 * Esperion Brand Voice Guidelines
 *
 * Defines the tone and voice for all content on the Esperion website.
 * This ensures consistent copywriting across all pages.
 */

export const esperionBrandVoice = {
  /**
   * Primary Tone: Friendly & Approachable
   *
   * We speak to clients as partners, not customers.
   * Our language is warm, professional, and easy to understand.
   */
  tone: {
    primary: 'Friendly & Approachable',
    secondary: 'Professional & Trustworthy',
    characteristics: [
      'Conversational but not casual',
      'Professional but not stiff',
      'Clear and concise',
      'Empowering, not condescending'
    ]
  },

  /**
   * Writing Guidelines
   */
  guidelines: {
    // Headlines
    headlines: {
      format: 'Clear benefit + specific outcome',
      length: '50 characters max',
      examples: [
        'Bangun Website yang Bikin Bisnis Lebih Ketemu Pelanggan',
        'Tingkatkan Visibilitas Online dengan SEO yang Tepat',
        'Solusi Digital Komplit untuk Bisnis Anda'
      ]
    },

    // Body text
    body: {
      sentences: 'Keep sentences under 20 words',
      paragraphs: 'Maximum 3-4 sentences per paragraph',
      readability: 'Use active voice, avoid jargon',
      cta: 'Always include clear call-to-action'
    },

    // Technical terms
    technical: {
      approach: 'Explain briefly, then use familiar terms',
      examples: {
        SSL: 'Sertifikat keamanan website (SSL)',
        SEO: 'Optimasi mesin pencarian (SEO)',
        Responsif: 'Tampilan yang menyesuaikan layar HP/Laptop'
      }
    }
  },

  /**
   * Content Templates by Section
   */
  templates: {
    hero: {
      structure: '{Headline} - {Subheadline} - {CTA}',
      headline: 'Unique value proposition',
      subheadline: 'Supporting benefit',
      cta: 'Primary action button text'
    },

    features: {
      structure: '{Feature name} - {Benefit}',
      format: 'Start with verb, focus on outcome'
    },

    cta: {
      structure: '{Problem} - {Solution} - {Action}',
      emotional: 'Address pain points, offer relief'
    }
  },

  /**
   * Localization Guidelines (Indonesian & English)
   */
  localization: {
    indonesian: {
      style: 'Bahasa Indonesia yang natural dan modern',
      avoid: 'Terjemahan kaku dari bahasa Inggris',
      terms: 'Gunakan istilah yang familiar di Indonesia'
    },
    english: {
      style: 'Professional American English',
      tone: 'Direct and confident',
      localization: 'Adapt references for local audience when needed'
    }
  },

  /**
   * Forbidden Patterns
   */
  avoid: [
    'Too much jargon without explanation',
    'Overly technical language',
    'Passive voice',
    'Negative or fear-based messaging',
    'Overpromising without substance',
    'Copy-paste from competitors'
  ],

  /**
   * Voice Examples by Context
   */
  examples: {
    serviceDescription: {
      good: 'Kami membantu bisnis Anda terlihat profesional di online dengan desain yang menarik dan responsif.',
      avoid: 'Kami menyediakan layanan pengembangan web premium dengan teknologi mutakhir.'
    },
    cta: {
      good: 'Mulai проек Anda sekarang - Gratis konsultasi!',
      avoid: 'Hubungi kami untuk informasi lebih lanjut tentang layanan kami.'
    }
  }
}

export default esperionBrandVoice
