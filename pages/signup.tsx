import { useState, FormEvent } from "react"
import type { NextPage } from 'next'
import LoadingIndicator from "@/components/LoadingIndicator"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const SignupPage: NextPage = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [message, setMessage] = useState("")
  const [step, setStep] = useState(1) // Track the current step
  const [isProcessing, setIsProcessing] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")

  async function handleSignup(e: FormEvent) {
    e.preventDefault()
    setMessage("")
    setLoadingMessage("Creating your account...")
    setIsProcessing(true)

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      })

      const data = await res.json()
      if (res.ok) {
        setMessage("✅ OTP sent to your email")
        setStep(2) // Move to OTP verification step
      } else {
        setMessage("❌ " + data.error)
      }
    } catch (err) {
      setMessage("❌ Unable to reach the server. Please try again.")
    } finally {
      setIsProcessing(false)
      setLoadingMessage("")
    }
  }

  async function handleVerifyOtp(e: FormEvent) {
    e.preventDefault()
    setMessage("")
    setLoadingMessage("Verifying OTP...")
    setIsProcessing(true)

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })

      const data = await res.json()
      if (res.ok) {
        setMessage("✅ Signup successful")
        setStep(3) // Signup complete
        // Redirect to home page after successful signup
        setTimeout(() => {
          window.location.href = "/"
        }, 3000)
      } else {
        setMessage("❌ " + data.error)
      }
    } catch (err) {
      setMessage("❌ Unable to reach the server. Please try again.")
    } finally {
      setIsProcessing(false)
      setLoadingMessage("")
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-8 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {step === 1 ? "Create Account" : step === 2 ? "Verify Email" : "Welcome!"}
            </h2>
            <p className="text-white/70">
              {step === 1 ? "Join our learning community" : step === 2 ? "Enter the code sent to your email" : "Account created successfully"}
            </p>
          </div>
          
          {step === 1 && (
            <form onSubmit={handleSignup} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isProcessing}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                />
              </div>
              
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isProcessing}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                />
              </div>
              
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isProcessing}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full py-3 bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/90 hover:to-pink-600/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                {isProcessing ? "Creating Account..." : "Sign Up"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  disabled={isProcessing}
                  maxLength={6}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full py-3 bg-gradient-to-r from-green-500/80 to-blue-500/80 hover:from-green-600/90 hover:to-blue-600/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                {isProcessing ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="text-6xl">🎉</div>
              <p className="text-white/90">Your account has been created successfully!</p>
              <p className="text-white/60 text-sm">Redirecting to home page...</p>
              <div className="w-full py-3 bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white font-semibold rounded-lg backdrop-blur-sm border border-white/20 flex items-center justify-center space-x-2">
                <LoadingIndicator size={20} message="" />
                <span>Taking you home</span>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="mt-6 flex justify-center">
              <LoadingIndicator size={60} message={loadingMessage || "Processing..."} />
            </div>
          )}
          
          {!isProcessing && message && (
            <div className="mt-4 p-3 bg-white/10 border border-white/20 rounded-lg">
              <p className="text-white text-center text-sm">{message}</p>
            </div>
          )}
          
          {step === 1 && (
            <div className="mt-6 text-center">
              <p className="text-white/70 text-sm">
                Already have an account? 
                <a href="/login" className="text-white hover:text-pink-300 ml-1 font-medium transition-colors">
                  Sign in
                </a>
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default SignupPage
