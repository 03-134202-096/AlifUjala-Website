import { useState, FormEvent } from "react"
import type { NextPage } from 'next'

const LoginPage: NextPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setMessage("...loading")

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    if (res.ok) {
      setMessage("✅ Login successful: " + data.user.username)
    } else {
      setMessage("❌ " + data.error)
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

export default LoginPage
