import React from 'react'

type Tone = 'rainbow' | 'warm' | 'cool' | 'purple' | 'green' | 'pink'

const TONE_CLASS: Record<Tone, string> = {
  rainbow: 'text-gradient',
  warm:    'text-gradient-warm',
  cool:    'text-gradient-cool',
  purple:  'text-purple-700 dark:text-purple-300',
  green:   'text-emerald-600 dark:text-emerald-400',
  pink:    'text-pink-600 dark:text-pink-400',
}

export interface SectionHeaderProps {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  subtitle?: React.ReactNode
  emoji?: string
  tone?: Tone
  align?: 'left' | 'center'
  className?: string
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  emoji,
  tone = 'rainbow',
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  const alignCls = align === 'center' ? 'text-center mx-auto' : 'text-left'
  return (
    <div className={`max-w-3xl mb-8 ${alignCls} ${className}`}>
      {emoji && (
        <div
          className={`text-5xl sm:text-6xl mb-3 animate-bounce-slow ${align === 'center' ? '' : 'inline-block'}`}
          aria-hidden="true"
        >
          {emoji}
        </div>
      )}
      {eyebrow && (
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-200 text-xs font-bold uppercase tracking-wider mb-3 border border-purple-200 dark:border-purple-700/50"
          style={{ fontFamily: "'Comic Neue', cursive" }}
        >
          {eyebrow}
        </div>
      )}
      <h2
        className={`text-3xl sm:text-4xl md:text-5xl font-bold leading-tight ${TONE_CLASS[tone]}`}
        style={{ fontFamily: "'Bubblegum Sans', cursive" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="mt-3 text-base sm:text-lg text-gray-600 dark:text-gray-300 font-bold max-w-2xl"
          style={{ fontFamily: "'Comic Neue', cursive", marginInline: align === 'center' ? 'auto' : undefined }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
