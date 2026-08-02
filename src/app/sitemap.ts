import type { MetadataRoute } from 'next'

const SITE_URL = 'https://speed.dcintelix.rw'

const staticRoutes = [
  { path: '', priority: 1, changeFrequency: 'daily' as const },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/privacy', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/cookies', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/terms', priority: 0.7, changeFrequency: 'monthly' as const },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
