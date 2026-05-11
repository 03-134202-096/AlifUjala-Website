import { useEffect, useState } from "react"
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LoadingIndicator from "@/components/LoadingIndicator"
import SEO from '@/components/SEO'
import type { NextPage } from 'next'
import { KidsCard, KidsButton, SectionHeader, DecorativeBlobs } from '@/components/ui'

const StudentsPage: NextPage = () => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/profile")
        const data = await res.json()
        if (res.ok) {
          setUser(data.user)
        } else {
          setError("Please login to view this page")
        }
      } catch (err) {
        setError("Something went wrong")
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="kids-page-bg min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <LoadingIndicator size={60} message="Loading..." />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="kids-page-bg min-h-screen flex flex-col relative">
      <SEO title="Students — AlifUjala" description="See who is learning with AlifUjala." />
      <DecorativeBlobs variant="soft" emojis={["📚", "✏️", "🎒", "🌟", "✨"]} />

      <Navbar />
      <main className="flex-1 px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            eyebrow="🎓 Students"
            emoji="👨‍🎓"
            title="Students"
            subtitle="See who's learning with us!"
            tone="warm"
          />

          {error ? (
            <KidsCard variant="glass" tone="purple" padding="lg" className="text-center max-w-md mx-auto">
              <div className="text-5xl mb-4">🔒</div>
              <p className="text-purple-700 dark:text-purple-300 font-bold text-lg mb-4" style={{fontFamily: "'Comic Neue', cursive"}}>{error}</p>
              <KidsButton href="/login" variant="primary" size="md">🔑 Login</KidsButton>
            </KidsCard>
          ) : (
            <KidsCard variant="glass" tone="purple" padding="lg" className="text-center">
              <div className="text-6xl mb-4 animate-bounce-slow">🏗️</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 dark:text-purple-300 mb-3" style={{fontFamily: "'Bubblegum Sans', cursive"}}>
                Coming Soon!
              </h2>
              <p className="text-gray-700 dark:text-gray-200 font-bold mb-6" style={{fontFamily: "'Comic Neue', cursive"}}>
                We&apos;re building something amazing here! 🚀<br/>
                Soon you&apos;ll be able to see all the students learning Urdu together.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { icon: '📊', label: 'Progress Tracking', tone: 'purple' as const },
                  { icon: '🏆', label: 'Leaderboard',       tone: 'indigo' as const },
                  { icon: '🎖️', label: 'Achievements',      tone: 'blue'   as const },
                ].map(t => (
                  <KidsCard key={t.label} variant="glass" tone={t.tone} padding="sm">
                    <div className="text-3xl mb-2">{t.icon}</div>
                    <p className="text-purple-700 dark:text-purple-300 font-bold text-sm" style={{fontFamily: "'Comic Neue', cursive"}}>{t.label}</p>
                  </KidsCard>
                ))}
              </div>

              <KidsButton href="/activity" variant="success" size="lg" iconRight={<span>🎮</span>}>Go Play Games!</KidsButton>
            </KidsCard>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default StudentsPage
