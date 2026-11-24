import Link from 'next/link'
import SEO from '@/components/SEO'
import { KidsCard, IconBadge, LearningIcon } from '@/components/ui'
import { GAME_GUIDES } from '@/data/gameGuides'

const SITE_URL = 'https://alifujala.ai'
const BODY_FONT = { fontFamily: "'Comic Neue', cursive" }
const HEAD_FONT = { fontFamily: "'Bubblegum Sans', cursive" }
const MATCHING_ACTIVITIES = ['alphabetMatch', 'matching', 'adhiAshkalMatch', 'urduDottedMatch']

/**
 * Educational guide + page metadata for a game page.
 * Rendered below the game so the page explains what the game teaches,
 * how to play, and how parents/teachers can use it.
 */
export default function GameGuide({ slug }: { slug: string }) {
  const guide = GAME_GUIDES[slug]
  if (!guide) return null

  const url = `${SITE_URL}/games/${guide.slug}`
  const isActivity = MATCHING_ACTIVITIES.includes(guide.slug)
  const hub = isActivity ? { href: '/activity', label: 'All activities & worksheets' } : { href: '/games', label: 'All Urdu games' }

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: guide.name,
      description: guide.description,
      url,
      inLanguage: ['ur', 'en'],
      learningResourceType: isActivity ? 'Interactive activity' : 'Educational game',
      educationalLevel: 'Beginner',
      typicalAgeRange: guide.ages.replace('–', '-'),
      teaches: guide.skills.map((s) => s.title).join(', '),
      isAccessibleForFree: true,
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: isActivity ? 'Activities' : 'Games', item: `${SITE_URL}${hub.href}` },
        { '@type': 'ListItem', position: 3, name: guide.name, item: url },
      ],
    },
  ]

  return (
    <>
      <SEO title={guide.seoTitle} description={guide.description} ogUrl={url} structuredData={structuredData} />

      <section aria-labelledby={`guide-${guide.slug}`} className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-10 pb-12">
        <div className="text-center mb-8">
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-200 text-xs font-bold uppercase tracking-wider mb-3 border border-purple-200 dark:border-purple-700/50" style={BODY_FONT}>
            Guide for parents & teachers · Ages {guide.ages}
          </p>
          <h2 id={`guide-${guide.slug}`} className="text-3xl sm:text-4xl font-bold leading-tight text-gradient-cool" style={HEAD_FONT}>
            About {guide.name}
            {guide.urduName && (
              <span lang="ur" dir="rtl" className="block text-2xl mt-1 text-indigo-600 dark:text-indigo-300 font-normal" style={{ fontFamily: "'Noto Nastaliq Urdu', serif", lineHeight: 2 }}>
                {guide.urduName}
              </span>
            )}
          </h2>
        </div>

        <KidsCard variant="glass" tone="purple" padding="lg" hoverable={false} className="mb-6">
          <div className="space-y-3 text-gray-700 dark:text-gray-200 leading-relaxed text-base sm:text-lg" style={BODY_FONT}>
            {guide.intro.map((p) => <p key={p.slice(0, 32)}>{p}</p>)}
          </div>
        </KidsCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <KidsCard variant="gradient" tone="blue" padding="lg" hoverable={false}>
            <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-3" style={HEAD_FONT}>
              <IconBadge name="gamepad" size="sm" className="mr-2" />How to play
            </h3>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-200" style={BODY_FONT}>
              {guide.howToPlay.map((s) => <li key={s}>{s}</li>)}
            </ol>
          </KidsCard>

          <KidsCard variant="gradient" tone="green" padding="lg" hoverable={false}>
            <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mb-3" style={HEAD_FONT}>
              <IconBadge name="star" size="sm" className="mr-2" />What your child learns
            </h3>
            <ul className="space-y-3" style={BODY_FONT}>
              {guide.skills.map((s) => (
                <li key={s.title} className="text-gray-700 dark:text-gray-200">
                  <strong className="text-emerald-700 dark:text-emerald-300">{s.title}:</strong> {s.body}
                </li>
              ))}
            </ul>
          </KidsCard>
        </div>

        <KidsCard variant="gradient" tone="amber" padding="lg" hoverable={false} className="mb-6">
          <h3 className="text-2xl font-bold text-amber-700 dark:text-amber-300 mb-3" style={HEAD_FONT}>
            <IconBadge name="bulb" size="sm" className="mr-2" />Tips for parents & teachers
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-200" style={BODY_FONT}>
            {guide.parentTips.map((t) => <li key={t}>{t}</li>)}
          </ul>
          {guide.learnMore && (
            <p className="mt-4" style={BODY_FONT}>
              <Link href={guide.learnMore.href} className="inline-flex items-center gap-2 font-bold text-indigo-700 dark:text-indigo-300 underline underline-offset-2">
                <LearningIcon name="book" /> {guide.learnMore.label}
              </Link>
            </p>
          )}
        </KidsCard>

        <div>
          <h3 className="text-xl font-bold text-center mb-4 text-purple-700 dark:text-purple-300" style={HEAD_FONT}>Try next</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {guide.next.map((n) => GAME_GUIDES[n]).filter(Boolean).map((g) => (
              <Link
                key={g.slug}
                href={`/games/${g.slug}`}
                className="group rounded-2xl border-2 border-white/60 dark:border-white/10 bg-white/85 dark:bg-gray-800/85 p-4 shadow-candy hover:-translate-y-1 hover:shadow-candy-lg transition-all"
              >
                <p className="font-bold text-gray-800 dark:text-white group-hover:text-indigo-600" style={HEAD_FONT}>{g.name} →</p>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-3" style={BODY_FONT}>{g.description}</p>
              </Link>
            ))}
          </div>
          <p className="text-center mt-5" style={BODY_FONT}>
            <Link href={hub.href} className="font-bold text-indigo-700 dark:text-indigo-300 underline underline-offset-2">{hub.label}</Link>
          </p>
        </div>
      </section>
    </>
  )
}
