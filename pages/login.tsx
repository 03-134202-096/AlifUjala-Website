import { LearningIcon, IconBadge } from '@/components/ui'
import { useState, FormEvent } from "react"
import type { NextPage } from 'next'
import LoadingIndicator from "@/components/LoadingIndicator"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import SEO from "@/components/SEO"
import { KidsButton, DecorativeBlobs } from "@/components/ui"

const LoginPage: NextPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setMessage("")
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (res.ok) {
        setMessage("🎉 Login successful! Welcome back, " + data.user.username + "!")
        setTimeout(() => { window.location.href = "/" }, 1500)
      } else {
        setMessage("😕 " + data.error)
      }
    } catch (err) {
      setMessage("😕 Unable to reach the server. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="kids-page-bg min-h-screen flex flex-col relative">
      <SEO title="Sign In — AlifUjala" description="Sign in to AlifUjala to continue your Urdu learning adventure." />
      <DecorativeBlobs variant="soft" motifs={["book","letters"]} />
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Login card */}
          <div className="glass-card relative rounded-[2rem] shadow-candy-lg border-[3px] border-purple-200/70 dark:border-purple-700/40 p-6 sm:p-8 overflow-hidden">
            <span className="pointer-events-none absolute -top-20 -right-20 h-44 w-44 rounded-full bg-purple-300/30 blur-3xl" aria-hidden />
            <span className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-indigo-300/30 blur-3xl" aria-hidden />
            {/* Header */}
            <div className="text-center mb-6">
              <div className="mb-4"><IconBadge name="book" size="hero" /></div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-gradient-cool" style={{fontFamily: "'Bubblegum Sans', cursive"}}>
                Welcome Back!
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-bold" style={{fontFamily: "'Comic Neue', cursive"}}>
                Sign in to continue learning!
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-indigo-500 dark:text-indigo-400 mb-1" style={{fontFamily: "'Comic Neue', cursive"}}><LearningIcon name="mail" className="mr-1.5" /> Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-purple-50 dark:bg-gray-800 border-3 border-purple-200 dark:border-purple-700 rounded-2xl text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all duration-300 font-bold"
                  style={{fontFamily: "'Comic Neue', cursive"}}
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-indigo-500 dark:text-indigo-400 mb-1" style={{fontFamily: "'Comic Neue', cursive"}}><LearningIcon name="lock" className="mr-1.5" /> Password</label>
                <input
                  type="password"
                  placeholder="Your secret password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-purple-50 dark:bg-gray-800 border-3 border-purple-200 dark:border-purple-700 rounded-2xl text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all duration-300 font-bold"
                  style={{fontFamily: "'Comic Neue', cursive"}}
                />
              </div>
              
              <KidsButton type="submit" disabled={isSubmitting} variant="primary" size="lg" fullWidth>
                {isSubmitting ? "Logging in… 🔄" : "Let's Go! 🚀"}
              </KidsButton>
            </form>
            
            {isSubmitting && (
              <div className="mt-6 flex justify-center">
                <LoadingIndicator size={60} message="Signing you in..." />
              </div>
            )}
            
            {!isSubmitting && message && (
              <div className={`mt-4 p-4 rounded-2xl border-3 text-center font-bold ${message.includes('🎉') ? 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400' : 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-400'}`} style={{fontFamily: "'Comic Neue', cursive"}}>
                {message}
              </div>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-gray-500 dark:text-gray-400 font-bold" style={{fontFamily: "'Comic Neue', cursive"}}>
                Don&apos;t have an account?{' '}
                <a href="/signup" className="text-purple-600 dark:text-purple-400 hover:text-indigo-500 font-bold transition-colors">
                  Sign up free! 🌟
                </a>
              </p>
            </div>
          </div>

          {/* Fun bottom decoration */}
          <div className="text-center mt-6">
            <div className="flex justify-center gap-3 text-3xl">
              <IconBadge name="gamepad" />
              <IconBadge name="book" />
              <IconBadge name="sparkles" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default LoginPage
