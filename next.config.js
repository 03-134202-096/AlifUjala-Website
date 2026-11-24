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
  // Consolidate duplicate / retired pages into their best equivalent so search engines
  // (and AdSense reviewers) only see one strong page per topic.
  async redirects() {
    return [
      {
        // Same video library as /edu-videos — keep a single page for it.
        source: '/games/urduAlphabetStories',
        destination: '/edu-videos',
        permanent: true,
      },
      {
        // Retired 5-picture prototype; "Letter to Image" is the full version of this game.
        source: '/games/imageMatch',
        destination: '/games/matching',
        permanent: true,
      },
    ];
  },
}
module.exports = nextConfig
