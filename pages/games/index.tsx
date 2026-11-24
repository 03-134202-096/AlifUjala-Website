import { IconBadge, type LearningIconName } from '@/components/ui'
import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import SEO from '@/components/SEO'
import { KidsCard, KidsButton, SectionHeader, DecorativeBlobs } from '@/components/ui'
import { GAME_GUIDES } from '@/data/gameGuides'

type Tone = 'purple' | 'green' | 'pink' | 'blue' | 'amber' | 'indigo'

const GAMES: { href: string; title: string; icon: LearningIconName; description: string; img: string; tone: Tone }[] = [
  { href: "/games/urduHunter",       title: "Alphabet Hunter", icon: 'target', description: "Bubbles with Urdu letters fall from the sky — pop the correct one before it escapes!", img: "/images/urduHunter.svg",            tone: 'purple' },
  { href: "/games/urduBasketCatch",  title: "Basket Catch",    icon: 'basket', description: "Move your basket left and right to catch the target Urdu letter falling from above!", img: "/images/urduBasketCatch.svg",     tone: 'blue' },
  { href: "/games/memoryMatch",      title: "Memory Match",    icon: 'cards', description: "Flip the cards and find matching pairs of Urdu letters — train your memory!",          img: "/images/games/memoryMatch.svg",   tone: 'green' },
  { href: "/games/whackALetter",     title: "Whack-a-Letter",  icon: 'hammer', description: "Whack the mole holding the correct Urdu letter! Fast and fun.",                          img: "/images/games/whackALetter.svg",  tone: 'amber' },
  { href: "/games/urduBalloonPop",   title: "Balloon Pop",     icon: 'balloon', description: "Colorful balloons are floating away! Pop the correct Urdu letter balloon.",              img: "/images/games/urduBalloonPop.svg", tone: 'pink' },
  { href: "/games/urduTrainPuzzle",  title: "Train Puzzle",    icon: 'train', description: "Complete the alphabet sequence to make the train go choo-choo!",                          img: "/images/games/urduTrainPuzzle.svg", tone: 'blue' },
  { href: "/games/urduGridFind",     title: "Grid Find",       icon: 'search', description: "Scan the 4x4 grid quickly to find all instances of the hidden target letter!",          img: "/images/games/urduGridFind.svg",   tone: 'indigo' },
  { href: "/games/urduNuqtaSort",    title: "Nuqta Sorter",    icon: 'sort', description: "Does the letter have dots (Nuqtas)? Sort them into bins before time runs out!",         img: "/images/games/urduNuqtaSort.svg",  tone: 'green' },
  { href: "/games/urduTileTap",      title: "Tile Tap",        icon: 'tiles', description: "Piano-style tiles fall from the sky. Tap the ones containing the target letter!",       img: "/images/games/urduTileTap.svg",    tone: 'amber' },
]

/** Which game to pick for which stage — shown below the game cards as a guide for parents. */
const GAME_PATHS: { stage: string; tip: string; games: { href: string; label: string }[] }[] = [
  {
    stage: 'Just starting out (ages 3–5)',
    tip: 'Slow, forgiving games where your child only has to spot one letter at a time.',
    games: [
      { href: '/games/urduBalloonPop', label: 'Balloon Pop' },
      { href: '/games/alphabetMatch', label: 'Letter to Letter Match' },
      { href: '/games/urduDottedMatch', label: 'Dotted Letter Match' },
    ],
  },
  {
    stage: 'Learning the dots (nuqtay)',
    tip: 'Games that make children look closely at how many dots a letter has, and where they sit.',
    games: [
      { href: '/games/urduNuqtaSort', label: 'Nuqta Sorter' },
      { href: '/games/urduGridFind', label: 'Grid Find' },
      { href: '/games/memoryMatch', label: 'Memory Match' },
    ],
  },
  {
    stage: 'Sounds, words and alphabet order',
    tip: 'Link letters to the sounds that start familiar words, and learn the order of the alphabet.',
    games: [
      { href: '/games/matching', label: 'Letter to Picture Match' },
      { href: '/games/urduTrainPuzzle', label: 'Alphabet Train' },
      { href: '/games/adhiAshkalMatch', label: 'Half Letters Match' },
    ],
  },
  {
    stage: 'Building speed and confidence',
    tip: 'Faster games for children who know most letters and are ready to recognise them instantly.',
    games: [
      { href: '/games/urduHunter', label: 'Alphabet Hunter' },
      { href: '/games/whackALetter', label: 'Whack-a-Letter' },
      { href: '/games/urduBasketCatch', label: 'Basket Catch' },
      { href: '/games/urduTileTap', label: 'Tile Tap' },
    ],
  },
]

export default function GamesIndex() {
  return (
    <div className="kids-page-bg min-h-screen flex flex-col relative">
      <SEO
        title="Urdu Games for Kids — Free Letter Games with Parent Guides"
        description="Free Urdu alphabet games for kids aged 3–10: pop, catch, sort and match Urdu letters. Every game explains what it teaches, how to play and how parents can help."
        ogUrl="https://alifujala.ai/games"
        keywords="Urdu games for kids, Urdu alphabet games, learn Urdu online free, Urdu arcade games"
      />
      <DecorativeBlobs variant="rich" motifs={["puzzle","gamepad","star"]} />
      <Navbar />

      <main className="container mx-auto flex-1 px-4 py-8 relative z-10">
        <SectionHeader as="h1"
          eyebrow="Arcade"
          icon="gamepad"
          title="Urdu Letter Games"
          subtitle="Fast-paced arcade fun while learning Urdu letters! Pick a game and start playing."
          tone="rainbow"
        />

        <p className="max-w-3xl mx-auto -mt-2 mb-8 text-center text-sm sm:text-base font-bold text-gray-700 dark:text-gray-200 leading-relaxed" style={{ fontFamily: "'Comic Neue', cursive" }}>
          Each game practises one reading skill: recognising letters, noticing the dots, linking letters to sounds or
          learning the alphabet order. Games run in the browser on phones, tablets and computers, need no account, and
          every game page includes a short guide for parents and teachers explaining what it teaches and how to help.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {GAMES.map((game) => {
            const guide = GAME_GUIDES[game.href.split('/').pop() || '']
            return (
            <Link key={game.href} href={game.href} className="group focus:outline-none">
              <KidsCard variant="glass" tone={game.tone} padding="none" hoverable className="overflow-hidden h-full flex flex-col">
                <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-black/10 to-black/5 dark:from-white/5 dark:to-black/30">
                  <img
                    src={game.img}
                    alt={game.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <IconBadge name={game.icon} className="absolute top-3 left-3" />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h2 className="text-xl font-bold mb-1 text-purple-700 dark:text-purple-300" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
                    {game.title}
                  </h2>
                  {guide && (
                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 mb-2" style={{ fontFamily: "'Comic Neue', cursive" }}>
                      Ages {guide.ages} · {guide.skills[0].title}
                    </p>
                  )}
                  <p className="text-gray-700 dark:text-gray-200 text-sm leading-snug mb-4 flex-1" style={{ fontFamily: "'Comic Neue', cursive" }}>
                    {game.description}
                  </p>
                  <span className="inline-flex items-center gap-1 self-start rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 text-white text-sm font-bold px-5 py-2 shadow-candy group-hover:-translate-y-0.5 transition-transform" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
                    Play Now <span aria-hidden>→</span>
                  </span>
                </div>
              </KidsCard>
            </Link>
            )
          })}
        </div>

        {/* Which game should we play? */}
        <section aria-label="Choosing the right Urdu letter game for your child" className="max-w-6xl mx-auto mb-12">
          <SectionHeader
            eyebrow="For parents & teachers"
            icon="bulb"
            title="Which game should we play?"
            subtitle="Start where your child is today. Five to ten minutes a day is plenty."
            tone="cool"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {GAME_PATHS.map((path) => (
              <KidsCard key={path.stage} variant="solid" tone="indigo" padding="md" hoverable={false}>
                <h3 className="text-lg font-bold text-indigo-700 dark:text-indigo-300 mb-1" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>{path.stage}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-200 mb-3" style={{ fontFamily: "'Comic Neue', cursive" }}>{path.tip}</p>
                <div className="flex flex-wrap gap-2">
                  {path.games.map((g) => (
                    <Link key={g.href} href={g.href} className="rounded-full border-2 border-indigo-200 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1 text-sm font-bold text-indigo-700 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-indigo-800/60 transition-colors" style={{ fontFamily: "'Comic Neue', cursive" }}>
                      {g.label}
                    </Link>
                  ))}
                </div>
              </KidsCard>
            ))}
          </div>
          <p className="mt-6 text-center text-sm sm:text-base text-gray-700 dark:text-gray-200" style={{ fontFamily: "'Comic Neue', cursive" }}>
            New to teaching Urdu? Read{' '}
            <Link href="/blog/teaching-urdu-letters-by-family" className="font-bold text-indigo-700 dark:text-indigo-300 underline underline-offset-2">how to teach Urdu letters by family</Link>{' '}
            or look up any letter in the{' '}
            <Link href="/urdu-alphabet" className="font-bold text-indigo-700 dark:text-indigo-300 underline underline-offset-2">Urdu alphabet guide</Link>.
          </p>
        </section>

        {/* Activities CTA */}
        <div className="max-w-3xl mx-auto mb-8">
          <KidsCard variant="gradient" tone="purple" padding="lg" className="text-center relative overflow-hidden">
            <span className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-fuchsia-300/30 blur-3xl" aria-hidden />
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-purple-700 dark:text-purple-300" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              📚 Want Learning Activities?
            </h2>
            <p className="text-gray-700 dark:text-gray-200 mb-5" style={{ fontFamily: "'Comic Neue', cursive" }}>
              Try our letter matching activities and printable tracing worksheets.
            </p>
            <KidsButton href="/activity" variant="primary" size="lg" iconRight={<span>→</span>}>
              View Activities
            </KidsButton>
          </KidsCard>
        </div>
      </main>

      <Footer />
    </div>
  )
}
