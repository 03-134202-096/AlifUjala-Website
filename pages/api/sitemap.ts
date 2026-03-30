import type { NextApiRequest, NextApiResponse } from 'next'

const BASE_URL = 'https://alifujala.ai'

const STATIC_PAGES = [
  { url: '/', changefreq: 'weekly', priority: '1.0' },
  { url: '/games', changefreq: 'weekly', priority: '0.9' },
  { url: '/games/alphabetMatch', changefreq: 'monthly', priority: '0.8' },
  { url: '/games/matching', changefreq: 'monthly', priority: '0.8' },
  { url: '/games/adhiAshkalMatch', changefreq: 'monthly', priority: '0.8' },
  { url: '/games/urduAlphabetStories', changefreq: 'monthly', priority: '0.8' },
  { url: '/games/urduHunter', changefreq: 'monthly', priority: '0.9' },
  { url: '/stories', changefreq: 'weekly', priority: '0.8' },
  { url: '/about', changefreq: 'monthly', priority: '0.5' },
  { url: '/blog', changefreq: 'weekly', priority: '0.9' },
  { url: '/blog/how-to-teach-urdu-alphabets-to-kids', changefreq: 'monthly', priority: '0.85' },
  { url: '/login', changefreq: 'yearly', priority: '0.3' },
  { url: '/signup', changefreq: 'yearly', priority: '0.4' },
]

export default function SitemapHandler(req: NextApiRequest, res: NextApiResponse) {
  const today = new Date().toISOString().split('T')[0]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${STATIC_PAGES.map(
  (page) => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${page.url}"/>
    <xhtml:link rel="alternate" hreflang="ur" href="${BASE_URL}${page.url}?lang=ur"/>
  </url>`
).join('\n')}
</urlset>`

  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate')
  res.status(200).send(xml)
}
