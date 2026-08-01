import type { MetadataRoute } from "next";

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
    sitemap: "https://speed.dcintelix.rw/sitemap.xml",
    host: "https://speed.dcintelix.rw",
  };
}
