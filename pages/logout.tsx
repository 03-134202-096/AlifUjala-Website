import { useState } from "react"
import type { NextPage } from 'next'
import LoadingIndicator from "@/components/LoadingIndicator"

const LogoutPage: NextPage = () => {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")

  async function handleLogout() {
    setMessage("")
    setLoadingMessage("Signing you out...")
    setIsLoading(true)
    try {
      const res = await fetch("/api/logout", { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        setMessage("✅ Logout successful")
      } else {
        setMessage("❌ " + data.error)
      }
    } catch (err) {
      setMessage("❌ Unable to reach the server. Please try again.")
    } finally {
      setIsLoading(false)
      setLoadingMessage("")
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Logout</h2>
      <button onClick={handleLogout} disabled={isLoading}>
        {isLoading ? "Logging out..." : "Logout"}
      </button>
      {isLoading && (
        <div style={{ marginTop: "1.5rem" }}>
          <LoadingIndicator size={120} message={loadingMessage || "Processing..."} />
        </div>
      )}
      {!isLoading && message && <p>{message}</p>}
    </div>
  )
}

export default LogoutPage
