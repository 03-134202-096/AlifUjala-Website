const DEFAULT_SITE_URL = 'https://alifujala.ai'

export type SitemapEntry = {
  path: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: string
}

export const SITEMAP_ENTRIES: SitemapEntry[] = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/games', changefreq: 'weekly', priority: '0.9' },
  { path: '/games/alphabetMatch', changefreq: 'monthly', priority: '0.8' },
  { path: '/games/matching', changefreq: 'monthly', priority: '0.8' },
  { path: '/games/adhiAshkalMatch', changefreq: 'monthly', priority: '0.8' },
  { path: '/games/urduAlphabetStories', changefreq: 'monthly', priority: '0.8' },
  { path: '/games/urduHunter', changefreq: 'monthly', priority: '0.9' },
  { path: '/stories', changefreq: 'weekly', priority: '0.8' },
  { path: '/about', changefreq: 'monthly', priority: '0.5' },
  { path: '/blog', changefreq: 'weekly', priority: '0.9' },
  { path: '/blog/how-to-teach-urdu-alphabets-to-kids', changefreq: 'monthly', priority: '0.85' },
  { path: '/login', changefreq: 'yearly', priority: '0.3' },
  { path: '/signup', changefreq: 'yearly', priority: '0.4' },
]

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '')
}

export function getSitemapLastmod(date = new Date()) {
  return process.env.SITEMAP_LASTMOD || date.toISOString().split('T')[0]
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function buildSitemapXml(entries = SITEMAP_ENTRIES) {
  const siteUrl = getSiteUrl()
  const lastmod = getSitemapLastmod()

  const urls = entries
    .map((entry) => {
      const loc = `${siteUrl}${entry.path}`
      const urPath = entry.path === '/' ? '/ur' : `/ur${entry.path}`

      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(loc)}"/>
    <xhtml:link rel="alternate" hreflang="ur" href="${escapeXml(`${siteUrl}${urPath}`)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(loc)}"/>
  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`
}

