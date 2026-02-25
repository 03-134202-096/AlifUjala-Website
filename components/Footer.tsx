import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-indigo-700 via-purple-600 to-violet-600 text-white pt-10 pb-6 mt-0" style={{borderRadius: '2rem 2rem 0 0'}}>
      {/* Subtle top glow */}
      <div className="absolute -top-px left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-300/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Top section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-bold mb-2" style={{fontFamily: "'Bubblegum Sans', cursive"}}>
              Alif Ujala
            </h3>
            <p className="text-white/70 text-sm leading-relaxed" style={{fontFamily: "'Comic Neue', cursive"}}>
              Making Urdu learning fun &amp; engaging for little ones!
            </p>
          </div>

          {/* Quick links */}
          <div className="text-center">
            <h4 className="font-bold text-lg mb-3" style={{fontFamily: "'Comic Neue', cursive"}}>Quick Links</h4>
            <div className="flex flex-col gap-1.5">
              <Link href="/activity" className="text-white/75 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block" style={{fontFamily: "'Comic Neue', cursive"}}>Activities</Link>
              <Link href="/games" className="text-white/75 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block" style={{fontFamily: "'Comic Neue', cursive"}}>Games</Link>
              <Link href="/blog" className="text-white/75 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block" style={{fontFamily: "'Comic Neue', cursive"}}>Blog</Link>
              <Link href="/stories" className="text-white/75 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block" style={{fontFamily: "'Comic Neue', cursive"}}>Stories</Link>
              <Link href="/about" className="text-white/75 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block" style={{fontFamily: "'Comic Neue', cursive"}}>About Us</Link>
            </div>
          </div>

          {/* Social / Follow Us */}
          <div className="text-center sm:text-right">
            <h4 className="font-bold text-lg mb-3" style={{fontFamily: "'Comic Neue', cursive"}}>Follow Us</h4>
            <div className="flex gap-4 justify-center sm:justify-end">
              {/* Instagram */}
              <a href="https://www.instagram.com/alifujala.ai/" target="_blank" rel="noopener noreferrer" className="social-icon group" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              {/* Facebook */}
              <a href="https://www.facebook.com/profile.php?id=61579001649615" target="_blank" rel="noopener noreferrer" className="social-icon group" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              {/* Email */}
              <a href="mailto:aiearlyedge@gmail.com" className="social-icon group" aria-label="Email">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </a>
              {/* YouTube / Play */}
              <a href="https://play.google.com/store/apps/details?id=com.AlifUjala" target="_blank" rel="noopener noreferrer" className="social-icon group" aria-label="Google Play">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {}
        <div className="h-px bg-white/15 mb-4" />

        {/* Copyright */}
        <div className="text-center">
          <p className="text-white/60 text-sm" style={{fontFamily: "'Comic Neue', cursive"}}>
            © {new Date().getFullYear()} AlifUjala — Made with 💖 for kids who love to learn!
          </p>
        </div>
      </div>
    </footer>
  )
}
