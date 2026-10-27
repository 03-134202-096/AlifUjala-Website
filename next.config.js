/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Images optimization (you can allow specific domains if you load remote images)
  images: {
    domains: [], // add domains if you load external images
  },
  // Internationalization (optional, can help if you add English/Urdu toggle later)
  i18n: {
    locales: ['en', 'ur'],
    defaultLocale: 'en',
    // Don't auto-redirect by Accept-Language: keep clean, crawlable URLs for search engines.
    localeDetection: false,
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ];
  },
}
module.exports = nextConfig