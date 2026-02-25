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
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 40%,#312e81 70%,#4c1d95 100%)" }}>
      <SEO
        title="Urdu Games — Fun Arcade Games to Learn Urdu Alphabets"
        description="Play exciting arcade games to learn Urdu letters! Pop bubbles, catch falling letters, and test your memory. Free interactive games for kids."
        ogUrl="https://www.alifujala.com/games"
        keywords="Urdu games for kids, Urdu alphabet games, learn Urdu online free, Urdu arcade games"
      />
      <Navbar />

      <main style={{ flex: 1, paddingTop: "100px", paddingBottom: "60px", paddingLeft: "16px", paddingRight: "16px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ fontSize: "3rem", marginBottom: "10px" }}>🕹️</p>
          <h1 style={{
            fontFamily: "'Bubblegum Sans', cursive",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "white",
            textShadow: "0 3px 18px rgba(139,92,246,0.9)",
            margin: "0 0 12px",
          }}>
            Urdu Letter Games
          </h1>
          <p style={{
            fontFamily: "'Comic Neue', cursive",
            color: "rgba(255,255,255,0.6)",
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
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "2px solid rgba(167,139,250,0.35)",
                  borderRadius: "24px",
                  overflow: "hidden",
                  backdropFilter: "blur(14px)",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 48px rgba(139,92,246,0.3)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
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
                    <h2 style={{
                      fontFamily: "'Bubblegum Sans', cursive",
                      fontSize: "1.4rem",
                      color: "white",
                      margin: 0,
                    }}>
                      {game.title}
                    </h2>
                  </div>
                  <p style={{
                    fontFamily: "'Comic Neue', cursive",
                    color: "rgba(255,255,255,0.65)",
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
          <div style={{
            background: "rgba(255,255,255,0.06)",
            border: "1.5px solid rgba(255,255,255,0.15)",
            borderRadius: "22px",
            padding: "28px 24px",
            backdropFilter: "blur(10px)",
          }}>
            <p style={{ fontFamily: "'Bubblegum Sans', cursive", color: "white", fontSize: "1.3rem", margin: "0 0 8px" }}>
              📚 Want Learning Activities?
            </p>
            <p style={{ fontFamily: "'Comic Neue', cursive", color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", margin: "0 0 18px" }}>
              Try our Urdu letter matching activities and alphabet stories!
            </p>
            <Link href="/activity" style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.12)",
              color: "white",
              fontFamily: "'Bubblegum Sans', cursive",
              fontSize: "0.95rem",
              padding: "10px 28px",
              borderRadius: "40px",
              border: "1.5px solid rgba(255,255,255,0.3)",
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
