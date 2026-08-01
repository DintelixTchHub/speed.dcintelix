import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://speedtest.dcintelix.rw',
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1,
    },
  ];
}
