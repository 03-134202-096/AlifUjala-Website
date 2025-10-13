import Link from 'next/link'
import React from 'react'

type Props = {
  color?: string
  href?: string
  img?: string
  cta?: string
}

export default function GameCard({ color = 'yellow', href = '#', img = '/images/placeholder-animal.png', cta }: Props) {
  const colorClass = color === 'yellow' ? 'bg-yellow-300' : color === 'pink' ? 'bg-pink-300' : 'bg-green-300'
  return (
    <Link href={href} className={`${colorClass} rounded-2xl p-0 shadow-lg min-h-[240px] relative overflow-hidden flex items-center justify-center border-4 border-white/40`}>
      <img src={img} alt="game" className="absolute inset-0 w-full h-full object-cover" />
      {/* decorative pill removed to avoid the small white dot appearing on the card */}
    </Link>
  )
}
