import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import SEO from '@/components/SEO'

const GAMES = [
  {
    href: "/games/urduHunter",
    title: "Alphabet Hunter",
    emoji: "🎯",
    description: "Bubbles with Urdu letters fall from the sky — pop the correct one before it escapes!",
    gradient: "from-purple-600 to-pink-500",
    border: "border-purple-400/50",
    shadow: "shadow-purple-500/20",
    img: "/images/urduHunter.svg",
  },
  {
    href: "/games/urduBasketCatch",
    title: "Basket Catch",
    emoji: "🧺",
    description: "Move your basket left and right to catch the target Urdu letter falling from above!",
    gradient: "from-sky-500 to-indigo-600",
    border: "border-sky-400/50",
    shadow: "shadow-sky-500/20",
    img: "/images/urduBasketCatch.svg",
  },
  {
    href: "/games/memoryMatch",
    title: "Memory Match",
    emoji: "🧠",
    description: "Flip the cards and find matching pairs of Urdu letters — train your memory!",
    gradient: "from-emerald-500 to-teal-600",
    border: "border-emerald-400/50",
    shadow: "shadow-emerald-500/20",
    img: "/images/urduAlphabetStories.svg",
  },
]

export default function GamesIndex() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-gradient)" }}>
      <SEO
        title="Urdu Games — Fun Arcade Games to Learn Urdu Alphabets"
        description="Play exciting arcade games to learn Urdu letters! Pop bubbles, catch falling letters, and test your memory. Free interactive games for kids."
        ogUrl="https://alifujala.ai/games"
        keywords="Urdu games for kids, Urdu alphabet games, learn Urdu online free, Urdu arcade games"
      />
      <Navbar />

      <main style={{ flex: 1, paddingTop: "100px", paddingBottom: "60px", paddingLeft: "16px", paddingRight: "16px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ fontSize: "3rem", marginBottom: "10px" }}>🕹️</p>
          <h1 className="text-white dark:text-white" style={{
            fontFamily: "'Bubblegum Sans', cursive",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            textShadow: "0 3px 18px rgba(139,92,246,0.9)",
            margin: "0 0 12px",
          }}>
            Urdu Letter Games
          </h1>
          <p style={{
            fontFamily: "'Comic Neue', cursive",
            color: "var(--text-secondary)",
            fontSize: "1.05rem",
            maxWidth: "460px",
            margin: "0 auto",
          }}>
            Fast-paced arcade fun while learning Urdu letters! 🚀
          </p>
        </div>

        {/* Game cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "28px",
          maxWidth: "960px",
          margin: "0 auto 48px",
        }}>
          {GAMES.map((game) => (
            <Link key={game.href} href={game.href} style={{ textDecoration: "none" }}>
              <div
                className="bg-white/10 dark:bg-white/7 border-2 border-purple-400/35 dark:border-purple-400/35 rounded-3xl overflow-hidden backdrop-blur-sm cursor-pointer transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(139,92,246,0.3)]"
              >
                {/* Image preview */}
                <div style={{
                  width: "100%",
                  height: "180px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(0,0,0,0.2)",
                }}>
                  <img src={game.img} alt={game.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>

                {/* Info */}
                <div style={{ padding: "24px 20px 28px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <span style={{ fontSize: "1.8rem" }}>{game.emoji}</span>
                    <h2 className="text-white" style={{
                      fontFamily: "'Bubblegum Sans', cursive",
                      fontSize: "1.4rem",
                      margin: 0,
                    }}>
                      {game.title}
                    </h2>
                  </div>
                  <p style={{
                    fontFamily: "'Comic Neue', cursive",
                    color: "var(--text-secondary)",
                    fontSize: "0.92rem",
                    lineHeight: "1.6",
                    margin: "0 0 20px",
                  }}>
                    {game.description}
                  </p>
                  <div style={{
                    display: "inline-block",
                    background: "linear-gradient(135deg,#A78BFA,#EC4899)",
                    color: "white",
                    fontFamily: "'Bubblegum Sans', cursive",
                    fontSize: "0.95rem",
                    padding: "9px 26px",
                    borderRadius: "40px",
                    boxShadow: "0 4px 14px rgba(167,139,250,0.35)",
                  }}>
                    Play Now!
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Activities CTA */}
        <div style={{ maxWidth: "620px", margin: "0 auto", textAlign: "center" }}>
          <div className="bg-white/10 dark:bg-white/6 border border-white/15 rounded-2xl p-7 backdrop-blur-sm">
            <p className="text-white" style={{ fontFamily: "'Bubblegum Sans', cursive", fontSize: "1.3rem", margin: "0 0 8px" }}>
              📚 Want Learning Activities?
            </p>
            <p style={{ fontFamily: "'Comic Neue', cursive", color: "var(--text-secondary)", fontSize: "0.9rem", margin: "0 0 18px" }}>
              Try our Urdu letter matching activities and alphabet stories!
            </p>
            <Link href="/activity" className="inline-block bg-white/12 text-white border border-white/30 rounded-full px-7 py-2.5 font-bold hover:bg-white/20 transition-all" style={{
              fontFamily: "'Bubblegum Sans', cursive",
              fontSize: "0.95rem",
              textDecoration: "none",
            }}>
              View Activities →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
