import Link from 'next/link'
import React from 'react'

type Props = {
  color?: string
  href?: string
  img?: string
}

export default function GameCard({ color = 'yellow', href = '#', img = '/images/placeholder-animal.png' }: Props) {
  const colorClass = color === 'yellow' ? 'bg-yellow-300' : color === 'pink' ? 'bg-pink-300' : 'bg-green-300'
  return (
    <Link href={href} className={`${colorClass} rounded-2xl p-6 shadow-lg min-h-[240px] flex items-center justify-center`}>
      <img src={img} alt="game" className="w-36 h-44 object-contain rounded-lg bg-white shadow-inner" />
    </Link>
  )
}
