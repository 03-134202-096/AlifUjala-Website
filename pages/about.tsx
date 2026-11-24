import type { NextPage } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SEO from '@/components/SEO'
import { KidsCard, KidsButton, SectionHeader, DecorativeBlobs, IconBadge, LearningIcon, type LearningIconName } from '@/components/ui'
import { blogPosts } from '@/data/blogPosts'
import { storyGuides } from '@/data/storyGuides'
import { GAME_GUIDES } from '@/data/gameGuides'

const SITE_URL = 'https://alifujala.ai'
const CONTACT_EMAIL = 'aiearlyedge@gmail.com'
const URDU_FONT = "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
const BODY_FONT = { fontFamily: "'Comic Neue', cursive" }
const HEAD_FONT = { fontFamily: "'Bubblegum Sans', cursive" }

type Offer = { icon: LearningIconName; title: string; body: string; href: string; cta: string }

const PRINCIPLES: { icon: LearningIconName; title: string; body: string }[] = [
  {
    icon: 'letters',
    title: 'Urdu first, English when you need it',
    body: 'Letters, words and stories are shown in proper Nastaliq Urdu first. Short English notes, and story translations you can reveal with one tap, help parents who read little Urdu guide their child with confidence.',
  },
  {
    icon: 'puzzle',
    title: 'Built around how children learn letters',
    body: 'We teach letters in shape families, make the dots (nuqtay) a game of their own, and keep sessions short. Every game page explains what it practises and how to use it, so screen time has a clear purpose.',
  },
  {
    icon: 'heart',
    title: 'Gentle, positive and age-appropriate',
    body: 'Games cheer children on and let them try again straight away. There is no chat and no user-generated content, stories carry simple, kind lessons, and pictures and language are chosen for children aged roughly 3 to 8.',
  },
  {
    icon: 'shield',
    title: 'Free to use, with privacy in mind',
    body: 'Games, worksheets, stories and guides need no account. We collect as little information as possible and explain exactly what we do in our privacy policy.',
  },
]

const About: NextPage = () => {
  const gameCount = Object.keys(GAME_GUIDES).length
  const storyCount = storyGuides.length
  const articleCount = blogPosts.length

  const offers: Offer[] = [
    {
      icon: 'letters',
      title: 'A complete Urdu alphabet guide',
      body: 'Every letter with its name, sound, example word and dots, plus the letter families and the ten letters that never join forward.',
      href: '/urdu-alphabet',
      cta: 'Open the alphabet guide',
    },
    {
      icon: 'gamepad',
      title: `${gameCount} games and matching activities`,
      body: 'Short browser games for letter recognition, sounds, nuqtay and joined shapes. Each one has a written guide for parents and teachers.',
      href: '/games',
      cta: 'Browse the games',
    },
    {
      icon: 'worksheet',
      title: 'Printable worksheets',
      body: 'Tracing, colouring and letter-matching sheets you can print at home or in class to practise handwriting away from the screen.',
      href: '/activity',
      cta: 'See the worksheets',
    },
    {
      icon: 'book',
      title: `${storyCount} illustrated moral stories`,
      body: 'Classic fables told in simple Urdu with narration, new words, questions in Urdu and a follow-up activity, plus an English translation for parents when needed.',
      href: '/stories',
      cta: 'Read the stories',
    },
    {
      icon: 'play',
      title: 'Animated Urdu videos',
      body: 'Letter and story videos from the Alif Ujala YouTube channel, collected in one place for calm, purposeful screen time.',
      href: '/edu-videos',
      cta: 'Watch the videos',
    },
    {
      icon: 'bulb',
      title: `${articleCount} in-depth guides for parents`,
      body: 'Practical articles on teaching letters by family, nuqtay, joining letters, handwriting, bedtime stories and raising Urdu readers abroad.',
      href: '/blog',
      cta: 'Read the blog',
    },
  ]

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About Alif Ujala',
      url: `${SITE_URL}/about`,
      description:
        'Alif Ujala is a free Urdu learning website for young children with an alphabet guide, letter games, worksheets, illustrated stories and guides for parents and teachers.',
      about: { '@id': `${SITE_URL}/#organization` },
    },
  ]

  return (
    <div className="kids-page-bg min-h-screen flex flex-col relative">
      <SEO
        title="About Alif Ujala — Free Urdu Learning for Young Children"
        description="Who we are, why we built Alif Ujala, what you will find on the site and how we create our Urdu games, worksheets, stories and parent guides."
        ogUrl={`${SITE_URL}/about`}
        structuredData={structuredData}
      />
      <DecorativeBlobs variant="soft" motifs={['book', 'heart']} />
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <header className="text-center max-w-3xl mx-auto mb-8">
          <div className="mb-4"><IconBadge name="heart" size="hero" /></div>
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-200 text-xs font-bold uppercase tracking-wider mb-3 border border-purple-200 dark:border-purple-700/50" style={BODY_FONT}>
            About us
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-gradient" style={HEAD_FONT}>
            About Alif Ujala
          </h1>
          <p lang="ur" dir="rtl" className="mt-2 text-2xl text-indigo-600 dark:text-indigo-300" style={{ fontFamily: URDU_FONT, lineHeight: 2.2 }}>
            الف اُجالا — اردو سیکھنے کی روشنی
          </p>
          <p className="mt-3 text-base sm:text-lg text-gray-700 dark:text-gray-200 leading-relaxed" style={BODY_FONT}>
            Alif Ujala is a free website that helps young children take their first steps in reading and writing Urdu — and
            gives the parents and teachers beside them clear, practical guidance on what to do next.
          </p>
        </header>

        {/* Our story */}
        <section className="mb-10">
          <KidsCard variant="glass" tone="purple" padding="lg" hoverable={false}>
            <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 dark:text-purple-300 mb-3" style={HEAD_FONT}>
              Why we built Alif Ujala
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-200 leading-relaxed text-base sm:text-lg" style={BODY_FONT}>
              <p>
                Alif Ujala started with a simple wish: we want children to fall in love with Urdu long before they think of
                it as a school subject. Many families hope their children will read Urdu, but a printed <em>qaida</em> can
                feel dry to a four-year-old, and parents living outside Pakistan often have no Urdu class nearby. Much of
                the Urdu material online for children is a single video or a list of letters, with no help for the adult
                sitting beside the child.
              </p>
              <p>
                So we built Alif Ujala as a learning platform for children, designed from the very first tap for small
                hands and young minds. Children learn their letters through short games, colourful worksheets and
                illustrated stories, so a few minutes of practice feels like play. Next to every activity we explain{' '}
                <strong>what it teaches</strong>, <strong>how to help</strong> and <strong>what to try next</strong>, so
                parents and teachers are never left guessing. The name says it all:{' '}
                <span lang="ur" style={{ fontFamily: URDU_FONT }}>الف</span> (alif) is where every Urdu reader begins, and{' '}
                <span lang="ur" style={{ fontFamily: URDU_FONT }}>اُجالا</span> (ujala) means light — the first light of
                learning.
              </p>
              <p>
                Alif Ujala is created and run by <strong>AIEarlyEdge</strong>, a small team focused on early-years
                language learning. Alongside this website we publish animated Urdu videos on our{' '}
                <a href="https://www.youtube.com/@AlifUjala" target="_blank" rel="noopener noreferrer" className="font-bold text-indigo-600 dark:text-indigo-300 underline underline-offset-2">YouTube channel</a>{' '}
                and offer the <Link href="/our-app" className="font-bold text-indigo-600 dark:text-indigo-300 underline underline-offset-2">Alif Ujala Android app</Link>.
                We keep adding new games, stories, worksheets and guides, and we shape them around the questions parents
                and teachers send us.
              </p>
            </div>
          </KidsCard>
        </section>

        {/* What you'll find */}
        <section className="mb-10">
          <SectionHeader eyebrow="On the site" icon="sparkles" title="What you will find here" subtitle="Everything is free to use and needs no account." tone="cool" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {offers.map((o) => (
              <KidsCard key={o.href} variant="solid" tone="indigo" padding="md" className="flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <IconBadge name={o.icon} size="sm" />
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white leading-snug" style={HEAD_FONT}>{o.title}</h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed flex-1" style={BODY_FONT}>{o.body}</p>
                <Link href={o.href} className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-indigo-700 dark:text-indigo-300 underline underline-offset-2" style={BODY_FONT}>
                  {o.cta} →
                </Link>
              </KidsCard>
            ))}
          </div>
        </section>

        {/* How we create content */}
        <section className="mb-10">
          <SectionHeader eyebrow="Our approach" icon="bulb" title="How we create our content" subtitle="The principles behind every game, story and guide on Alif Ujala." tone="warm" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PRINCIPLES.map((p) => (
              <KidsCard key={p.title} variant="gradient" tone="amber" padding="lg" hoverable={false}>
                <h3 className="flex items-center gap-3 text-xl font-bold text-amber-700 dark:text-amber-300 mb-2" style={HEAD_FONT}>
                  <IconBadge name={p.icon} size="sm" />{p.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed" style={BODY_FONT}>{p.body}</p>
              </KidsCard>
            ))}
          </div>
        </section>

        {/* Accuracy, ads and contact */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          <KidsCard variant="gradient" tone="green" padding="lg" hoverable={false}>
            <h2 className="flex items-center gap-3 text-2xl font-bold text-emerald-700 dark:text-emerald-300 mb-3" style={HEAD_FONT}>
              <IconBadge name="check" size="sm" />Accuracy and corrections
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-200 leading-relaxed" style={BODY_FONT}>
              <p>
                Urdu spelling, letter names and how letters are counted vary a little between primers. Where they differ we
                say so — our <Link href="/urdu-alphabet" className="font-bold text-indigo-700 dark:text-indigo-300 underline underline-offset-2">alphabet guide</Link>{' '}
                explains why some books list 37 letters and others 39.
              </p>
              <p>
                If you spot a mistake in a letter, word, translation or article, please{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold text-indigo-700 dark:text-indigo-300 underline underline-offset-2">email us</a>.
                We read every message and correct errors as soon as we can.
              </p>
            </div>
          </KidsCard>

          <KidsCard variant="gradient" tone="blue" padding="lg" hoverable={false}>
            <h2 className="flex items-center gap-3 text-2xl font-bold text-blue-700 dark:text-blue-300 mb-3" style={HEAD_FONT}>
              <IconBadge name="shield" size="sm" />Keeping Alif Ujala free
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-200 leading-relaxed" style={BODY_FONT}>
              <p>
                Alif Ujala is free for every family and classroom. To cover hosting and the time it takes to make new
                material, the website may show a limited number of advertisements served by Google AdSense.
              </p>
              <p>
                Ads never decide what we teach. You can read how ads and cookies work on our site in the{' '}
                <Link href="/privacy" className="font-bold text-indigo-700 dark:text-indigo-300 underline underline-offset-2">privacy policy</Link>, and the limits of our
                educational content in the{' '}
                <Link href="/disclaimer" className="font-bold text-indigo-700 dark:text-indigo-300 underline underline-offset-2">disclaimer</Link>.
              </p>
            </div>
          </KidsCard>
        </section>

        {/* Urdu summary */}
        <section className="mb-10">
          <KidsCard variant="glass" tone="indigo" padding="lg" hoverable={false}>
            <div lang="ur" dir="rtl" className="text-right text-gray-800 dark:text-gray-100" style={{ fontFamily: URDU_FONT, lineHeight: 2.3 }}>
              <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-2">ہمارا مقصد</h2>
              <p className="text-lg" style={{ lineHeight: 2.6 }}>
                الف اُجالا کا مقصد بچوں کے لیے اردو پڑھنا اور لکھنا سیکھنا آسان اور خوشگوار بنانا ہے۔ یہاں حروفِ تہجی کی مکمل
                رہنمائی، حروف کے کھیل، ورک شیٹس، تصویری کہانیاں اور والدین اور اساتذہ کے لیے مفید مضامین مفت دستیاب ہیں۔
              </p>
            </div>
          </KidsCard>
        </section>

        {/* Contact CTA */}
        <section className="text-center">
          <KidsCard variant="glass" tone="pink" padding="lg" hoverable={false}>
            <h2 className="text-2xl sm:text-3xl font-bold text-gradient-warm mb-2" style={HEAD_FONT}>Get in touch</h2>
            <p className="text-gray-700 dark:text-gray-200 max-w-2xl mx-auto mb-5" style={BODY_FONT}>
              Questions, ideas for new games or stories, school enquiries or feedback — we would love to hear from you at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold text-indigo-700 dark:text-indigo-300 underline underline-offset-2">{CONTACT_EMAIL}</a>.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <KidsButton href="/contact" variant="primary" size="lg" iconLeft={<LearningIcon name="mail" />}>Contact us</KidsButton>
              <KidsButton href="/urdu-alphabet" variant="success" size="lg" iconLeft={<LearningIcon name="letters" />}>Start with the alphabet</KidsButton>
            </div>
          </KidsCard>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default About
