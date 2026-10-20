import { LearningIcon, IconBadge } from '@/components/ui'
import { useState, FormEvent } from "react"
import type { NextPage } from 'next'
import LoadingIndicator from "@/components/LoadingIndicator"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import SEO from "@/components/SEO"
import { KidsButton, DecorativeBlobs } from "@/components/ui"

const SignupPage: NextPage = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [message, setMessage] = useState("")
  const [step, setStep] = useState(1)
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
        setStep(2)
      } else {
        setMessage("😕 " + data.error)
      }
    } catch (err) {
      setMessage("😕 Unable to reach the server. Please try again.")
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
        setMessage("🎉 Signup successful!")
        setStep(3)
        setTimeout(() => {
          window.location.href = "/"
        }, 3000)
      } else {
        setMessage("😕 " + data.error)
      }
    } catch (err) {
      setMessage("😕 Unable to reach the server. Please try again.")
    } finally {
      setIsProcessing(false)
      setLoadingMessage("")
    }
  }

  const stepEmojis = ["📝", "📧", "🎉"]
  const stepLabels = ["Create Account", "Verify Email", "All Done!"]

  return (
    <div className="kids-page-bg min-h-screen flex flex-col relative">
      <SEO title="Sign Up — AlifUjala" description="Create a free AlifUjala account to start your child's Urdu learning journey." />
      <DecorativeBlobs variant="soft" motifs={["pencil","book"]} />
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Progress steps */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-3 transition-all duration-500 ${
                  step >= s
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-white shadow-candy'
                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700'
                }`}>
                  {step > s ? '✓' : stepEmojis[s - 1]}
                </div>
                {s < 3 && (
                  <div className={`w-8 h-1 rounded-full transition-all duration-500 ${step > s ? 'bg-indigo-400' : 'bg-gray-200 dark:bg-gray-700'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Signup card */}
          <div className="glass-card relative rounded-[2rem] shadow-candy-lg border-[3px] border-indigo-200/70 dark:border-indigo-700/40 p-6 sm:p-8 overflow-hidden">
            <span className="pointer-events-none absolute -top-20 -right-20 h-44 w-44 rounded-full bg-fuchsia-300/30 blur-3xl" aria-hidden />
            <span className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-indigo-300/30 blur-3xl" aria-hidden />
            {/* Header */}
            <div className="text-center mb-6">
              <div className="mb-4"><IconBadge name={step === 1 ? 'pencil' : step === 2 ? 'mail' : 'check'} size="hero" /></div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-gradient-warm" style={{fontFamily: "'Bubblegum Sans', cursive"}}>
                {stepLabels[step - 1]}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-bold" style={{fontFamily: "'Comic Neue', cursive"}}>
                {step === 1 ? "Join us and start learning Urdu! 🌈" : step === 2 ? "Check your email for the code! 📩" : "Your account is ready! 🎉"}
              </p>
            </div>

            {step === 1 && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-purple-500 dark:text-purple-400 mb-1" style={{fontFamily: "'Comic Neue', cursive"}}><LearningIcon name="users" className="mr-1.5" /> Username</label>
                  <input
                    type="text"
                    placeholder="Pick a fun name!"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isProcessing}
                    className="w-full px-4 py-3 bg-indigo-50 dark:bg-gray-800 border-3 border-indigo-200 dark:border-indigo-700 rounded-2xl text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900 transition-all duration-300 font-bold disabled:opacity-50"
                    style={{fontFamily: "'Comic Neue', cursive"}}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-purple-500 dark:text-purple-400 mb-1" style={{fontFamily: "'Comic Neue', cursive"}}><LearningIcon name="mail" className="mr-1.5" /> Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isProcessing}
                    className="w-full px-4 py-3 bg-indigo-50 dark:bg-gray-800 border-3 border-indigo-200 dark:border-indigo-700 rounded-2xl text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900 transition-all duration-300 font-bold disabled:opacity-50"
                    style={{fontFamily: "'Comic Neue', cursive"}}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-purple-500 dark:text-purple-400 mb-1" style={{fontFamily: "'Comic Neue', cursive"}}><LearningIcon name="lock" className="mr-1.5" /> Password</label>
                  <input
                    type="password"
                    placeholder="Your secret password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isProcessing}
                    className="w-full px-4 py-3 bg-indigo-50 dark:bg-gray-800 border-3 border-indigo-200 dark:border-indigo-700 rounded-2xl text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900 transition-all duration-300 font-bold disabled:opacity-50"
                    style={{fontFamily: "'Comic Neue', cursive"}}
                  />
                </div>

                <KidsButton type="submit" disabled={isProcessing} variant="primary" size="lg" fullWidth>
                  {isProcessing ? "Creating Account… 🔄" : "Sign Up!"}
                </KidsButton>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/30 border-3 border-yellow-200 dark:border-yellow-700 rounded-2xl p-4 text-center">
                  <p className="text-yellow-700 dark:text-yellow-400 font-bold text-sm" style={{fontFamily: "'Comic Neue', cursive"}}>
                    📌 <strong>Tip:</strong> If you don&apos;t see the OTP email in your inbox, check your spam folder!
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-green-500 dark:text-green-400 mb-1" style={{fontFamily: "'Comic Neue', cursive"}}>🔢 Enter OTP Code</label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    disabled={isProcessing}
                    maxLength={6}
                    className="w-full px-4 py-4 bg-green-50 dark:bg-gray-800 border-3 border-green-200 dark:border-green-700 rounded-2xl text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 text-center text-2xl tracking-[0.5em] focus:border-green-400 focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900 transition-all duration-300 font-bold disabled:opacity-50"
                    style={{fontFamily: "'Comic Neue', cursive"}}
                  />
                </div>

                <KidsButton type="submit" disabled={isProcessing} variant="success" size="lg" fullWidth>
                  {isProcessing ? "Verifying… 🔄" : "Verify! ✅"}
                </KidsButton>
              </form>
            )}

            {step === 3 && (
              <div className="text-center space-y-4">
                <IconBadge name="check" size="hero" />
                <p className="text-gray-700 dark:text-gray-300 font-bold text-lg" style={{fontFamily: "'Comic Neue', cursive"}}>
                  Your account has been created! Welcome aboard!
                </p>
                <p className="text-gray-400 font-bold text-sm" style={{fontFamily: "'Comic Neue', cursive"}}>
                  Taking you to the homepage...
                </p>
                <div className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-full border-3 border-white shadow-candy flex items-center justify-center space-x-2"
                  style={{fontFamily: "'Bubblegum Sans', cursive"}}
                >
                  <LoadingIndicator size={20} message="" />
                  <span>Going home! 🏠</span>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="mt-6 flex justify-center">
                <LoadingIndicator size={60} message={loadingMessage || "Processing..."} />
              </div>
            )}

            {!isProcessing && message && (
              <div className={`mt-4 p-4 rounded-2xl border-3 text-center font-bold ${
                message.includes('✅') || message.includes('🎉')
                  ? 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400'
                  : 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-400'
              }`} style={{fontFamily: "'Comic Neue', cursive"}}>
                {message}
              </div>
            )}

            {step === 1 && (
              <div className="mt-6 text-center">
                <p className="text-gray-500 dark:text-gray-400 font-bold" style={{fontFamily: "'Comic Neue', cursive"}}>
                  Already have an account?{' '}
                  <a href="/login" className="text-indigo-500 dark:text-indigo-400 hover:text-purple-500 font-bold transition-colors">
                    Sign in here! 🔑
                  </a>
                </p>
              </div>
            )}
          </div>

          {/* Fun bottom decoration */}
          <div className="text-center mt-6">
            <div className="flex justify-center gap-3 text-3xl">
              <IconBadge name="gamepad" />
              <IconBadge name="book" />
              <IconBadge name="star" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default SignupPage
