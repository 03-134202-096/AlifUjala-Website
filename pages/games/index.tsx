import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GameCard from '@/components/GameCard'

export default function GamesIndex() {
  return (
    <div className="flex flex-col min-h-screen bg-white" style={{backgroundImage: 'url(/images/Background_website.jpg)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <Navbar />
      <main className="container flex-1">
        <h2
          className="center text-3xl md:text-5xl font-extrabold tracking-tight"
          style={{ margin: '1rem 0', color: '#fff', textShadow: '0 2px 18px rgba(0,0,0,0.45)' }}>
          Games
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <GameCard href="/games/alphabetMatch" color="yellow" img="/images/alphabat to alphabat.png" />
            <p className="center mt-4 text-base md:text-lg font-semibold tracking-wide" style={{ color: '#f8f9fb' }}>
              Play Letter  Letter
            </p>
          </div>
          <div>
            <GameCard href="/games/matching" color="pink" img="/images/alphabet to image.png" />
            <p className="center mt-4 text-base md:text-lg font-semibold tracking-wide" style={{ color: '#f8f9fb' }}>
              Play Letter  Image
            </p>
          </div>
          <div>
            {/* Adhi Ashkal card - uses Adhi Ashkal.png from public/images */}
            <GameCard href="/games/adhiAshkalMatch" color="green" img="/images/Adhi Ashkal.png" />
            <p className="center mt-4 text-base md:text-lg font-semibold tracking-wide" style={{ color: '#f8f9fb' }}>
              Play Adhi Ashkal Matching
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
