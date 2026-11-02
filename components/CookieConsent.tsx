import { useEffect, useState } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'alifujala-cookie-consent-v1'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const value = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null
      if (!value) setVisible(true)
    } catch {
      // storage disabled; keep hidden to avoid blocking content
    }
  }, [])

  const persist = (choice: 'accepted' | 'declined') => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, at: Date.now() }))
    } catch {
      // ignore
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-[400] px-3 pb-3 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border-2 border-white/60 bg-white/95 p-4 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-gray-900/95 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p
            className="text-sm leading-relaxed text-gray-700 dark:text-gray-200"
            style={{ fontFamily: "'Comic Neue', cursive" }}
          >
            Alif Ujala uses cookies to make the site work, understand how it is used, and show
            relevant ads through Google AdSense and partners.{' '}
            <Link
              href="/privacy"
              className="font-bold text-indigo-600 underline hover:text-indigo-500 dark:text-indigo-300"
            >
              Learn more
            </Link>
            .
          </p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => persist('declined')}
              className="rounded-full border-2 border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              style={{ fontFamily: "'Comic Neue', cursive" }}
            >
              Decline
            </button>
            <button
              type="button"
              onClick={() => persist('accepted')}
              className="rounded-full border-2 border-white bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2 text-sm font-bold text-white shadow transition hover:scale-105"
              style={{ fontFamily: "'Comic Neue', cursive" }}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
