import { useState, FormEvent } from "react"
import type { NextPage } from 'next'
import LoadingIndicator from "@/components/LoadingIndicator"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

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
      {/* Floating decorations */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-[10%] text-5xl animate-float opacity-15">🔑</div>
        <div className="absolute top-40 right-[15%] text-4xl animate-float-delay opacity-15">⭐</div>
        <div className="absolute bottom-40 left-[8%] text-4xl animate-bounce-slow opacity-10">🌈</div>
        <div className="absolute bottom-20 right-[10%] text-3xl animate-float opacity-15">✨</div>
      </div>

      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Login card */}
          <div className="bg-white/95 rounded-3xl shadow-candy-lg border-4 border-purple-200 p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-6xl mb-3">👋</div>
              <h2 className="text-3xl font-bold mb-2" style={{fontFamily: "'Bubblegum Sans', cursive", color: '#6366f1'}}>
                Welcome Back!
              </h2>
              <p className="text-gray-500 font-bold" style={{fontFamily: "'Comic Neue', cursive"}}>
                Sign in to continue learning! 🌟
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-indigo-500 mb-1" style={{fontFamily: "'Comic Neue', cursive"}}>📧 Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-purple-50 border-3 border-purple-200 rounded-2xl text-gray-700 placeholder-gray-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 font-bold"
                  style={{fontFamily: "'Comic Neue', cursive"}}
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-indigo-500 mb-1" style={{fontFamily: "'Comic Neue', cursive"}}>🔒 Password</label>
                <input
                  type="password"
                  placeholder="Your secret password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-purple-50 border-3 border-purple-200 rounded-2xl text-gray-700 placeholder-gray-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 font-bold"
                  style={{fontFamily: "'Comic Neue', cursive"}}
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-full transition-all duration-300 border-3 border-white shadow-candy hover:scale-[1.02] hover:-rotate-0.5 text-lg"
                style={{fontFamily: "'Bubblegum Sans', cursive"}}
              >
                {isSubmitting ? "Logging in... 🔄" : "Let's Go! 🚀"}
              </button>
            </form>
            
            {isSubmitting && (
              <div className="mt-6 flex justify-center">
                <LoadingIndicator size={60} message="Signing you in..." />
              </div>
            )}
            
            {!isSubmitting && message && (
              <div className={`mt-4 p-4 rounded-2xl border-3 text-center font-bold ${message.includes('🎉') ? 'bg-green-50 border-green-300 text-green-700' : 'bg-purple-50 border-purple-300 text-purple-700'}`} style={{fontFamily: "'Comic Neue', cursive"}}>
                {message}
              </div>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-gray-500 font-bold" style={{fontFamily: "'Comic Neue', cursive"}}>
                Don&apos;t have an account?{' '}
                <a href="/signup" className="text-purple-600 hover:text-indigo-500 font-bold transition-colors">
                  Sign up free! 🌟
                </a>
              </p>
            </div>
          </div>

          {/* Fun bottom decoration */}
          <div className="text-center mt-6">
            <div className="flex justify-center gap-3 text-3xl">
              <span className="animate-bounce-slow">🎮</span>
              <span className="animate-bounce-slow" style={{animationDelay: '0.3s'}}>📖</span>
              <span className="animate-bounce-slow" style={{animationDelay: '0.6s'}}>✨</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default LoginPage
