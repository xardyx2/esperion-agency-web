const PUBLIC_SOCIALS = [
  {
    name: 'instagram',
    label: 'Instagram',
    url: 'https://instagram.com/esperion_id'
  },
  {
    name: 'facebook',
    label: 'Facebook',
    url: 'https://facebook.com/esperiondigital'
  },
  {
    name: 'linkedin',
    label: 'LinkedIn',
    url: 'https://linkedin.com/company/esperiondigital'
  },
  {
    name: 'tiktok',
    label: 'TikTok',
    url: 'https://tiktok.com/@esperion_id'
  },
  {
    name: 'twitter',
    label: 'Twitter/X',
    url: 'https://twitter.com/esperion_id'
  }
]
const PUBLIC_IDENTITY = {
  siteName: 'Esperion Digital Agency',
  legalName: 'PT Esperion Teknologi Digital',
  siteUrl: 'https://esperion.one',
  email: 'hello@esperion.one',
  phoneDisplay: '+62 812 3456 7890',
  phoneHref: 'tel:+6281234567890',
  whatsappHref: 'https://wa.me/6281234567890',
  officeAddressText: 'Sawangan Elok A1 No 5 RT 1 RW 10',
  officeAreaText: 'Sawangan, Depok, Jawa Barat, Indonesia',
  officeAddressFull: 'Sawangan Elok A1 No 5 RT 1 RW 10, Sawangan, Depok, Jawa Barat, Indonesia',
  mapUrl: 'https://maps.app.goo.gl/w2wJviqcBmoce6ue8',
  businessHours: {
    id: 'Senin - Jumat: 09.00 - 18.00 WIB',
    en: 'Monday - Friday: 09.00 - 18.00 WIB'
  },
  address: {
    streetAddress: 'Sawangan Elok A1 No 5 RT 1 RW 10',
    addressLocality: 'Depok',
    addressRegion: 'Jawa Barat',
    addressCountry: 'ID'
  },
  socials: PUBLIC_SOCIALS,
  sameAs: PUBLIC_SOCIALS.map(social => social.url)
}
function usePublicIdentity() {
  return PUBLIC_IDENTITY
}

export { usePublicIdentity as u }
// # sourceMappingURL=usePublicIdentity-SKKe4NtZ.mjs.map
