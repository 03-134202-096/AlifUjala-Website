import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import SEO from '@/components/SEO'
import { KidsCard, KidsButton, SectionHeader, DecorativeBlobs } from '@/components/ui'

type Tone = 'purple' | 'green' | 'pink' | 'blue' | 'amber' | 'indigo'

const GAMES: { href: string; title: string; emoji: string; description: string; img: string; tone: Tone }[] = [
  { href: "/games/urduHunter",       title: "Alphabet Hunter", emoji: "🎯", description: "Bubbles with Urdu letters fall from the sky — pop the correct one before it escapes!", img: "/images/urduHunter.svg",            tone: 'purple' },
  { href: "/games/urduBasketCatch",  title: "Basket Catch",    emoji: "🧺", description: "Move your basket left and right to catch the target Urdu letter falling from above!", img: "/images/urduBasketCatch.svg",     tone: 'blue' },
  { href: "/games/memoryMatch",      title: "Memory Match",    emoji: "🧠", description: "Flip the cards and find matching pairs of Urdu letters — train your memory!",          img: "/images/games/memoryMatch.svg",   tone: 'green' },
  { href: "/games/whackALetter",     title: "Whack-a-Letter",  emoji: "🔨", description: "Whack the mole holding the correct Urdu letter! Fast and fun.",                          img: "/images/games/whackALetter.svg",  tone: 'amber' },
  { href: "/games/urduBalloonPop",   title: "Balloon Pop",     emoji: "🎈", description: "Colorful balloons are floating away! Pop the correct Urdu letter balloon.",              img: "/images/games/urduBalloonPop.svg", tone: 'pink' },
  { href: "/games/urduTrainPuzzle",  title: "Train Puzzle",    emoji: "🚂", description: "Complete the alphabet sequence to make the train go choo-choo!",                          img: "/images/games/urduTrainPuzzle.svg", tone: 'blue' },
  { href: "/games/urduGridFind",     title: "Grid Find",       emoji: "🔍", description: "Scan the 4x4 grid quickly to find all instances of the hidden target letter!",          img: "/images/games/urduGridFind.svg",   tone: 'indigo' },
  { href: "/games/urduNuqtaSort",    title: "Nuqta Sorter",    emoji: "⚖️", description: "Does the letter have dots (Nuqtas)? Sort them into bins before time runs out!",         img: "/images/games/urduNuqtaSort.svg",  tone: 'green' },
  { href: "/games/urduTileTap",      title: "Tile Tap",        emoji: "🎹", description: "Piano-style tiles fall from the sky. Tap the ones containing the target letter!",       img: "/images/games/urduTileTap.svg",    tone: 'amber' },
]

export default function GamesIndex() {
  return (
    <div className="kids-page-bg min-h-screen flex flex-col relative">
      <SEO
        title="Urdu Games — Fun Arcade Games to Learn Urdu Alphabets"
        description="Play exciting arcade games to learn Urdu letters! Pop bubbles, catch falling letters, and test your memory. Free interactive games for kids."
        ogUrl="https://alifujala.ai/games"
        keywords="Urdu games for kids, Urdu alphabet games, learn Urdu online free, Urdu arcade games"
      />
      <DecorativeBlobs variant="rich" emojis={["🕹️", "🎮", "🎯", "🎲", "✨"]} />
      <Navbar />

      <main className="container mx-auto flex-1 px-4 py-8 relative z-10">
        <SectionHeader
          eyebrow="🕹️ Arcade"
          emoji="🎮"
          title="Urdu Letter Games"
          subtitle="Fast-paced arcade fun while learning Urdu letters! Pick a game and start playing."
          tone="rainbow"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {GAMES.map((game) => (
            <Link key={game.href} href={game.href} className="group focus:outline-none">
              <KidsCard variant="glass" tone={game.tone} padding="none" hoverable className="overflow-hidden h-full flex flex-col">
                <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-black/10 to-black/5 dark:from-white/5 dark:to-black/30">
                  <img
                    src={game.img}
                    alt={game.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute top-3 left-3 inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/90 dark:bg-gray-900/80 backdrop-blur shadow-md text-2xl">
                    {game.emoji}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h2 className="text-xl font-bold mb-2 text-purple-700 dark:text-purple-300" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
                    {game.title}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-200 text-sm leading-snug mb-4 flex-1" style={{ fontFamily: "'Comic Neue', cursive" }}>
                    {game.description}
                  </p>
                  <span className="inline-flex items-center gap-1 self-start rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 text-white text-sm font-bold px-5 py-2 shadow-candy group-hover:-translate-y-0.5 transition-transform" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
                    Play Now <span aria-hidden>→</span>
                  </span>
                </div>
              </KidsCard>
            </Link>
          ))}
        </div>

        {/* Activities CTA */}
        <div className="max-w-3xl mx-auto mb-8">
          <KidsCard variant="gradient" tone="purple" padding="lg" className="text-center relative overflow-hidden">
            <span className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-fuchsia-300/30 blur-3xl" aria-hidden />
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-purple-700 dark:text-purple-300" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              📚 Want Learning Activities?
            </h2>
            <p className="text-gray-700 dark:text-gray-200 mb-5" style={{ fontFamily: "'Comic Neue', cursive" }}>
              Try our Urdu letter matching activities and alphabet stories!
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
