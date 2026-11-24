import Head from 'next/head'
import { useRouter } from 'next/router'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  ogUrl?: string
  ogType?: 'website' | 'article'
  twitterCard?: 'summary' | 'summary_large_image'
  noIndex?: boolean
  structuredData?: object
  canonical?: string
}

const BASE_URL = 'https://alifujala.ai'
const SITE_NAME = 'Alif Ujala - Urdu Learning for Kids'
const DEFAULT_DESCRIPTION =
  'Alif Ujala is a fun, interactive platform for children to learn Urdu alphabets through games, stories, and activities. Perfect for kids aged 3–10!'
const DEFAULT_IMAGE = `${BASE_URL}/images/hero.jpg`
const DEFAULT_LOGO = `${BASE_URL}/images/logo.png`
const DEFAULT_KEYWORDS =
  'Urdu learning for kids, Urdu alphabet, learn Urdu online, Urdu stories for kids, Urdu worksheets, printable Urdu worksheets, Urdu tracing worksheets, Urdu alphabet worksheets, Urdu activities, Urdu games, Urdu videos for kids, اردو سیکھیں, اردو کہانیاں, حروف تہجی, Urdu for children, Alif Ujala'

/**
 * Build the canonical URL for the current page from the router path.
 * Query strings and hashes are dropped, and the default locale never appears in the URL,
 * so every page points at exactly one clean address (and never at the homepage by mistake).
 */
function canonicalFromPath(asPath: string | undefined) {
  const clean = (asPath || '/').split(/[?#]/)[0] || '/'
  if (clean === '/' || clean === '') return BASE_URL
  return `${BASE_URL}${clean.replace(/\/$/, '')}`
}

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  ogImage = DEFAULT_IMAGE,
  ogUrl,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noIndex = false,
  structuredData,
  canonical,
}: SEOProps) {
  const router = useRouter()
  const fullTitle = title ? `${title} | Alif Ujala` : 'Alif Ujala — Urdu Learning for Kids'
  const canonicalUrl = canonical || ogUrl || canonicalFromPath(router?.asPath)

  // The /ur/* locale currently serves the same English pages, so keep those copies out of
  // the index and let only the canonical English URLs be indexed.
  const isAlternateLocale = !!router?.locale && !!router?.defaultLocale && router.locale !== router.defaultLocale
  const shouldNoIndex = noIndex || isAlternateLocale
  const robotsContent = shouldNoIndex
    ? 'noindex,follow'
    : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'Alif Ujala',
    alternateName: 'AIEarlyEdge',
    url: BASE_URL,
    logo: DEFAULT_LOGO,
    email: 'aiearlyedge@gmail.com',
    sameAs: [
      'https://www.instagram.com/alifujala.ai/',
      'https://www.facebook.com/profile.php?id=61579001649615',
      'https://www.youtube.com/@AlifUjala',
      'https://play.google.com/store/apps/details?id=com.aiearlyedge.alifujala',
    ],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: SITE_NAME,
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    inLanguage: ['en', 'ur'],
  }

  const extraStructuredData = structuredData
    ? Array.isArray(structuredData)
      ? structuredData
      : [structuredData]
    : []

  const jsonLdPayload = shouldNoIndex ? [] : [organizationSchema, websiteSchema, ...extraStructuredData]

  return (
    <Head>
      {/* ── Basic ─────────────────────────────────────────── */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Alif Ujala" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#6366f1" />
      <meta name="robots" content={robotsContent} />
      {/* A noindex page never also declares a canonical: the two signals would contradict each other. */}
      {!shouldNoIndex && <link rel="canonical" href={canonicalUrl} />}

      {/* ── Open Graph ────────────────────────────────────── */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="ur_PK" />

      {/* ── Twitter Card ──────────────────────────────────── */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={fullTitle} />

      {/* ── JSON-LD Structured Data ───────────────────────── */}
      {jsonLdPayload.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPayload) }}
        />
      )}
    </Head>
  )
}
