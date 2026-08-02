/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://speed.dcintelix.rw",
  generateRobotsTxt: false,
  changefreq: "daily",
  priority: 1,
  sitemapSize: 5000,
  exclude: ["/admin/*", "/api/*"],
  additionalPaths: async () => [
    { loc: "/about", changefreq: "monthly", priority: 0.8 },
    { loc: "/contact", changefreq: "monthly", priority: 0.8 },
    { loc: "/privacy", changefreq: "monthly", priority: 0.7 },
    { loc: "/cookies", changefreq: "monthly", priority: 0.7 },
    { loc: "/terms", changefreq: "monthly", priority: 0.7 },
  ],
};
