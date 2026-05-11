import React, { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import SEO from "@/components/SEO"
import alphabetStories, { type AlphabetStory } from "@/data/alphabetStories"
import { SectionHeader, DecorativeBlobs, KidsCard } from "@/components/ui"

/* ── helpers ───────────────────────────────── */

/** Gradient pairs for story cards so each card looks unique */
const cardGradients = [
  "from-pink-400 to-rose-500",
  "from-purple-400 to-indigo-500",
  "from-blue-400 to-cyan-500",
  "from-teal-400 to-emerald-500",
  "from-green-400 to-lime-500",
  "from-yellow-400 to-amber-500",
  "from-orange-400 to-red-500",
  "from-fuchsia-400 to-pink-500",
  "from-indigo-400 to-purple-500",
  "from-cyan-400 to-blue-500",
  "from-emerald-400 to-teal-500",
  "from-lime-400 to-green-500",
  "from-amber-400 to-yellow-500",
  "from-red-400 to-orange-500",
]

/* ── components ────────────────────────────── */

function PageDecorations() {
  return <DecorativeBlobs variant="soft" emojis={["🎬", "📺", "⭐", "🎭", "✨"]} />
}

function StoryCard({
  story,
  index,
  onSelect,
  isActive,
}: {
  story: AlphabetStory
  index: number
  onSelect: () => void
  isActive: boolean
}) {
  const gradient = cardGradients[index % cardGradients.length]

  return (
    <button
      onClick={onSelect}
      className={`group relative w-full text-left rounded-3xl overflow-hidden border-4 transition-all duration-300 hover:scale-[1.03] hover:-rotate-1 focus:outline-none focus:ring-4 focus:ring-purple-300 ${
        isActive
          ? "border-yellow-400 shadow-candy-lg scale-[1.03] ring-4 ring-yellow-300"
          : "border-white/60 dark:border-gray-700 shadow-candy hover:shadow-candy-lg"
      }`}
    >
      {/* Gradient bg */}
      <div className={`bg-gradient-to-br ${gradient} p-4 sm:p-5`}>
        {/* Urdu letter badge */}
        <div className="absolute top-3 right-3 bg-white/90 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shadow-md">
          <span
            className="text-lg sm:text-xl font-bold text-gray-800"
            style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
          >
            {story.letters.split(" ")[0]}
          </span>
        </div>

        {/* Play icon */}
        <div className="flex items-center justify-center mb-3">
          <div className="bg-white/25 rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center group-hover:bg-white/40 transition-colors duration-300">
            <span className="text-3xl sm:text-4xl">▶️</span>
          </div>
        </div>

        {/* Title */}
        <h3
          className="text-white text-sm sm:text-base font-bold leading-snug line-clamp-2 text-center drop-shadow"
          style={{ fontFamily: "'Bubblegum Sans', cursive" }}
        >
          {story.title}
        </h3>

        {/* Meta */}
        <div className="flex items-center justify-center gap-3 mt-2">
          <span className="bg-white/30 text-white text-xs font-bold px-3 py-1 rounded-full">
            ⏱ {story.duration}
          </span>
          <span
            className="bg-white/30 text-white text-xs font-bold px-3 py-1 rounded-full"
            dir="rtl"
          >
            {story.letters}
          </span>
        </div>
      </div>

      {/* Active indicator */}
      {isActive && (
        <div className="absolute inset-0 border-4 border-yellow-400 rounded-3xl pointer-events-none" />
      )}
    </button>
  )
}

function VideoPlayer({ story }: { story: AlphabetStory }) {
  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Decorative border glow */}
      <div className="absolute -inset-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-3xl opacity-60 blur-sm" />
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-candy-lg border-4 border-white dark:border-gray-700">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${story.videoId}?rel=0`}
          title={story.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {/* Title below video */}
      <div className="text-center mt-4">
        <h2
          className="text-xl sm:text-2xl font-bold text-purple-700 dark:text-purple-400"
          style={{ fontFamily: "'Bubblegum Sans', cursive" }}
        >
          📖 {story.title}
        </h2>
        <p
          className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-bold"
          style={{ fontFamily: "'Comic Neue', cursive" }}
        >
          Letters: <span dir="rtl">{story.letters}</span> &bull; Duration: {story.duration}
        </p>
      </div>
    </div>
  )
}

/* ── main page ─────────────────────────────── */

export default function EduVideosPage() {
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const activeStory = alphabetStories[selectedIndex]

  return (
    <div className="kids-page-bg min-h-screen flex flex-col relative">
      <SEO
        title="Educational Videos — Learn Urdu Alphabets Through Stories"
        description="Watch fun educational videos for every Urdu letter! Interactive alphabet stories for kids to learn Urdu in a fun and engaging way."
        ogUrl="https://alifujala.ai/edu-videos"
        keywords="Urdu educational videos, Urdu alphabet videos, learn Urdu online, Urdu stories for kids"
      />
      <PageDecorations />
      <Navbar />

      <main className="container mx-auto flex-1 px-4 py-6 relative z-10">
        <SectionHeader
          eyebrow="🎬 Edu Videos"
          emoji="🎞️"
          title="Educational Videos"
          subtitle="Watch fun stories for every Urdu letter! Click a card below to watch."
          tone="warm"
        />

        {/* Video Player */}
        <div className="mb-10">
          <VideoPlayer story={activeStory} />
        </div>

        {/* Story Cards Grid */}
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Library"
            emoji="🌟"
            title="Choose a story"
            subtitle="One delightful video for every Urdu letter."
            tone="rainbow"
            className="!mb-6"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {alphabetStories.map((story, i) => (
              <StoryCard
                key={story.videoId}
                story={story}
                index={i}
                isActive={i === selectedIndex}
                onSelect={() => {
                  setSelectedIndex(i)
                  // Smooth scroll to video player
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
              />
            ))}
          </div>
        </div>

        {/* Channel credit */}
        <div className="max-w-3xl mx-auto mt-10 mb-6">
          <KidsCard variant="gradient" tone="purple" padding="md" className="text-center">
            <p
              className="text-gray-700 dark:text-gray-200 text-base sm:text-lg font-bold"
              style={{ fontFamily: "'Comic Neue', cursive" }}
            >
              🎥 Videos by{" "}
              <a
                href="https://www.youtube.com/@alifujala"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-700 dark:text-purple-300 underline link-underline hover:text-purple-900 dark:hover:text-purple-200 transition-colors"
              >
                Alif Ujala
              </a>{" "}
              — Subscribe for more! 🌈
            </p>
          </KidsCard>
        </div>
      </main>

      <Footer />
    </div>
  )
}
