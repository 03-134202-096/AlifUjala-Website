import React from 'react'

type Variant = 'glass' | 'solid' | 'gradient' | 'outline'
type Tone = 'purple' | 'green' | 'pink' | 'blue' | 'amber' | 'indigo'

const TONE_RING: Record<Tone, string> = {
  purple: 'border-purple-200 dark:border-purple-800/50',
  green:  'border-green-200 dark:border-green-800/50',
  pink:   'border-pink-200 dark:border-pink-800/50',
  blue:   'border-blue-200 dark:border-blue-800/50',
  amber:  'border-amber-200 dark:border-amber-800/50',
  indigo: 'border-indigo-200 dark:border-indigo-800/50',
}

const TONE_GRADIENT: Record<Tone, string> = {
  purple: 'from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30',
  green:  'from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30',
  pink:   'from-pink-50 to-rose-50 dark:from-pink-900/30 dark:to-rose-900/30',
  blue:   'from-blue-50 to-sky-50 dark:from-blue-900/30 dark:to-sky-900/30',
  amber:  'from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30',
  indigo: 'from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30',
}

export interface KidsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant
  tone?: Tone
  hoverable?: boolean
  padding?: 'sm' | 'md' | 'lg' | 'none'
  children: React.ReactNode
}

const PAD = { sm: 'p-3 sm:p-4', md: 'p-4 sm:p-6', lg: 'p-6 sm:p-8', none: '' }

export default function KidsCard({
  variant = 'solid',
  tone = 'purple',
  hoverable = true,
  padding = 'md',
  className = '',
  children,
  ...rest
}: KidsCardProps) {
  const base = 'rounded-3xl border-2 sm:border-[3px] shadow-candy transition-all duration-300'
  const hover = hoverable ? 'hover-lift hover:shadow-candy-lg' : ''
  const variantCls =
    variant === 'glass'
      ? `glass-card ${TONE_RING[tone]}`
      : variant === 'gradient'
      ? `bg-gradient-to-br ${TONE_GRADIENT[tone]} ${TONE_RING[tone]}`
      : variant === 'outline'
      ? `bg-transparent ${TONE_RING[tone]}`
      : `bg-white/95 dark:bg-gray-900/[0.85] ${TONE_RING[tone]}`

  return (
    <div className={`${base} ${variantCls} ${hover} ${PAD[padding]} ${className}`} {...rest}>
      {children}
    </div>
  )
}
