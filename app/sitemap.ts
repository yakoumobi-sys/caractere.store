import type { MetadataRoute } from 'next'

const SITE_URL = 'https://www.caracteredz.com'

// Uniquement les pages de contenu public destinées à être indexées — pas
// /auth/*, /admin/*, /dashboard, /suivi/[reference] (pages par utilisateur/
// commande, pas de contenu générique) ni /api/*.
const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/entreprises', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/particuliers', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/print-on-demand', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/devis-express', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/produits', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/collection', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/comment-ca-marche', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/designer', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/studio-3d', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/configurateur', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/avis', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/mentions-legales', priority: 0.3, changeFrequency: 'yearly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))
}
