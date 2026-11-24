import { blogPosts } from '@/data/blogPosts'
import { storyGuides } from '@/data/storyGuides'

const DEFAULT_SITE_URL = 'https://alifujala.ai'

/** Date of the last substantial content update across the site. Bump it when pages change. */
const CONTENT_UPDATED = '2026-11-23'

export type SitemapEntry = {
  path: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: string
  /** YYYY-MM-DD of the last real change to this page. Defaults to CONTENT_UPDATED. */
  lastmod?: string
}

/**
 * Pages we want Google to index. Account, login and placeholder pages are intentionally
 * left out (they are also marked noindex) so the sitemap only lists pages with real content.
 */
export const STATIC_ENTRIES: SitemapEntry[] = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },

  // High-value content hubs (what people actually search for)
  { path: '/urdu-alphabet', changefreq: 'monthly', priority: '0.9' },
  { path: '/activity', changefreq: 'weekly', priority: '0.9' },
  { path: '/stories', changefreq: 'weekly', priority: '0.9' },
  { path: '/edu-videos', changefreq: 'weekly', priority: '0.9' },
  { path: '/games', changefreq: 'weekly', priority: '0.9' },
  { path: '/blog', changefreq: 'weekly', priority: '0.8' },
  { path: '/our-app', changefreq: 'monthly', priority: '0.6' },
  { path: '/about', changefreq: 'monthly', priority: '0.6' },
  { path: '/contact', changefreq: 'yearly', priority: '0.5' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms', changefreq: 'yearly', priority: '0.3' },
  { path: '/disclaimer', changefreq: 'yearly', priority: '0.3' },

  // Individual games and activities (each has its own written guide for parents)
  { path: '/games/alphabetMatch', changefreq: 'monthly', priority: '0.7' },
  { path: '/games/matching', changefreq: 'monthly', priority: '0.7' },
  { path: '/games/memoryMatch', changefreq: 'monthly', priority: '0.7' },
  { path: '/games/adhiAshkalMatch', changefreq: 'monthly', priority: '0.7' },
  { path: '/games/urduHunter', changefreq: 'monthly', priority: '0.7' },
  { path: '/games/urduBalloonPop', changefreq: 'monthly', priority: '0.7' },
  { path: '/games/urduBasketCatch', changefreq: 'monthly', priority: '0.7' },
  { path: '/games/urduDottedMatch', changefreq: 'monthly', priority: '0.7' },
  { path: '/games/urduGridFind', changefreq: 'monthly', priority: '0.7' },
  { path: '/games/urduNuqtaSort', changefreq: 'monthly', priority: '0.7' },
  { path: '/games/urduTileTap', changefreq: 'monthly', priority: '0.7' },
  { path: '/games/urduTrainPuzzle', changefreq: 'monthly', priority: '0.7' },
  { path: '/games/whackALetter', changefreq: 'monthly', priority: '0.7' },
]

/** Build the full set of sitemap entries, including every story and blog post from the data files. */
export function getSitemapEntries(): SitemapEntry[] {
  const storyEntries: SitemapEntry[] = storyGuides.map((story) => ({
    path: `/stories/${story.slug}`,
    changefreq: 'monthly',
    priority: '0.8',
  }))
  const blogEntries: SitemapEntry[] = blogPosts.map((post) => ({
    path: `/blog/${post.slug}`,
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: post.date > CONTENT_UPDATED ? post.date : CONTENT_UPDATED,
  }))
  return [...STATIC_ENTRIES, ...storyEntries, ...blogEntries]
}

export const SITEMAP_ENTRIES: SitemapEntry[] = getSitemapEntries()

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '')
}

export function getSitemapLastmod(entry?: SitemapEntry) {
  return entry?.lastmod || process.env.SITEMAP_LASTMOD || CONTENT_UPDATED
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

  const urls = entries
    .map((entry) => {
      const loc = `${siteUrl}${entry.path === '/' ? '' : entry.path}`
      const lastmod = getSitemapLastmod(entry)

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
