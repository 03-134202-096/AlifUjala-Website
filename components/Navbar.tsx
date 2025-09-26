"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"

type User = { id: number | string; username?: string; email?: string } | null

export default function Navbar() {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/profile")
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" })
    setUser(null)
    window.location.href = "/"
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link href="/" style={styles.logo}>Alif Ujala</Link>
      </div>
      <div style={styles.right}>
        <Link href="/" style={styles.link}>Home</Link>
        <Link href="/games/alphabetMatch" style={styles.link}>Games</Link>
        <Link href="/about" style={styles.link}>About</Link>

        {loading ? (
          <span style={styles.link}>...</span>
        ) : user ? (
          <>
            <Link href="/profile" style={styles.link}>Profile</Link>
            <button onClick={handleLogout} style={styles.button}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" style={styles.link}>Login</Link>
            <Link href="/signup" style={styles.link}>Signup</Link>
          </>
        )}
      </div>
    </nav>
  )
}

const styles: { [k: string]: React.CSSProperties } = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#4a148c",
    padding: "0.75rem 2rem",
    color: "#fff",
  },
  logo: {
    fontWeight: "bold",
    fontSize: "1.3rem",
    color: "#fff",
    textDecoration: "none",
  },
  right: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1rem",
  },
  button: {
    background: "#d32f2f",
    border: "none",
    color: "#fff",
    padding: "0.4rem 0.8rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
}
