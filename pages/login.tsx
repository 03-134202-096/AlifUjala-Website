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
        setMessage("✅ Login successful: " + data.user.username)
        // Redirect to home page after successful login
        setTimeout(() => {
          window.location.href = "/"
        }, 1500)
      } else {
        setMessage("❌ " + data.error)
      }
    } catch (err) {
      setMessage("❌ Unable to reach the server. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-8 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-white/70">Sign in to your account</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300"
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/90 hover:to-pink-600/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
          
          {isSubmitting && (
            <div className="mt-6 flex justify-center">
              <LoadingIndicator size={60} message="Signing you in..." />
            </div>
          )}
          
          {!isSubmitting && message && (
            <div className="mt-4 p-3 bg-white/10 border border-white/20 rounded-lg">
              <p className="text-white text-center text-sm">{message}</p>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm">
              Don't have an account? 
              <a href="/signup" className="text-white hover:text-pink-300 ml-1 font-medium transition-colors">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default LoginPage
