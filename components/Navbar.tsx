"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import LoadingIndicator from "./LoadingIndicator"

type User = { id: number | string; username?: string; email?: string; profileImgId?: number } | null

export default function Navbar({ className = "" }: { className?: string } = {}) {
  const [menuOpen, setMenuOpen] = useState(false);
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
    <nav className={className || "bg-purple-800 text-white"}>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center">
          {/* Logo: always visible */}
          <Link href="/" className="mr-3">
            <img src="/images/Logo.jpg" alt="Alif Ujala Logo" className="h-10 w-auto" />
          </Link>
          <Link href="/" className="font-bold text-lg">Alif Ujala</Link>
        </div>

        {/* Hamburger for mobile */}
        <button
          className="sm:hidden flex flex-col justify-center items-center w-10 h-10 rounded focus:outline-none group"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={
            `block w-7 h-1 rounded bg-white mb-1 transition-all duration-300 ease-in-out ` +
            (menuOpen ? 'rotate-45 translate-y-2' : '')
          }></span>
          <span className={
            `block w-7 h-1 rounded bg-white mb-1 transition-all duration-300 ease-in-out ` +
            (menuOpen ? 'opacity-0' : '')
          }></span>
          <span className={
            `block w-7 h-1 rounded bg-white transition-all duration-300 ease-in-out ` +
            (menuOpen ? '-rotate-45 -translate-y-2' : '')
          }></span>
        </button>

        {/* Desktop menu */}
        <div className="hidden sm:flex items-center gap-4">
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

      {/* Mobile menu overlay */}
      <div
        className={`sm:hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuOpen(false)}
      >
        <div
          className="absolute top-0 right-0 w-3/4 max-w-xs h-full bg-purple-900 shadow-lg flex flex-col pt-16 px-6 gap-6 animate-slidein"
          onClick={e => e.stopPropagation()}
        >
          <Link href="/" className="text-white text-lg font-semibold" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/games/alphabetMatch" className="text-white text-lg font-semibold" onClick={() => setMenuOpen(false)}>Games</Link>
          <Link href="/about" className="text-white text-lg font-semibold" onClick={() => setMenuOpen(false)}>About</Link>
          {loading ? (
            <LoadingIndicator size={36} message="" orientation="horizontal" className="gap-0" />
          ) : user ? (
            <>
              <Link href="/profile" className="text-white text-lg font-semibold" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="bg-red-600 text-white px-3 py-1 rounded">Logout</button>
              <Link href="/profile" className="mt-2">
                {typeof user.profileImgId === 'number' && profileImages[user.profileImgId] ? (
                  <img src={profileImages[user.profileImgId].src} alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow" />
                ) : (
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white text-2xl font-bold border-2 border-white shadow">👤</span>
                )}
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-white text-lg font-semibold" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/signup" className="text-white text-lg font-semibold" onClick={() => setMenuOpen(false)}>Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

// Tailwind classes used inline in JSX above
