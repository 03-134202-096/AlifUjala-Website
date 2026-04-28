import Head from 'next/head'

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
  'Urdu learning for kids, Urdu alphabet, learn Urdu online, Urdu activities, Urdu games, اردو سیکھیں, حروف تہجی, Urdu for children, Alif Ujala'

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
  const fullTitle = title ? `${title} | Alif Ujala` : 'Alif Ujala — Urdu Learning for Kids 🌟'
  const canonicalUrl = canonical || ogUrl || BASE_URL
  const robotsContent = noIndex
    ? 'noindex,nofollow'
    : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: SITE_NAME,
    url: BASE_URL,
    logo: DEFAULT_LOGO,
    image: ogImage,
    sameAs: [
      'https://www.instagram.com/alifujala.ai/',
      'https://www.facebook.com/profile.php?id=61579001649615',
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

  const jsonLdPayload = [organizationSchema, websiteSchema, ...extraStructuredData]

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
      <link rel="canonical" href={canonicalUrl} />

      {/* ── Open Graph ────────────────────────────────────── */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="ur_PK" />

      {/* ── Twitter Card ──────────────────────────────────── */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content="@AlifUjala" />
      <meta name="twitter:creator" content="@AlifUjala" />
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
