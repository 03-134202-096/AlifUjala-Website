import { useEffect, useState } from "react"
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LoadingIndicator from "@/components/LoadingIndicator"
import type { NextPage } from 'next'

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
      {/* Floating decorations */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-24 left-[12%] text-5xl animate-float opacity-15">📚</div>
        <div className="absolute top-44 right-[10%] text-4xl animate-float-delay opacity-15">✏️</div>
        <div className="absolute bottom-32 left-[8%] text-4xl animate-bounce-slow opacity-10">🎒</div>
        <div className="absolute bottom-20 right-[12%] text-3xl animate-float opacity-15">🌟</div>
      </div>

      <Navbar />
      <main className="flex-1 px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-3 animate-bounce-slow">👨‍🎓</div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-2"
              style={{
                fontFamily: "'Bubblegum Sans', cursive",
                background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #F97316)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
              Students
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-bold text-lg" style={{fontFamily: "'Comic Neue', cursive"}}>
              See who&apos;s learning with us! 🌈
            </p>
          </div>

          {error ? (
            <div className="bg-white/95 dark:bg-gray-900/95 rounded-3xl shadow-candy-lg border-4 border-purple-200 dark:border-purple-800 p-8 text-center max-w-md mx-auto">
              <div className="text-5xl mb-4">🔒</div>
              <p className="text-purple-600 dark:text-purple-400 font-bold text-lg mb-4" style={{fontFamily: "'Comic Neue', cursive"}}>{error}</p>
              <a href="/login"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-full border-3 border-white shadow-candy hover:scale-105 transition-all"
                style={{fontFamily: "'Bubblegum Sans', cursive"}}>
                Login 🔑
              </a>
            </div>
          ) : (
            <div className="bg-white/95 dark:bg-gray-900/95 rounded-3xl shadow-candy-lg border-4 border-purple-200 dark:border-purple-800 p-6 sm:p-8 text-center">
              <div className="text-6xl mb-4">🏗️</div>
              <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-3" style={{fontFamily: "'Bubblegum Sans', cursive"}}>
                Coming Soon!
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-bold mb-6" style={{fontFamily: "'Comic Neue', cursive"}}>
                We&apos;re building something amazing here! 🚀<br/>
                Soon you&apos;ll be able to see all the students learning Urdu together.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-purple-50 dark:bg-purple-900/30 rounded-2xl p-4 border-2 border-purple-100 dark:border-purple-800">
                  <div className="text-3xl mb-2">📊</div>
                  <p className="text-purple-600 dark:text-purple-400 font-bold text-sm" style={{fontFamily: "'Comic Neue', cursive"}}>Progress Tracking</p>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl p-4 border-2 border-indigo-100 dark:border-indigo-800">
                  <div className="text-3xl mb-2">🏆</div>
                  <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm" style={{fontFamily: "'Comic Neue', cursive"}}>Leaderboard</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-2xl p-4 border-2 border-blue-100 dark:border-blue-800">
                  <div className="text-3xl mb-2">🎖️</div>
                  <p className="text-blue-600 dark:text-blue-400 font-bold text-sm" style={{fontFamily: "'Comic Neue', cursive"}}>Achievements</p>
                </div>
              </div>

              <a href="/activity"
                className="inline-block px-8 py-3 bg-gradient-to-r from-green-400 to-cyan-400 text-white font-bold rounded-full border-3 border-white shadow-candy hover:scale-105 transition-all text-lg"
                style={{fontFamily: "'Bubblegum Sans', cursive"}}>
                Go Play Games! 🎮
              </a>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default StudentsPage
