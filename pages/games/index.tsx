import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GameCard from '@/components/GameCard'
import Link from 'next/link'

/* Animated floating shapes */
function GameDecorations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-10 left-[5%] text-5xl animate-float opacity-20">🎯</div>
      <div className="absolute top-20 right-[8%] text-4xl animate-float-delay opacity-15">🧩</div>
      <div className="absolute bottom-20 left-[10%] text-4xl animate-bounce-slow opacity-15">🏆</div>
      <div className="absolute bottom-40 right-[12%] text-3xl animate-float opacity-20">🎪</div>
    </div>
  )
}

export default function GamesIndex() {
  const games = [
    {
      href: "/games/alphabetMatch",
      color: "yellow" as const,
      img: "/images/matchLetter.webp",
      title: "Letter to Letter",
      emoji: "🔤",
      description: "Match Urdu letters together!",
    },
    {
      href: "/games/matching",
      color: "pink" as const,
      img: "/images/letterImg.webp",
      title: "Letter to Image",
      emoji: "🖼️",
      description: "Match letters with pictures!",
    },
    {
      href: "/games/adhiAshkalMatch",
      color: "green" as const,
      img: "/images/halfLetters.webp",
      title: "Adhi Ashkal",
      emoji: "✂️",
      description: "Match half letter shapes!",
    },
    {
      href: "/games/urduAlphabetStories",
      color: "blue" as const,
      img: "/images/urduAlphabetStories.svg",
      title: "Urdu Alphabets Stories",
      emoji: "📚",
      description: "Watch fun stories for every Urdu letter!",
    },
  ]

  return (
    <div className="kids-page-bg min-h-screen flex flex-col relative">
      <GameDecorations />
      <Navbar />
      
      <main className="container mx-auto flex-1 px-4 py-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3" style={{fontFamily: "'Bubblegum Sans', cursive", color: '#6366f1'}}>
            🎮 Let&apos;s Play! 🎮
          </h1>
          <p className="text-lg sm:text-xl text-indigo-600 dark:text-purple-300 font-bold max-w-lg mx-auto" style={{fontFamily: "'Comic Neue', cursive"}}>
            Choose a game and start learning Urdu letters!  ✨
          </p>
        </div>

        {/* Game cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-10">
          {games.map((game, i) => (
            <div key={i} className="flex flex-col">
              <GameCard href={game.href} color={game.color} img={game.img} />
              <div className="mt-4 text-center">
                <Link href={game.href} className="group">
                  <p className="text-xl font-bold text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 transition-colors" style={{fontFamily: "'Bubblegum Sans', cursive"}}>
                    <span className="text-2xl mr-1">{game.emoji}</span> {game.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 font-bold" style={{fontFamily: "'Comic Neue', cursive"}}>
                    {game.description}
                  </p>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Extra fun section */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-2 border-indigo-200 dark:border-indigo-700 rounded-3xl p-6 sm:p-8 text-center">
            <h3 className="text-2xl font-bold mb-3" style={{fontFamily: "'Bubblegum Sans', cursive", color: '#6366f1'}}>
              🌟 More Games Coming Soon! 🌟
            </h3>
            <p className="text-gray-600 text-lg mb-4" style={{fontFamily: "'Comic Neue', cursive"}}>
              We&apos;re making new fun games for you! Stay tuned for more adventures! 🚀
            </p>
            <div className="flex gap-4 justify-center text-4xl">
              <span className="animate-bounce-slow">🎨</span>
              <span className="animate-bounce-slow" style={{animationDelay: '0.3s'}}>🎵</span>
              <span className="animate-bounce-slow" style={{animationDelay: '0.6s'}}>🎭</span>
              <span className="animate-bounce-slow" style={{animationDelay: '0.9s'}}>🎪</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
