/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://speedtest.dcintelix.rw",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
  },
  changefreq: "daily",
  priority: 1,
  sitemapSize: 5000,
  exclude: ["/admin/*", "/api/*"],
};
