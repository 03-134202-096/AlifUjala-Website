import { useState } from "react"
import type { NextPage } from 'next'

const LogoutPage: NextPage = () => {
  const [message, setMessage] = useState("")

  async function handleLogout() {
    setMessage("...loading")
    const res = await fetch("/api/logout", { method: "POST" })
    const data = await res.json()
    if (res.ok) {
      setMessage("✅ Logout successful")
    } else {
      setMessage("❌ " + data.error)
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Logout</h2>
      <button onClick={handleLogout}>Logout</button>
      {message && <p>{message}</p>}
    </div>
  )
}

export default LogoutPage
