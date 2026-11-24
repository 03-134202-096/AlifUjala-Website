import React from 'react'

/**
 * Show / hide the English translation on Urdu-first pages.
 * The English is always in the page (only visually hidden), so it loads
 * instantly and stays readable by search engines and screen readers once
 * it is switched on.
 */
export default function TranslationToggle({
  shown,
  onToggle,
  className = '',
}: {
  shown: boolean
  onToggle: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      dir="ltr"
      onClick={onToggle}
      aria-pressed={shown}
      className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-bold shadow-sm transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 ${
        shown
          ? 'border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700'
          : 'border-indigo-300 bg-white text-indigo-700 hover:bg-indigo-50 dark:border-indigo-500 dark:bg-gray-800 dark:text-indigo-200 dark:hover:bg-gray-700'
      } ${className}`}
      style={{ fontFamily: "'Comic Neue', cursive" }}
    >
      <span
        aria-hidden="true"
        className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-black ${shown ? 'bg-white text-indigo-700' : 'bg-indigo-600 text-white'}`}
      >
        EN
      </span>
      {shown ? 'Hide English translation' : 'Show English translation'}
    </button>
  )
}
