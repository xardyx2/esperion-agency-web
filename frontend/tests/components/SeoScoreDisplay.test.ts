/**
 * Tests for SeoScoreDisplay component
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeoScoreDisplay from '../../components/SeoScoreDisplay.vue'

describe('SeoScoreDisplay', () => {
  const mockSeoScore = {
    score: 85,
    grade: 'Good',
    breakdown: {
      content_quality: 30,
      on_page_seo: 20,
      readability: 12,
      internal_linking: 8,
      technical_seo: 10,
      local_seo: 5
    },
    suggestions: [
      'Add more internal links (aim for 3+)',
      'Consider adding local keywords for better local SEO'
    ]
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Score Display', () => {
    it('should display score when provided', () => {
      const wrapper = mount(SeoScoreDisplay, {
        props: {
          seoScore: mockSeoScore
        }
      })

      expect(wrapper.text()).toContain('85/100')
      expect(wrapper.text()).toContain('Good')
    })

    it('should show empty state when no score', () => {
      const wrapper = mount(SeoScoreDisplay, {
        props: {
          seoScore: null
        }
      })

      expect(wrapper.text()).toContain('No SEO score available yet')
      expect(wrapper.text()).toContain('Calculate SEO Score')
    })

    it('should emit calculate event when button clicked', async () => {
      const wrapper = mount(SeoScoreDisplay, {
        props: {
          seoScore: null
        }
      })

      await wrapper.find('button').trigger('click')

      expect(wrapper.emitted('calculate')).toHaveLength(1)
    })
  })

  describe('Grade Colors', () => {
    it('should show green for excellent scores (90+)', () => {
      const wrapper = mount(SeoScoreDisplay, {
        props: {
          seoScore: {
            ...mockSeoScore,
            score: 95,
            grade: 'Excellent'
          }
        }
      })

      const scoreElement = wrapper.find('.text-green-500')
      expect(scoreElement.exists()).toBe(true)
    })

    it('should show blue for good scores (80-89)', () => {
      const wrapper = mount(SeoScoreDisplay, {
        props: {
          seoScore: {
            ...mockSeoScore,
            score: 85,
            grade: 'Good'
          }
        }
      })

      const scoreElement = wrapper.find('.text-blue-500')
      expect(scoreElement.exists()).toBe(true)
    })

    it('should show yellow for fair scores (70-79)', () => {
      const wrapper = mount(SeoScoreDisplay, {
        props: {
          seoScore: {
            ...mockSeoScore,
            score: 75,
            grade: 'Fair'
          }
        }
      })

      const scoreElement = wrapper.find('.text-yellow-500')
      expect(scoreElement.exists()).toBe(true)
    })

    it('should show orange for needs improvement scores (60-69)', () => {
      const wrapper = mount(SeoScoreDisplay, {
        props: {
          seoScore: {
            ...mockSeoScore,
            score: 65,
            grade: 'Needs Improvement'
          }
        }
      })

      const scoreElement = wrapper.find('.text-orange-500')
      expect(scoreElement.exists()).toBe(true)
    })

    it('should show red for poor scores (<60)', () => {
      const wrapper = mount(SeoScoreDisplay, {
        props: {
          seoScore: {
            ...mockSeoScore,
            score: 45,
            grade: 'Poor'
          }
        }
      })

      const scoreElement = wrapper.find('.text-red-500')
      expect(scoreElement.exists()).toBe(true)
    })
  })

  describe('Breakdown Display', () => {
    it('should display all breakdown categories', () => {
      const wrapper = mount(SeoScoreDisplay, {
        props: {
          seoScore: mockSeoScore
        }
      })

      expect(wrapper.text()).toContain('Content Quality')
      expect(wrapper.text()).toContain('On-Page SEO')
      expect(wrapper.text()).toContain('Readability')
      expect(wrapper.text()).toContain('Internal Linking')
      expect(wrapper.text()).toContain('Technical SEO')
      expect(wrapper.text()).toContain('Local SEO')
    })

    it('should display correct max values for each category', () => {
      const wrapper = mount(SeoScoreDisplay, {
        props: {
          seoScore: mockSeoScore
        }
      })

      expect(wrapper.text()).toContain('30/35') // Content Quality
      expect(wrapper.text()).toContain('20/25') // On-Page SEO
      expect(wrapper.text()).toContain('12/15') // Readability
      expect(wrapper.text()).toContain('8/10') // Internal Linking
      expect(wrapper.text()).toContain('10/10') // Technical SEO
      expect(wrapper.text()).toContain('5/5') // Local SEO
    })
  })

  describe('Suggestions Display', () => {
    it('should show suggestions when available', () => {
      const wrapper = mount(SeoScoreDisplay, {
        props: {
          seoScore: mockSeoScore
        }
      })

      expect(wrapper.text()).toContain('Suggestions for Improvement')
      expect(wrapper.text()).toContain('Add more internal links')
      expect(wrapper.text()).toContain('Consider adding local keywords')
    })

    it('should hide suggestions section when empty', () => {
      const wrapper = mount(SeoScoreDisplay, {
        props: {
          seoScore: {
            ...mockSeoScore,
            suggestions: []
          }
        }
      })

      expect(wrapper.text()).not.toContain('Suggestions for Improvement')
    })
  })

  describe('Progress Bars', () => {
    it('should display progress bar with correct width', () => {
      const wrapper = mount(SeoScoreDisplay, {
        props: {
          seoScore: mockSeoScore
        }
      })

      const progressBar = wrapper.find('.h-4.rounded-full')
      expect(progressBar.attributes('style')).toContain('width: 85%')
    })

    it('should display breakdown progress bars with correct widths', () => {
      const wrapper = mount(SeoScoreDisplay, {
        props: {
          seoScore: mockSeoScore
        }
      })

      // Content Quality: 30/35 = 85.7%
      const contentQualityBar = wrapper.findAll('.h-2.rounded-full')[0]
      expect(contentQualityBar.attributes('style')).toContain('85')
    })
  })
})
