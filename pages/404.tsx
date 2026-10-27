import { LearningIcon, IconBadge } from '@/components/ui'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SEO from '@/components/SEO'
import { KidsCard, KidsButton, DecorativeBlobs } from '@/components/ui'
import type { NextPage } from 'next'

const NotFoundPage: NextPage = () => {
  return (
    <div className="kids-page-bg min-h-screen flex flex-col relative">
      <SEO title="Page Not Found" description="The page you were looking for could not be found." noIndex />
      <DecorativeBlobs variant="rich" motifs={["book","search"]} />

      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-16 relative z-10">
        <div className="text-center max-w-xl w-full">
          {/* Massive 404 with animated rainbow gradient */}
          <div className="mb-4 sm:mb-6 select-none">
            <span
              className="inline-block text-[6rem] sm:text-[9rem] leading-none font-bold text-gradient"
              style={{ fontFamily: "'Bubblegum Sans', cursive" }}
            >
              404
            </span>
          </div>

          {/* Lost mascot with shadow */}
          <div className="mb-4"><IconBadge name="search" size="hero" /></div>

          {/* Glass message card */}
          <KidsCard variant="glass" tone="purple" padding="lg" className="mb-6">
            <h2
              className="text-2xl sm:text-3xl font-bold text-purple-700 dark:text-purple-300 mb-3"
              style={{ fontFamily: "'Bubblegum Sans', cursive" }}
            >
              Oops! This page wandered off!
            </h2>
            <p
              className="text-gray-600 dark:text-gray-300 font-bold mb-6 text-base sm:text-lg"
              style={{ fontFamily: "'Comic Neue', cursive" }}
            >
              Looks like this page went on an adventure! 🌍
              <br />
              Let&apos;s go back to somewhere fun!
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <KidsButton href="/" variant="primary" size="lg" iconRight={<LearningIcon name="home" />}>
                Go Home
              </KidsButton>
              <KidsButton href="/games" variant="success" size="lg" iconRight={<LearningIcon name="gamepad" />}>
                Play Games
              </KidsButton>
            </div>
          </KidsCard>

          {/* Fun bouncing emojis */}
          <div className="flex justify-center gap-3 sm:gap-5 text-3xl sm:text-4xl">
            {(['book', 'pencil', 'puzzle'] as const).map((name) => <IconBadge key={name} name={name} />)}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default NotFoundPage
