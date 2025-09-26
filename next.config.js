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
  },
}

module.exports = nextConfig
