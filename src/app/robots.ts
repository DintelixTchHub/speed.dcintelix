export default function robots() {
  return new Response(
    `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /fonts/

Sitemap: https://speedtest.dcintelix.rw/sitemap.xml

User-agent: Googlebot
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: Bingbot
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: Slurp
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: DuckDuckBot
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: Baiduspider
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: YandexBot
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: Sogou
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: facebookexternalhit
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: Twitterbot
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: LinkedInBot
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: Pinterest
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: WhatsApp
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: TelegramBot
Allow: /
Disallow: /admin/
Disallow: /api/

Crawl-delay: 1
`,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );
}
