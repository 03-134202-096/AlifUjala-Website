import { useState, FormEvent } from "react"
import type { NextPage } from 'next'
import LoadingIndicator from "@/components/LoadingIndicator"

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
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Signup</h2>
      {step === 1 && (
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isProcessing}
          />
          <br />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isProcessing}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isProcessing}
          />
          <br />
          <button type="submit" disabled={isProcessing}>
            {isProcessing ? "Signing you up..." : "Signup"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            disabled={isProcessing}
          />
          <br />
          <button type="submit" disabled={isProcessing}>
            {isProcessing ? "Checking code..." : "Verify OTP"}
          </button>
        </form>
      )}

      {isProcessing && (
        <div style={{ marginTop: "1.5rem" }}>
          <LoadingIndicator size={120} message={loadingMessage || "Processing..."} />
        </div>
      )}
      {!isProcessing && message && <p>{message}</p>}
    </div>
  )
}

export default SignupPage
