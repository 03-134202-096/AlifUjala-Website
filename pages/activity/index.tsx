import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import SEO from '@/components/SEO'

/* Animated floating shapes */
function ActivityDecorations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-10 left-[5%] text-5xl animate-float opacity-20">✨</div>
      <div className="absolute top-20 right-[8%] text-4xl animate-float-delay opacity-15">📚</div>
      <div className="absolute bottom-20 left-[10%] text-4xl animate-bounce-slow opacity-15">🌟</div>
      <div className="absolute bottom-40 right-[12%] text-3xl animate-float opacity-20">🎨</div>
    </div>
  )
}

export default function ActivityIndex() {
  const activities = [
    {
      href: "/games/alphabetMatch",
      img: "/images/matchLetter.webp",
      title: "Letter to Letter",
      emoji: "🔤",
      description: "Match Urdu letters together!",
    },
    {
      href: "/games/matching",
      img: "/images/letterImg.webp",
      title: "Letter to Image",
      emoji: "🖼️",
      description: "Match letters with pictures!",
    },
    {
      href: "/games/adhiAshkalMatch",
      img: "/images/halfLetters.webp",
      title: "Adhi Ashkal",
      emoji: "✂️",
      description: "Match half letter shapes!",
    },
    {
      href: "/games/urduAlphabetStories",
      img: "/images/urduAlphabetStories.svg",
      title: "Urdu Alphabets Stories",
      emoji: "📚",
      description: "Watch fun stories for every Urdu letter!",
    },
  ]

  return (
    <div className="kids-page-bg min-h-screen flex flex-col relative">
      <SEO
        title="Activities — Learn Urdu Alphabets Through Fun Activities"
        description="Choose a fun Urdu learning activity! Match letters, pictures and half-shapes, or watch alphabet stories. Free interactive activities for kids."
        ogUrl="https://alifujala.ai/activity"
        keywords="Urdu activities for kids, match Urdu letters, Urdu alphabet activities, learn Urdu online free"
      />
      <ActivityDecorations />
      <Navbar />

      <main className="container mx-auto flex-1 px-4 py-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3" style={{fontFamily: "'Bubblegum Sans', cursive", color: '#6366f1'}}>
            ✨ Activities ✨
          </h1>
          <p className="text-lg sm:text-xl text-indigo-600 dark:text-purple-300 font-bold max-w-lg mx-auto" style={{fontFamily: "'Comic Neue', cursive"}}>
            <span lang="ur" className="block">سیکھیں، ملائیں اور حروف پہچانیں!</span>
            Choose an activity to learn Urdu letters! 🌟
          </p>
        </div>

        {/* Activity cards grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-10">
          {activities.map((act, i) => (
            <Link key={i} href={act.href} className="group flex flex-col items-center">
              <div className="w-full rounded-3xl overflow-hidden shadow-lg border-2 border-purple-200/50 dark:border-purple-500/30 transition-all duration-300 group-hover:scale-105 group-hover:-rotate-1 group-hover:shadow-xl">
                <img
                  src={act.img}
                  alt={act.title}
                  className="w-full h-auto block"
                  style={{display:'block'}}
                />
              </div>
              <div className="mt-3 text-center px-1">
                <p className="text-base sm:text-lg font-bold text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 transition-colors" style={{fontFamily: "'Bubblegum Sans', cursive"}}>
                  <span className="mr-1">{act.emoji}</span> {act.title}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-bold" style={{fontFamily: "'Comic Neue', cursive"}}>
                  {act.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Explore Games CTA */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 sm:p-8 text-center text-white shadow-xl border-4 border-white/20">
            <h3 className="text-2xl sm:text-3xl font-bold mb-3" style={{fontFamily: "'Bubblegum Sans', cursive"}}>
              🕹️ Want Arcade Games?
            </h3>
            <p className="text-white/90 text-base mb-5" style={{fontFamily: "'Comic Neue', cursive"}}>
              Check out our exciting arcade-style letter games — pop bubbles, catch letters, and test your memory!
            </p>
            <Link
              href="/games"
              className="inline-block bg-white text-indigo-700 font-bold px-8 py-3 rounded-full text-base shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
              style={{fontFamily: "'Bubblegum Sans', cursive"}}
            >
              Play Games →
            </Link>
          </div>
        </div>

        {/* Coming soon */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-2 border-indigo-200 dark:border-indigo-700 rounded-3xl p-6 sm:p-8 text-center">
            <h3 className="text-2xl font-bold mb-3" style={{fontFamily: "'Bubblegum Sans', cursive", color: '#6366f1'}}>
              🌟 More Activities Coming Soon! 🌟
            </h3>
            <p className="text-gray-600 text-lg mb-4" style={{fontFamily: "'Comic Neue', cursive"}}>
              We&apos;re making exciting new learning activities for you! Stay tuned! 🚀
            </p>
            <div className="flex gap-4 justify-center text-4xl">
              <span className="animate-bounce-slow">🎨</span>
              <span className="animate-bounce-slow" style={{animationDelay: '0.3s'}}>🎵</span>
              <span className="animate-bounce-slow" style={{animationDelay: '0.6s'}}>📝</span>
              <span className="animate-bounce-slow" style={{animationDelay: '0.9s'}}>🌈</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
