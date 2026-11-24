import React, { useState } from 'react'
import type { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SEO from '@/components/SEO'
import VisualStory from '@/components/VisualStory'
import VideoPlayer from '@/components/VideoPlayer'
import { KidsCard, KidsButton, DecorativeBlobs, IconBadge, LearningIcon, TranslationToggle } from '@/components/ui'
import { storyGuides, getStoryGuide, urduAges, type StoryGuide } from '@/data/storyGuides'

const SITE_URL = 'https://alifujala.ai'
const URDU_FONT = "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
const BODY_FONT = { fontFamily: "'Comic Neue', cursive" }
const HEAD_FONT = { fontFamily: "'Bubblegum Sans', cursive" }

type Props = { slug: string }

/**
 * Urdu-first section heading: the Urdu line leads and a smaller English line
 * follows for parents. Sections whose content is Urdu align it to the right;
 * the notes for parents (in English) align it to the left.
 */
function UrduHeading({
  id,
  ur,
  en,
  icon,
  align = 'right',
  tone = 'text-purple-700 dark:text-purple-300',
  size = 'text-2xl sm:text-3xl',
  className = '',
}: {
  id?: string
  ur: string
  en: string
  icon?: React.ReactNode
  align?: 'right' | 'left' | 'center'
  tone?: string
  size?: string
  className?: string
}) {
  const alignText = align === 'right' ? 'text-right' : align === 'left' ? 'text-left' : 'text-center'
  return (
    <h2 id={id} className={`${alignText} ${className}`}>
      <span dir={align === 'left' ? 'ltr' : 'rtl'} className={`flex items-center gap-2 ${align === 'center' ? 'justify-center' : 'justify-start'}`}>
        {icon}
        <span lang="ur" dir="rtl" className={`${size} ${tone}`} style={{ fontFamily: URDU_FONT, lineHeight: 2 }}>
          {ur}
        </span>
      </span>
      <span lang="en" className="block text-base sm:text-lg font-bold text-gray-500 dark:text-gray-400" style={HEAD_FONT}>
        {en}
      </span>
    </h2>
  )
}

export default function StoryPage({ slug }: Props) {
  const story = getStoryGuide(slug) as StoryGuide
  const [reading, setReading] = useState(false)
  const [watching, setWatching] = useState(false)
  const [showEnglish, setShowEnglish] = useState(false)

  if (!story) return null

  const toggleEnglish = () => setShowEnglish((v) => !v)
  const pictureScenes = story.scenes.filter((s) => !s.ending && !s.redEnding)
  const lessonLines = story.scenes.filter((s) => s.ending || s.redEnding).map((s) => s.text)
  const others = storyGuides.filter((s) => s.slug !== story.slug)
  const pageUrl = `${SITE_URL}/stories/${story.slug}`

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: `${story.titleEn} (${story.titleUr})`,
      headline: `${story.titleEn} — Urdu Story for Kids`,
      description: story.summary,
      inLanguage: 'ur',
      genre: 'Moral story',
      audience: { '@type': 'PeopleAudience', suggestedMinAge: parseInt(story.ages, 10) || 3 },
      image: `${SITE_URL}${encodeURI(story.cover)}`,
      url: pageUrl,
      publisher: { '@id': `${SITE_URL}/#organization` },
      isPartOf: { '@type': 'CollectionPage', name: 'Urdu Stories for Kids', url: `${SITE_URL}/stories` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Stories', item: `${SITE_URL}/stories` },
        { '@type': 'ListItem', position: 3, name: story.titleEn, item: pageUrl },
      ],
    },
  ]

  return (
    <div className="kids-page-bg min-h-screen flex flex-col relative">
      <SEO
        title={`${story.titleEn} (${story.titleUr}) — Urdu Story for Kids`}
        description={story.summary}
        ogUrl={pageUrl}
        ogImage={`${SITE_URL}${encodeURI(story.cover)}`}
        ogType="article"
        keywords={`${story.titleEn}, ${story.titleUr}, Urdu story for kids, Urdu kahani, اردو کہانی, moral story in Urdu, ${story.themes.join(', ')}`}
        structuredData={structuredData}
      />
      <DecorativeBlobs variant="soft" motifs={['book', 'letters']} />
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 relative z-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-5 text-sm" style={BODY_FONT}>
          <Link href="/" className="text-indigo-600 dark:text-indigo-300 hover:underline">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/stories" className="text-indigo-600 dark:text-indigo-300 hover:underline">Stories</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600 dark:text-gray-300">{story.titleEn}</span>
        </nav>

        <article>
          {/* Header: the Urdu title leads, the English title supports it */}
          <header className="glass-card relative rounded-[2rem] shadow-candy-lg border-[3px] border-purple-200/70 dark:border-purple-700/40 overflow-hidden mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-60 md:h-full bg-white/50 dark:bg-gray-800/50">
                <img src={story.cover} alt={`${story.titleEn} — cover illustration`} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-center text-center">
                <p lang="ur" dir="rtl" className="text-base text-purple-600 dark:text-purple-300" style={{ fontFamily: URDU_FONT, lineHeight: 2 }}>
                  اردو کہانی · {urduAges(story.ages)}
                </p>
                <h1>
                  <span lang="ur" dir="rtl" className="block text-4xl sm:text-5xl text-indigo-700 dark:text-indigo-200" style={{ fontFamily: URDU_FONT, lineHeight: 2.2 }}>
                    {story.titleUr}
                  </span>
                  <span className="block text-xl sm:text-2xl font-bold leading-tight text-gradient-cool" style={HEAD_FONT}>
                    {story.titleEn}
                  </span>
                </h1>
                <p lang="ur" dir="rtl" className="mt-3 text-lg text-gray-800 dark:text-gray-100" style={{ fontFamily: URDU_FONT, lineHeight: 2.2 }}>
                  {story.summaryUr}
                </p>
                <p lang="en" dir="ltr" className={showEnglish ? 'mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed' : 'hidden'} style={BODY_FONT}>
                  {story.summary}
                </p>
                <div dir="rtl" className="mt-4 flex flex-wrap justify-center gap-2">
                  {story.themesUr.map((t) => (
                    <span key={t} lang="ur" className="text-sm px-3 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-200" style={{ fontFamily: URDU_FONT, lineHeight: 1.9 }}>
                      {t}
                    </span>
                  ))}
                </div>
                <div dir="rtl" className="mt-5 flex flex-wrap justify-center gap-3">
                  <KidsButton onClick={() => setReading(true)} variant="primary" size="md" iconLeft={<LearningIcon name="audio" />}>
                    <span lang="ur" dir="rtl" style={{ fontFamily: URDU_FONT, lineHeight: 1.8 }}>کہانی سنیں</span>
                  </KidsButton>
                  <KidsButton onClick={() => setWatching(true)} variant="warm" size="md" iconLeft={<LearningIcon name="play" />}>
                    <span lang="ur" dir="rtl" style={{ fontFamily: URDU_FONT, lineHeight: 1.8 }}>ویڈیو دیکھیں</span>
                  </KidsButton>
                </div>
                <div className="mt-4 flex justify-center">
                  <TranslationToggle shown={showEnglish} onToggle={toggleEnglish} />
                </div>
              </div>
            </div>
          </header>

          {/* How to use */}
          <KidsCard variant="gradient" tone="amber" padding="md" hoverable={false} className="mb-8">
            <UrduHeading
              ur="اپنے بچے کے ساتھ یہ کہانی کیسے پڑھیں"
              en="How to read this story with your child"
              align="left"
              tone="text-amber-700 dark:text-amber-300"
              size="text-xl sm:text-2xl"
              className="mb-2"
            />
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed" style={BODY_FONT}>
              The story is written in simple, everyday Urdu. Younger children can listen while you point to the pictures;
              early readers can try one Urdu line at a time. Press <strong lang="ur" dir="rtl">کہانی سنیں</strong> (listen)
              to hear the narration with word-by-word highlighting, or <strong lang="ur" dir="rtl">ویڈیو دیکھیں</strong> (watch)
              for the animated video. If a sentence is new to you, press <strong>Show English translation</strong> to see its
              meaning, then hide it again and read the Urdu once more. Finish with the new words and the questions at the end
              of the page.
            </p>
          </KidsCard>

          {/* Scenes */}
          <section aria-labelledby="story-text" className="mb-10">
            <div dir="rtl" className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <UrduHeading id="story-text" ur="تصویروں میں کہانی" en="The story, picture by picture" />
              <TranslationToggle shown={showEnglish} onToggle={toggleEnglish} />
            </div>
            <ol className="space-y-6">
              {pictureScenes.map((scene, i) => (
                <li key={i}>
                  <KidsCard variant="solid" tone={(['purple', 'blue', 'green', 'pink', 'amber', 'indigo'] as const)[i % 6]} padding="none" hoverable={false} className="overflow-hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-5">
                      {scene.img && (
                        <div className="sm:col-span-2 bg-white/60 dark:bg-gray-800/60">
                          <img src={scene.img} alt={`${story.titleEn}, picture ${i + 1}`} loading="lazy" className="w-full h-52 sm:h-full object-cover" />
                        </div>
                      )}
                      <div dir="rtl" className={`${scene.img ? 'sm:col-span-3' : 'sm:col-span-5'} p-5`}>
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm font-bold mb-2">
                          {i + 1}
                        </span>
                        <p lang="ur" dir="rtl" className="text-xl text-gray-800 dark:text-gray-100" style={{ fontFamily: URDU_FONT, lineHeight: 2.3 }}>
                          {scene.text.trim()}
                        </p>
                        {story.englishScenes[i] && (
                          <p
                            lang="en"
                            dir="ltr"
                            className={showEnglish ? 'mt-3 pt-3 border-t border-indigo-100 dark:border-indigo-800 text-left text-gray-600 dark:text-gray-300 leading-relaxed' : 'hidden'}
                            style={BODY_FONT}
                          >
                            {story.englishScenes[i]}
                          </p>
                        )}
                      </div>
                    </div>
                  </KidsCard>
                </li>
              ))}
            </ol>
          </section>

          {/* Lesson */}
          <section aria-labelledby="lesson" className="mb-10">
            <KidsCard variant="gradient" tone="green" padding="lg" hoverable={false}>
              <UrduHeading
                id="lesson"
                ur="سبق"
                en="The lesson"
                icon={<IconBadge name="star" size="sm" />}
                tone="text-emerald-700 dark:text-emerald-300"
                className="mb-2"
              />
              {lessonLines.map((line, i) => (
                <p key={i} lang="ur" dir="rtl" className="text-xl text-gray-800 dark:text-gray-100" style={{ fontFamily: URDU_FONT, lineHeight: 2.3 }}>
                  {line}
                </p>
              ))}
              <p lang="en" dir="ltr" className={showEnglish ? 'mt-3 pt-3 border-t border-emerald-200 dark:border-emerald-800 text-left text-gray-700 dark:text-gray-200 font-bold' : 'hidden'} style={BODY_FONT}>
                {story.moralEn}
              </p>
            </KidsCard>
          </section>

          {/* Vocabulary */}
          <section aria-labelledby="vocab" className="mb-10">
            <UrduHeading id="vocab" ur="کہانی کے نئے الفاظ" en="New words from the story" className="mb-4" />
            <div dir="rtl" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {story.vocabulary.map((w) => (
                <KidsCard key={w.ur} variant="glass" tone="indigo" padding="sm" className="text-center">
                  <p lang="ur" dir="rtl" className="text-2xl text-indigo-700 dark:text-indigo-200" style={{ fontFamily: URDU_FONT, lineHeight: 2.2 }}>
                    {w.ur}
                  </p>
                  <p dir="ltr" className="text-sm font-bold text-gray-700 dark:text-gray-200" style={BODY_FONT}>
                    {w.roman}
                  </p>
                  <p dir="ltr" className="text-xs text-gray-500 dark:text-gray-400" style={BODY_FONT}>{w.en}</p>
                </KidsCard>
              ))}
            </div>
          </section>

          {/* Questions in Urdu, with the English behind the same toggle */}
          <section aria-labelledby="questions" className="mb-6">
            <KidsCard variant="glass" tone="purple" padding="lg" hoverable={false}>
              <div dir="rtl" className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <UrduHeading id="questions" ur="کہانی پر بات چیت" en="Talk about the story" icon={<IconBadge name="question" size="sm" />} />
                <TranslationToggle shown={showEnglish} onToggle={toggleEnglish} />
              </div>
              <ol dir="rtl" className="space-y-4">
                {story.questionsUr.map((q, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-2 inline-flex shrink-0 items-center justify-center w-7 h-7 rounded-full bg-purple-500 text-white text-sm font-bold">
                      {i + 1}
                    </span>
                    <div className="flex-1 text-right">
                      <p lang="ur" className="text-lg text-gray-800 dark:text-gray-100" style={{ fontFamily: URDU_FONT, lineHeight: 2.2 }}>
                        {q}
                      </p>
                      {story.questions[i] && (
                        <p lang="en" dir="ltr" className={showEnglish ? 'text-sm text-right text-gray-600 dark:text-gray-300' : 'hidden'} style={BODY_FONT}>
                          {story.questions[i]}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </KidsCard>
          </section>

          {/* Activity */}
          <section aria-labelledby="activity" className="mb-10">
            <KidsCard variant="glass" tone="blue" padding="lg" hoverable={false}>
              <UrduHeading
                id="activity"
                ur="گھر پر کر کے دیکھیں"
                en="Try this at home"
                icon={<IconBadge name="bulb" size="sm" />}
                align="left"
                tone="text-blue-700 dark:text-blue-300"
                size="text-xl sm:text-2xl"
                className="mb-2"
              />
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed" style={BODY_FONT}>
                {story.activity}
              </p>
              <div className="mt-4">
                <KidsButton href="/activity" variant="outline" size="sm" iconLeft={<LearningIcon name="worksheet" />}>
                  Printable Urdu worksheets
                </KidsButton>
              </div>
            </KidsCard>
          </section>
        </article>

        {/* More stories */}
        <section aria-labelledby="more-stories" className="mb-4">
          <UrduHeading id="more-stories" ur="مزید کہانیاں" en="More Urdu stories" align="center" tone="text-indigo-700 dark:text-indigo-300" className="mb-5" />
          <div dir="rtl" className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {others.map((s) => (
              <Link key={s.slug} href={`/stories/${s.slug}`} className="group block rounded-2xl overflow-hidden border-2 border-white/60 dark:border-white/10 bg-white/80 dark:bg-gray-800/80 shadow-candy hover:-translate-y-1 transition-transform">
                <img src={s.cover} alt={`${s.titleUr} (${s.titleEn})`} loading="lazy" className="w-full h-28 object-cover" />
                <div className="p-3 text-right">
                  <p lang="ur" dir="rtl" className="text-xl text-indigo-700 dark:text-indigo-200 group-hover:text-purple-600" style={{ fontFamily: URDU_FONT, lineHeight: 2 }}>{s.titleUr}</p>
                  <p lang="en" dir="ltr" className="text-right text-xs font-bold text-gray-500 dark:text-gray-400" style={BODY_FONT}>{s.titleEn}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {reading && (
        <VisualStory
          onClose={() => setReading(false)}
          title={story.titleUr}
          scenes={story.scenes}
          storyId={story.storyId}
          onPlayVideo={() => { setReading(false); setWatching(true) }}
        />
      )}
      {watching && <VideoPlayer storyId={story.storyId} title={story.titleUr} onClose={() => setWatching(false)} />}

      <Footer />
    </div>
  )
}

// Pre-render every story for every configured locale so links never lead to a 404.
export const getStaticPaths: GetStaticPaths = async ({ locales }) => ({
  paths: (locales && locales.length ? locales : [undefined]).flatMap((locale) =>
    storyGuides.map((s) => ({ params: { slug: s.slug }, ...(locale ? { locale } : {}) }))
  ),
  fallback: false,
})

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string
  if (!getStoryGuide(slug)) return { notFound: true }
  return { props: { slug } }
}
