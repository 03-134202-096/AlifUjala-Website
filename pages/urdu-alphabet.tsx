import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SEO from '@/components/SEO'
import { KidsCard, KidsButton, SectionHeader, DecorativeBlobs, IconBadge, LearningIcon } from '@/components/ui'
import { URDU_LETTERS, LETTER_FAMILIES, NON_JOINING } from '@/data/urduAlphabet'

const SITE_URL = 'https://alifujala.ai'
const URDU_FONT = "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
const BODY_FONT = { fontFamily: "'Comic Neue', cursive" }
const HEAD_FONT = { fontFamily: "'Bubblegum Sans', cursive" }

const FAQS = [
  {
    q: 'How many letters are in the Urdu alphabet?',
    a: 'Urdu has 37 basic letters, from ا (alif) to ے (bari yay). Most Pakistani primers teach 39 by also counting ھ (do-chashmi hay) and ں (noon ghunna), and some charts show آ (alif madd) separately as well — which is why you will see numbers from 37 to 40 in different books.',
  },
  {
    q: 'Which direction is Urdu written?',
    a: 'Urdu is written and read from right to left. Numbers, however, are written from left to right, just like in English.',
  },
  {
    q: 'Which Urdu letters do not join to the next letter?',
    a: `Ten letters never connect to the letter that follows them: ${NON_JOINING.join(' ')}. After one of these letters, the next letter starts a fresh shape, even in the middle of a word.`,
  },
  {
    q: 'In what order should children learn the Urdu letters?',
    a: 'Start with alif and the bay family (ب پ ت ٹ ث), because they share one easy shape. Then move family by family. Two or three new letters a week, with daily review, is a comfortable pace for children aged 4 to 7.',
  },
]

const SOUND_TWINS = [
  { sound: '"s"', letters: 'ث س ص' },
  { sound: '"z"', letters: 'ذ ز ض ظ' },
  { sound: 'soft "t"', letters: 'ت ط' },
  { sound: '"h"', letters: 'ح ہ' },
]

export default function UrduAlphabetPage() {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: 'The Urdu Alphabet: A Complete Guide for Kids and Parents',
      description:
        'All Urdu letters with their names, sounds, example words, dots and joining rules, plus letter families and a teaching plan for young children.',
      url: `${SITE_URL}/urdu-alphabet`,
      inLanguage: ['en', 'ur'],
      educationalLevel: 'Beginner',
      learningResourceType: 'Reference guide',
      audience: { '@type': 'EducationalAudience', educationalRole: 'parent, teacher' },
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]

  return (
    <div className="kids-page-bg min-h-screen flex flex-col relative">
      <SEO
        title="Urdu Alphabet for Kids — All Letters with Sounds & Examples (حروفِ تہجی)"
        description="A complete, parent-friendly guide to the Urdu alphabet: every letter with its name, sound, example word, dots and joining rule, plus letter families and a simple teaching plan."
        ogUrl={`${SITE_URL}/urdu-alphabet`}
        keywords="Urdu alphabet, Urdu alphabet for kids, Urdu letters, حروف تہجی, Urdu alphabet chart, Urdu letters with pictures, how many letters in Urdu, Urdu letter sounds, Urdu qaida"
        structuredData={structuredData}
      />
      <DecorativeBlobs variant="soft" motifs={['letters', 'book']} />
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 relative z-10">
        <header className="text-center max-w-3xl mx-auto mb-8">
          <div className="mb-4"><IconBadge name="letters" size="hero" /></div>
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-200 text-xs font-bold uppercase tracking-wider mb-3 border border-purple-200 dark:border-purple-700/50" style={BODY_FONT}>
            Parent & teacher guide
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-gradient" style={HEAD_FONT}>
            The Urdu Alphabet: A Complete Guide for Kids
          </h1>
          <p lang="ur" dir="rtl" className="mt-2 text-2xl text-indigo-600 dark:text-indigo-300" style={{ fontFamily: URDU_FONT, lineHeight: 2.2 }}>
            اردو حروفِ تہجی
          </p>
          <p className="mt-3 text-base sm:text-lg text-gray-700 dark:text-gray-200 leading-relaxed" style={BODY_FONT}>
            Every Urdu letter with its name, its sound, a word your child already knows, the dots that set it apart and
            whether it joins the next letter. Use the chart for a quick look, and the notes below it to teach with confidence.
          </p>
        </header>

        {/* Overview */}
        <section className="max-w-4xl mx-auto mb-10">
          <KidsCard variant="glass" tone="purple" padding="lg" hoverable={false}>
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-3" style={HEAD_FONT}>Urdu letters at a glance</h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-200 leading-relaxed" style={BODY_FONT}>
              <p>
                Urdu is written from <strong>right to left</strong>, usually in the flowing Nastaliq style. It has{' '}
                <strong>37 basic letters</strong>. Most school primers in Pakistan teach <strong>39</strong>, because they also
                count <span lang="ur" style={{ fontFamily: URDU_FONT }}>ھ</span> (do-chashmi hay) and{' '}
                <span lang="ur" style={{ fontFamily: URDU_FONT }}>ں</span> (noon ghunna) as letters. Neither count is wrong —
                they simply group the special forms differently.
              </p>
              <p>
                Many letters share the same basic body and differ only by their <strong>dots (نقطے)</strong>, so learning
                letters in <a href="#families" className="font-bold text-indigo-600 dark:text-indigo-300 underline">families</a> is
                much faster than learning them one by one. Most letters also change shape slightly when they join other letters
                inside a word — except for the ten{' '}
                <a href="#joining" className="font-bold text-indigo-600 dark:text-indigo-300 underline">non-joining letters</a>.
              </p>
            </div>
          </KidsCard>
        </section>

        {/* Chart */}
        <section aria-labelledby="chart" className="mb-12">
          <SectionHeader eyebrow="Quick chart" icon="letters" title="All Urdu letters" subtitle="Tap a letter to jump to its sound and example word." tone="cool" />
          <div dir="rtl" className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-3">
            {URDU_LETTERS.map((l, i) => (
              <a
                key={l.char}
                href={`#letter-${i + 1}`}
                className="group rounded-2xl border-2 border-white/70 dark:border-white/10 bg-white/90 dark:bg-gray-800/90 shadow-candy hover:-translate-y-1 hover:shadow-candy-lg transition-all text-center py-2"
              >
                <span lang="ur" className="block text-3xl sm:text-4xl text-indigo-700 dark:text-indigo-200" style={{ fontFamily: URDU_FONT, lineHeight: 1.9 }}>
                  {l.char}
                </span>
                <span dir="ltr" className="block text-[11px] sm:text-xs font-bold text-gray-600 dark:text-gray-300" style={BODY_FONT}>{l.name}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Letter details */}
        <section aria-labelledby="details" className="mb-12">
          <SectionHeader eyebrow="Letter by letter" icon="book" title="Sounds, dots & example words" subtitle="Read the example word aloud together — it is the fastest way to link the shape to the sound." tone="warm" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {URDU_LETTERS.map((l, i) => (
              <div key={l.char} id={`letter-${i + 1}`} className="scroll-mt-24">
                <KidsCard variant="solid" tone={(['purple', 'blue', 'green', 'pink', 'amber', 'indigo'] as const)[i % 6]} padding="md" hoverable={false} className="h-full">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 grid place-items-center shadow-candy">
                      <span lang="ur" className="text-white text-4xl" style={{ fontFamily: URDU_FONT, lineHeight: 1.8 }}>{l.char}</span>
                    </div>
                    <div className="min-w-0 flex-1" style={BODY_FONT}>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white" style={HEAD_FONT}>
                        {i + 1}. {l.name}{' '}
                        <span lang="ur" className="text-indigo-600 dark:text-indigo-300 font-normal" style={{ fontFamily: URDU_FONT }}>(<span style={{ paddingInline: '0.15em' }}>{l.urduName}</span>)</span>
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-200"><strong>Sound:</strong> {l.sound}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-200"><strong>Dots & marks:</strong> {l.marks}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-200"><strong>Joins next letter:</strong> {l.joinsNext ? 'Yes' : 'No'}</p>
                      <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">
                        <strong>Example:</strong>{' '}
                        <span lang="ur" className="text-lg text-indigo-700 dark:text-indigo-200" style={{ fontFamily: URDU_FONT }}>{l.example.ur}</span>{' '}
                        — <em>{l.example.roman}</em> ({l.example.en})
                      </p>
                      {l.note && <p className="mt-1 text-xs text-gray-600 dark:text-gray-300 italic">{l.note}</p>}
                    </div>
                  </div>
                </KidsCard>
              </div>
            ))}
          </div>
        </section>

        {/* Families */}
        <section id="families" aria-labelledby="families-title" className="mb-12 scroll-mt-24">
          <SectionHeader eyebrow="Learn faster" icon="puzzle" title="Letter families" subtitle="Letters in a family share one shape. Teach the shape once, then let the dots do the rest." tone="green" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LETTER_FAMILIES.map((f) => (
              <KidsCard key={f.name} variant="glass" tone="green" padding="md">
                <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-300" style={HEAD_FONT}>{f.name}</h3>
                <p lang="ur" dir="rtl" className="text-3xl text-gray-800 dark:text-gray-100 my-1" style={{ fontFamily: URDU_FONT, lineHeight: 2 }}>{f.letters}</p>
                <p className="text-sm text-gray-700 dark:text-gray-200" style={BODY_FONT}>{f.tip}</p>
              </KidsCard>
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-gray-700 dark:text-gray-200" style={BODY_FONT}>
            Practise telling family members apart with the{' '}
            <Link href="/games/urduNuqtaSort" className="font-bold text-indigo-600 dark:text-indigo-300 underline">Nuqta Sorter game</Link>{' '}
            and read our guide to <Link href="/blog/teaching-urdu-letters-by-family" className="font-bold text-indigo-600 dark:text-indigo-300 underline">teaching Urdu letters by family</Link>.
          </p>
        </section>

        {/* Joining + sounds */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div id="joining" className="scroll-mt-24">
            <KidsCard variant="gradient" tone="blue" padding="lg" hoverable={false} className="h-full">
              <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2" style={HEAD_FONT}>The non-joining letters</h2>
              <p lang="ur" dir="rtl" className="text-3xl text-gray-800 dark:text-gray-100" style={{ fontFamily: URDU_FONT, lineHeight: 2.1 }}>{NON_JOINING.join(' ')}</p>
              <p className="mt-2 text-gray-700 dark:text-gray-200 leading-relaxed" style={BODY_FONT}>
                These letters connect to the letter <em>before</em> them but never to the letter <em>after</em> them. That is why
                a word like <span lang="ur" style={{ fontFamily: URDU_FONT }}>دروازہ</span> (darwaaza, door) looks like several
                separate pieces. Point this out early — it stops children thinking a word has ended when it has not.
              </p>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-200" style={BODY_FONT}>
                See how joined letters change shape in our <Link href="/blog/urdu-joining-letters-half-forms" className="font-bold text-indigo-600 dark:text-indigo-300 underline">guide to joining letters (آدھی اشکال)</Link>.
              </p>
            </KidsCard>
          </div>
          <KidsCard variant="gradient" tone="pink" padding="lg" hoverable={false} className="h-full">
            <h2 className="text-2xl font-bold text-pink-700 dark:text-pink-300 mb-2" style={HEAD_FONT}>Same sound, different letters</h2>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-3" style={BODY_FONT}>
              Urdu borrowed many words from Arabic and Persian and kept their spelling, so a few sounds can be written with more
              than one letter. Children do not need to choose between them at first — they will learn the right spelling word by word.
            </p>
            <ul className="space-y-2">
              {SOUND_TWINS.map((s) => (
                <li key={s.sound} className="flex items-center justify-between gap-3 rounded-2xl bg-white/80 dark:bg-gray-800/70 px-4 py-2">
                  <span className="font-bold text-gray-700 dark:text-gray-200" style={BODY_FONT}>{s.sound}</span>
                  <span lang="ur" dir="rtl" className="text-2xl text-pink-700 dark:text-pink-300" style={{ fontFamily: URDU_FONT, lineHeight: 1.9 }}>{s.letters}</span>
                </li>
              ))}
            </ul>
          </KidsCard>
        </section>

        {/* Teaching plan */}
        <section className="max-w-4xl mx-auto mb-12">
          <KidsCard variant="glass" tone="amber" padding="lg" hoverable={false}>
            <h2 className="text-2xl font-bold text-amber-700 dark:text-amber-300 mb-3" style={HEAD_FONT}>
              <IconBadge name="clock" size="sm" className="mr-2" />A gentle 10-minute daily routine
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-200 leading-relaxed" style={BODY_FONT}>
              <li><strong>Review (2 min):</strong> point to letters learned earlier and let your child say their names.</li>
              <li><strong>New letter (3 min):</strong> show one new letter, say its sound and the example word, and trace it in the air together from right to left.</li>
              <li><strong>Play (3 min):</strong> one round of a letter game such as <Link href="/games/memoryMatch" className="font-bold text-indigo-600 dark:text-indigo-300 underline">Memory Match</Link> or <Link href="/games/alphabetMatch" className="font-bold text-indigo-600 dark:text-indigo-300 underline">Letter to Letter</Link>.</li>
              <li><strong>Write (2 min):</strong> trace the letter on a <Link href="/activity" className="font-bold text-indigo-600 dark:text-indigo-300 underline">printable worksheet</Link>, starting at the dot on the right.</li>
            </ol>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300" style={BODY_FONT}>
              Two or three new letters a week is plenty. Short, regular practice beats long, occasional sessions.
            </p>
          </KidsCard>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto mb-12">
          <SectionHeader eyebrow="Questions parents ask" icon="question" title="Urdu alphabet FAQ" tone="cool" />
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-2xl border-2 border-white/40 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4">
                <summary className="cursor-pointer font-bold text-gray-800 dark:text-gray-100 list-none flex justify-between items-center gap-3" style={BODY_FONT}>
                  {f.q}
                  <span className="transition-transform group-open:rotate-180" aria-hidden>▼</span>
                </summary>
                <p className="mt-2 text-sm sm:text-base text-gray-700 dark:text-gray-300" style={BODY_FONT}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto mb-6">
          <KidsCard variant="gradient" tone="indigo" padding="lg" className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-purple-700 dark:text-purple-200" style={HEAD_FONT}>Ready to practise?</h2>
            <p className="mb-5 text-gray-700 dark:text-gray-200" style={BODY_FONT}>Turn the chart into play with free letter games, stories and printable worksheets.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <KidsButton href="/games" variant="primary" size="lg" iconLeft={<LearningIcon name="gamepad" />}>Letter games</KidsButton>
              <KidsButton href="/activity" variant="success" size="lg" iconLeft={<LearningIcon name="worksheet" />}>Worksheets</KidsButton>
              <KidsButton href="/stories" variant="warm" size="lg" iconLeft={<LearningIcon name="book" />}>Stories</KidsButton>
            </div>
          </KidsCard>
        </section>
      </main>

      <Footer />
    </div>
  )
}
