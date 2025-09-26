import { useState, FormEvent } from "react"
import type { NextPage } from 'next'

const SignupPage: NextPage = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  async function handleSignup(e: FormEvent) {
    e.preventDefault()
    setMessage("...loading")

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    })

    const data = await res.json()
    if (res.ok) {
      setMessage("✅ Signup successful: " + (data.username || ""))
    } else {
      setMessage("❌ " + data.error)
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
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
        <button type="submit">Signup</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

export default SignupPage
