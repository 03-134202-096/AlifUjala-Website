import { useEffect, useState } from "react"
import type { NextPage } from "next"
import LoadingIndicator from "@/components/LoadingIndicator"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import SEO from "@/components/SEO"
import { KidsButton, DecorativeBlobs } from "@/components/ui"

const LogoutPage: NextPage = () => {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleLogout() {
    setMessage("")
    setIsLoading(true)
    try {
      const res = await fetch("/api/logout", { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        setMessage("✅ You're signed out. Come back soon!")
        setDone(true)
        setTimeout(() => { window.location.href = "/" }, 1800)
      } else {
        setMessage("😕 " + data.error)
      }
    } catch {
      setMessage("😕 Unable to reach the server. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-trigger logout on page load for a clean UX
  useEffect(() => { handleLogout() }, [])

  return (
    <div className="kids-page-bg min-h-screen flex flex-col relative">
      <SEO title="Logging out — AlifUjala" description="Securely sign out of AlifUjala." />
      <DecorativeBlobs variant="soft" emojis={["👋", "✨", "🌙", "🔒", "💫"]} />
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md">
          <div className="glass-card relative rounded-[2rem] shadow-candy-lg border-[3px] border-purple-200/70 dark:border-purple-700/40 p-8 text-center overflow-hidden">
            <span className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-purple-300/30 blur-3xl" aria-hidden />
            <span className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-pink-300/30 blur-3xl" aria-hidden />

            <div className="text-7xl mb-4 animate-bounce-slow">{done ? "👋" : "🔒"}</div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gradient-cool" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              {done ? "See You Soon!" : "Signing You Out…"}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 font-bold mb-6" style={{ fontFamily: "'Comic Neue', cursive" }}>
              {done ? "Redirecting you home." : "Please wait a moment."}
            </p>

            {isLoading && (
              <div className="flex justify-center mb-4">
                <LoadingIndicator size={80} message="" />
              </div>
            )}

            {!isLoading && message && (
              <div className={`mb-4 p-3 rounded-2xl border-[3px] font-bold ${
                message.includes("✅")
                  ? "bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300"
                  : "bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300"
              }`} style={{ fontFamily: "'Comic Neue', cursive" }}>
                {message}
              </div>
            )}

            <div className="flex gap-3 justify-center flex-wrap">
              <KidsButton href="/" variant="primary" size="md">🏠 Go Home</KidsButton>
              <KidsButton href="/login" variant="outline" size="md">🔑 Sign In Again</KidsButton>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default LogoutPage
