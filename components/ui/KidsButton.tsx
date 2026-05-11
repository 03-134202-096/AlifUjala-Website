import React from 'react'
import Link from 'next/link'

type Variant = 'primary' | 'secondary' | 'success' | 'warm' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg' | 'xl'

const VARIANT: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 text-white border-white/80 shadow-candy hover:shadow-glow-purple',
  secondary:
    'bg-gradient-to-r from-sky-400 to-cyan-400 text-white border-white/80 shadow-candy hover:shadow-glow-blue',
  success:
    'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-white/80 shadow-candy hover:shadow-glow-green',
  warm:
    'bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 text-white border-white/80 shadow-candy hover:shadow-glow-pink',
  ghost:
    'bg-white/15 text-white border-white/40 hover:bg-white/30 backdrop-blur',
  outline:
    'bg-transparent text-purple-700 dark:text-purple-300 border-purple-400 dark:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/30',
}

const SIZE: Record<Size, string> = {
  sm: 'text-sm px-4 py-1.5',
  md: 'text-base px-5 py-2.5',
  lg: 'text-lg px-7 py-3',
  xl: 'text-xl px-9 py-4',
}

type CommonProps = {
  variant?: Variant
  size?: Size
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  fullWidth?: boolean
  className?: string
  children: React.ReactNode
}

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & {
    href?: undefined
  }

type LinkProps = CommonProps & {
  href: string
  external?: boolean
  ariaLabel?: string
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 font-bold rounded-full border-[3px] transition-all duration-300 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0'

function buildClass(p: CommonProps) {
  const v = VARIANT[p.variant ?? 'primary']
  const s = SIZE[p.size ?? 'md']
  const fw = p.fullWidth ? 'w-full' : ''
  return `${baseClasses} ${v} ${s} ${fw} ${p.className ?? ''}`
}

export default function KidsButton(props: ButtonProps | LinkProps) {
  const { iconLeft, iconRight, children } = props
  const cls = buildClass(props)
  const inner = (
    <>
      {iconLeft && <span className="flex items-center">{iconLeft}</span>}
      <span style={{ fontFamily: "'Bubblegum Sans', cursive" }}>{children}</span>
      {iconRight && <span className="flex items-center">{iconRight}</span>}
    </>
  )

  if ('href' in props && props.href) {
    const linkProps = props as LinkProps
    if (linkProps.external) {
      return (
        <a href={linkProps.href} target="_blank" rel="noopener noreferrer" className={cls} aria-label={linkProps.ariaLabel}>
          {inner}
        </a>
      )
    }
    return (
      <Link href={linkProps.href} className={cls} aria-label={linkProps.ariaLabel}>
        {inner}
      </Link>
    )
  }

  const { variant, size, iconLeft: _il, iconRight: _ir, fullWidth, className, children: _c, ...rest } = props as ButtonProps
  return (
    <button className={cls} {...rest}>
      {inner}
    </button>
  )
}
