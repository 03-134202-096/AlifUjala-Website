import React from 'react'
import { IconBadge, type LearningIconName } from './LearningIcon'

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
  icon?: LearningIconName
  tone?: Tone
  align?: 'left' | 'center'
  className?: string
  /** Heading level. Use 'h1' for the main heading of a page (one per page). */
  as?: 'h1' | 'h2'
  /** id for the heading, e.g. for aria-labelledby on the surrounding section */
  id?: string
  /** Urdu-first heading: the Urdu line becomes the large headline and `title` its smaller English line */
  urduTitle?: React.ReactNode
  /** Urdu subtitle, shown above the (then smaller) English subtitle */
  urduSubtitle?: React.ReactNode
  /** Visually hide the English subtitle, e.g. until the reader asks for the translation */
  subtitleHidden?: boolean
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  icon,
  tone = 'rainbow',
  align = 'center',
  className = '',
  as: Heading = 'h2',
  id,
  urduTitle,
  urduSubtitle,
  subtitleHidden = false,
}: SectionHeaderProps) {
  const alignCls = align === 'center' ? 'text-center mx-auto' : 'text-left'
  return (
    <div className={`max-w-3xl mb-8 ${alignCls} ${className}`}>
      {icon && (
        <div className="mb-4">
          <IconBadge name={icon} size="hero" />
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
      {urduTitle ? (
        <Heading id={id}>
          <span
            lang="ur"
            dir="rtl"
            className={`block text-4xl sm:text-5xl md:text-6xl ${TONE_CLASS[tone]}`}
            style={{ lineHeight: 2 }}
          >
            {urduTitle}
          </span>
          <span
            className="block text-xl sm:text-2xl font-bold leading-tight text-gray-500 dark:text-gray-400"
            style={{ fontFamily: "'Bubblegum Sans', cursive" }}
          >
            {title}
          </span>
        </Heading>
      ) : (
        <Heading
          id={id}
          className={`text-3xl sm:text-4xl md:text-5xl font-bold leading-tight ${TONE_CLASS[tone]}`}
          style={{ fontFamily: "'Bubblegum Sans', cursive" }}
        >
          {title}
        </Heading>
      )}
      {urduSubtitle && (
        <p
          lang="ur"
          dir="rtl"
          className="mt-3 text-lg sm:text-xl text-gray-700 dark:text-gray-200 max-w-2xl [text-wrap:balance]"
          style={{ lineHeight: 2.1, marginInline: align === 'center' ? 'auto' : undefined }}
        >
          {urduSubtitle}
        </p>
      )}
      {subtitle && (
        <p
          className={
            subtitleHidden
              ? 'hidden'
              : `${urduSubtitle ? 'mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400' : 'mt-3 text-base sm:text-lg text-gray-600 dark:text-gray-300'} font-bold max-w-2xl`
          }
          style={{ fontFamily: "'Comic Neue', cursive", marginInline: align === 'center' ? 'auto' : undefined }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
