import { blogPosts } from '@/data/blogPosts'

const DEFAULT_SITE_URL = 'https://alifujala.ai'

export type SitemapEntry = {
  path: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: string
}

/** Core, crawlable pages. Keep high-value content pages near the top with higher priority. */
export const STATIC_ENTRIES: SitemapEntry[] = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },

  // High-value content hubs (what people actually search for)
  { path: '/activity', changefreq: 'weekly', priority: '0.9' },
  { path: '/stories', changefreq: 'weekly', priority: '0.9' },
  { path: '/edu-videos', changefreq: 'weekly', priority: '0.9' },
  { path: '/games', changefreq: 'weekly', priority: '0.9' },
  { path: '/blog', changefreq: 'weekly', priority: '0.8' },
  { path: '/our-app', changefreq: 'monthly', priority: '0.7' },
  { path: '/about', changefreq: 'monthly', priority: '0.5' },

  // Individual games
  { path: '/games/alphabetMatch', changefreq: 'monthly', priority: '0.7' },
  { path: '/games/matching', changefreq: 'monthly', priority: '0.7' },
  { path: '/games/imageMatch', changefreq: 'monthly', priority: '0.7' },
  { path: '/games/memoryMatch', changefreq: 'monthly', priority: '0.7' },
  { path: '/games/adhiAshkalMatch', changefreq: 'monthly', priority: '0.7' },
  { path: '/games/urduAlphabetStories', changefreq: 'monthly', priority: '0.8' },
  { path: '/games/urduHunter', changefreq: 'monthly', priority: '0.8' },
  { path: '/games/urduBalloonPop', changefreq: 'monthly', priority: '0.7' },
  { path: '/games/urduBasketCatch', changefreq: 'monthly', priority: '0.7' },
  { path: '/games/urduDottedMatch', changefreq: 'monthly', priority: '0.7' },
  { path: '/games/urduGridFind', changefreq: 'monthly', priority: '0.7' },
  { path: '/games/urduNuqtaSort', changefreq: 'monthly', priority: '0.7' },
  { path: '/games/urduTileTap', changefreq: 'monthly', priority: '0.7' },
  { path: '/games/urduTrainPuzzle', changefreq: 'monthly', priority: '0.7' },
  { path: '/games/whackALetter', changefreq: 'monthly', priority: '0.7' },

  // Account entry points (low priority, still crawlable)
  { path: '/signup', changefreq: 'yearly', priority: '0.4' },
  { path: '/login', changefreq: 'yearly', priority: '0.3' },
]

/** Build the full set of sitemap entries, including every blog post from the data file. */
export function getSitemapEntries(): SitemapEntry[] {
  const blogEntries: SitemapEntry[] = blogPosts.map((post) => ({
    path: `/blog/${post.slug}`,
    changefreq: 'monthly',
    priority: '0.75',
  }))
  return [...STATIC_ENTRIES, ...blogEntries]
}

export const SITEMAP_ENTRIES: SitemapEntry[] = getSitemapEntries()

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

      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}
