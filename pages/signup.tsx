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
      {/* Floating decorations */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-[10%] text-5xl animate-float opacity-15">🌟</div>
        <div className="absolute top-40 right-[15%] text-4xl animate-float-delay opacity-15">🎨</div>
        <div className="absolute bottom-40 left-[8%] text-4xl animate-bounce-slow opacity-10">📚</div>
        <div className="absolute bottom-20 right-[10%] text-3xl animate-float opacity-15">🦋</div>
      </div>

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
          <div className="bg-white/95 dark:bg-gray-900/95 rounded-3xl shadow-candy-lg border-4 border-indigo-200 dark:border-indigo-800 p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-6xl mb-3">{step === 1 ? '' : step === 2 ? '📬' : '🎊'}</div>
              <h2 className="text-3xl font-bold mb-2" style={{fontFamily: "'Bubblegum Sans', cursive", color: '#EC4899'}}>
                {stepLabels[step - 1]}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-bold" style={{fontFamily: "'Comic Neue', cursive"}}>
                {step === 1 ? "Join us and start learning Urdu! 🌈" : step === 2 ? "Check your email for the code! 📩" : "Your account is ready! 🎉"}
              </p>
            </div>

            {step === 1 && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-purple-500 dark:text-purple-400 mb-1" style={{fontFamily: "'Comic Neue', cursive"}}>👤 Username</label>
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
                  <label className="block text-sm font-bold text-purple-500 dark:text-purple-400 mb-1" style={{fontFamily: "'Comic Neue', cursive"}}>📧 Email</label>
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
                  <label className="block text-sm font-bold text-purple-500 dark:text-purple-400 mb-1" style={{fontFamily: "'Comic Neue', cursive"}}>🔒 Password</label>
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

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-full transition-all duration-300 border-3 border-white shadow-candy hover:scale-[1.02] text-lg"
                  style={{fontFamily: "'Bubblegum Sans', cursive"}}
                >
                  {isProcessing ? "Creating Account... 🔄" : "Sign Up!"}
                </button>
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

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-full transition-all duration-300 border-3 border-white shadow-candy hover:scale-[1.02] text-lg"
                  style={{fontFamily: "'Bubblegum Sans', cursive"}}
                >
                  {isProcessing ? "Verifying... 🔄" : "Verify! ✅"}
                </button>
              </form>
            )}

            {step === 3 && (
              <div className="text-center space-y-4">
                <div className="text-7xl animate-bounce-slow">🎉</div>
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
              <span className="animate-bounce-slow">🎮</span>
              <span className="animate-bounce-slow" style={{animationDelay: '0.3s'}}>📖</span>
              <span className="animate-bounce-slow" style={{animationDelay: '0.6s'}}>🌟</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default SignupPage
