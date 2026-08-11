import type { MetadataRoute } from 'next'

const SITE_URL = 'https://www.caracterestore.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/dashboard', '/auth'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
