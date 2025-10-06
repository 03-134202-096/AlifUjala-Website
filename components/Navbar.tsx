"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import LoadingIndicator from "./LoadingIndicator"

type User = { id: number | string; username?: string; email?: string; profileImgId?: number } | null

export default function Navbar() {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)

  // Profile images mapping (must match profile page)
  const profileImages = [
    { id: 0, src: "/images/Kids/Female.png", label: "Female" },
    { id: 1, src: "/images/Kids/Male.png", label: "Male" },
  ];

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

    // Listen for profile image change via localStorage
    const handler = (e: StorageEvent) => {
      if (e.key === 'profile-image-updated') fetchUser()
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" })
    setUser(null)
    window.location.href = "/"
  }

  return (
    <nav className="bg-purple-800 text-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <div>
          <Link href="/" className="font-bold text-lg">Alif Ujala</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-white text-base">Home</Link>
          <Link href="/games/alphabetMatch" className="text-white text-base">Games</Link>
          <Link href="/about" className="text-white text-base">About</Link>

          {loading ? (
            <LoadingIndicator
              size={36}
              message=""
              orientation="horizontal"
              className="gap-0"
            />
          ) : user ? (
            <>
              <Link href="/profile" className="text-white">Profile</Link>
              <button onClick={handleLogout} className="bg-red-600 text-white px-3 py-1 rounded">Logout</button>
              <Link href="/profile" className="ml-2 hidden sm:inline-block">
                {typeof user.profileImgId === 'number' && profileImages[user.profileImgId] ? (
                  <img
                    src={profileImages[user.profileImgId].src}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover border-2 border-white shadow"
                  />
                ) : (
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white text-xl font-bold border-2 border-white shadow">👤</span>
                )}
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-white">Login</Link>
              <Link href="/signup" className="text-white">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

// Tailwind classes used inline in JSX above
