import { describe, expect, it } from 'vitest'

import {
  findPublicArticleBySlug,
  findPublicServiceBySlug,
  findPublicWorkBySlug,
  getFeaturedWorks,
  getRelatedArticles,
  getRelatedServices,
  getRelatedWorks,
  publicArticles,
  publicServices,
  publicWorks
} from '../app/data/public-content'

describe('public content routing contract', () => {
  it('keeps featured works slugs aligned with works listing data', () => {
    const featured = getFeaturedWorks(10)

    expect(featured.length).toBeGreaterThan(0)

    for (const work of featured) {
      expect(findPublicWorkBySlug(work.slug)).toBeDefined()
      expect(work.slug.startsWith('project-')).toBe(false)
    }
  })

  it('resolves known article/service/work slugs from one source of truth', () => {
    expect(findPublicArticleBySlug(publicArticles[0].slug_id)?.slug_id).toBe(publicArticles[0].slug_id)
    expect(findPublicServiceBySlug(publicServices[0].slug)?.slug).toBe(publicServices[0].slug)
    expect(findPublicWorkBySlug(publicWorks[0].slug)?.slug).toBe(publicWorks[0].slug)
  })

  it('returns undefined for missing article/service/work slugs', () => {
    expect(findPublicArticleBySlug('missing-article-slug')).toBeUndefined()
    expect(findPublicServiceBySlug('missing-service-slug')).toBeUndefined()
    expect(findPublicWorkBySlug('missing-work-slug')).toBeUndefined()
  })

  it('builds related collections without echoing the current slug', () => {
    const articleSlug = publicArticles[0].slug_id
    const serviceSlug = publicServices[0].slug
    const workSlug = publicWorks[0].slug

    const relatedArticles = getRelatedArticles(articleSlug, 3)
    const relatedServices = getRelatedServices(serviceSlug, 3)
    const relatedWorks = getRelatedWorks(workSlug, 3)

    expect(relatedArticles.length).toBeLessThanOrEqual(3)
    expect(relatedServices.length).toBeLessThanOrEqual(3)
    expect(relatedWorks.length).toBeLessThanOrEqual(3)

    expect(relatedArticles.some(item => item.slug_id === articleSlug)).toBe(false)
    expect(relatedServices.some(item => item.slug === serviceSlug)).toBe(false)
    expect(relatedWorks.some(item => item.slug === workSlug)).toBe(false)
  })
})
