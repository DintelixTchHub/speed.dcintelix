import type { MetadataRoute } from "next";

const SITE_URL = "https://speed.dcintelix.rw";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/_next/", "/fonts/"],
        crawlDelay: 1,
      },
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "Slurp",
          "DuckDuckBot",
          "Baiduspider",
          "YandexBot",
          "Sogou",
          "facebookexternalhit",
          "Twitterbot",
          "LinkedInBot",
          "Pinterest",
          "WhatsApp",
          "TelegramBot",
        ],
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
