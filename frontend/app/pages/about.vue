<template>
  <div class="min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark">
    <!-- Banner Section -->
    <section class="relative h-[300px] md:h-[400px] bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="absolute inset-0 bg-gradient-to-r from-es-accent-primary/20 to-es-accent-primary/10 dark:from-es-accent-primary-dark/20 dark:to-es-accent-primary-dark/10"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
            About Us
          </h1>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-lg max-w-2xl mx-auto">
            Get to know the team behind Esperion Digital Agency
          </p>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-2 gap-12 items-start">
          <!-- About Us -->
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">
              About Esperion
            </h2>
            <p class="text-es-text-secondary dark:text-es-text-secondary-dark leading-relaxed mb-6">
              Esperion is a full-service digital agency based in Jakarta, Indonesia. Founded in 2014, we have been helping businesses of all sizes transform their digital presence and achieve their goals through innovative technology solutions.
            </p>
            <p class="text-es-text-secondary dark:text-es-text-secondary-dark leading-relaxed mb-6">
              Our team of passionate designers, developers, and strategists work together to deliver exceptional results that exceed expectations. We believe in building long-term partnerships with our clients, understanding their unique challenges, and crafting tailored solutions that drive real business growth.
            </p>
            <p class="text-es-text-secondary dark:text-es-text-secondary-dark leading-relaxed">
              With over 150 successful projects and 80+ happy clients, we have established ourselves as a trusted partner for digital transformation.
            </p>
          </div>

          <!-- Vision & Mission -->
          <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-8">
            <h3 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">
              Our Vision & Mission
            </h3>
            <div class="space-y-6">
              <div>
                <div class="flex items-center gap-3 mb-3">
                  <span class="text-3xl">🎯</span>
                  <h4 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark">Vision</h4>
                </div>
                <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
                  To be the leading digital transformation partner for businesses in Southeast Asia, empowering them to thrive in the digital age.
                </p>
              </div>
              <div>
                <div class="flex items-center gap-3 mb-3">
                  <span class="text-3xl">🚀</span>
                  <h4 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark">Mission</h4>
                </div>
                <ul class="space-y-2 text-es-text-secondary dark:text-es-text-secondary-dark">
                  <li class="flex items-start gap-2">
                    <span class="text-es-accent-primary dark:text-es-accent-primary-dark mt-1">✓</span>
                    <span>Deliver innovative digital solutions that drive business growth</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-es-accent-primary dark:text-es-accent-primary-dark mt-1">✓</span>
                    <span>Build lasting partnerships based on trust and results</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-es-accent-primary dark:text-es-accent-primary-dark mt-1">✓</span>
                    <span>Continuously innovate and stay ahead of industry trends</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-es-accent-primary dark:text-es-accent-primary-dark mt-1">✓</span>
                    <span>Foster a culture of excellence and continuous learning</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-12 md:py-16 bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold text-es-accent-primary dark:text-es-accent-primary-dark mb-2">
              150+
            </div>
            <div class="text-es-text-secondary dark:text-es-text-secondary-dark">Projects Completed</div>
          </div>
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold text-es-accent-primary dark:text-es-accent-primary-dark mb-2">
              80+
            </div>
            <div class="text-es-text-secondary dark:text-es-text-secondary-dark">Happy Clients</div>
          </div>
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold text-es-accent-primary dark:text-es-accent-primary-dark mb-2">
              10+
            </div>
            <div class="text-es-text-secondary dark:text-es-text-secondary-dark">Years Experience</div>
          </div>
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold text-es-accent-primary dark:text-es-accent-primary-dark mb-2">
              25+
            </div>
            <div class="text-es-text-secondary dark:text-es-text-secondary-dark">Team Members</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Founders Section -->
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
            Meet Our Founders
          </h2>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark max-w-2xl mx-auto">
            The visionary leaders who started Esperion with a dream to transform businesses through technology
          </p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="founder in founders" :key="founder.name" class="text-center">
            <div class="w-48 h-48 mx-auto mb-6 rounded-full bg-es-bg-secondary dark:bg-es-bg-secondary-dark overflow-hidden">
              <img :src="founder.image" :alt="founder.name" class="w-full h-full object-cover" />
            </div>
            <h3 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-1">
              {{ founder.name }}
            </h3>
            <p class="text-es-accent-primary dark:text-es-accent-primary-dark mb-4">
              {{ founder.role }}
            </p>
            <div class="flex justify-center gap-4">
              <a v-for="social in founder.social" :key="social.platform" :href="social.url" class="text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors">
                <span class="text-xl">{{ social.icon }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="py-12 md:py-16 bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
            Our Core Values
          </h2>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark max-w-2xl mx-auto">
            The principles that guide everything we do
          </p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="value in values" :key="value.title" class="text-center">
            <div class="text-5xl mb-4">{{ value.icon }}</div>
            <h3 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-3">
              {{ value.title }}
            </h3>
            <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ value.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 md:py-24 bg-es-accent-primary dark:bg-es-accent-primary-dark">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-es-text-inverse dark:text-es-text-inverse-dark mb-4">
          Ready to Work With Us?
        </h2>
        <p class="text-es-text-inverse/90 dark:text-es-text-inverse-dark/90 text-lg mb-8 max-w-2xl mx-auto">
          Let's discuss how we can help transform your digital presence
        </p>
        <NuxtLink
          to="/contact-us"
          class="inline-flex items-center px-8 py-4 bg-es-bg-inverse dark:bg-es-bg-inverse-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-semibold hover:bg-es-bg-primary dark:hover:bg-es-bg-primary-dark transition-colors"
        >
          Get in Touch
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// SEO Meta
useSeoMeta({
  title: 'About Us - Esperion Digital Agency',
  description: 'Learn about Esperion Digital Agency, our team, vision, and mission to transform businesses through digital solutions.',
  ogTitle: 'About Esperion',
  ogDescription: 'Get to know the team behind Esperion Digital Agency.',
});

const founders = [
  {
    name: 'Alex Chen',
    role: 'CEO & Co-Founder',
    image: '/founders/founder-1.jpg',
    social: [
      { platform: 'LinkedIn', icon: '💼', url: '#' },
      { platform: 'Twitter', icon: '🐦', url: '#' },
    ],
  },
  {
    name: 'Sarah Williams',
    role: 'CTO & Co-Founder',
    image: '/founders/founder-2.jpg',
    social: [
      { platform: 'LinkedIn', icon: '💼', url: '#' },
      { platform: 'GitHub', icon: '🐙', url: '#' },
    ],
  },
  {
    name: 'Michael Tan',
    role: 'Creative Director & Co-Founder',
    image: '/founders/founder-3.jpg',
    social: [
      { platform: 'LinkedIn', icon: '💼', url: '#' },
      { platform: 'Instagram', icon: '📷', url: '#' },
    ],
  },
];

const values = [
  {
    icon: '🎯',
    title: 'Excellence',
    description: 'We strive for excellence in everything we do, delivering high-quality results that exceed expectations.',
  },
  {
    icon: '🤝',
    title: 'Integrity',
    description: 'We build trust through honest communication, transparency, and ethical business practices.',
  },
  {
    icon: '💡',
    title: 'Innovation',
    description: 'We embrace new ideas and technologies to create cutting-edge solutions for our clients.',
  },
  {
    icon: '👥',
    title: 'Collaboration',
    description: 'We believe in the power of teamwork and partnership to achieve great results.',
  },
];
</script>