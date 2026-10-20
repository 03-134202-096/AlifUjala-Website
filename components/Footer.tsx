import React from 'react'
import Link from 'next/link'

type FooterLink = {
  href: string
  label: string
  external?: boolean
}

export default function Footer() {
  const footerSections: { title: string; links: FooterLink[] }[] = [
    {
      title: 'Explore',
      links: [
        { href: '/', label: 'Home' },
        { href: '/activity', label: 'Activities' },
        { href: '/games', label: 'Games Hub' },
        { href: '/edu-videos', label: 'Edu Videos' },
        { href: '/our-app', label: 'Our App' },
        { href: '/stories', label: 'Stories' },
        { href: '/blog', label: 'Blog' },
        { href: '/about', label: 'About Us' },
      ],
    },
    {
      title: 'Popular Games',
      links: [
        { href: '/games/matching', label: 'Letter Matching' },
        { href: '/games/alphabetMatch', label: 'Alphabet Match' },
        { href: '/games/memoryMatch', label: 'Memory Match' },
        { href: '/games/urduHunter', label: 'Urdu Hunter' },
        { href: '/games/urduBasketCatch', label: 'Basket Catch' },
        { href: '/edu-videos', label: 'Story Videos' },
      ],
    },
    {
      title: 'Account & School',
      links: [
        { href: '/login', label: 'Login' },
        { href: '/signup', label: 'Sign Up' },
        { href: '/profile', label: 'Profile' },
        { href: '/students', label: 'Students' },
        { href: '/administration', label: 'Administration' },
        { href: 'mailto:aiearlyedge@gmail.com', label: 'Contact Email', external: true },
      ],
    },
  ]

  return (
    <footer
      className="relative mt-0 overflow-hidden text-white"
      style={{ background: 'var(--footer-bg)' }}
    >
      <div className="wave-divider absolute -top-px left-0 right-0 -translate-y-full pointer-events-none">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path
            d="M0,48 C240,96 480,0 720,32 C960,64 1200,16 1440,48 L1440,80 L0,80 Z"
            fill="var(--footer-bg-fill, #6d28d9)"
            opacity="0.95"
          />
        </svg>
      </div>
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-rainbow-gradient bg-[length:200%_100%] animate-gradient-x opacity-90 pointer-events-none" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-indigo-200/10 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2 text-center lg:text-left">
            <Link href="/" className="inline-block text-3xl font-bold tracking-wide" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              Alif Ujala
            </Link>
            <p className="mt-3 text-white/80 text-sm leading-relaxed max-w-md mx-auto lg:mx-0" style={{ fontFamily: "'Comic Neue', cursive" }}>
              A playful Urdu learning platform with activities, stories, and interactive games designed for children.
            </p>

            <div className="mt-5 space-y-2 text-sm" style={{ fontFamily: "'Comic Neue', cursive" }}>
              <p className="text-white/70">Need help? Reach us anytime.</p>
              <a href="mailto:aiearlyedge@gmail.com" className="inline-flex text-white/90 hover:text-white transition-colors">
                aiearlyedge@gmail.com
              </a>
            </div>

            <a
              href="https://play.google.com/store/apps/details?id=com.aiearlyedge.alifujala"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 rounded-full border border-white/30 bg-white/[0.15] px-4 py-2 text-sm font-bold text-white hover:bg-white/25 transition-all hover:-translate-y-0.5"
              style={{ fontFamily: "'Comic Neue', cursive" }}
            >
              <span>Get the App on Google Play</span>
              <span aria-hidden="true">↗</span>
            </a>

            <div className="mt-6">
              <h3 className="font-bold text-lg mb-3" style={{ fontFamily: "'Comic Neue', cursive" }}>
                Follow Us
              </h3>
              <div className="flex gap-3 justify-center lg:justify-start">
                <a href="https://www.instagram.com/alifujala.ai/" target="_blank" rel="noopener noreferrer" className="social-icon group" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a href="https://www.facebook.com/profile.php?id=61579001649615" target="_blank" rel="noopener noreferrer" className="social-icon group" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href="mailto:aiearlyedge@gmail.com" className="social-icon group" aria-label="Email">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </a>
                <a href="https://www.youtube.com/@alifujala" target="_blank" rel="noopener noreferrer" className="social-icon group" aria-label="YouTube">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="3" ry="3" />
                    <polygon points="10 9 16 12 10 15 10 9" />
                  </svg>
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.aiearlyedge.alifujala" target="_blank" rel="noopener noreferrer" className="social-icon group" aria-label="Google Play">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8 text-center sm:text-left">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-bold text-lg mb-3" style={{ fontFamily: "'Comic Neue', cursive" }}>
                  {section.title}
                </h3>
                <div className="flex flex-col gap-2">
                  {section.links.map((link) =>
                    link.external ? (
                      <a
                        key={link.href}
                        href={link.href}
                        className="text-white/75 hover:text-white transition-all text-sm hover:translate-x-1 inline-block"
                        style={{ fontFamily: "'Comic Neue', cursive" }}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-white/75 hover:text-white transition-all text-sm hover:translate-x-1 inline-block"
                        style={{ fontFamily: "'Comic Neue', cursive" }}
                      >
                        {link.label}
                      </Link>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 h-px bg-white/20" />

        <div className="pt-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-center md:text-left">
          <p className="text-white/[0.65] text-sm" style={{ fontFamily: "'Comic Neue', cursive" }}>
            © {new Date().getFullYear()} AIEarlyEdge. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-4 gap-y-1 text-sm text-white/75" style={{ fontFamily: "'Comic Neue', cursive" }}>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/stories" className="hover:text-white transition-colors">Stories</Link>
            <Link href="/games" className="hover:text-white transition-colors">Games</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
