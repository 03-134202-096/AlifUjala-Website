import Link from 'next/link'
import React from 'react'

type Props = {
  color?: string
  href?: string
  img?: string
  cta?: string
}

export default function GameCard({ color = 'yellow', href = '#', img = '/images/placeholder-animal.webp', cta }: Props) {
  const colorClass = color === 'yellow' 
    ? 'bg-gradient-to-br from-amber-100 to-orange-100' 
    : color === 'pink' 
    ? 'bg-gradient-to-br from-purple-100 to-violet-100' 
    : color === 'blue'
    ? 'bg-gradient-to-br from-indigo-100 to-blue-100'
    : 'bg-gradient-to-br from-emerald-100 to-teal-100';
  
  return (
    <Link href={href} className={`group ${colorClass} rounded-3xl p-3 shadow-lg min-h-[240px] relative overflow-hidden flex items-center justify-center border-2 border-purple-200/50 dark:border-purple-500/30 transition-all duration-300 hover:scale-105 hover:-rotate-1 hover:shadow-xl`}>
      <img src={img} alt="game" className="w-full h-full object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105" style={{ maxHeight: '220px' }} />
      {/* Hover play overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-indigo-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
        <span className="bg-white/90 text-indigo-700 font-bold px-6 py-2 rounded-full text-lg shadow-lg" style={{fontFamily: "'Bubblegum Sans', cursive"}}>
          ▶ Play!
        </span>
      </div>
    </Link>
  )
}
