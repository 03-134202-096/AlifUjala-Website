"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import LoadingIndicator from "./LoadingIndicator"

type User = { id: number | string; username?: string; email?: string; profileImgId?: number } | null

export default function Navbar({ className = "", toggleTheme: externalToggle, isDark: externalDark }: { className?: string; toggleTheme?: () => void; isDark?: boolean } = {}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggleTheme = () => {
    if (externalToggle) {
      externalToggle()
      setIsDark(!isDark)
      return
    }
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  const profileImages = [
    { id: 0, src: "/images/Kids/Female.webp", label: "Female" },
    { id: 1, src: "/images/Kids/Male.webp", label: "Male" },
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

  const navLinks = [
    { href: "/activity", label: "Activities" },
    { href: "/games", label: "Games" },
    { href: "/edu-videos", label: "Edu Videos" },
    { href: "/stories", label: "Stories" },
    { href: "/our-app", label: "Our App" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
  ]

  return (
    <nav className={className || "relative text-white shadow-lg"} style={{ zIndex: 70, background: 'var(--navbar-bg)' }}>
      {/* Decorative dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1 left-8 w-8 h-8 rounded-full bg-white/10 animate-float" />
        <div className="absolute -bottom-2 right-24 w-6 h-6 rounded-full bg-purple-200/20 animate-float-delay" />
        <div className="absolute top-2 right-44 text-base animate-bounce-slow opacity-40 hidden lg:block">⭐</div>
      </div>

      <div className="max-w-6xl mx-auto relative flex items-center px-4 sm:px-6 py-2 sm:py-3">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 z-10">
          <Link href="/" className="mr-2 sm:mr-3 transition-transform duration-300 hover:scale-110">
            <img src="/images/logo.png" alt="Alif Ujala Logo" className="h-10 w-10 sm:h-12 sm:w-12 object-contain" style={{mixBlendMode:'multiply'}} />
          </Link>
          <Link href="/" className="font-bold text-lg sm:text-xl" style={{fontFamily: "'Fredoka One', 'Bubblegum Sans', cursive", textShadow: '2px 2px 4px rgba(0,0,0,0.15)'}}>
            Alif Ujala
          </Link>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2 mx-auto z-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white text-base font-bold px-3 lg:px-4 py-2 rounded-full transition-all duration-300 hover:bg-white/25 hover:scale-105"
              style={{fontFamily: "'Baloo 2', 'Comic Neue', cursive"}}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <Link href="/profile" className="text-white text-base font-bold px-3 lg:px-4 py-2 rounded-full transition-all duration-300 hover:bg-white/25 hover:scale-105" style={{fontFamily: "'Baloo 2', 'Comic Neue', cursive"}}>
              Profile
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-white text-base font-bold px-3 lg:px-4 py-2 rounded-full transition-all duration-300 hover:bg-white/25 hover:scale-105" style={{fontFamily: "'Baloo 2', 'Comic Neue', cursive"}}>
                Login
              </Link>
              <Link href="/signup" className="bg-white/25 text-white text-base font-bold px-4 py-2 rounded-full transition-all duration-300 hover:bg-white/40 hover:scale-105 border-2 border-white/50" style={{fontFamily: "'Baloo 2', 'Comic Neue', cursive"}}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Desktop profile & dark mode toggle */}
        <div className="hidden md:flex items-center gap-3 z-10">
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-all duration-300 hover:scale-110 border border-white/20"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light Mode' : 'Dark Mode'}
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
          {loading ? (
            <LoadingIndicator size={36} message="" orientation="horizontal" className="gap-0" />
          ) : user ? (
            <Link href="/profile" className="transition-transform duration-300 hover:scale-110 hover:rotate-6">
              {typeof user.profileImgId === 'number' && profileImages[user.profileImgId] ? (
                <img src={profileImages[user.profileImgId].src} alt="Profile" className="w-10 h-10 rounded-full object-cover border-[3px] border-white shadow-lg" />
              ) : (
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 text-white text-2xl font-bold border-[3px] border-white shadow-lg">👤</span>
              )}
            </Link>
          ) : null}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-12 h-12 rounded-full bg-white/20 focus:outline-none ml-auto z-10 transition-transform duration-300 hover:scale-110 active:scale-95"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={`block w-6 h-0.5 rounded-full bg-white mb-1.5 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 rounded-full bg-white mb-1.5 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 rounded-full bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full h-full bg-black/40 z-[200] transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuOpen(false)}
      >
        <div
          className="absolute top-0 right-0 w-4/5 max-w-xs h-full shadow-2xl flex flex-col pt-6 px-5 gap-2 animate-slidein"
          style={{ background: 'var(--navbar-bg)' }}
          onClick={e => e.stopPropagation()}
        >
          <button onClick={() => setMenuOpen(false)} className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold hover:bg-white/30 transition-all">
            ✕
          </button>

          {/* Profile */}
          <div className="flex flex-col items-center justify-center mb-4 mt-6">
            {loading ? (
              <LoadingIndicator size={36} message="" orientation="horizontal" className="gap-0" />
            ) : user ? (
              <Link href="/profile" onClick={() => setMenuOpen(false)}>
                {typeof user.profileImgId === 'number' && profileImages[user.profileImgId] ? (
                  <img src={profileImages[user.profileImgId].src} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg" />
                ) : (
                  <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/30 text-white text-4xl font-bold border-4 border-white shadow-lg">👤</span>
                )}
              </Link>
            ) : (
              <Link href="/" onClick={() => setMenuOpen(false)}>
                <img src="/images/logo.png" alt="Alif Ujala" className="w-20 h-20 rounded-full object-cover border-4 border-white/50 shadow-lg bg-white/20" />
              </Link>
            )}
            {user && <p className="mt-2 text-white font-bold text-lg" style={{fontFamily: "'Bubblegum Sans', cursive"}}>{user.username || 'Friend'}</p>}
          </div>

          <div className="h-0.5 rounded-full bg-white/20 mx-4 mb-2" />

          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-white text-lg font-bold py-3 px-4 rounded-2xl hover:bg-white/20 transition-all" style={{fontFamily: "'Comic Neue', cursive"}} onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}

          <div className="h-0.5 rounded-full bg-white/20 mx-4 my-1" />

          {user ? (
            <>
              <Link href="/profile" className="text-white text-lg font-bold py-3 px-4 rounded-2xl hover:bg-white/20 transition-all" style={{fontFamily: "'Comic Neue', cursive"}} onClick={() => setMenuOpen(false)}>
                Profile
              </Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="mt-2 bg-white/20 text-white px-4 py-3 rounded-2xl font-bold text-lg hover:bg-red-400/40 transition-all border-0" style={{fontFamily: "'Comic Neue', cursive"}}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-white text-lg font-bold py-3 px-4 rounded-2xl hover:bg-white/20 transition-all" style={{fontFamily: "'Comic Neue', cursive"}} onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link href="/signup" className="bg-white/25 text-white text-lg font-bold py-3 px-4 rounded-2xl border-2 border-white/50 hover:bg-white/35 transition-all text-center" style={{fontFamily: "'Comic Neue', cursive"}} onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}

          <div className="mt-auto pb-6 text-center space-y-3">
            {/* Mobile dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="mx-auto flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-white font-bold hover:bg-white/25 transition-all border border-white/20"
              style={{fontFamily: "'Comic Neue', cursive"}}
            >
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
            <p className="text-white/60 text-sm" style={{fontFamily: "'Comic Neue', cursive"}}>🌈 Let&apos;s Learn Urdu! 🌈</p>
          </div>
        </div>
      </div>
    </nav>
  )
}
