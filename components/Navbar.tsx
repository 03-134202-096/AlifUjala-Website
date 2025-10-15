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
      <div className="max-w-6xl mx-auto relative flex items-center px-6 py-3">
        {/* Logo absolute left */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center flex-shrink-0">
          <Link href="/" className="mr-3">
            <img src="/images/Logo.jpg" alt="Alif Ujala Logo" className="h-10 w-10 rounded-full object-cover border-2 border-white shadow" />
          </Link>
          <Link href="/" className="font-bold text-lg">Alif Ujala</Link>
        </div>

        {/* Centered menu links */}
        <div className="hidden sm:flex items-center gap-6 mx-auto">
          <Link href="/" className="text-white text-base transition duration-200 hover:text-yellow-300 hover:font-bold hover:drop-shadow-lg">Home</Link>
          <Link href="/games" className="text-white text-base transition duration-200 hover:text-yellow-300 hover:font-bold hover:drop-shadow-lg">Games</Link>
          <Link href="/stories" className="text-white text-base transition duration-200 hover:text-yellow-300 hover:font-bold hover:drop-shadow-lg">Stories</Link>
          <Link href="/about" className="text-white text-base transition duration-200 hover:text-yellow-300 hover:font-bold hover:drop-shadow-lg">About</Link>
          {user ? (
            <Link href="/profile" className="text-white text-base transition duration-200 hover:text-yellow-300 hover:font-bold hover:drop-shadow-lg">Profile</Link>
          ) : (
            <>
              <Link href="/login" className="text-white transition duration-200 hover:text-yellow-300 hover:font-bold hover:drop-shadow-lg">Login</Link>
              <Link href="/signup" className="text-white transition duration-200 hover:text-yellow-300 hover:font-bold hover:drop-shadow-lg">Signup</Link>
            </>
          )}
        </div>

        {/* Profile image and logout absolute right */}
        <div className="hidden sm:flex items-center gap-4 absolute right-0 top-1/2 -translate-y-1/2">
          {loading ? (
            <LoadingIndicator
              size={36}
              message=""
              orientation="horizontal"
              className="gap-0"
            />
          ) : user ? (
            <>
              <button onClick={handleLogout} className="bg-red-600 text-white px-3 py-1 rounded transition duration-200 hover:bg-red-400 hover:drop-shadow-lg">Logout</button>
              <Link href="/profile" className="ml-2">
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
          ) : null}
        </div>

        {/* Hamburger for mobile */}
        <button
          className="sm:hidden flex flex-col justify-center items-center w-10 h-10 rounded focus:outline-none group ml-auto"
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
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`sm:hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuOpen(false)}
      >
        <div
          className="absolute top-0 right-0 w-3/4 max-w-xs h-full bg-purple-900 shadow-lg flex flex-col pt-8 px-6 gap-6 animate-slidein"
          onClick={e => e.stopPropagation()}
        >
          {/* Profile image centered at top */}
          <div className="flex flex-col items-center justify-center mb-4">
            {loading ? (
              <LoadingIndicator size={36} message="" orientation="horizontal" className="gap-0" />
            ) : user ? (
              <Link href="/profile">
                {typeof user.profileImgId === 'number' && profileImages[user.profileImgId] ? (
                  <img src={profileImages[user.profileImgId].src} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow" />
                ) : (
                  <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white text-3xl font-bold border-2 border-white shadow">👤</span>
                )}
              </Link>
            ) : null}
          </div>
          {/* Navigation links */}
          <Link href="/" className="text-white text-lg font-semibold" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/games" className="text-white text-lg font-semibold" onClick={() => setMenuOpen(false)}>Games</Link>
          <Link href="/stories" className="text-white text-lg font-semibold" onClick={() => setMenuOpen(false)}>Stories</Link>
          <Link href="/about" className="text-white text-lg font-semibold" onClick={() => setMenuOpen(false)}>About</Link>
          {user ? (
            <>
              <Link href="/profile" className="text-white text-lg font-semibold" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="bg-red-600 text-white px-3 py-1 rounded">Logout</button>
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
