import { LearningIcon, IconBadge, type LearningIconName } from '@/components/ui'
import { useEffect, useState } from "react"
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LoadingIndicator from "@/components/LoadingIndicator"
import SEO from '@/components/SEO'
import type { NextPage } from 'next'
import { KidsCard, KidsButton, SectionHeader, DecorativeBlobs } from '@/components/ui'

const AdministrationPage: NextPage = () => {
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
      <SEO title="Administration — AlifUjala" description="Administration dashboard for AlifUjala." />
      <DecorativeBlobs variant="soft" motifs={["school","book"]} />

      <Navbar />
      <main className="flex-1 px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            eyebrow="Admin"
            icon="school"
            title="Administration"
            subtitle="Manage the learning platform."
            tone="cool"
          />

          {error ? (
            <KidsCard variant="glass" tone="purple" padding="lg" className="text-center max-w-md mx-auto">
              <div className="mb-4"><IconBadge name="lock" size="lg" /></div>
              <p className="text-purple-700 dark:text-purple-300 font-bold text-lg mb-4" style={{fontFamily: "'Comic Neue', cursive"}}>{error}</p>
              <KidsButton href="/login" variant="primary" size="md"><LearningIcon name="lock" className="mr-1.5" /> Login</KidsButton>
            </KidsCard>
          ) : (
            <KidsCard variant="glass" tone="blue" padding="lg" className="text-center">
              <div className="mb-4"><IconBadge name="school" size="hero" /></div>
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-300 mb-3" style={{fontFamily: "'Bubblegum Sans', cursive"}}>
                Admin Dashboard Coming Soon!
              </h2>
              <p className="text-gray-700 dark:text-gray-200 font-bold mb-6" style={{fontFamily: "'Comic Neue', cursive"}}>
                We&apos;re building powerful admin tools! 🛠️<br/>
                Manage students, content, and more.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { icon: 'users' as LearningIconName, label: 'User Management', tone: 'blue' as const },
                  { icon: 'pencil' as LearningIconName, label: 'Content Editor',   tone: 'purple' as const },
                  { icon: 'chart' as LearningIconName, label: 'Analytics',        tone: 'green' as const },
                ].map(t => (
                  <KidsCard key={t.label} variant="glass" tone={t.tone} padding="sm">
                    <div className="mb-2"><IconBadge name={t.icon} /></div>
                    <p className="text-purple-700 dark:text-purple-300 font-bold text-sm" style={{fontFamily: "'Comic Neue', cursive"}}>{t.label}</p>
                  </KidsCard>
                ))}
              </div>

              {user && (
                <KidsCard variant="gradient" tone="amber" padding="sm" className="inline-block">
                  <p className="text-amber-800 dark:text-amber-200 font-bold text-sm" style={{fontFamily: "'Comic Neue', cursive"}}>
                    👋 Logged in as: <strong>{user.username}</strong> ({user.email})
                  </p>
                </KidsCard>
              )}
            </KidsCard>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AdministrationPage
